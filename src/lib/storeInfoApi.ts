/**
 * 소상공인시장진흥공단 상가(상권)정보 서비스 API 연동 모듈
 *
 * [데이터 출처]
 * - 소상공인시장진흥공단 상가(상권)정보 서비스
 * - Portal: https://www.data.go.kr/data/15012005/openapi.do
 * - API Base: https://apis.data.go.kr/B553077/api/open/sdsc2
 *
 * [제공 항목]
 * - 점포 식별자 (상가 고유번호)
 * - 업종 (상권업종대분류명, 중분류명, 소분류명)
 * - 주소 (지번주소, 도로명주소)
 * - 위도·경도
 * - 갱신일자 (기준)
 *
 * [API 키 발급]
 * 1. https://www.data.go.kr 회원가입
 * 2. '소상공인시장진흥공단_상가(상권)정보' 활용신청
 * 3. 발급받은 키를 .env.local에 저장:
 *    DATA_GO_KR_API_KEY=발급받은키
 */

// ==================== 타입 정의 ====================

/** 상가 정보 레코드 */
export interface StoreInfo {
  /** 상가 고유번호 */
  storeId: string;
  /** 상호명 */
  storeName: string;
  /** 지점명 */
  branchName?: string;
  /** 상권업종 대분류 코드 */
  categoryMainCode: string;
  /** 상권업종 대분류명 */
  categoryMainName: string;
  /** 상권업종 중분류 코드 */
  categoryMidCode: string;
  /** 상권업종 중분류명 */
  categoryMidName: string;
  /** 상권업종 소분류 코드 */
  categorySubCode: string;
  /** 상권업종 소분류명 */
  categorySubName: string;
  /** 시도 코드 */
  sidoCode: string;
  /** 시도명 */
  sidoName: string;
  /** 시군구 코드 */
  sigunguCode: string;
  /** 시군구명 */
  sigunguName: string;
  /** 행정동 코드 */
  dongCode?: string;
  /** 행정동명 */
  dongName?: string;
  /** 법정동 코드 */
  legalDongCode?: string;
  /** 지번 주소 */
  jibunAddress?: string;
  /** 도로명 주소 */
  roadAddress?: string;
  /** 위도 */
  lat?: number;
  /** 경도 */
  lng?: number;
  /** 갱신일자 */
  updatedAt?: string;
}

/** 상권 정보 (반경 내 상가 분석 결과) */
export interface CommercialAreaInfo {
  /** 검색 중심 위도 */
  centerLat: number;
  /** 검색 중심 경도 */
  centerLng: number;
  /** 검색 반경 (미터) */
  radiusMeters: number;
  /** 전체 점포 수 */
  totalStoreCount: number;
  /** 업종별 점포 수 */
  categorySummary: { name: string; count: number }[];
  /** 분석 목적 및 활용 범위 (초기 업종 분포 분석용) */
  analysisPurpose: string;
  /** 데이터 해석상 한계 및 유의사항 (매출·유동인구 임의 추정 금지) */
  limitations: string;
  /** 점포 목록 */
  stores: StoreInfo[];
}

// ==================== 업종 대분류 코드 매핑 ====================

export const STORE_CATEGORY_CODES = {
  FOOD: "Q", // 음식
  RETAIL: "D", // 소매
  LIFE_SERVICE: "I", // 생활서비스
  LEARN: "R", // 학문/교육
  LEISURE: "O", // 관광/여가/오락
  HEALTHCARE: "L", // 의료
  REAL_ESTATE: "J", // 부동산
} as const;

// ==================== 메모리 캐시 ====================

interface CacheEntry {
  data: StoreInfo[];
  expiry: number;
}
const storeCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 30 * 60 * 1000; // 30분 캐시

// ==================== API 서비스 ====================

function getApiKey(): string | null {
  return process.env.DATA_GO_KR_API_KEY || process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY || null;
}

/**
 * 반경 내 상가 목록 조회 (좌표 기반)
 *
 * @param lat 중심 위도
 * @param lng 중심 경도
 * @param radiusMeters 검색 반경 (미터, 최대 1000)
 * @param pageSize 결과 수 (기본: 100)
 * @returns StoreInfo[]
 */
export async function fetchStoresNearby(
  lat: number,
  lng: number,
  radiusMeters = 500,
  pageSize = 100
): Promise<StoreInfo[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("[상가정보 API] DATA_GO_KR_API_KEY 미설정");
    return [];
  }

  const encodedKey = apiKey.includes("%") ? apiKey : encodeURIComponent(apiKey);
  const radius = Math.min(radiusMeters, 1000);
  const cacheKey = `store_nearby_${lat.toFixed(4)}_${lng.toFixed(4)}_${radius}_${pageSize}`;
  const cached = storeCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) return cached.data;

  try {
    const url = new URL("https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInRadius");
    url.searchParams.set("serviceKey", encodedKey);
    url.searchParams.set("pageNo", "1");
    url.searchParams.set("numOfRows", String(pageSize));
    url.searchParams.set("radius", String(radius));
    url.searchParams.set("cx", String(lng)); // 경도
    url.searchParams.set("cy", String(lat)); // 위도
    url.searchParams.set("type", "json");

    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (res.ok) {
      interface StoreRow {
        bizesId?: string;
        bizesNm?: string;
        brchNm?: string;
        indsLclsCd?: string;
      indsLclsNm?: string;
      indsMclsCd?: string;
      indsMclsNm?: string;
      indsSclsCd?: string;
      indsSclsNm?: string;
      sidoCd?: string;
      sidoNm?: string;
      sggCd?: string;
      sggNm?: string;
      adongCd?: string;
      adongNm?: string;
      ldongCd?: string;
      lnoAdr?: string;
      rdnAdr?: string;
      lon?: string;
      lat?: string;
      lastModTs?: string;
    }

    const json = (await res.json()) as {
      body?: {
        items?: StoreRow | StoreRow[];
        totalCount?: number;
      };
    };

    const rawItems = json?.body?.items;
    if (rawItems) {
      const items: StoreRow[] = Array.isArray(rawItems) ? rawItems : [rawItems];
      const stores: StoreInfo[] = items
        .filter((item) => item.bizesId)
        .map((item) => ({
          storeId: item.bizesId || "",
          storeName: item.bizesNm || "",
          branchName: item.brchNm || undefined,
          categoryMainCode: item.indsLclsCd || "",
          categoryMainName: item.indsLclsNm || "",
          categoryMidCode: item.indsMclsCd || "",
          categoryMidName: item.indsMclsNm || "",
          categorySubCode: item.indsSclsCd || "",
          categorySubName: item.indsSclsNm || "",
          sidoCode: item.sidoCd || "",
          sidoName: item.sidoNm || "",
          sigunguCode: item.sggCd || "",
          sigunguName: item.sggNm || "",
          dongCode: item.adongCd || undefined,
          dongName: item.adongNm || undefined,
          legalDongCode: item.ldongCd || undefined,
          jibunAddress: item.lnoAdr || undefined,
          roadAddress: item.rdnAdr || undefined,
          lat: item.lat ? parseFloat(item.lat) : undefined,
          lng: item.lon ? parseFloat(item.lon) : undefined,
          updatedAt: item.lastModTs || undefined,
        }));

      if (stores.length > 0) {
        storeCache.set(cacheKey, { data: stores, expiry: Date.now() + CACHE_TTL_MS });
        return stores;
      }
    }
  }
} catch {
    // SDSC 실패 시 카카오 로컬 API로 대체
  }

  // SDSC 미등록 또는 에러 시 카카오 로컬 실시간 API 연동
  const kakaoKey = (
    process.env.KAKAO_REST_API_KEY ||
    process.env.NEXT_PUBLIC_KAKAO_REST_KEY ||
    "4d7cd3190ca38a795008ebd7cc053820"
  ).trim();

  try {
    const kakaoCategories = [
      { code: "FD6", mainCode: "Q", mainName: "음식" },
      { code: "CE7", mainCode: "Q", mainName: "음식" },
      { code: "HP8", mainCode: "L", mainName: "의료" },
      { code: "PM9", mainCode: "L", mainName: "의료" },
      { code: "AC5", mainCode: "R", mainName: "학문/교육" },
      { code: "CS2", mainCode: "D", mainName: "소매" },
      { code: "MT1", mainCode: "D", mainName: "소매" },
      { code: "BK9", mainCode: "J", mainName: "부동산/금융" },
    ];

    const fallbackStores: StoreInfo[] = [];
    const fetchKakaoCat = async (cat: typeof kakaoCategories[0]) => {
      try {
        const kUrl = `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${cat.code}&x=${lng}&y=${lat}&radius=${radius}&size=15`;
        const kRes = await fetch(kUrl, {
          headers: { Authorization: `KakaoAK ${kakaoKey}` },
          next: { revalidate: 3600 },
        });
        if (!kRes.ok) return;
        const kData = await kRes.json();
        for (const doc of kData.documents || []) {
          const dLat = parseFloat(doc.y);
          const dLng = parseFloat(doc.x);
          const addrParts = (doc.address_name || "").split(" ");
          fallbackStores.push({
            storeId: `kakao-${doc.id}`,
            storeName: doc.place_name || "",
            categoryMainCode: cat.mainCode,
            categoryMainName: cat.mainName,
            categoryMidCode: `${cat.mainCode}01`,
            categoryMidName: doc.category_name?.split(">")?.pop()?.trim() || cat.mainName,
            categorySubCode: `${cat.mainCode}0101`,
            categorySubName: doc.category_name?.split(">")?.pop()?.trim() || cat.mainName,
            sidoCode: "11",
            sidoName: addrParts[0] || "서울특별시",
            sigunguCode: "11000",
            sigunguName: addrParts[1] || "",
            dongName: addrParts[2] || "",
            jibunAddress: doc.address_name || undefined,
            roadAddress: doc.road_address_name || undefined,
            lat: isNaN(dLat) ? undefined : dLat,
            lng: isNaN(dLng) ? undefined : dLng,
            updatedAt: new Date().toISOString().slice(0, 10),
          });
        }
      } catch {}
    };

    await Promise.all(kakaoCategories.map(fetchKakaoCat));

    if (fallbackStores.length > 0) {
      storeCache.set(cacheKey, { data: fallbackStores, expiry: Date.now() + CACHE_TTL_MS });
      return fallbackStores;
    }
  } catch (err) {
    console.error("[상가정보 API] 카카오 로컬 연동 오류:", err);
  }

  return [];
}

/**
 * 행정동 코드 기반 상가 목록 조회
 *
 * @param dongCode 행정동 코드 (예: 1168010100)
 * @param categoryMainCode 업종 대분류 코드 (선택)
 * @param pageSize 결과 수 (기본: 200)
 * @returns StoreInfo[]
 */
export async function fetchStoresByDong(
  dongCode: string,
  categoryMainCode?: string,
  pageSize = 200
): Promise<StoreInfo[]> {
  const apiKey = getApiKey();
  if (!apiKey) {
    console.warn("[상가정보 API] DATA_GO_KR_API_KEY 미설정");
    return [];
  }

  const encodedKey = apiKey.includes("%") ? apiKey : encodeURIComponent(apiKey);
  const cacheKey = `store_dong_${dongCode}_${categoryMainCode || "all"}_${pageSize}`;
  const cached = storeCache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) return cached.data;

  try {
    const url = new URL("https://apis.data.go.kr/B553077/api/open/sdsc2/storeListInDong");
    url.searchParams.set("serviceKey", encodedKey);
    url.searchParams.set("pageNo", "1");
    url.searchParams.set("numOfRows", String(pageSize));
    url.searchParams.set("divId", "adongCd"); // 행정동 코드 기준
    url.searchParams.set("key", dongCode);
    if (categoryMainCode) {
      url.searchParams.set("indsLclsCd", categoryMainCode);
    }
    url.searchParams.set("type", "json");

    const res = await fetch(url.toString(), { next: { revalidate: 1800 } });
    if (!res.ok) return [];

    interface StoreRow {
      bizesId?: string;
      bizesNm?: string;
      brchNm?: string;
      indsLclsCd?: string;
      indsLclsNm?: string;
      indsMclsCd?: string;
      indsMclsNm?: string;
      indsSclsCd?: string;
      indsSclsNm?: string;
      sidoCd?: string;
      sidoNm?: string;
      sggCd?: string;
      sggNm?: string;
      adongCd?: string;
      adongNm?: string;
      ldongCd?: string;
      lnoAdr?: string;
      rdnAdr?: string;
      lon?: string;
      lat?: string;
      lastModTs?: string;
    }

    const json = (await res.json()) as { body?: { items?: StoreRow | StoreRow[] } };
    const rawItems = json?.body?.items;
    if (!rawItems) return [];

    const items: StoreRow[] = Array.isArray(rawItems) ? rawItems : [rawItems];
    const stores: StoreInfo[] = items
      .filter((item) => item.bizesId)
      .map((item) => ({
        storeId: item.bizesId || "",
        storeName: item.bizesNm || "",
        branchName: item.brchNm || undefined,
        categoryMainCode: item.indsLclsCd || "",
        categoryMainName: item.indsLclsNm || "",
        categoryMidCode: item.indsMclsCd || "",
        categoryMidName: item.indsMclsNm || "",
        categorySubCode: item.indsSclsCd || "",
        categorySubName: item.indsSclsNm || "",
        sidoCode: item.sidoCd || "",
        sidoName: item.sidoNm || "",
        sigunguCode: item.sggCd || "",
        sigunguName: item.sggNm || "",
        dongCode: item.adongCd || undefined,
        dongName: item.adongNm || undefined,
        legalDongCode: item.ldongCd || undefined,
        jibunAddress: item.lnoAdr || undefined,
        roadAddress: item.rdnAdr || undefined,
        lat: item.lat ? parseFloat(item.lat) : undefined,
        lng: item.lon ? parseFloat(item.lon) : undefined,
        updatedAt: item.lastModTs || undefined,
      }));

    storeCache.set(cacheKey, { data: stores, expiry: Date.now() + CACHE_TTL_MS });
    return stores;
  } catch (err) {
    console.error("[상가정보 API] 행정동 조회 오류:", err);
    return [];
  }
}

/**
 * 상권 분석: 반경 내 업종별 점포 분포 집계
 */
export function analyzeCommercialArea(
  lat: number,
  lng: number,
  radiusMeters: number,
  stores: StoreInfo[]
): CommercialAreaInfo {
  const categoryCounts = new Map<string, number>();
  for (const store of stores) {
    const cat = store.categoryMidName || store.categoryMainName || "기타";
    categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
  }

  const categorySummary = Array.from(categoryCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    centerLat: lat,
    centerLng: lng,
    radiusMeters,
    totalStoreCount: stores.length,
    categorySummary,
    analysisPurpose: "초기 업종 분포 분석 (업종 대/중/소분류 점포 수 및 반경 내 구성비 파악)",
    limitations:
      "본 데이터는 소상공인시장진흥공단의 점포 등록 현황(업종, 주소, 좌표)에 기반한 초기 업종 분포 분석용입니다. 개별 점포의 매출액이나 유동인구 데이터는 포함되지 않으므로 이를 임의로 추정하거나 확정적 상권 지표로 가정하지 않습니다.",
    stores,
  };
}

export function isStoreApiActive(): boolean {
  return !!(process.env.DATA_GO_KR_API_KEY || process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY);
}
