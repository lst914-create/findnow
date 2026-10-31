"use client";

import React, { useState } from "react";
import { REPORT_SECTIONS } from "@/types/report";

interface Props {
  aptId: string;
  aptName: string;
}

export function ProReportPreviewSection({ aptId, aptName }: Props) {
  const [downloading, setDownloading] = useState(false);

  const handleOpenReport = async (tier: "free" | "pro") => {
    setDownloading(true);
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aptId, tier }),
      });
      const data = await res.json();
      if (data.report) {
        alert(
          `[${data.report.title}]\n\n보고서 생성 완료 (총 ${data.report.sections.length}개 항목)\n현재 오픈 베타 기간으로 전체 리포트를 무료로 열람하실 수 있습니다.`
        );
      }
    } catch {
      alert("리포트 생성 중 오류가 발생했습니다.");
    } finally {
      setDownloading(false);
    }
  };

  return (
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
              실거래가 괴리율, 재정비 사업성, 인근 공급 충격도, 명문 학군 배정률까지 AI 종합 분석 결과를 한눈에 확인하세요.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              disabled={downloading}
              onClick={() => handleOpenReport("free")}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/15"
            >
              기본 요약본
            </button>
            <button
              type="button"
              disabled={downloading}
              onClick={() => handleOpenReport("pro")}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-extrabold text-xs text-white shadow-lg shadow-blue-500/25 transition-all transform active:scale-95"
            >
              {downloading ? "리포트 생성 중..." : "⚡ PRO 리포트 무료 열람"}
            </button>
          </div>
        </div>

        {/* Section Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {REPORT_SECTIONS.map((sec, idx) => (
            <div
              key={sec.id}
              className={`p-4 rounded-2xl border transition-all ${
                !sec.isPreview
                  ? "bg-slate-800/60 border-slate-700/60 hover:border-slate-600"
                  : "bg-slate-800/90 border-slate-700 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-400">0{idx + 1}</span>
                {!sec.isPreview ? (
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    🔒 PRO
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                    FREE
                  </span>
                )}
              </div>
              <h4 className="font-bold text-sm text-white">{sec.title}</h4>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {sec.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default ProReportPreviewSection;
