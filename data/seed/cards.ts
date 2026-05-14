import type { Card } from "@/lib/types";

/**
 * 한국 시장에서 시세 추적이 활발한 핵심 카드 큐레이션.
 *
 * 모든 카드 번호(localId)는 TCGdex API(data/cache/tcgdex/) 캐시로 검증됨.
 * scripts/verify-data.mjs 가 모든 카드의 setId-localId 매칭을 자동 검증.
 *
 * 카드 ID 패턴: "{setId}-{localId 3자리}" (예: "sv2a-201")
 * 이미지: lib/data/imageResolver.ts 가 자동으로 TCGdex에서 매칭
 *  → 동명의 다른 세트 카드(예: 흑염의 지배자 #134 리자몽 ex SAR vs 151 #201)는 set 단위로 분리 보장.
 */
export const cards: Card[] = [
  // ============ SV1S 스칼렛 ex ============
  {
    id: "sv1k-106", setId: "sv1k", number: "106/078",
    nameKo: "코라이돈 ex (SAR)", nameEn: "Koraidon ex (SAR)",
    rarity: "SAR", pokemonType: "격투",
    illustrator: "5ban Graphics", isPullable: true, pullRate: 0.005,
    tags: ["커버", "초기프리미엄"]
  },
  // ============ SV1V 바이올렛 ex ============
  {
    id: "sv1v-106", setId: "sv1v", number: "106/078",
    nameKo: "미라이돈 ex (SAR)", nameEn: "Miraidon ex (SAR)",
    rarity: "SAR", pokemonType: "전기",
    isPullable: true, pullRate: 0.005,
    tags: ["커버", "초기프리미엄"]
  },
  // ============ SV2D 클레이버스트 ============
  {
    id: "sv2d-091", setId: "sv2d", number: "091/071",
    nameKo: "이오노 (SAR)", nameEn: "Iono (SAR)",
    rarity: "SAR", illustrator: "AKIRA EGAWA",
    isPullable: true, pullRate: 0.0025,
    tags: ["트레이너", "메가히트", "절판프리미엄", "그레이딩-수요"]
  },
  {
    id: "sv2d-093", setId: "sv2d", number: "093/071",
    nameKo: "디안루 ex (SAR)", nameEn: "Ting-Lu ex (SAR)",
    rarity: "SAR", pokemonType: "악",
    isPullable: true, pullRate: 0.003,
    tags: ["메타", "절판프리미엄"]
  },
  // ============ SV2P 스노해저드 ============
  {
    id: "sv2p-097", setId: "sv2p", number: "097/071",
    nameKo: "치오뇽 ex (SAR)", nameEn: "Chien-Pao ex (SAR)",
    rarity: "SAR", pokemonType: "물",
    isPullable: true, pullRate: 0.003,
    tags: ["메타", "절판프리미엄"]
  },
  // ============ SV2a 포켓몬 카드 151 (최대 절판 프리미엄) ============
  {
    id: "sv2a-183", setId: "sv2a", number: "183/165",
    nameKo: "뮤츠 (SR)", nameEn: "Mewtwo (SR)",
    rarity: "SR", pokemonType: "초",
    illustrator: "PLANETA Tsuji", isPullable: true, pullRate: 0.025,
    tags: ["일러스트인기", "절판프리미엄"]
  },
  {
    id: "sv2a-185", setId: "sv2a", number: "185/165",
    nameKo: "리자몽 ex (SR)", nameEn: "Charizard ex (SR)",
    rarity: "SR", pokemonType: "불꽃",
    illustrator: "5ban Graphics", isPullable: true, pullRate: 0.025,
    tags: ["메가히트", "절판프리미엄"]
  },
  {
    id: "sv2a-201", setId: "sv2a", number: "201/165",
    nameKo: "리자몽 ex (SAR)", nameEn: "Charizard ex (SAR)",
    rarity: "SAR", pokemonType: "불꽃",
    illustrator: "miki kudo", isPullable: true, pullRate: 0.0028,
    tags: ["메가히트", "절판프리미엄", "그레이딩-수요"]
  },
  {
    id: "sv2a-205", setId: "sv2a", number: "205/165",
    nameKo: "뮤 ex (SAR)", nameEn: "Mew ex (SAR)",
    rarity: "SAR", pokemonType: "초",
    illustrator: "tetsuya koizumi", isPullable: true, pullRate: 0.003,
    tags: ["인기", "절판프리미엄", "그레이딩-수요"]
  },
  {
    id: "sv2a-206", setId: "sv2a", number: "206/165",
    nameKo: "에리카의 초대 (SAR)", nameEn: "Erika's Invitation (SAR)",
    rarity: "SAR", illustrator: "sui",
    isPullable: true, pullRate: 0.002,
    tags: ["트레이너", "프리미엄", "그레이딩-수요"]
  },
  {
    id: "sv2a-207", setId: "sv2a", number: "207/165",
    nameKo: "사카키의 카리스마 (SAR)", nameEn: "Giovanni's Charisma (SAR)",
    rarity: "SAR", illustrator: "AKIRA EGAWA",
    isPullable: true, pullRate: 0.002,
    tags: ["트레이너", "프리미엄"]
  },
  // ============ SV3 흑염의 지배자 ============
  {
    id: "sv3-125", setId: "sv3", number: "125/108",
    nameKo: "리자몽 ex (SR)", nameEn: "Charizard ex (SR)",
    rarity: "SR", pokemonType: "불꽃",
    isPullable: true, pullRate: 0.025,
    tags: ["메가히트"]
  },
  {
    id: "sv3-134", setId: "sv3", number: "134/108",
    nameKo: "리자몽 ex (SAR)", nameEn: "Charizard ex (SAR)",
    rarity: "SAR", pokemonType: "불꽃",
    illustrator: "Tomokazu Komiya", isPullable: true, pullRate: 0.003,
    tags: ["메가히트", "그레이딩-수요"]
  },
  {
    id: "sv3-139", setId: "sv3", number: "139/108",
    nameKo: "리자몽 ex (UR)", nameEn: "Charizard ex (UR)",
    rarity: "UR", pokemonType: "불꽃",
    isPullable: true, pullRate: 0.004,
    tags: ["골드레어", "프리미엄"]
  },
  // ============ SV4K 고대의 포효 ============
  {
    id: "sv4k-093", setId: "sv4k", number: "093/066",
    nameKo: "고동치는달 ex (SAR)", nameEn: "Roaring Moon ex (SAR)",
    rarity: "SAR", pokemonType: "악",
    isPullable: true, pullRate: 0.003,
    tags: ["메타", "절판프리미엄"]
  },
  // ============ SV4M 미래의 일섬 ============
  {
    id: "sv4m-093", setId: "sv4m", number: "093/066",
    nameKo: "무쇠무인 ex (SAR)", nameEn: "Iron Hands ex (SAR)",
    rarity: "SAR", pokemonType: "강철",
    isPullable: true, pullRate: 0.003,
    tags: ["메타"]
  },
  // ============ SV5K 와일드포스 ============
  {
    id: "sv5k-093", setId: "sv5k", number: "093/071",
    nameKo: "꿰뚫는화염 ex (SAR)", nameEn: "Gouging Fire ex (SAR)",
    rarity: "SAR", pokemonType: "불꽃",
    isPullable: true, pullRate: 0.003,
    tags: ["메타"]
  },
  {
    id: "sv5k-095", setId: "sv5k", number: "095/071",
    nameKo: "날뛰는우레 ex (SAR)", nameEn: "Raging Bolt ex (SAR)",
    rarity: "SAR", pokemonType: "전기",
    isPullable: true, pullRate: 0.003,
    tags: ["메타", "커버"]
  },
  {
    id: "sv5k-100", setId: "sv5k", number: "100/071",
    nameKo: "날뛰는우레 ex (UR)", nameEn: "Raging Bolt ex (UR)",
    rarity: "UR", pokemonType: "전기",
    isPullable: true, pullRate: 0.004,
    tags: ["골드레어", "프리미엄"]
  },
  // ============ SV6 변환의 가면 ============
  {
    id: "sv6-016", setId: "sv6", number: "016/101",
    nameKo: "오거폰 (떡잎의 가면) ex (RR)", nameEn: "Ogerpon (Teal Mask) ex (RR)",
    rarity: "RR", pokemonType: "풀",
    isPullable: true, pullRate: 0.02,
    tags: ["커버", "메타"]
  },
  {
    id: "sv6-098", setId: "sv6", number: "098/101",
    nameKo: "카르멘 (SR)", nameEn: "Carmine (SR)",
    rarity: "SR", illustrator: "Yuu Nishida",
    isPullable: true, pullRate: 0.008,
    tags: ["트레이너인기", "그레이딩-수요"]
  },
  {
    id: "sv6-096", setId: "sv6", number: "096/101",
    nameKo: "스구리 (SR)", nameEn: "Kieran (SR)",
    rarity: "SR",
    isPullable: true, pullRate: 0.008,
    tags: ["트레이너"]
  },
  // ============ SV7 스텔라 미라클 ============
  {
    id: "sv7-133", setId: "sv7", number: "133/101",
    nameKo: "테라파고스 ex (SAR)", nameEn: "Terapagos ex (SAR)",
    rarity: "SAR", pokemonType: "노말",
    isPullable: true, pullRate: 0.003,
    tags: ["커버", "메타", "그레이딩-수요"]
  },
  // ============ SV8a 테라스탈 페스타 ex (하이클래스) ============
  {
    id: "sv8a-232", setId: "sv8a", number: "232/187",
    nameKo: "블래키 ex (SAR)", nameEn: "Umbreon ex (SAR)",
    rarity: "SAR", pokemonType: "악",
    isPullable: true, pullRate: 0.0025,
    tags: ["메가히트", "글로벌핫이슈", "그레이딩-수요"]
  },
  {
    id: "sv8a-236", setId: "sv8a", number: "236/187",
    nameKo: "피카츄 ex (UR)", nameEn: "Pikachu ex (UR)",
    rarity: "UR", pokemonType: "전기",
    isPullable: true, pullRate: 0.004,
    tags: ["하이클래스", "인기"]
  },
  {
    id: "sv8a-237", setId: "sv8a", number: "237/187",
    nameKo: "테라파고스 ex (UR)", nameEn: "Terapagos ex (UR)",
    rarity: "UR", isPullable: true, pullRate: 0.004,
    tags: ["하이클래스", "커버"]
  },
  // ============ SV9 배틀 파트너즈 ============
  {
    id: "sv9-117", setId: "sv9", number: "117/100",
    nameKo: "N의 조로아크 ex (SAR)", nameEn: "N's Zoroark ex (SAR)",
    rarity: "SAR", pokemonType: "악",
    isPullable: true, pullRate: 0.003,
    tags: ["트레이너관련", "메타"]
  },
  {
    id: "sv9-131", setId: "sv9", number: "131/100",
    nameKo: "N의 조로아크 ex (UR)", nameEn: "N's Zoroark ex (UR)",
    rarity: "UR", pokemonType: "악",
    isPullable: true, pullRate: 0.004,
    tags: ["골드레어", "커버"]
  },
  // ============ SV9a 열풍의 아레나 ============
  {
    id: "sv9a-086", setId: "sv9a", number: "086/064",
    nameKo: "히비키의 칠색조 ex (SAR)", nameEn: "Ethan's Ho-Oh ex (SAR)",
    rarity: "SAR", pokemonType: "불꽃",
    isPullable: true, pullRate: 0.003,
    tags: ["커버", "트레이너관련", "메타"]
  },
  {
    id: "sv9a-091", setId: "sv9a", number: "091/064",
    nameKo: "시로나의 한바리스 ex (UR)", nameEn: "Cynthia's Garchomp ex (UR)",
    rarity: "UR", pokemonType: "드래곤",
    isPullable: true, pullRate: 0.004,
    tags: ["트레이너관련", "메타"]
  },
  // ============ SV10 로켓단의 영광 ============
  {
    id: "sv10-093", setId: "sv10", number: "093/098",
    nameKo: "로켓단의 사카키 (SR)", nameEn: "Team Rocket's Giovanni (SR)",
    rarity: "SR",
    isPullable: true, pullRate: 0.008,
    tags: ["트레이너", "프리미엄"]
  },
  {
    id: "sv10-095", setId: "sv10", number: "095/098",
    nameKo: "로켓단의 랜스 (SR)", nameEn: "Team Rocket's Lance (SR)",
    rarity: "SR",
    isPullable: true, pullRate: 0.008,
    tags: ["트레이너"]
  },
  // ============ M2 인페르노 X (메가 시리즈) ============
  {
    id: "m2-113", setId: "m2", number: "113/080",
    nameKo: "메가샤크니아 ex (SAR)", nameEn: "Mega Sharpedo ex (SAR)",
    rarity: "SAR", pokemonType: "물",
    isPullable: true, pullRate: 0.003,
    tags: ["메가진화", "신규"]
  },
  {
    id: "m2-114", setId: "m2", number: "114/080",
    nameKo: "메가미미로뿌 ex (SAR)", nameEn: "Mega Lopunny ex (SAR)",
    rarity: "SAR", pokemonType: "노말",
    isPullable: true, pullRate: 0.003,
    tags: ["메가진화", "신규"]
  },
  {
    id: "m2-116", setId: "m2", number: "116/080",
    nameKo: "메가리자몽 X ex (UR)", nameEn: "Mega Charizard X ex (UR)",
    rarity: "UR", pokemonType: "불꽃",
    isPullable: true, pullRate: 0.004,
    tags: ["메가진화", "커버", "메가히트"]
  },
  // ============ M3 닌자스피너 (한국 2026-05 발매) ============
  {
    id: "m3-114", setId: "m3", number: "114/080",
    nameKo: "냐오스 ex (SAR)", nameEn: "Meowth ex (SAR)",
    rarity: "SAR", pokemonType: "노말",
    isPullable: true, pullRate: 0.003,
    tags: ["신규"]
  },
  {
    id: "m3-117", setId: "m3", number: "117/080",
    nameKo: "메가지가르데 ex (UR)", nameEn: "Mega Zygarde ex (UR)",
    rarity: "UR", pokemonType: "드래곤",
    isPullable: true, pullRate: 0.004,
    tags: ["메가진화", "커버", "신규"]
  }
];

export function getCardById(id: string): Card | undefined {
  return cards.find((c) => c.id === id);
}

export function getCardsBySetId(setId: string): Card[] {
  return cards.filter((c) => c.setId === setId);
}
