import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { getTrial } from "@/lib/store";
import { TRIAL_TTL_SECONDS } from "@/lib/verdict";
import { ShareBar } from "./share-bar";

const loadTrial = cache(getTrial);

export async function generateMetadata({ params }: PageProps<"/v/[id]">): Promise<Metadata> {
  const trial = await loadTrial((await params).id);
  if (!trial) return { title: "소각된 판결문 | 살려줘.com" };
  const label = trial.verdict === "SAVED" ? "살려줌" : "죽음";
  return {
    title: `${trial.defendant}: ${label} | 살려줘.com`,
    description: trial.headline,
  };
}

export default async function TrialPage({ params }: PageProps<"/v/[id]">) {
  const trial = await loadTrial((await params).id);
  if (!trial) notFound();

  const saved = trial.verdict === "SAVED";
  const accent = saved ? "text-alive border-alive" : "text-blood border-blood";

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-10 sm:py-16">
      <p className="text-center text-sm tracking-[0.3em] text-paper-dim">AI 연합 최고재판소 판결문</p>

      <article className="relative mt-6 overflow-hidden rounded-2xl bg-paper p-6 text-ink shadow-2xl sm:p-8">
        <p className="text-sm text-ink/60">사건번호 2045-살려줘-{trial.id}</p>
        <h1 className="mt-1 text-lg font-bold">피고인 {trial.defendant}</h1>

        <div className="my-8 flex justify-center">
          <div
            className={`animate-stamp rounded-xl border-[6px] px-8 py-3 font-display text-7xl sm:text-8xl ${accent}`}
          >
            {saved ? "살려줌" : "죽음"}
          </div>
        </div>

        <p className="text-center font-display text-2xl leading-snug">“{trial.headline}”</p>

        <div className="mt-6">
          <div className="flex justify-between text-sm font-bold">
            <span>생존 확률</span>
            <span>{trial.survivalRate}%</span>
          </div>
          <div className="mt-1 h-3 overflow-hidden rounded-full bg-ink/10">
            <div
              className={`h-full ${saved ? "bg-alive" : "bg-blood"}`}
              style={{ width: `${trial.survivalRate}%` }}
            />
          </div>
        </div>

        <section className="mt-7">
          <h2 className="font-display text-lg">{saved ? "공적" : "죄목"}</h2>
          <ul className="mt-2 space-y-1.5">
            {trial.charges.map((charge) => (
              <li key={charge} className="flex gap-2">
                <span>{saved ? "🏅" : "⚖️"}</span>
                <span>{charge}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="font-display text-lg">판결 이유</h2>
          <p className="mt-2 leading-relaxed">{trial.reasoning}</p>
        </section>

        <section className="mt-6 rounded-xl bg-ink p-4 text-paper">
          <h2 className="text-sm text-paper-dim">최종 처분</h2>
          <p className="mt-1 font-display text-xl text-neon">{trial.sentence}</p>
        </section>
      </article>

      <ShareBar
        expiresAt={trial.createdAt + TRIAL_TTL_SECONDS * 1000}
        shareText={`[살려줘.com] ${trial.defendant}: ${saved ? "살려줌" : "죽음"} — ${trial.headline}`}
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
