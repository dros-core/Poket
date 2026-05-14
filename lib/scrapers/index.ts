/**
 * Scraper 어댑터 진입점
 *
 * 각 어댑터는 동일한 시그니처를 가진 함수를 export 해야 합니다:
 *   fetchPrices(query: string): Promise<PriceObservation[]>
 *
 * 현재는 stub 만 제공하며, 실제 네트워크 호출은 구현하지 않습니다.
 * 구현 시 lib/data/repository.ts 의 함수에서 환경변수로 분기하여 활성화합니다.
 */

import type { PriceObservation } from "@/lib/types";

export type Scraper = (query: string) => Promise<PriceObservation[]>;

const noop: Scraper = async () => [];

export const scrapers: Record<string, Scraper> = {
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
