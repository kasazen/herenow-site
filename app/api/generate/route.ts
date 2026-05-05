// POST /api/generate — Next.js App Router route handler, SSE response.
// Accepts { url, prompting? }, scrapes the business across the root URL
// + a few in-domain pages, then runs research and memo generation
// concurrently. Streams progress, observations, and section starts to
// the client throughout. A "no-silence" injector pulls phase-appropriate
// filler from the observation bank if no organic event has fired in
// >2.5s, keeping the modal's learning queue populated end-to-end.

import { generateMemoStreaming, type StreamEvent } from "@/lib/anthropic";
import { researchBusiness } from "@/lib/research";
import { scrapeBusiness, ScrapeError, type Pages } from "@/lib/scrape";
import { storeMemo, checkAndIncrementIp, type StoredMemo } from "@/lib/storage";
import { ObservationBank, type Phase } from "@/lib/observations";

export const runtime = "nodejs";
export const maxDuration = 300;

const IP_LIMIT_PER_HOUR = 8;

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "86400",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(request: Request): Promise<Response> {
  // ── Pre-stream validation (still JSON responses) ─────────────────────

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";

  try {
    const rate = await checkAndIncrementIp(ip, IP_LIMIT_PER_HOUR);
    if (!rate.allowed) {
      return jsonError(429, { error: "rate_limited", message: "Try again in a bit." });
    }
  } catch (err) {
    console.error("kv_rate_limit_failed", err);
    return jsonError(503, {
      error: "kv_unavailable",
      message: "Our storage isn't reachable right now. Try again in a moment.",
    });
  }

  let body: { url?: string; prompting?: string } | null = null;
  try {
    body = (await request.json()) as { url?: string; prompting?: string };
  } catch {
    return jsonError(400, { error: "invalid_json" });
  }

  const urlInput = (body?.url ?? "").trim();
  const prompting = (body?.prompting ?? "").trim();
  if (!urlInput) {
    return jsonError(400, { error: "url_required", message: "Add the URL of your business." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonError(503, { error: "not_configured", message: "The tool isn't quite live yet." });
  }

  // ── Begin SSE stream ─────────────────────────────────────────────────

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const safeEnqueue = (chunk: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          closed = true;
        }
      };
      const safeClose = () => {
        if (closed) return;
        closed = true;
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      const writeEvent = (event: string, data: unknown) => {
        safeEnqueue(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      };

      const heartbeat = setInterval(() => safeEnqueue(": ping\n\n"), 5000);

      const obsBank = new ObservationBank();
      let lastEmitAt = Date.now();
      let currentPhase: Phase = "scrape";

      const emit = (event: string, data: unknown) => {
        writeEvent(event, data);
        lastEmitAt = Date.now();
        if (event === "observation") {
          const text = (data as { text?: string }).text;
          if (text) obsBank.markUsed(text);
        }
      };

      const silenceTicker = setInterval(() => {
        if (Date.now() - lastEmitAt > 2500) {
          const fill = obsBank.next(currentPhase);
          if (fill) emit("observation", { text: fill });
        }
      }, 800);

      try {
        // ── Phase 1: Scrape ─────────────────────────────────────────────
        currentPhase = "scrape";
        let pages: Pages;
        try {
          pages = await scrapeBusiness(urlInput, (p) => {
            if (p.type === "primary_start") {
              emit("progress", { text: `reading ${p.domain}` });
            } else if (p.type === "primary_read") {
              const learning = pageLearning("home page", p.title, p.description, p.words);
              if (learning) emit("observation", { text: learning });
            } else if (p.type === "secondary_start") {
              emit("progress", { text: `reading ${p.pathname}` });
            } else if (p.type === "secondary_read") {
              const learning = pageLearning(p.pathname, p.title, "", p.words);
              if (learning) emit("observation", { text: learning });
            } else if (p.type === "complete") {
              emit("progress", { text: `read ${p.pageCount} pages · drafting` });
            }
          });
        } catch (err) {
          if (err instanceof ScrapeError) {
            emit("error", { code: err.reason, message: err.message });
            return;
          }
          console.error("scrape_unknown", err);
          emit("error", { code: "scrape_failed", message: "We had trouble reading that URL." });
          return;
        }

        if (!pages.primary.body || pages.primary.body.length < 80) {
          emit("error", {
            code: "thin_content",
            message:
              "We could load that URL but couldn't find enough text to read. Try a different page.",
          });
          return;
        }

        // ── Phase 2 + 3: Research and Memo, concurrently ────────────────
        currentPhase = "memo";

        const researchPromise = researchBusiness(apiKey, pages, prompting, (e) => {
          if (e.type === "search_query") {
            emit("progress", { text: `searching: ${e.query}` });
          } else if (e.type === "finding") {
            emit("observation", { text: e.text });
          }
        }).catch((err) => {
          console.error("research_swallowed", (err as Error)?.message?.slice(0, 200));
          return { findings: [] as string[] };
        });

        let memo;
        try {
          memo = await generateMemoStreaming(apiKey, pages, prompting, undefined, (e: StreamEvent) => {
            emit(e.type, e);
          });
        } catch (err) {
          const detail = (err as Error)?.message?.slice(0, 300) ?? "unknown";
          console.error("generate_failed", detail, (err as Error)?.stack?.slice(0, 600));
          emit("error", {
            code: "generation_failed",
            message: "We had trouble generating your read. Try again in a moment.",
            detail: process.env.NODE_ENV === "development" ? detail : undefined,
          });
          return;
        }

        researchPromise.catch(() => {});

        // ── Phase 4: Store ─────────────────────────────────────────────
        currentPhase = "wrapping";
        const id = globalThis.crypto?.randomUUID?.() ?? fallbackUuid();
        const stored: StoredMemo = {
          memo,
          intake: {
            url: pages.primary.url,
            domain: pages.domain,
            prompting: prompting || undefined,
          },
          createdAt: Date.now(),
        };
        try {
          await storeMemo(id, stored);
        } catch (err) {
          console.error("store_failed", err);
          emit("error", {
            code: "kv_unavailable",
            message: "We generated your read but couldn't save it. Try again in a moment.",
          });
          return;
        }

        const teaserSections = memo.sections.map((s) => ({
          index: s.index,
          title: s.title,
          body: s.index === 1 ? s.body : firstSentence(s.body),
          locked: s.index !== 1,
        }));
        const today = new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });

        emit("complete", {
          id,
          cover: {
            echo: memo.cover_echo,
            date: today,
            domain: pages.domain,
            businessName: memo.business_name || "",
          },
          sections: teaserSections,
        });
      } catch (err) {
        const msg = (err as Error)?.message?.slice(0, 400) ?? "unknown";
        console.error("generate_unhandled", msg, (err as Error)?.stack?.slice(0, 600));
        try {
          writeEvent("error", { message: msg });
        } catch {
          /* connection probably closed */
        }
      } finally {
        clearInterval(heartbeat);
        clearInterval(silenceTicker);
        safeClose();
      }
    },
  });

  return new Response(stream, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-store, no-transform",
      "x-accel-buffering": "no",
      connection: "keep-alive",
    },
  });
}

// ── Helpers ────────────────────────────────────────────────────────────

function jsonError(status: number, body: unknown): Response {
  return Response.json(body, { status, headers: CORS_HEADERS });
}

function pageLearning(
  label: string,
  title: string,
  description: string,
  words: number,
): string | null {
  const wc = formatWords(words);
  const cleanTitle = title?.replace(/\s+[|·\-—]\s+.*$/, "").trim().slice(0, 80);
  const cleanDesc = description?.trim().slice(0, 110);
  if (cleanTitle) {
    return `“${cleanTitle}”${wc ? ` · ${wc}` : ""}`;
  }
  if (cleanDesc) return cleanDesc;
  if (wc) return `${wc} on the ${label}`;
  return null;
}

function formatWords(n: number): string {
  if (!n) return "";
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k words`;
  return `${n} words`;
}

function firstSentence(body: string): string {
  const flat = body.replace(/\s+/g, " ").trim();
  const m = flat.match(/^(.+?[.!?])(\s|$)/);
  return m ? m[1] : flat.slice(0, 140) + "…";
}

function fallbackUuid(): string {
  const r = () => Math.random().toString(16).slice(2, 10);
  return `${r()}${r()}-${r()}-${r()}-${r()}-${r()}${r()}${r()}`;
}
