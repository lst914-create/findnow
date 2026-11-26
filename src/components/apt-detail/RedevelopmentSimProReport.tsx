"use client";

import React, { useState, useMemo } from "react";
import {
  simulateRedevelopment,
  RedevelopmentSimResult,
} from "@/lib/redevelopmentSimCalc";
import { fmtWon } from "@/lib/fairValueCalc";

interface Props {
  apt: {
    id: string;
    name: string;
    price_min?: number | null;
    price_max?: number | null;
    area_pyeong?: number | null;
    built_year?: number | null;
    region?: string;
    district?: string;
  };
  onClose?: () => void;
  isInline?: boolean;
}

export function RedevelopmentSimProReportModal({
  apt,
  onClose,
  isInline = false,
}: Props) {
  // 기준 자산 평가액 (매매가 평균 또는 기본값)
  const defaultAssetValue = useMemo(() => {
    const min = apt.price_min || 0;
    const max = apt.price_max || 0;
    if (min > 0 && max > 0) return Math.round((min + max) / 2);
    return min || max || 60000;
  }, [apt]);

  // 시뮬레이터 조작 상태
  const [targetPyeong, setTargetPyeong] = useState<25 | 34 | 43>(34);
  const [constructionCost, setConstructionCost] = useState<number>(950); // 950만원 기본
  const [unlocked, setUnlocked] = useState(false);

  const currentPyeong = Math.round(apt.area_pyeong || 25);
  const builtYear = apt.built_year || 1995;

  const result: RedevelopmentSimResult = useMemo(() => {
    return simulateRedevelopment({
      currentAssetValueManwon: defaultAssetValue,
      builtYear,
      currentPyeong,
      targetPyeong,
      constructionCostPerPyeong: constructionCost,
      region: apt.region,
      district: apt.district,
    });
  }, [defaultAssetValue, builtYear, currentPyeong, targetPyeong, constructionCost, apt.region, apt.district]);

  // 사업성 등급 뱃지 스타일
  const getGradeStyle = (grade: RedevelopmentSimResult["feasibilityGrade"]) => {
    if (grade.includes("S급")) return "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-purple-500/10";
    if (grade.includes("A급")) return "bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-blue-500/10";
    if (grade.includes("B급")) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10";
    return "bg-amber-500/20 text-amber-300 border-amber-500/40";
  };

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-4xl w-full mx-auto relative max-h-[90vh] flex flex-col">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. 헤더 섹션 (고정) */}
      <div className="p-6 sm:p-7 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4 shrink-0 bg-slate-950/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm whitespace-nowrap">
              PRO REPORT #04
            </span>
            <span className="text-[11px] text-purple-400 font-bold bg-purple-950/60 border border-purple-500/30 px-2 py-0.5 rounded-full">
              정비사업 감정평가 및 비례율 역산 엔진
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight break-keep">
            {apt.name} 재건축·정비사업 분담금 및 비례율 시뮬레이션
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            신축 희망 평형별 예상 분담금(환급금), 공사비 시나리오별 비례율 및 권리가액 정밀 역산
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
        {/* [A] 인터랙티브 시뮬레이터 조작 바 (신축 희망 평형 & 평당 공사비 선택) */}
        <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* 희망 평형 */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold block">🏢 신축 분양 희망 평형 선택</label>
            <div className="flex gap-1.5">
              {[
                { pyeong: 25, label: "25평 (전용 59㎡)" },
                { pyeong: 34, label: "34평 (전용 84㎡)" },
                { pyeong: 43, label: "43평 (전용 114㎡)" },
              ].map((item) => (
                <button
                  key={item.pyeong}
                  type="button"
                  onClick={() => setTargetPyeong(item.pyeong as 25 | 34 | 43)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    targetPyeong === item.pyeong
                      ? "bg-purple-600 text-white shadow-md ring-1 ring-purple-400"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* 평당 공사비 시나리오 */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold block">🏗️ 평당 공사비 시나리오</label>
            <div className="flex gap-1.5">
              {[
                { cost: 850, label: "850만원" },
                { cost: 950, label: "950만원 (표준)" },
                { cost: 1050, label: "1,050만원" },
                { cost: 1200, label: "1,200만원 (하이엔드)" },
              ].map((item) => (
                <button
                  key={item.cost}
                  type="button"
                  onClick={() => setConstructionCost(item.cost)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    constructionCost === item.cost
                      ? "bg-indigo-600 text-white shadow-md ring-1 ring-indigo-400"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* [B] 최종 손익 결과 하이라이트 배너 */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-slate-900/80 border border-purple-500/30 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-2xl">💰</span>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                {result.isRefund
                  ? `예상 환급금: ${fmtWon(result.contributionAmount)}`
                  : `예상 추가 분담금: ${fmtWon(result.contributionAmount)}`}
              </span>
              <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-sm ${getGradeStyle(result.feasibilityGrade)}`}>
                사업성 {result.feasibilityGrade}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              기존 전용 약 {currentPyeong}평 소유 기준, 신축 {targetPyeong}평 신청 시 추정 금액입니다. (공사비 평당 {constructionCost.toLocaleString()}만원 적용)
            </p>
          </div>

          {/* 우측 3단 지표 카드 */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-purple-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">추정 비례율</div>
              <div className="text-lg sm:text-xl font-black text-purple-400 mt-0.5">
                {result.estimatedProportionRatio}%
              </div>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-indigo-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">총 투자금</div>
              <div className="text-lg sm:text-xl font-black text-indigo-400 mt-0.5">
                {fmtWon(result.totalInvestmentCost)}
              </div>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-emerald-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">예상 안전마진</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">
                +{fmtWon(result.safetyMarginManwon)}
              </div>
            </div>
          </div>
        </div>

        {/* [C] 핵심 3단 재건축 재무 구조 공식 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 종전 감정평가액 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">기존 자산 가치</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  시가 78% 추정
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">종전자산 감정평가액</h4>
              <div className="text-xl font-black text-blue-400 mt-1">
                {fmtWon(result.estimatedAppraisalValue)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
              현재 실거래가({fmtWon(defaultAssetValue)}) 기준 권리 감정가 역산
            </p>
          </div>

          {/* 조합원 권리가액 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">감정가 × 비례율</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  최종 권리가액
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">조합원 최종 권리가액</h4>
              <div className="text-xl font-black text-purple-400 mt-1">
                {fmtWon(result.estimatedRightValue)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
              비례율 {result.estimatedProportionRatio}% 적용
            </p>
          </div>

          {/* 조합원 분양가 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">신축 {targetPyeong}평 분양가</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  일반분양 85% 우대
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">조합원 분양가</h4>
              <div className="text-xl font-black text-emerald-400 mt-1">
                {fmtWon(result.targetMemberSalePrice)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 leading-relaxed">
              일반분양가(평당 {result.appliedGeneralSalePrice.toLocaleString()}만) 대비 15% 조합원 혜택
            </p>
          </div>
        </div>

        {/* [D] 신축 희망 평형별(25평 vs 34평 vs 43평) 분담금 & 안전마진 비교표 */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span>📐 신축 희망 평형별 예상 분담금 및 안전마진 견적표</span>
          </h4>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-fixed">
                <colgroup>
                  <col className="w-[30%] sm:w-[25%]" />
                  <col className="w-[22%] sm:w-[22%]" />
                  <col className="w-[24%] sm:w-[25%]" />
                  <col className="w-[24%] sm:w-[28%]" />
                </colgroup>
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="py-2.5 px-3.5 font-bold">신축 신청 평형</th>
                    <th className="py-2.5 px-3 font-bold text-right">조합원 분양가</th>
                    <th className="py-2.5 px-3 font-bold text-right">예상 분담금(환급금)</th>
                    <th className="py-2.5 px-3.5 font-bold text-right">준공 후 예상 마진</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {result.pyeongOptions.map((opt, idx) => (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        targetPyeong === opt.pyeong ? "bg-purple-950/20 ring-1 ring-inset ring-purple-500/30" : ""
                      }`}
                    >
                      <td className="py-3 px-3.5 font-bold text-white">
                        <span className="block truncate">{opt.label}</span>
                        <span className="text-[10px] text-slate-400 font-normal">총 투자 {fmtWon(opt.totalCost)}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-slate-300">
                        {fmtWon(opt.memberPrice)}
                      </td>
                      <td className="py-3 px-3 text-right font-black">
                        {opt.isRefund ? (
                          <span className="text-emerald-400">환급 +{fmtWon(opt.contributionAmount)}</span>
                        ) : (
                          <span className="text-rose-400">납부 +{fmtWon(opt.contributionAmount)}</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <span className="font-black text-purple-300">+{fmtWon(opt.safetyMargin)}</span>
                        <span className="block text-[10px] text-emerald-400 font-bold">수익률 +{opt.marginRate}%</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* [E] 공사비 시나리오별 비례율 및 분담금 민감도 분석 매트릭스 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>🏗️ 평당 공사비 변동에 따른 비례율 & 분담금 민감도 매트릭스</span>
            </h4>
            <span className="text-[11px] text-slate-500">신축 {targetPyeong}평 기준</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {result.costSensitivities.map((s, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between ${
                  constructionCost === s.costPerPyeong
                    ? "bg-slate-900 border-indigo-500 shadow-md ring-1 ring-indigo-500/30"
                    : "bg-slate-900/60 border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-300">평당 {s.costPerPyeong}만</span>
                    <span className="text-[10px] text-slate-400">{s.feasibility}</span>
                  </div>
                  <div className="text-base font-black text-purple-400 mt-1">
                    비례율 {s.proportionRatio}%
                  </div>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-slate-400">분담금 변동: </span>
                  <span className={s.contributionDiff > 0 ? "font-bold text-rose-400" : s.contributionDiff < 0 ? "font-bold text-emerald-400" : "font-bold text-slate-300"}>
                    {s.contributionDiff > 0 ? `+${fmtWon(s.contributionDiff)}` : s.contributionDiff < 0 ? `-${fmtWon(Math.abs(s.contributionDiff))}` : "기준선"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* [F] PRO 전용 애널리스트 정비사업 총평 리포트 */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>💡 수석 정비사업 전문 애널리스트 사업성 총평</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  🔒 PRO 전용 열람
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            <div className="bg-slate-900/90 border border-purple-500/30 rounded-2xl p-5 space-y-2 text-xs">
              <div className="text-slate-200 leading-relaxed flex items-start gap-2">
                <span className="text-purple-400 font-bold shrink-0 mt-0.5">▸</span>
                <span>{apt.name} (준공 {builtYear}년)의 현재 정비사업 단계: [{result.stageStatus}]에 위치합니다.</span>
              </div>
              {result.analysisBriefing.map((comment, idx) => (
                <div key={idx} className="text-slate-200 leading-relaxed flex items-start gap-2">
                  <span className="text-purple-400 font-bold shrink-0 mt-0.5">▸</span>
                  <span>{comment}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 잠금 해제 인터랙션 */}
          {!unlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/60 backdrop-blur-[2px] rounded-2xl p-4">
              <div className="text-center max-w-sm">
                <div className="text-base font-extrabold text-white mb-1">
                  ⚡ 정비사업 분담금 및 비례율 리포트 전체 무료 열람
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  오픈 베타 기간 동안 평형별 예상 분담금 견적과 공사비 민감도 시뮬레이션을 무료로 확인하세요.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-indigo-500 font-black text-xs text-white shadow-lg shadow-purple-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  정비사업 시뮬레이션 전체 열람하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* [G] 고지사항 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 정비사업 시뮬레이션 산출 안내</div>
          <p>
            • 본 시뮬레이션은 국토교통부 실거래 지적 정보 및 도시 및 주거환경정비법 표준 정비사업 관리처분 모델에 기반하여 산출되었습니다.
          </p>
          <p>
            • 실제 분담금은 총회 관리처분인가 의결 시점의 최종 도급 공사비, 일반분양 경쟁률 및 종전자산 감정평가 결과에 따라 달라질 수 있습니다.
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

export default RedevelopmentSimProReportModal;
