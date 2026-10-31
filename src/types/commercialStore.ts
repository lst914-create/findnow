/**
 * 소상공인시장진흥공단(SDSC) 표준 상가·상권 전용 데이터 모델
 *
 * 공공데이터포털 '상가(상권)정보 오픈API' 규격에 맞춰
 * 전국 점포, 업종 분류, 주소, 좌표 및 데이터 거버넌스 메타데이터를 관리합니다.
 */

import { StandardLocation } from "./commonLocation";
import { DataGovernanceRecord } from "./governance";
import { IndustryCategoryCode } from "./commercialDistrict";

/** 영업 상태 */
export type StoreBusinessStatus = "OPEN" | "CLOSED" | "UNKNOWN";

/** 개별 상가 점포 레코드 */
export interface CommercialStoreRecord {
  /** 상가업소번호 (고유 식별자, 예: "MA010120220805435948") */
  bizesId: string;
  /** 상호명 (예: "스타벅스 강남대로점") */
  bizesNm: string;
  /** 지점명 (예: "강남대로점") */
  brchNm?: string;

  /** 상권업종 대분류 코드 (Q: 음식, D: 소매, R: 생활서비스 등) */
  indsLclsCd: IndustryCategoryCode;
  indsLclsNm: string;
  /** 중분류 코드 및 명칭 (예: "Q12", "커피점/카페") */
  indsMclsCd: string;
  indsMclsNm: string;
  /** 소분류 코드 및 명칭 (예: "Q12A01", "커피전문점") */
  indsSclsCd: string;
  indsSclsNm: string;

  /** 한국표준산업분류 (KSIC) */
  ksicCd?: string;
  ksicNm?: string;

  /** 표준 위치 정보 */
  location: StandardLocation;

  /** 건물명 및 상세 층 */
  bldNm?: string;
  flrNo?: string;
  hoNo?: string;

  /** 영업 상태 */
  status: StoreBusinessStatus;

  /** 데이터 거버넌스 (출처·기준일·수집일·검증상태) */
  governance: DataGovernanceRecord;
}

/** 상권 구역 또는 반경 요약 집계 */
export interface CommercialDistrictSummary {
  /** 집계 기준 중심 좌표 */
  centerLat: number;
  centerLng: number;
  /** 집계 반경 (m) */
  radiusM: number;
  /** 해당 반경 내 총 점포 수 */
  totalStoreCount: number;
  /** 대분류별 점포 수 분포 */
  categoryBreakdown: Array<{
    code: IndustryCategoryCode;
    name: string;
    count: number;
    ratio: number; // 0 ~ 100 (%)
  }>;
  /** 상위 소분류 Top 5 인기 업종 (예: 커피전문점 42개, 한식 38개) */
  topSubCategories: Array<{
    name: string;
    count: number;
    ratio: number;
  }>;
  /** 대표 점포 샘플 (최대 10개) */
  sampleStores: Array<Pick<CommercialStoreRecord, "bizesId" | "bizesNm" | "indsMclsNm" | "location">>;
  /** 데이터 거버넌스 레코드 */
  governance: DataGovernanceRecord;
}
