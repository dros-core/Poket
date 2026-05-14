import type { PriceTrendPoint, PriceObservation, ProductCategory, Marketplace } from "@/lib/types";
import { cardSets } from "./sets";
import { cards } from "./cards";

/**
 * 가격 시계열 합성기
 * - 한국 포켓몬 카드 시장의 일반적인 패턴을 모델링
 * - 발매 직후 프리미엄 → 안정화 → 절판 임박 시 재상승
 * - 박스, 카툰, 싱글 카드 모두 동일 모델 사용 + 카테고리별 변동성 차이
 *
 * 참고: 여기서 생성된 데이터는 합성 시드입니다.
 *      lib/scrapers의 어댑터를 활성화하면 실제 시세 데이터로 교체됩니다.
 */

const DAY_MS = 86400000;

/** seeded RNG (deterministic) */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

/**
 * 가격 진폭 모델
 * - 발매 직후 0~30일: 프리미엄(+15~25%)
 * - 30~180일: 안정화(점진 하락)
 * - 180~365일: 보합 (수요/공급에 따라 변동)
 * - 절판 시점 ±60일: 재상승 (+10~40%)
 */
function modelPriceFactor(daysSinceRelease: number, isActive: boolean): number {
  if (daysSinceRelease < 0) return 0.95;
  if (daysSinceRelease < 30) {
    return 1.18 + Math.sin((daysSinceRelease / 30) * Math.PI) * 0.08;
  }
  if (daysSinceRelease < 180) {
    const progress = (daysSinceRelease - 30) / 150;
    return 1.18 - progress * 0.18; // 1.18 → 1.00
  }
  if (daysSinceRelease < 365) {
    return 1.0 + Math.sin((daysSinceRelease / 80) * Math.PI) * 0.04;
  }
  // 1년 이후
  if (!isActive) {
    const yearsAfter = (daysSinceRelease - 365) / 365;
    return 1.05 + Math.min(yearsAfter, 3) * 0.18; // 절판 후 점진 상승
  }
  return 1.0;
}

export function buildBoxPriceHistory(setId: string, daysBack = 365): PriceTrendPoint[] {
  const set = cardSets.find((s) => s.id === setId);
  if (!set) return [];
  const release = new Date(set.releaseDate).getTime();
  const today = Date.now();
  const start = Math.max(release - 14 * DAY_MS, today - daysBack * DAY_MS);

  const rng = mulberry32(hashString(setId));
  const points: PriceTrendPoint[] = [];

  for (let t = start; t <= today; t += 7 * DAY_MS) {
    const daysSince = (t - release) / DAY_MS;
    const factor = modelPriceFactor(daysSince, set.isActive);
    const noise = 1 + (rng() - 0.5) * 0.06;
    const center = Math.round(set.msrpKRW * factor * noise);
    const spread = Math.round(center * 0.06);
    points.push({
      date: new Date(t).toISOString().slice(0, 10),
      avg: center,
      median: center - Math.round(spread * 0.3),
      min: center - spread,
      max: center + spread,
      volume: 30 + Math.round(rng() * 80)
    });
  }
  return points;
}

export function buildCardPriceHistory(cardId: string, daysBack = 365): PriceTrendPoint[] {
  const card = cards.find((c) => c.id === cardId);
  if (!card) return [];
  const set = cardSets.find((s) => s.id === card.setId);
  if (!set) return [];

  // 베이스 가격: 봉입률, 희귀도, 인기 태그에 따라 결정
  const rarityBase: Record<string, number> = {
    UR: 180000,
    SAR: 120000,
    SR: 60000,
    AR: 18000,
    RRR: 25000,
    RR: 8000,
    R: 3000,
    U: 800,
    C: 400,
    PROMO: 25000,
    EX: 22000,
    K: 30000
  };

  let base = rarityBase[card.rarity] ?? 5000;
  if (card.tags.includes("메가히트")) base *= 2.4;
  if (card.tags.includes("절판프리미엄")) base *= 1.6;
  if (card.tags.includes("커버")) base *= 1.3;
  if (card.tags.includes("프리미엄")) base *= 1.4;
  if (card.tags.includes("그레이딩-수요")) base *= 1.2;

  const release = new Date(set.releaseDate).getTime();
  const today = Date.now();
  const start = Math.max(release, today - daysBack * DAY_MS);

  const rng = mulberry32(hashString(cardId));
  const points: PriceTrendPoint[] = [];

  for (let t = start; t <= today; t += 7 * DAY_MS) {
    const daysSince = (t - release) / DAY_MS;
    let factor = modelPriceFactor(daysSince, set.isActive);
    // 싱글 카드는 박스 대비 변동성 더 큼
    factor = factor * (1 + (rng() - 0.5) * 0.12);
    const center = Math.round(base * factor);
    const spread = Math.round(center * 0.18);
    points.push({
      date: new Date(t).toISOString().slice(0, 10),
      avg: center,
      median: center - Math.round(spread * 0.2),
      min: Math.max(0, center - spread),
      max: center + spread,
      volume: 5 + Math.round(rng() * 40)
    });
  }
  return points;
}

/**
 * 멀티 마켓플레이스 최신 시세 스냅샷
 * 박스 기준
 */
export function buildBoxObservations(setId: string): PriceObservation[] {
  const set = cardSets.find((s) => s.id === setId);
  if (!set) return [];
  const trend = buildBoxPriceHistory(setId, 30);
  const latest = trend[trend.length - 1];
  if (!latest) return [];

  const rng = mulberry32(hashString(setId + "-obs"));
  const channels: Array<{ marketplace: Marketplace; channel: any; bias: number; unit: string; category: ProductCategory }> = [
    { marketplace: "DIRECT_DISTRIBUTOR", channel: "WHOLESALE", bias: 0.85, unit: "박스", category: "BOOSTER_BOX" },
    { marketplace: "DIRECT_DISTRIBUTOR", channel: "WHOLESALE", bias: 0.82, unit: "카툰 (6박스)", category: "CARTON" },
    { marketplace: "OFFLINE_RETAIL", channel: "RETAIL_OFFLINE", bias: 1.0, unit: "박스", category: "BOOSTER_BOX" },
    { marketplace: "COUPANG", channel: "RETAIL_ONLINE", bias: 0.96, unit: "박스", category: "BOOSTER_BOX" },
    { marketplace: "11ST", channel: "RETAIL_ONLINE", bias: 0.95, unit: "박스", category: "BOOSTER_BOX" },
    { marketplace: "GMARKET", channel: "RETAIL_ONLINE", bias: 0.97, unit: "박스", category: "BOOSTER_BOX" },
    { marketplace: "NAVER_SHOPPING", channel: "RETAIL_ONLINE", bias: 0.98, unit: "박스", category: "BOOSTER_BOX" },
    { marketplace: "BUNGAE", channel: "P2P", bias: 0.92, unit: "박스", category: "BOOSTER_BOX" },
    { marketplace: "JOONGGO", channel: "P2P", bias: 0.93, unit: "박스", category: "BOOSTER_BOX" }
  ];

  return channels.map((c, i) => ({
    id: `${setId}-obs-${i}`,
    productId: setId,
    productKind: "SET",
    category: c.category,
    marketplace: c.marketplace,
    channel: c.channel,
    pricePerUnit: Math.round(latest.avg * c.bias * (1 + (rng() - 0.5) * 0.04)),
    currency: "KRW",
    unitDescription: c.unit,
    observedAt: new Date(Date.now() - Math.round(rng() * 6 * 3600 * 1000)).toISOString(),
    source: undefined,
    note: c.category === "CARTON" ? "최소 2카툰 이상 발주 조건" : undefined
  }));
}
