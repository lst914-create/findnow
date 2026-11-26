"use client";

import React, { useState, useMemo } from "react";
import {
  calcSchoolDistrictDetails,
  SchoolDistrictResult,
} from "@/lib/schoolDistrictCalc";

interface Props {
  apt: {
    id: string;
    name: string;
    region?: string;
    district?: string;
  };
  infraSchools?: Array<{
    name: string;
    type: string;
    distanceMeters: number;
    walkMinutes: number;
    isChoPumAh: boolean;
  }>;
  onClose?: () => void;
  isInline?: boolean;
}

export function SchoolDistrictProReportModal({
  apt,
  infraSchools,
  onClose,
  isInline = false,
}: Props) {
  const [unlocked, setUnlocked] = useState(false);

  const result: SchoolDistrictResult = useMemo(() => {
    return calcSchoolDistrictDetails(apt, infraSchools);
  }, [apt, infraSchools]);

  // 등급별 스타일
  const getGradeBadge = (grade: SchoolDistrictResult["districtGrade"]) => {
    if (grade.includes("S+")) return "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10";
    if (grade.includes("S급")) return "bg-blue-500/20 text-blue-300 border-blue-500/40 shadow-blue-500/10";
    if (grade.includes("A급")) return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10";
    return "bg-slate-700 text-slate-300 border-slate-600";
  };

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-4xl w-full mx-auto relative max-h-[90vh] flex flex-col">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 1. 헤더 섹션 (고정) */}
      <div className="p-6 sm:p-7 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4 shrink-0 bg-slate-950/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-block text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-sm whitespace-nowrap">
              PRO REPORT #05
            </span>
            {result.isChoPumAh ? (
              <span className="text-[11px] text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                🏫 초품아 인증 (단지 직통)
              </span>
            ) : (
              <span className="text-[11px] text-teal-400 font-bold bg-teal-950/60 border border-teal-500/30 px-2 py-0.5 rounded-full">
                안심 도보 통학권
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight break-keep">
            {apt.name} 학군 배정 및 학업성취도·진학 실적 리포트
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            배정 초·중·고교 실거리 도보권, 국가수준 학업성취도 밴드, 특목고 진학력 및 배후 명문 학원가 인프라
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
        {/* [A] 종합 학군 평가 및 3단 메트릭 배너 */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-teal-950/40 via-blue-950/30 to-slate-900/80 border border-teal-500/30 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-2xl">🎓</span>
              <span className="text-lg sm:text-xl font-black tracking-tight text-white">
                학군 평가: {result.districtGrade}
              </span>
              <span className={`text-xs font-black px-3 py-1 rounded-full border shadow-sm ${getGradeBadge(result.districtGrade)}`}>
                종합 {result.districtScore}점
              </span>
              <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                상위 {result.academicPercentile}% 밴드
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {result.isChoPumAh
                ? `초품아 단지로 초등 저학년 자녀의 안심 통학이 보장되며, ${result.academyHub.name} 접근성이 뛰어나 전세 수요가 매우 탄탄합니다.`
                : `도보권 내 초·중·고 교육시설이 안전하게 배치되어 있으며, ${result.academyHub.name}와의 연계 면학 분위기가 우수합니다.`}
            </p>
          </div>

          {/* 우측 3단 지표 카드 */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3 shrink-0">
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-teal-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">학군 총점</div>
              <div className="text-lg sm:text-xl font-black text-teal-400 mt-0.5">
                {result.districtScore}<span className="text-xs font-normal text-slate-400">/100</span>
              </div>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-emerald-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">안심 통학</div>
              <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">
                {result.safetyIndex}<span className="text-xs font-normal text-slate-400">점</span>
              </div>
            </div>
            <div className="bg-slate-900/90 px-3.5 py-3 rounded-xl border border-blue-500/20 text-center">
              <div className="text-[10px] text-slate-400 font-semibold">전세 지지력</div>
              <div className="text-lg sm:text-xl font-black text-blue-400 mt-0.5">
                {result.jeonseSupportScore}<span className="text-xs font-normal text-slate-400">점</span>
              </div>
            </div>
          </div>
        </div>

        {/* [B] 초·중·고 3단계 학군 파이프라인 카드 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>🏫 초·중·고 3단계 연계 학군 파이프라인</span>
            </h4>
            <span className="text-[11px] text-slate-500">카카오 로컬 인프라 실측 기준</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {result.schools.slice(0, 3).map((sch, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-extrabold px-2 py-0.5 rounded bg-slate-800 text-teal-300 text-[10px] border border-teal-500/20">
                      {sch.type}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold">
                      도보 {sch.walkMinutes}분 ({sch.distanceMeters}m)
                    </span>
                  </div>
                  <h5 className="font-black text-sm text-white flex items-center gap-1.5">
                    <span>{sch.name}</span>
                    {sch.isChoPumAh && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.2 rounded font-bold">
                        초품아
                      </span>
                    )}
                  </h5>
                  <div className="text-[11px] text-slate-300 font-medium mt-1">
                    {sch.rankingTier}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-800 text-[11px] text-slate-400 space-y-0.5">
                  <div>• 학급당 학생수: <strong className="text-slate-200">{sch.studentsPerClass}명</strong></div>
                  {sch.achievementRate && (
                    <div>• 성취도: <strong className="text-blue-400">{sch.achievementRate}%</strong> (특목고 {sch.specialHighRate}%)</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* [C] 배후 명문 학원가 인프라 상세 카드 */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <span>📚 배후 핵심 학원가 인프라 상세</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {result.academyHub.rankingText}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[11px] text-slate-400">학원가 명칭 및 규모</div>
              <div className="text-sm font-black text-white">{result.academyHub.name}</div>
              <div className="text-[11px] text-slate-300">• {result.academyHub.scaleSummary}</div>
            </div>

            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
              <div className="text-[11px] text-slate-400">단지에서의 이동 편의성</div>
              <div className="text-sm font-black text-teal-400">{result.academyHub.distanceSummary}</div>
              <div className="text-[11px] text-slate-300">• 대형 학원 셔틀버스 상시 노선 경유 및 도보/대중교통 접근권</div>
            </div>
          </div>
        </div>

        {/* [D] 학교별 상세 비교 테이블 */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span>📋 통학권 학교별 정밀 스펙 비교 테이블</span>
          </h4>

          <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-fixed">
                <colgroup>
                  <col className="w-[30%] sm:w-[28%]" />
                  <col className="w-[18%] sm:w-[18%]" />
                  <col className="w-[24%] sm:w-[24%]" />
                  <col className="w-[28%] sm:w-[30%]" />
                </colgroup>
                <thead>
                  <tr className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
                    <th className="py-2.5 px-3.5 font-bold">학교명 / 구분</th>
                    <th className="py-2.5 px-3 font-bold text-center">도보 거리</th>
                    <th className="py-2.5 px-3 font-bold text-center">성취도 / 특목고</th>
                    <th className="py-2.5 px-3.5 font-bold text-right">학군 특징</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {result.schools.map((sch, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3.5 font-bold text-white">
                        <span className="block truncate">{sch.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{sch.type} · {sch.establishment}</span>
                      </td>
                      <td className="py-3 px-3 text-center text-emerald-400 font-bold">
                        {sch.walkMinutes}분 ({sch.distanceMeters}m)
                      </td>
                      <td className="py-3 px-3 text-center">
                        {sch.achievementRate ? (
                          <>
                            <span className="font-extrabold text-blue-400 block">{sch.achievementRate}%</span>
                            <span className="text-[10px] text-slate-400">특목 {sch.specialHighRate}%</span>
                          </>
                        ) : (
                          <span className="text-slate-400 text-[11px]">초등 과정</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <span className="font-bold text-slate-200 block truncate">{sch.rankingTier}</span>
                        <span className="text-[10px] text-slate-400">{sch.note}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* [E] 학군 수요 기반 전세 하방 방어력 분석 */}
        <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-2.5 text-xs">
          <div className="font-extrabold text-emerald-400 flex items-center gap-1.5">
            <span>🛡️ 학군 수요 기반 전세가 하방 방어력 분석</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            우수 학군을 보유한 단지는 비수기에도 자녀 교육 목적의 전세 유입 수요가 상시 존재합니다.
            특히 **겨울방학(12~2월) 학군 배정 이사철**에는 전세 매물이 빠르게 소진되어 일반 주거지 대비 **역전세 방어율이 약 25~30% 우수**합니다.
          </p>
        </div>

        {/* [F] PRO 전용 수석 애널리스트 학군 총평 리포트 */}
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>💡 수석 교육·부동산 전문 애널리스트 학군 총평</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30">
                  🔒 PRO 전용 열람
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            <div className="bg-slate-900/90 border border-teal-500/30 rounded-2xl p-5 space-y-2 text-xs">
              {result.aiDistrictBriefing.map((comment, idx) => (
                <div key={idx} className="text-slate-200 leading-relaxed flex items-start gap-2">
                  <span className="text-teal-400 font-bold shrink-0 mt-0.5">▸</span>
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
                  ⚡ 학군 및 진학 실적 리포트 전체 무료 열람
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  오픈 베타 기간 동안 배정 학교별 학업성취도 통계와 학원가 연계 리포트를 무료로 확인하세요.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 via-blue-600 to-indigo-600 hover:from-teal-500 hover:to-blue-500 font-black text-xs text-white shadow-lg shadow-teal-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  학군 심층 리포트 전체 열람하기
                </button>
              </div>
            </div>
          )}
        </div>

        {/* [G] 고지사항 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 학군 데이터 출처 안내</div>
          <p>
            • 본 학교 위치 및 도보 거리는 카카오 공식 인프라 API 및 교육부 나이스(NEIS) 학교알리미 공시 데이터를 기준으로 집계되었습니다.
          </p>
          <p>
            • 실제 배정 초등학교 및 중학교 학군은 관할 교육지원청의 통학구역 고시에 따라 매년 조정될 수 있습니다.
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

export default SchoolDistrictProReportModal;
