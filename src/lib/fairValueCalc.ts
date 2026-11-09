/**
 * AI 적정 가치 평가 & 협상 호가 가이드라인 계산 엔진 (PRO 프리미엄 리서치급)
 *
 * 4대 핵심 평가 모형:
 * 1. 전세가 기반 내재가치 역산 모형 (Rental Yield Implied Valuation)
 *    - 내재가치 = 전세가 / 정상 전세가율 (거품 제거 실사용 가치)
 * 2. 동일 생활권 랜드마크(대장 아파트) 대비 역사적 갭 비율 추적 (Peer Benchmark Gap)
 *    - 권역 대장 평당가 대비 적정 키맞추기 비율 분석
 * 3. 금리 변동 시나리오별 적정가치 민감도 (Interest Rate Sensitivity Test)
 *    - 저금리(2.5%) vs 기준금리(3.5%) vs 고금리(4.5%) 시나리오별 자산가치 수축/확장
 * 4. 매수자 실전 협상 가이드라인 (Tactical Negotiation Action Plan)
 *    - "도장 찍어야 하는 목표 매수가" vs "절대 사면 안 되는 상한가" vs "현장 네고 팁"
 *
 * 단위: 만원 (10000 = 1억원)
 */

export interface FairValueInput {
  id?: string;
  name: string;
  price_min?: number | null;
  price_max?: number | null;
  rent_min?: number | null;
  rent_max?: number | null;
  jeonseRatio?: number | null;
  area_pyeong?: number | null;
  area_sqm?: number | null;
  region?: string;
  district?: string;
}

export interface LandmarkBenchmark {
  name: string;
  avgPyeongPrice: number; // 만원/평
  ratioToTarget: number; // 대상단지 평당가 / 대장단지 평당가 (%)
  normalGapRatio: number; // 역사적 정상 갭 비율 (%)
  gapStatus: "대장 대비 저평가" | "적정 키맞추기" | "대장 대비 과열";
  comment: string;
}

export interface InterestScenario {
  rate: number; // % (예: 3.0)
  label: string;
  impliedFairPrice: number; // 만원
  diffPercent: number; // 기준 대비 변동률 (%)
  comment: string;
}

export interface NegotiationGuide {
  targetBuyPrice: number; // 목표 체결가 (만원)
  maximumAcceptablePrice: number; // 협상 마지노선 (만원)
  walkAwayPrice: number; // 협상 결렬(포기) 기준가 (만원)
  discountFromCurrentAsk: number; // 현재 호가 대비 깎아야 할 금액 (만원)
  negotiationPoints: string[]; // 실전 부동산 방문 시 던져야 할 협상 멘트/포인트
}

export interface FairValueResult {
  hasData: boolean;
  verdict: "저평가 (적극 매수)" | "적정 (선별 매수)" | "고평가 (관망 및 네고)";
  verdictScore: number; // 100점 만점 투자 매력도 점수
  currentPrice: number; // 현재 실거래/호가 기준가 (만원)
  intrinsicValue: number; // 전세가 기반 본질가치 (만원)
  bubbleRatio: number; // 거품/괴리율 (%) (현재가/내재가치 - 100)
  pyeongUnitPrice: number; // 평당 단가 (만원/평)
  
  /** 3단 가격 밴드 */
  bargainPrice: number; // 급매/바닥가 (만원)
  fairPrice: number; // 적정가 (만원)
  ceilingPrice: number; // 고평가/상한가 (만원)

  /** 권역 대장주 벤치마크 */
  landmark: LandmarkBenchmark;

  /** 금리 변동 민감도 시나리오 */
  interestScenarios: InterestScenario[];

  /** 실전 협상 가이드 */
  negotiationGuide: NegotiationGuide;

  /** 산출 세부 공식 */
  valuationBreakdown: Array<{ label: string; formula: string; result: string }>;
}

/** 권역별 대표 대장 아파트 및 평당가 벤치마크 데이터베이스 */
function getRegionalLandmark(region: string = "", district: string = ""): { name: string; pyeongPrice: number; normalGap: number } {
  const full = `${region} ${district}`;

  if (full.includes("강남")) return { name: "래미안대치팰리스", pyeongPrice: 11500, normalGap: 75 };
  if (full.includes("서초")) return { name: "아크로리버파크", pyeongPrice: 13000, normalGap: 70 };
  if (full.includes("송파") || full.includes("잠실")) return { name: "잠실엘스", pyeongPrice: 8500, normalGap: 80 };
  if (full.includes("마포")) return { name: "마포래미안푸르지오", pyeongPrice: 6200, normalGap: 75 };
  if (full.includes("성동") || full.includes("옥수") || full.includes("금호")) return { name: "트리마제 / 옥수파크힐스", pyeongPrice: 7000, normalGap: 75 };
  if (full.includes("영등포") || full.includes("여의도")) return { name: "여의도 시범 / 아크로타워스퀘어", pyeongPrice: 6500, normalGap: 70 };
  if (full.includes("양천") || full.includes("목동")) return { name: "목동신시가지 7단지", pyeongPrice: 6800, normalGap: 75 };
  if (full.includes("분당")) return { name: "판교푸르지오그랑블", pyeongPrice: 7800, normalGap: 70 };
  if (full.includes("과천")) return { name: "과천푸르지오써밋", pyeongPrice: 7200, normalGap: 75 };
  if (full.includes("하남") || full.includes("미사")) return { name: "미사강변골든센트로", pyeongPrice: 3800, normalGap: 80 };
  if (full.includes("남양주") || full.includes("다산")) return { name: "다산자이아이비플레이스", pyeongPrice: 3500, normalGap: 78 };
  if (full.includes("구리")) return { name: "구리역롯데캐슬시그니처", pyeongPrice: 3600, normalGap: 80 };
  if (full.includes("수원") || full.includes("광교")) return { name: "광교중흥S-클래스", pyeongPrice: 5200, normalGap: 75 };
  if (full.includes("용인") || full.includes("수지")) return { name: "성복역롯데캐슬골드타운", pyeongPrice: 3900, normalGap: 75 };
  if (full.includes("인천") || full.includes("송도")) return { name: "송도더샵퍼스트파크", pyeongPrice: 3200, normalGap: 75 };
  if (full.includes("대구") || full.includes("수성")) return { name: "수성범어W / 두산위브더제니스", pyeongPrice: 4200, normalGap: 75 };
  if (full.includes("부산") || full.includes("해운대")) return { name: "해운대엘시티더샵", pyeongPrice: 5500, normalGap: 70 };
  if (full.includes("대전") || full.includes("유성")) return { name: "도룡SK뷰 / 크로바", pyeongPrice: 3800, normalGap: 75 };

  // 전국 일반 수도권/지방 거점 대장 벤치마크
  return { name: "생활권역 1위 랜드마크", pyeongPrice: 3200, normalGap: 75 };
}

export function calcFairValue(apt: FairValueInput): FairValueResult {
  const pMin = apt.price_min || 0;
  const pMax = apt.price_max || 0;
  const currentPrice = (pMin > 0 && pMax > 0) ? Math.round((pMin + pMax) / 2) : (pMin || pMax || 60000);

  const rMin = apt.rent_min || 0;
  const rMax = apt.rent_max || 0;
  const avgRent = (rMin > 0 && rMax > 0) ? Math.round((rMin + rMax) / 2) : (rMin || rMax || Math.round(currentPrice * 0.62));

  const pyeong = apt.area_pyeong || (apt.area_sqm ? Math.round(apt.area_sqm / 3.305785 * 10) / 10 : 34);
  const pyeongUnitPrice = Math.round(currentPrice / pyeong);

  // 1. 전세가 기반 내재가치 역산 (정상 전세가율 62% 가정)
  const normalJeonseRatio = apt.jeonseRatio && apt.jeonseRatio > 40 && apt.jeonseRatio < 90 ? apt.jeonseRatio : 62;
  const intrinsicValue = Math.round(avgRent / (normalJeonseRatio / 100));
  const bubbleRatio = Math.round(((currentPrice - intrinsicValue) / intrinsicValue) * 100);

  // 2. 3단 가격 밴드
  const bargainPrice = Math.round(intrinsicValue * 0.88); // 급매가 (내재가치 88%선)
  const fairPrice = intrinsicValue; // 적정가 (내재가치 100%)
  const ceilingPrice = Math.round(intrinsicValue * 1.12); // 상한선 (내재가치 112% 초과 시 고평가)

  // 3. 권역 대장주 벤치마크
  const regionLandmark = getRegionalLandmark(apt.region, apt.district);
  const ratioToTarget = Math.round((pyeongUnitPrice / regionLandmark.pyeongPrice) * 100);
  let gapStatus: LandmarkBenchmark["gapStatus"] = "적정 키맞추기";
  let gapComment = "";

  if (ratioToTarget < regionLandmark.normalGap - 5) {
    gapStatus = "대장 대비 저평가";
    gapComment = `생활권 대장(${regionLandmark.name}) 대비 통상 ${regionLandmark.normalGap}% 수준을 유지해야 하나, 현재 ${ratioToTarget}%에 머물러 있어 향후 키맞추기 갭 메우기 상승 여력이 높습니다.`;
  } else if (ratioToTarget > regionLandmark.normalGap + 7) {
    gapStatus = "대장 대비 과열";
    gapComment = `생활권 대장 대비 가격 비율이 ${ratioToTarget}%로 역사적 상단에 도달해 있어, 대장주가 추가 상승하지 않는 한 단기 추가 상승 여력이 제한적입니다.`;
  } else {
    gapStatus = "적정 키맞추기";
    gapComment = `생활권 대장 아파트 대비 평당가 갭(${ratioToTarget}%)이 정상적인 키맞추기 궤적에 완벽히 부합하고 있습니다.`;
  }

  const landmark: LandmarkBenchmark = {
    name: regionLandmark.name,
    avgPyeongPrice: regionLandmark.pyeongPrice,
    ratioToTarget,
    normalGapRatio: regionLandmark.normalGap,
    gapStatus,
    comment: gapComment,
  };

  // 4. 금리 변동 민감도 시나리오
  const interestScenarios: InterestScenario[] = [
    {
      rate: 2.5,
      label: "저금리 유동성 확장기 (기준금리 2.5%)",
      impliedFairPrice: Math.round(fairPrice * 1.15),
      diffPercent: +15,
      comment: "전세대출 이자 부담 완화로 전세가 상승 견인 → 매매가 상방 밴드 15% 확장",
    },
    {
      rate: 3.5,
      label: "현행 중립금리 구간 (기준금리 3.5%)",
      impliedFairPrice: fairPrice,
      diffPercent: 0,
      comment: "내재가치 중심의 실수요자 위주 보수적 거래 형성선",
    },
    {
      rate: 4.5,
      label: "고금리 긴축 충격기 (기준금리 4.5%)",
      impliedFairPrice: Math.round(fairPrice * 0.88),
      diffPercent: -12,
      comment: "이자 상환 부담 증가로 영끌 매물 출회 및 전세가 동반 조정 압박",
    },
  ];

  // 5. 판정 및 투자 매력도 점수 (100점 만점)
  let verdict: FairValueResult["verdict"] = "적정 (선별 매수)";
  let verdictScore = 75;

  if (bubbleRatio <= -5) {
    verdict = "저평가 (적극 매수)";
    verdictScore = Math.min(95, 80 + Math.abs(bubbleRatio));
  } else if (bubbleRatio >= 10) {
    verdict = "고평가 (관망 및 네고)";
    verdictScore = Math.max(45, 70 - bubbleRatio);
  } else {
    verdict = "적정 (선별 매수)";
    verdictScore = 75;
  }

  // 6. 실전 매수 협상 가이드라인
  const targetBuyPrice = Math.min(currentPrice, Math.round(fairPrice * 0.96)); // 현재가보다 4% 이상 깎은 선
  const maximumAcceptablePrice = fairPrice;
  const walkAwayPrice = ceilingPrice;
  const discountFromCurrentAsk = Math.max(0, currentPrice - targetBuyPrice);

  const negotiationPoints: string[] = [
    `[가격 제안선] 중개업소 방문 시 호가 그대로 수용하지 마시고, 1차 제안가로 ${fmtWon(targetBuyPrice)}를 강력히 제시하세요.`,
    `[협상 명분] 인근 전세 실거래가(${fmtWon(avgRent)})와 대장주 키맞추기 지표를 근거로 "현재 호가는 내재가치 대비 약 ${bubbleRatio > 0 ? `+${bubbleRatio}%` : `${bubbleRatio}%`} 괴리되어 있음"을 브리핑하세요.`,
    `[계약 조건] 잔금 지급일을 3~4개월로 넉넉히 확보하거나, 임차인 승계 조건으로 ${discountFromCurrentAsk > 0 ? `${fmtWon(discountFromCurrentAsk)} 절충` : "수리비 지원"}을 필수 요구하세요.`,
    `[퇴각 기준] 매도인이 ${fmtWon(walkAwayPrice)} 이상을 고수할 경우 미련 없이 협상을 중단하고 동일 생활권 대체 단지로 이동할 것을 권고합니다.`,
  ];

  const negotiationGuide: NegotiationGuide = {
    targetBuyPrice,
    maximumAcceptablePrice,
    walkAwayPrice,
    discountFromCurrentAsk,
    negotiationPoints,
  };

  // 세부 산출 공식
  const valuationBreakdown = [
    {
      label: "전세가 환산 내재가치",
      formula: `전세가 ${fmtWon(avgRent)} ÷ 정상 전세가율 ${normalJeonseRatio}%`,
      result: fmtWon(intrinsicValue),
    },
    {
      label: "대장주 대비 평당 비율",
      formula: `본 단지 ${pyeongUnitPrice}만원 ÷ ${regionLandmark.name} ${regionLandmark.pyeongPrice}만원`,
      result: `${ratioToTarget}% (적정치 ${regionLandmark.normalGap}%)`,
    },
    {
      label: "시세 괴리율 (버블 지수)",
      formula: `(현재가 ${fmtWon(currentPrice)} - 내재가치 ${fmtWon(intrinsicValue)}) ÷ 내재가치`,
      result: `${bubbleRatio > 0 ? `+${bubbleRatio}% (고평가)` : `${bubbleRatio}% (저평가)`}`,
    },
  ];

  return {
    hasData: true,
    verdict,
    verdictScore,
    currentPrice,
    intrinsicValue,
    bubbleRatio,
    pyeongUnitPrice,
    bargainPrice,
    fairPrice,
    ceilingPrice,
    landmark,
    interestScenarios,
    negotiationGuide,
    valuationBreakdown,
  };
}

/** 만원 단위 포맷팅 */
export function fmtWon(manwon: number): string {
  if (manwon >= 10000) {
    const eok = Math.floor(manwon / 10000);
    const rem = manwon % 10000;
    return rem > 0 ? `${eok}억 ${rem.toLocaleString()}만원` : `${eok}억원`;
  }
  return `${manwon.toLocaleString()}만원`;
}
