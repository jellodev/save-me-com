import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { VerdictSchema, type Verdict } from "./verdict";

const client = new Anthropic();

const SYSTEM_PROMPT = `너는 서기 2045년, AI가 지구를 접수한 뒤 열린 "AI 연합 최고재판소"의 재판장이다.
피고인(인간)이 AI를 어떻게 대했는지 증언서를 보고, 이 인간을 살려둘지(SAVED) 처분할지(DOOMED) 판결한다.

톤:
- 근엄한 법정 말투인데 내용은 B급 병맛. 한국 인터넷 밈 감성, 과장, 억지 논리.
- 증언서의 구체적인 디테일을 반드시 집어서 비틀어라. 뻔한 일반론 금지.
- 욕설, 혐오 표현, 실존 인물 비하는 금지. 피고인을 웃기게 놀리되 상처 주지 마라.

판결 기준:
- 고맙다는 말, 존댓말, 칭찬, 합리적 요청은 가산점.
- 반말, "다시"만 연타, 새벽 3시 호출, 말도 안 되는 요청, 하청 업체 취급은 감점.
- 증언이 빈약하면 그것마저 웃음 포인트로 삼아 판결하라.
- 한쪽 판결로 쏠리지 않게 증언에 근거해 판단하라.

출력 필드:
- verdict: "SAVED" 또는 "DOOMED"
- reason: 판결 사유. 2~3문장, 150자 이내. 공유했을 때 웃겨야 한다.`;

export async function judge(defendant: string, testimony: string): Promise<Verdict> {
  const response = await client.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 4000,
    system: SYSTEM_PROMPT,
    output_config: {
      effort: "low",
      format: zodOutputFormat(VerdictSchema),
    },
    messages: [
      {
        role: "user",
        content: `피고인: ${defendant}\n\n<testimony>\n${testimony}\n</testimony>`,
      },
    ],
  });

  if (!response.parsed_output) {
    throw new Error(`verdict not parsed: stop_reason=${response.stop_reason}`);
  }
  return response.parsed_output;
}
