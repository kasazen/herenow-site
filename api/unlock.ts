// POST /api/unlock — Vercel Node serverless function.
// Accepts { id, email, firstName? }, looks up the stored memo, marks
// email unlocked, and sends the typeset HTML email via Resend.
//
// Inbox-only delivery: the response does NOT include the memo sections.
// The email is the only path to the full memo, so we await the send
// and surface failures to the user instead of fire-and-forget.

import type { VercelRequest, VercelResponse } from "@vercel/node";

import { getMemo, type StoredMemo } from "./_lib/storage.js";
import { renderEmail } from "./_lib/email-template.js";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  setCors(res);
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ ok: false, error: "method_not_allowed" });
    return;
  }

  const body = (typeof req.body === "string" ? safeParseJson(req.body) : req.body) as
    | { id?: string; email?: string; firstName?: string; note?: string }
    | null;
  if (!body) {
    res.status(400).json({ ok: false, error: "invalid_json" });
    return;
  }

  const id = (body.id ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const firstName = (body.firstName ?? "").trim();
  const note = (body.note ?? "").trim().slice(0, 1500);

  if (!id) {
    res.status(400).json({ ok: false, error: "missing_id" });
    return;
  }
  if (!isEmail(email)) {
    res.status(400).json({ ok: false, error: "invalid_email", message: "That doesn't look like an email address." });
    return;
  }

  let stored: StoredMemo | null;
  try {
    stored = await getMemo(id);
  } catch (err) {
    console.error("kv_get_failed", err);
    res.status(503).json({ ok: false, error: "kv_unavailable", message: "Our storage isn't reachable right now." });
    return;
  }
  if (!stored) {
    res.status(404).json({ ok: false, error: "memo_not_found", message: "That read has expired. Generate a new one." });
    return;
  }

  // Inbox-only: await the send and surface failures.
  try {
    await sendEmail(email, firstName || undefined, stored);
  } catch (err) {
    const msg = (err as Error)?.message?.slice(0, 300) ?? "unknown";
    console.error("email_send_failed", msg);
    res.status(502).json({
      ok: false,
      error: "email_send_failed",
      message:
        "We couldn't deliver the email. Drop us a note at team@herenowlabs.xyz and we'll send it by hand.",
      detail: process.env.NODE_ENV === "development" ? msg : undefined,
    });
    return;
  }

  // Notify the team on every successful send so a human can pick up the
  // conversation. Fire-and-forget — failure here shouldn't block the user's
  // success state.
  sendTeamNote({
    from: email,
    firstName,
    note: note || undefined,
    domain: stored.intake.domain,
    businessName: stored.memo.business_name ?? "",
    prompting: stored.intake.prompting,
  }).catch((err) => {
    console.error("team_note_send_failed", (err as Error)?.message?.slice(0, 200));
  });

  res.status(200).json({ ok: true, sentTo: email });
}

async function sendTeamNote(input: {
  from: string;
  firstName: string;
  note?: string;
  domain: string;
  businessName: string;
  prompting?: string;
}): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const fromAddr = process.env.EMAIL_FROM ?? "Here Now Labs <team@herenowlabs.xyz>";
  const teamAddr = process.env.TEAM_NOTE_TO ?? "team@herenowlabs.xyz";
  if (!resendKey) return;

  const label = input.businessName || input.domain;
  const subject = input.note ? `First Read note · ${label}` : `First Read sent · ${label}`;

  const lines: string[] = [
    `From: ${input.from}${input.firstName ? ` (${input.firstName})` : ""}`,
    `Business: ${input.businessName || "(unknown)"}`,
    `Domain: ${input.domain}`,
  ];
  if (input.prompting && input.prompting.trim()) {
    lines.push("", "What they told us at intake:", input.prompting.trim());
  }
  if (input.note && input.note.trim()) {
    lines.push("", "Note from the post-memo dialog:", input.note.trim());
  }
  const text = lines.join("\n");

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({
      from: fromAddr,
      to: teamAddr,
      reply_to: input.from,
      subject,
      text,
    }),
  });
}

async function sendEmail(to: string, firstName: string | undefined, stored: StoredMemo): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Here Now Labs <team@herenowlabs.xyz>";
  const calendlyHref = process.env.CALENDLY_HREF ?? "https://herenowlabs.xyz/#book";

  if (!resendKey) {
    throw new Error("resend_not_configured: RESEND_API_KEY env var is missing");
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
    const errBody = await r.text();
    throw new Error(`resend_${r.status}: ${errBody.slice(0, 300)}`);
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
