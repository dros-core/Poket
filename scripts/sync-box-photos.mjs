#!/usr/bin/env node
/**
 * public/box-photos/ 디렉터리를 스캔하여 setImageMap.ts 의 boxPhotoUrl 을 자동 매핑.
 *
 * 동작:
 *   1) public/box-photos/{setId}.{jpg|png|webp|avif} 파일 검색
 *   2) data/seed/setImageMap.ts 의 해당 setId 항목에 boxPhotoUrl: "/box-photos/{file}" 주입
 *   3) 기존 TCGPlayer hotlink 가 있으면 로컬 우선(주석 처리하지 않고 단순 교체)
 *
 * 실행:
 *   npm run box:sync
 *   node scripts/sync-box-photos.mjs            # 변경 감지만
 *   node scripts/sync-box-photos.mjs --write    # 실제 파일 수정
 *
 * 안전 장치:
 *   - --write 없이는 dry-run (변경 사항만 출력)
 *   - 매핑 없는 setId 의 파일은 경고만 (자동 추가 X)
 *   - 매핑은 있는데 파일 없으면 그대로 유지 (외부 hotlink 보존)
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PHOTOS_DIR = path.join(ROOT, "public", "box-photos");
const MAP_FILE = path.join(ROOT, "data", "seed", "setImageMap.ts");

const SUPPORTED_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const WRITE = process.argv.includes("--write");

async function listLocalPhotos() {
  let entries;
  try {
    entries = await fs.readdir(PHOTOS_DIR);
  } catch {
    return new Map();
  }
  const photos = new Map();
  for (const file of entries) {
    if (file.startsWith(".") || file === "README.md") continue;
    const ext = path.extname(file).toLowerCase();
    if (!SUPPORTED_EXTS.includes(ext)) continue;
    const setId = path.basename(file, ext).toLowerCase();
    if (photos.has(setId)) {
      console.warn(`⚠️  중복: ${setId} (${photos.get(setId)} vs ${file}) — 첫 번째 유지`);
      continue;
    }
    photos.set(setId, file);
  }
  return photos;
}

function parseMappings(src) {
  const blocks = [];
  const re = /\{\s*setId:\s*"([^"]+)"[^{}]*?\}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    blocks.push({
      setId: m[1],
      start: m.index,
      end: m.index + m[0].length,
      raw: m[0],
      hasBoxPhotoUrl: /boxPhotoUrl\s*:/.test(m[0])
    });
  }
  return blocks;
}

function injectLocalBoxPhoto(block, localPath) {
  if (block.hasBoxPhotoUrl) {
    return block.raw.replace(
      /boxPhotoUrl\s*:\s*[^,}\n]+/,
      `boxPhotoUrl: "${localPath}"`
    );
  }
  return block.raw.replace(/\}\s*$/, `, boxPhotoUrl: "${localPath}" }`);
}

async function main() {
  const photos = await listLocalPhotos();
  console.log(`📂 public/box-photos: ${photos.size}개 파일 발견`);

  if (photos.size === 0) {
    console.log("  (이미지 파일 없음 — 아무 변경 안 함)");
    return;
  }

  const src = await fs.readFile(MAP_FILE, "utf8");
  const blocks = parseMappings(src);
  const mappedIds = new Set(blocks.map((b) => b.setId));

  const changes = [];
  const orphanFiles = [];

  for (const [setId, file] of photos) {
    if (!mappedIds.has(setId)) {
      orphanFiles.push({ setId, file });
      continue;
    }
    const block = blocks.find((b) => b.setId === setId);
    const localPath = `/box-photos/${file}`;
    const currentMatch = block.raw.match(/boxPhotoUrl\s*:\s*([^,}\n]+)/);
    const current = currentMatch ? currentMatch[1].trim() : "(none)";
    const next = `"${localPath}"`;
    if (current === next) continue;
    changes.push({ block, localPath, before: current, after: next });
  }

  if (orphanFiles.length) {
    console.log("\n⚠️  매핑 없는 파일 (setImageMap.ts 에 setId 추가 필요):");
    for (const o of orphanFiles) console.log(`   - ${o.file} (setId: ${o.setId})`);
  }

  if (changes.length === 0) {
    console.log("✅ 변경 사항 없음");
    return;
  }

  console.log(`\n🔄 변경 예정 (${changes.length}건):`);
  for (const c of changes) {
    console.log(`   ${c.block.setId}: ${c.before}  →  ${c.after}`);
  }

  if (!WRITE) {
    console.log("\n💡 적용하려면: node scripts/sync-box-photos.mjs --write");
    return;
  }

  let next = src;
  for (const c of changes.sort((a, b) => b.block.start - a.block.start)) {
    const updated = injectLocalBoxPhoto(c.block, c.localPath);
    next = next.slice(0, c.block.start) + updated + next.slice(c.block.end);
  }
  await fs.writeFile(MAP_FILE, next, "utf8");
  console.log(`\n✅ ${MAP_FILE} 업데이트 완료 (${changes.length}건)`);
}

main().catch((err) => {
  console.error("❌ 동기화 실패:", err);
  process.exit(1);
});
