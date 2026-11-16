export interface Apartment {
  id: string;
  name: string;
  region: string;       // 예: "서울 강남구", "경기 남양주시"
  district: string;     // 예: "대치동", "다산동"
  bjd_code?: string | null; // 법정동 코드
  kapt_code?: string;   // K-apt 단지코드
  road_address?: string | null;
  jibun_address?: string | null;
  price_min: number;    // 만원 (없으면 0)
  price_max: number;    // 만원 (없으면 0)
  rent_min?: number;    // 만원 (전세 최소)
  rent_max?: number;    // 만원 (전세 최대)
  area_sqm?: number;
  area_pyeong: number;  // 없으면 33 (기본 33평)
  built_year?: number | null;
  household_count: number; // 없으면 0
  construction?: string;
  parking?: string;
  floor_area_ratio?: string;
  heating?: string;
  school_score: number;   // 없으면 0
  traffic_score: number;  // 없으면 0
  nature_score: number;   // 없으면 0
  tags?: string[];
  image_url?: string;
  station?: string;
  station_dist?: string;
  walk_minutes?: number;
  lat?: number | null;
  lng?: number | null;
  schools?: string[];
  description?: string;

  // 호갱노노 지도/슬라이더 필터 지원 메트릭
  far?: number;           // 용적률 (%)
  bcr?: number;           // 건폐율 (%)
  jeonseRatio?: number;   // 전세가율 (%)
  gapPrice?: number;      // 갭가격 (만원)
  rentalBizRatio?: number;// 임대사업율 (%)
  monthlyYield?: number;  // 월세수익률 (%)
  parkingRatio?: number;  // 세대당 주차대수
  hallType?: string;      // 현관구조 (계단식/복도식/혼합식)
  heatingType?: string;   // 난방방식 (지역난방/개별난방/중앙난방)
  // 한강/자연 환경 인접도
  hangang_dist?: string;  // 예: "도보 1분 (80m)", "도보 5분 (350m)"
  hangang_minutes?: number; // 한강까지 도보 분 (1, 3, 5 등)
  is_hangang_view?: boolean; // 영구 한강 조망 가능 여부

  // 국토교통부 공동주택 기본/상세 정보 (K-apt) 정밀 스펙
  dong_count?: number;          // 총 동수 (예: 8개동)
  floor_top?: number;           // 최고층 (예: 25층)
  floor_base?: number;          // 최저/지하층 (예: 지하 2층)
  approval_date?: string;       // 사용승인일 (예: "2016.08.24")
  developer?: string;           // 시행사
  parking_total?: number;       // 총 주차대수 (예: 120대)
  parking_ground?: number;      // 옥외(지상) 주차대수
  parking_underground?: number; // 옥내(지하) 주차대수
  ev_charger_count?: number;    // 전기차 충전기 설치 대수
  heatingFuel?: string;         // 난방연료 (도시가스 / 열병합 / 기름)
  managementType?: string;      // 관리방식 (위탁관리 / 자치관리)
  managementTel?: string;       // 관리사무소 전화번호
  cctvCount?: number;           // 단지 내 CCTV 대수
  elevatorCount?: number;       // 승강기 대수
  school_name?: string;         // 배정 초등학교명 (예: "서울역삼초등학교")
  school_dist?: string;         // 학교까지 거리 및 도보시간 (예: "도보 5분 (340m)")
  facilities?: string[];        // 단지 내 부대복리시설 (피트니스, 경로당, 어린이놀이터, 도서관 등)
  area_distributions?: { label: string; pyeong: number; units: number; ratio: number }[]; // 평형별 세대 구성
}

import masterApartments from "./apartments-master.json";

// 단지 데이터 정규화: optional 필드에 안전한 기본값 보장
function normalizeApartment(raw: Record<string, unknown>): Apartment {
  return {
    id: (raw.id as string) || "",
    name: (raw.name as string) || "",
    region: (raw.region as string) || "",
    district: (raw.district as string) || "",
    bjd_code: (raw.bjd_code as string | null) ?? null,
    kapt_code: (raw.kapt_code as string) || undefined,
    road_address: (raw.road_address as string | null) ?? null,
    jibun_address: (raw.jibun_address as string | null) ?? null,
    // ── 가격 (실거래가 없으면 0, 절대 임의 생성 금지) ──
    price_min: (raw.price_min as number) || 0,
    price_max: (raw.price_max as number) || 0,
    rent_min: (raw.rent_min as number) || 0,
    rent_max: (raw.rent_max as number) || 0,
    // ── 면적/평형 ──
    area_sqm: (raw.area_sqm as number) || undefined,
    area_pyeong: (raw.area_pyeong as number) || 33,
    // ── 준공 / 세대 (K-apt 단지상세 연동 전까지 0으로 초기화) ──
    built_year: (raw.built_year as number | null) ?? null,
    household_count: (raw.household_count as number) || 0,
    // ── 주소·위치 ──
    lat: (raw.lat as number | null) ?? null,
    lng: (raw.lng as number | null) ?? null,
    // ── 선택 필드 passthrough ──
    construction: (raw.construction as string) || undefined,
    parking: (raw.parking as string) || undefined,
    floor_area_ratio: (raw.floor_area_ratio as string) || undefined,
    heating: (raw.heating as string) || undefined,
    school_score: (raw.school_score as number) || 0,
    traffic_score: (raw.traffic_score as number) || 0,
    nature_score: (raw.nature_score as number) || 0,
    tags: (raw.tags as string[]) || undefined,
    image_url: (raw.image_url as string) || undefined,
    station: (raw.station as string) || undefined,
    station_dist: (raw.station_dist as string) || undefined,
    walk_minutes: (raw.walk_minutes as number) || undefined,
    schools: (raw.schools as string[]) || undefined,
    description: (raw.description as string) || undefined,
    far: (raw.far as number) || undefined,
    bcr: (raw.bcr as number) || undefined,
    jeonseRatio: (raw.jeonseRatio as number) || undefined,
    gapPrice: (raw.gapPrice as number) || undefined,
    rentalBizRatio: (raw.rentalBizRatio as number) || undefined,
    monthlyYield: (raw.monthlyYield as number) || undefined,
    parkingRatio: (raw.parkingRatio as number) || undefined,
    hallType: (raw.hallType as string) || undefined,
    heatingType: (raw.heatingType as string) || undefined,
    hangang_dist: (raw.hangang_dist as string) || undefined,
    hangang_minutes: (raw.hangang_minutes as number) || undefined,
    is_hangang_view: (raw.is_hangang_view as boolean) || undefined,
    dong_count: (raw.dong_count as number) || undefined,
    floor_top: (raw.floor_top as number) || undefined,
    floor_base: (raw.floor_base as number) || undefined,
    approval_date: (raw.approval_date as string) || undefined,
    developer: (raw.developer as string) || undefined,
    parking_total: (raw.parking_total as number) || undefined,
    parking_ground: (raw.parking_ground as number) || undefined,
    parking_underground: (raw.parking_underground as number) || undefined,
    ev_charger_count: (raw.ev_charger_count as number) || undefined,
    heatingFuel: (raw.heatingFuel as string) || undefined,
    managementType: (raw.managementType as string) || undefined,
    managementTel: (raw.managementTel as string) || undefined,
    cctvCount: (raw.cctvCount as number) || undefined,
    elevatorCount: (raw.elevatorCount as number) || undefined,
    school_name: (raw.school_name as string) || undefined,
    school_dist: (raw.school_dist as string) || undefined,
    facilities: (raw.facilities as string[]) || undefined,
    area_distributions: (raw.area_distributions as Apartment["area_distributions"]) || undefined,
  };
}

// 전국 17개 시·도(서울, 경기, 인천, 부산, 대구, 대전, 광주, 울산, 세종 등) 국토교통부 K-apt 기반 공식 마스터 아파트 데이터셋
export const APARTMENTS_DATA: Apartment[] = (masterApartments as unknown as Record<string, unknown>[]).map(normalizeApartment);

// 단지별 가장 밀접한 핵심 특징 1가지 추출 헬퍼 (카드 양식 통일용)
export interface AptHighlightFeature {
  icon: string;
  label: string;
  badge?: string;
  theme: "blue" | "emerald" | "indigo" | "purple" | "rose" | "amber";
}

export function getApartmentHighlightFeature(apt: Apartment): AptHighlightFeature {
  // 1. 한강 인접/조망 (한강 도보 거리 또는 영구 한강조망 또는 한강 태그)
  if (apt.hangang_dist || apt.is_hangang_view || apt.tags?.some((t) => /한강|리버|강변|수변/.test(t))) {
    return {
      icon: "🌊",
      label: `한강 ${apt.hangang_dist || "도보 5~8분"}`,
      badge: apt.is_hangang_view ? "영구 한강조망" : "한강 프리미엄",
      theme: "blue",
    };
  }

  // 2. 하이엔드 랜드마크 단지
  if (apt.tags?.some((t) => /고가랜드마크|하이엔드|랜드마크/.test(t))) {
    const gu = apt.region.split(" ")[1] || apt.district;
    return {
      icon: "💎",
      label: `${gu} 최상위 하이엔드 랜드마크`,
      badge: "하이엔드 랜드마크",
      theme: "purple",
    };
  }

  // 3. 초역세권 / 역세권 (역 이름 있거나 교통점수 90점 이상)
  if (apt.station) {
    const mins = apt.walk_minutes || 5;
    const isUltra = mins <= 3;
    return {
      icon: "🚇",
      label: `${apt.station} ${apt.station_dist || `도보 ${mins}분`}`,
      badge: isUltra ? "초역세권 (도보 3분)" : "역세권 프리미엄",
      theme: "indigo",
    };
  } else if ((apt.traffic_score ?? 0) >= 90) {
    return {
      icon: "🚇",
      label: `${apt.district} 쾌속 대중교통 인프라`,
      badge: `교통 최우수 (${apt.traffic_score}점)`,
      theme: "indigo",
    };
  }

  // 4. 초품아 / 명문 학군 특화
  if (apt.tags?.some((t) => /초품아|학군/.test(t)) || (apt.schools && apt.schools.length > 0) || (apt.school_score ?? 0) >= 88) {
    const schoolName = apt.schools?.[0] || "초등학교";
    return {
      icon: "🏫",
      label: `${schoolName} 안심통학권`,
      badge: apt.tags?.includes("초품아") ? "초품아 단지" : `명품학군 (${apt.school_score}점)`,
      theme: "emerald",
    };
  }

  // 5. 대단지 (1,000세대 이상)
  if ((apt.household_count ?? 0) >= 1000) {
    return {
      icon: "🏗️",
      label: `${(apt.household_count ?? 0).toLocaleString()}세대 대단지 인프라`,
      badge: "대단지 프리미엄",
      theme: "purple",
    };
  }

  // 6. 신축 아파트 (5년 이내 준공)
  if ((apt.built_year ?? 0) >= 2021) {
    return {
      icon: "✨",
      label: `${apt.built_year}년 준공 최신축 단지`,
      badge: `${2026 - (apt.built_year ?? 2026)}년차 신축`,
      theme: "amber",
    };
  }

  // 7. 재건축/미래가치 유망 단지 (30년 이상 구축)
  if ((apt.built_year ?? 9999) <= 1996 || apt.tags?.some((t) => /재건축|재개발/.test(t))) {
    return {
      icon: "🔨",
      label: `재건축 추진 및 미래 투자 가치`,
      badge: "정비사업 유망",
      theme: "rose",
    };
  }

  // 8. 숲세권 / 쾌적한 자연환경
  if ((apt.nature_score ?? 0) >= 85 || apt.tags?.some((t) => /공원|숲|자연/.test(t))) {
    return {
      icon: "🌳",
      label: `도심 속 쾌적한 숲세권·공원 인프라`,
      badge: "친환경 에코",
      theme: "emerald",
    };
  }

  // 9. 기본 안심 생활 인프라
  return {
    icon: "🌟",
    label: `${apt.district} 중심 핵심 생활 인프라`,
    badge: "생활권 우수",
    theme: "indigo",
  };
}
