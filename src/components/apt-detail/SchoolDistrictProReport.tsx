"use client";

import React, { useState, useMemo } from "react";
import { calcSchoolDistrictDetails, SchoolDistrictResult } from "@/lib/schoolDistrictCalc";

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
    switch (grade) {
      case "S등급":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      case "A등급":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "B등급":
        return "bg-blue-500/20 text-blue-300 border-blue-500/40";
      default:
        return "bg-slate-700 text-slate-300 border-slate-600";
    }
  };

  const content = (
    <div className="bg-slate-950 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-3xl w-full mx-auto relative">
      {/* 배경 장식 발광체 */}
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* 헤더 섹션 */}
      <div className="p-6 sm:p-8 border-b border-slate-800/80 relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-block text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-sm whitespace-nowrap">
                PRO REPORT #05
              </span>
              {result.isChoPumAh && (
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 whitespace-nowrap">
                  🏫 초품아 단지
                </span>
              )}
            </div>
            <div className="text-xs text-slate-400 font-medium mt-1.5 break-keep">
              학군·학업성취도 & 진학 실적 리포트
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight break-keep">
            {apt.name} 학군 배정 및 학업성취도 분석
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            배정 초·중·고교 실거리 도보권, 학업성취도 평가 밴드, 특목고 진학력 및 배후 학원가
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
        {/* 1. 종합 학군 평점 배너 */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900/80 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              <span className="text-lg font-black tracking-tight">
                학군 평가: {result.districtGrade}
              </span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${getGradeBadge(result.districtGrade)}`}>
                종합 {result.districtScore}점
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              {result.isChoPumAh
                ? `초품아 단지로 초등 저학년 자녀의 안심 통학권이 확보되어 있으며, ${result.academyDistrictName} 접근이 용이합니다.`
                : `도보권 내 초·중등 교육시설이 고루 배치되어 있으며, 방과 후 ${result.academyDistrictName}와의 연계가 양호합니다.`}
            </p>
          </div>

          <div className="bg-black/40 px-4 py-3 rounded-xl border border-white/5 text-right self-stretch sm:self-auto min-w-[130px]">
            <div className="text-[11px] text-slate-400">인근 중심 학원가</div>
            <div className="text-sm font-extrabold text-blue-300 mt-0.5 line-clamp-1">
              {result.academyDistrictName.split(" ")[0]}
            </div>
          </div>
        </div>

        {/* 2. 통학권 학교 상세 리스트 */}
        <div className="space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            도보 통학권 배정 학교 실거리 명세
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {result.schoolList.map((sch, idx) => (
              <div
                key={idx}
                className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-extrabold px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
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
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{sch.tag || "배정권역"}</span>
                  {sch.achievementRate && (
                    <span className="font-extrabold text-blue-400">
                      성취도 {sch.achievementRate}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. PRO 상세 학군 브리핑 (블러 / 잠금해제 UX) */}
        <div className="relative">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <span>심층 진학률 및 학원가 인프라 브리핑</span>
              {!unlocked && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  🔒 PRO 전용
                </span>
              )}
            </h4>
          </div>

          <div className={`space-y-2.5 transition-all ${!unlocked ? "filter blur-sm pointer-events-none select-none opacity-60" : ""}`}>
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 font-semibold">특목고·자사고 진학력 지표</span>
              <span className="font-extrabold text-emerald-400 bg-slate-800/80 px-2.5 py-1 rounded">
                상위 {result.nearestMiddle?.specialHighSchoolRate || 5.2}% 진학 밴드
              </span>
            </div>

            <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-300 font-semibold">연계 핵심 학원가</span>
              <span className="font-extrabold text-white bg-slate-800/80 px-2.5 py-1 rounded">
                {result.academyDistrictName}
              </span>
            </div>

            {/* AI 브리핑 박스 */}
            <div className="bg-slate-900/80 border border-blue-500/30 rounded-xl p-4 space-y-2 text-xs">
              <div className="font-extrabold text-blue-400 flex items-center gap-1.5">
                <span>💡</span>
                <span>AI 학군 정밀 진단 코멘트</span>
              </div>
              {result.aiDistrictBriefing.map((comment, idx) => (
                <div key={idx} className="text-slate-300 leading-relaxed flex items-start gap-1.5">
                  <span className="text-blue-500">•</span>
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
                  🏫 학업성취도 및 진학 실적 상세 확인
                </div>
                <p className="text-xs text-slate-300 mb-4">
                  오픈 베타 기간 동안 특목고 진학률 밴드와 핵심 학원가 연계 리포트를 무료로 열람하실 수 있습니다.
                </p>
                <button
                  type="button"
                  onClick={() => setUnlocked(true)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 font-black text-xs text-white shadow-lg shadow-blue-500/30 transition-all transform active:scale-95 cursor-pointer"
                >
                  ⚡ 학군 상세 리포트 무료 열람
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 4. 고지사항 */}
        <div className="bg-slate-900/40 rounded-xl p-3.5 border border-slate-800/60 text-[11px] text-slate-400 space-y-1">
          <div className="font-bold text-slate-300 mb-1">📌 학군 데이터 안내</div>
          <p>
            • 학교 위치 및 도보 거리는 카카오 공식 인프라 API를 기준으로 실측 계산되었습니다.
          </p>
          <p>
            • 실제 배정 초등학교 및 중학군은 관할 교육지원청의 통학구역 조정에 따라 매년 일부 변동될 수 있습니다.
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
export default SchoolDistrictProReportModal;

