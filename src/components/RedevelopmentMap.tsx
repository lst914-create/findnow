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
  const wfsPolygonsRef = useRef<any[]>([]);
  const wfsInfoOverlayRef = useRef<any>(null);
  const aptOverlaysRef = useRef<any[]>([]);

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // 🏛️ 국토교통부 브이월드(VWorld) 공식 법적 지적 경계선(WFS) 연동 상태
  const [useOfficialWfs, setUseOfficialWfs] = useState(true);
  const [wfsStatus, setWfsStatus] = useState<{
    loading: boolean;
    hasKey: boolean;
    count: number;
    message?: string;
  }>({
    loading: false,
    hasKey: true,
    count: 0,
  });

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
    const handleResize = () => {
      kakaoMapInstanceRef.current?.relayout();
    };
    const observer = new ResizeObserver(handleResize);
    observer.observe(container);
    window.addEventListener("resize", handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
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

  // 🏛️ [국토부 공식 지적 경계선 WFS API 실시간 연동]
  // 아실, 재개발닷컴과 동일하게 화면 이동/확대 시 국토교통부 브이월드(LT_C_UQ111) GeoJSON 벡터를 실시간 로드
  useEffect(() => {
    if (!mapLoaded || !window.kakao || !kakaoMapInstanceRef.current) return;
    const kakaoMaps = window.kakao.maps;
    const map = kakaoMapInstanceRef.current;

    // WFS 비활성화 시 기존 WFS 폴리곤 제거 후 종료
    if (!useOfficialWfs) {
      wfsPolygonsRef.current.forEach((p) => p.setMap(null));
      wfsPolygonsRef.current = [];
      if (wfsInfoOverlayRef.current) {
        wfsInfoOverlayRef.current.setMap(null);
      }
      setWfsStatus((prev) => ({ ...prev, count: 0 }));
      return;
    }

    let debounceTimer: NodeJS.Timeout | null = null;

    const fetchOfficialWfsPolygons = async () => {
      try {
        const bounds = map.getBounds();
        if (!bounds) return;
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        // 줌 레벨이 너무 멀면 (전국 단위) WFS 호출 자제 (레벨 7 이하일 때만 정밀 지적선 조회)
        const currentLevel = map.getLevel();
        if (currentLevel > 7) {
          // 화면이 너무 축소된 상태일 때는 마커 중심 보기
          return;
        }

        setWfsStatus((prev) => ({ ...prev, loading: true }));

        const bbox = `${sw.getLng().toFixed(5)},${sw.getLat().toFixed(5)},${ne.getLng().toFixed(5)},${ne.getLat().toFixed(5)}`;
        const res = await fetch(`/api/redevelopment/wfs?bbox=${bbox}`);
        if (!res.ok) {
          setWfsStatus((prev) => ({ ...prev, loading: false }));
          return;
        }

        const data = await res.json();
        setWfsStatus({
          loading: false,
          hasKey: data.hasApiKey !== false,
          count: data.count || 0,
          message: data.message,
        });

        if (!data.success || !Array.isArray(data.features) || data.features.length === 0) {
          return;
        }

        // 기존 WFS 폴리곤 초기화
        wfsPolygonsRef.current.forEach((p) => p.setMap(null));
        wfsPolygonsRef.current = [];

        data.features.forEach((feature: any) => {
          const geom = feature.geometry;
          if (!geom || !geom.coordinates) return;

          const props = feature.properties || {};
          const zoneName = props.uq_nm || props.UQ_NM || props.zone_nm || props.name || "국토부 정비구역";
          const stageName = props.status || props.step || props.uq_st || "정비사업구역";

          // GeoJSON 좌표를 카카오맵 폴리곤 경로로 변환
          const rings: any[][] = [];
          if (geom.type === "Polygon") {
            const outerRing = geom.coordinates[0];
            if (Array.isArray(outerRing)) {
              rings.push(outerRing.map((c: number[]) => new kakaoMaps.LatLng(c[1], c[0])));
            }
          } else if (geom.type === "MultiPolygon") {
            geom.coordinates.forEach((polygonCoords: any) => {
              const outerRing = polygonCoords[0];
              if (Array.isArray(outerRing)) {
                rings.push(outerRing.map((c: number[]) => new kakaoMaps.LatLng(c[1], c[0])));
              }
            });
          }

          rings.forEach((path) => {
            if (path.length < 3) return;

            const polygon = new kakaoMaps.Polygon({
              path: path,
              strokeWeight: 2.8,
              strokeColor: "#1d4ed8", // 국토부 법적 경계선 진한 블루
              strokeOpacity: 0.95,
              strokeStyle: "solid",
              fillColor: "#3b82f6",
              fillOpacity: 0.24,
              zIndex: 10,
            });

            polygon.setMap(map);

            // 호버 인터랙션
            kakaoMaps.event.addListener(polygon, "mouseover", (mouseEvent: any) => {
              polygon.setOptions({
                strokeWeight: 4,
                strokeColor: "#0f172a",
                fillOpacity: 0.45,
              });

              if (!wfsInfoOverlayRef.current) {
                const infoDiv = document.createElement("div");
                infoDiv.className = "wfs-tooltip";
                infoDiv.style.cssText =
                  "background: rgba(15,23,42,0.92); color: #fff; padding: 5px 9px; border-radius: 8px; font-size: 11px; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.2); pointer-events: none; white-space: nowrap;";
                wfsInfoOverlayRef.current = new kakaoMaps.CustomOverlay({
                  content: infoDiv,
                  yAnchor: 1.3,
                  zIndex: 45,
                });
              }

              const tooltipEl = wfsInfoOverlayRef.current.getContent() as HTMLElement;
              if (tooltipEl) {
                tooltipEl.innerHTML = `🏛️ <span style="color:#60a5fa;">[국토부 공식 고시구역]</span> ${zoneName} (${stageName})`;
              }
              wfsInfoOverlayRef.current.setPosition(mouseEvent.latLng);
              wfsInfoOverlayRef.current.setMap(map);
            });

            kakaoMaps.event.addListener(polygon, "mouseout", () => {
              polygon.setOptions({
                strokeWeight: 2.8,
                strokeColor: "#1d4ed8",
                fillOpacity: 0.24,
              });
              if (wfsInfoOverlayRef.current) {
                wfsInfoOverlayRef.current.setMap(null);
              }
            });

            // 클릭 시 해당 구역과 이름이 매칭되는 존 선택
            kakaoMaps.event.addListener(polygon, "click", () => {
              const matchedZone = zones.find(
                (z) =>
                  z.name.replace(/\s+/g, "").includes(zoneName.replace(/\s+/g, "")) ||
                  zoneName.replace(/\s+/g, "").includes(z.name.replace(/\s+/g, ""))
              );
              if (matchedZone) {
                onSelectZone(matchedZone);
              }
            });

            wfsPolygonsRef.current.push(polygon);
          });
        });
      } catch (err) {
        console.error("[WFS Auto Fetch Error]:", err);
      } finally {
        setWfsStatus((prev) => ({ ...prev, loading: false }));
      }
    };

    // 지도가 멈췄을 때(idle) 디바운스로 실시간 공식 지적선 호출
    const handleIdle = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        fetchOfficialWfsPolygons();
      }, 350);
    };

    kakaoMaps.event.addListener(map, "idle", handleIdle);
    // 최초 진입 시 즉시 1회 로드
    fetchOfficialWfsPolygons();

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      kakaoMaps.event.removeListener(map, "idle", handleIdle);
      wfsPolygonsRef.current.forEach((p) => p.setMap(null));
      wfsPolygonsRef.current = [];
      if (wfsInfoOverlayRef.current) {
        wfsInfoOverlayRef.current.setMap(null);
      }
    };
  }, [mapLoaded, useOfficialWfs, zones, onSelectZone]);

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
    
    // 목록에서 선택되어 지도가 방금 활성화된 경우를 위해 relayout 먼저 호출
    map.relayout();
    const moveLatLon = new kakaoMaps.LatLng(selectedZone.lat, selectedZone.lng);
    map.panTo(moveLatLon);
    if (map.getLevel() > 5) {
      map.setLevel(5, { animate: true });
    }
  }, [selectedZone]);

  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden font-sans">
      <div ref={mapContainerRef} className="absolute inset-0" style={{ touchAction: 'none' }} />

      {/* 로딩 표시 (스켈레톤 및 지능형 인디케이터) */}
      {!mapLoaded && !mapError && (
        <div className="absolute inset-0 bg-slate-50/95 backdrop-blur-sm flex flex-col items-center justify-center p-4 z-30">
          <div className="w-full max-w-xs bg-white p-5 rounded-3xl shadow-lg border border-slate-200/80 text-center space-y-3 animate-fadeIn">
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs font-black text-slate-800">재개발 정비구역 지도 연결 중...</span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">전국 정비구역 인허가 위치를 불러옵니다</p>
          </div>
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
      {/* 🔴 [좌측 빨간 상자] 마커 모드 토글 - 모바일에서는 top-auto bottom-32 */}
      {/* ======================================================== */}
      <div className="absolute top-auto bottom-28 md:top-20 md:bottom-auto left-3 md:left-4 z-20 flex flex-col bg-white rounded-xl md:rounded-2xl shadow-xl border border-slate-200/90 p-1 gap-0.5 md:gap-1 select-none backdrop-blur-md h-auto">
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
      <div className="absolute top-3 md:top-4 right-3 md:right-4 z-20 flex flex-col gap-1.5 md:gap-2 select-none">
        {/* 호갱노노 스타일 세련된 플로팅 줌 컨트롤러 */}
        <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl shadow-xl border border-slate-200/90 overflow-hidden">
          <button
            onClick={() => {
              if (!kakaoMapInstanceRef.current) return;
              kakaoMapInstanceRef.current.setLevel(kakaoMapInstanceRef.current.getLevel() - 1, { animate: true });
            }}
            className="w-8 h-8 md:w-10 md:h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-extrabold text-base cursor-pointer border-b border-slate-100 transition-colors"
            title="지도 확대"
          >
            +
          </button>
          <button
            onClick={() => {
              if (!kakaoMapInstanceRef.current) return;
              kakaoMapInstanceRef.current.setLevel(kakaoMapInstanceRef.current.getLevel() + 1, { animate: true });
            }}
            className="w-8 h-8 md:w-10 md:h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-extrabold text-base cursor-pointer transition-colors"
            title="지도 축소"
          >
            −
          </button>
        </div>

        {/* 레이어 컨트롤 - 모바일에서는 숨김 */}
        <div className="hidden md:flex bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200/90 p-1.5 flex-col gap-1 text-[11px] font-bold">
          {/* 🏛️ 국토교통부 공식 법적 지적 경계선 (V-World WFS) */}
          <button
            onClick={() => setUseOfficialWfs((prev) => !prev)}
            className={`px-2.5 py-2 rounded-xl flex flex-col items-center justify-center transition-all ${
              useOfficialWfs
                ? "bg-indigo-600 text-white shadow-md ring-2 ring-indigo-300"
                : "text-slate-600 hover:bg-slate-100"
            }`}
            title="국토교통부 공식 법적 정비구역 지적 경계(WFS GeoJSON) 실시간 렌더링"
          >
            <div className="flex items-center gap-1">
              <span>법적경계</span>
              {wfsStatus.loading && (
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              )}
            </div>
            {useOfficialWfs && wfsStatus.count > 0 && (
              <span className="text-[9px] font-extrabold opacity-90">{wfsStatus.count}개</span>
            )}
          </button>

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

      {/* 상단 좌측 단계 범례 - 모바일에서는 숨김 */}
      <div className="hidden md:flex absolute top-4 left-4 z-10 flex-col gap-2">
        {/* 🏛️ 국토교통부 공식 WFS 지적선 연동 상태 배지 */}
        {useOfficialWfs && (
          <div className="bg-slate-900/90 text-white backdrop-blur-md rounded-2xl shadow-lg border border-slate-700/60 px-3 py-1.5 flex items-center gap-2 text-[11px] font-bold">
            <span className="flex h-2 w-2 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                  wfsStatus.hasKey ? "bg-emerald-400" : "bg-amber-400"
                } opacity-75`}
              ></span>
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  wfsStatus.hasKey ? "bg-emerald-500" : "bg-amber-500"
                }`}
              ></span>
            </span>
            <span>🏛️ 국토교통부 법적 지적 경계(WFS API) 실시간 연동</span>
            {wfsStatus.count > 0 && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                {wfsStatus.count}개 구역 로드
              </span>
            )}
            {!wfsStatus.hasKey && (
              <span className="text-[10px] text-amber-300 font-medium">
                (API 키 연동 준비됨)
              </span>
            )}
          </div>
        )}

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
