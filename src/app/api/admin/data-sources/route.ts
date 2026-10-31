import { NextRequest, NextResponse } from "next/server";
import { DataSourceRecord } from "@/types/domainSchema";

// 기본 등록된 4대 공공데이터 출처 마스터
const DATA_SOURCES_STORE: DataSourceRecord[] = [
  {
    source_id: "national-redevelopment",
    provider: "국토교통부",
    source_name: "전국 도시정비사업 통합 데이터",
    source_url: "https://data.go.kr/data/15044691/fileData.do",
    update_cycle: "연간 갱신 (지자체 고시로 수시 보완)",
    terms_checked_at: new Date().toISOString(),
    usage_terms: "전국 기본 목록용. 최근 변경 사항은 지자체 고시·공고 등으로 교차 보완 필수.",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: new Date().toISOString(),
  },
  {
    source_id: "seoul-redevelopment",
    provider: "서울특별시",
    source_name: "정비사업 정보몽땅 + 서울열린데이터광장",
    source_url: "https://cleanup.seoul.go.kr",
    update_cycle: "일별 / 수시",
    terms_checked_at: new Date().toISOString(),
    usage_terms: "서울시 추진단계 및 고시공고 실시간 보완. 공식 고시 URL과 일자 보존 필수.",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: new Date().toISOString(),
  },
  {
    source_id: "store-info",
    provider: "소상공인시장진흥공단",
    source_name: "상가(상권)정보 서비스",
    source_url: "https://apis.data.go.kr/B553077/api/open/sdsc2",
    update_cycle: "분기 갱신",
    terms_checked_at: new Date().toISOString(),
    usage_terms: "업종 분포 분석 전용. 점포 데이터만으로 매출액이나 유동인구 추정 금지.",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: new Date().toISOString(),
  },
  {
    source_id: "housing-supply",
    provider: "한국부동산원",
    source_name: "청약홈 공급 및 입주 예정 통계",
    source_url: "https://applyhome.co.kr",
    update_cycle: "사업 공고 시 수시",
    terms_checked_at: new Date().toISOString(),
    usage_terms: "청약홈 공고 기준 세대수 구분 (임대/분양 포함 구분 표시).",
    is_active: true,
    created_at: "2026-01-01T00:00:00.000Z",
    updated_at: new Date().toISOString(),
  },
];

/**
 * GET /api/admin/data-sources
 * 출처 및 이용 조건 목록 조회
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    totalSources: DATA_SOURCES_STORE.length,
    data: DATA_SOURCES_STORE,
  });
}

/**
 * POST /api/admin/data-sources
 * 이용 약관 검토 일시 갱신 (terms_checked_at)
 */
export async function POST(req: NextRequest) {
  try {
    const { sourceId } = await req.json();
    const source = DATA_SOURCES_STORE.find((s) => s.source_id === sourceId);
    if (!source) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    source.terms_checked_at = new Date().toISOString();
    source.updated_at = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `${source.source_name} 이용 조건 검토 완료 (terms_checked_at 갱신됨)`,
      data: source,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
