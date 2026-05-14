/**
 * pokemontcg.io 캐시 로더 (메가 시리즈 등 TCGdex 미커버 세트 폴백)
 */

import path from "node:path";
import { readFileSync } from "node:fs";

const CACHE_ROOT = path.resolve(process.cwd(), "data", "cache", "pokemontcg");

export interface PtcgCard {
  id: string;
  number: string;
  name: string;
  rarity?: string;
  supertype?: string;
  subtypes?: string[];
  types?: string[];
  images?: { small?: string; large?: string };
}

export interface PtcgCachedSet {
  setId: string;
  fetchedAt: string;
  totalCards: number;
  cards: PtcgCard[];
}

const memCache = new Map<string, PtcgCachedSet | null>();

export function loadPtcgSetSync(ptcgSetId: string): PtcgCachedSet | null {
  if (memCache.has(ptcgSetId)) return memCache.get(ptcgSetId)!;
  const file = path.join(CACHE_ROOT, `${ptcgSetId}.json`);
  try {
    const buf = readFileSync(file, "utf8");
    const parsed = JSON.parse(buf) as PtcgCachedSet;
    memCache.set(ptcgSetId, parsed);
    return parsed;
  } catch {
    memCache.set(ptcgSetId, null);
    return null;
  }
}

export function findPtcgCardByNumber(set: PtcgCachedSet, number: string): PtcgCard | undefined {
  const norm = number.trim();
  return set.cards.find(
    (c) => c.number === norm || c.number === norm.replace(/^0+/, "") || c.number.padStart(3, "0") === norm.padStart(3, "0")
  );
}
