"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { REDEVELOPMENT_DATA, RedevelopmentZone } from "@/lib/redevelopment";
import RedevelopmentDetailView from "@/components/RedevelopmentDetailView";

const RedevelopmentMap = dynamic(() => import("@/components/RedevelopmentMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm">
      🗺️ 재개발 지도를 불러오는 중입니다...
    </div>
  ),
});

const QUICK_MENUS = [
  { label: "전체 구역", icon: "🔥", filter: "all" },
  { label: "사업시행·관처", icon: "🚀", filter: "fast" },
  { label: "신속통합·모아", icon: "⚡", filter: "fasttrack" },
  { label: "대단지 (2천↑)", icon: "🏗️", filter: "mega" },
  { label: "일반분양 30%↑", icon: "💰", filter: "high-profit" },
];

export default function RedevelopmentPage() {
  const [selectedZone, setSelectedZone] = useState<RedevelopmentZone | null>(
    REDEVELOPMENT_DATA[0] // 기본 선택: 장위14구역
  );

  // 검색어 및 필터 상태
  const [searchQuery, setSearchQuery] = useState("");
  const [stageFilter, setStageFilter] = useState("전체");
  const [typeFilter, setTypeFilter] = useState("전체");
  const [regionFilter, setRegionFilter] = useState("전체");
  const [quickMenuFilter, setQuickMenuFilter] = useState("all");

  // 모바일 화면용 뷰 모드 토글 (지도 vs 목록)
  const [mobileViewMode, setMobileViewMode] = useState<"map" | "list">("list");

  // 재개발닷컴 스타일 좌/우 패널 접기/펼치기 상태
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // 지자체 공공데이터 실시간 동기화 상태
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  // 모바일에서 지도 뷰로 전환 시 카카오맵 relayout 강제 트리거
  useEffect(() => {
    if (mobileViewMode === "map") {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [mobileViewMode]);

  // 모바일 바텀시트가 열렸을 때 body 스크롤 잠금
  // → 브라우저 주소창/뒤로가기 버튼이 스크롤로 인해 나타났다 사라지는 현상 방지
  useEffect(() => {
    const isMobile = window.innerWidth < 1024; // lg 미만 = 모바일/태블릿
    if (selectedZone && isMobile) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [selectedZone]);

  const handleSyncPublicData = async () => {
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const res = await fetch("/api/redevelopment/sync", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSyncStatusMsg(
          `✅ 서울시 UPIS 및 지자체 최신 고시(${data.result?.totalScanned || 0}건)와 동기화 완료되었습니다.`
        );
      } else {
        setSyncStatusMsg("⚠️ 공공데이터 동기화 응답을 받지 못했습니다.");
      }
    } catch {
      setSyncStatusMsg("⚠️ 공공데이터 서버와 통신할 수 없습니다.");
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncStatusMsg(null), 6000);
    }
  };

  // 필터링 로직
  const filteredZones = useMemo(() => {
    return REDEVELOPMENT_DATA.filter((zone) => {
      // 1. 검색어 필터 (구역명, 지역, 시공사, 지하철역)
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const match =
          zone.name.toLowerCase().includes(q) ||
          zone.district.toLowerCase().includes(q) ||
          zone.builder.toLowerCase().includes(q) ||
          zone.nearestStation.toLowerCase().includes(q);
        if (!match) return false;
      }

      // 2. 퀵 메뉴 필터
      if (quickMenuFilter === "fast") {
        if (!["사업시행인가", "관리처분인가", "이주철거", "착공"].includes(zone.status)) {
          return false;
        }
      } else if (quickMenuFilter === "fasttrack") {
        if (!["신속통합기획", "모아타운"].includes(zone.type)) {
          return false;
        }
      } else if (quickMenuFilter === "mega") {
        if (zone.totalUnits < 2000) return false;
      } else if (quickMenuFilter === "high-profit") {
        if (zone.generalRatio < 30) return false;
      }

      // 3. 단계 필터
      if (stageFilter !== "전체" && zone.status !== stageFilter) {
        return false;
      }

      // 4. 유형 필터
      if (typeFilter !== "전체" && zone.type !== typeFilter) {
        return false;
      }

      // 5. 지역 필터
      if (regionFilter !== "전체") {
        if (!zone.region.includes(regionFilter) && !zone.district.includes(regionFilter)) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, stageFilter, typeFilter, regionFilter, quickMenuFilter]);

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-50 overflow-hidden font-sans">
      {/* 1. 글로벌 헤더 (GNB) */}
      <header className="h-14 md:h-16 bg-white border-b border-slate-200 px-3 md:px-5 flex items-center justify-between shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🔍</span>
            <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
              찾아줘
            </span>
          </Link>

          {/* GNB 링크들 */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
            <Link
              href="/search"
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              🏢 아파트 찾기
            </Link>
            <Link
              href="/redevelopment"
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200"
            >
              🔨 재개발·정비사업
            </Link>
            <Link
              href="/subscriptions"
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              🏗️ 분양
            </Link>
            <Link
              href="/regional"
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              📍 지역정보
            </Link>
            <Link
              href="/community"
              className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1 font-bold"
            >
              <span>💬 커뮤니티</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            </Link>
          </nav>
        </div>

        {/* 우측 도구모음: 공공데이터 자동 연동 뱃지 & 통합 구역 검색창 */}
        <div className="flex items-center gap-2">
          {/* 지자체 공공데이터 자동 연동 상태 뱃지 (매일 새벽 자동 동기화) */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-xl text-[11px] font-semibold shadow-xs"
            title="서울시 UPIS 및 지자체 정비사업 고시와 매일 새벽 자동 동기화됩니다."
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${isSyncing ? "bg-amber-500 animate-ping" : "bg-emerald-500 animate-pulse"}`} />
            <span className="font-bold hidden sm:inline">지자체 고시 연동</span>
            <span className="text-[10px] text-emerald-600 bg-white/80 px-1.5 py-0.5 rounded-md font-mono border border-emerald-200/60 hidden md:inline">
              새벽 04:00 자동갱신
            </span>
            <button
              onClick={handleSyncPublicData}
              disabled={isSyncing}
              title="지금 즉시 지자체 고시 확인"
              className="ml-0.5 text-emerald-600 hover:text-emerald-900 transition-transform active:rotate-180 disabled:opacity-50"
            >
              {isSyncing ? "..." : "↻"}
            </button>
          </div>

          {/* 통합 구역 검색창 */}
          <div className="relative w-40 sm:w-56 md:w-72">
            <input
              type="text"
              placeholder="구역명, 지역, 시공사, 역세권 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 1114 0z"
              />
            </svg>
          </div>
        </div>
      </header>

      {/* 동기화 완료 알림 배너 */}
      {syncStatusMsg && (
        <div className="bg-emerald-600 text-white text-xs font-semibold px-4 py-2 flex items-center justify-between shadow-md transition-all animate-fadeIn">
          <div className="flex items-center gap-2">
            <span>📡</span>
            <span>{syncStatusMsg}</span>
          </div>
          <button
            onClick={() => setSyncStatusMsg(null)}
            className="text-white/80 hover:text-white text-xs font-bold px-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. 메인 컨텐츠 영역 (2단 or 3단 스플릿) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* 좌측 사이드바: 퀵 메뉴, 다중 필터 & 구역 목록 */}
        <div className="relative shrink-0 z-20 flex">
          {/* 접이식 사이드바 컨텐츠 */}
          <div
            className={`h-full bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-in-out overflow-hidden ${
              isLeftCollapsed ? "w-0 border-r-0" : "w-full md:w-[380px] lg:w-[420px]"
            } ${mobileViewMode === "map" ? "hidden md:flex" : "flex"}`}
          >
            <div className="w-full md:w-[380px] lg:w-[420px] flex-1 flex flex-col h-full overflow-hidden">
              {/* 퀵 카테고리 칩 */}
              <div className="p-3 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-slate-50/50">
                {QUICK_MENUS.map((menu) => (
                  <button
                    key={menu.filter}
                    onClick={() => setQuickMenuFilter(menu.filter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 shrink-0 ${
                      quickMenuFilter === menu.filter
                        ? "bg-slate-900 text-white shadow-sm"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{menu.icon}</span>
                    <span>{menu.label}</span>
                  </button>
                ))}
              </div>

              {/* 3대 필터 셀렉터 (단계, 유형, 지역) */}
              <div className="p-3 border-b border-slate-100 grid grid-cols-3 gap-2 bg-white text-xs">
                {/* 단계 필터 */}
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value)}
                  className="px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="전체">단계: 전체</option>
                  <option value="정비구역지정">정비구역지정</option>
                  <option value="조합설립인가">조합설립인가</option>
                  <option value="건축심의">건축심의</option>
                  <option value="사업시행인가">사업시행인가</option>
                  <option value="관리처분인가">관리처분인가</option>
                  <option value="이주철거">이주·철거</option>
                </select>

                {/* 유형 필터 */}
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="전체">유형: 전체</option>
                  <option value="재개발">재개발</option>
                  <option value="신속통합기획">신속통합기획</option>
                  <option value="모아타운">모아타운</option>
                  <option value="재건축">재건축</option>
                </select>

                {/* 지역 필터 */}
                <select
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="px-2 py-2 border border-slate-200 rounded-xl bg-slate-50 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="전체">지역: 전국</option>
                  <optgroup label="서울특별시">
                    <option value="서울">서울 전체</option>
                    <option value="중랑구">서울 중랑구</option>
                    <option value="동대문구">서울 동대문구</option>
                    <option value="성북구">서울 성북구</option>
                    <option value="용산구">서울 용산구</option>
                    <option value="동작구">서울 동작구</option>
                    <option value="성동구">서울 성동구</option>
                    <option value="서대문구">서울 서대문구</option>
                    <option value="영등포구">서울 영등포구</option>
                    <option value="강남구">서울 강남구</option>
                    <option value="서초구">서울 서초구</option>
                    <option value="송파구">서울 송파구</option>
                  </optgroup>
                  <optgroup label="경기도">
                    <option value="경기">경기 전체</option>
                    <option value="광명시">경기 광명시</option>
                    <option value="성남시">경기 성남시</option>
                    <option value="수원시">경기 수원시</option>
                  </optgroup>
                  <optgroup label="인천광역시">
                    <option value="인천">인천 전체</option>
                    <option value="미추홀구">인천 미추홀구</option>
                  </optgroup>
                  <optgroup label="부산광역시">
                    <option value="부산">부산 전체</option>
                    <option value="남구">부산 남구</option>
                    <option value="해운대구">부산 해운대구</option>
                  </optgroup>
                  <optgroup label="대전광역시">
                    <option value="대전">대전광역시</option>
                  </optgroup>
                </select>
              </div>

              {/* 정비구역 전용 실시간 검색창 */}
              <div className="p-2.5 bg-white border-b border-slate-100">
                <div className="relative flex items-center">
                  <svg
                    className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="구역명, 지역, 시공사, 역세권 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-800 placeholder:text-slate-400 shadow-inner"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-200 text-xs transition-colors"
                      title="검색어 지우기"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* 리스트 헤더 요약 */}
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>
                  정비구역 <strong className="text-blue-600 font-bold">{filteredZones.length}</strong>개
                </span>
                <span className="text-[11px] text-slate-400">대지평당가 순</span>
              </div>

              {/* 구역 리스트 카드 목록 */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {filteredZones.map((zone, idx) => {
                  const isSelected = selectedZone?.id === zone.id;
                  return (
                    <div
                      key={zone.id}
                      onClick={() => {
                        setSelectedZone(zone);
                        setIsRightCollapsed(false); // 구역 선택 시 우측 상세패널이 접혀있었다면 자동으로 펼침
                        if (window.innerWidth < 768) {
                          setMobileViewMode("map");
                        }
                      }}
                      className={`p-4 cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50/70 border-l-4 border-blue-600"
                          : "hover:bg-slate-50/80 bg-white"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-black text-slate-400">
                            #{idx + 1}
                          </span>
                          <h3 className="text-base font-bold text-slate-900 tracking-tight">
                            {zone.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                            {zone.type}
                          </span>
                        </div>
                        {/* 진행 단계 뱃지 */}
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800 shrink-0">
                          {zone.status}
                        </span>
                      </div>

                      {/* 세대수 & 일반분양 비율 & 시공사 */}
                      <div className="text-xs text-slate-600 font-medium flex items-center gap-2 mb-2 whitespace-nowrap overflow-hidden">
                        <span className="shrink-0">{zone.totalUnits.toLocaleString()}세대</span>
                        <span className="text-slate-300 shrink-0">•</span>
                        <span className="text-blue-600 font-semibold shrink-0">
                          일반분양 {zone.generalRatio}%
                        </span>
                        <span className="text-slate-300 shrink-0">•</span>
                        <span className="text-slate-500 truncate">{zone.builder}</span>
                      </div>

                      {/* 핵심 가격 지표 2개 (최근거래 & 대지평당가) */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs gap-2">
                        <div className="shrink-0 whitespace-nowrap">
                          <span className="text-slate-400 block text-[10px]">최근 실거래</span>
                          <strong className="text-slate-900 font-bold text-sm">
                            {zone.recentTradePriceDisplay}
                          </strong>
                        </div>
                        <div className="text-right shrink-0 whitespace-nowrap">
                          <span className="text-slate-400 block text-[10px]">대지지분 평당가</span>
                          <strong className="text-blue-600 font-black text-sm">
                            {zone.avgLandPricePerPyeongManwon.toLocaleString()}
                            <span className="text-[10px] font-normal text-slate-500"> 만/평</span>
                          </strong>
                        </div>
                      </div>

                      {/* 투자 메트릭스 요약 (초투 & 매물) */}
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                        <span className="shrink-0">
                          초기투자: <strong className="text-slate-800 font-bold">{zone.minInvestmentDisplay}~</strong>
                        </span>
                        <span className="shrink-0">
                          매물 <strong className="text-blue-600 font-bold">{zone.askCount}건</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}

                {filteredZones.length === 0 && (
                  <div className="py-16 text-center text-slate-400 text-sm">
                    조건에 맞는 재개발 구역이 없습니다.
                  </div>
                )}
              </div>

              {/* 좌측 리스트 하단: 데이터 출처 및 지자체 연동 표시 */}
              <div className="p-2.5 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between shrink-0">
                <span className="flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <strong>출처:</strong> 국토부 실거래가 · 지자체 · 건축물대장
                </span>
                <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                  전국 공공데이터
                </span>
              </div>
            </div>
          </div>

          {/* 재개발닷컴 스타일 좌측 접기/펼치기 화살표 버튼 */}
          <button
            onClick={() => setIsLeftCollapsed(!isLeftCollapsed)}
            title={isLeftCollapsed ? "구역 목록 펼치기" : "구역 목록 접기"}
            className="hidden md:flex absolute top-1/2 -translate-y-1/2 -right-6 z-30 w-6 h-14 bg-white border border-slate-200 border-l-0 rounded-r-lg shadow-md hover:bg-slate-50 items-center justify-center text-slate-500 hover:text-slate-900 transition-all cursor-pointer group"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-600 group-hover:text-slate-900 ${
                isLeftCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        {/* 중앙: 대형 카카오 지도 영역 */}
        <div
          className={`flex-1 relative h-full overflow-hidden ${
            mobileViewMode === "list" ? "hidden md:block" : "block"
          }`}
        >
          <RedevelopmentMap
            zones={filteredZones}
            selectedZone={selectedZone}
            onSelectZone={(zone) => {
              setSelectedZone(zone);
              setIsRightCollapsed(false); // 지도 마커 클릭 시 우측 상세패널 자동 펼침
            }}
          />
        </div>

        {/* 우측 사이드바: 선택된 구역 상세 뷰어 (Desktop 3단 뷰) */}
        {selectedZone && (
          <div className="hidden lg:flex relative shrink-0 z-20">
            {/* 재개발닷컴 스타일 우측 접기/펼치기 화살표 버튼 */}
            <button
              onClick={() => {
                setIsRightCollapsed((prev) => !prev);
                setTimeout(() => {
                  window.dispatchEvent(new Event("resize"));
                }, 320);
              }}
              title={isRightCollapsed ? "상세 정보 펼치기" : "상세 정보 접기"}
              className="absolute top-1/2 -translate-y-1/2 -left-6 z-30 w-6 h-14 bg-white border border-slate-200 border-r-0 rounded-l-lg shadow-md hover:bg-slate-50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-all cursor-pointer group"
            >
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-600 group-hover:text-slate-900 ${
                  isRightCollapsed ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* 접이식 우측 상세 컨텐츠 */}
            <div
              className={`h-full bg-white border-l border-slate-200 transition-all duration-300 ease-in-out overflow-hidden ${
                isRightCollapsed ? "w-0 border-l-0" : "w-[480px] xl:w-[520px]"
              }`}
            >
              <div className="w-[480px] xl:w-[520px] h-full overflow-hidden">
                <RedevelopmentDetailView
                  zone={selectedZone}
                  onClose={() => setSelectedZone(null)}
                />
              </div>
            </div>
          </div>
        )}

        {/* 모바일/태블릿 화면용 하단 팝업 상세 모달 - 전체 화면(96dvh) 크기로 시원하게 노출 */}
        {selectedZone && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/60 flex flex-col justify-end">
            <div className="bg-white rounded-t-3xl max-h-[96dvh] h-[96dvh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
              <RedevelopmentDetailView
                zone={selectedZone}
                onClose={() => setSelectedZone(null)}
              />
            </div>
          </div>
        )}
      </div>

      {/* 모바일 화면 하단 [목록 / 지도] 플로팅 토글 바 - 바텀 네비 위에 위치 */}
      <div className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-full shadow-2xl px-5 py-2.5 flex items-center gap-4 text-xs font-bold border border-slate-700/60 whitespace-nowrap shrink-0">
        <button
          onClick={() => setMobileViewMode("list")}
          className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            mobileViewMode === "list" ? "text-blue-400 font-extrabold" : "text-slate-400"
          }`}
        >
          <span className="shrink-0">📋</span>
          <span className="whitespace-nowrap">목록 보기</span>
        </button>
        <span className="text-slate-600 shrink-0">|</span>
        <button
          onClick={() => setMobileViewMode("map")}
          className={`flex items-center gap-1.5 whitespace-nowrap shrink-0 transition-colors ${
            mobileViewMode === "map" ? "text-blue-400 font-extrabold" : "text-slate-400"
          }`}
        >
          <span className="shrink-0">🗺️</span>
          <span className="whitespace-nowrap">지도 보기</span>
        </button>
      </div>
    </div>
  );
}
