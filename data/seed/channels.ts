import type { PurchaseChannel } from "@/lib/types";

/**
 * 한국 포켓몬 카드 도매/소매/직구 구매처 큐레이션
 * 출처: 포켓몬코리아 공인 카드샵 페이지, 너정다(ICU), KREAM, TCGBOX, 나무위키, 공개 자료
 * 모든 정보는 시점에 따라 변동. trustScore: 1(저신뢰) ~ 5(공식·검증완료)
 */
export const channels: PurchaseChannel[] = [
  // ============== 공식 디스트리뷰터 ==============
  {
    id: "pokemonkorea",
    name: "(주)포켓몬코리아 (정식 발매원)",
    type: "WHOLESALE",
    marketplace: "DIRECT_DISTRIBUTOR",
    description:
      "한국판 포켓몬 카드의 공식 라이선스 보유사이자 발매원. 공인 카드샵·B2B 채널을 통해 도매 공급. 일반 소비자는 공식 스토어 또는 공인 매장 이용.",
    url: "https://pokemonkorea.co.kr/",
    region: "전국 (서울 본사)",
    pros: ["정품 100% 보장", "정식 발매일 동시 입고", "공인 카드샵 입고가 정가 70~80%"],
    cons: ["일반 셀러 직접 거래 불가", "공인 매장 인증 필수", "최소 발주량 큼"],
    recommendedFor: ["BOOSTER_BOX", "CARTON", "STARTER_DECK", "BUILD_BATTLE_BOX"],
    minOrderQty: 6,
    averageMarginPct: 22,
    trustScore: 5,
    verifiedAt: "2026-05-12"
  },
  {
    id: "pokemonstore-kr",
    name: "포켓몬스토어 (공식 직영)",
    type: "RETAIL_ONLINE",
    marketplace: "DIRECT_DISTRIBUTOR",
    description:
      "포켓몬코리아 직영 온라인 스토어. 정가 판매. 신상은 추첨 응모 방식이 잦아 사재기 차단.",
    url: "https://pokemonstore.co.kr/",
    region: "전국 배송",
    pros: ["100% 정품", "정가 보장", "공식 프로모/이벤트", "신상 사전응모"],
    cons: ["인기 신상 응모 경쟁 치열", "재고 빠르게 소진"],
    recommendedFor: ["BOOSTER_BOX", "STARTER_DECK", "SPECIAL_SET", "BOOSTER_PACK"],
    averageMarginPct: 0,
    trustScore: 5,
    verifiedAt: "2026-05-12"
  },
  {
    id: "accatoy",
    name: "아카토이 (완구 도매상)",
    type: "WHOLESALE",
    marketplace: "DIRECT_DISTRIBUTOR",
    description:
      "수원 소재 산리오·포켓몬 완구 도매. 소규모 셀러의 진입점. 박스/스타터 단위 도매가 가능.",
    url: "https://accatoy.com/",
    region: "수도권",
    pros: ["소규모 도매 가능", "신규 셀러 친화적", "다양한 IP 한 번에"],
    cons: ["공식 디스트리뷰터 아님", "마진 좁음", "재고 변동"],
    recommendedFor: ["BOOSTER_BOX", "STARTER_DECK"],
    minOrderQty: 1,
    averageMarginPct: 10,
    trustScore: 4,
    verifiedAt: "2026-05-10"
  },
  {
    id: "namdaemun-toys",
    name: "남대문 도매시장 (대도/비둘기상가)",
    type: "WHOLESALE",
    marketplace: "DIRECT_DISTRIBUTOR",
    description:
      "전통 완구 도매 거점. 박스 단위 도매가 정가 대비 5~15% 할인. 현장 검수 + 현금 거래 위주.",
    region: "서울 중구 남대문",
    pros: ["대량 거래 시 협상 가능", "현장 검수", "다품종"],
    cons: ["방문 필수", "재고 편차 큼", "정품 검증 필요"],
    recommendedFor: ["BOOSTER_BOX", "CARTON", "STARTER_DECK"],
    minOrderQty: 6,
    averageMarginPct: 12,
    trustScore: 3,
    verifiedAt: "2026-05-10"
  },
  // ============== 리셀 전문 (박스 시세 표준) ==============
  {
    id: "kream",
    name: "KREAM (크림)",
    type: "P2P",
    marketplace: "BUNGAE",
    description:
      "박스 단위 시세의 사실상 표준 플랫폼. 정품 검수 + 체결가/그래프/거래량 공개. 에스크로 안전.",
    url: "https://kream.co.kr/search?keyword=%ED%8F%AC%EC%BC%93%EB%AA%AC",
    region: "전국 배송",
    pros: ["체결가 100% 공개", "정품 검수", "안전 결제", "30일 거래량 그래프"],
    cons: ["수수료 (구매·판매 양쪽)", "박스/봉인 위주", "싱글 카드 약함"],
    recommendedFor: ["BOOSTER_BOX", "CARTON", "SPECIAL_SET"],
    averageMarginPct: 0,
    trustScore: 5,
    verifiedAt: "2026-05-12"
  },
  {
    id: "soldout",
    name: "솔드아웃 (SoldOut)",
    type: "P2P",
    marketplace: "BUNGAE",
    description: "무신사 산하 리셀 플랫폼. KREAM과 함께 박스 시세 크로스체크에 사용.",
    url: "https://soldout.co.kr/",
    region: "전국 배송",
    pros: ["검수 보장", "박스 시세 보조 지표", "할인 쿠폰 활발"],
    cons: ["KREAM 대비 거래량 적음", "수수료"],
    recommendedFor: ["BOOSTER_BOX", "SPECIAL_SET"],
    averageMarginPct: 0,
    trustScore: 4,
    verifiedAt: "2026-05-12"
  },
  // ============== 한국 TCG 전문 시세/커뮤니티 ==============
  {
    id: "icu-gg",
    name: "너정다 (ICU.gg)",
    type: "P2P",
    marketplace: "POKATIME",
    description:
      "한국 1위 포켓몬 카드 커뮤니티이자 싱글 카드 시세의 표준. 한·일·영 3개국 카드 DB, 자체 거래 + 평균가/그래프, 덱 시세 제공.",
    url: "https://icu.gg/",
    region: "전국 (택배/직거래)",
    pros: ["싱글 시세의 표준", "3개국 카드 통합 DB", "거래글 기반 실거래가", "포인트 시스템"],
    cons: ["UI 다소 구식", "박스 시세는 약함", "그래프 표본 카드별 편차"],
    recommendedFor: ["SINGLE_CARD", "GRADED_CARD"],
    averageMarginPct: 0,
    trustScore: 4,
    verifiedAt: "2026-05-12"
  },
  {
    id: "cardmonster",
    name: "카드몬스터 (Cardmon)",
    type: "P2P",
    marketplace: "POKATIME",
    description: "포켓몬 카드 검색·덱·카드샵 안내 종합. 공인 카드샵 위치/연락처 정보 풍부.",
    url: "https://pokemon.cardmon.com/",
    region: "전국",
    pros: ["카드샵 위치 검색", "덱 빌더", "카드 검색 우수"],
    cons: ["시세 깊이 부족", "그래프 없음"],
    recommendedFor: ["SINGLE_CARD"],
    averageMarginPct: 0,
    trustScore: 4,
    verifiedAt: "2026-05-12"
  },
  {
    id: "tcgbox",
    name: "TCGBOX",
    type: "RETAIL_ONLINE",
    marketplace: "CARDFOREST",
    description: "박스/싱글 실판매가 보유 전문샵. 세트 코드 체계가 명확해 시세 비교 표준.",
    url: "https://tcgbox.co.kr/",
    region: "전국 배송",
    pros: ["박스+싱글 실가", "세트별 정리 명확", "정품 신뢰"],
    cons: ["자기 매장 가격만", "재고 편차"],
    recommendedFor: ["BOOSTER_BOX", "SINGLE_CARD"],
    averageMarginPct: 8,
    trustScore: 4,
    verifiedAt: "2026-05-12"
  },
  // ============== 온라인 종합몰 ==============
  {
    id: "coupang",
    name: "쿠팡",
    type: "RETAIL_ONLINE",
    marketplace: "COUPANG",
    description:
      "로켓배송 정품 박스 판매. 신상 박스는 보통 정가±5% 선. 사재기 방지 1인당 수량 제한 잦음.",
    url: "https://www.coupang.com/np/search?q=%ED%8F%AC%EC%BC%93%EB%AA%AC+%EB%B6%80%EC%8A%A4%ED%84%B0%EB%B0%95%EC%8A%A4",
    region: "전국 배송",
    pros: ["빠른 배송", "쿠팡캐시 적립", "정품 보장", "와우 무료배송"],
    cons: ["인기 신상 품절 빠름", "수량 제한", "차익 마진 박함"],
    recommendedFor: ["BOOSTER_BOX", "STARTER_DECK", "SPECIAL_SET"],
    averageMarginPct: 0,
    trustScore: 5,
    verifiedAt: "2026-05-10"
  },
  {
    id: "11st",
    name: "11번가",
    type: "RETAIL_ONLINE",
    marketplace: "11ST",
    description: "공식 셀러 다수. SK Pay/T마일리지 적립으로 실수령가 낮출 수 있음.",
    url: "https://search.11st.co.kr/Search.tmall?kwd=%ED%8F%AC%EC%BC%93%EB%AA%AC%EC%B9%B4%EB%93%9C+%EB%B0%95%EC%8A%A4",
    region: "전국 배송",
    pros: ["적립 혜택", "SK 카드 할인", "정품 인증 셀러 표시"],
    cons: ["배송속도 셀러 편차", "비공식 셀러 혼재"],
    recommendedFor: ["BOOSTER_BOX", "BOOSTER_PACK", "SINGLE_CARD"],
    averageMarginPct: 0,
    trustScore: 4,
    verifiedAt: "2026-05-10"
  },
  {
    id: "gmarket",
    name: "G마켓 / 옥션",
    type: "RETAIL_ONLINE",
    marketplace: "GMARKET",
    description: "스마일클럽/스마일페이 적립. 빅스마일데이 등 행사가 활용 시 정가 -10%.",
    url: "https://browse.gmarket.co.kr/search?keyword=%ED%8F%AC%EC%BC%93%EB%AA%AC%EC%B9%B4%EB%93%9C",
    region: "전국 배송",
    pros: ["스마일캐시", "정기 빅세일", "묶음 할인"],
    cons: ["프로모 페이지 가격 비교 필요", "신상 빠르게 품절"],
    recommendedFor: ["BOOSTER_BOX", "SPECIAL_SET"],
    averageMarginPct: 0,
    trustScore: 4,
    verifiedAt: "2026-05-10"
  },
  {
    id: "naver-shopping",
    name: "네이버쇼핑 (스마트스토어)",
    type: "RETAIL_ONLINE",
    marketplace: "NAVER_SHOPPING",
    description:
      "전문 카드샵 다수 입점. 가격비교 + 네이버페이 적립 강점. 데이터 수집은 네이버 검색 API 활용.",
    url: "https://search.shopping.naver.com/search/all?query=%ED%8F%AC%EC%BC%93%EB%AA%AC%EC%B9%B4%EB%93%9C+%EB%B6%80%EC%8A%A4%ED%84%B0%EB%B0%95%EC%8A%A4",
    region: "전국 배송",
    pros: ["가격비교 우수", "네이버페이 적립", "전문샵 풀라인업", "API 제공 (25K req/day)"],
    cons: ["배송 셀러별 상이", "리뷰/평점 확인 필수"],
    recommendedFor: ["BOOSTER_BOX", "SINGLE_CARD", "GRADED_CARD"],
    averageMarginPct: 0,
    trustScore: 4,
    verifiedAt: "2026-05-10"
  },
  // ============== 오프라인 소매 ==============
  {
    id: "emart",
    name: "이마트 / 트레이더스",
    type: "RETAIL_OFFLINE",
    marketplace: "OFFLINE_RETAIL",
    description:
      "대형마트 완구 코너. 트레이더스는 카툰/박스 묶음 행사 가끔 진행. 신상 입고시 새벽 오픈런 발생.",
    region: "전국 매장",
    pros: ["박스 직접 확인", "신세계포인트 적립", "행사 시 큰 폭 할인"],
    cons: ["재고 매장별 편차", "직원 카드 지식 한정"],
    recommendedFor: ["BOOSTER_BOX", "STARTER_DECK", "SPECIAL_SET"],
    averageMarginPct: 0,
    trustScore: 5,
    verifiedAt: "2026-05-09"
  },
  {
    id: "homeplus",
    name: "홈플러스",
    type: "RETAIL_OFFLINE",
    marketplace: "OFFLINE_RETAIL",
    description: "마이홈플러스 멤버십 할인. 카드 상품군은 이마트보다 좁음.",
    region: "전국 매장",
    pros: ["멤버십 할인", "행사가 매력적"],
    cons: ["카드 코너 작음", "신상 늦게 입고"],
    recommendedFor: ["BOOSTER_BOX", "STARTER_DECK"],
    averageMarginPct: 0,
    trustScore: 4,
    verifiedAt: "2026-05-09"
  },
  {
    id: "costco",
    name: "코스트코",
    type: "RETAIL_OFFLINE",
    marketplace: "OFFLINE_RETAIL",
    description:
      "미국/일본 직수입 봉인 박스를 저가 대량 입고. 특정 SKU(영문판/일판)에 한정.",
    region: "전국 매장 (회원제)",
    pros: ["대량 직수입 단가", "회원가 추가 할인"],
    cons: ["회원권 필요", "한국판 거의 없음", "재고 무작위"],
    recommendedFor: ["BOOSTER_BOX", "SPECIAL_SET", "ELITE_TRAINER_BOX"],
    averageMarginPct: 0,
    trustScore: 5,
    verifiedAt: "2026-05-09"
  },
  {
    id: "kyobo",
    name: "교보문고 / 영풍문고 / 알라딘",
    type: "RETAIL_OFFLINE",
    marketplace: "ALADIN",
    description: "도서·문구 채널을 통한 박스/단팩 판매. 출판 유통망 통해 안정적 정가 공급.",
    url: "https://www.aladin.co.kr/",
    region: "전국 매장",
    pros: ["정가 안정", "포인트 적립", "온라인 주문 가능"],
    cons: ["인기 신상 빠르게 품절", "도매 불가"],
    recommendedFor: ["BOOSTER_BOX", "BOOSTER_PACK", "SPECIAL_SET"],
    averageMarginPct: 0,
    trustScore: 5,
    verifiedAt: "2026-05-09"
  },
  {
    id: "alpha-morning",
    name: "알파문구 / 모닝글로리",
    type: "RETAIL_OFFLINE",
    marketplace: "OFFLINE_RETAIL",
    description: "부스터팩/스타터 단위 정가 판매. 학생 수요층 강함.",
    region: "전국",
    pros: ["접근성 좋음", "단팩 정가", "현금 결제"],
    cons: ["박스 단위 거의 없음", "신상 품절 빠름"],
    recommendedFor: ["BOOSTER_PACK", "STARTER_DECK"],
    averageMarginPct: 0,
    trustScore: 4,
    verifiedAt: "2026-05-09"
  },
  // ============== 공인 카드샵 ==============
  {
    id: "official-shops",
    name: "공인 카드샵 (카드킹덤·듀얼파크·카드냥 등)",
    type: "RETAIL_OFFLINE",
    marketplace: "OFFLINE_RETAIL",
    description:
      "포켓몬코리아 공인 매장. 신상 박스 정가 입고, 싱글 풀라인업, 그레이딩 대행, 대회 운영.",
    url: "https://pokemoncard.co.kr/card/225",
    region: "서울/인천/경기/대전/대구 등 거점",
    pros: ["정품 100%", "공식 대회 운영", "그레이딩 대행", "싱글 풀라인업"],
    cons: ["박스 마진 적음", "지역 편차", "신상 줄서기"],
    recommendedFor: ["SINGLE_CARD", "GRADED_CARD", "BOOSTER_BOX"],
    averageMarginPct: 8,
    trustScore: 5,
    verifiedAt: "2026-05-09"
  },
  // ============== P2P / 중고 ==============
  {
    id: "bungae",
    name: "번개장터",
    type: "P2P",
    marketplace: "BUNGAE",
    description:
      "한국 포켓몬 카드 P2P 거래량 1위(KREAM 다음). 박스/싱글/카툰 모두 거래. 번개페이로 안전결제 권장.",
    url: "https://m.bunjang.co.kr/search/products?q=%ED%8F%AC%EC%BC%93%EB%AA%AC%EC%B9%B4%EB%93%9C+%EB%B0%95%EC%8A%A4",
    region: "전국 (직거래/택배)",
    pros: ["다양한 매물", "시세 실시간", "번개페이 에스크로"],
    cons: ["사기 위험", "셀러 신뢰도 편차", "프리미엄 가격대"],
    recommendedFor: ["BOOSTER_BOX", "SINGLE_CARD", "GRADED_CARD", "CARTON"],
    averageMarginPct: 0,
    trustScore: 3,
    verifiedAt: "2026-05-12"
  },
  {
    id: "joonggo",
    name: "중고나라",
    type: "P2P",
    marketplace: "JOONGGO",
    description: "전통적 P2P. 카페/앱 모두 활성. 직거래 비율 높음.",
    url: "https://web.joongna.com/search/%ED%8F%AC%EC%BC%93%EB%AA%AC%EC%B9%B4%EB%93%9C",
    region: "전국",
    pros: ["오랜 유저 풀", "지역 직거래", "에스크로 옵션"],
    cons: ["사기 위험", "시세 변동 빠름", "셀러 검증 어려움"],
    recommendedFor: ["BOOSTER_BOX", "SINGLE_CARD"],
    averageMarginPct: 0,
    trustScore: 3,
    verifiedAt: "2026-05-12"
  },
  {
    id: "daangn",
    name: "당근마켓",
    type: "P2P",
    marketplace: "DAANGN",
    description: "지역 기반 직거래. 약관상 자동수집 금지 — 데이터 크롤링 ❌. 사용자 직접 검색.",
    url: "https://www.daangn.com/search/%ED%8F%AC%EC%BC%93%EB%AA%AC%20%EB%B0%95%EC%8A%A4",
    region: "동네 단위",
    pros: ["직거래 즉시", "급매 발견", "수수료 없음"],
    cons: ["거래량 적음", "에스크로 약함", "전문 셀러 적음", "크롤링 금지 (직접 검색만)"],
    recommendedFor: ["BOOSTER_BOX", "SINGLE_CARD"],
    averageMarginPct: 0,
    trustScore: 3,
    verifiedAt: "2026-05-12"
  },
  // ============== 그레이딩 ==============
  {
    id: "brg",
    name: "BRG (Break & Company)",
    type: "RETAIL_OFFLINE",
    marketplace: "DIRECT_DISTRIBUTOR",
    description:
      "한국 최초·아시아 최대 그레이딩사. 한·일·영·중 모든 언어 카드 등급 가능. 12-step VSC 절차. 한국 시장에서 raw 대비 1.5~3배 프리미엄 형성.",
    url: "https://break.co.kr/",
    region: "서울",
    pros: ["국내 빠른 등급", "한국어 카드 강점", "Express 약 15,000원/장"],
    cons: ["글로벌 인지도는 PSA 대비 낮음", "BRG 슬라브 시세는 PSA보다 낮은 편"],
    recommendedFor: ["GRADED_CARD"],
    averageMarginPct: 0,
    trustScore: 4,
    verifiedAt: "2026-05-12"
  },
  {
    id: "psa-japan",
    name: "PSA Japan",
    type: "OVERSEAS",
    marketplace: "OFFLINE_RETAIL",
    description:
      "PSA의 일본 지사. 한국 컬렉터도 일본 경유로 그레이딩 가능. Value 약 ¥3,300, Reholder ¥11,000.",
    url: "https://www.psajapan.com/",
    region: "일본 (배대지 경유)",
    pros: ["글로벌 표준 슬라브", "PSA 10 = raw 대비 3~10배"],
    cons: ["일본 송부/회수 필요", "수개월 소요", "고가 카드 위주 권장"],
    recommendedFor: ["GRADED_CARD"],
    averageMarginPct: 0,
    trustScore: 5,
    verifiedAt: "2026-05-10"
  },
  // ============== 해외 직구 ==============
  {
    id: "amazon-jp",
    name: "Amazon Japan",
    type: "OVERSEAS",
    marketplace: "AMAZON_JP",
    description:
      "일본판 박스/하이클래스(예: 테라스탈 페스타) 정가 입고가 빠름. 한국에서는 일판 SAR 선호층 두터움.",
    url: "https://www.amazon.co.jp/s?k=%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E3%82%AB%E3%83%BC%E3%83%89+%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9",
    region: "일본 → 배대지",
    pros: ["일판 신상 빠른 입수", "Amazon 신뢰", "정품 보증"],
    cons: ["배송비/관세 (USD 150 초과 시 관세+VAT)", "환율 영향", "수량 제한"],
    recommendedFor: ["BOOSTER_BOX", "SPECIAL_SET"],
    averageMarginPct: 25,
    trustScore: 5,
    verifiedAt: "2026-05-10"
  },
  {
    id: "rakuten",
    name: "Rakuten Ichiba",
    type: "OVERSEAS",
    marketplace: "RAKUTEN",
    description: "일판 카드샵 다수 입점. 라쿠텐 포인트 적립 가능. 셀러별 가격 편차 큼.",
    url: "https://search.rakuten.co.jp/search/mall/%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E3%82%AB%E3%83%BC%E3%83%89+%E3%83%9C%E3%83%83%E3%82%AF%E3%82%B9/",
    region: "일본 → 배대지",
    pros: ["다양한 일본 셀러", "포인트 적립", "신상 빠른 입수"],
    cons: ["일본어 위주", "셀러별 배송 정책 상이"],
    recommendedFor: ["BOOSTER_BOX", "SINGLE_CARD"],
    averageMarginPct: 22,
    trustScore: 4,
    verifiedAt: "2026-05-10"
  },
  {
    id: "mercari-jp",
    name: "Mercari Japan",
    type: "OVERSEAS",
    marketplace: "MERCARI_JP",
    description:
      "일판 싱글 시세의 1차 소스. 한국 → 일본 배대지(메루카이/Buyee/5-duck/Kaerumall) → 발송.",
    url: "https://jp.mercari.com/search?keyword=%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E3%82%AB%E3%83%BC%E3%83%89",
    region: "일본 P2P",
    pros: ["싱글 시세 1차", "프로모/한정 다수", "프로모 카드 진수"],
    cons: ["배대지 필수", "사기 셀러 분리 필요", "셀러 평점 필수 확인"],
    recommendedFor: ["SINGLE_CARD", "GRADED_CARD"],
    averageMarginPct: 18,
    trustScore: 3,
    verifiedAt: "2026-05-10"
  },
  {
    id: "ebay",
    name: "eBay",
    type: "OVERSEAS",
    marketplace: "EBAY",
    description:
      "글로벌 시세 소스. PSA 그레이드 카드 활발. Sold Listings(Marketplace Insights API)는 파트너 한정.",
    url: "https://www.ebay.com/sch/i.html?_nkw=pokemon+korean+booster+box",
    region: "글로벌",
    pros: ["PSA 시세 표준", "Sold listing 데이터 풍부", "글로벌 매수자"],
    cons: ["배송비 비쌈", "관세", "사기 셀러 분리 필요"],
    recommendedFor: ["SINGLE_CARD", "GRADED_CARD", "BOOSTER_BOX"],
    averageMarginPct: 15,
    trustScore: 4,
    verifiedAt: "2026-05-10"
  },
  {
    id: "tcgplayer",
    name: "TCGPlayer",
    type: "OVERSEAS",
    marketplace: "TCGPLAYER",
    description: "북미 영문판 표준. 공식 API는 파트너 승인 필요. 우회: TCGCSV(무료 CSV 덤프).",
    url: "https://www.tcgplayer.com/search/pokemon/product?productLineName=pokemon",
    region: "북미",
    pros: ["영문판 표준", "TCGCSV로 무료 데이터 접근", "마켓 깊이"],
    cons: ["영문판 한정", "한국 직배송 제한", "공식 API 진입장벽"],
    recommendedFor: ["SINGLE_CARD", "GRADED_CARD"],
    averageMarginPct: 10,
    trustScore: 5,
    verifiedAt: "2026-05-10"
  }
];

export function getChannelsByType(type: PurchaseChannel["type"]): PurchaseChannel[] {
  return channels.filter((c) => c.type === type);
}
