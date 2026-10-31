import { NextResponse } from "next/server";
import { REDEVELOPMENT_DATA } from "@/lib/redevelopment";
import {
  fetchSeoulPublicNotices,
  applyNoticesToZones,
  persistSyncResultToSupabase,
} from "@/lib/redevelopmentSync";

export const dynamic = "force-dynamic";

export async function GET() {
  return handleSync();
}

export async function POST() {
  return handleSync();
}

async function handleSync() {
  try {
    const hasSeoulKey = Boolean(process.env.SEOUL_OPENAPI_KEY);
    const seoulApiKey = process.env.SEOUL_OPENAPI_KEY || "sample";

    // 1. 서울시 최신 정비사업 인허가 고시문 수집 (공식 키 설정 시 최대 50건)
    const notices = await fetchSeoulPublicNotices(seoulApiKey, hasSeoulKey ? 50 : 5);

    // 2. 기존 구역 데이터와 매칭하여 진행단계 및 고시 업데이트 (in-memory)
    const { syncResult, updatedZones } = applyNoticesToZones(
      REDEVELOPMENT_DATA,
      notices
    );

    // 3. 변경 결과를 Supabase에 영구 저장
    //    실패해도 응답 자체는 반환 (persisted 플래그로 클라이언트에 알림)
    const { ok: persisted, error: persistError } =
      await persistSyncResultToSupabase(updatedZones, syncResult);

    if (!persisted) {
      console.error("[Redevelopment Sync] Supabase 저장 실패:", persistError);
    }

    // 4. 응답 반환
    return NextResponse.json({
      success: true,
      persisted,
      dataSource: hasSeoulKey
        ? "서울 열린데이터광장(data.seoul.go.kr) 공식 API"
        : "서울 열린데이터광장 공개 테스트 키 (SEOUL_OPENAPI_KEY 등록 시 대량 실시간 수집 가능)",
      hasCustomSeoulKey: hasSeoulKey,
      ...(persistError && { persistError }),
      message: `성공적으로 지자체 공공데이터(${notices.length}건 고시)와 동기화되었습니다.${
        persisted ? " (Supabase 저장 완료)" : " (⚠️ Supabase 저장 실패)"
      }`,
      result: {
        ...syncResult,
        totalZonesCount: updatedZones.length,
      },
      updatedZones,
      noticesPreview: notices.slice(0, 5),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[Redevelopment Sync API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "공공데이터 동기화 중 오류가 발생했습니다.",
        error: message,
      },
      { status: 500 }
    );
  }
}
