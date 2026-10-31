/**
 * P2: 상권 업종 분포 및 점포 수 변화 타입
 *
 * 소상공인시장진흥공단 상가상권정보(SDSC) API를 기반으로
 * 특정 좌표 반경 내 업종별 점포 현황을 분석합니다.
 *
 * ⚠️ 데이터 한계:
 *   - 점포 분포 분석 전용. 개별 점포의 매출·유동인구는 제공되지 않습니다.
 *   - 분기 갱신이므로 폐업/신규 점포 반영에 최장 3개월 지연이 있을 수 있습니다.
 */

import { DataSourceMeta } from "./dataSource";

/** 대분류 업종 코드 (소상공인 표준 분류 기반) */
export type IndustryCategoryCode =
  | "Q"   // 음식
  | "D"   // 소매
  | "R"   // 생활서비스
  | "I"   // 학문/교육
  | "J"   // 스포츠/여가
  | "F"   // 부동산
  | "G"   // 숙박
  | "H"   // 의료
  | "L"   // 관광/여행
  | "K"   // 금융/보험
  | "ETC";// 기타

/** 업종 카테고리 메타 (UI 표시용) */
export const INDUSTRY_CATEGORY_META: Record<
  IndustryCategoryCode,
  { label: string; emoji: string; color: string }
> = {
  Q:   { label: "음식",       emoji: "🍽️",  color: "#f97316" },
  D:   { label: "소매",       emoji: "🛒",  color: "#3b82f6" },
  R:   { label: "생활서비스",  emoji: "✂️",  color: "#8b5cf6" },
  I:   { label: "교육/학원",  emoji: "📚",  color: "#10b981" },
  J:   { label: "스포츠/여가", emoji: "🏋️", color: "#06b6d4" },
  F:   { label: "부동산",     emoji: "🏢",  color: "#6366f1" },
  G:   { label: "숙박",       emoji: "🛏️",  color: "#f59e0b" },
  H:   { label: "의료",       emoji: "🏥",  color: "#ef4444" },
  L:   { label: "관광/여행",  emoji: "✈️",  color: "#ec4899" },
  K:   { label: "금융/보험",  emoji: "🏦",  color: "#64748b" },
  ETC: { label: "기타",       emoji: "📦",  color: "#94a3b8" },
};

/** 업종별 집계 항목 */
export interface IndustryDistributionItem {
  code: IndustryCategoryCode;
  /** 업종 세부 이름 (예: "한식", "커피/음료") */
  subCategory?: string;
  /** 현재 점포 수 */
  count: number;
  /** 전 분기 대비 증감 */
  delta?: number;
  /** 전 분기 대비 증감률 (%) */
  deltaRatio?: number;
  /** 반경 내 전체 대비 비율 (%) */
  ratio: number;
}

/** 분기별 스냅샷 (트렌드 분석용) */
export interface StoreCountSnapshot {
  /** 기준 분기 (예: "2024-Q3") */
  quarter: string;
  totalCount: number;
  byCategory: Pick<IndustryDistributionItem, "code" | "count">[];
}

/** 상권 활성도 등급 */
export type CommercialActivityLevel =
  | "활성"      // 점포 증가 트렌드
  | "안정"      // 변화 미미
  | "약화"      // 점포 감소 트렌드
  | "알수없음";  // 스냅샷 부족

/** /api/commercial-district 응답 */
export interface CommercialDistrictResponse {
  lat: number;
  lng: number;
  radiusM: number;
  /** 총 점포 수 */
  totalStoreCount: number;
  /** 전 분기 대비 증감 */
  totalDelta?: number;
  /** 업종별 분포 (비율 내림차순) */
  distribution: IndustryDistributionItem[];
  /** 과거 4분기 스냅샷 (트렌드 차트용) */
  historicalSnapshots?: StoreCountSnapshot[];
  /** 상권 활성도 요약 */
  activityLevel: CommercialActivityLevel;
  meta: DataSourceMeta;
}
