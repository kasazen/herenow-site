// POST /api/contact — long-form contact form submissions.
// Sends a notification to team@herenowlabs.xyz via Resend with the
// submitter's name, email, company, revenue band, and message.

export const runtime = "nodejs";
export const maxDuration = 30;

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "content-type",
  "access-control-max-age": "86400",
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

type ContactBody = {
  name?: string;
  email?: string;
  company?: string;
  revenue?: string;
  message?: string;
  // Honeypot — bots fill this; humans never see it.
  website?: string;
};

export async function POST(request: Request): Promise<Response> {
  let body: ContactBody | null = null;
  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return json(400, { ok: false, error: "invalid_json" });
  }

  if (body?.website) {
    // Honeypot tripped — pretend success, drop on the floor.
    return json(200, { ok: true });
  }

  const name = (body?.name ?? "").trim().slice(0, 200);
  const email = (body?.email ?? "").trim().toLowerCase().slice(0, 200);
  const company = (body?.company ?? "").trim().slice(0, 200);
  const revenue = (body?.revenue ?? "").trim().slice(0, 80);
  const message = (body?.message ?? "").trim().slice(0, 4000);

  if (!name) return json(400, { ok: false, error: "missing_name", message: "Add your name." });
  if (!isEmail(email))
    return json(400, {
      ok: false,
      error: "invalid_email",
      message: "That doesn't look like an email address.",
    });
  if (!message)
    return json(400, {
      ok: false,
      error: "missing_message",
      message: "Tell us a little about what you're looking for.",
    });

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("contact_resend_missing");
    return json(503, {
      ok: false,
      error: "not_configured",
      message: "We can't accept the form right now. Email team@herenowlabs.xyz directly.",
    });
  }

  const fromAddr = process.env.EMAIL_FROM ?? "Here Now Labs <team@herenowlabs.xyz>";
  const teamAddr = process.env.TEAM_NOTE_TO ?? "team@herenowlabs.xyz";
  const lines = [
    `From: ${name} <${email}>`,
    company ? `Company: ${company}` : null,
    revenue ? `Revenue band: ${revenue}` : null,
    "",
    message,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${resendKey}` },
      body: JSON.stringify({
        from: fromAddr,
        to: teamAddr,
        reply_to: email,
        subject: `Contact form · ${company || name}`,
        text: lines,
      }),
    });
    if (!r.ok) {
      const errBody = await r.text();
      throw new Error(`resend_${r.status}: ${errBody.slice(0, 300)}`);
    }
  } catch (err) {
    const msg = (err as Error)?.message?.slice(0, 300) ?? "unknown";
    console.error("contact_send_failed", msg);
    return json(502, {
      ok: false,
      error: "send_failed",
      message: "We couldn't deliver your note. Email team@herenowlabs.xyz directly.",
    });
  }

  return json(200, { ok: true });
}

function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function json(status: number, body: unknown): Response {
  return Response.json(body, { status, headers: CORS_HEADERS });
}
