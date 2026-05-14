/**
 * KREAM 박스 시세 스크래퍼 어댑터
 *
 * KREAM 은 한국 박스 시세의 1차 소스 (CLAUDE.md "박스 시세의 표준") 이지만 공식 API 가 없습니다.
 * 본 어댑터는 다음 원칙으로 동작:
 *
 *  - robots.txt 준수: `/my*`, `/history*` 차단, 그 외 `Allow: /`
 *  - 1 요청 / 2초 이상 간격 (rate limit)
 *  - User-Agent 명시: `PoketBot/0.1 (+https://poket-zeta.vercel.app)`
 *  - 비공식 endpoint 변경 가능 → `KREAM_*` 환경변수로 주입
 *  - 실패 시 throw 대신 빈 배열 + console.warn → repository 가 seed 로 자연 폴백
 *  - 세트 ID ↔ KREAM productId 매핑은 모듈 로컬 상수 (수동 등록)
 *
 * 활성화:
 *   POKET_USE_LIVE=true
 *   KREAM_SEARCH_URL=https://kream.co.kr/search?keyword=  (선택)
 *   KREAM_PRODUCT_URL=https://kream.co.kr/products/       (선택)
 *
 * @see lib/scrapers/README.md
 * @see docs/KREAM_MAPPING.md  ← productId 검증/등록 가이드
 */

import type {
  Currency,
  Marketplace,
  PriceObservation,
  ProductCategory,
  ChannelType
} from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// 설정
// ─────────────────────────────────────────────────────────────────────────────

const KREAM_SEARCH_URL = process.env.KREAM_SEARCH_URL ?? "https://kream.co.kr/search";
const KREAM_PRODUCT_URL = process.env.KREAM_PRODUCT_URL ?? "https://kream.co.kr/products";
const KREAM_USER_AGENT =
  process.env.KREAM_USER_AGENT ??
  "Mozilla/5.0 (compatible; PoketBot/0.1; +https://poket-zeta.vercel.app)";
const KREAM_REQUEST_INTERVAL_MS = Number(process.env.KREAM_REQUEST_INTERVAL_MS ?? 2_000);
const KREAM_TIMEOUT_MS = Number(process.env.KREAM_TIMEOUT_MS ?? 15_000);
const KREAM_CACHE_TTL_MS = Number(process.env.KREAM_CACHE_TTL_MS ?? 6 * 60 * 60 * 1000); // 6h

// ─────────────────────────────────────────────────────────────────────────────
// 세트 ID ↔ KREAM productId 수동 매핑
//
// 등록 방법 (docs/KREAM_MAPPING.md 참조):
//   1) 아래 KREAM_SEARCH_HINT 의 검색 URL 을 브라우저로 열기
//   2) 박스 상품 카드 클릭 → URL 마지막 segment 가 productId
//      예: https://kream.co.kr/products/123456 → "123456"
//   3) 아래 KREAM_PRODUCT_MAP 에 추가: sv2a: "123456"
//   4) `POKET_USE_LIVE=true npm run dev` 로 검증
//
// ⚠️  KREAM 은 anti-bot 으로 자동 검색이 차단됩니다 → 사용자가 수동으로 검증해야 합니다.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 인기 박스의 KREAM 검색 힌트. productId 는 사용자가 수동 등록.
 * 우선순위는 시세차익 기회가 큰 박스 (절판/하이클래스/메가) 순.
 */
export const KREAM_SEARCH_HINT: Record<string, { keyword: string; tier: "high" | "mid" | "low" }> = {
  // === 절판 (프리미엄 형성, 시세차익 1순위) ===
  sv2a: { keyword: "포켓몬 카드 151 부스터박스", tier: "high" }, // 절판, 강화확장팩
  sv4a: { keyword: "포켓몬 샤이니 트레저 ex 박스", tier: "high" }, // 절판, 하이클래스
  sv3a: { keyword: "포켓몬 레이징 서프 박스", tier: "mid" }, // 절판, SV 본팩
  sv3: { keyword: "포켓몬 흑염의 지배자 박스", tier: "mid" }, // 절판
  sv1k: { keyword: "포켓몬 스칼렛 ex 박스", tier: "mid" }, // 절판
  sv1v: { keyword: "포켓몬 바이올렛 ex 박스", tier: "mid" }, // 절판

  // === 현역 하이클래스 (수요 강함) ===
  sv11w: { keyword: "포켓몬 화이트 플레어 박스", tier: "high" },
  sv11b: { keyword: "포켓몬 블랙 볼트 박스", tier: "high" },
  sv8a: { keyword: "포켓몬 테라스탈 페스타 박스", tier: "high" },

  // === 메가 시리즈 (신규, 변동성 큼) ===
  m3: { keyword: "포켓몬 닌자스피너 박스", tier: "high" }, // 2026-05 발매
  m2: { keyword: "포켓몬 인페르노 X 박스", tier: "high" },
  m1l: { keyword: "포켓몬 메가브레이브 박스", tier: "high" },
  m1s: { keyword: "포켓몬 메가심포니아 박스", tier: "mid" },

  // === 현역 SV 본팩 (정가 부근) ===
  sv10: { keyword: "포켓몬 로켓단의 영광 박스", tier: "mid" },
  sv9: { keyword: "포켓몬 배틀 파트너즈 박스", tier: "mid" },
  sv9a: { keyword: "포켓몬 열풍의 아레나 박스", tier: "mid" },
  sv8: { keyword: "포켓몬 초전 브레이커 박스", tier: "low" },
  sv7: { keyword: "포켓몬 스텔라 미라클 박스", tier: "low" },
  sv7a: { keyword: "포켓몬 낙원 드래고나 박스", tier: "low" },
  sv6: { keyword: "포켓몬 변환의 가면 박스", tier: "low" },
  sv6a: { keyword: "포켓몬 나이트 원더러 박스", tier: "low" },
  sv5k: { keyword: "포켓몬 와일드포스 박스", tier: "low" },
  sv5m: { keyword: "포켓몬 사이버저지 박스", tier: "low" }
};

export function getKreamSearchUrl(setId: string): string | null {
  const hint = KREAM_SEARCH_HINT[setId];
  if (!hint) return null;
  return `${KREAM_SEARCH_URL}?keyword=${encodeURIComponent(hint.keyword)}`;
}

/**
 * 검증된 매핑만 여기에 등록.
 *
 * 사용자가 KREAM 상품 페이지에서 productId 를 확인 후 추가하세요.
 * 예시:
 *   sv2a: "123456",   // 포켓몬 카드 151 부스터박스 (검증: 2026-05-14)
 *   sv11w: "654321",  // 화이트 플레어 (검증: 2026-05-14)
 */
export const KREAM_PRODUCT_MAP: Record<string, string | undefined> = {
  // 매핑 비어 있음 — docs/KREAM_MAPPING.md 의 단계별 가이드를 참조하여 등록하세요.
};

// ─────────────────────────────────────────────────────────────────────────────
// Rate limit 큐 + 캐시
// ─────────────────────────────────────────────────────────────────────────────

let lastRequestAt = 0;

interface CacheEntry {
  observations: PriceObservation[];
  fetchedAt: number;
}
const cache = new Map<string, CacheEntry>();

async function rateLimitedFetch(url: string, init?: RequestInit): Promise<Response | null> {
  const wait = Math.max(0, KREAM_REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestAt = Date.now();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), KREAM_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        "User-Agent": KREAM_USER_AGENT,
        "Accept-Language": "ko-KR,ko;q=0.9",
        Accept: "text/html,application/json",
        ...init?.headers
      }
    });
    return res;
  } catch (err) {
    console.warn(`[kream] fetch 실패: ${url}`, err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML 파싱 헬퍼
// ─────────────────────────────────────────────────────────────────────────────

/**
 * KREAM SPA 의 SSR HTML 에 박힌 `__NEXT_DATA__` 스크립트를 파싱.
 * 형식 변경 가능성 있으므로 실패 시 null.
 */
function extractNextData<T = unknown>(html: string): T | null {
  const match = html.match(
    /<script[^>]+id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/
  );
  if (!match) return null;
  try {
    return JSON.parse(match[1]) as T;
  } catch {
    return null;
  }
}

/**
 * 상품 페이지에서 최근 체결가 (즉시 구매 / 즉시 판매) 추출.
 * KREAM 의 정확한 구조는 비공식이므로, 여러 후보 키를 시도.
 */
function pickPriceFromNextData(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;

  const candidates: Array<(d: any) => number | null | undefined> = [
    (d) => d?.props?.pageProps?.product?.last_price,
    (d) => d?.props?.pageProps?.product?.recent_price,
    (d) => d?.props?.pageProps?.product?.market_price,
    (d) => d?.props?.pageProps?.initialState?.product?.lastPrice,
    (d) => d?.props?.pageProps?.product?.price
  ];

  for (const get of candidates) {
    const v = get(data);
    if (typeof v === "number" && Number.isFinite(v) && v > 0) return v;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// 공개 API
// ─────────────────────────────────────────────────────────────────────────────

export interface KreamFetchResult {
  observations: PriceObservation[];
  source: "cache" | "live" | "unmapped" | "error";
  productId?: string;
}

/**
 * setId 로 KREAM 박스 체결가를 가져옵니다.
 *
 * 흐름:
 *   1) KREAM_PRODUCT_MAP[setId] 조회 → 없으면 unmapped 반환
 *   2) 캐시 hit (6h TTL) 시 즉시 반환
 *   3) /products/{productId} HTML fetch → __NEXT_DATA__ 파싱 → 가격 추출
 *   4) PriceObservation 생성 + 캐시 저장
 *
 * 실패 시 throw 하지 않고 빈 배열 반환 → repository 가 seed 로 폴백.
 */
export async function fetchKreamBoxPrice(setId: string): Promise<KreamFetchResult> {
  const productId = KREAM_PRODUCT_MAP[setId];
  if (!productId) {
    return { observations: [], source: "unmapped" };
  }

  const cacheKey = `set:${setId}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < KREAM_CACHE_TTL_MS) {
    return { observations: cached.observations, source: "cache", productId };
  }

  const url = `${KREAM_PRODUCT_URL}/${productId}`;
  const res = await rateLimitedFetch(url);
  if (!res || !res.ok) {
    if (res) {
      console.warn(`[kream] ${setId} (${productId}): HTTP ${res.status}`);
    }
    return { observations: [], source: "error", productId };
  }

  const html = await res.text();
  const next = extractNextData(html);
  const price = pickPriceFromNextData(next);

  if (!price) {
    console.warn(`[kream] ${setId} (${productId}): __NEXT_DATA__ 에서 가격 추출 실패`);
    return { observations: [], source: "error", productId };
  }

  const observation: PriceObservation = {
    id: `kream-${productId}-${Date.now()}`,
    productId: setId,
    productKind: "SET",
    category: "BOOSTER_BOX" satisfies ProductCategory,
    marketplace: "BUNGAE" satisfies Marketplace, // KREAM 전용 enum 부재 → P2P 채널 분류
    channel: "P2P" satisfies ChannelType,
    pricePerUnit: price,
    currency: "KRW" satisfies Currency,
    unitDescription: "박스",
    observedAt: new Date().toISOString(),
    source: url,
    note: "KREAM 즉시 체결가 (비공식 데이터)"
  };

  const result = { observations: [observation], source: "live" as const, productId };
  cache.set(cacheKey, { observations: result.observations, fetchedAt: Date.now() });
  return result;
}

/**
 * 모든 매핑된 setId 의 KREAM 박스 시세를 병렬로 (rate-limit 큐 통과) 수집.
 * 빌드/크론용. 절대 throw 하지 않음.
 */
export async function fetchAllKreamBoxPrices(): Promise<PriceObservation[]> {
  const setIds = Object.keys(KREAM_PRODUCT_MAP).filter((k) => KREAM_PRODUCT_MAP[k]);
  const results: PriceObservation[] = [];
  for (const setId of setIds) {
    const r = await fetchKreamBoxPrice(setId);
    results.push(...r.observations);
  }
  return results;
}

/**
 * 테스트/개발용: 캐시 강제 무효화.
 */
export function clearKreamCache(): void {
  cache.clear();
  lastRequestAt = 0;
}

// 기존 Scraper 인터페이스 호환 (lib/scrapers/index.ts)
export const kreamScraper = async (query: string): Promise<PriceObservation[]> => {
  const r = await fetchKreamBoxPrice(query);
  return r.observations;
};
