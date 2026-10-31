/**
 * P1: 입주 예정 물량 및 거리별 집계 타입
 *
 * 한국부동산원 청약홈(RONE_APPLY) + 국토교통부 실거래·인허가 데이터를 기반으로
 * 특정 기준점(단지 또는 지역) 반경별 입주 예정 물량을 집계합니다.
 *
 * ⚠️ 집계 기준:
 *   - 공급 물량 = 청약홈 공고 기준 세대수 (임대·분양 포함 구분 표시)
 *   - 실거래가·인허가 기반 준공 예정은 별도 레이어로 분리
 */

import { DataSourceMeta } from "./dataSource";

/** 공급 유형 */
export type SupplyType = "분양" | "임대" | "분양+임대" | "정비사업";

/** 반경 단계 (km) */
export type RadiusBucket = 0.5 | 1 | 2 | 3 | 5;
export const RADIUS_BUCKETS: RadiusBucket[] = [0.5, 1, 2, 3, 5];

/** 개별 입주 예정 단지 */
export interface SupplyUnit {
  /** 단지·사업 식별자 */
  id: string;
  /** 단지명 또는 사업명 */
  name: string;
  /** 공급 유형 */
  supplyType: SupplyType;
  /** 총 세대수 */
  totalUnits: number;
  /** 분양 세대수 (분양+임대 혼합 시 분리) */
  saleUnits?: number;
  /** 임대 세대수 */
  rentalUnits?: number;
  /** 입주 예정 연월 (예: "2025-03") */
  expectedMoveIn: string;
  /** 주소 */
  address: string;
  lat: number;
  lng: number;
  /** 기준점으로부터 직선 거리 (미터) */
  distanceM: number;
  /** 기준점으로부터 속하는 반경 버킷 */
  radiusBucket: RadiusBucket;
  /** 청약홈 공고 번호 (있는 경우) */
  applyId?: string;
  /** 시행사 */
  developer?: string;
}

/** 연도·분기별 집계 버킷 */
export interface SupplyBucket {
  /** 예: "2025-Q1", "2025" */
  period: string;
  totalUnits: number;
  saleUnits: number;
  rentalUnits: number;
  units: SupplyUnit[];
}

/** 반경별 집계 */
export interface SupplyByRadius {
  radiusM: number;
  totalUnits: number;
  /** 연도·분기별 분포 */
  byPeriod: SupplyBucket[];
}

/** /api/supply-volume 응답 */
export interface SupplyVolumeResponse {
  /** 기준 아파트 ID */
  aptId?: string;
  /** 기준 지역 코드 (예: "11650") */
  regionCode?: string;
  /** 기준 좌표 */
  lat: number;
  lng: number;
  /** 조회 기간 (예: "2024-01 ~ 2026-12") */
  period: string;
  /** 반경별 집계 (RADIUS_BUCKETS 순서) */
  byRadius: SupplyByRadius[];
  /** 전체 단지 목록 */
  units: SupplyUnit[];
  meta: DataSourceMeta;
}
