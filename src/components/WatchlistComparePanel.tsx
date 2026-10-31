/**
 * P2: 관심 단지 & 단지 비교 플로팅 패널 컴포넌트
 *
 * - 우하단 고정 FAB (관심단지 N개 배지)
 * - 슬라이드업 패널: 관심 단지 목록 + 비교 단지 선택
 * - 비교 모드: 최대 3개 단지 나란히 비교
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useWatchlist, clearCompare, removeFromWatchlist, removeFromCompare } from "@/lib/watchlistStore";
import { APARTMENTS_DATA } from "@/lib/apartments";
import type { CompareCategory } from "@/types/watchlist";
import { MAX_COMPARE_COUNT } from "@/types/watchlist";

const COMPARE_CATEGORIES: CompareCategory[] = [
  "기본정보", "가격·시세", "단지시설", "교통·역세권", "학군", "주변정비사업", "상권",
];

type PanelTab = "watchlist" | "compare";

export default function WatchlistComparePanel() {
  const {
    watchlist,
    compareState,
    watchlistCount,
    compareCount,
  } = useWatchlist();

  const [panelOpen, setPanelOpen] = useState(false);
  const [tab, setTab] = useState<PanelTab>("watchlist");

  // 비교 단지 데이터 조회
  const compareApts = compareState.selectedIds
    .map((id) => APARTMENTS_DATA.find((a) => a.id === id))
    .filter(Boolean) as (typeof APARTMENTS_DATA)[0][];

  if (watchlistCount === 0 && compareCount === 0) return null;

  return (
    <>
      {/* FAB 버튼 */}
      <div className="fixed bottom-20 right-4 z-40 flex flex-col items-end gap-2">
        {/* 비교 FAB */}
        {compareCount > 0 && (
          <button
            onClick={() => { setTab("compare"); setPanelOpen(true); }}
            className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-bold px-4 py-2.5 rounded-full shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
          >
            <span>⚖️ 비교</span>
            <span className="bg-white text-indigo-600 rounded-full w-5 h-5 flex items-center justify-center text-xs font-extrabold">
              {compareCount}
            </span>
          </button>
        )}

        {/* 관심단지 FAB */}
        <button
          onClick={() => { setTab("watchlist"); setPanelOpen(true); }}
          className="flex items-center gap-2 bg-rose-500 text-white text-sm font-bold px-4 py-2.5 rounded-full shadow-lg hover:bg-rose-600 transition-all active:scale-95"
        >
          <span>❤️ 관심단지</span>
          <span className="bg-white text-rose-500 rounded-full w-5 h-5 flex items-center justify-center text-xs font-extrabold">
            {watchlistCount}
          </span>
        </button>
      </div>

      {/* 슬라이드업 패널 */}
      {panelOpen && (
        <>
          {/* 배경 오버레이 */}
          <div
            className="fixed inset-0 bg-black/30 z-40 backdrop-blur-sm"
            onClick={() => setPanelOpen(false)}
          />

          <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col">
            {/* 핸들 */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200" />
            </div>

            {/* 헤더 + 탭 */}
            <div className="px-5 pb-3 flex items-center justify-between">
              <div className="flex gap-1">
                <button
                  onClick={() => setTab("watchlist")}
                  className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                    tab === "watchlist"
                      ? "bg-rose-500 text-white"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  ❤️ 관심단지 {watchlistCount}
                </button>
                {compareCount > 0 && (
                  <button
                    onClick={() => setTab("compare")}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${
                      tab === "compare"
                        ? "bg-indigo-600 text-white"
                        : "text-slate-400 hover:text-slate-600"
                    }`}
                  >
                    ⚖️ 비교 {compareCount}/{MAX_COMPARE_COUNT}
                  </button>
                )}
              </div>
              <button
                onClick={() => setPanelOpen(false)}
                className="text-slate-300 hover:text-slate-500 text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* 콘텐츠 */}
            <div className="flex-1 overflow-y-auto px-5 pb-6">

              {/* ── 관심단지 탭 ── */}
              {tab === "watchlist" && (
                <div className="space-y-3">
                  {watchlist.length === 0 ? (
                    <div className="text-center text-slate-400 py-10 text-sm">
                      <div className="text-3xl mb-2">💔</div>
                      관심 단지가 없습니다.<br />단지 카드의 ❤️ 버튼으로 추가하세요.
                    </div>
                  ) : (
                    watchlist.map((item) => (
                      <div
                        key={item.aptId}
                        className="flex items-center justify-between bg-slate-50 rounded-2xl px-4 py-3 border border-slate-100"
                      >
                        <Link
                          href={`/apt/${item.aptId}`}
                          onClick={() => setPanelOpen(false)}
                          className="flex-1 min-w-0"
                        >
                          <div className="font-bold text-slate-800 text-sm truncate">{item.aptName}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{item.region} {item.district}</div>
                          {item.priceAtSave && (
                            <div className="text-xs text-rose-500 font-medium mt-0.5">
                              저장 시 시세 {(item.priceAtSave / 10000).toFixed(1)}억
                            </div>
                          )}
                        </Link>
                        <button
                          onClick={() => removeFromWatchlist(item.aptId)}
                          className="ml-3 text-slate-300 hover:text-red-400 transition-colors text-lg"
                          title="관심단지 삭제"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ── 비교 탭 ── */}
              {tab === "compare" && (
                <div>
                  {compareApts.length === 0 ? (
                    <div className="text-center text-slate-400 py-10 text-sm">
                      <div className="text-3xl mb-2">⚖️</div>
                      비교할 단지를 선택하세요.<br />단지 카드의 ⊕ 버튼으로 최대 {MAX_COMPARE_COUNT}개 추가
                    </div>
                  ) : (
                    <>
                      {/* 비교 단지 헤더 */}
                      <div className={`grid gap-2 mb-4`}
                        style={{ gridTemplateColumns: `repeat(${compareApts.length}, 1fr)` }}
                      >
                        {compareApts.map((apt) => (
                          <div key={apt.id} className="text-center bg-indigo-50 rounded-xl p-3 relative">
                            <button
                              onClick={() => removeFromCompare(apt.id)}
                              className="absolute top-1.5 right-1.5 text-slate-300 hover:text-red-400 text-sm"
                            >
                              ×
                            </button>
                            <div className="font-bold text-indigo-900 text-xs leading-tight truncate">{apt.name}</div>
                            <div className="text-slate-400 text-[10px] mt-0.5 truncate">{apt.district}</div>
                          </div>
                        ))}
                      </div>

                      {/* 비교 행 */}
                      <div className="space-y-2">
                        {/* 준공연도 */}
                        <CompareRow
                          label="준공연도"
                          values={compareApts.map((a) => `${a.built_year}년`)}
                        />
                        {/* 세대수 */}
                        <CompareRow
                          label="세대수"
                          values={compareApts.map((a) => `${a.household_count.toLocaleString()}세대`)}
                        />
                        {/* 면적 */}
                        <CompareRow
                          label="전용면적"
                          values={compareApts.map((a) => `${a.area_pyeong}평`)}
                        />
                        {/* 매매 시세 */}
                        <CompareRow
                          label="매매 시세"
                          values={compareApts.map((a) =>
                            a.price_min
                              ? `${(a.price_min / 10000).toFixed(0)}~${(a.price_max / 10000).toFixed(0)}억`
                              : "-"
                          )}
                          highlight
                        />
                        {/* 역세권 */}
                        <CompareRow
                          label="인근 역"
                          values={compareApts.map((a) =>
                            a.station ? `${a.station.split(" ")[0]} ${a.walk_minutes ?? "-"}분` : "-"
                          )}
                        />
                        {/* 학군 */}
                        <CompareRow
                          label="배정 초등학교"
                          values={compareApts.map((a) => a.school_name ?? a.schools?.[0] ?? "-")}
                        />
                      </div>

                      <button
                        onClick={clearCompare}
                        className="mt-5 w-full text-slate-400 text-xs hover:text-red-400 transition-colors"
                      >
                        비교 목록 전체 초기화
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

// ── 비교 행 서브 컴포넌트 ──────────────────────────────────────

function CompareRow({
  label,
  values,
  highlight = false,
}: {
  label: string;
  values: string[];
  highlight?: boolean;
}) {
  return (
    <div className="flex items-stretch gap-2">
      <div className="w-20 flex-shrink-0 text-xs text-slate-400 flex items-center">{label}</div>
      {values.map((v, i) => (
        <div
          key={i}
          className={`flex-1 text-center text-xs font-semibold rounded-lg py-2 ${
            highlight
              ? "bg-indigo-50 text-indigo-700"
              : "bg-slate-50 text-slate-700"
          }`}
        >
          {v}
        </div>
      ))}
    </div>
  );
}
