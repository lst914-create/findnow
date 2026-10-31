/**
 * 상가·상권 데이터 저장소 및 공간 쿼리 서비스
 *
 * 소상공인시장진흥공단(SDSC) 점포 데이터를 로컬/메모리에 인덱싱하고,
 * 특정 아파트 단지 반경별 상가 검색 및 업종별 집계 요약을 제공합니다.
 */

import { CommercialStoreRecord, CommercialDistrictSummary } from "@/types/commercialStore";
import { IndustryCategoryCode } from "@/types/commercialDistrict";
import { calculateDistanceMeters } from "@/types/commonLocation";
import { makeGovernanceRecord } from "@/types/governance";

// ────────────────────────────────────────────────────────────────
// 인메모리 저장소 (향후 Supabase 테이블 `commercial_stores`와 1:1 매핑)
// ────────────────────────────────────────────────────────────────

const STORE_DB: Map<string, CommercialStoreRecord> = new Map();

/** 기본 시드 점포 데이터 초기화 (서울 서초·강남·송파 주요 생활권 기반) */
const DEFAULT_SEED_STORES: CommercialStoreRecord[] = [
  {
    bizesId: "SDSC-10001",
    bizesNm: "스타벅스 서초중앙로점",
    brchNm: "서초중앙로점",
    indsLclsCd: "Q",
    indsLclsNm: "음식",
    indsMclsCd: "Q12",
    indsMclsNm: "커피점/카페",
    indsSclsCd: "Q12A01",
    indsSclsNm: "커피전문점",
    location: {
      sido: "서울특별시",
      sigungu: "서초구",
      eupmyeondong: "서초동",
      bjdCode: "1165010800",
      roadAddress: "서울특별시 서초구 서초중앙로 45",
      coordinate: { lat: 37.4812, lng: 127.0062 },
    },
    status: "OPEN",
    governance: makeGovernanceRecord("SDSC_STORE", "소상공인시장진흥공단 상가상권정보", "2026-01-01", {
      validationStatus: "VERIFIED",
      reliabilityScore: 95,
    }),
  },
  {
    bizesId: "SDSC-10002",
    bizesNm: "파리바게뜨 서초자이점",
    indsLclsCd: "Q",
    indsLclsNm: "음식",
    indsMclsCd: "Q08",
    indsMclsNm: "제과제빵떡케익",
    indsSclsCd: "Q08A01",
    indsSclsNm: "제과점",
    location: {
      sido: "서울특별시",
      sigungu: "서초구",
      eupmyeondong: "서초동",
      bjdCode: "1165010800",
      roadAddress: "서울특별시 서초구 서초중앙로 50",
      coordinate: { lat: 37.4808, lng: 127.0049 },
    },
    status: "OPEN",
    governance: makeGovernanceRecord("SDSC_STORE", "소상공인시장진흥공단 상가상권정보", "2026-01-01", {
      validationStatus: "VERIFIED",
      reliabilityScore: 95,
    }),
  },
  {
    bizesId: "SDSC-10003",
    bizesNm: "올리브영 서초아트점",
    indsLclsCd: "D",
    indsLclsNm: "소매",
    indsMclsCd: "D05",
    indsMclsNm: "화장품소매",
    indsSclsCd: "D05A01",
    indsSclsNm: "화장품점",
    location: {
      sido: "서울특별시",
      sigungu: "서초구",
      eupmyeondong: "서초동",
      bjdCode: "1165010800",
      roadAddress: "서울특별시 서초구 반포대로 22",
      coordinate: { lat: 37.4820, lng: 127.0071 },
    },
    status: "OPEN",
    governance: makeGovernanceRecord("SDSC_STORE", "소상공인시장진흥공단 상가상권정보", "2026-01-01", {
      validationStatus: "VERIFIED",
      reliabilityScore: 95,
    }),
  },
  {
    bizesId: "SDSC-10004",
    bizesNm: "GS25 서초사랑점",
    indsLclsCd: "D",
    indsLclsNm: "소매",
    indsMclsCd: "D03",
    indsMclsNm: "종합소매",
    indsSclsCd: "D03A01",
    indsSclsNm: "편의점",
    location: {
      sido: "서울특별시",
      sigungu: "서초구",
      eupmyeondong: "서초동",
      bjdCode: "1165010800",
      roadAddress: "서울특별시 서초구 서초대로 32",
      coordinate: { lat: 37.4798, lng: 127.0051 },
    },
    status: "OPEN",
    governance: makeGovernanceRecord("SDSC_STORE", "소상공인시장진흥공단 상가상권정보", "2026-01-01", {
      validationStatus: "VERIFIED",
      reliabilityScore: 95,
    }),
  },
  {
    bizesId: "SDSC-10005",
    bizesNm: "서초연세이비인후과의원",
    indsLclsCd: "H",
    indsLclsNm: "의료",
    indsMclsCd: "H01",
    indsMclsNm: "병원",
    indsSclsCd: "H01A01",
    indsSclsNm: "이비인후과",
    location: {
      sido: "서울특별시",
      sigungu: "서초구",
      eupmyeondong: "서초동",
      bjdCode: "1165010800",
      roadAddress: "서울특별시 서초구 서초중앙로 48 3층",
      coordinate: { lat: 37.4815, lng: 127.0058 },
    },
    status: "OPEN",
    governance: makeGovernanceRecord("SDSC_STORE", "소상공인시장진흥공단 상가상권정보", "2026-01-01", {
      validationStatus: "VERIFIED",
      reliabilityScore: 95,
    }),
  },
  {
    bizesId: "SDSC-10006",
    bizesNm: "이투스 수학학원 서초캠퍼스",
    indsLclsCd: "I",
    indsLclsNm: "학문/교육",
    indsMclsCd: "I01",
    indsMclsNm: "학원-보습교습입시",
    indsSclsCd: "I01A01",
    indsSclsNm: "입시학원",
    location: {
      sido: "서울특별시",
      sigungu: "서초구",
      eupmyeondong: "서초동",
      bjdCode: "1165010800",
      roadAddress: "서울특별시 서초구 서초대로 36 4층",
      coordinate: { lat: 37.4825, lng: 127.0065 },
    },
    status: "OPEN",
    governance: makeGovernanceRecord("SDSC_STORE", "소상공인시장진흥공단 상가상권정보", "2026-01-01", {
      validationStatus: "VERIFIED",
      reliabilityScore: 95,
    }),
  },
];

// 초기 시드 주입
DEFAULT_SEED_STORES.forEach((s) => STORE_DB.set(s.bizesId, s));

// ────────────────────────────────────────────────────────────────
// 공개 쿼리 함수
// ────────────────────────────────────────────────────────────────

/** 점포 대량 삽입 또는 갱신 */
export function upsertCommercialStores(stores: CommercialStoreRecord[]): number {
  let count = 0;
  for (const s of stores) {
    STORE_DB.set(s.bizesId, s);
    count++;
  }
  return count;
}

/** 전체 저장 점포 수 */
export function getTotalStoreCount(): number {
  return STORE_DB.size;
}

/** 좌표 반경(m) 내 점포 검색 */
export function getStoresInRadius(
  centerLat: number,
  centerLng: number,
  radiusM = 500
): Array<CommercialStoreRecord & { distanceM: number }> {
  const center = { lat: centerLat, lng: centerLng };
  const results: Array<CommercialStoreRecord & { distanceM: number }> = [];

  for (const store of STORE_DB.values()) {
    const dist = calculateDistanceMeters(center, store.location.coordinate);
    if (dist <= radiusM) {
      results.push({ ...store, distanceM: dist });
    }
  }

  // 거리순 정렬
  return results.sort((a, b) => a.distanceM - b.distanceM);
}

/** 상권 분석 요약 집계 생성 */
export function getCommercialDistrictSummary(
  centerLat: number,
  centerLng: number,
  radiusM = 500
): CommercialDistrictSummary {
  const stores = getStoresInRadius(centerLat, centerLng, radiusM);
  const total = stores.length;

  // 1. 대분류별 카운트
  const categoryMap = new Map<IndustryCategoryCode, { name: string; count: number }>();
  // 2. 소분류별 카운트
  const subCategoryMap = new Map<string, number>();

  for (const s of stores) {
    const cat = categoryMap.get(s.indsLclsCd) || { name: s.indsLclsNm, count: 0 };
    cat.count++;
    categoryMap.set(s.indsLclsCd, cat);

    const subName = s.indsSclsNm || s.indsMclsNm || "기타";
    subCategoryMap.set(subName, (subCategoryMap.get(subName) || 0) + 1);
  }

  const categoryBreakdown = Array.from(categoryMap.entries())
    .map(([code, val]) => ({
      code,
      name: val.name,
      count: val.count,
      ratio: total > 0 ? Math.round((val.count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const topSubCategories = Array.from(subCategoryMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      ratio: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const sampleStores = stores.slice(0, 10).map((s) => ({
    bizesId: s.bizesId,
    bizesNm: s.bizesNm,
    indsMclsNm: s.indsMclsNm,
    location: s.location,
  }));

  const governance = makeGovernanceRecord(
    "SDSC_STORE",
    "소상공인시장진흥공단 상가상권정보",
    "2026-01-01",
    {
      validationStatus: total > 0 ? "VERIFIED" : "UNVERIFIED",
      reliabilityScore: total > 0 ? 92 : 60,
      limitation:
        "점포 및 업종 분포 분석 전용 데이터입니다. 개별 매장의 매출액 및 유동인구는 포함되지 않습니다.",
    }
  );

  return {
    centerLat,
    centerLng,
    radiusM,
    totalStoreCount: total,
    categoryBreakdown,
    topSubCategories,
    sampleStores,
    governance,
  };
}
