// KV-backed storage for generated memos and rate-limit counters.

import type { MemoResult } from "./anthropic";

export type StoredMemo = {
  memo: MemoResult;
  intake: {
    business: string;
    firstName?: string;
  };
  createdAt: number;
};

const MEMO_TTL_SECONDS = 24 * 60 * 60; // 24h
const RATE_TTL_SECONDS = 60 * 60; // 1h

export function memoKey(id: string): string {
  return `memo:${id}`;
}

export async function storeMemo(kv: KVNamespace, id: string, value: StoredMemo): Promise<void> {
  await kv.put(memoKey(id), JSON.stringify(value), { expirationTtl: MEMO_TTL_SECONDS });
}

export async function getMemo(kv: KVNamespace, id: string): Promise<StoredMemo | null> {
  const raw = await kv.get(memoKey(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredMemo;
  } catch {
    return null;
  }
}

// ─── Rate limiting ──────────────────────────────────────────────

export async function checkAndIncrementIp(
  kv: KVNamespace,
  ip: string,
  limit: number,
): Promise<{ allowed: boolean; count: number }> {
  const key = `rate:ip:${ip}`;
  const raw = await kv.get(key);
  const count = raw ? parseInt(raw, 10) : 0;
  if (count >= limit) return { allowed: false, count };
  await kv.put(key, String(count + 1), { expirationTtl: RATE_TTL_SECONDS });
  return { allowed: true, count: count + 1 };
}

export async function hasUnlockedEmail(kv: KVNamespace, email: string): Promise<boolean> {
  const key = `unlock:email:${email.toLowerCase()}`;
  const raw = await kv.get(key);
  return raw !== null;
}

export async function markEmailUnlocked(kv: KVNamespace, email: string): Promise<void> {
  const key = `unlock:email:${email.toLowerCase()}`;
  await kv.put(key, "1", { expirationTtl: 24 * 60 * 60 });
}

export async function markIdUnlocked(kv: KVNamespace, id: string): Promise<boolean> {
  const key = `unlock:id:${id}`;
  const existing = await kv.get(key);
  if (existing) return false;
  await kv.put(key, "1", { expirationTtl: 24 * 60 * 60 });
  return true;
}
