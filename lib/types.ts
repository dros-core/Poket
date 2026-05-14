/**
 * 한국 포켓몬 카드 시세 추적 시스템의 핵심 도메인 모델
 */

export type Currency = "KRW" | "JPY" | "USD";

export type CardRarity =
  | "C"
  | "U"
  | "R"
  | "RR"
  | "RRR"
  | "AR"
  | "SR"
  | "SAR"
  | "UR"
  | "PROMO"
  | "EX"
  | "K"; // Korea Special

export type ProductCategory =
  | "BOOSTER_BOX" // 부스터박스 (보통 30팩)
  | "CARTON" // 카툰 (6박스 이상)
  | "ELITE_TRAINER_BOX" // 엘리트 트레이너 박스 (한국 정발 X 일반)
  | "BOOSTER_PACK" // 단팩
  | "STARTER_DECK" // 스타터덱
  | "BUILD_BATTLE_BOX" // 빌드앤배틀
  | "SPECIAL_SET" // 스페셜 세트
  | "SINGLE_CARD" // 싱글 카드
  | "GRADED_CARD"; // 그레이딩 카드 (PSA/Beckett/BGS)

export type Marketplace =
  | "BUNGAE" // 번개장터
  | "JOONGGO" // 중고나라
  | "DAANGN" // 당근마켓
  | "POKATIME" // 포카타임
  | "CARDFOREST" // 카드포레스트
  | "GMARKET" // G마켓
  | "11ST" // 11번가
  | "COUPANG" // 쿠팡
  | "AUCTION" // 옥션
  | "NAVER_SHOPPING" // 네이버쇼핑
  | "ALADIN" // 알라딘
  | "EBAY"
  | "TCGPLAYER"
  | "MERCARI_JP"
  | "RAKUTEN"
  | "AMAZON_JP"
  | "OFFLINE_RETAIL" // 다이소/이마트/홈플러스 등
  | "DIRECT_DISTRIBUTOR"; // 손오공/아카데미 등 공식 도매

export type ChannelType = "WHOLESALE" | "RETAIL_ONLINE" | "RETAIL_OFFLINE" | "P2P" | "OVERSEAS";

// ─────────────────────────────────────────────────────────────────────────────
// 박스 분류 (3축)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 한국 발매 연도. 시간축 그룹화 (절판/현역 시그널 + 코호트 비교).
 */
export type SetEra = "2023" | "2024" | "2025" | "2026";

/**
 * 시리즈 그룹. 박스 구성/정가/봉입률 카테고리.
 * - SV_REGULAR: SV 본팩 (30팩, 117K)
 * - SV_ENHANCED: SV 강화확장팩 (20팩, 88K, 예: 151, 트리플렛비트)
 * - SV_HIGH_CLASS: SV 하이클래스 (10팩, 88K, 예: 샤이니트레저/테라스탈페스타/화블)
 * - MEGA: 메가 진화 시리즈 (30팩, 117K)
 */
export type SeriesGroup =
  | "SV_REGULAR"
  | "SV_ENHANCED"
  | "SV_HIGH_CLASS"
  | "MEGA";

/**
 * 시장 상태. 거래 전략에 직결.
 * - PRE_RELEASE: 발매 전 (예약)
 * - ACTIVE: 현역 판매 중 (소매점/공식 유통 정상)
 * - DISCONTINUED: 절판 (공식 유통 종료, P2P 위주)
 */
export type MarketStatus = "PRE_RELEASE" | "ACTIVE" | "DISCONTINUED";

export interface CardSet {
  id: string;
  code: string; // e.g. "sv1K"
  nameKo: string; // e.g. "스칼렛 ex"
  nameEn: string;
  nameJa?: string;
  series: string; // e.g. "스칼렛&바이올렛" (사용자 표시용 한국어)
  releaseDate: string; // ISO 8601 (한국판 발매일)
  totalCards: number;
  packsPerBox: number;
  cardsPerPack: number;
  msrpKRW: number; // 정가 (박스 기준)
  imageUrl?: string; // 박스/로고 대표 이미지
  imageSource?: ImageSource;
  tcgdexId?: string; // TCGdex 세트 ID
  pokemontcgIoId?: string; // pokemontcg.io 세트 ID
  references?: SourceReference[]; // KREAM/너정다/TCGBOX 시세 페이지
  isActive: boolean; // (legacy) 단순 절판 여부 — marketStatus 도입 후에도 호환용 유지
  // 3축 분류 (optional — 마이그레이션 중 안전)
  era?: SetEra;
  seriesGroup?: SeriesGroup;
  marketStatus?: MarketStatus;
}

export interface Card {
  id: string;
  setId: string;
  number: string; // e.g. "183/165"
  nameKo: string;
  nameEn: string;
  rarity: CardRarity;
  illustrator?: string;
  pokemonType?: string; // 풀, 불꽃, 물 등
  imageUrl?: string;
  imageSource?: ImageSource;
  tcgdexId?: string; // TCGdex 카드 ID (예: "sv02-183")
  pokemontcgIoId?: string; // pokemontcg.io 카드 ID
  references?: SourceReference[];
  isPullable: boolean; // 박스에서 직접 나오는지
  pullRate?: number; // 박스 1개당 평균 봉입률 (0~1)
  tags: string[]; // ["인기", "프로모", "한국한정"] 등
}

export type ImageSource = "TCGDEX_KO" | "TCGDEX_EN" | "TCGDEX_JA" | "POKEMONTCG_IO" | "LOCAL" | "PLACEHOLDER";

export interface SourceReference {
  label: string;
  url: string;
  kind: "PRICE" | "META" | "OFFICIAL" | "COMMUNITY";
}

export interface PriceObservation {
  id: string;
  productId: string; // CardSet ID 또는 Card ID
  productKind: "SET" | "CARD";
  category: ProductCategory;
  marketplace: Marketplace;
  channel: ChannelType;
  pricePerUnit: number;
  currency: Currency;
  unitDescription: string; // "박스 (30팩)", "카툰 (6박스)", "1매"
  observedAt: string; // ISO timestamp
  source?: string; // URL or 출처
  conditionGrade?: string; // PSA 10, BGS 9.5, NM 등
  note?: string;
}

export interface PriceTrendPoint {
  date: string; // YYYY-MM-DD
  avg: number;
  min: number;
  max: number;
  median: number;
  volume: number; // 거래량
}

export interface PricePrediction {
  productId: string;
  generatedAt: string;
  horizonDays: number;
  forecast: Array<{
    date: string;
    predicted: number;
    lowerBound: number;
    upperBound: number;
  }>;
  modelUsed: string;
  confidence: number; // 0~1
  signals: string[]; // 예측 근거
}

export interface PurchaseChannel {
  id: string;
  name: string;
  type: ChannelType;
  marketplace: Marketplace;
  description: string;
  url?: string;
  contactInfo?: string;
  region?: string;
  pros: string[];
  cons: string[];
  recommendedFor: ProductCategory[];
  minOrderQty?: number;
  averageMarginPct?: number; // 마진율 추정
  trustScore: number; // 1~5
  verifiedAt: string;
}

export interface ArbitrageOpportunity {
  id: string;
  productId: string;
  buyChannel: Marketplace;
  sellChannel: Marketplace;
  buyPrice: number;
  sellPrice: number;
  feesPct: number; // 수수료율
  shippingKRW: number;
  estimatedNetProfit: number;
  marginPct: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  notes: string;
  detectedAt: string;
}
