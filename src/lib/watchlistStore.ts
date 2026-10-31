/**
 * 관심 단지(Watchlist) & 단지 비교(Compare) 클라이언트 스토어
 *
 * - localStorage 기반 영속화
 * - React useState/useEffect 없이 싱글턴 이벤트 이미터 패턴
 * - 향후 Supabase 서버 동기화 지점 명시
 */

"use client";

import { STORAGE_KEYS, MAX_COMPARE_COUNT } from "@/types/watchlist";
import type { WatchlistItem, WatchlistAlert, CompareState } from "@/types/watchlist";

// ────────────────────────────────────────────────────────────────
// 이벤트 이미터 (구독 패턴)
// ────────────────────────────────────────────────────────────────

type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeWatchlist(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ────────────────────────────────────────────────────────────────
// localStorage 헬퍼
// ────────────────────────────────────────────────────────────────

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeWrite(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // 용량 초과 등
  }
}

// ────────────────────────────────────────────────────────────────
// 관심 단지 API
// ────────────────────────────────────────────────────────────────

export function getWatchlist(): WatchlistItem[] {
  return safeRead<WatchlistItem[]>(STORAGE_KEYS.WATCHLIST, []);
}

export function isWatched(aptId: string): boolean {
  return getWatchlist().some((w) => w.aptId === aptId);
}

export function addToWatchlist(item: Omit<WatchlistItem, "savedAt" | "alertEnabled">): void {
  const list = getWatchlist();
  if (list.some((w) => w.aptId === item.aptId)) return;
  const newItem: WatchlistItem = {
    ...item,
    savedAt: new Date().toISOString(),
    alertEnabled: false,
  };
  safeWrite(STORAGE_KEYS.WATCHLIST, [newItem, ...list]);
  notify();
  // TODO: 서버 동기화
  // await fetch("/api/watchlist", { method: "POST", body: JSON.stringify(newItem) })
}

export function removeFromWatchlist(aptId: string): void {
  const updated = getWatchlist().filter((w) => w.aptId !== aptId);
  safeWrite(STORAGE_KEYS.WATCHLIST, updated);
  notify();
  // TODO: 서버 동기화
}

export function toggleWatchlist(item: Omit<WatchlistItem, "savedAt" | "alertEnabled">): boolean {
  if (isWatched(item.aptId)) {
    removeFromWatchlist(item.aptId);
    return false;
  } else {
    addToWatchlist(item);
    return true;
  }
}

export function updateWatchlistNote(aptId: string, note: string): void {
  const updated = getWatchlist().map((w) =>
    w.aptId === aptId ? { ...w, note } : w
  );
  safeWrite(STORAGE_KEYS.WATCHLIST, updated);
  notify();
}

export function setAlertEnabled(aptId: string, enabled: boolean): void {
  const updated = getWatchlist().map((w) =>
    w.aptId === aptId ? { ...w, alertEnabled: enabled } : w
  );
  safeWrite(STORAGE_KEYS.WATCHLIST, updated);
  notify();
}

// ────────────────────────────────────────────────────────────────
// 단지 비교 API
// ────────────────────────────────────────────────────────────────

const DEFAULT_COMPARE: CompareState = {
  selectedIds: [],
  activeCategory: "기본정보",
  panelOpen: false,
};

export function getCompareState(): CompareState {
  return safeRead<CompareState>(STORAGE_KEYS.COMPARE, DEFAULT_COMPARE);
}

export function isInCompare(aptId: string): boolean {
  return getCompareState().selectedIds.includes(aptId);
}

export function addToCompare(aptId: string): boolean {
  const state = getCompareState();
  if (state.selectedIds.includes(aptId)) return false;
  if (state.selectedIds.length >= MAX_COMPARE_COUNT) return false;
  safeWrite(STORAGE_KEYS.COMPARE, {
    ...state,
    selectedIds: [...state.selectedIds, aptId],
    panelOpen: true,
  });
  notify();
  return true;
}

export function removeFromCompare(aptId: string): void {
  const state = getCompareState();
  safeWrite(STORAGE_KEYS.COMPARE, {
    ...state,
    selectedIds: state.selectedIds.filter((id) => id !== aptId),
    panelOpen: state.selectedIds.length > 1,
  });
  notify();
}

export function clearCompare(): void {
  safeWrite(STORAGE_KEYS.COMPARE, DEFAULT_COMPARE);
  notify();
}

export function setCompareCategory(category: CompareState["activeCategory"]): void {
  const state = getCompareState();
  safeWrite(STORAGE_KEYS.COMPARE, { ...state, activeCategory: category });
  notify();
}

// ────────────────────────────────────────────────────────────────
// React Hook
// ────────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [compareState, setCompareState] = useState<CompareState>(DEFAULT_COMPARE);

  useEffect(() => {
    // 초기 로드
    setItems(getWatchlist());
    setCompareState(getCompareState());

    // 변경 구독
    return subscribeWatchlist(() => {
      setItems(getWatchlist());
      setCompareState(getCompareState());
    });
  }, []);

  return {
    watchlist: items,
    compareState,
    isWatched,
    isInCompare,
    toggleWatchlist,
    addToCompare,
    removeFromCompare,
    clearCompare,
    setCompareCategory,
    updateWatchlistNote,
    setAlertEnabled,
    watchlistCount: items.length,
    compareCount: compareState.selectedIds.length,
  };
}
