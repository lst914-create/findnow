import { NextRequest, NextResponse } from "next/server";
import { getStoresInRadius, getCommercialDistrictSummary } from "@/lib/commercialStoreStore";
import { APARTMENTS_DATA } from "@/lib/apartments";

/**
 * GET /api/commercial/stores
 *
 * 쿼리 파라미터:
 * - aptId: 대상 아파트 ID (지정 시 아파트 중심 좌표 자동 조회)
 * - lat, lng: 위경도 (aptId 없을 때 필수)
 * - radius: 반경 (m, 기본값: 500, 최대: 2000)
 * - includeStores: "true" | "false" (개별 점포 상세 목록 포함 여부)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const aptId = searchParams.get("aptId");
    const radiusParam = parseInt(searchParams.get("radius") || "500", 10);
    const radiusM = Math.min(Math.max(radiusParam, 100), 3000);
    const includeStores = searchParams.get("includeStores") === "true";

    let lat = parseFloat(searchParams.get("lat") || "");
    let lng = parseFloat(searchParams.get("lng") || "");

    if (aptId) {
      const apt = APARTMENTS_DATA.find((a) => a.id === aptId);
      if (apt && apt.lat && apt.lng) {
        lat = apt.lat;
        lng = apt.lng;
      }
    }

    if (isNaN(lat) || isNaN(lng)) {
      return NextResponse.json(
        { error: "유효한 lat/lng 좌표 또는 aptId가 필요합니다." },
        { status: 400 }
      );
    }

    // 상권 요약 집계 생성
    const summary = getCommercialDistrictSummary(lat, lng, radiusM);

    // 상세 점포 목록 요청 시 추가
    const stores = includeStores ? getStoresInRadius(lat, lng, radiusM) : undefined;

    return NextResponse.json({
      success: true,
      data: {
        summary,
        stores,
      },
    });
  } catch (error) {
    console.error("[API/commercial/stores] Error:", error);
    return NextResponse.json(
      { error: "상가 상권 정보 조회 중 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
