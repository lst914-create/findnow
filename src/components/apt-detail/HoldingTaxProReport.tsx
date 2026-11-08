"use client";

import React, { useState, useMemo } from "react";
import { simulateApartmentTaxes, TaxSimulationResult } from "@/lib/taxCalc";
import { fmtWon } from "@/lib/fairValueCalc";

interface Props {
  apt: {
    id: string;
    name: string;
    price_min?: number | null;
    price_max?: number | null;
    area_sqm?: number | null;
    region?: string;
    district?: string;
  };
  onClose?: () => void;
  isInline?: boolean;
}

export function HoldingTaxProReportModal({ apt, onClose, isInline = false }: Props) {
  // 기준 매매가: 평균가 또는 최소/최대가
  const defaultPrice = useMemo(() => {
    const min = apt.price_min || 0;
    const max = apt.price_max || 0;
    if (min > 0 && max > 0) return Math.round((min + max) / 2);
    return min || max || 60000;
  }, [apt]);

  // 시뮬레이터 조작 상태
  const [houseCount, setHouseCount] = useState<1 | 2 | 3>(1);
  const [holdingYears, setHoldingYears] = useState<number>(3);
  const [isAdjustedArea, setIsAdjustedArea] = useState<boolean>(false);
  const [unlocked, setUnlocked] = useState(false);

  const simulation: TaxSimulationResult = useMemo(() => {
    return simulateApartmentTaxes({
      priceManwon: defaultPrice,
      areaSqm: apt.area_sqm || 84,
      houseCount,
      holdingYears,
      isAdjustedArea,
    });
  }, [defaultPrice, apt.area_sqm, houseCount, holdingYears, isAdjustedArea]);

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-3xl w-full mx-auto relative">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 헤더 섹션 */}
      <div className="p-6 sm:p-8 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm">
              PRO REPORT #07
            </span>
            <span className="text-xs text-slate-400 font-medium">부동산 세금 및 종합부동산세 AI 시뮬레이터</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              simulation.policyInfo?.isExpired
                ? "bg-amber-950/80 text-amber-400 border-amber-500/40 animate-pulse"
                : "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
            }`}>
              {simulation.policyInfo?.isExpired ? "⚠️ 세법 갱신 필요" : "🟢 최신 세법 반영"} ({simulation.policyInfo?.effectiveYear})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {apt.name} 취득·보유·양도세 통합 시뮬레이션
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            공시가격 현실화율 및 1주택/다주택자 조건에 따른 연도별 보유세와 양도소득세 정밀 산출
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
        {/* 인터랙티브 시뮬레이션 조건 변경 바 */}
        <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* 주택 수 선택 */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold block">🏠 세대 기준 주택 수</label>
            <div className="flex gap-1.5">
              {[
                { count: 1, label: "1주택 (무주택 포함)" },
                { count: 2, label: "2주택" },
                { count: 3, label: "3주택 이상" },
              ].map((item) => (
                <button
                  key={item.count}
                  type="button"
                  onClick={() => setHouseCount(item.count as 1 | 2 | 3)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    houseCount === item.count
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 보유 기간 선택 */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold block">⏳ 보유 기간 (양도세 산출)</label>
            <div className="flex gap-1.5">
              {[
                { years: 1, label: "1년 미만" },
                { years: 2, label: "2년" },
                { years: 3, label: "3년" },
                { years: 5, label: "5년" },
                { years: 10, label: "10년 이상" },
              ].map((item) => (
                <button
                  key={item.years}
                  type="button"
                  onClick={() => setHoldingYears(item.years)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    holdingYears === item.years
                      ? "bg-emerald-600 text-white shadow"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1. 핵심 세금 요약 3단 카드 (취득세 / 보유세 / 양도세) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 취득세 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">1회성 납부</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  실효세율 {simulation.acquisitionTax.effectiveRate}%
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">예상 취득세 합계</h4>
              <div className="text-xl font-black text-blue-400 mt-2">
                {fmtWon(simulation.acquisitionTax.total)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed">
              {simulation.acquisitionTax.details}
            </p>
          </div>

          {/* 연간 보유세 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">연간 정기 납부</span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                  simulation.holdingTax.isCompTaxTarget
                    ? "bg-rose-500/20 text-rose-300"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}>
                  {simulation.holdingTax.isCompTaxTarget ? "종부세 과세" : "종부세 비과세"}
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">연간 보유세 (재산+종부)</h4>
              <div className="text-xl font-black text-emerald-400 mt-2">
                {fmtWon(simulation.holdingTax.annualTotal)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed">
              재산세 {fmtWon(simulation.holdingTax.propertyTax)} + 종부세 {fmtWon(simulation.holdingTax.comprehensiveTax)}
            </p>
          </div>

          {/* 양도소득세 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">처분 시점 납부</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  {simulation.capitalGainsTax.specialDeductionRate > 0
                    ? `장특공제 ${simulation.capitalGainsTax.specialDeductionRate}%`
                    : "기본"}
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">예상 양도소득세</h4>
              <div className="text-xl font-black text-indigo-400 mt-2">
                {simulation.capitalGainsTax.taxAmount === 0
                  ? "0원 (비과세)"
                  : fmtWon(simulation.capitalGainsTax.taxAmount)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed">
              {simulation.capitalGainsTax.details}
            </p>
          </div>
        </div>

        {/* 2. PRO 세부 산출 명세 및 절세 가이드 (잠금해제 UX) */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>AI 세무 분석 & 절세 전략 리포트</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  🔒 PRO 전용
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 font-semibold">추정 공시가격 (현실화율 69%)</span>
              <span className="font-extrabold text-white bg-slate-800/80 px-2.5 py-1 rounded">
                {fmtWon(simulation.estimatedOfficialPrice)}
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 font-semibold">취득세 구성 내역</span>
              <span className="font-extrabold text-white bg-slate-800/80 px-2.5 py-1 rounded">
                본세 {fmtWon(simulation.acquisitionTax.baseTax)} + 교육세 {fmtWon(simulation.acquisitionTax.localEducationTax)}
                {simulation.acquisitionTax.ruralSpecialTax > 0 ? ` + 농특세 ${fmtWon(simulation.acquisitionTax.ruralSpecialTax)}` : ""}
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 font-semibold">종부세 과세표준 공제선</span>
              <span className="font-extrabold text-white bg-slate-800/80 px-2.5 py-1 rounded">
                {houseCount === 1 ? "1세대 1주택 단독명의 12억원" : "다주택 인별 9억원"}
              </span>
            </div>

            {/* AI 맞춤 절세 코멘트 */}
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                <span>💡</span>
                <span>AI 세무 진단 및 절세 가이드</span>
              </div>
              {simulation.aiStrategyComment.map((comment, idx) => (
                <div key={idx} className="text-slate-300 leading-relaxed flex items-start gap-1.5">
                  <span className="text-emerald-500">•</span>
                  <span>{comment}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PRO 잠금 해제 버튼 */}
          {!unlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] rounded-2xl p-4">
              <div className="text-center max-w-sm">
                <div className="text-base font-extrabold text-white mb-1">
                  📊 상세 세무 명세 및 AI 절세 가이드
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  오픈 베타 기간 동안 부부 공동명의 절세 효과 및 맞춤형 양도세 시뮬레이션을 무료로 확인하실 수 있습니다.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 font-black text-xs text-white shadow-lg shadow-emerald-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  ⚡ 세무 상세 리포트 무료 열람
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3. 주의사항 및 고지 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 세금 시뮬레이션 고지사항</div>
          <p>
            • 본 시뮬레이션은 국토부 실거래가 및 현행 세법(지방세법·종합부동산세법·소득세법)을 기준으로 추정한 참고용 수치입니다.
          </p>
          <p>
            • 실제 납부 세액은 개인별 공동명의 여부, 주택 보유 기간, 공시가격 확정 고시 등에 따라 차이가 발생할 수 있으므로 전문 세무사와 상담하시기 바랍니다.
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
export default HoldingTaxProReportModal;

