"use client";

import React, { useState, useMemo } from "react";
import { simulateRedevelopment, RedevelopmentSimResult } from "@/lib/redevelopmentSimCalc";
import { fmtWon } from "@/lib/fairValueCalc";

interface Props {
  apt: {
    id: string;
    name: string;
    price_min?: number | null;
    price_max?: number | null;
    area_pyeong?: number | null;
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
  const [targetPyeong, setTargetPyeong] = useState<25 | 34 | 40>(34);
  const [constructionCost, setConstructionCost] = useState<number>(900); // 900만원
  const [unlocked, setUnlocked] = useState(false);

  const currentPyeong = Math.round(apt.area_pyeong || 25);

  const result: RedevelopmentSimResult = useMemo(() => {
    return simulateRedevelopment({
      currentAssetValueManwon: defaultAssetValue,
      currentPyeong,
      targetPyeong,
      constructionCostPerPyeong: constructionCost,
    });
  }, [defaultAssetValue, currentPyeong, targetPyeong, constructionCost]);

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-3xl w-full mx-auto relative">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 헤더 섹션 */}
      <div className="p-6 sm:p-8 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-sm">
              PRO REPORT #04
            </span>
            <span className="text-xs text-slate-400 font-medium">정비사업 분담금 & 비례율 AI 시뮬레이터</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/30">
              공사비 변동 연동
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {apt.name} 재건축·정비사업 분담금 시뮬레이션
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            신축 희망 평형별 예상 분담금(환급금), 공사비 시나리오별 비례율 및 권리가액 정밀 역산
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
        {/* 인터랙티브 조작 바 (신축 희망 평형 & 평당 공사비 선택) */}
        <div className="bg-slate-900/90 rounded-2xl p-4 sm:p-5 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* 희망 평형 */}
          <div className="space-y-1.5">
            <label className="text-slate-400 font-bold block">🏢 신축 분양 희망 평형</label>
            <div className="flex gap-1.5">
              {[
                { pyeong: 25, label: "전용 59㎡ (25평)" },
                { pyeong: 34, label: "전용 84㎡ (34평)" },
                { pyeong: 40, label: "전용 101㎡ (40평)" },
              ].map((item) => (
                <button
                  key={item.pyeong}
                  type="button"
                  onClick={() => setTargetPyeong(item.pyeong as 25 | 34 | 40)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                    targetPyeong === item.pyeong
                      ? "bg-purple-600 text-white shadow"
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
                { cost: 800, label: "800만원" },
                { cost: 900, label: "900만원 (표준)" },
                { cost: 1050, label: "1,050만원 (고급화)" },
              ].map((item) => (
                <button
                  key={item.cost}
                  type="button"
                  onClick={() => setConstructionCost(item.cost)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                    constructionCost === item.cost
                      ? "bg-indigo-600 text-white shadow"
                      : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 1. 최종 결과 하이라이트 배너 */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-900/80 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <span className="text-lg font-black tracking-tight">
                {result.contributionAmount > 0
                  ? `예상 추가 분담금: ${fmtWon(result.contributionAmount)}`
                  : `예상 환급금: ${fmtWon(Math.abs(result.contributionAmount))}`}
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                사업성 {result.feasibilityGrade}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              기존 전용 {currentPyeong}평 소유 기준, 신축 {targetPyeong}평 신청 시 추정 금액입니다.
            </p>
          </div>

          <div className="bg-black/40 px-4 py-3 rounded-xl border border-white/5 text-right self-stretch sm:self-auto min-w-[130px]">
            <div className="text-[11px] text-slate-400">추정 비례율</div>
            <div className="text-2xl font-black text-purple-300 mt-0.5">
              {result.estimatedProportionRatio}%
            </div>
          </div>
        </div>

        {/* 2. 핵심 3단 재건축 재무 지표 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 종전 감정평가액 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">기존 자산 가치</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  시가 80%
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">종전자산 감정평가액</h4>
              <div className="text-xl font-black text-blue-400 mt-2">
                {fmtWon(result.estimatedAppraisalValue)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed">
              현재 실거래가({fmtWon(defaultAssetValue)}) 기준 역산
            </p>
          </div>

          {/* 조합원 권리가액 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">감정가 × 비례율</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  권리가액
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">조합원 최종 권리가액</h4>
              <div className="text-xl font-black text-purple-400 mt-2">
                {fmtWon(result.estimatedRightValue)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed">
              비례율 {result.estimatedProportionRatio}% 적용
            </p>
          </div>

          {/* 조합원 분양가 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">신축 {targetPyeong}평 분양가</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  일반분양 85%
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">조합원 분양가</h4>
              <div className="text-xl font-black text-emerald-400 mt-2">
                {fmtWon(result.targetMemberSalePrice)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed">
              일반분양가 대비 약 15% 조합원 우대 분양가
            </p>
          </div>
        </div>

        {/* 3. PRO 상세 브리핑 (블러 / 무료 열람 UX) */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>AI 공사비 리스크 진단 & 사업성 리포트</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30">
                  🔒 PRO 전용
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 font-semibold">공사비 100만원 증액 시 세대당 추가 부담액</span>
              <span className="font-extrabold text-rose-400 bg-slate-800/80 px-2.5 py-1 rounded">
                약 +3,500만원 ~ 4,200만원 분담금 증가
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 font-semibold">적용 평당 일반분양가 기준선</span>
              <span className="font-extrabold text-white bg-slate-800/80 px-2.5 py-1 rounded">
                평당 3,800만원 (조합원 분양가 평당 3,230만원)
              </span>
            </div>

            {/* AI 브리핑 박스 */}
            <div className="bg-slate-900/80 border border-purple-500/30 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-extrabold text-purple-400 flex items-center gap-1.5">
                <span>💡</span>
                <span>AI 정비사업 분담금 정밀 코멘트</span>
              </div>
              {result.analysisBriefing.map((comment, idx) => (
                <div key={idx} className="text-slate-300 leading-relaxed flex items-start gap-1.5">
                  <span className="text-purple-500">•</span>
                  <span>{comment}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 잠금 해제 버튼 */}
          {!unlocked && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 backdrop-blur-[2px] rounded-2xl p-4">
              <div className="text-center max-w-sm">
                <div className="text-base font-extrabold text-white mb-1">
                  🏗️ 공사비 시나리오별 정밀 분담금 리포트
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  오픈 베타 기간 동안 평당 공사비 변동에 따른 비례율 민감도와 세부 수식을 무료로 열람하실 수 있습니다.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 font-black text-xs text-white shadow-lg shadow-purple-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  ⚡ 분담금 상세 시뮬레이션 무료 열람
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. 고지사항 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 정비사업 시뮬레이션 유의사항</div>
          <p>
            • 본 시뮬레이션은 단지 실거래가 및 표준 재건축 사업 모델을 기반으로 한 추정치입니다.
          </p>
          <p>
            • 실제 분담금은 관리처분계획인가 시점의 확정 공사비, 조합원 분양 신청 결과, 일반분양 경쟁률 등에 따라 확정됩니다.
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
export default RedevelopmentSimProReportModal;

