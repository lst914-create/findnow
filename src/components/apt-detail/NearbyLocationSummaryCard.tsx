"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

interface Props {
  aptId: string;
  aptName: string;
  lat: number;
  lng: number;
}

interface SummaryData {
  redevCount: number;
  redevTotalUnits: number;
  redevActiveStage: string;
  supplyUnits: number;
  topSupplyProject?: string;
  storeCount: number;
  topCategory: string;
  topCategoryRatio: number;
}

export function NearbyLocationSummaryCard({ aptId, aptName, lat, lng }: Props) {
  const [radiusKm, setRadiusKm] = useState<1 | 3>(1);
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const radiusM = radiusKm * 1000;

    // 캐시된 apartment_nearby_summary 엔드포인트 단일 호출
    fetch(`/api/apartment/nearby-summary?aptId=${encodeURIComponent(aptId)}&radius=${radiusM}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (cancelled) return;
        const summary = json?.data;
        if (summary) {
          const topCat = summary.top_categories?.[0];
          setData({
            redevCount: summary.redev_count,
            redevTotalUnits: summary.redev_planned_units,
            redevActiveStage: summary.redev_count > 0 ? "인가·착공 등" : "-",
            supplyUnits: summary.supply_units,
            topSupplyProject: summary.supply_units > 0 ? "인근 신규 단지" : undefined,
            storeCount: summary.store_count,
            topCategory:
              topCat?.code === "Q"
                ? "음식·카페"
                : topCat?.code === "D"
                ? "소매·쇼핑"
                : topCat?.name || "생활편의",
            topCategoryRatio: topCat?.ratio || 0,
          });
        } else {
          setData(null);
        }
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [aptId, radiusKm]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 rounded-3xl p-6 sm:p-7 text-white shadow-xl border border-slate-750">
      {/* 헤더 & 반경 토글 */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-700/60">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-white">
            {aptName} 반경 {radiusKm}km 핵심 요약
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            정비사업 계획, 향후 입주 물량, 상권 인프라를 종합 진단합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-xl bg-slate-800 p-1 text-xs font-bold border border-slate-700">
            <button
              type="button"
              onClick={() => setRadiusKm(1)}
              className={`px-3 py-1 rounded-lg transition-all ${
                radiusKm === 1
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              1km (도보 생활권)
            </button>
            <button
              type="button"
              onClick={() => setRadiusKm(3)}
              className={`px-3 py-1 rounded-lg transition-all ${
                radiusKm === 3
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              3km (배후 상권·학군)
            </button>
          </div>
        </div>
      </div>

      {/* 3대 핵심 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
        {/* 1. 주변 정비사업 */}
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold flex items-center gap-1.5">
                <span>🏗️</span> 주변 정비사업
              </span>
              <span className="text-blue-400 font-semibold">반경 {radiusKm}km</span>
            </div>
            <div className="text-2xl font-black text-white">
              {loading ? "..." : `${data?.redevCount ?? 0}개 구역`}
            </div>
            <p className="text-xs text-slate-300 mt-1.5">
              {data && data.redevCount > 0
                ? `계획 세대수 합계 약 ${data.redevTotalUnits.toLocaleString()}세대`
                : "인근 추진 중인 정비사업 없음"}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
            <span className="text-slate-400">지자체 고시 기준</span>
            <div className="flex items-center gap-2">
              <a
                href="#nearby-redevelopment"
                className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 group"
              >
                <span>세부 목록</span>
                <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
              </a>
              <span className="text-slate-600">/</span>
              <Link
                href="/redevelopment"
                className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1 group"
              >
                <span>전체 지도</span>
                <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. 입주 예정 물량 */}
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold flex items-center gap-1.5">
                <span>📦</span> 입주 예정 물량
              </span>
              <span className="text-emerald-400 font-semibold">인허가 기준</span>
            </div>
            <div className="text-2xl font-black text-white">
              {loading ? "..." : `${data?.supplyUnits.toLocaleString() ?? 0}세대`}
            </div>
            <p className="text-xs text-slate-300 mt-1.5 truncate">
              {data?.topSupplyProject
                ? `주요 단지: ${data.topSupplyProject}`
                : "공급 과잉 우려 낮음"}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
            <span className="text-slate-400">청약홈 공고 기준</span>
            <div className="flex items-center gap-2">
              <a
                href="#supply-volume"
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 group"
              >
                <span>연도별 물량</span>
                <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
              </a>
              <span className="text-slate-600">/</span>
              <Link
                href="/subscriptions"
                className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 group"
              >
                <span>분양 일정</span>
                <span className="group-hover:translate-x-0.5 transition-transform">↗</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 3. 상권 업종 인프라 */}
        <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/60 hover:border-slate-600 transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold flex items-center gap-1.5">
                <span>☕</span> 상권 인프라
              </span>
              <span className="text-orange-400 font-semibold">소상공인 SDSC</span>
            </div>
            <div className="text-2xl font-black text-white">
              {loading ? "..." : `${data?.storeCount.toLocaleString() ?? 0}개 점포`}
            </div>
            <p className="text-xs text-slate-300 mt-1.5">
              {data && data.storeCount > 0
                ? `최대 비중: ${data.topCategory} (${data.topCategoryRatio}%)`
                : "조회 반경 내 상권 데이터 준비 중"}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-xs">
            <span className="text-slate-400">생활 편의 지수</span>
            <a
              href="#commercial-section"
              className="text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1 group"
            >
              <span>업종 분포 보기</span>
              <span className="group-hover:translate-y-0.5 transition-transform">↓</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NearbyLocationSummaryCard;
