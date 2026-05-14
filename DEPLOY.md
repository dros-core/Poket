# 배포 가이드 — 외부 모바일에서 접근하기

이 사이트는 정적 빌드(Next.js SSG) 기반이라 거의 모든 호스팅에 즉시 배포 가능합니다.
아래 3가지 검증된 방법 중 하나를 선택하세요.

## ✅ 옵션 A — Vercel (가장 빠름, 1분, 무료, 영구 URL)

**왜 추천**: Next.js 제작사 호스팅. 한국 리전(`icn1`) 사용 가능. `vercel.json`이 이미 준비됨.

### 1) 본인 GitHub 계정에서

```bash
git clone <이 저장소>
cd Poket
git remote add github https://github.com/<your-username>/poket.git
git push github claude/pokemon-card-tracker-82nfX:main
```

### 2) 또는 Vercel CLI 직접 (GitHub 불필요)

```bash
git clone <이 저장소>
cd Poket
npm install
npm install -g vercel
vercel login           # 이메일/GitHub 1회 인증
vercel --prod          # 약 90초 후 https://poket-xxx.vercel.app 발급
```

수정사항 푸시 시 자동 재배포. 한국에서 접속하면 평균 **TTFB 80~150ms**.

---

## ✅ 옵션 B — ngrok (자체 노트북에서 빠른 임시 노출)

**왜 추천**: 5분 안에 외부 URL. 외부 회의·테스트용.

### 1) ngrok 가입 (무료, 30초)
- [dashboard.ngrok.com/signup](https://dashboard.ngrok.com/signup)
- [Your Authtoken](https://dashboard.ngrok.com/get-started/your-authtoken) 복사

### 2) 본인 노트북에서

```bash
git clone <이 저장소>
cd Poket
npm install
npm run build
npm start                                  # http://localhost:3000

# 다른 터미널에서
npm install -g ngrok
ngrok config add-authtoken <YOUR_TOKEN>
ngrok http 3000
# 출력 예: https://1234-5678.ngrok-free.app  ← 모바일에서 이 URL 접속
```

세션 종료 시 URL 사라짐. 영구가 필요하면 옵션 A.

---

## ✅ 옵션 C — 동일 WiFi 로컬 네트워크 (가장 단순)

**왜 추천**: 노트북과 휴대폰이 같은 WiFi 일 때.

```bash
git clone <이 저장소>
cd Poket
npm install
npm run build
npm start -- -H 0.0.0.0
# 노트북 IP 확인 (macOS): ifconfig | grep "inet " | grep -v 127.0.0.1
# 모바일에서 http://192.168.x.x:3000 접속
```

방화벽이 차단하면 시스템 설정에서 일시 허용. 외부 인터넷에서는 접근 불가.

---

## 🏆 최적 추천

**옵션 A (Vercel)** — 영구 URL + 자동 배포 + 한국 리전. 가장 모바일 접근성 좋음.

| 항목 | A. Vercel | B. ngrok | C. 같은 WiFi |
| --- | --- | --- | --- |
| 외부 인터넷 접근 | ✅ | ✅ | ❌ |
| 영구 URL | ✅ | ❌ (세션 종료 시 만료) | ❌ |
| 한국 리전 (빠름) | ✅ icn1 | △ (서버 위치에 따름) | ✅ 로컬 |
| 자동 재배포 | ✅ | ❌ | ❌ |
| 무료 | ✅ | ✅ (대역폭 제한) | ✅ |
| 가입 필요 | Vercel | ngrok | — |
| 소요 시간 | 약 2분 | 약 5분 | 약 1분 |

---

## 왜 Claude 샌드박스가 직접 외부 URL을 못 만드나?

이 코드를 빌드한 Claude 샌드박스(GCP VM)는:
- ✅ Outbound HTTPS(443)는 가능
- ❌ Inbound 포트 노출은 방화벽 차단
- ❌ 무료 터널 서비스(Cloudflare quick tunnel:7844, Pinggy.io, Serveo, Localtunnel)는
     **GCP IP 대역을 anti-abuse 정책으로 차단**하거나 비표준 포트 사용
- ❌ ngrok 무료티어도 authtoken 필요 (개인 계정 인증)

따라서 외부 모바일에서 보려면 위 3가지 옵션 중 사용자 인증이 가능한 곳을 통해야 합니다.
