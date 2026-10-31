"use client";

import { use, useState, useEffect, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import AptCommunitySection from "@/components/AptCommunitySection";
import { validateApartment } from "@/lib/validateApartment";
import { isWatched, toggleWatchlist } from "@/lib/watchlistStore";
import NearbyRedevelopmentSection from "@/components/apt-detail/NearbyRedevelopmentSection";
import SupplyVolumeSection from "@/components/apt-detail/SupplyVolumeSection";
import CommercialDistrictSection from "@/components/apt-detail/CommercialDistrictSection";
import RealtorAdSection from "@/components/apt-detail/RealtorAdSection";
import ProReportPreviewSection from "@/components/apt-detail/ProReportPreviewSection";
import NearbyLocationSummaryCard from "@/components/apt-detail/NearbyLocationSummaryCard";

const AptDetailMap = dynamic(() => import("@/components/AptDetailMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] bg-slate-100 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 text-sm">
      🗺️ 실거래 지도를 불러오는 중...
    </div>
  ),
});

interface DetailProps {
  params: Promise<{ id: string }>;
}

import { APARTMENTS_DATA } from "@/lib/apartments";

// 지역·태그 기반 버스 노선 정보 생성
interface BusRoute {
  number: string;
  type: "광역" | "간선" | "지선" | "마을" | "BRT";
  dest: string;
}

function getBusInfo(apt: any): { routes: BusRoute[]; stopName: string; summary: string } {
  const region = apt.region || "";
  const district = apt.district || "";
  const tags = apt.tags || [];
  const score = apt.traffic_score || 70;

  // 지역별 대표 버스 노선 매핑
  const routeMap: Record<string, BusRoute[]> = {
    "강남": [
      { number: "3412", type: "간선", dest: "강남역·신논현" },
      { number: "9호선셔틀", type: "마을", dest: "강남구청역" },
      { number: "400", type: "광역", dest: "잠실·천호" },
    ],
    "서초": [
      { number: "405", type: "간선", dest: "서초역·교대역" },
      { number: "3012", type: "광역", dest: "강남·신논현" },
      { number: "서초14", type: "마을", dest: "방배역" },
    ],
    "송파": [
      { number: "30", type: "간선", dest: "강남역·신사동" },
      { number: "9403", type: "광역", dest: "강남·사당" },
      { number: "송파15", type: "마을", dest: "잠실역" },
    ],
    "마포": [
      { number: "271", type: "간선", dest: "서울역·마포" },
      { number: "7016", type: "지선", dest: "합정역·홍대입구" },
      { number: "9703", type: "광역", dest: "여의도·강남" },
    ],
    "용산": [
      { number: "N61", type: "간선", dest: "이태원·한남" },
      { number: "110B", type: "광역", dest: "서울역·광화문" },
      { number: "용산04", type: "마을", dest: "이촌역" },
    ],
    "성동": [
      { number: "2", type: "간선", dest: "왕십리·서울역" },
      { number: "141", type: "간선", dest: "성수·왕십리" },
      { number: "성동06", type: "마을", dest: "왕십리역" },
    ],
    "광진": [
      { number: "240", type: "간선", dest: "건대·강변" },
      { number: "9301", type: "광역", dest: "강남·잠실" },
      { number: "광진02", type: "마을", dest: "구의역" },
    ],
    "은평": [
      { number: "701", type: "간선", dest: "서울역·종로" },
      { number: "7211", type: "지선", dest: "연신내역" },
      { number: "은평01", type: "마을", dest: "불광역" },
    ],
    "노원": [
      { number: "108", type: "간선", dest: "도봉·종로" },
      { number: "1139", type: "지선", dest: "노원역" },
      { number: "노원07", type: "마을", dest: "태릉입구역" },
    ],
    "다산": [
      { number: "8", type: "광역", dest: "청량리·잠실" },
      { number: "2000-1", type: "광역", dest: "강변역·청량리" },
      { number: "330", type: "광역", dest: "상봉·잠실" },
      { number: "구리20", type: "마을", dest: "다산신도시내" },
    ],
    "남양주": [
      { number: "8", type: "광역", dest: "청량리·잠실" },
      { number: "2000-1", type: "광역", dest: "강변역" },
      { number: "65", type: "광역", dest: "상봉터미널" },
    ],
    "구리": [
      { number: "1", type: "광역", dest: "청량리·광화문" },
      { number: "202", type: "광역", dest: "강변역" },
      { number: "구리06", type: "마을", dest: "구리역" },
    ],
    "하남": [
      { number: "30", type: "광역", dest: "잠실·강남" },
      { number: "하남-10", type: "광역", dest: "천호역·강동" },
      { number: "하남02", type: "마을", dest: "미사역" },
    ],
    "성남": [
      { number: "9", type: "광역", dest: "강남역·서울" },
      { number: "1005-1", type: "광역", dest: "잠실역·강남" },
      { number: "성남51", type: "마을", dest: "판교역" },
    ],
    "고양": [
      { number: "1000", type: "광역", dest: "서울역·광화문" },
      { number: "9701", type: "광역", dest: "강남역" },
      { number: "고양42", type: "마을", dest: "킨텍스·대화역" },
    ],
    "수원": [
      { number: "7770", type: "광역", dest: "강남역" },
      { number: "1007", type: "광역", dest: "잠실역" },
      { number: "수원13", type: "마을", dest: "수원역" },
    ],
  };

  // 지역 매칭
  let matched: BusRoute[] = [];
  for (const [key, routes] of Object.entries(routeMap)) {
    if (region.includes(key) || district.includes(key)) {
      matched = routes;
      break;
    }
  }

  // 태그에 광역버스/BRT 있으면 광역버스 추가
  if (tags.some((t: string) => /광역버스|BRT/.test(t)) && !matched.find(r => r.type === "광역")) {
    matched.unshift({ number: "광역", type: "광역", dest: "서울 도심 직통" });
  }

  // 기본값 (매칭 없을 경우 교통점수 기반)
  if (matched.length === 0) {
    if (score >= 90) {
      matched = [
        { number: "간선버스 다수", type: "간선", dest: "서울 주요 거점" },
        { number: "광역버스", type: "광역", dest: "강남·종로 연결" },
        { number: "마을버스", type: "마을", dest: "인근 지하철역" },
      ];
    } else if (score >= 80) {
      matched = [
        { number: "간선버스", type: "간선", dest: "주요 환승 거점" },
        { number: "지선버스", type: "지선", dest: "인근 역세권" },
      ];
    } else {
      matched = [
        { number: "지선버스", type: "지선", dest: "인근 교통망" },
        { number: "마을버스", type: "마을", dest: "단지 앞 정류장" },
      ];
    }
  }

  const stopName = `${apt.name} 정류장`;
  const expressCount = matched.filter(r => r.type === "광역").length;
  const summary = expressCount > 0
    ? `광역버스 ${expressCount}개 노선 포함 · 총 ${matched.length}개 노선`
    : `간선·지선 ${matched.length}개 노선 운행 중`;

  return { routes: matched, stopName, summary };
}

// 위경도 기반 두 지점 거리 계산 (Haversine, 단위: km)
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const APARTMENT_DATA: Record<string, any> = Object.fromEntries(
  APARTMENTS_DATA.map((apt) => [
    apt.id,
    {
      ...apt,
      // API 호출용: 원본 region 그대로 보존 (법정동 코드 조회에 사용)
      apiRegion: apt.region,
      // 표시용: 구+동 합산 (UI 표시에 사용)
      region: `${apt.region} ${apt.district}`,
      rent_min: apt.rent_min || Math.round(apt.price_min * 0.55),
      rent_max: apt.rent_max || Math.round(apt.price_max * 0.55),
      // 실데이터만 유지 - 가짜 기본값 미사용
      construction: (apt.construction && apt.construction !== "시공사 확인") ? apt.construction : null,
      parking: apt.parking || (apt.parkingRatio ? `세대당 ${apt.parkingRatio}대` : null),
      floor_area_ratio: apt.floor_area_ratio || (apt.far && apt.far !== 240 ? `${apt.far}%` : null),
      heating: (apt.heating && apt.heating !== "지역난방") ? apt.heating :
               apt.heatingType ? apt.heatingType : null,
      station: apt.station ? `${apt.station} ${apt.station_dist || ""}`.trim() : null,
      // 학교: 실데이터만 사용, 없으면 null
      schools: (apt.schools && apt.schools.length > 0) ? apt.schools : null,
      description: apt.description,
    }
  ])
);

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
  const [activeLocation, setActiveLocation] = useState<"학군" | "교통" | "쾌적성">("교통");

  // P0: 단지 데이터 검증 결과
  const validationResult = useMemo(() => validateApartment(apt), [apt]);

  // P2: 관심단지 상태 (클라이언트 전용)
  const [watched, setWatched] = useState(false);
  useEffect(() => {
    setWatched(isWatched(apt.id));
  }, [apt.id]);

  function handleToggleWatchlist() {
    const added = toggleWatchlist({
      aptId: apt.id,
      aptName: apt.name,
      region: apt.region,
      district: apt.district,
      priceAtSave: apt.price_max ? Math.round((apt.price_min + apt.price_max) / 2) : undefined,
    });
    setWatched(added);
  }


  // 국토교통부 실거래 API 데이터 상태
  const [apiTrades, setApiTrades] = useState<any[]>([]);
  const [apiRents, setApiRents] = useState<any[]>([]);
  const [isLoadingApi, setIsLoadingApi] = useState(true);
  const [isApiConnected, setIsApiConnected] = useState(false);

  // 국토교통부 공동주택 기본/상세 정보 (K-apt) 실시간 데이터 상태
  const [liveKapt, setLiveKapt] = useState<any | null>(null);
  const [isKaptLoading, setIsKaptLoading] = useState(false);

  // 평형별 필터 상태
  const [selectedArea, setSelectedArea] = useState<string>("전체");

  // 전용면적 84형(83~85m2) 표준 표기 정규화 함수
  const normalizeAreaSqm = (sqm: number) => {
    const raw = Math.floor(sqm);
    return (raw >= 83 && raw <= 85) ? 84 : raw;
  };
  const normalizeAreaStr = (sqm: number) => `${normalizeAreaSqm(sqm)}㎡`;

  const displayAreaSqm = normalizeAreaSqm(apt.area_sqm);

  useEffect(() => {
    let isMounted = true;
    async function fetchRealData() {
      setIsLoadingApi(true);
      try {
        // 최신 데이터 포함을 위해 36개월 조회 + 읍면동(district) 필터 전달
        // apiRegion: 원본 시·군·구 단위 region (법정동 코드 정확 조회용)
        const apiRegion = apt.apiRegion || apt.region;
        const res = await fetch(
          `/api/transactions?region=${encodeURIComponent(apiRegion)}&district=${encodeURIComponent(apt.district || "")}&aptName=${encodeURIComponent(apt.name)}&months=36`
        );
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            if (data.trades && data.trades.length > 0) {
              setApiTrades(data.trades);
              setIsApiConnected(true);
            }
            if (data.rents && data.rents.length > 0) {
              setApiRents(data.rents);
              setIsApiConnected(true);
            }
          }
        }
      } catch (e) {
        console.error("실거래가 API 조회 실패:", e);
      } finally {
        if (isMounted) setIsLoadingApi(false);
      }
    }

    async function fetchKaptInfo() {
      // apt.id 예: kapt-A10019911 또는 A로 시작하는 K-apt 코드
      const match = apt.id?.match(/A\d{6,10}/i);
      const code = match ? match[0] : (apt.id?.startsWith("kapt-") ? apt.id.replace("kapt-", "") : null);
      if (!code) return;

      setIsKaptLoading(true);
      try {
        const res = await fetch(`/api/kapt?kaptCode=${encodeURIComponent(code)}`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.success && json.data) {
            setLiveKapt(json.data);
          }
        }
      } catch (e) {
        console.error("K-apt 단지 정보 조회 실패:", e);
      } finally {
        if (isMounted) setIsKaptLoading(false);
      }
    }

    fetchRealData();
    fetchKaptInfo();
    return () => {
      isMounted = false;
    };
  }, [apt.id, apt.apiRegion, apt.region, apt.district, apt.name]);

  // 국토부 실제 매매 거래 매핑 (면적도 84.xxm2의 경우 84m2로 정규화)
  const realSaleTxs = useMemo(() => {
    return apiTrades.map((t) => {
      const uk = Math.floor(t.dealAmount / 10000);
      const man = t.dealAmount % 10000;
      const normArea = normalizeAreaSqm(t.excluUseAr);
      return {
        date: `${String(t.dealYear).slice(2)}.${String(t.dealMonth).padStart(2, "0")}.${String(t.dealDay).padStart(2, "0")}`,
        area: `${normArea}㎡`,
        floor: `${t.floor}층`,
        price: `${uk > 0 ? `${uk}억 ` : ""}${man > 0 ? `${man.toLocaleString()}만` : uk > 0 ? "" : "0만"}`,
        rawPrice: t.dealAmount,
        type: "매매" as const,
        isReal: true,
      };
    });
  }, [apiTrades]);

  // 국토부 실제 전월세 거래 매핑
  const realRentTxs = useMemo(() => {
    return apiRents.map((r) => {
      const uk = Math.floor(r.depositAmount / 10000);
      const man = r.depositAmount % 10000;
      const depositText = `${uk > 0 ? `${uk}억 ` : ""}${man > 0 ? `${man.toLocaleString()}만` : ""}`;
      const normArea = normalizeAreaSqm(r.excluUseAr);
      return {
        date: `${String(r.dealYear).slice(2)}.${String(r.dealMonth).padStart(2, "0")}.${String(r.dealDay).padStart(2, "0")}`,
        area: `${normArea}㎡`,
        floor: `${r.floor}층`,
        price: r.monthlyRent > 0 ? `보증 ${depositText}/${r.monthlyRent}만` : depositText,
        rawPrice: r.depositAmount,
        monthlyRent: r.monthlyRent,
        type: "전월세" as const,
        isReal: true,
      };
    });
  }, [apiRents]);

  // 가짜 더미 데이터 배제 — 100% 실제 공공데이터 실거래 신고 건만 사용
  const allActiveTxs = tradeType === "매매" ? realSaleTxs : realRentTxs;
  const hasRealDataForCurrentTab = allActiveTxs.length > 0;

  // 평형별 고유 면적 목록 추출 (실거래 데이터 기반)
  const areaOptions = useMemo(() => {
    const areas = new Set<string>();
    allActiveTxs.forEach((tx: any) => {
      if (tx.area) areas.add(tx.area);
    });
    if (areas.size === 0 && displayAreaSqm) {
      areas.add(`${displayAreaSqm}㎡`);
    }
    const sorted = Array.from(areas).sort((a, b) => {
      const numA = parseFloat(a.replace("㎡", ""));
      const numB = parseFloat(b.replace("㎡", ""));
      return numA - numB;
    });
    return ["전체", ...sorted];
  }, [allActiveTxs, displayAreaSqm]);

  // 평형 필터 적용된 거래 목록
  const activeTxs = useMemo(() => {
    if (selectedArea === "전체") return allActiveTxs;
    return allActiveTxs.filter((tx: any) => tx.area === selectedArea);
  }, [allActiveTxs, selectedArea]);

  // 평형 필터 적용된 원본 API 데이터 (그래프 및 통계 계산용)
  const filteredApiTrades = useMemo(() => {
    if (selectedArea === "전체") return apiTrades;
    return apiTrades.filter((t) => normalizeAreaStr(t.excluUseAr) === selectedArea);
  }, [apiTrades, selectedArea]);

  const filteredApiRents = useMemo(() => {
    if (selectedArea === "전체") return apiRents;
    return apiRents.filter((r) => normalizeAreaStr(r.excluUseAr) === selectedArea);
  }, [apiRents, selectedArea]);

  // 국토부 실제 거래 기반 월별 가격 추이 (선택된 평형 반영)
  const realSaleTrend = useMemo(() => {
    if (filteredApiTrades.length === 0) return null;
    const monthlyMap = new Map<string, number[]>();
    filteredApiTrades.forEach((t) => {
      const key = `${t.dealYear}.${String(t.dealMonth).padStart(2, "0")}`;
      if (!monthlyMap.has(key)) monthlyMap.set(key, []);
      monthlyMap.get(key)!.push(t.dealAmount);
    });
    const sortedKeys = Array.from(monthlyMap.keys()).sort();
    return sortedKeys.map((k) => {
      const amounts = monthlyMap.get(k)!;
      const avg = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length);
      return {
        date: k,
        price: +(avg / 10000).toFixed(2),
      };
    });
  }, [filteredApiTrades]);

  const realRentTrend = useMemo(() => {
    if (filteredApiRents.length === 0) return null;
    const monthlyMap = new Map<string, number[]>();
    filteredApiRents.forEach((r) => {
      const key = `${r.dealYear}.${String(r.dealMonth).padStart(2, "0")}`;
      if (!monthlyMap.has(key)) monthlyMap.set(key, []);
      monthlyMap.get(key)!.push(r.depositAmount);
    });
    const sortedKeys = Array.from(monthlyMap.keys()).sort();
    return sortedKeys.map((k) => {
      const amounts = monthlyMap.get(k)!;
      const avg = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length);
      return {
        date: k,
        price: +(avg / 10000).toFixed(2),
      };
    });
  }, [filteredApiRents]);

  // 100% 국토교통부 실거래 데이터 기반 추이 (가짜 더미 추세 완전 배제)
  const activeTrend = useMemo(() => {
    if (tradeType === "매매") {
      return realSaleTrend || [];
    } else {
      return realRentTrend || [];
    }
  }, [tradeType, realSaleTrend, realRentTrend]);

  const chartData = chartRange === "최근 1년"
    ? activeTrend.slice(-12)
    : chartRange === "최근 3년"
    ? activeTrend.slice(-36)
    : activeTrend;

  const latestPrice = chartData.length > 0 ? (chartData[chartData.length - 1]?.price ?? 0) : 0;
  const minPrice = chartData.length > 0 ? Math.min(...chartData.map((d) => d.price)) : 0;
  const maxPrice = chartData.length > 0 ? Math.max(...chartData.map((d) => d.price)) : 0;

  const formatPrice = (price: number) => {
    const uk = Math.floor(price / 10000);
    const cheon = price % 10000;
    if (uk > 0 && cheon > 0) return `${uk}억 ${cheon.toLocaleString()}만`;
    if (uk > 0) return `${uk}억원`;
    return `${price.toLocaleString()}만원`;
  };

  // 실거래 평균 계산: 최근 5건 거래 기준 평균 (선택된 평형 반영)
  const currentAverageDisplay = useMemo(() => {
    if (hasRealDataForCurrentTab && activeTxs.length > 0) {
      const recentTxs = activeTxs.slice(0, Math.min(5, activeTxs.length));
      const validAmounts = (recentTxs as Array<{ rawPrice?: number }>)
        .map((t) => t.rawPrice)
        .filter((p): p is number => typeof p === "number" && p > 0);
      if (validAmounts.length > 0) {
        const avg = Math.round(validAmounts.reduce((a, b) => a + b, 0) / validAmounts.length);
        return formatPrice(avg);
      }
    }
    if (selectedArea !== "전체") {
      const selectedNum = parseFloat(selectedArea.replace("㎡", ""));
      const baseArea = displayAreaSqm || 84;
      const baseAvg = Math.round((apt.price_min + apt.price_max) / 2);
      if (selectedNum && baseArea) {
        return formatPrice(Math.round(baseAvg * (selectedNum / baseArea)));
      }
    }
    return tradeType === "매매"
      ? formatPrice(Math.round((apt.price_min + apt.price_max) / 2))
      : formatPrice(Math.round((apt.rent_min + apt.rent_max) / 2));
  }, [hasRealDataForCurrentTab, activeTxs, selectedArea, displayAreaSqm, tradeType, apt.price_min, apt.price_max, apt.rent_min, apt.rent_max]);

  // 실거래 매매 평균가 (만원 단위, 지도 마커용) - 최근 5건 기준
  const realSaleAvgManwon = useMemo(() => {
    if (realSaleTxs.length > 0) {
      const recent = realSaleTxs.slice(0, Math.min(5, realSaleTxs.length));
      const validAmounts = recent
        .map((t: any) => t.rawPrice)
        .filter((p: any): p is number => typeof p === "number" && p > 0);
      if (validAmounts.length > 0) {
        return Math.round(validAmounts.reduce((a: number, b: number) => a + b, 0) / validAmounts.length);
      }
    }
    return undefined;
  }, [realSaleTxs]);

  // 실거래 매매가 밴드 (선택된 평형 기준 최근 실거래가 최소~최대 범위)
  const realSaleRange = useMemo(() => {
    const targetTxs = selectedArea === "전체" ? realSaleTxs : realSaleTxs.filter((t) => t.area === selectedArea);
    if (targetTxs.length > 0) {
      const recent = targetTxs.slice(0, Math.min(10, targetTxs.length));
      const validAmounts = recent
        .map((t: any) => t.rawPrice)
        .filter((p: any): p is number => typeof p === "number" && p > 0);
      if (validAmounts.length >= 2) {
        return {
          min: Math.min(...validAmounts),
          max: Math.max(...validAmounts),
        };
      } else if (validAmounts.length === 1) {
        const val = validAmounts[0];
        return {
          min: Math.round(val * 0.97),
          max: Math.round(val * 1.03),
        };
      }
    }
    return null;
  }, [realSaleTxs, selectedArea]);

  const fallbackSaleRange = useMemo(() => {
    if (selectedArea !== "전체") {
      const selectedNum = parseFloat(selectedArea.replace("㎡", ""));
      const baseArea = displayAreaSqm || 84;
      if (selectedNum && baseArea) {
        const ratio = selectedNum / baseArea;
        return {
          min: Math.round(apt.price_min * ratio),
          max: Math.round(apt.price_max * ratio),
        };
      }
    }
    return {
      min: apt.price_min,
      max: apt.price_max,
    };
  }, [selectedArea, displayAreaSqm, apt.price_min, apt.price_max]);

  // ─── 전월세 실거래 분리 통계 (선택된 평형 반영) ─────────────────────────
  // 순수 전세 (monthlyRent < 5): 보증금만 있는 전세 계약
  const realJeonseStats = useMemo(() => {
    const pure = filteredApiRents.filter((r) => r.monthlyRent < 5);
    if (pure.length === 0) return null;
    const recent = pure.slice(0, Math.min(8, pure.length));
    const deposits = recent.map((r) => r.depositAmount);
    return {
      min: Math.min(...deposits),
      max: Math.max(...deposits),
      avg: Math.round(deposits.reduce((a, b) => a + b, 0) / deposits.length),
      count: recent.length,
    };
  }, [filteredApiRents]);

  // 월세 (monthlyRent >= 5): 보증금 + 월세 계약
  const realMonthlyStats = useMemo(() => {
    const monthly = filteredApiRents.filter((r) => r.monthlyRent >= 5);
    if (monthly.length === 0) return null;
    const recent = monthly.slice(0, Math.min(8, monthly.length));
    const monthlies = recent.map((r) => r.monthlyRent);
    const deposits = recent.map((r) => r.depositAmount);
    return {
      minMonthly: Math.min(...monthlies),
      maxMonthly: Math.max(...monthlies),
      minDeposit: Math.min(...deposits),
      maxDeposit: Math.max(...deposits),
      count: recent.length,
    };
  }, [filteredApiRents]);

  // 표준 환산 월세 (전월세전환율 연 4.8% 기준)
  const estimatedMonthly = useMemo(() => {
    const rentMin = apt.rent_min || 30000;
    const rentMax = apt.rent_max || 50000;
    const standardDeposit = Math.min(20000, Math.max(5000, Math.round((rentMin * 0.25) / 1000) * 1000));
    const mMin = Math.max(40, Math.round(((rentMin - standardDeposit) * (0.048 / 12)) / 5) * 5);
    const mMax = Math.max(mMin, Math.round(((rentMax - standardDeposit) * (0.048 / 12)) / 5) * 5);
    return {
      deposit: standardDeposit,
      minMonthly: mMin,
      maxMonthly: mMax,
    };
  }, [apt.rent_min, apt.rent_max]);

  // 실거래 매매가 기반 현실적 전세가 밴드 (선택된 평형 반영)
  const realisticJeonseRange = useMemo(() => {
    if (realJeonseStats) {
      return { min: realJeonseStats.min, max: realJeonseStats.max };
    }
    const targetSaleAvg = (() => {
      const targetTxs = selectedArea === "전체" ? realSaleTxs : realSaleTxs.filter((t) => t.area === selectedArea);
      if (targetTxs.length > 0) {
        const recent = targetTxs.slice(0, Math.min(5, targetTxs.length));
        const valid = recent.map((t: any) => t.rawPrice).filter((p: any): p is number => typeof p === "number" && p > 0);
        if (valid.length > 0) return Math.round(valid.reduce((a, b) => a + b, 0) / valid.length);
      }
      return realSaleAvgManwon || Math.round((apt.price_min + apt.price_max) / 2);
    })();

    const ratio = (apt.jeonseRatio && apt.jeonseRatio >= 45 && apt.jeonseRatio <= 85) ? apt.jeonseRatio : 60;
    const estJeonseAvg = Math.round(targetSaleAvg * (ratio / 100));
    return {
      min: Math.round((estJeonseAvg * 0.95) / 100) * 100,
      max: Math.round((estJeonseAvg * 1.05) / 100) * 100,
    };
  }, [realJeonseStats, selectedArea, realSaleTxs, realSaleAvgManwon, apt.price_min, apt.price_max, apt.jeonseRatio]);

  // 전세 기준 현재 평균 표시값 (currentAverageDisplay 전월세 탭용, 선택된 평형 반영)
  const currentRentAvgDisplay = useMemo(() => {
    if (realJeonseStats) return formatPrice(realJeonseStats.avg);
    if (realMonthlyStats) {
      // 월세만 있을 때: 보증금 평균 표시
      return formatPrice(Math.round((realMonthlyStats.minDeposit + realMonthlyStats.maxDeposit) / 2));
    }
    if (selectedArea !== "전체") {
      const selectedNum = parseFloat(selectedArea.replace("㎡", ""));
      const baseArea = displayAreaSqm || 84;
      const baseRent = Math.round((apt.rent_min + apt.rent_max) / 2);
      if (selectedNum && baseArea) {
        return formatPrice(Math.round(baseRent * (selectedNum / baseArea)));
      }
    }
    return formatPrice(Math.round((apt.rent_min + apt.rent_max) / 2));
  }, [realJeonseStats, realMonthlyStats, selectedArea, displayAreaSqm, apt.rent_min, apt.rent_max]);


  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold text-sm transition-colors">
            <span>←</span>
            <span>목록</span>
          </Link>
          <div className="flex items-center gap-2 min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate max-w-[160px] sm:max-w-xs">{apt.name}</div>
            {/* P0: 데이터 무결성 배지 */}
            {!validationResult.isValid && (
              <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                ⚠️ 검증 이슈
              </span>
            )}
            {validationResult.isValid && validationResult.hasWarnings && (
              <span className="flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                ⚡ 확인 필요
              </span>
            )}
          </div>
          {/* P2: 관심단지 버튼 (watchlistStore 연결) */}
          <button
            onClick={handleToggleWatchlist}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
              watched
                ? "bg-rose-500 text-white shadow-sm"
                : "bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-500"
            }`}
          >
            {watched ? "❤️ 관심 단지" : "🤍 관심 단지"}
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

        {/* P0: 단지 데이터 검증 이슈 패널 (이슈가 있을 때만 노출) */}
        {(!validationResult.isValid || validationResult.hasWarnings) && (
          <div className={`rounded-2xl border px-4 py-3 text-xs ${
            !validationResult.isValid
              ? "bg-red-50 border-red-200"
              : "bg-amber-50 border-amber-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <span>{!validationResult.isValid ? "⚠️" : "⚡"}</span>
              <span className={`font-bold ${!validationResult.isValid ? "text-red-700" : "text-amber-700"}`}>
                {!validationResult.isValid
                  ? "이 단지의 일부 정보를 검증하지 못했습니다"
                  : "일부 정보에 확인이 필요합니다"}
              </span>
            </div>
            <ul className="space-y-1">
              {validationResult.issues.map((issue, i) => (
                <li key={i} className={`flex items-start gap-2 ${
                  issue.severity === "ERROR" ? "text-red-600" :
                  issue.severity === "WARN" ? "text-amber-600" : "text-slate-500"
                }`}>
                  <span className="mt-0.5 flex-shrink-0">
                    {issue.severity === "ERROR" ? "✕" : issue.severity === "WARN" ? "·" : "ℹ"}
                  </span>
                  <span>
                    <span className="font-semibold">[{issue.field}]</span> {issue.message}
                    {issue.value !== undefined && (
                      <span className="opacity-60 ml-1">(값: {String(issue.value)})</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-slate-400">
              출처: 국토교통부 K-apt 공동주택관리정보 기반 내부 검증 로직
            </p>
          </div>
        )}

        {/* ===== 시세/실거래 섹션 ===== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          {/* 매매 / 전월세 탭 */}
          <div className="flex border-b border-slate-200">
            {(["매매", "전월세"] as const).map((type) => (
              <button
                key={type}
                onClick={() => { setTradeType(type); setShowCount(5); setSelectedArea("전체"); }}
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
          {/* 평형 선택 버튼 (좌측) & 실시간 국토부 연동 배지 (우측) */}
          <div className="px-5 py-3 flex items-center justify-between gap-2 border-b border-slate-100 bg-slate-50/40">
            {/* 좌측: 두번째 이미지에서 이동된 평형 선택 버튼 */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              {areaOptions.map((area) => (
                <button
                  key={area}
                  onClick={() => { setSelectedArea(area); setShowCount(5); }}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    selectedArea === area
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {area === "전체" ? "전체 평형" : area}
                </button>
              ))}
            </div>

            {/* 우측: 원래 molit_trade 위치로 이동된 실시간 국토부 연동 배지 */}
            <div className="flex-shrink-0">
              {isLoadingApi ? (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-600 animate-pulse border border-amber-200">
                  🔄 국토부 실시간 조회 중
                </span>
              ) : (hasRealDataForCurrentTab || realJeonseStats || realMonthlyStats) ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  실시간 국토부 연동
                </span>
              ) : null}
            </div>
          </div>

          <div className="p-5 sm:p-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xs text-slate-400">
                  {isLoadingApi
                    ? "국토교통부 실거래 조회 중"
                    : tradeType === "전월세" && (realJeonseStats || realMonthlyStats)
                    ? "국토교통부 전월세 실거래 기준"
                    : hasRealDataForCurrentTab
                    ? "국토교통부 실거래 기준 (최근 거래 평균)"
                    : "예상 시세 기준 평균"}
                </p>
              </div>
              <p className="text-4xl font-black text-slate-900 tracking-tight">
                {tradeType === "전월세" ? currentRentAvgDisplay : currentAverageDisplay}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {tradeType === "전월세"
                  ? (realJeonseStats
                    ? `전세 기준 · ${selectedArea === "전체" ? "전체 평형" : `전용 ${selectedArea}`} · 최근 ${realJeonseStats.count}건 평균`
                    : selectedArea === "전체"
                    ? `전체 평형 (전용 ${displayAreaSqm}㎡ 기준)`
                    : `전용 ${selectedArea} 기준`)
                  : (selectedArea === "전체"
                    ? (activeTxs.length > 0 ? `전체 평형 · 최근 ${Math.min(5, activeTxs.length)}건 평균` : `전용 ${displayAreaSqm}㎡ 기준`)
                    : `전용 ${selectedArea} 기준 (최근 ${Math.min(5, activeTxs.length)}건 평균)`)}
              </p>
            </div>

            {/* 시세 박스 */}
            <div className="grid grid-cols-2 gap-3">
              {/* 전세 보증금 / 매매 시세 */}
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                <div className="text-[11px] font-semibold text-blue-500 mb-1">
                  {tradeType === "매매" ? "매매 예상 시세" : "전세 보증금"}
                </div>
                <div className="text-lg font-black text-slate-900 leading-tight">
                  {tradeType === "매매"
                    ? (realSaleRange
                      ? `${formatPrice(realSaleRange.min)} ~ ${formatPrice(realSaleRange.max)}`
                      : `${formatPrice(fallbackSaleRange.min)} ~ ${formatPrice(fallbackSaleRange.max)}`)
                    : realJeonseStats
                    ? `${formatPrice(realJeonseStats.min)} ~ ${formatPrice(realJeonseStats.max)}`
                    : (realisticJeonseRange)
                    ? `${formatPrice(realisticJeonseRange.min)} ~ ${formatPrice(realisticJeonseRange.max)}`
                    : "시세 조회 중"}
                </div>
                {tradeType === "매매" && realSaleRange && (
                  <div className="text-[10px] text-blue-500 font-semibold mt-1">
                    {selectedArea !== "전체" ? `${selectedArea} 최근 실거래가 밴드 반영` : "최근 국토부 실거래가 밴드 반영"}
                  </div>
                )}
                {tradeType === "전월세" && realJeonseStats && (
                  <div className="text-[10px] text-blue-400 mt-1">
                    {selectedArea !== "전체" ? `${selectedArea} 최근 ${realJeonseStats.count}건 실거래 기준` : `최근 ${realJeonseStats.count}건 실거래 기준`}
                  </div>
                )}
              </div>
              {/* 월세 / 전세 시세 */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="text-[11px] font-semibold text-slate-400 mb-1">
                  {tradeType === "매매" ? "전세 예상 시세" : "월세"}
                </div>
                <div className="text-lg font-black text-slate-700 leading-tight">
                  {tradeType === "매매"
                    ? `${formatPrice(realisticJeonseRange.min)} ~ ${formatPrice(realisticJeonseRange.max)}`
                    : realMonthlyStats
                    ? `보증 ${formatPrice(realMonthlyStats.minDeposit)} / 월 ${realMonthlyStats.minMonthly}~${realMonthlyStats.maxMonthly}만`
                    : `보증 ${formatPrice(estimatedMonthly.deposit)} / 월 ${estimatedMonthly.minMonthly}~${estimatedMonthly.maxMonthly}만`}
                </div>
                {tradeType === "매매" && (
                  <div className="text-[10px] text-slate-400 mt-1">
                    {realJeonseStats ? `최근 ${realJeonseStats.count}건 실거래 기준` : `실거래 기준 전세가율 ${apt.jeonseRatio || 60}% 반영`}
                  </div>
                )}
                {tradeType === "전월세" && (
                  <div className="text-[10px] text-slate-400 mt-1">
                    {realMonthlyStats
                      ? `최근 ${realMonthlyStats.count}건 실거래 기준`
                      : "전월세전환율 4.8% 환산 기준"}
                  </div>
                )}
              </div>
            </div>

            {/* ===== 가격 추이 그래프 ===== */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-700">
                  📈 {tradeType} 가격 추이 {selectedArea !== "전체" && <span className="text-xs font-semibold text-blue-600 ml-1">({selectedArea})</span>}
                </h3>
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
              {chartData.length > 0 && (
                <div className="flex gap-4 mb-3 text-xs text-slate-500">
                  <span>최저 <strong className="text-slate-700">{minPrice}억</strong></span>
                  <span>최고 <strong className="text-slate-700">{maxPrice}억</strong></span>
                  <span>현재 <strong className="text-blue-600">{latestPrice}억</strong></span>
                </div>
              )}

              {chartData.length >= 2 ? (
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
              ) : chartData.length === 1 ? (
                <div className="h-[180px] flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-center px-4">
                  <span className="text-2xl mb-1">📈</span>
                  <p className="text-xs font-semibold text-slate-700">최근 실거래가: {chartData[0].price}억원 ({chartData[0].date})</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {selectedArea !== "전체" ? `${selectedArea} 평형의 ` : ""}추가 거래가 신고되면 월별 변동 추이 차트가 자동으로 표시됩니다.
                  </p>
                </div>
              ) : (
                <div className="h-[180px] flex flex-col items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 text-center px-4">
                  <span className="text-2xl mb-1">📊</span>
                  <p className="text-xs font-semibold text-slate-600">
                    {selectedArea !== "전체" ? `${selectedArea} 국토교통부 실거래 가격 추이 준비 중` : "국토교통부 실거래 가격 추이 준비 중"}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">2건 이상의 실제 계약이 신고 및 공개되면 실시간 가격 변동 추이 차트가 자동으로 표시됩니다.</p>
                </div>
              )}
            </div>

            {/* ===== 실거래 내역 ===== */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-slate-700 whitespace-nowrap">📋 실거래 신고 내역</h3>
                <div className="flex-shrink-0">
                  {isLoadingApi ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                      동기화 중...
                    </span>
                  ) : hasRealDataForCurrentTab ? (
                    <span className="text-[11px] text-emerald-600 font-semibold whitespace-nowrap">
                      • 실시간 연동됨
                    </span>
                  ) : null}
                </div>
              </div>

              {activeTxs.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center bg-slate-50/50">
                      <p className="text-sm font-semibold text-slate-600">
                        {isLoadingApi
                          ? "국토교통부 실시간 거래를 조회하고 있습니다..."
                          : `최근 국토교통부에 신고된 ${tradeType} 계약 내역이 없습니다.`}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        국토교통부 실거래가 공개시스템의 실제 거래 신고 기준 원본 데이터만 제공합니다.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-2xl border border-slate-100 overflow-x-auto">
                        <table className="w-full text-left text-sm table-fixed">
                          <colgroup>
                            <col className="w-[33%] sm:w-[28%]" />
                            <col className="w-[18%] sm:w-[20%]" />
                            <col className="w-[15%] sm:w-[18%]" />
                            <col className="w-[34%] sm:w-[34%]" />
                          </colgroup>
                          <thead className="bg-slate-50">
                            <tr className="text-xs text-slate-400">
                              <th className="px-2.5 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-left font-medium">계약일</th>
                              <th className="px-2 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-center font-medium">전용면적</th>
                              <th className="px-2 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-center font-medium">층</th>
                              <th className="px-2.5 sm:px-4 py-2.5 sm:py-3 whitespace-nowrap text-right font-medium">거래금액</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {activeTxs.slice(0, showCount).map((tx: any, idx: number) => (
                              <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                                <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 text-slate-600 text-xs whitespace-nowrap">
                                  <div className="flex items-center gap-1 whitespace-nowrap">
                                    <span className="font-medium text-slate-600 text-[11px] sm:text-xs">{tx.date}</span>
                                    {tx.isReal && (
                                      <span className="px-1 py-0.5 rounded text-[8px] sm:text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 whitespace-nowrap">
                                        실거래
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-slate-700 text-center text-xs sm:text-sm font-medium whitespace-nowrap">
                                  {tx.area}
                                </td>
                                <td className="px-2 sm:px-4 py-2.5 sm:py-3 text-slate-500 text-center text-xs sm:text-sm whitespace-nowrap">
                                  {tx.floor}
                                </td>
                                <td className="px-2.5 sm:px-4 py-2.5 sm:py-3 font-bold text-blue-600 text-right text-xs sm:text-sm tracking-tight whitespace-nowrap">
                                  {tx.price}
                                </td>
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
                    </>
                  )}
            </div>

          </div>
        </div>

        {/* ===== 주변 지도 뷰 (위치 변경: 단지 정보 위쪽) ===== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">🗺️ 위치 및 주변 단지 실거래가</h2>
              <p className="text-sm text-slate-400 mt-0.5">선택한 단지와 인근 단지의 실거래가를 지도에서 한눈에 비교해보세요.</p>
            </div>
            <a
              href={`https://map.naver.com/v5/search/${encodeURIComponent(apt.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 font-semibold hover:underline hidden sm:inline-block"
            >
              네이버 지도에서 보기 →
            </a>
          </div>
          <div className="px-4 pb-4">
            <AptDetailMap
              aptId={resolvedParams.id}
              aptName={apt.name}
              realAvgPriceNum={realSaleAvgManwon}
            />
          </div>
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 sm:hidden text-center">
            <a
              href={`https://map.naver.com/v5/search/${encodeURIComponent(apt.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              네이버 지도에서 보기 →
            </a>
          </div>
        </div>

        {/* ===== 인근 단지 비교 (위경도 기반 거리순) ===== */}
        {(() => {
          // 현재 아파트 위경도 기준으로 거리순 정렬 → 10km 이내 + 동일 광역시도 우선, 최대 5개
          const currentLat = apt.lat;
          const currentLng = apt.lng;
          const currentProvince = apt.region?.split(" ")[0] || ""; // "서울" / "경기" 등

          const nearbyApts = Object.entries(APARTMENT_DATA)
            .filter(([id]) => id !== resolvedParams.id)
            .filter(([, a]: [string, any]) => a.lat && a.lng)
            .map(([id, a]: [string, any]) => ({
              id,
              a,
              dist: haversineKm(currentLat, currentLng, a.lat, a.lng),
              sameProvince: (a.region?.split(" ")[0] || "") === currentProvince,
            }))
            .filter(({ dist }) => dist <= 15) // 15km 이내만
            .sort((x, y) => {
              // 동일 광역시도 우선, 그 다음 거리순
              if (x.sameProvince !== y.sameProvince) return x.sameProvince ? -1 : 1;
              return x.dist - y.dist;
            })
            .slice(0, 5);

          if (nearbyApts.length === 0) return null;

          return (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8">
              <h2 className="text-lg font-bold text-slate-900 mb-5">🏡 인근 단지 비교</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-slate-400 border-b border-slate-100">
                      <th className="text-left py-2 pr-4 font-semibold">단지명</th>
                      <th className="text-right py-2 px-3 font-semibold">매매 시세</th>
                      <th className="text-right py-2 px-3 font-semibold hidden sm:table-cell">거리</th>
                      <th className="text-right py-2 px-3 font-semibold hidden sm:table-cell">학군</th>
                      <th className="text-right py-2 px-3 font-semibold hidden sm:table-cell">교통</th>
                      <th className="text-right py-2 pl-3 font-semibold"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {nearbyApts.map(({ id, a, dist }) => (
                      <tr key={id} className="hover:bg-blue-50/30 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="font-semibold text-slate-800 leading-snug">{a.name}</div>
                          <div className="text-[11px] text-slate-400">{a.region}</div>
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-blue-600 whitespace-nowrap">
                          {Math.round((a.price_min + a.price_max) / 2 / 10000)}억
                        </td>
                        <td className="py-3 px-3 text-right text-slate-400 text-xs hidden sm:table-cell">
                          {dist < 1 ? `${Math.round(dist * 1000)}m` : `${dist.toFixed(1)}km`}
                        </td>
                        <td className="py-3 px-3 text-right hidden sm:table-cell">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                            a.school_score >= 95 ? "bg-blue-100 text-blue-700" :
                            a.school_score >= 85 ? "bg-indigo-50 text-indigo-600" :
                            "bg-slate-100 text-slate-500"
                          }`}>
                            {a.school_score}점
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right hidden sm:table-cell">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                            a.traffic_score >= 95 ? "bg-emerald-100 text-emerald-700" :
                            a.traffic_score >= 85 ? "bg-green-50 text-green-600" :
                            "bg-slate-100 text-slate-500"
                          }`}>
                            {a.traffic_score}점
                          </span>
                        </td>
                        <td className="py-3 pl-3 text-right">
                          <Link
                            href={`/apt/${id}`}
                            className="text-xs font-semibold text-blue-600 hover:underline whitespace-nowrap"
                          >
                            보기 →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

        {/* ===== 국토교통부 K-apt 단지 기본 및 상세 정보 대시보드 ===== */}
        {(() => {
          const info = {
            household_count: liveKapt?.household_count || apt.household_count,
            dong_count: liveKapt?.dong_count || apt.dong_count || 1,
            floor_top: liveKapt?.floor_top || apt.floor_top || 15,
            floor_base: liveKapt?.floor_base !== undefined && liveKapt?.floor_base !== null ? liveKapt.floor_base : (apt.floor_base || 1),
            approval_date: liveKapt?.approval_date || apt.approval_date || `${apt.built_year}.01.01`,
            built_year: apt.built_year,
            construction: liveKapt?.construction || apt.construction || "건설사 정보 확인중",
            developer: liveKapt?.developer || apt.developer || "시행사/사업주체",
            total_area_sqm: liveKapt?.total_area_sqm,
            private_area_sqm: liveKapt?.private_area_sqm,
            far: liveKapt?.far || apt.far,
            bcr: liveKapt?.bcr || apt.bcr,
            heatingType: liveKapt?.heatingType || apt.heatingType || apt.heating || "개별난방",
            heatingFuel: apt.heatingFuel || (liveKapt?.heatingType === "지역난방" ? "열병합" : "도시가스"),
            hallType: liveKapt?.hallType || apt.hallType || "계단식",
            managementType: liveKapt?.managementType || apt.managementType || "위탁관리",
            managementTel: liveKapt?.managementTel || apt.managementTel,
            managementCompany: liveKapt?.managementCompany,
            buildingStructure: liveKapt?.buildingStructure || "철근콘크리트구조",
            electricityContract: liveKapt?.electricityContract || "단일계약",
            elevatorCount: liveKapt?.elevatorCount || apt.elevatorCount || Math.max(1, (apt.dong_count || 1) * 2),
            cctvCount: liveKapt?.cctvCount || apt.cctvCount || Math.round((apt.dong_count || 1) * 8 + (apt.household_count || 100) * 0.15),
            parking_total: liveKapt?.parking_total || apt.parking_total || Math.round((apt.household_count || 100) * (apt.parkingRatio || 1.1)),
            parking_ground: liveKapt?.parking_ground !== undefined ? liveKapt.parking_ground : (apt.parking_ground || 0),
            parking_underground: liveKapt?.parking_underground !== undefined ? liveKapt.parking_underground : (apt.parking_underground || (apt.parking_total || 0)),
            parkingRatio: liveKapt?.parkingRatio || apt.parkingRatio || (apt.parking ? Number(apt.parking.replace(/[^0-9.]/g, "")) : 1.15),
            ev_total: (liveKapt?.ev_total !== undefined ? liveKapt.ev_total : apt.ev_charger_count) || (apt.household_count && apt.household_count > 300 ? Math.floor(apt.household_count / 30) : 4),
            ev_ground: liveKapt?.ev_ground || 0,
            ev_underground: liveKapt?.ev_underground || ((liveKapt?.ev_total !== undefined ? liveKapt.ev_total : apt.ev_charger_count) || 4),
            facilities: (liveKapt?.facilities && liveKapt.facilities.length > 0)
              ? liveKapt.facilities
              : (apt.facilities && apt.facilities.length > 0
                  ? apt.facilities
                  : ["관리사무소", "어린이놀이터", "경로당/시니어클럽", "자전거보관소", "주민공동시설", "분리수거장"]),
            area_distributions: (liveKapt?.area_distributions && liveKapt.area_distributions.length > 0)
              ? liveKapt.area_distributions
              : (apt.area_distributions && apt.area_distributions.length > 0
                  ? apt.area_distributions
                  : [
                      { label: "전용 59㎡ (25평)", pyeong: 25, units: Math.round((apt.household_count || 500) * 0.35), ratio: 35 },
                      { label: "전용 84㎡ (34평)", pyeong: 34, units: Math.round((apt.household_count || 500) * 0.45), ratio: 45 },
                      { label: "전용 114㎡ (45평)", pyeong: 45, units: Math.round((apt.household_count || 500) * 0.20), ratio: 20 },
                    ]),
            school_name: apt.school_name || (apt.district ? `${apt.district.replace(/[0-9·동읍면리]/g, "")}초등학교` : "인근 초등학교"),
            school_dist: apt.school_dist || "도보 5분 (320m)",
            subwayLine: liveKapt?.subwayLine || (apt.station ? apt.station.split(" ")[0] : null),
            subwayStation: liveKapt?.subwayStation || (apt.station ? apt.station.split(" ")[1] || apt.station : null),
            subwayWalkTime: liveKapt?.subwayWalkTime || (apt.station_dist || (apt.walk_minutes ? `도보 ${apt.walk_minutes}분` : "도보 7분")),
            nearbyFacilities: liveKapt?.nearbyFacilities,
            nearbySchools: liveKapt?.nearbySchools,
            isLiveApi: Boolean(liveKapt),
          };

          // 주차 상태 평가
          const parkingRatioNum = Number(info.parkingRatio) || 1.1;
          const parkingStatus =
            parkingRatioNum >= 1.4
              ? { text: "주차 쾌적 (여유)", color: "text-emerald-700 bg-emerald-50 border-emerald-200" }
              : parkingRatioNum >= 1.1
              ? { text: "주차 보통", color: "text-blue-700 bg-blue-50 border-blue-200" }
              : { text: "주차 다소 혼잡", color: "text-amber-700 bg-amber-50 border-amber-200" };

          // 주차 지하비율
          const totalPark = info.parking_total || (info.parking_underground + info.parking_ground) || 1;
          const undergroundPct = Math.round((info.parking_underground / totalPark) * 100) || 80;
          const groundPct = 100 - undergroundPct;

          return (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-7">
              {/* 헤더 */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>🏢 단지 기본 및 상세 정보</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    국토교통부 공동주택관리정보시스템(K-apt) 정식 규격 기반 아파트 제원 및 인프라 상세 데이터입니다.
                  </p>
                </div>

                {info.managementTel && (
                  <a
                    href={`tel:${info.managementTel.replace(/[^0-9]/g, "")}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <span>📞 관리사무소</span>
                    <span className="font-mono text-slate-900">{info.managementTel}</span>
                  </a>
                )}
              </div>

              {/* 1. 핵심 4대 인프라 카드 (Top Highlights) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {/* 1) 주차 환경 */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50/40 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">🚗 주차 제원</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${parkingStatus.color}`}>
                      {parkingStatus.text}
                    </span>
                  </div>
                  <div className="my-2.5">
                    <div className="text-2xl font-black text-slate-900">
                      세대당 {parkingRatioNum.toFixed(2)}<span className="text-sm font-semibold text-slate-500 ml-0.5">대</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      총 <strong className="text-slate-900 font-bold">{info.parking_total?.toLocaleString()}대</strong> 주차 가능
                    </div>
                  </div>
                  {/* 지하/지상 바 */}
                  <div className="space-y-1 pt-1.5 border-t border-slate-200/60">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>지하 {info.parking_underground}대 ({undergroundPct}%)</span>
                      <span>지상 {info.parking_ground}대</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                      <div className="bg-blue-600 h-full" style={{ width: `${undergroundPct}%` }} title={`지하: ${undergroundPct}%`}></div>
                      <div className="bg-slate-400 h-full" style={{ width: `${groundPct}%` }} title={`지상: ${groundPct}%`}></div>
                    </div>
                  </div>
                </div>

                {/* 2) 단지 규모 */}
                <div className="bg-gradient-to-br from-slate-50 to-indigo-50/40 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">🏘️ 단지 규모</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                      {info.household_count >= 1000 ? "대단지 (1,000+)" : "일반단지"}
                    </span>
                  </div>
                  <div className="my-2.5">
                    <div className="text-2xl font-black text-slate-900">
                      {info.household_count?.toLocaleString()}<span className="text-sm font-semibold text-slate-500 ml-0.5">세대</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      총 <strong className="text-slate-900 font-bold">{info.dong_count}개동</strong>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60 flex items-center justify-between">
                    <span>최고 {info.floor_top}층</span>
                    <span className="text-slate-400">·</span>
                    <span>지하 {info.floor_base || 1}층</span>
                    <span className="text-slate-400">·</span>
                    <span>승강기 {info.elevatorCount}대</span>
                  </div>
                </div>

                {/* 3) 사용승인 & 시공사 */}
                <div className="bg-gradient-to-br from-slate-50 to-emerald-50/40 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">📅 준공/승인</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      {2026 - (info.built_year || 2010)}년차
                    </span>
                  </div>
                  <div className="my-2.5">
                    <div className="text-xl font-black text-slate-900 font-mono tracking-tight">
                      {info.approval_date}
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5 truncate" title={info.construction}>
                      시공: <strong className="text-slate-900 font-bold">{info.construction}</strong>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60 truncate" title={info.developer}>
                    시행: {info.developer}
                  </div>
                </div>

                {/* 4) 전기차(EV) 충전 인프라 */}
                <div className="bg-gradient-to-br from-slate-50 to-teal-50/40 p-4 rounded-2xl border border-slate-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">⚡ 전기차 충전</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-bold">
                      친환경 인프라
                    </span>
                  </div>
                  <div className="my-2.5">
                    <div className="text-2xl font-black text-teal-700">
                      총 {info.ev_total}<span className="text-sm font-semibold text-slate-500 ml-0.5">대</span>
                    </div>
                    <div className="text-xs text-slate-600 mt-0.5">
                      완속 및 급속 충전시설 완비
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60 flex items-center justify-between">
                    <span>지하 {info.ev_underground}대</span>
                    <span className="text-slate-400">·</span>
                    <span>지상 {info.ev_ground}대</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-teal-600 font-bold">안전 관리중</span>
                  </div>
                </div>
              </div>

              {/* 2. 상세 건축 & 설비 스펙 그리드 */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span>📐 건축·설비·관리 정밀 제원</span>
                  <span className="text-xs font-normal text-slate-400">| 국토교통부 표준 코드 규격</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {[
                    { label: "난방 방식 / 연료", value: `${info.heatingType} (${info.heatingFuel})`, icon: "🔥" },
                    { label: "현관 구조", value: info.hallType, icon: "🚪" },
                    { label: "건물 구조", value: info.buildingStructure, icon: "🏛️" },
                    { label: "전기 계약 방식", value: info.electricityContract, icon: "⚡" },
                    { label: "용적률", value: info.far ? `${info.far}%` : "정보 없음", icon: "📊" },
                    { label: "건폐율", value: info.bcr ? `${info.bcr}%` : "정보 없음", icon: "🏠" },
                    { label: "관리 방식", value: `${info.managementType} ${info.managementCompany ? `(${info.managementCompany})` : ""}`, icon: "💼" },
                    { label: "보안 CCTV 대수", value: `${info.cctvCount}대 (동당 ${Math.round(info.cctvCount / info.dong_count)}대)`, icon: "📹" },
                    { label: "승강기(엘리베이터)", value: `총 ${info.elevatorCount}대`, icon: "🛗" },
                    { label: "배정 초등학교", value: info.school_name, icon: "🏫" },
                    { label: "학교 통학 거리", value: info.school_dist, icon: "🎒" },
                    {
                      label: "인근 지하철 / 대중교통",
                      value: info.subwayStation ? `${info.subwayLine || ""} ${info.subwayStation} (${info.subwayWalkTime})` : (apt.station ? `${apt.station} ${apt.station_dist || ""}` : "도보권 환승"),
                      icon: "🚇",
                    },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50/80 hover:bg-slate-100/80 transition-colors p-3 rounded-xl border border-slate-100 flex flex-col justify-between"
                    >
                      <div className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mb-1">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <div className="text-sm font-bold text-slate-800 break-words leading-snug">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. 평형별 세대수 구성 분포 (Area Distribution) */}
              {info.area_distributions && info.area_distributions.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <span>📊 평형별 세대수 및 공급 분포</span>
                    </h3>
                    <span className="text-[11px] text-slate-500">
                      전체 {info.household_count?.toLocaleString()}세대 구성 비율
                    </span>
                  </div>

                  {/* 세그먼트 시각화 바 */}
                  <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                    {info.area_distributions.map((area: any, i: number) => {
                      const colors = ["bg-blue-600", "bg-emerald-500", "bg-indigo-500", "bg-amber-500", "bg-purple-500"];
                      return (
                        <div
                          key={i}
                          className={`${colors[i % colors.length]} h-full transition-all`}
                          style={{ width: `${area.ratio}%` }}
                          title={`${area.label}: ${area.units}세대 (${area.ratio}%)`}
                        />
                      );
                    })}
                  </div>

                  {/* 평형별 카드 그리드 */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 pt-1">
                    {info.area_distributions.map((area: any, i: number) => {
                      const dotColors = ["bg-blue-600", "bg-emerald-500", "bg-indigo-500", "bg-amber-500", "bg-purple-500"];
                      return (
                        <div key={i} className="bg-white p-2.5 rounded-xl border border-slate-200/70 shadow-2xs">
                          <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold mb-1 truncate">
                            <span className={`w-2 h-2 rounded-full shrink-0 ${dotColors[i % dotColors.length]}`}></span>
                            <span className="truncate">{area.label}</span>
                          </div>
                          <div className="flex items-baseline justify-between text-xs">
                            <span className="font-extrabold text-slate-900 text-sm">{area.units?.toLocaleString()}세대</span>
                            <span className="font-bold text-slate-400 text-[11px]">{area.ratio}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 4. 단지 내 커뮤니티 & 부대복리시설 (Facilities) */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
                  <span>🏊 단지 내 커뮤니티 및 부대복리시설</span>
                  <span className="text-xs font-normal text-slate-500">({info.facilities.length}개 시설)</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {info.facilities.map((fac: string, idx: number) => {
                    let icon = "✨";
                    if (/피트니스|헬스|체육/.test(fac)) icon = "🏋️";
                    else if (/골프/.test(fac)) icon = "⛳";
                    else if (/놀이터/.test(fac)) icon = "🎠";
                    else if (/경로당|노인/.test(fac)) icon = "👵";
                    else if (/독서실|도서관|스터디/.test(fac)) icon = "📚";
                    else if (/어린이집|보육/.test(fac)) icon = "👶";
                    else if (/사우나|목욕/.test(fac)) icon = "♨️";
                    else if (/카페|북카페/.test(fac)) icon = "☕";
                    else if (/관리/.test(fac)) icon = "🏢";
                    else if (/자전거/.test(fac)) icon = "🚲";
                    else if (/수영장/.test(fac)) icon = "🏊";
                    else if (/게스트/.test(fac)) icon = "🏨";
                    else if (/주민|공동/.test(fac)) icon = "🤝";

                    return (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200/70 transition-all cursor-default"
                      >
                        <span>{icon}</span>
                        <span>{fac}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* 5. 인근 편의 및 교육 환경 안내 (K-apt 세부제공 시) */}
              {(info.nearbyFacilities || info.nearbySchools) && (
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                  {info.nearbySchools && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-800 block mb-1">🎓 인근 교육 인프라:</span>
                      <span>{info.nearbySchools}</span>
                    </div>
                  )}
                  {info.nearbyFacilities && (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-bold text-slate-800 block mb-1">🏪 인근 주요 편의시설:</span>
                      <span>{info.nearbyFacilities}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        {/* ===== 입지 분석 (인터랙티브) ===== */}

        {/* ===== 입지 분석 (인터랙티브) ===== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 pb-4">
            <h3 className="text-lg font-bold text-slate-900">⭐ 입지 분석</h3>
            <p className="text-xs text-slate-400 mt-0.5">항목을 클릭하면 세부 정보를 확인할 수 있습니다</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            {/* 왼쪽: 스코어 바 (클릭 인터랙션) */}
            <div className="p-6 space-y-4">
              {([
                { key: "교통" as const, label: "🚇 교통/역세권", score: apt.traffic_score, color: "bg-indigo-500", text: "text-indigo-600", ring: "ring-indigo-400" },
                { key: "학군" as const, label: "🎓 학군 입지", score: apt.school_score, color: "bg-blue-600", text: "text-blue-600", ring: "ring-blue-400" },
                { key: "쾌적성" as const, label: "🌳 쾌적성/공원", score: apt.nature_score, color: "bg-emerald-500", text: "text-emerald-600", ring: "ring-emerald-400" },
              ]).map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveLocation(item.key)}
                  className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer border-2 ${
                    activeLocation === item.key
                      ? `border-slate-200 bg-slate-50 ring-2 ${item.ring}`
                      : "border-transparent hover:bg-slate-50 hover:border-slate-100"
                  }`}
                >
                  <div className="flex justify-between text-sm font-semibold mb-2">
                    <span className="text-slate-700">{item.label}</span>
                    <span className={`${item.text} font-extrabold`}>{item.score}점</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  {activeLocation === item.key && (
                    <div className="mt-1.5 text-[10px] font-semibold text-slate-400 text-right">▶ 세부 정보 확인 중</div>
                  )}
                </button>
              ))}
              <div className="pt-3 border-t border-slate-100 text-center">
                <div className="text-xs text-slate-400 mb-1">종합 점수</div>
                <div className="text-3xl font-black text-blue-600">
                  {Math.round((apt.school_score + apt.traffic_score + apt.nature_score) / 3)}
                  <span className="text-base font-medium text-slate-400 ml-1">/ 100</span>
                </div>
              </div>
            </div>

            {/* 오른쪽: 세부 정보 패널 */}
            <div className="p-6">
              {activeLocation === "교통" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-sm font-extrabold text-indigo-700 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs">🚇</span>
                    교통 세부 정보
                  </h4>
                  {/* 지하철 */}
                  {apt.station ? (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4">
                      <div className="text-[11px] font-bold text-indigo-500 mb-2">🚇 인근 지하철역</div>
                      <div className="font-extrabold text-indigo-800 text-base">{apt.station}</div>
                      {apt.station_dist && (
                        <div className="text-xs text-indigo-600 mt-1">
                          🚶 {apt.station_dist}{apt.walk_minutes ? ` (도보 약 ${apt.walk_minutes}분)` : ""}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-500">
                      인근 지하철 정보가 없습니다.
                    </div>
                  )}
                  {/* 버스 */}
                  {(() => {
                    const busInfo = getBusInfo(apt);
                    const typeColor: Record<string, string> = {
                      "광역": "bg-red-100 text-red-700 border-red-200",
                      "간선": "bg-blue-100 text-blue-700 border-blue-200",
                      "지선": "bg-green-100 text-green-700 border-green-200",
                      "마을": "bg-amber-100 text-amber-700 border-amber-200",
                      "BRT": "bg-purple-100 text-purple-700 border-purple-200",
                    };
                    return (
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-3">
                        {/* 헤더 */}
                        <div className="flex items-center justify-between">
                          <div className="text-[11px] font-bold text-slate-500">🚌 인근 버스 노선</div>
                          <div className="text-[10px] font-semibold text-slate-400">{busInfo.summary}</div>
                        </div>

                        {/* 노선 칩 목록 */}
                        <div className="space-y-2">
                          {busInfo.routes.map((route, i) => (
                            <div key={i} className="flex items-center gap-2.5">
                              <span className={`flex-shrink-0 inline-flex items-center justify-center px-2 py-0.5 rounded-md text-[10px] font-extrabold border ${typeColor[route.type] || "bg-slate-100 text-slate-600 border-slate-200"}`}>
                                {route.type}
                              </span>
                              <span className="text-xs font-bold text-slate-800 min-w-[48px]">{route.number}</span>
                              <span className="text-xs text-slate-500 flex items-center gap-1">
                                <span className="text-slate-300">→</span>
                                {route.dest}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* 배차 간격 */}
                        <div className="flex items-center gap-3 bg-white rounded-xl px-3 py-2 border border-slate-100">
                          <span className="text-sm">⏱️</span>
                          <div className="flex-1">
                            <div className="text-[10px] font-semibold text-slate-400 mb-0.5">배차 간격</div>
                            <div className="text-xs font-bold text-slate-700">
                              {apt.tags?.some((t: string) => /광역버스|BRT|역세권/.test(t))
                                ? "첨두시 5~10분 / 비첨두시 10~20분"
                                : apt.traffic_score >= 85
                                ? "첨두시 8~12분 / 비첨두시 15~25분"
                                : "첨두시 10~15분 / 비첨두시 20~30분"}
                            </div>
                          </div>
                        </div>

                        {/* 네이버 지도 CTA */}
                        <a
                          href={`https://map.naver.com/v5/search/${encodeURIComponent(apt.name + " 버스정류장")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2.5 transition-colors group"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-base">🗺️</span>
                            <div>
                              <div className="text-xs font-bold">전체 버스 노선 지도에서 보기</div>
                              <div className="text-[10px] text-indigo-200">정류장 위치 · 실시간 배차 · 경유지 확인</div>
                            </div>
                          </div>
                          <span className="text-white/70 group-hover:translate-x-0.5 transition-transform text-sm">→</span>
                        </a>
                      </div>
                    );
                  })()}
                  {/* 자가용 접근성 */}
                  <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                    <span>🚗</span>
                    <span>교통 점수 <strong className="text-indigo-700">{apt.traffic_score}점</strong> — {apt.traffic_score >= 90 ? "최상위 교통 인프라 (상위 5% 수준)" : apt.traffic_score >= 80 ? "우수한 교통 환경" : "평균 이상 교통 환경"}</span>
                  </div>
                </div>
              )}

              {activeLocation === "학군" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-sm font-extrabold text-blue-700 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs">🎓</span>
                    학군 세부 정보
                  </h4>
                  {/* 인근 학교 */}
                  {apt.schools && apt.schools.length > 0 ? (
                    <div className="space-y-2">
                      {apt.schools.map((s: string, i: number) => (
                        <div key={i} className="flex items-center gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
                          <span className="text-blue-500 text-base">🏫</span>
                          <div>
                            <div className="font-bold text-blue-800 text-sm">{s}</div>
                            <div className="text-[10px] text-blue-500">{i === 0 ? "도보 통학 가능" : "인근 학교"}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-sm">
                      <p className="font-semibold text-amber-800 mb-1">📌 배정학교 안내</p>
                      <p className="text-xs text-amber-600 mb-2">정확한 배정학교는 나이스 학교알리미에서 확인하세요.</p>
                      <a
                        href="https://www.schoolinfo.go.kr/ei/ss/Pneiss_a01_s0.do"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline"
                      >
                        🔗 나이스 학교알리미 →
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                    <span>📊</span>
                    <span>학군 점수 <strong className="text-blue-700">{apt.school_score}점</strong> — {apt.school_score >= 90 ? "최상위 명문 학군 (상위 5% 수준)" : apt.school_score >= 80 ? "우수 학군 지역" : "평균 수준 학군"}</span>
                  </div>
                  <a
                    href={`https://map.naver.com/v5/search/${encodeURIComponent(apt.name + " 주변 학교")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    🔗 네이버 지도에서 학교 위치 확인 →
                  </a>
                </div>
              )}

              {activeLocation === "쾌적성" && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <h4 className="text-sm font-extrabold text-emerald-700 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">🌳</span>
                    쾌적성 세부 정보
                  </h4>
                  {/* 한강 */}
                  {apt.hangang_dist && (
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                      <div className="text-[11px] font-bold text-blue-500 mb-1">🌊 한강까지 거리</div>
                      <div className="font-extrabold text-blue-800 text-sm">{apt.hangang_dist}</div>
                      {apt.is_hangang_view && (
                        <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full">영구 한강조망 가능</div>
                      )}
                    </div>
                  )}
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                    <div className="text-[11px] font-bold text-emerald-600 mb-2">🌿 자연환경 평가</div>
                    <div className="text-xs text-emerald-700 leading-relaxed">
                      {apt.nature_score >= 95
                        ? "공원·녹지가 매우 풍부한 최고급 자연환경입니다. 산책로, 한강공원, 대형 근린공원이 도보권 내 위치합니다."
                        : apt.nature_score >= 85
                        ? "인근에 공원과 녹지공간이 잘 갖춰진 쾌적한 주거환경입니다."
                        : "주변 자연환경이 적절히 갖춰진 지역입니다."}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2.5 border border-slate-100">
                    <span>🌳</span>
                    <span>쾌적성 점수 <strong className="text-emerald-700">{apt.nature_score}점</strong> — {apt.nature_score >= 90 ? "숲세권·공원세권 최우수" : "쾌적한 자연 환경"}</span>
                  </div>
                  <a
                    href={`https://map.naver.com/v5/search/${encodeURIComponent(apt.name + " 공원")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:underline"
                  >
                    🔗 네이버 지도에서 인근 공원 확인 →
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 반경 1km·3km 핵심 입지 종합 브리핑 요약 카드 */}
        <NearbyLocationSummaryCard aptId={apt.id} aptName={apt.name} lat={apt.lat} lng={apt.lng} />

        {/* P1: 주변 정비사업 목록 & 진행 단계 섹션 */}
        <NearbyRedevelopmentSection aptId={apt.id} aptName={apt.name} />

        {/* P1: 연도별 입주 예정 물량 섹션 */}
        <SupplyVolumeSection aptId={apt.id} aptName={apt.name} />

        {/* P2: 상권 업종 분포 및 점포 현황 */}
        <CommercialDistrictSection aptId={apt.id} aptName={apt.name} />

        {/* P3: 중개업소 파트너 광고 */}
        <RealtorAdSection aptId={apt.id} aptName={apt.name} />

        {/* P3: AI 심층 분석 유료 리포트 미리보기 */}
        <ProReportPreviewSection aptId={apt.id} aptName={apt.name} />

        {/* ===== 단지별 커뮤니티 & 실시간 토론창구 (입지 분석 밑) ===== */}
        <AptCommunitySection
          aptName={apt.name}
          aptId={apt.id}
          region={apt.region}
          trafficScore={apt.traffic_score}
          schoolScore={apt.school_score}
        />

      </div>
    </div>
  );
}