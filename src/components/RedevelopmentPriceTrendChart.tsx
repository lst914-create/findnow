"use client";

import { useState } from "react";
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

// 연도별/분기별 실거래 추이 더미/시뮬레이션 데이터 (2006 ~ 2026)
const MOCK_TREND_DATA = [
  { year: "06년", villaPrice: 1250, housePrice: 850, volume: 3 },
  { year: "08년", villaPrice: 1680, housePrice: 1100, volume: 8, event: "구역지정" },
  { year: "10년", villaPrice: 2150, housePrice: 1450, volume: 14, event: "조합설립" },
  { year: "12년", villaPrice: 1980, housePrice: 1380, volume: 4 },
  { year: "14년", villaPrice: 2050, housePrice: 1420, volume: 6 },
  { year: "16년", villaPrice: 2450, housePrice: 1650, volume: 9 },
  { year: "18년", villaPrice: 3200, housePrice: 2100, volume: 12 },
  { year: "20년", villaPrice: 4100, housePrice: 2500, volume: 15 },
  { year: "22년", villaPrice: 4950, housePrice: 2850, volume: 7 },
  { year: "24년", villaPrice: 7200, housePrice: 3200, volume: 11, event: "건축심의" },
  { year: "26년", villaPrice: 8750, housePrice: 3500, volume: 13 },
];

export default function RedevelopmentPriceTrendChart() {
  const [metricTab, setMetricTab] = useState<"대지지분" | "매매가" | "전용면적" | "공시가격">("대지지분");
  const [periodTab, setPeriodTab] = useState<"전체" | "최근 5년">("전체");

  const displayData =
    periodTab === "최근 5년"
      ? MOCK_TREND_DATA.slice(-6)
      : MOCK_TREND_DATA;

  return (
    <div className="bg-slate-50/70 rounded-2xl p-4 border border-slate-200 space-y-3">
      {/* 차트 상단 탭 필터 (재개발닷컴 스타일) */}
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
          {(["최근 5년", "전체"] as const).map((p) => (
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

      {/* 범례 및 단위 표시 (모바일 겹침 방지: 범례와 단위를 깔끔하게 분리) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px] text-slate-500 pt-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-3 h-0.5 bg-blue-600 inline-block rounded-full"></span>
            <span className="font-semibold text-slate-700">다세대(평당가)</span>
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
          <span className="text-[10px] text-slate-400">단위: 만원/평, 건수</span>
        </div>
      </div>

      {/* Recharts 복합 그래프 (대지평당가 Line + 거래량 Bar) */}
      <div className="w-full h-48 sm:h-52 text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={displayData} margin={{ top: 15, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="year"
              tickLine={false}
              axisLine={{ stroke: "#cbd5e1" }}
              tick={{ fontSize: 10, fill: "#64748b" }}
            />
            {/* 좌측 Y축: 평당가 */}
            <YAxis
              yAxisId="price"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: "#94a3b8" }}
              tickFormatter={(v) => `${Math.round(v / 1000)}천`}
            />
            {/* 우측 Y축: 거래량 */}
            <YAxis
              yAxisId="volume"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 9, fill: "#cbd5e1" }}
              domain={[0, 30]}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900/95 backdrop-blur-xs text-white p-2.5 rounded-xl text-xs shadow-xl border border-slate-700">
                      <div className="font-bold border-b border-slate-700 pb-1 mb-1.5">
                        {label} 실거래 동향
                      </div>
                      <div className="space-y-1">
                        <div className="text-blue-300 flex justify-between gap-3">
                          <span>다세대 평당가:</span>
                          <span className="font-bold">
                            {payload[0]?.value ? Number(payload[0].value).toLocaleString() : 0}만원
                          </span>
                        </div>
                        <div className="text-emerald-300 flex justify-between gap-3">
                          <span>단독 평당가:</span>
                          <span className="font-bold">
                            {payload[1]?.value ? Number(payload[1].value).toLocaleString() : 0}만원
                          </span>
                        </div>
                        <div className="text-slate-300 flex justify-between gap-3">
                          <span>거래 건수:</span>
                          <span className="font-bold">{payload[2]?.value}건</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* 마일스톤 점선 (구역지정, 건축심의 등) */}
            <ReferenceLine
              yAxisId="price"
              x="24년"
              stroke="#6366f1"
              strokeDasharray="3 3"
              label={{ value: "건축심의", position: "top", fill: "#4f46e5", fontSize: 9 }}
            />

            {/* 거래량 막대 */}
            <Bar
              yAxisId="volume"
              dataKey="volume"
              fill="#bfdbfe"
              radius={[3, 3, 0, 0]}
              barSize={10}
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
            />

            {/* 단독/다가구 평당가 선 */}
            <Line
              yAxisId="price"
              type="monotone"
              dataKey="housePrice"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ r: 2.5, fill: "#10b981" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
