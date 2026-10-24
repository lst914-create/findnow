import { NextRequest, NextResponse } from "next/server";
import {
  getRegionalPlaces,
  RegionalCategory,
  RegionalPlace,
} from "@/lib/regionalApi";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get("region") || "서울 강남구";
  const categoryParam = searchParams.get("category") || "all";
  const keyword = searchParams.get("keyword") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = parseInt(searchParams.get("perPage") || "24", 10);

  const category = (
    ["tourist", "facility", "special", "food"].includes(categoryParam)
      ? categoryParam
      : "all"
  ) as RegionalCategory | "all";

  try {
    const places = await getRegionalPlaces(region, category, keyword);

    // 카테고리별 통계 계산
    const stats = {
      touristCount: places.filter((p) => p.category === "tourist").length,
      facilityCount: places.filter((p) => p.category === "facility").length,
      specialCount: places.filter((p) => p.category === "special").length,
      foodCount: places.filter((p) => p.category === "food").length,
    };

    const startIndex = (page - 1) * perPage;
    const paginated = places.slice(startIndex, startIndex + perPage);

    return NextResponse.json({
      success: true,
      totalCount: places.length,
      page,
      perPage,
      region,
      category,
      stats,
      places: paginated,
    });
  } catch (error: any) {
    console.error("[API /api/regional] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch regional places" },
      { status: 500 }
    );
  }
}
