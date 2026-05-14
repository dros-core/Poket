#!/usr/bin/env node
/**
 * public/box-photos/ 디렉터리를 스캔하여:
 *   1) setImageMap.ts 의 boxPhotoUrl 자동 매핑
 *   2) blurDataURL placeholder (16×16 base64 WebP) 생성 → boxBlurPlaceholders.ts
 *
 * 실행:
 *   npm run box:sync             # dry-run (변경 감지만)
 *   npm run box:sync:write       # 실제 파일 수정 + blur 생성
 *
 * blurDataURL:
 *   - sharp 패키지가 설치되어 있어야 함 (없으면 skip + 경고)
 *   - 16×16 WebP base64 ~100 bytes → placeholder="blur" 작동 보장
 *   - 한국 LTE 환경에서 LCP -300ms 효과 (Mux blog 벤치마크)
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PHOTOS_DIR = path.join(ROOT, "public", "box-photos");
const MAP_FILE = path.join(ROOT, "data", "seed", "setImageMap.ts");
const BLUR_FILE = path.join(ROOT, "data", "seed", "boxBlurPlaceholders.ts");

const SUPPORTED_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const WRITE = process.argv.includes("--write");

// ─────────────────────────────────────────────────────────────────────────────
// sharp 동적 로드 (optional dependency)
// ─────────────────────────────────────────────────────────────────────────────

let sharp = null;
try {
  const sharpModule = await import("sharp");
  sharp = sharpModule.default;
} catch {
  console.warn("⚠️  sharp 미설치 — blurDataURL 자동 생성 skip. (해결: npm i -D sharp)");
}

// ─────────────────────────────────────────────────────────────────────────────
// 로컬 박스 사진 스캔
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// setImageMap.ts 파싱 / 패치
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// blurDataURL 생성 (sharp)
// ─────────────────────────────────────────────────────────────────────────────

async function generateBlurDataURL(filePath) {
  if (!sharp) return null;
  try {
    const buf = await sharp(filePath)
      .resize(16, 16, { fit: "inside" })
      .webp({ quality: 70 })
      .toBuffer();
    return `data:image/webp;base64,${buf.toString("base64")}`;
  } catch (err) {
    console.warn(`⚠️  blur 생성 실패: ${filePath} — ${err.message}`);
    return null;
  }
}

async function writeBlurPlaceholders(map) {
  const entries = [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([setId, blur]) => `  ${setId}: "${blur}"`);
  const content = `/**
 * 박스 사진 blurDataURL placeholder (자동 생성됨 — 직접 수정 금지)
 *
 * 생성: scripts/sync-box-photos.mjs --write
 * 형식: 16×16 WebP base64 (~100 bytes / placeholder)
 * 용도: next/image placeholder="blur" 작동 보장 (한국 LTE LCP 최적화)
 */

export const boxBlurPlaceholders: Record<string, string | undefined> = {
${entries.join(",\n")}
};

export function getBoxBlurPlaceholder(setId: string): string | undefined {
  return boxBlurPlaceholders[setId];
}
`;
  await fs.writeFile(BLUR_FILE, content, "utf8");
}

// ─────────────────────────────────────────────────────────────────────────────
// 메인
// ─────────────────────────────────────────────────────────────────────────────

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
  const blurMap = new Map();

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
    if (current !== next) {
      changes.push({ block, localPath, before: current, after: next });
    }

    // blur placeholder 생성
    if (sharp) {
      const blur = await generateBlurDataURL(path.join(PHOTOS_DIR, file));
      if (blur) blurMap.set(setId, blur);
    }
  }

  if (orphanFiles.length) {
    console.log("\n⚠️  매핑 없는 파일 (setImageMap.ts 에 setId 추가 필요):");
    for (const o of orphanFiles) console.log(`   - ${o.file} (setId: ${o.setId})`);
  }

  if (changes.length === 0 && blurMap.size === 0) {
    console.log("✅ 변경 사항 없음");
    return;
  }

  if (changes.length > 0) {
    console.log(`\n🔄 setImageMap 변경 예정 (${changes.length}건):`);
    for (const c of changes) {
      console.log(`   ${c.block.setId}: ${c.before}  →  ${c.after}`);
    }
  }

  if (blurMap.size > 0) {
    console.log(`\n🎨 blurDataURL 생성: ${blurMap.size}건 → ${path.relative(ROOT, BLUR_FILE)}`);
  }

  if (!WRITE) {
    console.log("\n💡 적용하려면: npm run box:sync:write");
    return;
  }

  // 실제 쓰기
  if (changes.length > 0) {
    let next = src;
    for (const c of changes.sort((a, b) => b.block.start - a.block.start)) {
      const updated = injectLocalBoxPhoto(c.block, c.localPath);
      next = next.slice(0, c.block.start) + updated + next.slice(c.block.end);
    }
    await fs.writeFile(MAP_FILE, next, "utf8");
    console.log(`\n✅ ${path.relative(ROOT, MAP_FILE)} 업데이트 (${changes.length}건)`);
  }

  if (blurMap.size > 0) {
    await writeBlurPlaceholders(blurMap);
    console.log(`✅ ${path.relative(ROOT, BLUR_FILE)} 생성 (${blurMap.size}건)`);
  }
}

main().catch((err) => {
  console.error("❌ 동기화 실패:", err);
  process.exit(1);
});
