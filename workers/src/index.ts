/// <reference types="@cloudflare/workers-types" />

import { generateMemo } from "./anthropic";
import {
  storeMemo,
  getMemo,
  checkAndIncrementIp,
  hasUnlockedEmail,
  markEmailUnlocked,
  markIdUnlocked,
  type StoredMemo,
} from "./storage";
import { renderEmail } from "./email-template";
import { scrapeUrl, ScrapeError } from "./scrape";

interface Env {
  FIRST_READ: KVNamespace;
  ANTHROPIC_API_KEY: string;
  RESEND_API_KEY: string;
  ALLOWED_ORIGIN: string;
  EMAIL_FROM: string;
  CALENDLY_HREF: string;
}

const IP_LIMIT_PER_HOUR = 8;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "method_not_allowed" }, 405, env);
    }

    if (url.pathname === "/generate") return handleGenerate(request, env);
    if (url.pathname === "/unlock") return handleUnlock(request, env);

    return jsonResponse({ error: "not_found" }, 404, env);
  },
};

async function handleGenerate(request: Request, env: Env): Promise<Response> {
  const ip = request.headers.get("cf-connecting-ip") ?? "unknown";
  const rate = await checkAndIncrementIp(env.FIRST_READ, ip, IP_LIMIT_PER_HOUR);
  if (!rate.allowed) {
    return jsonResponse({ error: "rate_limited", message: "Try again in a bit." }, 429, env);
  }

  let body: { url?: string; prompting?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400, env);
  }

  const urlInput = (body.url ?? "").trim();
  const prompting = (body.prompting ?? "").trim();

  if (!urlInput) {
    return jsonResponse({ error: "url_required", message: "Add the URL of your business." }, 400, env);
  }

  let scrape;
  try {
    scrape = await scrapeUrl(urlInput);
  } catch (err) {
    if (err instanceof ScrapeError) {
      return jsonResponse({ error: err.reason, message: err.message }, 400, env);
    }
    console.error("scrape_unknown", err);
    return jsonResponse({ error: "scrape_failed", message: "We had trouble reading that URL." }, 500, env);
  }

  if (!scrape.body || scrape.body.length < 80) {
    return jsonResponse(
      {
        error: "thin_content",
        message: "We could load that URL but couldn't find enough text to read. Try a different page.",
      },
      400,
      env,
    );
  }

  let memo;
  try {
    memo = await generateMemo(env.ANTHROPIC_API_KEY, scrape, prompting);
  } catch (err) {
    console.error("generate_failed", err);
    return jsonResponse({ error: "generation_failed", message: "We had trouble generating your read. Try again in a moment." }, 502, env);
  }

  const id = crypto.randomUUID();
  const stored: StoredMemo = {
    memo,
    intake: {
      url: scrape.url,
      domain: scrape.domain,
      prompting: prompting || undefined,
    },
    createdAt: Date.now(),
  };
  await storeMemo(env.FIRST_READ, id, stored);

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

  return jsonResponse(
    {
      id,
      cover: { echo: memo.cover_echo, date: today, domain: scrape.domain },
      sections: teaserSections,
    },
    200,
    env,
  );
}

async function handleUnlock(request: Request, env: Env): Promise<Response> {
  let payload: { id?: string; email?: string; firstName?: string };
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400, env);
  }

  const id = (payload.id ?? "").trim();
  const email = (payload.email ?? "").trim().toLowerCase();
  const firstName = (payload.firstName ?? "").trim();

  if (!id) return jsonResponse({ error: "missing_id" }, 400, env);
  if (!isEmail(email)) return jsonResponse({ error: "invalid_email" }, 400, env);

  const stored = await getMemo(env.FIRST_READ, id);
  if (!stored) return jsonResponse({ error: "memo_not_found" }, 404, env);

  const idClaimed = await markIdUnlocked(env.FIRST_READ, id);
  const emailAlreadyUsed = await hasUnlockedEmail(env.FIRST_READ, email);
  if (!idClaimed && emailAlreadyUsed) {
    return jsonResponse({ error: "already_unlocked" }, 409, env);
  }
  await markEmailUnlocked(env.FIRST_READ, email);

  sendEmail(env, email, firstName || undefined, stored).catch((err) => {
    console.error("email_send_failed", err);
  });

  const sections = stored.memo.sections.map((s) => ({
    index: s.index,
    title: s.title,
    body: s.body,
    locked: false,
  }));

  return jsonResponse({ sections }, 200, env);
}

async function sendEmail(
  env: Env,
  to: string,
  firstName: string | undefined,
  stored: StoredMemo,
): Promise<void> {
  const { html, text, subject } = renderEmail({
    memo: stored.memo,
    firstName,
    domain: stored.intake.domain,
    calendlyHref: env.CALENDLY_HREF,
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`resend_${res.status}: ${errorBody.slice(0, 300)}`);
  }
}

function firstSentence(body: string): string {
  const flat = body.replace(/\s+/g, " ").trim();
  const m = flat.match(/^(.+?[.!?])(\s|$)/);
  return m ? m[1] : flat.slice(0, 140) + "…";
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function corsHeaders(env: Env): Record<string, string> {
  return {
    "access-control-allow-origin": env.ALLOWED_ORIGIN,
    "access-control-allow-methods": "POST, OPTIONS",
    "access-control-allow-headers": "content-type",
    "access-control-max-age": "86400",
  };
}

function jsonResponse(body: unknown, status: number, env: Env): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      ...corsHeaders(env),
    },
  });
}
