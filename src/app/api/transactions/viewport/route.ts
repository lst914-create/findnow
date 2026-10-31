import { NextRequest, NextResponse } from "next/server";
import { findLawdCode } from "@/lib/publicDataApi";

// ─── 서버 인메모리 캐시 (법정동 코드 단위로 전체 데이터 캐싱) ─────────────
interface TradeInfo {
  aptName: string;
  normName: string;
  amount: number;
  dealDate: string; // YYYY.MM.DD
  floor: number;
  areaSqm: number;
  pyeong: number;
}

interface RegionCache {
  trades: TradeInfo[];
  timestamp: number;
}

const viewportCache = new Map<string, RegionCache>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30분 TTL

/**
 * 국토부 실거래가 신고명칭과 K-apt 마스터 단지명칭 간의 정규화 매칭 엔진
 */
export function normalizeAptName(name: string): string {
  if (!name) return "";
  return name
    .replace(/[\s\-_(),.·]/g, "")
    .replace(/아파트$/g, "")
    .replace(/금강펜테리움/gi, "펜테리움")
    .replace(/이편한세상|e\-편한세상/gi, "e편한세상")
    .replace(/에스케이뷰|sk\s*view/gi, "sk뷰")
    .replace(/대우\s*푸르지오(?!아)/gi, "푸르지오")
    .replace(/금호\s*어울림/gi, "금호어울림")
    .replace(/1차|ⅰ|i단지|1단지|Ⅰ/gi, "1")
    .replace(/2차|ⅱ|ii단지|2단지|Ⅱ/gi, "2")
    .replace(/3차|ⅲ|iii단지|3단지|Ⅲ/gi, "3")
    .replace(/4차|ⅳ|iv단지|4단지|Ⅳ/gi, "4")
    .replace(/5차|ⅴ|v단지|5단지|Ⅴ/gi, "5")
    .replace(/6차|ⅵ|vi단지|6단지|Ⅵ/gi, "6")
    .toLowerCase();
}

const getVal = (xml: string, tag: string) => {
  const m = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return m ? m[1].trim() : "";
};

const parseItems = (xmlText: string) =>
  xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];

/** 금액을 'XX.X억' 또는 'XXXX만' 형식으로 포맷 */
function formatPrice(manwon: number): string {
  const uk = Math.floor(manwon / 10000);
  const remainder = manwon % 10000;
  const cheon = Math.floor(remainder / 1000);
  if (uk > 0) {
    return cheon > 0 ? `${uk}.${cheon}억` : `${uk}억`;
  }
  return `${manwon.toLocaleString()}만`;
}

/**
 * POST /api/transactions/viewport
 * Body: {
 *   lawdCodes?: string[],
 *   regions?: Array<{ region: string; district: string }>,
 *   pyeong?: number,
 *   months?: number
 * }
 * regions 배열을 받으면 서버에서 법정동 코드로 자동 변환
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    let lawdCodes: string[] = body.lawdCodes || [];
    const pyeongFilter: number = body.pyeong ?? 0; // 0: 전체/30평대우선, 20: 20평대, 30: 30평대, 40: 40평대이상
    const months: number = Math.min(6, Math.max(2, body.months || 3));

    // regions 배열이 주어진 경우 서버에서 법정동 코드로 변환
    if (body.regions && Array.isArray(body.regions)) {
      const extra: string[] = [];
      const seen = new Set<string>(lawdCodes);
      for (const r of body.regions as Array<{ region: string; district: string }>) {
        const found = findLawdCode(r.region, r.district);
        if (found && !seen.has(found.code)) {
          seen.add(found.code);
          extra.push(found.code);
        }
      }
      lawdCodes = [...lawdCodes, ...extra];
    }

    if (!lawdCodes.length) {
      return NextResponse.json({ priceMap: {}, detailsMap: {} });
    }

    const rawApiKey =
      process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY ||
      process.env.DATA_GO_KR_API_KEY ||
      "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";

    let apiKey = rawApiKey.trim();
    try {
      apiKey = decodeURIComponent(apiKey);
    } catch {}

    const now = new Date();
    const dealYmdList: string[] = [];
    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      dealYmdList.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

    const regionTrades: TradeInfo[] = [];

    const fetchRegion = async (lawdCode: string) => {
      const nowTime = Date.now();
      const cached = viewportCache.get(lawdCode);
      if (cached && nowTime - cached.timestamp < CACHE_TTL_MS) {
        regionTrades.push(...cached.trades);
        return;
      }

      const localTrades: TradeInfo[] = [];
      try {
        const fetchPromises = dealYmdList.map(async (dealYmd) => {
          const encodedKey = encodeURIComponent(apiKey);
          const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${encodedKey}&LAWD_CD=${lawdCode}&DEAL_YMD=${dealYmd}&numOfRows=1000`;
          const res = await fetch(url, { next: { revalidate: 1800 } }).catch(() => null);
          if (!res || !res.ok) return;
          const xml = await res.text();

          for (const item of parseItems(xml)) {
            // 취소 거래(해제 사유 발생) 필터링
            const cancelCheck = getVal(item, "cdealType") || getVal(item, "cancelDealType");
            if (cancelCheck && cancelCheck.trim() !== "" && cancelCheck.trim() !== "0") {
              continue;
            }

            const aptNm = getVal(item, "aptNm");
            const dealAmtStr = getVal(item, "dealAmount").replace(/,/g, "");
            const year = getVal(item, "dealYear");
            const month = getVal(item, "dealMonth").padStart(2, "0");
            const day = (getVal(item, "dealDay") || "01").padStart(2, "0");
            const excluUseAr = parseFloat(getVal(item, "excluUseAr")) || 0;
            const floor = parseInt(getVal(item, "floor"), 10) || 1;

            if (!aptNm || !dealAmtStr) continue;

            const amount = parseInt(dealAmtStr, 10);
            if (isNaN(amount) || amount <= 0) continue;

            const normName = normalizeAptName(aptNm);
            const pyeong = Math.round(excluUseAr / 3.30578);

            localTrades.push({
              aptName: aptNm,
              normName,
              amount,
              dealDate: `${year}.${month}.${day}`,
              floor,
              areaSqm: excluUseAr,
              pyeong,
            });
          }
        });

        await Promise.all(fetchPromises);
      } catch (err) {
        console.warn(`[Viewport API] Error fetching lawd ${lawdCode}:`, err);
      }

      viewportCache.set(lawdCode, { trades: localTrades, timestamp: Date.now() });
      regionTrades.push(...localTrades);
    };

    // 최대 5개 법정동 코드까지 병렬 처리
    const limitedCodes = lawdCodes.slice(0, 5);
    await Promise.all(limitedCodes.map(fetchRegion));

    // 거래 데이터 정렬: 최신 거래일 우선
    regionTrades.sort((a, b) => b.dealDate.localeCompare(a.dealDate));

    // 평형 조건 필터링 및 단지별 최신 실거래가 매핑
    const priceMap: Record<string, number> = {};
    const detailsMap: Record<
      string,
      {
        latestPrice: number;
        formatted: string;
        dealDate: string;
        floor: number;
        areaSqm: number;
        pyeong: number;
        tradeCount: number;
      }
    > = {};

    const tradesByApt = new Map<string, TradeInfo[]>();

    for (const t of regionTrades) {
      // 평형 필터링
      if (pyeongFilter === 20) {
        if (t.areaSqm < 45 || t.areaSqm >= 65) continue;
      } else if (pyeongFilter === 30) {
        if (t.areaSqm < 70 || t.areaSqm >= 95) continue;
      } else if (pyeongFilter === 40) {
        if (t.areaSqm < 95) continue;
      }
      // pyeongFilter === 0 이면 모든 거래 허용 (아래에서 대표 평형 선택)

      const arr = tradesByApt.get(t.normName) || [];
      arr.push(t);
      tradesByApt.set(t.normName, arr);
    }

    tradesByApt.forEach((trades, normName) => {
      if (!trades.length) return;

      // 최신 거래 (첫 번째)
      const latest = trades[0];
      priceMap[normName] = latest.amount;
      detailsMap[normName] = {
        latestPrice: latest.amount,
        formatted: formatPrice(latest.amount),
        dealDate: latest.dealDate,
        floor: latest.floor,
        areaSqm: Math.round(latest.areaSqm * 10) / 10,
        pyeong: latest.pyeong,
        tradeCount: trades.length,
      };
    });

    return NextResponse.json(
      {
        success: true,
        totalMatchedApts: Object.keys(priceMap).length,
        priceMap,
        detailsMap,
      },
      {
        headers: {
          "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("[API /api/transactions/viewport] Error:", error);
    return NextResponse.json(
      { success: false, error: "실거래가 수집 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
