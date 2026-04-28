// Vercel Edge function: POST /api/unlock
// Accepts { id, email, firstName? }, looks up the stored memo, marks email
// unlocked, sends the typeset HTML email via Resend, and returns the full
// memo for in-place reveal.

import {
  getMemo,
  hasUnlockedEmail,
  markEmailUnlocked,
  markIdUnlocked,
  type StoredMemo,
} from "./_lib/storage";
import { renderEmail } from "./_lib/email-template";

export const config = {
  runtime: "edge",
};

export default async function handler(request: Request): Promise<Response> {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders() });
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);

  let payload: { id?: string; email?: string; firstName?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const id = (payload.id ?? "").trim();
  const email = (payload.email ?? "").trim().toLowerCase();
  const firstName = (payload.firstName ?? "").trim();

  if (!id) return json({ error: "missing_id" }, 400);
  if (!isEmail(email)) return json({ error: "invalid_email", message: "That doesn't look like an email address." }, 400);

  const stored = await getMemo(id);
  if (!stored) return json({ error: "memo_not_found", message: "That read has expired. Generate a new one." }, 404);

  const idClaimed = await markIdUnlocked(id);
  const emailAlreadyUsed = await hasUnlockedEmail(email);
  if (!idClaimed && emailAlreadyUsed) {
    return json({ error: "already_unlocked", message: "We've already sent one to that address." }, 409);
  }
  await markEmailUnlocked(email);

  // Fire-and-forget email. Don't fail the response if it bounces; the user
  // already sees the unlocked memo on-page.
  sendEmail(email, firstName || undefined, stored).catch((err) => {
    console.error("email_send_failed", err);
  });

  const sections = stored.memo.sections.map((s) => ({
    index: s.index,
    title: s.title,
    body: s.body,
    locked: false,
  }));

  return json({ sections }, 200);
}

async function sendEmail(to: string, firstName: string | undefined, stored: StoredMemo): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Here Now Labs <team@herenowlabs.xyz>";
  const calendlyHref = process.env.CALENDLY_HREF ?? "https://herenowlabs.xyz/#book";

  if (!resendKey) {
    console.warn("resend_not_configured");
    return;
  }

  const { html, text, subject } = renderEmail({
    memo: stored.memo,
    firstName,
    domain: stored.intake.domain,
    calendlyHref,
  });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`resend_${res.status}: ${body.slice(0, 300)}`);
  }
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function corsHeaders(): Record<string, string> {
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
