// Diagnostic endpoint. Reports which env vars are set (without leaking values)
// and pings KV with a no-op so we can see if the integration is wired up.
// Safe to leave deployed; no secrets are returned.

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

  let kvStatus: { ok: boolean; error?: string };
  const url = (process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL ?? "").replace(/\/+$/, "");
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    kvStatus = { ok: false, error: "missing KV_REST_API_URL or KV_REST_API_TOKEN env" };
  } else {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4_000);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify(["PING"]),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const body = await res.text();
      kvStatus = res.ok
        ? { ok: true }
        : { ok: false, error: `upstash_${res.status}: ${body.slice(0, 120)}` };
    } catch (err) {
      clearTimeout(timer);
      kvStatus = { ok: false, error: (err as Error).message?.slice(0, 200) ?? "unknown" };
    }
  }

  return new Response(JSON.stringify({ env, kv: kvStatus, ts: new Date().toISOString() }, null, 2), {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
