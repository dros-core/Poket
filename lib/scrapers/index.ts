/**
 * Scraper 어댑터 진입점
 *
 * 각 어댑터는 동일한 시그니처를 가진 함수를 export 해야 합니다:
 *   fetchPrices(query: string): Promise<PriceObservation[]>
 *
 * 활성화: `POKET_USE_LIVE=true` 환경변수 + 각 어댑터별 매핑/키 설정.
 * 미설정 어댑터는 noop (빈 배열) 반환 → repository 가 seed 로 자연 폴백.
 */

import type { PriceObservation } from "@/lib/types";
import { kreamScraper } from "./adapters/kream";

export type Scraper = (query: string) => Promise<PriceObservation[]>;

const noop: Scraper = async () => [];

export const scrapers: Record<string, Scraper> = {
  kream: kreamScraper, // 박스 시세 1차 소스 (lib/scrapers/adapters/kream.ts)
  bungae: noop,
  joonggo: noop,
  pokatime: noop,
  cardforest: noop,
  naverShopping: noop,
  coupang: noop,
  ebay: noop,
  tcgplayer: noop,
  mercariJp: noop,
  amazonJp: noop,
  rakuten: noop,
  pokemonTcgIo: noop,
  priceCharting: noop
};

export const isLiveDataEnabled = () => process.env.POKET_USE_LIVE === "true";

export { fetchKreamBoxPrice, fetchAllKreamBoxPrices } from "./adapters/kream";
