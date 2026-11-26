/**
 * 07번: 취득세·보유세·양도세 다주택 세금 및 종부세 시뮬레이션 엔진 (Institutional-Grade PRO Report)
 *
 * 분석 축:
 * 1. 생애주기 3대 세금 산출: 취득세(1회) + 보유세(연간) + 양도소득세(처분 시)
 * 2. 부부 공동명의 vs 단독명의 1:1 절세 효과 시뮬레이션 (종부세 18억 공제 & 양도세 누진세율 분산)
 * 3. 주택 수별(1주택 vs 2주택 vs 3주택) 세부담 비교 매트릭스
 * 4. 보유 기간별(2년, 5년, 10년) 장기보유특별공제(최대 80%) 반영 양도세 시뮬레이션
 * 5. 실전 세무 솔루션 (상생임대인, 일시적 2주택, 명의 분산)
 */

import { CURRENT_TAX_POLICY, TaxPolicyConfig, checkTaxPolicyExpiration } from "./taxPolicy";

export interface TaxSimulationInput {
  priceManwon: number;
  areaSqm?: number;
  houseCount?: 1 | 2 | 3;
  isAdjustedArea?: boolean;
  holdingYears?: number;
  expectedCapitalGain?: number;
  policy?: TaxPolicyConfig;
}

export interface JointOwnershipComparison {
  singleHoldingTax: number; // 단독명의 보유세 (만원)
  jointHoldingTax: number; // 공동명의 보유세 (만원)
  holdingTaxSaving: number; // 보유세 절세액 (만원)
  singleCgTax: number; // 단독명의 양도세 (만원)
  jointCgTax: number; // 공동명의 양도세 (만원)
  cgTaxSaving: number; // 양도세 절세액 (만원)
  totalTaxSaving: number; // 총 절세 혜택 (만원)
  recommendation: "부부 공동명의 적극 추천" | "단독명의 유지 유리" | "절세 효과 대등";
}

export interface HouseCountComparisonItem {
  houseCountLabel: string;
  acquisitionTax: number; // 취득세 (만원)
  acquisitionRate: number; // 실효세율 (%)
  annualHoldingTax: number; // 연간 보유세 (만원)
  comprehensiveTax: number; // 종부세 (만원)
  capitalGainsTax: number; // 양도소득세 (만원)
  totalLifecycleTax: number; // 총 세금 부담 (만원)
}

export interface HoldingScheduleItem {
  years: number;
  specialDeductionRate: number; // 장특공제율 (%)
  taxableBase: number; // 과세표준 (만원)
  cgTaxAmount: number; // 양도소득세 (만원)
  effectiveRate: number; // 실효세율 (%)
}

export interface TaxSimulationResult {
  hasData: boolean;
  policyInfo: {
    effectiveYear: string;
    lastUpdated: string;
    isExpired?: boolean;
    expirationNotice?: string;
  };
  estimatedOfficialPrice: number; // 공시가격 (만원)
  acquisitionTax: {
    total: number;
    baseTax: number;
    localEducationTax: number;
    ruralSpecialTax: number;
    effectiveRate: number;
    details: string;
  };
  holdingTax: {
    annualTotal: number;
    propertyTax: number;
    comprehensiveTax: number;
    isCompTaxTarget: boolean;
    details: string;
  };
  capitalGainsTax: {
    taxAmount: number;
    gainAmount: number;
    holdingYears: number;
    specialDeductionRate: number;
    taxableIncome: number;
    effectiveRate: number;
    details: string;
  };
  jointComparison: JointOwnershipComparison;
  houseCountMatrix: HouseCountComparisonItem[];
  holdingSchedules: HoldingScheduleItem[];
  aiStrategyComment: string[];
}

/** 취득세 계산 */
function calcAcquisitionTax(
  price: number,
  areaSqm: number,
  houseCount: 1 | 2 | 3,
  isAdjusted: boolean,
  policy: TaxPolicyConfig
) {
  const isOver85 = areaSqm > 85;
  const acq = policy.acquisition;
  let baseRate = acq.singleRateLow;
  let eduRate = 0.001;
  let ruralRate = isOver85 ? 0.002 : 0;

  if (houseCount === 1) {
    if (price <= acq.singleThresholdLow) {
      baseRate = acq.singleRateLow;
      eduRate = 0.001;
    } else if (price <= acq.singleThresholdHigh) {
      const priceEok = price / 10000;
      baseRate = Math.round(((priceEok * (2 / 3) - 3) / 100) * 10000) / 10000;
      eduRate = Math.round((baseRate * 0.1) * 10000) / 10000;
    } else {
      baseRate = acq.singleRateHigh;
      eduRate = 0.003;
    }
  } else if (houseCount === 2) {
    if (isAdjusted) {
      baseRate = acq.multiAdjusted2Rate;
      eduRate = 0.004;
      ruralRate = isOver85 ? 0.006 : 0;
    } else {
      if (price <= acq.singleThresholdLow) baseRate = acq.singleRateLow;
      else if (price <= acq.singleThresholdHigh) {
        const priceEok = price / 10000;
        baseRate = Math.round(((priceEok * (2 / 3) - 3) / 100) * 10000) / 10000;
      } else baseRate = acq.singleRateHigh;
      eduRate = baseRate * 0.1;
    }
  } else {
    baseRate = isAdjusted ? acq.multiAdjusted3Rate : acq.multiNonAdjusted3Rate;
    eduRate = 0.004;
    ruralRate = isOver85 ? (isAdjusted ? 0.01 : 0.006) : 0;
  }

  const baseTax = Math.round(price * baseRate);
  const localEducationTax = Math.round(price * eduRate);
  const ruralSpecialTax = Math.round(price * ruralRate);
  const total = baseTax + localEducationTax + ruralSpecialTax;
  const effectiveRate = Math.round((total / price) * 1000) / 10;

  let details = `${houseCount}주택 기준 `;
  if (houseCount > 1 && isAdjusted) details += "조정지역 다주택 중과세율 적용";
  else details += `기본 취득세율 ${(baseRate * 100).toFixed(1)}% 적용`;

  return { total, baseTax, localEducationTax, ruralSpecialTax, effectiveRate, details };
}

/** 재산세 및 종부세 계산 (인별 공시가격 기준) */
function calcHoldingTaxSingle(
  officialPrice: number,
  houseCount: 1 | 2 | 3,
  isJoint: boolean,
  policy: TaxPolicyConfig
) {
  const ratio = houseCount === 1 ? policy.propertyTaxMarketRatioSingle : policy.propertyTaxMarketRatioMulti;
  const propBase = officialPrice * ratio;

  let propTax = 0;
  if (houseCount === 1) {
    if (propBase <= 6000) propTax = propBase * 0.0005;
    else if (propBase <= 15000) propTax = 3 + (propBase - 6000) * 0.001;
    else if (propBase <= 30000) propTax = 12 + (propBase - 15000) * 0.002;
    else propTax = 42 + (propBase - 30000) * 0.0035;
  } else {
    if (propBase <= 6000) propTax = propBase * 0.001;
    else if (propBase <= 15000) propTax = 6 + (propBase - 6000) * 0.0015;
    else if (propBase <= 30000) propTax = 19.5 + (propBase - 15000) * 0.0025;
    else propTax = 57 + (propBase - 30000) * 0.004;
  }
  const totalPropTax = Math.round(propTax * 1.5);

  // 종부세 공제액: 1세대 1주택 단독 12억, 공동명의 인별 9억씩(합산 18억)
  let compDeduction = policy.compTaxDeductions.singleOwner;
  if (isJoint) {
    // 5:5 공동명의 시 인별 지분 50%
    compDeduction = policy.compTaxDeductions.multiOwner; // 인별 9억원
  } else if (houseCount > 1) {
    compDeduction = policy.compTaxDeductions.multiOwner;
  }

  const effectiveOfficial = isJoint ? officialPrice * 0.5 : officialPrice;
  const isCompTaxTarget = effectiveOfficial > compDeduction;
  let compTax = 0;

  if (isCompTaxTarget) {
    const compBase = (effectiveOfficial - compDeduction) * policy.compTaxMarketRatio;
    if (compBase <= 30000) compTax = compBase * 0.005;
    else if (compBase <= 60000) compTax = 150 + (compBase - 30000) * 0.007;
    else compTax = 360 + (compBase - 60000) * 0.01;
    compTax = Math.round(compTax * 1.2);
    if (isJoint) compTax = compTax * 2; // 부부 2인 합산
  }

  const annualTotal = totalPropTax + compTax;
  const details = isCompTaxTarget
    ? `공시가격 ${Math.round(officialPrice / 10000)}억원 기준 종부세 부과 대상`
    : `공시가격 기준 종부세 전액 면제 (기본공제 이하)`;

  return { annualTotal, propertyTax: totalPropTax, comprehensiveTax: compTax, isCompTaxTarget, details };
}

/** 양도소득세 시뮬레이션 */
function calcCapitalGainsTaxCore(
  price: number,
  gain: number,
  holdingYears: number,
  houseCount: 1 | 2 | 3,
  isJoint: boolean,
  policy: TaxPolicyConfig
) {
  const cg = policy.capitalGains;

  // 1주택 비과세 체크 (실거래가 12억 이하 & 2년 이상 보유)
  if (houseCount === 1 && price <= cg.singleExemptionLimit && holdingYears >= cg.holdingRequirementYears) {
    return {
      taxAmount: 0,
      gainAmount: gain,
      holdingYears,
      specialDeductionRate: 0,
      taxableIncome: 0,
      effectiveRate: 0,
      details: `1세대 1주택 비과세 요건 충족 (실거래가 12억원 이하 & 2년 이상 보유)`,
    };
  }

  // 12억 초과분 과세 비율
  let taxableGain = gain;
  if (houseCount === 1 && price > cg.singleExemptionLimit) {
    taxableGain = Math.round(gain * ((price - cg.singleExemptionLimit) / price));
  }

  // 장기보유특별공제율
  let specialRate = 0;
  if (houseCount === 1) {
    specialRate = Math.min(holdingYears * cg.singleSpecialDeductionPerYear, cg.singleSpecialDeductionMax);
  } else {
    if (holdingYears >= 3) {
      specialRate = Math.min((holdingYears - 2) * 0.02 + 0.06, cg.multiSpecialDeductionMax);
    }
  }

  const deductionAmount = Math.round(taxableGain * specialRate);
  let taxableBase = Math.max(0, taxableGain - deductionAmount - cg.basicDeduction);

  // 공동명의 시 양도차익 50% 분할 과세 (2인 기본공제 250만×2 = 500만)
  if (isJoint) {
    taxableBase = Math.max(0, Math.round((taxableGain - deductionAmount) * 0.5) - cg.basicDeduction);
  }

  function getTaxFromBase(tb: number): number {
    if (tb <= 1400) return tb * 0.06;
    if (tb <= 5000) return 84 + (tb - 1400) * 0.15;
    if (tb <= 8800) return 624 + (tb - 5000) * 0.24;
    if (tb <= 15000) return 1536 + (tb - 8800) * 0.35;
    if (tb <= 30000) return 3706 + (tb - 15000) * 0.38;
    if (tb <= 50000) return 9406 + (tb - 30000) * 0.40;
    return 17406 + (tb - 50000) * 0.42;
  }

  let baseTax = getTaxFromBase(taxableBase);
  let totalCgTax = Math.round(baseTax * 1.1);

  if (isJoint) {
    totalCgTax = totalCgTax * 2; // 2인 합산
  }

  const effectiveRate = gain > 0 ? Math.round((totalCgTax / gain) * 1000) / 10 : 0;

  return {
    taxAmount: totalCgTax,
    gainAmount: gain,
    holdingYears,
    specialDeductionRate: Math.round(specialRate * 100),
    taxableIncome: taxableBase * (isJoint ? 2 : 1),
    effectiveRate,
    details: `${holdingYears}년 보유 장특공제 ${Math.round(specialRate * 100)}% 적용 후 산출`,
  };
}

export function simulateApartmentTaxes(input: TaxSimulationInput): TaxSimulationResult {
  const {
    priceManwon,
    areaSqm = 84,
    houseCount = 1,
    isAdjustedArea = false,
    holdingYears = 3,
    expectedCapitalGain,
    policy = CURRENT_TAX_POLICY,
  } = input;

  const expiration = checkTaxPolicyExpiration();
  const policyInfo = {
    effectiveYear: policy.effectiveYear,
    lastUpdated: policy.lastUpdated,
    isExpired: expiration.isExpired,
    expirationNotice: expiration.isExpired ? expiration.message : undefined,
  };

  const currentPrice = priceManwon > 0 ? priceManwon : 60000;
  const estimatedOfficialPrice = Math.round(currentPrice * policy.officialPriceRealizationRate);
  const gain = expectedCapitalGain !== undefined ? expectedCapitalGain : Math.round(currentPrice * 0.20);

  // 1. 기본 세금 산출 (단독명의 기준)
  const acquisitionTax = calcAcquisitionTax(currentPrice, areaSqm, houseCount, isAdjustedArea, policy);
  const holdingTax = calcHoldingTaxSingle(estimatedOfficialPrice, houseCount, false, policy);
  const capitalGainsTax = calcCapitalGainsTaxCore(currentPrice, gain, holdingYears, houseCount, false, policy);

  // 2. 부부 공동명의 절세 시뮬레이션
  const jointHolding = calcHoldingTaxSingle(estimatedOfficialPrice, houseCount, true, policy);
  const jointCg = calcCapitalGainsTaxCore(currentPrice, gain, holdingYears, houseCount, true, policy);

  const holdingTaxSaving = Math.max(0, holdingTax.annualTotal - jointHolding.annualTotal);
  const cgTaxSaving = Math.max(0, capitalGainsTax.taxAmount - jointCg.taxAmount);
  const totalTaxSaving = holdingTaxSaving + cgTaxSaving;

  let recommendation: JointOwnershipComparison["recommendation"] = "부부 공동명의 적극 추천";
  if (totalTaxSaving > 500) recommendation = "부부 공동명의 적극 추천";
  else if (totalTaxSaving > 50) recommendation = "부부 공동명의 적극 추천";
  else recommendation = "절세 효과 대등";

  const jointComparison: JointOwnershipComparison = {
    singleHoldingTax: holdingTax.annualTotal,
    jointHoldingTax: jointHolding.annualTotal,
    holdingTaxSaving,
    singleCgTax: capitalGainsTax.taxAmount,
    jointCgTax: jointCg.taxAmount,
    cgTaxSaving,
    totalTaxSaving,
    recommendation,
  };

  // 3. 주택 수별(1주택 vs 2주택 vs 3주택) 세부담 비교 매트릭스
  const houseCounts: (1 | 2 | 3)[] = [1, 2, 3];
  const houseCountMatrix: HouseCountComparisonItem[] = houseCounts.map((hc) => {
    const acq = calcAcquisitionTax(currentPrice, areaSqm, hc, isAdjustedArea, policy);
    const hold = calcHoldingTaxSingle(estimatedOfficialPrice, hc, false, policy);
    const cg = calcCapitalGainsTaxCore(currentPrice, gain, holdingYears, hc, false, policy);
    const totalLife = acq.total + hold.annualTotal * 3 + cg.taxAmount;

    return {
      houseCountLabel: hc === 1 ? "1주택 (실거주)" : hc === 2 ? "2주택 (일반 다주택)" : "3주택 이상 (중과)",
      acquisitionTax: acq.total,
      acquisitionRate: acq.effectiveRate,
      annualHoldingTax: hold.annualTotal,
      comprehensiveTax: hold.comprehensiveTax,
      capitalGainsTax: cg.taxAmount,
      totalLifecycleTax: totalLife,
    };
  });

  // 4. 보유 기간별(2년, 5년, 10년) 양도세 스케줄
  const scheduleYears = [2, 5, 10];
  const holdingSchedules: HoldingScheduleItem[] = scheduleYears.map((y) => {
    const res = calcCapitalGainsTaxCore(currentPrice, gain, y, houseCount, false, policy);
    return {
      years: y,
      specialDeductionRate: res.specialDeductionRate,
      taxableBase: res.taxableIncome,
      cgTaxAmount: res.taxAmount,
      effectiveRate: res.effectiveRate,
    };
  });

  // 5. 절세 코멘터리 생성
  const aiStrategyComment: string[] = [
    `공시가격 추정치 [${Math.round(estimatedOfficialPrice / 10000)}억 ${(estimatedOfficialPrice % 10000).toLocaleString()}만원] 기준 연간 보유세는 약 [${Math.round(holdingTax.annualTotal / 10000)}억 ${(holdingTax.annualTotal % 10000).toLocaleString()}만원]입니다.`,
    totalTaxSaving > 0
      ? `💡 [부부 공동명의] 등록 시 1인당 9억(합산 18억) 공제 및 양도세 분산 효과로 [연간 최대 ${totalTaxSaving.toLocaleString()}만원]의 합법적 절세가 가능합니다.`
      : `1주택 비과세 구간으로 단독명의와 공동명의의 세부담 차이가 거의 없습니다.`,
    `양도 시점 1세대 1주택 비과세(12억원 이하 전액 면제) 및 10년 보유·거주 시 [장기보유특별공제 최대 80%] 혜택을 반드시 챙기시기 바랍니다.`,
    `다주택자 취득 시 취득세율이 8~12%로 급증하므로, 법인 또는 비조정지역 활용 포트폴리오 관리가 요구됩니다.`,
  ];

  return {
    hasData: true,
    policyInfo,
    estimatedOfficialPrice,
    acquisitionTax,
    holdingTax,
    capitalGainsTax,
    jointComparison,
    houseCountMatrix,
    holdingSchedules,
    aiStrategyComment,
  };
}
