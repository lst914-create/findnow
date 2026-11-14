import { NextRequest, NextResponse } from "next/server";

// 메모리 캐시 (24시간)
const geoCache = new Map<string, { lat: number; lng: number; name: string; address?: string; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawQuery = searchParams.get("query");

  if (!rawQuery || !rawQuery.trim()) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  const query = rawQuery.trim();

  // 1. 캐시 확인
  const cached = geoCache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      name: cached.name,
      lat: cached.lat,
      lng: cached.lng,
      address: cached.address,
    });
  }

  const apiKey =
    process.env.KAKAO_REST_API_KEY ||
    process.env.NEXT_PUBLIC_KAKAO_REST_KEY ||
    "4d7cd3190ca38a795008ebd7cc053820";

  try {
    // 2. 카카오 키워드 검색 시도 (학교, 장소, 상호, 랜드마크, 역 등)
    const keywordUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=3`;
    const res = await fetch(keywordUrl, {
      headers: { Authorization: `KakaoAK ${apiKey}` },
      next: { revalidate: 86400 },
    });

    if (res.ok) {
      const data = await res.json();
      if (data.documents && data.documents.length > 0) {
        const top = data.documents[0];
        const result = {
          name: top.place_name || query,
          lat: parseFloat(top.y),
          lng: parseFloat(top.x),
          address: top.road_address_name || top.address_name,
          timestamp: Date.now(),
        };
        geoCache.set(query, result);
        return NextResponse.json({
          name: result.name,
          lat: result.lat,
          lng: result.lng,
          address: result.address,
        });
      }
    }

    // 3. 카카오 주소 검색 시도 (법정동, 도로명주소 등)
    const addrUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(query)}&size=1`;
    const addrRes = await fetch(addrUrl, {
      headers: { Authorization: `KakaoAK ${apiKey}` },
      next: { revalidate: 86400 },
    });

    if (addrRes.ok) {
      const addrData = await addrRes.json();
      if (addrData.documents && addrData.documents.length > 0) {
        const top = addrData.documents[0];
        const result = {
          name: top.address_name || query,
          lat: parseFloat(top.y),
          lng: parseFloat(top.x),
          address: top.address_name,
          timestamp: Date.now(),
        };
        geoCache.set(query, result);
        return NextResponse.json({
          name: result.name,
          lat: result.lat,
          lng: result.lng,
          address: result.address,
        });
      }
    }

    return NextResponse.json({ error: "Location not found" }, { status: 404 });
  } catch (err: any) {
    console.error("[Geo Resolve API Error]", err);
    return NextResponse.json({ error: err.message || "Failed to resolve location" }, { status: 500 });
  }
}

