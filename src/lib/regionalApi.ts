/**
 * 지역정보 (관광지, 관광시설, 특수시설, 맛집) 하이브리드 연동 모듈
 * 1. 카카오 로컬 REST API: 실시간 맛집, 명소, 문화시설, 복합쇼핑/특수시설
 * 2. 한국관광공사 TourAPI 4.0: 국문 관광정보 서비스 (공공데이터포털)
 */

export type RegionalCategory = "tourist" | "facility" | "special" | "food";

export interface RegionalPlace {
  id: string;
  title: string; // 장소명 / 상호명
  category: RegionalCategory;
  categoryDetail: string; // 세부 업종/분류 (예: 관광명소, 미술관, 한식 > 냉면, 복합쇼핑몰)
  address: string; // 지번 주소
  roadAddress?: string; // 도로명 주소
  tel?: string; // 전화번호
  lat: number; // 위도
  lng: number; // 경도
  url: string; // 카카오맵 상세페이지 or 웹사이트
  imageUrl?: string; // 대표 사진 (한국관광공사 or 카테고리별 테마)
  description?: string; // 소개/개요
  distanceMeters?: number; // 거리 (미터)
  source: "kakao" | "tourapi";
}

export interface RegionalApiResponse {
  success: boolean;
  totalCount: number;
  region: string;
  category: string;
  places: RegionalPlace[];
  stats: {
    touristCount: number;
    facilityCount: number;
    specialCount: number;
    foodCount: number;
  };
}

// 메모리 캐시 (10분 TTL)
interface CacheEntry {
  data: RegionalPlace[];
  timestamp: number;
}
const regionalCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000;

/**
 * 카카오 REST API 키 안전 조회 및 전처리
 */
function getKakaoKey(): string {
  const key =
    process.env.KAKAO_REST_API_KEY ||
    process.env.KAKAO_API_KEY ||
    process.env.NEXT_PUBLIC_KAKAO_REST_KEY ||
    process.env.NEXT_PUBLIC_KAKAO_API_KEY ||
    "4d7cd3190ca38a795008ebd7cc053820";
  return key.trim();
}

/**
 * 한국관광공사 TourAPI 공공데이터포털 서비스키 안전 처리
 * - 공공데이터포털 특유의 이중 인코딩 방지를 위해 decode 후 깨끗한 키 반환
 */
function getTourApiKey(): string {
  const rawKey =
    process.env.TOUR_API_KEY ||
    process.env.KTO_API_KEY ||
    process.env.DATA_GO_KR_API_KEY ||
    process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY ||
    "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";

  if (!rawKey) return "";
  try {
    // 이미 URL 인코딩된 키의 경우 복원 후 일관되게 처리할 수 있도록 정규화
    return decodeURIComponent(rawKey.trim());
  } catch {
    return rawKey.trim();
  }
}

// 카테고리별 기본 고화질 대표 이미지 맵핑 (이미지 없을 시 적용)
const DEFAULT_CATEGORY_IMAGES: Record<RegionalCategory, string> = {
  tourist: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80", // 한국 고궁/명소
  facility: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80", // 박물관/문화시설
  special: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800&q=80", // 복합쇼핑/랜드마크
  food: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80", // 맛집/레스토랑
};

/**
 * 1. 카카오 로컬 API를 통한 지역 장소 검색
 * @param region 지역명 (예: "서울 종로구", "부산 해운대구", "경기 성남시")
 * @param category 카테고리 ("tourist" | "facility" | "special" | "food")
 * @param customKeyword 추가 검색 키워드
 */
export async function fetchKakaoPlaces(
  region: string,
  category: RegionalCategory,
  customKeyword?: string
): Promise<RegionalPlace[]> {
  const apiKey = getKakaoKey();
  if (!apiKey) return [];

  // 카카오 카테고리 그룹 코드 매핑
  // AT4: 관광명소, CT1: 문화시설, FD6: 음식점, CE7: 카페, MT1: 대형마트(특수시설)
  let categoryGroupCode = "";
  let searchTerms: string[] = [];

  const cleanRegion = region === "전체" ? "서울" : region;

  switch (category) {
    case "tourist":
      categoryGroupCode = "AT4";
      searchTerms = [
        customKeyword ? `${cleanRegion} ${customKeyword}` : `${cleanRegion} 관광명소`,
        `${cleanRegion} 가볼만한곳`,
      ];
      break;
    case "facility":
      categoryGroupCode = "CT1";
      searchTerms = [
        customKeyword ? `${cleanRegion} ${customKeyword}` : `${cleanRegion} 문화시설`,
        `${cleanRegion} 박물관 미술관`,
      ];
      break;
    case "special":
      // 특수시설: 백화점, 복합쇼핑몰, 아울렛, 종합병원, 랜드마크, 공원/체육시설
      searchTerms = [
        customKeyword ? `${cleanRegion} ${customKeyword}` : `${cleanRegion} 백화점`,
        `${cleanRegion} 대형쇼핑몰`,
        `${cleanRegion} 종합병원`,
        `${cleanRegion} 대형마트`,
      ];
      break;
    case "food":
      categoryGroupCode = "FD6";
      searchTerms = [
        customKeyword ? `${cleanRegion} ${customKeyword}` : `${cleanRegion} 맛집`,
        `${cleanRegion} 대표맛집`,
      ];
      break;
  }

  const results: RegionalPlace[] = [];
  const seenIds = new Set<string>();

  for (const query of searchTerms.slice(0, 2)) {
    try {
      let url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
        query
      )}&size=15`;
      if (categoryGroupCode && !customKeyword) {
        url += `&category_group_code=${categoryGroupCode}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `KakaoAK ${apiKey}` },
      });

      if (!res.ok) continue;

      const data = await res.json();
      const docs = data.documents || [];

      for (const d of docs) {
        if (seenIds.has(d.id)) continue;
        seenIds.add(d.id);

        results.push({
          id: `kakao_${d.id}`,
          title: d.place_name,
          category,
          categoryDetail: d.category_name
            ? d.category_name.split(">").slice(-2).join(" > ").trim()
            : getCategoryLabel(category),
          address: d.address_name || "",
          roadAddress: d.road_address_name || undefined,
          tel: d.phone || undefined,
          lat: parseFloat(d.y),
          lng: parseFloat(d.x),
          url: d.place_url || `https://map.kakao.com/link/map/${d.id}`,
          imageUrl: DEFAULT_CATEGORY_IMAGES[category],
          source: "kakao",
        });
      }
    } catch (err) {
      console.warn(`[Kakao Places API] search error for '${query}':`, err);
    }
  }

  return results;
}

/**
 * 2. 한국관광공사 TourAPI 4.0 연동 (공공데이터포털)
 * - contentTypeId: 12(관광지), 14(문화시설), 15(행사/공연), 28(레포츠/특수), 38(쇼핑), 39(음식점)
 */
export async function fetchTourApiPlaces(
  keyword: string,
  category: RegionalCategory
): Promise<RegionalPlace[]> {
  const serviceKey = getTourApiKey();
  if (!serviceKey) return [];

  let contentTypeId = "12";
  if (category === "facility") contentTypeId = "14";
  else if (category === "special") contentTypeId = "28"; // 레포츠 / 특수시설
  else if (category === "food") contentTypeId = "39"; // 음식점

  const encodedKey = encodeURIComponent(serviceKey);
  const url = `https://apis.data.go.kr/B551011/KorService2/searchKeyword2?serviceKey=${encodedKey}&keyword=${encodeURIComponent(
    keyword
  )}&contentTypeId=${contentTypeId}&numOfRows=15&pageNo=1&MobileOS=ETC&MobileApp=Chajwo&_type=json`;

  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const json = await res.json();
    const items = json.response?.body?.items?.item || [];
    const list = Array.isArray(items) ? items : [items];

    return list
      .filter((item: any) => item && item.contentid)
      .map((item: any) => ({
        id: `tourapi_${item.contentid}`,
        title: item.title,
        category,
        categoryDetail: item.cat3 || getCategoryLabel(category),
        address: item.addr1 || "",
        roadAddress: item.addr2 ? `${item.addr1} ${item.addr2}` : item.addr1,
        tel: item.tel || undefined,
        lat: parseFloat(item.mapy) || 0,
        lng: parseFloat(item.mapx) || 0,
        url: `https://korean.visitkorea.or.kr/detail/ms_detail.do?cotid=${item.contentid}`,
        imageUrl: item.firstimage || item.firstimage2 || DEFAULT_CATEGORY_IMAGES[category],
        description: item.overview || undefined,
        source: "tourapi",
      }));
  } catch (err) {
    // TourAPI 키 미승인 시 graceful fallback
    return [];
  }
}

/**
 * 3. 통합 장소 조회 (카카오 로컬 + 한국관광공사 하이브리드)
 */
export async function getRegionalPlaces(
  region = "서울 강남구",
  category: RegionalCategory | "all" = "all",
  keyword = ""
): Promise<RegionalPlace[]> {
  const cacheKey = `${region}_${category}_${keyword}`;
  const now = Date.now();
  if (regionalCache.has(cacheKey)) {
    const cached = regionalCache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const categoriesToFetch: RegionalCategory[] =
    category === "all"
      ? ["tourist", "facility", "special", "food"]
      : [category];

  const fetchPromises = categoriesToFetch.map(async (cat) => {
    // 1차: 카카오 로컬 실시간 API
    const kakaoPlaces = await fetchKakaoPlaces(region, cat, keyword);

    // 2차: TourAPI 병렬 시도 (키워드 매칭)
    const tourQuery = keyword ? `${region} ${keyword}` : region;
    const tourPlaces = await fetchTourApiPlaces(tourQuery, cat);

    // 합치기 (카카오 우선 + TourAPI 사진/개요 장소 추가)
    const combined = [...kakaoPlaces];
    const seenNames = new Set(
      kakaoPlaces.map((p) => p.title.replace(/\s+/g, ""))
    );

    for (const tp of tourPlaces) {
      const cleanName = tp.title.replace(/\s+/g, "");
      if (!seenNames.has(cleanName)) {
        combined.push(tp);
      }
    }

    return combined;
  });

  const placeArrays = await Promise.all(fetchPromises);
  let allPlaces = placeArrays.flat();

  // 만약 검색 결과가 없으면(API 장애 등) 신뢰성 있는 Fallback 추천 데이터 제공
  if (allPlaces.length === 0) {
    allPlaces = getFallbackRegionalPlaces(region, category);
  }

  regionalCache.set(cacheKey, { data: allPlaces, timestamp: now });
  return allPlaces;
}

export function getCategoryLabel(cat: RegionalCategory): string {
  switch (cat) {
    case "tourist":
      return "🏞️ 관광지/명소";
    case "facility":
      return "🏛️ 관광·문화시설";
    case "special":
      return "🛍️ 특수·복합시설";
    case "food":
      return "🍽️ 지역 맛집";
  }
}

/**
 * 지역별 대표 Fallback 데이터 (고품질 시드)
 */
function getFallbackRegionalPlaces(
  region: string,
  category: RegionalCategory | "all"
): RegionalPlace[] {
  const allSeeds: RegionalPlace[] = [
    // 서울 관광명소
    {
      id: "seed_1",
      title: "경복궁 & 광화문 광장",
      category: "tourist",
      categoryDetail: "유적지 > 궁궐",
      address: "서울특별시 종로구 세종로 1-1",
      roadAddress: "서울특별시 종로구 사직로 161",
      tel: "02-3700-3900",
      lat: 37.5796,
      lng: 126.977,
      url: "https://place.map.kakao.com/8129037",
      imageUrl: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80",
      description: "조선 왕조 제일의 법궁이자 서울을 대표하는 핵심 랜드마크",
      source: "kakao",
    },
    {
      id: "seed_2",
      title: "롯데월드타워 & 서울스카이",
      category: "special",
      categoryDetail: "복합쇼핑몰 > 전망대",
      address: "서울특별시 송파구 신천동 29",
      roadAddress: "서울특별시 송파구 올림픽로 300",
      tel: "1661-2000",
      lat: 37.5126,
      lng: 127.1026,
      url: "https://place.map.kakao.com/26338954",
      imageUrl: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800&q=80",
      description: "국내 최고층(123층, 555m) 랜드마크, 에비뉴엘, 쇼핑몰, 아쿠아리움 및 시그니엘",
      source: "kakao",
    },
    {
      id: "seed_3",
      title: "국립중앙박물관",
      category: "facility",
      categoryDetail: "문화시설 > 국립박물관",
      address: "서울특별시 용산구 용산동6가 168-6",
      roadAddress: "서울특별시 용산구 서빙고로 137",
      tel: "02-2077-9000",
      lat: 37.524,
      lng: 126.9803,
      url: "https://place.map.kakao.com/8118021",
      imageUrl: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80",
      description: "세계적 규모의 대한민국 대표 박물관이자 용산가족공원과 연계된 문화공간",
      source: "kakao",
    },
    {
      id: "seed_4",
      title: "우래옥 본점",
      category: "food",
      categoryDetail: "음식점 > 한식 > 평양냉면",
      address: "서울특별시 중구 주교동 118-1",
      roadAddress: "서울특별시 중구 창경궁로 62-29",
      tel: "02-2265-0151",
      lat: 37.5681,
      lng: 126.9987,
      url: "https://place.map.kakao.com/8573121",
      imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      description: "1946년 개업 이래 서울 평양냉면과 불고기의 정수를 이어온 미쉐린 가이드 맛집",
      source: "kakao",
    },
    // 경기 명소
    {
      id: "seed_5",
      title: "스타필드 하남 / 수원",
      category: "special",
      categoryDetail: "쇼핑 > 복합쇼핑몰/엔터테인먼트",
      address: "경기도 하남시 신장동 616",
      roadAddress: "경기도 하남시 미사대로 750",
      tel: "1833-9001",
      lat: 37.5455,
      lng: 127.2238,
      url: "https://place.map.kakao.com/27538902",
      imageUrl: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?auto=format&fit=crop&w=800&q=80",
      description: "쇼핑, 레저(아쿠아필드, 스포츠몬스터), 맛집이 결합된 수도권 최대 쇼핑 테마파크",
      source: "kakao",
    },
    {
      id: "seed_6",
      title: "남한산성 도립공원",
      category: "tourist",
      categoryDetail: "관광명소 > 유네스코 세계유산",
      address: "경기도 광주시 남한산성면 산성리 731",
      roadAddress: "경기도 광주시 남한산성면 남한산성로 731",
      tel: "031-743-6610",
      lat: 37.4789,
      lng: 127.1837,
      url: "https://place.map.kakao.com/7839218",
      imageUrl: "https://images.unsplash.com/photo-1548115184-bc6544d06a58?auto=format&fit=crop&w=800&q=80",
      description: "수도권을 내려다보는 유네스코 세계유산이자 사계절 트레킹 명소",
      source: "kakao",
    },
  ];

  if (category === "all") return allSeeds;
  return allSeeds.filter((s) => s.category === category);
}
