"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  SubscriptionNotice,
  SubscriptionSummaryStats,
  formatSubscriptionPrice,
} from "@/lib/applyhome";
import SubscriptionDetailModal from "@/components/SubscriptionDetailModal";
import SubscriptionCalendar from "@/components/SubscriptionCalendar";

const REGION_TABS = [
  { label: "전국 전체", value: "전체" },
  { label: "서울", value: "서울" },
  { label: "경기·인천", value: "경기·인천" },
  { label: "부산·울산·경남", value: "부산·울산·경남" },
  { label: "대구·경북", value: "대구·경북" },
  { label: "대전·세종·충청", value: "대전·세종·충청" },
  { label: "광주·전라", value: "광주·전라" },
  { label: "강원·제주", value: "강원·제주" },
];

const DETAILED_CITIES = [
  "전체", "서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
];

const STATUS_FILTERS = [
  { label: "전체 공고 (진행·예정)", value: "active" },
  { label: "청약 접수중 🟢", value: "ongoing" },
  { label: "접수 예정 ⏳", value: "upcoming" },
  { label: "무순위 줍줍 🔥", value: "remndr" },
  { label: "마감/발표대기 📋", value: "waiting" },
  { label: "지난 마감·발표완료 🗄️", value: "closed" },
];

export default function SubscriptionsPage() {
  const [notices, setNotices] = useState<SubscriptionNotice[]>([]);
  const [summary, setSummary] = useState<SubscriptionSummaryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 뷰 모드: "calendar" (청약홈 청약캘린더) vs "list" (카드형 공고 목록)
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  // 필터 상태 (디폴트: 발표완료 단지 자동 숨김, 살아있는 공고 우선 노출)
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("active");
  const [typeFilter, setTypeFilter] = useState("all"); // "all" | "APT" | "무순위"
  const [searchQuery, setSearchQuery] = useState("");

  // 상세 모달 대상
  const [selectedNotice, setSelectedNotice] = useState<SubscriptionNotice | null>(
    null
  );

  // 페이지네이션
  const [visibleCount, setVisibleCount] = useState(18);

  // 데이터 로드
  const fetchSubscriptions = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const url = `/api/subscriptions?refresh=${forceRefresh}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setNotices(data.notices || []);
        setSummary(data.summary || null);
      }
    } catch (err) {
      console.error("Failed to load subscription notices:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // 각 시도별 공고 개수 집계 (발표완료 제외한 살아있는 공고 기준)
  const cityCountMap = useMemo(() => {
    const map: Record<string, number> = {};
    for (const n of notices) {
      if (n.status === "발표완료") continue;
      map[n.region] = (map[n.region] || 0) + 1;
    }
    return map;
  }, [notices]);

  // 대시보드 숫자: 발표완료 제외, 항상 전체 notices 기준으로 실시간 계산
  const liveSummary = useMemo(() => {
    let ongoingCount = 0;
    let upcomingCount = 0;
    let remndrCount = 0;
    let waitingCount = 0;
    let activeTotal = 0;

    for (const n of notices) {
      if (n.status === "발표완료") continue;
      activeTotal++;
      if (n.status === "청약접수중") ongoingCount++;
      if (n.status === "접수예정") upcomingCount++;
      if (n.status === "마감/발표대기") waitingCount++;
      if (n.type === "무순위") remndrCount++;
    }

    return { ongoingCount, upcomingCount, remndrCount, waitingCount, activeTotal };
  }, [notices]);

  // 클라이언트 사이드 즉시 필터링 (반응 속도 극대화)
  const filteredNotices = useMemo(() => {
    return notices.filter((n) => {
      // 1. 지역 필터
      if (selectedRegion !== "전체") {
        if (selectedRegion === "경기·인천") {
          if (!n.region.includes("경기") && !n.region.includes("인천")) return false;
        } else if (selectedRegion === "부산·울산·경남") {
          if (
            !n.region.includes("부산") &&
            !n.region.includes("울산") &&
            !n.region.includes("경남")
          )
            return false;
        } else if (selectedRegion === "대구·경북") {
          if (!n.region.includes("대구") && !n.region.includes("경북")) return false;
        } else if (selectedRegion === "대전·세종·충청") {
          if (
            !n.region.includes("대전") &&
            !n.region.includes("세종") &&
            !n.region.includes("충남") &&
            !n.region.includes("충북")
          )
            return false;
        } else if (selectedRegion === "광주·전라") {
          if (
            !n.region.includes("광주") &&
            !n.region.includes("전남") &&
            !n.region.includes("전북")
          )
            return false;
        } else if (selectedRegion === "강원·제주") {
          if (!n.region.includes("강원") && !n.region.includes("제주")) return false;
        } else {
          if (n.region !== selectedRegion && !n.region.includes(selectedRegion)) return false;
        }
      }

      // 2. 상태 필터
      if (selectedStatus === "active" && n.status === "발표완료") return false;
      if (selectedStatus === "ongoing" && n.status !== "청약접수중") return false;
      if (selectedStatus === "upcoming" && n.status !== "접수예정") return false;
      if (selectedStatus === "remndr") {
        if (n.type !== "무순위") return false;
        if (n.status === "발표완료") return false;
      }
      if (selectedStatus === "waiting" && n.status !== "마감/발표대기") return false;
      if (selectedStatus === "closed" && n.status !== "발표완료") return false;

      // 3. 주택 유형 필터
      if (typeFilter !== "all" && n.type !== typeFilter) return false;

      // 4. 검색어 필터
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const match =
          n.name.toLowerCase().includes(q) ||
          n.address.toLowerCase().includes(q) ||
          n.region.toLowerCase().includes(q) ||
          (n.company && n.company.toLowerCase().includes(q)) ||
          (n.developer && n.developer.toLowerCase().includes(q));
        if (!match) return false;
      }

      return true;
    });
  }, [notices, selectedRegion, selectedStatus, typeFilter, searchQuery]);

  const displayedNotices = useMemo(() => {
    return filteredNotices.slice(0, visibleCount);
  }, [filteredNotices, visibleCount]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* 1. GNB 헤더 */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl group-hover:scale-110 transition-transform">🔍</span>
              <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
                찾아줘
              </span>
            </Link>

            {/* 네비게이션 */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
              <Link
                href="/search"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                🏢 아파트 찾기
              </Link>
              <Link
                href="/redevelopment"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                🔨 재개발·정비사업
              </Link>
              <Link
                href="/subscriptions"
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200"
              >
                🏗️ 분양정보
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
              <Link
                href="/pricing"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-amber-50 transition-colors font-bold text-amber-700"
              >
                💎 요금제
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/community"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition-all shadow-2xs"
            >
              <span>💬 청약톡 토론방</span>
            </Link>
            <button
              onClick={() => fetchSubscriptions(true)}
              disabled={refreshing}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <span className={refreshing ? "animate-spin" : ""}>🔄</span>
              <span>{refreshing ? "동기화 중..." : "청약홈 실시간 동기화"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. 히어로 배너 */}
      <section className="bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white py-10 px-4 sm:px-6 relative overflow-hidden">
        {/* 장식용 배경 글로우 */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>한국부동산원 청약홈 (ApplyHome) 실시간 OpenAPI 연동</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                전국 아파트 분양 & 청약 정보
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
                모집공고일부터 특별공급, 1순위 접수, 당첨자 발표일, 주택형별 최고 분양가 및 무순위(줍줍) 잔여세대까지 가장 빠르게 확인하세요.
              </p>
            </div>

            {/* 실시간 주요 지표 카드 */}
            {notices.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                <div className="px-3 py-2 bg-white/5 rounded-xl text-center">
                  <div className="text-[11px] font-medium text-emerald-400">🟢 접수중</div>
                  <div className="text-xl font-black text-white">{liveSummary.ongoingCount}개</div>
                </div>
                <div className="px-3 py-2 bg-white/5 rounded-xl text-center">
                  <div className="text-[11px] font-medium text-blue-300">⏳ 접수예정</div>
                  <div className="text-xl font-black text-white">{liveSummary.upcomingCount}개</div>
                </div>
                <div className="px-3 py-2 bg-white/5 rounded-xl text-center">
                  <div className="text-[11px] font-medium text-amber-400">🔥 무순위/줍줍</div>
                  <div className="text-xl font-black text-white">{liveSummary.remndrCount}개</div>
                </div>
                <div className="px-3 py-2 bg-white/5 rounded-xl text-center">
                  <div className="text-[11px] font-medium text-slate-400">📋 진행중 공고</div>
                  <div className="text-xl font-black text-white">{liveSummary.activeTotal}개</div>
                </div>
              </div>
            )}
          </div>
          {/* 뷰 모드 전환 대형 탭 바 (청약 캘린더 vs 공고 목록) */}
          <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="inline-flex p-1.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <button
                type="button"
                onClick={() => setViewMode("calendar")}
                className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  viewMode === "calendar"
                    ? "bg-white text-indigo-950 shadow-md scale-[1.02]"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>📅 청약 캘린더 (일정 및 통계)</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-indigo-950 shadow-md scale-[1.02]"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>📋 분양 공고 목록 (카드형)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-extrabold">
                  {filteredNotices.length}개
                </span>
              </button>
            </div>

            <div className="text-xs text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>한국부동산원 청약홈 (ApplyHome) 캘린더와 동일한 일정 분류 적용</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 뷰 모드 분기 */}
      {viewMode === "calendar" ? (
        /* ================= 캘린더 뷰 ================= */
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
          {loading ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm animate-pulse space-y-3">
              <div className="text-3xl">📅</div>
              <div className="text-base font-bold text-slate-700 dark:text-slate-200">
                청약 일정 및 통계 캘린더를 불러오는 중입니다...
              </div>
              <div className="text-xs text-slate-400">한국부동산원 청약홈 공고 데이터를 동기화하고 있습니다.</div>
            </div>
          ) : (
            <SubscriptionCalendar
              notices={notices}
              onSelectNotice={(notice) => setSelectedNotice(notice)}
            />
          )}
        </main>
      ) : (
        /* ================= 공고 목록 뷰 ================= */
        <>
          {/* 컨트롤 및 필터 섹션 */}
          <section className="bg-white border-b border-slate-200/80 sticky top-16 z-20 shadow-2xs">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 space-y-3">
              {/* 1. 권역별 상위 탭 */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs sm:text-sm font-semibold">
                {REGION_TABS.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setSelectedRegion(tab.value)}
                    className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                      selectedRegion === tab.value
                        ? "bg-slate-900 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* 2. 전국 17개 세부 시도 원클릭 선택 칩 */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none text-[11px] font-medium text-slate-500 pt-1 border-t border-slate-100">
                <span className="text-slate-400 shrink-0 font-bold mr-1">시·도별:</span>
                {DETAILED_CITIES.map((city) => {
                  const count = city === "전체" ? notices.length : cityCountMap[city] || 0;
                  const isSelected = selectedRegion === city;
                  return (
                    <button
                      key={city}
                      onClick={() => setSelectedRegion(city)}
                      className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 shrink-0 ${
                        isSelected
                          ? "bg-blue-600 text-white font-bold shadow-2xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60"
                      }`}
                    >
                      <span>{city}</span>
                      {count > 0 && (
                        <span className={`text-[10px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* 상태 필터 칩 + 주택유형 셀렉트 + 검색바 */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
                {/* 상태 필터 */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-bold">
                  {STATUS_FILTERS.map((f) => (
                    <button
                      key={f.value}
                      onClick={() => setSelectedStatus(f.value)}
                      className={`px-3 py-1.5 rounded-xl whitespace-nowrap border transition-all cursor-pointer ${
                        selectedStatus === f.value
                          ? "bg-blue-50 border-blue-300 text-blue-700 shadow-2xs font-extrabold"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* 검색창 */}
                <div className="relative w-full sm:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="단지명, 지역, 건설사 검색..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    🔍
                  </span>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 메인 콘텐츠 그리드 */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
            {/* 결과 수 안내 */}
            <div className="flex items-center justify-between mb-5">
              <div className="text-xs sm:text-sm text-slate-500 font-medium">
                총 <span className="font-extrabold text-slate-900">{filteredNotices.length}</span>개의 분양 공고가 있습니다.
              </div>
              {(selectedRegion !== "전체" || selectedStatus !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedRegion("전체");
                    setSelectedStatus("all");
                    setSearchQuery("");
                  }}
                  className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  필터 초기화 ↺
                </button>
              )}
            </div>

            {/* 로딩 상태 */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs animate-pulse space-y-4"
                  >
                    <div className="flex justify-between items-center">
                      <div className="h-5 w-20 bg-slate-200 rounded-full" />
                      <div className="h-5 w-14 bg-slate-200 rounded-full" />
                    </div>
                    <div className="h-7 w-3/4 bg-slate-200 rounded-lg" />
                    <div className="h-4 w-full bg-slate-100 rounded" />
                    <div className="h-16 bg-slate-50 rounded-2xl" />
                  </div>
                ))}
              </div>
            ) : displayedNotices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedNotices.map((notice) => (
              <div
                key={`${notice.id}_${notice.pblancNo}`}
                className="bg-white rounded-3xl p-5 border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5"
              >
                <div>
                  {/* 상단 뱃지 행 */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${notice.statusBadgeColor}`}
                      >
                        {notice.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        {notice.detailType}
                      </span>
                    </div>

                    <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      {notice.dDayText}
                    </span>
                  </div>

                  {/* 단지명 */}
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-1 mb-1">
                    {notice.name}
                  </h3>

                  {/* 위치 & 세대수 */}
                  <p className="text-xs text-slate-500 line-clamp-1 mb-3 flex items-center gap-1">
                    <span>📍</span>
                    <span className="truncate">{notice.address || notice.region}</span>
                  </p>

                  {/* 공급 세대수 & 시공사 미니 태그 */}
                  <div className="flex items-center gap-2 text-xs text-slate-600 font-semibold mb-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                    <span className="text-indigo-600">
                      총 {notice.totalUnits.toLocaleString()}세대
                    </span>
                    <span className="text-slate-300">|</span>
                    <span className="truncate text-slate-600">
                      {notice.company || notice.developer || "시공사 미정"}
                    </span>
                  </div>

                  {/* 핵심 청약 일정 타임라인 박스 */}
                  <div className="space-y-1.5 text-xs bg-gradient-to-br from-slate-50 to-indigo-50/30 p-3 rounded-2xl border border-slate-200/80 mb-4">
                    <div className="flex justify-between items-center text-slate-600">
                      <span className="text-slate-400">모집공고</span>
                      <span className="font-semibold text-slate-700">{notice.recruitDate || "-"}</span>
                    </div>

                    {notice.type === "무순위" ? (
                      /* 무순위/줍줍 전용 일정 */
                      <div className="flex justify-between items-center text-slate-600">
                        <span className="text-slate-400">청약접수 (무순위)</span>
                        <span className="font-bold text-blue-700">{notice.receptStartDate || "-"}</span>
                      </div>
                    ) : (
                      /* 일반 아파트 분양 일정 */
                      <>
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="text-slate-400">특별공급</span>
                          <span className={`font-semibold ${notice.specialSupplyStartDate ? "text-indigo-700" : "text-slate-400"}`}>
                            {notice.specialSupplyStartDate || "해당없음"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="text-slate-400">1순위 접수</span>
                          <span className="font-bold text-blue-700">{notice.rank1Date || notice.receptStartDate || "-"}</span>
                        </div>
                        <div className="flex justify-between items-center text-slate-600">
                          <span className="text-slate-400">2순위 접수</span>
                          <span className="font-semibold text-indigo-600">
                            {notice.rank2Date || (notice.receptEndDate && notice.receptEndDate !== notice.rank1Date ? notice.receptEndDate : "1순위 마감시 생략")}
                          </span>
                        </div>
                      </>
                    )}

                    <div className="flex justify-between items-center text-slate-600 pt-1 border-t border-slate-200/60">
                      <span className="text-slate-400">당첨자발표</span>
                      <span className="font-bold text-slate-900">{notice.winnerAnnounceDate || "-"}</span>
                    </div>
                  </div>
                </div>

                {/* 하단 버튼 액션 */}
                <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedNotice(notice)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer text-center"
                  >
                    상세 분양가 & 평형 보기
                  </button>
                  <a
                    href={notice.pblancUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center whitespace-nowrap"
                    title="청약홈 원문 공고 바로가기"
                  >
                    청약홈 ↗
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
            <span className="text-4xl block mb-3">🔍</span>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              조건에 맞는 분양 공고가 없습니다.
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              검색어나 지역 필터를 변경하거나 필터를 초기화해 보세요.
            </p>
            <button
              onClick={() => {
                setSelectedRegion("전체");
                setSelectedStatus("all");
                setSearchQuery("");
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              전체 공고 보기
            </button>
          </div>
        )}

        {/* 더보기 버튼 */}
        {!loading && displayedNotices.length < filteredNotices.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 18)}
              className="px-6 py-3 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs sm:text-sm font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
            >
              분양 공고 더보기 ({displayedNotices.length} / {filteredNotices.length}) ↓
            </button>
          </div>
        )}

        {/* 5. 청약 핵심 가이드 안내 박스 */}
        <section className="mt-14 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h2 className="text-lg font-bold">아파트 청약 성공 체크포인트</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="font-bold text-white mb-1.5 flex items-center gap-1">
                <span>1️⃣</span> 1순위 청약 통장 요건
              </div>
              <p className="leading-relaxed">
                수도권은 가입 후 1년(비수도권 6개월) 경과 및 지역·면적별 예치금액(서울 전용 84㎡ 기준 300만원 등)을 충족해야 1순위 신청이 가능합니다.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="font-bold text-white mb-1.5 flex items-center gap-1">
                <span>2️⃣</span> 특별공급 vs 일반공급
              </div>
              <p className="leading-relaxed">
                신혼부부, 생애최초, 다자녀, 신생아 특별공급은 소득·자산 요건이 적용됩니다. 특별공급과 일반공급은 동일 단지 중복 청약이 가능합니다.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="font-bold text-white mb-1.5 flex items-center gap-1">
                <span>3️⃣</span> 무순위 줍줍 자격 조건
              </div>
              <p className="leading-relaxed">
                계약취소주택은 해당 지자체 무주택 세대주만 가능하지만, 사후 무순위 공고는 거주지·주택수 제한 없이 전국 성인이면 누구나 청약할 수 있습니다.
              </p>
            </div>
          </div>
        </section>
      </main>
      </>
      )}

      {/* 6. 상세 모달 */}
      <SubscriptionDetailModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />

      {/* 푸터 */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            찾아줘 — 공공데이터포털 및 한국부동산원 청약홈 OpenAPI 기반 분양정보 서비스
          </div>
          <div>본 정보는 참고용이며, 정확한 청약 조건은 입주자모집공고문을 확인하시기 바랍니다.</div>
        </div>
      </footer>
    </div>
  );
}
