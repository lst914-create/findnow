import { NextRequest, NextResponse } from "next/server";
import { REDEVELOPMENT_DATA } from "@/lib/redevelopment";

// 서울시 클린업시스템 및 지자체 정비사업 고시·공고 API
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const zoneId = searchParams.get("zoneId");
  const kind = searchParams.get("kind"); // "고시" | "공고" | "보도자료" | "all"

  if (zoneId) {
    const zone = REDEVELOPMENT_DATA.find((z) => z.id === zoneId);
    if (!zone) {
      return NextResponse.json(
        { error: `Zone with id '${zoneId}' not found` },
        { status: 404 }
      );
    }

    let notices = [...zone.notices];
    if (kind && kind !== "all") {
      notices = notices.filter((n) => n.type === kind);
    }

    return NextResponse.json({
      zoneId: zone.id,
      zoneName: zone.name,
      totalCount: notices.length,
      notices,
    });
  }

  // zoneId가 없으면 전체 정비구역의 최신 고시/공고 통합 피드 반환
  const allNotices = REDEVELOPMENT_DATA.flatMap((z) =>
    z.notices.map((n) => ({
      ...n,
      zoneId: z.id,
      zoneName: z.name,
      district: z.district,
    }))
  ).sort((a, b) => b.date.localeCompare(a.date));

  return NextResponse.json({
    totalCount: allNotices.length,
    notices: allNotices,
  });
}
