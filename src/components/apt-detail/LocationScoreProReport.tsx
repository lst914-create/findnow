"use client";

import React, { useState, useMemo } from "react";
import {
  calcLocationComprehensiveScore,
  LocationScoreResult,
} from "@/lib/locationScoreCalc";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface Props {
  apt: {
    id: string;
    name: string;
    region?: string;
    district?: string;
    lat?: number;
    lng?: number;
    traffic_score?: number;
    school_score?: number;
    nature_score?: number;
    convenience_score?: number;
    hangang_dist?: any;
    is_hangang_view?: boolean;
    station?: string;
    avgPrice?: number;
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
    if (grade.includes("S+")) return "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10";
    if (grade.includes("S급")) return "bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-blue-500/10";
    if (grade.includes("A급")) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10";
    return "bg-slate-700 text-slate-300 border-slate-600";
  };

  // Radar 차트용 데이터
  const radarData = useMemo(() => {
    return result.categories.map((c) => ({
      subject: c.name.replace(" 인프라", "").replace(" 및 교육", "").replace(" 및 생활편의", "").replace(" 및 쾌적성", "").replace(" 및 호재", ""),
      score: c.score,
      benchmark: 82, // 생활권 평균 기준선
      fullMark: 100,
    }));
  }, [result]);

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-4xl w-full mx-auto relative max-h-[90vh] flex flex-col break-keep">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. 헤더 섹션 (고정) */}
      <div className="p-6 sm:p-7 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4 shrink-0 bg-slate-950/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm whitespace-nowrap">
              PRO REPORT #01
            </span>
            <span className="text-[11px] text-blue-400 font-bold bg-blue-950/60 border border-blue-500/30 px-2 py-0.5 rounded-full whitespace-nowrap">
              기관 투자용 입지 정밀 평가 모델
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight break-keep">
            {apt.name} 입지 종합 점수표 & 심층 밸류에이션
          </h2>
          <p className="text-xs text-slate-400 mt-1 break-keep">
            교통(30%) · 학군(25%) · 상권(20%) · 쾌적성(15%) · 미래호재(10%) 5대 축 실측 분석
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
        {/* [A] 종합 등급 및 듀얼 인덱스 배너 */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900/80 border border-blue-500/30 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-2xl">🏆</span>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                입지 종합 평가: {result.locationGrade}
              </span>
              <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-sm ${getGradeStyle(result.locationGrade)}`}>
                종합 {result.totalScore}점
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl break-keep">
              실측 인프라 거리(m)와 3대 업무지구 통근 시간, 관할 학군 명문도 및 대형 병원 접근성을 정량화한 공인 입지 성적표입니다.
            </p>
          </div>

          {/* 우측 3개 핵심 메트릭 카드 */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="bg-slate-900/80 px-3.5 py-3 rounded-xl border border-blue-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">입지 총점</div>
              <div className="text-2xl font-black text-blue-400 mt-0.5">
                {result.totalScore}<span className="text-xs font-normal text-slate-400">/100</span>
              </div>
            </div>
            <div className="bg-slate-900/80 px-3.5 py-3 rounded-xl border border-emerald-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">실거주 만족</div>
              <div className="text-2xl font-black text-emerald-400 mt-0.5">
                {result.residentSatisfactionScore}<span className="text-xs font-normal text-slate-400">점</span>
              </div>
            </div>
            <div className="bg-slate-900/80 px-3.5 py-3 rounded-xl border border-indigo-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">역전세 방어</div>
              <div className="text-2xl font-black text-indigo-400 mt-0.5">
                {result.rentalDefenseScore}<span className="text-xs font-normal text-slate-400">점</span>
              </div>
            </div>
          </div>
        </div>

        {/* [B] 5대 축 방사형 레이더 차트 + 항목별 가중치 테이블 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          {/* 좌측: 레이더 차트 (5컬럼) */}
          <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between text-xs mb-1 px-2">
              <span className="font-bold text-slate-300">📊 5대 핵심 입지 밸런스</span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-blue-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500 whitespace-nowrap" /> 해당 단지
                </span>
                <span className="flex items-center gap-1 text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-slate-500 whitespace-nowrap" /> 생활권 평균
                </span>
              </div>
            </div>
            <div className="w-full h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 700 }}
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" tick={false} />
                  <Radar
                    name={apt.name}
                    dataKey="score"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.4}
                  />
                  <Radar
                    name="생활권 평균"
                    dataKey="benchmark"
                    stroke="#64748b"
                    fill="#64748b"
                    fillOpacity={0.15}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="text-[11px] text-slate-400 text-center mt-1">
              {result.categories[0].name} ({result.categories[0].score}점) 및 {result.categories[1].name} ({result.categories[1].score}점) 최상급
            </div>
          </div>

          {/* 우측: 5대 지표 세부 가중치 및 실측 근거 표 (7컬럼) */}
          <div className="lg:col-span-7 space-y-2">
            {result.categories.map((cat, idx) => (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
              >
                <div className="space-y-0.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{cat.name}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 border border-blue-500/20">
                      가중치 {cat.weight}%
                    </span>
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-400/20">
                      {cat.grade}등급
                    </span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-relaxed break-keep">
                    {cat.evidence}
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] text-slate-400">가중 반영</div>
                    <div className="font-bold text-blue-300">+{cat.weightedScore}점</div>
                  </div>
                  <div className="bg-slate-800/90 px-2.5 py-1 rounded-lg border border-white/5 text-right min-w-[54px]">
                    <div className="text-[10px] text-slate-400">원점수</div>
                    <div className="text-xs font-black text-white">{cat.score}점</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* [C] 3대 핵심 업무지구 (GBD · YBD · CBD) 직주근접 통근력 분석 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 break-keep">
              <span>🚇 3대 도심 업무지구 직주근접 통근 시간 (Door to Door)</span>
            </h4>
            <span className="text-[11px] text-slate-500 font-medium">대중교통 도보 및 환승 포함 환산</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {result.commuteAnalysis.map((commute, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-extrabold text-sm text-white">{commute.destination}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 whitespace-nowrap">
                      {commute.grade}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-blue-400">{commute.estMinutes}</span>
                    <span className="text-xs text-slate-400 font-medium">분 소요</span>
                    <span className="text-[11px] text-slate-500 ml-auto">직선 {commute.distanceKm}km</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-300 leading-snug">
                  {commute.routeSummary} ({commute.transferCount === 0 ? "환승 없음 직통" : `${commute.transferCount}회 환승`})
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* [D] 학군·명문 학원가 & 의료·생활 상권 2단 분석 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 1. 학군 및 학원가 분석 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>🎓 배정 학군 및 명문 학원가 인프라</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                {result.schoolAnalysis.elementary.isChoPumAh ? "초품아 인증" : "도보 통학권"}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <div className="text-[11px] text-slate-400 mb-0.5">배정 초등학교</div>
                <div className="font-bold text-white flex items-center justify-between">
                  <span>{result.schoolAnalysis.elementary.name}</span>
                  <span className="text-emerald-400 font-bold">도보 {result.schoolAnalysis.elementary.walkMinutes}분 ({result.schoolAnalysis.elementary.distanceMeters}m)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  • 통학 환경: {result.schoolAnalysis.elementary.safetyLevel}
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <div className="text-[11px] text-slate-400 mb-0.5">배후 명문 학원가</div>
                <div className="font-bold text-white flex items-center justify-between">
                  <span>{result.schoolAnalysis.academyHub.name}</span>
                  <span className="text-blue-400">{result.schoolAnalysis.academyHub.distanceSummary}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  • {result.schoolAnalysis.academyHub.scaleSummary}
                </div>
              </div>
            </div>
          </div>

          {/* 2. 의료 및 상권 슬세권 분석 */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>🏥 상급 의료기관 & 슬세권 유통 상권</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                골든타임 {result.medicalAnalysis.generalHospital.goldenTimeMinutes}분
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <div className="text-[11px] text-slate-400 mb-0.5">응급 의료기관 (상급 종합병원)</div>
                <div className="font-bold text-white flex items-center justify-between">
                  <span>{result.medicalAnalysis.generalHospital.name}</span>
                  <span className="text-indigo-400 font-bold">자차 {result.medicalAnalysis.generalHospital.goldenTimeMinutes}분 ({result.medicalAnalysis.generalHospital.distanceKm}km)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  • 24시간 응급의료센터 및 중증 질환 전문 대응권
                </div>
              </div>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                <div className="text-[11px] text-slate-400 mb-0.5">중심 쇼핑·유통 시설</div>
                <div className="font-bold text-white flex items-center justify-between">
                  <span>{result.medicalAnalysis.commercialHub.name}</span>
                  <span className="text-slate-300">{result.medicalAnalysis.commercialHub.type}</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  • 슬세권 점수 {result.medicalAnalysis.walkScore}점 (반경 1km 이내 원스톱 생활권)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* [E] 입지 SWOT 정밀 분석 (Strengths, Weaknesses, Opportunities, Threats) */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 break-keep">
            <span>⚖️ {apt.name} 입지 SWOT 정밀 투자 진단</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Strengths */}
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 space-y-2">
              <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
                <span>💪</span>
                <span>핵심 강점 (Strengths)</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                {result.swotAnalysis.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-500 shrink-0 font-bold">✓</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-slate-900/80 border border-rose-500/30 rounded-2xl p-4 space-y-2">
              <div className="font-extrabold text-rose-400 flex items-center gap-1.5">
                <span>⚠️</span>
                <span>주의 약점 (Weaknesses)</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                {result.swotAnalysis.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-500 shrink-0 font-bold">!</span>
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="bg-slate-900/80 border border-blue-500/30 rounded-2xl p-4 space-y-2">
              <div className="font-extrabold text-blue-400 flex items-center gap-1.5">
                <span>🚀</span>
                <span>미래 기회 (Opportunities)</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                {result.swotAnalysis.opportunities.map((o, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-blue-500 shrink-0 font-bold">▲</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-4 space-y-2">
              <div className="font-extrabold text-amber-400 flex items-center gap-1.5">
                <span>⚡</span>
                <span>위협 요인 (Threats)</span>
              </div>
              <ul className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                {result.swotAnalysis.threats.map((t, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-500 shrink-0 font-bold">▼</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* [F] PRO 전용 AI 종합 브리핑 리포트 */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5 break-keep">
              <span>💡 수석 애널리스트 입지 총평 & 최종 매수 가이드</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  🔒 PRO 전용 열람
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-5 space-y-2.5 text-xs">
              {result.aiComprehensiveVerdict.map((comment, idx) => (
                <div key={idx} className="text-slate-200 leading-relaxed flex items-start gap-2">
                  <span className="text-blue-400 font-bold shrink-0 mt-0.5">▸</span>
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
                  ⚡ PRO 심층 분석 리포트 전체 무료 열람
                </div>
                <p className="text-xs text-slate-300 mb-4 break-keep">
                  오픈 베타 기간 동안 5대 핵심 입지 지표 산출 근거와 수석 애널리스트 총평을 무료로 즉시 확인하실 수 있습니다.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 font-black text-xs text-white shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  입지 심층 리포트 전체 열람하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* [G] 공식 데이터 산출 및 고지사항 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 데이터 산출 기준 및 안내</div>
          <p>
            • 본 입지 종합 점수표는 카카오 로컬 공간 API, 국토교통부 실거래 지적 정보 및 나이스(NEIS) 학교 학군 통계를 결합하여 정량 산출되었습니다.
          </p>
          <p>
            • 통근 시간 및 거리는 도보 보행 속도와 대중교통 배차 간격을 반영한 표준 Door-to-Door 추정치입니다.
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

export default LocationScoreProReportModal;
