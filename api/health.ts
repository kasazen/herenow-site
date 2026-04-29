// Diagnostic endpoint. Reports which env vars are set (without leaking values)
// and pings KV with a no-op so we can see if the integration is wired up.
// Safe to leave deployed; no secrets ever returned.

export const config = {
  runtime: "edge",
};

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
    REDIS_URL: present("REDIS_URL"),
  };

  let kvStatus: { ok: boolean; error?: string };
  try {
    const { kv } = await import("@vercel/kv");
    await kv.set("health:probe", Date.now(), { ex: 60 });
    const v = await kv.get("health:probe");
    kvStatus = { ok: v !== null && v !== undefined };
  } catch (err) {
    kvStatus = { ok: false, error: (err as Error).message?.slice(0, 200) ?? "unknown" };
  }

  return new Response(JSON.stringify({ env, kv: kvStatus, ts: new Date().toISOString() }, null, 2), {
    status: 200,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}
