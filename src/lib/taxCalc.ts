/**
 * 세금 및 종합부동산세 AI 시뮬레이션 계산 엔진
 *
 * 세목:
 * 1. 취득세 (Acquisition Tax): 1주택(1~3%), 다주택 중과(8%, 12%), 지방교육세/농특세 포함
 * 2. 재산세 (Property Tax): 시가표준액(공시가격) × 공정시장가액비율(43~45%) × 4단계 누진세율
 * 3. 종합부동산세 (Comprehensive Real Estate Holding Tax): 공시가격 합산 - 기본공제(1주택 12억, 다주택 9억) × 공정시장가액비율(60%) × 종부세율
 * 4. 양도소득세 (Capital Gains Tax): 보유기간별 장기보유특별공제(최대 80%), 기본세율(6~45%)
 *
 * 모든 금액 단위: 만원 (10000 = 1억원)
 */

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
  /** 예상 양도 차익 (만원, 기본: 매매가의 20% 가정 또는 사용자 입력) */
  expectedCapitalGain?: number;
}

export interface TaxSimulationResult {
  hasData: boolean;
  /** 공시가격 추정치 (현실화율 약 69% 적용) - 만원 */
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
    propertyTax: number; // 재산세 (도시지역분/지방교육세 포함 추정)
    comprehensiveTax: number; // 종합부동산세 (1주택 12억 공제, 다주택 9억 공제)
    isCompTaxTarget: boolean; // 종부세 과세 대상 여부
    details: string;
  };

  /** 3. 양도소득세 시뮬레이션 */
  capitalGainsTax: {
    taxAmount: number;
    gainAmount: number;
    holdingYears: number;
    specialDeductionRate: number; // 장기보유특별공제율 %
    taxableIncome: number; // 과세표준
    effectiveRate: number; // 실효세율 %
    details: string;
  };

  /** 절세 및 전략 AI 코멘트 */
  aiStrategyComment: string[];
}

/** 취득세 계산 */
function calcAcquisitionTax(price: number, areaSqm: number, houseCount: 1 | 2 | 3, isAdjusted: boolean) {
  const isOver85 = areaSqm > 85;
  let baseRate = 0.01;
  let eduRate = 0.001;
  let ruralRate = isOver85 ? 0.002 : 0;

  if (houseCount === 1) {
    // 1주택: 6억 이하 1%, 6억~9억 (취득가액×2/3 - 3)%, 9억 초과 3%
    if (price <= 60000) {
      baseRate = 0.01;
      eduRate = 0.001;
    } else if (price <= 90000) {
      // (취득가액(억원) * 2/3 - 3) * 1/100
      const priceEok = price / 10000;
      baseRate = Math.round(((priceEok * (2 / 3) - 3) / 100) * 10000) / 10000;
      eduRate = Math.round((baseRate * 0.1) * 10000) / 10000;
    } else {
      baseRate = 0.03;
      eduRate = 0.003;
    }
  } else if (houseCount === 2) {
    if (isAdjusted) {
      baseRate = 0.08;
      eduRate = 0.004;
      ruralRate = isOver85 ? 0.006 : 0;
    } else {
      // 비조정 2주택은 일반세율(1~3%)
      if (price <= 60000) baseRate = 0.01;
      else if (price <= 90000) {
        const priceEok = price / 10000;
        baseRate = ((priceEok * (2 / 3) - 3) / 100);
      } else baseRate = 0.03;
      eduRate = baseRate * 0.1;
    }
  } else {
    // 3주택 이상: 조정 12%, 비조정 8%
    baseRate = isAdjusted ? 0.12 : 0.08;
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
function calcHoldingTax(officialPrice: number, houseCount: 1 | 2 | 3) {
  // 재산세 과세표준 = 공시가격 × 공정시장가액비율(1주택자 특례 43~45%, 다주택 60%)
  const ratio = houseCount === 1 ? 0.45 : 0.60;
  const propBase = officialPrice * ratio;

  // 1주택자 특례세율(0.05%~0.35%) vs 일반세율(0.1%~0.4%)
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
  // 도시지역분(0.14%) 및 지방교육세(재산세의 20%) 부가
  const totalPropTax = Math.round(propTax * 1.5);

  // 종부세: 1주택 기본공제 12억원(120000만원), 다주택 9억원(90000만원)
  const compDeduction = houseCount === 1 ? 120000 : 90000;
  const isCompTaxTarget = officialPrice > compDeduction;
  let compTax = 0;

  if (isCompTaxTarget) {
    // 과세표준 = (공시가격 - 기본공제) × 공정시장가액비율 60%
    const compBase = (officialPrice - compDeduction) * 0.6;
    // 종부세 기본 누진세율 (0.5% ~ 2.7%)
    if (compBase <= 30000) compTax = compBase * 0.005;
    else if (compBase <= 60000) compTax = 150 + (compBase - 30000) * 0.007;
    else compTax = 360 + (compBase - 60000) * 0.01;
    
    // 농특세 20% 부가
    compTax = Math.round(compTax * 1.2);
  }

  const annualTotal = totalPropTax + compTax;
  const details = isCompTaxTarget
    ? `공시가격 ${Math.round(officialPrice / 10000)}억원으로 종부세 부과 대상 (기본공제 ${compDeduction / 10000}억원 초과)`
    : `공시가격 ${Math.round(officialPrice / 10000)}억원으로 종부세 비과세 (기본공제 ${compDeduction / 10000}억원 이하)`;

  return { annualTotal, propertyTax: totalPropTax, comprehensiveTax: compTax, isCompTaxTarget, details };
}

/** 양도소득세 시뮬레이션 */
function calcCapitalGainsTax(price: number, gain: number, holdingYears: number, houseCount: 1 | 2 | 3) {
  // 1주택 비과세 체크 (실거래가 12억원 이하 + 2년 이상 보유 시 비과세)
  if (houseCount === 1 && price <= 120000 && holdingYears >= 2) {
    return {
      taxAmount: 0,
      gainAmount: gain,
      holdingYears,
      specialDeductionRate: 0,
      taxableIncome: 0,
      effectiveRate: 0,
      details: "1세대 1주택 비과세 요건 충족 (실거래가 12억원 이하 & 2년 이상 보유)",
    };
  }

  // 1주택 12억 초과분 과세 또는 다주택자 과세
  let taxableGain = gain;
  if (houseCount === 1 && price > 120000) {
    // 12억 초과분 비율만 과세: 양도차익 × (양도가액 - 12억) / 양도가액
    taxableGain = Math.round(gain * ((price - 120000) / price));
  }

  // 장기보유특별공제율
  let specialRate = 0;
  if (houseCount === 1) {
    // 1주택 거주+보유 특례 (연 8%, 최대 80%)
    specialRate = Math.min(holdingYears * 0.08, 0.80);
  } else {
    // 다주택 일반공제 (3년 이상부터 연 2%, 최대 30%)
    if (holdingYears >= 3) {
      specialRate = Math.min((holdingYears - 2) * 0.02 + 0.06, 0.30);
    }
  }

  const deductionAmount = Math.round(taxableGain * specialRate);
  // 과세표준 = 과세대상차익 - 장기보유특별공제 - 기본공제(250만원)
  const taxableBase = Math.max(0, taxableGain - deductionAmount - 250);

  // 일반 누진세율 (6% ~ 45%)
  let baseTax = 0;
  if (taxableBase <= 1400) baseTax = taxableBase * 0.06;
  else if (taxableBase <= 5000) baseTax = 84 + (taxableBase - 1400) * 0.15;
  else if (taxableBase <= 8800) baseTax = 624 + (taxableBase - 5000) * 0.24;
  else if (taxableBase <= 15000) baseTax = 1536 + (taxableBase - 8800) * 0.35;
  else if (taxableBase <= 30000) baseTax = 3706 + (taxableBase - 15000) * 0.38;
  else if (taxableBase <= 50000) baseTax = 9406 + (taxableBase - 30000) * 0.40;
  else baseTax = 17406 + (taxableBase - 50000) * 0.42;

  // 지방소득세 10% 가산
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
  } = input;

  if (!priceManwon || priceManwon <= 0) {
    return {
      hasData: false,
      estimatedOfficialPrice: 0,
      acquisitionTax: { total: 0, baseTax: 0, localEducationTax: 0, ruralSpecialTax: 0, effectiveRate: 0, details: "데이터 없음" },
      holdingTax: { annualTotal: 0, propertyTax: 0, comprehensiveTax: 0, isCompTaxTarget: false, details: "데이터 없음" },
      capitalGainsTax: { taxAmount: 0, gainAmount: 0, holdingYears: 0, specialDeductionRate: 0, taxableIncome: 0, effectiveRate: 0, details: "데이터 없음" },
      aiStrategyComment: ["실거래가 정보가 없어 세금 산출이 불가합니다."],
    };
  }

  // 공시가격 현실화율 69% 추정
  const estimatedOfficialPrice = Math.round(priceManwon * 0.69);
  
  // 양도차익 미입력 시 보수적 기준 (매매가의 15% 상승 가정)
  const gain = expectedCapitalGain !== undefined ? expectedCapitalGain : Math.round(priceManwon * 0.15);

  const acquisitionTax = calcAcquisitionTax(priceManwon, areaSqm, houseCount, isAdjustedArea);
  const holdingTax = calcHoldingTax(estimatedOfficialPrice, houseCount);
  const capitalGainsTax = calcCapitalGainsTax(priceManwon, gain, holdingYears, houseCount);

  // AI 절세 전략 코멘트 생성
  const aiStrategyComment: string[] = [];
  if (houseCount === 1) {
    if (priceManwon <= 120000) {
      aiStrategyComment.push("1주택 12억원 이하로 실거주/보유 2년 충족 시 양도소득세가 전액 비과세됩니다.");
    } else {
      aiStrategyComment.push("12억원 초과 고가주택으로, 12억 초과분에 대해서만 양도세가 과세되며 장특공제 최대 80%를 적용받을 수 있습니다.");
    }
    if (holdingTax.isCompTaxTarget) {
      aiStrategyComment.push("공시가격이 12억원을 초과하여 종합부동산세 과세 대상입니다. 부부 공동명의 변경 시 공제한도가 18억원으로 확대되어 종부세 전액 면제가 가능합니다.");
    } else {
      aiStrategyComment.push("공시가격이 1주택 기본공제(12억원) 이하로 종부세가 전혀 발생하지 않는 안전 구간입니다.");
    }
  } else {
    aiStrategyComment.push("다주택자 취득 시 취득세 중과(8~12%) 및 종부세 기본공제 9억원 축소로 보유 부담이 가중될 수 있습니다.");
    aiStrategyComment.push("처분 순서를 비조정지역 또는 차익이 적은 주택부터 정리하여 최종 1주택 비과세 혜택을 노리는 전략이 권장됩니다.");
  }

  return {
    hasData: true,
    estimatedOfficialPrice,
    acquisitionTax,
    holdingTax,
    capitalGainsTax,
    aiStrategyComment,
  };
}
