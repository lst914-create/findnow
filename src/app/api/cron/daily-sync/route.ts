import { NextRequest, NextResponse } from "next/server";
import { runDailySync } from "../../../../../scripts/daily-sync-transactions";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5분 타임아웃

/**
 * GET /api/cron/daily-sync
 * 
 * 전일 12시(자정) 자동 실행 크론 엔드포인트
 * - 국토교통부 전일 실거래가 수집
 * - 4중 복합 키 (법정동 + 지번 + 건축년도 + 단지명) 100% 매칭
 * - 마스터 DB 최신 실거래가 자동 갱신
 */
export async function GET(request: NextRequest) {
  // Vercel Cron 인증 토큰 검증 (선택적 보안)
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await runDailySync();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      message: "일일 자정 실거래가 4중 복합 키 동기화가 성공적으로 완료되었습니다.",
    });
  } catch (error: any) {
    console.error("Cron Daily Sync Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
