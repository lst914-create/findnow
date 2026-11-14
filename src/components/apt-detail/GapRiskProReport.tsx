"use client";

import React, { useState, useMemo } from "react";
import { calcGapInvestmentRisk, GapRiskResult } from "@/lib/gapRiskCalc";
import { fmtWon } from "@/lib/fairValueCalc";

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
      case "안전":
        return {
          bg: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
          icon: "🛡️",
          title: "역전세 철벽 방어구역",
          desc: "전세가율이 안정권(65% 미만)에 있어 매매가 조정 시에도 보증금 미반환 우려가 극히 낮습니다.",
        };
      case "주의":
        return {
          bg: "bg-amber-500/20 text-amber-400 border-amber-500/40",
          icon: "⚠️",
          title: "일반 갭투자 주의구역",
          desc: "전세가율 65%~80% 구간입니다. 소액 투자는 유리하나 향후 금리 및 입주 물량에 따른 전세가 조정을 고려해야 합니다.",
        };
      case "위험":
        return {
          bg: "bg-rose-500/20 text-rose-400 border-rose-500/40",
          icon: "🚨",
          title: "깡통전세 고위험구역",
          desc: "전세가율 80% 초과 구간입니다. 매매가 소폭 하락 시 역전세 및 HUG 보증보험 가입 거절 우려가 있습니다.",
        };
      default:
        return {
          bg: "bg-slate-700 text-slate-300 border-slate-600",
          icon: "⚪",
          title: "실거래 데이터 분석 보류",
          desc: "최근 신고된 매매 또는 전세 실거래 건수가 부족하여 위험도 판정이 보류되었습니다.",
        };
    }
  };

  const gradeStyle = getGradeStyle(result.grade);

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-3xl w-full mx-auto relative">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 헤더 섹션 */}
      <div className="p-6 sm:p-8 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2">
            <span className="inline-block text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm whitespace-nowrap">
              PRO REPORT #06
            </span>
            <div className="text-xs text-slate-400 font-medium mt-1.5 break-keep">
              전세가율 & 갭투자 리스크 진단
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight break-keep">
            {apt.name} 갭투자 및 역전세 방어력 진단
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            실거래 전세가율, HUG 전세보증금 반환보증 안전 마지노선, 하락장 스트레스 테스트
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
        {/* 1. 종합 진단 배너 */}
        <div className={`p-5 rounded-2xl border ${gradeStyle.bg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{gradeStyle.icon}</span>
              <span className="text-lg font-black tracking-tight">
                {gradeStyle.title} ({result.grade})
              </span>
              {result.jeonseRatio && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-black/40">
                  전세가율 {result.jeonseRatio}%
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {gradeStyle.desc}
            </p>
          </div>

          <div className="bg-black/30 px-4 py-3 rounded-xl border border-white/5 text-right self-stretch sm:self-auto min-w-[130px]">
            <div className="text-[11px] text-slate-400">역전세 방어 점수</div>
            <div className="text-2xl font-black text-white mt-0.5">
              {result.defenseScore}<span className="text-sm font-normal text-slate-400"> / 100점</span>
            </div>
          </div>
        </div>

        {/* 2. 갭투자 핵심 3단 지표 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 순수 갭투자금 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">매매 - 전세</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  순수 갭
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">순수 갭투자 금액</h4>
              <div className="text-xl font-black text-blue-400 mt-2">
                {result.pureGap !== null ? fmtWon(result.pureGap) : "확인불가"}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed">
              매매 {result.currentPrice ? fmtWon(result.currentPrice) : "-"} / 전세 {result.currentRent ? fmtWon(result.currentRent) : "-"}
            </p>
          </div>

          {/* 취득세 포함 실투자 필요금 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">취득세 등 부대비용 포함</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                  실투자액
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">총 필요 자금 (추정)</h4>
              <div className="text-xl font-black text-amber-400 mt-2">
                {result.totalInvestmentNeeded !== null ? fmtWon(result.totalInvestmentNeeded) : "확인불가"}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed">
              취득세·등기비용 약 1.5% 부대비용 가산
            </p>
          </div>

          {/* HUG 보증보험 안전 한도 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">매매가의 90% 한도</span>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                  result.isHugGuaranteed
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-rose-500/20 text-rose-300"
                }`}>
                  {result.isHugGuaranteed ? "보증안심 가입가능" : "보증가입 주의"}
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">HUG 보증한도 상한선</h4>
              <div className="text-xl font-black text-emerald-400 mt-2">
                {result.hugSafetyLimit !== null ? fmtWon(result.hugSafetyLimit) : "-"}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed">
              {result.isHugGuaranteed
                ? "현재 전세가가 HUG 보증 기준선 이하로 안전합니다."
                : "전세가가 보증 한도에 근접하여 역전세 위험이 있습니다."}
            </p>
          </div>
        </div>

        {/* 3. 하락장 스트레스 테스트 & AI 분석 (PRO 티저 잠금해제) */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>하락장 스트레스 테스트 & AI 리스크 진단</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  🔒 PRO 전용
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            {/* 시나리오 분석 바 */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 font-semibold">시세 10% 하락 시 집주인 반환 준비금 (스트레스 테스트)</span>
              <span className="font-extrabold text-rose-400 bg-slate-800/80 px-2.5 py-1 rounded">
                약 {result.stressTest10PercentDrop.toLocaleString()}만원 추가 현금 필요
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 font-semibold">전세가율 위험 밴드 분석</span>
              <span className="font-extrabold text-white bg-slate-800/80 px-2.5 py-1 rounded">
                현재 {result.jeonseRatio}% (주의선 65% ~ 위험선 80%)
              </span>
            </div>

            {/* AI 코멘터리 박스 */}
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-extrabold text-amber-400 flex items-center gap-1.5">
                <span>💡</span>
                <span>AI 갭투자 및 역전세 방어력 브리핑</span>
              </div>
              {result.analysisComments.map((comment, idx) => (
                <div key={idx} className="text-slate-300 leading-relaxed flex items-start gap-1.5">
                  <span className="text-amber-500">•</span>
                  <span>{comment}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 잠금 해제 오버레이 버튼 */}
          {!unlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] rounded-2xl p-4">
              <div className="text-center max-w-sm">
                <div className="text-base font-extrabold text-white mb-1">
                  🛡️ 하락장 스트레스 테스트 상세 결과
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  오픈 베타 기간 동안 시세 하락 시 보증금 반환 준비금과 정밀 리스크 브리핑을 무료로 열람하실 수 있습니다.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 font-black text-xs text-white shadow-lg shadow-amber-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  ⚡ 리스크 상세 리포트 무료 열람
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. 주의사항 및 고지 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 갭투자 리스크 진단 안내</div>
          <p>
            • 본 분석은 국토교통부 실거래가 공개시스템의 최근 매매·전세 신고 데이터를 기반으로 산출되었습니다.
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="my-auto w-full max-w-3xl animate-in fade-in zoom-in-95 duration-200">
        {content}
      </div>
    </div>
  );
}
export default GapRiskProReportModal;

