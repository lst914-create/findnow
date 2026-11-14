import { NextRequest, NextResponse } from "next/server";

// 버스 타입 정의 및 호갱노노 매핑
const BUS_TYPE_MAP: Record<number, { name: string; color: string; badgeClass: string }> = {
  1: { name: "공항", color: "#E0B036", badgeClass: "bg-amber-500 text-white" },
  2: { name: "마을", color: "#71C24A", badgeClass: "bg-emerald-500 text-white" },
  3: { name: "간선", color: "#4278E1", badgeClass: "bg-blue-600 text-white" },
  4: { name: "지선", color: "#4EB11F", badgeClass: "bg-green-600 text-white" },
  5: { name: "순환", color: "#BEC340", badgeClass: "bg-lime-600 text-white" },
  6: { name: "광역", color: "#FF5F05", badgeClass: "bg-orange-600 text-white" },
  7: { name: "인천", color: "#F67518", badgeClass: "bg-amber-600 text-white" },
  8: { name: "경기", color: "#59B8AF", badgeClass: "bg-teal-600 text-white" },
  10: { name: "투어", color: "#EF520F", badgeClass: "bg-rose-500 text-white" },
  13: { name: "동행", color: "#FF5F05", badgeClass: "bg-orange-500 text-white" },
  15: { name: "심야", color: "#4B5563", badgeClass: "bg-slate-600 text-white" },
};

// 지하철 호선별 고유 컬러
const SUBWAY_COLORS: Record<string, string> = {
  "1호선": "#17318A",
  "2호선": "#4FA054",
  "3호선": "#EF7C1C",
  "4호선": "#00A5DE",
  "5호선": "#955097",
  "6호선": "#C59236",
  "7호선": "#747F00",
  "8호선": "#F14C82",
  "9호선": "#B69539",
  "경강선": "#234EA1",
  "경의중앙선": "#8BBEA2",
  "경춘선": "#6AC4A9",
  "공항철도": "#89BBE7",
  "광주1호선": "#4FA054",
  "김포골드라인": "#967729",
  "대구1호선": "#E0693F",
  "대구2호선": "#4FA054",
  "대구3호선": "#F4C169",
  "대전1호선": "#4FA054",
  "동해선": "#A9C3DF",
  "부산1호선": "#E0693F",
  "부산2호선": "#4FA054",
  "부산3호선": "#B69539",
  "부산4호선": "#5467A1",
  "부산김해경전철": "#955097",
  "서해선": "#99C355",
  "수인분당선": "#F4D348",
  "신림선": "#5467A1",
  "신분당선": "#982D36",
  "에버라인": "#6EA946",
  "우이신설선": "#C5C13E",
  "의정부경전철": "#EBBC41",
  "인천1호선": "#7196DA",
  "인천2호선": "#ED9C38",
  "자기부상철도": "#FFCD12",
};

interface SubwayItem {
  name: string;
  line: string;
  distanceMeters: number;
  walkMinutes: number;
  color: string;
}

interface HighSpeedTrainItem {
  name: string;
  distanceMeters: number;
  distanceKm: string;
  carMinutes: number;
}

interface BusRouteItem {
  number: string;
  type: number;
  startName?: string;
  endName?: string;
}

interface BusCategoryGroup {
  category: string;
  color: string;
  badgeClass: string;
  routes: BusRouteItem[];
}

interface TrafficInfoData {
  totalBusCount: number;
  subways: SubwayItem[];
  highSpeedTrains: HighSpeedTrainItem[];
  busGroups: BusCategoryGroup[];
}

// 인메모리 캐시 (24시간)
const TRAFFIC_CACHE = new Map<string, { data: TrafficInfoData; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60 * 24;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const latStr = searchParams.get("lat");
  const lngStr = searchParams.get("lng");
  const aptName = (searchParams.get("aptName") || "").trim();

  if (!latStr || !lngStr) {
    return NextResponse.json({ error: "lat and lng are required" }, { status: 400 });
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json({ error: "Invalid coordinates" }, { status: 400 });
  }

  const cacheKey = `${aptName}_${lat.toFixed(3)}_${lng.toFixed(3)}`;
  const cached = TRAFFIC_CACHE.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return NextResponse.json({ success: true, ...cached.data, source: "cache" });
  }

  try {
    // 1. 호갱노노 단지 검색 (아파트 ID 확보)
    let aptId = "";
    if (aptName) {
      try {
        const cleanName = aptName.replace(/아파트$/, "").trim();
        const searchUrl = `https://hogangnono.com/api/v2/searches/suggestions/new?query=${encodeURIComponent(cleanName)}&x=${lng}&y=${lat}`;
        const searchRes = await fetch(searchUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://hogangnono.com/",
          },
          signal: AbortSignal.timeout(4000),
        });

        if (searchRes.ok) {
          const searchData = await searchRes.json();
          const list = searchData.data?.matched?.apt?.list || [];
          if (list.length > 0) {
            // 좌표 거리순으로 가장 가까운 단지 선택
            let closest = list[0];
            let minDist = Infinity;
            for (const item of list) {
              const itemLat = item.location?.lat || item.lat;
              const itemLng = item.location?.lon || item.lon;
              if (itemLat && itemLng) {
                const d = Math.hypot(itemLat - lat, itemLng - lng);
                if (d < minDist) {
                  minDist = d;
                  closest = item;
                }
              }
            }
            aptId = closest.id;
          }
        }
      } catch (err) {
        console.warn("단지 검색 실패:", err);
      }
    }

    // 2. 단지 상세 페이지에서 convenience 파싱
    let convenienceData: any = null;

    if (aptId) {
      try {
        const pageRes = await fetch(`https://hogangnono.com/apt/${aptId}`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9",
          },
          signal: AbortSignal.timeout(5000),
        });

        if (pageRes.ok) {
          const html = await pageRes.text();
          const scripts = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];

          for (const s of scripts) {
            const content = s[1].trim();
            if (content.includes("altState") && content.includes('"bus":[')) {
              try {
                const parsed = JSON.parse(content);
                convenienceData = parsed.altState?.AptStore?.detail?.convenience ||
                                  parsed.altState?.StoreBoundaryStore?.apt?.convenience;
                if (convenienceData) break;
              } catch {
                // parse error ignore
              }
            }
          }
        }
      } catch (err) {
        console.warn("단지 HTML 파싱 실패:", err);
      }
    }

    // 3. 만약 단지별 convenience를 못 가져온 경우, bounding API로 fallback
    let busRawList: any[] = convenienceData?.bus || [];
    if (busRawList.length === 0) {
      try {
        const delta = 0.008; // 약 700m
        const params = new URLSearchParams({
          map: "google",
          level: "16",
          startX: (lng - delta).toFixed(6),
          startY: (lat - delta).toFixed(6),
          endX: (lng + delta).toFixed(6),
          endY: (lat + delta).toFixed(6),
        });
        const boundingRes = await fetch(`https://hogangnono.com/api/bus/bounding?${params.toString()}`, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": "https://hogangnono.com/",
          },
          signal: AbortSignal.timeout(4000),
        });
        if (boundingRes.ok) {
          const bData = await boundingRes.json();
          busRawList = bData.data || [];
        }
      } catch {
        // fallback failed
      }
    }

    // 4. 지하철 데이터 가공
    const subways: SubwayItem[] = (convenienceData?.subway || []).map((sub: any) => {
      const line = sub.description || "";
      const dist = sub.dist || 0;
      const walkMin = Math.max(1, Math.round(dist / 67));
      return {
        name: sub.name.endsWith("역") ? sub.name : `${sub.name}역`,
        line,
        distanceMeters: dist,
        walkMinutes: walkMin,
        color: SUBWAY_COLORS[line] || "#4F46E5",
      };
    });

    // 5. 고속철도 (KTX / SRT) 가공
    const highSpeedTrains: HighSpeedTrainItem[] = (convenienceData?.ktx || []).map((k: any) => {
      const dist = k.dist || 0;
      const km = (dist / 1000).toFixed(1);
      const carMin = Math.max(3, Math.round((dist / 1000) * 3.5)); // 시내 차량 기준 약 15~20km/h
      return {
        name: k.name,
        distanceMeters: dist,
        distanceKm: `${km}km`,
        carMinutes: carMin,
      };
    });

    // 6. 버스 데이터 가공 및 카테고리별 그룹화 (호갱노노 동일 방식)
    // 노선 번호 중복 제거 (방향별 중복 방지)
    const seenRoutes = new Set<string>();
    const groupedBuses = new Map<number, BusRouteItem[]>();

    for (const b of busRawList) {
      let rawNumber = (b.name || "").trim();
      // 끝에 붙은 하이픈 제거 (예: G3202-, 11-3- -> G3202, 11-3)
      rawNumber = rawNumber.replace(/-+$/, "");
      if (!rawNumber) continue;

      const dedupeKey = `${b.type}_${rawNumber}`;
      if (seenRoutes.has(dedupeKey)) continue;
      seenRoutes.add(dedupeKey);

      const type = b.type || 3;
      if (!groupedBuses.has(type)) {
        groupedBuses.set(type, []);
      }
      groupedBuses.get(type)!.push({
        number: rawNumber,
        type,
        startName: b.start_name,
        endName: b.end_name,
      });
    }

    // 호갱노노 표시 우선순위 순서: 공항(1) -> 마을(2) -> 간선(3) -> 지선(4) -> 순환(5) -> 광역(6) -> 인천(7) -> 경기(8) -> 심야(15)
    const priorityOrder = [1, 2, 3, 4, 5, 6, 7, 8, 10, 13, 15];
    const busGroups: BusCategoryGroup[] = [];
    let totalBusCount = 0;

    for (const t of priorityOrder) {
      if (groupedBuses.has(t)) {
        const routes = groupedBuses.get(t)!;
        // 번호 정렬 (숫자 기준 오름차순)
        routes.sort((a, b) => {
          const numA = parseInt(a.number.replace(/[^0-9]/g, "")) || 0;
          const numB = parseInt(b.number.replace(/[^0-9]/g, "")) || 0;
          return numA - numB;
        });

        const meta = BUS_TYPE_MAP[t] || { name: "기타", color: "#64748B", badgeClass: "bg-slate-500 text-white" };
        busGroups.push({
          category: meta.name,
          color: meta.color,
          badgeClass: meta.badgeClass,
          routes,
        });
        totalBusCount += routes.length;
      }
    }

    // priorityOrder에 없는 기타 타입 추가
    for (const [type, routes] of groupedBuses.entries()) {
      if (!priorityOrder.includes(type)) {
        routes.sort((a, b) => a.number.localeCompare(b.number));
        busGroups.push({
          category: "기타",
          color: "#64748B",
          badgeClass: "bg-slate-500 text-white",
          routes,
        });
        totalBusCount += routes.length;
      }
    }

    const result: TrafficInfoData = {
      totalBusCount,
      subways,
      highSpeedTrains,
      busGroups,
    };

    if (totalBusCount > 0 || subways.length > 0) {
      TRAFFIC_CACHE.set(cacheKey, { data: result, timestamp: Date.now() });
    }

    return NextResponse.json({ success: true, ...result, source: "live" });
  } catch (error) {
    console.error("Traffic info API error:", error);
    return NextResponse.json({ error: "Failed to fetch traffic info" }, { status: 500 });
  }
}
