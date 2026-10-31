/**
 * GET  /api/ads?slot=<slot>&aptId=<id>  - 슬롯별 광고 목록 조회
 * POST /api/ads                          - 광고 노출/클릭 이벤트 기록
 *
 * P3: 중개업소 광고 관리 API 기틀
 */

import { NextRequest, NextResponse } from "next/server";
import type { RealtorAd, AdImpression, AdSlotPosition } from "@/types/report";

// ─── 임시 인메모리 스토어 ─────────────────────────────────────
// TODO: Supabase realtor_ads 테이블로 교체
const AD_STORE: RealtorAd[] = [];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const slot = searchParams.get("slot") as AdSlotPosition | null;
  const aptId = searchParams.get("aptId");
  const now = new Date().toISOString();

  let ads = AD_STORE.filter(
    (ad) =>
      ad.startDate <= now &&
      ad.endDate >= now
  );

  if (slot) ads = ads.filter((ad) => ad.slot === slot);
  if (aptId) {
    ads = ads.filter(
      (ad) =>
        ad.specialtyAptIds.includes(aptId) ||
        ad.specialtyAptIds.length === 0
    );
  }

  return NextResponse.json({ ads, total: ads.length });
}

export async function POST(req: NextRequest) {
  let body: Partial<AdImpression>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.adId || !body.action) {
    return NextResponse.json({ error: "adId and action required" }, { status: 400 });
  }

  // TODO: Supabase ad_impressions 테이블에 저장
  const impression: AdImpression = {
    adId: body.adId,
    aptId: body.aptId,
    userId: body.userId,
    timestamp: new Date().toISOString(),
    action: body.action,
  };

  console.log("[AdImpression]", impression);

  return NextResponse.json({ ok: true, recorded: impression });
}
