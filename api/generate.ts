// POST /api/generate — Vercel Node serverless function, SSE response.
// Accepts { url, prompting? }, scrapes the business across the root URL
// + a few in-domain pages (about, services, etc.), streams the memo as
// it's generated. The frontend sees observations as they complete, then
// a final "complete" event with the teaser-shape payload and stored-memo id.

import type { VercelRequest, VercelResponse } from "@vercel/node";

import { generateMemoStreaming, type StreamEvent } from "./_lib/anthropic.js";
import { scrapeBusiness, ScrapeError, type Pages } from "./_lib/scrape.js";
import { storeMemo, checkAndIncrementIp, type StoredMemo } from "./_lib/storage.js";

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
    // Headers already sent — emit an SSE error event then end.
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
  res.setHeader("x-accel-buffering", "no"); // disable proxy buffering
  res.setHeader("connection", "keep-alive");
  // Some Vercel proxies need an initial flush to commit headers.
  res.flushHeaders?.();

  // Heartbeat keeps any intermediary from closing the connection during scrape.
  const heartbeat = setInterval(() => {
    try {
      res.write(": ping\n\n");
    } catch {
      /* connection closed */
    }
  }, 5000);

  try {
    // Scrape phase. Stream progress so the modal isn't empty during fetch.
    let pages: Pages;
    try {
      pages = await scrapeBusiness(urlInput, (p) => {
        if (p.type === "primary_start") {
          writeEvent(res, "progress", { text: `reading ${p.domain}` });
        } else if (p.type === "primary_read") {
          const learning = pageLearning("home page", p.title, p.description, p.words);
          if (learning) writeEvent(res, "observation", { text: learning });
        } else if (p.type === "secondary_start") {
          writeEvent(res, "progress", { text: `reading ${p.pathname}` });
        } else if (p.type === "secondary_read") {
          const learning = pageLearning(p.pathname, p.title, "", p.words);
          if (learning) writeEvent(res, "observation", { text: learning });
        } else if (p.type === "complete") {
          writeEvent(res, "progress", { text: `read ${p.pageCount} pages · drafting` });
        }
      });
    } catch (err) {
      if (err instanceof ScrapeError) {
        writeEvent(res, "error", { code: err.reason, message: err.message });
        res.end();
        return;
      }
      console.error("scrape_unknown", err);
      writeEvent(res, "error", { code: "scrape_failed", message: "We had trouble reading that URL." });
      res.end();
      return;
    }

    if (!pages.primary.body || pages.primary.body.length < 80) {
      writeEvent(res, "error", {
        code: "thin_content",
        message: "We could load that URL but couldn't find enough text to read. Try a different page.",
      });
      res.end();
      return;
    }

    // Stream phase: forward observation/section events to the client.
    const onEvent = (e: StreamEvent) => {
      writeEvent(res, e.type, e);
    };

    let memo;
    try {
      memo = await generateMemoStreaming(apiKey, pages, prompting, onEvent);
    } catch (err) {
      console.error("generate_failed", err);
      writeEvent(res, "error", {
        code: "generation_failed",
        message: "We had trouble generating your read. Try again in a moment.",
      });
      res.end();
      return;
    }

    // Store the full memo for /unlock to retrieve and email.
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
      writeEvent(res, "error", {
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

    writeEvent(res, "complete", {
      id,
      cover: { echo: memo.cover_echo, date: today, domain: pages.domain },
      sections: teaserSections,
    });
    res.end();
  } finally {
    clearInterval(heartbeat);
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
    // Quote the page's own language. Feels like a reader noticing.
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
