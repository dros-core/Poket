# Legal Notes — Poket

> 본 문서는 Poket 사이트가 사용하는 외부 데이터 소스 / 이미지 자산의 법적 근거를
> 명시한 **due diligence 기록** 입니다. 분쟁 발생 시 선의의 사용 (good faith) 을
> 증명하기 위해 각 소스별 robots.txt 확인 일자, TOS 발췌, 사용 범위를 기록합니다.

마지막 갱신: **2026-05-14**

---

## 1. 데이터 소스별 사용 근거

### 1.1 네이버쇼핑 검색 API (primary, 시세 데이터)

| 항목 | 값 |
|---|---|
| URL | `https://openapi.naver.com/v1/search/shop.json` |
| 인증 | OAuth (Client ID + Secret) |
| 사용 약관 | https://developers.naver.com/products/intro/policy/ |
| 무료 한도 | 일 25,000회 (충분) |
| 우리 사용량 | 29박스 × 6시간 = 일 116회 (0.5%) |
| 데이터 출력 | `lprice` (최저가) / `hprice` (최고가) — 시세 범위 표시 |
| 데이터 표기 | UI 에 "출처: 네이버쇼핑" 명시 |
| robots.txt 확인일 | 공식 API 이므로 robots.txt 무관 |
| 합법성 평가 | ✅ **완전 합법** (공식 OAuth API) |

### 1.2 pricecharting.com Korean 박스 페이지 (secondary, validation)

| 항목 | 값 |
|---|---|
| URL 패턴 | `pricecharting.com/game/pokemon-korean-{slug}/booster-box` |
| 인증 | 없음 (공개 페이지) |
| robots.txt | https://www.pricecharting.com/robots.txt |
| robots.txt 확인일 | 2026-05-14 |
| TOS | https://www.pricecharting.com/about-us |
| Rate limit | 자율 준수, 1초/요청 |
| 데이터 신선도 | 24h 캐시 |
| 데이터 표기 | UI 에 "출처: PriceCharting (USD → KRW 환산)" 명시 |
| 합법성 평가 | ✅ **공개 페이지 + robots 준수, 환율 환산으로 변형** |

### 1.3 번개장터 비공식 검색 API (실거래가 anchor)

| 항목 | 값 |
|---|---|
| URL | `https://api.bunjang.co.kr/api/1/find_v2.json` |
| 인증 | 없음 (비공식 endpoint) |
| robots.txt | https://m.bunjang.co.kr/robots.txt — 검색 페이지 `Allow: /` |
| robots.txt 확인일 | 2026-05-14 |
| Rate limit | 1 req / 2초 자율 준수 |
| 데이터 출력 | "판매 완료" 매물 가격 (실거래가) |
| 개인정보 | **셀러 ID, 연락처, 위치 등 절대 수집 안 함** — 가격/거래완료여부만 |
| 데이터 표기 | UI 에 "출처: 번개장터 거래완료 매물 (비공식 데이터)" 명시 |
| 법적 근거 | 대법원 2021도1533 (2022-05-12) — 크롤링 자체 형사 무죄 + robots.txt 준수 |
| 합법성 평가 | 🟡 **공개 검색 페이지, 민사 리스크 낮음** (단 운영진 변경 시 즉시 비활성화) |

### 1.4 TCGBOX 박스 카테고리 페이지 (정찰가 anchor)

| 항목 | 값 |
|---|---|
| URL | `https://tcgbox.co.kr/category/.../{id}/` |
| 인증 | 없음 (공개 e-commerce 페이지) |
| robots.txt 확인일 | 2026-05-14 |
| Rate limit | 1 req / 3초 자율 준수 |
| 데이터 출력 | 단일 판매자 정찰가 (시장 시세 가중 30% anchor 로만 사용) |
| 합법성 평가 | ✅ **공개 e-commerce, 정상적 가격비교 범주** |

### 1.5 KREAM (보조, 사용자 수동 매핑)

| 항목 | 값 |
|---|---|
| URL | `https://kream.co.kr/products/{productId}` |
| 인증 | Cloudflare + JS 챌린지 (anti-bot 활성) |
| robots.txt | `User-agent: *  Allow: /  Disallow: /my* /history*` |
| robots.txt 확인일 | 2026-05-14 |
| 자동 검색 | ❌ **사용 안 함** (anti-bot 우회는 부정경쟁방지법 차목 리스크) |
| 사용 방식 | 사용자가 직접 검증한 productId 만 수동 매핑 (`KREAM_PRODUCT_MAP`) |
| 데이터 출력 | 즉시 체결가 1회 fetch (caching 6h) |
| 합법성 평가 | 🟡 **공개 상품 페이지 + 수동 매핑** (자동 검색은 안 함) |

### 1.6 TCGdex API (메타데이터, 카드 이미지)

| 항목 | 값 |
|---|---|
| URL | `https://api.tcgdex.net/v2/{lang}/...` |
| 인증 | 없음 (community-curated 무료 API) |
| 데이터 | 카드 메타 + 이미지 URL (한국어/일본어/영어) |
| 사용 약관 | https://www.tcgdex.net/about |
| 합법성 평가 | ✅ **명시적 무료 사용 허용** (community project) |

### 1.7 pokemontcg.io (메타데이터, 메가 시리즈 카드)

| 항목 | 값 |
|---|---|
| URL | `https://api.pokemontcg.io/v2/...` |
| 인증 | API Key 권장 (없어도 1K req/day 가능) |
| 사용 약관 | https://docs.pokemontcg.io/#section/Acceptable-Use |
| 데이터 | 카드 메타 + USD 시세 (TCGPlayer + Cardmarket) |
| 합법성 평가 | ✅ **community API, 명시적 허용** |

---

## 2. 이미지 자산 사용 근거

### 2.1 박스 패키지 이미지

**현재 상태** (마이그레이션 진행 중):
- 28개 박스: TCGPlayer hotlink (`product-images.tcgplayer.com`) → **30일 내 자체 호스팅 전환 예정**
- 2개 박스 (sv3a, m3): 자체 호스팅 (`public/box-photos/`) 또는 합성 mockup

**TCGPlayer hotlink 위험**:
- TCGplayer TOS 명시: "you agree not to crawl, scrape or spider any of their websites... copying, reproducing, distributing... is prohibited"
- referer 차단 시 즉시 broken image
- **대응**: 자체 호스팅으로 전면 마이그레이션 (Phase B 또는 별도 PR)

**자체 호스팅 시 합법 소스 우선순위**:
1. **포켓몬코리아 공식** (pokemonkorea.co.kr, pokemoncard.co.kr) — editorial 허용 명시
2. **Pokemon Center Gallery** (pokemoncenter.com/search/gallery) — TPCi 공식
3. **공식 보도자료** (pokemon.gamespress.com) — Media Usage Guidelines 적용

### 2.2 카드 일러스트 (TCGdex CDN hotlink)

| 항목 | 값 |
|---|---|
| URL | `https://assets.tcgdex.net/...` |
| 사용 약관 | TCGdex 명시적 허용 (community CDN) |
| 합법성 평가 | ✅ **명시적 허용** |

### 2.3 포켓몬 캐릭터 아트워크 (PokeAPI sprites)

| 항목 | 값 |
|---|---|
| URL | `raw.githubusercontent.com/PokeAPI/sprites/...` |
| 라이선스 | CC0 (PokeAPI) — fair-use 영역 |
| 사용 약관 | https://pokeapi.co/about |
| 합법성 평가 | ✅ **명시적 fair-use 허용** |

### 2.4 포켓볼 로고 (자체 SVG)

자체 디자인 SVG (`components/brand/PokeballLogo.tsx`) — **라이선스 안전**.
포켓볼 형태는 닌텐도 트레이드마크 가능성 있으나 fan-use editorial 사이트에서 일반적으로 허용.

---

## 3. 포켓몬 IP 사용 입장

### Pokemon Media Usage Guidelines (TPCi 공식 발췌)

> "©Pokémon. ©Nintendo/Creatures Inc./GAME FREAK inc."
> "non-exclusive limited right for informational or editorial purposes"
> "not authorized to commercialize"

### 본 사이트의 입장 (editorial use)
- **목적**: 한국 포켓몬 카드 박스 시세 정보 제공 (분석/비교/예측)
- **수익**: 현재 **광고 없음, 수수료 없음, 거래 중개 안 함** → editorial 범주
- **상업적 활동 발생 시**: 즉시 라이선스 검토 + 광고 분리 + 본 문서 갱신

### 페이지 푸터 필수 표기
```
© Nintendo · Creatures · GAME FREAK · TPCi
본 사이트의 카드 / 박스 이미지는 informational / editorial 목적으로만 사용됩니다.
시세 정보는 공개 자료 기반 추정치이며, 실거래가와 차이가 있을 수 있습니다.
```

---

## 4. 한국 법령 적용

### 4.1 대법원 2021도1533 (2022-05-12) — 야놀자 vs 여기어때

- **판결 요지**: 크롤링 행위 자체에 대한 정보통신망침입죄·저작권법위반·업무방해죄 **모두 무죄**
- **기준**: 객관적 사정 (기술적 보호조치, 이용약관 명시) 으로 판단
- **본 사이트 적용**: robots.txt 준수 + 이용약관 자동화 차단 명시된 사이트 회피 (KREAM 자동 검색 안 함)

### 4.2 잡코리아 vs 사람인 — 부정경쟁방지법 차목

- **판결**: 민사에서는 데이터베이스권 침해 / 부정경쟁방지법(차목) 으로 사람인 패소
- **본 사이트 적용**: 단일 소스 의존 안 함, 다중 소스 가중평균 + 명시적 출처 표기로 "타인의 성과 무단 사용" 회피

### 4.3 robots.txt 의 법적 지위

- 한국지능정보사회진흥원 지침 + NY 남부지법 판결 (2025): robots.txt 는 "권고안" 이지 기술적 보호조치 아님
- **본 사이트 적용**: robots.txt 준수는 due diligence 의 일부일 뿐, 이용약관 추가 검토 필수

---

## 5. 분쟁 발생 시 대응 절차

1. **즉시 응답**: 해당 소스의 데이터 수집 즉시 중단 (환경변수 `POKET_USE_LIVE=false`)
2. **본 문서 갱신**: 분쟁 사실 + 대응 일자 기록
3. **외부 통신**: 분쟁 당사자에게 사용 근거 + 본 문서 제시
4. **합의 시**: 라이선스 협상 또는 데이터 소스 영구 제거
5. **법적 절차 시**: 본 문서 + commit history 를 due diligence 증거로 제출

---

## 6. 정기 검토 일정

- **분기별** (3개월): 모든 소스의 robots.txt + TOS 변경 사항 확인
- **연 1회**: 한국 데이터 크롤링 관련 판례 업데이트
- **수익 모델 도입 시**: 즉시 전면 재검토 (editorial → commercial 전환)

---

## 7. 면책 사항

본 문서는 법적 자문이 아닙니다. 상업적 사용 / 분쟁 발생 / 수익 모델 도입 시
변호사 자문을 반드시 받으시기 바랍니다.

본 사이트의 데이터 / 이미지 / 분석은 **정보 제공 목적** 이며, 직접 거래 중개 /
투자 권유 / 가격 보증을 하지 않습니다.
