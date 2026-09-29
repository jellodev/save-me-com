"use client";

import { useEffect, useState } from "react";

export function ShareBar({ expiresAt, shareText }: { expiresAt: number; shareText: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const url = window.location.href;

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, expiresAt - Date.now()));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [expiresAt]);

  async function share() {
    const mobile = window.matchMedia("(pointer: coarse)").matches;
    if (mobile && navigator.share) {
      try {
        await navigator.share({ text: shareText, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    await navigator.clipboard.writeText(`${shareText}\n${url}`);
    setCopied(true);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setLinkCopied(true);
  }

  return (
    <div className="mt-8">
      <p className="text-center text-sm text-paper-dim">
        이 판결문은 <span className="font-mono font-bold text-neon">{remaining === null ? "--:--:--" : formatDuration(remaining)}</span> 뒤 소각된다
      </p>
      <button
        type="button"
        onClick={share}
        className="mt-4 w-full rounded-2xl bg-neon py-4 font-display text-xl text-ink transition active:scale-[0.98]"
      >
        {copied ? "복사됨! 카톡에 붙여넣어" : "판결문 공유하기"}
      </button>
      <div className="mt-2 flex gap-2">
        <input
          readOnly
          value={url}
          onFocus={(e) => e.currentTarget.select()}
          aria-label="판결문 링크"
          className="min-w-0 flex-1 rounded-xl border border-paper/30 bg-ink/70 px-3 py-3 font-mono text-xs text-paper-dim outline-none focus:border-neon"
        />
        <button
          type="button"
          onClick={copyLink}
          className="shrink-0 rounded-xl border border-paper/30 px-4 py-3 font-bold"
        >
          {linkCopied ? "복사됨!" : "복사하기"}
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
