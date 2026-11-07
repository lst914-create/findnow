import { NextRequest, NextResponse } from "next/server";

interface SubwayInfo {
  name: string;
  line: string;
  distanceMeters: number;
  walkMinutes: number;
  roadAddress?: string;
}

interface SchoolInfo {
  name: string;
  type: "초등학교" | "중학교" | "고등학교" | "기타";
  distanceMeters: number;
  walkMinutes: number;
  isWalkable: boolean;
  isChoPumAh: boolean;
}

interface ParkInfo {
  name: string;
  distanceMeters: number;
  walkMinutes: number;
}

interface InfraSummaryResponse {
  subways: SubwayInfo[];
  schools: SchoolInfo[];
  parks: ParkInfo[];
  summary: {
    nearestSubway: string | null;
    nearestSchool: string | null;
    isChoPumAh: boolean;
    parkCount: number;
  };
}

// 서버 인메모리 캐시 (위경도 기반)
const INFRA_CACHE = new Map<string, { data: InfraSummaryResponse; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24시간

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");

  if (!latStr || !lngStr) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  // 캐시 키: 위경도 소수점 3자리 (약 100m 그리드)
  const cacheKey = `${lat.toFixed(3)}_${lng.toFixed(3)}`;
  const cached = INFRA_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json(cached.data);
  }

  const kakaoKey =
    process.env.KAKAO_REST_API_KEY ||
    process.env.NEXT_PUBLIC_KAKAO_REST_KEY ||
    "";

  if (!kakaoKey) {
    return NextResponse.json({ error: "Kakao API key not configured" }, { status: 500 });
  }

  try {
    // 1. 지하철역 조회 (SW8, 반경 4km)
    const subwayPromise = fetch(
      `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=SW8&x=${lng}&y=${lat}&radius=4000&sort=distance`,
      { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
    ).then((r) => (r.ok ? r.json() : { documents: [] }));

    // 2. 학교 조회 (SC4, 반경 1.5km)
    const schoolPromise = fetch(
      `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=SC4&x=${lng}&y=${lat}&radius=1500&sort=distance`,
      { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
    ).then((r) => (r.ok ? r.json() : { documents: [] }));

    // 3. 공원 조회 (키워드 검색, 반경 2km)
    const parkPromise = fetch(
      `https://dapi.kakao.com/v2/local/search/keyword.json?query=공원&x=${lng}&y=${lat}&radius=2000&sort=distance`,
      { headers: { Authorization: `KakaoAK ${kakaoKey}` } }
    ).then((r) => (r.ok ? r.json() : { documents: [] }));

    const [subwayRes, schoolRes, parkRes] = await Promise.all([
      subwayPromise,
      schoolPromise,
      parkPromise,
    ]);

    // 지하철역 파싱
    const subways: SubwayInfo[] = (subwayRes.documents || []).slice(0, 3).map((d: any) => {
      const dist = parseInt(d.distance, 10);
      const walkMin = Math.round(dist / 67); // 분속 67m (성인 기준 도보)
      // 호선 추출
      const name = d.place_name || "";
      const matchLine = name.match(/(\d+호선|경의중앙선|수인분당선|신분당선|공항철도|경춘선|서해선|우이신설선|신림선|김포골드라인|의정부경전철|용인에버라인)/);
      const line = matchLine ? matchLine[1] : "";
      return {
        name,
        line,
        distanceMeters: dist,
        walkMinutes: walkMin,
        roadAddress: d.road_address_name,
      };
    });

    // 학교 파싱
    const schools: SchoolInfo[] = (schoolRes.documents || []).slice(0, 6).map((d: any) => {
      const dist = parseInt(d.distance, 10);
      const walkMin = Math.round(dist / 67);
      const name = d.place_name || "";
      let type: "초등학교" | "중학교" | "고등학교" | "기타" = "기타";
      if (name.includes("초등학교") || name.endsWith("초")) type = "초등학교";
      else if (name.includes("중학교") || name.endsWith("중")) type = "중학교";
      else if (name.includes("고등학교") || name.endsWith("고")) type = "고등학교";

      return {
        name,
        type,
        distanceMeters: dist,
        walkMinutes: walkMin,
        isWalkable: dist <= 1000,
        isChoPumAh: type === "초등학교" && dist <= 350,
      };
    });

    // 공원 파싱
    const parks: ParkInfo[] = (parkRes.documents || []).slice(0, 5).map((d: any) => {
      const dist = parseInt(d.distance, 10);
      const walkMin = Math.round(dist / 67);
      return {
        name: d.place_name || "",
        distanceMeters: dist,
        walkMinutes: walkMin,
      };
    });

    const isChoPumAh = schools.some((s) => s.isChoPumAh);
    const nearestSubway = subways.length > 0 ? `${subways[0].name} (${subways[0].distanceMeters}m)` : null;
    const nearestSchool = schools.length > 0 ? `${schools[0].name} (${schools[0].distanceMeters}m)` : null;

    const result: InfraSummaryResponse = {
      subways,
      schools,
      parks,
      summary: {
        nearestSubway,
        nearestSchool,
        isChoPumAh,
        parkCount: parks.length,
      },
    };

    INFRA_CACHE.set(cacheKey, { data: result, timestamp: Date.now() });

    return NextResponse.json(result);
  } catch (error) {
    console.error("인프라 데이터 조회 에러:", error);
    return NextResponse.json({ error: "Failed to fetch infra data" }, { status: 500 });
  }
}

