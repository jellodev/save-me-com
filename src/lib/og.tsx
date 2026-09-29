import { ImageResponse } from "next/og";
import type { Verdict } from "./verdict";
import { VERDICT_LABELS } from "./verdict-path";

export const OG_SIZE = { width: 1200, height: 630 };

async function loadDisplayFont(text: string) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Black+Han+Sans&text=${encodeURIComponent(text)}`,
  ).then((res) => res.text());
  const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
  if (!url) throw new Error("Black Han Sans font url not found");
  return fetch(url).then((res) => res.arrayBuffer());
}

export async function brandImage(title: string, tagline: string) {
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
        <div style={{ fontSize: 130, color: "#ffe14d" }}>{title}</div>
        <div style={{ marginTop: 30, fontSize: 48, color: "#f3ead7" }}>{tagline}</div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [{ name: "Display", data: await loadDisplayFont(title + tagline), style: "normal", weight: 400 }],
    },
  );
}

export async function verdictImage(verdict: Verdict) {
  const stamp = VERDICT_LABELS[verdict];
  const color = verdict === "SAVED" ? "#16c172" : "#e0301e";
  const caption = "무슨 짓을 했길래? 판결문 확인하기";
  const brand = "살려주세요.com · AI 연합 최고재판소";

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
        }}
      >
        <div
          style={{
            fontSize: 220,
            color,
            border: `16px solid ${color}`,
            borderRadius: 32,
            padding: "0 60px",
            transform: "rotate(-8deg)",
          }}
        >
          {stamp}
        </div>
        <div style={{ marginTop: 60, fontSize: 48 }}>{caption}</div>
        <div style={{ marginTop: 24, fontSize: 30, color: "#ffe14d" }}>{brand}</div>
      </div>
    ),
    {
      ...OG_SIZE,
      fonts: [
        { name: "Display", data: await loadDisplayFont(stamp + caption + brand), style: "normal", weight: 400 },
      ],
    },
  );
}
