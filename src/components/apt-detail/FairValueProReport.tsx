"use client";

import React, { useState, useMemo } from "react";
import { calcFairValue, fmtWon, FairValueResult } from "@/lib/fairValueCalc";

interface Props {
  apt: {
    id: string;
    name: string;
    price_min?: number | null;
    price_max?: number | null;
    rent_min?: number | null;
    rent_max?: number | null;
    jeonseRatio?: number | null;
    area_pyeong?: number | null;
    area_sqm?: number | null;
    region?: string;
    district?: string;
  };
  onClose?: () => void;
  isInline?: boolean;
}

export function FairValueProReportModal({ apt, onClose, isInline = false }: Props) {
  const result: FairValueResult = useMemo(() => calcFairValue(apt), [apt]);
  const [unlocked, setUnlocked] = useState(false);
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState<number>(1); // 현행 3.5% 기본

  // Verdict 배너 스타일
  const getVerdictStyle = (verdict: FairValueResult["verdict"]) => {
    if (verdict.includes("저평가")) {
      return {
        bg: "bg-emerald-950/50 border-emerald-500/40 text-emerald-400",
        badge: "bg-emerald-500 text-white",
        icon: "💎",
        desc: "실사용 가치(전세가) 및 권역 대장주 대비 저평가되어 있어 강력 매수 추천 구간입니다.",
      };
    }
    if (verdict.includes("고평가")) {
      return {
        bg: "bg-rose-950/50 border-rose-500/40 text-rose-400",
        badge: "bg-rose-500 text-white",
        icon: "⚠️",
        desc: "호가에 단기 프리미엄이 과도하게 반영되어 있어, 공격적 가격 네고 없이는 매수를 보류해야 합니다.",
      };
    }
    return {
      bg: "bg-blue-950/50 border-blue-500/40 text-blue-400",
      badge: "bg-blue-500 text-white",
      icon: "⚖️",
      desc: "내재가치와 시장 시세가 균형을 이루고 있어, 단지 내 로얄동·로얄층 위주 선별 접근이 유효합니다.",
    };
  };

  const style = getVerdictStyle(result.verdict);
  const currentScenario = result.interestScenarios[selectedScenarioIndex];

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-4xl w-full mx-auto relative font-sans">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 헤더 섹션: 증권사 리서치 리포트 헤더 포맷 */}
      <div className="p-6 sm:p-8 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm">
              EQUITY VALUATION PRO #08
            </span>
            <span className="text-xs text-slate-400 font-semibold">기관급 AI 가치평가 및 호가 협상 모델</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-blue-300 border border-blue-500/30">
              최종 검증 완료
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {apt.name} 적정 가치평가 & 실전 매수 호가 리포트
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            전세 내재가치 역산 모형, 권역 대장주 평당 갭 추적, 금리 민감도 시나리오 및 매수 협상 가격 가이드라인
          </p>
        </div>

        {onClose && !isInline && (
          <button
            onClick={onClose}
            className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
            aria-label="닫기"
          >
            ✕
          </button>
        )}
      </div>

      <div className="p-6 sm:p-8 space-y-7 relative z-10">
        {/* 1. 투자 매력도 총평 배너 */}
        <div className={`p-6 rounded-2xl border ${style.bg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5`}>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-2xl">{style.icon}</span>
              <span className="text-xl font-black tracking-tight">{result.verdict}</span>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${style.badge}`}>
                투자 매력도 {result.verdictScore}점
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-black/40 text-slate-300 border border-white/10">
                내재가치 괴리율 {result.bubbleRatio > 0 ? `+${result.bubbleRatio}% (거품)` : `${result.bubbleRatio}% (저평가)`}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              {style.desc}
            </p>
          </div>

          <div className="bg-black/50 px-5 py-3.5 rounded-2xl border border-white/10 text-right self-stretch sm:self-auto min-w-[170px] sm:min-w-[190px] shrink-0">
            <div className="text-[11px] text-slate-400 font-medium whitespace-nowrap">현재 기준 매매가</div>
            <div className="text-xl sm:text-2xl font-black text-white mt-0.5 whitespace-nowrap tracking-tight">
              {fmtWon(result.currentPrice)}
            </div>
            <div className="text-[10px] text-slate-500 mt-1 whitespace-nowrap">평당 {result.pyeongUnitPrice.toLocaleString()}만원</div>
          </div>
        </div>

        {/* 2. 3단 AI 가치평가 밴드 시각화 */}
        <div className="bg-slate-900/90 rounded-2xl p-5 sm:p-6 border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                AI 산출 3단 매수 가치 밴드 (Price Valuation Range)
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                전세가 역산 본질가치({fmtWon(result.intrinsicValue)}) 기준 급매·적정·상한선 산출
              </p>
            </div>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
              현재가 위치: {result.currentPrice <= result.bargainPrice ? "🟢 급매 바닥권" : result.currentPrice >= result.ceilingPrice ? "🔴 고평가 상한권" : "🟡 적정 밸류 구간"}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                  🟢 급매 / 적극 매수선
                </span>
                <div className="text-lg sm:text-xl font-black text-white mt-2 whitespace-nowrap">
                  {fmtWon(result.bargainPrice)} 이하
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800">
                내재가치 88% 수준. 매도인 급박 사정으로 출회되는 안전마진 확보 가격
              </p>
            </div>

            <div className="bg-blue-950/30 border border-blue-500/40 rounded-xl p-4 ring-1 ring-blue-500/30 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                  🟡 적정 가치 기준선
                </span>
                <div className="text-lg sm:text-xl font-black text-white mt-2 whitespace-nowrap">
                  {fmtWon(result.fairPrice)}
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800">
                전세 실수요 기반의 본질가치. 거품이 전혀 끼지 않은 표준 체결선
              </p>
            </div>

            <div className="bg-rose-950/30 border border-rose-500/30 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black px-2 py-0.5 rounded bg-rose-500/20 text-rose-400">
                  🔴 매수 보류 / 상한선
                </span>
                <div className="text-lg sm:text-xl font-black text-white mt-2 whitespace-nowrap">
                  {fmtWon(result.ceilingPrice)} 이상
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800">
                내재가치 112% 초과. 추가 상승 동력이 약화되어 추격 매수 금지 구간
              </p>
            </div>
          </div>
        </div>

        {/* 3. 권역 대장주(랜드마크) 1:1 평당 갭 비율 분석 */}
        <div className="bg-slate-900/70 rounded-2xl p-5 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>🏛️ 동일 생활권 대장주 1:1 갭 추적 (Peer Benchmark)</span>
            </h4>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
              result.landmark.gapStatus === "대장 대비 저평가"
                ? "bg-emerald-500/20 text-emerald-300"
                : result.landmark.gapStatus === "대장 대비 과열"
                ? "bg-rose-500/20 text-rose-300"
                : "bg-blue-500/20 text-blue-300"
            }`}>
              {result.landmark.gapStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex justify-between items-center text-slate-400">
                <span>권역 대표 랜드마크</span>
                <span className="font-black text-white text-sm">{result.landmark.name}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>대장주 평당 시세</span>
                <span className="font-extrabold text-blue-400">{result.landmark.avgPyeongPrice.toLocaleString()}만원/평</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 pt-2 border-t border-slate-800">
                <span>현재 본 단지 비율 vs 정상 갭</span>
                <span className="font-black text-white">
                  {result.landmark.ratioToTarget}% <span className="text-slate-500">(기준치: {result.landmark.normalGapRatio}%)</span>
                </span>
              </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 flex flex-col justify-center">
              <div className="text-[11px] font-bold text-slate-300 mb-1">💡 애널리스트 갭 분석 소견</div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {result.landmark.comment}
              </p>
            </div>
          </div>
        </div>

        {/* 4. 금리 변동 시나리오별 적정가치 민감도 분석 */}
        <div className="bg-slate-900/70 rounded-2xl p-5 border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                📈 금리 시나리오별 적정 매수가 민감도 분석
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                기준금리 변동에 따른 자산가치 수축/확장 범위 시뮬레이션
              </p>
            </div>

            <div className="flex gap-1.5">
              {result.interestScenarios.map((sc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedScenarioIndex(idx)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedScenarioIndex === idx
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {sc.rate}% 금리
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-white text-sm mb-1">{currentScenario.label}</div>
              <p className="text-slate-400 text-[11px]">{currentScenario.comment}</p>
            </div>
            <div className="text-right self-stretch sm:self-auto bg-black/40 px-3.5 py-2 rounded-lg border border-white/5">
              <div className="text-[10px] text-slate-500">시나리오 적정가</div>
              <div className="text-base font-black text-blue-300">
                {fmtWon(currentScenario.impliedFairPrice)}
                <span className={`text-xs ml-1 font-bold ${currentScenario.diffPercent >= 0 ? "text-rose-400" : "text-blue-400"}`}>
                  ({currentScenario.diffPercent >= 0 ? `+${currentScenario.diffPercent}%` : `${currentScenario.diffPercent}%`})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 5. 실전 매수 협상 가이드라인 (PRO 전용 액션 플랜 - 잠금해제 UX) */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>🎯 매수자 실전 협상 가이드라인 (Tactical Action Plan)</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  🔒 PRO 전용 전략
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-3 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-50" : ""}`}>
            {/* 가격 협상 기준선 3대 마지노선 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
                <div className="text-slate-400 text-[11px] font-medium">1차 목표 협상가 (도장 찍을 선)</div>
                <div className="text-lg font-black text-emerald-400 mt-1">
                  {fmtWon(result.negotiationGuide.targetBuyPrice)}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  호가 대비 약 -{fmtWon(result.negotiationGuide.discountFromCurrentAsk)} 절충 목표
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
                <div className="text-slate-400 text-[11px] font-medium">최대 수용 가능선 (한계선)</div>
                <div className="text-lg font-black text-blue-400 mt-1">
                  {fmtWon(result.negotiationGuide.maximumAcceptablePrice)}
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  내재가치 100% 한도. 이 가격 초과 시 매수 실익 감소
                </div>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl">
                <div className="text-slate-400 text-[11px] font-medium">협상 포기선 (Walk-Away Price)</div>
                <div className="text-lg font-black text-rose-400 mt-1">
                  {fmtWon(result.negotiationGuide.walkAwayPrice)} 이상
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  매도인 버티기 시 즉시 협상 종료 및 대체 단지 이동
                </div>
              </div>
            </div>

            {/* 실전 중개업소 협상 멘트 박스 */}
            <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-5 space-y-2.5 text-xs">
              <div className="font-extrabold text-blue-400 flex items-center gap-1.5 text-sm">
                <span>📋</span>
                <span>부동산 방문 시 현장 네고 전술 (실전 협상 멘트)</span>
              </div>
              {result.negotiationGuide.negotiationPoints.map((point, idx) => (
                <div key={idx} className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-slate-300 leading-relaxed flex items-start gap-2">
                  <span className="text-blue-500 font-bold">✔</span>
                  <span>{point}</span>
                </div>
              ))}
            </div>

            {/* 세부 산출 공식 테이블 */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-800/80 space-y-2 text-xs">
              <div className="font-bold text-slate-400 mb-2">투명 밸류에이션 수식 명세</div>
              {result.valuationBreakdown.map((row, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px] py-1 border-b border-slate-800/50 last:border-b-0">
                  <span className="text-slate-400">{row.label}</span>
                  <span className="text-slate-500 hidden sm:inline">({row.formula})</span>
                  <span className="font-bold text-white">{row.result}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 잠금 해제 버튼 */}
          {!unlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] rounded-2xl p-4">
              <div className="text-center max-w-sm">
                <div className="text-base font-extrabold text-white mb-1">
                  🎯 실전 협상 가이드라인 & 목표 매수가 무료 열람
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  오픈 베타 기간 동안 현장 네고 팁, 목표 매수가 및 산출 수식 전 과정을 무료로 공개합니다.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-black text-xs text-white shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  ⚡ 프로 협상 가이드 무료 열람
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 6. 리서치 리포트 면책 고지 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-500 space-y-1">
          <div className="font-bold text-slate-400 mb-1">📌 리포트 분석 원칙 및 고지사항</div>
          <p>
            • 본 가치평가 모델은 국토교통부 실거래가 원본 데이터와 금융기관 권역 벤치마크 모델을 기반으로 산출되었습니다.
          </p>
          <p>
            • 본 분석은 투자 의사결정을 보조하기 위한 참고용 자료이며, 최종 투자 및 계약의 책임은 본인에게 있습니다.
          </p>
        </div>
      </div>
    </div>
  );

  if (isInline) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="my-auto w-full max-w-4xl animate-in fade-in zoom-in-95 duration-200">
        {content}
      </div>
    </div>
  );
}
export default FairValueProReportModal;
