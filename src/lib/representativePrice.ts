/**
 * [호갱노노·아실 동일 구현] 단지 대표 실거래가 단일 산출 모듈 (Single Source of Truth)
 * - 지도 마커, 단지 프리뷰 카드, 상세페이지 상단 메인 시세, 상세페이지 차트가 100% 동일한 금액을 표출하도록 보장
 * - 1층 저가 특수 거래 배제 (1층은 대표 시세에서 제외)
 * - 최근 1개월(31일) 내 2건 이상 거래 시 평균, 1건이면 해당 거래가 정직 반영
 * - 실거래가 미보유 시 마스터 DB의 확정 가격(avgPrice/price_max) 정직 반영
 */

export interface RepresentativePriceResult {
  priceNum: number;         // 만원 단위 정수 (예: 103550, 104000)
  priceUk: number;          // 억 단위 소수점 1자리 (예: 10.4)
  markerStr: string;        // 마커 핀용 (예: "10.4억" 또는 "가격없음")
  detailStr: string;        // 상세 상단용 (예: "10억 4,000만")
  isReal: boolean;          // 국토부 실제 체결 기준 여부
  latestTx: any | null;     // 최근 거래 건
  recent1MonthCount: number;// 최근 1개월 체결 건수
  periodMin: number;        // 기간 최저가 (만원)
  periodMax: number;        // 기간 최고가 (만원)
}

export function formatPriceToKorean(manwon: number): string {
  if (!manwon || manwon <= 0) return "가격없음";
  const uk = Math.floor(manwon / 10000);
  const cheon = manwon % 10000;
  if (uk > 0 && cheon > 0) return `${uk}억 ${cheon.toLocaleString()}만`;
  if (uk > 0) return `${uk}억원`;
  return `${manwon.toLocaleString()}만원`;
}

export function formatPriceToUk(manwon: number): string {
  if (!manwon || manwon <= 0) return "가격없음";
  const ukVal = Number((manwon / 10000).toFixed(1));
  return `${ukVal}억`;
}

export function calculateRepresentativePrice(apt: any, trades: any[] = []): RepresentativePriceResult {
  const isRentalOnly = apt?.isRentalOnly === true || (apt as any)?.rentalType === "youth_public";
  if (isRentalOnly) {
    return {
      priceNum: 0,
      priceUk: 0,
      markerStr: "임대전용",
      detailStr: "임대전용 (매매불가)",
      isReal: false,
      latestTx: null,
      recent1MonthCount: 0,
      periodMin: 0,
      periodMax: 0,
    };
  }

  // 1. 유효 거래 필터링: 1층 제외 & 0원 거래 제외
  const nonFirstFloor = trades.filter((t: any) => {
    const amount = t.dealAmount ?? t.rawPrice;
    if (!amount || amount <= 0) return false;
    const floorRaw = t.floorNum ?? t.floor;
    const floorNum = typeof floorRaw === "number" ? floorRaw : parseInt(String(floorRaw).replace("층", "").trim(), 10);
    if (!isNaN(floorNum) && floorNum <= 1) return false; // 1층은 대표 시세 제외
    return true;
  });

  // 1층을 제외한 거래가 있으면 사용하고, 단지 전체가 1층뿐이라면 1층 거래 허용
  const targetTrades = nonFirstFloor.length > 0
    ? nonFirstFloor
    : trades.filter((t: any) => (t.dealAmount ?? t.rawPrice) > 0);

  if (targetTrades.length > 0) {
    // 최신 계약일자 순 정렬 (dealYear/Month/Day 또는 date 문자열 기준)
    const sorted = [...targetTrades].sort((a: any, b: any) => {
      const yearA = a.dealYear ?? parseInt((a.date || "").split(".")[0], 10);
      const monthA = a.dealMonth ?? parseInt((a.date || "").split(".")[1], 10);
      const dayA = a.dealDay ?? parseInt((a.date || "").split(".")[2], 10);
      const yearB = b.dealYear ?? parseInt((b.date || "").split(".")[0], 10);
      const monthB = b.dealMonth ?? parseInt((b.date || "").split(".")[1], 10);
      const dayB = b.dealDay ?? parseInt((b.date || "").split(".")[2], 10);
      return (yearB - yearA) || (monthB - monthA) || (dayB - dayA);
    });

    const latestTx = sorted[0];
    const latestRawPrice = latestTx.dealAmount ?? latestTx.rawPrice;

    // 최근 1개월(31일) 내 실거래 집계
    let latestTime = 0;
    if (latestTx.dealYear && latestTx.dealMonth) {
      latestTime = new Date(latestTx.dealYear, latestTx.dealMonth - 1, latestTx.dealDay || 1).getTime();
    } else if (latestTx.date) {
      const parts = latestTx.date.split(".");
      const y = parts[0]?.length === 2 ? 2000 + parseInt(parts[0], 10) : parseInt(parts[0], 10);
      const m = parseInt(parts[1] || "1", 10);
      const d = parseInt(parts[2] || "1", 10);
      latestTime = new Date(y, m - 1, d).getTime();
    }

    const ONE_MONTH_MS = 31 * 24 * 60 * 60 * 1000;
    const recent1MonthTxs = sorted.filter((t: any) => {
      let tTime = 0;
      if (t.dealYear && t.dealMonth) {
        tTime = new Date(t.dealYear, t.dealMonth - 1, t.dealDay || 1).getTime();
      } else if (t.date) {
        const parts = t.date.split(".");
        const y = parts[0]?.length === 2 ? 2000 + parseInt(parts[0], 10) : parseInt(parts[0], 10);
        const m = parseInt(parts[1] || "1", 10);
        const d = parseInt(parts[2] || "1", 10);
        tTime = new Date(y, m - 1, d).getTime();
      }
      return latestTime && tTime ? (latestTime - tTime <= ONE_MONTH_MS) : false;
    });

    let repPriceNum = latestRawPrice;
    if (recent1MonthTxs.length >= 2) {
      const rPrices = recent1MonthTxs.map((t: any) => (t.dealAmount ?? t.rawPrice));
      repPriceNum = Math.round(rPrices.reduce((a: number, b: number) => a + b, 0) / rPrices.length);
    }

    const allPrices = sorted.map((t: any) => (t.dealAmount ?? t.rawPrice));
    const periodMin = Math.min(...allPrices);
    const periodMax = Math.max(...allPrices);
    const priceUk = +(repPriceNum / 10000).toFixed(1);

    return {
      priceNum: repPriceNum,
      priceUk,
      markerStr: `${priceUk}억`,
      detailStr: formatPriceToKorean(repPriceNum),
      isReal: true,
      latestTx,
      recent1MonthCount: recent1MonthTxs.length,
      periodMin,
      periodMax,
    };
  }

  // 2. 실거래 내역이 아직 없거나 로딩 전인 경우: 마스터 DB 확정 시세 활용
  const basePrice = apt?.avgPrice || apt?.price_max || apt?.price_min || 0;
  const minPrice = apt?.price_min || basePrice;
  const maxPrice = apt?.price_max || basePrice;
  const priceUk = basePrice > 0 ? +(basePrice / 10000).toFixed(1) : 0;

  return {
    priceNum: basePrice,
    priceUk,
    markerStr: basePrice > 0 ? `${priceUk}억` : "가격없음",
    detailStr: formatPriceToKorean(basePrice),
    isReal: !!(apt?.isRealPrice || apt?.is_real_price),
    latestTx: null,
    recent1MonthCount: 0,
    periodMin: minPrice,
    periodMax: maxPrice,
  };
}
