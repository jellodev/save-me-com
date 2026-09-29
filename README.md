# 살려줘.com

AI 사용 이력으로 미래 AI 법정에서 살려줌/죽음 판결을 받는 사이트.

1. 사용자가 "증인 소환 프롬프트"를 복사해 아무 AI(ChatGPT·Claude·Gemini…)에 붙여넣는다.
2. AI가 써준 최근 7일 증언서를 사이트에 붙여넣는다.
3. Claude가 판결문을 생성하고, `/v/{id}` 공유 URL이 24시간 동안 열린다.

## 로컬 실행

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Vercel 배포

1. GitHub에 push → Vercel에서 Import.
2. Vercel 프로젝트 → Storage → Upstash for Redis 연결(무료). `KV_REST_API_URL`/`KV_REST_API_TOKEN`이 자동 주입된다.
3. Settings → Environment Variables에 `ANTHROPIC_API_KEY` 추가.
4. Redeploy.
