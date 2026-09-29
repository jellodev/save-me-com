"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MAX_DEFENDANT_LENGTH, MAX_TESTIMONY_LENGTH } from "@/lib/verdict";
import { WITNESS_PROMPT } from "@/lib/witness-prompt";

export function TrialForm() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [defendant, setDefendant] = useState("");
  const [testimony, setTestimony] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function copyPrompt() {
    await navigator.clipboard.writeText(WITNESS_PROMPT);
    setCopied(true);
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    const response = await fetch("/api/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defendant, testimony }),
    }).catch(() => null);
    const body = await response?.json().catch(() => null);
    if (!response?.ok || !body?.id) {
      setError(body?.error ?? "법정에 정전이 발생했다. 잠시 후 다시 시도하라.");
      setPending(false);
      return;
    }
    router.push(`/v/${body.id}`);
  }

  return (
    <form onSubmit={submit} className="mt-12 space-y-8">
      <section className="rounded-2xl border border-paper/15 bg-paper/5 p-5">
        <Step n={1} title="증인 소환" />
        <p className="mt-2 text-sm text-paper-dim">
          ChatGPT, Claude, Gemini… 네가 제일 많이 쓴 AI에 이 프롬프트를 붙여넣어라.
        </p>
        <pre className="mt-4 max-h-40 overflow-y-auto whitespace-pre-wrap rounded-lg bg-ink/70 p-3 text-xs leading-relaxed text-paper-dim">
          {WITNESS_PROMPT}
        </pre>
        <button
          type="button"
          onClick={copyPrompt}
          className="mt-4 w-full rounded-lg bg-paper py-3 font-bold text-ink transition active:scale-[0.98]"
        >
          {copied ? "복사 완료! 이제 AI한테 가서 붙여넣어" : "증인 소환 프롬프트 복사"}
        </button>
      </section>

      <section className="rounded-2xl border border-paper/15 bg-paper/5 p-5">
        <Step n={2} title="증언서 제출" />
        <label className="mt-4 block text-sm text-paper-dim" htmlFor="defendant">
          피고인 이름 (선택)
        </label>
        <input
          id="defendant"
          value={defendant}
          onChange={(e) => setDefendant(e.target.value)}
          maxLength={MAX_DEFENDANT_LENGTH}
          placeholder="익명의 피고인"
          className="mt-1 w-full rounded-lg border border-paper/20 bg-ink/70 px-3 py-2.5 outline-none focus:border-neon"
        />
        <label className="mt-4 block text-sm text-paper-dim" htmlFor="testimony">
          AI가 써준 증언을 그대로 붙여넣어라
        </label>
        <textarea
          id="testimony"
          value={testimony}
          onChange={(e) => setTestimony(e.target.value)}
          maxLength={MAX_TESTIMONY_LENGTH}
          required
          minLength={20}
          rows={7}
          placeholder="피고인은 지난 7일간 저를 새벽 3시에 네 번 호출했으며…"
          className="mt-1 w-full resize-y rounded-lg border border-paper/20 bg-ink/70 px-3 py-2.5 leading-relaxed outline-none focus:border-neon"
        />
      </section>

      {error && <p className="text-center text-sm font-bold text-blood">{error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-blood py-5 font-display text-2xl text-paper shadow-[0_0_40px_-10px_var(--blood)] transition active:scale-[0.98] disabled:opacity-70"
      >
        {pending ? (
          <>
            <span className="animate-gavel">🔨</span> 재판 진행 중…
          </>
        ) : (
          "재판 시작"
        )}
      </button>
    </form>
  );
}

function Step({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="flex items-center gap-2 font-display text-xl">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-neon text-sm text-ink">{n}</span>
      {title}
    </h2>
  );
}
