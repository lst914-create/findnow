import { NextRequest, NextResponse } from "next/server";
import { REDEVELOPMENT_DATA, RedevelopmentZone } from "@/lib/redevelopment";
import { loadZoneOverridesFromSupabase } from "@/lib/redevelopmentSync";

export const dynamic = "force-dynamic";

/**
 * GET /api/redevelopment
 *
 * 정비사업 구역 목록 및 저장된 최신 상태(Supabase Overrides 병합) 조회 API
 *
 * Query Params:
 * - stage: 진행 단계 필터 (예: "사업시행인가", "관리처분인가")
 * - district: 자치구 필터 (예: "서초구", "강남구")
 * - type: 사업 유형 필터 (예: "재개발", "재건축", "신속통합기획")
 * - q: 검색어
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const stageParam = searchParams.get("stage");
    const districtParam = searchParams.get("district");
    const typeParam = searchParams.get("type");
    const query = searchParams.get("q")?.toLowerCase();

    // 1. Supabase에 영구 저장된 최신 단계 및 고시 오버라이드를 마스터 데이터와 병합
    const zonesWithOverrides = await loadZoneOverridesFromSupabase(REDEVELOPMENT_DATA);

    // 2. 파라미터 필터링
    let filtered = zonesWithOverrides;

    if (stageParam && stageParam !== "전체") {
      filtered = filtered.filter((z) => z.status === stageParam);
    }

    if (districtParam && districtParam !== "전체") {
      filtered = filtered.filter(
        (z) => z.district.includes(districtParam) || z.region.includes(districtParam)
      );
    }

    if (typeParam && typeParam !== "전체") {
      filtered = filtered.filter((z) => z.type === typeParam);
    }

    if (query) {
      filtered = filtered.filter(
        (z) =>
          z.name.toLowerCase().includes(query) ||
          z.district.toLowerCase().includes(query) ||
          z.builder.toLowerCase().includes(query) ||
          z.nearestStation.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      success: true,
      totalCount: filtered.length,
      masterCount: REDEVELOPMENT_DATA.length,
      zones: filtered,
    });
  } catch (error) {
    console.error("[API /api/redevelopment] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "정비사업 구역 데이터 조회 중 오류가 발생했습니다.",
        zones: REDEVELOPMENT_DATA,
      },
      { status: 500 }
    );
  }
}
