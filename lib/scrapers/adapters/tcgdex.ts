/**
 * TCGdex API 어댑터 — 한국어 카드 메타데이터 + 이미지 URL
 *
 * 베이스: https://api.tcgdex.net/v2/{lang}/...
 * 이미지: https://assets.tcgdex.net/{lang}/{serie}/{setId}/{cardNumber}/{quality}.{ext}
 *
 * 한국어(`ko`) 라우트가 존재하지 않는 경우 영어(`en`)/일본어(`ja`)로 폴백.
 * 호출 제한 명시 없음 — 빌드 시 1회 사전 패치 권장.
 */

export interface TcgdexSetBrief {
  id: string;
  name: string;
  cardCount?: { official?: number; total?: number };
  releaseDate?: string;
  logo?: string;
  symbol?: string;
}

export interface TcgdexCardBrief {
  id: string; // e.g. "sv03.5-183"
  localId: string; // e.g. "183"
  name: string;
  image?: string; // base URL without extension
  rarity?: string;
  illustrator?: string;
  types?: string[];
  category?: string;
}

export interface TcgdexSet extends TcgdexSetBrief {
  cards: TcgdexCardBrief[];
}

const BASE = "https://api.tcgdex.net/v2";
const LANG_FALLBACK_ORDER = ["ko", "ja", "en"] as const;

export type TcgdexLang = (typeof LANG_FALLBACK_ORDER)[number];

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "poket-tcgdex-prefetch/0.1" }
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/**
 * 주어진 setId로 한국어 → 일본어 → 영어 순서로 fallback 시도.
 * 응답이 있는 첫 언어를 반환.
 */
export async function fetchSetWithFallback(
  setId: string
): Promise<{ lang: TcgdexLang; set: TcgdexSet } | null> {
  for (const lang of LANG_FALLBACK_ORDER) {
    const data = await fetchJson<TcgdexSet>(`${BASE}/${lang}/sets/${setId}`);
    if (data && Array.isArray(data.cards) && data.cards.length > 0) {
      return { lang, set: data };
    }
  }
  return null;
}

export async function listSets(lang: TcgdexLang = "ko"): Promise<TcgdexSetBrief[]> {
  const data = await fetchJson<TcgdexSetBrief[]>(`${BASE}/${lang}/sets`);
  return data ?? [];
}

/**
 * TCGdex 이미지 URL은 응답의 image 필드 (base) + quality + ext 조합.
 * 예: "{image}/high.webp"
 */
export function buildImageUrl(base: string | undefined, quality: "low" | "high" = "high", ext: "webp" | "png" | "jpg" = "webp") {
  if (!base) return undefined;
  return `${base}/${quality}.${ext}`;
}
