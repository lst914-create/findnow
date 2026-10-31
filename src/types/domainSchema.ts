/**
 * 데이터베이스 엔티티 및 신규 테이블 도메인 스키마 (TypeScript Types)
 *
 * 이미지 요구사항 6대 핵심 테이블:
 * 1. redevelopment_projects (정비사업 영구 저장)
 * 2. redevelopment_notices (공고 이력 및 단계 변경 근거)
 * 3. commercial_stores (개별 점포 정보)
 * 4. data_sources (출처 및 이용 조건 관리)
 * 5. data_sync_logs (수집 성공·실패 및 갱신 이력)
 * 6. apartment_nearby_summary (주변 정보 집계 결과 캐시)
 */

import { Coordinate, BoundingBox } from "./commonLocation";

// ────────────────────────────────────────────────────────────────
// 1. redevelopment_projects (정비사업 마스터)
// ────────────────────────────────────────────────────────────────

export type RedevelopmentStageType =
  | "기본계획수립"
  | "정비구역지정"
  | "추진위원회승인"
  | "조합설립인가"
  | "건축심의"
  | "사업시행인가"
  | "관리처분인가"
  | "이주철거"
  | "착공"
  | "일반분양"
  | "준공"
  | "해제"
  | "미정";

export interface RedevelopmentProjectEntity {
  id: string;                         // 구역 식별자 (PK)
  name: string;                       // 사업명/구역명
  status: RedevelopmentStageType;     // 현재 진행 단계
  status_date?: string;               // 단계 인가/고시일 (YYYY-MM-DD)
  geometry?: {
    type: "MultiPolygon" | "Polygon";
    coordinates: number[][][] | number[][][][];
  };                                  // GeoJSON 경계 다각형 (PostGIS geometry)
  source_id: string;                  // data_sources 참조 (기본: 'national-redevelopment')
  bjd_code?: string;                  // 10자리 법정동 코드
  sido: string;
  sigungu: string;
  dong?: string;
  lat: number;
  lng: number;
  planned_units?: number;             // 예정 세대수
  area_sqm?: number;                  // 구역 면적 (m²)
  builder?: string;                   // 시공사
  created_at: string;
  updated_at: string;
}

// ────────────────────────────────────────────────────────────────
// 2. redevelopment_notices (공고 이력 및 단계 변경 근거)
// ────────────────────────────────────────────────────────────────

export interface RedevelopmentNoticeRecord {
  id: string;                         // UUID (PK)
  project_id: string;                 // redevelopment_projects 참조 (FK)
  title: string;                      // 고시·공고 제목 (예: "관리처분계획인가 고시")
  published_at: string;               // 공고일자 (YYYY-MM-DD)
  source_url?: string;                // 공식 고시 URL (보존 근거)
  source_name: string;                // 발행 기관 (예: "관악구청", "서울시보")
  detected_stage?: RedevelopmentStageType; // 텍스트 마이닝으로 추출된 단계
  is_verified: boolean;               // 단계 확정 여부 (역행 검증 통과 여부)
  created_at: string;
}

// ────────────────────────────────────────────────────────────────
// 3. commercial_stores (개별 상가 점포)
// ────────────────────────────────────────────────────────────────

export interface CommercialStoreEntity {
  store_id: string;                   // 점포 고유번호 (bizesId, PK)
  name: string;                       // 상호명
  branch_name?: string;               // 지점명
  category_code: string;              // 상권업종 대분류 코드 (Q, D, I 등)
  category_name: string;              // 대분류명 (음식, 소매 등)
  address: string;                    // 도로명 또는 지번 주소
  bjd_code?: string;                  // 10자리 법정동 코드
  lat: number;                        // WGS84 위도
  lng: number;                        // WGS84 경도
  collected_at: string;               // 수집일시 (ISO 8601)
  data_source_id: string;             // data_sources 참조 (기본: 'store-info')
}

// ────────────────────────────────────────────────────────────────
// 4. data_sources (출처 및 이용 조건 관리)
// ────────────────────────────────────────────────────────────────

export interface DataSourceRecord {
  source_id: string;                  // 출처 식별자 (PK, 예: 'apt-trade', 'national-redevelopment')
  provider: string;                   // 제공 기관 (국토교통부, 한국부동산원, 소상공인시장진흥공단 등)
  source_name: string;                // 공식 데이터셋명
  source_url: string;                 // 포털 또는 API URL
  update_cycle: string;               // 갱신 주기 (실시간, 월 1회, 연 1회 등)
  terms_checked_at?: string;          // 이용 약관 및 제공 규정 최종 검토일시
  usage_terms?: string;               // 이용 조건 및 라이선스 유의사항
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ────────────────────────────────────────────────────────────────
// 5. data_sync_logs (수집 성공·실패 및 갱신 이력)
// ────────────────────────────────────────────────────────────────

export type SyncStatusType = "SUCCESS" | "FAILED" | "PARTIAL" | "RUNNING";

export interface DataSyncLog {
  id: number;                         // BIGSERIAL (PK)
  source_id: string;                  // data_sources 참조 (FK)
  started_at: string;                 // 수집 시작 시각
  finished_at?: string;               // 수집 완료 시각
  status: SyncStatusType;             // 상태
  records_count: number;              // 수집/갱신된 레코드 건수
  error_message?: string;             // 오류 메시지 (실패 시)
  execution_type?: "CRON" | "MANUAL" | "API";
  metadata?: Record<string, unknown>;
}

// ────────────────────────────────────────────────────────────────
// 6. apartment_nearby_summary (주변 정보 집계 결과 캐시)
// ────────────────────────────────────────────────────────────────

export interface ApartmentNearbySummary {
  id?: string;                        // UUID
  apartment_id: string;               // apartments 참조 (FK)
  radius_m: number;                   // 집계 반경 (1000m, 3000m 등)
  summary_date: string;               // 집계 기준일 (YYYY-MM-DD)
  redev_count: number;                // 반경 내 정비사업 구역 수
  redev_planned_units: number;        // 정비사업 총 예정 세대수
  supply_units: number;               // 3개년 입주 예정 세대수
  store_count: number;                // 반경 내 총 상가 점포 수
  top_categories: Array<{
    code: string;
    name: string;
    count: number;
    ratio: number;
  }>;                                 // JSONB 저장 필드
  created_at: string;
  expires_at?: string;                // 캐시 만료 시각 (보통 7일 후 갱신)
}
