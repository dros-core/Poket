/**
 * 박스 사진 blurDataURL placeholder (자동 생성됨 — 직접 수정 금지)
 *
 * 생성: scripts/sync-box-photos.mjs --write
 * 형식: 16×16 WebP base64 (~100 bytes / placeholder)
 * 용도: next/image placeholder="blur" 작동 보장 (한국 LTE LCP 최적화)
 *
 * 박스 사진이 추가되면 `npm run box:sync:write` 가 이 파일을 자동 갱신합니다.
 */

export const boxBlurPlaceholders: Record<string, string | undefined> = {
  // 아직 자체 호스팅 박스 사진이 없습니다.
  // public/box-photos/{setId}.{jpg|png|webp|avif} 추가 후
  // `npm run box:sync:write` 실행 시 자동으로 채워집니다.
};

export function getBoxBlurPlaceholder(setId: string): string | undefined {
  return boxBlurPlaceholders[setId];
}
