/**
 * Portfolio 평가/요약 계산.
 *
 * 순수 함수 — 데이터 조회는 호출자가 주입 (테스트/SSR 친화).
 */

import type { Holding, HoldingValuation, PortfolioSummary } from "./types";

export interface PriceLookup {
  /** setId → 현재 박스 단가 (KRW). 데이터 없으면 undefined */
  (setId: string): number | undefined;
}

function daysBetween(fromIso: string, toMs: number): number {
  const from = new Date(fromIso).getTime();
  if (Number.isNaN(from)) return 0;
  return Math.max(0, Math.floor((toMs - from) / 86_400_000));
}

export function valuateHolding(h: Holding, getPrice: PriceLookup, nowMs = Date.now()): HoldingValuation {
  const currentPrice = getPrice(h.setId) ?? h.buyPrice; // 데이터 없으면 매입가로 = 손익 0
  const costBasis = h.buyPrice * h.quantity;
  const marketValue = currentPrice * h.quantity;
  const pnl = marketValue - costBasis;
  const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
  return {
    ...h,
    currentPrice,
    costBasis,
    marketValue,
    pnl,
    pnlPct,
    daysHeld: daysBetween(h.buyDate, nowMs)
  };
}

export function valuateAll(holdings: Holding[], getPrice: PriceLookup, nowMs = Date.now()): HoldingValuation[] {
  return holdings.map((h) => valuateHolding(h, getPrice, nowMs));
}

export function summarize(valuations: HoldingValuation[]): PortfolioSummary {
  const totalCost = valuations.reduce((s, v) => s + v.costBasis, 0);
  const totalValue = valuations.reduce((s, v) => s + v.marketValue, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  let best: { setId: string; pnlPct: number } | undefined;
  let worst: { setId: string; pnlPct: number } | undefined;
  for (const v of valuations) {
    if (!best || v.pnlPct > best.pnlPct) best = { setId: v.setId, pnlPct: v.pnlPct };
    if (!worst || v.pnlPct < worst.pnlPct) worst = { setId: v.setId, pnlPct: v.pnlPct };
  }

  return {
    totalHoldings: valuations.length,
    totalQuantity: valuations.reduce((s, v) => s + v.quantity, 0),
    totalCost,
    totalValue,
    totalPnl,
    totalPnlPct,
    bestPerformer: best,
    worstPerformer: worst
  };
}
