"use client";

import dynamic from "next/dynamic";

const WatchlistComparePanel = dynamic(
  () => import("@/components/WatchlistComparePanel"),
  { ssr: false }
);

export default function WatchlistComparePanelWrapper() {
  return <WatchlistComparePanel />;
}
