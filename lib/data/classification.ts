/**
 * 박스 3축 분류 헬퍼.
 *
 * 데이터 그룹화 + 사용자 표시 라벨 + 필터 조합 로직.
 * Server Component 친화 (순수 함수).
 */

import type { CardSet, SetEra, SeriesGroup, MarketStatus } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// 라벨 (한국어 표시용)
// ─────────────────────────────────────────────────────────────────────────────

export const SERIES_GROUP_LABEL: Record<SeriesGroup, string> = {
  SV_REGULAR: "SV 본팩",
  SV_ENHANCED: "SV 강화확장팩",
  SV_HIGH_CLASS: "SV 하이클래스",
  MEGA: "메가 진화"
};

export const SERIES_GROUP_DESC: Record<SeriesGroup, string> = {
  SV_REGULAR: "30팩 박스 · 정가 117,000원 · SV 본 시리즈",
  SV_ENHANCED: "20~30팩 박스 · 88,000~117,000원 · 강화확장팩 (151, 트리플렛비트 등)",
  SV_HIGH_CLASS: "10팩 하이클래스 박스 · 88,000원 · 화려한 SAR/UR 봉입률",
  MEGA: "30팩 박스 · 117,000원 · 메가 진화 카드 시리즈 (2025~)"
};

export const MARKET_STATUS_LABEL: Record<MarketStatus, string> = {
  PRE_RELEASE: "발매 예정",
  ACTIVE: "현역 판매",
  DISCONTINUED: "절판"
};

export const MARKET_STATUS_DESC: Record<MarketStatus, string> = {
  PRE_RELEASE: "예약 단계 — 정가 또는 프리미엄 형성",
  ACTIVE: "소매·도매 정상 유통 — 정가 부근 거래",
  DISCONTINUED: "공식 유통 종료 — P2P/리세일, 시간 경과로 프리미엄 형성 가능"
};

export const ERA_LABEL: Record<SetEra, string> = {
  "2023": "2023년 발매",
  "2024": "2024년 발매",
  "2025": "2025년 발매",
  "2026": "2026년 발매"
};

// ─────────────────────────────────────────────────────────────────────────────
// 분류 추론 (sets.ts 에 필드 없을 때 fallback)
// ─────────────────────────────────────────────────────────────────────────────

export function inferEra(set: CardSet): SetEra {
  if (set.era) return set.era;
  const year = set.releaseDate.slice(0, 4);
  if (year === "2023" || year === "2024" || year === "2025" || year === "2026") {
    return year as SetEra;
  }
  return "2026";
}

export function inferSeriesGroup(set: CardSet): SeriesGroup {
  if (set.seriesGroup) return set.seriesGroup;
  const s = set.series.toLowerCase();
  if (s.includes("메가")) return "MEGA";
  if (s.includes("하이클래스")) return "SV_HIGH_CLASS";
  if (s.includes("강화확장팩")) return "SV_ENHANCED";
  return "SV_REGULAR";
}

export function inferMarketStatus(set: CardSet, today: Date = new Date()): MarketStatus {
  if (set.marketStatus) return set.marketStatus;
  const release = new Date(set.releaseDate);
  if (Number.isFinite(release.getTime()) && release.getTime() > today.getTime()) {
    return "PRE_RELEASE";
  }
  return set.isActive ? "ACTIVE" : "DISCONTINUED";
}

// ─────────────────────────────────────────────────────────────────────────────
// 그룹화 (Map<groupKey, CardSet[]>)
// ─────────────────────────────────────────────────────────────────────────────

export function groupByEra(sets: CardSet[]): Map<SetEra, CardSet[]> {
  const out = new Map<SetEra, CardSet[]>();
  for (const s of sets) {
    const key = inferEra(s);
    const arr = out.get(key) ?? [];
    arr.push(s);
    out.set(key, arr);
  }
  return out;
}

export function groupBySeriesGroup(sets: CardSet[]): Map<SeriesGroup, CardSet[]> {
  const out = new Map<SeriesGroup, CardSet[]>();
  for (const s of sets) {
    const key = inferSeriesGroup(s);
    const arr = out.get(key) ?? [];
    arr.push(s);
    out.set(key, arr);
  }
  return out;
}

export function groupByMarketStatus(sets: CardSet[]): Map<MarketStatus, CardSet[]> {
  const out = new Map<MarketStatus, CardSet[]>();
  for (const s of sets) {
    const key = inferMarketStatus(s);
    const arr = out.get(key) ?? [];
    arr.push(s);
    out.set(key, arr);
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// 필터 (다축 조합)
// ─────────────────────────────────────────────────────────────────────────────

export interface ClassificationFilter {
  era?: SetEra;
  seriesGroup?: SeriesGroup;
  marketStatus?: MarketStatus;
}

export function applyFilter(sets: CardSet[], filter: ClassificationFilter): CardSet[] {
  return sets.filter((s) => {
    if (filter.era && inferEra(s) !== filter.era) return false;
    if (filter.seriesGroup && inferSeriesGroup(s) !== filter.seriesGroup) return false;
    if (filter.marketStatus && inferMarketStatus(s) !== filter.marketStatus) return false;
    return true;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Ordering helpers
// ─────────────────────────────────────────────────────────────────────────────

export const ERA_ORDER: SetEra[] = ["2026", "2025", "2024", "2023"];
export const SERIES_GROUP_ORDER: SeriesGroup[] = ["MEGA", "SV_HIGH_CLASS", "SV_REGULAR", "SV_ENHANCED"];
export const MARKET_STATUS_ORDER: MarketStatus[] = ["PRE_RELEASE", "ACTIVE", "DISCONTINUED"];
