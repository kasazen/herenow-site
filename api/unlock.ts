// POST /api/unlock — Vercel Node serverless function.
// Accepts { id, email, firstName? }, looks up the stored memo, marks email
// unlocked, sends the typeset HTML email via Resend, and returns the full
// memo for in-place reveal.

import type { VercelRequest, VercelResponse } from "@vercel/node";

import {
  getMemo,
  hasUnlockedEmail,
  markEmailUnlocked,
  markIdUnlocked,
  type StoredMemo,
} from "./_lib/storage";
import { renderEmail } from "./_lib/email-template";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const body = (typeof req.body === "string" ? safeParseJson(req.body) : req.body) as
    | { id?: string; email?: string; firstName?: string }
    | null;
  if (!body) {
    res.status(400).json({ error: "invalid_json" });
    return;
  }

  const id = (body.id ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const firstName = (body.firstName ?? "").trim();

  if (!id) {
    res.status(400).json({ error: "missing_id" });
    return;
  }
  if (!isEmail(email)) {
    res.status(400).json({ error: "invalid_email", message: "That doesn't look like an email address." });
    return;
  }

  let stored: StoredMemo | null;
  try {
    stored = await getMemo(id);
  } catch (err) {
    console.error("kv_get_failed", err);
    res.status(503).json({ error: "kv_unavailable", message: "Our storage isn't reachable right now." });
    return;
  }
  if (!stored) {
    res.status(404).json({ error: "memo_not_found", message: "That read has expired. Generate a new one." });
    return;
  }

  try {
    const idClaimed = await markIdUnlocked(id);
    const emailAlreadyUsed = await hasUnlockedEmail(email);
    if (!idClaimed && emailAlreadyUsed) {
      res.status(409).json({ error: "already_unlocked", message: "We've already sent one to that address." });
      return;
    }
    await markEmailUnlocked(email);
  } catch (err) {
    console.error("kv_unlock_marks_failed", err);
    res.status(503).json({ error: "kv_unavailable", message: "Our storage isn't reachable right now." });
    return;
  }

  // Fire-and-forget email. Don't fail the response if it bounces.
  sendEmail(email, firstName || undefined, stored).catch((err) => {
    console.error("email_send_failed", err);
  });

  const sections = stored.memo.sections.map((s) => ({
    index: s.index,
    title: s.title,
    body: s.body,
    locked: false,
  }));

  res.status(200).json({ sections });
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

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });

  if (!r.ok) {
    const body = await r.text();
    throw new Error(`resend_${r.status}: ${body.slice(0, 300)}`);
  }
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function safeParseJson(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}

function setCors(res: VercelResponse): void {
  res.setHeader("access-control-allow-origin", "*");
  res.setHeader("access-control-allow-methods", "POST, OPTIONS");
  res.setHeader("access-control-allow-headers", "content-type");
  res.setHeader("access-control-max-age", "86400");
}
