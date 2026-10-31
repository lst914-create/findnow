/**
 * 한국부동산원 R-ONE 부동산 시장 통계 Open API 연동 모듈 (실제 Open API 규격 적용)
 * 
 * 데이터 영역 4: 부동산 시장 통계 (한국부동산원 R-ONE Open API)
 * - 아파트 매매가격지수 (월간: A_2024_00045)
 * - 아파트 전세가격지수 (월간: A_2024_00050)
 * 
 * 엔드포인트: https://www.reb.or.kr/r-one/openapi/SttsApiTblData.do
 * 환경변수: RONE_API_KEY
 */

export interface AptPriceIndex {
  period: string; // YYYY-MM
  regionName: string;
  regionFullName: string;
  saleIndex: number | null; // 매매가격지수
  jeonseIndex: number | null; // 전세가격지수
  saleChangeRate: number | null; // 매매 변동률
  jeonseChangeRate: number | null; // 전세 변동률
}

export interface AptTradeVolume {
  period: string; // YYYY-MM
  regionName: string;
  volume: number;
}

export interface MarketStatSummary {
  regionName: string;
  latestPeriod: string;
  currentSaleIndex: number | null;
  currentJeonseIndex: number | null;
  saleChangeRateMoM: number | null;
  jeonseChangeRateMoM: number | null;
  priceTrend: "상승" | "보합" | "하락" | "데이터미제공";
  history: {
    periods: string[];
    saleIndices: (number | null)[];
    jeonseIndices: (number | null)[];
  };
}

// ---------------------------------------------------------------------------
// 인메모리 캐시 (1시간 유효)
// ---------------------------------------------------------------------------
interface CacheEntry<T> {
  data: T;
  expiry: number;
}
const roneCache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = roneCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    roneCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T, ttlMs = 3600 * 1000): void {
  roneCache.set(key, { data, expiry: Date.now() + ttlMs });
}

function getRoneApiKey(): string | null {
  return process.env.RONE_API_KEY || process.env.NEXT_PUBLIC_RONE_API_KEY || null;
}

interface RoneDataRow {
  STATBL_ID?: string;
  DTACYCLE_CD?: string;
  WRTTIME_IDTFR_ID?: string; // e.g. "202401"
  CLS_ID?: number | string;
  CLS_NM?: string; // e.g. "서울", "강남구", "전국"
  CLS_FULLNM?: string; // e.g. "서울>동남권>강남구"
  ITM_ID?: number | string;
  ITM_NM?: string; // e.g. "지수", "변동률"
  DTA_VAL?: number | string;
  WRTTIME_DESC?: string;
}

/**
 * R-ONE SttsApiTblData.do 호출 공통 헬퍼
 */
async function fetchRoneTableData(
  statblId: string,
  startPeriod: string,
  endPeriod: string,
  pSize = 500
): Promise<RoneDataRow[]> {
  const apiKey = getRoneApiKey();
  if (!apiKey) return [];

  const url = new URL("https://www.reb.or.kr/r-one/openapi/SttsApiTblData.do");
  url.searchParams.set("KEY", apiKey);
  url.searchParams.set("Type", "json");
  url.searchParams.set("STATBL_ID", statblId);
  url.searchParams.set("DTACYCLE_CD", "MM");
  url.searchParams.set("START_WRTTIME", startPeriod);
  url.searchParams.set("END_WRTTIME", endPeriod);
  url.searchParams.set("pIndex", "1");
  url.searchParams.set("pSize", String(pSize));

  try {
    const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.warn(`[R-ONE API] HTTP ${res.status}: ${res.statusText}`);
      return [];
    }
    const json = (await res.json()) as {
      SttsApiTblData?: [
        { head?: { list_total_count?: number; RESULT?: { CODE?: string; MESSAGE?: string } }[] },
        { row?: RoneDataRow[] }
      ];
    };
    return json?.SttsApiTblData?.[1]?.row || [];
  } catch (err) {
    console.error("[R-ONE API] 통계 데이터 호출 실패:", err);
    return [];
  }
}

/**
 * 한국부동산원 아파트 매매/전세가격지수 조회
 * - 매매가격지수: A_2024_00045
 * - 전세가격지수: A_2024_00050
 */
export async function fetchRoneAptPriceIndex(
  regionName = "전국",
  monthsBack = 12
): Promise<AptPriceIndex[]> {
  const apiKey = getRoneApiKey();
  if (!apiKey) {
    console.warn("[R-ONE API] RONE_API_KEY 미설정 — 가격지수 조회 불가");
    return [];
  }

  const cacheKey = `rone_price_${regionName}_${monthsBack}`;
  const cached = getCached<AptPriceIndex[]>(cacheKey);
  if (cached) return cached;

  const now = new Date();
  const periods: string[] = [];
  for (let i = 0; i < monthsBack; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    periods.push(`${yyyy}${mm}`);
  }
  const startPeriod = periods[periods.length - 1];
  const endPeriod = periods[0];

  const [saleRows, jeonseRows] = await Promise.all([
    fetchRoneTableData("A_2024_00045", startPeriod, endPeriod, 1000),
    fetchRoneTableData("A_2024_00050", startPeriod, endPeriod, 1000),
  ]);

  const cleanRegion = regionName.trim();
  const matchRow = (r: RoneDataRow) => {
    if (!r.CLS_NM) return false;
    if (cleanRegion === "전국" || !cleanRegion) {
      return r.CLS_NM === "전국";
    }
    return (
      r.CLS_NM.includes(cleanRegion) ||
      cleanRegion.includes(r.CLS_NM) ||
      (r.CLS_FULLNM && r.CLS_FULLNM.includes(cleanRegion))
    );
  };

  const filteredSales = saleRows.filter(matchRow);
  const filteredJeonses = jeonseRows.filter(matchRow);

  const resultMap = new Map<string, Partial<AptPriceIndex>>();

  for (const r of filteredSales) {
    const p = r.WRTTIME_IDTFR_ID || "";
    if (!p) continue;
    const periodKey = `${p.slice(0, 4)}-${p.slice(4, 6)}`;
    if (!resultMap.has(periodKey)) {
      resultMap.set(periodKey, {
        period: periodKey,
        regionName: r.CLS_NM || regionName,
        regionFullName: r.CLS_FULLNM || "",
        saleIndex: null,
        jeonseIndex: null,
        saleChangeRate: null,
        jeonseChangeRate: null,
      });
    }
    const item = resultMap.get(periodKey)!;
    const val = typeof r.DTA_VAL === "number" ? r.DTA_VAL : parseFloat(String(r.DTA_VAL || "")) || null;
    if (r.ITM_NM === "지수") {
      item.saleIndex = val;
    } else if (r.ITM_NM?.includes("변동")) {
      item.saleChangeRate = val;
    }
  }

  for (const r of filteredJeonses) {
    const p = r.WRTTIME_IDTFR_ID || "";
    if (!p) continue;
    const periodKey = `${p.slice(0, 4)}-${p.slice(4, 6)}`;
    if (!resultMap.has(periodKey)) {
      resultMap.set(periodKey, {
        period: periodKey,
        regionName: r.CLS_NM || regionName,
        regionFullName: r.CLS_FULLNM || "",
        saleIndex: null,
        jeonseIndex: null,
        saleChangeRate: null,
        jeonseChangeRate: null,
      });
    }
    const item = resultMap.get(periodKey)!;
    const val = typeof r.DTA_VAL === "number" ? r.DTA_VAL : parseFloat(String(r.DTA_VAL || "")) || null;
    if (r.ITM_NM === "지수") {
      item.jeonseIndex = val;
    } else if (r.ITM_NM?.includes("변동")) {
      item.jeonseChangeRate = val;
    }
  }

  const results: AptPriceIndex[] = Array.from(resultMap.values())
    .filter((e): e is AptPriceIndex => !!e.period)
    .sort((a, b) => b.period.localeCompare(a.period));

  setCache(cacheKey, results);
  return results;
}

/**
 * 지역별 시장 통계 종합 요약
 */
export async function getMarketStatSummary(
  regionName = "전국"
): Promise<MarketStatSummary | null> {
  const prices = await fetchRoneAptPriceIndex(regionName, 12);
  if (prices.length === 0) return null;

  const latest = prices[0];
  const prev = prices[1] || null;

  let priceTrend: "상승" | "보합" | "하락" | "데이터미제공" = "데이터미제공";
  if (latest.saleChangeRate != null) {
    if (latest.saleChangeRate > 0.05) priceTrend = "상승";
    else if (latest.saleChangeRate < -0.05) priceTrend = "하락";
    else priceTrend = "보합";
  } else if (latest.saleIndex != null && prev?.saleIndex != null) {
    const diff = latest.saleIndex - prev.saleIndex;
    if (diff > 0.1) priceTrend = "상승";
    else if (diff < -0.1) priceTrend = "하락";
    else priceTrend = "보합";
  }

  const sorted = [...prices].sort((a, b) => a.period.localeCompare(b.period));

  return {
    regionName: latest.regionName || regionName,
    latestPeriod: latest.period,
    currentSaleIndex: latest.saleIndex,
    currentJeonseIndex: latest.jeonseIndex,
    saleChangeRateMoM: latest.saleChangeRate,
    jeonseChangeRateMoM: latest.jeonseChangeRate,
    priceTrend,
    history: {
      periods: sorted.map((p) => p.period),
      saleIndices: sorted.map((p) => p.saleIndex),
      jeonseIndices: sorted.map((p) => p.jeonseIndex),
    },
  };
}

export function isRoneApiActive(): boolean {
  return !!getRoneApiKey();
}
