"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import type { SupplyVolumeResponse, SupplyUnit } from "@/types/supplyVolume";

interface Props {
  aptId: string;
  aptName: string;
}

export function SupplyVolumeSection({ aptId, aptName }: Props) {
  const [radius, setRadius] = useState<number>(2000);
  const [data, setData] = useState<SupplyVolumeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/supply-volume?aptId=${encodeURIComponent(aptId)}&radius=${radius}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((json: SupplyVolumeResponse) => {
        if (!cancelled) {
          setData(json);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [aptId, radius]);

  // 해당 반경에 속하는 집계 찾기
  const radiusData = data?.byRadius?.find((r) => r.radiusM === radius) ?? data?.byRadius?.[0];
  const periods = radiusData?.byPeriod ?? [];
  const units: SupplyUnit[] = data?.units ?? [];
  const totalUnits = radiusData?.totalUnits ?? units.reduce((acc, u) => acc + u.totalUnits, 0);
  const maxPeriodUnits = Math.max(...periods.map((p) => p.totalUnits), 1);

  // 공급 충격 지수 계산 (반경 km당 세대 수 / 1000 기준)
  const radiusKm = radius / 1000;
  const densityPerKm = totalUnits > 0 ? Math.round(totalUnits / radiusKm) : 0;
  const supplyPressure: { level: string; label: string; color: string; bg: string; desc: string } =
    densityPerKm === 0
      ? { level: "낮음", label: "공급 여유", color: "text-emerald-700", bg: "bg-emerald-50", desc: "인근 공급이 적어 기존 단지 가격 방어에 유리합니다." }
      : densityPerKm < 1000
      ? { level: "낮음", label: "공급 여유", color: "text-emerald-700", bg: "bg-emerald-50", desc: "공급 압박이 낮아 기존 단지의 가격 안정성이 높습니다." }
      : densityPerKm < 3000
      ? { level: "보통", label: "적정 공급", color: "text-amber-700", bg: "bg-amber-50", desc: "일반적인 공급 수준으로 시세에 큰 영향을 미치지 않습니다." }
      : densityPerKm < 6000
      ? { level: "높음", label: "공급 주의", color: "text-orange-700", bg: "bg-orange-50", desc: "입주 집중 시 단기 전세가 하락 가능성에 유의하세요." }
      : { level: "매우 높음", label: "공급 과잉 위험", color: "text-red-700", bg: "bg-red-50", desc: "대규모 입주 물량으로 인해 전세·매매가 동반 하락 위험이 있습니다." };

  return (
    <div id="supply-volume" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-24">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
              <span>📦</span> 연도별 입주 예정 물량 분석
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
              {loading ? "집계중" : `총 ${totalUnits.toLocaleString()}세대`}
            </span>
            {!loading && totalUnits > 0 && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${supplyPressure.bg} ${supplyPressure.color}`}>
                {supplyPressure.label}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {aptName} 주변 아파트 인허가·청약홈 분양 기준 향후 입주 물량과 공급 충격도를 점검합니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* 반경 선택 */}
          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-xs font-medium">
            {[1000, 2000, 3000].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRadius(r)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  radius === r
                    ? "bg-white text-slate-900 font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {`${r / 1000}km`}
              </button>
            ))}
          </div>

          <Link
            href="/subscriptions"
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100/70 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
          >
            <span>분양·청약 캘린더</span>
            <span>↗</span>
          </Link>

          <DataSourceBadge provider="RONE_APPLY" meta={data?.meta} />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            <div className="h-28 bg-slate-50 rounded-2xl animate-pulse" />
            <div className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
          </div>
        ) : periods.length === 0 && units.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-3xl mb-2">📋</div>
            <p className="text-sm font-bold text-slate-700">반경 {(radius / 1000).toFixed(1)}km 내 대규모 입주 예정 물량이 없습니다</p>
            <p className="text-xs text-slate-400 mt-1">
              신규 분양·입주 물량이 적어 인근 기존 단지의 전세가 및 매매가 공급 압박이 비교적 낮습니다.
            </p>
            <Link
              href="/subscriptions"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-colors"
            >
              전체 분양·청약 일정 보기 ↗
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 공급 충격 지수 요약 배너 */}
            <div className={`flex items-start gap-3 p-3.5 rounded-2xl border ${supplyPressure.bg}`}>
              <div className={`text-xl shrink-0 mt-0.5`}>
                {supplyPressure.level === "낮음" ? "✅" : supplyPressure.level === "보통" ? "📊" : supplyPressure.level === "높음" ? "⚠️" : "🚨"}
              </div>
              <div>
                <div className={`text-xs font-extrabold ${supplyPressure.color}`}>
                  공급 충격 지수: {supplyPressure.level} ({densityPerKm.toLocaleString()}세대/km)
                </div>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{supplyPressure.desc}</p>
              </div>
            </div>

            {/* 연도·분기별 공급 막대그래프 */}
            {periods.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-600 mb-3 flex items-center justify-between">
                  <span>연도·시기별 공급 세대수 추이</span>
                  <span className="text-slate-400 font-normal">기준: 청약홈 및 지자체 인허가</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {periods.map((item) => {
                    const pct = Math.round((item.totalUnits / maxPeriodUnits) * 100);
                    return (
                      <div
                        key={item.period}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                      >
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="font-bold text-slate-800">{item.period}</span>
                          <span className="font-extrabold text-blue-600">
                            {item.totalUnits.toLocaleString()}세대
                          </span>
                        </div>
                        <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, 8)}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>분양 {item.saleUnits.toLocaleString()}</span>
                          {item.rentalUnits > 0 && <span>임대 {item.rentalUnits.toLocaleString()}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 주요 입주 예정 단지 목록 */}
            {units.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-slate-600 mb-3 flex items-center justify-between">
                  <span>주요 입주 예정 단지</span>
                  <span className="text-slate-400 font-normal">단지명을 클릭하면 상세 정보를 확인하실 수 있습니다.</span>
                </h4>
                <div className="space-y-2.5">
                  {units.slice(0, 5).map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-all flex items-center justify-between text-xs group"
                    >
                      <div className="flex-1 min-w-0 pr-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Link
                            href={`/search?q=${encodeURIComponent(p.name)}`}
                            className="font-extrabold text-slate-900 text-sm hover:text-blue-600 transition-colors truncate"
                          >
                            {p.name}
                          </Link>
                          <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-semibold text-[10px]">
                            {p.supplyType}
                          </span>
                        </div>
                        <div className="text-slate-400 mt-1 flex items-center gap-2 text-xs">
                          <span>{p.expectedMoveIn} 입주예정</span>
                          <span>·</span>
                          <span>직선 {p.distanceM < 1000 ? `${p.distanceM}m` : `${(p.distanceM / 1000).toFixed(1)}km`}</span>
                          {p.developer && (
                            <>
                              <span>·</span>
                              <span className="truncate max-w-[120px]">{p.developer}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="font-extrabold text-slate-900 text-base">
                            {p.totalUnits.toLocaleString()}
                          </span>
                          <span className="text-slate-500 ml-0.5">세대</span>
                        </div>
                        <Link
                          href="/subscriptions"
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-slate-900 font-bold hover:border-slate-300 transition-all group-hover:translate-x-0.5"
                        >
                          분양정보 ↗
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default SupplyVolumeSection;
