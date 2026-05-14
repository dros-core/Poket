# 박스 패키지 이미지 자체 호스팅

실제 부스터박스 패키지 이미지를 여기에 저장하면 `BoxMockup` 컴포넌트가
합성 mockup 대신 실 박스 사진을 우선 사용합니다 (KREAM 상품 페이지 같이).

## 워크플로우

```
[1] 박스 이미지 파일 저장
       ↓
[2] npm run box:sync         (변경 감지, dry-run)
       ↓
[3] npm run box:sync:write   (setImageMap.ts 자동 업데이트)
       ↓
[4] npm run typecheck && npm run build
       ↓
[5] git add . && git commit && git push
```

## 사용법

### 1단계 — 이미지 파일 저장

박스 이미지를 이 폴더에 저장합니다.

| 파일명 | setId | 권장 사양 |
|---|---|---|
| `{setId}.{ext}` | sv2a, m3 등 | 480×640 jpg/png/webp/avif |

**파일명 규칙**:
- `setImageMap.ts` 의 `setId` 와 **소문자 일치** (예: `m3.jpg`, `sv3a.webp`)
- 확장자: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`
- 중복 setId 가 있으면 첫 번째만 사용 (경고 출력)

### 2단계 — dry-run 확인

```bash
npm run box:sync
```

예상 출력:
```
📂 public/box-photos: 3개 파일 발견
🔄 변경 예정 (2건):
   sv3a: (none)  →  "/box-photos/sv3a.jpg"
   m3:   (none)  →  "/box-photos/m3.webp"
💡 적용하려면: node scripts/sync-box-photos.mjs --write
```

### 3단계 — 적용

```bash
npm run box:sync:write
```

`data/seed/setImageMap.ts` 가 자동으로 패치됩니다.

### 4단계 — 검증

```bash
npm run typecheck
npm run build
# 빌드 통과 시 git commit
```

---

## 박스 사진 우선순위

`BoxMockup` 컴포넌트의 폴백 체인 (`components/cards/BoxMockup.tsx`):

```
1) setImageMap.boxPhotoUrl (지금 추가하는 자체 호스팅 또는 TCGPlayer hotlink)
       ↓ 없으면
2) 합성 mockup (세트 로고 + 카드 일러스트 + 박스 외곽 디자인)
```

자체 호스팅(`/box-photos/{id}.jpg`)이 TCGPlayer hotlink보다 우선됩니다 — sync 스크립트가
기존 `boxPhotoUrl` 값을 로컬 경로로 **덮어씁니다**. 외부 URL 보존이 필요하면 sync 실행 전
파일을 제거하세요.

---

## 권장 이미지 소스

- **포켓몬 코리아 공식** (`pokemonkorea.co.kr`) — 한국판 박스
- **Pokemon Center US/JP** — 영문/일본판 박스
- **KREAM 상품 페이지** — 박스 상품 사진 (저작권 표시 필수)
- **Google 이미지 검색** — "포켓몬 카드 [세트명] 부스터박스"

---

## 라이선스 주의

- Pokémon TCG 박스 이미지는 The Pokémon Company / 닌텐도의 자산
- fair-use 정보 사이트 사용은 일반적으로 허용되나, 상업적 재배포는 금지
- 자체 호스팅 시 footer에 저작권 표시: "© Nintendo · Creatures · GAME FREAK · TPCi"

---

## 파일명 컨벤션 예시

| setId | 추천 파일명 | 상태 |
|---|---|---|
| sv1k | sv1k.jpg (스칼렛 ex 박스) | (TCGPlayer 매핑됨) |
| sv1v | sv1v.jpg (바이올렛 ex 박스) | (TCGPlayer 매핑됨) |
| sv2a | sv2a.jpg (151 박스) | (TCGPlayer 매핑됨) |
| **sv3a** | **sv3a.jpg (레이징 서프)** | ⚠️ **자체 호스팅 필요** |
| sv3 | sv3.jpg (흑염의 지배자) | (TCGPlayer 매핑됨) |
| sv8a | sv8a.jpg (테라스탈 페스타) | (TCGPlayer 매핑됨) |
| m1l | m1l.jpg (메가브레이브) | (TCGPlayer 매핑됨) |
| m2 | m2.jpg (인페르노X) | (TCGPlayer 매핑됨) |
| **m3** | **m3.jpg (닌자스피너)** | ⚠️ **자체 호스팅 필요** |

`⚠️` 표시된 세트는 현재 TCGPlayer 미등록 → 합성 mockup으로 표시 중입니다.
박스 사진을 추가하면 즉시 실 박스 사진으로 전환됩니다.

---

## 트러블슈팅

### sync 스크립트가 변경을 감지하지 못함
- 파일명을 소문자로 (Set ID 와 일치)
- 확장자 확인 (jpg/jpeg/png/webp/avif 만 지원)
- `npm run box:sync` 출력에 "매핑 없는 파일" 경고 확인

### 빌드 실패 — Module not found: /box-photos/...
- `public/box-photos/` 안에 실제 파일이 있는지 확인
- 파일명 대소문자 확인 (Linux 서버 대소문자 구분)

### 이미지가 로컬에서는 보이는데 Vercel에서 안 보임
- `public/` 디렉터리는 그대로 정적 호스팅됨 → 캐시 클리어 필요할 수 있음
- Vercel 배포 로그에서 파일이 번들에 포함됐는지 확인

---

## 자동 폴백

`boxPhotoUrl` 미설정 시 BoxMockup이 다음을 합성:
- 세트 로고 (pokemontcg.io)
- 대표 카드 일러스트 (TCGdex 또는 pokemontcg.io)
- 박스 외곽 디자인 (시리즈별 컬러 + 핫포일 sheen)
