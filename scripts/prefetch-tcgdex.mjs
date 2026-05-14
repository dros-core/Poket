#!/usr/bin/env node
/**
 * TCGdex 메타데이터 + 이미지 URL 사전 패치 스크립트
 *
 * 실행:
 *   node scripts/prefetch-tcgdex.mjs
 *
 * 결과:
 *   data/cache/tcgdex/sets.json       - 한국어 발매 세트 목록
 *   data/cache/tcgdex/<setId>.json    - 각 세트의 카드 목록 (한국어 우선, 없으면 일본어)
 *
 * 호출량 최소화를 위해 캐시가 존재하면 스킵 (FORCE=1 로 강제 갱신).
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CACHE_DIR = path.join(ROOT, "data", "cache", "tcgdex");
const FORCE = process.env.FORCE === "1";
const BASE = "https://api.tcgdex.net/v2";
const LANG_FALLBACK = ["ko", "ja", "en"];

// 우리가 추적하는 한국 정발 세트 후보 (TCGdex set ID 기준)
// 한국어 데이터가 없는 신규 세트는 ja 폴백
const TARGET_SETS = [
  "SV1S", // 스칼렛 ex
  "SV1V", // 바이올렛 ex
  "SV1a", // 트리플렛비트
  "SV2D", // 클레이버스트
  "SV2P", // 스노해저드 (현재 시드 누락)
  "SV2a", // 포켓몬 카드 151
  "SV3", // 흑염의 지배자
  "SV3a", // 레이징서프 (현재 시드 누락)
  "SV4K", // 고대의 포효
  "SV4M", // 미래의 일섬
  "SV4a", // 샤이니 트레저 ex
  "SV5K", // 와일드포스
  "SV5M", // 사이버저지
  "SV5a", // 크림슨헤이즈 (현재 시드 누락)
  "SV6", // 변환의 가면
  "SV6a", // 나이트 원더러
  "SV7", // 스텔라 미라클
  "SV7a", // 폭염 워커 (일본명)
  "SV8", // 슈퍼 일렉트릭 브레이커 (일본명)
  "SV8a", // 테라스탈 페스타 ex
  "SV9", // 배틀 파트너즈
  "SV9a", // 열풍의 아레나
  "SV10", // 낙원 드래고나
  "SV11W", // 화이트 플레어
  "SV11B", // 블랙 볼트
  // 메가 진화 시리즈 (한국 2025-09~2026-05)
  "M1L", // 메가브레이브
  "M1S", // 메가심포니아
  "M2",  // 인페르노X
  "M3"   // 닌자스피너 (가설) / ムニキスゼロ (TCGdex JA 명칭)
];

async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "poket-tcgdex-prefetch/0.1" }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function readJson(p) {
  try {
    return JSON.parse(await fs.readFile(p, "utf8"));
  } catch {
    return null;
  }
}

async function writeJson(p, data) {
  await fs.writeFile(p, JSON.stringify(data, null, 2), "utf8");
}

async function fetchSetWithFallback(setId) {
  for (const lang of LANG_FALLBACK) {
    const data = await fetchJson(`${BASE}/${lang}/sets/${setId}`);
    if (data && Array.isArray(data.cards) && data.cards.length > 0) {
      return { lang, data };
    }
    if (data && !Array.isArray(data.cards)) {
      // sometimes meta-only response
      continue;
    }
  }
  // 마지막으로 meta-only 라도 한국어부터
  for (const lang of LANG_FALLBACK) {
    const data = await fetchJson(`${BASE}/${lang}/sets/${setId}`);
    if (data) return { lang, data };
  }
  return null;
}

async function main() {
  await ensureDir(CACHE_DIR);

  // 1) 한국어 세트 목록 (전체)
  const setsListPath = path.join(CACHE_DIR, "sets.json");
  let setsList = await readJson(setsListPath);
  if (!setsList || FORCE) {
    console.log("→ fetching Korean set list...");
    setsList = await fetchJson(`${BASE}/ko/sets`);
    if (setsList) await writeJson(setsListPath, setsList);
  }

  // 2) 각 타겟 세트
  const summary = [];
  for (const setId of TARGET_SETS) {
    const out = path.join(CACHE_DIR, `${setId}.json`);
    const existing = await readJson(out);
    if (existing && !FORCE) {
      summary.push({ setId, status: "cached", lang: existing.__lang, cards: existing.cards?.length ?? 0 });
      continue;
    }
    console.log(`→ ${setId} ...`);
    const result = await fetchSetWithFallback(setId);
    if (!result) {
      summary.push({ setId, status: "missing" });
      continue;
    }
    const payload = { __lang: result.lang, __fetchedAt: new Date().toISOString(), ...result.data };
    await writeJson(out, payload);
    summary.push({
      setId,
      status: "ok",
      lang: result.lang,
      cards: payload.cards?.length ?? 0,
      name: payload.name
    });
    await new Promise((r) => setTimeout(r, 250)); // be gentle
  }

  // 3) 요약
  console.log("\n=== prefetch summary ===");
  for (const s of summary) {
    if (s.status === "ok" || s.status === "cached") {
      console.log(`  ${s.setId.padEnd(8)} [${s.lang}] ${s.name ?? ""} (${s.cards} cards) — ${s.status}`);
    } else {
      console.log(`  ${s.setId.padEnd(8)} ${s.status}`);
    }
  }
  await writeJson(path.join(CACHE_DIR, "_summary.json"), summary);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
