// Vercel KV (Upstash Redis-backed) wrapper for memo storage and rate limits.
// Drop-in replacement for the previous Cloudflare KV adapter.

import { kv } from "@vercel/kv";

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

const MEMO_TTL = 24 * 60 * 60; // 24h
const RATE_TTL = 60 * 60; // 1h

export async function storeMemo(id: string, value: StoredMemo): Promise<void> {
  await kv.set(`memo:${id}`, value, { ex: MEMO_TTL });
}

export async function getMemo(id: string): Promise<StoredMemo | null> {
  return (await kv.get<StoredMemo>(`memo:${id}`)) ?? null;
}

export async function checkAndIncrementIp(ip: string, limit: number): Promise<{ allowed: boolean; count: number }> {
  const key = `rate:ip:${ip}`;
  const count = await kv.incr(key);
  if (count === 1) await kv.expire(key, RATE_TTL);
  return { allowed: count <= limit, count };
}

export async function hasUnlockedEmail(email: string): Promise<boolean> {
  const v = await kv.get(`unlock:email:${email.toLowerCase()}`);
  return v !== null && v !== undefined;
}

export async function markEmailUnlocked(email: string): Promise<void> {
  await kv.set(`unlock:email:${email.toLowerCase()}`, 1, { ex: 24 * 60 * 60 });
}

export async function markIdUnlocked(id: string): Promise<boolean> {
  const result = await kv.set(`unlock:id:${id}`, 1, { ex: 24 * 60 * 60, nx: true });
  return result === "OK";
}
