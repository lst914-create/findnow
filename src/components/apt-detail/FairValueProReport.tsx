"use client";

import React, { useState } from "react";
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
  };
  /** 모달 닫기 콜백 */
  onClose?: () => void;
  /** 인라인 임베드 모드 여부 */
  isInline?: boolean;
}

export function FairValueProReportModal({ apt, onClose, isInline = false }: Props) {
  const result: FairValueResult = calcFairValue(apt);
  const [unlocked, setUnlocked] = useState(false);

  // Verdict 뱃지 컬러 & 텍스트
  const getBadgeStyle = (verdict: FairValueResult["verdict"]) => {
    switch (verdict) {
      case "저평가":
        return {
          bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
          dot: "bg-emerald-400",
          icon: "🟢",
          desc: "내재가치 대비 저평가 구간으로 매수 검토가 유리한 영역입니다.",
        };
      case "적정":
        return {
          bg: "bg-blue-500/20 text-blue-400 border-blue-500/40",
          dot: "bg-blue-400",
          icon: "🟡",
          desc: "전세가 기반 내재가치와 실거래가가 균형을 이루고 있는 구간입니다.",
        };
      case "고평가":
        return {
          bg: "bg-rose-500/20 text-rose-400 border-rose-500/40",
          dot: "bg-rose-400",
          icon: "🔴",
          desc: "단기 호가 및 실거래가가 내재가치 상단을 초과해 신중한 접근이 필요합니다.",
        };
      default:
        return {
          bg: "bg-slate-700 text-slate-300 border-slate-600",
          dot: "bg-slate-400",
          icon: "⚪",
          desc: "실거래 또는 전세 데이터가 충분하지 않아 가치평가 산출이 보류되었습니다.",
        };
    }
  };

  const badge = getBadgeStyle(result.verdict);

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-3xl w-full mx-auto relative">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 헤더 섹션 */}
      <div className="p-6 sm:p-8 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm">
              PRO REPORT #08
            </span>
            <span className="text-xs text-slate-400 font-medium">AI 정량 가치평가 모델</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {apt.name} 적정 가치 및 매수가 판정
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            국토교통부 실거래 기반 전세가 내재가치 역산 및 3단 매수 밴드 산출
          </p>
        </div>

        {onClose && !isInline && (
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            aria-label="닫기"
          >
            ✕
          </button>
        )}
      </div>

      <div className="p-6 sm:p-8 space-y-6 relative z-10">
        {/* 1. 종합 판정 배너 */}
        <div className={`p-5 rounded-2xl border ${badge.bg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">{badge.icon}</span>
              <span className="text-lg font-black tracking-tight">
                현재 판정: {result.verdict}
              </span>
              {result.verdictRatio && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-black/30">
                  내재가치 대비 {result.verdictRatio}%
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {badge.desc}
            </p>
          </div>

          {result.currentPrice && (
            <div className="bg-black/30 px-4 py-2.5 rounded-xl border border-white/5 text-right self-stretch sm:self-auto">
              <div className="text-[11px] text-slate-400">현재 실거래 기준가</div>
              <div className="text-base font-black text-white">{fmtWon(result.currentPrice)}</div>
            </div>
          )}
        </div>

        {/* 2. 적정 매수가 3단 밴드 (게이지 / 시각화) */}
        {result.band && (
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                AI 산출 매수 적정가 밴드 (3단 구간)
              </h4>
              <span className="text-[11px] text-blue-400 font-bold">
                내재가치 {result.intrinsicValue ? fmtWon(result.intrinsicValue) : "-"}
              </span>
            </div>

            {/* 가격 게이지 3개 구간 바 */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3">
                <div className="text-[10px] font-bold text-emerald-400 mb-1">🟢 급매 / 적극 매수</div>
                <div className="text-sm sm:text-base font-extrabold text-white">
                  {fmtWon(result.band.bargainPrice)} 이하
                </div>
                <div className="text-[10px] text-slate-400 mt-1">내재가치 85% 구간</div>
              </div>

              <div className="bg-blue-950/40 border border-blue-500/30 rounded-xl p-3 ring-1 ring-blue-500/30">
                <div className="text-[10px] font-bold text-blue-400 mb-1">🟡 적정 매수가</div>
                <div className="text-sm sm:text-base font-extrabold text-white">
                  {fmtWon(result.band.fairPrice)}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">내재가치 기준선</div>
              </div>

              <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-3">
                <div className="text-[10px] font-bold text-rose-400 mb-1">🔴 고평가 / 관망</div>
                <div className="text-sm sm:text-base font-extrabold text-white">
                  {fmtWon(result.band.overvaluedThreshold)} 이상
                </div>
                <div className="text-[10px] text-slate-400 mt-1">내재가치 115% 초과</div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PRO 상세 산출 근거 (티저 + 잠금해제) */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>투명 산출 근거 및 변수 분석</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  🔒 PRO 전용
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            {result.calcSteps.map((step, idx) => (
              <div
                key={idx}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs"
              >
                <div className="text-slate-300 font-semibold">{step.label}</div>
                <div className="flex items-center gap-2">
                  {step.formula && (
                    <span className="text-[11px] text-slate-500 hidden sm:inline">
                      ({step.formula})
                    </span>
                  )}
                  <span className="font-extrabold text-white bg-slate-800/80 px-2 py-1 rounded">
                    {step.value}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* PRO 잠금 해제 오버레이 버튼 */}
          {!unlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] rounded-2xl p-4">
              <div className="text-center max-w-sm">
                <div className="text-base font-extrabold text-white mb-1">
                  💡 상세 산출 근거 즉시 무료 열람
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  베타 기간 동안 전세가율 역산 수식과 실시간 평당 단가 분석을 무료로 공개합니다.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-black text-xs text-white shadow-lg shadow-blue-500/30 transition-all transform active:scale-95"
                >
                  ⚡ 상세 산출 근거 무료 확인하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. 주의사항 및 고지 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 데이터 산출 안내 및 고지사항</div>
          {result.caveats.map((c, idx) => (
            <div key={idx} className="flex items-start gap-1.5">
              <span>•</span>
              <span>{c}</span>
            </div>
          ))}
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
export default FairValueProReportModal;
