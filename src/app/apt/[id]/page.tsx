"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
  ScatterChart,
  ZAxis,
} from "recharts";

interface DetailProps {
  params: Promise<{ id: string }>;
}

// 아파트별 가격 추이 데이터 생성 헬퍼
function genPriceTrend(base: number, months = 24, variance = 0.04) {
  const result = [];
  let price = base;
  const now = new Date(2026, 8, 1); // 2026.09
  for (let i = months; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const label = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
    const delta = (Math.random() - 0.42) * variance * price;
    price = Math.max(price + delta, base * 0.7);
    result.push({ date: label, price: Math.round(price / 1000) / 10 }); // 억 단위
  }
  return result;
}

// 아파트별 전세 가격 추이 생성
function genRentTrend(base: number, months = 24, variance = 0.03) {
  const result = [];
  let price = base;
  const now = new Date(2026, 8, 1);
  for (let i = months; i >= 0; i--) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - i);
    const label = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}`;
    const delta = (Math.random() - 0.45) * variance * price;
    price = Math.max(price + delta, base * 0.6);
    result.push({ date: label, price: Math.round(price / 1000) / 10 });
  }
  return result;
}

// 월별 실거래 더미 데이터 대량 생성
function genTransactions(
  basePrice: number,
  type: "매매" | "전월세",
  area: string,
  count = 20
) {
  const txs = [];
  const now = new Date(2026, 8, 1);
  const rentBase = basePrice * 0.52;
  for (let i = 0; i < count; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() - i * 5 - Math.floor(Math.random() * 4));
    const floor = Math.floor(Math.random() * 30) + 1;
    if (type === "매매") {
      const price = basePrice * (0.9 + Math.random() * 0.2);
      const uk = Math.floor(price / 10000);
      const man = Math.round((price % 10000) / 100) * 100;
      txs.push({
        date: `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`,
        area,
        floor: `${floor}층`,
        price: `${uk}억 ${man > 0 ? man.toLocaleString() + "만" : ""}`,
        type,
      });
    } else {
      const deposit = Math.round(rentBase * (0.8 + Math.random() * 0.4) / 1000) * 1000;
      const monthly = Math.random() > 0.5 ? Math.round(deposit * 0.002 / 10) * 10 : 0;
      const uk = Math.floor(deposit / 10000);
      const man = Math.round(deposit % 10000 / 100) * 100;
      txs.push({
        date: `${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`,
        area,
        floor: `${floor}층`,
        price: monthly > 0 ? `보증 ${uk}억/${monthly}만` : `${uk}억 ${man > 0 ? man.toLocaleString() + "만" : ""}`,
        type,
      });
    }
  }
  return txs;
}

const APARTMENT_DATA: Record<string, any> = {
  "1": { name: "래미안 대치팰리스 1단지", region: "서울 강남구 대치동", price_min: 270000, price_max: 340000, rent_min: 150000, rent_max: 180000, area_sqm: 84, area_pyeong: 34, built_year: 2015, household_count: 1278, construction: "삼성물산", parking: "세대당 1.9대", floor_area_ratio: "259%", heating: "지역난방", school_score: 99, traffic_score: 92, nature_score: 78, tags: ["초품아", "학군대표", "역세권", "대단지"], image_url: "/images/apts/daechi.png", station: "대치역(3호선) 도보 3분", schools: ["서울대곡초등학교 (도보 2분)", "대치중학교", "휘문고등학교"], description: "대한민국 대표 학군지 대치동의 대장 아파트입니다. 대치동 학원가 도보 접근성이 매우 우수합니다." },
  "2": { name: "반포 자이", region: "서울 서초구 반포동", price_min: 280000, price_max: 360000, rent_min: 160000, rent_max: 190000, area_sqm: 84, area_pyeong: 34, built_year: 2009, household_count: 3410, construction: "GS건설", parking: "세대당 1.78대", floor_area_ratio: "270%", heating: "지역난방", school_score: 96, traffic_score: 98, nature_score: 85, tags: ["역세권", "대단지", "한강조망", "커뮤니티"], image_url: "/images/apts/banpo.png", station: "사평역(9호선) 도보 2분", schools: ["원촌초등학교 (단지내)", "원촌중학교", "반포고등학교"], description: "서초구 반포동의 상징적인 랜드마크 대단지 아파트입니다." },
  "3": { name: "마포 프레스티지 자이", region: "서울 마포구 염리동", price_min: 165000, price_max: 195000, rent_min: 95000, rent_max: 110000, area_sqm: 84, area_pyeong: 34, built_year: 2021, household_count: 1694, construction: "GS건설", parking: "세대당 1.4대", floor_area_ratio: "249%", heating: "개별난방", school_score: 88, traffic_score: 95, nature_score: 82, tags: ["신축", "역세권", "직주근접", "대단지"], image_url: "/images/apts/mapo.png", station: "이대역(2호선) 도보 5분", schools: ["한서초등학교", "숭문중학교", "숭문고등학교"], description: "마포 신축 브랜드 대단지의 핵심입니다." },
  "4": { name: "헬리오시티", region: "서울 송파구 가락동", price_min: 180000, price_max: 220000, rent_min: 100000, rent_max: 125000, area_sqm: 84, area_pyeong: 33, built_year: 2018, household_count: 9510, construction: "현대건설·삼성물산", parking: "세대당 2.0대", floor_area_ratio: "275%", heating: "지역난방", school_score: 91, traffic_score: 93, nature_score: 80, tags: ["대단지", "초품아", "역세권", "신축"], image_url: "/images/apts/helio.png", station: "송파역(8호선) 도보 2분", schools: ["가락초등학교 (단지내)", "문정중학교", "오금고등학교"], description: "9,510세대 대한민국 최대 규모 아파트 단지입니다." },
  "5": { name: "판교 푸르지오 그랑블", region: "경기 성남시 분당구 백현동", price_min: 220000, price_max: 260000, rent_min: 130000, rent_max: 155000, area_sqm: 98, area_pyeong: 38, built_year: 2011, household_count: 948, construction: "대우건설", parking: "세대당 2.1대", floor_area_ratio: "215%", heating: "지역난방", school_score: 94, traffic_score: 99, nature_score: 90, tags: ["판교역세권", "직주근접", "공원인접"], image_url: "/images/apts/pangyo.png", station: "판교역(신분당선) 도보 3분", schools: ["백현초등학교", "판교중학교", "불정고등학교"], description: "판교 테크노밸리 직주근접 최고 입지의 프리미엄 단지입니다." },
  "6": { name: "킨텍스 꿈에그린", region: "경기 고양시 일산서구 대화동", price_min: 95000, price_max: 125000, rent_min: 52000, rent_max: 70000, area_sqm: 84, area_pyeong: 35, built_year: 2019, household_count: 1880, construction: "한화건설", parking: "세대당 1.3대", floor_area_ratio: "245%", heating: "지역난방", school_score: 82, traffic_score: 89, nature_score: 88, tags: ["GTX호재", "신축", "대공원", "대단지"], image_url: "/images/apts/kintex.png", station: "킨텍스역(GTX-A) 도보 4분", schools: ["킨텍스초등학교", "세원중학교", "백신고등학교"], description: "GTX-A 개통으로 서울 접근성이 획기적으로 개선된 신축 단지입니다." },
  "7": { name: "DMC 롯데캐슬 더 퍼스트", region: "서울 은평구 수색동", price_min: 115000, price_max: 138000, rent_min: 62000, rent_max: 78000, area_sqm: 84, area_pyeong: 34, built_year: 2020, household_count: 1192, construction: "롯데건설", parking: "세대당 1.5대", floor_area_ratio: "258%", heating: "지역난방", school_score: 84, traffic_score: 91, nature_score: 85, tags: ["DMC직주근접", "신축", "역세권"], image_url: "/images/apts/daechi.png", station: "수색역(경의중앙선) 도보 6분", schools: ["수색초등학교", "상암중학교", "중산고등학교"], description: "상암 DMC 직주근접 신축 아파트입니다." },
  "8": { name: "광교 중흥S-클래스", region: "경기 수원시 영통구 이의동", price_min: 135000, price_max: 175000, rent_min: 72000, rent_max: 90000, area_sqm: 84, area_pyeong: 35, built_year: 2019, household_count: 2231, construction: "중흥토건", parking: "세대당 1.82대", floor_area_ratio: "247%", heating: "지역난방", school_score: 90, traffic_score: 92, nature_score: 98, tags: ["호수공원뷰", "신축", "광교중앙역"], image_url: "/images/apts/pangyo.png", station: "광교중앙역(신분당선) 도보 7분", schools: ["이의초등학교", "광교중학교", "이의고등학교"], description: "광교호수공원 바로 인접한 프리미엄 신축 아파트입니다." },
  "9": { name: "아크로리버파크", region: "서울 서초구 반포동", price_min: 350000, price_max: 420000, rent_min: 200000, rent_max: 240000, area_sqm: 84, area_pyeong: 34, built_year: 2016, household_count: 1612, construction: "대림산업", parking: "세대당 1.96대", floor_area_ratio: "279%", heating: "지역난방", school_score: 98, traffic_score: 97, nature_score: 99, tags: ["한강조망", "프리미엄", "신반포역"], image_url: "/images/apts/banpo.png", station: "신반포역(9호선) 도보 5분", schools: ["신동초등학교", "원촌중학교", "반포고등학교"], description: "서울 최고 프리미엄 한강변 아파트의 상징입니다." },
  "10": { name: "올림픽파크 포레온", region: "서울 강동구 둔촌동", price_min: 170000, price_max: 210000, rent_min: 95000, rent_max: 120000, area_sqm: 84, area_pyeong: 34, built_year: 2025, household_count: 12032, construction: "현대건설·삼성물산·대우건설", parking: "세대당 2.2대", floor_area_ratio: "280%", heating: "지역난방", school_score: 95, traffic_score: 94, nature_score: 92, tags: ["초대단지", "신축입주", "올림픽공원"], image_url: "/images/apts/helio.png", station: "둔촌동역(5호선) 도보 3분", schools: ["명일초등학교", "명일중학교", "강동고등학교"], description: "2025년 입주 완료한 대한민국 최대 규모 재건축 단지입니다." },
  "11": { name: "평촌 더샵 아이파크", region: "경기 안양시 동안구 호계동", price_min: 88000, price_max: 110000, rent_min: 50000, rent_max: 63000, area_sqm: 84, area_pyeong: 34, built_year: 2019, household_count: 1174, construction: "포스코이앤씨·HDC현대산업개발", parking: "세대당 1.4대", floor_area_ratio: "262%", heating: "개별난방", school_score: 92, traffic_score: 88, nature_score: 84, tags: ["평촌학원가", "신축", "대단지"], image_url: "/images/apts/kintex.png", station: "범계역(4호선) 도보 11분", schools: ["귀인초등학교", "호계중학교", "부흥고등학교"], description: "경기 안양 평촌 신도시의 신축 랜드마크 단지입니다." },
  "12": { name: "송도 더샵 센트럴파크 2차", region: "인천 연수구 송도동", price_min: 75000, price_max: 98000, rent_min: 42000, rent_max: 55000, area_sqm: 98, area_pyeong: 39, built_year: 2011, household_count: 632, construction: "포스코이앤씨", parking: "세대당 1.8대", floor_area_ratio: "210%", heating: "지역난방", school_score: 89, traffic_score: 86, nature_score: 97, tags: ["센트럴파크뷰", "국제학교", "공원인접"], image_url: "/images/apts/pangyo.png", station: "센트럴파크역(인천1호선) 도보 4분", schools: ["송도초등학교", "인천국제학교", "송도고등학교"], description: "인천 송도 국제업무지구 내 프리미엄 단지입니다." },
};

// 커스텀 툴팁
function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-lg text-sm">
        <p className="text-slate-500 text-xs mb-1">{label}</p>
        <p className="font-bold text-blue-600">{payload[0].value}억원</p>
      </div>
    );
  }
  return null;
}

export default function ApartmentDetailPage({ params }: DetailProps) {
  const resolvedParams = use(params);
  const apt = APARTMENT_DATA[resolvedParams.id] || APARTMENT_DATA["1"];

  const [tradeType, setTradeType] = useState<"매매" | "전월세">("매매");
  const [chartRange, setChartRange] = useState<"최근 1년" | "최근 3년" | "전체">("최근 3년");
  const [showCount, setShowCount] = useState(5);

  // 미리 생성 (컴포넌트 내에서 useMemo 없이 간단히)
  const saleTrend = genPriceTrend(apt.price_min + (apt.price_max - apt.price_min) / 2, 36);
  const rentTrend = genRentTrend(apt.rent_min + (apt.rent_max - apt.rent_min) / 2, 36);
  const saleTxs = genTransactions(apt.price_min + (apt.price_max - apt.price_min) / 2, "매매", `${apt.area_sqm}㎡`, 30);
  const rentTxs = genTransactions(apt.rent_min + (apt.rent_max - apt.rent_min) / 2, "전월세", `${apt.area_sqm}㎡`, 30);

  const activeTrend = tradeType === "매매" ? saleTrend : rentTrend;
  const activeTxs = tradeType === "매매" ? saleTxs : rentTxs;

  const chartData = chartRange === "최근 1년"
    ? activeTrend.slice(-12)
    : chartRange === "최근 3년"
    ? activeTrend.slice(-36)
    : activeTrend;

  const latestPrice = chartData[chartData.length - 1]?.price ?? 0;
  const minPrice = Math.min(...chartData.map((d) => d.price));
  const maxPrice = Math.max(...chartData.map((d) => d.price));

  const formatPrice = (price: number) => {
    const uk = Math.floor(price / 10000);
    const cheon = price % 10000;
    if (uk > 0 && cheon > 0) return `${uk}억 ${cheon.toLocaleString()}만`;
    if (uk > 0) return `${uk}억원`;
    return `${price.toLocaleString()}만원`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm transition-colors">
            <span>←</span>
            <span>목록</span>
          </Link>
          <div className="text-sm font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">{apt.name}</div>
          <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer">
            ⭐ 관심 단지
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Hero Image */}
        <div className="relative h-[260px] sm:h-[380px] rounded-3xl overflow-hidden shadow-xl">
          <img src={apt.image_url} alt={apt.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6">
            <div className="text-white">
              <div className="flex flex-wrap gap-2 mb-2">
                {apt.tags.map((t: string) => (
                  <span key={t} className="px-2.5 py-0.5 bg-white/25 backdrop-blur text-white text-xs font-bold rounded-full border border-white/30">
                    #{t}
                  </span>
                ))}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold drop-shadow">{apt.name}</h1>
              <p className="text-slate-300 text-sm mt-1">📍 {apt.region}</p>
            </div>
          </div>
        </div>

        {/* ===== 시세/실거래 섹션 ===== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          {/* 매매 / 전월세 탭 */}
          <div className="flex border-b border-slate-200">
            {(["매매", "전월세"] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setTradeType(type); setShowCount(5); }}
                className={`flex-1 py-4 text-base font-bold transition-all cursor-pointer ${
                  tradeType === type
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40"
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            {/* 최근 1개월 평균 */}
            <div>
              <p className="text-xs text-slate-400 mb-1">최근 실거래 기준 1개월 평균</p>
              <p className="text-4xl font-black text-slate-900 tracking-tight">
                {tradeType === "매매"
                  ? `${formatPrice(Math.round((apt.price_min + apt.price_max) / 2))}`
                  : `${formatPrice(Math.round((apt.rent_min + apt.rent_max) / 2))}`}
              </p>
              <p className="text-xs text-slate-400 mt-1">전용 {apt.area_sqm}㎡ 기준</p>
            </div>

            {/* 시세 박스 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <div className="text-[11px] font-semibold text-blue-500 mb-1">
                  {tradeType === "매매" ? "매매 예상 시세" : "보증금 범위"}
                </div>
                <div className="text-lg font-black text-slate-900 leading-tight">
                  {tradeType === "매매"
                    ? `${formatPrice(apt.price_min)} ~ ${formatPrice(apt.price_max)}`
                    : `${formatPrice(apt.rent_min)} ~ ${formatPrice(apt.rent_max)}`}
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-400 mb-1">
                  {tradeType === "매매" ? "전세 예상 시세" : "월세 (환산)"}
                </div>
                <div className="text-lg font-black text-slate-700 leading-tight">
                  {tradeType === "매매"
                    ? `${formatPrice(apt.rent_min)} ~ ${formatPrice(apt.rent_max)}`
                    : `${formatPrice(Math.round(apt.rent_min * 0.3))} ~ ${formatPrice(Math.round(apt.rent_max * 0.3))}`}
                </div>
              </div>
            </div>

            {/* ===== 가격 추이 그래프 ===== */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-700">📈 {tradeType} 가격 추이</h3>
                <div className="flex gap-1">
                  {(["최근 1년", "최근 3년", "전체"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setChartRange(r)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                        chartRange === r
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* 최고/최저/현재 요약 */}
              <div className="flex gap-4 mb-3 text-xs text-slate-500">
                <span>최저 <strong className="text-slate-700">{minPrice}억</strong></span>
                <span>최고 <strong className="text-slate-700">{maxPrice}억</strong></span>
                <span>현재 <strong className="text-blue-600">{latestPrice}억</strong></span>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickLine={false}
                    interval={Math.floor(chartData.length / 5)}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#94a3b8" }}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(v) => `${v}억`}
                    domain={["auto", "auto"]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "#2563eb" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ===== 실거래 내역 ===== */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-700">📋 실거래 신고 내역</h3>
                <span className="text-[11px] text-slate-400">국토교통부 기준</span>
              </div>

              <div className="rounded-2xl border border-slate-100 overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50">
                    <tr className="text-xs text-slate-400">
                      <th className="px-4 py-3">계약일</th>
                      <th className="px-4 py-3">면적(공급)</th>
                      <th className="px-4 py-3">층</th>
                      <th className="px-4 py-3 text-right">거래금액</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeTxs.slice(0, showCount).map((tx: any, idx: number) => (
                      <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-4 py-3 text-slate-600 text-xs">{tx.date}</td>
                        <td className="px-4 py-3 text-slate-700">{tx.area}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{tx.floor}</td>
                        <td className="px-4 py-3 font-bold text-blue-600 text-right">{tx.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 더보기 버튼 */}
              {showCount < activeTxs.length && (
                <button
                  onClick={() => setShowCount((prev) => prev + 10)}
                  className="mt-3 w-full py-3 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all cursor-pointer"
                >
                  더보기 <span className="text-slate-400">∨</span>
                </button>
              )}
              {showCount >= activeTxs.length && (
                <p className="mt-3 text-center text-xs text-slate-400">모든 실거래 내역을 확인했습니다.</p>
              )}
            </div>
          </div>
        </div>

        {/* ===== 단지 정보 ===== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          <h2 className="text-lg font-bold text-slate-900">🏢 단지 정보</h2>
          <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-blue-200 pl-4 py-1 bg-blue-50/30 rounded-r-xl">
            {apt.description}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "총 세대수", value: `${apt.household_count.toLocaleString()}세대` },
              { label: "준공년도", value: `${apt.built_year}년` },
              { label: "시공사", value: apt.construction },
              { label: "주차 대수", value: apt.parking },
              { label: "용적률", value: apt.floor_area_ratio },
              { label: "난방 방식", value: apt.heating },
            ].map((item) => (
              <div key={item.label} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="text-[11px] text-slate-400 mb-0.5">{item.label}</div>
                <div className="font-bold text-slate-800 text-sm">{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== 입지 분석 + 교통/학교 ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-5">
            <h3 className="text-lg font-bold text-slate-900">⭐ 입지 분석</h3>
            {[
              { label: "🎓 학군 입지", score: apt.school_score, color: "bg-blue-600", text: "text-blue-600" },
              { label: "🚇 교통/역세권", score: apt.traffic_score, color: "bg-indigo-500", text: "text-indigo-600" },
              { label: "🌳 쾌적성/공원", score: apt.nature_score, color: "bg-emerald-500", text: "text-emerald-600" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm font-semibold mb-1.5">
                  <span className="text-slate-700">{item.label}</span>
                  <span className={item.text}>{item.score}점</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.score}%` }} />
                </div>
              </div>
            ))}
            <div className="pt-3 border-t border-slate-100 text-center">
              <div className="text-xs text-slate-400 mb-1">종합 점수</div>
              <div className="text-3xl font-black text-blue-600">
                {Math.round((apt.school_score + apt.traffic_score + apt.nature_score) / 3)}
                <span className="text-base font-medium text-slate-400 ml-1">/ 100</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">🚇 교통 및 학교</h3>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-sm font-semibold text-slate-800">
              {apt.station}
            </div>
            <div className="space-y-2">
              {apt.schools?.map((s: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-3 py-2.5 rounded-xl border border-slate-100">
                  <span className="text-blue-500">🏫</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
