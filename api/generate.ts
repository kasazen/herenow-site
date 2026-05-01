// POST /api/generate — Vercel Node serverless function, SSE response.
// Accepts { url, prompting? }, scrapes the business across the root URL
// + a few in-domain pages, then runs research and memo generation
// concurrently. Streams progress, observations, and section starts to
// the client throughout. A "no-silence" injector pulls phase-appropriate
// filler from the observation bank if no organic event has fired in
// >2.5s, keeping the modal's learning queue populated end-to-end.

import type { VercelRequest, VercelResponse } from "@vercel/node";

import { generateMemoStreaming, type StreamEvent } from "./_lib/anthropic.js";
import { researchBusiness } from "./_lib/research.js";
import { scrapeBusiness, ScrapeError, type Pages } from "./_lib/scrape.js";
import { storeMemo, checkAndIncrementIp, type StoredMemo } from "./_lib/storage.js";
import { ObservationBank, type Phase } from "./_lib/observations.js";

const IP_LIMIT_PER_HOUR = 8;

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    await handleInner(req, res);
  } catch (err) {
    const msg = (err as Error)?.message?.slice(0, 400) ?? "unknown";
    console.error("generate_unhandled", msg, (err as Error)?.stack?.slice(0, 600));
    if (!res.headersSent) {
      res.status(500).json({ error: "unhandled", message: `Server error: ${msg}` });
      return;
    }
    try {
      writeEvent(res, "error", { message: msg });
      res.end();
    } catch {
      /* connection probably closed */
    }
  }
}

async function handleInner(req: VercelRequest, res: VercelResponse): Promise<void> {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  // ── Pre-stream validation (still JSON responses) ─────────────────────

  const ip = (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0].trim() ?? "unknown";
  try {
    const rate = await checkAndIncrementIp(ip, IP_LIMIT_PER_HOUR);
    if (!rate.allowed) {
      res.status(429).json({ error: "rate_limited", message: "Try again in a bit." });
      return;
    }
  } catch (err) {
    console.error("kv_rate_limit_failed", err);
    res.status(503).json({ error: "kv_unavailable", message: "Our storage isn't reachable right now. Try again in a moment." });
    return;
  }

  const body = (typeof req.body === "string" ? safeParseJson(req.body) : req.body) as
    | { url?: string; prompting?: string }
    | null;
  if (!body) {
    res.status(400).json({ error: "invalid_json" });
    return;
  }
  const urlInput = (body.url ?? "").trim();
  const prompting = (body.prompting ?? "").trim();
  if (!urlInput) {
    res.status(400).json({ error: "url_required", message: "Add the URL of your business." });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "not_configured", message: "The tool isn't quite live yet." });
    return;
  }

  // ── Begin SSE stream ─────────────────────────────────────────────────

  res.setHeader("content-type", "text/event-stream; charset=utf-8");
  res.setHeader("cache-control", "no-store, no-transform");
  res.setHeader("x-accel-buffering", "no");
  res.setHeader("connection", "keep-alive");
  res.flushHeaders?.();

  // Heartbeat keeps any intermediary from closing the connection during scrape.
  const heartbeat = setInterval(() => {
    try {
      res.write(": ping\n\n");
    } catch {
      /* connection closed */
    }
  }, 5000);

  // No-silence machinery: track when we last emitted a real event, and
  // pull a phase-appropriate observation from the bank when too much time
  // has passed without one.
  const obsBank = new ObservationBank();
  let lastEmitAt = Date.now();
  let currentPhase: Phase = "scrape";

  const emit = (event: string, data: unknown) => {
    writeEvent(res, event, data);
    lastEmitAt = Date.now();
    if (event === "observation") {
      const text = (data as { text?: string }).text;
      if (text) obsBank.markUsed(text);
    }
  };

  const silenceTicker = setInterval(() => {
    if (Date.now() - lastEmitAt > 2500) {
      const fill = obsBank.next(currentPhase);
      if (fill) {
        emit("observation", { text: fill });
      }
    }
  }, 800);

  try {
    // ── Phase 1: Scrape ─────────────────────────────────────────────────
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
        res.end();
        return;
      }
      console.error("scrape_unknown", err);
      emit("error", { code: "scrape_failed", message: "We had trouble reading that URL." });
      res.end();
      return;
    }

    if (!pages.primary.body || pages.primary.body.length < 80) {
      emit("error", {
        code: "thin_content",
        message: "We could load that URL but couldn't find enough text to read. Try a different page.",
      });
      res.end();
      return;
    }

    // ── Phase 2 + 3: Research and Memo, concurrently ────────────────────
    // Memo generates from scrape only. Research streams its findings to
    // the user as observations during the same window — they don't enrich
    // the memo body in this version, but they keep the modal alive.
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
      res.end();
      return;
    }

    // Don't block on research after memo completes — its events have already
    // streamed to the user. Suppress unhandled rejection if it's still pending.
    researchPromise.catch(() => {});

    // ── Phase 4: Store ─────────────────────────────────────────────────
    currentPhase = "wrapping";
    const id = (globalThis.crypto?.randomUUID?.() ?? fallbackUuid());
    const stored: StoredMemo = {
      memo,
      intake: { url: pages.primary.url, domain: pages.domain, prompting: prompting || undefined },
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
      res.end();
      return;
    }

    // Build the teaser shape (section 01 unlocked, 02-05 redacted to first sentence).
    const teaserSections = memo.sections.map((s) => ({
      index: s.index,
      title: s.title,
      body: s.index === 1 ? s.body : firstSentence(s.body),
      locked: s.index !== 1,
    }));
    const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

    // The cover surfaces the business name when available; the domain is kept
    // as a fallback for any client that needs it for display, but the modal
    // should prefer business_name (already streamed via its own event).
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
    res.end();
  } finally {
    clearInterval(heartbeat);
    clearInterval(silenceTicker);
  }
}

// ── SSE helpers ────────────────────────────────────────────────────────

function writeEvent(res: VercelResponse, event: string, data: unknown): void {
  const payload = JSON.stringify(data);
  res.write(`event: ${event}\ndata: ${payload}\n\n`);
}

// Compose a short, human-voiced learning line from page meta. Reads like
// a person taking notes, not a system logger. Prefer the page's own
// language (title fragment, then description) over generic stats.
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

function safeParseJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function fallbackUuid(): string {
  const r = () => Math.random().toString(16).slice(2, 10);
  return `${r()}${r()}-${r()}-${r()}-${r()}-${r()}${r()}${r()}`;
}

function setCors(res: VercelResponse): void {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "POST, OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type");
  res.setHeader("access-control-max-age", "86400");
}
