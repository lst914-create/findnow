"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from "recharts";
import type { RedevelopmentTransaction } from "@/lib/redevelopment";

interface Props {
  transactions?: RedevelopmentTransaction[];
  currentStageName?: string;
}

interface TrendPoint {
  label: string;
  villaPrice: number;
  housePrice: number;
  volume: number;
  event?: string;
}

export default function RedevelopmentPriceTrendChart({
  transactions = [],
  currentStageName,
}: Props) {
  const [metricTab, setMetricTab] = useState<"대지지분" | "매매가" | "전용면적" | "공시가격">("대지지분");
  const [periodTab, setPeriodTab] = useState<"최근 6개월" | "최근 1년" | "전체">("전체");

  // 실제 transactions 기반 연도별/월별 집계
  const chartData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // 유효한 날짜가 있는 거래만 필터링
    const validTrades = transactions
      .filter((t) => t.date && t.date.length >= 7)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (validTrades.length === 0) return [];

    // 거래 데이터의 기간 범위 계산
    const dates = validTrades.map((t) => t.date);
    const minYear = parseInt(dates[0].slice(0, 4), 10);
    const maxYear = parseInt(dates[dates.length - 1].slice(0, 4), 10);
    const isMultiYear = maxYear - minYear >= 2;

    // 그룹핑 키: 다년도면 YYYY년, 2년 이내면 YYYY.MM
    const groups = new Map<string, RedevelopmentTransaction[]>();
    for (const t of validTrades) {
      const key = isMultiYear
        ? `${t.date.slice(2, 4)}년`
        : `${t.date.slice(2, 7)}`;
      const arr = groups.get(key) || [];
      arr.push(t);
      groups.set(key, arr);
    }

    const points: TrendPoint[] = [];

    for (const [key, group] of groups.entries()) {
      const villaTrades = group.filter((t) => t.type === "다세대" || (t.type as string) === "연립");
      const houseTrades = group.filter((t) => t.type === "단독" || t.type === "다가구");

      const getVal = (t: RedevelopmentTransaction) => {
        if (metricTab === "대지지분") return t.landPricePerPyeongManwon || (t.tradePriceManwon / Math.max(t.landPyeong, 1));
        if (metricTab === "매매가") return t.tradePriceManwon;
        if (metricTab === "전용면적") return Math.round(t.tradePriceManwon / Math.max(t.exclusivePyeong, 1));
        if (metricTab === "공시가격") return t.officialPriceManwon || 0;
        return 0;
      };

      const avgVilla = villaTrades.length > 0
        ? Math.round(villaTrades.reduce((sum, t) => sum + getVal(t), 0) / villaTrades.length)
        : 0;

      const avgHouse = houseTrades.length > 0
        ? Math.round(houseTrades.reduce((sum, t) => sum + getVal(t), 0) / houseTrades.length)
        : 0;

      points.push({
        label: key,
        villaPrice: avgVilla,
        housePrice: avgHouse,
        volume: group.length,
      });
    }

    // 기간 필터 적용
    if (periodTab === "최근 6개월") {
      return points.slice(-6);
    }
    if (periodTab === "최근 1년") {
      return points.slice(-12);
    }
    return points;
  }, [transactions, metricTab, periodTab]);

  return (
    <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200 space-y-3">
      {/* 차트 상단 탭 필터 */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* 지표 선택 필터 */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs font-bold">
          {(["대지지분", "매매가", "전용면적", "공시가격"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMetricTab(tab)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                metricTab === tab
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 기간 필터 */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs font-bold text-[11px]">
          {(["최근 6개월", "최근 1년", "전체"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodTab(p)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                periodTab === p
                  ? "bg-blue-50 text-blue-700 font-extrabold"
                  : "text-slate-400 hover:text-slate-700"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* 범례 및 단위 표시 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-slate-500 pt-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-3 h-0.5 bg-blue-600 inline-block rounded-full"></span>
            <span className="font-semibold text-slate-700">다세대·연립</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-3 h-0.5 bg-emerald-500 inline-block rounded-full"></span>
            <span className="font-semibold text-slate-700">단독·다가구</span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-2.5 h-2 bg-blue-200 inline-block rounded-xs"></span>
            <span className="font-medium text-slate-500">거래량</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[10px] text-slate-400">
            단위: {metricTab === "매매가" || metricTab === "공시가격" ? "만원" : "만원/평"}, 건수
          </span>
        </div>
      </div>

      {/* 차트 영역 또는 데이터 부재 안내 */}
      {chartData.length === 0 ? (
        <div className="w-full h-40 flex flex-col items-center justify-center text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl bg-white/60">
          <span className="text-lg mb-1">📊</span>
          <span>해당 구역의 실거래 추이 데이터가 수집 중입니다.</span>
          <span className="text-[10px] text-slate-400 mt-0.5">국토교통부 실거래가 조회가 완료되면 자동 반영됩니다.</span>
        </div>
      ) : (
        <div className="w-full h-48 sm:h-52 text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={{ stroke: "#cbd5e1" }}
                tick={{ fontSize: 10, fill: "#64748b" }}
              />
              {/* 좌측 Y축: 가격 */}
              <YAxis
                yAxisId="price"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 9, fill: "#94a3b8" }}
                tickFormatter={(v) => (v >= 10000 ? `${(v / 10000).toFixed(1)}억` : `${Math.round(v / 1000)}천`)}
              />
              {/* 우측 Y축: 거래량 */}
              <YAxis
                yAxisId="volume"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 9, fill: "#cbd5e1" }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const vPrice = payload.find((p) => p.dataKey === "villaPrice")?.value;
                    const hPrice = payload.find((p) => p.dataKey === "housePrice")?.value;
                    const vol = payload.find((p) => p.dataKey === "volume")?.value;
                    return (
                      <div className="bg-slate-900/95 backdrop-blur-xs text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-700">
                        <div className="font-bold border-b border-slate-700 pb-1 mb-1.5">
                          {label} 실거래 동향
                        </div>
                        <div className="space-y-1">
                          <div className="text-blue-300 flex justify-between gap-3">
                            <span>다세대:</span>
                            <span className="font-bold">
                              {vPrice ? Number(vPrice).toLocaleString() : "-"}만원
                            </span>
                          </div>
                          <div className="text-emerald-300 flex justify-between gap-3">
                            <span>단독·다가구:</span>
                            <span className="font-bold">
                              {hPrice ? Number(hPrice).toLocaleString() : "-"}만원
                            </span>
                          </div>
                          <div className="text-slate-300 flex justify-between gap-3">
                            <span>거래 건수:</span>
                            <span className="font-bold">{vol ?? 0}건</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {currentStageName && (
                <ReferenceLine
                  yAxisId="price"
                  x={chartData[chartData.length - 1]?.label}
                  stroke="#6366f1"
                  strokeDasharray="3 3"
                  label={{ value: currentStageName, position: "top", fill: "#4f46e5", fontSize: 9 }}
                />
              )}

              {/* 거래량 막대 */}
              <Bar
                yAxisId="volume"
                dataKey="volume"
                fill="#bfdbfe"
                radius={[3, 3, 0, 0]}
                barSize={12}
              />

              {/* 다세대 평당가 선 */}
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="villaPrice"
                stroke="#2563eb"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#2563eb" }}
                activeDot={{ r: 5 }}
                connectNulls
              />

              {/* 단독/다가구 평당가 선 */}
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="housePrice"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 2.5, fill: "#10b981" }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
