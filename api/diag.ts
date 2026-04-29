// Diagnostic endpoint. Reports env-var presence (no values) and the KV host.

import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(_req: VercelRequest, res: VercelResponse): void {
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
  };

  const rawUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
  let kvHost: string | null = null;
  try {
    if (rawUrl) kvHost = new URL(rawUrl).host;
  } catch {
    kvHost = "(invalid url)";
  }

  res.status(200).json({ env, kvHost, ts: new Date().toISOString() });
}
