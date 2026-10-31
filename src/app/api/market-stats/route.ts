import { NextRequest, NextResponse } from "next/server";
import {
  fetchRoneAptPriceIndex,
  getMarketStatSummary,
  isRoneApiActive,
} from "@/lib/roneMarketApi";

/**
 * GET /api/market-stats
 *
 * 한국부동산원 R-ONE Open API 연동
 * - 월간 아파트 가격지수 (매매·전세: A_2024_00045, A_2024_00050)
 * - 전월대비 변동률 및 시장 추세 판정
 *
 * Query Params:
 * - region: 지역명 (예: "서울", "강남구", "경기", "전국"). 기본: "전국"
 * - months: 조회 개월수 (기본: 12, 최대: 36)
 * - summary: "true" 이면 요약 통계(getMarketStatSummary) 형태로 반환
 */
// 인메모리 캐시 (1시간)
const cache = new Map<string, { data: Record<string, unknown>; expiry: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const region = searchParams.get("region") || "전국";
  const months = Math.min(36, Math.max(1, parseInt(searchParams.get("months") || "12", 10)));
  const isSummary = searchParams.get("summary") === "true";

  const cacheKey = `market_stats_${region}_${months}_${isSummary}`;
  const cached = cache.get(cacheKey);
  if (cached && cached.expiry > Date.now()) {
    return NextResponse.json({ ...cached.data, cached: true });
  }

  const isLive = isRoneApiActive();

  try {
    if (isSummary) {
      const summary = await getMarketStatSummary(region);
      const result: Record<string, unknown> = {
        success: true,
        source: "한국부동산원 R-ONE Open API",
        sourceUrl: "https://www.reb.or.kr/r-one/openapi/SttsApiTblData.do",
        isLiveApi: isLive,
        region,
        summary,
        note: isLive
          ? null
          : "RONE_API_KEY 미설정 상태입니다. .env.local에 RONE_API_KEY를 추가하면 한국부동산원 공식 통계가 연동됩니다.",
      };
      if (isLive && summary) {
        cache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL_MS });
      }
      return NextResponse.json(result);
    }

    const priceIndex = await fetchRoneAptPriceIndex(region, months);

    const result: Record<string, unknown> = {
      success: true,
      source: "한국부동산원 R-ONE Open API",
      sourceUrl: "https://www.reb.or.kr/r-one/openapi/SttsApiTblData.do",
      isLiveApi: isLive,
      region,
      months,
      totalCount: priceIndex.length,
      priceIndex,
      meta: {
        sourceType: "MACRO_PRICE_INDEX",
        sourceName: "한국부동산원 R-ONE 부동산통계정보시스템",
        queryStandard: "표본 기반 주택가격동향조사 월간 지수 (기준시점 2021.06=100.0) 및 통계표 집계",
        usage: "지역별 거시적 시장 흐름, 가격 변동 추세 및 시장 경기 판단용",
        statDistinction: "본 자료는 한국부동산원의 표본 가격지수 통계이며, 국토교통부의 개별 실거래 건별 신고가액과 직접적인 단순 산술 비교나 단일 지표 혼용이 불가합니다. (통계의 기준과 용도를 엄격히 분리)",
      },
      note: isLive
        ? null
        : "RONE_API_KEY 미설정 상태입니다. .env.local에 RONE_API_KEY를 추가하면 한국부동산원 공식 통계가 연동됩니다.",
    };

    if (isLive && priceIndex.length > 0) {
      cache.set(cacheKey, { data: result, expiry: Date.now() + CACHE_TTL_MS });
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": isLive
          ? "public, max-age=3600, stale-while-revalidate=86400"
          : "no-store",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { success: false, error: "R-ONE 시장통계 API 조회 실패", detail: message },
      { status: 500 }
    );
  }
}
