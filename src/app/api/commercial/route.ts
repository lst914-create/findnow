import { NextRequest, NextResponse } from "next/server";
import { getAggregatedCommercialData } from "@/lib/commercialApi";
import { APARTMENTS_DATA } from "@/lib/apartments";

export const dynamic = "force-dynamic";

/**
 * GET /api/commercial
 *
 * 상권 조회 및 반경별 집계 API
 *
 * Query Params:
 * - aptId: 대상 아파트 ID (지정 시 아파트 중심 좌표 자동 조회)
 * - lat, lng: 위경도 (aptId 없을 때 필수)
 * - radius: 분석 반경 (m, 기본 1000, 100~5000)
 * - includeMultiRadius: "true" | "false" (1km & 3km 다중 반경 비교 포함 여부)
 * - includeStores: "true" | "false" (개별 점포 상세 목록 포함 여부)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const aptId = searchParams.get("aptId");
    const radiusParam = parseInt(searchParams.get("radius") || "1000", 10);
    const radiusM = Math.min(Math.max(radiusParam, 100), 5000);
    const includeMultiRadius = searchParams.get("includeMultiRadius") !== "false";
    const includeStores = searchParams.get("includeStores") === "true";

    let lat = parseFloat(searchParams.get("lat") || "");
    let lng = parseFloat(searchParams.get("lng") || "");
    let aptName: string | undefined;

    if (aptId) {
      const apt = APARTMENTS_DATA.find((a) => a.id === aptId);
      if (apt && apt.lat && apt.lng) {
        lat = apt.lat;
        lng = apt.lng;
        aptName = apt.name;
      }
    }

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        {
          success: false,
          error: "유효한 lat/lng 좌표 또는 등록된 aptId가 필요합니다.",
        },
        { status: 400 }
      );
    }

    const { summary, multiRadius, stores } = await getAggregatedCommercialData(
      lat,
      lng,
      radiusM
    );

    return NextResponse.json({
      success: true,
      data: {
        target: {
          aptId: aptId || null,
          aptName: aptName || null,
          lat,
          lng,
          radiusM,
        },
        summary,
        ...(includeMultiRadius && { multiRadius }),
        ...(includeStores && { stores }),
      },
    });
  } catch (error) {
    console.error("[API /api/commercial] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "상가 및 상권 정보 집계 조회 중 서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
