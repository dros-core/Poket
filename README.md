# Poket — 한국 포켓몬 카드 시세 · 예측 · 구매처 통합 플랫폼

> 한국에서 판매되는 포켓몬 카드(박스/카툰/싱글)의 시세를 추적·예측하고, 도매·소매·해외 직구 채널을 비교하여 시세차익(아비트라지) 의사결정을 한곳에서 지원하는 정보형 웹사이트.

## 핵심 기능

- **카드 / 박스 시세 추적** — 한국 정식 발매 SV(스칼렛&바이올렛) ~ 메가 진화 시리즈 박스의 정가/시세/30일·90일/누적 변화율
- **시세 추이 시각화** — 박스/싱글 1년치 추세선 + 변동 밴드(min/max)
- **가격 예측** — `Holt's Linear Exponential Smoothing` 기반 90일 예측 + 95% 신뢰구간 (외부 라이브러리 0, 메모리 부담 없는 경량 통계 모델)
- **박스 EV(기대값)** — 봉입률 × 싱글 시세로 박스 ROI 자동 계산. RIP / HOLD / FLIP 권장
- **차익 기회 탐지** — 채널간 가격 갭 자동 탐지 + 수수료/배송비 차감 후 NET 수익
- **도매·소매·P2P·해외 구매처 가이드** — 포켓몬코리아 공인 카드샵 / 아카토이 / KREAM / 너정다(ICU) / 번개장터 / Amazon JP / Mercari 등
- **그레이딩 가이드** — BRG (한국) / PSA Japan / PSA US 비용·소요시간·예상 가치 비교
- **법무·세무 가이드** — 사업자등록 / 통신판매업 신고 / 면세 한도(USD 150) / 관세

## 기술 스택

- **Next.js 14** (App Router, TypeScript, RSC)
- **Tailwind CSS** + 커스텀 디자인 토큰 (라이트/다크)
- **Recharts** 시계열 차트
- **lucide-react** 아이콘
- 외부 ML/통계 라이브러리 의존성 0 — 예측 모델은 자체 경량 구현

## 빠른 시작

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 정적 빌드 (Vercel/Netlify 즉시 배포 가능)
npm run typecheck
```

## 프로젝트 구조

```
app/
  page.tsx                  # 대시보드
  cards/                    # 박스 목록 + 상세
    [id]/page.tsx
    single/[id]/page.tsx
  trends/page.tsx           # 시세 추이 표
  predictions/page.tsx      # 가격 예측 표
  arbitrage/page.tsx        # 차익 기회 표
  wholesale/page.tsx        # 도매 채널
  retail/page.tsx           # 소매·P2P·해외 채널
  guide/[slug]/page.tsx     # 가이드 상세
  api/sets/route.ts         # 데이터 JSON API
components/
  layout/                   # Header/Footer/ThemeToggle
  ui/                       # Stat, Badge
  charts/                   # PriceTrendChart (Recharts)
  cards/                    # SetCard, ChannelCard
lib/
  types.ts                  # 도메인 모델
  format.ts                 # KRW/JPY/USD 포매터
  data/repository.ts        # 데이터 접근 레이어 (단일 진입점)
  prediction/
    forecast.ts             # Holt's Linear ES
    expectedValue.ts        # 박스 EV 계산
    arbitrage.ts            # 채널간 차익 탐지
  scrapers/                 # 어댑터 인터페이스 + README
data/
  seed/
    sets.ts                 # 한국 정발 박스 (sv1S ~ 메가 인페르노 X)
    cards.ts                # 인기 싱글
    channels.ts             # 도매·소매·P2P·해외 채널
    guides.ts               # 가이드 콘텐츠
    priceHistory.ts         # 합성 시계열 (lifecycle 모델 기반)
```

## 데이터 통합 가이드 (실시세 연결)

현재 프로젝트는 **`data/seed/`의 합성 시계열**로 동작합니다. 합성기는 한국 시장의 가격 라이프사이클(발매 직후 프리미엄 → 안정화 → 절판 후 재상승)을 모델링합니다. 실시세 연결은 다음 어댑터를 구현하면 됩니다.

### 1차 데이터 소스 (한국)

| 소스 | 데이터 | 접근 방식 | 비고 |
| --- | --- | --- | --- |
| [KREAM](https://kream.co.kr) | 박스 체결가/거래량 | 비공식 내부 API | **박스 시세의 표준** |
| [너정다 ICU.gg](https://icu.gg) | 한·일·영 싱글 시세 | HTML 파싱, rate-limit 준수 | **싱글 시세의 표준** |
| [TCGBOX](https://tcgbox.co.kr) | 박스/싱글 실판매가 | 페이지 파싱 | 세트 코드 명확 |
| [번개장터](https://m.bunjang.co.kr) | P2P 호가 | `api.bunjang.co.kr/api/1/find_v2.json` (비공식) | robots.txt 허용 |
| [네이버쇼핑](https://search.shopping.naver.com) | 정가/온라인 소매 | [네이버 검색 API](https://developers.naver.com/docs/serviceapi/search/shopping/shopping.md) | 25K req/day 무료 |

### 2차 데이터 소스 (글로벌, 메타데이터)

| 소스 | 데이터 | 인증 | 비고 |
| --- | --- | --- | --- |
| [TCGdex](https://tcgdex.dev) | 다국어 카드 메타 (한국어 포함) | 키 불필요, 무제한 | **카드 메타데이터 표준** |
| [pokemontcg.io](https://docs.pokemontcg.io) | 카드 + USD/EUR 시세 | 무료 1K/day, 키 시 20K | TCGPlayer + Cardmarket 가격 |
| [PokemonPriceTracker](https://www.pokemonpricetracker.com) | PSA 8/9/10 이력 + EV | 월 $19~ | EV calculator 표준 |
| [TCGCSV](https://tcgcsv.com) | TCGPlayer 무료 CSV 덤프 | 키 불필요 | 배치 작업용 |
| [Pokemon-API](https://www.pokemon-api.com) | eBay sold median | 키 필요 | 그레이드 슬랩 |

### 일본 시세 (한국 프리미엄 형성에 영향)

- **Mercari JP** — 일판 싱글 1차 소스 (배대지 필수: 메루카이/Buyee/5-duck/Kaerumall)
- **Card Rush** `cardrush-pokemon.jp` — 일본 전문샵 매수/매도가 공시
- **Yahoo Auctions JP** — 빈티지 강세

### 환율·관세

- [한국은행 ECOS API](https://ecos.bok.or.kr) — 무료 (키 필요)
- [관세청 예상세액 조회](https://www.customs.go.kr/kcs/ad/tax/BuyTaxCalculation.do)

### 어댑터 구현 패턴

```ts
// lib/scrapers/adapters/kream.ts
import type { PriceObservation } from "@/lib/types";

export async function fetchKreamBoxPrice(setName: string): Promise<PriceObservation[]> {
  // 1. fetch with rate-limit (1 req / 2s 권장)
  // 2. parse JSON / HTML
  // 3. map → PriceObservation
  return [];
}
```

`POKET_USE_LIVE=true` 환경변수로 분기:

```ts
// lib/data/repository.ts
if (process.env.POKET_USE_LIVE === "true") {
  return await fetchKreamBoxPrice(setName);
}
```

캐시 전략: `data/cache/`에 SQLite/JSON 저장, TTL 6h(박스) / 24h(싱글) / 30d(메타).

## 한국 시장 표준 가격 레퍼런스 (2026-05 기준)

| 단위 | 정가 (대략) | 비고 |
| --- | ---: | --- |
| 30팩 박스 | 117,000원 | 팩당 4,500~5,000원 |
| 20팩 박스 (예: 151) | 88,000원 | 강화확장팩 |
| 10팩 하이클래스 | 88,000원 | 테라스탈 페스타 등 |
| 카툰 (6박스) | 약 700,000원 | 한국 표준 |
| 공인 카드샵 도매가 | 정가의 70~80% | 사업자/매장 자격 필수 |

## 법적 고지

- 본 프로젝트는 **정보 제공 목적**이며 직접 거래를 중개하지 않습니다.
- 시세 데이터는 공개 자료 기반 추정치로 실거래가와 차이가 있을 수 있습니다.
- 거래 알선/중개 기능을 추가할 경우 통신판매중개업 신고 의무가 발생합니다.
- 카드 이미지 사용 시 ⓒ The Pokémon Company / 포켓몬코리아의 라이선스를 준수해야 합니다.
- 자세한 사항은 `/guide/legal-tax` 페이지 참고.

## 라이선스

이 저장소의 코드는 학습/연구 목적으로 자유롭게 사용 가능합니다. 다만 상업적 사용 전 각 데이터 소스의 ToS를 별도 확인하시기 바랍니다.
