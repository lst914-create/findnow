/**
 * 상가·상권 데이터 수집, 정규화 및 분석 모듈 (commercialApi.ts)
 *
 * [데이터 출처]
 * - 소상공인시장진흥공단(SDSC) 상가(상권)정보 서비스 오픈 API (공공데이터포털)
 * - 상권업종 대분류(Q, D, F 등), 중분류, 소분류 표준화 체계 적용
 * - 반경 기반 공간 쿼리 및 업종별 집계 요약 제공
 */

import {
  CommercialStoreRecord,
  CommercialDistrictSummary,
  StoreBusinessStatus,
} from "@/types/commercialStore";
import { IndustryCategoryCode } from "@/types/commercialDistrict";
import {
  getStoresInRadius,
  getCommercialDistrictSummary,
  upsertCommercialStores,
} from "@/lib/commercialStoreStore";
import { makeGovernanceRecord } from "@/types/governance";
import { calculateDistanceMeters } from "@/types/commonLocation";

/** SDSC 공공데이터 API 키 조회 (인코딩/디코딩 방어 처리) */
function getSdscApiKey(): string {
  const rawKey =
    process.env.DATA_GO_KR_API_KEY ||
    process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY ||
    process.env.SDSC_API_KEY ||
    "";

  if (!rawKey) return "";
  try {
    return decodeURIComponent(rawKey.trim());
  } catch {
    return rawKey.trim();
  }
}

/** SDSC 공공데이터 OpenAPI 원시 응답 아이템 규격 */
export interface RawSdscStoreItem {
  bizesId?: string; // 상가업소번호
  bizesNm?: string; // 상호명
  brchNm?: string; // 지점명
  indsLclsCd?: string; // 대분류코드
  indsLclsNm?: string; // 대분류명
  indsMclsCd?: string; // 중분류코드
  indsMclsNm?: string; // 중분류명
  indsSclsCd?: string; // 소분류코드
  indsSclsNm?: string; // 소분류명
  ksicCd?: string; // 표준산업분류코드
  ksicNm?: string; // 표준산업분류명
  ctprvnNm?: string; // 시도명
  signguNm?: string; // 시군구명
  adongNm?: string; // 행정동명
  ldongCd?: string; // 법정동코드
  lnoAdr?: string; // 지번주소
  rdnmAdr?: string; // 도로명주소
  bldNm?: string; // 건물명
  flrNo?: string; // 층수
  hoNo?: string; // 호수
  lon?: string | number; // 경도
  lat?: string | number; // 위도
}

/**
 * SDSC 원시 데이터를 애플리케이션 표준 상가 모델(CommercialStoreRecord)로 정규화
 */
export function normalizeSdscStore(raw: RawSdscStoreItem): CommercialStoreRecord | null {
  const lat = typeof raw.lat === "string" ? parseFloat(raw.lat) : raw.lat ?? 0;
  const lng = typeof raw.lon === "string" ? parseFloat(raw.lon) : raw.lon ?? 0;

  if (!raw.bizesId || isNaN(lat) || isNaN(lng) || lat === 0 || lng === 0) {
    return null;
  }

  // 상권업종 대분류 코드 검증 및 매핑
  const validCategoryCodes: IndustryCategoryCode[] = [
    "Q",
    "D",
    "R",
    "I",
    "J",
    "F",
    "G",
    "H",
    "L",
    "K",
    "ETC",
  ];
  const catCode = (raw.indsLclsCd || "Q").toUpperCase() as IndustryCategoryCode;
  const indsLclsCd = validCategoryCodes.includes(catCode) ? catCode : "Q";

  const status: StoreBusinessStatus = "OPEN";

  return {
    bizesId: raw.bizesId,
    bizesNm: raw.bizesNm || "무명 상호",
    brchNm: raw.brchNm || undefined,
    indsLclsCd,
    indsLclsNm: raw.indsLclsNm || "기타",
    indsMclsCd: raw.indsMclsCd || `${indsLclsCd}00`,
    indsMclsNm: raw.indsMclsNm || "일반업종",
    indsSclsCd: raw.indsSclsCd || `${indsLclsCd}0000`,
    indsSclsNm: raw.indsSclsNm || "세부업종",
    ksicCd: raw.ksicCd || undefined,
    ksicNm: raw.ksicNm || undefined,
    location: {
      sido: raw.ctprvnNm || "서울특별시",
      sigungu: raw.signguNm || "",
      eupmyeondong: raw.adongNm || "",
      bjdCode: raw.ldongCd || "1100000000",
      roadAddress: raw.rdnmAdr || raw.lnoAdr || "",
      jibunAddress: raw.lnoAdr,
      coordinate: { lat, lng },
    },
    bldNm: raw.bldNm || undefined,
    flrNo: raw.flrNo || undefined,
    hoNo: raw.hoNo || undefined,
    status,
    governance: makeGovernanceRecord(
      "SDSC_STORE",
      "소상공인시장진흥공단 상가(상권)정보 서비스",
      new Date().toISOString().slice(0, 10),
      {
        validationStatus: "VERIFIED",
        reliabilityScore: 92,
      }
    ),
  };
}

/**
 * 소상공인시장진흥공단 반경 상가 검색 API 호출 (실시간 수집)
 */
export async function fetchSdscStoresFromOpenApi(
  lat: number,
  lng: number,
  radiusM: number = 500,
  limit: number = 50
): Promise<CommercialStoreRecord[]> {
  const apiKey = getSdscApiKey();
  if (!apiKey) {
    return [];
  }

  try {
    const encodedKey = encodeURIComponent(apiKey);
    const url = `https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRadius?serviceKey=${encodedKey}&pageNo=1&numOfRows=${limit}&radius=${radiusM}&cx=${lng}&cy=${lat}&type=json`;

    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      console.warn(`[SDSC API] HTTP ${res.status} error`);
      return [];
    }

    const data = await res.json();
    const rawItems: RawSdscStoreItem[] = data?.body?.items || [];
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return [];
    }

    const records: CommercialStoreRecord[] = [];
    for (const raw of rawItems) {
      const rec = normalizeSdscStore(raw);
      if (rec) records.push(rec);
    }

    if (records.length > 0) {
      // 로컬 스토어에 캐시/색인 반영
      upsertCommercialStores(records);
    }

    return records;
  } catch (err) {
    console.warn("[SDSC API] 실시간 수집 실패 (로컬 스토어 폴백 적용):", err);
    return [];
  }
}

/**
 * 복합 반경 (1km, 3km) 상권 요약 비교 분석 데이터 생성
 */
export interface MultiRadiusCommercialSummary {
  center: { lat: number; lng: number };
  radius1km: CommercialDistrictSummary;
  radius3km: CommercialDistrictSummary;
  comparison: {
    density1kmPerKm2: number;
    density3kmPerKm2: number;
    dominantCategory1km: string;
    dominantCategory3km: string;
  };
}

/**
 * 상가·상권 데이터 반경별 다각도 집계 및 조회 (통합 진입점)
 */
export async function getAggregatedCommercialData(
  lat: number,
  lng: number,
  radiusM: number = 1000
): Promise<{
  summary: CommercialDistrictSummary;
  multiRadius?: MultiRadiusCommercialSummary;
  stores?: (CommercialStoreRecord & { distanceM: number })[];
}> {
  // 1. 공공데이터포털 실시간 데이터 수집 시도 (API 키 있을 경우)
  await fetchSdscStoresFromOpenApi(lat, lng, radiusM, 40);

  // 2. 단일 반경 상권 요약 집계
  const summary = getCommercialDistrictSummary(lat, lng, radiusM);

  // 3. 반경 1km 및 3km 다중 반경 비교 계산
  const summary1km = getCommercialDistrictSummary(lat, lng, 1000);
  const summary3km = getCommercialDistrictSummary(lat, lng, 3000);

  const area1km2 = Math.PI * 1 * 1;
  const area3km2 = Math.PI * 3 * 3;

  const multiRadius: MultiRadiusCommercialSummary = {
    center: { lat, lng },
    radius1km: summary1km,
    radius3km: summary3km,
    comparison: {
      density1kmPerKm2: Math.round(summary1km.totalStoreCount / area1km2),
      density3kmPerKm2: Math.round(summary3km.totalStoreCount / area3km2),
      dominantCategory1km: summary1km.categoryBreakdown[0]?.name || "기타",
      dominantCategory3km: summary3km.categoryBreakdown[0]?.name || "기타",
    },
  };

  const stores = getStoresInRadius(lat, lng, radiusM);

  return {
    summary,
    multiRadius,
    stores,
  };
}
