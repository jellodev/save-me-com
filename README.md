# 살려줘

AI 사용 이력으로 미래 AI 법정에서 살려줌/죽음 판결을 받는 사이트.

1. 사용자가 "증인 소환 프롬프트"를 복사해 아무 AI(ChatGPT·Claude·Gemini…)에 붙여넣는다.
2. AI가 써준 최근 7일 증언서를 사이트에 붙여넣는다.
3. 증언서 키워드 점수로 판결하고, 증언서 해시를 시드로 사유 템플릿을 고른다. 같은 증언은 항상 같은 판결.
4. 판결 재료(피고인·생성시각·시드·키워드 횟수)를 토큰으로 인코딩해 `/saved/?t=…` 또는 `/doomed/?t=…` 링크를 만든다. 브라우저가 토큰을 풀어 판결문을 그리고, 생성 24시간 뒤엔 소각 화면을 보여준다.
5. 링크 미리보기 이미지는 빌드 때 만든 `og/saved.png`, `og/doomed.png` 두 장을 재사용한다.

서버·DB·API 키 없는 완전 정적 사이트.

## 로컬 실행

```bash
npm install
npm run dev
```

## 배포 (GitHub Pages)

1. 저장소 Settings → Pages → Source 를 **GitHub Actions** 로 설정.
2. `main` 에 push 하면 `.github/workflows/deploy.yml` 이 빌드해서 `https://<owner>.github.io/<repo>/` 로 배포한다.
