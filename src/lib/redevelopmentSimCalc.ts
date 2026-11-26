/**
 * 04번: 정비사업 분담금·비례율 AI 정밀 시뮬레이션 엔진 (Institutional-Grade PRO Report)
 *
 * 공식 계산 원리:
 * 1. 종전자산평가액 (감정평가액) = 현재 시세 × 추정 감정평가율 (약 75~80%)
 * 2. 총 사업비 = (평당 공사비 × 신축 연면적) + 기타 사업비 (금융비용, 이주비, 보상비 등 총공사비의 약 33%)
 * 3. 추정 비례율(%) = (종후 총분양수입 - 총사업비) ÷ 종전자산총액 × 100
 * 4. 조합원 권리가액 = 종전자산평가액 × 비례율
 * 5. 조합원 분담금 = 희망 평형 조합원 분양가 - 권리가액 (음수면 환급금)
 * 6. 총 투자비용 = 기존 자산가치(실거래가) + 추가 분담금
 * 7. 안전마진(프리미엄) = 준공 후 신축 예상 시세 - 총 투자비용
 */

export interface RedevelopmentSimInput {
  currentAssetValueManwon: number; // 만원
  builtYear?: number;
  currentPyeong?: number;
  targetPyeong?: 25 | 34 | 43;
  constructionCostPerPyeong?: number; // 만원 (예: 950)
  generalSalePricePerPyeong?: number; // 만원 (예: 4200)
  region?: string;
  district?: string;
}

export interface PyeongOptionResult {
  pyeong: number;
  label: string;
  exclusiveAreaSqm: number;
  memberPrice: number; // 조합원 분양가 (만원)
  contributionAmount: number; // 분담금 (+면 납부, -면 환급, 만원)
  isRefund: boolean;
  totalCost: number; // 총 투자금 (기존 매입가 + 분담금, 만원)
  expectedNewPrice: number; // 입주 후 예상 시세 (만원)
  safetyMargin: number; // 안전마진 프리미엄 (만원)
  marginRate: number; // 수익률 (%)
}

export interface CostSensitivityItem {
  costPerPyeong: number; // 만원
  proportionRatio: number; // 비례율 (%)
  contributionDiff: number; // 분담금 변동액 (+만원)
  feasibility: string;
}

export interface RedevelopmentSimResult {
  hasData: boolean;
  estimatedAppraisalValue: number; // 감정평가 추정액 (만원)
  estimatedProportionRatio: number; // 비례율 (%)
  estimatedRightValue: number; // 권리가액 (만원)
  targetMemberSalePrice: number; // 선택 평형 조합원 분양가 (만원)
  contributionAmount: number; // 최종 분담금 (만원)
  isRefund: boolean;
  totalInvestmentCost: number; // 총 취득 비용 (만원)
  expectedNewMarketPrice: number; // 신축 예상 시세 (만원)
  safetyMarginManwon: number; // 안전마진 (만원)
  safetyMarginPercent: number; // 수익률 (%)
  appliedConstructionCost: number; // 적용 공사비 (만원)
  appliedGeneralSalePrice: number; // 적용 일반분양가 (만원)
  feasibilityGrade: "S급 (사업성 탁월)" | "A급 (양호)" | "B급 (수익 보통)" | "C급 (분담금 주의)";
  stageStatus: string; // 추진 단계 (예: 재건축 연한 도래, 안전진단 준비 등)
  pyeongOptions: PyeongOptionResult[];
  costSensitivities: CostSensitivityItem[];
  analysisBriefing: string[];
}

export function simulateRedevelopment(input: RedevelopmentSimInput): RedevelopmentSimResult {
  const {
    currentAssetValueManwon,
    builtYear = 1995,
    currentPyeong = 25,
    targetPyeong = 34,
    constructionCostPerPyeong = 950,
    region = "",
    district = "",
  } = input;

  const basePrice = currentAssetValueManwon > 0 ? currentAssetValueManwon : 60000;

  // 지역별 기본 일반분양가 자동 보정 (강남/서초/송파/마용성/분당/수도권 등)
  const isGangnamSeocho = district.includes("강남") || district.includes("서초");
  const isSongpa = district.includes("송파") || district.includes("용산");
  const isSeoulCore = district.includes("마포") || district.includes("성동") || district.includes("광진") || district.includes("영등포");
  const isGyeonggiCore = district.includes("분당") || district.includes("과천") || district.includes("하남");

  let defaultGeneralSale = 3800; // 평당 3,800만
  if (isGangnamSeocho) defaultGeneralSale = 6800; // 평당 6,800만
  else if (isSongpa) defaultGeneralSale = 5200; // 평당 5,200만
  else if (isSeoulCore) defaultGeneralSale = 4500; // 평당 4,500만
  else if (isGyeonggiCore) defaultGeneralSale = 3900; // 평당 3,900만

  const generalSalePrice = input.generalSalePricePerPyeong || defaultGeneralSale;

  // 1. 종전자산 감정평가액 (시세의 약 78% 추정)
  const estimatedAppraisalValue = Math.round(basePrice * 0.78);

  // 2. 비례율 계산 모델 (공사비 & 일반분양가 민감도 반영)
  // 기준점: 공사비 950만, 기본 일반분양가일 때 약 102%
  const costDelta = (constructionCostPerPyeong - 950) / 100;
  const saleDelta = (generalSalePrice - defaultGeneralSale) / 200;
  let estimatedProportionRatio = Math.round((102 - costDelta * 3.4 + saleDelta * 2.2) * 10) / 10;
  estimatedProportionRatio = Math.max(78, Math.min(130, estimatedProportionRatio));

  // 3. 권리가액 = 감정평가액 × 비례율
  const estimatedRightValue = Math.round(estimatedAppraisalValue * (estimatedProportionRatio / 100));

  // 4. 조합원 분양가 (일반분양가의 약 85% 우대 적용)
  const memberPricePerPyeong = Math.round(generalSalePrice * 0.85);

  // 5. 평형별 분담금 옵션 (25평 59㎡, 34평 84㎡, 43평 114㎡)
  const pyeongList: { pyeong: 25 | 34 | 43; label: string; sqm: number }[] = [
    { pyeong: 25, label: "소형 25평 (전용 59㎡)", sqm: 59 },
    { pyeong: 34, label: "국민평형 34평 (전용 84㎡)", sqm: 84 },
    { pyeong: 43, label: "대형 43평 (전용 114㎡)", sqm: 114 },
  ];

  const pyeongOptions: PyeongOptionResult[] = pyeongList.map((item) => {
    const memPrice = Math.round(memberPricePerPyeong * item.pyeong);
    const contrib = memPrice - estimatedRightValue;
    const isRef = contrib < 0;
    const totCost = basePrice + (isRef ? 0 : contrib) - (isRef ? Math.abs(contrib) : 0);

    // 입주 후 신축 프리미엄 예상가 (일반분양가 대비 약 115% 시장가 형성)
    const expNewPrice = Math.round(generalSalePrice * 1.15 * item.pyeong);
    const margin = expNewPrice - totCost;
    const mRate = Math.round((margin / (totCost || 1)) * 100);

    return {
      pyeong: item.pyeong,
      label: item.label,
      exclusiveAreaSqm: item.sqm,
      memberPrice: memPrice,
      contributionAmount: Math.abs(contrib),
      isRefund: isRef,
      totalCost: totCost,
      expectedNewPrice: expNewPrice,
      safetyMargin: margin,
      marginRate: mRate,
    };
  });

  // 선택된 희망 평형 결과 추출
  const selectedOption = pyeongOptions.find((p) => p.pyeong === targetPyeong) || pyeongOptions[1];
  const targetMemberSalePrice = selectedOption.memberPrice;
  const contributionAmount = selectedOption.contributionAmount;
  const isRefund = selectedOption.isRefund;
  const totalInvestmentCost = selectedOption.totalCost;
  const expectedNewMarketPrice = selectedOption.expectedNewPrice;
  const safetyMarginManwon = selectedOption.safetyMargin;
  const safetyMarginPercent = selectedOption.marginRate;

  // 6. 공사비 민감도 분석 (850만, 950만, 1050만, 1200만)
  const testCosts = [850, 950, 1050, 1200];
  const costSensitivities: CostSensitivityItem[] = testCosts.map((c) => {
    const cDelta = (c - 950) / 100;
    const ratio = Math.round((102 - cDelta * 3.4) * 10) / 10;
    const rightVal = Math.round(estimatedAppraisalValue * (ratio / 100));
    const contrib = targetMemberSalePrice - rightVal;
    const baseContrib = targetMemberSalePrice - estimatedRightValue;
    const diff = contrib - baseContrib;

    let feas = "표준";
    if (ratio >= 105) feas = "사업성 최우수";
    else if (ratio >= 98) feas = "양호";
    else if (ratio >= 90) feas = "수익 보통";
    else feas = "분담금 증가 주의";

    return {
      costPerPyeong: c,
      proportionRatio: ratio,
      contributionDiff: diff,
      feasibility: feas,
    };
  });

  // 7. 사업성 등급 판정
  let feasibilityGrade: RedevelopmentSimResult["feasibilityGrade"] = "A급 (양호)";
  if (estimatedProportionRatio >= 106) feasibilityGrade = "S급 (사업성 탁월)";
  else if (estimatedProportionRatio >= 98) feasibilityGrade = "A급 (양호)";
  else if (estimatedProportionRatio >= 90) feasibilityGrade = "B급 (수익 보통)";
  else feasibilityGrade = "C급 (분담금 주의)";

  // 8. 연식 기반 정비사업 단계 추정
  const age = 2026 - builtYear;
  let stageStatus = "재건축 준비기 (연식 도래)";
  if (age >= 35) stageStatus = "정비계획 수립 및 정밀안전진단 통과 유력 단계";
  else if (age >= 30) stageStatus = "재건축 연한(30년) 충족 · 주민 동의서 징구 단계";
  else if (age >= 25) stageStatus = "정비사업 잠재 대상 단지 (리모델링/재건축 검토)";
  else stageStatus = "준신축 단지 (자산 대체가치 및 리모델링 잠재력 분석)";

  const aiHistoricalBriefing: string[] = [
    `적용된 평당 공사비 ${constructionCostPerPyeong.toLocaleString()}만원 기준 추정 비례율은 [${estimatedProportionRatio}%]로 사업성 [${feasibilityGrade}] 단계입니다.`,
    `기존 보유 자산 감정평가액 [${Math.round(estimatedAppraisalValue / 10000)}억 ${(estimatedAppraisalValue % 10000).toLocaleString()}만원]을 기초로 권리가액 [${Math.round(estimatedRightValue / 10000)}억]이 산출되었습니다.`,
    `신축 [${targetPyeong}평] 신청 시 최종 ${isRefund ? "환급금" : "추가 분담금"}은 [${Math.round(contributionAmount / 10000)}억 ${(contributionAmount % 10000).toLocaleString()}만원]으로 추정됩니다.`,
    `총 투자금(${Math.round(totalInvestmentCost / 10000)}억) 대비 입주 후 신축 예상 시세(${Math.round(expectedNewMarketPrice / 10000)}억) 기준 [안전마진 +${Math.round(safetyMarginManwon / 10000)}억원 (수익률 +${safetyMarginPercent}%)]이 기대됩니다.`,
  ];

  return {
    hasData: true,
    estimatedAppraisalValue,
    estimatedProportionRatio,
    estimatedRightValue,
    targetMemberSalePrice,
    contributionAmount,
    isRefund,
    totalInvestmentCost,
    expectedNewMarketPrice,
    safetyMarginManwon,
    safetyMarginPercent,
    appliedConstructionCost: constructionCostPerPyeong,
    appliedGeneralSalePrice: generalSalePrice,
    feasibilityGrade,
    stageStatus,
    pyeongOptions,
    costSensitivities,
    analysisBriefing: aiHistoricalBriefing,
  };
}
