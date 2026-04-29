// Diagnostic endpoint. Reports env-var presence (no values) and the KV
// host. Optionally pings Resend with a tiny test send when called as
//   GET /api/diag?send=<email>&secret=<DIAG_SECRET>
// — gated by a shared secret so it can't be abused.

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  const present = (key: string): "set" | "missing" =>
    typeof process.env[key] === "string" && process.env[key]!.length > 0 ? "set" : "missing";

  const env = {
    ANTHROPIC_API_KEY: present("ANTHROPIC_API_KEY"),
    RESEND_API_KEY: present("RESEND_API_KEY"),
    EMAIL_FROM: present("EMAIL_FROM"),
    CALENDLY_HREF: present("CALENDLY_HREF"),
    KV_REST_API_URL: present("KV_REST_API_URL"),
    KV_REST_API_TOKEN: present("KV_REST_API_TOKEN"),
    UPSTASH_REDIS_REST_URL: present("UPSTASH_REDIS_REST_URL"),
    UPSTASH_REDIS_REST_TOKEN: present("UPSTASH_REDIS_REST_TOKEN"),
    DIAG_SECRET: present("DIAG_SECRET"),
  };

  const rawUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
  let kvHost: string | null = null;
  try {
    if (rawUrl) kvHost = new URL(rawUrl).host;
  } catch {
    kvHost = "(invalid url)";
  }

  // Optional Resend ping.
  let resendPing: { attempted: boolean; ok?: boolean; status?: number; body?: string; error?: string } = {
    attempted: false,
  };

  const sendTo = typeof req.query.send === "string" ? req.query.send.trim() : "";
  const givenSecret = typeof req.query.secret === "string" ? req.query.secret : "";
  const expectedSecret = process.env.DIAG_SECRET ?? "";

  if (sendTo) {
    if (!expectedSecret) {
      resendPing = { attempted: true, error: "DIAG_SECRET env var not set; refusing to send" };
    } else if (givenSecret !== expectedSecret) {
      resendPing = { attempted: true, error: "secret mismatch" };
    } else {
      try {
        const result = await pingResend(sendTo);
        resendPing = { attempted: true, ok: result.ok, status: result.status, body: result.body };
      } catch (err) {
        resendPing = { attempted: true, error: (err as Error).message?.slice(0, 300) ?? "unknown" };
      }
    }
  }

  res.status(200).json({ env, kvHost, resendPing, ts: new Date().toISOString() });
}

async function pingResend(to: string): Promise<{ ok: boolean; status: number; body: string }> {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "Here Now Labs <team@herenowlabs.xyz>";
  if (!resendKey) throw new Error("RESEND_API_KEY missing");

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({
      from,
      to,
      subject: "First Read — diag ping",
      text: "This is a diagnostic ping from the /api/diag endpoint. If you got it, sending is working.",
    }),
  });

  const body = await r.text();
  return { ok: r.ok, status: r.status, body: body.slice(0, 500) };
}
