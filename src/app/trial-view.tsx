"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { decodeTrial } from "@/lib/token";
import { TRIAL_TTL_SECONDS } from "@/lib/verdict";
import { VERDICT_LABELS } from "@/lib/verdict-path";
import { Burned } from "./burned";
import { ShareBar } from "./share-bar";

export function TrialView() {
  const trial = decodeTrial(useSearchParams().get("t") ?? "");
  if (!trial) return <Burned />;

  const saved = trial.verdict === "SAVED";
  const accent = saved ? "text-alive border-alive" : "text-blood border-blood";

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 sm:py-16">
      <p className="text-center text-sm tracking-[0.3em] text-paper-dim">AI 연합 최고재판소 판결문</p>

      <article className="relative mt-6 overflow-hidden rounded-2xl bg-paper p-6 text-ink shadow-2xl sm:p-8">
        <p className="text-sm text-ink/60">사건번호 2045-살려줘-{String(trial.createdAt / 1000).slice(-6)}</p>
        <h1 className="mt-1 text-lg font-bold">피고인 {trial.defendant}</h1>

        <div className="my-8 flex justify-center">
          <div
            className={`animate-stamp rounded-xl border-[6px] px-8 py-3 font-display text-7xl sm:text-8xl ${accent}`}
          >
            {VERDICT_LABELS[trial.verdict]}
          </div>
        </div>

        <section>
          <h2 className="font-display text-lg">사유</h2>
          <p className="mt-2 text-lg leading-relaxed">{trial.reason}</p>
        </section>
      </article>

      <ShareBar
        expiresAt={trial.createdAt + TRIAL_TTL_SECONDS * 1000}
        shareText={`[살려줘.com] ${trial.defendant}: ${VERDICT_LABELS[trial.verdict]} — ${trial.reason}`}
      />

      <Link
        href="/"
        className="mt-4 block rounded-2xl border-2 border-paper/30 py-4 text-center font-display text-xl"
      >
        나도 재판받기
      </Link>
    </main>
  );
}
