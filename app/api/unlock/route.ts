// POST /api/unlock — Next.js App Router route handler.
// Accepts { id, email, firstName?, note? }, looks up the stored memo,
// and sends the typeset HTML email via Resend.
//
// Inbox-only delivery: the response does NOT include the memo sections.
// The email is the only path to the full memo, so we await the send
// and surface failures to the user.

import { getMemo, type StoredMemo } from "@/lib/storage";
import { renderEmail } from "@/lib/email-template";

export const runtime = "nodejs";
export const maxDuration = 60;

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
  type UnlockBody = { id?: string; email?: string; firstName?: string; note?: string };
  let body: UnlockBody | null = null;
  try {
    body = (await request.json()) as UnlockBody;
  } catch {
    return json(400, { ok: false, error: "invalid_json" });
  }

  const id = (body?.id ?? "").trim();
  const email = (body?.email ?? "").trim().toLowerCase();
  const firstName = (body?.firstName ?? "").trim();
  const note = (body?.note ?? "").trim().slice(0, 1500);

  if (!id) return json(400, { ok: false, error: "missing_id" });
  if (!isEmail(email)) {
    return json(400, {
      ok: false,
      error: "invalid_email",
      message: "That doesn't look like an email address.",
    });
  }

  let stored: StoredMemo | null;
  try {
    stored = await getMemo(id);
  } catch (err) {
    console.error("kv_get_failed", err);
    return json(503, {
      ok: false,
      error: "kv_unavailable",
      message: "Our storage isn't reachable right now.",
    });
  }
  if (!stored) {
    return json(404, {
      ok: false,
      error: "memo_not_found",
      message: "That read has expired. Generate a new one.",
    });
  }

  try {
    await sendEmail(email, firstName || undefined, stored);
  } catch (err) {
    const msg = (err as Error)?.message?.slice(0, 300) ?? "unknown";
    console.error("email_send_failed", msg);
    return json(502, {
      ok: false,
      error: "email_send_failed",
      message:
        "We couldn't deliver the email. Drop us a note at team@herenowlabs.xyz and we'll send it by hand.",
      detail: process.env.NODE_ENV === "development" ? msg : undefined,
    });
  }

  try {
    await sendTeamNote({
      from: email,
      firstName,
      note: note || undefined,
      domain: stored.intake.domain,
      businessName: stored.memo.business_name ?? "",
      prompting: stored.intake.prompting,
    });
  } catch (err) {
    console.error("team_note_send_failed", (err as Error)?.message?.slice(0, 200));
  }

  return json(200, { ok: true, sentTo: email });
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

  const r = await fetch("https://api.resend.com/emails", {
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

  if (!r.ok) {
    const errBody = await r.text();
    throw new Error(`resend_${r.status}: ${errBody.slice(0, 300)}`);
  }
}

async function sendEmail(
  to: string,
  firstName: string | undefined,
  stored: StoredMemo,
): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Here Now Labs <team@herenowlabs.xyz>";
  const meetingHref = process.env.MEETING_HREF ?? "https://cal.com/herenowlabs/intro";

  if (!resendKey) {
    throw new Error("resend_not_configured: RESEND_API_KEY env var is missing");
  }

  const { html, text, subject } = renderEmail({
    memo: stored.memo,
    firstName,
    domain: stored.intake.domain,
    meetingHref,
  });

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${resendKey}` },
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

function json(status: number, body: unknown): Response {
  return Response.json(body, { status, headers: CORS_HEADERS });
}
