"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SubscriptionNotice } from "@/lib/applyhome";
import SubscriptionCalendar from "@/components/SubscriptionCalendar";
import SubscriptionDetailModal from "@/components/SubscriptionDetailModal";

export default function SubscriptionCalendarPage() {
  const [notices, setNotices] = useState<SubscriptionNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<SubscriptionNotice | null>(null);

  const fetchSubscriptions = async (forceRefresh = false) => {
    if (forceRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const url = `/api/subscriptions?refresh=${forceRefresh}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setNotices(data.notices || []);
      }
    } catch (err) {
      console.error("Failed to fetch subscriptions for calendar:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 flex flex-col">
      {/* 1. 상단 글로벌 네비게이션 헤더 */}
      <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
                <span className="text-white text-base sm:text-lg font-bold">F</span>
              </div>
              <span className="text-lg sm:text-xl font-bold gradient-text">찾아줘</span>
            </Link>

            {/* 네비게이션 */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
              <Link
                href="/search"
                className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                🏢 아파트 찾기
              </Link>
              <Link
                href="/redevelopment"
                className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                🔨 재개발·정비사업
              </Link>
              <Link
                href="/subscriptions"
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800"
              >
                🏗️ 분양정보
              </Link>
              <Link
                href="/regional"
                className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                📍 지역정보
              </Link>
              <Link
                href="/community"
                className="px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1 font-bold"
              >
                <span>💬 커뮤니티</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/subscriptions"
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all shadow-2xs"
            >
              📋 목록형으로 보기
            </Link>
            <button
              onClick={() => fetchSubscriptions(true)}
              disabled={refreshing}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
            >
              <span className={refreshing ? "animate-spin" : ""}>🔄</span>
              <span>{refreshing ? "동기화 중..." : "청약홈 실시간 동기화"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. 히어로 배너 */}
      <section className="bg-gradient-to-b from-blue-900 via-indigo-950 to-slate-950 text-white py-10 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>한국부동산원 청약홈 (ApplyHome) 청약캘린더 기준</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                청약캘린더 (청약일정 및 통계)
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
                공급유형(특별공급, 1·2순위, 무순위, 임의공급) 및 지역별 청약 일정과 월간 통계를 달력으로 한눈에 확인하세요.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/subscriptions"
                className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-bold text-white transition-all flex items-center gap-1.5"
              >
                <span>📋 분양 공고 카드 목록 &gt;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 메인 캘린더 영역 */}
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

      {/* 4. 상세 모달 */}
      <SubscriptionDetailModal
        notice={selectedNotice}
        onClose={() => setSelectedNotice(null)}
      />

      {/* 푸터 */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 px-4 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>찾아줘 — 공공데이터포털 및 한국부동산원 청약홈 OpenAPI 기반 분양정보 서비스</div>
          <div>본 정보는 참고용이며, 정확한 청약 조건은 입주자모집공고문을 확인하시기 바랍니다.</div>
        </div>
      </footer>
    </div>
  );
}
