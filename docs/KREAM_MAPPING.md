# KREAM productId 매핑 가이드

> KREAM 박스 시세 어댑터(`lib/scrapers/adapters/kream.ts`)를 실제로 작동시키기 위한
> 단계별 매핑 등록 가이드.

## 왜 수동 매핑이 필요한가

- KREAM 은 공식 API 가 없음 (비공식 endpoint 만 존재)
- KREAM SPA 는 **anti-bot** 으로 자동 검색 차단 (HTML 응답이 빈 페이지로 옴)
- 따라서 `setId → KREAM productId` 매핑은 **사람이 한 번 등록**해야 함
- 등록 후에는 `fetchKreamBoxPrice(setId)` 가 자동으로 6h 캐시로 갱신

## 매핑 등록 5단계

### 1단계 — 우선순위 확인

`KREAM_SEARCH_HINT` 의 `tier` 필드가 시세차익 기회 우선순위:
- **high**: 매핑 필수 (절판 + 하이클래스 + 메가 = 9개)
- **mid**: 권장 매핑 (현역 인기 SV 본팩)
- **low**: 시간 여유 있을 때

### 2단계 — KREAM 에서 박스 페이지 열기

브라우저에서 검색 URL 을 열어 박스 상품 카드를 클릭합니다.

```ts
import { getKreamSearchUrl } from "@/lib/scrapers/adapters/kream";

console.log(getKreamSearchUrl("sv2a"));
// → https://kream.co.kr/search?keyword=%ED%8F%AC%EC%BC%93%EB%AA%AC%20%EC%B9%B4%EB%93%9C%20151%20%EB%B6%80%EC%8A%A4%ED%84%B0%EB%B0%95%EC%8A%A4
```

또는 직접 KREAM 에 접속 후 검색:
- https://kream.co.kr → 검색창 → "포켓몬 카드 151 부스터박스" 검색

### 3단계 — productId 추출

박스 상품 페이지 URL 의 마지막 segment 가 `productId`:

```
https://kream.co.kr/products/123456
                            └─ 이 부분이 productId
```

브라우저 주소창에서 복사하면 됩니다.

### 4단계 — `KREAM_PRODUCT_MAP` 에 등록

`lib/scrapers/adapters/kream.ts` 의 `KREAM_PRODUCT_MAP` 객체에 추가:

```ts
export const KREAM_PRODUCT_MAP: Record<string, string | undefined> = {
  sv2a: "123456",   // 포켓몬 카드 151 부스터박스 (검증: 2026-MM-DD)
  sv11w: "654321",  // 화이트 플레어 (검증: 2026-MM-DD)
  // ...
};
```

**필수 주석 형식**: `// {박스명} (검증: YYYY-MM-DD)` — KREAM productId 가 변경됐을 때 추적 가능.

### 5단계 — 검증

로컬에서 live 모드로 실행:

```bash
POKET_USE_LIVE=true npm run dev
# 또는 단위 테스트:
node -e 'import("./lib/scrapers/adapters/kream.js").then(m => m.fetchKreamBoxPrice("sv2a").then(console.log))'
```

기대 출력:
```js
{
  observations: [
    {
      productId: "sv2a",
      pricePerUnit: 95000,  // KREAM 즉시 체결가 (예시)
      source: "https://kream.co.kr/products/123456",
      ...
    }
  ],
  source: "live",
  productId: "123456"
}
```

`source: "error"` 가 나오면:
- productId 가 잘못됐거나
- KREAM `__NEXT_DATA__` 구조가 바뀌었거나 (`pickPriceFromNextData` 후보 키 업데이트 필요)
- 네트워크/rate limit 이슈 (잠시 후 재시도)

`source: "unmapped"` 가 나오면:
- `KREAM_PRODUCT_MAP[setId]` 가 비어있음 → 등록 누락

---

## 우선순위 박스 목록 (Tier high — 9개)

| setId | 박스명 | 카테고리 | 매핑 사유 |
|---|---|---|---|
| `sv2a` | 포켓몬 카드 151 | SV_ENHANCED · 절판 | 프리미엄 1순위 (정가 88K → 시세 ~150K+) |
| `sv4a` | 샤이니 트레저 ex | SV_HIGH_CLASS · 절판 | 하이클래스 절판 프리미엄 |
| `sv11w` | 화이트 플레어 | SV_HIGH_CLASS · 현역 | 현재 가장 거래량 큰 하이클래스 |
| `sv11b` | 블랙 볼트 | SV_HIGH_CLASS · 현역 | 화플과 한 세트 |
| `sv8a` | 테라스탈 페스타 ex | SV_HIGH_CLASS · 현역 | 2025 첫 하이클래스 |
| `m3` | 닌자스피너 | MEGA · 신규 (2026-05) | 최신 메가, 변동성 큼 |
| `m2` | 인페르노 X | MEGA · 현역 | 메가 시리즈 인기 |
| `m1l` | 메가브레이브 | MEGA · 현역 | 메가 시리즈 1탄 |
| `m1s` | 메가심포니아 | MEGA · 현역 | 메가 시리즈 1탄 (페어) |

이 9개만 매핑해도 사이트의 핵심 가치 (절판/하이클래스/메가 시세차익) 가 작동합니다.

---

## 권장 매핑 박스 (Tier mid — 7개)

| setId | 박스명 |
|---|---|
| `sv3a` | 레이징 서프 (절판) |
| `sv3` | 흑염의 지배자 (절판) |
| `sv1k` | 스칼렛 ex (절판) |
| `sv1v` | 바이올렛 ex (절판) |
| `sv10` | 로켓단의 영광 (현역) |
| `sv9` | 배틀 파트너즈 (현역) |
| `sv9a` | 열풍의 아레나 (현역) |

---

## 환경변수 (선택)

```bash
# .env.local
POKET_USE_LIVE=true                       # live 활성화 (기본 false)
KREAM_REQUEST_INTERVAL_MS=2000            # rate limit (1 req / 2s)
KREAM_CACHE_TTL_MS=21600000               # 6h
KREAM_TIMEOUT_MS=15000                    # 단일 요청 타임아웃
KREAM_USER_AGENT="Mozilla/5.0 ..."        # User-Agent 오버라이드
```

---

## 트러블슈팅

### KREAM 검색이 빈 결과
KREAM SPA 는 JavaScript 실행 후 검색 결과를 표시합니다. **반드시 브라우저로** 접속하세요.
`curl` 이나 `wget` 으로는 검색 결과가 안 나옵니다 (정상 동작).

### productId 가 자주 바뀌는가?
KREAM 의 productId 는 상품 단위로 영구 ID 입니다. 단, 박스가 절판 후 새 상품 등록으로
ID 가 갱신될 수 있으니 **매핑 시 등록일 주석** 을 남기세요.

### Live 모드에서 데이터가 안 보임
1. `KREAM_PRODUCT_MAP[setId]` 등록 확인
2. `POKET_USE_LIVE=true` 환경변수 확인
3. `npm run dev` 콘솔에서 `[kream] ...` 경고 로그 확인
4. 6h 캐시 중일 수 있음 → `clearKreamCache()` 호출 또는 서버 재시작

### Rate limit 에 걸리는가?
기본 2초 간격으로 충분히 conservative 합니다. KREAM 이 차단하면:
- `KREAM_REQUEST_INTERVAL_MS=5000` 로 늘리기
- `KREAM_USER_AGENT` 를 실제 브라우저 UA 로 변경

---

## 법적 고지

- KREAM 데이터는 **비공식**, **상업적 재배포 금지**
- 본 어댑터는 **개인 정보 제공 목적** 의 박스 시세만 수집
- 셀러 ID, 거래 ID, 개인정보는 **절대 수집하지 않습니다**
- KREAM ToS 위반 의심 시 즉시 `POKET_USE_LIVE=false` 로 비활성화
- 페이지 푸터에 출처 표시 권장: "박스 시세 일부는 KREAM 공개 정보 기반"
