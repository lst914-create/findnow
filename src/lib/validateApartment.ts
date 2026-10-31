/**
 * P0: 실거래가·단지 기본정보 표본 검증 유틸리티
 *
 * 아파트 데이터의 기본 무결성을 검사합니다.
 * - 필수 필드 존재 여부
 * - 값 범위 합리성 (준공연도, 세대수, 위도·경도 등)
 * - 중복 단지 감지
 */

import { Apartment } from "@/lib/apartments";

/** 검증 결과 심각도 */
export type ValidationSeverity = "ERROR" | "WARN" | "INFO";

/** 단일 검증 이슈 */
export interface ValidationIssue {
  field: string;
  severity: ValidationSeverity;
  message: string;
  /** 실제 값 (디버그용) */
  value?: unknown;
}

/** 단지 검증 결과 */
export interface ApartmentValidationResult {
  aptId: string;
  aptName: string;
  isValid: boolean;         // ERROR가 없으면 true
  hasWarnings: boolean;
  issues: ValidationIssue[];
}

const CURRENT_YEAR = new Date().getFullYear();

/** 단일 아파트 데이터 검증 */
export function validateApartment(apt: Apartment): ApartmentValidationResult {
  const issues: ValidationIssue[] = [];

  // ── 필수 필드 ──────────────────────────────
  if (!apt.id || apt.id.trim() === "") {
    issues.push({ field: "id", severity: "ERROR", message: "ID가 비어있습니다." });
  }
  if (!apt.name || apt.name.trim() === "") {
    issues.push({ field: "name", severity: "ERROR", message: "단지명이 비어있습니다." });
  }
  if (!apt.region) {
    issues.push({ field: "region", severity: "ERROR", message: "지역(region) 정보가 없습니다." });
  }

  // ── 위치 좌표 ──────────────────────────────
  if (!apt.lat || !apt.lng) {
    issues.push({ field: "lat/lng", severity: "ERROR", message: "좌표가 없습니다." });
  } else {
    // 한국 영역 대략 필터 (33~39도, 124~132도)
    if (apt.lat < 33 || apt.lat > 39) {
      issues.push({ field: "lat", severity: "ERROR", message: `위도가 한국 범위 밖입니다.`, value: apt.lat });
    }
    if (apt.lng < 124 || apt.lng > 132) {
      issues.push({ field: "lng", severity: "ERROR", message: `경도가 한국 범위 밖입니다.`, value: apt.lng });
    }
  }

  // ── 준공연도 ──────────────────────────────
  if (!apt.built_year) {
    issues.push({ field: "built_year", severity: "WARN", message: "준공연도가 없습니다." });
  } else if (apt.built_year < 1960 || apt.built_year > CURRENT_YEAR + 5) {
    issues.push({ field: "built_year", severity: "WARN", message: `준공연도가 비정상입니다.`, value: apt.built_year });
  }

  // ── 세대수 ──────────────────────────────
  if (!apt.household_count || apt.household_count <= 0) {
    issues.push({ field: "household_count", severity: "WARN", message: "세대수가 0 이하입니다.", value: apt.household_count });
  } else if (apt.household_count > 20000) {
    issues.push({ field: "household_count", severity: "WARN", message: `세대수가 비정상적으로 큽니다.`, value: apt.household_count });
  }

  // ── 면적 ──────────────────────────────
  if (!apt.area_sqm || apt.area_sqm < 10 || apt.area_sqm > 1000) {
    issues.push({ field: "area_sqm", severity: "WARN", message: "면적 정보가 없거나 범위 밖입니다.", value: apt.area_sqm });
  }

  // ── 시세 ──────────────────────────────
  if (!apt.price_min || apt.price_min <= 0) {
    issues.push({ field: "price_min", severity: "INFO", message: "최소 시세가 없습니다." });
  }
  if (apt.price_min > 0 && apt.price_max > 0 && apt.price_min > apt.price_max) {
    issues.push({ field: "price_min/max", severity: "ERROR", message: "최소 시세가 최대 시세보다 큽니다.", value: { min: apt.price_min, max: apt.price_max } });
  }

  // ── 합성 단지 패턴 감지 ─────────────────────
  // 해시형 ID (예: abc123def456 형태의 32자리)
  if (/^[a-f0-9]{32}$/.test(apt.id)) {
    issues.push({ field: "id", severity: "WARN", message: "해시형 합성 ID가 감지되었습니다. 실제 K-apt 단지코드인지 확인 필요." });
  }

  const hasErrors = issues.some((i) => i.severity === "ERROR");
  const hasWarnings = issues.some((i) => i.severity === "WARN");

  return {
    aptId: apt.id,
    aptName: apt.name,
    isValid: !hasErrors,
    hasWarnings,
    issues,
  };
}

/** 전체 목록 일괄 검증 */
export function validateApartmentBatch(apts: Apartment[]): {
  total: number;
  valid: number;
  withWarnings: number;
  invalid: number;
  results: ApartmentValidationResult[];
  summary: string;
} {
  const results = apts.map(validateApartment);
  const valid = results.filter((r) => r.isValid && !r.hasWarnings).length;
  const withWarnings = results.filter((r) => r.isValid && r.hasWarnings).length;
  const invalid = results.filter((r) => !r.isValid).length;

  return {
    total: apts.length,
    valid,
    withWarnings,
    invalid,
    results,
    summary: `전체 ${apts.length}건 | 정상 ${valid} | 경고 ${withWarnings} | 오류 ${invalid}`,
  };
}

/** 중복 단지 감지 (이름+준공연도+지역 조합 기준) */
export function detectDuplicates(apts: Apartment[]): { key: string; duplicates: Apartment[] }[] {
  const map = new Map<string, Apartment[]>();
  for (const apt of apts) {
    const key = `${apt.name}|${apt.built_year}|${apt.region}`;
    const existing = map.get(key) ?? [];
    existing.push(apt);
    map.set(key, existing);
  }
  return Array.from(map.entries())
    .filter(([, group]) => group.length > 1)
    .map(([key, duplicates]) => ({ key, duplicates }));
}
