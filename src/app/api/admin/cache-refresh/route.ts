/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { fetchTransactionsDirectly } from "@/lib/fetchTransactionsServer";
import masterApartments from "@/lib/apartments-master.json";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const BUCKET_NAME = "transactions-cache";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fkkbusvufaumzizzxpqe.supabase.co";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

/**
 * POST /api/admin/cache-refresh
 * Body: { aptId: "kapt-A10025596" } 또는 { aptIds: ["kapt-A10025596", "kakao-7917162"] }
 * 
 * Supabase Storage 캐시를 삭제하고 국토부 API에서 강제 재수집합니다.
 * 운영자 전용 — ADMIN_SECRET 헤더로 인증
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-admin-secret") || request.nextUrl.searchParams.get("secret");
  const adminSecret = process.env.ADMIN_SECRET || "findnow-admin-2024";
  if (secret !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const aptId = body.aptId as string | undefined;
  const aptIds: string[] = aptId ? [aptId] : (body.aptIds as string[] | undefined) || [];

  if (aptIds.length === 0) {
    return NextResponse.json({ error: "aptId 또는 aptIds 필요" }, { status: 400 });
  }

  const sb = getAdminClient();
  const results: Record<string, any> = {};

  for (const id of aptIds) {
    try {
      // 1. Supabase Storage 캐시 파일 삭제
      const safeId = encodeURIComponent(id.trim());
      const objectPath = `apts/${safeId}.json`;
      if (sb) {
        await sb.storage.from(BUCKET_NAME).remove([objectPath]);
      }

      // 2. DB에서 단지 정보 조회
      const apt = (masterApartments as any[]).find((a) => a.id === id);
      if (!apt) {
        results[id] = { status: "skipped", reason: "DB에 단지 없음" };
        continue;
      }

      // 3. 국토부 API 강제 재수집 (60초 maxDuration 내 완료)
      const { trades, rents } = await fetchTransactionsDirectly(apt, 36);

      results[id] = {
        status: "ok",
        tradesCount: trades.length,
        rentsCount: rents.length,
        latestTrade: trades[0]
          ? `${trades[0].dealYear}-${trades[0].dealMonth}-${trades[0].dealDay} ${trades[0].dealAmount}만원`
          : "없음",
      };
    } catch (e: any) {
      results[id] = { status: "error", reason: e?.message || String(e) };
    }
  }

  return NextResponse.json({ results });
}

/**
 * GET /api/admin/cache-refresh?aptId=kapt-A10025596&secret=xxx
 * 캐시 상태 확인용
 */
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  const adminSecret = process.env.ADMIN_SECRET || "findnow-admin-2024";
  if (secret !== adminSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const aptId = request.nextUrl.searchParams.get("aptId");
  if (!aptId) {
    return NextResponse.json({ error: "aptId 필요" }, { status: 400 });
  }

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fkkbusvufaumzizzxpqe.supabase.co"}/storage/v1/object/public/${BUCKET_NAME}/apts/${encodeURIComponent(aptId.trim())}.json`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return NextResponse.json({ exists: false, url });
    const data = await res.json();
    const updatedAt = data.updatedAt || 0;
    const ageHours = ((Date.now() - updatedAt) / 3600000).toFixed(1);
    return NextResponse.json({
      exists: true,
      url,
      tradesCount: data.trades?.length || 0,
      rentsCount: data.rents?.length || 0,
      updatedAt: new Date(updatedAt).toISOString(),
      ageHours,
      isStale: Date.now() - updatedAt > 86400000,
      latestTrade: data.trades?.[0]
        ? `${data.trades[0].dealYear}-${data.trades[0].dealMonth}-${data.trades[0].dealDay} ${data.trades[0].dealAmount}만원`
        : "없음",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message });
  }
}
