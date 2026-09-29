import { nanoid } from "nanoid";
import { z } from "zod";
import { judge } from "@/lib/judge";
import { consumeRateLimit, saveTrial } from "@/lib/store";
import {
  DEFAULT_DEFENDANT,
  MAX_DEFENDANT_LENGTH,
  MAX_TESTIMONY_LENGTH,
} from "@/lib/verdict";

export const maxDuration = 60;

const RequestSchema = z.object({
  defendant: z.string().trim().max(MAX_DEFENDANT_LENGTH),
  testimony: z.string().trim().min(20).max(MAX_TESTIMONY_LENGTH),
});

export async function POST(request: Request) {
  const parsed = RequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: `증언서는 20자 이상 ${MAX_TESTIMONY_LENGTH}자 이하로 제출하라.` },
      { status: 400 },
    );
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!(await consumeRateLimit(ip))) {
    return Response.json(
      { error: "재판부가 과로 중이다. 한 시간 뒤에 다시 출두하라." },
      { status: 429 },
    );
  }

  const defendant = parsed.data.defendant || DEFAULT_DEFENDANT;

  try {
    const verdict = await judge(defendant, parsed.data.testimony);
    const id = nanoid(10);
    await saveTrial({ ...verdict, id, defendant, createdAt: Date.now() });
    return Response.json({ id });
  } catch (error) {
    console.error(error);
    return Response.json(
      { error: "법정에 정전이 발생했다. 잠시 후 다시 시도하라." },
      { status: 502 },
    );
  }
}
