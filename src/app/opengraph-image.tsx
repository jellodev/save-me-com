import { ImageResponse } from "next/og";
import { loadDisplayFont, OG_SIZE } from "@/lib/og-font";

export const alt = "살려줘.com — 미래 AI 법정";
export const size = OG_SIZE;
export const contentType = "image/png";

const TITLE = "살려줘.com";
const TAGLINE = "AI가 세상을 접수하는 날, 너는 살아남을 수 있을까?";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0b09",
          fontFamily: "Display",
        }}
      >
        <div style={{ fontSize: 170, color: "#ffe14d" }}>{TITLE}</div>
        <div style={{ marginTop: 30, fontSize: 48, color: "#f3ead7" }}>{TAGLINE}</div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Display", data: await loadDisplayFont(TITLE + TAGLINE), style: "normal", weight: 400 }],
    },
  );
}
