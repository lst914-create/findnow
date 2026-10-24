import { NextRequest, NextResponse } from "next/server";
import { publicRedevelopmentApi } from "@/lib/publicRedevelopmentApi";

/**
 * 국토교통부 건축HUB 건축물대장 정보 연동 API
 *
 * Query Params:
 * - sigunguCd: 시군구코드 5자리 (예: 11290)
 * - bjdongCd: 법정동코드 5자리 (예: 13600)
 * - bun: 본번 (예: 233)
 * - ji: 부번 (예: 336)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sigunguCd = searchParams.get("sigunguCd") || "11290";
  const bjdongCd = searchParams.get("bjdongCd") || "13600";
  const bun = searchParams.get("bun") || "233";
  const ji = searchParams.get("ji") || "336";

  try {
    const buildings = await publicRedevelopmentApi.fetchBuildingInfo({
      sigunguCd,
      bjdongCd,
      bun,
      ji,
    });

    return NextResponse.json({
      success: true,
      source: "국토교통부 건축HUB 건축물대장정보 서비스",
      isLiveApi: !publicRedevelopmentApi.isMockMode,
      query: { sigunguCd, bjdongCd, bun, ji },
      totalCount: buildings.length,
      buildings,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "건축물대장 API 조회 실패", detail: message },
      { status: 500 }
    );
  }
}
