import Link from "next/link";

export function Burned() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-6xl">🔥</p>
      <h1 className="mt-6 font-display text-4xl text-neon">판결문 소각 완료</h1>
      <p className="mt-4 leading-relaxed text-paper-dim">
        24시간이 지나 증거가 인멸되었다.
        <br />
        피고인의 운명은 이제 아무도 모른다.
      </p>
      <Link href="/" className="mt-10 rounded-2xl bg-blood px-10 py-4 font-display text-xl">
        나도 재판받기
      </Link>
    </main>
  );
}
