import { NextRequest, NextResponse } from "next/server";

const kakaoPlacesCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24시간 캐시

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const query = searchParams.get("query") || "아파트";
  const x = searchParams.get("x") || "";
  const y = searchParams.get("y") || "";
  const radius = searchParams.get("radius") || "2000";
  const page = searchParams.get("page") || "1";
  const size = searchParams.get("size") || "15";

  if (!x || !y) {
    return NextResponse.json({ documents: [], meta: { total_count: 0 } });
  }

  const cacheKey = `${query}_${parseFloat(x).toFixed(4)}_${parseFloat(y).toFixed(4)}_${radius}_${page}_${size}`;
  const cached = kakaoPlacesCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json(cached.data);
  }

  const apiKey =
    process.env.KAKAO_REST_API_KEY ||
    process.env.NEXT_PUBLIC_KAKAO_REST_KEY ||
    "4d7cd3190ca38a795008ebd7cc053820";

  try {
    const url =
      `https://dapi.kakao.com/v2/local/search/keyword.json?` +
      `query=${encodeURIComponent(query)}` +
      `&x=${encodeURIComponent(x)}&y=${encodeURIComponent(y)}` +
      `&radius=${encodeURIComponent(radius)}` +
      `&page=${encodeURIComponent(page)}` +
      `&size=${encodeURIComponent(size)}`;

    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${apiKey}` },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json({ documents: [], meta: { total_count: 0 } }, { status: res.status });
    }

    const data = await res.json();
    kakaoPlacesCache.set(cacheKey, { data, timestamp: Date.now() });
    return NextResponse.json(data);
  } catch (err) {
    console.error("[Kakao Places API Error]", err);
    return NextResponse.json({ documents: [], meta: { total_count: 0 } });
  }
}
