import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * 국토교통부 브이월드(VWorld) 도시계획 정비구역 (LT_C_UQ111) WFS 및 Data API 프록시
 * 
 * 아실, 재개발닷컴과 동일한 국토부 공식 법적 정비구역 지적 경계선(GeoJSON)을 제공합니다.
 * 
 * 호출 예시:
 * GET /api/redevelopment/wfs?bbox=126.94,37.54,126.98,37.58
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bbox = searchParams.get("bbox") || "126.8,37.4,127.2,37.7";
  const apiKey = process.env.VWORLD_API_KEY || process.env.NEXT_PUBLIC_VWORLD_API_KEY;
  const domain = process.env.VWORLD_DOMAIN || "localhost";

  // bbox: minx,miny,maxx,maxy (경도최소, 위도최소, 경도최대, 위도최대)
  const coords = bbox.split(",").map((c) => parseFloat(c.trim()));
  const minLng = coords[0] || 126.8;
  const minLat = coords[1] || 37.4;
  const maxLng = coords[2] || 127.2;
  const maxLat = coords[3] || 37.7;

  if (!apiKey) {
    // VWorld API Key가 아직 .env.local에 설정되지 않았을 때의 안내 및 구조화된 응답
    return NextResponse.json({
      success: false,
      hasApiKey: false,
      message:
        "VWorld API 키(VWORLD_API_KEY)가 등록되지 않았습니다. 브이월드(vworld.kr) 무료 인증키를 .env.local에 등록하면 국토부 공식 지적 경계가 100% 자동 연동됩니다.",
      features: [],
      bbox: [minLng, minLat, maxLng, maxLat],
    });
  }

  try {
    // 방법 1: 브이월드 Data API 2.0 (GeoJSON) - 최신 표준
    const dataApiUrl =
      `https://api.vworld.kr/req/data?` +
      `service=data&request=GetFeature&data=LT_C_UQ111&key=${apiKey}&format=json&` +
      `geomFilter=BOX(${minLng},${minLat},${maxLng},${maxLat})&geometry=true&size=1000` +
      (domain ? `&domain=${encodeURIComponent(domain)}` : "");

    const res = await fetch(dataApiUrl, { next: { revalidate: 3600 } });

    if (res.ok) {
      const json = await res.json();
      
      // VWorld Data 2.0 응답 포맷 정규화
      const featureCollection =
        json?.response?.result?.featureCollection ||
        json?.featureCollection ||
        (Array.isArray(json?.features) ? json : null);

      if (featureCollection && Array.isArray(featureCollection.features)) {
        return NextResponse.json({
          success: true,
          hasApiKey: true,
          source: "국토교통부 브이월드 Data API 2.0 (LT_C_UQ111)",
          count: featureCollection.features.length,
          features: featureCollection.features,
          bbox: [minLng, minLat, maxLng, maxLat],
        });
      }
    }

    // 방법 2: 브이월드 WFS 1.1.0 프록시 Fallback
    const wfsUrl =
      `https://api.vworld.kr/req/wfs?` +
      `SERVICE=WFS&REQUEST=GetFeature&TYPENAME=lt_c_uq111&VERSION=1.1.0&` +
      `OUTPUT=application/json&SRSNAME=EPSG:4326&BBOX=${minLng},${minLat},${maxLng},${maxLat},EPSG:4326&` +
      `KEY=${apiKey}` +
      (domain ? `&DOMAIN=${encodeURIComponent(domain)}` : "");

    const wfsRes = await fetch(wfsUrl, { next: { revalidate: 3600 } });
    if (wfsRes.ok) {
      const geojson = await wfsRes.json();
      return NextResponse.json({
        success: true,
        hasApiKey: true,
        source: "국토교통부 브이월드 WFS 1.1.0 (lt_c_uq111)",
        count: (geojson.features || []).length,
        features: geojson.features || [],
        bbox: [minLng, minLat, maxLng, maxLat],
      });
    }

    return NextResponse.json({
      success: false,
      hasApiKey: true,
      message: "브이월드 API 호출 실패. 응답을 받지 못했습니다.",
      features: [],
    }, { status: 502 });

  } catch (err: any) {
    console.error("[VWorld API Proxy Error]:", err);
    return NextResponse.json(
      { success: false, hasApiKey: true, error: err?.message || String(err), features: [] },
      { status: 500 }
    );
  }
}
