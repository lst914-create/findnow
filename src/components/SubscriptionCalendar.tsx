"use client";

import React, { useState, useMemo } from "react";
import { SubscriptionNotice } from "@/lib/applyhome";
import SubscriptionDetailModal from "@/components/SubscriptionDetailModal";

export type CalendarEventType =
  | "special" // 특별공급
  | "rank1" // 1순위
  | "rank2" // 2순위
  | "remndr" // 무순위 / 임의공급
  | "office" // 오피스텔/민간임대
  | "winner"; // 당첨자발표

export interface CalendarEventItem {
  id: string; // notice.id + type + date
  noticeId: string;
  notice: SubscriptionNotice;
  dateStr: string; // YYYY-MM-DD
  type: CalendarEventType;
  badgeLabel: string;
  badgeColorClass: string;
  badgeBgClass: string;
  name: string;
  region: string;
  totalUnits: number;
}

interface SubscriptionCalendarProps {
  notices: SubscriptionNotice[];
  initialYear?: number;
  initialMonth?: number; // 1 ~ 12
  onSelectNotice?: (notice: SubscriptionNotice) => void;
}

// 이벤트 유형 메타데이터 (청약홈 컬러 매칭)
export const EVENT_TYPE_CONFIG: Record<
  CalendarEventType,
  { label: string; shortLabel: string; color: string; border: string; bg: string; dotColor: string }
> = {
  special: {
    label: "특별공급",
    shortLabel: "특공",
    color: "text-purple-700 dark:text-purple-300",
    border: "border-purple-300 dark:border-purple-800",
    bg: "bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900/60",
    dotColor: "bg-purple-500",
  },
  rank1: {
    label: "1순위 접수",
    shortLabel: "1순위",
    color: "text-blue-700 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-800",
    bg: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60",
    dotColor: "bg-blue-500",
  },
  rank2: {
    label: "2순위 접수",
    shortLabel: "2순위",
    color: "text-sky-700 dark:text-sky-300",
    border: "border-sky-300 dark:border-sky-800",
    bg: "bg-sky-50 hover:bg-sky-100 dark:bg-sky-950/60 dark:hover:bg-sky-900/60",
    dotColor: "bg-sky-400",
  },
  remndr: {
    label: "무순위/임의공급",
    shortLabel: "무순위",
    color: "text-rose-700 dark:text-rose-300",
    border: "border-rose-300 dark:border-rose-800",
    bg: "bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/60 dark:hover:bg-rose-900/60",
    dotColor: "bg-rose-500",
  },
  office: {
    label: "오피스텔/민간임대",
    shortLabel: "오피/임대",
    color: "text-teal-700 dark:text-teal-300",
    border: "border-teal-300 dark:border-teal-800",
    bg: "bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/60 dark:hover:bg-teal-900/60",
    dotColor: "bg-teal-500",
  },
  winner: {
    label: "당첨자 발표",
    shortLabel: "당첨발표",
    color: "text-amber-700 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-800",
    bg: "bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60",
    dotColor: "bg-amber-500",
  },
};

const ALL_REGIONS = [
  "서울", "경기", "인천", "부산", "대구", "대전", "광주",
  "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"
];

// 법정 공휴일 (양력 기준 및 대표 공휴일)
const FIXED_HOLIDAYS: Record<string, string> = {
  "01-01": "신정",
  "03-01": "삼일절",
  "05-05": "어린이날",
  "06-06": "현충일",
  "08-15": "광복절",
  "10-03": "개천절",
  "10-09": "한글날",
  "12-25": "성탄절",
};

export default function SubscriptionCalendar({
  notices,
  initialYear,
  initialMonth,
  onSelectNotice,
}: SubscriptionCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const todayYear = today.getFullYear();
  const todayMonth = today.getMonth() + 1;
  const todayDay = today.getDate();
  const todayStr = `${todayYear}-${String(todayMonth).padStart(2, "0")}-${String(todayDay).padStart(2, "0")}`;

  // 현재 선택된 연도 / 월
  const [currentYear, setCurrentYear] = useState<number>(initialYear || todayYear);
  const [currentMonth, setCurrentMonth] = useState<number>(initialMonth || todayMonth);

  // 뷰 모드: 월~금(5일제, 청약홈 기본) vs 월~일(7일제)
  const [isWeekdayOnly, setIsWeekdayOnly] = useState<boolean>(true);

  // 통계 패널 접기/펼치기
  const [showStatsPanel, setShowStatsPanel] = useState<boolean>(true);

  // 공급유형 필터 (전체 활성화 디폴트)
  const [activeTypes, setActiveTypes] = useState<Record<CalendarEventType, boolean>>({
    special: true,
    rank1: true,
    rank2: true,
    remndr: true,
    office: true,
    winner: true,
  });

  // 지역 필터 (빈 배열이면 전체 선택)
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // 특정 날짜 상세 모달 (총 N건 클릭 시)
  const [selectedDayEvents, setSelectedDayEvents] = useState<{
    dateStr: string;
    events: CalendarEventItem[];
  } | null>(null);

  // 공고 상세 모달 대상
  const [modalNotice, setModalNotice] = useState<SubscriptionNotice | null>(null);

  // 연도 변경
  const handlePrevYear = () => setCurrentYear((prev) => prev - 1);
  const handleNextYear = () => setCurrentYear((prev) => prev + 1);

  // 오늘 날짜로 이동
  const handleGoToday = () => {
    setCurrentYear(todayYear);
    setCurrentMonth(todayMonth);
  };

  // 공급유형 토글
  const toggleType = (type: CalendarEventType) => {
    setActiveTypes((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleAllTypes = (enable: boolean) => {
    setActiveTypes({
      special: enable,
      rank1: enable,
      rank2: enable,
      remndr: enable,
      office: enable,
      winner: enable,
    });
  };

  // 지역 토글
  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const resetRegions = () => setSelectedRegions([]);

  // 1. 전체 공고를 일자별 이벤트로 평탄화 (Flatten)
  const allEventsMap = useMemo(() => {
    const map = new Map<string, CalendarEventItem[]>();

    const pushEvent = (dateStr: string, item: CalendarEventItem) => {
      if (!dateStr || dateStr.length < 10) return;
      const cleanDate = dateStr.slice(0, 10);
      const list = map.get(cleanDate) || [];
      list.push(item);
      map.set(cleanDate, list);
    };

    for (const notice of notices) {
      const isRemndr = notice.type === "무순위";
      const isOffice = notice.type === "오피스텔";

      // 1) 특별공급
      if (notice.specialSupplyStartDate) {
        pushEvent(notice.specialSupplyStartDate, {
          id: `${notice.id}-special-${notice.specialSupplyStartDate}`,
          noticeId: notice.id,
          notice,
          dateStr: notice.specialSupplyStartDate,
          type: "special",
          badgeLabel: "특공",
          badgeColorClass: EVENT_TYPE_CONFIG.special.color,
          badgeBgClass: EVENT_TYPE_CONFIG.special.bg,
          name: notice.name,
          region: notice.region,
          totalUnits: notice.totalUnits,
        });
      }

      // 2) 1순위 접수
      if (notice.rank1Date) {
        pushEvent(notice.rank1Date, {
          id: `${notice.id}-rank1-${notice.rank1Date}`,
          noticeId: notice.id,
          notice,
          dateStr: notice.rank1Date,
          type: "rank1",
          badgeLabel: "1순위",
          badgeColorClass: EVENT_TYPE_CONFIG.rank1.color,
          badgeBgClass: EVENT_TYPE_CONFIG.rank1.bg,
          name: notice.name,
          region: notice.region,
          totalUnits: notice.totalUnits,
        });
      }

      // 3) 2순위 접수
      if (notice.rank2Date) {
        pushEvent(notice.rank2Date, {
          id: `${notice.id}-rank2-${notice.rank2Date}`,
          noticeId: notice.id,
          notice,
          dateStr: notice.rank2Date,
          type: "rank2",
          badgeLabel: "2순위",
          badgeColorClass: EVENT_TYPE_CONFIG.rank2.color,
          badgeBgClass: EVENT_TYPE_CONFIG.rank2.bg,
          name: notice.name,
          region: notice.region,
          totalUnits: notice.totalUnits,
        });
      }

      // 4) 무순위 줍줍 / 임의공급
      if (isRemndr && notice.receptStartDate) {
        pushEvent(notice.receptStartDate, {
          id: `${notice.id}-remndr-${notice.receptStartDate}`,
          noticeId: notice.id,
          notice,
          dateStr: notice.receptStartDate,
          type: "remndr",
          badgeLabel: notice.detailType || "무순위",
          badgeColorClass: EVENT_TYPE_CONFIG.remndr.color,
          badgeBgClass: EVENT_TYPE_CONFIG.remndr.bg,
          name: notice.name,
          region: notice.region,
          totalUnits: notice.totalUnits,
        });
      }

      // 5) 오피스텔/도시형/민간임대 접수
      if (isOffice && notice.receptStartDate) {
        pushEvent(notice.receptStartDate, {
          id: `${notice.id}-office-${notice.receptStartDate}`,
          noticeId: notice.id,
          notice,
          dateStr: notice.receptStartDate,
          type: "office",
          badgeLabel: "접수",
          badgeColorClass: EVENT_TYPE_CONFIG.office.color,
          badgeBgClass: EVENT_TYPE_CONFIG.office.bg,
          name: notice.name,
          region: notice.region,
          totalUnits: notice.totalUnits,
        });
      }

      // 6) 당첨자 발표일
      if (notice.winnerAnnounceDate) {
        pushEvent(notice.winnerAnnounceDate, {
          id: `${notice.id}-winner-${notice.winnerAnnounceDate}`,
          noticeId: notice.id,
          notice,
          dateStr: notice.winnerAnnounceDate,
          type: "winner",
          badgeLabel: "당첨발표",
          badgeColorClass: EVENT_TYPE_CONFIG.winner.color,
          badgeBgClass: EVENT_TYPE_CONFIG.winner.bg,
          name: notice.name,
          region: notice.region,
          totalUnits: notice.totalUnits,
        });
      }
    }

    return map;
  }, [notices]);

  // 필터가 적용된 이벤트 획득 함수
  const getFilteredEventsForDate = (dateStr: string): CalendarEventItem[] => {
    const rawEvents = allEventsMap.get(dateStr) || [];
    return rawEvents.filter((ev) => {
      // 1. 유형 필터
      if (!activeTypes[ev.type]) return false;
      // 2. 지역 필터
      if (selectedRegions.length > 0 && !selectedRegions.some((r) => ev.region.includes(r))) {
        return false;
      }
      return true;
    });
  };

  // 2. 이번 달 달력 날짜 매트릭스 계산
  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth - 1, 1);
    const lastDay = new Date(currentYear, currentMonth, 0);
    const daysInMonth = lastDay.getDate();

    // 0: 일요일, 1: 월요일, ..., 6: 토요일
    const startDayOfWeek = firstDay.getDay();

    interface DayCell {
      dayNumber: number | null;
      dateStr: string;
      isToday: boolean;
      isWeekend: boolean;
      isHoliday: boolean;
      holidayName?: string;
      dayOfWeek: number; // 0=일 ~ 6=토
    }

    const cells: DayCell[] = [];

    if (isWeekdayOnly) {
      // 청약홈 스타일: 월, 화, 수, 목, 금 (5일)
      // 월요일 시작 (월=0, 화=1, 수=2, 목=3, 금=4)
      const mondayOffset = (startDayOfWeek + 6) % 7; // 월=0, 화=1 ... 일=6
      const leadingEmpty = mondayOffset < 5 ? mondayOffset : 0;

      for (let i = 0; i < leadingEmpty; i++) {
        cells.push({
          dayNumber: null,
          dateStr: "",
          isToday: false,
          isWeekend: false,
          isHoliday: false,
          dayOfWeek: i + 1,
        });
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(currentYear, currentMonth - 1, d);
        const dow = dateObj.getDay();
        // 주말(토=6, 일=0) 제외
        if (dow === 0 || dow === 6) continue;

        const dStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const mmdd = `${String(currentMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const holidayName = FIXED_HOLIDAYS[mmdd];

        cells.push({
          dayNumber: d,
          dateStr: dStr,
          isToday: dStr === todayStr,
          isWeekend: false,
          isHoliday: !!holidayName,
          holidayName,
          dayOfWeek: dow,
        });
      }
    } else {
      // 7일제 (일요일 ~ 토요일)
      for (let i = 0; i < startDayOfWeek; i++) {
        cells.push({
          dayNumber: null,
          dateStr: "",
          isToday: false,
          isWeekend: false,
          isHoliday: false,
          dayOfWeek: i,
        });
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(currentYear, currentMonth - 1, d);
        const dow = dateObj.getDay();
        const dStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const mmdd = `${String(currentMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        const holidayName = FIXED_HOLIDAYS[mmdd];

        cells.push({
          dayNumber: d,
          dateStr: dStr,
          isToday: dStr === todayStr,
          isWeekend: dow === 0 || dow === 6,
          isHoliday: !!holidayName || dow === 0,
          holidayName,
          dayOfWeek: dow,
        });
      }
    }

    return cells;
  }, [currentYear, currentMonth, isWeekdayOnly, todayStr]);

  // 3. 선택된 월의 청약 통계 집계
  const monthStats = useMemo(() => {
    const ymPrefix = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;
    let specialCount = 0;
    let rank1Count = 0;
    let rank2Count = 0;
    let remndrCount = 0;
    let officeCount = 0;
    let winnerCount = 0;
    const noticeMap = new Map<string, SubscriptionNotice>();
    let totalUnitsSum = 0;

    const regionDistribution: Record<string, number> = {};

    for (const [dateStr, list] of allEventsMap.entries()) {
      if (!dateStr.startsWith(ymPrefix)) continue;

      for (const ev of list) {
        // 지역 필터 적용
        if (selectedRegions.length > 0 && !selectedRegions.some((r) => ev.region.includes(r))) {
          continue;
        }

        if (ev.type === "special") specialCount++;
        else if (ev.type === "rank1") rank1Count++;
        else if (ev.type === "rank2") rank2Count++;
        else if (ev.type === "remndr") remndrCount++;
        else if (ev.type === "office") officeCount++;
        else if (ev.type === "winner") winnerCount++;

        if (!noticeMap.has(ev.noticeId)) {
          noticeMap.set(ev.noticeId, ev.notice);
          totalUnitsSum += ev.totalUnits || 0;
          const reg = ev.region || "기타";
          regionDistribution[reg] = (regionDistribution[reg] || 0) + 1;
        }
      }
    }

    // 세대수 많은 순 단지 TOP 3
    const topComplexes = Array.from(noticeMap.values())
      .sort((a, b) => (b.totalUnits || 0) - (a.totalUnits || 0))
      .slice(0, 3);

    return {
      totalComplexCount: noticeMap.size,
      totalUnitsSum,
      specialCount,
      rank1Count,
      rank2Count,
      remndrCount,
      officeCount,
      winnerCount,
      regionDistribution,
      topComplexes,
    };
  }, [currentYear, currentMonth, allEventsMap, selectedRegions]);

  const handleOpenNotice = (notice: SubscriptionNotice) => {
    if (onSelectNotice) {
      onSelectNotice(notice);
    } else {
      setModalNotice(notice);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. 상단 연도/월 네비게이터 & 빠른 제어 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* 연도 & 오늘 컨트롤 */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevYear}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors cursor-pointer"
                title="이전 연도"
              >
                ◀
              </button>
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white px-3 tracking-tight">
                {currentYear}년
              </span>
              <button
                type="button"
                onClick={handleNextYear}
                className="px-3 py-1.5 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors cursor-pointer"
                title="다음 연도"
              >
                ▶
              </button>
            </div>

            <button
              type="button"
              onClick={handleGoToday}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                currentYear === todayYear && currentMonth === todayMonth
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-200 dark:shadow-none"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
              }`}
            >
              오늘 ({todayMonth}월 {todayDay}일)
            </button>

            {/* 평일(5일) vs 주말포함(7일) 토글 */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setIsWeekdayOnly(true)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isWeekdayOnly
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                월~금 (5일)
              </button>
              <button
                type="button"
                onClick={() => setIsWeekdayOnly(false)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !isWeekdayOnly
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 font-bold shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                월~일 (7일)
              </button>
            </div>

            {/* 통계 패널 토글 버튼 */}
            <button
              type="button"
              onClick={() => setShowStatsPanel((prev) => !prev)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>📊 청약통계 {showStatsPanel ? "접기" : "보기"}</span>
            </button>
          </div>
        </div>

        {/* 1월 ~ 12월 탭 버튼 바 */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 overflow-x-auto pb-1 scrollbar-thin">
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 min-w-[560px]">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
              const isSelected = m === currentMonth;
              const isCurrentCalendarMonth = m === todayMonth && currentYear === todayYear;

              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => setCurrentMonth(m)}
                  className={`py-2 px-1 text-center rounded-xl font-bold text-sm transition-all relative cursor-pointer ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-300 dark:shadow-none ring-2 ring-indigo-400/40"
                      : "bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/60 dark:border-slate-700/60"
                  }`}
                >
                  {m}월
                  {isCurrentCalendarMonth && (
                    <span
                      className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full ${
                        isSelected ? "bg-amber-300" : "bg-indigo-600 ring-2 ring-white dark:ring-slate-900"
                      }`}
                      title="이번 달"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. 청약홈 스타일 "청약일정 및 통계" 분석 카드 (접기/펼치기 가능) */}
      {showStatsPanel && (
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-indigo-900/40 relative overflow-hidden animate-in fade-in duration-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-bold">
                  {currentYear}년 {currentMonth}월 종합 통계
                </span>
                <span className="text-xs text-slate-400">
                  {selectedRegions.length > 0 ? `선택지역: ${selectedRegions.join(", ")}` : "전국 기준"}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                {currentYear}년 {currentMonth}월 청약 일정 및 공급 통계
              </h3>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">이번 달 총 공급 규모</div>
              <div className="text-xl sm:text-2xl font-black text-amber-300">
                {monthStats.totalComplexCount}개 단지{" "}
                <span className="text-sm font-normal text-slate-300">
                  ({monthStats.totalUnitsSum.toLocaleString()}세대)
                </span>
              </div>
            </div>
          </div>

          {/* 주요 5대 지표 그리드 */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <div className="text-xs font-medium text-purple-300 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                특별공급
              </div>
              <div className="text-xl font-black text-white mt-1">{monthStats.specialCount}건</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <div className="text-xs font-medium text-blue-300 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                1순위 청약
              </div>
              <div className="text-xl font-black text-white mt-1">{monthStats.rank1Count}건</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <div className="text-xs font-medium text-sky-300 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                2순위 청약
              </div>
              <div className="text-xl font-black text-white mt-1">{monthStats.rank2Count}건</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <div className="text-xs font-medium text-rose-300 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                무순위/줍줍
              </div>
              <div className="text-xl font-black text-white mt-1">{monthStats.remndrCount}건</div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-xs font-medium text-amber-300 flex items-center justify-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                당첨자 발표
              </div>
              <div className="text-xl font-black text-white mt-1">{monthStats.winnerCount}건</div>
            </div>
          </div>

          {/* 지역별 공급 비중 바 & 이달의 대단지 TOP 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/10">
            {/* 지역별 공급 분포 */}
            <div>
              <div className="text-xs font-bold text-slate-300 mb-2">🗺️ 지역별 공급 단지 분포</div>
              {Object.keys(monthStats.regionDistribution).length === 0 ? (
                <div className="text-xs text-slate-500 py-2">해당 월에 등록된 공고 일정이 없습니다.</div>
              ) : (
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(monthStats.regionDistribution).map(([reg, cnt]) => (
                    <span
                      key={reg}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 text-xs font-semibold text-slate-200"
                    >
                      <span className="font-bold text-indigo-300">{reg}</span>
                      <span className="text-[11px] text-white font-black">{cnt}개</span>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 이달의 주요 공급 대단지 */}
            <div>
              <div className="text-xs font-bold text-slate-300 mb-2">🏆 이달의 주요 공급 단지 (세대수 기준)</div>
              {monthStats.topComplexes.length === 0 ? (
                <div className="text-xs text-slate-500 py-2">표시할 주요 단지가 없습니다.</div>
              ) : (
                <div className="space-y-1.5">
                  {monthStats.topComplexes.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => handleOpenNotice(c)}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 text-[10px] font-bold shrink-0">
                          {c.region}
                        </span>
                        <span className="font-bold text-white truncate">{c.name}</span>
                      </div>
                      <span className="text-amber-300 font-extrabold shrink-0 ml-2">
                        {c.totalUnits}세대
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. 공급유형 및 지역 필터 바 (청약홈 탭 그대로 구현) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-sm space-y-3.5">
        {/* 공급유형 필터 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="text-xs font-black text-slate-700 dark:text-slate-300 w-20 shrink-0 flex items-center gap-1">
            <span>🏷️ 공급유형:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => toggleAllTypes(true)}
              className="px-2.5 py-1 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
            >
              전체
            </button>
            {(Object.keys(EVENT_TYPE_CONFIG) as CalendarEventType[]).map((typeKey) => {
              const cfg = EVENT_TYPE_CONFIG[typeKey];
              const isActive = activeTypes[typeKey];
              return (
                <button
                  key={typeKey}
                  type="button"
                  onClick={() => toggleType(typeKey)}
                  className={`px-3 py-1 text-xs font-bold rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? `${cfg.bg} ${cfg.color} ${cfg.border} ring-1 ring-current shadow-2xs`
                      : "bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800 line-through opacity-50"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? cfg.dotColor : "bg-slate-300 dark:bg-slate-600"}`} />
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 공급지역 필터 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs font-black text-slate-700 dark:text-slate-300 w-20 shrink-0 flex items-center gap-1">
            <span>📍 공급지역:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={resetRegions}
              className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                selectedRegions.length === 0
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xs"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              전국 전체
            </button>
            {ALL_REGIONS.map((region) => {
              const isSelected = selectedRegions.includes(region);
              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => toggleRegion(region)}
                  className={`px-2.5 py-1 text-xs rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50 dark:bg-indigo-950/70 border-indigo-500 text-indigo-700 dark:text-indigo-300 font-black ring-1 ring-indigo-400/40 shadow-2xs"
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. 청약 달력 (Calendar Table Grid) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        {/* 모바일 가로 스크롤 안내 */}
        <div className="sm:hidden px-4 py-2 bg-indigo-50/80 dark:bg-indigo-950/40 border-b border-indigo-100 dark:border-indigo-900/40 flex items-center justify-between text-[11px] text-indigo-700 dark:text-indigo-300">
          <span className="flex items-center gap-1 font-semibold">
            <span>👉</span> 좌우로 넘겨 전체 요일과 일정을 확인하세요
          </span>
          <span className="text-[10px] bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold shadow-2xs">
            가로 스크롤 가능
          </span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <div className={`${isWeekdayOnly ? "min-w-[620px]" : "min-w-[740px]"} sm:min-w-0`}>
            {/* 요일 헤더 */}
            <div
              className={`grid border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/70 text-center font-extrabold text-xs sm:text-sm py-3 ${
                isWeekdayOnly ? "grid-cols-5" : "grid-cols-7"
              }`}
            >
              {!isWeekdayOnly && <div className="text-rose-600 dark:text-rose-400">일 (Sun)</div>}
              <div className="text-slate-700 dark:text-slate-300">월 (Mon)</div>
              <div className="text-slate-700 dark:text-slate-300">화 (Tue)</div>
              <div className="text-slate-700 dark:text-slate-300">수 (Wed)</div>
              <div className="text-slate-700 dark:text-slate-300">목 (Thu)</div>
              <div className="text-slate-700 dark:text-slate-300">금 (Fri)</div>
              {!isWeekdayOnly && <div className="text-blue-600 dark:text-blue-400">토 (Sat)</div>}
            </div>

            {/* 날짜 셀 그리드 */}
            <div
              className={`grid divide-x divide-y divide-slate-100 dark:divide-slate-800 ${
                isWeekdayOnly ? "grid-cols-5" : "grid-cols-7"
              }`}
            >
          {calendarDays.map((cell, idx) => {
            if (!cell.dayNumber) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="min-h-[110px] sm:min-h-[140px] bg-slate-50/50 dark:bg-slate-900/40"
                />
              );
            }

            const dayEvents = getFilteredEventsForDate(cell.dateStr);
            const displayLimit = 3; // 셀 내 노출 개수
            const visibleEvents = dayEvents.slice(0, displayLimit);
            const remainingCount = dayEvents.length - displayLimit;

            return (
              <div
                key={cell.dateStr}
                className={`min-h-[110px] sm:min-h-[140px] p-1.5 sm:p-2.5 flex flex-col transition-colors relative group ${
                  cell.isToday
                    ? "bg-indigo-50/50 dark:bg-indigo-950/20 ring-1 ring-inset ring-indigo-400/40"
                    : "bg-white dark:bg-slate-900 hover:bg-slate-50/70 dark:hover:bg-slate-850/50"
                }`}
              >
                {/* 날짜 상단 바 */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1">
                    <span
                      className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-black ${
                        cell.isToday
                          ? "bg-indigo-600 text-white shadow-xs"
                          : cell.isHoliday
                          ? "text-rose-600 dark:text-rose-400 font-extrabold"
                          : cell.isWeekend
                          ? cell.dayOfWeek === 6
                            ? "text-blue-600 dark:text-blue-400 font-bold"
                            : "text-rose-600 dark:text-rose-400 font-bold"
                          : "text-slate-800 dark:text-slate-200"
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    {cell.isToday && (
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/60 px-1.5 py-0.2 rounded-md">
                        오늘
                      </span>
                    )}
                    {cell.holidayName && (
                      <span className="text-[10px] text-rose-500 font-bold truncate max-w-[70px]">
                        {cell.holidayName}
                      </span>
                    )}
                  </div>

                  {/* 일정 건수 뱃지 (클릭 시 팝업) */}
                  {dayEvents.length > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDayEvents({ dateStr: cell.dateStr, events: dayEvents })
                      }
                      className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 bg-indigo-50 dark:bg-indigo-950/70 hover:bg-indigo-100 dark:hover:bg-indigo-900 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                      title="해당 일자 전체 일정 보기"
                    >
                      총 {dayEvents.length}건
                    </button>
                  )}
                </div>

                {/* 청약 일정 목록 칩 */}
                <div className="flex-1 space-y-1 overflow-hidden">
                  {visibleEvents.map((ev) => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => handleOpenNotice(ev.notice)}
                      className={`w-full text-left px-1.5 py-1 rounded-lg text-[11px] font-medium border leading-tight transition-all truncate flex items-center gap-1 cursor-pointer hover:shadow-2xs ${ev.badgeBgClass} ${ev.badgeColorClass} ${EVENT_TYPE_CONFIG[ev.type].border}`}
                      title={`${ev.name} (${ev.region}) - ${EVENT_TYPE_CONFIG[ev.type].label}`}
                    >
                      <span className="font-black text-[10px] shrink-0 px-1 py-0.2 rounded bg-white/80 dark:bg-slate-900/80">
                        {ev.badgeLabel}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0 font-semibold">
                        [{ev.region}]
                      </span>
                      <span className="truncate">{ev.name}</span>
                    </button>
                  ))}

                  {/* +N건 더보기 버튼 */}
                  {remainingCount > 0 && (
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDayEvents({ dateStr: cell.dateStr, events: dayEvents })
                      }
                      className="w-full text-center text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 py-1 bg-slate-100/70 dark:bg-slate-800/70 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                    >
                      +{remainingCount}개 더보기
                    </button>
                  )}
                </div>
              </div>
            );
          })}
            </div>
          </div>
        </div>
      </div>

      {/* 5. 특정 일자 일정 목록 팝업 모달 (총 N건 클릭 시) */}
      {selectedDayEvents && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedDayEvents(null)}
        >
          <div
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 팝업 헤더 */}
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/60">
              <div>
                <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                  📅 {selectedDayEvents.dateStr} 청약일정
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  총 {selectedDayEvents.events.length}개의 접수 및 발표 일정이 있습니다.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDayEvents(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 일정 리스트 */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
              {selectedDayEvents.events.map((ev, idx) => (
                <div
                  key={ev.id + idx}
                  className="pt-3 first:pt-0 flex items-center justify-between gap-3 group cursor-pointer"
                  onClick={() => {
                    handleOpenNotice(ev.notice);
                  }}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${ev.badgeBgClass} ${ev.badgeColorClass} ${EVENT_TYPE_CONFIG[ev.type].border}`}
                      >
                        {EVENT_TYPE_CONFIG[ev.type].label}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        [{ev.region}] {ev.notice.detailType}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                      {ev.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      {ev.notice.address} · 총 {ev.totalUnits}세대
                    </p>
                  </div>
                  <button
                    type="button"
                    className="shrink-0 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 dark:text-slate-300 transition-colors"
                  >
                    상세보기 &gt;
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-center">
              <button
                type="button"
                onClick={() => setSelectedDayEvents(null)}
                className="w-full py-2.5 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. 분양 단지 상세 모달 */}
      {modalNotice && (
        <SubscriptionDetailModal
          notice={modalNotice}
          onClose={() => setModalNotice(null)}
        />
      )}
    </div>
  );
}
