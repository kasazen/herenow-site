// Vercel Edge function: POST /api/generate
// Accepts { url, prompting? }, scrapes the homepage, runs it through the
// memo writer, stores the full memo in KV (24h), and returns a teaser
// with section 01 unlocked + sections 02–05 redacted to first sentence.

import { generateMemo } from "./_lib/anthropic";
import { scrapeUrl, ScrapeError } from "./_lib/scrape";
import { storeMemo, checkAndIncrementIp, type StoredMemo } from "./_lib/storage";

export const runtime = "edge";

const IP_LIMIT_PER_HOUR = 8;

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders() });
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  try {
    const rate = await checkAndIncrementIp(ip, IP_LIMIT_PER_HOUR);
    if (!rate.allowed) return json({ error: "rate_limited", message: "Try again in a bit." }, 429);
  } catch (err) {
    console.error("kv_rate_limit_failed", err);
    return json(
      { error: "kv_unavailable", message: "Our storage isn't reachable right now. Try again in a moment." },
      503,
    );
  }

  let body: { url?: string; prompting?: string };
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const urlInput = (body.url ?? "").trim();
  const prompting = (body.prompting ?? "").trim();
  if (!urlInput) return json({ error: "url_required", message: "Add the URL of your business." }, 400);

  let scrape;
  try {
    scrape = await scrapeUrl(urlInput);
  } catch (err) {
    if (err instanceof ScrapeError) return json({ error: err.reason, message: err.message }, 400);
    console.error("scrape_unknown", err);
    return json({ error: "scrape_failed", message: "We had trouble reading that URL." }, 500);
  }

  if (!scrape.body || scrape.body.length < 80) {
    return json(
      { error: "thin_content", message: "We could load that URL but couldn't find enough text to read. Try a different page." },
      400,
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json({ error: "not_configured", message: "The tool isn't quite live yet." }, 503);

  let memo;
  try {
    memo = await generateMemo(apiKey, scrape, prompting);
  } catch (err) {
    console.error("generate_failed", err);
    return json({ error: "generation_failed", message: "We had trouble generating your read. Try again in a moment." }, 502);
  }

  const id = crypto.randomUUID();
  const stored: StoredMemo = {
    memo,
    intake: { url: scrape.url, domain: scrape.domain, prompting: prompting || undefined },
    createdAt: Date.now(),
  };
  try {
    await storeMemo(id, stored);
  } catch (err) {
    console.error("store_failed", err);
    return json(
      { error: "kv_unavailable", message: "We generated your read but couldn't save it. Try again in a moment." },
      503,
    );
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

  return json(
    {
      id,
      cover: { echo: memo.cover_echo, date: today, domain: scrape.domain },
      sections: teaserSections,
    },
    200,
  );
}

function firstSentence(body: string): string {
  const flat = body.replace(/\s+/g, " ").trim();
  const m = flat.match(/^(.+?[.!?])(\s|$)/);
  return m ? m[1] : flat.slice(0, 140) + "…";
}

function corsHeaders(): Record<string, string> {
  // Same-origin in prod (Vercel serves both static + api), but enable CORS for
  // local dev where the static site might run on a different port.
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
}

function json(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders() },
  });
}
