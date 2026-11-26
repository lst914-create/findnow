"use client";

import React, { useState, useMemo } from "react";
import {
  calcGapInvestmentRisk,
  GapRiskResult,
} from "@/lib/gapRiskCalc";
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
    rent_min?: number | null;
    rent_max?: number | null;
    jeonseRatio?: number | null;
    gapPrice?: number | null;
    region?: string;
    district?: string;
  };
  onClose?: () => void;
  isInline?: boolean;
}

export function GapRiskProReportModal({ apt, onClose, isInline = false }: Props) {
  const [unlocked, setUnlocked] = useState(false);

  const result: GapRiskResult = useMemo(() => {
    return calcGapInvestmentRisk(apt);
  }, [apt]);

  // 위험 등급별 UI 스타일
  const getGradeStyle = (grade: GapRiskResult["grade"]) => {
    switch (grade) {
      case "안전 (철벽 방어)":
        return {
          bg: "from-emerald-950/40 via-teal-950/30 to-slate-900/80 border-emerald-500/40 text-emerald-300",
          badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          icon: "🛡️",
          title: "역전세 철벽 방어구역",
          desc: `전세가율이 ${result.jeonseRatio}%로 안정권에 있어 매매가 조정 시에도 보증금 미반환 우려가 극히 낮습니다.`,
        };
      case "주의 (선별 진입)":
        return {
          bg: "from-amber-950/40 via-yellow-950/30 to-slate-900/80 border-amber-500/40 text-amber-300",
          badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          icon: "⚠️",
          title: "일반 갭투자 주의구역",
          desc: `전세가율이 ${result.jeonseRatio}% 구간입니다. 소액 갭투자는 유리하나 향후 금리 및 입주 물량에 따른 전세가 조정을 고려해야 합니다.`,
        };
      default:
        return {
          bg: "from-rose-950/40 via-red-950/30 to-slate-900/80 border-rose-500/40 text-rose-300",
          badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          icon: "🚨",
          title: "역전세 고위험 경보구역",
          desc: `전세가율이 ${result.jeonseRatio}%로 높아 매매가 소폭 하락 시 역전세 및 HUG 보증보험 가입 거절 리스크가 큽니다.`,
        };
    }
  };

  const gradeStyle = getGradeStyle(result.grade);

  // 차트 데이터
  const chartData = useMemo(() => {
    return result.yearlyBands.map((b) => ({
      year: `${b.year}년`,
      매매가억: Math.round((b.salePrice / 10000) * 10) / 10,
      전세가억: Math.round((b.rentPrice / 10000) * 10) / 10,
      전세가율: b.ratio,
    }));
  }, [result]);

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-4xl w-full mx-auto relative max-h-[90vh] flex flex-col">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. 헤더 섹션 (고정) */}
      <div className="p-6 sm:p-7 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4 shrink-0 bg-slate-950/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm whitespace-nowrap">
              PRO REPORT #06
            </span>
            <span className="text-[11px] text-amber-400 font-bold bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
              HUG 보증보험 & 역전세 스트레스 진단
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight break-keep">
            {apt.name} 갭투자 가성비 및 역전세 방어력 진단
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            실거래 전세가율 5개년 밴드, 취득세 포함 실투자금, HUG 보증한도 안전 쿠션, 하락장 스트레스 테스트
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
        {/* [A] 종합 위험도 및 투자 판단 액션 배너 */}
        <div className={`p-5 sm:p-6 rounded-2xl bg-gradient-to-r ${gradeStyle.bg} border flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5`}>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-2xl">{gradeStyle.icon}</span>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                {gradeStyle.title} ({result.grade})
              </span>
              <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-sm ${gradeStyle.badgeBg}`}>
                전세가율 {result.jeonseRatio}%
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {result.actionVerdict}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {gradeStyle.desc}
            </p>
          </div>

          {/* 우측 3단 지표 카드 */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-amber-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">전세가율</div>
              <div className="text-lg sm:text-xl font-black text-amber-400 mt-0.5">
                {result.jeonseRatio}%
              </div>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-blue-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">순수 갭</div>
              <div className="text-lg sm:text-xl font-black text-blue-400 mt-0.5">
                {fmtWon(result.pureGap)}
              </div>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-emerald-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">역전세 방어</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">
                {result.defenseScore}<span className="text-xs font-normal text-slate-400">점</span>
              </div>
            </div>
          </div>
        </div>

        {/* [B] 핵심 3단 갭투자 재무 지표 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 순수 갭투자금 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">매매 - 전세</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  순수 갭
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">순수 갭투자 금액</h4>
              <div className="text-xl font-black text-blue-400 mt-1">
                {fmtWon(result.pureGap)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
              매매 {fmtWon(result.currentPrice)} / 전세 {fmtWon(result.currentRent)}
            </p>
          </div>

          {/* 취득세 포함 실투자 필요금 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">취득세·중개보수 가산</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  실투자 총액
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">총 실현금 필요액</h4>
              <div className="text-xl font-black text-amber-400 mt-1">
                {fmtWon(result.totalInvestmentNeeded)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
              취득세({fmtWon(result.acquisitionTax)}) + 중개보수({fmtWon(result.brokerFee)}) 반영
            </p>
          </div>

          {/* HUG 보증보험 안전 한도 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">실거래가의 90% 한도</span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                  result.isHugGuaranteed ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                }`}>
                  {result.isHugGuaranteed ? "HUG 보증 안심" : "보증가입 주의"}
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">HUG 보증한도 상한선</h4>
              <div className="text-xl font-black text-emerald-400 mt-1">
                {fmtWon(result.hugSafetyLimit)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
              안전 쿠션: +{fmtWon(result.hugCushionManwon)} (보증보험 100% 가입 가능선)
            </p>
          </div>
        </div>

        {/* [C] 5개년 전세가율 추이 차트 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>📈 최근 5개년 매매가·전세가 및 전세가율 밴드 추이</span>
            </span>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="flex items-center gap-1 text-blue-400">
                <span className="w-2.5 h-0.5 bg-blue-400" /> 매매가(억)
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-0.5 bg-emerald-400" /> 전세가(억)
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded bg-amber-400" /> 전세가율(%)
              </span>
            </div>
          </div>

          <div className="w-full h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#334155" vertical={false} />
                <XAxis dataKey="year" tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} />
                <YAxis yAxisId="price" tick={{ fill: "#94a3b8", fontSize: 10 }} tickLine={false} unit="억" />
                <YAxis yAxisId="ratio" orientation="right" tick={{ fill: "#f59e0b", fontSize: 9 }} tickLine={false} unit="%" domain={[30, 90]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", fontSize: "11px" }}
                  labelStyle={{ color: "#ffffff", fontWeight: 700 }}
                />
                <Line yAxisId="price" type="monotone" dataKey="매매가억" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="price" type="monotone" dataKey="전세가억" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                <Bar yAxisId="ratio" dataKey="전세가율" fill="#f59e0b" radius={[4, 4, 0, 0]} opacity={0.3} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="text-[11px] text-slate-400 text-center">
            전세가율이 과거 평균 밴드({result.jeonseRatio}%) 내에 안정적으로 안착되어 있습니다.
          </div>
        </div>

        {/* [D] 하락장 3단계 스트레스 테스트 매트릭스 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>⚠️ 역전세 하락장 3단계 스트레스 테스트 (집주인 준비금 진단)</span>
            </h4>
            <span className="text-[11px] text-slate-500">2년 뒤 전세 만기 시나리오</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {result.stressTests.map((st, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-300">전세가 {st.dropRate}% 하락 시</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      st.dropRate === 5 ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : st.dropRate === 10 ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                    }`}>
                      {st.riskLevel}
                    </span>
                  </div>
                  <div className="text-xl font-black text-rose-400 mt-1">
                    -{fmtWon(st.refundAmountManwon)}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 leading-snug">
                  • 반환 필요 준비금: {fmtWon(st.refundAmountManwon)}<br />
                  • 퇴거자금 대출 대응: {st.depositLoanAvailable ? "대출 가능 한도 내" : "DSR 사전 점검 요망"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* [E] 평형대별(25평 vs 34평) 갭투자 가성비 비교표 */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span>📐 평형대별 갭투자 가성비 및 실투자금 비교표</span>
          </h4>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-fixed">
                <colgroup>
                  <col className="w-[30%] sm:w-[28%]" />
                  <col className="w-[22%] sm:w-[22%]" />
                  <col className="w-[24%] sm:w-[24%]" />
                  <col className="w-[24%] sm:w-[26%]" />
                </colgroup>
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="py-2.5 px-3.5 font-bold">평형 구분</th>
                    <th className="py-2.5 px-3 font-bold text-right">매매가 / 전세가</th>
                    <th className="py-2.5 px-3 font-bold text-right">순수 갭 / 전세가율</th>
                    <th className="py-2.5 px-3.5 font-bold text-right">총 실투자 필요금</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {result.areaGaps.map((ag, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-white">
                        <span className="block truncate">{ag.areaLabel}</span>
                        <span className="text-[10px] text-emerald-400 font-normal">환금성 {ag.liquidityGrade}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="font-extrabold text-white block">{fmtWon(ag.salePrice)}</span>
                        <span className="text-[10px] text-slate-400">{fmtWon(ag.rentPrice)}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="font-black text-blue-400 block">{fmtWon(ag.pureGap)}</span>
                        <span className="text-[10px] text-amber-400 font-bold">{ag.ratio}%</span>
                      </td>
                      <td className="py-3 px-3.5 text-right font-black text-amber-400">
                        {fmtWon(ag.totalCashNeeded)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* [F] PRO 전용 애널리스트 갭투자 출구 전략(Exit Strategy) 리포트 */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>💡 수석 애널리스트 갭투자 출구 전략(Exit Strategy) 총평</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  🔒 PRO 전용 열람
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-5 space-y-2 text-xs">
              {result.exitStrategy.map((comment, idx) => (
                <div key={idx} className="text-slate-200 leading-relaxed flex items-start gap-2">
                  <span className="text-amber-400 font-bold shrink-0 mt-0.5">▸</span>
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
                  ⚡ 갭투자 리스크 & 출구 전략 전체 무료 열람
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  오픈 베타 기간 동안 하락장 스트레스 테스트와 전세가율 5개년 밴드 리포트를 무료로 확인하세요.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-500 hover:to-orange-500 font-black text-xs text-white shadow-lg shadow-amber-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  갭투자 리포트 전체 열람하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* [G] 고지사항 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 갭투자 리스크 진단 안내</div>
          <p>
            • 본 분석은 국토교통부 실거래가 공개시스템의 최근 매매·전세 신고 데이터를 기반으로 정량 산출되었습니다.
          </p>
          <p>
            • HUG 보증보험 가입 기준은 공시가격의 126% 또는 실거래가 90% 이하 적용 여부에 따라 실제 가입 시 차이가 발생할 수 있습니다.
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

export default GapRiskProReportModal;
