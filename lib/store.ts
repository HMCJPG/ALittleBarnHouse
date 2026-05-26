/**
 * Storage abstraction.
 *
 * In production: backed by Upstash Redis (via Vercel KV marketplace or
 * Upstash marketplace). Either set of env vars is accepted.
 *
 * In local dev without env vars: an in-memory Map that resets on restart.
 * That's fine for poking at the UI — once you `vercel env pull .env.local`
 * after wiring KV in the dashboard, the same code switches to real storage
 * with zero changes.
 */
import { Redis } from "@upstash/redis";

const url =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const token =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;

export const usingRedis = !!redis;

// In-memory fallback. Module-level so it survives across requests in dev.
const memStore = new Map<string, unknown>();

export async function kvGet<T>(key: string): Promise<T | null> {
  if (redis) {
    const v = await redis.get<T>(key);
    return v ?? null;
  }
  return (memStore.get(key) as T | undefined) ?? null;
}

export async function kvSet<T>(key: string, value: T): Promise<void> {
  if (redis) {
    await redis.set(key, value);
    return;
  }
  memStore.set(key, value);
}
