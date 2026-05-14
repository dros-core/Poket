#!/usr/bin/env node
/**
 * pokemontcg.io 폴백 메타 사전 패치
 *
 * 대상: TCGdex가 image 메타 미제공인 세트 (메가 시리즈, 일부 신세트)
 * 매핑:
 *   M1L 메가브레이브 / M1S 메가심포니아 → me1 (Mega Evolution, 188 cards 합본)
 *   M2 인페르노X       → me2 (Phantasmal Flames)
 *   M3 닌자스피너/ムニキスゼロ → me3 (Perfect Order)
 *   SV11W 화이트플레어 → rsv10pt5 (White Flare)
 *   SV11B 블랙볼트     → zsv10pt5 (Black Bolt)
 *
 * 실행: node scripts/prefetch-pokemontcg.mjs
 * 저장: data/cache/pokemontcg/{setId}.json
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CACHE = path.join(ROOT, "data", "cache", "pokemontcg");
const FORCE = process.env.FORCE === "1";

const TARGET_SETS = ["me1", "me2", "me2pt5", "me3", "rsv10pt5", "zsv10pt5"];

async function fetchJson(url) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "poket-pokemontcg-prefetch/0.1" }
    });
    if (!res.ok) {
      console.error(`  ! ${url} -> ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (e) {
    console.error(`  ! ${url} -> ${e.message}`);
    return null;
  }
}

async function main() {
  await fs.mkdir(CACHE, { recursive: true });

  for (const setId of TARGET_SETS) {
    const out = path.join(CACHE, `${setId}.json`);
    try {
      const stat = await fs.stat(out);
      if (!FORCE && stat.size > 0) {
        console.log(`  ✓ ${setId} cached (${stat.size} bytes)`);
        continue;
      }
    } catch {}

    console.log(`  → fetching ${setId}...`);
    const data = await fetchJson(
      `https://api.pokemontcg.io/v2/cards?q=set.id:${setId}&pageSize=250&orderBy=number`
    );
    if (!data) {
      console.log(`  ✗ ${setId} failed`);
      continue;
    }
    const cards = data.data || [];
    const slim = cards.map((c) => ({
      id: c.id,
      number: c.number,
      name: c.name,
      rarity: c.rarity,
      supertype: c.supertype,
      subtypes: c.subtypes,
      types: c.types,
      images: c.images
    }));
    const payload = {
      setId,
      fetchedAt: new Date().toISOString(),
      totalCards: slim.length,
      cards: slim
    };
    await fs.writeFile(out, JSON.stringify(payload, null, 2));
    console.log(`  ✓ ${setId} → ${slim.length} cards`);
    await new Promise((r) => setTimeout(r, 200));
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
