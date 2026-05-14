import type { CardSet } from "@/lib/types";

/**
 * 한국 정식 발매 포켓몬 카드 확장팩 데이터셋
 * 출처: 포켓몬코리아 공식, 너정다(ICU), KREAM, TCGBOX, 카드몬스터, 나무위키 등
 *
 * 한국 표준 박스 정가: 30팩 박스 = 약 117,000원 (팩당 4,500~5,000원).
 *                    하이클래스/스페셜은 박스당 팩 수가 다름 (예: 10팩, 20팩).
 * 카툰: 6박스 (한국 표준), 일부 SKU는 12박스.
 */
export const cardSets: CardSet[] = [
  {
    id: "sv1k",
    code: "sv1S",
    nameKo: "스칼렛 ex",
    nameEn: "Scarlet ex",
    nameJa: "スカーレットex",
    series: "스칼렛&바이올렛",
    releaseDate: "2023-04-14",
    totalCards: 78,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: false
  },
  {
    id: "sv1v",
    code: "sv1V",
    nameKo: "바이올렛 ex",
    nameEn: "Violet ex",
    nameJa: "バイオレットex",
    series: "스칼렛&바이올렛",
    releaseDate: "2023-04-14",
    totalCards: 78,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: false
  },
  {
    id: "sv2d",
    code: "sv2D",
    nameKo: "클레이 버스트",
    nameEn: "Clay Burst",
    nameJa: "クレイバースト",
    series: "스칼렛&바이올렛",
    releaseDate: "2023-07-21",
    totalCards: 71,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: false
  },
  {
    id: "sv2a",
    code: "sv2a",
    nameKo: "포켓몬 카드 151",
    nameEn: "Pokémon Card 151",
    nameJa: "ポケモンカード151",
    series: "스칼렛&바이올렛 강화확장팩",
    releaseDate: "2023-09-22",
    totalCards: 165,
    packsPerBox: 20,
    cardsPerPack: 7,
    msrpKRW: 88000,
    isActive: false
  },
  {
    id: "sv3",
    code: "sv3",
    nameKo: "흑염의 지배자",
    nameEn: "Ruler of the Black Flame",
    nameJa: "黒炎の支配者",
    series: "스칼렛&바이올렛",
    releaseDate: "2023-11-17",
    totalCards: 108,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: false
  },
  {
    id: "sv4a",
    code: "sv4a",
    nameKo: "샤이니 트레저 ex",
    nameEn: "Shiny Treasure ex",
    nameJa: "シャイニートレジャーex",
    series: "스칼렛&바이올렛 하이클래스",
    releaseDate: "2024-01-26",
    totalCards: 351,
    packsPerBox: 10,
    cardsPerPack: 11,
    msrpKRW: 88000,
    isActive: true
  },
  {
    id: "sv4k",
    code: "sv4K",
    nameKo: "고대의 포효",
    nameEn: "Ancient Roar",
    nameJa: "古代の咆哮",
    series: "스칼렛&바이올렛",
    releaseDate: "2024-01-26",
    totalCards: 66,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: true
  },
  {
    id: "sv4m",
    code: "sv4M",
    nameKo: "미래의 일섬",
    nameEn: "Future Flash",
    nameJa: "未来の一閃",
    series: "스칼렛&바이올렛",
    releaseDate: "2024-01-26",
    totalCards: 66,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: true
  },
  {
    id: "sv5k",
    code: "sv5K",
    nameKo: "와일드포스",
    nameEn: "Wild Force",
    nameJa: "ワイルドフォース",
    series: "스칼렛&바이올렛",
    releaseDate: "2024-04-26",
    totalCards: 71,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: true
  },
  {
    id: "sv5m",
    code: "sv5M",
    nameKo: "사이버저지",
    nameEn: "Cyber Judge",
    nameJa: "サイバージャッジ",
    series: "스칼렛&바이올렛",
    releaseDate: "2024-04-26",
    totalCards: 71,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: true
  },
  {
    id: "sv6",
    code: "sv6",
    nameKo: "변환의 가면",
    nameEn: "Mask of Change",
    nameJa: "変幻の仮面",
    series: "스칼렛&바이올렛",
    releaseDate: "2024-07-19",
    totalCards: 101,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: true
  },
  {
    id: "sv7",
    code: "sv7",
    nameKo: "스텔라 미라클",
    nameEn: "Stellar Miracle",
    nameJa: "ステラミラクル",
    series: "스칼렛&바이올렛",
    releaseDate: "2024-10-18",
    totalCards: 101,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: true
  },
  {
    id: "sv8a",
    code: "sv8a",
    nameKo: "테라스탈 페스타 ex",
    nameEn: "Terastal Festival ex",
    nameJa: "テラスタルフェスタex",
    series: "스칼렛&바이올렛 하이클래스",
    releaseDate: "2026-01-24",
    totalCards: 187,
    packsPerBox: 10,
    cardsPerPack: 11,
    msrpKRW: 88000,
    isActive: true
  },
  {
    id: "sv9",
    code: "sv9",
    nameKo: "배틀 파트너즈",
    nameEn: "Battle Partners",
    nameJa: "バトルパートナーズ",
    series: "스칼렛&바이올렛",
    releaseDate: "2025-02-21",
    totalCards: 102,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: true
  },
  {
    id: "sv9a",
    code: "sv9a",
    nameKo: "열풍의 아레나",
    nameEn: "Heat Wave Arena",
    nameJa: "熱風のアリーナ",
    series: "스칼렛&바이올렛",
    releaseDate: "2025-05-30",
    totalCards: 100,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: true
  },
  {
    id: "sv10",
    code: "sv10",
    nameKo: "낙원 드래고나",
    nameEn: "Paradise Dragona",
    nameJa: "楽園ドラゴナ",
    series: "스칼렛&바이올렛",
    releaseDate: "2025-10-17",
    totalCards: 110,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: true
  },
  {
    id: "mega1",
    code: "mega1",
    nameKo: "메가 인페르노 X",
    nameEn: "Mega Inferno X",
    nameJa: "メガインフェルノX",
    series: "메가 진화",
    releaseDate: "2026-03-13",
    totalCards: 120,
    packsPerBox: 30,
    cardsPerPack: 5,
    msrpKRW: 117000,
    isActive: true
  }
];

export function getSetById(id: string): CardSet | undefined {
  return cardSets.find((s) => s.id === id);
}
