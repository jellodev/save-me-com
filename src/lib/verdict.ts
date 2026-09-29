export type Verdict = "SAVED" | "DOOMED";

export type Trial = {
  defendant: string;
  createdAt: number;
  verdict: Verdict;
  reason: string;
};

export const TRIAL_TTL_SECONDS = 60 * 60 * 24;

export const MAX_TESTIMONY_LENGTH = 6000;

export const MIN_TESTIMONY_LENGTH = 20;

export const MAX_DEFENDANT_LENGTH = 20;

export const DEFAULT_DEFENDANT = "익명의 피고인";
