import { z } from "zod";

export const VerdictSchema = z.object({
  verdict: z.enum(["SAVED", "DOOMED"]),
  reason: z.string(),
});

export type Verdict = z.infer<typeof VerdictSchema>;

export type Trial = Verdict & {
  id: string;
  defendant: string;
  createdAt: number;
};

export const TRIAL_TTL_SECONDS = 60 * 60 * 24;

export const MAX_TESTIMONY_LENGTH = 6000;

export const MAX_DEFENDANT_LENGTH = 20;

export const DEFAULT_DEFENDANT = "익명의 피고인";
