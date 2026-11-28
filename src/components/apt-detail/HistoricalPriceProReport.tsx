"use client";

import React, { useState, useMemo } from "react";
import {
  analyzeHistoricalTransactions,
  HistoricalPriceResult,
} from "@/lib/historicalPriceCalc";
import { fmtWon } from "@/lib/fairValueCalc";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
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
    price_min?: number | null;
    price_max?: number | null;
    region?: string;
    district?: string;
  };
  trades?: any[];
  onClose?: () => void;
  isInline?: boolean;
}

export function HistoricalPriceProReportModal({
  apt,
  trades = [],
  onClose,
  isInline = false,
}: Props) {
  const [unlocked, setUnlocked] = useState(false);

  const fallbackPrice = useMemo(() => {
    const min = apt.price_min || 0;
    const max = apt.price_max || 0;
    if (min > 0 && max > 0) return Math.round((min + max) / 2);
    return min || max || 60000;
  }, [apt]);

  const result: HistoricalPriceResult = useMemo(() => {
    return analyzeHistoricalTransactions(trades, fallbackPrice);
  }, [trades, fallbackPrice]);

  // 트렌드별 뱃지 스타일
  const getTrendStyle = (trend: HistoricalPriceResult["trendVerdict"]) => {
    switch (trend) {
      case "신고가 랠리":
        return {
          bg: "from-rose-950/40 via-red-950/30 to-slate-900/80 border-rose-500/40 text-rose-300",
          badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          icon: "🔥",
          desc: "역대 최고가를 넘어서거나 95% 이상 회복하여 시세 분출 랠리 국면에 진입했습니다.",
        };
      case "전고점 회복세":
        return {
          bg: "from-emerald-950/40 via-teal-950/30 to-slate-900/80 border-emerald-500/40 text-emerald-300",
          badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          icon: "📈",
          desc: "전고점 대비 88~95% 수준까지 순조롭게 회복하며 우상향 추세를 견인하고 있습니다.",
        };
      case "박스권 횡보":
        return {
          bg: "from-blue-950/40 via-indigo-950/30 to-slate-900/80 border-blue-500/40 text-blue-300",
          badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          icon: "⚖️",
          desc: "전고점 대비 78~88% 구간에서 손바뀜이 활발히 일어나며 단단한 지지선을 구축 중입니다.",
        };
      default:
        return {
          bg: "from-amber-950/40 via-yellow-950/30 to-slate-900/80 border-amber-500/40 text-amber-300",
          badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          icon: "📉",
          desc: "전고점 대비 충분한 가격 조정을 거쳐 매수 안전마진이 확보된 저평가 구간입니다.",
        };
    }
  };

  const trendStyle = getTrendStyle(result.trendVerdict);

  // 연도별 차트 데이터 가공
  const chartData = useMemo(() => {
    return result.yearlyStats.map((s) => ({
      year: `${s.year}년`,
      avgPrice억: Math.round((s.avgPrice / 10000) * 10) / 10,
      dealCount: s.dealCount,
    }));
  }, [result]);

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-4xl w-full mx-auto relative max-h-[90vh] flex flex-col break-keep">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. 헤더 섹션 (고정) */}
      <div className="p-6 sm:p-7 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4 shrink-0 bg-slate-950/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-sm whitespace-nowrap">
              PRO REPORT #02
            </span>
            <span className="text-[11px] text-rose-400 font-bold bg-rose-950/60 border border-rose-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
              국토교통부 20개년 전수 분석
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight break-keep">
            {apt.name} 20년 실거래 전고점 및 가격 사이클 분석
          </h2>
          <p className="text-xs text-slate-400 mt-1 break-keep">
            2006년 실거래가 의무화 이후 역대 최고가(ATH) ↔ 2022 바닥점 ↔ 현재 회복률 정밀 진단
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
      <div className="p-6 sm:p-7 space-y-6 relative z-10 overflow-y-auto break-keep">
        {/* [A] 종합 시세 국면 및 투자 타이밍 액션 배너 */}
        <div className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-r ${trendStyle.bg} border flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5`}>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-2xl">{trendStyle.icon}</span>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                시세 국면: {result.trendVerdict}
              </span>
              <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-sm ${trendStyle.badgeBg}`}>
                전고점의 {result.recoveryRateFromPeak}% 회복
              </span>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-blue-600/30 text-blue-300 border border-blue-400/40 whitespace-nowrap">
                {result.timingAction}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl break-keep">
              {trendStyle.desc} 국토교통부 {result.totalTransactionsCount > 0 ? `${result.totalTransactionsCount}건의 실거래` : "공식 실거래가"} 기록을 집계 분석했습니다.
            </p>
          </div>

          {/* 우측 3단 메트릭 카드 */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-rose-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">전고점 대비 갭</div>
              <div className="text-lg sm:text-xl font-black text-rose-400 mt-0.5">
                {result.dropFromPeakManwon > 0 ? `-${fmtWon(result.dropFromPeakManwon)}` : "신고가 경신"}
              </div>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-emerald-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">바닥 대비 반등</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">
                +{result.bounceRateFromBottom}%
              </div>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-blue-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">회복률</div>
              <div className="text-lg sm:text-xl font-black text-blue-400 mt-0.5">
                {result.recoveryRateFromPeak}%
              </div>
            </div>
          </div>
        </div>

        {/* [B] 3대 핵심 시세 사이클 궤적 카드 (Cycle Journey) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 break-keep">
              <span>📍 3대 핵심 시세 사이클 궤적 (역대 고점 ↔ 바닥 ↔ 현재가)</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">국토교통부 실체결 기준</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* 1. 역대 최고점 (ATH) */}
            <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 font-bold">{result.allTimeHighDate}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 whitespace-nowrap">
                    역대 최고가 (ATH)
                  </span>
                </div>
                <div className="text-2xl font-black text-rose-400 mt-1">
                  {fmtWon(result.allTimeHighPrice)}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                {result.allTimeHighFloor}층 체결 · 부동산 상승기 정점 시세
              </div>
            </div>

            {/* 2. 2022 긴축 바닥점 */}
            <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 font-bold">{result.bottomDate2022}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 whitespace-nowrap">
                    2022 금리 저점
                  </span>
                </div>
                <div className="text-2xl font-black text-blue-400 mt-1">
                  {fmtWon(result.bottomPrice2022)}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                급격한 기준금리 인상기 바닥 지지선
              </div>
            </div>

            {/* 3. 현재 기준 시세 */}
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400 font-bold">최근 실거래</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 whitespace-nowrap">
                    현재 기준 시세
                  </span>
                </div>
                <div className="text-2xl font-black text-emerald-400 mt-1">
                  {fmtWon(result.currentPrice)}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300">
                바닥 대비 +{result.bounceRateFromBottom}% 반등 (회복률 {result.recoveryRateFromPeak}%)
              </div>
            </div>
          </div>
        </div>

        {/* [C] 2006~현재 연도별 실거래가 & 거래량 추이 차트 */}
        {chartData.length > 0 && (
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>📈 20개년 실거래가 및 연간 거래량 추이</span>
              </span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-2.5 h-0.5 bg-blue-400" /> 평균 실거래가 (억원)
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-2 rounded bg-slate-600" /> 연간 거래건수
                </span>
              </div>
            </div>

            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid stroke="#334155" vertical={false} />
                  <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} />
                  <YAxis
                    yAxisId="price"
                    tick={{ fill: "#94a3b8", fontSize: 10 }}
                    tickLine={false}
                    unit="억"
                  />
                  <YAxis
                    yAxisId="count"
                    orientation="right"
                    tick={{ fill: "#64748b", fontSize: 9 }}
                    tickLine={false}
                    hide
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "11px" }}
                    labelStyle={{ color: "#ffffff", fontWeight: 700 }}
                  />
                  <Bar yAxisId="count" dataKey="dealCount" name="거래건수(건)" fill="#334155" radius={[4, 4, 0, 0]} opacity={0.6} />
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="avgPrice억"
                    name="평균 실거래가(억)"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#3b82f6" }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-400 text-center">
              2006년 실거래가 의무화 이후 누적 {result.totalTransactionsCount > 0 ? `${result.totalTransactionsCount}건` : "공식"} 체결 원본 데이터 기반
            </div>
          </div>
        )}

        {/* [D] 평형대별 전고점 대비 회복률 및 갭 정밀 분석표 */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 break-keep">
            <span>📐 평형대별 전고점 대비 회복률 및 잔여 상승 갭</span>
          </h4>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-fixed">
                <colgroup>
                  <col className="w-[30%] sm:w-[25%]" />
                  <col className="w-[25%] sm:w-[25%]" />
                  <col className="w-[25%] sm:w-[25%]" />
                  <col className="w-[20%] sm:w-[25%]" />
                </colgroup>
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="py-2.5 px-3.5 font-bold whitespace-nowrap">평형 구분</th>
                    <th className="py-2.5 px-3 font-bold text-right whitespace-nowrap">역대 전고점 (ATH)</th>
                    <th className="py-2.5 px-3 font-bold text-right whitespace-nowrap">현재 실거래 시세</th>
                    <th className="py-2.5 px-3.5 font-bold text-right whitespace-nowrap">회복률 / 잔여 갭</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {result.areaGaps.map((g, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-white">
                        {g.areaLabel}
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-rose-400">
                        {fmtWon(g.peakPrice)}
                        <span className="block text-[10px] text-slate-500 font-normal">{g.peakDate}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-emerald-400">
                        {fmtWon(g.currentPrice)}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <span className="font-black text-blue-400 text-sm">{g.recoveryRate}%</span>
                        <span className="block text-[10px] text-slate-400">
                          {g.gapManwon > 0 ? `-${fmtWon(g.gapManwon)}` : "전고점 돌파"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* [E] 1차 가격 지지선 & 저항선 매물대 분석 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">🛡️ 1차 가격 지지선 (Support)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                매수 안전 마진
              </span>
            </div>
            <div className="text-xl font-black text-blue-400">
              {fmtWon(result.supportPrice)}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed break-keep">
              2022~2023년 침체기 다수의 실수요 손바뀜이 확인된 구간으로, 추가 급락을 방어하는 단단한 바닥선입니다.
            </p>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold">🚀 1차 가격 저항선 (Resistance)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-400/30">
                전고점 매물대
              </span>
            </div>
            <div className="text-xl font-black text-rose-400">
              {fmtWon(result.resistancePrice)}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed break-keep">
              과거 유동성 랠리 최고점 구간으로, 이 매물대를 돌파할 경우 본격적인 신고가 랠리 2차 파동이 전개됩니다.
            </p>
          </div>
        </div>

        {/* [F] PRO 전용 애널리스트 20년 사이클 총평 리포트 */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 break-keep">
              <span>💡 수석 애널리스트 20년 사이클 총평 & 매수 전략</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-400/30">
                  🔒 PRO 전용 열람
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            <div className="bg-slate-900/90 border border-rose-500/30 rounded-2xl p-5 space-y-2.5 text-xs">
              {result.aiHistoricalBriefing.map((comment, idx) => (
                <div key={idx} className="text-slate-200 leading-relaxed flex items-start gap-2">
                  <span className="text-rose-400 font-bold shrink-0 mt-0.5">▸</span>
                  <span className="break-keep">{comment}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 잠금 해제 인터랙션 */}
          {!unlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-[2px] rounded-2xl p-4">
              <div className="text-center max-w-sm">
                <div className="text-base font-extrabold text-white mb-1">
                  ⚡ 20년 실거래 전고점 및 갭 분석 전체 무료 열람
                </div>
                <p className="text-xs text-slate-300 mb-4 break-keep">
                  오픈 베타 기간 동안 20개년 원본 거래 이력 기반 전고점 회복률과 매수 타이밍 전략을 무료로 확인하세요.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-orange-600 to-rose-500 hover:from-rose-500 hover:to-orange-500 font-black text-xs text-white shadow-lg shadow-rose-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  실거래 사이클 리포트 전체 열람하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* [G] 고지사항 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 데이터 출처 안내</div>
          <p>
            • 본 분석은 국토교통부 실거래가 공개시스템의 2006년 이후 누적 신고 데이터를 전수 집계하여 산출되었습니다.
          </p>
          <p>
            • 직거래 또는 계약 취소 건은 정밀 필터링하여 정상적인 중개거래 체결 건 위주로 통계에 반영하였습니다.
          </p>
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto break-keep">
      <div className="my-auto w-full max-w-4xl animate-in fade-in zoom-in-95 duration-200">
        {content}
      </div>
    </div>
  );
}

export default HistoricalPriceProReportModal;
