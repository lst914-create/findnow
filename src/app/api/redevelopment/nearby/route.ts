/**
 * GET /api/redevelopment/nearby
 *
 * 특정 아파트 단지(aptId) 또는 좌표 반경 내 정비사업 구역을 반환합니다.
 *
 * Query params:
 *   aptId?   - 단지 ID (우선)
 *   lat      - 위도 (aptId 없을 때)
 *   lng      - 경도 (aptId 없을 때)
 *   radius?  - 반경 미터 (기본 1000)
 */

import { NextRequest, NextResponse } from "next/server";
import { APARTMENTS_DATA } from "@/lib/apartments";
import { makeDataSourceMeta } from "@/types/dataSource";
import type {
  NearbyRedevelopmentZone,
  NearbyRedevelopmentResponse,
} from "@/types/redevelopmentNearby";

/** 직선 거리(m) 계산 (Haversine) */
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

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const aptId = searchParams.get("aptId");
  const radiusM = Number(searchParams.get("radius") ?? 1000);

  let baseLat: number;
  let baseLng: number;
  let aptName = "기준점";

  // 1. aptId로 기준 좌표 결정
  if (aptId) {
    const apt = APARTMENTS_DATA.find((a) => a.id === aptId);
    if (!apt) {
      return NextResponse.json({ error: "apt not found" }, { status: 404 });
    }
    baseLat = apt.lat;
    baseLng = apt.lng;
    aptName = apt.name;
  } else {
    baseLat = Number(searchParams.get("lat"));
    baseLng = Number(searchParams.get("lng"));
    if (!baseLat || !baseLng) {
      return NextResponse.json({ error: "lat/lng required" }, { status: 400 });
    }
  }

  // 2. 정비사업 마스터 데이터 로드 (lib/redevelopment-master.json)
  // TODO: Supabase 연동 시 이 부분을 DB 쿼리로 교체
  let redevelopmentMaster: any[] = [];
  try {
    const raw = await import("@/lib/redevelopment-master.json");
    redevelopmentMaster = Array.isArray(raw.default) ? raw.default : [];
  } catch {
    // 마스터 없으면 빈 배열 반환 (정상 케이스, 점진 구현)
  }

  // 3. 반경 필터링 및 거리 계산
  const zones: NearbyRedevelopmentZone[] = redevelopmentMaster
    .map((zone: any) => {
      const distM = haversineM(baseLat, baseLng, zone.lat ?? 0, zone.lng ?? 0);
      return {
        id: zone.id ?? zone.zone_id ?? "",
        name: zone.name ?? zone.zone_name ?? "정비구역",
        type: zone.type ?? zone.biz_type ?? "재개발",
        stage: zone.status ?? zone.stage ?? zone.progress_step ?? "미정",
        address: zone.address ?? "",
        bjdCode: zone.bjd_code,
        lat: zone.lat ?? 0,
        lng: zone.lng ?? 0,
        distanceM: Math.round(distM),
        plannedUnits: zone.totalUnits ?? zone.planned_units ?? zone.household_count,
        areaM2: zone.zoneAreaM2 ?? zone.area_m2,
        executor: zone.builder ?? zone.executor,
        includesTargetApt: aptId ? zone.apt_ids?.includes(aptId) : false,
        detailUrl: zone.detailUrl ?? `/redevelopment?zone=${zone.id}`,
      } satisfies NearbyRedevelopmentZone;
    })
    .filter((z) => z.distanceM <= radiusM)
    .sort((a, b) => a.distanceM - b.distanceM);

  const response: NearbyRedevelopmentResponse = {
    aptId: aptId ?? "",
    aptName,
    radiusM,
    zones,
    meta: makeDataSourceMeta("MOLIT_REDNV", new Date().toISOString().slice(0, 10)),
  };

  return NextResponse.json(response);
}
