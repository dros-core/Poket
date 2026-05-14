#!/usr/bin/env node
/**
 * 데이터 정합성 검증 스크립트
 * - 모든 우리 카드의 localId가 TCGdex 캐시에 존재하는지
 * - 카드의 setId가 실제 매핑된 TCGdex set에 속하는지
 * - 이름이 적절히 매칭되는지 (대략적 추측)
 *
 * 실행: node scripts/verify-data.mjs
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CACHE = path.join(ROOT, "data", "cache", "tcgdex");

async function loadJson(p) {
  return JSON.parse(await fs.readFile(p, "utf8"));
}

async function main() {
  // sets.ts와 cards.ts는 .ts 파일이라 require 불가능. 정규식으로 추출.
  const setsText = await fs.readFile(path.join(ROOT, "data/seed/sets.ts"), "utf8");
  const cardsText = await fs.readFile(path.join(ROOT, "data/seed/cards.ts"), "utf8");
  const mapText = await fs.readFile(path.join(ROOT, "data/seed/setImageMap.ts"), "utf8");

  // setImageMap 추출
  const mapMatches = [...mapText.matchAll(/setId:\s*"([^"]+)",\s*tcgdexId:\s*"([^"]+)"(?:,\s*heroCardLocalId:\s*"([^"]+)")?/g)];
  const setMap = new Map();
  for (const m of mapMatches) setMap.set(m[1], { tcgdexId: m[2], heroLocalId: m[3] });

  // sets.ts에서 set.id 목록 추출
  const setIds = [...setsText.matchAll(/^\s*id:\s*"([^"]+)",/gm)].map((m) => m[1]);

  // cards.ts에서 카드 정보 추출
  const cardRegex = /id:\s*"([^"]+)",\s*setId:\s*"([^"]+)",\s*number:\s*"([^"]+)",\s*nameKo:\s*"([^"]+)"/g;
  const cardEntries = [...cardsText.matchAll(cardRegex)].map((m) => ({
    id: m[1], setId: m[2], number: m[3], nameKo: m[4]
  }));

  console.log(`\n📦 Sets: ${setIds.length}, Mapped: ${setMap.size}, Cards: ${cardEntries.length}\n`);

  const errors = [];
  const warnings = [];

  // 모든 set이 매핑되었는지
  for (const sid of setIds) {
    if (!setMap.has(sid)) errors.push(`SET ${sid}: setImageMap 매핑 없음`);
  }

  // 카드 검증
  for (const c of cardEntries) {
    const mapping = setMap.get(c.setId);
    if (!mapping) {
      errors.push(`CARD ${c.id}: setId "${c.setId}" 매핑 없음`);
      continue;
    }
    const cachePath = path.join(CACHE, `${mapping.tcgdexId}.json`);
    let cache;
    try {
      cache = await loadJson(cachePath);
    } catch {
      warnings.push(`CARD ${c.id}: TCGdex 캐시 없음 (${mapping.tcgdexId})`);
      continue;
    }
    const localId = c.number.split("/")[0].trim();
    const padded = localId.padStart(3, "0");
    const found = cache.cards.find((card) => card.localId === localId || card.localId === padded);
    if (!found) {
      // 캐시에 카드가 없음 (일본판에만 있는 SAR이 한국판에 없을 수 있음)
      if (cache.cards.length === 0) {
        warnings.push(`CARD ${c.id}: 캐시 카드 목록 비어있음 (한국어 폴백 실패)`);
      } else {
        errors.push(`CARD ${c.id}: #${localId} 가 ${mapping.tcgdexId} 캐시에 없음 (총 ${cache.cards.length} cards)`);
      }
      continue;
    }
    // 이름 sanity (일본어 카드명에 한국어 카드명이 들어있을 리 없음 - 그래서 카테고리만 체크)
    if (found.name && c.nameKo) {
      // 한국어 라우트의 카드인 경우만 비교 가능
      if (cache.__lang === "ko") {
        // 한국어 이름은 정확 비교 (rarity 접미사 빼고)
        const baseKo = c.nameKo.replace(/\s*\([^)]+\)\s*$/, "").trim();
        if (!found.name.includes(baseKo) && !baseKo.includes(found.name)) {
          warnings.push(`CARD ${c.id}: name mismatch - ours "${baseKo}" vs cache "${found.name}"`);
        }
      }
    }
  }

  // hero card 매핑 검증
  for (const [sid, mapping] of setMap) {
    if (!mapping.heroLocalId) continue;
    const cachePath = path.join(CACHE, `${mapping.tcgdexId}.json`);
    let cache;
    try { cache = await loadJson(cachePath); } catch { continue; }
    if (cache.cards.length === 0) continue;
    const found = cache.cards.find((c) => c.localId === mapping.heroLocalId);
    if (!found) {
      warnings.push(`HERO ${sid}→${mapping.tcgdexId}: heroCardLocalId "${mapping.heroLocalId}" not found`);
    } else {
      console.log(`  ✓ ${sid.padEnd(7)} → ${mapping.tcgdexId}/${mapping.heroLocalId} (${found.name})`);
    }
  }

  console.log("\n=== 결과 ===");
  if (errors.length === 0 && warnings.length === 0) {
    console.log("✅ 모든 데이터 정합성 검증 통과");
  } else {
    if (errors.length > 0) {
      console.log(`\n❌ Errors (${errors.length}):`);
      for (const e of errors) console.log(`   - ${e}`);
    }
    if (warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${warnings.length}):`);
      for (const w of warnings) console.log(`   - ${w}`);
    }
  }
  process.exit(errors.length > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
