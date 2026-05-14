# Poket — Claude Code 작업 컨텍스트

> 이 파일은 Claude Code (CLI / 웹) 가 프로젝트를 빠르게 이해하도록 작성된 메타 가이드입니다.
> Claude Code 가 자동으로 읽어 후속 작업의 일관성을 보장합니다.

## 프로젝트 개요

**Poket** 은 한국에서 판매되는 포켓몬 카드 **부스터박스(1박스 단위) 시세**를 추적·예측·비교하는
정보형 Next.js 14 웹사이트입니다. 박스/카툰 단위 매수·매도 의사결정의 데이터 레이어를 목표로 합니다.

- **사이트 정체성**: 박스 시세 (개별 카드 시세 아님)
- **라이브**: https://poket-zeta.vercel.app
- **배포**: Vercel (`dros-s-projects/poket`, 한국 리전 `icn1`)
- **저장소**: `dros-core/poket`, 작업 브랜치 `claude/pokemon-card-tracker-82nfX`

## 핵심 원칙 (작업 시 준수)

1. **박스 단위 시세에 집중** — 개별 카드는 박스 EV 계산용으로만 활용. UI 메인 흐름에 노출 X
2. **다크 럭셔리 + 절제된 포켓몬 디테일** — Linear/Goldin/StockX 영감의 차가운 뉴트럴 베이스 +
   메탈릭 골드 액센트 + 시그널로만 사용하는 포켓몬 컬러
3. **한국 시세 컨벤션** — 상승 = 빨강 (`--up #ff5050`), 하락 = 파랑 (`--down #6BA0E0`)
4. **다크가 시그니처** — `data-theme="dark"` 하드코딩, 라이트는 토글로만
5. **이미지 안정성** — 모든 외부 이미지는 `next.config.mjs` remotePatterns 등재 필수
6. **모바일 우선** — viewport `{ once: true, amount: 0, margin: "0px 0px -50px 0px" }` 패턴
7. **데이터 검증** — 시드 변경 시 `npm run data:verify` 통과 필수

## 디렉터리 구조

```
app/
  page.tsx                 # 대시보드 (Hero + 박스 showcase + KPI + 차익)
  cards/page.tsx           # 박스 시세 마켓 (29 세트)
  cards/[id]/page.tsx      # 박스 상세 (시세 추이, EV, 채널 비교)
  cards/single/[id]/       # 개별 카드 (메뉴 숨김. EV용으로만 존재)
  trends/                  # 시세 추이 분석
  predictions/             # 90일 가격 예측
  arbitrage/               # 채널간 차익 기회
  wholesale/, retail/      # 도매·소매·해외 구매처
  guide/[slug]/            # 시장·전략·법무·그레이딩·데이터 가이드

components/
  brand/
    PokeballLogo.tsx       # 자체 SVG 로고 (라이선스 안전)
    PokemonMascot.tsx      # PokeAPI 공식 아트워크 17종
    EnergyIcons.tsx        # 10종 에너지 심볼 SVG
  layout/
    Header.tsx             # Sticky + 모바일 드로어
    Hero.tsx               # 메인 hero (BorderBeam + Spotlight + 마스코트)
    PageHero.tsx           # 카테고리 페이지 공통 hero
    MobileBottomNav.tsx    # 모바일 바텀 네비 5탭
    Footer.tsx             # Goldin 스타일 footer
  cards/
    SetCard.tsx            # 박스 카드 (BoxMockup + 시세)
    BoxMockup.tsx          # 박스 패키지 표현 (실 사진 우선, mockup 폴백)
    CardImage.tsx          # 카드 이미지 + onError 폴백
    ChannelCard.tsx        # 구매처 카드
    FeaturedCardShowcase.tsx  # 큰 박스 1장 + 사이드 3장
    Sparkline.tsx          # 의존성 없는 SVG 스파크라인
  charts/
    PriceTrendChart.tsx    # Robinhood식 호버 동기화 + 시간 토글
  tables/
    ArbitrageTable.tsx     # 데스크 테이블 + 모바일 카드
    TrendsTable.tsx
    PredictionsTable.tsx
  ui/
    Spotlight.tsx          # 마우스 추적 글로우
    BorderBeam.tsx         # Magic UI 패턴 보더 빔
    Marquee.tsx            # 무한 스크롤
    Stat.tsx               # KPI 통계 카드
    motion.tsx             # Reveal, StaggerGroup (viewport 안전화됨)
    Badge.tsx, Skeleton.tsx, AnimatedCounter.tsx

lib/
  types.ts                 # 도메인 모델 (CardSet, Card, PriceObservation 등)
  format.ts                # KRW/JPY/USD 포매터
  data/
    repository.ts          # 단일 데이터 접근 진입점
    imageResolver.ts       # 박스/카드 이미지 URL 해소 (TCGdex → 직접 빌드 → pokemontcg.io → placeholder)
    tcgdexCache.ts         # TCGdex 캐시 로더
    pokemontcgCache.ts     # pokemontcg.io 캐시 로더
  prediction/
    forecast.ts            # Holt's Linear ES 자체 구현
    expectedValue.ts       # 박스 EV 계산기
    arbitrage.ts           # 채널간 차익 탐지
  scrapers/
    adapters/tcgdex.ts     # TCGdex 어댑터 (현재 stub, 실시세 연결 지점)

data/
  seed/
    sets.ts                # 한국 정발 29개 세트
    cards.ts               # 37개 chase 카드
    channels.ts            # 28개 구매처
    guides.ts              # 6개 가이드
    priceHistory.ts        # 합성 시계열 생성기
    setImageMap.ts         # 세트 ID ↔ 이미지 소스 매핑 (TCGPlayer productId 포함)
  cache/
    tcgdex/*.json          # 31개 세트 카드 메타 (커밋됨, ~530KB)
    pokemontcg/*.json      # 6개 세트 (me1~me3, sv11W/B 등)

scripts/
  prefetch-tcgdex.mjs      # TCGdex 메타 사전 패치
  prefetch-pokemontcg.mjs  # pokemontcg.io 메타 사전 패치
  verify-data.mjs          # 시드 ↔ 캐시 정합성 검증
  verify-images.mjs        # 모든 이미지 URL HTTP 200 검증
```

## NPM 스크립트

```bash
npm run dev               # http://localhost:3000
npm run build             # 정적 빌드 (84 페이지 prerender)
npm run typecheck         # TypeScript 검사
npm run data:prefetch     # TCGdex 캐시 갱신 (캐시 있으면 스킵)
npm run data:prefetch:force  # 강제 재패치
npm run data:verify       # 시드↔캐시 정합성 검증
```

## 디자인 토큰

### 컬러
- `--bg` `#0a0a0d` (다크 베이스)
- `--bg-card` `#131318` (카드 표면)
- `--fg` `#ededf3` (텍스트 primary)
- `--up` `#ff5050` (시세 상승)
- `--down` `#6BA0E0` (시세 하락)
- `--accent` `#FFCB05` (메탈릭 골드 / Pikachu Yellow)
- 포켓몬 타입 18색 (`type.fire`, `type.water` 등)

### 폰트
- `font-display` Fraunces (서리프 럭셔리 헤딩)
- `font-ui` Geist (모던 UI)
- `font-sans` Pretendard (한글 본문)
- `font-mono` JetBrains Mono (수치)
- `font-pixel` Press Start 2P (절제하여 라이브 칩만)

## 데이터 소스 정합성

이미지 폴백 체인:
1. `setImageMap.boxPhotoUrl` (TCGPlayer 또는 자체 호스팅)
2. TCGdex 캐시 (일본어 우선)
3. TCGdex 직접 URL 빌드 (`https://assets.tcgdex.net/ja/SV/{set}/{id}/high.webp`)
4. pokemontcg.io 캐시 (메가 시리즈, 카드 일러스트만)
5. placeholder SVG (포켓볼 outline)

검증된 결과 (`npm run data:verify`):
- ✅ 29 sets × 37 cards 모두 데이터 정합성 통과
- ✅ 28/29 세트 박스 패키지 이미지 (TCGPlayer 공식)

## 작업 가이드

### 새 세트 추가
1. `data/seed/sets.ts` 에 CardSet 추가
2. `data/seed/setImageMap.ts` 에 매핑 추가 (tcgdexId, heroCardLocalId, boxPhotoUrl)
3. `npm run data:prefetch` (TCGdex 캐시 갱신)
4. `npm run data:verify` 통과 확인
5. 필요 시 `cards.ts` 에 chase 카드 추가

### 새 페이지 추가
- `PageHero` 컴포넌트 사용 + 마스코트 매핑
- 모션은 `Reveal`, `StaggerGroup`, `StaggerItem` 사용 (viewport 안전화됨)
- 다크모드 시 `var(--fg)`, `var(--bg)` 등 CSS 변수만 사용

### 실시세 데이터 연결 (미구현)
- `lib/scrapers/adapters/{kream,bungae,icu,tcgbox}.ts` 어댑터 구현
- `lib/data/repository.ts` 에서 `process.env.POKET_USE_LIVE === "true"` 분기
- 캐시 정책: 박스 6h, 싱글 24h, 메타 30d

## 배포

### Vercel (현재 방식)
```bash
npx vercel --prod --scope=dros-s-projects
# 토큰 사용 시: npx vercel --prod --token=$VERCEL_TOKEN --scope=dros-s-projects
```

### 자동 배포 (선택)
GitHub remote 연결 시 push로 자동 재배포. `vercel.json` 이미 설정됨 (한국 리전 `icn1`).

## 주요 외부 의존성

- **next 14.2.18** App Router
- **framer-motion 11** (모션)
- **recharts 2.13** (차트)
- **lucide-react** (아이콘)
- **tailwindcss 3.4**

새 의존성 추가 시 신중히. 현재 First Load JS 130~155KB 유지.

## 라이선스 주의

- 카드/박스 이미지: TCGdex CDN, TCGPlayer, pokemontcg.io 의 공개 hotlink 자산
- Pokemon 캐릭터 아트워크: PokeAPI sprites (fan-use 영역)
- 포켓볼 로고: 자체 SVG (라이선스 안전)
- Footer 의 저작권 표시 필수: `© Nintendo · Creatures · GAME FREAK · TPCi`
