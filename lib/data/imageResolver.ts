/**
 * 카드/세트 ID에서 실제 이미지 URL로 해소(resolve)하는 단일 진입점.
 * 우선순위:
 *   1) 시드에 명시된 imageUrl
 *   2) TCGdex 캐시 (ko → ja → en 폴백된 결과)
 *   3) placeholder
 */

import { loadSetFromCacheSync, buildImageUrl, findCardByLocalId } from "./tcgdexCache";
import { getMapping } from "@/data/seed/setImageMap";
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
 * 세트의 대표(hero) 카드 이미지를 박스 대표 이미지로 사용.
 * TCGdex는 별도 박스/로고 이미지를 제공하지 않으므로 hero card로 대체.
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
  if (mapping?.heroCardLocalId) {
    const cached = loadSetFromCacheSync(mapping.tcgdexId);
    if (cached) {
      const heroCard = findCardByLocalId(cached, mapping.heroCardLocalId);
      const url = buildImageUrl(heroCard?.image, "high");
      if (url) {
        return {
          url,
          source: cached.__lang === "ko" ? "TCGDEX_KO" : cached.__lang === "ja" ? "TCGDEX_JA" : "TCGDEX_EN",
          alt: `${set.nameKo} — ${heroCard?.name ?? "대표 카드"} (${heroCard?.localId})`,
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
 * card.number 또는 card.id에서 localId 추출 후 TCGdex 캐시 조회.
 */
export function resolveCardImage(card: Card, set: CardSet | undefined): ResolvedImage {
  if (card.imageUrl) {
    return {
      url: card.imageUrl,
      source: card.imageSource ?? "LOCAL",
      alt: `${card.nameKo}`,
      isPlaceholder: false
    };
  }
  if (set) {
    const mapping = getMapping(set.id);
    if (mapping) {
      const cached = loadSetFromCacheSync(mapping.tcgdexId);
      if (cached) {
        // card.number 가 "183/165" 또는 "201/165" 형태 — 슬래시 앞만 사용
        const localIdRaw = card.number.split("/")[0].trim();
        const found = findCardByLocalId(cached, localIdRaw);
        const url = buildImageUrl(found?.image, "high");
        if (url) {
          return {
            url,
            source: cached.__lang === "ko" ? "TCGDEX_KO" : cached.__lang === "ja" ? "TCGDEX_JA" : "TCGDEX_EN",
            alt: `${card.nameKo} (${found?.name ?? ""})`,
            isPlaceholder: false
          };
        }
      }
    }
  }
  return {
    url: PLACEHOLDER_CARD,
    source: "PLACEHOLDER",
    alt: `${card.nameKo} (이미지 준비중)`,
    isPlaceholder: true
  };
}
