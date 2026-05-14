/**
 * 카드/세트 ID에서 이미지 URL로 해소하는 단일 진입점.
 *
 * 폴백 체인:
 *   1) 시드에 명시된 imageUrl
 *   2) TCGdex 캐시 (한국어 → 일본어 우선)
 *   3) TCGdex 직접 URL 빌드 (캐시에 image 필드 없는 경우, SV 시리즈)
 *   4) pokemontcg.io 캐시 (메가 시리즈 등 TCGdex 미커버)
 *   5) placeholder
 */

import {
  loadSetFromCacheSync,
  buildImageUrl,
  findCardByLocalId,
  type TcgdexCachedSet,
  type TcgdexCachedCard
} from "./tcgdexCache";
import { loadPtcgSetSync, findPtcgCardByNumber } from "./pokemontcgCache";
import { getMapping, type SetImageMapping } from "@/data/seed/setImageMap";
import type { Card, CardSet, ImageSource } from "@/lib/types";

const PLACEHOLDER_SET = "/images/set-placeholder.svg";
const PLACEHOLDER_CARD = "/images/card-placeholder.svg";

export interface ResolvedImage {
  url: string;
  source: ImageSource;
  alt: string;
  isPlaceholder: boolean;
}

/**
 * TCGdex 카드의 image 필드가 비어있을 때 직접 URL을 빌드.
 * SV 시리즈는 패턴이 일관됨: assets.tcgdex.net/ja/SV/{setId}/{localId}
 * 메가 시리즈(M1L, M2 등)는 serie가 없어서 빌드 불가 → pokemontcg.io 폴백.
 */
function buildTcgdexDirectUrl(tcgdexSetId: string, localId: string): string | undefined {
  if (tcgdexSetId.toUpperCase().startsWith("SV")) {
    return `https://assets.tcgdex.net/ja/SV/${tcgdexSetId}/${localId}/high.webp`;
  }
  return undefined;
}

function resolveFromTcgdex(
  mapping: SetImageMapping,
  localId: string
):
  | { url: string; source: ImageSource; tcgdexCard?: TcgdexCachedCard }
  | undefined {
  const cached = loadSetFromCacheSync(mapping.tcgdexId);
  if (cached) {
    const card = findCardByLocalId(cached, localId);
    if (card?.image) {
      return {
        url: buildImageUrl(card.image, "high")!,
        source: cached.__lang === "ko" ? "TCGDEX_KO" : cached.__lang === "ja" ? "TCGDEX_JA" : "TCGDEX_EN",
        tcgdexCard: card
      };
    }
  }
  // 직접 URL 빌드 (SV 시리즈만)
  const direct = buildTcgdexDirectUrl(mapping.tcgdexId, localId);
  if (direct) {
    return { url: direct, source: "TCGDEX_JA" };
  }
  return undefined;
}

function resolveFromPokemontcg(
  mapping: SetImageMapping,
  ptcgNumber: string
): { url: string; source: ImageSource } | undefined {
  if (!mapping.pokemontcgIoId) return undefined;
  const ptcg = loadPtcgSetSync(mapping.pokemontcgIoId);
  if (!ptcg) return undefined;
  const card = findPtcgCardByNumber(ptcg, ptcgNumber);
  if (card?.images?.large) {
    return { url: card.images.large, source: "POKEMONTCG_IO" };
  }
  if (card?.images?.small) {
    return { url: card.images.small, source: "POKEMONTCG_IO" };
  }
  return undefined;
}

/**
 * 세트 로고 URL (박스 패키지 상단 로고 텍스트).
 * pokemontcg.io의 set.images.logo 활용.
 */
export function resolveSetLogo(set: CardSet): string | undefined {
  const mapping = getMapping(set.id);
  if (!mapping?.pokemontcgIoId) return undefined;
  return `https://images.pokemontcg.io/${mapping.pokemontcgIoId}/logo.png`;
}

export function resolveSetSymbol(set: CardSet): string | undefined {
  const mapping = getMapping(set.id);
  if (!mapping?.pokemontcgIoId) return undefined;
  return `https://images.pokemontcg.io/${mapping.pokemontcgIoId}/symbol.png`;
}

/**
 * 실 박스 패키지 사진 URL (자체 호스팅 또는 외부 라이선스 클리어).
 * setImageMap.boxPhotoUrl에 매핑된 URL을 그대로 반환.
 */
export function resolveBoxPhoto(set: CardSet): string | undefined {
  const mapping = getMapping(set.id);
  return mapping?.boxPhotoUrl;
}

/**
 * 세트의 hero(박스 패키지 대표) 이미지 해소.
 * TCGdex hero → pokemontcg.io hero → placeholder
 */
export function resolveSetImage(set: CardSet): ResolvedImage {
  if (set.imageUrl) {
    return {
      url: set.imageUrl,
      source: set.imageSource ?? "LOCAL",
      alt: `${set.nameKo} 박스 대표 이미지`,
      isPlaceholder: false
    };
  }
  const mapping = getMapping(set.id);
  if (mapping) {
    // 1) TCGdex hero
    if (mapping.heroCardLocalId) {
      const tcg = resolveFromTcgdex(mapping, mapping.heroCardLocalId);
      if (tcg) {
        const cardName = tcg.tcgdexCard?.name ?? "대표 카드";
        return {
          url: tcg.url,
          source: tcg.source,
          alt: `${set.nameKo} — ${cardName}`,
          isPlaceholder: false
        };
      }
    }
    // 2) pokemontcg.io hero
    if (mapping.pokemontcgIoHeroNumber) {
      const ptcg = resolveFromPokemontcg(mapping, mapping.pokemontcgIoHeroNumber);
      if (ptcg) {
        return {
          url: ptcg.url,
          source: ptcg.source,
          alt: `${set.nameKo} 대표 카드`,
          isPlaceholder: false
        };
      }
    }
  }
  return {
    url: PLACEHOLDER_SET,
    source: "PLACEHOLDER",
    alt: `${set.nameKo} (이미지 준비중)`,
    isPlaceholder: true
  };
}

/**
 * 싱글 카드 이미지 해소.
 * card.number에서 localId 추출 → TCGdex → pokemontcg.io → placeholder
 * card에 ptcgNumber 옵션이 있으면 pokemontcg.io 우선
 */
export function resolveCardImage(card: Card, set: CardSet | undefined): ResolvedImage {
  if (card.imageUrl) {
    return {
      url: card.imageUrl,
      source: card.imageSource ?? "LOCAL",
      alt: card.nameKo,
      isPlaceholder: false
    };
  }
  if (!set) {
    return {
      url: PLACEHOLDER_CARD,
      source: "PLACEHOLDER",
      alt: `${card.nameKo} (이미지 준비중)`,
      isPlaceholder: true
    };
  }
  const mapping = getMapping(set.id);
  if (!mapping) {
    return {
      url: PLACEHOLDER_CARD,
      source: "PLACEHOLDER",
      alt: `${card.nameKo} (매핑 없음)`,
      isPlaceholder: true
    };
  }
  const localId = card.number.split("/")[0].trim();

  // 1) TCGdex 우선
  const tcg = resolveFromTcgdex(mapping, localId);
  if (tcg) {
    return {
      url: tcg.url,
      source: tcg.source,
      alt: `${card.nameKo}${tcg.tcgdexCard?.name ? ` (${tcg.tcgdexCard.name})` : ""}`,
      isPlaceholder: false
    };
  }

  // 2) pokemontcg.io 폴백 (메가 시리즈 등)
  // card.references에 ptcg number 정보가 있을 수도 있고, 기본은 localId 자체로 매칭 시도
  const ptcg = resolveFromPokemontcg(mapping, localId);
  if (ptcg) {
    return {
      url: ptcg.url,
      source: ptcg.source,
      alt: card.nameKo,
      isPlaceholder: false
    };
  }

  return {
    url: PLACEHOLDER_CARD,
    source: "PLACEHOLDER",
    alt: `${card.nameKo} (이미지 준비중)`,
    isPlaceholder: true
  };
}
