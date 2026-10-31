/**
 * P2: 관심 단지 & 단지 비교 스토어 타입
 *
 * - 관심 단지: 사용자가 즐겨찾기한 단지 목록 (로컬스토리지 + 서버 동기화)
 * - 단지 비교: 최대 3개 단지를 나란히 비교하는 기능
 */

import { Apartment } from "@/lib/apartments";

// ─── 관심 단지 ─────────────────────────────────────────────────

/** 관심 단지에 저장되는 최소 정보 */
export interface WatchlistItem {
  aptId: string;
  aptName: string;
  region: string;
  district: string;
  /** 북마크 추가 일시 */
  savedAt: string;
  /** 북마크 추가 시점의 최근 시세 (참고용) */
  priceAtSave?: number;
  /** 메모 (사용자 입력, 선택) */
  note?: string;
  /** 알림 설정 여부 */
  alertEnabled: boolean;
}

/** 알림 트리거 조건 */
export interface WatchlistAlert {
  aptId: string;
  /** 목표 가격 이하 매물 알림 */
  targetPriceBelowManwon?: number;
  /** 실거래 신규 등록 시 알림 */
  newTradeAlert: boolean;
  /** 정비사업 단계 변경 시 알림 */
  redevelopmentStageAlert: boolean;
  /** 알림 채널 */
  channels: ("push" | "kakao" | "email")[];
}

/** 관심 단지 스토어 상태 */
export interface WatchlistState {
  items: WatchlistItem[];
  alerts: WatchlistAlert[];
  /** 로드 상태 */
  status: "idle" | "loading" | "error";
  /** 서버 동기화 여부 */
  synced: boolean;
}

// ─── 단지 비교 ─────────────────────────────────────────────────

/** 비교 가능한 최대 단지 수 */
export const MAX_COMPARE_COUNT = 3;

/** 비교 항목 카테고리 */
export type CompareCategory =
  | "기본정보"
  | "가격·시세"
  | "단지시설"
  | "교통·역세권"
  | "학군"
  | "주변정비사업"
  | "상권";

/** 단일 비교 행 정의 */
export interface CompareRowDef {
  id: string;
  label: string;
  category: CompareCategory;
  /** Apartment 또는 확장 데이터에서 값을 추출하는 함수 */
  getValue: (apt: Apartment) => string | number | null;
  /** 숫자 비교 시 높을수록 좋은지 여부 (하이라이팅용) */
  higherIsBetter?: boolean;
  unit?: string;
}

/** 비교 스토어 상태 */
export interface CompareState {
  /** 비교 중인 단지 ID 배열 (최대 MAX_COMPARE_COUNT) */
  selectedIds: string[];
  /** 활성화된 비교 카테고리 */
  activeCategory: CompareCategory;
  /** 비교 패널 열림 여부 */
  panelOpen: boolean;
}

// ─── 로컬스토리지 키 상수 ──────────────────────────────────────

export const STORAGE_KEYS = {
  WATCHLIST: "chajwo_watchlist_v2",
  COMPARE: "chajwo_compare_v1",
  ALERTS: "chajwo_alerts_v1",
} as const;
