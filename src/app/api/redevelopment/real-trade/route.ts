import { NextRequest, NextResponse } from "next/server";
import {
  publicRedevelopmentApi,
  getLawdCodeFromAddress,
  extractDongFromAddress,
  extractJibunFromAddress,
} from "@/lib/publicRedevelopmentApi";
import { REDEVELOPMENT_DATA } from "@/lib/redevelopment";

/**
 * 국토교통부 실거래가 공개시스템 연동 API (구역별 법정동 및 지번 정밀 필터링)
 *
 * Query Params:
 * - zoneId: 구역 ID (예: jangwi-14, eungam-2, bulgwang-1)
 * - lawdCd: 법정동 시군구 코드 5자리 (예: 11290, 11380, 41220)
 * - dong: 법정동 이름 (예: 응암동, 불광동) - 미지정시 구역 주소에서 자동 추출
 * - houseType: '다세대' | '단독' | 'all'
 * - months: 조회 개월수 (기본: 12개월)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const zoneId = searchParams.get("zoneId");
  let lawdCd = searchParams.get("lawdCd");
  const houseType = searchParams.get("houseType") || "all";
  const months = parseInt(searchParams.get("months") || "12", 10);
  const dongParam = searchParams.get("dong");

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

  // 법정동 및 지번 추출
  const targetDong = dongParam || extractDongFromAddress(address, zoneName);
  const targetJibun = extractJibunFromAddress(address);

  // 기본값: 서울 성북구(11290)
  const targetLawdCd = lawdCd || "11290";

  try {
    // 재개발 시세의 핵심인 연립/다세대 및 단독/다가구 실거래 API 동시 호출
    const [villaTrades, singleTrades, aptTrades] = await Promise.all([
      houseType === "단독" || houseType === "아파트"
        ? Promise.resolve([])
        : publicRedevelopmentApi.fetchVillaTradeData(targetLawdCd, months),
      houseType === "다세대" || houseType === "아파트"
        ? Promise.resolve([])
        : publicRedevelopmentApi.fetchSingleHouseTradeData(targetLawdCd, months),
      houseType === "아파트"
        ? publicRedevelopmentApi.fetchAptTradeData(targetLawdCd, Math.min(months, 6))
        : Promise.resolve([]),
    ]);

    const combinedTrades = [...villaTrades, ...singleTrades, ...aptTrades];

    // [핵심] 구역 법정동(동/읍/면/리) 기준 독립 필터링
    let filteredTrades = combinedTrades;
    let isFilteredByDong = false;

    if (targetDong) {
      const matched = combinedTrades.filter((t) => {
        if (t.dongName && (t.dongName.includes(targetDong) || targetDong.includes(t.dongName))) {
          return true;
        }
        if (t.addressDetail && t.addressDetail.includes(targetDong)) {
          return true;
        }
        return false;
      });

      if (matched.length > 0) {
        filteredTrades = matched;
        isFilteredByDong = true;
      }
    }

    // 구역 지번 일치 여부 판별 (구역 내 지번 매칭 거래 우선 식별)
    const jibunPrefix = targetJibun ? targetJibun.split("-")[0] : "";
    const finalTrades = filteredTrades
      .map((t) => {
        const isZoneJibun = Boolean(
          targetJibun &&
            ((t.jibun && (t.jibun === targetJibun || (jibunPrefix && t.jibun.startsWith(jibunPrefix)))) ||
              (t.addressDetail && t.addressDetail.includes(targetJibun)))
        );
        return {
          ...t,
          isZoneJibun,
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));

    return NextResponse.json({
      success: true,
      source: "국토교통부 실거래가 공개시스템 (공공데이터포털)",
      zoneId,
      zoneName,
      dong: targetDong,
      isFilteredByDong,
      lawdCode: targetLawdCd,
      isLiveApi: !publicRedevelopmentApi.isMockMode,
      totalCount: finalTrades.length,
      trades: finalTrades,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "실거래가 API 조회 실패", detail: message },
      { status: 500 }
    );
  }
}
