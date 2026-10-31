import { NextRequest, NextResponse } from "next/server";
import { getOrComputeNearbySummary } from "@/lib/apartmentNearbySummaryService";

/**
 * GET /api/apartment/nearby-summary
 *
 * 쿼리 파라미터:
 * - aptId: 아파트 단지 식별자 (필수)
 * - radius: 반경 미터 (기본 1000m, 3000m 지원)
 *
 * 용도:
 * apartment_nearby_summary 캐시 테이블을 조회하여 7일 이내 집계 결과가 있으면 즉시 반환하고,
 * 없으면 원천 데이터를 집계하여 캐싱 후 반환합니다.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const aptId = searchParams.get("aptId");
    const radiusM = parseInt(searchParams.get("radius") || "1000", 10);

    if (!aptId) {
      return NextResponse.json(
        { error: "aptId 파라미터가 필요합니다." },
        { status: 400 }
      );
    }

    const summary = await getOrComputeNearbySummary(aptId, radiusM);

    if (!summary) {
      return NextResponse.json(
        { error: "해당 단지의 위치 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("[API/apartment/nearby-summary] Error:", error);
    return NextResponse.json(
      { error: "주변 정보 요약 조회 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
