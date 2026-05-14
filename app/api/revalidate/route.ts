/**
 * Box 페이지 ISR 캐시 강제 갱신 endpoint.
 *
 * 호출:
 *   POST /api/revalidate
 *   Authorization: Bearer ${REVALIDATE_SECRET}
 *   Body (optional): { "setIds": ["sv2a", "m3"] }  // 미지정 시 전체 갱신
 *
 * 동작:
 *   - 인증 검증 (REVALIDATE_SECRET)
 *   - revalidatePath 로 박스 상세 페이지 + 카드 목록 캐시 무효화
 *   - 다음 사용자 접속 시 새 데이터로 재생성 (Next.js ISR + naverShopping fetch)
 *
 * 호출자:
 *   - GitHub Actions cron (.github/workflows/refresh-prices.yml, 6시간 주기)
 *   - 관리자 수동 호출 (디버그용)
 *
 * @see lib/scrapers/adapters/naverShopping.ts (6h 메모리 캐시)
 * @see app/cards/[id]/page.tsx (revalidate = 21600)
 */

import { revalidatePath, revalidateTag } from "next/cache";
import { repository } from "@/lib/data/repository";
import { clearNaverShoppingCache } from "@/lib/scrapers";
import { NextResponse } from "next/server";

// Vercel Hobby: max 60s, Pro: max 300s. 우리는 < 5s 예상.
export const maxDuration = 30;
export const dynamic = "force-dynamic";

interface RevalidateBody {
  setIds?: string[];
  /** 메모리 캐시 강제 무효화 (다음 fetch 가 무조건 라이브) */
  forceFresh?: boolean;
}

export async function POST(req: Request) {
  // 1) 인증
  const authHeader = req.headers.get("authorization");
  const expected = `Bearer ${process.env.REVALIDATE_SECRET}`;
  if (!process.env.REVALIDATE_SECRET || authHeader !== expected) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2) 요청 파싱
  let body: RevalidateBody = {};
  try {
    body = (await req.json()) as RevalidateBody;
  } catch {
    // 빈 본문 허용 (전체 갱신)
  }

  const setIds = body.setIds && body.setIds.length > 0
    ? body.setIds
    : repository.listSets().map((s) => s.id);

  // 3) 메모리 캐시 무효화 (선택)
  if (body.forceFresh) {
    clearNaverShoppingCache();
  }

  // 4) 페이지 캐시 무효화
  const revalidated: string[] = [];
  for (const setId of setIds) {
    revalidatePath(`/cards/${setId}`);
    revalidated.push(`/cards/${setId}`);
  }
  // 박스 목록 페이지도 갱신 (시세 sparkline 등)
  revalidatePath("/cards");
  revalidated.push("/cards");

  return NextResponse.json({
    ok: true,
    revalidated,
    forceFresh: !!body.forceFresh,
    timestamp: new Date().toISOString()
  });
}

// 헬스체크용 GET (인증 불필요)
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "revalidate",
    sets: repository.listSets().length,
    instructions: "POST with Authorization: Bearer ${REVALIDATE_SECRET}"
  });
}
