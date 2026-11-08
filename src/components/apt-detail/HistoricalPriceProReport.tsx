"use client";

import React, { useState, useMemo } from "react";
import { analyzeHistoricalTransactions, HistoricalPriceResult } from "@/lib/historicalPriceCalc";
import { fmtWon } from "@/lib/fairValueCalc";

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
          bg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
          icon: "🔥",
          desc: "역대 최고가를 경신하거나 95% 이상 회복하여 시세 분출 국면에 있습니다.",
        };
      case "전고점 회복세":
        return {
          bg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
          icon: "📈",
          desc: "전고점 대비 88~95% 수준까지 회복하여 완연한 우상향 곡선을 그리고 있습니다.",
        };
      case "박스권 횡보":
        return {
          bg: "bg-blue-500/20 text-blue-300 border-blue-500/40",
          icon: "⚖️",
          desc: "과거 고점 대비 75~88% 구간에서 매수·매도 공방이 이어지며 바닥을 다지는 중입니다.",
        };
      default:
        return {
          bg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
          icon: "📉",
          desc: "과거 최고가 대비 가격 조정폭이 커 저가 매수를 노리는 진입 타이밍일 수 있습니다.",
        };
    }
  };

  const trendStyle = getTrendStyle(result.trendVerdict);

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-3xl w-full mx-auto relative">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 헤더 섹션 */}
      <div className="p-6 sm:p-8 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-sm">
              PRO REPORT #02
            </span>
            <span className="text-xs text-slate-400 font-medium">국토교통부 20개년 실거래가 원본 분석</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              총 {result.totalTransactionsCount.toLocaleString()}건 분석
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {apt.name} 20년 실거래 전고점 및 회복률 분석
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            2006년 실거래가 의무 공개 이후 역대 최고가, 최저가, 전고점 대비 현 시세 갭 정밀 진단
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
        {/* 1. 종합 시세 국면 배너 */}
        <div className={`p-5 rounded-2xl border ${trendStyle.bg} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{trendStyle.icon}</span>
              <span className="text-lg font-black tracking-tight">
                현재 국면: {result.trendVerdict}
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-black/40">
                전고점의 {result.recoveryRateFromPeak}% 회복
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {trendStyle.desc}
            </p>
          </div>

          <div className="bg-black/40 px-4 py-3 rounded-xl border border-white/5 text-right self-stretch sm:self-auto min-w-[130px]">
            <div className="text-[11px] text-slate-400">전고점 대비 갭</div>
            <div className="text-xl font-black text-rose-400 mt-0.5">
              -{fmtWon(result.dropFromPeakManwon)}
            </div>
          </div>
        </div>

        {/* 2. 역대 실거래가 3단 지표 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* 역대 최고가 (전고점) */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">{result.allTimeHighDate}</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                  역대 최고가
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">전고점 실거래가</h4>
              <div className="text-xl font-black text-rose-400 mt-2">
                {fmtWon(result.allTimeHighPrice)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed">
              부동산 상승기 최고 체결 기준
            </p>
          </div>

          {/* 현재가 및 회복률 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">최근 실거래</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                  현재 기준가
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">현재 실거래 수준</h4>
              <div className="text-xl font-black text-emerald-400 mt-2">
                {fmtWon(result.currentPrice)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed">
              전고점 대비 {result.recoveryRateFromPeak}% 회복률
            </p>
          </div>

          {/* 역대 최저가 */}
          <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-slate-400 font-bold">{result.allTimeLowDate}</span>
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                  역대 최저가
                </span>
              </div>
              <h4 className="font-black text-sm text-slate-200">역대 최저 실거래가</h4>
              <div className="text-xl font-black text-blue-400 mt-2">
                {fmtWon(result.allTimeLowPrice)}
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800/80 leading-relaxed">
              초기 실거래 바닥선 대비 +{Math.round((result.currentPrice / (result.allTimeLowPrice || 1)) * 10) / 10}배
            </p>
          </div>
        </div>

        {/* 3. PRO 상세 브리핑 (블러 / 무료 열람 UX) */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>최근 1년 신고가/신저가 거래 패턴 및 AI 사이클 분석</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-400/30">
                  🔒 PRO 전용
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 font-semibold">최근 1개년 신고가 거래 비중</span>
              <span className="font-extrabold text-emerald-400 bg-slate-800/80 px-2.5 py-1 rounded">
                총 {result.newHighCountRecent1Y}건 기록 (상승 탄력 유지)
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 font-semibold">최근 1개년 급매/신저가 체결</span>
              <span className="font-extrabold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded">
                총 {result.newLowCountRecent1Y}건 기록 (하방 경직성 확보)
              </span>
            </div>

            {/* AI 브리핑 박스 */}
            <div className="bg-slate-900/80 border border-rose-500/30 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-extrabold text-rose-400 flex items-center gap-1.5">
                <span>💡</span>
                <span>AI 20년 가격 사이클 정밀 코멘트</span>
              </div>
              {result.aiHistoricalBriefing.map((comment, idx) => (
                <div key={idx} className="text-slate-300 leading-relaxed flex items-start gap-1.5">
                  <span className="text-rose-500">•</span>
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
                  📈 20년 거래 추세 및 전고점 갭 상세 확인
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  오픈 베타 기간 동안 역대 전고점 회복률과 연도별 가격 사이클 분석을 무료로 열람하실 수 있습니다.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 font-black text-xs text-white shadow-lg shadow-rose-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  ⚡ 실거래 전체 이력 리포트 무료 열람
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. 고지사항 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 데이터 출처 안내</div>
          <p>
            • 본 분석은 국토교통부 실거래가 공개시스템의 2006년 이후 누적 신고 데이터를 전수 집계하여 산출되었습니다.
          </p>
          <p>
            • 직거래 또는 취소 건은 정밀 필터링을 거쳐 정규 중개거래 위주로 집계되었습니다.
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
export default HistoricalPriceProReportModal;
