/**
 * 권장 데이터 구조 (7대 테이블) 마이그레이션 및 변환 스크립트
 * 
 * [수행 작업]
 * 1. 기존 아파트 단지 데이터(APARTMENTS_DATA)를 7대 테이블의 `apartments` 엔티티로 정규화
 * 2. 기존 정비사업 구역 데이터(NATIONWIDE_REDEVELOPMENT_DATA)를 `redevelopment_projects` 엔티티로 정규화 (GeoJSON 폴리곤 경계 포함)
 * 3. 8대 공공데이터 출처 정보를 `data_sources`에 시딩
 * 4. Supabase DB 연결 시 자동 Upsert 적재 및 로컬 마스터 파일(data/master_*.json) 저장
 * 
 * 실행: npx tsx scripts/migrate-to-recommended-architecture.ts
 */

import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import { APARTMENTS_DATA } from "../src/lib/apartments";
import { NATIONWIDE_REDEVELOPMENT_DATA } from "../src/lib/nationwideZones";
import { REDEVELOPMENT_DATA } from "../src/lib/redevelopment";
import { findLawdCode } from "../src/lib/publicDataApi";
import {
  ApartmentEntity,
  RedevelopmentProjectEntity,
  DataSourceEntity,
} from "../src/lib/recommendedDataModel";

// ── 환경변수 로더 ─────────────────────────────────────────────────────────────
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const k = trimmed.slice(0, eqIdx).trim();
    const v = trimmed.slice(eqIdx + 1).trim();
    if (k && v && !process.env[k]) {
      process.env[k] = v;
    }
  }
}
loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && serviceKey ? createClient(supabaseUrl, serviceKey) : null;

// ── 8대 데이터 출처 마스터 목록 ──────────────────────────────────────────────
const DATA_SOURCES: DataSourceEntity[] = [
  {
    id: "apt-trade",
    category: "아파트 매매 실거래가",
    sourceName: "국토교통부 실거래가 공개시스템",
    provider: "국토교통부",
    portalUrl: "https://data.go.kr",
    apiEndpoint: "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade",
    updateCycle: "실시간 / 거래신고 익일",
    usageTerms: "개별 실거래 신고 건별 원시 자료. 표본 가격지수와 임의 합성 금지",
    statType: "RAW",
    isActive: true,
  },
  {
    id: "apt-rent",
    category: "전월세 거래",
    sourceName: "국토교통부 전월세 실거래가 공개시스템",
    provider: "국토교통부",
    portalUrl: "https://data.go.kr",
    apiEndpoint: "https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent",
    updateCycle: "실시간 / 거래신고 익일",
    usageTerms: "개별 임대차 계약 원시 자료. 전세가율 및 갱신여부 파악용",
    statType: "RAW",
    isActive: true,
  },
  {
    id: "kapt-info",
    category: "아파트 기본정보",
    sourceName: "공동주택 기본정보 서비스 (K-apt)",
    provider: "한국부동산원",
    portalUrl: "https://data.go.kr",
    apiEndpoint: "https://apis.data.go.kr/1613000/AptBasisInfoServiceV5",
    updateCycle: "실시간",
    usageTerms: "전국 의무관리대상 공동주택 기본 스펙 및 관리정보",
    statType: "MASTER",
    isActive: true,
  },
  {
    id: "rone-stats",
    category: "부동산 시장 통계",
    sourceName: "한국부동산원 R-ONE Open API",
    provider: "한국부동산원",
    portalUrl: "https://reb.or.kr/r-one",
    apiEndpoint: "https://www.reb.or.kr/r-one/openapi/SttsApiTblData.do",
    updateCycle: "월간 / 주간",
    usageTerms: "표본 기반 시장 가격지수(기준시점=100.0) 및 월간 거래량 통계. 개별 실거래가와 혼용 불가",
    statType: "INDEX",
    isActive: true,
  },
  {
    id: "national-redevelopment",
    category: "전국 정비사업",
    sourceName: "국토교통부 전국 도시정비사업 통합 데이터",
    provider: "국토교통부",
    portalUrl: "https://data.go.kr",
    apiEndpoint: "https://www.data.go.kr/data/15044691/fileData.do",
    updateCycle: "연간 갱신 (전국 기본 목록 베이스라인)",
    usageTerms: "전국 정비구역 마스터 베이스라인. 최근 변동 사항은 지자체 고시로 보완",
    statType: "MASTER",
    isActive: true,
  },
  {
    id: "seoul-redevelopment",
    category: "서울 정비사업",
    sourceName: "정비사업 정보몽땅 + 서울열린데이터광장",
    provider: "서울특별시",
    portalUrl: "https://data.seoul.go.kr",
    apiEndpoint: "https://openapi.seoul.go.kr:8088/{key}/json/HsmpInfo",
    updateCycle: "일별 / 수시",
    usageTerms: "서울시 정비사업 추진단계 및 고시·공고 실시간/수시 보완 패치",
    statType: "PATCH",
    isActive: true,
  },
  {
    id: "store-info",
    category: "전국 상가상권",
    sourceName: "소상공인시장진흥공단 상가(상권)정보 서비스",
    provider: "소상공인시장진흥공단",
    portalUrl: "https://data.go.kr",
    apiEndpoint: "https://apis.data.go.kr/B553077/api/open/sdsc2",
    updateCycle: "분기 / 수시",
    usageTerms: "초기 업종 분포 분석용. 점포 데이터만으로 매출액이나 유동인구 추정 금지",
    statType: "RAW",
    isActive: true,
  },
  {
    id: "geocoding",
    category: "지도·주소",
    sourceName: "카카오 로컬 REST API + 공공데이터포털 도로명주소",
    provider: "카카오 / 행정안전부",
    portalUrl: "https://developers.kakao.com",
    apiEndpoint: "https://dapi.kakao.com/v2/local",
    updateCycle: "실시간",
    usageTerms: "주소 정규화 및 WGS84 좌표계 변환",
    statType: "MASTER",
    isActive: true,
  },
];

// ── 1. 아파트 단지 정규화 변환 ────────────────────────────────────────────────
function transformApartments(): ApartmentEntity[] {
  const today = new Date().toISOString().slice(0, 10);

  return APARTMENTS_DATA.map((apt) => {
    const regionParts = (apt.region || "").split(" ");
    const sido = regionParts[0] || "전국";
    const sigungu = regionParts.slice(1).join(" ") || "";
    const lawd = findLawdCode(apt.region, apt.district);
    const bjdCode = lawd ? `${lawd.code}00000` : "0000000000";

    return {
      id: apt.id,
      name: apt.name,
      bjdCode,
      sido,
      sigungu,
      eupmyeondong: apt.district || "",
      roadAddress: `${apt.region} ${apt.district} ${apt.name}`.trim(),
      jibunAddress: `${apt.region} ${apt.district}`.trim(),
      lat: apt.lat,
      lng: apt.lng,
      householdCount: apt.household_count || 0,
      buildingCount: undefined,
      builtYear: apt.built_year,
      useApprovalDate: apt.built_year ? `${apt.built_year}-01-01` : undefined,
      builder: apt.construction,
      heatType: apt.heating,
      parkingCount: undefined,
      kaptCode: apt.id.startsWith("kapt_") ? apt.id.replace("kapt_", "") : undefined,
      baseDate: today,
    };
  });
}

// ── 2. 정비사업 구역 정규화 변환 ──────────────────────────────────────────────
function transformRedevelopmentProjects(): RedevelopmentProjectEntity[] {
  const today = new Date().toISOString().slice(0, 10);
  const map = new Map<string, RedevelopmentProjectEntity>();

  // 1) 전국 대표 구역
  for (const zone of NATIONWIDE_REDEVELOPMENT_DATA) {
    const lawd = findLawdCode(zone.region, zone.district);
    const bjdCode = lawd ? `${lawd.code}00000` : undefined;

    const boundaryGeoJson =
      zone.polygon && zone.polygon.length >= 3
        ? {
            type: "Polygon",
            coordinates: [zone.polygon.map((p) => [p.lng, p.lat])],
          }
        : undefined;

    map.set(zone.id, {
      id: zone.id,
      name: zone.name,
      bjdCode,
      sido: zone.region,
      sigungu: zone.district,
      dong: undefined,
      projectType: zone.type || "재개발",
      stage: zone.status || "추진중",
      stageDate: zone.statusDate ? zone.statusDate.replace(/\./g, "-") : undefined,
      roadAddress: zone.address,
      jibunAddress: zone.address,
      lat: zone.lat,
      lng: zone.lng,
      boundaryGeoJson,
      plannedUnits: zone.totalUnits,
      areaSqm: undefined,
      builder: undefined,
      unionName: undefined,
      hasLocation: !!(zone.lat && zone.lng) || !!zone.address,
      dataTier: "BASELINE_ANNUAL",
      lastUpdateCycle: "ANNUAL",
      updateSource: "국토교통부 전국 도시정비사업 통합 데이터 (연간 베이스라인)",
      baseDate: today,
    });
  }

  // 2) 서울시 정밀 구역 (서울 정비사업 정보몽땅 보완)
  for (const zone of REDEVELOPMENT_DATA) {
    const lawd = findLawdCode(zone.region, zone.district);
    const bjdCode = lawd ? `${lawd.code}00000` : undefined;

    const boundaryGeoJson =
      zone.polygon && zone.polygon.length >= 3
        ? {
            type: "Polygon",
            coordinates: [zone.polygon.map((p) => [p.lng, p.lat])],
          }
        : undefined;

    map.set(zone.id, {
      id: zone.id,
      name: zone.name,
      bjdCode,
      sido: zone.region || "서울",
      sigungu: zone.district || "",
      dong: undefined,
      projectType: zone.type || "재개발",
      stage: zone.status || "추진중",
      stageDate: zone.statusDate ? zone.statusDate.replace(/\./g, "-") : undefined,
      roadAddress: zone.address,
      jibunAddress: zone.address,
      lat: zone.lat,
      lng: zone.lng,
      boundaryGeoJson,
      plannedUnits: zone.totalUnits,
      areaSqm: undefined,
      builder: undefined,
      unionName: undefined,
      hasLocation: !!(zone.lat && zone.lng) || !!zone.address,
      dataTier: "PATCHED_LOCAL_GOV",
      lastUpdateCycle: "REALTIME_PATCH",
      updateSource: "서울시 정비사업 정보몽땅 (실시간/수시 보완 패치)",
      baseDate: today,
    });
  }

  return Array.from(map.values());
}

// ── 실행 메인 함수 ────────────────────────────────────────────────────────────
async function runMigration() {
  console.log("==========================================================");
  console.log("🚀 [권장 데이터 구조] 7대 테이블 데이터 마이그레이션 시작");
  console.log("==========================================================");

  // 1. 데이터 변환
  const apartments = transformApartments();
  const redevelopments = transformRedevelopmentProjects();

  console.log(`✓ [변환 완료] 아파트 단지: ${apartments.length}개`);
  console.log(`✓ [변환 완료] 정비사업 구역: ${redevelopments.length}개 (폴리곤 경계 포함)`);
  console.log(`✓ [변환 완료] 공공데이터 출처: ${DATA_SOURCES.length}개 영역`);

  // 2. 로컬 마스터 JSON 백업 저장
  const outDir = path.resolve(process.cwd(), "public/data");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(
    path.join(outDir, "master_apartments.json"),
    JSON.stringify(apartments, null, 2),
    "utf8"
  );
  fs.writeFileSync(
    path.join(outDir, "master_redevelopment.json"),
    JSON.stringify(redevelopments, null, 2),
    "utf8"
  );
  fs.writeFileSync(
    path.join(outDir, "master_data_sources.json"),
    JSON.stringify(DATA_SOURCES, null, 2),
    "utf8"
  );
  console.log("📁 로컬 마스터 JSON 저장 완료 (public/data/master_*.json)");

  // 3. Supabase 적재 (테이블이 존재할 때)
  if (supabase) {
    console.log("\n📡 Supabase DB 적재 시도...");

    // 1) data_sources 적재
    const { error: srcErr } = await supabase.from("data_sources").upsert(
      DATA_SOURCES.map((s) => ({
        id: s.id,
        category: s.category,
        source_name: s.sourceName,
        provider: s.provider,
        portal_url: s.portalUrl,
        api_endpoint: s.apiEndpoint,
        update_cycle: s.updateCycle,
        usage_terms: s.usageTerms,
        stat_type: s.statType,
        is_active: s.isActive,
      })),
      { onConflict: "id" }
    );
    if (srcErr) {
      console.warn("⚠️ data_sources 적재 건너뜀 (테이블 생성 전):", srcErr.message);
    } else {
      console.log(`✅ data_sources ${DATA_SOURCES.length}건 적재 완료.`);
    }

    // 2) redevelopment_projects 적재
    const { error: rdvErr } = await supabase.from("redevelopment_projects").upsert(
      redevelopments.map((r) => ({
        id: r.id,
        name: r.name,
        bjd_code: r.bjdCode,
        sido: r.sido,
        sigungu: r.sigungu,
        project_type: r.projectType,
        stage: r.stage,
        road_address: r.roadAddress,
        lat: r.lat,
        lng: r.lng,
        boundary_geojson: r.boundaryGeoJson,
        planned_units: r.plannedUnits,
        has_location: r.hasLocation,
        data_tier: r.dataTier,
        last_update_cycle: r.lastUpdateCycle,
        update_source: r.updateSource,
      })),
      { onConflict: "id" }
    );
    if (rdvErr) {
      console.warn("⚠️ redevelopment_projects 적재 건너뜀 (테이블 생성 전):", rdvErr.message);
    } else {
      console.log(`✅ redevelopment_projects ${redevelopments.length}건 적재 완료.`);
    }
  } else {
    console.log("ℹ️ Supabase 연결 설정 없음 — 로컬 마스터 모드로 정상 완료");
  }

  console.log("\n==========================================================");
  console.log("🎉 마이그레이션 및 정규화 작업이 완료되었습니다.");
  console.log("==========================================================");
}

runMigration().catch((err) => {
  console.error("마이그레이션 오류:", err);
  process.exit(1);
});
