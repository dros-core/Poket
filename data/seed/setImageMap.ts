/**
 * 우리 내부 set.id ↔ 이미지 소스 매핑
 *
 * tcgdexId: TCGdex set ID (카드 일러스트 1차 소스)
 * heroCardLocalId: TCGdex 캐시에서 검증된 hero 카드
 * pokemontcgIoId: pokemontcg.io 세트 ID (로고/심볼/메가 시리즈 카드 폴백)
 * boxPhotoUrl: 실제 박스 패키지 사진 URL
 *   - TCGPlayer Japan 상품 이미지 (hotlink 허용 확인됨)
 *   - 또는 자체 호스팅 "/box-photos/{setId}.jpg"
 */

const TCG = (productId: number) => `https://product-images.tcgplayer.com/fit-in/600x600/${productId}.jpg`;

export interface SetImageMapping {
  setId: string;
  tcgdexId: string;
  heroCardLocalId?: string;
  pokemontcgIoId?: string;
  pokemontcgIoHeroNumber?: string;
  boxPhotoUrl?: string;
}

export const setImageMap: SetImageMapping[] = [
  // === SV 본팩 ===
  { setId: "sv1k",  tcgdexId: "SV1S",  heroCardLocalId: "106", pokemontcgIoId: "sv1",     boxPhotoUrl: TCG(565247) },
  { setId: "sv1v",  tcgdexId: "SV1V",  heroCardLocalId: "106", pokemontcgIoId: "sv1",     boxPhotoUrl: TCG(565244) },
  { setId: "sv1a",  tcgdexId: "SV1a",  heroCardLocalId: "087",                            boxPhotoUrl: TCG(565248) },
  { setId: "sv2p",  tcgdexId: "SV2P",  heroCardLocalId: "097", pokemontcgIoId: "sv2",     boxPhotoUrl: TCG(565239) },
  { setId: "sv2d",  tcgdexId: "SV2D",  heroCardLocalId: "091", pokemontcgIoId: "sv2",     boxPhotoUrl: TCG(565240) },
  { setId: "sv2a",  tcgdexId: "SV2a",  heroCardLocalId: "201", pokemontcgIoId: "sv3pt5",  boxPhotoUrl: TCG(565243) },
  { setId: "sv3a",  tcgdexId: "SV3a",  heroCardLocalId: "088" },
  { setId: "sv3",   tcgdexId: "SV3",   heroCardLocalId: "134", pokemontcgIoId: "sv3",     boxPhotoUrl: TCG(565236) },
  { setId: "sv4k",  tcgdexId: "SV4K",  heroCardLocalId: "093", pokemontcgIoId: "sv4",     boxPhotoUrl: TCG(565231) },
  { setId: "sv4m",  tcgdexId: "SV4M",  heroCardLocalId: "093", pokemontcgIoId: "sv4",     boxPhotoUrl: TCG(565228) },
  { setId: "sv4a",  tcgdexId: "SV4a",  heroCardLocalId: "320", pokemontcgIoId: "sv4pt5",  boxPhotoUrl: TCG(565232) },
  { setId: "sv5a",  tcgdexId: "SV5a",  heroCardLocalId: "095",                            boxPhotoUrl: TCG(565226) },
  { setId: "sv5k",  tcgdexId: "SV5K",  heroCardLocalId: "100", pokemontcgIoId: "sv5",     boxPhotoUrl: TCG(565225) },
  { setId: "sv5m",  tcgdexId: "SV5M",  heroCardLocalId: "100", pokemontcgIoId: "sv5",     boxPhotoUrl: TCG(565222) },
  { setId: "sv6",   tcgdexId: "SV6",   heroCardLocalId: "098", pokemontcgIoId: "sv6",     boxPhotoUrl: TCG(565221) },
  { setId: "sv6a",  tcgdexId: "SV6a",  heroCardLocalId: "092",                            boxPhotoUrl: TCG(565218) },
  { setId: "sv7",   tcgdexId: "SV7",   heroCardLocalId: "133", pokemontcgIoId: "sv7",     boxPhotoUrl: TCG(565217) },
  { setId: "sv7a",  tcgdexId: "SV7a",  heroCardLocalId: "094",                            boxPhotoUrl: TCG(580709) },
  { setId: "sv8",   tcgdexId: "SV8",   heroCardLocalId: "106",                            boxPhotoUrl: TCG(587728) },
  { setId: "sv8a",  tcgdexId: "SV8a",  heroCardLocalId: "237", pokemontcgIoId: "sv8pt5",  boxPhotoUrl: TCG(603428) },
  { setId: "sv9",   tcgdexId: "SV9",   heroCardLocalId: "131", pokemontcgIoId: "sv9",     boxPhotoUrl: TCG(614707) },
  { setId: "sv9a",  tcgdexId: "SV9a",  heroCardLocalId: "090",                            boxPhotoUrl: TCG(623310) },
  { setId: "sv10",  tcgdexId: "SV10",  heroCardLocalId: "098", pokemontcgIoId: "sv10",    boxPhotoUrl: TCG(629197) },
  // === 화이트플레어 / 블랙볼트 (TCGdex 카드 이미지 미커버 → pokemontcg.io 폴백) ===
  {
    setId: "sv11w", tcgdexId: "SV11W", heroCardLocalId: "174",
    pokemontcgIoId: "rsv10pt5", pokemontcgIoHeroNumber: "173",
    boxPhotoUrl: TCG(637386)
  },
  {
    setId: "sv11b", tcgdexId: "SV11B", heroCardLocalId: "174",
    pokemontcgIoId: "zsv10pt5", pokemontcgIoHeroNumber: "172",
    boxPhotoUrl: TCG(637384)
  },
  // === 메가 시리즈 ===
  {
    setId: "m1l", tcgdexId: "M1L", heroCardLocalId: "092",
    pokemontcgIoId: "me1", pokemontcgIoHeroNumber: "188",
    boxPhotoUrl: TCG(647500)
  },
  {
    setId: "m1s", tcgdexId: "M1S", heroCardLocalId: "092",
    pokemontcgIoId: "me1", pokemontcgIoHeroNumber: "187",
    boxPhotoUrl: TCG(647501)
  },
  {
    setId: "m2",  tcgdexId: "M2",  heroCardLocalId: "116",
    pokemontcgIoId: "me2", pokemontcgIoHeroNumber: "130",
    boxPhotoUrl: TCG(655968)
  },
  {
    setId: "m3",  tcgdexId: "M3",  heroCardLocalId: "117",
    pokemontcgIoId: "me3", pokemontcgIoHeroNumber: "124"
    // m3 (닌자스피너) TCGPlayer 미등록 → BoxMockup으로 폴백
  }
];

export function getMapping(setId: string): SetImageMapping | undefined {
  return setImageMap.find((m) => m.setId === setId);
}
