/**
 * P1: 데이터 출처·기준일·갱신일 타입 정의
 *
 * 목적: 서비스 전반에 표시되는 모든 데이터에 대한 출처와
 *       신뢰도를 사용자에게 투명하게 공개합니다.
 */

/** 원천 데이터 공급기관 코드 */
export type DataProvider =
  | "MOLIT_TRADE"       // 국토교통부 실거래가 (아파트 매매/전월세)
  | "MOLIT_KAPT"        // 국토교통부 공동주택 관리정보시스템 (K-apt)
  | "MOLIT_REDNV"       // 국토교통부 전국 도시정비사업 통합관리
  | "RONE_STAT"         // 한국부동산원 통계 (R-ONE, 가격지수/KB시세)
  | "RONE_APPLY"        // 한국부동산원 청약홈 (공급 일정)
  | "SDSC_STORE"        // 소상공인시장진흥공단 상가상권정보
  | "KAKAO_LOCAL"       // 카카오 로컬 API (POI, 주소 변환)
  | "USER_INPUT"        // 사용자 직접 입력
  | "COMPUTED"          // 내부 계산값 (거리·비율 등)
  | "UNKNOWN";          // 출처 미확인 (표시 경고 필요)

/** 데이터 신뢰 등급 */
export type DataTrustLevel =
  | "VERIFIED"    // 정부 공공데이터, 즉시 신뢰 가능
  | "DERIVED"     // 공공데이터에서 가공·파생된 값
  | "ESTIMATED"   // 추정값 (산식 기반)
  | "UNVERIFIED"; // 미검증

/** 개별 데이터 항목의 출처 메타데이터 */
export interface DataSourceMeta {
  /** 원천 기관 코드 */
  provider: DataProvider;
  /** 사람이 읽을 수 있는 출처 설명 (예: "국토교통부 실거래가 API") */
  providerLabel: string;
  /** 데이터 기준일 (ISO 8601, 예: "2024-09-30") */
  referenceDate: string;
  /** 마지막 갱신일시 (ISO 8601) */
  updatedAt: string;
  /** 갱신 주기 설명 (예: "월 1회", "연 1회", "실시간") */
  updateCycle: string;
  /** 신뢰 등급 */
  trustLevel: DataTrustLevel;
  /** 출처 URL 또는 API 엔드포인트 (선택) */
  sourceUrl?: string;
  /** 데이터 한계/주의사항 */
  limitation?: string;
}

/** API 응답에 항상 포함되어야 하는 출처 래퍼 */
export interface WithDataSource<T> {
  data: T;
  meta: DataSourceMeta;
}

/** 여러 출처가 혼합된 경우 (예: 단지 상세 = K-apt + 실거래가 합산) */
export interface MultiSourceMeta {
  sources: DataSourceMeta[];
  /** 데이터 조합 방법 설명 */
  mergeStrategy: string;
}

// ─── 공통 프리셋 ─────────────────────────────────────────────

export const DATA_SOURCE_PRESETS: Record<DataProvider, Omit<DataSourceMeta, "referenceDate" | "updatedAt">> = {
  MOLIT_TRADE: {
    provider: "MOLIT_TRADE",
    providerLabel: "국토교통부 실거래가",
    updateCycle: "계약일 기준 30일 내 신고·공개",
    trustLevel: "VERIFIED",
    sourceUrl: "https://www.data.go.kr/data/15057511/openapi.do",
    limitation: "계약 신고 후 최장 30일 지연 공개. 해제된 계약은 별도 표시되지 않을 수 있음.",
  },
  MOLIT_KAPT: {
    provider: "MOLIT_KAPT",
    providerLabel: "국토교통부 K-apt 공동주택관리정보",
    updateCycle: "분기 갱신",
    trustLevel: "VERIFIED",
    sourceUrl: "https://www.k-apt.go.kr",
    limitation: "입주자 관리비 정보는 입력 주체(관리사무소)에 따라 최신성이 다를 수 있음.",
  },
  MOLIT_REDNV: {
    provider: "MOLIT_REDNV",
    providerLabel: "국토교통부 전국 도시정비사업 통합관리",
    updateCycle: "연 1회 기본 갱신 (지자체 고시로 수시 보완)",
    trustLevel: "VERIFIED",
    limitation: "연간 베이스라인 데이터로, 최근 지자체 고시 변경은 지자체 고시·서울 정보몽땅 등으로 교차 확인 권장.",
  },
  RONE_STAT: {
    provider: "RONE_STAT",
    providerLabel: "한국부동산원 R-ONE 통계",
    updateCycle: "주간 / 월간 (지표별 상이)",
    trustLevel: "VERIFIED",
    sourceUrl: "https://www.r-one.co.kr",
    limitation: "표본 기반 가격지수이며, 국토부 실거래 개별 건과 집계 기준·용도가 다릅니다. 혼용 금지.",
  },
  RONE_APPLY: {
    provider: "RONE_APPLY",
    providerLabel: "한국부동산원 청약홈",
    updateCycle: "사업 공고 시 갱신",
    trustLevel: "VERIFIED",
    sourceUrl: "https://www.applyhome.co.kr",
  },
  SDSC_STORE: {
    provider: "SDSC_STORE",
    providerLabel: "소상공인시장진흥공단 상가상권정보",
    updateCycle: "분기 갱신",
    trustLevel: "VERIFIED",
    sourceUrl: "https://www.data.go.kr/data/15012005/fileData.do",
    limitation: "업종 분포 분석 용도. 점포별 매출·유동인구는 제공되지 않으므로 확정 상권지표로 오용 금지.",
  },
  KAKAO_LOCAL: {
    provider: "KAKAO_LOCAL",
    providerLabel: "카카오 로컬 API",
    updateCycle: "실시간 (POI DB 자체 갱신 주기에 따름)",
    trustLevel: "DERIVED",
    limitation: "주소·좌표 변환 및 POI 검색 목적. 행정구역 경계 등 공식 기준과 다를 수 있음.",
  },
  USER_INPUT: {
    provider: "USER_INPUT",
    providerLabel: "사용자 직접 입력",
    updateCycle: "즉시",
    trustLevel: "UNVERIFIED",
    limitation: "사용자가 직접 입력한 데이터로 검증되지 않았습니다.",
  },
  COMPUTED: {
    provider: "COMPUTED",
    providerLabel: "내부 계산값",
    updateCycle: "데이터 갱신 시 재계산",
    trustLevel: "DERIVED",
    limitation: "공공데이터 기반 계산값. 산식과 가정에 따라 실제와 차이가 있을 수 있습니다.",
  },
  UNKNOWN: {
    provider: "UNKNOWN",
    providerLabel: "출처 미확인",
    updateCycle: "알 수 없음",
    trustLevel: "UNVERIFIED",
    limitation: "데이터 출처를 확인하지 못했습니다. 참고용으로만 사용하십시오.",
  },
};

/** 지금 시각 기준 DataSourceMeta 를 빠르게 만드는 헬퍼 */
export function makeDataSourceMeta(
  provider: DataProvider,
  referenceDate: string = new Date().toISOString().slice(0, 10),
  extra?: Partial<DataSourceMeta>
): DataSourceMeta {
  return {
    ...DATA_SOURCE_PRESETS[provider],
    referenceDate,
    updatedAt: new Date().toISOString(),
    ...extra,
  };
}
