/**
 * P1: 데이터 출처 배지 컴포넌트
 *
 * 모든 데이터 표시 영역 하단에 출처·기준일·갱신일을 투명하게 공개합니다.
 * 클릭 시 상세 설명 툴팁/모달이 열립니다.
 */

"use client";

import { useState } from "react";
import type { DataSourceMeta, MultiSourceMeta, DataProvider } from "@/types/dataSource";
import { makeDataSourceMeta } from "@/types/dataSource";

// ── 신뢰 등급 스타일 ──────────────────────────────────────────
const TRUST_STYLE = {
  VERIFIED:   { dot: "bg-emerald-500", text: "text-emerald-700", label: "공공 검증" },
  DERIVED:    { dot: "bg-blue-400",    text: "text-blue-600",    label: "파생 계산" },
  ESTIMATED:  { dot: "bg-amber-400",   text: "text-amber-600",   label: "추정값" },
  UNVERIFIED: { dot: "bg-red-400",     text: "text-red-600",     label: "미검증" },
};

// ────────────────────────────────────────────────────────────────
// 단일 출처 배지
// ────────────────────────────────────────────────────────────────

interface DataSourceBadgeProps {
  meta?: DataSourceMeta;
  provider?: DataProvider;
  className?: string;
  /** 컴팩트 모드: 아이콘+출처명만 표시 */
  compact?: boolean;
}

export function DataSourceBadge({ meta, provider, className = "", compact = false }: DataSourceBadgeProps) {
  const [open, setOpen] = useState(false);
  const activeMeta = meta ?? (provider ? makeDataSourceMeta(provider) : null);
  if (!activeMeta) return null;

  const style = TRUST_STYLE[activeMeta.trustLevel];
  const refDate = activeMeta.referenceDate ? `기준일 ${activeMeta.referenceDate}` : "";
  const updDate = activeMeta.updatedAt
    ? `갱신 ${new Date(activeMeta.updatedAt).toLocaleDateString("ko-KR")}`
    : "";

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-slate-600 transition-colors group"
        title="데이터 출처 확인"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${style.dot} flex-shrink-0`} />
        <span className="font-medium">
          {compact ? activeMeta.provider : activeMeta.providerLabel}
        </span>
        {!compact && refDate && (
          <span className="text-slate-300">·</span>
        )}
        {!compact && refDate && <span>{refDate}</span>}
        <svg
          className="w-3 h-3 text-slate-300 group-hover:text-slate-500"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <>
          {/* 오버레이 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          {/* 툴팁 패널 */}
          <div className="absolute bottom-full left-0 mb-2 z-50 w-72 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-xs">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-slate-800 text-sm">{activeMeta.providerLabel}</div>
                <div className={`text-[11px] font-medium mt-0.5 ${style.text}`}>
                  {style.label}
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-300 hover:text-slate-500 text-base">✕</button>
            </div>

            <div className="space-y-1.5 text-slate-600">
              {refDate && (
                <div className="flex justify-between">
                  <span className="text-slate-400">기준일</span>
                  <span className="font-medium">{activeMeta.referenceDate}</span>
                </div>
              )}
              {updDate && (
                <div className="flex justify-between">
                  <span className="text-slate-400">최종 갱신</span>
                  <span className="font-medium">{updDate}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-400">갱신 주기</span>
                <span className="font-medium">{activeMeta.updateCycle}</span>
              </div>
            </div>

            {activeMeta.limitation && (
              <div className="mt-3 p-2.5 bg-amber-50 border border-amber-100 rounded-lg text-amber-700 text-[11px] leading-relaxed">
                ⚠️ {activeMeta.limitation}
              </div>
            )}

            {activeMeta.sourceUrl && (
              <a
                href={activeMeta.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 flex items-center gap-1 text-blue-500 hover:text-blue-700 text-[11px]"
              >
                🔗 원천 데이터 바로가기
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 복수 출처 배지 (섹션 하단용)
// ────────────────────────────────────────────────────────────────

interface MultiSourceBadgeProps {
  multiMeta: MultiSourceMeta;
  className?: string;
}

export function MultiSourceBadge({ multiMeta, className = "" }: MultiSourceBadgeProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-[10px] text-slate-400 hover:text-slate-600 transition-colors"
        title="복수 데이터 출처 확인"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        <span className="font-medium">{multiMeta.sources.length}개 출처 복합</span>
        <svg className="w-3 h-3 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" d="M12 16v-4M12 8h.01" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 z-50 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-xs">
            <div className="flex items-start justify-between mb-3">
              <div className="font-bold text-slate-800 text-sm">복합 데이터 출처</div>
              <button onClick={() => setOpen(false)} className="text-slate-300 hover:text-slate-500">✕</button>
            </div>
            <p className="text-slate-500 mb-3 text-[11px]">{multiMeta.mergeStrategy}</p>
            <div className="space-y-2">
              {multiMeta.sources.map((src, i) => (
                <div key={i} className="p-2 bg-slate-50 rounded-lg">
                  <div className="font-medium text-slate-700">{src.providerLabel}</div>
                  <div className="text-slate-400 text-[10px] mt-0.5">
                    기준일 {src.referenceDate} · {src.updateCycle}
                  </div>
                  {src.limitation && (
                    <div className="text-amber-600 text-[10px] mt-1">⚠️ {src.limitation}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// 섹션 래퍼: 제목 + 데이터 출처 배지를 한 줄로
// ────────────────────────────────────────────────────────────────

interface SectionWithSourceProps {
  title: string;
  meta?: DataSourceMeta;
  multiMeta?: MultiSourceMeta;
  children: React.ReactNode;
  className?: string;
}

export function SectionWithSource({
  title,
  meta,
  multiMeta,
  children,
  className = "",
}: SectionWithSourceProps) {
  return (
    <section className={className}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-slate-800 text-base">{title}</h3>
        {meta && <DataSourceBadge meta={meta} />}
        {multiMeta && !meta && <MultiSourceBadge multiMeta={multiMeta} />}
      </div>
      {children}
    </section>
  );
}
