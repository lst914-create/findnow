"use client";

import React, { useState, useMemo } from "react";
import {
  simulateApartmentTaxes,
  TaxSimulationResult,
} from "@/lib/taxCalc";
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
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-4xl w-full mx-auto relative max-h-[90vh] flex flex-col break-keep">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. 헤더 섹션 (고정) */}
      <div className="p-6 sm:p-7 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4 shrink-0 bg-slate-950/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm whitespace-nowrap">
              PRO REPORT #07
            </span>
            <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
              2025 개정 세법 및 종부세 시뮬레이터
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight break-keep">
            {apt.name} 취득·보유·양도세 통합 시뮬레이션
          </h2>
          <p className="text-xs text-slate-400 mt-1 break-keep">
            공시가격 현실화율 및 1주택/다주택자 조건에 따른 연도별 보유세와 양도소득세 정밀 산출
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
        {/* [A] 인터랙티브 조건 조작 바 (주택 수 & 보유 기간 선택) */}
        <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* 주택 수 선택 */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold block">🏠 세대 기준 보유 주택 수</label>
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
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    houseCount === item.count
                      ? "bg-blue-600 text-white shadow-md ring-1 ring-blue-400"
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
            <label className="text-slate-400 font-bold block">⏳ 보유 기간 (장기보유특별공제 산출)</label>
            <div className="flex gap-1.5">
              {[
                { years: 2, label: "2년 (기본)" },
                { years: 5, label: "5년 보유" },
                { years: 10, label: "10년 이상 (최대 80%)" },
              ].map((item) => (
                <button
                  key={item.years}
                  type="button"
                  onClick={() => setHoldingYears(item.years)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    holdingYears === item.years
                      ? "bg-emerald-600 text-white shadow-md ring-1 ring-emerald-400"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* [B] 핵심 세금 요약 3단 카드 (취득세 / 보유세 / 양도세) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 1. 취득세 */}
          <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">1회성 납부</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  실효세율 {simulation.acquisitionTax.effectiveRate}%
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200 break-keep">예상 취득세 합계</h4>
              <div className="text-2xl font-black text-blue-400 mt-1">
                {fmtWon(simulation.acquisitionTax.total)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed break-keep">
              본세 {fmtWon(simulation.acquisitionTax.baseTax)} + 교육세 {fmtWon(simulation.acquisitionTax.localEducationTax)}
              {simulation.acquisitionTax.ruralSpecialTax > 0 ? ` + 농특세 ${fmtWon(simulation.acquisitionTax.ruralSpecialTax)}` : ""}
            </p>
          </div>

          {/* 2. 연간 보유세 */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">연간 정기 납부</span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                  simulation.holdingTax.isCompTaxTarget
                    ? "bg-rose-500/20 text-rose-300"
                    : "bg-emerald-500/20 text-emerald-300"
                }`}>
                  {simulation.holdingTax.isCompTaxTarget ? "종부세 과세 대상" : "종부세 비과세"}
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200 break-keep">연간 보유세 (재산+종부)</h4>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                {fmtWon(simulation.holdingTax.annualTotal)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed break-keep">
              재산세 {fmtWon(simulation.holdingTax.propertyTax)} + 종부세 {fmtWon(simulation.holdingTax.comprehensiveTax)}
            </p>
          </div>

          {/* 3. 양도소득세 */}
          <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">처분 시점 납부</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  {simulation.capitalGainsTax.specialDeductionRate > 0
                    ? `장특공제 ${simulation.capitalGainsTax.specialDeductionRate}%`
                    : "비과세"}
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200 break-keep">예상 양도소득세</h4>
              <div className="text-2xl font-black text-indigo-400 mt-1">
                {simulation.capitalGainsTax.taxAmount === 0
                  ? "0원 (1주택 비과세)"
                  : fmtWon(simulation.capitalGainsTax.taxAmount)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed break-keep">
              {simulation.capitalGainsTax.details}
            </p>
          </div>
        </div>

        {/* [C] 부부 공동명의 vs 단독명의 1:1 절세 대조 박스 */}
        <div className="bg-slate-900/80 border border-emerald-500/40 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>⚖️ 부부 공동명의(5:5) vs 단독명의 절세 효과 비교</span>
            </span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 whitespace-nowrap">
              {simulation.jointComparison.recommendation}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[11px] text-slate-400">단독명의 총 세부담</div>
              <div className="text-base font-black text-slate-200">
                보유세 {fmtWon(simulation.jointComparison.singleHoldingTax)} / 양도세 {fmtWon(simulation.jointComparison.singleCgTax)}
              </div>
              <div className="text-[10px] text-slate-400">• 종부세 공제한도 12억원</div>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[11px] text-slate-400">부부 공동명의(5:5) 세부담</div>
              <div className="text-base font-black text-emerald-400">
                보유세 {fmtWon(simulation.jointComparison.jointHoldingTax)} / 양도세 {fmtWon(simulation.jointComparison.jointCgTax)}
              </div>
              <div className="text-[10px] text-slate-400">• 종부세 합산 18억 공제 & 양도세 분산</div>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-emerald-500/30 space-y-1">
              <div className="text-[11px] text-slate-400">절세 혜택 총액</div>
              <div className="text-lg font-black text-emerald-400">
                {simulation.jointComparison.totalTaxSaving > 0
                  ? `-${fmtWon(simulation.jointComparison.totalTaxSaving)} 절감`
                  : "세부담 대등"}
              </div>
              <div className="text-[10px] text-emerald-300">• 종합부동산세 전액 면제 및 누진세율 완화</div>
            </div>
          </div>
        </div>

        {/* [D] 주택 수별(1주택 vs 2주택 vs 3주택) 생애 총세금 비교 매트릭스 */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 break-keep">
            <span>📊 보유 주택 수별(1주택 vs 2주택 vs 3주택) 세부담 매트릭스</span>
          </h4>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-fixed">
                <colgroup>
                  <col className="w-[28%] sm:w-[25%]" />
                  <col className="w-[24%] sm:w-[25%]" />
                  <col className="w-[24%] sm:w-[25%]" />
                  <col className="w-[24%] sm:w-[25%]" />
                </colgroup>
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="py-2.5 px-3.5 font-bold whitespace-nowrap">주택 수 구분</th>
                    <th className="py-2.5 px-3 font-bold text-right whitespace-nowrap">취득세 (세율)</th>
                    <th className="py-2.5 px-3 font-bold text-right whitespace-nowrap">연간 보유세</th>
                    <th className="py-2.5 px-3.5 font-bold text-right whitespace-nowrap">양도소득세</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {simulation.houseCountMatrix.map((item, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        (houseCount === 1 && idx === 0) || (houseCount === 2 && idx === 1) || (houseCount === 3 && idx === 2)
                          ? "bg-blue-950/20 ring-1 ring-inset ring-blue-500/30"
                          : ""
                      }`}
                    >
                      <td className="py-3 px-3.5 font-bold text-white">
                        {item.houseCountLabel}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="font-extrabold text-blue-400 block">{fmtWon(item.acquisitionTax)}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{item.acquisitionRate}%</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="font-extrabold text-emerald-400 block">{fmtWon(item.annualHoldingTax)}</span>
                        <span className="text-[10px] text-slate-400 font-normal">종부 {fmtWon(item.comprehensiveTax)}</span>
                      </td>
                      <td className="py-3 px-3.5 text-right font-extrabold text-indigo-400">
                        {item.capitalGainsTax === 0 ? "0원 (비과세)" : fmtWon(item.capitalGainsTax)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* [E] 보유 기간별(2년, 5년, 10년) 장특공제율 & 양도소득세 감면 시뮬레이션 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 break-keep">
              <span>⏳ 보유 기간별 장기보유특별공제 & 양도소득세 감면 혜택</span>
            </h4>
            <span className="text-[11px] text-slate-500">1주택 12억 초과분 과세 기준</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {simulation.holdingSchedules.map((sch, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-300">{sch.years}년 보유·거주</span>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 whitespace-nowrap">
                      장특공제 {sch.specialDeductionRate}%
                    </span>
                  </div>
                  <div className="text-xl font-black text-indigo-400 mt-1">
                    {sch.cgTaxAmount === 0 ? "0원 (비과세)" : fmtWon(sch.cgTaxAmount)}
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                  {sch.specialDeductionRate === 80 ? "최대 80% 공제 (보유40%+거주40%)" : `${sch.years * 4}% 기본 공제 적용`}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* [F] PRO 전용 수석 부동산 세무위원 절세 전략 리포트 */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 break-keep">
              <span>💡 수석 부동산 세무 전문위원 실전 절세 솔루션</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  🔒 PRO 전용 열람
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 space-y-2 text-xs">
              {simulation.aiStrategyComment.map((comment, idx) => (
                <div key={idx} className="text-slate-200 leading-relaxed flex items-start gap-2">
                  <span className="text-emerald-400 font-bold shrink-0 mt-0.5">▸</span>
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
                  ⚡ 세무 상세 리포트 및 절세 전략 전체 무료 열람
                </div>
                <p className="text-xs text-slate-300 mb-4 break-keep">
                  오픈 베타 기간 동안 부부 공동명의 절세액과 보유 기간별 양도세 감면 시뮬레이션을 무료로 확인하세요.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 hover:from-emerald-500 hover:to-teal-500 font-black text-xs text-white shadow-lg shadow-emerald-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  세무 시뮬레이션 전체 열람하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* [G] 고지사항 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 세금 시뮬레이션 고지사항</div>
          <p>
            • 본 시뮬레이션은 국토교통부 실거래가 및 현행 세법(지방세법·종합부동산세법·소득세법)을 기준으로 정량 산출되었습니다.
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto break-keep">
      <div className="my-auto w-full max-w-4xl animate-in fade-in zoom-in-95 duration-200">
        {content}
      </div>
    </div>
  );
}

export default HoldingTaxProReportModal;
