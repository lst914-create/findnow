import { NextRequest, NextResponse } from "next/server";
import { DataSyncLog } from "@/types/domainSchema";

// 수집 실행 로그 인메모리 저장소 (Supabase data_sync_logs 테이블 대응)
const SYNC_LOGS: DataSyncLog[] = [
  {
    id: 1,
    source_id: "national-redevelopment",
    started_at: "2026-10-31T01:00:00.000Z",
    finished_at: "2026-10-31T01:00:08.500Z",
    status: "SUCCESS",
    records_count: 512,
    execution_type: "CRON",
    metadata: { mode: "baseline_master_scan" },
  },
  {
    id: 2,
    source_id: "seoul-redevelopment",
    started_at: "2026-10-31T01:10:00.000Z",
    finished_at: "2026-10-31T01:10:04.200Z",
    status: "SUCCESS",
    records_count: 14,
    execution_type: "CRON",
    metadata: { regressionChecksPassed: 14, stageProgressions: 2 },
  },
  {
    id: 3,
    source_id: "store-info",
    started_at: "2026-10-31T01:20:00.000Z",
    finished_at: "2026-10-31T01:20:02.100Z",
    status: "SUCCESS",
    records_count: 6,
    execution_type: "MANUAL",
  },
];

/**
 * GET /api/admin/sync-logs
 * 수집 실행 로그 조회
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sourceId = searchParams.get("sourceId");
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  let results = [...SYNC_LOGS].reverse();
  if (sourceId) {
    results = results.filter((l) => l.source_id === sourceId);
  }

  return NextResponse.json({
    success: true,
    totalLogs: results.length,
    logs: results.slice(0, limit),
  });
}

/**
 * POST /api/admin/sync-logs
 * 신규 수집 로그 기록
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newLog: DataSyncLog = {
      id: SYNC_LOGS.length + 1,
      source_id: body.source_id || "unknown",
      started_at: body.started_at || new Date().toISOString(),
      finished_at: body.finished_at || new Date().toISOString(),
      status: body.status || "SUCCESS",
      records_count: body.records_count || 0,
      error_message: body.error_message,
      execution_type: body.execution_type || "MANUAL",
      metadata: body.metadata,
    };

    SYNC_LOGS.push(newLog);

    return NextResponse.json({
      success: true,
      log: newLog,
    });
  } catch {
    return NextResponse.json({ error: "Invalid log payload" }, { status: 400 });
  }
}
