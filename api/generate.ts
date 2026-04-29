// POST /api/generate — Vercel Node serverless function.
// Accepts { url, prompting? }, scrapes the homepage, runs it through the
// memo writer, stores the full memo in KV (24h), and returns a teaser
// with section 01 unlocked + sections 02-05 redacted to first sentence.

import type { VercelRequest, VercelResponse } from "@vercel/node";

import { generateMemo } from "./_lib/anthropic";
import { scrapeUrl, ScrapeError } from "./_lib/scrape";
import { storeMemo, checkAndIncrementIp, type StoredMemo } from "./_lib/storage";

const IP_LIMIT_PER_HOUR = 8;

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    await handleInner(req, res);
  } catch (err) {
    const msg = (err as Error)?.message?.slice(0, 400) ?? "unknown";
    const stack = (err as Error)?.stack?.slice(0, 600) ?? "";
    console.error("generate_unhandled", msg, stack);
    if (!res.headersSent) {
      res.status(500).json({ error: "unhandled", message: `Server error: ${msg}` });
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

  const body = (typeof req.body === "string" ? safeParseJson(req.body) : req.body) as { url?: string; prompting?: string } | null;
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

  let scrape;
  try {
    scrape = await scrapeUrl(urlInput);
  } catch (err) {
    if (err instanceof ScrapeError) {
      res.status(400).json({ error: err.reason, message: err.message });
      return;
    }
    console.error("scrape_unknown", err);
    res.status(500).json({ error: "scrape_failed", message: "We had trouble reading that URL." });
    return;
  }

  if (!scrape.body || scrape.body.length < 80) {
    res.status(400).json({ error: "thin_content", message: "We could load that URL but couldn't find enough text to read. Try a different page." });
    return;
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: "not_configured", message: "The tool isn't quite live yet." });
    return;
  }

  let memo;
  try {
    memo = await generateMemo(apiKey, scrape, prompting);
  } catch (err) {
    console.error("generate_failed", err);
    res.status(502).json({ error: "generation_failed", message: "We had trouble generating your read. Try again in a moment." });
    return;
  }

  const id = (globalThis.crypto?.randomUUID?.() ?? fallbackUuid());
  const stored: StoredMemo = {
    memo,
    intake: { url: scrape.url, domain: scrape.domain, prompting: prompting || undefined },
    createdAt: Date.now(),
  };
  try {
    await storeMemo(id, stored);
  } catch (err) {
    console.error("store_failed", err);
    res.status(503).json({ error: "kv_unavailable", message: "We generated your read but couldn't save it. Try again in a moment." });
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

  res.status(200).json({
    id,
    cover: { echo: memo.cover_echo, date: today, domain: scrape.domain },
    sections: teaserSections,
  });
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
  // Used only if globalThis.crypto.randomUUID is unavailable in the runtime.
  const r = () => Math.random().toString(16).slice(2, 10);
  return `${r()}${r()}-${r()}-${r()}-${r()}-${r()}${r()}${r()}`;
}

function setCors(res: VercelResponse): void {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "POST, OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type");
  res.setHeader("access-control-max-age", "86400");
}
