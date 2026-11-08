/**
 * 세금 및 종합부동산세 AI 시뮬레이션 계산 엔진
 *
 * 세법 파라미터는 src/lib/taxPolicy.ts의 CURRENT_TAX_POLICY를 참조하여
 * 매년 세법 개정 시 정책 파일만 수정하면 전 시스템에 일괄 반영됩니다.
 *
 * 모든 금액 단위: 만원 (10000 = 1억원)
 */

import { CURRENT_TAX_POLICY, TaxPolicyConfig } from "./taxPolicy";

export interface TaxSimulationInput {
  /** 매매 실거래가 (만원) */
  priceManwon: number;
  /** 전용면적 (m²) - 85m² 초과 시 농어촌특별세 추가 */
  areaSqm?: number;
  /** 보유 주택 수 (취득 시점 기준: 1주택, 2주택, 3주택 이상) */
  houseCount?: 1 | 2 | 3;
  /** 조정대상지역 여부 (기본 false) */
  isAdjustedArea?: boolean;
  /** 보유 기간 (년 단위, 양도세 계산용, 기본 3년) */
  holdingYears?: number;
  /** 예상 양도 차익 (만원) */
  expectedCapitalGain?: number;
  /** 세법 정책 (기본값: CURRENT_TAX_POLICY) */
  policy?: TaxPolicyConfig;
}

export interface TaxSimulationResult {
  hasData: boolean;
  /** 적용 세법 정보 */
  policyInfo: {
    effectiveYear: string;
    lastUpdated: string;
  };
  /** 공시가격 추정치 (현실화율 적용) - 만원 */
  estimatedOfficialPrice: number;
  
  /** 1. 취득세 상세 */
  acquisitionTax: {
    total: number;
    baseTax: number;
    localEducationTax: number;
    ruralSpecialTax: number;
    effectiveRate: number; // 실효세율 %
    details: string;
  };

  /** 2. 연간 보유세 상세 (재산세 + 종부세) */
  holdingTax: {
    annualTotal: number;
    propertyTax: number;
    comprehensiveTax: number;
    isCompTaxTarget: boolean;
    details: string;
  };

  /** 3. 양도소득세 시뮬레이션 */
  capitalGainsTax: {
    taxAmount: number;
    gainAmount: number;
    holdingYears: number;
    specialDeductionRate: number;
    taxableIncome: number;
    effectiveRate: number;
    details: string;
  };

  /** 절세 및 전략 AI 코멘트 */
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
        baseRate = ((priceEok * (2 / 3) - 3) / 100);
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

/** 재산세 및 종부세 계산 */
function calcHoldingTax(
  officialPrice: number,
  houseCount: 1 | 2 | 3,
  policy: TaxPolicyConfig
) {
  const ratio =
    houseCount === 1
      ? policy.propertyTaxMarketRatioSingle
      : policy.propertyTaxMarketRatioMulti;
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

  const compDeduction =
    houseCount === 1
      ? policy.compTaxDeductions.singleOwner
      : policy.compTaxDeductions.multiOwner;
  const isCompTaxTarget = officialPrice > compDeduction;
  let compTax = 0;

  if (isCompTaxTarget) {
    const compBase = (officialPrice - compDeduction) * policy.compTaxMarketRatio;
    if (compBase <= 30000) compTax = compBase * 0.005;
    else if (compBase <= 60000) compTax = 150 + (compBase - 30000) * 0.007;
    else compTax = 360 + (compBase - 60000) * 0.01;
    compTax = Math.round(compTax * 1.2);
  }

  const annualTotal = totalPropTax + compTax;
  const deductionEok = compDeduction / 10000;
  const details = isCompTaxTarget
    ? `공시가격 ${Math.round(officialPrice / 10000)}억원으로 종부세 부과 대상 (기본공제 ${deductionEok}억원 초과)`
    : `공시가격 ${Math.round(officialPrice / 10000)}억원으로 종부세 비과세 (기본공제 ${deductionEok}억원 이하)`;

  return { annualTotal, propertyTax: totalPropTax, comprehensiveTax: compTax, isCompTaxTarget, details };
}

/** 양도소득세 시뮬레이션 */
function calcCapitalGainsTax(
  price: number,
  gain: number,
  holdingYears: number,
  houseCount: 1 | 2 | 3,
  policy: TaxPolicyConfig
) {
  const cg = policy.capitalGains;

  // 1주택 비과세 체크
  if (houseCount === 1 && price <= cg.singleExemptionLimit && holdingYears >= cg.holdingRequirementYears) {
    return {
      taxAmount: 0,
      gainAmount: gain,
      holdingYears,
      specialDeductionRate: 0,
      taxableIncome: 0,
      effectiveRate: 0,
      details: `1세대 1주택 비과세 요건 충족 (실거래가 ${cg.singleExemptionLimit / 10000}억원 이하 & ${cg.holdingRequirementYears}년 이상 보유)`,
    };
  }

  // 1주택 12억 초과분 과세 또는 다주택자 과세
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
  const taxableBase = Math.max(0, taxableGain - deductionAmount - cg.basicDeduction);

  let baseTax = 0;
  if (taxableBase <= 1400) baseTax = taxableBase * 0.06;
  else if (taxableBase <= 5000) baseTax = 84 + (taxableBase - 1400) * 0.15;
  else if (taxableBase <= 8800) baseTax = 624 + (taxableBase - 5000) * 0.24;
  else if (taxableBase <= 15000) baseTax = 1536 + (taxableBase - 8800) * 0.35;
  else if (taxableBase <= 30000) baseTax = 3706 + (taxableBase - 15000) * 0.38;
  else if (taxableBase <= 50000) baseTax = 9406 + (taxableBase - 30000) * 0.40;
  else baseTax = 17406 + (taxableBase - 50000) * 0.42;

  const taxAmount = Math.round(baseTax * 1.1);
  const effectiveRate = gain > 0 ? Math.round((taxAmount / gain) * 1000) / 10 : 0;

  return {
    taxAmount,
    gainAmount: gain,
    holdingYears,
    specialDeductionRate: Math.round(specialRate * 100),
    taxableIncome: taxableBase,
    effectiveRate,
    details: `${holdingYears}년 보유 장기보유특별공제 ${Math.round(specialRate * 100)}% 차감 후 누진세율 적용`,
  };
}

/** 메인 세금 시뮬레이션 함수 */
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

  const policyInfo = {
    effectiveYear: policy.effectiveYear,
    lastUpdated: policy.lastUpdated,
  };

  if (!priceManwon || priceManwon <= 0) {
    return {
      hasData: false,
      policyInfo,
      estimatedOfficialPrice: 0,
      acquisitionTax: { total: 0, baseTax: 0, localEducationTax: 0, ruralSpecialTax: 0, effectiveRate: 0, details: "데이터 없음" },
      holdingTax: { annualTotal: 0, propertyTax: 0, comprehensiveTax: 0, isCompTaxTarget: false, details: "데이터 없음" },
      capitalGainsTax: { taxAmount: 0, gainAmount: 0, holdingYears: 0, specialDeductionRate: 0, taxableIncome: 0, effectiveRate: 0, details: "데이터 없음" },
      aiStrategyComment: ["실거래가 정보가 없어 세금 산출이 불가합니다."],
    };
  }

  // 공시가격 현실화율 추정
  const estimatedOfficialPrice = Math.round(priceManwon * policy.officialPriceRealizationRate);
  const gain = expectedCapitalGain !== undefined ? expectedCapitalGain : Math.round(priceManwon * 0.15);

  const acquisitionTax = calcAcquisitionTax(priceManwon, areaSqm, houseCount, isAdjustedArea, policy);
  const holdingTax = calcHoldingTax(estimatedOfficialPrice, houseCount, policy);
  const capitalGainsTax = calcCapitalGainsTax(priceManwon, gain, holdingYears, houseCount, policy);

  // AI 절세 전략 코멘트 생성
  const aiStrategyComment: string[] = [];
  const singleExemptionEok = policy.capitalGains.singleExemptionLimit / 10000;
  const singleCompDeductionEok = policy.compTaxDeductions.singleOwner / 10000;
  const jointCompDeductionEok = policy.compTaxDeductions.jointOwner / 10000;

  if (houseCount === 1) {
    if (priceManwon <= policy.capitalGains.singleExemptionLimit) {
      aiStrategyComment.push(`1주택 ${singleExemptionEok}억원 이하로 2년 보유/거주 요건 충족 시 양도소득세가 전액 비과세됩니다.`);
    } else {
      aiStrategyComment.push(`${singleExemptionEok}억원 초과 고가주택으로, ${singleExemptionEok}억 초과분에 대해서만 양도세가 과세되며 장특공제 최대 80%를 적용받을 수 있습니다.`);
    }
    if (holdingTax.isCompTaxTarget) {
      aiStrategyComment.push(`공시가격이 ${singleCompDeductionEok}억원을 초과하여 종합부동산세 과세 대상입니다. 부부 공동명의 변경 시 공제한도가 ${jointCompDeductionEok}억원으로 확대되어 종부세 전액 면제가 가능합니다.`);
    } else {
      aiStrategyComment.push(`공시가격이 1주택 기본공제(${singleCompDeductionEok}억원) 이하로 종부세가 전혀 발생하지 않는 안전 구간입니다.`);
    }
  } else {
    aiStrategyComment.push("다주택자 취득 시 취득세 중과(8~12%) 및 종부세 기본공제 9억원 축소로 보유 부담이 가중될 수 있습니다.");
    aiStrategyComment.push("처분 순서를 비조정지역 또는 차익이 적은 주택부터 정리하여 최종 1주택 비과세 혜택을 노리는 전략이 권장됩니다.");
  }

  return {
    hasData: true,
    policyInfo,
    estimatedOfficialPrice,
    acquisitionTax,
    holdingTax,
    capitalGainsTax,
    aiStrategyComment,
  };
}
