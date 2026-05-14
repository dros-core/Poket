import type { ArbitrageOpportunity, PriceObservation } from "@/lib/types";

/**
 * 마켓플레이스간 가격 차익(아비트라지) 탐지기
 * - buy 후보: 최저가 도매/소매 채널
 * - sell 후보: 최고가 P2P/해외 채널
 * - 수수료/배송비 제하고 NET 수익 계산
 */

const MARKETPLACE_FEES: Record<string, number> = {
  BUNGAE: 3.5,
  JOONGGO: 0,
  DAANGN: 0,
  GMARKET: 12,
  COUPANG: 10,
  "11ST": 11,
  AUCTION: 11,
  NAVER_SHOPPING: 5,
  EBAY: 13,
  TCGPLAYER: 10,
  MERCARI_JP: 10,
  RAKUTEN: 8,
  AMAZON_JP: 12,
  OFFLINE_RETAIL: 0,
  POKATIME: 5,
  CARDFOREST: 5,
  ALADIN: 0,
  DIRECT_DISTRIBUTOR: 0
};

const SHIPPING_KRW: Record<string, number> = {
  AMAZON_JP: 18000,
  RAKUTEN: 16000,
  MERCARI_JP: 22000,
  EBAY: 25000,
  TCGPLAYER: 30000,
  default: 3500
};

export function detectArbitrageFromObservations(
  observations: PriceObservation[]
): ArbitrageOpportunity[] {
  // productId × category 별로 그룹화
  const groups = new Map<string, PriceObservation[]>();
  for (const obs of observations) {
    const key = `${obs.productId}:${obs.category}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(obs);
  }

  const opps: ArbitrageOpportunity[] = [];

  for (const [, group] of groups) {
    if (group.length < 2) continue;
    const sorted = [...group].sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    const buy = sorted[0];
    const sell = sorted[sorted.length - 1];
    if (buy.marketplace === sell.marketplace) continue;
    if (sell.pricePerUnit <= buy.pricePerUnit) continue;

    const fees = MARKETPLACE_FEES[sell.marketplace] ?? 5;
    const shipping = SHIPPING_KRW[sell.marketplace] ?? SHIPPING_KRW.default;
    const grossSell = sell.pricePerUnit;
    const feeAmount = grossSell * (fees / 100);
    const netSell = grossSell - feeAmount;
    const profit = netSell - buy.pricePerUnit - shipping;
    const margin = (profit / buy.pricePerUnit) * 100;
    if (margin < 5) continue;

    let risk: "LOW" | "MEDIUM" | "HIGH" = "LOW";
    if (buy.channel === "P2P" || sell.channel === "P2P") risk = "MEDIUM";
    if (sell.channel === "OVERSEAS" || buy.channel === "OVERSEAS") risk = "HIGH";

    opps.push({
      id: `${buy.productId}-${buy.marketplace}-${sell.marketplace}`,
      productId: buy.productId,
      buyChannel: buy.marketplace,
      sellChannel: sell.marketplace,
      buyPrice: buy.pricePerUnit,
      sellPrice: sell.pricePerUnit,
      feesPct: fees,
      shippingKRW: shipping,
      estimatedNetProfit: Math.round(profit),
      marginPct: Number(margin.toFixed(1)),
      riskLevel: risk,
      notes:
        risk === "LOW"
          ? "공식 채널 ↔ 일반 소매로 비교적 안전"
          : risk === "MEDIUM"
            ? "P2P 거래로 사기/등급 분쟁 주의"
            : "해외 직구/판매: 환율, 관세, 배대지 비용 추가 검토 필요",
      detectedAt: new Date().toISOString()
    });
  }

  return opps.sort((a, b) => b.marginPct - a.marginPct);
}
