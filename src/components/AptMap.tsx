"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { APARTMENTS_DATA, Apartment } from "@/lib/apartments";
import { loadKakaoMap } from "@/lib/kakaoMapLoader";

export interface AptMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  pyeong: number;
  priceNum: number;      // 만원 단위 (매매)
  rentNum?: number;       // 만원 단위 (전세)
  avgPrice: string;      // 표시용 (예: "30.5억")
  region: string;
  builtYear?: number;
  householdCount?: number;
  schoolScore?: number;
  trafficScore?: number;
  liveViewers?: number;

  far?: number;          // 용적률 (%)
  bcr?: number;          // 건폐율 (%)
  jeonseRatio?: number;  // 전세가율 (%)
  gapPrice?: number;     // 갭가격 (만원)
  rentalBizRatio?: number;// 임대사업율 (%)
  monthlyYield?: number; // 월세수익률 (%)
  parkingRatio?: number; // 세대당 주차대수
  hallType?: string;     // 현관구조
  heatingType?: string;  // 난방방식
}

export const APT_MARKERS: AptMarker[] = APARTMENTS_DATA.map((apt, idx) => {
  const avgPriceNum = Math.round((apt.price_min + apt.price_max) / 2);
  const uk = Math.floor(avgPriceNum / 10000);
  const cheon = Math.floor((avgPriceNum % 10000) / 1000);
  const avgPriceStr = uk > 0 ? (cheon > 0 ? `${uk}.${cheon}억` : `${uk}.0억`) : `${avgPriceNum.toLocaleString()}만`;

  const jeonseRatio = apt.jeonseRatio ?? 56;
  const rentNum = apt.rent_min && apt.rent_max
    ? Math.round((apt.rent_min + apt.rent_max) / 2)
    : Math.round(avgPriceNum * (jeonseRatio / 100));
  const gapPrice = apt.gapPrice ?? Math.max(0, avgPriceNum - rentNum);

  return {
    id: apt.id,
    name: apt.name,
    lat: apt.lat,
    lng: apt.lng,
    pyeong: apt.area_pyeong,
    priceNum: avgPriceNum,
    rentNum: rentNum,
    avgPrice: avgPriceStr,
    region: `${apt.region} ${apt.district}`,
    builtYear: apt.built_year,
    householdCount: apt.household_count,
    schoolScore: apt.school_score,
    trafficScore: apt.traffic_score,
    liveViewers: 35 + ((idx * 23) % 200),
    far: apt.far ?? 240,
    bcr: apt.bcr ?? 18,
    jeonseRatio: jeonseRatio,
    gapPrice: gapPrice,
    rentalBizRatio: apt.rentalBizRatio ?? 6,
    monthlyYield: apt.monthlyYield ?? 4.0,
    parkingRatio: apt.parkingRatio ?? 1.3,
    hallType: apt.hallType ?? "계단식",
    heatingType: apt.heatingType ?? "지역난방",
  };
});

interface AptMapProps {
  highlightId?: string;
  height?: number;
  initialZoom?: number;
  center?: { lat: number; lng: number };
  onVisibleApartmentsChange?: (apts: Apartment[], regionSummary?: string) => void;
}

// 14가지 세부 조건 필터 인터페이스
export interface FilterState {
  tradeType: "매매" | "전세" | "월세";
  pyeong: number;         // 0: 전체, 20: 20평대, 30: 30평대, 40: 40평대 이상
  price: number;          // 0: 전체, 100000: 10억이하, 200000: 20억이하, 300000: 30억이하
  household: number;      // 0: 전체, 500세대, 1000세대, 3000세대
  builtYear: number;      // 0: 전체, 5: 5년이내, 10: 10년이내, 15: 15년이내
  far: number;            // 용적률 (%)
  bcr: number;            // 건폐율 (%)
  jeonseRatio: number;    // 전세가율 (%)
  gapPrice: number;       // 갭가격 (만원)
  rentalBizRatio: number; // 임대사업율 (%)
  monthlyYield: number;   // 월세수익률 (x10)
  parking: number;        // 주차공간 (x10)
  hallType: string;       // 전체 | 계단식 | 복도식 | 혼합식
  heatingType: string;    // 전체 | 지역난방 | 개별난방 | 중앙난방
}

const INITIAL_FILTERS: FilterState = {
  tradeType: "매매",
  pyeong: 0,
  price: 0,
  household: 0,
  builtYear: 0,
  far: 0,
  bcr: 0,
  jeonseRatio: 0,
  gapPrice: 0,
  rentalBizRatio: 0,
  monthlyYield: 0,
  parking: 0,
  hallType: "전체",
  heatingType: "전체",
};

export default function AptMap({
  highlightId,
  height,
  initialZoom = 14,
  center,
  onVisibleApartmentsChange,
}: AptMapProps) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlaysRef = useRef<any[]>([]);
  const kakaoOnlyOverlaysRef = useRef<any[]>([]); // 카카오 전용 마커 (우리 DB에 없는 단지)
  const userOverlayRef = useRef<any>(null);
  const kakaoSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastViewportKeyRef = useRef<string>(""); // 노모지 API 콜 중복 방지
  const geoResolvedRef = useRef<{ lat: number; lng: number } | null>(null); // geolocation 결과 캐시
  const [isGeoLoading, setIsGeoLoading] = useState(false); // geolocation 로딩 상태
  // 실거래가 캐시: normalizedAptName → 최근 평균 실거래가(만원)
  const realtimePriceCacheRef = useRef<Map<string, number>>(new Map());
  const viewportPriceFetchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastPriceFetchKeyRef = useRef<string>(""); // 중복 fetch 방지

  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedApt, setSelectedApt] = useState<AptMarker | null>(null);
  const [realtimeTx, setRealtimeTx] = useState<{
    avgPriceStr: string;
    latestPriceStr: string;
    latestDateStr: string;
    dealCount: number;
    jeonsePriceStr: string;
    gapPriceStr: string;
    isLoading: boolean;
    isRealConnected: boolean;
  } | null>(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [activeTab, setActiveTab] = useState<"지도" | "주변" | "거리" | "분석">("지도");
  const [currentRegion, setCurrentRegion] = useState<string>("수도권 주요 단지");
  const [visibleCount, setVisibleCount] = useState<number>(0);

  // 선택 단지 국토교통부 실거래가 실시간 연동
  useEffect(() => {
    if (!selectedApt) {
      setRealtimeTx(null);
      return;
    }

    let isCancelled = false;
    // 기본 마스터 데이터 값으로 즉시 초기화
    setRealtimeTx({
      avgPriceStr: selectedApt.avgPrice,
      latestPriceStr: "",
      latestDateStr: "",
      dealCount: 0,
      jeonsePriceStr: `${Math.round((selectedApt.rentNum || selectedApt.priceNum * 0.56) / 10000)}억`,
      gapPriceStr: `${Math.round((selectedApt.gapPrice || selectedApt.priceNum * 0.44) / 10000)}억`,
      isLoading: true,
      isRealConnected: false,
    });

    const parts = selectedApt.region.split(" ");
    const regionName = parts.slice(0, 2).join(" ");
    const districtName = parts.slice(2).join(" ");

    fetch(
      `/api/transactions?region=${encodeURIComponent(regionName)}&district=${encodeURIComponent(districtName)}&aptName=${encodeURIComponent(selectedApt.name)}&months=12`
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isCancelled || !data || !data.trades || data.trades.length === 0) {
          if (!isCancelled) {
            setRealtimeTx((prev) => (prev ? { ...prev, isLoading: false } : null));
          }
          return;
        }

        const trades = data.trades;
        // 최근 최대 5건 실거래 평균
        const recent = trades.slice(0, Math.min(5, trades.length));
        const avgNum = Math.round(recent.reduce((acc: number, t: any) => acc + t.dealAmount, 0) / recent.length);
        const uk = Math.floor(avgNum / 10000);
        const cheon = Math.floor((avgNum % 10000) / 1000);
        const avgPriceStr = uk > 0 ? (cheon > 0 ? `${uk}.${cheon}억` : `${uk}.0억`) : `${avgNum.toLocaleString()}만`;

        const latest = trades[0];
        const latestUk = Math.floor(latest.dealAmount / 10000);
        const latestCheon = Math.floor((latest.dealAmount % 10000) / 1000);
        const latestPriceStr = latestUk > 0 ? (latestCheon > 0 ? `${latestUk}.${latestCheon}억` : `${latestUk}.0억`) : `${latest.dealAmount.toLocaleString()}만`;
        const latestDateStr = `${String(latest.dealYear).slice(2)}.${String(latest.dealMonth).padStart(2, "0")}`;

        const ratio = selectedApt.jeonseRatio ?? 56;
        const jeonseNum = Math.round(avgNum * (ratio / 100));
        const gapNum = Math.max(0, avgNum - jeonseNum);

        const jUk = Math.floor(jeonseNum / 10000);
        const jCheon = Math.floor((jeonseNum % 10000) / 1000);
        const jeonsePriceStr = jUk > 0 ? (jCheon > 0 ? `${jUk}.${jCheon}억` : `${jUk}.0억`) : `${jeonseNum.toLocaleString()}만`;

        const gUk = Math.floor(gapNum / 10000);
        const gCheon = Math.floor((gapNum % 10000) / 1000);
        const gapPriceStr = gUk > 0 ? (gCheon > 0 ? `${gUk}.${gCheon}억` : `${gUk}.0억`) : `${gapNum.toLocaleString()}만`;

        setRealtimeTx({
          avgPriceStr,
          latestPriceStr,
          latestDateStr,
          dealCount: trades.length,
          jeonsePriceStr,
          gapPriceStr,
          isLoading: false,
          isRealConnected: true,
        });
      })
      .catch(() => {
        if (!isCancelled) {
          setRealtimeTx((prev) => (prev ? { ...prev, isLoading: false } : null));
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [selectedApt]);

  // 14개 조건 필터 State
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [activeFilterKey, setActiveFilterKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 필터 접힘/펼침 상태에 따른 지도 높이 계산 (접혀있을 때 공간을 지도에 더 넓게 할당)
  const computedHeight = height
    ? (isMobile ? (isFiltersExpanded ? 340 : Math.max(height, 460)) : (isFiltersExpanded ? height : height + 60))
    : (isMobile ? (isFiltersExpanded ? 340 : 480) : (isFiltersExpanded ? 540 : 600));

  // 높이 변화나 필터 토글 시 카카오맵 relayout 재계산
  useEffect(() => {
    if (mapRef.current) {
      const timer = setTimeout(() => {
        mapRef.current.relayout();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isFiltersExpanded, computedHeight]);

  // 필터 초기화
  const handleResetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setActiveFilterKey(null);
  };

  // 조건 필터링 함수
  const filterMarkers = (aptList: AptMarker[]) => {
    return aptList.filter((apt) => {
      // 1. 평형
      if (filters.pyeong > 0) {
        if (filters.pyeong === 20 && (apt.pyeong < 20 || apt.pyeong >= 30)) return false;
        if (filters.pyeong === 30 && (apt.pyeong < 30 || apt.pyeong >= 40)) return false;
        if (filters.pyeong === 40 && apt.pyeong < 40) return false;
      }
      // 2. 가격
      if (filters.price > 0) {
        if (apt.priceNum > filters.price) return false;
      }
      // 3. 세대수
      if (filters.household > 0 && apt.householdCount) {
        if (apt.householdCount < filters.household) return false;
      }
      // 4. 입주년차
      if (filters.builtYear > 0 && apt.builtYear) {
        const age = 2026 - apt.builtYear;
        if (age > filters.builtYear) return false;
      }
      // 5. 용적률
      if (filters.far > 0 && apt.far) {
        if (apt.far > filters.far) return false;
      }
      // 6. 건폐율
      if (filters.bcr > 0 && apt.bcr) {
        if (apt.bcr > filters.bcr) return false;
      }
      // 7. 전세가율
      if (filters.jeonseRatio > 0 && apt.jeonseRatio) {
        if (apt.jeonseRatio < filters.jeonseRatio) return false;
      }
      // 8. 갭가격
      if (filters.gapPrice > 0 && apt.gapPrice) {
        if (apt.gapPrice > filters.gapPrice) return false;
      }
      // 9. 임대사업율
      if (filters.rentalBizRatio > 0 && apt.rentalBizRatio) {
        if (apt.rentalBizRatio < filters.rentalBizRatio) return false;
      }
      // 10. 월세수익률
      if (filters.monthlyYield > 0 && apt.monthlyYield) {
        if (apt.monthlyYield < filters.monthlyYield / 10) return false;
      }
      // 11. 주차공간
      if (filters.parking > 0 && apt.parkingRatio) {
        if (apt.parkingRatio < filters.parking / 10) return false;
      }
      // 12. 현관구조
      if (filters.hallType !== "전체" && apt.hallType) {
        if (apt.hallType !== filters.hallType) return false;
      }
      // 13. 난방방식
      if (filters.heatingType !== "전체" && apt.heatingType) {
        if (apt.heatingType !== filters.heatingType) return false;
      }

      return true;
    });
  };

  /* ── 카카오 전용 마커 HTML (우리 DB 없는 단지 - 회색 스타일) ──────── */
  const kakaoOnlyMarkerHtml = (name: string, viewers: number) => {
    // 이름에서 암의적 평형 추정 (xx평 패턴 검색)
    const pyeongMatch = name.match(/(\d{2})평|평/); // 이름에 평형 없으면 기본 30평
    const pyeong = pyeongMatch ? parseInt(pyeongMatch[1] || "30") : 30;
    return `
      <div style="
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        filter: drop-shadow(0 3px 8px rgba(0,0,0,0.2));
        opacity: 0.85;
      ">
        <div style="
          background: rgba(30, 41, 59, 0.85);
          color: #cbd5e1;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 12px;
          margin-bottom: 3px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 3px;
        ">
          <span style="color:#94a3b8; font-size:9px;">👁</span> ${viewers}명 보는중
        </div>
        <div style="
          background: linear-gradient(135deg, #475569 0%, #334155 100%);
          color: #e2e8f0;
          padding: 6px 11px 5px;
          border-radius: 10px;
          border: 2px solid #64748b;
          white-space: nowrap;
          font-family: 'Pretendard', sans-serif;
          line-height: 1.2;
          text-align: center;
          min-width: 64px;
        ">
          <div style="font-size: 10px; font-weight: 500; opacity: 0.75;">${pyeong}평대</div>
          <div style="font-size: 12px; font-weight: 700; color: #94a3b8;">시세보기</div>
        </div>
        <div style="
          width: 0; height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 8px solid #334155;
          margin-top: -1px;
        "></div>
      </div>
    `;
  };

  /* ── 호갱노노 스타일 마커 HTML 빌더 ─────────────────── */
  const markerHtml = (apt: AptMarker, isHighlight: boolean) => {
    const isMain = isHighlight;
    const bgGradient = isMain 
      ? "linear-gradient(135deg, #e11d48 0%, #be123c 100%)" 
      : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)";
    const borderColor = isMain ? "#fecdd3" : "#c7d2fe";

    const rent = Math.round((apt.rentNum || apt.priceNum * 0.55) / 10000);
    const priceLabel = filters.tradeType === "매매" ? apt.avgPrice : `${rent}억`;
    const viewers = apt.liveViewers || Math.floor(Math.random() * 80 + 20);

    return `
      <div style="
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
        ${isMain ? "transform: scale(1.12); transform-origin: bottom center; z-index: 999;" : ""}
      ">
        <div style="
          background: rgba(30, 41, 59, 0.9);
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 12px;
          margin-bottom: 3px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          display: flex;
          align-items: center;
          gap: 3px;
        ">
          <span style="color:#f43f5e; font-size:9px;">🔥</span> ${viewers}명 보는중
        </div>

        <div style="
          background: ${bgGradient};
          color: #ffffff;
          padding: 6px 11px 5px;
          border-radius: 10px;
          border: 2.5px solid ${borderColor};
          white-space: nowrap;
          font-family: 'Pretendard', sans-serif;
          line-height: 1.15;
          text-align: center;
          min-width: 60px;
          ${isMain ? "box-shadow: 0 0 0 4px rgba(225, 29, 72, 0.4);" : ""}
        ">
          <div style="font-size: 10px; font-weight: 600; opacity: 0.9;">
            ${apt.pyeong}평
          </div>
          <div style="font-size: ${isMain ? "15px" : "13.5px"}; font-weight: 800; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
            ${priceLabel}
          </div>
        </div>

        <div style="
          width: 0; height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 8px solid ${isMain ? "#be123c" : "#3730a3"};
          margin-top: -1px;
        "></div>
      </div>
    `;
  };

  /* ── 카카오 지도 초기화 (geolocation → 지도 순서로 초기화) ──────── */
  useEffect(() => {
    if (typeof window === "undefined" || mapRef.current) return;

    const fallbackCenter = { lat: 37.4950, lng: 127.0550 };
    let isCancelled = false;

    const initMap = (startCenter: { lat: number; lng: number }, isUserLocation: boolean) => {
      loadKakaoMap()
        .then((kakaoMaps) => {
          if (isCancelled || !containerRef.current || mapRef.current) return;

          // 초기 중심: center prop > highlightId 단지 > geolocation/서울 기본
          const initCenter = center
            ? new kakaoMaps.LatLng(center.lat, center.lng)
            : highlightId
              ? new kakaoMaps.LatLng(
                  APT_MARKERS.find((a) => a.id === highlightId)?.lat ?? startCenter.lat,
                  APT_MARKERS.find((a) => a.id === highlightId)?.lng ?? startCenter.lng
                )
              : new kakaoMaps.LatLng(startCenter.lat, startCenter.lng);

          const initLevel = highlightId ? 3 : 4;

          const map = new kakaoMaps.Map(containerRef.current, {
            center: initCenter,
            level: initLevel,
          });

          mapRef.current = map;
          setIsGeoLoading(false);
          setIsMapReady(true);

          if (isUserLocation) {
            setUserPos(startCenter);
          } else if (!center) {
            setUserPos(fallbackCenter);
          }
        })
        .catch((err) => {
          console.error("카카오 지도 초기화 오류:", err);
          setIsGeoLoading(false);
        });
    };

    if (center || highlightId) {
      // center prop이나 highlightId가 있으면 바로 초기화
      initMap(center || fallbackCenter, false);
    } else if (geoResolvedRef.current) {
      // 이미 geolocation 결과가 있으면 바로 사용
      initMap(geoResolvedRef.current, true);
    } else if (navigator.geolocation) {
      // geolocation 먼저 시도 → 결과 받은 후 지도 초기화
      setIsGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        (p) => {
          if (isCancelled) return;
          const pos = { lat: p.coords.latitude, lng: p.coords.longitude };
          geoResolvedRef.current = pos;
          initMap(pos, true);
        },
        () => {
          // 위치 실패 시 서울 기본값으로 초기화
          if (!isCancelled) initMap(fallbackCenter, false);
        },
        { timeout: 5000, maximumAge: 300000 }
      );
    } else {
      initMap(fallbackCenter, false);
    }

    return () => {
      isCancelled = true;
      if (overlaysRef.current.length > 0) {
        overlaysRef.current.forEach((o) => o.setMap(null));
        overlaysRef.current = [];
      }
      if (userOverlayRef.current) {
        userOverlayRef.current.setMap(null);
        userOverlayRef.current = null;
      }
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── 화면 영역 이동/줌 시 마커 갱신 ──────────────────────── */
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.kakao?.maps) return;

    const kakaoMaps = window.kakao.maps;
    const map = mapRef.current;

    const renderMarkersForViewport = () => {
      if (!map) return;
      const bounds = map.getBounds();
      if (!bounds) return;

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      if (!sw || !ne) return;

      const minLat = sw.getLat();
      const maxLat = ne.getLat();
      const minLng = sw.getLng();
      const maxLng = ne.getLng();

      // 지도 화면 바깥 15% 버퍼 패딩
      const latSpan = maxLat - minLat;
      const lngSpan = maxLng - minLng;
      const pMinLat = minLat - latSpan * 0.15;
      const pMaxLat = maxLat + latSpan * 0.15;
      const pMinLng = minLng - lngSpan * 0.15;
      const pMaxLng = maxLng + lngSpan * 0.15;

      // 1. 현재 화면 바운드 내 아파트 추출
      const inBounds = APT_MARKERS.filter(
        (apt) => apt.lat >= pMinLat && apt.lat <= pMaxLat && apt.lng >= pMinLng && apt.lng <= pMaxLng
      );

      // 지역 요약 (화면 중심에 가장 가까운 단지 기준 또는 중심 좌표 기반)
      let regName = "수도권 주요 단지";
      if (inBounds.length > 0) {
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;
        // 중심과 가장 가까운 상위 5개 단지에서 다수 지역 추출 (화면 중심지 정확 반영)
        const sortedByCenter = [...inBounds].sort((a, b) => {
          const distA = Math.hypot(a.lat - centerLat, a.lng - centerLng);
          const distB = Math.hypot(b.lat - centerLat, b.lng - centerLng);
          return distA - distB;
        });
        const nearbyTop = sortedByCenter.slice(0, 7);
        const regCounts: Record<string, number> = {};
        nearbyTop.forEach((a) => {
          regCounts[a.region] = (regCounts[a.region] || 0) + 1;
        });
        const topReg = Object.entries(regCounts).sort((a, b) => b[1] - a[1])[0];
        if (topReg) regName = topReg[0];
      }
      setCurrentRegion(regName);
      setVisibleCount(inBounds.length);

      // 상위 컴포넌트 목록 동기화
      if (onVisibleApartmentsChange) {
        const inBoundsIds = new Set(inBounds.map((b) => b.id));
        const matchedApts = APARTMENTS_DATA.filter((a) => inBoundsIds.has(a.id));
        onVisibleApartmentsChange(matchedApts, regName);
      }

      // 2. 필터 적용
      const filtered = filterMarkers(inBounds);

      // 3. 줌 레벨에 따른 클러스터링
      // ─ 줌 아웃: 격자 셀당 실거래가 최고 단지 1개만 표시 (지역 대표)
      // ─ 줌 인 (레벨 4 이하): 화면 내 모든 단지 표시
      const level = map.getLevel();

      let displayMarkers: AptMarker[] = [];

      const clusterByGrid = (gridSize: number) => {
        const cellMap = new Map<string, AptMarker>();
        filtered.forEach((apt) => {
          const cellKey = `${Math.floor(apt.lat / gridSize)},${Math.floor(apt.lng / gridSize)}`;
          const existing = cellMap.get(cellKey);
          if (!existing || apt.priceNum > existing.priceNum) {
            cellMap.set(cellKey, apt);
          }
        });
        return Array.from(cellMap.values());
      };

      if (level >= 9) {
        // ── 레벨 9+ (광역·도 단위, ~50km+): 0.5도(약 55km) 셀당 최고가 1개 ──
        displayMarkers = clusterByGrid(0.5);
      } else if (level === 8) {
        // ── 레벨 8 (광역·시 단위, ~25km): 0.25도(약 28km) 셀당 최고가 1개 ──
        displayMarkers = clusterByGrid(0.25);
      } else if (level === 7) {
        // ── 레벨 7 (구 단위, ~10km): 0.12도(약 13km) 셀당 최고가 1개 ──
        displayMarkers = clusterByGrid(0.12);
      } else if (level === 6) {
        // ── 레벨 6 (동 단위, ~5km): 0.05도(약 5.5km) 셀당 최고가 1개 ──
        displayMarkers = clusterByGrid(0.05);
      } else {
        // ── 레벨 5 이하 (동네/단지 상세): 화면 내 전체 단지 최대 400개 ──
        const maxDisplay = 400;
        if (filtered.length <= maxDisplay) {
          displayMarkers = filtered;
        } else {
          // 지역(동/구 단위)별로 그룹화하여 각 지역의 대표 단지들을 균등하게 추출
          const regionGroups = new Map<string, AptMarker[]>();
          filtered.forEach((apt) => {
            const key = apt.region || "기타";
            if (!regionGroups.has(key)) regionGroups.set(key, []);
            regionGroups.get(key)!.push(apt);
          });
          regionGroups.forEach((list) => list.sort((a, b) => b.priceNum - a.priceNum));

          let round = 0;
          const pickedIds = new Set<string>();
          while (displayMarkers.length < maxDisplay && round < 8) {
            let addedInThisRound = 0;
            for (const [, list] of regionGroups) {
              if (displayMarkers.length >= maxDisplay) break;
              if (round < list.length) {
                const item = list[round];
                if (!pickedIds.has(item.id)) {
                  pickedIds.add(item.id);
                  displayMarkers.push(item);
                  addedInThisRound++;
                }
              }
            }
            if (addedInThisRound === 0) break;
            round++;
          }
          if (displayMarkers.length < maxDisplay) {
            const remaining = filtered
              .filter((a) => !pickedIds.has(a.id))
              .sort((a, b) => b.priceNum - a.priceNum);
            displayMarkers.push(...remaining.slice(0, maxDisplay - displayMarkers.length));
          }
        }
      }

      // highlightId 단지는 항상 포함
      if (highlightId) {
        const hlItem = APT_MARKERS.find((a) => a.id === highlightId);
        if (hlItem && !displayMarkers.some((a) => a.id === highlightId)) {
          displayMarkers = [hlItem, ...displayMarkers];
        }
      }

      // 기존 오버레이 정리
      overlaysRef.current.forEach((o) => o.setMap(null));
      overlaysRef.current = [];

      // 신규 오버레이 추가
      displayMarkers.forEach((apt) => {
        const isHL = apt.id === highlightId;
        const el = document.createElement("div");
        el.className = "apt-price-marker";
        el.innerHTML = markerHtml(apt, isHL);
        el.style.cursor = "pointer";

        el.addEventListener("click", () => {
          setSelectedApt(apt);
          map.panTo(new kakaoMaps.LatLng(apt.lat, apt.lng));
        });

        const overlay = new kakaoMaps.CustomOverlay({
          position: new kakaoMaps.LatLng(apt.lat, apt.lng),
          content: el,
          yAnchor: 1.0,
          zIndex: isHL ? 999 : 1,
        });

        overlay.setMap(map);
        overlaysRef.current.push(overlay);
      });
    };

    // 초기 실행 및 200ms 후 안정화 재실행
    renderMarkersForViewport();
    const initTimer = setTimeout(renderMarkersForViewport, 200);

    // 카카오 지도 이동(dragend, idle) 및 줄(zoom_changed) 이벤트 연동
    kakaoMaps.event.addListener(map, "dragend", renderMarkersForViewport);
    kakaoMaps.event.addListener(map, "zoom_changed", renderMarkersForViewport);
    kakaoMaps.event.addListener(map, "idle", renderMarkersForViewport);

    return () => {
      clearTimeout(initTimer);
      kakaoMaps.event.removeListener(map, "dragend", renderMarkersForViewport);
      kakaoMaps.event.removeListener(map, "zoom_changed", renderMarkersForViewport);
      kakaoMaps.event.removeListener(map, "idle", renderMarkersForViewport);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, isMapReady, highlightId]);

  /* ── 카카오 Places API로 누락 단지 실시간 보완 ──────────────── */
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.kakao?.maps) return;

    const kakaoMaps = window.kakao.maps;
    const map = mapRef.current;
    const apiKey = process.env.NEXT_PUBLIC_KAKAO_REST_KEY || "4d7cd3190ca38a795008ebd7cc053820";

    // 데이터 DB에 있는 단지 좌표 세트 (빠른 중복 판도용, 반지름 0.003도 기준)
    const dbCoordSet = new Set(
      APT_MARKERS.map((a) => `${a.lat.toFixed(3)},${a.lng.toFixed(3)}`)
    );

    const fetchKakaoOnlyMarkers = async () => {
      if (!map) return;
      const level = map.getLevel();
      // 동네/단지 탐색 레벨 (레벨 7 이하)에서 동작
      if (level > 7) {
        kakaoOnlyOverlaysRef.current.forEach((o) => o.setMap(null));
        kakaoOnlyOverlaysRef.current = [];
        return;
      }

      const bounds = map.getBounds();
      if (!bounds) return;

      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();
      const centerLat = (sw.getLat() + ne.getLat()) / 2;
      const centerLng = (sw.getLng() + ne.getLng()) / 2;

      // 0.002도(약 200m) 단위로 세밀화하여 뷰포트 이동 시 즉시 감지
      const viewportKey = `${centerLat.toFixed(3)},${centerLng.toFixed(3)},${level}`;
      if (viewportKey === lastViewportKeyRef.current) return;
      lastViewportKeyRef.current = viewportKey;

      // 반경 계산 (화면 크기에 비례, 최대 3km)
      const latSpan = ne.getLat() - sw.getLat();
      const radiusMeters = Math.min(Math.max(Math.round(latSpan * 111000 * 0.6), 400), 3000);

      try {
        // 1페이지 & 2페이지 최대 30건 검색하여 누락 차단
        const pages = [1, 2];
        const fetchPromises = pages.map((page) => {
          const url = `https://dapi.kakao.com/v2/local/search/keyword.json?` +
            `query=${encodeURIComponent("아파트")}` +
            `&x=${centerLng.toFixed(6)}&y=${centerLat.toFixed(6)}` +
            `&radius=${radiusMeters}&size=15&page=${page}&category_group_code=`;
          return fetch(url, { headers: { Authorization: `KakaoAK ${apiKey}` } })
            .then((r) => (r.ok ? r.json() : null))
            .catch(() => null);
        });

        const results = await Promise.all(fetchPromises);
        const docs: Array<{ place_name: string; x: string; y: string; category_name: string }> = [];
        results.forEach((res) => {
          if (res?.documents) docs.push(...res.documents);
        });

        // 실제 아파트 주거시설만 필터
        const aptDocs = docs.filter((d) =>
          d.category_name &&
          (d.category_name.includes("아파트") || d.place_name.includes("아파트")) &&
          !d.place_name.includes("상가") &&
          !d.place_name.includes("관리사무소") &&
          !d.place_name.includes("노인정") &&
          !d.place_name.includes("어린이집") &&
          !d.place_name.includes("공인중개사")
        );

        // 기존 카카오 전용 마커 정리
        kakaoOnlyOverlaysRef.current.forEach((o) => o.setMap(null));
        kakaoOnlyOverlaysRef.current = [];

        // 화면 내 마스터 DB 단지 목록 (정밀 거리 비교용)
        const visibleDbMarkers = APT_MARKERS.filter(
          (a) => a.lat >= sw.getLat() && a.lat <= ne.getLat() && a.lng >= sw.getLng() && a.lng <= ne.getLng()
        );

        // 우리 DB에 45m 이내로 없는 단지만 카카오 전용 마커로 보강 렌더링
        const addedSet = new Set<string>();

        aptDocs.forEach((doc, idx) => {
          const lat = parseFloat(doc.y);
          const lng = parseFloat(doc.x);
          if (!lat || !lng) return;

          // 반경 40m 이내에 마스터 단지가 이미 있거나 이름이 같으면 스킵
          const isAlreadyInDb = visibleDbMarkers.some((m) => {
            const dist = Math.hypot(m.lat - lat, m.lng - lng);
            return dist < 0.00045 || m.name.replace(/\s+/g, "").includes(doc.place_name.replace(/\s+/g, "").slice(0, 4));
          });
          if (isAlreadyInDb) return;

          // 동일 좌표 중복 추가 방지
          const dedupKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
          if (addedSet.has(dedupKey)) return;
          addedSet.add(dedupKey);

          const viewers = 25 + ((idx * 19) % 70);
          const el = document.createElement("div");
          el.className = "apt-kakao-only-marker";
          el.innerHTML = kakaoOnlyMarkerHtml(doc.place_name, viewers);
          el.style.cursor = "pointer";

          // 클릭 시 카카오 상세 또는 검색 연결
          el.addEventListener("click", () => {
            const kakaoUrl = `https://map.kakao.com/link/search/${encodeURIComponent(doc.place_name)}`;
            window.open(kakaoUrl, "_blank");
          });

          const overlay = new kakaoMaps.CustomOverlay({
            position: new kakaoMaps.LatLng(lat, lng),
            content: el,
            yAnchor: 1.0,
            zIndex: 10,
          });

          overlay.setMap(map);
          kakaoOnlyOverlaysRef.current.push(overlay);
        });
      } catch (e) {
        console.warn("Kakao Places API error:", e);
      }
    };
    // 카카오 전용 마커는 이동(dragend, idle) 후 500ms 디바운스로 호출
    const debouncedFetch = () => {
      if (kakaoSearchTimerRef.current) clearTimeout(kakaoSearchTimerRef.current);
      kakaoSearchTimerRef.current = setTimeout(fetchKakaoOnlyMarkers, 500);
    };

    fetchKakaoOnlyMarkers();
    kakaoMaps.event.addListener(map, "dragend", debouncedFetch);
    kakaoMaps.event.addListener(map, "zoom_changed", debouncedFetch);
    kakaoMaps.event.addListener(map, "idle", debouncedFetch);

    return () => {
      if (kakaoSearchTimerRef.current) clearTimeout(kakaoSearchTimerRef.current);
      kakaoMaps.event.removeListener(map, "dragend", debouncedFetch);
      kakaoMaps.event.removeListener(map, "zoom_changed", debouncedFetch);
      kakaoMaps.event.removeListener(map, "idle", debouncedFetch);
      kakaoOnlyOverlaysRef.current.forEach((o) => o.setMap(null));
      kakaoOnlyOverlaysRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMapReady]);

  /* ── 외부 center prop 변경 시 지도 중심 및 줌 레벨 이동 (검색 결과 반영) ── */
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !center || !window.kakao?.maps) return;
    const kakaoMaps = window.kakao.maps;
    const map = mapRef.current;

    const targetPos = new kakaoMaps.LatLng(center.lat, center.lng);
    const curr = map.getCenter();
    const diff =
      Math.abs(curr.getLat() - center.lat) + Math.abs(curr.getLng() - center.lng);

    if (diff > 0.0005) {
      // 검색된 지역/역세권을 한눈에 보기 편하도록 최적 레벨(4~5)로 조정 후 부드럽게 이동
      if (map.getLevel() > 5) {
        map.setLevel(5);
      }
      map.panTo(targetPos);
    }
  }, [center?.lat, center?.lng, isMapReady]);

  /* ── 내 위치 펄스 마커 ────────────────────────────────── */
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !userPos || !window.kakao?.maps) return;
    const kakaoMaps = window.kakao.maps;

    if (userOverlayRef.current) {
      userOverlayRef.current.setMap(null);
    }

    const userEl = document.createElement("div");
    userEl.innerHTML = `
      <div style="position:relative; width:22px; height:22px; cursor:default;">
        <div style="
          position:absolute; inset:-4px;
          background:rgba(239,68,68,0.35);
          border-radius:50%;
          animation: pulse 1.8s infinite;
        "></div>
        <div style="
          position:relative; width:14px; height:14px; margin:4px;
          background:#ef4444; border:2.5px solid #ffffff;
          border-radius:50%; box-shadow:0 2px 6px rgba(0,0,0,0.3);
        "></div>
      </div>
    `;

    const userOverlay = new kakaoMaps.CustomOverlay({
      position: new kakaoMaps.LatLng(userPos.lat, userPos.lng),
      content: userEl,
      xAnchor: 0.5,
      yAnchor: 0.5,
      zIndex: 1000,
    });

    userOverlay.setMap(mapRef.current);
    userOverlayRef.current = userOverlay;
  }, [userPos, isMapReady]);

  // 활성화된 필터 개수 계산
  const activeFilterCount = Object.entries(filters).filter(([k, v]) => {
    if (k === "tradeType") return v !== "매매";
    if (typeof v === "number") return v > 0;
    return v !== "전체";
  }).length;

  // 필터별 라벨 텍스트 생성
  const getFilterLabel = (key: keyof FilterState) => {
    const val = filters[key];
    if (key === "pyeong") return val === 0 ? "평형 ∨" : `${val}평대`;
    if (key === "price" && typeof val === "number") return val === 0 ? "가격 ∨" : `${val / 10000}억 이하`;
    if (key === "household") return val === 0 ? "세대수 ∨" : `${val}세대↑`;
    if (key === "builtYear") return val === 0 ? "입주년차 ∨" : `${val}년 이내`;
    if (key === "far") return val === 0 ? "용적률 ∨" : `${val}% 이하`;
    if (key === "bcr") return val === 0 ? "건폐율 ∨" : `${val}% 이하`;
    if (key === "jeonseRatio") return val === 0 ? "전세가율 ∨" : `${val}% 이상`;
    if (key === "gapPrice" && typeof val === "number") return val === 0 ? "갭가격 ∨" : `${val / 10000}억 이하`;
    if (key === "rentalBizRatio") return val === 0 ? "임대사업율 ∨" : `${val}% 이상`;
    if (key === "monthlyYield" && typeof val === "number") return val === 0 ? "월세수익률 ∨" : `${val / 10}% 이상`;
    if (key === "parking" && typeof val === "number") return val === 0 ? "주차공간 ∨" : `${val / 10}대 이상`;
    if (key === "hallType") return val === "전체" ? "현관구조 ∨" : val;
    if (key === "heatingType") return val === "전체" ? "난방방식 ∨" : val;
    return "필터";
  };

  return (
    <div className="space-y-3 select-none">
      {/* ── 필터 툴바 ────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-2.5 sm:p-3 space-y-2.5">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {/* 필터 모달 열기 버튼 */}
            <button
              onClick={() => setIsModalOpen(true)}
              className={`flex items-center justify-center h-9 px-3 rounded-2xl shadow-sm border transition-all cursor-pointer ${
                activeFilterCount > 0
                  ? "bg-indigo-600 text-white border-indigo-700 shadow-indigo-200"
                  : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
              }`}
              title="상세 필터 모달 열기"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {activeFilterCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-rose-500 text-white text-[10px] font-black rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* 초기화 버튼 */}
            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center justify-center w-9 h-9 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                title="필터 전체 초기화"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}

            {/* 거래 형태 탭 */}
            <div className="flex bg-slate-100 p-0.5 sm:p-1 rounded-2xl text-xs font-bold border border-slate-200">
              {(["매매", "전세", "월세"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilters({ ...filters, tradeType: t })}
                  className={`px-2.5 sm:px-3 py-1 rounded-xl transition-all cursor-pointer text-xs ${
                    filters.tradeType === t ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* 조건 필터 접기/펼치기 토글 버튼 */}
          <button
            onClick={() => {
              setIsFiltersExpanded((prev) => !prev);
              if (isFiltersExpanded) setActiveFilterKey(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ml-auto ${
              isFiltersExpanded || activeFilterCount > 0
                ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs"
                : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
            }`}
          >
            <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>선택항목 {isFiltersExpanded ? "접기 ∧" : "펼치기 ∨"}</span>
            {activeFilterCount > 0 && !isFiltersExpanded && (
              <span className="px-1.5 py-0.2 bg-indigo-600 text-white text-[10px] font-black rounded-full">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* 13개 세부 조건 칩버튼 (펼쳤을 때만 노출) */}
        {isFiltersExpanded && (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-slate-100 animate-slide-down">
            {[
              { key: "rentalBizRatio", name: "임대사업율" },
              { key: "jeonseRatio", name: "전세가율" },
              { key: "gapPrice", name: "갭가격" },
              { key: "monthlyYield", name: "월세수익률" },
              { key: "pyeong", name: "평형" },
              { key: "price", name: "가격" },
              { key: "household", name: "세대수" },
              { key: "builtYear", name: "입주년차" },
              { key: "far", name: "용적률" },
              { key: "bcr", name: "건폐율" },
              { key: "parking", name: "주차공간" },
              { key: "hallType", name: "현관구조" },
              { key: "heatingType", name: "난방방식" },
            ].map(({ key }) => {
              const isSelected = activeFilterKey === key;
              const isFilterActive = key === "hallType" || key === "heatingType" 
                ? (filters as any)[key] !== "전체" 
                : (filters as any)[key] > 0;

              return (
                <button
                  key={key}
                  onClick={() => setActiveFilterKey(isSelected ? null : key)}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-bold border transition-all cursor-pointer ${
                    isSelected || isFilterActive
                      ? "bg-indigo-600 text-white border-indigo-700 shadow-md shadow-indigo-200"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {getFilterLabel(key as keyof FilterState)}
                </button>
              );
            })}
          </div>
        )}

        {/* 세부 필터 조절 패널 */}
        {activeFilterKey && (
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3 animate-slide-down">
            <div className="flex justify-between items-center">
              <span className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <span>⚙️</span>
                <span>
                  {activeFilterKey === "rentalBizRatio" && "임대사업자 비율 설정"}
                  {activeFilterKey === "jeonseRatio" && "전세가율 범위 설정"}
                  {activeFilterKey === "gapPrice" && "갭투자 금액 설정"}
                  {activeFilterKey === "monthlyYield" && "월세 수익률 설정"}
                  {activeFilterKey === "pyeong" && "평형 선택"}
                  {activeFilterKey === "price" && "매매 상한가 설정"}
                  {activeFilterKey === "household" && "최소 세대수 설정"}
                  {activeFilterKey === "builtYear" && "입주년차 (연식) 설정"}
                  {activeFilterKey === "far" && "용적률 제한 설정"}
                  {activeFilterKey === "bcr" && "건폐율 제한 설정"}
                  {activeFilterKey === "parking" && "세대당 주차대수 설정"}
                  {activeFilterKey === "hallType" && "현관 구조 선택"}
                  {activeFilterKey === "heatingType" && "난방 방식 선택"}
                </span>
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (activeFilterKey === "hallType" || activeFilterKey === "heatingType") {
                      setFilters({ ...filters, [activeFilterKey]: "전체" });
                    } else {
                      setFilters({ ...filters, [activeFilterKey]: 0 });
                    }
                  }}
                  className="text-xs font-bold text-slate-500 hover:text-indigo-600 hover:underline cursor-pointer"
                >
                  초기화
                </button>
                <button
                  onClick={() => setActiveFilterKey(null)}
                  className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 font-extrabold text-xs rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                >
                  <span>∧</span>
                  <span>접기</span>
                </button>
              </div>
            </div>

            {/* 임대사업율 슬라이더 */}
            {activeFilterKey === "rentalBizRatio" && (
              <div className="space-y-3 py-1">
                <div className="flex justify-between text-xs font-black text-indigo-600">
                  <span>최소 비율</span>
                  <span>{filters.rentalBizRatio === 0 ? "전체 (0% 이상)" : `${filters.rentalBizRatio}% 이상`}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={5}
                  value={filters.rentalBizRatio}
                  onChange={(e) => setFilters({ ...filters, rentalBizRatio: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold px-0.5">
                  <span>0%</span>
                  <span>10%</span>
                  <span>20%</span>
                  <span>30%</span>
                </div>
              </div>
            )}

            {/* 전세가율 슬라이더 */}
            {activeFilterKey === "jeonseRatio" && (
              <div className="space-y-3 py-1">
                <div className="flex justify-between text-xs font-black text-indigo-600">
                  <span>최소 전세가율</span>
                  <span>{filters.jeonseRatio === 0 ? "전체 무관" : `${filters.jeonseRatio}% 이상`}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={10}
                  value={filters.jeonseRatio}
                  onChange={(e) => setFilters({ ...filters, jeonseRatio: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold px-0.5">
                  <span>0%</span>
                  <span>50%</span>
                  <span>60%</span>
                  <span>70%</span>
                  <span>80%</span>
                </div>
              </div>
            )}

            {/* 갭가격 슬라이더 */}
            {activeFilterKey === "gapPrice" && (
              <div className="space-y-3 py-1">
                <div className="flex justify-between text-xs font-black text-indigo-600">
                  <span>최대 갭금액</span>
                  <span>{filters.gapPrice === 0 ? "전체 무관" : `${filters.gapPrice / 10000}억 이하`}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={150000}
                  step={20000}
                  value={filters.gapPrice}
                  onChange={(e) => setFilters({ ...filters, gapPrice: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold px-0.5">
                  <span>0억</span>
                  <span>4억</span>
                  <span>8억</span>
                  <span>12억</span>
                  <span>15억 이상</span>
                </div>
              </div>
            )}

            {/* 월세수익률 슬라이더 */}
            {activeFilterKey === "monthlyYield" && (
              <div className="space-y-3 py-1">
                <div className="flex justify-between text-xs font-black text-indigo-600">
                  <span>최소 수익률</span>
                  <span>{filters.monthlyYield === 0 ? "전체 무관" : `${filters.monthlyYield / 10}% 이상`}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={60}
                  step={5}
                  value={filters.monthlyYield}
                  onChange={(e) => setFilters({ ...filters, monthlyYield: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold px-0.5">
                  <span>0%</span>
                  <span>2.0%</span>
                  <span>4.0%</span>
                  <span>6.0%</span>
                </div>
              </div>
            )}

            {/* 주차공간 슬라이더 */}
            {activeFilterKey === "parking" && (
              <div className="space-y-3 py-1">
                <div className="flex justify-between text-xs font-black text-indigo-600">
                  <span>세대당 주차대수</span>
                  <span>{filters.parking === 0 ? "전체 무관" : `${filters.parking / 10}대 이상`}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={25}
                  step={2}
                  value={filters.parking}
                  onChange={(e) => setFilters({ ...filters, parking: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold px-0.5">
                  <span>0대</span>
                  <span>1.0대</span>
                  <span>1.5대</span>
                  <span>2.0대 이상</span>
                </div>
              </div>
            )}

            {/* 평형 옵션 */}
            {activeFilterKey === "pyeong" && (
              <div className="flex gap-2">
                {[
                  { label: "전체", val: 0 },
                  { label: "20평대", val: 20 },
                  { label: "30평대", val: 30 },
                  { label: "40평대 이상", val: 40 },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setFilters({ ...filters, pyeong: opt.val })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filters.pyeong === opt.val
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* 가격 상한가 슬라이더 및 옵션 */}
            {activeFilterKey === "price" && (
              <div className="space-y-3 py-1">
                <div className="flex justify-between text-xs font-black text-indigo-600">
                  <span>최대 매매가</span>
                  <span>{filters.price === 0 ? "전체 (금액 무관)" : `${filters.price / 10000}억 이하`}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={300000}
                  step={10000}
                  value={filters.price}
                  onChange={(e) => setFilters({ ...filters, price: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold px-0.5">
                  <span>0억</span>
                  <span>5억</span>
                  <span>10억</span>
                  <span>20억</span>
                  <span>30억</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
                  {[
                    { label: "전체", val: 0 },
                    { label: "5억↓", val: 50000 },
                    { label: "10억↓", val: 100000 },
                    { label: "15억↓", val: 150000 },
                    { label: "20억↓", val: 200000 },
                    { label: "30억↓", val: 300000 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setFilters({ ...filters, price: opt.val })}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filters.price === opt.val
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 세대수 옵션 */}
            {activeFilterKey === "household" && (
              <div className="flex gap-2">
                {[
                  { label: "전체", val: 0 },
                  { label: "500세대↑", val: 500 },
                  { label: "1000세대↑", val: 1000 },
                  { label: "3000세대↑", val: 3000 },
                ].map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setFilters({ ...filters, household: opt.val })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filters.household === opt.val
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {/* 입주년차 (연식) 슬라이더 및 옵션 */}
            {activeFilterKey === "builtYear" && (
              <div className="space-y-3 py-1">
                <div className="flex justify-between text-xs font-black text-indigo-600">
                  <span>최대 입주년차</span>
                  <span>{filters.builtYear === 0 ? "전체 (연식 무관)" : `${filters.builtYear}년 이내 (${2026 - filters.builtYear}년 이후 준공)`}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={5}
                  value={filters.builtYear}
                  onChange={(e) => setFilters({ ...filters, builtYear: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold px-0.5">
                  <span>0(무관)</span>
                  <span>5년</span>
                  <span>10년</span>
                  <span>15년</span>
                  <span>20년</span>
                  <span>30년</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 pt-1">
                  {[
                    { label: "전체", val: 0 },
                    { label: "5년 이내", val: 5 },
                    { label: "10년 이내", val: 10 },
                    { label: "15년 이내", val: 15 },
                    { label: "20년 이내", val: 20 },
                    { label: "30년 이내", val: 30 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setFilters({ ...filters, builtYear: opt.val })}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filters.builtYear === opt.val
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 용적률 제한 슬라이더 및 옵션 */}
            {activeFilterKey === "far" && (
              <div className="space-y-3 py-1">
                <div className="flex justify-between text-xs font-black text-indigo-600">
                  <span>용적률 상한</span>
                  <span>{filters.far === 0 ? "전체 (제한 없음)" : `${filters.far}% 이하`}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={300}
                  step={20}
                  value={filters.far}
                  onChange={(e) => setFilters({ ...filters, far: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold px-0.5">
                  <span>0(무관)</span>
                  <span>160%</span>
                  <span>200%</span>
                  <span>250%</span>
                  <span>300%</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 pt-1">
                  {[
                    { label: "전체", val: 0 },
                    { label: "160%↓", val: 160 },
                    { label: "200%↓", val: 200 },
                    { label: "250%↓", val: 250 },
                    { label: "300%↓", val: 300 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setFilters({ ...filters, far: opt.val })}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filters.far === opt.val
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 건폐율 제한 슬라이더 및 옵션 */}
            {activeFilterKey === "bcr" && (
              <div className="space-y-3 py-1">
                <div className="flex justify-between text-xs font-black text-indigo-600">
                  <span>건폐율 상한</span>
                  <span>{filters.bcr === 0 ? "전체 (제한 없음)" : `${filters.bcr}% 이하`}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={2}
                  value={filters.bcr}
                  onChange={(e) => setFilters({ ...filters, bcr: Number(e.target.value) })}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold px-0.5">
                  <span>0(무관)</span>
                  <span>15%</span>
                  <span>20%</span>
                  <span>25%</span>
                  <span>30%</span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-1.5 pt-1">
                  {[
                    { label: "전체", val: 0 },
                    { label: "15%↓", val: 15 },
                    { label: "18%↓", val: 18 },
                    { label: "20%↓", val: 20 },
                    { label: "25%↓", val: 25 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setFilters({ ...filters, bcr: opt.val })}
                      className={`py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        filters.bcr === opt.val
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 현관구조 옵션 */}
            {activeFilterKey === "hallType" && (
              <div className="flex gap-2">
                {["전체", "계단식", "복도식", "혼합식"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilters({ ...filters, hallType: opt })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filters.hallType === opt
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* 난방방식 옵션 */}
            {activeFilterKey === "heatingType" && (
              <div className="flex gap-2">
                {["전체", "지역난방", "개별난방", "중앙난방"].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => setFilters({ ...filters, heatingType: opt })}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      filters.heatingType === opt
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {/* 필터 접기 */}
            <div className="pt-2 border-t border-slate-200/80 flex justify-center">
              <button
                onClick={() => setActiveFilterKey(null)}
                className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-indigo-600 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <span>∧</span>
                <span>필터 창 접기</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── 지도 뷰포트 ──────────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        {/* 상단 좌측 현재 화면 지역 및 단지수 실시간 안내 배지 */}
        <div className="absolute top-4 left-4 z-[20] pointer-events-none">
          <div className="bg-slate-900/85 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full shadow-lg border border-slate-700/60 flex items-center gap-2 text-xs font-bold animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>📍 {currentRegion}</span>
            <span className="text-slate-400">|</span>
            <span className="text-amber-300 font-extrabold">{visibleCount}개 단지 시세 표시중</span>
          </div>
        </div>

        {/* 우측 수직 플로팅 툴바 */}
        <div className="absolute top-4 right-3 z-[20] flex flex-col gap-2">
          {/* 줌 버튼 */}
          <div className="flex flex-col bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
            <button
              onClick={() => mapRef.current?.setLevel(mapRef.current.getLevel() - 1, { animate: true })}
              className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold text-lg cursor-pointer border-b border-slate-100 transition-colors"
              title="확대"
            >
              +
            </button>
            <button
              onClick={() => mapRef.current?.setLevel(mapRef.current.getLevel() + 1, { animate: true })}
              className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold text-lg cursor-pointer transition-colors"
              title="축소"
            >
              −
            </button>
          </div>

          {/* 탭 버튼 */}
          <div className="hidden sm:flex flex-col bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-slate-200/80 py-1 text-[11px] font-bold text-slate-600">
            {(["지도", "주변", "거리", "분석"] as const).map((menu) => (
              <button
                key={menu}
                onClick={() => setActiveTab(menu)}
                className={`px-2.5 py-1.5 transition-colors cursor-pointer text-center ${
                  activeTab === menu ? "text-indigo-600 bg-indigo-50 font-extrabold" : "hover:bg-slate-50"
                }`}
              >
                {menu}
              </button>
            ))}
          </div>

          {/* 내 위치 이동 버튼 */}
          <button
            onClick={() => {
              if (!mapRef.current || !window.kakao?.maps) return;
              const target = userPos ? userPos : { lat: 37.4950, lng: 127.0550 };
              mapRef.current.panTo(new window.kakao.maps.LatLng(target.lat, target.lng));
            }}
            className="w-9 h-9 bg-white/95 backdrop-blur rounded-2xl shadow-lg border border-slate-200/80 flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            title="내 위치로"
          >
            🎯
          </button>
        </div>

        {/* 카카오 지도 컨테이너 */}
        <div ref={containerRef} style={{ height: computedHeight }} className="w-full bg-slate-100 transition-[height] duration-200" />

        {/* geolocation 로딩 중 오버레이 */}
        {isGeoLoading && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-[30] rounded-3xl">
            <div className="bg-white rounded-3xl px-8 py-6 shadow-2xl flex flex-col items-center gap-4">
              <div className="relative w-14 h-14">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 animate-spin" />
                <span className="absolute inset-0 flex items-center justify-center text-2xl">📍</span>
              </div>
              <div className="text-center">
                <div className="font-extrabold text-slate-800 text-base">내 위치 찾는 중...</div>
                <div className="text-slate-500 text-xs mt-1">위치 권한을 허용해주세요</div>
              </div>
            </div>
          </div>
        )}

        {/* 선택 단지 팝업 카드 */}
        {selectedApt && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-[25] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-5 sm:w-88 animate-slide-up">
            <button
              onClick={() => setSelectedApt(null)}
              className="absolute top-3.5 right-4 text-slate-400 hover:text-slate-700 text-xl font-bold cursor-pointer leading-none"
            >
              ×
            </button>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                <span>📍 {selectedApt.region}</span>
                <span className="text-slate-300">•</span>
                <span className="text-rose-500 font-bold">🔥 {selectedApt.liveViewers}명 관심</span>
              </div>
              {realtimeTx?.isLoading ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 animate-pulse">
                  <span>🔄</span> 국토부 조회중
                </span>
              ) : realtimeTx?.isRealConnected ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  국토부 실거래 연동
                </span>
              ) : null}
            </div>
            <div className="text-lg font-extrabold text-slate-900 pr-6 leading-tight mb-2.5">{selectedApt.name}</div>

            {/* 시세 3종 */}
            <div className="grid grid-cols-3 gap-1.5 mb-2.5">
              <div className="bg-rose-50/80 rounded-2xl p-2.5 border border-rose-100/90 text-center">
                <div className="text-[10px] text-rose-500 font-bold mb-0.5">
                  {realtimeTx?.isRealConnected ? "최근 실거래 평균" : "매매 평균"}
                </div>
                <div className="text-base font-black text-rose-700 leading-tight">
                  {realtimeTx?.avgPriceStr || selectedApt.avgPrice}
                </div>
                <div className="text-[9px] text-rose-400 mt-0.5">
                  {realtimeTx?.latestPriceStr ? `최신 ${realtimeTx.latestPriceStr}` : `${selectedApt.pyeong}평`}
                </div>
              </div>
              <div className="bg-blue-50/80 rounded-2xl p-2.5 border border-blue-100/90 text-center">
                <div className="text-[10px] text-blue-500 font-bold mb-0.5">전세 시세</div>
                <div className="text-base font-black text-blue-700 leading-tight">
                  {realtimeTx?.jeonsePriceStr || `${Math.round((selectedApt.rentNum || selectedApt.priceNum * 0.56) / 10000)}억`}
                </div>
                <div className="text-[9px] text-blue-400 mt-0.5">전세가율 {selectedApt.jeonseRatio ?? 56}%</div>
              </div>
              <div className="bg-emerald-50/80 rounded-2xl p-2.5 border border-emerald-100/90 text-center">
                <div className="text-[10px] text-emerald-600 font-bold mb-0.5">월세 추정</div>
                <div className="text-xs font-black text-emerald-800 leading-tight mt-1">
                  보 {Math.max(1, Math.round(((selectedApt.priceNum || 100000) * 0.1) / 10000))}억
                </div>
                <div className="text-[9px] text-emerald-600 mt-0.5 font-bold">
                  월 {Math.round(selectedApt.pyeong * 4.5 + 40)}만
                </div>
              </div>
            </div>

            {/* 갭가격 및 단지 주요 지표 */}
            <div className="flex items-center justify-between text-[11px] bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70 mb-3 text-slate-600">
              <span>
                갭투자{" "}
                <b className="text-indigo-600 font-bold">
                  {realtimeTx?.gapPriceStr || `${Math.round((selectedApt.gapPrice || selectedApt.priceNum * 0.44) / 10000)}억`}
                </b>
              </span>
              <span className="text-slate-300">|</span>
              <span>{selectedApt.householdCount ? `${selectedApt.householdCount.toLocaleString()}세대` : "대단지"}</span>
              <span className="text-slate-300">|</span>
              <span>{selectedApt.builtYear}년식</span>
            </div>

            <Link
              href={`/apt/${selectedApt.id}`}
              className="block w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-2xl text-sm font-bold shadow-md shadow-indigo-200 transition-all cursor-pointer"
            >
              단지 상세 분석 보기 →
            </Link>
          </div>
        )}
      </div>

      {/* 종합 14개 필터 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <span>🎛️</span> 호갱노노 맞춤 조건 필터 설정
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">14가지 세부 조건으로 아파트 실거래가를 탐색하세요.</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-2xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">1. 거래 유형</label>
                <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                  {(["매매", "전세", "월세"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setFilters({ ...filters, tradeType: t })}
                      className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                        filters.tradeType === t ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">2. 평형 선택</label>
                <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold">
                  {[
                    { label: "전체", val: 0 },
                    { label: "20평대", val: 20 },
                    { label: "30평대", val: 30 },
                    { label: "40평대↑", val: 40 },
                  ].map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setFilters({ ...filters, pyeong: opt.val })}
                      className={`flex-1 py-2 rounded-xl transition-all cursor-pointer ${
                        filters.pyeong === opt.val ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition-colors cursor-pointer"
              >
                🔄 전체 필터 초기화
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl text-xs shadow-md transition-colors cursor-pointer"
              >
                조건 적용하기 ({filterMarkers(APT_MARKERS).length}개 단지 탐색)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 지도 로딩 중 인디케이터 */}
      {!isMapReady && (
        <div
          className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center gap-3 z-[50]"
          style={{ height }}
        >
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500 font-semibold">카카오 지도를 로딩 중입니다...</p>
        </div>
      )}
    </div>
  );
}
