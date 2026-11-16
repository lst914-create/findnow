/**
 * 국토교통부 공식 실거래가 연동 트랜잭션 캐시 모듈
 * - 하드코딩된 더미/가상 거래(PRESET) 완전 제거
 * - 국토교통부 공공데이터포털 공식 API에서 수집된 실제 거래 내역만 적재 및 표출
 */

export interface CachedTrade {
  aptName: string;
  dealAmount: number; // 만원
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  excluUseAr: number;
  floor: number;
  buildYear: number;
  umdNm: string;
}

export interface CachedRent {
  aptName: string;
  depositAmount: number; // 만원
  monthlyRent: number;
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  excluUseAr: number;
  floor: number;
  buildYear: number;
  umdNm: string;
}

// 가상/추정 프리셋 데이터 완전 제거 (공식 API 데이터만 수집·적재)
const PRESET_TRADES: Record<string, CachedTrade[]> = {};
const PRESET_RENTS: Record<string, CachedRent[]> = {};

/**
 * 사전 캐시된 확정 거래 조회 함수
 * - 더미/가상 합성을 원천 배제하고, 공식 데이터만 반환
 */
export function getPreloadedTransactions(apt: any): { trades: CachedTrade[]; rents: CachedRent[]; isPreset: boolean } {
  if (!apt || !apt.name) return { trades: [], rents: [], isPreset: false };

  // 단지 식별자 기반 캐시 확인
  if (apt.id && PRESET_TRADES[apt.id]) {
    return {
      trades: PRESET_TRADES[apt.id],
      rents: PRESET_RENTS[apt.id] || [],
      isPreset: true,
    };
  }

  // 더미/가상 거래 생성 없이 순수 빈 배열 반환 (라이브 API 호출로 처리)
  return { trades: [], rents: [], isPreset: false };
}
