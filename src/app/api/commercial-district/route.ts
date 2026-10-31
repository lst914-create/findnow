/**
 * GET /api/commercial-district
 *
 * 특정 좌표 반경 내 상권 업종 분포 및 점포 수를 반환합니다.
 *
 * Query params:
 *   lat      - 위도
 *   lng      - 경도
 *   aptId?   - 단지 ID (lat/lng 대신)
 *   radius?  - 반경 미터 (기본 500)
 */

import { NextRequest, NextResponse } from "next/server";
import { APARTMENTS_DATA } from "@/lib/apartments";
import { makeDataSourceMeta } from "@/types/dataSource";
import { getCommercialDistrictSummary } from "@/lib/commercialStoreStore";
import {
  INDUSTRY_CATEGORY_META,
  type IndustryCategoryCode,
  type IndustryDistributionItem,
  type CommercialActivityLevel,
  type CommercialDistrictResponse,
} from "@/types/commercialDistrict";

// TODO: storeInfoApi.ts 연동 후 실제 소상공인 데이터로 교체
// 현재는 API 구조 기틀만 구축 (빈 응답 + 메타 반환)

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const aptId = searchParams.get("aptId");
  const radiusM = Number(searchParams.get("radius") ?? 500);

  let baseLat: number, baseLng: number;

  if (aptId) {
    const apt = APARTMENTS_DATA.find((a) => a.id === aptId);
    if (!apt) return NextResponse.json({ error: "apt not found" }, { status: 404 });
    baseLat = apt.lat;
    baseLng = apt.lng;
  } else {
    baseLat = Number(searchParams.get("lat"));
    baseLng = Number(searchParams.get("lng"));
    if (!baseLat || !baseLng) {
      return NextResponse.json({ error: "lat/lng required" }, { status: 400 });
    }
  }

  // TODO: 소상공인 API 연동
  // const storeData = await fetchStoresFromSdsc(baseLat, baseLng, radiusM);

  // 상가 데이터 저장소에서 반경 내 점포 집계 조회
  const summary = getCommercialDistrictSummary(baseLat, baseLng, radiusM);

  // 모든 카테고리를 포함하도록 맵핑
  const allCodes = Object.keys(INDUSTRY_CATEGORY_META) as IndustryCategoryCode[];
  const breakdownMap = new Map(summary.categoryBreakdown.map((c) => [c.code, c]));

  const distribution: IndustryDistributionItem[] = allCodes
    .map((code) => {
      const found = breakdownMap.get(code);
      return {
        code,
        count: found ? found.count : 0,
        ratio: found ? found.ratio : 0,
      };
    })
    .sort((a, b) => b.count - a.count);

  const response: CommercialDistrictResponse = {
    lat: baseLat,
    lng: baseLng,
    radiusM,
    totalStoreCount: summary.totalStoreCount,
    distribution,
    activityLevel: summary.totalStoreCount > 0 ? "안정" : ("알수없음" as CommercialActivityLevel),
    meta: makeDataSourceMeta(
      "SDSC_STORE",
      summary.governance.referenceDate,
      {
        limitation: summary.governance.limitation,
      }
    ),
  };

  return NextResponse.json(response);
}
