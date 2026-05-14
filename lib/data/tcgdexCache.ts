/**
 * 빌드 시 사전 패치된 TCGdex 캐시 로더
 * scripts/prefetch-tcgdex.mjs 가 data/cache/tcgdex/<setId>.json 으로 저장한 데이터를 읽음.
 *
 * 캐시가 없으면(production deploy 등) 빈 결과 반환 — UI는 placeholder fallback.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const CACHE_ROOT = path.resolve(process.cwd(), "data", "cache", "tcgdex");

export interface TcgdexCachedCard {
  id: string;
  localId: string;
  name: string;
  image?: string;
  rarity?: string;
  illustrator?: string;
  types?: string[];
  category?: string;
}

export interface TcgdexCachedSet {
  __lang: "ko" | "ja" | "en";
  __fetchedAt: string;
  id: string;
  name: string;
  releaseDate?: string;
  cardCount?: { total?: number; official?: number };
  logo?: string | null;
  symbol?: string | null;
  cards: TcgdexCachedCard[];
}

let memoryCache: Map<string, TcgdexCachedSet | null> = new Map();

export async function loadSetFromCache(tcgdexSetId: string): Promise<TcgdexCachedSet | null> {
  if (memoryCache.has(tcgdexSetId)) return memoryCache.get(tcgdexSetId)!;
  const file = path.join(CACHE_ROOT, `${tcgdexSetId}.json`);
  try {
    const buf = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(buf) as TcgdexCachedSet;
    memoryCache.set(tcgdexSetId, parsed);
    return parsed;
  } catch {
    memoryCache.set(tcgdexSetId, null);
    return null;
  }
}

import { readFileSync } from "node:fs";

export function loadSetFromCacheSync(tcgdexSetId: string): TcgdexCachedSet | null {
  if (memoryCache.has(tcgdexSetId)) return memoryCache.get(tcgdexSetId)!;
  const file = path.join(CACHE_ROOT, `${tcgdexSetId}.json`);
  try {
    const buf = readFileSync(file, "utf8");
    const parsed = JSON.parse(buf) as TcgdexCachedSet;
    memoryCache.set(tcgdexSetId, parsed);
    return parsed;
  } catch {
    memoryCache.set(tcgdexSetId, null);
    return null;
  }
}

/**
 * TCGdex 이미지 base URL을 실제 사용 가능한 확장자로 변환
 */
export function buildImageUrl(
  base: string | undefined,
  quality: "low" | "high" = "high",
  ext: "webp" | "png" | "jpg" = "webp"
): string | undefined {
  if (!base) return undefined;
  return `${base}/${quality}.${ext}`;
}

/**
 * 세트의 카드 중 인기 chase 카드(보통 set 후반 번호)를 추출
 * - 번호가 official total 보다 큰 카드 = secret rare
 * - 카드 카테고리/이름 기반 휴리스틱
 */
export function pickChaseCards(set: TcgdexCachedSet, limit = 8): TcgdexCachedCard[] {
  const total = set.cardCount?.official ?? 0;
  return set.cards
    .filter((c) => {
      const num = parseInt(c.localId, 10);
      return Number.isFinite(num) && num > Math.max(50, total * 0.7);
    })
    .slice(-limit);
}

/**
 * 카드 번호로 단일 카드 검색
 */
export function findCardByLocalId(
  set: TcgdexCachedSet,
  localId: string
): TcgdexCachedCard | undefined {
  return set.cards.find((c) => c.localId === localId || c.localId === localId.padStart(3, "0"));
}
