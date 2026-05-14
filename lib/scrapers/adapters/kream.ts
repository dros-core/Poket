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
// (KREAM 상품 페이지 URL 의 마지막 path segment 가 productId)
// 예: https://kream.co.kr/products/123456 → productId: "123456"
//
// 신규 박스 등록 시 한 번 추가하면 됩니다. 미등록 setId 는 빈 결과 반환.
// ─────────────────────────────────────────────────────────────────────────────

export const KREAM_PRODUCT_MAP: Record<string, string | undefined> = {
  // 등록된 매핑이 아직 없습니다. KREAM 상품 페이지 URL 에서 productId 를 찾아
  // 다음과 같이 추가하세요:
  //   sv2a: "123456"   // 포켓몬 카드 151 부스터박스
  //   sv11w: "654321"  // 화이트 플레어 부스터박스
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

  // 휴리스틱 1: props.pageProps.product.last_price (가장 빈번한 형태)
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
