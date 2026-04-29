// Direct Upstash REST API client. Avoids the @upstash/redis package entirely
// — its bundling in Vercel Edge has been the persistent failure mode. The
// Upstash REST API is just HTTP; a 50-line wrapper does what we need.
//
// Reads KV_REST_API_URL / KV_REST_API_TOKEN, set automatically by the
// Vercel-Upstash integration. Falls back to UPSTASH_REDIS_REST_* if anyone
// wires that variant.

import type { MemoResult } from "./anthropic.js";

export type StoredMemo = {
  memo: MemoResult;
  intake: {
    url: string;
    domain: string;
    prompting?: string;
  };
  createdAt: number;
};

const MEMO_TTL = 24 * 60 * 60;
const RATE_TTL = 60 * 60;

function config(): { url: string; token: string } {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("kv_not_configured: missing KV_REST_API_URL/TOKEN");
  }
  return { url: url.replace(/\/+$/, ""), token };
}

// Upstash REST API supports two request shapes; we use the JSON array form
// since it's the simplest for variable-arity commands.
async function rest(command: (string | number)[]): Promise<unknown> {
  const { url, token } = config();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 5_000);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify(command),
      signal: ctrl.signal,
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`upstash_${res.status}: ${body.slice(0, 200)}`);
    }
    const data = (await res.json()) as { result?: unknown; error?: string };
    if (data.error) throw new Error(`upstash_error: ${data.error}`);
    return data.result;
  } finally {
    clearTimeout(timer);
  }
}

export async function storeMemo(id: string, value: StoredMemo): Promise<void> {
  await rest(["SET", `memo:${id}`, JSON.stringify(value), "EX", MEMO_TTL]);
}

export async function getMemo(id: string): Promise<StoredMemo | null> {
  const result = (await rest(["GET", `memo:${id}`])) as string | null;
  if (!result) return null;
  try {
    return JSON.parse(result) as StoredMemo;
  } catch {
    return null;
  }
}

export async function checkAndIncrementIp(ip: string, limit: number): Promise<{ allowed: boolean; count: number }> {
  const key = `rate:ip:${ip}`;
  const count = (await rest(["INCR", key])) as number;
  if (count === 1) await rest(["EXPIRE", key, RATE_TTL]);
  return { allowed: count <= limit, count };
}

export async function hasUnlockedEmail(email: string): Promise<boolean> {
  const v = await rest(["GET", `unlock:email:${email.toLowerCase()}`]);
  return v !== null && v !== undefined;
}

export async function markEmailUnlocked(email: string): Promise<void> {
  await rest(["SET", `unlock:email:${email.toLowerCase()}`, "1", "EX", 24 * 60 * 60]);
}

export async function markIdUnlocked(id: string): Promise<boolean> {
  const result = await rest(["SET", `unlock:id:${id}`, "1", "EX", 24 * 60 * 60, "NX"]);
  // Upstash returns "OK" on successful SET, null when NX prevents the set.
  return result === "OK";
}
