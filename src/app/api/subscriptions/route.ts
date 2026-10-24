import { NextRequest, NextResponse } from "next/server";
import {
  getAllSubscriptionNotices,
  computeSubscriptionStats,
  SubscriptionNotice,
} from "@/lib/applyhome";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region"); // "전체" | "서울" | "경기" 등
  const status = searchParams.get("status"); // "all" | "ongoing" | "upcoming" | "remndr" | "closed"
  const type = searchParams.get("type"); // "all" | "APT" | "무순위"
  const query = searchParams.get("query"); // 텍스트 검색 (단지명, 주소, 시공사)
  const refresh = searchParams.get("refresh") === "true";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "1000", 10);

  try {
    const allNotices = await getAllSubscriptionNotices(refresh);
    const summary = computeSubscriptionStats(allNotices);

    let filtered = [...allNotices];

    // 1. 지역 필터
    if (region && region !== "전체") {
      if (region === "경기·인천" || region === "경기인천") {
        filtered = filtered.filter(
          (n) => n.region.includes("경기") || n.region.includes("인천")
        );
      } else if (region === "부산·울산·경남" || region === "부울경") {
        filtered = filtered.filter(
          (n) =>
            n.region.includes("부산") ||
            n.region.includes("울산") ||
            n.region.includes("경남")
        );
      } else if (region === "대구·경북") {
        filtered = filtered.filter(
          (n) => n.region.includes("대구") || n.region.includes("경북")
        );
      } else if (region === "대전·세종·충청") {
        filtered = filtered.filter(
          (n) =>
            n.region.includes("대전") ||
            n.region.includes("세종") ||
            n.region.includes("충남") ||
            n.region.includes("충북")
        );
      } else if (region === "광주·전라") {
        filtered = filtered.filter(
          (n) =>
            n.region.includes("광주") ||
            n.region.includes("전남") ||
            n.region.includes("전북")
        );
      } else if (region === "강원·제주") {
        filtered = filtered.filter(
          (n) => n.region.includes("강원") || n.region.includes("제주")
        );
      } else {
        filtered = filtered.filter((n) => n.region.includes(region));
      }
    }

    // 2. 상태 필터
    if (status && status !== "all") {
      if (status === "ongoing") {
        filtered = filtered.filter((n) => n.status === "청약접수중");
      } else if (status === "upcoming") {
        filtered = filtered.filter((n) => n.status === "접수예정");
      } else if (status === "remndr") {
        filtered = filtered.filter((n) => n.type === "무순위");
      } else if (status === "closed") {
        filtered = filtered.filter(
          (n) => n.status === "마감/발표대기" || n.status === "발표완료"
        );
      }
    }

    // 3. 주택 유형 필터
    if (type && type !== "all") {
      filtered = filtered.filter((n) => n.type === type);
    }

    // 4. 검색어 필터
    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      filtered = filtered.filter((n) => {
        return (
          n.name.toLowerCase().includes(q) ||
          n.address.toLowerCase().includes(q) ||
          n.region.toLowerCase().includes(q) ||
          (n.company && n.company.toLowerCase().includes(q)) ||
          (n.developer && n.developer.toLowerCase().includes(q))
        );
      });
    }

    const totalFiltered = filtered.length;
    const startIndex = (page - 1) * perPage;
    const paginated = filtered.slice(startIndex, startIndex + perPage);

    return NextResponse.json({
      success: true,
      totalCount: totalFiltered,
      page,
      perPage,
      totalPages: Math.ceil(totalFiltered / perPage),
      summary,
      notices: paginated,
    });
  } catch (error: any) {
    console.error("[API /api/subscriptions] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}
