"use client";

import React from "react";
import { useWatchlist } from "@/lib/watchlistStore";
import type { Apartment } from "@/lib/apartments";
import { MAX_COMPARE_COUNT } from "@/types/watchlist";

interface Props {
  apt: Pick<Apartment, "id" | "name" | "region" | "district" | "price_min" | "price_max" | "area_pyeong">;
  className?: string;
}

export function AptCardActionButtons({ apt, className = "" }: Props) {
  const { watchlist, compareState, toggleWatchlist, addToCompare, removeFromCompare } = useWatchlist();

  const watched = watchlist.some((w) => w.aptId === apt.id);
  const inCompare = compareState.selectedIds.includes(apt.id);

  const handleToggleWatch = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist({
      aptId: apt.id,
      aptName: apt.name,
      region: apt.region,
      district: apt.district,
      priceAtSave: Math.round((apt.price_min + apt.price_max) / 2),
    });
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(apt.id);
    } else {
      if (compareState.selectedIds.length >= MAX_COMPARE_COUNT) {
        alert(`단지 비교는 최대 ${MAX_COMPARE_COUNT}개까지만 가능합니다. 비교 패널에서 기존 단지를 제거 후 추가해주세요.`);
        return;
      }
      addToCompare(apt.id);
    }
  };

  return (
    <div className={`flex items-center gap-1.5 z-20 ${className}`}>
      {/* 관심 단지 버튼 */}
      <button
        type="button"
        onClick={handleToggleWatch}
        title={watched ? "관심 단지에서 제거" : "관심 단지에 저장"}
        className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
          watched
            ? "bg-rose-500 text-white scale-105 shadow-rose-500/30"
            : "bg-black/35 hover:bg-black/55 text-white/90 border border-white/25 hover:scale-105"
        }`}
      >
        <span className="text-sm leading-none">{watched ? "❤️" : "🤍"}</span>
      </button>

      {/* 단지 비교 버튼 */}
      <button
        type="button"
        onClick={handleToggleCompare}
        title={inCompare ? "비교함에서 제거" : "비교함에 담기 (최대 3개)"}
        className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-sm ${
          inCompare
            ? "bg-blue-600 text-white scale-105 shadow-blue-500/30"
            : "bg-black/35 hover:bg-black/55 text-white/90 border border-white/25 hover:scale-105"
        }`}
      >
        <span className="text-xs font-bold leading-none">{inCompare ? "✓" : "⚖️"}</span>
      </button>
    </div>
  );
}

export default AptCardActionButtons;
