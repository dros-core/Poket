import type { Card } from "@/lib/types";

/**
 * 한국 시장에서 시세 추적이 가장 활발한 핵심 카드 데이터셋.
 * 실제 카드샵/번개장터 검색 기준 인기 카드 위주로 큐레이션.
 */
export const cards: Card[] = [
  // 스칼렛 ex / 바이올렛 ex
  {
    id: "sv1k-198",
    setId: "sv1k",
    number: "198/SV-P",
    nameKo: "리자몽 ex (SAR)",
    nameEn: "Charizard ex (SAR)",
    rarity: "SAR",
    pokemonType: "불꽃",
    illustrator: "5ban Graphics",
    isPullable: true,
    pullRate: 0.005,
    tags: ["인기", "메타", "그레이딩-수요"]
  },
  {
    id: "sv1v-200",
    setId: "sv1v",
    number: "200/190",
    nameKo: "미라이돈 ex (SAR)",
    nameEn: "Miraidon ex (SAR)",
    rarity: "SAR",
    pokemonType: "전기",
    isPullable: true,
    pullRate: 0.006,
    tags: ["커버", "한정"]
  },
  // 클레이 버스트 - 한국 절판 후 프리미엄 형성된 대표
  {
    id: "sv2d-091",
    setId: "sv2d",
    number: "091/071",
    nameKo: "님피아 ex (SAR)",
    nameEn: "Sylveon ex (SAR)",
    rarity: "SAR",
    pokemonType: "페어리",
    illustrator: "AKIRA EGAWA",
    isPullable: true,
    pullRate: 0.003,
    tags: ["프리미엄", "절판프리미엄", "그레이딩-수요"]
  },
  // 포켓몬 카드 151
  {
    id: "sv2a-205",
    setId: "sv2a",
    number: "205/165",
    nameKo: "리자드 (AR)",
    nameEn: "Charmeleon (AR)",
    rarity: "AR",
    pokemonType: "불꽃",
    isPullable: true,
    pullRate: 0.04,
    tags: ["일러스트인기"]
  },
  {
    id: "sv2a-183",
    setId: "sv2a",
    number: "183/165",
    nameKo: "리자몽 ex (SAR)",
    nameEn: "Charizard ex (SAR)",
    rarity: "SAR",
    pokemonType: "불꽃",
    illustrator: "PLANETA Mochizuki",
    isPullable: true,
    pullRate: 0.0028,
    tags: ["메가히트", "절판프리미엄", "그레이딩-수요"]
  },
  {
    id: "sv2a-201",
    setId: "sv2a",
    number: "201/165",
    nameKo: "뮤츠 (AR)",
    nameEn: "Mewtwo (AR)",
    rarity: "AR",
    pokemonType: "초",
    isPullable: true,
    pullRate: 0.04,
    tags: ["일러스트인기"]
  },
  // 흑염의 지배자
  {
    id: "sv3-108",
    setId: "sv3",
    number: "108/108",
    nameKo: "리자몽 ex (UR)",
    nameEn: "Charizard ex (UR)",
    rarity: "UR",
    pokemonType: "불꽃",
    isPullable: true,
    pullRate: 0.004,
    tags: ["골드레어", "프리미엄"]
  },
  {
    id: "sv3-104",
    setId: "sv3",
    number: "104/108",
    nameKo: "리자몽 ex (SAR)",
    nameEn: "Charizard ex (SAR)",
    rarity: "SAR",
    pokemonType: "불꽃",
    illustrator: "Tomokazu Komiya",
    isPullable: true,
    pullRate: 0.003,
    tags: ["메가히트", "그레이딩-수요"]
  },
  // 와일드포스 / 사이버저지
  {
    id: "sv5k-085",
    setId: "sv5k",
    number: "085/071",
    nameKo: "타이렌큐 ex (SAR)",
    nameEn: "Ogerpon ex (SAR)",
    rarity: "SAR",
    isPullable: true,
    pullRate: 0.003,
    tags: ["인기캐릭터"]
  },
  // 변환의 가면
  {
    id: "sv6-119",
    setId: "sv6",
    number: "119/101",
    nameKo: "오거폰 (떡잎의 가면) ex (SAR)",
    nameEn: "Ogerpon (Teal Mask) ex (SAR)",
    rarity: "SAR",
    pokemonType: "풀",
    isPullable: true,
    pullRate: 0.003,
    tags: ["커버", "이벤트"]
  },
  // 테라스탈 페스티벌 - 하이클래스
  {
    id: "sv8a-187",
    setId: "sv8a",
    number: "187/187",
    nameKo: "이상해꽃 ex (UR)",
    nameEn: "Venusaur ex (UR)",
    rarity: "UR",
    isPullable: true,
    pullRate: 0.004,
    tags: ["하이클래스", "골드레어"]
  },
  {
    id: "sv8a-186",
    setId: "sv8a",
    number: "186/187",
    nameKo: "테라파고스 ex (UR)",
    nameEn: "Terapagos ex (UR)",
    rarity: "UR",
    isPullable: true,
    pullRate: 0.004,
    tags: ["하이클래스", "커버"]
  },
  // 배틀 파트너즈
  {
    id: "sv9-098",
    setId: "sv9",
    number: "098/102",
    nameKo: "N의 조라크 ex (SAR)",
    nameEn: "N's Zoroark ex (SAR)",
    rarity: "SAR",
    isPullable: true,
    pullRate: 0.003,
    tags: ["트레이너관련", "인기"]
  },
  // 로켓단의 영광
  {
    id: "sv10-110",
    setId: "sv10",
    number: "110/110",
    nameKo: "뮤츠 ex (UR)",
    nameEn: "Mewtwo ex (UR)",
    rarity: "UR",
    isPullable: true,
    pullRate: 0.004,
    tags: ["커버", "하이프"]
  },
  {
    id: "sv10-105",
    setId: "sv10",
    number: "105/110",
    nameKo: "로사 (SAR)",
    nameEn: "Rosa (SAR)",
    rarity: "SAR",
    isPullable: true,
    pullRate: 0.003,
    tags: ["트레이너", "인기일러"]
  }
];

export function getCardById(id: string): Card | undefined {
  return cards.find((c) => c.id === id);
}

export function getCardsBySetId(setId: string): Card[] {
  return cards.filter((c) => c.setId === setId);
}
