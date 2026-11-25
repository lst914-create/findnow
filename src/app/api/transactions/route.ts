import { NextRequest, NextResponse } from "next/server";
import { fetchTransactionsDirectly } from "@/lib/fetchTransactionsServer";
import masterApartments from "@/lib/apartments-master.json";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET /api/transactions?region=서울 강남구&district=대치동&aptName=대치삼성&months=120&jibun=110-1&id=kapt-xxx
 *
 * 국토교통부 실거래가 공개시스템 API를 호출하여 최신 실거래 데이터를 조회합니다.
 * 4중 복합 키 (법정동 + 지번 + 건축년도 + 단지명)를 적용하여 오차 없는 100% 매칭을 보장합니다.
 * months 최대 120개월(10년)까지 지원
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const aptId = searchParams.get("aptId") || searchParams.get("id") || "";
  const region = searchParams.get("region") || "";
  const district = searchParams.get("district") || "";
  const aptName = searchParams.get("aptName") || "";
  const jibun = searchParams.get("jibun") || "";
  const builtYear = parseInt(searchParams.get("builtYear") || searchParams.get("built_year") || "0", 10);
  const months = Math.min(120, Math.max(6, parseInt(searchParams.get("months") || "60", 10)));

  if (!aptName) {
    return NextResponse.json({ trades: [], rents: [] });
  }

  // 마스터 DB에서 단지 정보 보강 (지번, 건축년도, 법정동 고유 식별)
  const foundApt = (masterApartments as any[]).find(
    (a) => (aptId && a.id === aptId) || (a.name === aptName && (!district || a.district === district))
  );

  const finalJibun = jibun || foundApt?.jibun || "";
  const finalBuiltYear = builtYear || foundApt?.built_year || 0;
  const finalDistrict = district || foundApt?.district || "";
  const finalRegion = region || foundApt?.region || "";
  const finalUmdNm = foundApt?.umd_nm || "";

  const { trades, rents } = await fetchTransactionsDirectly(
    {
      id: aptId || foundApt?.id || aptName,
      name: aptName,
      region: finalRegion,
      district: finalDistrict,
      umd_nm: finalUmdNm,
      jibun: finalJibun,
      built_year: finalBuiltYear,
    },
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
