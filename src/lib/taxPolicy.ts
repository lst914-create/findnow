/**
 * 부동산 세법 정책 및 세율/공제 기준 설정 파일
 *
 * 매년 세법 개정 시 이 파일의 수치만 변경하면 전체 시뮬레이션 및 UI 안내 문구가 자동으로 동기화됩니다.
 *
 * 기준: 2026년 현행 세법 (지방세법, 종합부동산세법, 소득세법)
 * 금액 단위: 만원 (10000 = 1억원)
 */

export interface TaxPolicyConfig {
  /** 적용 세법 연도 표기 */
  effectiveYear: string;
  /** 기준일자 */
  lastUpdated: string;
  /** 정책 버전 */
  version: string;

  /** 1. 공시가격 및 공정시장가액비율 */
  officialPriceRealizationRate: number;      // 공시가격 현실화율 (약 69%)
  propertyTaxMarketRatioSingle: number;      // 재산세 공정시장가액비율 (1주택자 특례: 45%)
  propertyTaxMarketRatioMulti: number;       // 재산세 공정시장가액비율 (다주택자: 60%)
  compTaxMarketRatio: number;                // 종합부동산세 공정시장가액비율 (60%)

  /** 2. 종합부동산세 기본공제액 (만원 단위) */
  compTaxDeductions: {
    singleOwner: number;                     // 1세대 1주택 단독명의: 12억원 (120,000만원)
    jointOwner: number;                      // 부부 공동명의 합산: 18억원 (인당 9억 × 2)
    multiOwner: number;                      // 다주택자: 인당 9억원 (90,000만원)
  };

  /** 3. 양도소득세 비과세 및 장특공 기준 */
  capitalGains: {
    singleExemptionLimit: number;            // 1주택 비과세 실거래가 상한선: 12억원 (120,000만원)
    holdingRequirementYears: number;         // 비과세 보유/거주 요건: 2년
    singleSpecialDeductionPerYear: number;   // 1주택 연간 장특공율 (보유 4% + 거주 4% = 8%)
    singleSpecialDeductionMax: number;       // 1주택 최대 장특공율: 80% (0.80)
    multiSpecialDeductionMax: number;        // 다주택 최대 장특공율: 30% (0.30)
    basicDeduction: number;                  // 연간 인별 양도소득 기본공제: 250만원
  };

  /** 4. 취득세 세율 기준 */
  acquisition: {
    singleThresholdLow: number;              // 6억원 이하 (60,000만원)
    singleThresholdHigh: number;             // 9억원 초과 (90,000만원)
    singleRateLow: number;                   // 1.0%
    singleRateHigh: number;                  // 3.0%
    multiAdjusted2Rate: number;              // 조정지역 2주택: 8.0%
    multiAdjusted3Rate: number;              // 조정지역 3주택 이상: 12.0%
    multiNonAdjusted3Rate: number;           // 비조정지역 3주택: 8.0%
  };
}

export const CURRENT_TAX_POLICY: TaxPolicyConfig = {
  effectiveYear: "2026년 개정 세법",
  lastUpdated: "2026.01.01",
  version: "2026.1",

  // 1. 비율 설정
  officialPriceRealizationRate: 0.69,
  propertyTaxMarketRatioSingle: 0.45,
  propertyTaxMarketRatioMulti: 0.60,
  compTaxMarketRatio: 0.60,

  // 2. 종부세 기본공제
  compTaxDeductions: {
    singleOwner: 120000,   // 12억원
    jointOwner: 180000,    // 18억원 (인당 9억)
    multiOwner: 90000,     // 9억원
  },

  // 3. 양도소득세
  capitalGains: {
    singleExemptionLimit: 120000,          // 12억원 이하 비과세
    holdingRequirementYears: 2,            // 2년 이상 보유/거주
    singleSpecialDeductionPerYear: 0.08,   // 연 8%
    singleSpecialDeductionMax: 0.80,       // 최대 80%
    multiSpecialDeductionMax: 0.30,        // 최대 30%
    basicDeduction: 250,                   // 250만원
  },

  // 4. 취득세
  acquisition: {
    singleThresholdLow: 60000,             // 6억원
    singleThresholdHigh: 90000,            // 9억원
    singleRateLow: 0.01,                   // 1%
    singleRateHigh: 0.03,                  // 3%
    multiAdjusted2Rate: 0.08,              // 8%
    multiAdjusted3Rate: 0.12,              // 12%
    multiNonAdjusted3Rate: 0.08,           // 8%
  },
};
