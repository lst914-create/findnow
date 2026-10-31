"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import type { NearbyRedevelopmentZone, NearbyRedevelopmentResponse } from "@/types/redevelopmentNearby";
import { REDEVELOPMENT_STAGE_STYLE } from "@/types/redevelopmentNearby";

interface Props {
  aptId: string;
  aptName: string;
}

// 정비사업 단계 파이프라인 순서 (UI용)
const STAGE_PIPELINE = [
  "구역지정",
  "조합설립",
  "사업시행인가",
  "관리처분인가",
  "착공",
  "준공",
] as const;

export function NearbyRedevelopmentSection({ aptId, aptName }: Props) {
  const [radius, setRadius] = useState<number>(1500);
  const [data, setData] = useState<NearbyRedevelopmentResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"distance" | "stage">("distance");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/redevelopment/nearby?aptId=${encodeURIComponent(aptId)}&radius=${radius}`)
      .then((res) => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then((json: NearbyRedevelopmentResponse) => {
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

  const zones: NearbyRedevelopmentZone[] = data?.zones ?? [];

  // 정렬 처리
  const sortedZones = [...zones].sort((a, b) => {
    if (sortBy === "stage") {
      const aStyle = REDEVELOPMENT_STAGE_STYLE[a.stage] || { order: 0 };
      const bStyle = REDEVELOPMENT_STAGE_STYLE[b.stage] || { order: 0 };
      return bStyle.order - aStyle.order; // 진행 단계 높은 순
    }
    return a.distanceM - b.distanceM; // 거리 가까운 순
  });

  // 단계별 집계
  const stageCount: Partial<Record<string, number>> = {};
  for (const z of zones) {
    stageCount[z.stage] = (stageCount[z.stage] || 0) + 1;
  }

  // 가장 진행된 단계 찾기
  const maxProgressStage = zones.reduce(
    (max, z) => {
      const s = REDEVELOPMENT_STAGE_STYLE[z.stage];
      return s && s.progressPct > max.pct ? { stage: z.stage, pct: s.progressPct } : max;
    },
    { stage: "", pct: 0 }
  );

  return (
    <div id="nearby-redevelopment" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-24">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
              <span>🏗️</span> 주변 정비사업 목록 &amp; 진행 단계
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
              {loading ? "조회중" : `${zones.length}개 구역`}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {aptName} 인근 재개발·재건축 구역의 추진 단계와 공급 예정 정보입니다.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* 반경 선택 탭 */}
          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-xs font-medium">
            {[1000, 1500, 2000, 3000].map((r) => (
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
                {r >= 1000 ? `${r / 1000}km` : `${r}m`}
              </button>
            ))}
          </div>

          {/* 정렬 */}
          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-xs font-medium">
            {(["distance", "stage"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSortBy(s)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  sortBy === s
                    ? "bg-white text-slate-900 font-bold shadow-sm"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {s === "distance" ? "거리순" : "진행순"}
              </button>
            ))}
          </div>

          <Link
            href="/redevelopment"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100/70 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1"
          >
            <span>전체 지도</span>
            <span>↗</span>
          </Link>

          <DataSourceBadge provider="MOLIT_REDNV" meta={data?.meta} />
        </div>
      </div>

      {/* 단계 파이프라인 요약 (로딩 완료 후 데이터 있을 때만) */}
      {!loading && zones.length > 0 && (
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">단계 분포:</span>
            {STAGE_PIPELINE.map((stage, idx) => {
              const style = REDEVELOPMENT_STAGE_STYLE[stage];
              const count = stageCount[stage] || 0;
              const isMax = maxProgressStage.stage === stage && count > 0;
              return (
                <React.Fragment key={stage}>
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                      count > 0
                        ? `${style.bg} ${style.color} ${isMax ? "ring-1 ring-current" : ""}`
                        : "bg-slate-100 text-slate-300"
                    }`}
                  >
                    <span>{style.icon}</span>
                    <span>{stage}</span>
                    {count > 0 && (
                      <span className="ml-0.5 bg-white/70 px-1 py-0.5 rounded text-[10px] font-black">
                        {count}
                      </span>
                    )}
                  </div>
                  {idx < STAGE_PIPELINE.length - 1 && (
                    <span className="text-slate-300 text-xs shrink-0">→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : zones.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-3xl mb-2">🏘️</div>
            <p className="text-sm font-bold text-slate-700">반경 {(radius / 1000).toFixed(1)}km 이내 정비구역이 없습니다</p>
            <p className="text-xs text-slate-400 mt-1">
              국토교통부 도시정비사업 마스터 데이터 기준으로 매칭된 구역이 없거나 추진 전 단계입니다.
            </p>
            <Link
              href="/redevelopment"
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition-colors"
            >
              전국 정비사업 지도에서 주변 지역 확인하기 ↗
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {sortedZones.map((zone) => {
              const distText =
                zone.distanceM < 1000
                  ? `${zone.distanceM}m`
                  : `${(zone.distanceM / 1000).toFixed(1)}km`;
              const stageStyle = REDEVELOPMENT_STAGE_STYLE[zone.stage] || {
                color: "text-slate-700",
                bg: "bg-slate-100",
                barColor: "bg-slate-400",
                icon: "📌",
                progressPct: 0,
                label: "미정",
              };

              return (
                <div
                  key={zone.id}
                  className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 hover:border-slate-200 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            {zone.type}
                          </span>
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${stageStyle.bg} ${stageStyle.color}`}
                          >
                            <span>{stageStyle.icon}</span>
                            <span>{zone.stage}</span>
                          </span>
                          {zone.includesTargetApt && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 flex items-center gap-1">
                              ⚠️ 해당 단지 포함 구역
                            </span>
                          )}
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm mt-1.5 truncate group-hover:text-blue-600 transition-colors">
                          {zone.name}
                        </h4>
                      </div>
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg shrink-0">
                        직선 {distText}
                      </span>
                    </div>

                    {/* 단계 진행률 바 */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span>사업 진행률</span>
                        <span className={`font-bold ${stageStyle.color}`}>
                          {stageStyle.progressPct}% · {stageStyle.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${stageStyle.barColor}`}
                          style={{ width: `${Math.max(stageStyle.progressPct, 4)}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-2.5 text-xs text-slate-500 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">계획 세대수</span>
                        <strong className="text-slate-800">
                          {zone.plannedUnits ? `${zone.plannedUnits.toLocaleString()}세대` : "미정"}
                        </strong>
                      </div>
                      {zone.address && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">위치</span>
                          <span className="text-slate-600 truncate max-w-[160px]">
                            {zone.address}
                          </span>
                        </div>
                      )}
                      {zone.executor && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">시행자</span>
                          <span className="text-slate-600 truncate max-w-[160px]">{zone.executor}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-200/70 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      구역 코드: {zone.id}
                    </span>
                    <Link
                      href={`/redevelopment?zone=${encodeURIComponent(zone.id)}&stage=${encodeURIComponent(zone.stage)}`}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>구역 상세 분석</span>
                      <span>↗</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export default NearbyRedevelopmentSection;
