import { NextRequest, NextResponse } from "next/server";
import { LAWD_CODES, findLawdCode } from "@/lib/publicDataApi";

// ─── 서버 인메모리 캐시 (법정동 코드 단위로 전체 데이터 캐싱) ─────────────
interface RegionCache {
  // aptName(정규화) → 최근 평균 실거래가(만원)
  priceMap: Map<string, number>;
  timestamp: number;
}
const viewportCache = new Map<string, RegionCache>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 2; // 2시간

function normalizeAptName(name: string): string {
  if (!name) return "";
  return name
    .replace(/[\s\-_(),.·]/g, "")
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

/**
 * POST /api/transactions/viewport
 * Body: { lawdCodes: string[], months?: number }
 * Response: { priceMap: { [normalizedAptName]: number } }
 *
 * 뷰포트 내 법정동 코드 목록을 받아 해당 지역의 최근 실거래가를
 * 단지명(정규화) → 최근 평균가(만원) 맵으로 반환.
 */
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const lawdCodes: string[] = body.lawdCodes || [];
  const months: number = Math.min(6, Math.max(2, body.months || 3));

  if (!lawdCodes.length) {
    return NextResponse.json({ priceMap: {} });
  }

  const apiKey =
    process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY ||
    process.env.DATA_GO_KR_API_KEY ||
    "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";

  const now = new Date();
  const dealYmdList: string[] = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    dealYmdList.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  // 법정동 코드별로 데이터 수집 (캐시 우선)
  // aptName(정규화) → 거래금액 배열 (최신 순)
  const allTrades = new Map<string, number[]>();

  const fetchRegion = async (lawdCode: string) => {
    const nowTime = Date.now();
    const cached = viewportCache.get(lawdCode);
    if (cached && nowTime - cached.timestamp < CACHE_TTL_MS) {
      // 캐시에서 바로 병합
      cached.priceMap.forEach((price, name) => {
        const existing = allTrades.get(name) || [];
        existing.push(price);
        allTrades.set(name, existing);
      });
      return;
    }

    // 최근 N개월 병렬 조회
    const localTradeMap = new Map<string, number[]>();
    try {
      const fetchPromises = dealYmdList.map(async (dealYmd) => {
        const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${apiKey}&LAWD_CD=${lawdCode}&DEAL_YMD=${dealYmd}&numOfRows=1000`;
        const res = await fetch(url, { next: { revalidate: 3600 } }).catch(() => null);
        if (!res || !res.ok) return;
        const xml = await res.text();
        for (const item of parseItems(xml)) {
          const itemAptName = getVal(item, "aptNm");
          const dealAmtStr = getVal(item, "dealAmount").replace(/,/g, "");
          if (!itemAptName || !dealAmtStr) continue;
          const normName = normalizeAptName(itemAptName);
          const amount = parseInt(dealAmtStr, 10);
          if (!normName || isNaN(amount) || amount <= 0) continue;
          const arr = localTradeMap.get(normName) || [];
          arr.push(amount);
          localTradeMap.set(normName, arr);
        }
      });
      await Promise.all(fetchPromises);
    } catch {
      // 조용히 실패
    }

    // 단지별 평균 계산 후 캐시 저장
    const priceMap = new Map<string, number>();
    localTradeMap.forEach((amounts, name) => {
      const recent = amounts.slice(0, 5);
      const avg = Math.round(recent.reduce((a, b) => a + b, 0) / recent.length);
      priceMap.set(name, avg);
      // allTrades에도 병합
      const existing = allTrades.get(name) || [];
      existing.push(avg);
      allTrades.set(name, existing);
    });

    viewportCache.set(lawdCode, { priceMap, timestamp: Date.now() });
  };

  // 최대 5개 법정동 코드까지만 처리 (API 부하 제한)
  const limitedCodes = lawdCodes.slice(0, 5);
  await Promise.all(limitedCodes.map(fetchRegion));

  // 최종 결과: normName → 평균가
  const result: Record<string, number> = {};
  allTrades.forEach((amounts, name) => {
    result[name] = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length);
  });

  return NextResponse.json(
    { priceMap: result },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      },
    }
  );
}

/**
 * GET /api/transactions/viewport?regions=서울 강남구,서울 서초구&months=3
 * GET 버전도 지원 (쿼리스트링으로 regions 전달)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const regionsParam = searchParams.get("regions") || "";
  const months = Math.min(6, Math.max(2, parseInt(searchParams.get("months") || "3", 10)));

  const regionList = regionsParam.split(",").map((r) => r.trim()).filter(Boolean);
  if (!regionList.length) {
    return NextResponse.json({ priceMap: {} });
  }

  const lawdCodes: string[] = [];
  for (const region of regionList) {
    const parts = region.split(" ");
    const regionStr = parts.slice(0, 2).join(" ");
    const entry =
      findLawdCode(regionStr, "") ||
      LAWD_CODES.find((l) => l.region === regionStr || l.region.includes(regionStr) || regionStr.includes(l.region));
    if (entry && !lawdCodes.includes(entry.code)) {
      lawdCodes.push(entry.code);
    }
  }

  return POST(new NextRequest(request.url, {
    method: "POST",
    body: JSON.stringify({ lawdCodes, months }),
    headers: { "Content-Type": "application/json" },
  }));
}
