/**
 * 데이터 거버넌스 및 신뢰성 메타데이터 모델 (Data Governance Model)
 *
 * 모든 데이터 엔티티(아파트, 정비사업 구역, 상가 점포, 실거래가)에 공통으로
 * 기록되어 데이터의 원천, 기준일, 수집일, 무결성 검증 상태를 보장합니다.
 */

import type { DataProvider } from "./dataSource";

export type ValidationStatus =
  | "VERIFIED"    // 공공기관 원천 또는 상호 교차검증 완료 (신뢰)
  | "SUSPECT"     // 시세 이상치, 세대수 불일치 등 이상 징후 감지 (주의 필요)
  | "UNVERIFIED"  // 외부 수집 직후 미검증 상태 (기본값)
  | "FLAGGED";    // 운영자 또는 사용자에 의해 오류로 마킹됨

export interface ValidationIssue {
  code: string;       // 이슈 코드 (예: "EXTREME_PRICE_GAP", "INVALID_BUILT_YEAR")
  message: string;    // 사용자 친화적 설명
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  detectedAt: string; // ISO 8601
}

export interface DataGovernanceRecord {
  /** 원천 데이터 제공 기관 */
  source: DataProvider;
  /** 사람이 읽을 수 있는 기관 레이블 */
  sourceLabel: string;
  /** 원천 데이터셋 URL 또는 API 식별자 */
  sourceUrl?: string;
  /** 데이터 기준일 (YYYY-MM-DD, 예: "2024-09-30") */
  referenceDate: string;
  /** 당사 시스템에 최초 수집된 일시 (ISO 8601) */
  collectedAt: string;
  /** 최종 갱신 일시 (ISO 8601) */
  updatedAt: string;
  /** 검증 상태 */
  validationStatus: ValidationStatus;
  /** 품질 신뢰 점수 (0 ~ 100) */
  reliabilityScore: number;
  /** 감지된 무결성 이슈 목록 */
  validationIssues: ValidationIssue[];
  /** 마지막 검증 일시 */
  lastVerifiedAt?: string;
  /** 검증 수행 주체 */
  verifiedBy?: "AUTOMATED_RULE" | "CROSS_SOURCE" | "OPERATOR";
  /** 비고 또는 주의사항 */
  limitation?: string;
}

/** 거버넌스 레코드 생성 헬퍼 */
export function makeGovernanceRecord(
  source: DataProvider,
  sourceLabel: string,
  referenceDate: string = new Date().toISOString().slice(0, 10),
  options?: Partial<DataGovernanceRecord>
): DataGovernanceRecord {
  const now = new Date().toISOString();
  return {
    source,
    sourceLabel,
    referenceDate,
    collectedAt: now,
    updatedAt: now,
    validationStatus: "UNVERIFIED",
    reliabilityScore: 80,
    validationIssues: [],
    verifiedBy: "AUTOMATED_RULE",
    ...options,
  };
}
