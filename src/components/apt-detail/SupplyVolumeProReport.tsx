"use client";

import React, { useState, useEffect } from "react";
import type { SupplyVolumeResponse, SupplyUnit } from "@/types/supplyVolume";

interface Props {
  apt: {
    id: string;
    name: string;
    region?: string;
    district?: string;
  };
  onClose?: () => void;
  isInline?: boolean;
}

export function SupplyVolumeProReportModal({
  apt,
  onClose,
  isInline = false,
}: Props) {
  // 선택된 반경 (1km, 3km, 5km)
  const [radius, setRadius] = useState<number>(3000);
  const [data, setData] = useState<SupplyVolumeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/supply-volume?aptId=${encodeURIComponent(apt.id)}&radius=${radius}`)
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
  }, [apt.id, radius]);

  const radiusKm = radius / 1000;
  const radiusData = data?.byRadius?.find((r) => r.radiusM === radius) ?? data?.byRadius?.[0];
  const periods = radiusData?.byPeriod ?? [];
  const units: SupplyUnit[] = data?.units ?? [];
  const totalUnits = radiusData?.totalUnits ?? units.reduce((acc, u) => acc + u.totalUnits, 0);

  // 공급 충격 지수 산출
  const densityPerKm = totalUnits > 0 ? Math.round(totalUnits / radiusKm) : 0;
  const pressure =
    totalUnits === 0
      ? {
          level: "공급 절벽 (희소성 극대화)",
          color: "text-emerald-400",
          border: "border-emerald-500/40",
          bg: "bg-emerald-500/20",
          desc: `향후 3년간 반경 ${radiusKm}km 이내 신규 입주 물량이 거의 없어 기존 단지의 전세가 및 매매가 방어력이 매우 뛰어납니다.`,
        }
      : densityPerKm < 1500
      ? {
          level: "공급 여유 (안정권)",
          color: "text-emerald-400",
          border: "border-emerald-500/40",
          bg: "bg-emerald-500/20",
          desc: `입주 예정 물량이 자연 소화 가능한 범위 내에 있어 시장 충격이 제한적입니다.`,
        }
      : densityPerKm < 3500
      ? {
          level: "적정 공급",
          color: "text-blue-400",
          border: "border-blue-500/40",
          bg: "bg-blue-500/20",
          desc: `일반적인 신규 공급 수준으로 단지별 입지 경쟁력에 따라 시세가 차별화될 것으로 예상됩니다.`,
        }
      : densityPerKm < 6000
      ? {
          level: "공급 주의 (단기 전세 조정 가능)",
          color: "text-amber-400",
          border: "border-amber-500/40",
          bg: "bg-amber-500/20",
          desc: `특정 시점에 입주가 집중될 경우 일시적인 전세 시세 하락 및 역전세 압박이 발생할 수 있습니다.`,
        }
      : {
          level: "공급 과잉 경보 (역전세 방어 대비)",
          color: "text-rose-400",
          border: "border-rose-500/40",
          bg: "bg-rose-500/20",
          desc: `대규모 신규 입주 폭탄으로 인해 해당 권역 전세가와 매매가의 동반 조정 리스크가 매우 큽니다.`,
        };

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-3xl w-full mx-auto relative">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 헤더 섹션 */}
      <div className="p-6 sm:p-8 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm">
              PRO REPORT #03
            </span>
            <span className="text-xs text-slate-400 font-medium">청약홈 & 인허가 기반 입주 물량 집계</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
              반경별 공급 충격도
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {apt.name} 반경 1·3·5km 입주 예정 물량 분석
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            향후 3개년 청약홈·지자체 인허가 기반 신규 입주 단지 및 전세 충격 시뮬레이션
          </p>
        </div>

        {onClose && !isInline && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            ✕
          </button>
        )}
      </div>

      <div className="p-6 sm:p-8 space-y-6 relative z-10">
        {/* 반경 선택 탭 바 (1km, 3km, 5km) */}
        <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold block">🎯 분석 반경 권역 선택</label>
            <div className="flex gap-1.5">
              {[
                { r: 1000, label: "반경 1km (직접 생활권)" },
                { r: 3000, label: "반경 3km (경쟁 생활권)" },
                { r: 5000, label: "반경 5km (광역 영향권)" },
              ].map((item) => (
                <button
                  key={item.r}
                  type="button"
                  onClick={() => setRadius(item.r)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    radius === item.r
                      ? "bg-cyan-600 text-white shadow"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-slate-400">조회 권역 총 공급량</div>
            <div className="text-lg font-black text-cyan-300">
              {loading ? "집계 중..." : `${totalUnits.toLocaleString()} 세대`}
            </div>
          </div>
        </div>

        {/* 1. 종합 공급 충격 진단 배너 */}
        <div className={`p-5 rounded-2xl border ${pressure.border} ${pressure.bg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📦</span>
              <span className="text-lg font-black tracking-tight">
                공급 압박 진단: {pressure.level}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {pressure.desc}
            </p>
          </div>

          <div className="bg-black/40 px-4 py-3 rounded-xl border border-white/5 text-right self-stretch sm:self-auto min-w-[140px]">
            <div className="text-[11px] text-slate-400">반경 km당 공급 밀도</div>
            <div className="text-xl font-black text-white mt-0.5">
              {densityPerKm.toLocaleString()}<span className="text-xs font-normal text-slate-400"> 세대/km</span>
            </div>
          </div>
        </div>

        {/* 2. 연도별 입주 시기 타임라인 카드 */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            향후 3개년 연도별 입주 예정 물량 분포
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {periods.length > 0 ? (
              periods.map((p, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
                >
                  <div>
                    <div className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      {p.period}
                    </div>
                    <div className="text-xl font-black text-white mt-1">
                      {p.totalUnits.toLocaleString()}<span className="text-xs font-normal text-slate-400"> 세대</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                    비중 {totalUnits > 0 ? Math.round((p.totalUnits / totalUnits) * 100) : 0}%
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 bg-slate-900/40 rounded-2xl p-6 text-center text-xs text-slate-400 border border-slate-800">
                해당 반경 내에 등록된 3개년 입주 예정 물량이 없어 공급 충격이 전무합니다.
              </div>
            )}
          </div>
        </div>

        {/* 3. PRO 상세 단지별 목록 & 전세가 방어 브리핑 (블러 / 잠금해제 UX) */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>입주 예정 단지별 실명 리스트 & 전세 충격 분석</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  🔒 PRO 전용
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            {units.slice(0, 4).map((u, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-extrabold text-white mr-2">{u.name}</span>
                  <span className="text-slate-400 text-[11px]">
                    {u.expectedMoveIn || "입주 예정"} (직선거리 {u.distanceM ? `${u.distanceM}m` : "-"})
                  </span>
                </div>
                <span className="font-extrabold text-cyan-300 bg-slate-800/80 px-2.5 py-1 rounded">
                  {u.totalUnits.toLocaleString()} 세대
                </span>
              </div>
            ))}

            <div className="bg-slate-900/80 border border-cyan-500/30 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-extrabold text-cyan-400 flex items-center gap-1.5">
                <span>💡</span>
                <span>AI 공급 충격 진단 코멘트</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                반경 {radiusKm}km 이내 {totalUnits.toLocaleString()}세대의 신규 입주가 예정되어 있으며,
                대단지 입주 시점 전후로 3~6개월간 일시적인 전세 매물 적체가 발생할 수 있으므로 만기 도래 세입자 재계약 시점을 사전에 조율하는 전략이 권장됩니다.
              </p>
            </div>
          </div>

          {/* 잠금 해제 버튼 */}
          {!unlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] rounded-2xl p-4">
              <div className="text-center max-w-sm">
                <div className="text-base font-extrabold text-white mb-1">
                  📦 단지별 상세 공급 명세 무료 확인
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  오픈 베타 기간 동안 반경별 입주 예정 단지 실명 리스트와 시기별 전세 충격 리포트를 무료로 확인하세요.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 font-black text-xs text-white shadow-lg shadow-cyan-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  ⚡ 입주 물량 상세 리포트 무료 열람
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. 고지사항 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 데이터 출처 안내</div>
          <p>
            • 본 입주 예정 물량 데이터는 한국부동산원 청약홈 및 국토교통부 지자체 공동주택 사업승인 고시를 기준으로 집계되었습니다.
          </p>
          <p>
            • 시공사 공기 지연 또는 설계 변경에 따라 실제 입주 월은 1~3개월가량 조정될 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="my-auto w-full max-w-3xl animate-in fade-in zoom-in-95 duration-200">
        {content}
      </div>
    </div>
  );
}
export default SupplyVolumeProReportModal;
