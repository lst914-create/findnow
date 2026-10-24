import { NextRequest, NextResponse } from "next/server";
import { fetchKakaoCoordinate } from "@/lib/kakaoLocalApi";

/**
 * GET /api/geocode?query=래미안대치팰리스&region=서울 강남구
 *
 * 카카오 로컬 REST API를 호출하여 장소/주소에 대한 정밀 위경도 좌표 및 표준 주소를 반환합니다.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("query");
  const region = searchParams.get("region") || undefined;

  if (!query) {
    return NextResponse.json(
      { error: "query 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const result = await fetchKakaoCoordinate(query, region);

    if (!result) {
      return NextResponse.json(
        { error: "검색 결과를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: "카카오 API 요청 중 오류가 발생했습니다.", details: error.message },
      { status: 500 }
    );
  }
}
