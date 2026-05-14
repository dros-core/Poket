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

export interface CardSet {
  id: string;
  code: string; // e.g. "sv1K"
  nameKo: string; // e.g. "스칼렛 ex"
  nameEn: string;
  nameJa?: string;
  series: string; // e.g. "스칼렛&바이올렛"
  releaseDate: string; // ISO 8601
  totalCards: number;
  packsPerBox: number;
  cardsPerPack: number;
  msrpKRW: number; // 정가 (박스 기준)
  imageUrl?: string;
  isActive: boolean; // 절판 여부
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
  isPullable: boolean; // 박스에서 직접 나오는지
  pullRate?: number; // 박스 1개당 평균 봉입률 (0~1)
  tags: string[]; // ["인기", "프로모", "한국한정"] 등
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
