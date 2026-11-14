"use client";

import React, { useState, useMemo } from "react";
import { calcLocationComprehensiveScore, LocationScoreResult } from "@/lib/locationScoreCalc";

interface Props {
  apt: {
    id: string;
    name: string;
    traffic_score?: number;
    school_score?: number;
    nature_score?: number;
    convenience_score?: number;
    hangang_dist?: any;
    is_hangang_view?: boolean;
    station?: string;
  };
  infraData?: any;
  onClose?: () => void;
  isInline?: boolean;
}

export function LocationScoreProReportModal({
  apt,
  infraData,
  onClose,
  isInline = false,
}: Props) {
  const [unlocked, setUnlocked] = useState(false);

  const result: LocationScoreResult = useMemo(() => {
    return calcLocationComprehensiveScore(apt, infraData);
  }, [apt, infraData]);

  // 등급 뱃지 스타일
  const getGradeStyle = (grade: LocationScoreResult["locationGrade"]) => {
    if (grade.includes("S+")) return "bg-amber-500/20 text-amber-300 border-amber-500/40";
    if (grade.includes("S급")) return "bg-blue-500/20 text-blue-300 border-blue-500/40";
    if (grade.includes("A급")) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
    return "bg-slate-700 text-slate-300 border-slate-600";
  };

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-3xl w-full mx-auto relative">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 헤더 섹션 */}
      <div className="p-6 sm:p-8 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2">
            <span className="inline-block text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm whitespace-nowrap">
              PRO REPORT #01
            </span>
            <div className="text-xs text-slate-400 font-medium mt-1.5 break-keep">
              5대 핵심 입지 가중치 정밀 평가 모델
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight break-keep">
            {apt.name} 입지 종합 점수표 & 산출 근거
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            교통(30%) · 학군(25%) · 상권(20%) · 쾌적성(15%) · 미래호재(10%) 100% 실측 정량화
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
        {/* 1. 종합 등급 배너 */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900/80 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span className="text-lg font-black tracking-tight">
                입지 종합 평가: {result.locationGrade}
              </span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${getGradeStyle(result.locationGrade)}`}>
                종합 {result.totalScore}점
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              실존 인프라 거리(m)와 도보 시간을 5대 지표 가중치로 합산한 객관적 입지 성적표입니다.
            </p>
          </div>

          <div className="bg-black/40 px-5 py-3 rounded-xl border border-white/5 text-right self-stretch sm:self-auto min-w-[130px]">
            <div className="text-[11px] text-slate-400">입지 총점</div>
            <div className="text-3xl font-black text-blue-400 mt-0.5">
              {result.totalScore}<span className="text-sm font-normal text-slate-400"> / 100</span>
            </div>
          </div>
        </div>

        {/* 2. 항목별 점수 및 산출 근거 테이블 */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            5대 입지 항목별 가중치 및 실측 산출 근거
          </h4>

          <div className="space-y-2.5">
            {result.categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white text-sm">{cat.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-blue-500/20">
                      가중치 {cat.weight}%
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed flex items-start gap-1.5 mt-0.5">
                    <span className="text-slate-500 font-bold shrink-0">•</span>
                    <span className="text-slate-200 font-medium break-keep">{cat.evidence}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-slate-400">반영 점수</div>
                    <div className="font-extrabold text-blue-300">
                      +{cat.weightedScore}점
                    </div>
                  </div>
                  <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-white/5 text-right min-w-[64px]">
                    <div className="text-[10px] text-slate-400">원점수</div>
                    <div className="text-sm font-black text-white">{cat.score}점</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. PRO 상세 브리핑 (블러 / 잠금해제 UX) */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>AI 종합 입지 총평 & 경쟁 단지 비교 브리핑</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  🔒 PRO 전용
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            <div className="bg-slate-900/80 border border-blue-500/30 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-extrabold text-blue-400 flex items-center gap-1.5">
                <span>💡</span>
                <span>AI 입지 정량화 총평 리포트</span>
              </div>
              {result.aiComprehensiveVerdict.map((comment, idx) => (
                <div key={idx} className="text-slate-300 leading-relaxed flex items-start gap-1.5">
                  <span className="text-blue-500">•</span>
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
                  📊 AI 입지 종합 총평 무료 열람
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  오픈 베타 기간 동안 5대 핵심 입지 지표의 가중치별 산출 수식과 AI 총평을 무료로 확인하세요.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-black text-xs text-white shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  ⚡ 입지 점수표 상세 리포트 무료 열람
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. 고지사항 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 데이터 산출 안내</div>
          <p>
            • 본 입지 점수표는 카카오 로컬 공식 인프라 데이터 및 국토교통부 지적 정보를 바탕으로 실시간 자동 계산되었습니다.
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
export default LocationScoreProReportModal;

