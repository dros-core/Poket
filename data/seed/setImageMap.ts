/**
 * 우리 내부 set.id ↔ 이미지 소스 매핑
 *
 * tcgdexId: TCGdex set ID (이미지 1차 소스)
 * heroCardLocalId: TCGdex 캐시에서 검증된 hero 카드 (박스 커버용)
 * pokemontcgIoId: pokemontcg.io 세트 ID (TCGdex가 image 미커버 시 폴백, 메가 시리즈)
 * pokemontcgIoHeroNumber: pokemontcg.io 세트의 hero 카드 번호
 */

export interface SetImageMapping {
  setId: string;
  tcgdexId: string;
  heroCardLocalId?: string;
  pokemontcgIoId?: string;
  pokemontcgIoHeroNumber?: string;
}

export const setImageMap: SetImageMapping[] = [
  // === SV 본팩 (TCGdex ja 이미지 모두 제공) ===
  { setId: "sv1k",  tcgdexId: "SV1S",  heroCardLocalId: "106", pokemontcgIoId: "sv1" },     // 코라이돈 ex SAR
  { setId: "sv1v",  tcgdexId: "SV1V",  heroCardLocalId: "106", pokemontcgIoId: "sv1" },     // 미라이돈 ex SAR
  { setId: "sv1a",  tcgdexId: "SV1a",  heroCardLocalId: "087" },                            // 알기게크네 ex SAR
  { setId: "sv2p",  tcgdexId: "SV2P",  heroCardLocalId: "097", pokemontcgIoId: "sv2" },     // 치오뇽 ex SAR
  { setId: "sv2d",  tcgdexId: "SV2D",  heroCardLocalId: "091", pokemontcgIoId: "sv2" },     // 이오노 SAR ★
  { setId: "sv2a",  tcgdexId: "SV2a",  heroCardLocalId: "201", pokemontcgIoId: "sv3pt5" },  // 리자몽 ex SAR ★
  { setId: "sv3a",  tcgdexId: "SV3a",  heroCardLocalId: "088" },                            // 차오리피 ex SAR
  { setId: "sv3",   tcgdexId: "SV3",   heroCardLocalId: "134", pokemontcgIoId: "sv3" },     // 리자몽 ex SAR
  { setId: "sv4k",  tcgdexId: "SV4K",  heroCardLocalId: "093", pokemontcgIoId: "sv4" },     // 고동치는달 ex SAR
  { setId: "sv4m",  tcgdexId: "SV4M",  heroCardLocalId: "093", pokemontcgIoId: "sv4" },     // 무쇠무인 ex SAR
  { setId: "sv4a",  tcgdexId: "SV4a",  heroCardLocalId: "320", pokemontcgIoId: "sv4pt5" },  // 메가 세트
  { setId: "sv5a",  tcgdexId: "SV5a",  heroCardLocalId: "095" },                            // 크림슨헤이즈
  { setId: "sv5k",  tcgdexId: "SV5K",  heroCardLocalId: "100", pokemontcgIoId: "sv5" },     // 날뛰는우레 ex UR
  { setId: "sv5m",  tcgdexId: "SV5M",  heroCardLocalId: "100", pokemontcgIoId: "sv5" },     // 사이버저지
  { setId: "sv6",   tcgdexId: "SV6",   heroCardLocalId: "098", pokemontcgIoId: "sv6" },     // 카르멘 SR
  { setId: "sv6a",  tcgdexId: "SV6a",  heroCardLocalId: "092" },                            // 나이트원더러
  { setId: "sv7",   tcgdexId: "SV7",   heroCardLocalId: "133", pokemontcgIoId: "sv7" },     // 테라파고스 ex SAR
  { setId: "sv7a",  tcgdexId: "SV7a",  heroCardLocalId: "094" },                            // 낙원드래고나
  { setId: "sv8",   tcgdexId: "SV8",   heroCardLocalId: "106" },                            // 초전브레이커
  { setId: "sv8a",  tcgdexId: "SV8a",  heroCardLocalId: "237", pokemontcgIoId: "sv8pt5" },  // 테라파고스 ex UR
  { setId: "sv9",   tcgdexId: "SV9",   heroCardLocalId: "131", pokemontcgIoId: "sv9" },     // N의 조로아크 UR
  { setId: "sv9a",  tcgdexId: "SV9a",  heroCardLocalId: "090" },                            // 히비키의 호우오 UR
  { setId: "sv10",  tcgdexId: "SV10",  heroCardLocalId: "098", pokemontcgIoId: "sv10" },    // 로켓단 사카키
  // === 화이트플레어 / 블랙볼트 (TCGdex image 미커버 → pokemontcg.io 폴백) ===
  {
    setId: "sv11w", tcgdexId: "SV11W", heroCardLocalId: "174",
    pokemontcgIoId: "rsv10pt5", pokemontcgIoHeroNumber: "173"  // Reshiram ex Black White Rare
  },
  {
    setId: "sv11b", tcgdexId: "SV11B", heroCardLocalId: "174",
    pokemontcgIoId: "zsv10pt5", pokemontcgIoHeroNumber: "172"  // Zekrom ex Black White Rare
  },
  // === 메가 시리즈 (TCGdex image 미제공 → pokemontcg.io 폴백 필수) ===
  {
    setId: "m1l", tcgdexId: "M1L", heroCardLocalId: "092",
    pokemontcgIoId: "me1", pokemontcgIoHeroNumber: "188"  // Mega Lucario ex Mega Hyper Rare
  },
  {
    setId: "m1s", tcgdexId: "M1S", heroCardLocalId: "092",
    pokemontcgIoId: "me1", pokemontcgIoHeroNumber: "187"  // Mega Gardevoir ex Mega Hyper Rare
  },
  {
    setId: "m2",  tcgdexId: "M2",  heroCardLocalId: "116",
    pokemontcgIoId: "me2", pokemontcgIoHeroNumber: "130"  // Mega Charizard X ex Mega Hyper Rare ★
  },
  {
    setId: "m3",  tcgdexId: "M3",  heroCardLocalId: "117",
    pokemontcgIoId: "me3", pokemontcgIoHeroNumber: "124"  // Mega Zygarde ex Mega Hyper Rare
  }
];

export function getMapping(setId: string): SetImageMapping | undefined {
  return setImageMap.find((m) => m.setId === setId);
}
