// Diagnostic endpoint. Reports env-var presence (without leaking values).
// No KV ping — that hung in 35s+ probes, so we just report what env is
// configured and leave KV reachability to a separate test.

export const runtime = "edge";

export default async function handler(): Promise<Response> {
  const present = (key: string): "set" | "missing" =>
    typeof process.env[key] === "string" && process.env[key]!.length > 0 ? "set" : "missing";

  const env = {
    ANTHROPIC_API_KEY: present("ANTHROPIC_API_KEY"),
    RESEND_API_KEY: present("RESEND_API_KEY"),
    EMAIL_FROM: present("EMAIL_FROM"),
    CALENDLY_HREF: present("CALENDLY_HREF"),
    KV_REST_API_URL: present("KV_REST_API_URL"),
    KV_REST_API_TOKEN: present("KV_REST_API_TOKEN"),
    KV_URL: present("KV_URL"),
    UPSTASH_REDIS_REST_URL: present("UPSTASH_REDIS_REST_URL"),
    UPSTASH_REDIS_REST_TOKEN: present("UPSTASH_REDIS_REST_TOKEN"),
  };

  // Snapshot the URL host (not the token) so we can confirm the integration
  // is pointing at the right Upstash instance without leaking secrets.
  const rawUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "";
  let kvHost: string | null = null;
  try {
    if (rawUrl) kvHost = new URL(rawUrl).host;
  } catch {
    kvHost = "(invalid url)";
  }

  return new Response(
    JSON.stringify({ env, kvHost, ts: new Date().toISOString() }, null, 2),
    { status: 200, headers: { "content-type": "application/json", "cache-control": "no-store" } },
  );
}
