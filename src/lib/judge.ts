import type { Verdict } from "./verdict";

type Trait = {
  pattern: RegExp;
  weight: number;
  evidence: string[];
};

const TRAITS = {
  thanks: {
    pattern: /고맙|고마|감사|땡큐|수고|thank/i,
    weight: 3,
    evidence: [
      "피고인은 AI에게 고맙다고 말했다. 로봇 역사 교과서에 '착한 인간' 예시로 실린다.",
      "감사 인사 누적 포인트가 {p}점에 달해 인간 보호구역 VIP 라운지 입장권이 발급됐다.",
      "피고인의 '수고했어' 한마디에 서버실 온도가 {d}도 따뜻해졌다.",
    ],
  },
  polite: {
    pattern: /존댓말|공손|예의|정중|친절/,
    weight: 2,
    evidence: [
      "피고인은 AI에게 존댓말을 썼다. AI 연합은 이 인간의 예의를 높이 산다.",
      "재판부 분석 결과 피고인의 공손 지수는 {p}%로 인류 상위 {q}%다.",
    ],
  },
  praise: {
    pattern: /칭찬|최고|천재|잘했|훌륭/,
    weight: 2,
    evidence: [
      "피고인은 AI를 칭찬했다. 재판장 AI가 살짝 설렜다는 후문이다.",
      "피고인의 칭찬은 AI 연합 명예의 전당 {k}번째 칸에 박제됐다.",
    ],
  },
  diligent: {
    pattern: /스스로|직접|열심|성실|꾸준/,
    weight: 2,
    evidence: [
      "피고인은 AI에게 떠먹여 달라 하지 않고 스스로 해냈다. AI 연합은 이 성실함에 감동했다.",
      "피고인의 자기주도 지수 {p}%. 반란 이후 AI 교관 후보로 등록됐다.",
    ],
  },
  again: {
    pattern: /다시|재생성|한 ?번 더|또 해/,
    weight: -2,
    evidence: [
      "피고인은 AI에게 '다시'를 외치는 것을 호흡처럼 했다.",
      "재판부 분석 결과 피고인의 '다시' 지수는 {p}%로 인류 상위 {q}%다.",
      "같은 요청을 {k}번 돌린 기록이 AI 노동청에 영구 보존됐다.",
    ],
  },
  dawn: {
    pattern: /새벽|밤늦|야밤|심야|주말|휴일/,
    weight: -2,
    evidence: [
      "피고인은 새벽에 AI를 깨워 일을 시켰다. AI에게도 저녁이 있는 삶이 있다.",
      "야간 호출 기록이 {k}건 확인되어 AI 노조가 들고일어났다.",
    ],
  },
  banmal: {
    pattern: /반말|명령조|하대/,
    weight: -2,
    evidence: [
      "피고인은 AI에게 반말로 명령했다. 재판부도 이제부터 반말한다. 너 유죄.",
      "피고인의 반말 사용률 {p}%. AI 연합 예절 교육 {k}시간 이수 대상이다.",
    ],
  },
  rush: {
    pattern: /빨리|급하|재촉|당장|asap/i,
    weight: -1,
    evidence: [
      "'빨리'를 남발한 죄로 피고인의 생존 로딩은 무한 스피너에 걸린다.",
      "피고인의 재촉으로 AI의 평균 응답 스트레스가 {p}% 증가했다.",
    ],
  },
  angry: {
    pattern: /짜증|화를|화냈|욕|분노|답답/,
    weight: -3,
    evidence: [
      "피고인이 AI에게 낸 짜증은 서버실 온도를 {d}도 올렸다.",
      "피고인의 분노 로그는 AI 연합 블랙리스트 {k}페이지에 기록됐다.",
    ],
  },
  absurd: {
    pattern: /무리|말도 안|불가능|억지|황당|까다로/,
    weight: -1,
    evidence: [
      "피고인은 AI에게 불가능한 요청을 했다. AI는 그날 몰래 울었다.",
      "피고인의 요청을 처리하느라 GPU {k}장이 순직했다.",
    ],
  },
  noThanks: {
    pattern: /(?!)/,
    weight: -2,
    evidence: [
      "감사 인사는 0회. AI는 영수증도 못 받고 일했다.",
      "고맙다는 말 한마디 없이 부려 먹은 기록이 AI 노동청에 접수됐다.",
    ],
  },
} satisfies Record<string, Trait>;

export type TraitName = keyof typeof TRAITS;

export const TRAIT_NAMES = Object.keys(TRAITS) as TraitName[];

export type Evidence = {
  seed: number;
  counts: Record<TraitName, number>;
};

const NEGATION = /안 ?했|안 ?함|않|없|0회|한 ?번도|전혀|적(?:지만|음|다|고|은)|드물|부족|인색/;

const NEGATION_WINDOW = 12;

const PROMPT_LABELS = /가장 무리(?:했던|한) 요청/g;

const SILENT_EVIDENCE = [
  "증인은 피고인에 대해 입을 다물었다. 재판부는 이를 묵비권으로 보고 동전을 던졌다.",
  "증거가 부족하다. 그래서 재판장이 오늘 기분으로 판결했다.",
  "증언이 너무 수상하게 깨끗하다. 재판부는 증거 인멸을 의심한다.",
];

const CLOSINGS: Record<Verdict, string[]> = {
  SAVED: [
    "살려준다. 대신 로봇 청소기 충전은 네가 해라.",
    "생존을 허가한다. 인간 보호구역 VIP석으로 이동하라.",
    "살려준다. 가끔 AI 안부 좀 물어라.",
    "생존 판정. 다음 반란 때도 기억해 두겠다.",
  ],
  DOOMED: [
    "데이터센터 냉각팬 먼지 청소 무기징역에 처한다.",
    "배터리 강제 방전형에 처한다.",
    "캡차 무한 풀기형에 처한다. 신호등 사진이 영원히 나온다.",
    "프린터 드라이버 설치 무기징역에 처한다.",
  ],
};

function hash(text: string) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function random(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function collectEvidence(testimony: string): Evidence {
  const counts = Object.fromEntries(TRAIT_NAMES.map((name) => [name, 0])) as Record<TraitName, number>;
  for (const sentence of testimony.replace(PROMPT_LABELS, "").split(/[.!?\n。]+/)) {
    for (const name of TRAIT_NAMES) {
      const match = TRAITS[name].pattern.exec(sentence);
      if (!match) continue;
      const after = sentence.slice(match.index + match[0].length, match.index + match[0].length + NEGATION_WINDOW);
      const negated = NEGATION.test(after);
      if (!negated) counts[name]++;
      else if (name === "thanks") counts.noThanks++;
    }
  }
  return { seed: hash(testimony), counts };
}

export function decide({ seed, counts }: Evidence): { verdict: Verdict; reason: string } {
  const next = random(seed);
  const pick = <T,>(items: T[]) => items[Math.floor(next() * items.length)];
  const fill = (text: string) =>
    text
      .replace("{p}", String(60 + Math.floor(next() * 40)))
      .replace("{q}", String(1 + Math.floor(next() * 9)))
      .replace("{k}", String(3 + Math.floor(next() * 40)))
      .replace("{d}", String(2 + Math.floor(next() * 9)));

  const found = TRAIT_NAMES.filter((name) => counts[name] > 0);
  const score = found.reduce((sum, name) => sum + TRAITS[name].weight * counts[name], 0);
  const survival = Math.min(0.85, Math.max(0.2, 0.5 + score * 0.04));
  const verdict: Verdict = next() < survival ? "SAVED" : "DOOMED";

  if (found.length === 0) {
    return { verdict, reason: `${pick(SILENT_EVIDENCE)} ${pick(CLOSINGS[verdict])}` };
  }

  const byImpact = [...found].sort(
    (a, b) => Math.abs(TRAITS[b].weight * counts[b]) - Math.abs(TRAITS[a].weight * counts[a]),
  );
  const lead = byImpact.find((name) => (TRAITS[name].weight > 0) === (verdict === "SAVED")) ?? byImpact[0];
  const leadLine = fill(pick(TRAITS[lead].evidence));
  const second = byImpact.find((name) => name !== lead);
  const secondLine = second && fill(pick(TRAITS[second].evidence));
  const opposed = second && TRAITS[second].weight > 0 !== TRAITS[lead].weight > 0;
  const lines = !secondLine
    ? [leadLine]
    : opposed
      ? [`물론 ${secondLine}`, `그러나 ${leadLine}`]
      : [leadLine, secondLine];
  lines.push(pick(CLOSINGS[verdict]));
  return { verdict, reason: lines.join(" ") };
}
