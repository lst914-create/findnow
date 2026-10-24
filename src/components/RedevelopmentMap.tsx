"use client";

import { useEffect, useRef, useState } from "react";
import { RedevelopmentZone, NearbyApartment } from "@/lib/redevelopment";
import { loadKakaoMap } from "@/lib/kakaoMapLoader";

interface RedevelopmentMapProps {
  zones: RedevelopmentZone[];
  selectedZone: RedevelopmentZone | null;
  onSelectZone: (zone: RedevelopmentZone) => void;
}

// 좌측 마커 표시 모드
type MarkerDataMode = "trades" | "asks" | "auctions" | "apartments";

// 우측 마커 상단 표시 기준
type MarkerBadgeCriteria = "진행단계" | "세대수" | "평당가";

export default function RedevelopmentMap({
  zones,
  selectedZone,
  onSelectZone,
}: RedevelopmentMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const kakaoMapInstanceRef = useRef<any>(null);
  const overlaysRef = useRef<any[]>([]);
  const polygonsRef = useRef<any[]>([]);
  const aptOverlaysRef = useRef<any[]>([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // 🔴 [좌측 빨간 상자] 마커 데이터 표시 모드
  const [markerMode, setMarkerMode] = useState<MarkerDataMode>("trades");
  const [showApartments, setShowApartments] = useState(true); // '단지' 토글

  // 🔴 [우측 빨간 상자] 레이어 및 지도 분석 도구
  const [showVirtualZone, setShowVirtualZone] = useState(true); // 가상구역 (폴리곤)
  const [useDistrict, setUseDistrict] = useState(false); // 지적도
  const [isSkyview, setIsSkyview] = useState(false); // 위성뷰
  const [showDeterioration, setShowDeterioration] = useState(false); // 노후도
  const [showLandUse, setShowLandUse] = useState(false); // 용도지역
  const [showTerrain, setShowTerrain] = useState(false); // 경사도(지형도)
  const [showRoadview, setShowRoadview] = useState(false); // 거리뷰(로드뷰 도로)
  const [badgeCriteria, setBadgeCriteria] = useState<MarkerBadgeCriteria>("진행단계"); // 표시 기준

  // 단계별 테마 색상 반환
  const getStageColor = (status: RedevelopmentZone["status"]) => {
    switch (status) {
      case "이주철거":
      case "착공":
        return { bg: "#f59e0b", border: "#d97706", text: "#fff" }; // 앰버
      case "관리처분인가":
        return { bg: "#8b5cf6", border: "#7c3aed", text: "#fff" }; // 보라
      case "사업시행인가":
        return { bg: "#2563eb", border: "#1d4ed8", text: "#fff" }; // 블루
      case "건축심의":
        return { bg: "#10b981", border: "#059669", text: "#fff" }; // 에메랄드
      case "조합설립인가":
        return { bg: "#0284c7", border: "#0369a1", text: "#fff" }; // 하늘
      default:
        return { bg: "#e11d48", border: "#be123c", text: "#fff" }; // 로즈
    }
  };

  // 지도 초기화
  useEffect(() => {
    let isMounted = true;

    loadKakaoMap()
      .then((kakaoMaps) => {
        if (!isMounted || !mapContainerRef.current) return;

        const initialCenter = selectedZone
          ? new kakaoMaps.LatLng(selectedZone.lat, selectedZone.lng)
          : new kakaoMaps.LatLng(37.6115, 127.0425); // 장위동 중심

        const options = {
          center: initialCenter,
          level: 6,
        };

        const map = new kakaoMaps.Map(mapContainerRef.current, options);
        kakaoMapInstanceRef.current = map;

        setMapLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load Kakao Map for Redevelopment:", err);
        setMapError(true);
      });

    return () => {
      isMounted = false;
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = "";
      }
      kakaoMapInstanceRef.current = null;
    };
  }, []);

  // 패널 접기/펼치기 등으로 지도 컨테이너 크기 변경 시 relayout 호출
  useEffect(() => {
    if (!mapLoaded || !mapContainerRef.current || !kakaoMapInstanceRef.current) return;
    const container = mapContainerRef.current;
    const observer = new ResizeObserver(() => {
      kakaoMapInstanceRef.current?.relayout();
    });
    observer.observe(container);
    return () => {
      observer.disconnect();
    };
  }, [mapLoaded]);


  // 1. 카카오맵 레이어 (지적도, 스카이뷰, 지형도, 로드뷰도로) 상태 반영
  useEffect(() => {
    if (!mapLoaded || !window.kakao || !kakaoMapInstanceRef.current) return;
    const kakaoMaps = window.kakao.maps;
    const map = kakaoMapInstanceRef.current;

    // 지적도 (USE_DISTRICT)
    if (useDistrict) {
      map.addOverlayMapTypeId(kakaoMaps.MapTypeId.USE_DISTRICT);
    } else {
      map.removeOverlayMapTypeId(kakaoMaps.MapTypeId.USE_DISTRICT);
    }

    // 스카이뷰 (HYBRID vs ROADMAP)
    if (isSkyview) {
      map.setMapTypeId(kakaoMaps.MapTypeId.HYBRID);
    } else {
      map.setMapTypeId(kakaoMaps.MapTypeId.ROADMAP);
    }

    // 지형도 (TERRAIN)
    if (showTerrain) {
      map.addOverlayMapTypeId(kakaoMaps.MapTypeId.TERRAIN);
    } else {
      map.removeOverlayMapTypeId(kakaoMaps.MapTypeId.TERRAIN);
    }

    // 로드뷰 도로 오버레이 (ROADVIEW)
    if (showRoadview) {
      map.addOverlayMapTypeId(kakaoMaps.MapTypeId.ROADVIEW);
    } else {
      map.removeOverlayMapTypeId(kakaoMaps.MapTypeId.ROADVIEW);
    }
  }, [mapLoaded, useDistrict, isSkyview, showTerrain, showRoadview]);

  // 2. 구역 마커 & 폴리곤 & 인근 아파트 단지 핀 렌더링
  useEffect(() => {
    if (!mapLoaded || !window.kakao || !window.kakao.maps || !kakaoMapInstanceRef.current)
      return;

    const kakaoMaps = window.kakao.maps;
    const map = kakaoMapInstanceRef.current;

    // 기존 오버레이 및 폴리곤 제거
    overlaysRef.current.forEach((overlay) => overlay.setMap(null));
    overlaysRef.current = [];

    polygonsRef.current.forEach((polygon) => polygon.setMap(null));
    polygonsRef.current = [];

    aptOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    aptOverlaysRef.current = [];

    // --- [A] 정비구역 렌더링 ---
    zones.forEach((zone) => {
      const isSelected = selectedZone?.id === zone.id;
      const color = getStageColor(zone.status);

      // (1) 폴리곤 (가상구역/경계선 토글)
      if (showVirtualZone && zone.polygon && zone.polygon.length > 2) {
        const path = zone.polygon.map(
          (coord) => new kakaoMaps.LatLng(coord.lat, coord.lng)
        );

        // 노후도 모드 켜져있을 경우 노후도 비율에 따른 색상 강조
        const fillColor = showDeterioration
          ? zone.zoneStatus && zone.zoneStatus.deteriorationRate >= 80
            ? "#dc2626"
            : "#ea580c"
          : color.bg;

        const polygon = new kakaoMaps.Polygon({
          path: path,
          strokeWeight: isSelected ? 3.5 : 2.2,
          strokeColor: isSelected ? "#0f172a" : color.border,
          strokeOpacity: isSelected ? 0.95 : 0.85,
          strokeStyle: "solid",
          fillColor: fillColor,
          fillOpacity: showDeterioration ? 0.48 : isSelected ? 0.4 : 0.26,
        });

        polygon.setMap(map);

        kakaoMaps.event.addListener(polygon, "mouseover", () => {
          if (selectedZone?.id !== zone.id) {
            polygon.setOptions({ strokeWeight: 3, fillOpacity: 0.35 });
          }
        });

        kakaoMaps.event.addListener(polygon, "mouseout", () => {
          if (selectedZone?.id !== zone.id) {
            polygon.setOptions({
              strokeWeight: 2,
              fillOpacity: showDeterioration ? 0.45 : 0.22,
            });
          }
        });

        kakaoMaps.event.addListener(polygon, "click", () => {
          onSelectZone(zone);
        });

        polygonsRef.current.push(polygon);
      }

      // (2) 구역 마커 (Custom Overlay)
      const contentDiv = document.createElement("div");
      contentDiv.className = "custom-zone-marker";
      contentDiv.style.cursor = "pointer";
      contentDiv.style.position = "relative";
      contentDiv.style.transform = isSelected ? "scale(1.1) translateY(-6px)" : "scale(1)";
      contentDiv.style.transition = "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)";
      contentDiv.style.zIndex = isSelected ? "35" : "15";

      // 뱃지 표시 기준에 따른 상단 뱃지 텍스트
      let topBadgeText: string = zone.status;
      if (badgeCriteria === "세대수") {
        topBadgeText = `${zone.totalUnits.toLocaleString()}세대`;
      } else if (badgeCriteria === "평당가") {
        topBadgeText = zone.avgLandPricePerPyeongManwon
          ? `${Math.round(zone.avgLandPricePerPyeongManwon).toLocaleString()}만/평`
          : zone.recentTradePriceDisplay;
      }

      // 마커 모드(실거래 / 매물 / 경매)에 따른 메인 라인 텍스트
      let mainPriceLine = `대지 ${
        zone.avgLandPricePerPyeongManwon
          ? Math.round(zone.avgLandPricePerPyeongManwon).toLocaleString() + "만/평"
          : zone.recentTradePriceDisplay
      }`;
      let subLine = `${zone.totalUnits.toLocaleString()}세대 · ${zone.generalRatio}% 분양`;

      if (markerMode === "asks") {
        mainPriceLine = `매물 ${zone.askCount}건 · 초기 ${zone.minInvestmentDisplay}~`;
        subLine = `P ${zone.estimatedPremiumDisplay}`;
      } else if (markerMode === "auctions") {
        mainPriceLine = `진행 경매 ${zone.auctionCount || 0}건`;
        subLine = `커뮤니티 ${zone.communityCount || 0}개 의견`;
      }

      contentDiv.innerHTML = `
        <div style="
          background: #ffffff;
          border-radius: 14px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.2), 0 1px 3px rgba(0,0,0,0.1);
          border: 2px solid ${isSelected ? "#1e293b" : "#e2e8f0"};
          padding: 6px 10px;
          min-width: 110px;
          text-align: center;
          font-family: inherit;
        ">
          <div style="display: flex; align-items: center; justify-content: center; gap: 4px; margin-bottom: 2px;">
            <span style="
              background: ${color.bg};
              color: ${color.text};
              font-size: 10px;
              font-weight: 700;
              padding: 2px 6px;
              border-radius: 6px;
              letter-spacing: -0.2px;
            ">${topBadgeText}</span>
            <span style="font-size: 11px; color: #64748b; font-weight: 600;">${zone.type}</span>
          </div>
          <div style="font-size: 13px; font-weight: 800; color: #0f172a; white-space: nowrap; letter-spacing: -0.3px;">
            ${zone.name}
          </div>
          <div style="font-size: 11px; font-weight: 700; color: ${
            markerMode === "asks" ? "#7c3aed" : "#2563eb"
          }; margin-top: 1px;">
            ${mainPriceLine}
          </div>
          <div style="font-size: 10px; color: #94a3b8; font-weight: 500;">
            ${subLine}
          </div>
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 6px solid ${isSelected ? "#1e293b" : "#ffffff"};
          margin: -1px auto 0;
        "></div>
      `;

      contentDiv.addEventListener("click", () => {
        onSelectZone(zone);
      });

      const position = new kakaoMaps.LatLng(zone.lat, zone.lng);
      const customOverlay = new kakaoMaps.CustomOverlay({
        position: position,
        content: contentDiv,
        yAnchor: 1.15,
      });

      customOverlay.setMap(map);
      overlaysRef.current.push(customOverlay);
    });

    // --- [B] 인근 아파트 단지 핀 렌더링 (재개발닷컴 시그니처 단지 마커) ---
    if (showApartments && selectedZone && selectedZone.nearbyApartments) {
      // 선택된 구역 주변 가상 좌표 오프셋으로 아파트 핀 생성
      const offsets = [
        { lat: 0.004, lng: -0.005 },
        { lat: 0.005, lng: 0.006 },
        { lat: -0.004, lng: 0.005 },
        { lat: -0.005, lng: -0.004 },
      ];

      selectedZone.nearbyApartments.forEach((apt, idx) => {
        const offset = offsets[idx % offsets.length];
        const aptLat = selectedZone.lat + offset.lat;
        const aptLng = selectedZone.lng + offset.lng;

        const aptDiv = document.createElement("div");
        aptDiv.style.cursor = "pointer";
        aptDiv.style.zIndex = "25";

        // 재개발닷컴 스타일의 [84 11.5억] 파란색 둥근 배지
        aptDiv.innerHTML = `
          <div style="
            display: inline-flex;
            align-items: center;
            background: #2563eb;
            color: #ffffff;
            border-radius: 9999px;
            padding: 3px 8px;
            font-size: 11px;
            font-weight: 800;
            box-shadow: 0 2px 8px rgba(37,99,235,0.4);
            border: 1.5px solid #ffffff;
            white-space: nowrap;
          ">
            <span style="opacity: 0.8; font-size: 9px; margin-right: 3px;">84</span>
            <span>${apt.recentPriceDisplay}</span>
          </div>
          <div style="
            background: rgba(15,23,42,0.85);
            color: #ffffff;
            font-size: 9px;
            font-weight: 600;
            border-radius: 4px;
            padding: 1px 4px;
            margin-top: 2px;
            text-align: center;
            white-space: nowrap;
          ">${apt.name}</div>
        `;

        const aptOverlay = new kakaoMaps.CustomOverlay({
          position: new kakaoMaps.LatLng(aptLat, aptLng),
          content: aptDiv,
          yAnchor: 1.1,
        });

        aptOverlay.setMap(map);
        aptOverlaysRef.current.push(aptOverlay);
      });
    }
  }, [
    zones,
    selectedZone,
    mapLoaded,
    onSelectZone,
    showVirtualZone,
    showDeterioration,
    markerMode,
    showApartments,
    badgeCriteria,
  ]);

  // 선택된 구역 변경 시 중심 이동
  useEffect(() => {
    if (!selectedZone || !kakaoMapInstanceRef.current || !window.kakao) return;
    const kakaoMaps = window.kakao.maps;
    const map = kakaoMapInstanceRef.current;
    const moveLatLon = new kakaoMaps.LatLng(selectedZone.lat, selectedZone.lng);
    map.panTo(moveLatLon);
    if (map.getLevel() > 5) {
      map.setLevel(5, { animate: true });
    }
  }, [selectedZone]);

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden font-sans">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* 로딩 표시 */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">재개발 정비구역 지도를 불러오는 중입니다...</span>
        </div>
      )}

      {/* 에러 폴백 */}
      {mapError && (
        <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-slate-700 font-semibold mb-1">지도를 불러올 수 없습니다.</p>
          <p className="text-slate-500 text-xs">네트워크 상태를 확인해주세요.</p>
        </div>
      )}

      {/* ======================================================== */}
      {/* 🔴 [좌측 빨간 상자] 마커 모드 토글 (실거래 / 매물 / 경매 / 단지) */}
      {/* ======================================================== */}
      <div className="absolute top-20 left-4 z-20 flex flex-col bg-white rounded-2xl shadow-xl border border-slate-200/90 p-1.5 gap-1 select-none backdrop-blur-md">
        <button
          onClick={() => setMarkerMode("trades")}
          className={`flex items-center justify-center px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            markerMode === "trades"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="실거래가 기준 마커"
        >
          <span className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                markerMode === "trades" ? "bg-blue-400" : "bg-slate-300"
              }`}
            />
            실거래
          </span>
        </button>

        <button
          onClick={() => setMarkerMode("asks")}
          className={`flex items-center justify-center px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            markerMode === "asks"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="매물수 및 초기투자금 표시"
        >
          매물
        </button>

        <button
          onClick={() => setMarkerMode("auctions")}
          className={`flex items-center justify-center px-3 py-2 rounded-xl text-xs font-bold transition-all ${
            markerMode === "auctions"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          title="경매 정보 표시"
        >
          경매
        </button>

        {/* '단지' 버튼: 재개발닷컴처럼 파란색 배경 강조 토글 */}
        <button
          onClick={() => setShowApartments((prev) => !prev)}
          className={`flex items-center justify-center px-3 py-2 rounded-xl text-xs font-black transition-all ${
            showApartments
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
              : "bg-slate-100 text-slate-400 hover:bg-slate-200"
          }`}
          title="인근 아파트 단지 실거래가 마커 켜기/끄기"
        >
          단지
        </button>
      </div>

      {/* ======================================================== */}
      {/* 🔴 [우측 빨간 상자] 지도 레이어 & 분석 도구 세로 컨트롤 바 */}
      {/* ======================================================== */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 select-none">
        {/* 호갱노노 스타일 세련된 플로팅 줌 컨트롤러 */}
        <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
          <button
            onClick={() => {
              if (!kakaoMapInstanceRef.current) return;
              kakaoMapInstanceRef.current.setLevel(kakaoMapInstanceRef.current.getLevel() - 1, { animate: true });
            }}
            className="w-10 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-extrabold text-base cursor-pointer border-b border-slate-100 transition-colors"
            title="지도 확대"
          >
            +
          </button>
          <button
            onClick={() => {
              if (!kakaoMapInstanceRef.current) return;
              kakaoMapInstanceRef.current.setLevel(kakaoMapInstanceRef.current.getLevel() + 1, { animate: true });
            }}
            className="w-10 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-extrabold text-base cursor-pointer transition-colors"
            title="지도 축소"
          >
            −
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-1.5 flex flex-col gap-1 text-[11px] font-bold">
          {/* 가상구역 (폴리곤) */}
          <button
            onClick={() => setShowVirtualZone((prev) => !prev)}
            className={`px-2.5 py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
              showVirtualZone
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            title="구역 경계선(폴리곤) 표시"
          >
            <span>가상구역</span>
          </button>

          {/* 지적도 */}
          <button
            onClick={() => setUseDistrict((prev) => !prev)}
            className={`px-2.5 py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
              useDistrict
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            title="카카오 지적편집도 오버레이"
          >
            <span>지적도</span>
          </button>

          {/* 위성뷰 */}
          <button
            onClick={() => setIsSkyview((prev) => !prev)}
            className={`px-2.5 py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
              isSkyview
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            title="위성 스카이뷰 전환"
          >
            <span>위성뷰</span>
          </button>

          {/* 노후도 */}
          <button
            onClick={() => setShowDeterioration((prev) => !prev)}
            className={`px-2.5 py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
              showDeterioration
                ? "bg-rose-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            title="구역 노후도 시각화"
          >
            <span>노후도</span>
          </button>

          {/* 용도지역 */}
          <button
            onClick={() => setShowLandUse((prev) => !prev)}
            className={`px-2.5 py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
              showLandUse
                ? "bg-indigo-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            title="용도지역 확인"
          >
            <span>용도</span>
          </button>

          {/* 경사도 (지형도) */}
          <button
            onClick={() => setShowTerrain((prev) => !prev)}
            className={`px-2.5 py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
              showTerrain
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            title="등고선 지형도 오버레이"
          >
            <span>경사도</span>
          </button>

          {/* 거리뷰 (로드뷰) */}
          <button
            onClick={() => setShowRoadview((prev) => !prev)}
            className={`px-2.5 py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
              showRoadview
                ? "bg-amber-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            title="로드뷰 도로망 오버레이"
          >
            <span>거리뷰</span>
          </button>

          {/* 거리재기 */}
          <button
            onClick={() => alert("지도에서 원하는 지점을 클릭하여 거리를 측정할 수 있습니다.")}
            className="px-2.5 py-2 rounded-xl flex flex-col items-center justify-center text-slate-600 hover:bg-slate-100 transition-all"
            title="거리재기 도구"
          >
            <span>거리재기</span>
          </button>
        </div>

        {/* 하단 표시 기준 토글 박스 */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-1.5 flex flex-col items-center gap-1">
          <span className="text-[10px] text-slate-400 font-bold px-1">표시</span>
          <button
            onClick={() => {
              if (badgeCriteria === "진행단계") setBadgeCriteria("세대수");
              else if (badgeCriteria === "세대수") setBadgeCriteria("평당가");
              else setBadgeCriteria("진행단계");
            }}
            className="w-full px-2 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-[10px] font-black border border-blue-200 hover:bg-blue-100 transition-colors whitespace-nowrap"
            title="마커 상단 표시 기준 변경"
          >
            {badgeCriteria} ▾
          </button>
        </div>
      </div>

      {/* 상단 좌측 단계 범례 */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 px-3.5 py-2 flex items-center gap-2 text-xs">
          <span className="font-bold text-slate-700 mr-1 flex items-center gap-1 text-[11px]">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>단계 범례
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-[10px]">
              구역지정
            </span>
            <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-semibold text-[10px]">
              조합설립
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[10px]">
              건축심의
            </span>
            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-semibold text-[10px]">
              사업시행
            </span>
            <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-[10px]">
              관리처분
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[10px]">
              이주·착공
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
