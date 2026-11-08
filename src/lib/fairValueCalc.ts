/**
 * AI 적정 가치 평가 계산 유틸
 *
 * 원칙:
 * - 가상/임의 데이터 절대 금지
 * - price_min/price_max/rent_min/rent_max 중 실 데이터 없으면 null 반환
 * - 단위: 만원 (price_min=66000 → 6억 6천만원)
 */

export interface FairValueInput {
  price_min?: number | null;
  price_max?: number | null;
  rent_min?: number | null;
  rent_max?: number | null;
  jeonseRatio?: number | null; // 전세가율 % (예: 65 = 65%)
  area_pyeong?: number | null; // 평형 (평 단위)
  area_sqm?: number | null;    // 전용면적 m²
  name?: string;
  region?: string;
}

export interface FairValueBand {
  /** 급매가 (내재가치 × 0.85) — 단위: 만원 */
  bargainPrice: number;
  /** 적정가 = 내재가치 — 단위: 만원 */
  fairPrice: number;
  /** 고평가 기준 (내재가치 × 1.15) — 단위: 만원 */
  overvaluedThreshold: number;
}

export type FairValueVerdict = "고평가" | "적정" | "저평가" | "데이터부족";

export interface FairValueResult {
  /** 계산 가능 여부 */
  hasData: boolean;
  /** 판정 */
  verdict: FairValueVerdict;
  /** 판정 비율 (현재가 / 내재가치) — 100 = 적정, 115+ = 고평가, 85- = 저평가 */
  verdictRatio: number | null;
  /** 현재 매매가 평균 (만원) */
  currentPrice: number | null;
  /** 전세가 평균 (만원) */
  avgRent: number | null;
  /** 사용된 전세가율 % */
  usedJeonseRatio: number | null;
  /** 전세가 기반 내재가치 (만원) */
  intrinsicValue: number | null;
  /** 3단 가격 밴드 */
  band: FairValueBand | null;
  /** 평당 단가 (만원/평) — 현재 매매가 기준 */
  pyeongUnitPrice: number | null;
  /** 계산 근거 단계별 설명 */
  calcSteps: Array<{ label: string; value: string; formula?: string }>;
  /** 주의사항 */
  caveats: string[];
}

/**
 * 전세가 기반 내재가치 역산 → 적정 매수가 밴드 계산
 */
export function calcFairValue(apt: FairValueInput): FairValueResult {
  const noData: FairValueResult = {
    hasData: false,
    verdict: "데이터부족",
    verdictRatio: null,
    currentPrice: null,
    avgRent: null,
    usedJeonseRatio: null,
    intrinsicValue: null,
    band: null,
    pyeongUnitPrice: null,
    calcSteps: [],
    caveats: ["실거래 데이터가 없어 적정가 산출이 불가합니다."],
  };

  // ── 1. 매매가 ─────────────────────────────────────────────────
  const pMin = apt.price_min;
  const pMax = apt.price_max;
  if (!pMin && !pMax) return noData;

  const currentPrice =
    pMin && pMax
      ? Math.round((pMin + pMax) / 2)
      : (pMin || pMax)!;

  // ── 2. 전세가 ─────────────────────────────────────────────────
  const rMin = apt.rent_min;
  const rMax = apt.rent_max;
  const avgRent =
    rMin && rMax
      ? Math.round((rMin + rMax) / 2)
      : rMin || rMax || null;

  // ── 3. 전세가율 ───────────────────────────────────────────────
  // 직접 보유 시 사용, 없으면 임대료로 역산, 그것도 없으면 null → 계산 불가
  let usedJeonseRatio: number | null = null;
  let intrinsicValue: number | null = null;

  if (apt.jeonseRatio && apt.jeonseRatio > 0) {
    usedJeonseRatio = apt.jeonseRatio;
  } else if (avgRent && currentPrice) {
    // 전세가율 역산: 전세 ÷ 매매 × 100
    usedJeonseRatio = Math.round((avgRent / currentPrice) * 100);
  }

  // 전세가 기반 내재가치 역산: 내재가치 = 전세가 ÷ (전세가율% / 100)
  if (avgRent && usedJeonseRatio && usedJeonseRatio > 0) {
    intrinsicValue = Math.round(avgRent / (usedJeonseRatio / 100));
  } else if (currentPrice) {
    // 전세 데이터 없으면 내재가치 산출 불가 → 현재가만 표기
    intrinsicValue = null;
  }

  // ── 4. 평당 단가 ──────────────────────────────────────────────
  const pyeong = apt.area_pyeong || (apt.area_sqm ? apt.area_sqm / 3.305785 : null);
  const pyeongUnitPrice =
    pyeong && currentPrice ? Math.round(currentPrice / pyeong) : null;

  // ── 5. 판정 밴드 & 베르딕트 ───────────────────────────────────
  let band: FairValueBand | null = null;
  let verdict: FairValueVerdict = "데이터부족";
  let verdictRatio: number | null = null;

  if (intrinsicValue && intrinsicValue > 0) {
    band = {
      bargainPrice: Math.round(intrinsicValue * 0.85),
      fairPrice: intrinsicValue,
      overvaluedThreshold: Math.round(intrinsicValue * 1.15),
    };
    verdictRatio = Math.round((currentPrice / intrinsicValue) * 100);

    if (verdictRatio <= 85) verdict = "저평가";
    else if (verdictRatio >= 115) verdict = "고평가";
    else verdict = "적정";
  } else {
    // 전세 데이터 없이 매매가만 있는 경우: 판정 불가
    verdict = "데이터부족";
  }

  // ── 6. 계산 단계 설명 (투명 공개) ────────────────────────────
  const calcSteps: Array<{ label: string; value: string; formula?: string }> = [];

  if (pMin && pMax) {
    calcSteps.push({
      label: "매매가 범위",
      value: `${fmtWon(pMin)} ~ ${fmtWon(pMax)}`,
    });
  }
  calcSteps.push({
    label: "현재 매매가 평균",
    value: fmtWon(currentPrice),
    formula: pMin && pMax ? `(${fmtWon(pMin)} + ${fmtWon(pMax)}) ÷ 2` : undefined,
  });

  if (avgRent) {
    calcSteps.push({
      label: "전세가 평균",
      value: fmtWon(avgRent),
      formula:
        rMin && rMax
          ? `(${fmtWon(rMin)} + ${fmtWon(rMax)}) ÷ 2`
          : undefined,
    });
  }

  if (usedJeonseRatio) {
    calcSteps.push({
      label: "전세가율",
      value: `${usedJeonseRatio}%`,
      formula: !apt.jeonseRatio && avgRent && currentPrice
        ? `${fmtWon(avgRent)} ÷ ${fmtWon(currentPrice)} × 100`
        : "국토부 실거래 집계 기준",
    });
  }

  if (intrinsicValue) {
    calcSteps.push({
      label: "전세가 기반 내재가치",
      value: fmtWon(intrinsicValue),
      formula: `${fmtWon(avgRent!)} ÷ ${usedJeonseRatio}% = ${fmtWon(intrinsicValue)}`,
    });
  }

  if (band) {
    calcSteps.push({
      label: "적정 매수가 밴드",
      value: `${fmtWon(band.bargainPrice)} ~ ${fmtWon(band.overvaluedThreshold)}`,
      formula: "내재가치 × 0.85 (급매) ~ × 1.15 (고평가 기준)",
    });
  }

  if (pyeongUnitPrice && pyeong) {
    calcSteps.push({
      label: "현재 평당 단가",
      value: `${pyeongUnitPrice.toLocaleString()}만원/평`,
      formula: `${fmtWon(currentPrice)} ÷ ${pyeong.toFixed(1)}평`,
    });
  }

  // ── 7. 주의사항 ───────────────────────────────────────────────
  const caveats: string[] = [
    "본 분석은 국토교통부 실거래가 공개시스템 데이터 기반으로 자동 산출되며 투자 조언이 아닙니다.",
    "전세가 기반 내재가치는 금리·정책 변화에 민감하므로 참고용으로만 활용하세요.",
  ];
  if (!avgRent) {
    caveats.push("전세 거래 데이터가 없어 내재가치 역산이 제한됩니다.");
  }

  return {
    hasData: true,
    verdict,
    verdictRatio,
    currentPrice,
    avgRent,
    usedJeonseRatio,
    intrinsicValue,
    band,
    pyeongUnitPrice,
    calcSteps,
    caveats,
  };
}

/** 만원 → 억/만원 단위 표기 */
export function fmtWon(manwon: number): string {
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const rem = manwon % 10000;
    return rem > 0 ? `${eok}억 ${rem.toLocaleString()}만원` : `${eok}억원`;
  }
  return `${manwon.toLocaleString()}만원`;
}

