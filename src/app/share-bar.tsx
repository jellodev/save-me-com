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
    </div>
  );
}

function formatDuration(ms: number) {
  const total = Math.floor(ms / 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}
