import { NextRequest, NextResponse } from "next/server";
import {
  fetchStoresNearby,
  fetchStoresByDong,
  analyzeCommercialArea,
  isStoreApiActive,
  STORE_CATEGORY_CODES,
  StoreInfo,
} from "@/lib/storeInfoApi";

/**
 * GET /api/stores
 *
 * 소상공인시장진흥공단 상가(상권)정보 서비스 API 연동
 * - 반경 내 상가 목록 (좌표 기반)
 * - 행정동 기반 상가 목록
 * - 업종별 점포 분포 집계
 *
 * Query Params (좌표 기반):
 * - lat: 중심 위도 (필수, 좌표 기반 조회 시)
 * - lng: 중심 경도 (필수, 좌표 기반 조회 시)
 * - radius: 검색 반경 미터 (기본: 500, 최대: 1000)
 *
 * Query Params (행정동 기반):
 * - dongCode: 행정동 코드 (예: 1168010100)
 *
 * 공통:
 * - category: 업종 대분류 코드 (예: "Q"=음식, "D"=소매, "I"=생활서비스)
 * - pageSize: 결과 수 (기본: 100)
 * - analyze: "true" 이면 상권 분석 집계 포함
 */

// 인메모리 캐시 (30분)
const cache = new Map<string, { data: Record<string, unknown>; expiry: number }>();
const CACHE_TTL_MS = 30 * 60 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");
  const radius = Math.min(1000, Math.max(100, parseInt(searchParams.get("radius") || "500", 10)));
  const dongCode = searchParams.get("dongCode") || "";
  const category = searchParams.get("category") || "";
  const pageSize = Math.min(300, Math.max(10, parseInt(searchParams.get("pageSize") || "100", 10)));
  const withAnalysis = searchParams.get("analyze") === "true";

  if (!lat && !lng && !dongCode) {
    return NextResponse.json(
      {
        success: false,
        error: "lat/lng 또는 dongCode 파라미터가 필요합니다.",
        availableCategories: STORE_CATEGORY_CODES,
      },
      { status: 400 }
    );
  }

  const isLive = isStoreApiActive();
  const cacheKey = `stores_${lat.toFixed(4)}_${lng.toFixed(4)}_${radius}_${dongCode}_${category}_${pageSize}_${withAnalysis}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return NextResponse.json({ ...cached.data, cached: true });
  }

  try {
    let stores: StoreInfo[] = [];

    if (dongCode) {
      // 행정동 코드 기반 조회
      stores = await fetchStoresByDong(dongCode, category || undefined, pageSize);
    } else if (lat && lng) {
      // 좌표 기반 반경 조회
      stores = await fetchStoresNearby(lat, lng, radius, pageSize);
      // 업종 필터 (반경 조회 후 클라이언트 필터링)
      if (category) {
        stores = stores.filter((s) => s.categoryMainCode === category);
      }
    }

    const commercialArea =
      withAnalysis && lat && lng ? analyzeCommercialArea(lat, lng, radius, stores) : null;

    const result: Record<string, unknown> = {
      success: true,
      source: "소상공인시장진흥공단 상가(상권)정보 서비스",
      sourceUrl: "https://apis.data.go.kr/B553077/api/open/sdsc2",
      isLiveApi: isLive,
      totalCount: stores.length,
      query: { lat, lng, radius, dongCode, category },
      ...(commercialArea ? { commercialArea } : { stores }),
      meta: {
        analysisScope: "초기 업종 분포 분석 (업종 대/중/소분류 점포 수 및 반경 내 업종 구성비)",
        usage: "주변 상가 인프라 및 업종별 점포 밀집도 파악용",
        limitations:
          "본 데이터는 소상공인시장진흥공단의 점포 등록 현황(업종, 주소, 좌표)에 기반한 초기 업종 분포 분석용이며, 개별 점포의 매출액이나 유동인구 데이터는 제공되지 않으므로 이를 임의 추정하거나 확정 지표로 가정하지 않습니다.",
      },
      note: isLive
        ? null
        : "DATA_GO_KR_API_KEY 미설정 상태입니다. .env.local에 DATA_GO_KR_API_KEY를 추가하면 소상공인 상가정보가 연동됩니다.",
    };

    if (isLive && stores.length > 0) {
      cache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL_MS });
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": isLive
          ? "public, max-age=1800, stale-while-revalidate=86400"
          : "no-store",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "상가정보 API 조회 실패", detail: message },
      { status: 500 }
    );
  }
}
