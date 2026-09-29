"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { track } from "@/lib/analytics";
import { decodeTrial } from "@/lib/token";
import { TRIAL_TTL_SECONDS } from "@/lib/verdict";
import { VERDICT_LABELS } from "@/lib/verdict-path";
import { isOwnTrial, markReferred } from "@/lib/visitor";
import { Burned } from "./burned";
import { ShareBar } from "./share-bar";

export function TrialView() {
  const token = useSearchParams().get("t") ?? "";
  const trial = decodeTrial(token);
  if (!trial) return <Burned />;

  const own = isOwnTrial(token);

  const saved = trial.verdict === "SAVED";
  const accent = saved ? "text-alive border-alive" : "text-blood border-blood";

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 sm:py-16">
      <p className="text-center text-sm tracking-[0.3em] text-paper-dim">
        {own ? "AI 연합 최고재판소 판결문" : "친구의 판결문이 도착했다"}
      </p>

      <article className="relative mt-6 overflow-hidden rounded-2xl bg-paper p-6 text-ink shadow-2xl sm:p-8">
        <p className="text-sm text-ink/60">사건번호 2045-살려주세요-{String(trial.createdAt / 1000).slice(-6)}</p>
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

      {!own && (
        <Link
          href="/"
          onClick={() => {
            markReferred();
            track("visitor_cta");
          }}
          className="mt-8 block rounded-2xl bg-blood py-5 text-center font-display text-2xl text-paper shadow-[0_0_40px_-10px_var(--blood)] transition active:scale-[0.98]"
        >
          너도 살아남을 수 있을까? 재판받기
        </Link>
      )}

      <ShareBar
        expiresAt={trial.createdAt + TRIAL_TTL_SECONDS * 1000}
        shareText={`${trial.defendant}: ${VERDICT_LABELS[trial.verdict]} — ${trial.reason}`}
      />

      {own && (
        <Link
          href="/"
          className="mt-4 block rounded-2xl border-2 border-paper/30 py-4 text-center font-display text-xl"
        >
          다시 재판받기
        </Link>
      )}
    </main>
  );
}
