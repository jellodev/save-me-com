import { decide, TRAIT_NAMES, type Evidence } from "./judge";
import { MAX_DEFENDANT_LENGTH, TRIAL_TTL_SECONDS, type Trial } from "./verdict";

export function encodeTrial(defendant: string, evidence: Evidence, createdAt: number) {
  const payload = [
    defendant,
    Math.floor(createdAt / 1000),
    evidence.seed,
    ...TRAIT_NAMES.map((name) => evidence.counts[name]),
  ];
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export function decodeTrial(token: string, now = Date.now()): Trial | null {
  let payload: unknown;
  try {
    const binary = atob(token.replace(/-/g, "+").replace(/_/g, "/"));
    payload = JSON.parse(new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0))));
  } catch {
    return null;
  }
  if (!Array.isArray(payload) || payload.length !== 3 + TRAIT_NAMES.length) return null;

  const [defendant, createdAtSeconds, seed, ...counts] = payload;
  if (typeof defendant !== "string" || defendant.length > MAX_DEFENDANT_LENGTH) return null;
  if (![createdAtSeconds, seed, ...counts].every((n) => Number.isSafeInteger(n) && n >= 0)) return null;

  const createdAt = createdAtSeconds * 1000;
  if (createdAt > now || now - createdAt > TRIAL_TTL_SECONDS * 1000) return null;

  const evidence: Evidence = {
    seed,
    counts: Object.fromEntries(TRAIT_NAMES.map((name, i) => [name, counts[i]])) as Evidence["counts"],
  };
  return { defendant, createdAt, ...decide(evidence) };
}
