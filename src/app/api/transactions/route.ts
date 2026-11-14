import { NextRequest, NextResponse } from "next/server";
import { getTransactionsForApartment } from "@/lib/fetchTransactionsServer";

export const dynamic = "force-dynamic";

/**
 * GET /api/transactions?region=경기 남양주시&district=다산동&aptName=다산한신더휴 7단지 아파트&months=36
 *
 * 국토교통부 실거래가 공개시스템 API를 호출하여 최신 실거래 데이터를 실시간 조회합니다.
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

  const { trades, rents } = await getTransactionsForApartment(
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
