import { NextRequest, NextResponse } from "next/server";
import { publicRedevelopmentApi, getLawdCodeFromAddress } from "@/lib/publicRedevelopmentApi";
import { REDEVELOPMENT_DATA } from "@/lib/redevelopment";

/**
 * 국토교통부 실거래가 공개시스템 연동 API (전국 지원)
 *
 * Query Params:
 * - zoneId: 구역 ID (예: jangwi-14, gwangmyeong-11)
 * - lawdCd: 법정동 시군구 코드 5자리 (예: 11290, 41220, 26110)
 * - houseType: '다세대' | '단독' | 'all'
 * - months: 조회 개월수 (기본: 12개월)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const zoneId = searchParams.get("zoneId");
  let lawdCd = searchParams.get("lawdCd");
  const houseType = searchParams.get("houseType") || "all";
  const months = parseInt(searchParams.get("months") || "12", 10);

  let zoneName = "";
  let address = "";

  if (zoneId) {
    const zone = REDEVELOPMENT_DATA.find((z) => z.id === zoneId);
    if (zone) {
      zoneName = zone.name;
      address = zone.address;
      if (!lawdCd) {
        lawdCd = getLawdCodeFromAddress(zone.address);
      }
    }
  }

  // 기본값: 서울 성북구(11290)
  const targetLawdCd = lawdCd || "11290";

  try {
    const [villaTrades, singleTrades, aptTrades] = await Promise.all([
      houseType === "단독" || houseType === "아파트"
        ? Promise.resolve([])
        : publicRedevelopmentApi.fetchVillaTradeData(targetLawdCd, months),
      houseType === "다세대" || houseType === "아파트"
        ? Promise.resolve([])
        : publicRedevelopmentApi.fetchSingleHouseTradeData(targetLawdCd, months),
      houseType === "단독" || houseType === "다세대"
        ? Promise.resolve([])
        : publicRedevelopmentApi.fetchAptTradeData(targetLawdCd, Math.min(months, 6)),
    ]);

    const combinedTrades = [...villaTrades, ...singleTrades, ...aptTrades].sort((a, b) =>
      b.date.localeCompare(a.date)
    );

    return NextResponse.json({
      success: true,
      source: "국토교통부 실거래가 공개시스템 (공공데이터포털)",
      zoneId,
      zoneName,
      lawdCode: targetLawdCd,
      isLiveApi: !publicRedevelopmentApi.isMockMode,
      totalCount: combinedTrades.length,
      trades: combinedTrades,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "실거래가 API 조회 실패", detail: message },
      { status: 500 }
    );
  }
}
