/**
 * 권장 데이터 구조 (7대 핵심 엔티티 & 공통 공간·위치 모델)
 * 
 * [공통 지역·위치 데이터 원칙]
 * - 주소, 좌표(lat/lng), 법정동 코드(bjd_code), 데이터 기준일(base_date)을 공통 축으로 정렬
 * - 주소가 같더라도 서로 다른 데이터의 단지명이 다를 수 있고, 정비사업 구역은 단일 주소가 아닌 경계 영역일 수 있음
 * - 따라서 "주소 문자열만으로 연결하지 않고, 단지 고유 식별자 · 법정동 코드 · 좌표 · 구역 경계를 함께 활용"
 */

// ==============================================================================
// 1. 공통 지역·위치 데이터 모델 (Common Spatial Location Model)
// ==============================================================================
export interface CommonSpatialLocation {
  roadAddress?: string;
  jibunAddress?: string;
  lat: number;
  lng: number;
  bjdCode: string; // 법정동 코드 10자리 (예: 1168010100)
  sido: string;
  sigungu: string;
  dong: string;
  baseDate: string; // YYYY-MM-DD
}

// ==============================================================================
// 2. 7대 핵심 도메인 엔티티 정의
// ==============================================================================

/** [1] 아파트 단지 정보 */
export interface ApartmentEntity {
  id: string; // 단지 식별자 (K-apt 코드 또는 자체 규격화 ID)
  name: string; // 단지명
  bjdCode: string; // 법정동 코드
  sido: string;
  sigungu: string;
  eupmyeondong: string;
  roadAddress?: string;
  jibunAddress?: string;
  lat?: number;
  lng?: number;
  householdCount: number; // 세대수
  buildingCount?: number; // 동수
  builtYear?: number; // 준공년도
  useApprovalDate?: string; // 사용승인일
  builder?: string; // 시공사
  heatType?: string; // 난방방식
  parkingCount?: number; // 주차대수
  kaptCode?: string; // K-apt 단지코드
  baseDate: string;
}

/** [2] 실거래 이력 정보 (국토교통부 원시 거래 신고자료) */
export interface TransactionEntity {
  id: string;
  apartmentId?: string; // 매핑된 아파트 단지 FK
  bjdCode: string;
  tradeType: "매매" | "전세" | "월세";
  dealDate: string; // YYYY-MM-DD
  dealYear: number;
  dealMonth: number;
  dealDay?: number;
  price: number; // 거래금액 (만원)
  monthlyRent: number; // 월세 (만원)
  areaSqm: number; // 전용면적 (㎡)
  floor?: number;
  aptNameRaw: string; // 원본 신고 단지명
  jibunRaw?: string;
  isCanceled: boolean; // 해제/취소 여부 (dealingGbn)
  cancelDate?: string;
  contractTerm?: string;
  dataSourceId: string; // 'apt-trade' | 'apt-rent'
  baseDate: string;
}

/** [3] 정비사업 구역 마스터 정보 */
export interface RedevelopmentProjectEntity {
  id: string; // 구역 식별자
  name: string; // 사업명/구역명
  bjdCode?: string;
  sido: string;
  sigungu: string;
  dong?: string;
  projectType: string; // 재개발, 재건축, 가로주택 등
  stage: string; // 구역지정, 조합설립, 사업시행인가, 관리처분, 착공 등
  stageDate?: string;
  roadAddress?: string;
  jibunAddress?: string;
  lat?: number;
  lng?: number;
  boundaryGeoJson?: Record<string, unknown>; // 구역 경계 폴리곤
  plannedUnits?: number; // 예정 세대수
  areaSqm?: number;
  builder?: string;
  unionName?: string;
  hasLocation: boolean;
  dataTier: "BASELINE_ANNUAL" | "PATCHED_LOCAL_GOV";
  lastUpdateCycle: "ANNUAL" | "REALTIME_PATCH";
  updateSource: string;
  baseDate: string;
}

/** [4] 주택 공급 및 입주 예정 정보 (청약홈 / 공급 데이터) */
export interface HousingSupplyEntity {
  id: string;
  redevelopmentId?: string; // 연계된 정비사업 구역 FK
  apartmentId?: string; // 연계된 단지 FK
  complexName: string; // 공급 단지명
  bjdCode?: string;
  sido: string;
  sigungu: string;
  lat?: number;
  lng?: number;
  supplyType?: string; // 분양, 임대, 청약, 입주예정
  totalSupplyUnits: number; // 총 공급 세대수
  generalSupplyUnits?: number; // 일반 분양 세대수
  expectedMoveIn?: string; // 입주 예정일
  constructionCompany?: string;
  confirmationSource: string; // 청약홈, 지자체 입주예정물량 등
  sourceUrl?: string;
  baseDate: string;
}

/** [5] 상가·상권 점포 정보 (초기 업종 분포 분석용) */
export interface CommercialStoreEntity {
  id: string; // 점포 식별자 (bizesId)
  name: string; // 상호명
  branchName?: string;
  categoryMainCode: string;
  categoryMainName: string;
  categoryMidCode?: string;
  categoryMidName?: string;
  categorySubCode?: string;
  categorySubName?: string;
  bjdCode?: string;
  adongCode?: string;
  sido: string;
  sigungu: string;
  dong?: string;
  roadAddress?: string;
  jibunAddress?: string;
  lat?: number;
  lng?: number;
  collectedBaseDate?: string; // lastModTs
  dataSourceId: string;
}

/** [6] 데이터 출처 및 수집 주기 메타데이터 */
export interface DataSourceEntity {
  id: string;
  category: string;
  sourceName: string;
  provider: string;
  portalUrl: string;
  apiEndpoint?: string;
  updateCycle: string;
  usageTerms: string;
  statType: "RAW" | "INDEX" | "MASTER" | "PATCH";
  priority?: "필수" | "권장" | "보완";
  isActive: boolean;
  lastCollectedAt?: string;
}

/** 8대 공식 공공데이터 카탈로그 (Image 1 기준 Single Source of Truth) */
export const OFFICIAL_DATA_SOURCES: DataSourceEntity[] = [
  {
    id: "apt-trade",
    category: "아파트 매매 실거래가",
    sourceName: "국토교통부 실거래가 API",
    provider: "국토교통부",
    portalUrl: "https://data.go.kr",
    apiEndpoint: "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade",
    updateCycle: "실시간 / 거래신고 익일",
    usageTerms: "거래일, 가격, 면적, 층, 단지명, 지역코드 원시 자료. 임의 합성 금지",
    statType: "RAW",
    priority: "필수",
    isActive: true,
  },
  {
    id: "apt-rent",
    category: "전월세 거래",
    sourceName: "국토교통부 전월세 API",
    provider: "국토교통부",
    portalUrl: "https://data.go.kr",
    apiEndpoint: "https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent",
    updateCycle: "실시간 / 거래신고 익일",
    usageTerms: "보증금, 월세, 계약월, 면적, 단지명 원시 자료. 전세가율 계산 및 갱신여부 파악용",
    statType: "RAW",
    priority: "필수",
    isActive: true,
  },
  {
    id: "kapt-info",
    category: "아파트 기본정보",
    sourceName: "공동주택 기본정보 API (K-apt)",
    provider: "한국부동산원",
    portalUrl: "https://data.go.kr",
    apiEndpoint: "https://apis.data.go.kr/1613000/AptBasisInfoServiceV5",
    updateCycle: "실시간",
    usageTerms: "주소, 세대수, 동수, 난방방식 등 기본 스펙. 단지 마스터의 기준 출처",
    statType: "MASTER",
    priority: "필수",
    isActive: true,
  },
  {
    id: "rone-stats",
    category: "부동산 시장 통계",
    sourceName: "한국부동산원 R-ONE Open API",
    provider: "한국부동산원",
    portalUrl: "https://reb.or.kr/r-one",
    apiEndpoint: "https://www.reb.or.kr/r-one/openapi/SttsApiTblData.do",
    updateCycle: "월간 / 주간",
    usageTerms: "가격지수, 거래량 등 실제 제공 통계 항목. 표본 지표와 개별 실거래가 분리 운영",
    statType: "INDEX",
    priority: "권장",
    isActive: true,
  },
  {
    id: "molit-redev",
    category: "전국 정비사업",
    sourceName: "국토교통부 전국 도시정비사업 통합 데이터",
    provider: "국토교통부",
    portalUrl: "https://data.go.kr",
    apiEndpoint: "https://apis.data.go.kr/1613000/UrbRehabPrjInfoSvc",
    updateCycle: "연간 / 분기",
    usageTerms: "구역명, 사업 유형, 추진 단계, 예정 세대수, 위치 식별 가능 여부",
    statType: "MASTER",
    priority: "필수",
    isActive: true,
  },
  {
    id: "seoul-clean",
    category: "서울 정비사업",
    sourceName: "정비사업 정보몽땅 및 서울 열린데이터광장",
    provider: "서울특별시",
    portalUrl: "https://clean.seoul.go.kr",
    apiEndpoint: "http://openapi.seoul.go.kr:8088",
    updateCycle: "수시 / 고시 시점",
    usageTerms: "구역 위치, 사업 단계, 고시·공고, 변경 이력 보완",
    statType: "PATCH",
    priority: "보완",
    isActive: true,
  },
  {
    id: "sbiz-store",
    category: "전국 상가·상권",
    sourceName: "소상공인시장진흥공단 상가(상권)정보 API",
    provider: "소상공인시장진흥공단",
    portalUrl: "https://data.go.kr",
    apiEndpoint: "https://apis.data.go.kr/B553077/api/open/sdsc2",
    updateCycle: "반기별 갱신",
    usageTerms: "점포 식별자, 업종, 주소, 위·경도, 갱신 기준",
    statType: "RAW",
    priority: "필수",
    isActive: true,
  },
  {
    id: "geo-spatial",
    category: "지도·주소",
    sourceName: "공공데이터포털 및 지도 사업자 공식 개발자 문서",
    provider: "국토교통부 / 카카오",
    portalUrl: "https://developers.kakao.com",
    apiEndpoint: "https://dapi.kakao.com/v2/local",
    updateCycle: "실시간",
    usageTerms: "주소 정규화, 좌표 변환, 지도 표시 권한, 호출 제한",
    statType: "MASTER",
    priority: "필수",
    isActive: true,
  },
];

/** [7] 데이터 변경 이력 및 정합성 감사 로그 */
export interface DataChangeLogEntity {
  id: number;
  tableName: string;
  recordId: string;
  fieldName: string;
  oldValue?: string;
  newValue?: string;
  verifiedAt: string;
  changeReason: string;
  sourceName: string;
}

// ==============================================================================
// 3. 복합 정합성 연결 유틸리티 (단지 식별자 · 법정동 코드 · 좌표 · 경계)
// ==============================================================================

/**
 * 하버사인 공식 기반 두 좌표 간의 정확한 거리(미터) 계산
 */
export function calculateDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // 지구 반경 (미터)
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * 단지명 정규화 (공백, 기호, 괄호, 차수 통일)
 */
export function normalizeComplexName(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/[\s\-_(),.·]/g, "")
    .replace(/1차|ⅰ|i단지|1단지|Ⅰ/gi, "1")
    .replace(/2차|ⅱ|ii단지|2단지|Ⅱ/gi, "2")
    .replace(/3차|ⅲ|iii단지|3단지|Ⅲ/gi, "3")
    .replace(/4차|ⅳ|iv단지|4단지|Ⅳ/gi, "4")
    .replace(/이편한세상|e\-편한세상/gi, "e편한세상")
    .replace(/에스케이뷰|sk\s*view/gi, "sk뷰")
    .toLowerCase();
}

/**
 * 복합 키 기반 아파트 단지 매핑 함수
 * 
 * 1차: K-apt 고유 식별자 또는 단지 ID 정확 매칭
 * 2차: 동일 법정동 코드(bjd_code) + 정규화 단지명 일치 매칭
 * 3차: 동일 법정동 내 좌표 반경(150m 이내) 공간 근접 매칭
 */
export function matchApartmentByCompositeKey(
  target: {
    id?: string;
    kaptCode?: string;
    bjdCode?: string;
    name: string;
    lat?: number;
    lng?: number;
  },
  candidates: ApartmentEntity[]
): { matched: ApartmentEntity | null; matchType: "EXACT_ID" | "BJD_NAME" | "SPATIAL_PROXIMITY" | "NONE"; confidence: number } {
  // 1차: 고유 ID 또는 K-apt 코드 일치
  if (target.id || target.kaptCode) {
    const idMatch = candidates.find(
      (c) => (target.id && c.id === target.id) || (target.kaptCode && c.kaptCode === target.kaptCode)
    );
    if (idMatch) {
      return { matched: idMatch, matchType: "EXACT_ID", confidence: 1.0 };
    }
  }

  const normTargetName = normalizeComplexName(target.name);

  // 2차: 동일 법정동(bjdCode) 내 정규화 단지명 매칭
  if (target.bjdCode) {
    const bjdCandidates = candidates.filter(
      (c) => c.bjdCode.slice(0, 8) === target.bjdCode!.slice(0, 8)
    );
    for (const cand of bjdCandidates) {
      const normCandName = normalizeComplexName(cand.name);
      if (
        normCandName === normTargetName ||
        normCandName.includes(normTargetName) ||
        normTargetName.includes(normCandName)
      ) {
        return { matched: cand, matchType: "BJD_NAME", confidence: 0.9 };
      }
    }
  }

  // 3차: 좌표 기반 반경 매칭 (150m 이내이고 단지명 유사도 보완)
  if (target.lat && target.lng) {
    for (const cand of candidates) {
      if (!cand.lat || !cand.lng) continue;
      const dist = calculateDistanceMeters(target.lat, target.lng, cand.lat, cand.lng);
      if (dist <= 150) {
        const normCandName = normalizeComplexName(cand.name);
        const nameSimilarity =
          normCandName.includes(normTargetName) || normTargetName.includes(normCandName);
        if (nameSimilarity || dist <= 50) {
          return { matched: cand, matchType: "SPATIAL_PROXIMITY", confidence: 0.85 };
        }
      }
    }
  }

  return { matched: null, matchType: "NONE", confidence: 0 };
}

/**
 * 공간 분석 헬퍼: 기준 좌표로부터 반경(radiusMeters) 내 엔티티 필터링 및 거리순 정렬
 */
export function filterNearbyEntities<T extends { lat?: number; lng?: number }>(
  centerLat: number,
  centerLng: number,
  entities: T[],
  radiusMeters: number
): (T & { distanceMeters: number })[] {
  const result: (T & { distanceMeters: number })[] = [];

  for (const item of entities) {
    if (item.lat == null || item.lng == null) continue;
    const dist = calculateDistanceMeters(centerLat, centerLng, item.lat, item.lng);
    if (dist <= radiusMeters) {
      result.push({ ...item, distanceMeters: dist });
    }
  }

  return result.sort((a, b) => a.distanceMeters - b.distanceMeters);
}
