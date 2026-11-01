import { NextRequest, NextResponse } from "next/server";
import { findLawdCode } from "@/lib/publicDataApi";
import { normalizeAptName } from "@/lib/normalizeAptName";

// ─── 서버 인메모리 캐시 (법정동 코드 단위로 전체 데이터 캐싱) ─────────────
interface TradeInfo {
  aptName: string;
  normName: string;
  umdNm?: string;
  amount: number;
  dealDate: string; // YYYY.MM.DD
  dealTime: number; // Unix timestamp
  floor: number;
  areaSqm: number;
  pyeong: number;       // 전용 평형 (excluUseAr / 3.3)
  supplyPyeong: number; // 대표 공급 평형 (25평, 34평 등)
}

interface RegionCache {
  trades: TradeInfo[];
  timestamp: number;
}

const viewportCache = new Map<string, RegionCache>();
const CACHE_TTL_MS = 1000 * 60 * 30; // 30분 TTL

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
 * 전용면적(㎡)을 아파트 단지 마스터의 대표 공급 평형으로 정밀 변환
 * 전용 59㎡ -> 25평, 84㎡ -> 34평 등 실제 한국 아파트 시장 규격
 */
function getSupplyPyeong(excluUseAr: number): number {
  if (excluUseAr < 45) return Math.max(10, Math.round(excluUseAr * 0.45)); // 소형 (10~15평)
  if (excluUseAr < 65) return 25; // 전용 59㎡ -> 24~25평형
  if (excluUseAr < 80) return 30; // 전용 74㎡ -> 30평형
  if (excluUseAr < 95) return 34; // 전용 84㎡ -> 34평형 (국민평형)
  if (excluUseAr < 125) return 40; // 전용 101~115㎡ -> 39~44평형
  return Math.round(excluUseAr * 0.36); // 전용 135㎡+ -> 50평형 이상
}

/**
 * [사용자 핵심 가격 규칙]
 * 1. 거래 목록을 최신순 정렬
 * 2. 가장 최근 거래의 날짜(dealDate) 기준 31일(최근 1개월) 이내 거래들을 추출
 * 3. 최근 1개월 내 거래가 2건 이상이면 -> 최근 1개월 실거래 평균가격!
 * 4. 최근 1개월 내 거래가 1건이거나, 수개월/1년 전이 마지막 거래라면 -> 마지막 실거래가 그대로!
 * ※ 중간값(min/max 평균)은 절대 사용하지 않음
 */
function computeAccurateTradePrice(trades: TradeInfo[]) {
  if (!trades.length) return null;

  // 최신 거래일 순 정렬
  trades.sort((a, b) => b.dealTime - a.dealTime);

  const latest = trades[0];
  const ONE_MONTH_MS = 31 * 24 * 60 * 60 * 1000;

  // 최신 거래일로부터 1개월(31일) 이내 거래 필터
  const recent1MonthTrades = trades.filter(
    (t) => latest.dealTime - t.dealTime <= ONE_MONTH_MS
  );

  let finalPrice: number;
  let isAverageOf1Month = false;

  if (recent1MonthTrades.length >= 2) {
    // 최근 1개월 내 복수 거래 -> 산술 평균
    finalPrice = Math.round(
      recent1MonthTrades.reduce((sum, t) => sum + t.amount, 0) / recent1MonthTrades.length
    );
    isAverageOf1Month = true;
  } else {
    // 1건이거나 과거 마지막 거래 -> 마지막 실거래가 그대로
    finalPrice = latest.amount;
    isAverageOf1Month = false;
  }

  return {
    price: finalPrice,
    latestPrice: latest.amount,
    formatted: formatPrice(finalPrice),
    dealDate: latest.dealDate,
    floor: latest.floor,
    areaSqm: Math.round(latest.areaSqm * 10) / 10,
    pyeong: latest.supplyPyeong, // 아파트 마스터와 일치하는 공급 평형
    rawPyeong: latest.pyeong,    // 전용 평형
    isAverageOf1Month,
    recentCount: recent1MonthTrades.length,
    totalTradeCount: trades.length,
  };
}

/**
 * POST /api/transactions/viewport
 * Body: {
 *   lawdCodes?: string[],
 *   regions?: Array<{ region: string; district: string }>,
 *   pyeong?: number, // 0: 전체, 20: 20평대, 30: 30평대, 40: 40평대
 *   months?: number  // 기본 12개월(1년) 실거래 조회
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    let lawdCodes: string[] = body.lawdCodes || [];
    const pyeongFilter: number = body.pyeong ?? 0;
    // 1년 전 마지막 거래까지 커버하기 위해 기본 12개월(1년) 수집
    const months: number = Math.min(12, Math.max(3, body.months || 12));

    // regions 배열이 주어진 경우 서버에서 법정동 코드로 자동 변환
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
            const supplyPyeong = getSupplyPyeong(excluUseAr);
            const dealDate = `${year}.${month}.${day}`;
            const dealTime = new Date(`${year}-${month}-${day}`).getTime();

            const umdNm = getVal(item, "umdNm");

            localTrades.push({
              aptName: aptNm,
              normName,
              umdNm,
              amount,
              dealDate,
              dealTime,
              floor,
              areaSqm: excluUseAr,
              pyeong,
              supplyPyeong,
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

    // 최대 8개 법정동 코드까지 병렬 수집
    const limitedCodes = lawdCodes.slice(0, 8);
    await Promise.all(limitedCodes.map(fetchRegion));

    // 최신 거래일 순 정렬
    regionTrades.sort((a, b) => b.dealTime - a.dealTime);

    // ─── 평형별 & 단지별 엄격 분류 ─────────────────────────────────────
    // 단지명별 전체 거래 그룹
    const tradesByApt = new Map<string, TradeInfo[]>();
    // 단지명 + 공급평형별 세부 거래 그룹 (예: '다산유보라__34')
    const tradesByAptPyeong = new Map<string, TradeInfo[]>();

    for (const t of regionTrades) {
      // 평형 필터 적용
      if (pyeongFilter === 20) {
        if (t.supplyPyeong < 20 || t.supplyPyeong >= 30) continue;
      } else if (pyeongFilter === 30) {
        if (t.supplyPyeong < 30 || t.supplyPyeong >= 40) continue;
      } else if (pyeongFilter === 40) {
        if (t.supplyPyeong < 40) continue;
      }

      // 1. 단지명 기준 그룹화
      const aptArr = tradesByApt.get(t.normName) || [];
      aptArr.push(t);
      tradesByApt.set(t.normName, aptArr);

      // 2. 단지명 + 평형 기준 세부 그룹화
      const pyeongKey = `${t.normName}__${t.supplyPyeong}`;
      const pyeongArr = tradesByAptPyeong.get(pyeongKey) || [];
      pyeongArr.push(t);
      tradesByAptPyeong.set(pyeongKey, pyeongArr);
    }

    const priceMap: Record<string, number> = {};
    const detailsMap: Record<
      string,
      {
        avgPrice?: number;
        latestPrice: number;
        formatted: string;
        dealDate: string;
        floor: number;
        areaSqm: number;
        pyeong: number;
        tradeCount: number;
        isAverage?: boolean;
      }
    > = {};

    // 1. 단지명 + 공급평형별 정확한 실거래가 계산 (평형별 분리)
    tradesByAptPyeong.forEach((trades, pKey) => {
      const calc = computeAccurateTradePrice(trades);
      if (!calc) return;
      priceMap[pKey] = calc.price;
      detailsMap[pKey] = {
        avgPrice: calc.price,
        latestPrice: calc.latestPrice,
        formatted: calc.formatted,
        dealDate: calc.dealDate,
        floor: calc.floor,
        areaSqm: calc.areaSqm,
        pyeong: calc.pyeong,
        tradeCount: calc.totalTradeCount,
        isAverage: calc.isAverageOf1Month,
      };
    });

    // 2. 단지명 대표 실거래가 계산
    // [사용자 핵심 규칙]: "가격은 34평 기준으로 나오면 좋겠고, 34평이 없다면 가장 비싼 금액의 평수와 가격이 나오면 돼."
    tradesByApt.forEach((trades, normName) => {
      if (!trades.length) return;

      // 평형별로 거래 그룹화
      const pyeongMap = new Map<number, TradeInfo[]>();
      for (const t of trades) {
        const arr = pyeongMap.get(t.supplyPyeong) || [];
        arr.push(t);
        pyeongMap.set(t.supplyPyeong, arr);
      }

      let selectedCalc: ReturnType<typeof computeAccurateTradePrice> = null;

      // 1순위: 34평(전용 84㎡ 내외, 32~35평대) 거래가 있는지 확인
      const pyeong34Trades =
        pyeongMap.get(34) ||
        trades.filter((t) => t.supplyPyeong >= 32 && t.supplyPyeong <= 35);

      if (pyeong34Trades && pyeong34Trades.length > 0) {
        selectedCalc = computeAccurateTradePrice(pyeong34Trades);
        if (selectedCalc) {
          selectedCalc.pyeong = 34; // 34평으로 표준화 표기
        }
      } else {
        // 2순위: 34평이 없다면 -> 모든 평형 중 '가장 비싼 금액의 평수와 그 가격' 선정!
        let maxPrice = -1;
        pyeongMap.forEach((pTrades) => {
          const calc = computeAccurateTradePrice(pTrades);
          if (calc && calc.price > maxPrice) {
            maxPrice = calc.price;
            selectedCalc = calc;
          }
        });
      }

      if (!selectedCalc) return;

      // 기본 키 등록
      priceMap[normName] = selectedCalc.price;
      detailsMap[normName] = {
        avgPrice: selectedCalc.price,
        latestPrice: selectedCalc.latestPrice,
        formatted: selectedCalc.formatted,
        dealDate: selectedCalc.dealDate,
        floor: selectedCalc.floor,
        areaSqm: selectedCalc.areaSqm,
        pyeong: selectedCalc.pyeong,
        tradeCount: selectedCalc.totalTradeCount,
        isAverage: selectedCalc.isAverageOf1Month,
      };

      // 동/지역 접두사 대응 (예: '금호어울림' -> '수택금호어울림' 등으로 매칭되도록 별칭 키 등록)
      const firstTrade = trades[0];
      if (firstTrade && (firstTrade as any).umdNm) {
        const cleanUmd = (firstTrade as any).umdNm.replace(/(동|읍|면|리)$/, "");
        if (cleanUmd && cleanUmd.length >= 2) {
          const aliasWithUmd = normalizeAptName(`${cleanUmd}${firstTrade.aptName}`);
          if (!priceMap[aliasWithUmd]) {
            priceMap[aliasWithUmd] = selectedCalc.price;
            detailsMap[aliasWithUmd] = detailsMap[normName];
          }
        }
      }
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
