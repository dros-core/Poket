/**
 * 사용자가 알아야 할 모든 핵심 정보를 구조화한 가이드 데이터.
 * 한국 포켓몬 카드 시장 리서치(2026-05) 기반.
 */

export interface GuideSection {
  id: string;
  title: string;
  summary: string;
  bullets: string[];
}

export interface GuideArticle {
  slug: string;
  title: string;
  category: "STRATEGY" | "MARKET" | "LEGAL" | "GRADING" | "OVERSEAS" | "DATA";
  intro: string;
  sections: GuideSection[];
  references?: Array<{ label: string; url: string }>;
}

export const guides: GuideArticle[] = [
  {
    slug: "market-overview",
    title: "한국 포켓몬 카드 시장 한눈에",
    category: "MARKET",
    intro:
      "한국 포켓몬 카드 시장은 (주)포켓몬코리아가 정식 발매원이며, 박스 시세는 KREAM·솔드아웃, 싱글 시세는 너정다(ICU)·카드몬스터·TCGBOX가 표준입니다. 하기 항목은 매수/매도 의사결정 시 알아야 할 핵심을 정리합니다.",
    sections: [
      {
        id: "msrp",
        title: "표준 정가 (MSRP) 이해",
        summary: "한국판 박스의 표준 정가 구조와 카툰 단위 환산.",
        bullets: [
          "30팩 박스 = 약 117,000원 (팩당 4,500~5,000원)",
          "20팩 박스(예: 151) = 약 88,000원",
          "하이클래스 10팩(예: 테라스탈 페스타) = 약 88,000원",
          "1카툰 = 6박스 (한국 표준), 일부 SKU는 12박스",
          "공인 카드샵 도매 입고가 ≈ 정가의 70~80%"
        ]
      },
      {
        id: "lifecycle",
        title: "발매 후 가격 곡선 (Life Cycle)",
        summary: "발매 직후 → 안정기 → 절판 → 재상승의 4단계 패턴.",
        bullets: [
          "D0 ~ 1주: 정가 대비 +30~80% 프리미엄 (오픈런 수요)",
          "1~3개월: 점진 하락 → 정가 ±10% 안정화",
          "6~12개월: 보합. 메타/이벤트로 단기 변동",
          "절판 후 6개월~: +20~50% 재상승 (인기 세트는 +60~100%)"
        ]
      },
      {
        id: "season",
        title: "한국 시즌성 패턴",
        summary: "어린이날·신학기·크리스마스가 4대 수요 피크.",
        bullets: [
          "어린이날 1주 전(4월 말): 박스/덱 검색량 +80%",
          "신학기(3월): 단팩 수요 폭발 (학생 교환용)",
          "여름방학(7~8월): 학생 구매층 증가",
          "크리스마스(12월): 박스/덱/스타터 선물 수요, 정가 매장 품절"
        ]
      }
    ],
    references: [
      { label: "포켓몬코리아 공식", url: "https://pokemonkorea.co.kr/" },
      { label: "KREAM 포켓몬 검색", url: "https://kream.co.kr/search?keyword=%ED%8F%AC%EC%BC%93%EB%AA%AC" },
      { label: "너정다 (ICU.gg)", url: "https://icu.gg/" }
    ]
  },
  {
    slug: "arbitrage-playbook",
    title: "도-소매 시세차익 플레이북",
    category: "STRATEGY",
    intro:
      "도매 → 소매 → P2P → 해외 채널 사이의 가격 갭을 안전하게 활용하기 위한 단계별 가이드. 박스 vs 싱글 의사결정 매트릭스 포함.",
    sections: [
      {
        id: "margin",
        title: "마진 구조",
        summary: "한국 표준 마진율과 채널별 수익성.",
        bullets: [
          "공인 카드샵 매입가: 정가의 70~80% (마진 20~30%)",
          "일반 완구 도매: 정가의 85~92% (마진 8~15%)",
          "마트/대형서점 정가 판매: 마진 8~15%",
          "리셀러: 정가 매입 후 절판 +30~80% 매도 (KREAM 활용)"
        ]
      },
      {
        id: "box-vs-single",
        title: "박스 보유 vs 싱글 분해 ROI",
        summary: "시점별 수익률 비교.",
        bullets: [
          "발매 0~1개월 핫셋: 싱글 ○ (chase 카드 최고점)",
          "3~6개월: 박스 ○ (절판 기다림), 싱글 ×",
          "절판 직후: 박스 ◎ (장기 우상향), 싱글 △",
          "절판 1년+: 박스 ◎, PSA 그레이드 후 판매 ○"
        ]
      },
      {
        id: "signals",
        title: "절판 임박 신호",
        summary: "포켓몬코리아 재판 정책으로 사재기 효과 약화. 진짜 절판 신호 식별.",
        bullets: [
          "공식 채널의 재판 안내가 끊김",
          "공인 카드샵이 사전예약을 받지 않음",
          "도매 단가가 인상됨",
          "KREAM 거래량 + 시세 동반 우상향",
          "TCGBOX 등 전문샵 박스가가 정가를 초과"
        ]
      },
      {
        id: "ev",
        title: "박스 EV(기대값) 계산법",
        summary: "박스에서 나올 수 있는 카드들의 시세 합 ÷ 박스 가격.",
        bullets: [
          "EV = Σ (해당 카드 시세 × 박스당 평균 봉입수)",
          "ROI = (EV − 매입가) / 매입가",
          "30팩 박스 평균 봉입: AR 7~9장, SR 1~2장, SAR 2~3장, UR 0~1장",
          "2026년 모던 박스 평균 EV: 정가 대비 -10~-20% (싱글 분해 손해)",
          "예외: 핫 세트(151, 메가 리자몽X)는 발매 직후 EV +20~50%"
        ]
      }
    ]
  },
  {
    slug: "purchase-guide",
    title: "구매처 완전 가이드 (도매·소매·해외)",
    category: "MARKET",
    intro:
      "박스/카툰을 가장 좋은 가격에 확보하기 위한 채널별 사용법. 신뢰성과 마진을 함께 고려한 의사결정 프레임.",
    sections: [
      {
        id: "wholesale",
        title: "도매(B2B) 진입",
        summary: "공인 카드샵 자격 + 아카토이 등 도매상 활용.",
        bullets: [
          "포켓몬코리아 공인 카드샵 등록 → 직배 단가 확보 (사업자 + 매장 필수)",
          "아카토이(accatoy.com) 등 완구 도매상으로 소규모 진입",
          "남대문 도매시장(대도/비둘기상가) 현장 검수 + 현금 거래",
          "1카툰(6박스) 이상 단위로 단가 협상 가능"
        ]
      },
      {
        id: "retail-online",
        title: "온라인 소매",
        summary: "쿠팡/11번가/G마켓/네이버쇼핑 + 공식 스토어.",
        bullets: [
          "포켓몬스토어(공식 직영): 정가 + 신상 사전응모",
          "쿠팡: 빠른 배송 + 와우 무료. 신상 품절 빠름",
          "네이버쇼핑: 가격비교 + 네이버페이 적립. 전문샵 풀라인업",
          "11번가/G마켓: 적립 + 쿠폰 활용 시 정가 -10%"
        ]
      },
      {
        id: "retail-offline",
        title: "오프라인 소매",
        summary: "마트·문구·서점·공인 카드샵.",
        bullets: [
          "이마트/트레이더스: 카툰 단위 행사 가끔, 신세계포인트 적립",
          "코스트코: 직수입 박스 저가 (회원제, 한국판 거의 없음)",
          "교보·영풍·알라딘: 정가 안정 + 포인트",
          "공인 카드샵: 정품 100%, 싱글 풀라인업, 그레이딩 대행"
        ]
      },
      {
        id: "p2p",
        title: "P2P / 리셀",
        summary: "KREAM·번개장터·중고나라.",
        bullets: [
          "KREAM: 박스 시세 표준 + 정품 검수",
          "솔드아웃: KREAM 보조 (할인 쿠폰 활용)",
          "번개장터: 매물 다양, 번개페이 에스크로 권장",
          "중고나라/당근: 직거래 가능, 사기 리스크 가장 높음"
        ]
      },
      {
        id: "overseas",
        title: "해외 직구",
        summary: "Amazon JP / Rakuten / Mercari + 배대지.",
        bullets: [
          "Amazon JP: 일판 박스 정가, 배대지 비용 추가",
          "Rakuten: 다양한 셀러, 라쿠텐 포인트 적립",
          "Mercari JP: 일판 싱글 1차, 배대지(메루카이/Buyee) 필수",
          "면세 한도: USD 150 (미국 USD 200), 초과 시 전액 과세",
          "관세 0% + VAT 10% (장난감 분류 HS 9504)"
        ]
      }
    ],
    references: [
      { label: "공인 카드샵 안내", url: "https://pokemoncard.co.kr/card/225" },
      { label: "포켓몬스토어", url: "https://pokemonstore.co.kr/" }
    ]
  },
  {
    slug: "grading-guide",
    title: "그레이딩(등급) 완전 가이드",
    category: "GRADING",
    intro:
      "Raw 카드 → 슬라브 카드 변환으로 시세를 1.5~10배까지 상승시킬 수 있는 핵심 전략. 한국은 BRG, 글로벌은 PSA.",
    sections: [
      {
        id: "options",
        title: "그레이딩 사 선택",
        summary: "BRG vs PSA vs CGC.",
        bullets: [
          "BRG (한국, break.co.kr): 한국어 카드 강점, Express 약 15,000원/장",
          "PSA Japan: Value ¥3,300, Reholder ¥11,000. 글로벌 표준 슬라브",
          "PSA US: $25~ (Economy). 시간 오래 걸림",
          "CGC: PSA보다 약간 낮은 시세, 빠른 처리 속도"
        ]
      },
      {
        id: "value-uplift",
        title: "등급별 가치 상승",
        summary: "Raw 대비 배수.",
        bullets: [
          "BRG 10: raw 대비 1.5~3배 (한국 시장 위주)",
          "PSA 10: raw 대비 3~10배 (메이저 카드는 10배+)",
          "CGC 10 Pristine: PSA와 비슷하거나 약간 낮음",
          "PSA 9 → 10: 동일 카드도 가격이 2~5배 차이"
        ]
      },
      {
        id: "candidates",
        title: "그레이딩 적합 카드 식별",
        summary: "비용 대비 효과가 높은 카드 선별 기준.",
        bullets: [
          "raw 시세 50,000원 이상 (그레이딩 비용 대비 ROI)",
          "엣지/표면/센터링이 완벽에 가까움",
          "수요가 검증된 카드 (예: 리자몽 SAR, 트레이너 SAR)",
          "신상보다 절판/하이클래스 카드 우선",
          "스캔 후 PSA 가이드 등급 사전 시뮬레이션"
        ]
      }
    ]
  },
  {
    slug: "legal-tax",
    title: "법적·세무 가이드",
    category: "LEGAL",
    intro:
      "포켓몬 카드 거래는 합법적이지만, 일정 규모 이상은 사업자등록·통신판매업 신고가 필요합니다. 해외 직구 시 면세 한도와 합산과세도 확인 필수.",
    sections: [
      {
        id: "business",
        title: "사업자등록 / 통신판매업",
        summary: "거래 규모에 따른 의무.",
        bullets: [
          "사업자등록: 사업 시작 후 20일 내 홈택스/세무서 신청",
          "간이과세 기준: 직전년도 매출 1억 400만원 미만 (2024 개정)",
          "통신판매업 신고: 정부24 (gov.kr) 또는 시·군·구청",
          "면제: 통신판매 50회 미만 OR 간이과세자",
          "위반 벌칙: 무신고/거짓신고 시 3,000만원 이하 벌금"
        ]
      },
      {
        id: "info-site",
        title: "정보형 사이트 자체의 의무",
        summary: "이 사이트(시세 정보 제공) 운영 시 고려사항.",
        bullets: [
          "시세 정보 + 광고/제휴 수익만: 정보제공업으로 분류, 통신판매업 의무 없음",
          "거래 알선/중개 추가: 통신판매중개업 신고 필수",
          "분쟁조정 안내 의무 발생",
          "개인정보 수집 시 개인정보보호법 준수"
        ]
      },
      {
        id: "import",
        title: "해외 직구 면세·관세",
        summary: "150달러 한도 + 합산과세.",
        bullets: [
          "면세 한도: USD 150 (미국발은 USD 200) - 자가사용",
          "초과 시 전액 과세 (한도 차감 ×)",
          "동일인 동일 통관일 합산 150달러 초과 → 과세",
          "포켓몬 카드 (HS 9504): 관세 0%, VAT 10%",
          "상업판매로 의심 시 자가사용 면세 박탈 + 사업자 통관 필수"
        ]
      }
    ],
    references: [
      { label: "통신판매업 신고", url: "https://www.gov.kr/" },
      { label: "관세 계산기", url: "https://www.customs.go.kr/kcs/ad/tax/BuyTaxCalculation.do" }
    ]
  },
  {
    slug: "data-sources",
    title: "데이터 소스 통합 가이드",
    category: "DATA",
    intro:
      "본 사이트의 시세 데이터는 다음 공개 소스를 어댑터 패턴으로 결합합니다. 각 소스는 별도 API 키 또는 스크래핑 정책을 따릅니다.",
    sections: [
      {
        id: "korean",
        title: "한국 데이터 (1차 소스)",
        summary: "박스 → KREAM, 싱글 → 너정다·TCGBOX.",
        bullets: [
          "KREAM: 박스 시세 표준. 비공식 내부 API",
          "너정다(ICU.gg): 싱글 시세 표준. HTML 파싱 + rate-limit 준수",
          "카드몬스터: 카드샵 위치 + 카드 검색",
          "TCGBOX: 박스/싱글 실판매가",
          "번개장터: m.bunjang.co.kr/api/1/find_v2.json"
        ]
      },
      {
        id: "global",
        title: "글로벌 API",
        summary: "TCGdex(한국어 지원), pokemontcg.io, PokemonPriceTracker.",
        bullets: [
          "TCGdex: 다국어 카드 메타데이터 (한국어 포함). 무료. 키 불필요",
          "pokemontcg.io: 1K req/day 무료 (키 시 20K). USD/EUR 가격 포함",
          "PokemonPriceTracker: PSA 8/9/10 이력 + EV. 월 $19~",
          "TCGCSV: TCGPlayer 데이터 무료 CSV 덤프"
        ]
      },
      {
        id: "japan",
        title: "일본 시세 (한국 시세에 영향)",
        summary: "Mercari, Card Rush.",
        bullets: [
          "Mercari JP: 일판 싱글 1차. 일본 IP/배대지 권장",
          "Card Rush (cardrush-pokemon.jp): 매수/매도가 모두 공시",
          "Yahoo Auctions JP: 빈티지 카드 강세",
          "환율: 한국은행 ECOS API 무료"
        ]
      },
      {
        id: "fx",
        title: "환율·관세 시뮬레이터",
        summary: "한일가격차+배대지+관세 자동 계산.",
        bullets: [
          "한국은행 ECOS API: 무료 (키 필요)",
          "관세청 unipass.customs.go.kr: 예상세액 조회",
          "배대지 평균 수수료: 일본→한국 ¥800~1,500/kg + 라벨링"
        ]
      }
    ]
  }
];

export function getGuide(slug: string): GuideArticle | undefined {
  return guides.find((g) => g.slug === slug);
}
