import { NextRequest, NextResponse } from "next/server";
import { APARTMENTS_DATA } from "@/lib/apartments";
import { makeDataSourceMeta } from "@/types/dataSource";
import { getAllSubscriptionNotices, SubscriptionNotice } from "@/lib/applyhome";
import {
  RADIUS_BUCKETS,
  type RadiusBucket,
  type SupplyType,
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

/** "2027년 5월" 또는 "2027-05" 형식을 "YYYY-MM"으로 정규화 */
function parseExpectedMoveIn(text?: string): string {
  if (!text) return "2027-06";
  const match = text.match(/(\d{4})[^\d]*(\d{1,2})/);
  if (match) {
    return `${match[1]}-${String(match[2]).padStart(2, "0")}`;
  }
  return text.slice(0, 7);
}

// 주소 -> 좌표 지오코딩 캐시
const geocodeCache = new Map<string, { lat: number; lng: number }>();

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!address) return null;
  const cleanAddr = address.split("(")[0].trim();
  if (geocodeCache.has(cleanAddr)) return geocodeCache.get(cleanAddr)!;

  const kakaoKey = (process.env.KAKAO_REST_API_KEY || "4d7cd3190ca38a795008ebd7cc053820").trim();
  try {
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(cleanAddr)}`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${kakaoKey}` },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const doc = json?.documents?.[0];
    if (doc?.y && doc?.x) {
      const coord = { lat: parseFloat(doc.y), lng: parseFloat(doc.x) };
      geocodeCache.set(cleanAddr, coord);
      return coord;
    }
  } catch {}
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const aptId = searchParams.get("aptId");
  const periodStart = searchParams.get("periodStart") ?? "2024-01";
  const periodEnd = searchParams.get("periodEnd") ?? "2030-12";

  let baseLat: number, baseLng: number;
  let targetRegion = "";

  if (aptId) {
    const apt = APARTMENTS_DATA.find((a) => a.id === aptId);
    if (!apt) return NextResponse.json({ error: "apt not found" }, { status: 404 });
    baseLat = apt.lat;
    baseLng = apt.lng;
    targetRegion = apt.region;
  } else {
    baseLat = Number(searchParams.get("lat"));
    baseLng = Number(searchParams.get("lng"));
    if (!baseLat || !baseLng) {
      return NextResponse.json({ error: "lat/lng required" }, { status: 400 });
    }
  }

  const maxRadiusM = 5000;
  const units: SupplyUnit[] = [];
  const seenIds = new Set<string>();

  // 1. 한국부동산원 청약홈 실제 분양 공고 연동
  try {
    const allNotices = await getAllSubscriptionNotices();
    // 기준 단지와 동일 광역/시도 내의 분양공고 우선 지오코딩 및 거리 계산
    const targetSido = targetRegion.split(" ")[0] || "";
    const candidateNotices = allNotices.filter(
      (n) => !targetSido || n.region.includes(targetSido) || n.address.includes(targetSido)
    );

    for (const notice of candidateNotices) {
      const moveIn = parseExpectedMoveIn(notice.moveInMonth);
      if (moveIn < periodStart || moveIn > periodEnd) continue;

      let coord = await geocodeAddress(notice.address);
      if (!coord) {
        // 주소 매칭이 안 된 경우 마스터 단지 중 동일 이름/주소 아파트 좌표 확인
        const matchApt = APARTMENTS_DATA.find((a) => notice.address.includes(a.district) && notice.name.includes(a.name));
        if (matchApt) coord = { lat: matchApt.lat, lng: matchApt.lng };
      }

      if (coord) {
        const distM = haversineM(baseLat, baseLng, coord.lat, coord.lng);
        if (distM <= maxRadiusM) {
          seenIds.add(notice.id);
          const supplyType: SupplyType = notice.rentType?.includes("임대") ? "임대" : "분양";
          units.push({
            id: `applyhome-${notice.id}`,
            name: notice.name,
            supplyType,
            totalUnits: notice.totalUnits || 0,
            saleUnits: notice.totalUnits || 0,
            expectedMoveIn: moveIn,
            address: notice.address,
            lat: coord.lat,
            lng: coord.lng,
            distanceM: Math.round(distM),
            radiusBucket: getRadiusBucket(distM),
            developer: notice.company || notice.developer || undefined,
          });
        }
      }
    }
  } catch (err) {
    console.warn("[Supply Volume] Applyhome fetch failed:", err);
  }

  // 2. K-apt 마스터 아파트 중 2024년 이후 준공 예정 단지 병합
  for (const apt of APARTMENTS_DATA) {
    if (apt.built_year < 2024 || (aptId && apt.id === aptId)) continue;
    const distM = haversineM(baseLat, baseLng, apt.lat, apt.lng);
    if (distM > maxRadiusM) continue;

    const expectedMoveIn = `${apt.built_year}-06`;
    if (expectedMoveIn < periodStart || expectedMoveIn > periodEnd) continue;

    const alreadyAdded = units.some((u) => u.name === apt.name || u.distanceM === Math.round(distM));
    if (!alreadyAdded) {
      units.push({
        id: apt.id,
        name: apt.name,
        supplyType: "분양" as SupplyType,
        totalUnits: apt.household_count,
        saleUnits: apt.household_count,
        expectedMoveIn,
        address: `${apt.region} ${apt.district}`,
        lat: apt.lat,
        lng: apt.lng,
        distanceM: Math.round(distM),
        radiusBucket: getRadiusBucket(distM),
        developer: apt.construction,
      });
    }
  }

  units.sort((a, b) => a.distanceM - b.distanceM);

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
      {
        providerLabel: "한국부동산원 청약홈 분양정보(ApplyhomeInfoDetailSvc) 및 국토교통부 신축 단지 실시간 연동",
      }
    ),
  };

  return NextResponse.json(response);
}
