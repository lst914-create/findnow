/**
 * P1: 아파트 상세 – 주변 정비사업 연결 타입
 *
 * 국토교통부 전국 도시정비사업 통합관리 데이터를 기반으로
 * 특정 아파트 단지의 반경(기본 1km) 내 정비사업 구역 목록을 제공합니다.
 */

import { DataSourceMeta } from "./dataSource";

/** 정비사업 유형 */
export type RedevelopmentType =
  | "재개발"
  | "재건축"
  | "도시환경정비"
  | "주거환경개선"
  | "가로주택정비"
  | "소규모재건축"
  | "소규모재개발"
  | "자율주택정비";

/** 정비사업 추진 단계 (대표 공통 단계) */
export type RedevelopmentStage =
  | "구역지정"
  | "조합설립"
  | "사업시행인가"
  | "관리처분인가"
  | "착공"
  | "준공"
  | "해제"
  | "미정";

/** 정비사업 단계별 색상·아이콘 매핑 (UI용) */
export const REDEVELOPMENT_STAGE_STYLE: Record<
  RedevelopmentStage,
  { color: string; bg: string; barColor: string; icon: string; order: number; progressPct: number; label: string }
> = {
  구역지정:   { color: "text-slate-600",  bg: "bg-slate-100",  barColor: "bg-slate-400",   icon: "📌", order: 1, progressPct: 15,  label: "초기 단계" },
  조합설립:   { color: "text-amber-700",  bg: "bg-amber-50",   barColor: "bg-amber-500",   icon: "🤝", order: 2, progressPct: 30,  label: "조합 결성" },
  사업시행인가: { color: "text-orange-700", bg: "bg-orange-50",  barColor: "bg-orange-500", icon: "📋", order: 3, progressPct: 50,  label: "인가 완료" },
  관리처분인가: { color: "text-blue-700",   bg: "bg-blue-50",    barColor: "bg-blue-600",   icon: "⚖️", order: 4, progressPct: 68,  label: "처분 확정" },
  착공:       { color: "text-indigo-700", bg: "bg-indigo-50",  barColor: "bg-indigo-600", icon: "🏗️", order: 5, progressPct: 82,  label: "공사 중" },
  준공:       { color: "text-emerald-700",bg: "bg-emerald-50", barColor: "bg-emerald-500",icon: "🏠", order: 6, progressPct: 100, label: "완료" },
  해제:       { color: "text-red-600",    bg: "bg-red-50",     barColor: "bg-red-500",    icon: "🚫", order: 0, progressPct: 0,   label: "사업 해제" },
  미정:       { color: "text-gray-500",   bg: "bg-gray-50",    barColor: "bg-gray-400",   icon: "❓", order: 0, progressPct: 5,   label: "미정" },
};

/** 단일 정비사업 구역 항목 */
export interface NearbyRedevelopmentZone {
  /** 구역 고유 ID */
  id: string;
  /** 사업 이름 (예: "성수1가 제1구역 재개발") */
  name: string;
  type: RedevelopmentType;
  stage: RedevelopmentStage;
  /** 지번·도로명 주소 */
  address: string;
  /** 법정동 코드 (10자리) */
  bjdCode?: string;
  /** 구역 중심 좌표 */
  lat: number;
  lng: number;
  /** 기준 아파트로부터 직선 거리 (미터) */
  distanceM: number;
  /** 예정 세대수 */
  plannedUnits?: number;
  /** 구역 면적 (m²) */
  areaM2?: number;
  /** 사업 시행자 */
  executor?: string;
  /** 이 구역이 대상 아파트 단지를 직접 포함하는지 여부 */
  includesTargetApt?: boolean;
  /** 링크 (내부 상세 페이지 또는 지자체 고시) */
  detailUrl?: string;
}

/** /api/redevelopment/nearby 응답 구조 */
export interface NearbyRedevelopmentResponse {
  aptId: string;
  aptName: string;
  radiusM: number;
  zones: NearbyRedevelopmentZone[];
  meta: DataSourceMeta;
}
