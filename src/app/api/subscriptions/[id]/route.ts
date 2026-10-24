import { NextRequest, NextResponse } from "next/server";
import {
  getAllSubscriptionNotices,
  fetchSubscriptionModels,
} from "@/lib/applyhome";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const typeParam = (searchParams.get("type") as "APT" | "무순위") || "APT";

  try {
    const allNotices = await getAllSubscriptionNotices();
    const notice = allNotices.find((n) => n.id === id);

    if (!notice) {
      return NextResponse.json(
        { success: false, error: `공고번호 ${id}를 찾을 수 없습니다.` },
        { status: 404 }
      );
    }

    // 주택형 모델 및 분양가 목록 조회
    const models = await fetchSubscriptionModels(id, notice.type === "무순위" ? "무순위" : typeParam);

    let minPrice = Infinity;
    let maxPrice = 0;
    for (const m of models) {
      if (m.topPriceManwon > 0) {
        if (m.topPriceManwon < minPrice) minPrice = m.topPriceManwon;
        if (m.topPriceManwon > maxPrice) maxPrice = m.topPriceManwon;
      }
    }

    const detail = {
      ...notice,
      models,
      minPriceManwon: minPrice !== Infinity ? minPrice : notice.minPriceManwon,
      maxPriceManwon: maxPrice > 0 ? maxPrice : notice.maxPriceManwon,
    };

    return NextResponse.json({
      success: true,
      data: detail,
    });
  } catch (error: any) {
    console.error(`[API /api/subscriptions/${id}] Error:`, error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
