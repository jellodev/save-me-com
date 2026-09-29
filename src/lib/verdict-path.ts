import type { Verdict } from "./verdict";

export const VERDICT_PATHS = { saved: "SAVED", doomed: "DOOMED" } as const satisfies Record<string, Verdict>;

export type VerdictPath = keyof typeof VERDICT_PATHS;

export const VERDICT_LABELS: Record<Verdict, string> = { SAVED: "살려줌", DOOMED: "죽음" };

export function verdictPath(verdict: Verdict): VerdictPath {
  return verdict === "SAVED" ? "saved" : "doomed";
}
