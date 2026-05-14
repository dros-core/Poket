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
import { isLiveDataEnabled, fetchKreamBoxPrice } from "@/lib/scrapers";
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
 * - 기본: seed 데이터에서 조회 (동기)
 * - `POKET_USE_LIVE=true` + 비동기 메서드 사용 시 live 어댑터 결과를 prepend
 *
 * 마이그레이션 가이드:
 *   기존 페이지는 동기 `repository.getBoxObservations(setId)` 유지
 *   실시세가 필요한 페이지는 `repository.getBoxObservationsLive(setId)` 사용
 *   live 결과는 seed 보다 먼저 (최신성 우선) 정렬되어 반환
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
   * Live (KREAM) + seed 박스 시세를 통합 반환.
   * - POKET_USE_LIVE=true 일 때만 live fetch 시도
   * - KREAM 미매핑/에러 시 seed 만 반환 (graceful degradation)
   * - live 결과는 배열 앞쪽 (최신성 우선)
   */
  async getBoxObservationsLive(setId: string): Promise<PriceObservation[]> {
    const seed = buildBoxObservations(setId);
    if (!isLiveDataEnabled()) return seed;
    try {
      const live = await fetchKreamBoxPrice(setId);
      return [...live.observations, ...seed];
    } catch (err) {
      console.warn(`[repository] live fetch 실패 (${setId}):`, err instanceof Error ? err.message : err);
      return seed;
    }
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
