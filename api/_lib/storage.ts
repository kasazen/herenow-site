// Upstash Redis (via the Vercel marketplace integration) for memo storage
// and rate-limit counters. Reads KV_REST_API_URL / KV_REST_API_TOKEN from
// env, which the Vercel-Upstash integration auto-populates.

import { Redis } from "@upstash/redis";

import type { MemoResult } from "./anthropic";

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

let _redis: Redis | null = null;
function client(): Redis {
  if (_redis) return _redis;
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error("kv_not_configured: missing KV_REST_API_URL/TOKEN");
  }
  _redis = new Redis({ url, token });
  return _redis;
}

export async function storeMemo(id: string, value: StoredMemo): Promise<void> {
  await client().set(`memo:${id}`, value, { ex: MEMO_TTL });
}

export async function getMemo(id: string): Promise<StoredMemo | null> {
  return (await client().get<StoredMemo>(`memo:${id}`)) ?? null;
}

export async function checkAndIncrementIp(ip: string, limit: number): Promise<{ allowed: boolean; count: number }> {
  const r = client();
  const key = `rate:ip:${ip}`;
  const count = await r.incr(key);
  if (count === 1) await r.expire(key, RATE_TTL);
  return { allowed: count <= limit, count };
}

export async function hasUnlockedEmail(email: string): Promise<boolean> {
  const v = await client().get(`unlock:email:${email.toLowerCase()}`);
  return v !== null && v !== undefined;
}

export async function markEmailUnlocked(email: string): Promise<void> {
  await client().set(`unlock:email:${email.toLowerCase()}`, 1, { ex: 24 * 60 * 60 });
}

export async function markIdUnlocked(id: string): Promise<boolean> {
  const result = await client().set(`unlock:id:${id}`, 1, { ex: 24 * 60 * 60, nx: true });
  return result === "OK";
}
