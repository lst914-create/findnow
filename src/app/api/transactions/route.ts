import { NextRequest, NextResponse } from "next/server";
import { fetchTransactionsDirectly } from "@/lib/fetchTransactionsServer";

export const dynamic = "force-dynamic";

/**
 * GET /api/transactions?region=서울 강남구&district=대치동&aptName=대치삼성&months=36
 *
 * 국토교통부 실거래가 공개시스템 API를 호출하여 최신 실거래 데이터를 조회합니다.
 * 프리셋 캐시 / 서버 인메모리 캐시가 있으면 0ms 즉시 응답하며, 미캐시 단지는 공공데이터 API를 직접 조회합니다.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const region = searchParams.get("region") || "";
  const district = searchParams.get("district") || "";
  const aptName = searchParams.get("aptName") || "";
  const months = Math.min(36, Math.max(6, parseInt(searchParams.get("months") || "36", 10)));

  if (!aptName) {
    return NextResponse.json({ trades: [], rents: [] });
  }

  const { trades, rents } = await fetchTransactionsDirectly(
    { name: aptName, region, district, id: aptName },
    months
  );

  return NextResponse.json(
    { trades, rents },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}
