import { NextRequest, NextResponse } from "next/server";
import { REDEVELOPMENT_DATA } from "@/lib/redevelopment";

// 국토교통부 연립다세대/단독다가구 매매 실거래가 연동 인터페이스
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const zoneId = searchParams.get("zoneId");
  const houseType = searchParams.get("type"); // "다세대" | "단독" | "all"
  const jibun = searchParams.get("jibun"); // 지번 검색

  if (!zoneId) {
    return NextResponse.json(
      { error: "zoneId parameter is required" },
      { status: 400 }
    );
  }

  const zone = REDEVELOPMENT_DATA.find((z) => z.id === zoneId);
  if (!zone) {
    return NextResponse.json(
      { error: `Zone with id '${zoneId}' not found` },
      { status: 404 }
    );
  }

  let txList = [...zone.transactions];

  // 주택유형 필터
  if (houseType && houseType !== "all") {
    txList = txList.filter((tx) => tx.type.includes(houseType));
  }

  // 지번 검색 필터
  if (jibun) {
    txList = txList.filter((tx) => tx.addressDetail.includes(jibun));
  }

  // 실거래 통계 연산
  const totalTrades = txList.length;
  const avgLandPrice =
    totalTrades > 0
      ? Math.round(
          txList.reduce((acc, cur) => acc + cur.landPricePerPyeongManwon, 0) /
            totalTrades
        )
      : 0;

  return NextResponse.json({
    zoneId: zone.id,
    zoneName: zone.name,
    district: zone.district,
    stage: zone.status,
    summary: {
      totalCount: totalTrades,
      avgLandPricePerPyeongManwon: avgLandPrice,
      pricePerPyeongByAge: zone.pricePerPyeongByAge,
    },
    transactions: txList,
  });
}
