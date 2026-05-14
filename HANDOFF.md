# Claude Code CLI로 작업 이어가기

> 현재까지의 작업을 본인 맥북의 Claude Code CLI 환경에서 이어서 진행하기 위한 단계별 가이드.

## 한눈에 보는 현재 상태

| 항목 | 값 |
|---|---|
| 저장소 | `dros-core/poket` |
| 작업 브랜치 | `claude/pokemon-card-tracker-82nfX` |
| 라이브 URL | https://poket-zeta.vercel.app |
| Vercel 프로젝트 | `dros-s-projects/poket` (한국 리전 `icn1`) |
| 최신 커밋 | `d4a5b4f` 실제 박스 패키지 이미지 + 박스 시세 중심 포지셔닝 |
| 빌드 | 84 페이지 정적 prerender |
| 데이터 검증 | ✅ 29 sets × 37 cards 정합성 통과 |

---

## 1단계 — 로컬 환경 준비

### 필수 도구
```bash
# Node 20+ 필요 (현재 v22 사용 중)
node --version

# Git 확인
git --version

# (선택) Vercel CLI — 직접 배포용
npm install -g vercel
```

### Claude Code CLI 설치
```bash
# macOS Homebrew (권장)
brew install anthropic/claude/claude

# 또는 npm
npm install -g @anthropic-ai/claude-code

# 첫 실행 + 로그인
claude
# → 브라우저로 anthropic.com 인증
```

---

## 2단계 — 저장소 클론 + 의존성 설치

```bash
# 1) 저장소 클론
git clone https://github.com/dros-core/poket.git
cd poket

# 2) 작업 브랜치로 체크아웃
git checkout claude/pokemon-card-tracker-82nfX
git pull origin claude/pokemon-card-tracker-82nfX

# 3) 의존성 설치 (425 패키지, ~30초)
npm install

# 4) (선택) TCGdex 캐시 검증 — 이미 커밋되어 있어 보통 불필요
npm run data:verify

# 5) 로컬 개발 서버 시작
npm run dev
# → http://localhost:3000
```

---

## 3단계 — Claude Code CLI로 작업 시작

프로젝트 루트에서:
```bash
cd ~/poket   # 본인 경로로
claude
```

Claude Code가 자동으로 다음을 읽어 컨텍스트를 이해합니다:
- **`CLAUDE.md`** — 프로젝트 메타 가이드 (디자인 원칙, 디렉터리 구조, 작업 규칙)
- **`README.md`** — 사용자 대상 문서
- **`HANDOFF.md`** — 이 문서

### Claude Code 첫 명령 예시
```
사이트 상태를 확인하고 어떤 작업이 남았는지 정리해줘
```

또는 구체적 작업:
```
실제 박스 이미지를 자체 호스팅으로 옮겨줘 — public/box-photos/ 에 저장
```

```
SV5M 사이버저지의 박스 이미지를 추가해줘 (TCGPlayer productId: 565222)
```

---

## 4단계 — 변경사항 배포

### 옵션 A: Vercel CLI 직접 배포 (현재 방식)

본인 Vercel 계정으로 한 번 로그인:
```bash
npx vercel login
# 이메일 또는 GitHub로 인증 (1회)
```

그 다음:
```bash
npm run build              # 빌드 검증
npx vercel --prod          # 프로덕션 배포
# → ~60초 후 URL 발급
```

### 옵션 B: GitHub 자동 배포 (권장)

1. https://vercel.com/dashboard 에서 `dros-s-projects/poket` 프로젝트 열기
2. **Settings → Git** → GitHub 저장소 연결
3. 이후 `git push` 만 하면 자동 배포

### 푸시 전 체크리스트
```bash
npm run typecheck    # TS 검사
npm run build        # 빌드 검증
npm run data:verify  # 데이터 정합성
git add .
git commit -m "..."
git push origin claude/pokemon-card-tracker-82nfX
```

---

## 5단계 — 다음에 할 만한 작업 후보

### 🟢 빠른 개선 (30분~1시간)
- `public/box-photos/sv5m.jpg` 등 자체 박스 사진 추가
  → `setImageMap.boxPhotoUrl` 에 `/box-photos/sv5m.jpg` 매핑
- `SV3a 레이징서프`, `M3 닌자스피너` 의 TCGPlayer productId 발견 시 매핑
- 더 많은 chase 카드 추가 (각 세트 3~5개 → 8~10개로)
- 페이지별 메타데이터 (`og:image` 등) 추가

### 🟡 중간 작업 (2~5시간)
- **실시세 어댑터 구현**: KREAM 박스 시세를 실제 스크래핑
  - `lib/scrapers/adapters/kream.ts` 구현
  - `POKET_USE_LIVE=true` 환경변수로 분기
- **알림 시스템**: 가격 임계치 알림 (Discord webhook 등)
- **포트폴리오 트래커**: 사용자가 보유 박스 등록 → 시세 추이
- **Bento 그리드 대시보드**: features 6개를 비대칭 그리드로

### 🔴 큰 작업 (반나절+)
- **사용자 인증** (Supabase 또는 Auth.js)
- **즐겨찾기 / 알림 구독** (PWA + 푸시)
- **검색 팔레트** (Cmd+K, cmdk 라이브러리)
- **차트 라이브러리 교체** (Recharts → Visx 또는 Tremor)
- **모바일 PWA 매니페스트**

---

## 6단계 — 문제 해결

### 이미지가 안 보일 때
1. 브라우저 콘솔 확인 — `next/image` URL이 어디인지
2. `next.config.mjs` 의 `remotePatterns` 에 호스트가 있는지
3. `npm run data:verify` 실행
4. 원본 URL 직접 fetch 테스트 — `curl -I {url}`

### 빌드 실패 (TypeScript)
```bash
npx tsc --noEmit 2>&1 | head
```

### 모바일 스크롤 빈 화면 회귀
`viewport={{ once: true, amount: 0, margin: "0px 0px -50px 0px" }}` 패턴 유지 필수
(amount > 0 으로 변경 X)

### Vercel 배포 실패
```bash
npx vercel logs poket-zeta.vercel.app
```

---

## 7단계 — Claude Code CLI 활용 팁

### 컨텍스트 관리
- 첫 메시지에 `CLAUDE.md` 핵심 원칙을 다시 한 번 강조하면 일관성 ↑
- 작업이 길어지면 `/clear` 또는 새 세션으로 리프레시
- 파일 수정 후 항상 `npm run typecheck && npm run build` 로 검증

### 권장 워크플로우
```
1. claude → 프로젝트 분석 요청
2. 작업 설명 (예: "박스 상세 페이지에 채널별 가격 비교 차트 추가")
3. Claude의 계획 검토 → 동의 시 진행
4. 빌드 검증 후 커밋 메시지 자동 생성 요청
5. git push (자동 배포 연결 시 즉시 라이브)
```

### 위험한 명령 자동 거부 (Claude Code 기본)
- `rm -rf`, `git reset --hard`, `git push --force` 등은 사용자 확인 필요
- 토큰/시크릿을 채팅에 붙여넣지 말 것 — `.env.local` 사용

---

## 8단계 — 환경변수 / 시크릿

현재 외부 인증 의존성 **없음**. 모든 데이터 소스는 공개 API:
- TCGdex (무료, 키 불필요)
- pokemontcg.io (무료 1K req/day)
- TCGPlayer 상품 이미지 (직접 hotlink)
- PokeAPI sprites (CC0/fair use)

추후 필요 시 `.env.local` 생성 (Git 제외됨):
```bash
# 실시세 활성화 시
POKET_USE_LIVE=true

# 네이버 검색 API (옵션)
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...

# PokemonPriceTracker (옵션, 월 $19)
POKEPRICE_API_KEY=...
```

---

## 빠른 체크 명령

```bash
# 사이트 라이브 상태
curl -I https://poket-zeta.vercel.app/

# 모든 페이지 응답 확인
for path in / /cards /trends /predictions /arbitrage /wholesale /retail /guide; do
  curl -o /dev/null -s -w "$path : %{http_code}\n" "https://poket-zeta.vercel.app$path"
done

# 박스 이미지 정상 응답 확인
curl -I "https://product-images.tcgplayer.com/fit-in/600x600/565243.jpg"

# 로컬 변경사항 확인
git status
git log --oneline -10
```

---

## 도움이 필요할 때

1. **`CLAUDE.md` 먼저 읽기** — 프로젝트 컨텍스트 + 원칙
2. **Claude Code 에게 질문** — 코드베이스를 직접 분석하여 답함
3. **공식 문서**:
   - Next.js: https://nextjs.org/docs
   - Tailwind: https://tailwindcss.com/docs
   - Vercel CLI: https://vercel.com/docs/cli
   - Claude Code: https://docs.claude.com/claude-code

---

## 마지막 점검

이 사이트는 다음을 만족하도록 설계되었습니다:
- ✅ 박스 단위 시세 (개별 카드 시세 아님)
- ✅ 다크 럭셔리 + 절제된 포켓몬 디테일
- ✅ 모바일 우선 (스크롤 가시성 검증됨)
- ✅ 실제 박스 패키지 이미지 (KREAM 스타일)
- ✅ 한국 시세 컨벤션 (상승 빨강 / 하락 파랑)
- ✅ 모든 외부 데이터 무료 + 라이선스 안전

작업 이어갈 때 이 원칙들이 깨지지 않도록 주의하세요.
