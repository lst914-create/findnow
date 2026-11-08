"use client";

import React, { useState } from "react";
import { REPORT_SECTIONS } from "@/types/report";
import FairValueProReportModal from "./FairValueProReport";
import HoldingTaxProReportModal from "./HoldingTaxProReport";
import GapRiskProReportModal from "./GapRiskProReport";
import SchoolDistrictProReportModal from "./SchoolDistrictProReport";

interface Props {
  aptId: string;
  aptName: string;
  apt?: any;
  infraSchools?: any[];
}

export function ProReportPreviewSection({ aptId, aptName, apt, infraSchools }: Props) {
  const [downloading, setDownloading] = useState(false);
  const [activeModalSection, setActiveModalSection] = useState<string | null>(null);

  const handleOpenReport = (tier: "free" | "pro") => {
    // 기본 열람 시 08번 AI 적정 가치 평가 모델 모달 오픈
    setActiveModalSection("fair_value_model");
  };

  const handleCardClick = (secId: string) => {
    if (secId === "school_district_detail") {
      setActiveModalSection("school_district_detail");
    } else if (secId === "gap_investment_risk") {
      setActiveModalSection("gap_investment_risk");
    } else if (secId === "holding_tax_calculator") {
      setActiveModalSection("holding_tax_calculator");
    } else if (secId === "fair_value_model") {
      setActiveModalSection("fair_value_model");
    } else {
      setActiveModalSection("fair_value_model");
    }
  };

  return (
    <>
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-slate-800">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-sm">
                  AI PRO REPORT
                </span>
                <span className="text-xs text-slate-400">데이터 기반 심층 정밀 리포트</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white mt-2">
                {aptName} 심층 가치평가 분석 리포트
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                실거래가 괴리율, 재정비 사업성, 인근 공급 충격도, 명문 학군 배정률 및 적정 매수가 판정까지 AI 종합 분석 결과를 확인하세요.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={downloading}
                onClick={() => handleOpenReport("free")}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/15 cursor-pointer"
              >
                기본 요약본
              </button>
              <button
                type="button"
                disabled={downloading}
                onClick={() => handleOpenReport("pro")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-extrabold text-xs text-white shadow-lg shadow-blue-500/25 transition-all transform active:scale-95 cursor-pointer"
              >
                ⚡ PRO 리포트 무료 열람
              </button>
            </div>
          </div>

          {/* Section Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {REPORT_SECTIONS.map((sec, idx) => {
              const isTarget08 = sec.id === "fair_value_model";
              const isTarget07 = sec.id === "holding_tax_calculator";
              const isTarget06 = sec.id === "gap_investment_risk";
              const isTarget05 = sec.id === "school_district_detail";

              return (
                <div
                  key={sec.id}
                  onClick={() => handleCardClick(sec.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isTarget05
                      ? "bg-gradient-to-b from-teal-950/40 to-slate-800/90 border-teal-500/50 hover:border-teal-400 shadow-md ring-1 ring-teal-500/20"
                      : isTarget06
                      ? "bg-gradient-to-b from-amber-950/40 to-slate-800/90 border-amber-500/50 hover:border-amber-400 shadow-md ring-1 ring-amber-500/20"
                      : isTarget07
                      ? "bg-gradient-to-b from-emerald-950/40 to-slate-800/90 border-emerald-500/50 hover:border-emerald-400 shadow-md ring-1 ring-emerald-500/20"
                      : isTarget08
                      ? "bg-gradient-to-b from-blue-900/30 to-slate-800/80 border-blue-500/50 hover:border-blue-400 shadow-md ring-1 ring-blue-500/20"
                      : !sec.isPreview
                      ? "bg-slate-800/60 border-slate-700/60 hover:border-slate-500"
                      : "bg-slate-800/90 border-slate-700 hover:border-slate-500"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-slate-400">0{idx + 1}</span>
                    {isTarget05 ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-teal-500 text-white shadow-sm">
                        학군 상세
                      </span>
                    ) : isTarget06 ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white shadow-sm">
                        리스크 진단
                      </span>
                    ) : isTarget07 ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-sm">
                        AI 시뮬
                      </span>
                    ) : isTarget08 ? (
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-500 text-white shadow-sm animate-pulse">
                        HOT PRO
                      </span>
                    ) : !sec.isPreview ? (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        🔒 PRO
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                        FREE
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-white flex items-center justify-between">
                    <span>{sec.title}</span>
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {sec.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 08번 모달 팝업 */}
      {activeModalSection === "fair_value_model" && (
        <FairValueProReportModal
          apt={apt || { id: aptId, name: aptName }}
          onClose={() => setActiveModalSection(null)}
        />
      )}

      {/* 07번 모달 팝업 */}
      {activeModalSection === "holding_tax_calculator" && (
        <HoldingTaxProReportModal
          apt={apt || { id: aptId, name: aptName }}
          onClose={() => setActiveModalSection(null)}
        />
      )}

      {/* 06번 모달 팝업 */}
      {activeModalSection === "gap_investment_risk" && (
        <GapRiskProReportModal
          apt={apt || { id: aptId, name: aptName }}
          onClose={() => setActiveModalSection(null)}
        />
      )}

      {/* 05번 모달 팝업 */}
      {activeModalSection === "school_district_detail" && (
        <SchoolDistrictProReportModal
          apt={apt || { id: aptId, name: aptName }}
          infraSchools={infraSchools}
          onClose={() => setActiveModalSection(null)}
        />
      )}
    </>
  );
}
export default ProReportPreviewSection;
