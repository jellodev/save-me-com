import { Redis } from "@upstash/redis";
import { TRIAL_TTL_SECONDS, type Trial } from "./verdict";

const redis = Redis.fromEnv();

const RATE_LIMIT_PER_HOUR = 5;

export async function saveTrial(trial: Trial) {
  await redis.set(`trial:${trial.id}`, trial, { ex: TRIAL_TTL_SECONDS });
}

export async function getTrial(id: string) {
  return redis.get<Trial>(`trial:${id}`);
}

export async function consumeRateLimit(ip: string) {
  const key = `rl:${ip}:${Math.floor(Date.now() / 3_600_000)}`;
  const [count] = await redis.multi().incr(key).expire(key, 3600).exec<[number, number]>();
  return count <= RATE_LIMIT_PER_HOUR;
}
