/**
 * P3: 중개업소 광고 및 유료 리포트 타입
 *
 * - 중개업소 광고: 공인중개사 회원이 단지 상세 페이지에 노출하는 광고 슬롯
 * - 유료 리포트: PRO 회원 전용 PDF/JSON 입지 분석 리포트
 */

import { DataSourceMeta } from "./dataSource";

// ─── 중개업소 광고 ──────────────────────────────────────────────

/** 광고 슬롯 위치 */
export type AdSlotPosition =
  | "apt_detail_top"     // 단지 상세 최상단
  | "apt_detail_sidebar" // 단지 상세 사이드바
  | "search_list_inline" // 검색 목록 인라인 (4번째 카드마다)
  | "regional_banner"    // 지역 분석 배너
  | "redevelopment_detail"; // 정비사업 상세

/** 공인중개사 광고 항목 */
export interface RealtorAd {
  id: string;
  /** 광고주 (공인중개사 회원 ID) */
  realtorId: string;
  /** 중개사무소 이름 */
  agencyName: string;
  /** 공인중개사 이름 */
  realtorName: string;
  /** 사무소 전화번호 */
  phone: string;
  /** 상담 가능 시간 (예: "평일 09:00-18:00") */
  availableHours?: string;
  /** 전문 단지 목록 (단지 ID) */
  specialtyAptIds: string[];
  /** 전문 지역 */
  specialtyRegions: string[];
  /** 검증된 중개사인지 (플랫폼 인증 여부) */
  isVerified: boolean;
  /** 인증 배지 종류 */
  badges?: ("공식파트너" | "실거래왕" | "신뢰중개사")[];
  /** 슬롯 위치 */
  slot: AdSlotPosition;
  /** 광고 시작일 */
  startDate: string;
  /** 광고 만료일 */
  endDate: string;
  /** 클릭 연결 URL 또는 1:1 채팅 트리거 */
  ctaType: "phone" | "chat" | "url";
  ctaTarget: string;
  /** 프로필 사진 URL */
  profileImageUrl?: string;
  /** 한 줄 소개 */
  tagline?: string;
}

/** 광고 슬롯 노출 기록 (수익화 추적용) */
export interface AdImpression {
  adId: string;
  aptId?: string;
  userId?: string;
  timestamp: string;
  action: "view" | "click" | "contact";
}

// ─── 유료 리포트 ────────────────────────────────────────────────

/** 리포트 종류 */
export type ReportType =
  | "apt_location"      // 아파트 입지 종합 분석
  | "redevelopment"     // 정비사업 수익성 시뮬레이션
  | "supply_demand"     // 수요·공급 전망 리포트
  | "commercial"        // 상권 분석 리포트
  | "school_district";  // 학군 상세 리포트

/** 리포트 상태 */
export type ReportStatus = "pending" | "generating" | "ready" | "failed";

/** 유료 리포트 메타데이터 */
export interface ReportMeta {
  id: string;
  type: ReportType;
  /** 리포트 제목 */
  title: string;
  /** 리포트 대상 (단지명, 지역명 등) */
  targetName: string;
  /** 대상 단지 ID (해당되는 경우) */
  aptId?: string;
  /** 요청자 사용자 ID */
  userId: string;
  status: ReportStatus;
  /** 요청 일시 */
  requestedAt: string;
  /** 생성 완료 일시 */
  completedAt?: string;
  /** 다운로드 URL (PDF) */
  downloadUrl?: string;
  /** 리포트에 포함된 데이터 출처 */
  dataSources: DataSourceMeta[];
  /** 유효 기간 만료일 (리포트는 발급 후 30일) */
  expiresAt: string;
  /** 가격 (원) */
  price: number;
  /** 결제 상태 */
  paymentStatus: "paid" | "free" | "refunded";
}

/** 리포트 섹션 정의 (동적 렌더링용) */
export interface ReportSection {
  id: string;
  title: string;
  type: ReportType;
  /** PRO 구독 없이 미리보기 가능한 섹션인지 */
  isPreview: boolean;
  /** 섹션 설명 (잠금 상태일 때 티저 문구로 사용) */
  description: string;
}

/** PRO 리포트에 포함될 섹션 정의 */
export const REPORT_SECTIONS: ReportSection[] = [
  {
    id: "location_score",
    title: "입지 종합 점수표 (항목별 상세 산출 근거 포함)",
    type: "apt_location",
    isPreview: false,
    description: "교통·학군·상권·자연환경·정비사업 근접도를 항목별 가중치로 계산한 입지 점수와 산출 근거를 공개합니다.",
  },
  {
    id: "price_trend_20y",
    title: "20년 실거래가 전체 이력 및 신저/신고가 분석",
    type: "apt_location",
    isPreview: false,
    description: "국토교통부 실거래가 원본 데이터 기반 과거 20년 거래 전체 이력과 신저가·신고가 분석.",
  },
  {
    id: "supply_1km",
    title: "반경 1km·3km·5km 입주 예정 물량 집계",
    type: "supply_demand",
    isPreview: true,
    description: "청약홈 기반 향후 3년 입주 예정 단지와 물량을 거리별로 정리합니다.",
  },
  {
    id: "redevelopment_sim",
    title: "정비사업 분담금·비례율 AI 시뮬레이션",
    type: "redevelopment",
    isPreview: false,
    description: "사업시행인가 기준 예상 분담금과 비례율을 AI로 계산합니다.",
  },
  {
    id: "school_district_detail",
    title: "학군 상세: 학교별 학업성취도·진학 실적",
    type: "school_district",
    isPreview: false,
    description: "나이스(NEIS) 기반 배정 초·중학교 학업성취도 및 고등학교 진학 실적.",
  },
];
