/**
 * 다중 소스 시세 집계 — 가중평균 + outlier 제거 + 신뢰도 점수
 *
 * 본 모듈은 여러 어댑터 (네이버쇼핑, KREAM, pricecharting 등) 의 PriceObservation
 * 배열을 받아 단일 "대표 시세" 를 산출합니다.
 *
 * 알고리즘:
 *   1) marketplace 별 가중치 적용 (네이버쇼핑 1.0, KREAM 0.9, 번개장터 0.7, TCGBOX 0.5)
 *   2) IQR (Q1-1.5×IQR ~ Q3+1.5×IQR) 밖의 outlier 제거
 *   3) 가중 평균 + 가중 중앙값 산출
 *   4) 데이터 신뢰도 점수 (0~1) 계산
 *
 * @see LEGAL_NOTES.md
 */

import type { PriceObservation, Marketplace } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// 소스별 가중치
// ─────────────────────────────────────────────────────────────────────────────

const MARKETPLACE_WEIGHTS: Partial<Record<Marketplace, number>> = {
  NAVER_SHOPPING: 1.0, // 공식 API, 정상 소매가 (신뢰도 최고)
  BUNGAE: 0.7, // P2P 실거래가 (변동성 큼)
  COUPANG: 0.85,
  "11ST": 0.85,
  GMARKET: 0.85,
  AUCTION: 0.85,
  TCGPLAYER: 0.6, // 글로벌 — 환율 환산 시 부정확
  EBAY: 0.5
};

const DEFAULT_WEIGHT = 0.5;

function getWeight(m: Marketplace): number {
  return MARKETPLACE_WEIGHTS[m] ?? DEFAULT_WEIGHT;
}

// ─────────────────────────────────────────────────────────────────────────────
// 통계 헬퍼
// ─────────────────────────────────────────────────────────────────────────────

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo];
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

// ─────────────────────────────────────────────────────────────────────────────
// 집계 결과 타입
// ─────────────────────────────────────────────────────────────────────────────

export interface AggregatedPrice {
  /** 가중 평균가 (KRW) — 메인 표시값 */
  weightedAvg: number;
  /** 가중 중앙값 (KRW) — outlier robust */
  weightedMedian: number;
  /** 최저가 (KRW) — outlier 제거 후 */
  min: number;
  /** 최고가 (KRW) — outlier 제거 후 */
  max: number;
  /** 사용된 매물 수 (outlier 제거 후) */
  count: number;
  /** 총 매물 수 (outlier 포함) */
  totalCount: number;
  /** 사용된 marketplace 목록 */
  sources: Marketplace[];
  /** 신뢰도 (0~1) — 소스 다양성 + 매물 수 + 분산 기반 */
  confidence: number;
  /** outlier 로 제외된 가격들 (디버그용) */
  outliers: number[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 메인 집계 함수
// ─────────────────────────────────────────────────────────────────────────────

/**
 * PriceObservation 배열을 받아 단일 대표 시세를 산출.
 * 빈 배열이면 null 반환.
 */
export function aggregatePrices(observations: PriceObservation[]): AggregatedPrice | null {
  if (observations.length === 0) return null;

  const prices = observations.map((o) => o.pricePerUnit);
  const sorted = [...prices].sort((a, b) => a - b);

  // IQR outlier 제거 (Q1-1.5*IQR ~ Q3+1.5*IQR)
  const q1 = percentile(sorted, 0.25);
  const q3 = percentile(sorted, 0.75);
  const iqr = q3 - q1;
  const lower = q1 - 1.5 * iqr;
  const upper = q3 + 1.5 * iqr;

  const validObs: PriceObservation[] = [];
  const outliers: number[] = [];
  for (const obs of observations) {
    if (obs.pricePerUnit >= lower && obs.pricePerUnit <= upper) {
      validObs.push(obs);
    } else {
      outliers.push(obs.pricePerUnit);
    }
  }

  if (validObs.length === 0) {
    // 모두 outlier — 원본 중앙값으로 fallback
    return {
      weightedAvg: median(prices),
      weightedMedian: median(prices),
      min: Math.min(...prices),
      max: Math.max(...prices),
      count: 0,
      totalCount: observations.length,
      sources: [...new Set(observations.map((o) => o.marketplace))],
      confidence: 0.3,
      outliers
    };
  }

  // 가중 평균
  let weightSum = 0;
  let weightedPriceSum = 0;
  for (const obs of validObs) {
    const w = getWeight(obs.marketplace);
    weightSum += w;
    weightedPriceSum += obs.pricePerUnit * w;
  }
  const weightedAvg = Math.round(weightedPriceSum / weightSum);

  // 가중 중앙값 — 가격 정렬 후 누적 가중치 50% 지점
  const sortedByPrice = [...validObs].sort((a, b) => a.pricePerUnit - b.pricePerUnit);
  let cumWeight = 0;
  let weightedMedianValue = sortedByPrice[Math.floor(sortedByPrice.length / 2)].pricePerUnit;
  for (const obs of sortedByPrice) {
    cumWeight += getWeight(obs.marketplace);
    if (cumWeight >= weightSum / 2) {
      weightedMedianValue = obs.pricePerUnit;
      break;
    }
  }

  const validPrices = validObs.map((o) => o.pricePerUnit);
  const sources = [...new Set(validObs.map((o) => o.marketplace))];

  // 신뢰도 산정:
  //   - 매물 수 0.4 (3개 이상 만점)
  //   - 소스 다양성 0.3 (3개 이상 만점)
  //   - 분산 안정성 0.3 (CV < 0.15 만점)
  const countScore = Math.min(1, validObs.length / 3) * 0.4;
  const diversityScore = Math.min(1, sources.length / 3) * 0.3;
  const mean = validPrices.reduce((s, v) => s + v, 0) / validPrices.length;
  const variance = validPrices.reduce((s, v) => s + (v - mean) ** 2, 0) / validPrices.length;
  const cv = mean > 0 ? Math.sqrt(variance) / mean : 1;
  const stabilityScore = Math.max(0, 1 - cv / 0.15) * 0.3;
  const confidence = Math.round((countScore + diversityScore + stabilityScore) * 100) / 100;

  return {
    weightedAvg,
    weightedMedian: weightedMedianValue,
    min: Math.min(...validPrices),
    max: Math.max(...validPrices),
    count: validObs.length,
    totalCount: observations.length,
    sources,
    confidence,
    outliers
  };
}

/**
 * 신뢰도 점수를 사람이 읽을 수 있는 라벨로 변환.
 */
export function confidenceLabel(confidence: number): "high" | "medium" | "low" {
  if (confidence >= 0.7) return "high";
  if (confidence >= 0.4) return "medium";
  return "low";
}
