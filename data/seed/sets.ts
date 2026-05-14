import type { CardSet } from "@/lib/types";

/**
 * 한국 정식 발매 포켓몬 카드 확장팩 데이터셋
 *
 * 출처: 포켓몬코리아 공식, 너정다(ICU), KREAM, TCGBOX, 카드몬스터, TCGdex API 메타,
 *      KrystalKollectz Korean lists, namu.wiki 한국판 시리즈 일람
 *
 * 정합성 검증: scripts/verify-data.mjs 와 data/cache/tcgdex/ 캐시로 상시 검증.
 * 발매일: 한국판 발매일 우선 (releaseDate). TCGdex의 releaseDate는 일본 발매일.
 *
 * - 한국 표준 박스 정가: 30팩 박스 = 약 117,000원
 * - 20팩 강화확장팩(예: 151) = 약 88,000원
 * - 10팩 하이클래스(예: 테라스탈 페스타) = 약 88,000원
 * - 1카툰 = 6박스 (한국 표준)
 */

function ref(setKoSearch: string) {
  return [
    { label: "KREAM 검색", url: `https://kream.co.kr/search?keyword=${encodeURIComponent(setKoSearch)}`, kind: "PRICE" as const },
    { label: "너정다 (ICU)", url: "https://icu.gg/", kind: "COMMUNITY" as const },
    { label: "TCGBOX", url: "https://tcgbox.co.kr/", kind: "PRICE" as const },
    { label: "포켓몬코리아 공식", url: "https://pokemonkorea.co.kr/", kind: "OFFICIAL" as const }
  ];
}

export const cardSets: CardSet[] = [
  // ===== 스칼렛&바이올렛 1세대 =====
  {
    id: "sv1k", code: "sv1S", nameKo: "스칼렛 ex", nameEn: "Scarlet ex", nameJa: "スカーレットex",
    series: "스칼렛&바이올렛", releaseDate: "2023-04-14", totalCards: 78,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: false,
    tcgdexId: "SV1S", pokemontcgIoId: "sv1", references: ref("포켓몬 스칼렛")
  },
  {
    id: "sv1v", code: "sv1V", nameKo: "바이올렛 ex", nameEn: "Violet ex", nameJa: "バイオレットex",
    series: "스칼렛&바이올렛", releaseDate: "2023-04-14", totalCards: 78,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: false,
    tcgdexId: "SV1V", pokemontcgIoId: "sv1", references: ref("포켓몬 바이올렛")
  },
  {
    id: "sv1a", code: "sv1a", nameKo: "트리플렛 비트", nameEn: "Triplet Beat", nameJa: "トリプレットビート",
    series: "스칼렛&바이올렛 강화확장팩", releaseDate: "2023-05-26", totalCards: 73,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: false,
    tcgdexId: "SV1a", references: ref("트리플렛비트")
  },
  // ===== 스노해저드 / 클레이버스트 =====
  {
    id: "sv2p", code: "sv2P", nameKo: "스노해저드", nameEn: "Snow Hazard", nameJa: "スノーハザード",
    series: "스칼렛&바이올렛", releaseDate: "2023-06-30", totalCards: 71,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: false,
    tcgdexId: "SV2P", pokemontcgIoId: "sv2", references: ref("스노해저드")
  },
  {
    id: "sv2d", code: "sv2D", nameKo: "클레이버스트", nameEn: "Clay Burst", nameJa: "クレイバースト",
    series: "스칼렛&바이올렛", releaseDate: "2023-06-30", totalCards: 71,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: false,
    tcgdexId: "SV2D", pokemontcgIoId: "sv2", references: ref("클레이버스트")
  },
  // ===== 포켓몬 카드 151 =====
  {
    id: "sv2a", code: "sv2a", nameKo: "포켓몬 카드 151", nameEn: "Pokémon Card 151", nameJa: "ポケモンカード151",
    series: "스칼렛&바이올렛 강화확장팩", releaseDate: "2023-07-28", totalCards: 165,
    packsPerBox: 20, cardsPerPack: 7, msrpKRW: 88000, isActive: false,
    tcgdexId: "SV2a", pokemontcgIoId: "sv3pt5", references: ref("포켓몬 카드 151")
  },
  // ===== 레이징서프 / 흑염의 지배자 =====
  {
    id: "sv3a", code: "sv3a", nameKo: "레이징 서프", nameEn: "Raging Surf", nameJa: "レイジングサーフ",
    series: "스칼렛&바이올렛", releaseDate: "2023-08-25", totalCards: 62,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: false,
    tcgdexId: "SV3a", references: ref("레이징서프")
  },
  {
    id: "sv3", code: "sv3", nameKo: "흑염의 지배자", nameEn: "Ruler of the Black Flame", nameJa: "黒炎の支配者",
    series: "스칼렛&바이올렛", releaseDate: "2023-09-15", totalCards: 108,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: false,
    tcgdexId: "SV3", pokemontcgIoId: "sv3", references: ref("흑염의 지배자")
  },
  // ===== 고대의 포효 / 미래의 일섬 =====
  {
    id: "sv4k", code: "sv4K", nameKo: "고대의 포효", nameEn: "Ancient Roar", nameJa: "古代の咆哮",
    series: "스칼렛&바이올렛", releaseDate: "2023-11-30", totalCards: 66,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: false,
    tcgdexId: "SV4K", pokemontcgIoId: "sv4", references: ref("고대의 포효")
  },
  {
    id: "sv4m", code: "sv4M", nameKo: "미래의 일섬", nameEn: "Future Flash", nameJa: "未来の一閃",
    series: "스칼렛&바이올렛", releaseDate: "2023-11-30", totalCards: 66,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: false,
    tcgdexId: "SV4M", pokemontcgIoId: "sv4", references: ref("미래의 일섬")
  },
  // ===== 샤이니 트레저 ex (하이클래스) =====
  {
    id: "sv4a", code: "sv4a", nameKo: "샤이니 트레저 ex", nameEn: "Shiny Treasure ex", nameJa: "シャイニートレジャーex",
    series: "스칼렛&바이올렛 하이클래스", releaseDate: "2024-01-26", totalCards: 190,
    packsPerBox: 10, cardsPerPack: 10, msrpKRW: 88000, isActive: false,
    tcgdexId: "SV4a", pokemontcgIoId: "sv4pt5", references: ref("샤이니 트레저")
  },
  // ===== 크림슨헤이즈 =====
  {
    id: "sv5a", code: "sv5a", nameKo: "크림슨 헤이즈", nameEn: "Crimson Haze", nameJa: "クリムゾンヘイズ",
    series: "스칼렛&바이올렛", releaseDate: "2024-02-23", totalCards: 66,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: false,
    tcgdexId: "SV5a", references: ref("크림슨헤이즈")
  },
  // ===== 와일드포스 / 사이버저지 =====
  {
    id: "sv5k", code: "sv5K", nameKo: "와일드포스", nameEn: "Wild Force", nameJa: "ワイルドフォース",
    series: "스칼렛&바이올렛", releaseDate: "2024-03-06", totalCards: 71,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "SV5K", pokemontcgIoId: "sv5", references: ref("와일드포스")
  },
  {
    id: "sv5m", code: "sv5M", nameKo: "사이버저지", nameEn: "Cyber Judge", nameJa: "サイバージャッジ",
    series: "스칼렛&바이올렛", releaseDate: "2024-03-06", totalCards: 71,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "SV5M", pokemontcgIoId: "sv5", references: ref("사이버저지")
  },
  // ===== 변환의 가면 =====
  {
    id: "sv6", code: "sv6", nameKo: "변환의 가면", nameEn: "Mask of Change", nameJa: "変幻の仮面",
    series: "스칼렛&바이올렛", releaseDate: "2024-06-21", totalCards: 101,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "SV6", pokemontcgIoId: "sv6", references: ref("변환의 가면")
  },
  // ===== 나이트 원더러 =====
  {
    id: "sv6a", code: "sv6a", nameKo: "나이트 원더러", nameEn: "Night Wanderer", nameJa: "ナイトワンダラー",
    series: "스칼렛&바이올렛", releaseDate: "2024-08-09", totalCards: 64,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "SV6a", references: ref("나이트 원더러")
  },
  // ===== 스텔라 미라클 =====
  {
    id: "sv7", code: "sv7", nameKo: "스텔라 미라클", nameEn: "Stellar Miracle", nameJa: "ステラミラクル",
    series: "스칼렛&바이올렛", releaseDate: "2024-09-06", totalCards: 101,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "SV7", pokemontcgIoId: "sv7", references: ref("스텔라 미라클")
  },
  // ===== 낙원 드래고나 =====
  {
    id: "sv7a", code: "sv7a", nameKo: "낙원 드래고나", nameEn: "Paradise Dragona", nameJa: "楽園ドラゴーナ",
    series: "스칼렛&바이올렛", releaseDate: "2024-10-30", totalCards: 64,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "SV7a", references: ref("낙원 드래고나")
  },
  // ===== 초전브레이커 =====
  {
    id: "sv8", code: "sv8", nameKo: "초전 브레이커", nameEn: "Super Electric Breaker", nameJa: "超電ブレイカー",
    series: "스칼렛&바이올렛", releaseDate: "2024-11-27", totalCards: 106,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "SV8", references: ref("초전 브레이커")
  },
  // ===== 테라스탈 페스타 ex =====
  {
    id: "sv8a", code: "sv8a", nameKo: "테라스탈 페스타 ex", nameEn: "Terastal Festival ex", nameJa: "テラスタルフェスex",
    series: "스칼렛&바이올렛 하이클래스", releaseDate: "2025-01-22", totalCards: 187,
    packsPerBox: 10, cardsPerPack: 10, msrpKRW: 88000, isActive: true,
    tcgdexId: "SV8a", pokemontcgIoId: "sv8pt5", references: ref("테라스탈 페스타")
  },
  // ===== 배틀 파트너즈 =====
  {
    id: "sv9", code: "sv9", nameKo: "배틀 파트너즈", nameEn: "Battle Partners", nameJa: "バトルパートナーズ",
    series: "스칼렛&바이올렛", releaseDate: "2025-03-21", totalCards: 100,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "SV9", pokemontcgIoId: "sv9", references: ref("배틀 파트너즈")
  },
  // ===== 열풍의 아레나 =====
  {
    id: "sv9a", code: "sv9a", nameKo: "열풍의 아레나", nameEn: "Heat Wave Arena", nameJa: "熱風のアリーナ",
    series: "스칼렛&바이올렛", releaseDate: "2025-05-16", totalCards: 63,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "SV9a", references: ref("열풍의 아레나")
  },
  // ===== 로켓단의 영광 =====
  {
    id: "sv10", code: "sv10", nameKo: "로켓단의 영광", nameEn: "Glory of Team Rocket", nameJa: "ロケット団の栄光",
    series: "스칼렛&바이올렛", releaseDate: "2025-06-20", totalCards: 98,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "SV10", pokemontcgIoId: "sv10", references: ref("로켓단의 영광")
  },
  // ===== 화이트 플레어 / 블랙 볼트 (하이클래스) =====
  {
    id: "sv11w", code: "sv11W", nameKo: "화이트 플레어", nameEn: "White Flare", nameJa: "ホワイトフレア",
    series: "스칼렛&바이올렛 하이클래스", releaseDate: "2025-09-12", totalCards: 174,
    packsPerBox: 10, cardsPerPack: 10, msrpKRW: 88000, isActive: true,
    tcgdexId: "SV11W", references: ref("화이트 플레어")
  },
  {
    id: "sv11b", code: "sv11B", nameKo: "블랙 볼트", nameEn: "Black Bolt", nameJa: "ブラックボルト",
    series: "스칼렛&바이올렛 하이클래스", releaseDate: "2025-09-12", totalCards: 174,
    packsPerBox: 10, cardsPerPack: 10, msrpKRW: 88000, isActive: true,
    tcgdexId: "SV11B", references: ref("블랙 볼트")
  },
  // ===== 메가 진화 시리즈 (한국 2025-09 ~ 2026-05) =====
  {
    id: "m1l", code: "M1L", nameKo: "메가브레이브", nameEn: "Mega Brave", nameJa: "メガブレイブ",
    series: "메가 진화", releaseDate: "2025-09-26", totalCards: 63,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "M1L", references: ref("메가브레이브")
  },
  {
    id: "m1s", code: "M1S", nameKo: "메가심포니아", nameEn: "Mega Symphonia", nameJa: "メガシンフォニア",
    series: "메가 진화", releaseDate: "2025-09-26", totalCards: 63,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "M1S", references: ref("메가심포니아")
  },
  {
    id: "m2", code: "M2", nameKo: "인페르노 X", nameEn: "Inferno X", nameJa: "インフェルノX",
    series: "메가 진화", releaseDate: "2025-11-28", totalCards: 80,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "M2", references: ref("인페르노 X")
  },
  {
    id: "m3", code: "M3", nameKo: "닌자스피너", nameEn: "Ninja Spinner", nameJa: "ニンジャスピナー",
    series: "메가 진화", releaseDate: "2026-05-01", totalCards: 80,
    packsPerBox: 30, cardsPerPack: 5, msrpKRW: 117000, isActive: true,
    tcgdexId: "M3", references: ref("닌자스피너")
  }
];

export function getSetById(id: string): CardSet | undefined {
  return cardSets.find((s) => s.id === id);
}
