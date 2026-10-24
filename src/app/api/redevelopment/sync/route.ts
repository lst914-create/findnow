import { NextResponse } from "next/server";
import { REDEVELOPMENT_DATA } from "@/lib/redevelopment";
import { fetchSeoulPublicNotices, applyNoticesToZones } from "@/lib/redevelopmentSync";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleSync();
}

export async function POST() {
  return handleSync();
}

async function handleSync() {
  try {
    const seoulApiKey = process.env.SEOUL_OPENAPI_KEY || "sample";
    
    // 1. 서울시 최신 정비사업 인허가 고시문 수집
    const notices = await fetchSeoulPublicNotices(seoulApiKey, 50);

    // 2. 기존 구역 데이터와 매칭하여 진행단계 및 고시 업데이트
    const { syncResult, updatedZones } = applyNoticesToZones(REDEVELOPMENT_DATA, notices);

    // 3. 응답 반환
    return NextResponse.json({
      success: true,
      message: `성공적으로 지자체 공공데이터(${notices.length}건 고시)와 동기화되었습니다.`,
      result: {
        ...syncResult,
        totalZonesCount: updatedZones.length,
      },
      noticesPreview: notices.slice(0, 5),
    });
  } catch (error: any) {
    console.error("[Redevelopment Sync API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "공공데이터 동기화 중 오류가 발생했습니다.",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
