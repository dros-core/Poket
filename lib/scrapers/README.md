# Scraper Adapters

이 디렉터리는 실제 시세 데이터를 수집하기 위한 어댑터 인터페이스를 정의합니다.
현재 코드베이스는 `data/seed/` 의 합성 데이터를 사용해 동작하지만,
아래 어댑터를 구현 + `lib/data/repository.ts` 에 연결하면 실시세로 즉시 교체됩니다.

## 권장 데이터 소스 (요약)

| 소스 | 데이터 | API/접근 | 비고 |
| --- | --- | --- | --- |
| **번개장터** | 한국 P2P 박스/싱글 시세 | 비공식 (검색 페이지 파싱) | robots.txt 준수, 1 req/2s 권장. 시세 1차 소스 |
| **포카타임** | 한국 시세 인덱스 | 비공식 | 모바일 앱 위주. 페이지 캐시 활용 |
| **카드포레스트** | 시세/거래 통계 | 비공식 | 대시보드 형태 데이터 |
| **네이버쇼핑** | 정가/온라인 소매 | [네이버 검색 API](https://developers.naver.com/docs/serviceapi/search/shopping/shopping.md) | 일 25,000회 무료 |
| **eBay** | 글로벌 시세 (Sold) | [eBay Browse API](https://developer.ebay.com/api-docs/buy/browse/overview.html) | OAuth 필요 |
| **TCGPlayer** | 영문판 표준 시세 | [TCGPlayer API](https://docs.tcgplayer.com/) | 파트너 승인 필요 |
| **PokemonTCG.io** | 카드 메타데이터 + USD 시세 | [API 키 무료](https://pokemontcg.io/) | 카드 이미지/속성 |
| **PriceCharting** | 박스/싱글 시세 (글로벌) | [API](https://www.pricecharting.com/api-documentation) | 유료 |
| **Mercari JP** | 일판 싱글 시세 | 비공식 | 일본 IP 권장. 배대지 가격 산출 시 활용 |
| **PSA / Beckett** | 그레이딩 카드 인구통계/가격 | [PSA API](https://www.psacard.com/api) | 인증 필요 |

## 어댑터 구현 패턴

```ts
// lib/scrapers/adapters/bungae.ts
import type { PriceObservation } from "@/lib/types";

export async function fetchBungaePrices(query: string): Promise<PriceObservation[]> {
  // 1. fetch with appropriate User-Agent + delays
  // 2. parse HTML or JSON
  // 3. dedupe + return
  return [];
}
```

`lib/data/repository.ts` 에서 환경변수 `POKET_USE_LIVE=true` 일 때 어댑터로 교체:

```ts
if (process.env.POKET_USE_LIVE === "true") {
  return await fetchBungaePrices(setId);
}
```

## 캐시 정책

`data/cache/` 디렉터리에 어댑터별 SQLite 또는 JSON 캐시 저장:
- 박스 시세: 6시간 TTL
- 싱글 시세: 24시간 TTL
- 카드 메타데이터: 30일 TTL

## 법적 고려

- **robots.txt 준수**, ToS 위반 회피
- 개인정보 수집 절대 금지 (셀러 ID, 연락처 등)
- 상업적 사용 시 각 플랫폼 라이선스 확인
- 쿠팡/11번가 등 대형 플랫폼은 공식 API 우선 사용
