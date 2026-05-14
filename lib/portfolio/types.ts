/**
 * Portfolio 도메인 모델 (client-side only).
 * 사용자 데이터는 localStorage 에만 저장 — 백엔드 없음.
 */

export interface Holding {
  /** UUID (crypto.randomUUID) */
  id: string;
  /** CardSet.id (예: "sv2a", "m3") */
  setId: string;
  /** 매입 단가 (KRW, 박스 1개 기준) */
  buyPrice: number;
  /** 박스 수량 */
  quantity: number;
  /** 매입일 (YYYY-MM-DD) */
  buyDate: string;
  /** 메모 (선택) */
  note?: string;
  /** 생성 시각 (ISO) */
  createdAt: string;
}

export interface PortfolioState {
  schemaVersion: 1;
  holdings: Holding[];
}

export interface HoldingValuation extends Holding {
  /** 현재 박스 단가 (KRW) — repository.getBoxPriceHistory 의 latest avg */
  currentPrice: number;
  /** 매입 총액 (buyPrice × quantity) */
  costBasis: number;
  /** 평가 총액 (currentPrice × quantity) */
  marketValue: number;
  /** 절대 손익 (marketValue - costBasis) */
  pnl: number;
  /** 수익률 % */
  pnlPct: number;
  /** 매입 후 경과일 */
  daysHeld: number;
}

export interface PortfolioSummary {
  totalHoldings: number;
  totalQuantity: number;
  totalCost: number;
  totalValue: number;
  totalPnl: number;
  totalPnlPct: number;
  bestPerformer?: { setId: string; pnlPct: number };
  worstPerformer?: { setId: string; pnlPct: number };
}
