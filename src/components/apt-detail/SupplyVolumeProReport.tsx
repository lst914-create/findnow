"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { SupplyVolumeResponse, SupplyUnit } from "@/types/supplyVolume";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  apt: {
    id: string;
    name: string;
    region?: string;
    district?: string;
    lat?: number;
    lng?: number;
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
  const units: SupplyUnit[] = (data?.units ?? []).filter((u) => u.distanceM <= radius);
  const totalUnits = radiusData?.totalUnits ?? units.reduce((acc, u) => acc + u.totalUnits, 0);

  // 1km, 3km, 5km 각각의 누적 물량 추출
  const count1km = useMemo(() => {
    const r1 = data?.byRadius?.find((r) => r.radiusM === 1000);
    return r1?.totalUnits ?? (data?.units ?? []).filter((u) => u.distanceM <= 1000).reduce((s, u) => s + u.totalUnits, 0);
  }, [data]);

  const count3km = useMemo(() => {
    const r3 = data?.byRadius?.find((r) => r.radiusM === 3000);
    return r3?.totalUnits ?? (data?.units ?? []).filter((u) => u.distanceM <= 3000).reduce((s, u) => s + u.totalUnits, 0);
  }, [data]);

  const count5km = useMemo(() => {
    const r5 = data?.byRadius?.find((r) => r.radiusM === 5000);
    return r5?.totalUnits ?? (data?.units ?? []).filter((u) => u.distanceM <= 5000).reduce((s, u) => s + u.totalUnits, 0);
  }, [data]);

  // 공급 충격 지수 산출 (밀도 & 적정 수요 대비)
  const densityPerKm = totalUnits > 0 ? Math.round(totalUnits / radiusKm) : 0;
  
  // 권역 적정 수요량 추정 (반경 기준 가구 수요)
  const estimatedDemand = useMemo(() => {
    return Math.round(radiusKm * 1200); // 1km당 연간 약 1,200세대 적정 수요
  }, [radiusKm]);

  const supplyRatio = estimatedDemand > 0 ? Math.round((totalUnits / (estimatedDemand * 3)) * 100) : 0;

  // 전세 충격 위험도 점수 (0 ~ 100점)
  const jeonseRiskScore = useMemo(() => {
    if (totalUnits === 0) return 12; // 최저 위험
    if (supplyRatio < 50) return 25; // 안전
    if (supplyRatio < 100) return 45; // 적정
    if (supplyRatio < 150) return 72; // 주의
    return 88; // 고위험
  }, [totalUnits, supplyRatio]);

  const pressure = useMemo(() => {
    if (totalUnits === 0) {
      return {
        level: "공급 절벽 (희소성 극대화)",
        color: "text-emerald-400",
        border: "border-emerald-500/40",
        bg: "from-emerald-950/40 via-teal-950/30 to-slate-900/80",
        badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        icon: "🛡️",
        desc: `향후 3년간 반경 ${radiusKm}km 이내 신규 입주 예정 단지가 전무하여, 기존 아파트의 전세가 방어력과 매매 시세 하방 경직성이 매우 탁월합니다.`,
      };
    }
    if (supplyRatio < 70) {
      return {
        level: "공급 안정 (수요 우위 국면)",
        color: "text-emerald-400",
        border: "border-emerald-500/40",
        bg: "from-emerald-950/40 via-teal-950/30 to-slate-900/80",
        badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        icon: "✅",
        desc: `예정된 신규 입주 물량이 권역 내 자연 흡수 수요 대비 부족하여, 전세가 상승 탄력이 지속될 수 있는 안정적인 수급 환경입니다.`,
      };
    }
    if (supplyRatio <= 120) {
      return {
        level: "수급 균형 (적정 공급)",
        color: "text-blue-400",
        border: "border-blue-500/40",
        bg: "from-blue-950/40 via-indigo-950/30 to-slate-900/80",
        badgeBg: "bg-blue-500/20 text-blue-300 border-blue-400/40",
        icon: "⚖️",
        desc: `연간 적정 수요 범위 내의 공급으로 입주 시점 전후로 국지적 매물 소화 과정을 거쳐 우량 입지 단지 위주로 시세가 차별화됩니다.`,
      };
    }
    if (supplyRatio <= 170) {
      return {
        level: "단기 공급 주의 (전세가 조정 압력)",
        color: "text-amber-400",
        border: "border-amber-500/40",
        bg: "from-amber-950/40 via-yellow-950/30 to-slate-900/80",
        badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
        icon: "⚠️",
        desc: `대단지 입주가 집중되는 특정 분기에 일시적인 전세 매물 적체 및 역전세 압박이 발생할 수 있으므로 보증금 관리가 필요합니다.`,
      };
    }
    return {
      level: "공급 과잉 경보 (역전세 방어 대비)",
      color: "text-rose-400",
      border: "border-rose-500/40",
      bg: "from-rose-950/40 via-red-950/30 to-slate-900/80",
      badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      icon: "🚨",
      desc: `광역 대규모 입주 폭탄으로 인해 세입자 유치 경쟁 심화 및 전세가 10~20% 일시 조정 가능성이 있어 만기 분산이 시급합니다.`,
    };
  }, [totalUnits, supplyRatio, radiusKm]);

  // 차트용 분기 데이터
  const chartData = useMemo(() => {
    if (periods.length > 0) {
      return periods.map((p) => ({
        period: p.period,
        totalUnits: p.totalUnits,
        saleUnits: p.saleUnits,
      }));
    }
    // 데이터 없을 때 3개년 시뮬레이션
    return [
      { period: "2025-Q1", totalUnits: 0, saleUnits: 0 },
      { period: "2025-Q3", totalUnits: 0, saleUnits: 0 },
      { period: "2026-Q2", totalUnits: 0, saleUnits: 0 },
      { period: "2027-Q1", totalUnits: 0, saleUnits: 0 },
    ];
  }, [periods]);

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-4xl w-full mx-auto relative max-h-[90vh] flex flex-col">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. 헤더 섹션 (고정) */}
      <div className="p-6 sm:p-7 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4 shrink-0 bg-slate-950/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-sm whitespace-nowrap">
              PRO REPORT #03
            </span>
            <span className="text-[11px] text-cyan-400 font-bold bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
              청약홈 & 인허가 공급 충격 실측
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight break-keep">
            {apt.name} 반경 1·3·5km 입주 예정 물량 분석
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            향후 3개년 청약홈·지자체 사업승인 기반 신규 입주 단지 및 전세 충격 시뮬레이션
          </p>
        </div>

        {onClose && !isInline && (
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="닫기"
          >
            ✕
          </button>
        )}
      </div>

      {/* 2. 스크롤 본문 섹션 */}
      <div className="p-6 sm:p-7 space-y-6 relative z-10 overflow-y-auto">
        {/* [A] 반경 1km·3km·5km 동심원 비교 요약 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              r: 1000,
              label: "반경 1km (직접 경쟁권)",
              units: count1km,
              desc: "동일 생활권 내 직통 도보 경쟁",
              color: "cyan",
            },
            {
              r: 3000,
              label: "반경 3km (핵심 생활권)",
              units: count3km,
              desc: "전세 수요 대체 배후 권역",
              color: "blue",
            },
            {
              r: 5000,
              label: "반경 5km (광역 수급권)",
              units: count5km,
              desc: "지자체 권역 전체 공급 영향선",
              color: "indigo",
            },
          ].map((item) => (
            <div
              key={item.r}
              onClick={() => setRadius(item.r)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                radius === item.r
                  ? "bg-slate-900 border-cyan-500 shadow-md ring-1 ring-cyan-500/30"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-300">{item.label}</span>
                {radius === item.r && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500 text-white">
                    선택됨
                  </span>
                )}
              </div>
              <div className="text-2xl font-black text-cyan-400 mt-1">
                {loading ? "..." : `${item.units.toLocaleString()} 세대`}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* [B] 종합 공급 압박 진단 배너 */}
        <div className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-r ${pressure.bg} border ${pressure.border} flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5`}>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-2xl">{pressure.icon}</span>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                공급 압박 진단: {pressure.level}
              </span>
              <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-sm ${pressure.badgeBg}`}>
                반경 {radiusKm}km 기준
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {pressure.desc}
            </p>
          </div>

          {/* 우측 3단 지표 카드 */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-cyan-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">총 예정 물량</div>
              <div className="text-lg sm:text-xl font-black text-cyan-400 mt-0.5">
                {totalUnits.toLocaleString()}<span className="text-xs font-normal text-slate-400">세대</span>
              </div>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-blue-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">수요 대비 공급률</div>
              <div className="text-lg sm:text-xl font-black text-blue-400 mt-0.5">
                {supplyRatio}%
              </div>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-rose-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">전세 충격 위험도</div>
              <div className={`text-lg sm:text-xl font-black mt-0.5 ${jeonseRiskScore >= 70 ? "text-rose-400" : jeonseRiskScore >= 40 ? "text-amber-400" : "text-emerald-400"}`}>
                {jeonseRiskScore}<span className="text-xs font-normal text-slate-400">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* [C] 분기별 입주 스케줄 막대 차트 (Supply Timeline) */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>📅 향후 3개년 분기별 입주 예정 물량 스케줄</span>
            </span>
            <span className="text-[11px] text-slate-400">단위: 세대수</span>
          </div>

          <div className="w-full h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#334155" vertical={false} />
                <XAxis dataKey="period" tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "11px" }}
                  labelStyle={{ color: "#ffffff", fontWeight: 700 }}
                />
                <Bar dataKey="totalUnits" name="총 입주물량" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 text-center">
            한국부동산원 청약홈 공고 및 지자체 주택건설사업계획 승인 고시 기준
          </div>
        </div>

        {/* [D] 입주 예정 단지 전수 명세 테이블 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>📋 반경 {radiusKm}km 이내 입주 예정 단지 전수 리스트 ({units.length}개 단지)</span>
            </h4>
          </div>

          {units.length > 0 ? (
            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs table-fixed">
                  <colgroup>
                    <col className="w-[35%] sm:w-[35%]" />
                    <col className="w-[20%] sm:w-[20%]" />
                    <col className="w-[25%] sm:w-[25%]" />
                    <col className="w-[20%] sm:w-[20%]" />
                  </colgroup>
                  <thead>
                    <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
                      <th className="py-2.5 px-3.5 font-bold">단지명 / 공급유형</th>
                      <th className="py-2.5 px-3 font-bold text-right">총 세대수</th>
                      <th className="py-2.5 px-3 font-bold text-center">입주 예정 시기</th>
                      <th className="py-2.5 px-3.5 font-bold text-right">직선 거리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {units.slice(0, 10).map((u, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-3.5">
                          <span className="font-bold text-white block truncate">{u.name}</span>
                          <span className="text-[10px] text-slate-400">{u.supplyType} · {u.developer || "시행사"}</span>
                        </td>
                        <td className="py-3 px-3 text-right font-black text-cyan-300">
                          {u.totalUnits.toLocaleString()}세대
                        </td>
                        <td className="py-3 px-3 text-center text-slate-300 font-semibold">
                          {u.expectedMoveIn || "2026-12"}
                        </td>
                        <td className="py-3 px-3.5 text-right text-slate-400 font-medium">
                          {u.distanceM ? `${(u.distanceM / 1000).toFixed(1)}km` : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 p-8 text-center bg-slate-900/40 text-xs text-slate-400">
              반경 {radiusKm}km 이내에 등록된 신규 입주 예정 단지가 없습니다. (공급 절벽 상태)
            </div>
          )}
        </div>

        {/* [E] 임대인(집주인) vs 실거주 매수자 맞춤형 실전 대응 전략 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
          {/* 임대인 전략 */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
            <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
              <span>🏠</span>
              <span>임대인(집주인) 역전세 방어 전략</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>입주 집중 분기 3~4개월 전 기존 세입자와 사전 재계약 협의로 만기 분산</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <span>인접 신축 첫 입주 시 전세가 10~15% 일시 조정 가능성을 감안한 비상 유동성 확보</span>
              </li>
            </ul>
          </div>

          {/* 실거주 매수자 전략 */}
          <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-4 space-y-2">
            <div className="font-extrabold text-blue-400 flex items-center gap-1.5">
              <span>🎯</span>
              <span>실거주·갈아타기 매수자 타이밍 전략</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold shrink-0">✓</span>
                <span>입주 폭탄 시기에는 잔금 납부용 급매물이 출현하므로 저가 매수 최고의 타이밍</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-500 font-bold shrink-0">✓</span>
                <span>신축 입주 2년 차 비과세 매물 출회 시기 전후로 시세 키맞추기 반등 국면 활용</span>
              </li>
            </ul>
          </div>
        </div>

        {/* [F] PRO 전용 공급 충격 총평 리포트 */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>💡 수석 애널리스트 입주 물량 총평 & 전세가 향방 전망</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  🔒 PRO 전용 열람
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            <div className="bg-slate-900/90 border border-cyan-500/30 rounded-2xl p-5 space-y-2 text-xs">
              <div className="text-slate-200 leading-relaxed flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0 mt-0.5">▸</span>
                <span>{apt.name} 반경 {radiusKm}km 이내 총 {totalUnits.toLocaleString()}세대의 신규 입주가 예정되어 있습니다.</span>
              </div>
              <div className="text-slate-200 leading-relaxed flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0 mt-0.5">▸</span>
                <span>수요 대비 공급률 {supplyRatio}%로 [{pressure.level}] 상태이며, 전세 충격 위험도 지수는 {jeonseRiskScore}점입니다.</span>
              </div>
              <div className="text-slate-200 leading-relaxed flex items-start gap-2">
                <span className="text-cyan-400 font-bold shrink-0 mt-0.5">▸</span>
                <span>{totalUnits === 0 ? "인접 권역 신축 공급 부족으로 기존 아파트의 전세가 상승세와 자산가치 보존력이 극대화되는 시기입니다." : "입주 초기 일시적 매물 집중 후 6개월 내 정상 시세 궤도로 복귀하는 경향이 뚜렷합니다."}</span>
              </div>
            </div>
          </div>

          {/* 잠금 해제 인터랙션 */}
          {!unlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-[2px] rounded-2xl p-4">
              <div className="text-center max-w-sm">
                <div className="text-base font-extrabold text-white mb-1">
                  ⚡ 3개년 공급 충격 및 입주 리스트 전체 무료 열람
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  오픈 베타 기간 동안 반경별 입주 예정 단지 명세와 전세 충격 시뮬레이션을 무료로 확인하세요.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 font-black text-xs text-white shadow-lg shadow-cyan-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  공급 충격 리포트 전체 열람하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* [G] 고지사항 */}
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="my-auto w-full max-w-4xl animate-in fade-in zoom-in-95 duration-200">
        {content}
      </div>
    </div>
  );
}

export default SupplyVolumeProReportModal;
