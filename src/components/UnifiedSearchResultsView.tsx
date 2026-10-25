"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UnifiedSearchOutput, SearchDomain } from "@/lib/unifiedSearch";
import { Apartment } from "@/lib/apartments";
import { RedevelopmentZone } from "@/lib/redevelopment";
import { SubscriptionNotice } from "@/lib/applyhome";
import { RegionalPlace } from "@/lib/regionalApi";

interface UnifiedSearchResultsViewProps {
  results: UnifiedSearchOutput;
  onSelectApartment?: (apt: Apartment) => void;
  onResetSearch?: () => void;
}

export default function UnifiedSearchResultsView({
  results,
  onResetSearch,
}: UnifiedSearchResultsViewProps) {
  const { intent, summaryTitle, summaryBadge, apartments, redevZones, subscriptions, regionalPlaces, counts } = results;

  // 의도(primaryDomain)에 따라 초기 활성 탭 설정
  const [activeTab, setActiveTab] = useState<SearchDomain>("all");

  useEffect(() => {
    // 특정 의도가 명확하면 해당 탭을 기본 선택, 아니면 'all'
    if (intent.primaryDomain !== "all" && counts[intent.primaryDomain] > 0) {
      setActiveTab(intent.primaryDomain);
    } else {
      setActiveTab("all");
    }
  }, [results, intent.primaryDomain, counts]);

  const formatPrice = (price: number) => {
    const uk = Math.floor(price / 10000);
    const cheon = price % 10000;
    if (uk > 0 && cheon > 0) return `${uk}억 ${cheon.toLocaleString()}만`;
    if (uk > 0) return `${uk}억원`;
    return `${price.toLocaleString()}만원`;
  };

  const formatPriceRange = (min: number, max: number) => {
    if (!min && !max) return "시세 확인중";
    const minVal = min || max;
    const maxVal = max || min;

    const formatSingle = (val: number) => {
      const uk = val / 10000;
      if (uk >= 1) {
        return uk % 1 === 0 ? `${Math.floor(uk)}억` : `${uk.toFixed(1)}억`;
      }
      return `${Math.round(val).toLocaleString()}만`;
    };

    if (minVal === maxVal) {
      return formatSingle(minVal);
    }

    const minUk = minVal / 10000;
    const maxUk = maxVal / 10000;

    if (minUk >= 1) {
      const minStr = minUk % 1 === 0 ? `${Math.floor(minUk)}억` : `${minUk.toFixed(1)}억`;
      const maxStr = maxUk % 1 === 0 ? `${Math.floor(maxUk)}억` : `${maxUk.toFixed(1)}억`;
      return `${minStr} ~ ${maxStr}`;
    }

    return `${Math.round(minVal).toLocaleString()}만 ~ ${Math.round(maxVal).toLocaleString()}만`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. 상단 종합 검색 결과 헤더 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/40 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 text-xs font-bold">
                {summaryBadge}
              </span>
              <span className="text-xs text-slate-400">
                질의: &quot;{intent.rawQuery}&quot;
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {summaryTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              아파트 실거래, 재개발 정비사업 구역, 청약홈 분양 공고, 지역 명소 데이터를 모두 통합 분석하여 제시합니다.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onResetSearch && (
              <button
                type="button"
                onClick={onResetSearch}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer"
              >
                🔄 검색 초기화
              </button>
            )}
            <div className="text-right bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl backdrop-blur-md">
              <div className="text-[11px] text-slate-400 font-medium">통합 검색 일치</div>
              <div className="text-xl font-black text-amber-300">
                총 {counts.total.toLocaleString()}건
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex items-center gap-2 mt-6 pt-5 border-t border-white/10 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-indigo-950 shadow-md scale-[1.02]"
                : "bg-white/10 text-slate-300 hover:text-white hover:bg-white/15"
            }`}
          >
            <span>🌟 전체 종합</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-800">
              {counts.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("apt")}
            className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === "apt"
                ? "bg-white text-indigo-950 shadow-md scale-[1.02]"
                : "bg-white/10 text-slate-300 hover:text-white hover:bg-white/15"
            }`}
          >
            <span>🏢 아파트</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-100 text-indigo-800 font-extrabold">
              {counts.apt}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("redev")}
            className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === "redev"
                ? "bg-white text-indigo-950 shadow-md scale-[1.02]"
                : "bg-white/10 text-slate-300 hover:text-white hover:bg-white/15"
            }`}
          >
            <span>🔨 재개발·정비사업</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-extrabold">
              {counts.redev}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("subscription")}
            className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === "subscription"
                ? "bg-white text-indigo-950 shadow-md scale-[1.02]"
                : "bg-white/10 text-slate-300 hover:text-white hover:bg-white/15"
            }`}
          >
            <span>🏗️ 분양·청약</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-extrabold">
              {counts.subscription}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("regional")}
            className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === "regional"
                ? "bg-white text-indigo-950 shadow-md scale-[1.02]"
                : "bg-white/10 text-slate-300 hover:text-white hover:bg-white/15"
            }`}
          >
            <span>📍 지역 명소·인프라</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-100 text-sky-800 font-extrabold">
              {counts.regional}
            </span>
          </button>
        </div>
      </div>

      {/* 2. 재개발·정비사업 섹션 (redev 탭이거나 all 탭에서 결과가 있을 때) */}
      {(activeTab === "all" || activeTab === "redev") && redevZones.length > 0 && (
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔨</span>
              <h3 className="text-lg font-black text-slate-900">
                재개발·정비사업 추천 구역 ({redevZones.length}건)
              </h3>
              {intent.primaryDomain === "redev" && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800">
                  🎯 질문 일치 최우선 추천
                </span>
              )}
            </div>
            <Link
              href="/redevelopment"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>재개발 전문 지도에서 보기</span>
              <span>&gt;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {redevZones.slice(0, activeTab === "all" ? 6 : 18).map((zone) => (
              <Link
                key={zone.id}
                href={`/redevelopment?zone=${zone.id}`}
                className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {zone.status}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold truncate">
                      {zone.region} {zone.district}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {zone.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{zone.address}</p>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200/60 text-xs">
                    <div>
                      <span className="text-slate-400">계획 세대수:</span>
                      <span className="font-bold text-slate-800 ml-1">
                        {zone.totalUnits?.toLocaleString() || "-"}세대
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">시공사:</span>
                      <span className="font-bold text-slate-800 ml-1 truncate">
                        {zone.builder || "미정"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">최저 투자/실거래</span>
                  <span className="font-black text-rose-600 text-sm">
                    {zone.minInvestmentDisplay || zone.recentTradePriceDisplay || "상세확인"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. 분양·청약 공고 섹션 (subscription 탭이거나 all 탭에서 결과가 있을 때) */}
      {(activeTab === "all" || activeTab === "subscription") && subscriptions.length > 0 && (
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏗️</span>
              <h3 className="text-lg font-black text-slate-900">
                분양·청약 추천 공고 ({subscriptions.length}건)
              </h3>
              {intent.primaryDomain === "subscription" && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800">
                  🎯 분양가 맞춤 추천
                </span>
              )}
            </div>
            <Link
              href="/subscriptions"
              className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1"
            >
              <span>청약 캘린더 & 전체 공고 보기</span>
              <span>&gt;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subscriptions.slice(0, activeTab === "all" ? 6 : 18).map((notice) => (
              <div
                key={`${notice.id}_${notice.pblancNo}`}
                className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-amber-400 hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${notice.statusBadgeColor}`}
                    >
                      {notice.status}
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      {notice.dDayText}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 group-hover:text-amber-700 transition-colors">
                    {notice.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{notice.address}</p>

                  <div className="mt-4 p-3 rounded-xl bg-white border border-slate-200/80 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">공급유형:</span>
                      <span className="font-bold text-slate-700">{notice.detailType} ({notice.type})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">총 세대수:</span>
                      <span className="font-bold text-slate-700">{notice.totalUnits}세대</span>
                    </div>
                    {notice.minPriceManwon ? (
                      <div className="flex justify-between pt-1 border-t border-slate-100">
                        <span className="text-slate-500 font-bold">최고/최저 분양가:</span>
                        <span className="font-black text-indigo-700 text-sm">
                          {formatPrice(notice.minPriceManwon)}
                          {notice.maxPriceManwon && notice.maxPriceManwon !== notice.minPriceManwon
                            ? ` ~ ${formatPrice(notice.maxPriceManwon)}`
                            : ""}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">당첨발표 {notice.winnerAnnounceDate || "-"}</span>
                  <Link
                    href={`/subscriptions`}
                    className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-colors"
                  >
                    공고 확인 &gt;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. 지역정보 (명소 / 핫플 / 꼭 가봐야 할 곳) 섹션 */}
      {(activeTab === "all" || activeTab === "regional") && regionalPlaces.length > 0 && (
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">📍</span>
              <h3 className="text-lg font-black text-slate-900">
                지역 꼭 가봐야 할 명소 & 핫플레이스 ({regionalPlaces.length}곳)
              </h3>
              {intent.primaryDomain === "regional" && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-800">
                  🎯 지역 명소 맞춤 추천
                </span>
              )}
            </div>
            <Link
              href={`/regional?region=${encodeURIComponent(intent.regionKeyword || "서울")}`}
              className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
            >
              <span>지역정보 탐색관 더보기</span>
              <span>&gt;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regionalPlaces.slice(0, activeTab === "all" ? 4 : 16).map((place) => (
              <a
                key={place.id}
                href={place.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-sky-400 hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-extrabold bg-sky-50 text-sky-700 border border-sky-200">
                      {place.categoryDetail || place.category}
                    </span>
                    <span className="text-[11px] text-slate-400">카카오맵 ↗</span>
                  </div>

                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-sky-700 transition-colors line-clamp-1">
                    {place.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {place.roadAddress || place.address}
                  </p>
                  {place.description && (
                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 italic">
                      &quot;{place.description}&quot;
                    </p>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-400">
                  <span>{place.tel || "전화번호 미등록"}</span>
                  <span className="font-bold text-sky-600">길찾기 &gt;</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* 5. 아파트 실거래 섹션 (apt 탭이거나 all 탭에서 결과가 있을 때) */}
      {(activeTab === "all" || activeTab === "apt") && apartments.length > 0 && (
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏢</span>
              <h3 className="text-lg font-black text-slate-900">
                아파트 실거래 추천 단지 ({apartments.length}단지)
              </h3>
              {intent.stationName && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-indigo-100 text-indigo-800">
                  🚇 {intent.stationName} 인근 단지
                </span>
              )}
            </div>
            <Link
              href="/search"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>아파트 조건 검색 전체보기</span>
              <span>&gt;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {apartments.slice(0, activeTab === "all" ? 6 : 24).map((apt) => (
              <Link
                key={apt.id}
                href={`/apt/${apt.id}`}
                className="p-5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-500">
                      {apt.region} {apt.district}
                    </span>
                    {apt.station && (
                      <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                        🚇 {apt.station} {apt.walk_minutes ? `도보 ${apt.walk_minutes}분` : ""}
                      </span>
                    )}
                  </div>

                  <h4 className="font-extrabold text-base text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {apt.name}
                  </h4>

                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200/60 text-xs">
                    <div>
                      <span className="text-slate-400">세대수:</span>
                      <span className="font-bold text-slate-800 ml-1">
                        {apt.household_count.toLocaleString()}세대
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400">준공연도:</span>
                      <span className="font-bold text-slate-800 ml-1">{apt.built_year}년</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                    매매 실거래가
                    {apt.tags?.includes("실거래인증") ? (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0 whitespace-nowrap">실거래 인증</span>
                    ) : (
                      <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap">동별 시세</span>
                    )}
                  </span>
                  <span className="text-sm sm:text-base font-black text-indigo-700 text-right ml-auto shrink-0 whitespace-nowrap tracking-tight">
                    {formatPriceRange(apt.price_min, apt.price_max)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 일치하는 항목이 전혀 없을 때 안내 */}
      {counts.total === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-lg mx-auto">
          <span className="text-4xl block mb-3">🔍</span>
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            &quot;{intent.rawQuery}&quot;에 대한 검색 결과를 찾지 못했습니다.
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            지역명(예: 서울, 구리, 양평), 역명(예: 구리역, 잠실역), 또는 금액(예: 10억, 6억 이내)을 포함해 다시 검색해 보세요.
          </p>
        </div>
      )}
    </div>
  );
}
