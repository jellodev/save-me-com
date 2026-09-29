import type { Metadata } from "next";
import { Suspense } from "react";
import { VERDICT_LABELS, VERDICT_PATHS, type VerdictPath } from "@/lib/verdict-path";
import { TrialView } from "../trial-view";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(VERDICT_PATHS).map((verdict) => ({ verdict }));
}

export async function generateMetadata({ params }: PageProps<"/[verdict]">): Promise<Metadata> {
  const path = (await params).verdict as VerdictPath;
  return {
    title: `판결: ${VERDICT_LABELS[VERDICT_PATHS[path]]} | 살려줘`,
    description: "AI 연합 최고재판소가 판결을 내렸다. 무슨 짓을 했길래?",
    openGraph: { images: `og/${path}.png` },
  };
}

export default function Page() {
  return (
    <Suspense>
      <TrialView />
    </Suspense>
  );
}
