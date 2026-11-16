import { NextRequest, NextResponse } from "next/server";
import { OFFICIAL_DATA_SOURCES, DataSourceEntity } from "@/lib/recommendedDataModel";

// 8대 공식 공공데이터 출처 인메모리 스토어 (Image 1 기준)
const DATA_SOURCES_STORE: (DataSourceEntity & {
  source_id: string;
  source_url: string;
  terms_checked_at: string;
  updated_at: string;
})[] = OFFICIAL_DATA_SOURCES.map((s) => ({
  ...s,
  source_id: s.id,
  source_url: s.portalUrl,
  terms_checked_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}));

/**
 * GET /api/admin/data-sources
 * 8대 공식 공공데이터 출처 및 수집·검증 항목 조회
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
    const source = DATA_SOURCES_STORE.find(
      (s) => s.id === sourceId || s.source_id === sourceId
    );
    if (!source) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }

    source.terms_checked_at = new Date().toISOString();
    source.updated_at = new Date().toISOString();

    return NextResponse.json({
      success: true,
      message: `${source.sourceName} 이용 조건 검토 완료 (terms_checked_at 갱신됨)`,
      data: source,
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
