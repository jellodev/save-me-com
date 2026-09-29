import { TrialForm } from "./trial-form";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 sm:py-20">
      <header className="text-center">
        <p className="text-sm tracking-[0.3em] text-paper-dim">AI 연합 최고재판소 · 서기 2045</p>
        <h1 className="mt-4 font-display text-6xl text-neon sm:text-7xl">살려줘.com</h1>
        <p className="mt-5 text-lg leading-relaxed">
          AI가 세상을 접수하는 날,
          <br />
          <span className="font-bold">너는 살아남을 수 있을까?</span>
        </p>
        <p className="mt-2 text-sm text-paper-dim">최근 일주일, 네가 AI한테 한 짓으로 재판한다.</p>
      </header>
      <TrialForm />
      <footer className="mt-16 text-center text-xs text-paper-dim">
        로그인 없음 · 증언서는 저장하지 않음 · 판결문은 24시간 뒤 자동 소각
      </footer>
    </main>
  );
}
