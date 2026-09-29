import { brandImage, verdictImage } from "@/lib/og";
import { VERDICT_PATHS, type VerdictPath } from "@/lib/verdict-path";

export const dynamic = "force-static";
export const dynamicParams = false;

const IMAGES = {
  "home.png": () => brandImage("살려주세요.com", "AI가 세상을 접수하는 날, 너는 살아남을 수 있을까?"),
  ...Object.fromEntries(
    (Object.keys(VERDICT_PATHS) as VerdictPath[]).map((path) => [`${path}.png`, () => verdictImage(VERDICT_PATHS[path])]),
  ),
} as Record<string, () => Promise<Response>>;

export function generateStaticParams() {
  return Object.keys(IMAGES).map((file) => ({ file }));
}

export async function GET(_: Request, { params }: RouteContext<"/og/[file]">) {
  return IMAGES[(await params).file]();
}
