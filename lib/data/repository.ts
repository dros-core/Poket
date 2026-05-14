import { cardSets, getSetById } from "@/data/seed/sets";
import { cards, getCardById, getCardsBySetId } from "@/data/seed/cards";
import { channels } from "@/data/seed/channels";
import {
  buildBoxPriceHistory,
  buildCardPriceHistory,
  buildBoxObservations
} from "@/data/seed/priceHistory";
import { forecastPrice } from "@/lib/prediction/forecast";
import { calculateBoxEV, type EVResult } from "@/lib/prediction/expectedValue";
import { detectArbitrageFromObservations } from "@/lib/prediction/arbitrage";
import {
  isLiveDataEnabled,
  fetchKreamBoxPrice,
  fetchNaverShoppingPrice
} from "@/lib/scrapers";
import { aggregatePrices, type AggregatedPrice } from "./priceAggregator";
import type {
  Card,
  CardSet,
  PriceObservation,
  PricePrediction,
  PriceTrendPoint,
  PurchaseChannel
} from "@/lib/types";

/**
 * 도메인 데이터 접근 레이어
 *
 * 호출 모드:
 *   1) `repository.getBoxObservations(setId)` — 동기, seed 데이터만 (기존 페이지 호환)
 *   2) `repository.getBoxObservationsLive(setId)` — 비동기, 다중 어댑터 + seed (실시세)
 *   3) `repository.getAggregatedBoxPrice(setId)` — 비동기, 가중평균 + 신뢰도 (대시보드용)
 *
 * 활성화:
 *   POKET_USE_LIVE=true
 *   NAVER_CLIENT_ID + NAVER_CLIENT_SECRET  (네이버쇼핑 primary)
 *   KREAM_PRODUCT_MAP 등록  (KREAM 보조)
 */

export const repository = {
  // === Sets ===
  listSets(): CardSet[] {
    return cardSets;
  },
  getSet(id: string): CardSet | undefined {
    return getSetById(id);
  },

  // === Cards ===
  listCards(): Card[] {
    return cards;
  },
  getCard(id: string): Card | undefined {
    return getCardById(id);
  },
  getCardsBySetId(setId: string): Card[] {
    return getCardsBySetId(setId);
  },

  // === Price History ===
  getBoxPriceHistory(setId: string, daysBack = 365): PriceTrendPoint[] {
    return buildBoxPriceHistory(setId, daysBack);
  },
  getCardPriceHistory(cardId: string, daysBack = 365): PriceTrendPoint[] {
    return buildCardPriceHistory(cardId, daysBack);
  },

  // === Observations (현재 시세 스냅샷) ===
  getBoxObservations(setId: string): PriceObservation[] {
    return buildBoxObservations(setId);
  },

  /**
   * 모든 활성 어댑터를 호출하여 박스 시세를 통합 반환.
   *
   * 우선순위 (배열 앞 = 최신성/신뢰도 높음):
   *   1) 네이버쇼핑 (primary, 합법 OAuth)
   *   2) KREAM (사용자 수동 매핑)
   *   3) seed (합성 시계열)
   *
   * 어느 어댑터든 실패해도 throw 안 함 (graceful degradation).
   */
  async getBoxObservationsLive(setId: string): Promise<PriceObservation[]> {
    const seed = buildBoxObservations(setId);
    if (!isLiveDataEnabled()) return seed;

    const set = getSetById(setId);
    const msrp = set?.msrpKRW ?? 117_000;

    const results: PriceObservation[] = [];

    // 1) 네이버쇼핑 (primary)
    try {
      const naver = await fetchNaverShoppingPrice(setId, msrp);
      results.push(...naver.observations);
    } catch (err) {
      console.warn(`[repository] naver-shopping 실패 (${setId}):`, err instanceof Error ? err.message : err);
    }

    // 2) KREAM (보조)
    try {
      const kream = await fetchKreamBoxPrice(setId);
      results.push(...kream.observations);
    } catch (err) {
      console.warn(`[repository] kream 실패 (${setId}):`, err instanceof Error ? err.message : err);
    }

    return [...results, ...seed];
  },

  /**
   * 다중 소스 가중평균 + 신뢰도 점수를 반환.
   * UI 대시보드에서 "현재 시세 ± 신뢰도" 표시용.
   *
   * @returns null = 데이터 없음 / 모든 어댑터 비활성
   */
  async getAggregatedBoxPrice(setId: string): Promise<AggregatedPrice | null> {
    const observations = await this.getBoxObservationsLive(setId);
    // seed 제외 — 실시세 (live) 만 집계 대상
    const liveOnly = observations.filter(
      (o) =>
        o.marketplace === "NAVER_SHOPPING" ||
        o.note?.includes("KREAM") ||
        o.source?.startsWith("http")
    );
    if (liveOnly.length === 0) return null;
    return aggregatePrices(liveOnly);
  },

  getAllLatestBoxObservations(): PriceObservation[] {
    return cardSets.flatMap((s) => buildBoxObservations(s.id));
  },

  // === Channels ===
  listChannels(): PurchaseChannel[] {
    return channels;
  },

  // === Predictions ===
  predictBoxPrice(setId: string, horizonDays = 90): PricePrediction | null {
    const history = this.getBoxPriceHistory(setId, 365);
    if (history.length === 0) return null;
    return forecastPrice(setId, history, horizonDays);
  },

  predictCardPrice(cardId: string, horizonDays = 90): PricePrediction | null {
    const history = this.getCardPriceHistory(cardId, 365);
    if (history.length === 0) return null;
    return forecastPrice(cardId, history, horizonDays);
  },

  // === Box EV ===
  calculateBoxEV(setId: string): EVResult | null {
    const set = this.getSet(setId);
    if (!set) return null;
    const setCards = this.getCardsBySetId(setId);
    const observations = this.getBoxObservations(setId);
    const boxPrice = observations
      .filter((o) => o.category === "BOOSTER_BOX")
      .reduce((sum, o, _, arr) => sum + o.pricePerUnit / arr.length, 0);
    return calculateBoxEV(set, setCards, Math.round(boxPrice), (cardId) => {
      const history = this.getCardPriceHistory(cardId, 30);
      const latest = history[history.length - 1];
      if (!latest) return undefined;
      return { latest: latest.avg, trend: history };
    });
  },

  // === Arbitrage ===
  findArbitrageOpportunities() {
    const obs = this.getAllLatestBoxObservations();
    return detectArbitrageFromObservations(obs);
  }
};

export type Repository = typeof repository;
