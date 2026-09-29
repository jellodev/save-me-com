"use client";

import { useEffect, useState } from "react";

export function ShareBar({ expiresAt, shareText }: { expiresAt: number; shareText: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, expiresAt - Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ text: shareText, url }).catch(() => {});
      return;
    }
    await navigator.clipboard.writeText(`${shareText}\n${url}`);
    setCopied(true);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  }

  const tweetUrl = () =>
    `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;

  return (
    <div className="mt-8">
      <p className="text-center text-sm text-paper-dim">
        이 판결문은 <span className="font-mono font-bold text-neon">{remaining === null ? "--:--:--" : formatDuration(remaining)}</span> 뒤 소각된다
      </p>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={share}
          className="col-span-3 rounded-2xl bg-neon py-4 font-display text-xl text-ink transition active:scale-[0.98]"
        >
          판결문 공유하기
        </button>
        <button
          type="button"
          onClick={copyLink}
          className="col-span-2 rounded-xl border border-paper/30 py-3 font-bold"
        >
          {copied ? "복사됨!" : "링크 복사"}
        </button>
        <button
          type="button"
          onClick={() => window.open(tweetUrl(), "_blank", "noopener")}
          className="rounded-xl border border-paper/30 py-3 font-bold"
        >
          X
        </button>
      </div>
    </div>
  );
}

function formatDuration(ms: number) {
  const total = Math.floor(ms / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}
