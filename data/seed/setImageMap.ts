/**
 * 우리 내부 set.id ↔ TCGdex set.id 매핑
 *
 * heroCardLocalId: TCGdex 캐시(data/cache/tcgdex/)에서 검증된 박스 패키지 커버 카드 번호.
 * 보통 secret rare(SAR/UR) variant 또는 official 마지막 번호.
 *
 * scripts/verify-data.mjs 가 모든 hero 매핑을 자동 검증.
 */

export interface SetImageMapping {
  setId: string;
  tcgdexId: string;
  heroCardLocalId?: string;
  pokemontcgIoId?: string;
}

export const setImageMap: SetImageMapping[] = [
  { setId: "sv1k", tcgdexId: "SV1S", heroCardLocalId: "106", pokemontcgIoId: "sv1" },     // 코라이돈 ex SAR
  { setId: "sv1v", tcgdexId: "SV1V", heroCardLocalId: "106", pokemontcgIoId: "sv1" },     // 미라이돈 ex SAR
  { setId: "sv1a", tcgdexId: "SV1a", heroCardLocalId: "087" },                            // 알기게크네 ex SAR (한국어 캐시 비어있으면 일본어 폴백)
  { setId: "sv2p", tcgdexId: "SV2P", heroCardLocalId: "097", pokemontcgIoId: "sv2" },     // 치오뇽 ex SAR
  { setId: "sv2d", tcgdexId: "SV2D", heroCardLocalId: "091", pokemontcgIoId: "sv2" },     // 이오노 SAR (★ 최고 인기 카드)
  { setId: "sv2a", tcgdexId: "SV2a", heroCardLocalId: "201", pokemontcgIoId: "sv3pt5" },  // 리자몽 ex SAR (★ 메가히트)
  { setId: "sv3a", tcgdexId: "SV3a", heroCardLocalId: "088" },                            // 차오리피 ex SAR
  { setId: "sv3", tcgdexId: "SV3", heroCardLocalId: "134", pokemontcgIoId: "sv3" },       // 리자몽 ex SAR
  { setId: "sv4k", tcgdexId: "SV4K", heroCardLocalId: "093", pokemontcgIoId: "sv4" },     // 고동치는달 ex SAR
  { setId: "sv4m", tcgdexId: "SV4M", heroCardLocalId: "093", pokemontcgIoId: "sv4" },     // 무쇠무인 ex SAR
  { setId: "sv4a", tcgdexId: "SV4a", heroCardLocalId: "215", pokemontcgIoId: "sv4pt5" },  // 미라이돈/리자몽 SSR (검증 필요)
  { setId: "sv5a", tcgdexId: "SV5a", heroCardLocalId: "093" },                            // 무쇠가시 ex SAR
  { setId: "sv5k", tcgdexId: "SV5K", heroCardLocalId: "100", pokemontcgIoId: "sv5" },     // 날뛰는우레 ex UR
  { setId: "sv5m", tcgdexId: "SV5M", heroCardLocalId: "100", pokemontcgIoId: "sv5" },     // 무쇠암석 ex UR
  { setId: "sv6", tcgdexId: "SV6", heroCardLocalId: "098", pokemontcgIoId: "sv6" },       // 카르멘/한바리스 SR (sv6은 총 101장)
  { setId: "sv6a", tcgdexId: "SV6a", heroCardLocalId: "092" },                            // 비파/시로나 SR
  { setId: "sv7", tcgdexId: "SV7", heroCardLocalId: "133", pokemontcgIoId: "sv7" },       // 테라파고스 ex SAR
  { setId: "sv7a", tcgdexId: "SV7a", heroCardLocalId: "094" },                            // 메가야도란 ex SAR
  { setId: "sv8", tcgdexId: "SV8", heroCardLocalId: "106" },                              // 전기 ex UR
  { setId: "sv8a", tcgdexId: "SV8a", heroCardLocalId: "237", pokemontcgIoId: "sv8pt5" },  // 테라파고스 ex UR
  { setId: "sv9", tcgdexId: "SV9", heroCardLocalId: "131", pokemontcgIoId: "sv9" },       // N의 조로아크 ex UR
  { setId: "sv9a", tcgdexId: "SV9a", heroCardLocalId: "090" },                            // 히비키의 호우오 ex UR
  { setId: "sv10", tcgdexId: "SV10", heroCardLocalId: "098", pokemontcgIoId: "sv10" },    // 로켓단 에너지/사카키
  { setId: "sv11w", tcgdexId: "SV11W", heroCardLocalId: "174" },                          // 레시라무 ex UR
  { setId: "sv11b", tcgdexId: "SV11B", heroCardLocalId: "174" },                          // 제크로무 ex UR
  { setId: "m1l", tcgdexId: "M1L", heroCardLocalId: "092" },                              // 메가루카리오 ex UR
  { setId: "m1s", tcgdexId: "M1S", heroCardLocalId: "092" },                              // 메가가디안 ex UR
  { setId: "m2", tcgdexId: "M2", heroCardLocalId: "116" },                                // 메가리자몽 X ex UR (★ 메가 핫셋)
  { setId: "m3", tcgdexId: "M3", heroCardLocalId: "117" }                                 // 메가지가르데 ex UR
];

export function getMapping(setId: string): SetImageMapping | undefined {
  return setImageMap.find((m) => m.setId === setId);
}
