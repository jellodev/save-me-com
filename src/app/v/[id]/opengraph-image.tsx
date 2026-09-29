import { ImageResponse } from "next/og";
import { loadDisplayFont, OG_SIZE } from "@/lib/og-font";
import { getTrial } from "@/lib/store";

export const alt = "살려줘.com 판결문";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const trial = await getTrial((await params).id);
  const saved = trial?.verdict === "SAVED";
  const stamp = trial ? (saved ? "살려줌" : "죽음") : "소각됨";
  const color = trial ? (saved ? "#16c172" : "#e0301e") : "#c9bfa9";
  const defendant = trial ? `피고인 ${trial.defendant}` : "판결문 소각 완료";
  const headline = trial?.headline ?? "24시간이 지나 증거가 인멸되었다";
  const brand = "살려줘.com · AI 연합 최고재판소";

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
          color: "#f3ead7",
          fontFamily: "Display",
          padding: 60,
        }}
      >
        <div style={{ fontSize: 40, color: "#c9bfa9" }}>{defendant}</div>
        <div
          style={{
            marginTop: 24,
            fontSize: 190,
            color,
            border: `14px solid ${color}`,
            borderRadius: 28,
            padding: "0 50px",
            transform: "rotate(-8deg)",
          }}
        >
          {stamp}
        </div>
        <div style={{ marginTop: 44, fontSize: 52, textAlign: "center", maxWidth: 1050 }}>
          {`“${headline}”`}
        </div>
        <div style={{ marginTop: 30, fontSize: 30, color: "#ffe14d" }}>{brand}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Display",
          data: await loadDisplayFont(defendant + stamp + headline + brand + "“”"),
          style: "normal",
          weight: 400,
        },
      ],
    },
  );
}
