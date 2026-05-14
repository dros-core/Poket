#!/usr/bin/env node
/**
 * 모든 set hero / card 이미지에 대해 imageResolver와 동일한 로직으로 URL을 빌드,
 * 실제 HTTP HEAD로 200 확인.
 *
 * 실행: node scripts/verify-images.mjs
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const TCG_CACHE = path.join(ROOT, "data", "cache", "tcgdex");
const PTCG_CACHE = path.join(ROOT, "data", "cache", "pokemontcg");

async function loadJson(p) {
  return JSON.parse(await fs.readFile(p, "utf8"));
}

async function head(url) {
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.status;
  } catch {
    return 0;
  }
}

function buildTcgdexUrl(base) {
  if (!base) return null;
  return `${base}/high.webp`;
}

function directTcgdexUrl(tcgdexSetId, localId) {
  if (tcgdexSetId.toUpperCase().startsWith("SV")) {
    return `https://assets.tcgdex.net/ja/SV/${tcgdexSetId}/${localId}/high.webp`;
  }
  return null;
}

async function main() {
  const setsTs = await fs.readFile(path.join(ROOT, "data/seed/sets.ts"), "utf8");
  const cardsTs = await fs.readFile(path.join(ROOT, "data/seed/cards.ts"), "utf8");
  const mapTs = await fs.readFile(path.join(ROOT, "data/seed/setImageMap.ts"), "utf8");

  // setImageMap 파싱
  const blockRegex = /\{\s*setId:\s*"([^"]+)",\s*tcgdexId:\s*"([^"]+)"[\s\S]*?\}/g;
  const setMap = new Map();
  for (const m of mapTs.matchAll(blockRegex)) {
    const block = m[0];
    const heroMatch = block.match(/heroCardLocalId:\s*"([^"]+)"/);
    const ptcgIdMatch = block.match(/pokemontcgIoId:\s*"([^"]+)"/);
    const ptcgHeroMatch = block.match(/pokemontcgIoHeroNumber:\s*"([^"]+)"/);
    setMap.set(m[1], {
      tcgdexId: m[2],
      heroLocalId: heroMatch?.[1],
      ptcgId: ptcgIdMatch?.[1],
      ptcgHero: ptcgHeroMatch?.[1]
    });
  }

  const setIds = [...setsTs.matchAll(/^\s*id:\s*"([^"]+)",/gm)].map((m) => m[1]);
  const cards = [
    ...cardsTs.matchAll(/id:\s*"([^"]+)",\s*setId:\s*"([^"]+)",\s*number:\s*"([^"]+)",\s*nameKo:\s*"([^"]+)"/g)
  ].map((m) => ({ id: m[1], setId: m[2], number: m[3], nameKo: m[4] }));

  const summary = { setOk: 0, setFail: 0, cardOk: 0, cardFail: 0 };

  async function resolveSetUrl(sid) {
    const mapping = setMap.get(sid);
    if (!mapping) return { url: null, source: "MISSING_MAPPING" };
    // 1) TCGdex hero
    if (mapping.heroLocalId) {
      try {
        const cache = await loadJson(path.join(TCG_CACHE, `${mapping.tcgdexId}.json`));
        const card = (cache.cards || []).find((c) => c.localId === mapping.heroLocalId);
        if (card?.image) return { url: buildTcgdexUrl(card.image), source: `TCGDEX_${cache.__lang.toUpperCase()}` };
      } catch {}
      // direct build
      const direct = directTcgdexUrl(mapping.tcgdexId, mapping.heroLocalId);
      if (direct) return { url: direct, source: "TCGDEX_DIRECT" };
    }
    // 2) pokemontcg.io hero
    if (mapping.ptcgId && mapping.ptcgHero) {
      try {
        const ptcg = await loadJson(path.join(PTCG_CACHE, `${mapping.ptcgId}.json`));
        const c = ptcg.cards.find((c) => c.number === mapping.ptcgHero);
        const url = c?.images?.large || c?.images?.small;
        if (url) return { url, source: "POKEMONTCG_IO" };
      } catch {}
    }
    return { url: null, source: "PLACEHOLDER" };
  }

  async function resolveCardUrl(c) {
    const mapping = setMap.get(c.setId);
    if (!mapping) return { url: null, source: "MISSING_MAPPING" };
    const localId = c.number.split("/")[0].trim();
    // 1) TCGdex
    try {
      const cache = await loadJson(path.join(TCG_CACHE, `${mapping.tcgdexId}.json`));
      const card = (cache.cards || []).find(
        (cc) => cc.localId === localId || cc.localId === localId.padStart(3, "0")
      );
      if (card?.image) return { url: buildTcgdexUrl(card.image), source: `TCGDEX_${cache.__lang.toUpperCase()}` };
    } catch {}
    // direct build
    const direct = directTcgdexUrl(mapping.tcgdexId, localId);
    if (direct) {
      const status = await head(direct);
      if (status === 200) return { url: direct, source: "TCGDEX_DIRECT" };
    }
    // 2) pokemontcg.io
    if (mapping.ptcgId) {
      try {
        const ptcg = await loadJson(path.join(PTCG_CACHE, `${mapping.ptcgId}.json`));
        const card = ptcg.cards.find(
          (cc) => cc.number === localId || cc.number === localId.replace(/^0+/, "")
        );
        const url = card?.images?.large || card?.images?.small;
        if (url) return { url, source: "POKEMONTCG_IO" };
      } catch {}
    }
    return { url: null, source: "PLACEHOLDER" };
  }

  console.log("\n=== SET HERO 검증 ===");
  for (const sid of setIds) {
    const r = await resolveSetUrl(sid);
    if (r.url) {
      const status = await head(r.url);
      if (status === 200) {
        console.log(`  ✓ ${sid.padEnd(7)} ${r.source.padEnd(15)} ${r.url}`);
        summary.setOk++;
      } else {
        console.log(`  ✗ ${sid.padEnd(7)} ${r.source} HTTP ${status} ${r.url}`);
        summary.setFail++;
      }
    } else {
      console.log(`  ⊘ ${sid.padEnd(7)} ${r.source}`);
      summary.setFail++;
    }
  }

  console.log(`\n=== CARD 검증 ===`);
  for (const c of cards) {
    const r = await resolveCardUrl(c);
    if (r.url) {
      const status = await head(r.url);
      if (status === 200) {
        console.log(`  ✓ ${c.id.padEnd(13)} ${r.source.padEnd(15)} ${c.nameKo}`);
        summary.cardOk++;
      } else {
        console.log(`  ✗ ${c.id.padEnd(13)} ${r.source} HTTP ${status}`);
        summary.cardFail++;
      }
    } else {
      console.log(`  ⊘ ${c.id.padEnd(13)} ${r.source} ${c.nameKo}`);
      summary.cardFail++;
    }
  }

  console.log(`\n=== 요약 ===`);
  console.log(`  Sets:  ${summary.setOk} ok / ${summary.setFail} fail (${setIds.length})`);
  console.log(`  Cards: ${summary.cardOk} ok / ${summary.cardFail} fail (${cards.length})`);
  process.exit(summary.setFail + summary.cardFail > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
