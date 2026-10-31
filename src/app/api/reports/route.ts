/**
 * GET  /api/reports           - 내 리포트 목록
 * POST /api/reports           - 리포트 생성 요청
 * GET  /api/reports/[id]      - 특정 리포트 상세
 *
 * P3: 유료 리포트 API 기틀
 */

import { NextRequest, NextResponse } from "next/server";
import type { ReportMeta, ReportType } from "@/types/report";

// ── 임시 인메모리 (TODO: Supabase reports 테이블로 교체) ──────
const REPORT_STORE: ReportMeta[] = [];

// ── 리포트 가격표 (원) ────────────────────────────────────────
const REPORT_PRICE: Record<ReportType, number> = {
  apt_location:    9900,
  redevelopment:   14900,
  supply_demand:   9900,
  commercial:      7900,
  school_district: 7900,
};

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const reports = REPORT_STORE.filter((r) => r.userId === userId).sort(
    (a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime()
  );

  return NextResponse.json({ reports, total: reports.length });
}

export async function POST(req: NextRequest) {
  let body: {
    userId: string;
    type: ReportType;
    aptId?: string;
    targetName: string;
    coupon?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.userId || !body.type || !body.targetName) {
    return NextResponse.json({ error: "userId, type, targetName required" }, { status: 400 });
  }

  // TODO: 결제 검증 로직 연동
  const price = REPORT_PRICE[body.type] ?? 9900;
  const isFree = body.coupon === "BETA_FREE"; // 테스트용 쿠폰

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const report: ReportMeta = {
    id: `rpt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type: body.type,
    title: getReportTitle(body.type, body.targetName),
    targetName: body.targetName,
    aptId: body.aptId,
    userId: body.userId,
    status: "pending",
    requestedAt: new Date().toISOString(),
    dataSources: [],
    expiresAt: expiresAt.toISOString(),
    price,
    paymentStatus: isFree ? "free" : "paid",
  };

  REPORT_STORE.push(report);

  // TODO: 비동기 리포트 생성 큐 트리거

  return NextResponse.json({ report }, { status: 201 });
}

function getReportTitle(type: ReportType, targetName: string): string {
  const labels: Record<ReportType, string> = {
    apt_location:    "입지 종합 분석",
    redevelopment:   "정비사업 수익성 시뮬레이션",
    supply_demand:   "수요·공급 전망",
    commercial:      "상권 분석",
    school_district: "학군 상세",
  };
  return `${targetName} ${labels[type]} 리포트`;
}
