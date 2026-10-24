import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * 국토교통부 브이월드(VWorld) 도시계획정비구역 (LT_C_UQ111) WFS 프록시 API
 * 
 * 재개발닷컴, 아실과 동일한 국토부 공식 법적 정비구역 지적 경계선(GeoJSON)을 제공합니다.
 * 호출: GET /api/redevelopment/wfs?bbox=127.0,37.5,127.1,37.6
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bbox = searchParams.get("bbox") || "126.8,37.4,127.2,37.7";
  const apiKey = process.env.VWORLD_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      success: false,
      message: "VWorld API 키(VWORLD_API_KEY)가 등록되지 않았습니다. 현재 정밀 블록 다각형 데이터를 사용 중입니다.",
      hasApiKey: false,
    });
  }

  try {
    const vworldUrl =
      `https://api.vworld.kr/req/wfs?` +
      `SERVICE=WFS&REQUEST=GetFeature&TYPENAME=lt_c_uq111&VERSION=1.1.0&` +
      `OUTPUT=application/json&SRSNAME=EPSG:4326&BBOX=${bbox},EPSG:4326&KEY=${apiKey}`;

    const res = await fetch(vworldUrl, { next: { revalidate: 86400 } });
    if (!res.ok) {
      return NextResponse.json({ success: false, message: `VWorld API Error: ${res.status}` }, { status: 502 });
    }

    const geojson = await res.json();
    return NextResponse.json({
      success: true,
      features: geojson.features || [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
