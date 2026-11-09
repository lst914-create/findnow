/**
 * 04번: 정비사업 분담금·비례율 AI 시뮬레이션 계산 엔진
 *
 * 정비사업 공식 원리:
 * 1. 종후자산평가액 (총 수입) = 조합원 분양수입 + 일반분양 수입
 * 2. 총 사업비 = 공사비(평당 공사비 × 연면적) + 기타 사업비(금융비용, 보상비, 설계비 등 약 30%)
 * 3. 종전자산평가액 (구역 내 기존 토지/건축물 감정평가액 총합)
 * 4. 비례율(%) = (총 수입 - 총 사업비) ÷ 종전자산총액 × 100
 *    - 100% 초과: 사업성 우수 (추가 이익 발생)
 *    - 100% 내외: 표준 사업성
 *    - 90% 미만: 사업성 저하 (조합원 분담금 증가 리스크)
 * 5. 권리가액 = 종전자산평가액(권리 감정가) × 비례율
 * 6. 조합원 분담금 = 희망 평형 조합원 분양가 - 권리가액
 *    - 양수(+): 조합원이 추가로 납부해야 할 분담금
 *    - 음수(-): 오히려 돌려받는 환급금
 *
 * 단위: 만원 (10000 = 1억원)
 */

export interface RedevelopmentSimInput {
  /** 현재 아파트 기준 감정평가 추정액 (만원, 보통 실거래가의 75~85%) */
  currentAssetValueManwon: number;
  /** 재건축/재개발 여부 */
  type?: "재건축" | "재개발" | "소규모재건축";
  /** 기존 보유 평형 (평) */
  currentPyeong?: number;
  /** 분양 희망 평형 (25평, 34평, 40평 등, 기본 34평) */
  targetPyeong?: 25 | 34 | 40;
  /** 평당 공사비 (만원, 최근 서울/수도권 평균 850만~1000만원) */
  constructionCostPerPyeong?: number;
  /** 예상 일반분양가 (평당 만원, 기본 3800만원 수준) */
  generalSalePricePerPyeong?: number;
}

export interface RedevelopmentSimResult {
  hasData: boolean;
  /** 종전자산 감정평가 추정액 (만원) */
  estimatedAppraisalValue: number;
  /** AI 추정 비례율 (%) */
  estimatedProportionRatio: number;
  /** 조합원 권리가액 = 감정평가액 × 비례율 (만원) */
  estimatedRightValue: number;
  /** 희망 평형 조합원 분양가 (만원) */
  targetMemberSalePrice: number;
  /** 최종 예상 추가분담금 (만원, 음수면 환급금) */
  contributionAmount: number;
  /** 평당 추정 공사비 (만원) */
  appliedConstructionCost: number;
  /** 사업성 진단 등급 */
  feasibilityGrade: "매우 우수" | "양호" | "보통" | "분담금 주의";
  /** 세부 분석 브리핑 */
  analysisBriefing: string[];
}

export function simulateRedevelopment(input: RedevelopmentSimInput): RedevelopmentSimResult {
  const {
    currentAssetValueManwon,
    type = "재건축",
    currentPyeong = 25,
    targetPyeong = 34,
    constructionCostPerPyeong = 900, // 평당 900만원
    generalSalePricePerPyeong = 3800, // 일반분양가 평당 3,800만원
  } = input;

  if (!currentAssetValueManwon || currentAssetValueManwon <= 0) {
    return {
      hasData: false,
      estimatedAppraisalValue: 0,
      estimatedProportionRatio: 100,
      estimatedRightValue: 0,
      targetMemberSalePrice: 0,
      contributionAmount: 0,
      appliedConstructionCost: constructionCostPerPyeong,
      feasibilityGrade: "보통",
      analysisBriefing: ["단지 시세 데이터가 없어 분담금 시뮬레이션이 불가합니다."],
    };
  }

  // 1. 종전자산 감정평가액 (시가의 약 80% 추정)
  const estimatedAppraisalValue = Math.round(currentAssetValueManwon * 0.80);

  // 2. 공사비와 일반분양가에 따른 비례율 역산
  // 기준: 공사비 900만, 일반분양가 3800만 기준 비례율 약 102%
  // 공사비 100만 상승 시 비례율 약 3% 하락, 일반분양가 200만 상승 시 비례율 약 2.5% 상승
  const costDiff = (constructionCostPerPyeong - 900) / 100;
  const saleDiff = (generalSalePricePerPyeong - 3800) / 200;
  let estimatedProportionRatio = Math.round((102 - costDiff * 3.2 + saleDiff * 2.4) * 10) / 10;
  estimatedProportionRatio = Math.max(80, Math.min(130, estimatedProportionRatio));

  // 3. 조합원 권리가액 = 감정평가액 × 비례율
  const estimatedRightValue = Math.round(estimatedAppraisalValue * (estimatedProportionRatio / 100));

  // 4. 조합원 분양가 (일반분양가의 약 85% 수준 특혜 분양가)
  // 25평: 일반 9.5억 / 조분 8.1억, 34평: 일반 12.9억 / 조분 11.0억, 40평: 일반 15.2억 / 조분 12.9억
  const memberSaleRatePerPyeong = Math.round(generalSalePricePerPyeong * 0.85);
  const targetMemberSalePrice = Math.round(memberSaleRatePerPyeong * targetPyeong);

  // 5. 예상 추가분담금 = 조합원 분양가 - 권리가액
  const contributionAmount = targetMemberSalePrice - estimatedRightValue;

  // 사업성 등급
  let feasibilityGrade: RedevelopmentSimResult["feasibilityGrade"] = "양호";
  if (estimatedProportionRatio >= 110) feasibilityGrade = "매우 우수";
  else if (estimatedProportionRatio >= 100) feasibilityGrade = "양호";
  else if (estimatedProportionRatio >= 92) feasibilityGrade = "보통";
  else feasibilityGrade = "분담금 주의";

  // AI 분석 브리핑
  const analysisBriefing: string[] = [];

  if (contributionAmount > 0) {
    analysisBriefing.push(
      `기존 전용 ${currentPyeong}평 소유주가 신축 ${targetPyeong}평을 배정받을 경우 예상 추가분담금은 약 ${Math.round(contributionAmount / 10000)}억원 수준입니다.`
    );
  } else {
    analysisBriefing.push(
      `기존 대지지분 가치 및 권리가액이 높아 신축 ${targetPyeong}평 신청 시 약 ${Math.abs(Math.round(contributionAmount / 10000))}억원의 환급금이 예상됩니다.`
    );
  }

  analysisBriefing.push(
    `적용 평당 공사비 ${constructionCostPerPyeong.toLocaleString()}만원 기준 추정 비례율은 ${estimatedProportionRatio}%로 사업성 [${feasibilityGrade}] 단계입니다.`
  );

  analysisBriefing.push(
    `최근 원자재 가격 및 금리 상승에 따라 공사비가 100만원 증액될 때마다 조합원당 약 3,000만~4,500만원의 추가 분담금 변동이 발생할 수 있습니다.`
  );

  return {
    hasData: true,
    estimatedAppraisalValue,
    estimatedProportionRatio,
    estimatedRightValue,
    targetMemberSalePrice,
    contributionAmount,
    appliedConstructionCost: constructionCostPerPyeong,
    feasibilityGrade,
    analysisBriefing,
  };
}

