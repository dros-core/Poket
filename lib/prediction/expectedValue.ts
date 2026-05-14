import type { Card, CardSet, PriceTrendPoint } from "@/lib/types";

/**
 * 박스 EV(기대값) 계산기
 * - 박스에서 나올 수 있는 카드 × pullRate × 평균 시세 → EV
 * - EV > 박스 가격 → "리핑" 매력 ↑
 * - EV < 박스 가격 → 박스째 보유/판매 유리
 *
 * 입력은 시드 데이터 또는 실시세 어댑터로부터 동일 구조 받음.
 */

export interface EVResult {
  setId: string;
  boxPrice: number;
  expectedValue: number;
  evMinusPrice: number;
  evRatio: number; // EV / boxPrice
  contributors: Array<{
    cardId: string;
    nameKo: string;
    pullRate: number;
    estPrice: number;
    contribution: number;
  }>;
  recommendation: "RIP" | "HOLD" | "FLIP_BOX";
}

export interface CardPriceLookup {
  (cardId: string): { latest: number; trend?: PriceTrendPoint[] } | undefined;
}

export function calculateBoxEV(
  set: CardSet,
  setCards: Card[],
  boxPrice: number,
  priceLookup: CardPriceLookup
): EVResult {
  const contributors: EVResult["contributors"] = [];
  let ev = 0;

  for (const card of setCards) {
    if (!card.isPullable || !card.pullRate) continue;
    const lookup = priceLookup(card.id);
    if (!lookup) continue;
    const expected = card.pullRate * lookup.latest;
    ev += expected;
    contributors.push({
      cardId: card.id,
      nameKo: card.nameKo,
      pullRate: card.pullRate,
      estPrice: lookup.latest,
      contribution: expected
    });
  }

  contributors.sort((a, b) => b.contribution - a.contribution);

  const evMinusPrice = ev - boxPrice;
  const evRatio = boxPrice > 0 ? ev / boxPrice : 0;

  let recommendation: EVResult["recommendation"] = "HOLD";
  if (evRatio >= 1.15) recommendation = "RIP";
  else if (evRatio <= 0.85) recommendation = "FLIP_BOX";

  return {
    setId: set.id,
    boxPrice,
    expectedValue: Math.round(ev),
    evMinusPrice: Math.round(evMinusPrice),
    evRatio: Number(evRatio.toFixed(2)),
    contributors: contributors.slice(0, 10),
    recommendation
  };
}
