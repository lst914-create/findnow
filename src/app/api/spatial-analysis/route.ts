import { NextRequest, NextResponse } from "next/server";
import { fetchStoresNearby, analyzeCommercialArea, isStoreApiActive } from "@/lib/storeInfoApi";
import { filterNearbyEntities, calculateDistanceMeters } from "@/lib/recommendedDataModel";
import { NATIONWIDE_REDEVELOPMENT_DATA } from "@/lib/nationwideZones";
import { APARTMENTS_DATA } from "@/lib/apartments";

/**
 * GET /api/spatial-analysis
 * 
 * [권장 데이터 구조: 공간 분석 및 사용자 화면 API]
 * - 공통 위치(lat/lng) 기반 주변 인프라 종합 분석
 * 1. 주변 상권 거리별 집계 (소상공인 상가정보 API)
 * 2. 인근 정비사업 구역 현황 (추진단계, 예정 세대수)
 * 3. 인근 아파트 단지 현황
 * 4. 명확한 데이터 출처 및 통계 분리 표시
 * 
 * Query Params:
 * - lat: 중심 위도
 * - lng: 중심 경도
 * - radius: 분석 반경 (미터, 기본 500, 최대 2000)
 * - apartmentId: 아파트 단지 ID 기준 분석 (lat/lng 대신 지정 가능)
 * - redevelopmentId: 정비구역 ID 기준 분석 (lat/lng 대신 지정 가능)
 */

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  let lat = parseFloat(searchParams.get("lat") || "0");
  let lng = parseFloat(searchParams.get("lng") || "0");
  const radius = Math.min(2000, Math.max(100, parseInt(searchParams.get("radius") || "500", 10)));
  const apartmentId = searchParams.get("apartmentId");
  const redevelopmentId = searchParams.get("redevelopmentId");

  let centerName = "지정 좌표";

  // 아파트 ID로 좌표 조회
  if (apartmentId && (!lat || !lng)) {
    const apt = APARTMENTS_DATA.find((a) => a.id === apartmentId);
    if (apt?.lat && apt?.lng) {
      lat = apt.lat;
      lng = apt.lng;
      centerName = `${apt.name} (${apt.region} ${apt.district})`;
    }
  }

  // 정비구역 ID로 좌표 조회
  if (redevelopmentId && (!lat || !lng)) {
    const zone = NATIONWIDE_REDEVELOPMENT_DATA.find((z) => z.id === redevelopmentId);
    if (zone?.lat && zone?.lng) {
      lat = zone.lat;
      lng = zone.lng;
      centerName = `${zone.name} (${zone.region} ${zone.district})`;
    }
  }

  if (!lat || !lng) {
    return NextResponse.json(
      {
        success: false,
        error: "분석할 중심 좌표(lat, lng) 또는 apartmentId / redevelopmentId가 필요합니다.",
      },
      { status: 400 }
    );
  }

  try {
    // 1. 반경 내 상가·상권 분석 (소상공인 sdsc2 API)
    const stores = isStoreApiActive()
      ? await fetchStoresNearby(lat, lng, Math.min(radius, 1000), 200)
      : [];

    const commercialAnalysis = analyzeCommercialArea(lat, lng, radius, stores);

    // 2. 반경 내 정비사업 구역 집계
    const nearbyZones = filterNearbyEntities(
      lat,
      lng,
      NATIONWIDE_REDEVELOPMENT_DATA.filter((z) => !!(z.lat && z.lng)),
      Math.max(radius, 1500) // 정비구역은 기본 최소 1.5km 반경 내 탐색
    ).slice(0, 10).map((z) => ({
      id: z.id,
      name: z.name,
      type: z.type,
      stage: z.status,
      stageDate: z.statusDate,
      address: z.address,
      distanceMeters: z.distanceMeters,
      totalUnits: z.totalUnits,
      dataTier: "BASELINE_ANNUAL",
      hasLocation: true,
    }));

    // 3. 반경 내 아파트 단지 집계
    const nearbyApartments = filterNearbyEntities(
      lat,
      lng,
      APARTMENTS_DATA.filter((a) => !!(a.lat && a.lng)),
      radius
    ).slice(0, 10).map((a) => ({
      id: a.id,
      name: a.name,
      region: a.region,
      district: a.district,
      distanceMeters: a.distanceMeters,
      householdCount: a.household_count,
      builtYear: a.built_year,
      priceMin: a.price_min,
      priceMax: a.price_max,
    }));

    return NextResponse.json({
      success: true,
      center: {
        name: centerName,
        lat,
        lng,
        radiusMeters: radius,
      },
      // ── [영역 1: 상권 거리별 집계 및 업종 분포] ──────────────────────────
      commercial: {
        totalStoresInRadius: commercialAnalysis.totalStoreCount,
        categorySummary: commercialAnalysis.categorySummary,
        stores: commercialAnalysis.stores.slice(0, 30), // 상세 점포 상위 30건
        analysisPurpose: "초기 업종 분포 분석 (업종 대/중분류 점포 수 및 반경 내 구성비 파악)",
        limitations:
          "본 상권 분석은 소상공인시장진흥공단 점포 등록 현황 기준이며, 개별 점포의 매출액이나 유동인구 데이터는 제공되지 않으므로 이를 임의로 추정하거나 확정 지표로 가정하지 않습니다.",
        source: "소상공인시장진흥공단 상가(상권)정보 서비스",
      },
      // ── [영역 2: 인근 정비사업 구역 현황] ──────────────────────────────────
      redevelopment: {
        count: nearbyZones.length,
        zones: nearbyZones,
        governanceArchitecture:
          "국토교통부 전국 도시정비사업 통합 데이터(연간 베이스라인) + 지자체 인허가 고시 보완 하이브리드 파이프라인",
        source: "국토교통부 전국 도시정비사업 통합 데이터 + 서울 정비사업 정보몽땅",
      },
      // ── [영역 3: 인근 아파트 단지 현황] ────────────────────────────────────
      apartments: {
        count: nearbyApartments.length,
        complexes: nearbyApartments,
        source: "공동주택 기본정보 서비스 (K-apt) + 국토교통부 실거래가 공개시스템",
      },
      // ── [공통 출처 및 정합성 고지] ─────────────────────────────────────────
      meta: {
        spatialRule: "주소 문자열만으로 연결하지 않고, 단지 고유 식별자 · 법정동 코드 · 좌표 · 구역 경계를 함께 활용",
        statSeparationNotice: "개별 실거래가와 한국부동산원 거시 가격지수는 통계 기준과 용도가 상이하므로 하나의 지표로 혼용하지 않고 분리 제공합니다.",
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "공간 분석 처리 실패", detail: message },
      { status: 500 }
    );
  }
}
