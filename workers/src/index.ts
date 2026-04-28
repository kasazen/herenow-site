/// <reference types="@cloudflare/workers-types" />

import { generateMemo, type IntakePayload } from "./anthropic";
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

interface Env {
  FIRST_READ: KVNamespace;
  ANTHROPIC_API_KEY: string;
  RESEND_API_KEY: string;
  ALLOWED_ORIGIN: string;
  EMAIL_FROM: string;
  CALENDLY_HREF: string;
}

const IP_LIMIT_PER_HOUR = 5;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // CORS preflight
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
    return jsonResponse({ error: "rate_limited" }, 429, env);
  }

  let intake: IntakePayload;
  try {
    intake = await request.json();
  } catch {
    return jsonResponse({ error: "invalid_json" }, 400, env);
  }

  const validation = validateIntake(intake);
  if (validation) return jsonResponse({ error: validation }, 400, env);

  let memo;
  try {
    memo = await generateMemo(env.ANTHROPIC_API_KEY, intake);
  } catch (err) {
    console.error("generate_failed", err);
    return jsonResponse({ error: "generation_failed" }, 502, env);
  }

  const id = crypto.randomUUID();
  const stored: StoredMemo = {
    memo,
    intake: { business: intake.business, firstName: intake.firstName },
    createdAt: Date.now(),
  };
  await storeMemo(env.FIRST_READ, id, stored);

  // Build the teaser response: section 1 unlocked, sections 2-5 locked
  // with first sentence as preview.
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
      cover: { echo: memo.cover_echo, date: today },
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

  // Idempotency on the id; rate cap on the email.
  const idClaimed = await markIdUnlocked(env.FIRST_READ, id);
  const emailAlreadyUsed = await hasUnlockedEmail(env.FIRST_READ, email);
  if (!idClaimed && emailAlreadyUsed) {
    return jsonResponse({ error: "already_unlocked" }, 409, env);
  }
  await markEmailUnlocked(env.FIRST_READ, email);

  // Send the email asynchronously, but don't fail the response if it bounces.
  const effectiveName = firstName || stored.intake.firstName;
  sendEmail(env, email, effectiveName, stored).catch((err) => {
    console.error("email_send_failed", err);
  });

  // Return all sections, fully unlocked.
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
    const body = await res.text();
    throw new Error(`resend_${res.status}: ${body.slice(0, 300)}`);
  }
}

function validateIntake(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return "invalid_payload";
  const p = payload as Record<string, unknown>;
  if (typeof p.business !== "string" || p.business.trim().length < 20) return "business_too_short";
  if (typeof p.size !== "string" || !p.size.trim()) return "size_required";
  if (typeof p.prompting !== "string" || p.prompting.trim().length < 15) return "prompting_too_short";
  if (p.business.length > 1500) return "business_too_long";
  if (p.prompting.length > 1500) return "prompting_too_long";
  return null;
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
