/**
 * 06번: 전세가율 추이 및 갭투자 리스크 진단 (역전세 방어력)
 *
 * 핵심 분석 축:
 * 1. 실투자 갭(Gap Price) = 매매가 - 전세가 (취득세 등 부대비용 포함 실투자금 역산)
 * 2. 깡통전세 위험도 판정:
 *    - HUG(주택도시보증공사) 전세보증금 반환보증 가입 한도: 매매가(공시가격 126% 또는 실거래가)의 90% (보증보험 안심 기준선)
 *    - 전세가율 80% 초과: 🔴 위험 (역전세 및 보증금 미반환 리스크 높음)
 *    - 전세가율 65% ~ 80%: 🟡 주의 (일반 갭투자 구간, 하락기 역전세 유의)
 *    - 전세가율 65% 미만: 🟢 안전 (역전세 방어력 우수, 자본 여력 풍부)
 * 3. 최근 5개년/실거래 기반 역전세 방어 버퍼 (하락 시 집주인 추가 자금 마련 필요액)
 *
 * 단위: 만원 (10000 = 1억원)
 */

export interface GapRiskInput {
  price_min?: number | null;
  price_max?: number | null;
  rent_min?: number | null;
  rent_max?: number | null;
  jeonseRatio?: number | null;
  gapPrice?: number | null;
  name?: string;
  region?: string;
}

export type GapRiskGrade = "안전" | "주의" | "위험" | "데이터부족";

export interface GapRiskResult {
  hasData: boolean;
  /** 현재 매매 기준가 (만원) */
  currentPrice: number | null;
  /** 현재 전세 기준가 (만원) */
  currentRent: number | null;
  /** 전세가율 % */
  jeonseRatio: number | null;
  /** 순수 갭투자금 (만원) */
  pureGap: number | null;
  /** 취득세 포함 실투자 필요금액 (만원) */
  totalInvestmentNeeded: number | null;
  /** HUG 전세보증보험 가입 안전 마지노선 (매매가의 90%) - 만원 */
  hugSafetyLimit: number | null;
  /** HUG 가입 가능 여부 */
  isHugGuaranteed: boolean;
  /** 리스크 등급 */
  grade: GapRiskGrade;
  /** 역전세 방어력 점수 (100점 만점) */
  defenseScore: number;
  /** 매매가 10% 하락 시나리오 시 집주인 역전세 반환 리스크금액 (만원) */
  stressTest10PercentDrop: number;
  /** 상세 분석 리포트 코멘트 */
  analysisComments: string[];
}

export function calcGapInvestmentRisk(input: GapRiskInput): GapRiskResult {
  const pMin = input.price_min;
  const pMax = input.price_max;
  const rMin = input.rent_min;
  const rMax = input.rent_max;

  // 매매가 & 전세가 기준값 계산
  const currentPrice =
    pMin && pMax ? Math.round((pMin + pMax) / 2) : pMin || pMax || null;
  const currentRent =
    rMin && rMax ? Math.round((rMin + rMax) / 2) : rMin || rMax || null;

  if (!currentPrice) {
    return {
      hasData: false,
      currentPrice: null,
      currentRent: null,
      jeonseRatio: null,
      pureGap: null,
      totalInvestmentNeeded: null,
      hugSafetyLimit: null,
      isHugGuaranteed: false,
      grade: "데이터부족",
      defenseScore: 50,
      stressTest10PercentDrop: 0,
      analysisComments: ["실거래 매매가 데이터가 없어 갭투자 리스크 산출이 불가합니다."],
    };
  }

  // 전세가율 산출
  let jeonseRatio = input.jeonseRatio || null;
  if (!jeonseRatio && currentRent && currentPrice > 0) {
    jeonseRatio = Math.round((currentRent / currentPrice) * 100);
  }

  // 전세가 데이터가 전혀 없는 경우
  if (!currentRent && !jeonseRatio) {
    return {
      hasData: true,
      currentPrice,
      currentRent: null,
      jeonseRatio: null,
      pureGap: null,
      totalInvestmentNeeded: null,
      hugSafetyLimit: Math.round(currentPrice * 0.9),
      isHugGuaranteed: false,
      grade: "데이터부족",
      defenseScore: 50,
      stressTest10PercentDrop: 0,
      analysisComments: [
        "최근 신고된 전세 실거래가 없어 정확한 전세가율 역산이 보류되었습니다.",
        "인근 동일 평형 전세 시세를 교차 검증하시기 바랍니다.",
      ],
    };
  }

  // 실제 전세가 역산 (직접 없으면 전세가율 기반)
  const effectiveRent = currentRent || Math.round(currentPrice * ((jeonseRatio || 60) / 100));
  const effectiveRatio = jeonseRatio || Math.round((effectiveRent / currentPrice) * 100);

  // 순수 갭 = 매매가 - 전세가
  const pureGap = Math.max(0, currentPrice - effectiveRent);

  // 취득세 등 부대비용(약 1.5% 추정) 포함 실투자금
  const extraCost = Math.round(currentPrice * 0.015);
  const totalInvestmentNeeded = pureGap + extraCost;

  // HUG 전세보증금 반환보증 가입 한도: 매매가의 90% (보증보험 안심 기준)
  const hugSafetyLimit = Math.round(currentPrice * 0.9);
  const isHugGuaranteed = effectiveRent <= hugSafetyLimit;

  // 리스크 등급 및 역전세 방어 점수
  let grade: GapRiskGrade = "주의";
  let defenseScore = 70;

  if (effectiveRatio >= 80) {
    grade = "위험";
    defenseScore = Math.max(30, 100 - effectiveRatio);
  } else if (effectiveRatio >= 65) {
    grade = "주의";
    defenseScore = Math.round(100 - effectiveRatio * 0.5);
  } else {
    grade = "안전";
    defenseScore = Math.min(96, Math.round(100 - effectiveRatio * 0.3));
  }

  // 스트레스 테스트: 매매가 10% 하락 시 전세가도 동반 10% 하락한다고 가정할 때 기존 세입자에게 돌려주어야 할 보증금 차액
  const stressTest10PercentDrop = Math.round(effectiveRent * 0.1);

  // AI 분석 코멘트
  const analysisComments: string[] = [];

  if (grade === "안전") {
    analysisComments.push(
      `전세가율이 ${effectiveRatio}%로 낮아 매매가 하락 시에도 보증금 미반환 우려가 극히 낮은 "역전세 철벽 방어" 단지입니다.`
    );
    analysisComments.push(
      `실투자 갭은 약 ${Math.round(pureGap / 10000)}억원 수준으로, 자본 투입이 상대적으로 필요한 대신 하락장 방어력이 탁월합니다.`
    );
  } else if (grade === "주의") {
    analysisComments.push(
      `전세가율 ${effectiveRatio}%로 전형적인 갭투자 선호 구간입니다. 소액 갭투자가 가능하나 금리 인상기 전세가 하락에 대비해야 합니다.`
    );
    analysisComments.push(
      `만약 재계약 시 전세 시세가 10% 조정될 경우 약 ${stressTest10PercentDrop.toLocaleString()}만원의 추가 현금 동원 여력이 필요합니다.`
    );
  } else {
    analysisComments.push(
      `전세가율이 ${effectiveRatio}%에 달하는 "고위험 갭투자" 구간입니다. 매매가 소폭 하락만으로도 깡통전세 위험에 노출될 수 있습니다.`
    );
    if (!isHugGuaranteed) {
      analysisComments.push(
        `현재 전세가가 HUG 보증보험 가입 한도(매매가의 90%)를 위협하고 있어, 신규 임차인 유치 시 보증보험 가입 거절 리스크가 존재합니다.`
      );
    }
  }

  return {
    hasData: true,
    currentPrice,
    currentRent: effectiveRent,
    jeonseRatio: effectiveRatio,
    pureGap,
    totalInvestmentNeeded,
    hugSafetyLimit,
    isHugGuaranteed,
    grade,
    defenseScore,
    stressTest10PercentDrop,
    analysisComments,
  };
}

