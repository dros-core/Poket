# 박스 패키지 이미지 자체 호스팅

실제 부스터박스 패키지 이미지를 여기에 저장하면 `BoxMockup` 컴포넌트가
합성 mockup 대신 실 박스 사진을 우선 사용합니다 (KREAM 상품 페이지 같이).

## 사용법

1. 박스 이미지 파일을 이 폴더에 저장 (권장: 480×640 jpg/png/webp)
2. 파일명은 `setImageMap.ts` 의 `setId` 와 동일하게 (예: `sv2a.jpg`, `m2.jpg`)
3. `data/seed/setImageMap.ts` 에서 해당 세트의 `boxPhotoUrl` 필드 추가:
   ```ts
   {
     setId: "sv2a",
     tcgdexId: "SV2a",
     // ...
     boxPhotoUrl: "/box-photos/sv2a.jpg"  // ← 추가
   }
   ```
4. `npm run build && npm run dev` 로 확인

## 권장 이미지 소스

- **포켓몬 코리아 공식** (`pokemonkorea.co.kr`) — 한국판 박스
- **Pokemon Center US/JP** — 영문/일본판 박스
- **KREAM 상품 페이지** — 박스 상품 사진 (저작권 표시 필수)
- **Google 이미지 검색** — "포켓몬 카드 [세트명] 부스터박스"

## 라이선스 주의

- Pokémon TCG 박스 이미지는 The Pokémon Company / 닌텐도의 자산
- fair-use 정보 사이트 사용은 일반적으로 허용되나, 상업적 재배포는 금지
- 자체 호스팅 시 footer에 저작권 표시: "© Nintendo · Creatures · GAME FREAK · TPCi"

## 자동 폴백

`boxPhotoUrl` 미설정 시 BoxMockup이 다음을 합성:
- 세트 로고 (pokemontcg.io)
- 대표 카드 일러스트 (TCGdex 또는 pokemontcg.io)
- 박스 외곽 디자인 (시리즈별 컬러 + 핫포일 sheen)

## 파일명 컨벤션

| setId | 추천 파일명 |
|---|---|
| sv1k | sv1k.jpg (스칼렛 ex 박스) |
| sv1v | sv1v.jpg (바이올렛 ex 박스) |
| sv2a | sv2a.jpg (151 박스) |
| sv3 | sv3.jpg (흑염의 지배자) |
| sv8a | sv8a.jpg (테라스탈 페스타) |
| m1l | m1l.jpg (메가브레이브) |
| m2 | m2.jpg (인페르노X) |
| m3 | m3.jpg (닌자스피너) |
