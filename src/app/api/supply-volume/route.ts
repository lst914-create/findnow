/**
 * GET /api/supply-volume
 *
 * 특정 좌표(또는 단지) 반경 내 입주 예정 물량을 반환합니다.
 *
 * Query params:
 *   aptId?      - 기준 단지 ID
 *   lat, lng    - 기준 좌표 (aptId 없을 때)
 *   periodStart - 조회 시작 연월 (예: "2024-01")
 *   periodEnd   - 조회 종료 연월 (예: "2026-12")
 */

import { NextRequest, NextResponse } from "next/server";
import { APARTMENTS_DATA } from "@/lib/apartments";
import { makeDataSourceMeta } from "@/types/dataSource";
import {
  RADIUS_BUCKETS,
  type RadiusBucket,
  type SupplyUnit,
  type SupplyByRadius,
  type SupplyVolumeResponse,
} from "@/types/supplyVolume";

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getRadiusBucket(distM: number): RadiusBucket {
  if (distM <= 500) return 0.5;
  if (distM <= 1000) return 1;
  if (distM <= 2000) return 2;
  if (distM <= 3000) return 3;
  return 5;
}

/** 연월(YYYY-MM)을 분기 문자열로 변환 */
function toPeriodQuarter(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const q = Math.ceil(m / 3);
  return `${y}-Q${q}`;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const aptId = searchParams.get("aptId");
  const periodStart = searchParams.get("periodStart") ?? "2024-01";
  const periodEnd = searchParams.get("periodEnd") ?? "2027-12";

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

  // TODO: 청약홈 API 연동 후 실제 데이터로 교체
  // 현재는 아파트 마스터에서 신축(2024년 이후 예정 준공) 단지를 proxy로 사용
  const maxRadiusM = 5000;

  const units: SupplyUnit[] = APARTMENTS_DATA
    .filter((apt) => {
      // 2024년 이후 준공 예정 단지만 (proxy)
      if (apt.built_year < 2024) return false;
      const dist = haversineM(baseLat, baseLng, apt.lat, apt.lng);
      return dist <= maxRadiusM;
    })
    .map((apt) => {
      const distM = haversineM(baseLat, baseLng, apt.lat, apt.lng);
      const bucket = getRadiusBucket(distM);
      const expectedMoveIn = `${apt.built_year}-06`; // 준공년 6월 가정
      return {
        id: apt.id,
        name: apt.name,
        supplyType: "분양",
        totalUnits: apt.household_count,
        saleUnits: apt.household_count,
        expectedMoveIn,
        address: `${apt.region} ${apt.district}`,
        lat: apt.lat,
        lng: apt.lng,
        distanceM: Math.round(distM),
        radiusBucket: bucket,
        developer: apt.construction,
      } satisfies SupplyUnit;
    })
    .filter((u) => {
      // 기간 필터
      return u.expectedMoveIn >= periodStart && u.expectedMoveIn <= periodEnd;
    })
    .sort((a, b) => a.distanceM - b.distanceM);

  // 반경별 집계
  const byRadius: SupplyByRadius[] = RADIUS_BUCKETS.map((r) => {
    const radiusM = r * 1000;
    const inBucket = units.filter((u) => u.distanceM <= radiusM);
    const totalUnits = inBucket.reduce((s, u) => s + u.totalUnits, 0);

    // 분기별 그룹핑
    const periodMap = new Map<string, { total: number; sale: number; rental: number; units: SupplyUnit[] }>();
    for (const u of inBucket) {
      const p = toPeriodQuarter(u.expectedMoveIn);
      const existing = periodMap.get(p) ?? { total: 0, sale: 0, rental: 0, units: [] };
      existing.total += u.totalUnits;
      existing.sale += u.saleUnits ?? 0;
      existing.rental += u.rentalUnits ?? 0;
      existing.units.push(u);
      periodMap.set(p, existing);
    }

    const byPeriod = Array.from(periodMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, v]) => ({
        period,
        totalUnits: v.total,
        saleUnits: v.sale,
        rentalUnits: v.rental,
        units: v.units,
      }));

    return { radiusM, totalUnits, byPeriod };
  });

  const response: SupplyVolumeResponse = {
    aptId: aptId ?? undefined,
    lat: baseLat,
    lng: baseLng,
    period: `${periodStart} ~ ${periodEnd}`,
    byRadius,
    units,
    meta: makeDataSourceMeta(
      "RONE_APPLY",
      new Date().toISOString().slice(0, 10),
      { limitation: "현재 아파트 마스터 기반 proxy 데이터입니다. 청약홈 API 연동 후 교체 예정." }
    ),
  };

  return NextResponse.json(response);
}
