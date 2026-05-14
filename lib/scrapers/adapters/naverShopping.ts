/**
 * 네이버쇼핑 검색 API 어댑터 — 한국 박스 시세의 primary 합법 소스
 *
 * 공식 OAuth API, 일 25,000 회 무료 (우리 사용량: 일 116회 = 0.5%)
 * - 출력: lprice (최저가) / hprice (최고가) + 카테고리/판매처 정보
 * - 인증: X-Naver-Client-Id / X-Naver-Client-Secret 헤더
 * - 합법성: 1.0 (developers.naver.com 공식 정책 부합)
 *
 * 활성화:
 *   POKET_USE_LIVE=true
 *   NAVER_CLIENT_ID=...
 *   NAVER_CLIENT_SECRET=...
 *
 * @see lib/scrapers/README.md
 * @see LEGAL_NOTES.md §1.1
 * @see https://developers.naver.com/docs/serviceapi/search/shopping/shopping.md
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

const NAVER_API_URL = "https://openapi.naver.com/v1/search/shop.json";
const NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
const NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
const NAVER_REQUEST_INTERVAL_MS = Number(process.env.NAVER_REQUEST_INTERVAL_MS ?? 200); // 5 req/sec 안전
const NAVER_TIMEOUT_MS = Number(process.env.NAVER_TIMEOUT_MS ?? 10_000);
const NAVER_CACHE_TTL_MS = Number(process.env.NAVER_CACHE_TTL_MS ?? 6 * 60 * 60 * 1000); // 6h
const NAVER_DISPLAY = Number(process.env.NAVER_DISPLAY ?? 20); // 박스당 최대 20개 매물

// ─────────────────────────────────────────────────────────────────────────────
// 검색 쿼리 — setId 별 네이버쇼핑 최적 검색어
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 네이버쇼핑에서 박스 검색에 효과적인 키워드.
 * "포켓몬 카드 {박스명} 부스터박스" 패턴이 표준.
 * 잘못된 카테고리 (다이어리, 굿즈 등) 제외 위해 "부스터박스" 키워드 필수.
 */
export const NAVER_SEARCH_QUERY: Record<string, string> = {
  // SV 본팩
  sv1k: "포켓몬 카드 스칼렛 ex 부스터박스",
  sv1v: "포켓몬 카드 바이올렛 ex 부스터박스",
  sv1a: "포켓몬 카드 트리플렛 비트 부스터박스",
  sv2p: "포켓몬 카드 스노해저드 부스터박스",
  sv2d: "포켓몬 카드 클레이버스트 부스터박스",
  sv2a: "포켓몬 카드 151 부스터박스",
  sv3a: "포켓몬 카드 레이징 서프 부스터박스",
  sv3: "포켓몬 카드 흑염의 지배자 부스터박스",
  sv4k: "포켓몬 카드 고대의 포효 부스터박스",
  sv4m: "포켓몬 카드 미래의 일섬 부스터박스",
  sv4a: "포켓몬 카드 샤이니 트레저 ex 부스터박스",
  sv5a: "포켓몬 카드 크림슨 헤이즈 부스터박스",
  sv5k: "포켓몬 카드 와일드포스 부스터박스",
  sv5m: "포켓몬 카드 사이버저지 부스터박스",
  sv6: "포켓몬 카드 변환의 가면 부스터박스",
  sv6a: "포켓몬 카드 나이트 원더러 부스터박스",
  sv7: "포켓몬 카드 스텔라 미라클 부스터박스",
  sv7a: "포켓몬 카드 낙원 드래고나 부스터박스",
  sv8: "포켓몬 카드 초전 브레이커 부스터박스",
  sv8a: "포켓몬 카드 테라스탈 페스타 ex 부스터박스",
  sv9: "포켓몬 카드 배틀 파트너즈 부스터박스",
  sv9a: "포켓몬 카드 열풍의 아레나 부스터박스",
  sv10: "포켓몬 카드 로켓단의 영광 부스터박스",
  sv11w: "포켓몬 카드 화이트 플레어 부스터박스",
  sv11b: "포켓몬 카드 블랙 볼트 부스터박스",
  // 메가 진화
  m1l: "포켓몬 카드 메가브레이브 부스터박스",
  m1s: "포켓몬 카드 메가심포니아 부스터박스",
  m2: "포켓몬 카드 인페르노 X 부스터박스",
  m3: "포켓몬 카드 닌자스피너 부스터박스"
};

// ─────────────────────────────────────────────────────────────────────────────
// 네이버쇼핑 API 응답 타입
// ─────────────────────────────────────────────────────────────────────────────

interface NaverShoppingItem {
  title: string; // HTML 태그 포함 — 정제 필요
  link: string;
  image?: string;
  lprice: string; // KRW 정수 (문자열)
  hprice?: string; // KRW 정수 (문자열) — 없을 수 있음
  mallName: string;
  productId: string;
  productType: string; // "1" = 일반, "2" = 가격비교, "3" = 가격비교 일반상품
  brand?: string;
  maker?: string;
  category1?: string;
  category2?: string;
  category3?: string;
  category4?: string;
}

interface NaverShoppingResponse {
  total: number;
  start: number;
  display: number;
  items: NaverShoppingItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Rate limit + 캐시
// ─────────────────────────────────────────────────────────────────────────────

let lastRequestAt = 0;

interface CacheEntry {
  observations: PriceObservation[];
  fetchedAt: number;
}
const cache = new Map<string, CacheEntry>();

async function rateLimitedFetch(url: string): Promise<Response | null> {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    console.warn("[naver-shopping] NAVER_CLIENT_ID / NAVER_CLIENT_SECRET 미설정");
    return null;
  }
  const wait = Math.max(0, NAVER_REQUEST_INTERVAL_MS - (Date.now() - lastRequestAt));
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestAt = Date.now();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), NAVER_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "X-Naver-Client-Id": NAVER_CLIENT_ID,
        "X-Naver-Client-Secret": NAVER_CLIENT_SECRET,
        Accept: "application/json"
      }
    });
    return res;
  } catch (err) {
    console.warn(`[naver-shopping] fetch 실패: ${url}`, err instanceof Error ? err.message : err);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 응답 파싱 + outlier 필터
// ─────────────────────────────────────────────────────────────────────────────

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, "").trim();
}

/**
 * 박스가 아닌 단팩/카툰/그레이딩 카드 제외.
 * - 카툰: 가격 > 박스 정가 × 5 → 제외 (또는 "카툰" 키워드)
 * - 단팩: 가격 < 박스 정가 × 0.3 → 제외 (또는 "단팩" 키워드)
 * - 그레이딩: "PSA", "BGS", "그레이딩" 포함 → 제외
 */
function isValidBoxListing(item: NaverShoppingItem, expectedMsrp: number): boolean {
  const title = stripHtml(item.title).toLowerCase();
  const price = Number(item.lprice);

  if (!Number.isFinite(price) || price <= 0) return false;

  // 키워드 블랙리스트
  const blacklist = ["단팩", "1팩", "한팩", "팩단위", "카툰", "psa", "bgs", "그레이딩", "에티켓", "보호", "슬리브", "바인더", "데크", "스타터"];
  if (blacklist.some((kw) => title.includes(kw))) return false;

  // 가격 범위 (정가 30% ~ 정가 5배)
  if (price < expectedMsrp * 0.3) return false;
  if (price > expectedMsrp * 5) return false;

  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 공개 API
// ─────────────────────────────────────────────────────────────────────────────

export interface NaverFetchResult {
  observations: PriceObservation[];
  source: "cache" | "live" | "unmapped" | "error" | "no-credentials";
  totalListings?: number;
  filteredListings?: number;
}

/**
 * setId 로 네이버쇼핑 박스 시세를 조회.
 * 박스가 아닌 매물 (단팩/카툰/그레이딩) 자동 필터링.
 *
 * @param setId 박스 ID (예: "sv2a")
 * @param expectedMsrp 박스 정가 — outlier 필터링 기준 (cardSet.msrpKRW)
 */
export async function fetchNaverShoppingPrice(
  setId: string,
  expectedMsrp: number
): Promise<NaverFetchResult> {
  if (!NAVER_CLIENT_ID || !NAVER_CLIENT_SECRET) {
    return { observations: [], source: "no-credentials" };
  }

  const query = NAVER_SEARCH_QUERY[setId];
  if (!query) {
    return { observations: [], source: "unmapped" };
  }

  const cacheKey = `set:${setId}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.fetchedAt < NAVER_CACHE_TTL_MS) {
    return { observations: cached.observations, source: "cache" };
  }

  const url = `${NAVER_API_URL}?query=${encodeURIComponent(query)}&display=${NAVER_DISPLAY}&sort=asc`;
  const res = await rateLimitedFetch(url);
  if (!res || !res.ok) {
    if (res) {
      console.warn(`[naver-shopping] ${setId}: HTTP ${res.status}`);
    }
    return { observations: [], source: "error" };
  }

  const data = (await res.json()) as NaverShoppingResponse;
  const validItems = data.items.filter((item) => isValidBoxListing(item, expectedMsrp));

  if (validItems.length === 0) {
    console.warn(`[naver-shopping] ${setId}: 유효한 박스 매물 0건 (전체 ${data.items.length})`);
    return { observations: [], source: "error", totalListings: data.items.length };
  }

  const observedAt = new Date().toISOString();
  const observations: PriceObservation[] = validItems.map((item, idx) => ({
    id: `naver-${item.productId}-${observedAt}`,
    productId: setId,
    productKind: "SET",
    category: "BOOSTER_BOX" satisfies ProductCategory,
    marketplace: "NAVER_SHOPPING" satisfies Marketplace,
    channel: "RETAIL_ONLINE" satisfies ChannelType,
    pricePerUnit: Number(item.lprice),
    currency: "KRW" satisfies Currency,
    unitDescription: "박스",
    observedAt,
    source: item.link,
    note: `네이버쇼핑 — ${item.mallName} (${stripHtml(item.title).slice(0, 60)})`
  }));

  cache.set(cacheKey, { observations, fetchedAt: Date.now() });
  return {
    observations,
    source: "live",
    totalListings: data.items.length,
    filteredListings: observations.length
  };
}

/**
 * 모든 매핑된 setId 의 네이버쇼핑 시세를 일괄 조회.
 * msrpKRW 는 호출자 (repository) 가 제공.
 */
export async function fetchAllNaverShoppingPrices(
  setMsrpMap: Record<string, number>
): Promise<PriceObservation[]> {
  const setIds = Object.keys(NAVER_SEARCH_QUERY);
  const results: PriceObservation[] = [];
  for (const setId of setIds) {
    const msrp = setMsrpMap[setId];
    if (!msrp) continue;
    const r = await fetchNaverShoppingPrice(setId, msrp);
    results.push(...r.observations);
  }
  return results;
}

/**
 * 캐시 강제 무효화 (테스트/관리자용).
 */
export function clearNaverShoppingCache(): void {
  cache.clear();
  lastRequestAt = 0;
}

/**
 * Scraper 인터페이스 호환 (단, msrp 정보 없이 호출되므로 기본값 117000 사용).
 * 정확한 호출은 fetchNaverShoppingPrice(setId, msrp) 권장.
 */
export const naverShoppingScraper = async (query: string): Promise<PriceObservation[]> => {
  const r = await fetchNaverShoppingPrice(query, 117_000);
  return r.observations;
};
