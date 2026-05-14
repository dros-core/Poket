/**
 * Scraper 어댑터 진입점
 *
 * 각 어댑터는 동일한 시그니처를 가진 함수를 export 해야 합니다:
 *   fetchPrices(query: string): Promise<PriceObservation[]>
 *
 * 활성화: `POKET_USE_LIVE=true` 환경변수 + 각 어댑터별 인증/매핑 설정.
 * 미설정 어댑터는 noop (빈 배열) 반환 → repository 가 seed 로 자연 폴백.
 *
 * @see LEGAL_NOTES.md (각 소스별 합법성/우선순위)
 */

import type { PriceObservation } from "@/lib/types";
import { kreamScraper } from "./adapters/kream";
import { naverShoppingScraper } from "./adapters/naverShopping";

export type Scraper = (query: string) => Promise<PriceObservation[]>;

const noop: Scraper = async () => [];

export const scrapers: Record<string, Scraper> = {
  naverShopping: naverShoppingScraper, // primary — 공식 API, 합법성 1.0
  kream: kreamScraper, // 보조 — 사용자 수동 매핑
  bungae: noop, // 향후 구현 (실거래가)
  joonggo: noop,
  pokatime: noop,
  cardforest: noop,
  coupang: noop,
  ebay: noop,
  tcgplayer: noop,
  mercariJp: noop,
  amazonJp: noop,
  rakuten: noop,
  pokemonTcgIo: noop,
  priceCharting: noop // 향후 구현 (해외 비교)
};

export const isLiveDataEnabled = () => process.env.POKET_USE_LIVE === "true";

// 어댑터별 export
export { fetchKreamBoxPrice, fetchAllKreamBoxPrices } from "./adapters/kream";
export {
  fetchNaverShoppingPrice,
  fetchAllNaverShoppingPrices,
  clearNaverShoppingCache,
  NAVER_SEARCH_QUERY
} from "./adapters/naverShopping";
