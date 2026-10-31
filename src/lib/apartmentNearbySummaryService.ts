/**
 * 아파트 주변 정보 집계 결과 캐시 서비스 (Apartment Nearby Summary Cache Service)
 *
 * 용도:
 * 단지 상세 화면 진입 시마다 원천 DB(정비사업, 입주예정, 상가점포)를 전수 스캔하지 않고,
 * 반경 1km·3km 집계 결과를 일별/주간 단위로 캐싱하여 초고속 서빙합니다.
 */

import { ApartmentNearbySummary } from "@/types/domainSchema";
import { APARTMENTS_DATA } from "@/lib/apartments";
import masterZonesRaw from "./redevelopment-master.json";
import { calculateDistanceMeters } from "@/types/commonLocation";
import { getCommercialDistrictSummary } from "@/lib/commercialStoreStore";

// 인메모리 캐시 맵 (apartment_id + radius_m 키)
// Supabase 연동 시 `apartment_nearby_summary` 테이블과 1:1 대응
const SUMMARY_CACHE = new Map<string, ApartmentNearbySummary>();

/**
 * 단지 ID와 반경(m)을 기준으로 캐시된 요약을 반환하거나,
 * 캐시가 없으면 즉시 집계하여 캐시에 저장 후 반환합니다.
 */
export async function getOrComputeNearbySummary(
  apartmentId: string,
  radiusM: number = 1000
): Promise<ApartmentNearbySummary | null> {
  const cacheKey = `${apartmentId}_${radiusM}`;
  const now = new Date();
  const cached = SUMMARY_CACHE.get(cacheKey);

  // 1. 유효한 캐시가 있으면 즉시 반환 (만료 체크: 7일)
  if (cached) {
    const expiresAt = cached.expires_at ? new Date(cached.expires_at) : null;
    if (!expiresAt || expiresAt > now) {
      return cached;
    }
  }

  // 2. 단지 기본 정보 조회
  const apt = APARTMENTS_DATA.find((a) => a.id === apartmentId);
  if (!apt || !apt.lat || !apt.lng) {
    return null;
  }

  const center = { lat: apt.lat, lng: apt.lng };

  // 3. 반경 내 정비사업 집계 (ALL_NATIONWIDE_ZONES)
  let redevCount = 0;
  let redevPlannedUnits = 0;

  for (const zone of (masterZonesRaw as any[])) {
    if (!zone.lat || !zone.lng) continue;
    const dist = calculateDistanceMeters(center, { lat: zone.lat, lng: zone.lng });
    if (dist <= radiusM) {
      redevCount++;
      redevPlannedUnits += zone.totalUnits || zone.plannedUnits || 0;
    }
  }

  // 4. 반경 내 입주 예정 물량 집계 (간이 필터링)
  let supplyUnits = 0;
  for (const item of APARTMENTS_DATA) {
    if (item.id === apartmentId) continue;
    const dist = calculateDistanceMeters(center, { lat: item.lat, lng: item.lng });
    if (dist <= radiusM && item.built_year >= 2024) {
      supplyUnits += item.household_count || 0;
    }
  }

  // 5. 반경 내 상가·상권 집계 (commercialStoreStore)
  const commSummary = getCommercialDistrictSummary(apt.lat, apt.lng, radiusM);
  const topCategories = commSummary.categoryBreakdown.slice(0, 5).map((c) => ({
    code: c.code,
    name: c.name,
    count: c.count,
    ratio: c.ratio,
  }));

  // 6. 캐시 레코드 생성 및 보존
  const summaryRecord: ApartmentNearbySummary = {
    apartment_id: apartmentId,
    radius_m: radiusM,
    summary_date: now.toISOString().slice(0, 10),
    redev_count: redevCount,
    redev_planned_units: redevPlannedUnits,
    supply_units: supplyUnits,
    store_count: commSummary.totalStoreCount,
    top_categories: topCategories,
    created_at: now.toISOString(),
    expires_at: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };

  SUMMARY_CACHE.set(cacheKey, summaryRecord);
  return summaryRecord;
}
