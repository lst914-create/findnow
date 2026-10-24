"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { APT_MARKERS, type AptMarker } from "./AptMap";
import { loadKakaoMap } from "@/lib/kakaoMapLoader";

interface AptDetailMapProps {
  /** 현재 보고 있는 단지 id */
  aptId: string;
  /** 현재 보고 있는 단지 이름 (선택) */
  aptName?: string;
  /** 실거래 매매 평균가 (만원, 없으면 정적 데이터 사용) */
  realAvgPriceNum?: number;
  /** 지도 높이 px */
  height?: number;
}

export default function AptDetailMap({ aptId, aptName, realAvgPriceNum, height = 400 }: AptDetailMapProps) {
  const mapRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlaysRef = useRef<any[]>([]);

  const [isMapReady, setIsMapReady] = useState(false);
  const [mapType, setMapType] = useState<"NORMAL" | "HYBRID">("NORMAL");
  const [tradeType, setTradeType] = useState<"매매" | "전월세">("매매");
  const [selectedApt, setSelectedApt] = useState<AptMarker | null>(null);

  const currentApt =
    APT_MARKERS.find((a) => a.id === aptId) ||
    (aptName ? APT_MARKERS.find((a) => a.name.includes(aptName) || aptName.includes(a.name)) : null) ||
    APT_MARKERS[0];

  /* ── 호갱노노 스타일 마커 HTML 빌더 ───────────────────── */
  const markerHtml = (apt: AptMarker, isHighlight: boolean) => {
    const isMain = isHighlight;
    const bgGradient = isMain
      ? "linear-gradient(135deg, #e11d48 0%, #be123c 100%)"
      : "linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)";
    const borderColor = isMain ? "#fecdd3" : "#c7d2fe";
    const rent = Math.round((apt.priceNum * 0.52) / 10000);

    // 현재 단지: 실거래 평균가 우선, 없으면 정적 시세
    let priceLabel: string;
    if (tradeType === "매매") {
      if (isMain && realAvgPriceNum && realAvgPriceNum > 0) {
        const uk = Math.floor(realAvgPriceNum / 10000);
        const cheon = Math.floor((realAvgPriceNum % 10000) / 1000);
        priceLabel = uk > 0 ? (cheon > 0 ? `${uk}.${cheon}억` : `${uk}억`) : `${realAvgPriceNum.toLocaleString()}만`;
      } else {
        priceLabel = apt.avgPrice;
      }
    } else {
      priceLabel = `${rent}억`;
    }
    const viewers = apt.liveViewers || Math.floor(Math.random() * 80 + 20);

    return `
      <div style="
        position: relative;
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        filter: drop-shadow(0 4px 10px rgba(0,0,0,0.3));
        ${isMain ? "transform: scale(1.15); transform-origin: bottom center; z-index: 999;" : ""}
      ">
        <!-- 실시간 보는 중 뱃지 / 현재 단지 라벨 -->
        <div style="
          background: ${isMain ? "#be123c" : "rgba(30, 41, 59, 0.88)"};
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 12px;
          margin-bottom: 3px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(0,0,0,0.25);
          letter-spacing: -0.3px;
        ">
          ${isMain ? "⭐ 현재 단지" : `🔥 ${viewers}명 보는중`}
        </div>

        <!-- 오각형 집 모양 마커 본체 -->
        <div style="
          background: ${bgGradient};
          color: #ffffff;
          padding: 6px 11px 5px;
          border-radius: 10px;
          border: 2.5px solid ${borderColor};
          white-space: nowrap;
          font-family: 'Pretendard', 'Noto Sans KR', sans-serif;
          line-height: 1.15;
          text-align: center;
          min-width: 60px;
          ${isMain ? "box-shadow: 0 0 0 4px rgba(225, 29, 72, 0.4);" : ""}
        ">
          <div style="font-size: 10px; font-weight: 600; opacity: 0.9; letter-spacing: -0.2px; margin-bottom: 1px;">
            ${apt.pyeong}평
          </div>
          <div style="font-size: ${isMain ? "15px" : "13.5px"}; font-weight: 800; letter-spacing: -0.4px; text-shadow: 0 1px 2px rgba(0,0,0,0.2);">
            ${priceLabel}
          </div>
        </div>

        <!-- 하단 오각형 뾰족 꼬리 -->
        <div style="
          width: 0;
          height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 8px solid ${isMain ? "#be123c" : "#3730a3"};
          margin-top: -1px;
        "></div>
      </div>
    `;
  };

  /* ── 카카오 지도 초기화 ──────────────────────────────────── */
  useEffect(() => {
    let isCancelled = false;

    loadKakaoMap()
      .then((kakaoMaps) => {
        if (isCancelled || !containerRef.current) return;

        const centerPos = new kakaoMaps.LatLng(currentApt.lat, currentApt.lng);
        const options = {
          center: centerPos,
          level: 3, // 상세 단지 줌 레벨
        };

        const map = new kakaoMaps.Map(containerRef.current, options);
        mapRef.current = map;

        // 마커 등록
        renderOverlays(kakaoMaps, map);
        setIsMapReady(true);
      })
      .catch((err) => {
        console.error("카카오 지도 로드 실패:", err);
      });

    return () => {
      isCancelled = true;
      if (overlaysRef.current.length > 0) {
        overlaysRef.current.forEach((o) => o.setMap(null));
        overlaysRef.current = [];
      }
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aptId]);

  /* ── 마커 오버레이 렌더링 ────────────────────────────────── */
  const renderOverlays = (kakaoMaps: any, map: any) => {
    overlaysRef.current.forEach((o) => o.setMap(null));
    overlaysRef.current = [];

    // 현재 단지 주변 단지들 필터링 (반경 3km 이내)
    const nearbyApts = APT_MARKERS.filter((apt) => {
      const dLat = Math.abs(apt.lat - currentApt.lat);
      const dLng = Math.abs(apt.lng - currentApt.lng);
      return dLat < 0.035 && dLng < 0.045;
    });

    nearbyApts.forEach((apt) => {
      const isHL = apt.id === currentApt.id;
      const el = document.createElement("div");
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

  /* ── 거래유형·실거래가 변경 시 마커 재렌더 ──────────────── */
  useEffect(() => {
    if (!isMapReady || !mapRef.current || !window.kakao?.maps) return;
    renderOverlays(window.kakao.maps, mapRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tradeType, isMapReady, realAvgPriceNum]);

  /* ── 줌 컨트롤 ─────────────────────────────────────────── */
  const handleZoomIn = () => {
    if (!mapRef.current) return;
    mapRef.current.setLevel(mapRef.current.getLevel() - 1, { animate: true });
  };

  const handleZoomOut = () => {
    if (!mapRef.current) return;
    mapRef.current.setLevel(mapRef.current.getLevel() + 1, { animate: true });
  };

  /* ── 지도/스카이뷰 토글 ────────────────────────────────── */
  const toggleMapType = () => {
    if (!mapRef.current || !window.kakao?.maps) return;
    if (mapType === "NORMAL") {
      mapRef.current.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
      setMapType("HYBRID");
    } else {
      mapRef.current.setMapTypeId(window.kakao.maps.MapTypeId.ROADMAP);
      setMapType("NORMAL");
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-200 select-none">
      {/* ── 상단 좌측 필터 바 ───────────────────────────────── */}
      <div className="absolute top-4 left-4 z-[20] flex gap-2">
        <div className="flex bg-white/95 backdrop-blur-md rounded-2xl p-1 shadow-lg border border-slate-200/80 text-xs font-bold">
          {(["매매", "전월세"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTradeType(t)}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                tradeType === t
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 스카이뷰 토글 버튼 */}
        <button
          onClick={toggleMapType}
          className={`px-3 py-1.5 rounded-2xl shadow-lg border text-xs font-bold transition-all cursor-pointer ${
            mapType === "HYBRID"
              ? "bg-amber-500 text-white border-amber-600 shadow-amber-200"
              : "bg-white/95 backdrop-blur-md text-slate-700 border-slate-200/80 hover:bg-slate-100"
          }`}
        >
          {mapType === "HYBRID" ? "지도보기" : "스카이뷰"}
        </button>
      </div>

      {/* ── 상단 우측 줌 컨트롤 ─────────────────────────────── */}
      <div className="absolute top-4 right-4 z-[20] flex flex-col bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-200/80 overflow-hidden">
        <button
          onClick={handleZoomIn}
          className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold text-lg cursor-pointer border-b border-slate-100 transition-colors"
          title="확대"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-9 h-9 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold text-lg cursor-pointer transition-colors"
          title="축소"
        >
          −
        </button>
      </div>

      {/* ── 카카오 지도 컨테이너 ────────────────────────────── */}
      <div ref={containerRef} style={{ height }} className="w-full bg-slate-100" />

      {/* ── 선택 아파트 팝업 ────────────────────────────────── */}
      {selectedApt && selectedApt.id !== aptId && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto z-[25] bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-4 sm:w-72 animate-slide-up">
          <button
            onClick={() => setSelectedApt(null)}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-700 text-lg font-bold cursor-pointer"
          >
            ×
          </button>
          <div className="text-xs font-semibold text-indigo-600 mb-0.5">{selectedApt.region}</div>
          <div className="text-base font-extrabold text-slate-900 pr-4 leading-snug mb-2">{selectedApt.name}</div>
          <div className="flex gap-2 items-center mb-3">
            <span className="text-lg font-black text-indigo-700">{selectedApt.avgPrice}</span>
            <span className="text-xs text-slate-400">({selectedApt.pyeong}평)</span>
          </div>
          <Link
            href={`/apt/${selectedApt.id}`}
            className="block w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-center rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            이 단지 보러가기 →
          </Link>
        </div>
      )}

      {/* ── 로딩 인디케이터 ─────────────────────────────────── */}
      {!isMapReady && (
        <div
          className="absolute inset-0 bg-slate-50 flex flex-col items-center justify-center gap-3 z-[10]"
          style={{ height }}
        >
          <div className="w-9 h-9 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-semibold">카카오 지도를 불러오는 중입니다...</p>
        </div>
      )}
    </div>
  );
}
