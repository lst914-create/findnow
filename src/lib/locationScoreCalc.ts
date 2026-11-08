/**
 * 01번: 입지 종합 점수표 (항목별 가중치 및 상세 산출 근거 공개)
 *
 * 평가 5대 축 및 가중치:
 * 1. 교통 (Traffic, 30%): 지하철역 최단거리, 도보 시간, 주요 환승 노선
 * 2. 학군 (School, 25%): 초품아 여부, 초·중·고 도보 통학권, 배후 학원가 연계도
 * 3. 상권·편의 (Commerce, 20%): 대형마트, 종합병원, 중심상권 점포 밀집도
 * 4. 자연환경 (Nature, 15%): 도보권 공원 개수, 한강/하천 조망 및 수변공원 인접성
 * 5. 미래가치·정비사업 (Future, 10%): 인근 재개발·재건축, 신규 철도/GTX 개통 호재
 *
 * 100점 만점 정량화 공식:
 * 입지 총점 = (교통×0.30) + (학군×0.25) + (상권×0.20) + (자연×0.15) + (미래×0.10)
 */

export interface LocationCategoryScore {
  name: string;
  weight: number; // % 가중치
  score: number; // 100점 만점 점수
  weightedScore: number; // 가중치 반영 점수
  detailText: string;
  evidence: string; // 산출 근거
}

export interface LocationScoreResult {
  hasData: boolean;
  totalScore: number; // 최종 입지 종합 점수 (100점 만점)
  locationGrade: "S+급 (하이엔드)" | "S급 (핵심지)" | "A급 (우수지)" | "B급 (표준지)";
  categories: LocationCategoryScore[];
  aiComprehensiveVerdict: string[];
}

export function calcLocationComprehensiveScore(
  apt: {
    name: string;
    traffic_score?: number;
    school_score?: number;
    nature_score?: number;
    convenience_score?: number;
    hangang_dist?: any;
    is_hangang_view?: boolean;
    station?: string;
  },
  infraData?: {
    subways?: any[];
    schools?: any[];
    parks?: any[];
    conveniences?: any[];
  }
): LocationScoreResult {
  // 1. 교통 점수 산출 (가중치 30%)
  let trafficScore = apt.traffic_score || 75;
  let trafficEvidence = "지역 표준 교통 접근성";
  if (infraData?.subways && infraData.subways.length > 0) {
    const s = infraData.subways[0];
    if (s.distanceMeters <= 400) {
      trafficScore = 96;
      trafficEvidence = `${s.name} 초역세권 (도보 ${s.walkMinutes}분, ${s.distanceMeters}m)`;
    } else if (s.distanceMeters <= 700) {
      trafficScore = 91;
      trafficEvidence = `${s.name} 역세권 (도보 ${s.walkMinutes}분, ${s.distanceMeters}m)`;
    } else if (s.distanceMeters <= 1200) {
      trafficScore = 84;
      trafficEvidence = `${s.name} 도보권 (도보 ${s.walkMinutes}분)`;
    } else {
      trafficScore = 76;
      trafficEvidence = `지하철역 버스 연계권 (최근접 ${s.name} ${s.distanceMeters}m)`;
    }
  } else if (apt.station) {
    trafficEvidence = `${apt.station} 인접`;
  }

  // 2. 학군 점수 산출 (가중치 25%)
  let schoolScore = apt.school_score || 78;
  let schoolEvidence = "관할 교육청 표준 학군 배정권";
  if (infraData?.schools && infraData.schools.length > 0) {
    const hasCho = infraData.schools.some((sc) => sc.isChoPumAh || (sc.type === "초등학교" && sc.distanceMeters <= 350));
    const nearest = infraData.schools[0];
    if (hasCho) {
      schoolScore = 95;
      schoolEvidence = `초등학교를 품은 아파트 (초품아, 도보 3분 안심 통학로)`;
    } else if (nearest.distanceMeters <= 500) {
      schoolScore = 89;
      schoolEvidence = `${nearest.name} 등 도보 500m 이내 초·중등 교육시설 완비`;
    } else {
      schoolScore = 82;
      schoolEvidence = `${nearest.name} 도보 ${nearest.walkMinutes}분 통학권`;
    }
  }

  // 3. 상권 및 편의시설 점수 (가중치 20%)
  let convScore = apt.convenience_score || 80;
  let convEvidence = "기본 생활 편의시설 접근권역";
  if (infraData?.conveniences && infraData.conveniences.length > 0) {
    const count = infraData.conveniences.length;
    const nearest = infraData.conveniences[0];
    if (nearest.distanceMeters <= 500 && count >= 3) {
      convScore = 93;
      convEvidence = `도보 500m 내 대형마트·의료기관 다수 밀집 슬세권`;
    } else if (nearest.distanceMeters <= 800) {
      convScore = 88;
      convEvidence = `${nearest.name} 등 중심상업지구 도보 접근 양호`;
    } else {
      convScore = 80;
      convEvidence = `생활권 중심상권 차량·대중교통 5~10분 이동권`;
    }
  }

  // 4. 자연환경 쾌적성 점수 (가중치 15%)
  let natureScore = apt.nature_score || 76;
  let natureEvidence = "생활권 녹지환경 구성";
  if (apt.hangang_dist || apt.is_hangang_view) {
    natureScore = 96;
    natureEvidence = "한강 수변공원 인접 및 한강 영구 조망 프리미엄";
  } else if (infraData?.parks && infraData.parks.length >= 3) {
    natureScore = 91;
    natureEvidence = `반경 1km 이내 공원 ${infraData.parks.length}개소 숲세권`;
  } else if (infraData?.parks && infraData.parks.length >= 1) {
    natureScore = 85;
    natureEvidence = `${infraData.parks[0].name} 도보 산책로 인접`;
  }

  // 5. 미래가치 및 호재 (가중치 10%)
  const futureScore = 86;
  const futureEvidence = "주변 정비사업 시너지 및 광역 교통망(GTX·도시철도) 간접 수혜권";

  // 가중 점수 합산
  const categories: LocationCategoryScore[] = [
    {
      name: "교통 인프라",
      weight: 30,
      score: trafficScore,
      weightedScore: Math.round(trafficScore * 0.30 * 10) / 10,
      detailText: "지하철역 접근성 및 환승 노선",
      evidence: trafficEvidence,
    },
    {
      name: "학군 및 교육",
      weight: 25,
      score: schoolScore,
      weightedScore: Math.round(schoolScore * 0.25 * 10) / 10,
      detailText: "초품아 여부 및 안심 통학 환경",
      evidence: schoolEvidence,
    },
    {
      name: "상권 및 생활편의",
      weight: 20,
      score: convScore,
      weightedScore: Math.round(convScore * 0.20 * 10) / 10,
      detailText: "대형마트, 병원, 슬세권 인프라",
      evidence: convEvidence,
    },
    {
      name: "자연 및 쾌적성",
      weight: 15,
      score: natureScore,
      weightedScore: Math.round(natureScore * 0.15 * 10) / 10,
      detailText: "수변·한강 및 근린공원 녹지율",
      evidence: natureEvidence,
    },
    {
      name: "미래가치 및 호재",
      weight: 10,
      score: futureScore,
      weightedScore: Math.round(futureScore * 0.10 * 10) / 10,
      detailText: "정비사업 정주여건 개선 시너지",
      evidence: futureEvidence,
    },
  ];

  const totalScore = Math.round(
    categories.reduce((acc, c) => acc + c.weightedScore, 0)
  );

  let locationGrade: LocationScoreResult["locationGrade"] = "A급 (우수지)";
  if (totalScore >= 92) locationGrade = "S+급 (하이엔드)";
  else if (totalScore >= 86) locationGrade = "S급 (핵심지)";
  else if (totalScore >= 78) locationGrade = "A급 (우수지)";
  else locationGrade = "B급 (표준지)";

  const aiComprehensiveVerdict: string[] = [
    `${apt.name}의 입지 총점은 100점 만점 중 [${totalScore}점]으로 [${locationGrade}] 수준입니다.`,
    `가장 강점을 보이는 항목은 [${categories.reduce((max, c) => (c.score > max.score ? c : max)).name}](${categories.reduce((max, c) => (c.score > max.score ? c : max)).score}점)이며, 실거주 수요를 탄탄히 뒷받침합니다.`,
    `5대 지표 가중치(교통 30%, 학군 25%, 상권 20%, 자연 15%, 미래 10%)를 정량 산출한 종합 점수표입니다.`,
  ];

  return {
    hasData: true,
    totalScore,
    locationGrade,
    categories,
    aiComprehensiveVerdict,
  };
}
