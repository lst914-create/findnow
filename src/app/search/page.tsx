"use client";

import { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { APARTMENTS_DATA, Apartment, getApartmentHighlightFeature } from "@/lib/apartments";

// 전국 17개 시·도 및 시·군·구 매핑
const NATIONWIDE_REGIONS: Record<string, { fullName: string; sigungus: string[] }> = {
  "서울": {
    fullName: "서울특별시",
    sigungus: [
      "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
      "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구",
      "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
    ]
  },
  "경기": {
    fullName: "경기도",
    sigungus: [
      "수원영통구", "수원팔달구", "수원장안구", "수원권선구",
      "성남분당구", "성남수정구", "성남중원구",
      "고양일산동구", "고양일산서구", "고양덕양구",
      "용인수지구", "용인기흥구", "용인처인구",
      "안양동안구", "안양만안구",
      "부천원미구", "부천소사구", "부천오정구",
      "안산단원구", "안산상록구",
      "화성동탄구", "화성병점구", "화성만세구", "화성효행구",
      "남양주시", "평택시", "시흥시", "파주시", "의정부시", "김포시", "광명시",
      "광주시", "군포시", "이천시", "오산시", "하남시", "양주시", "구리시",
      "안성시", "포천시", "의왕시", "여주시", "양평군", "동두천시", "과천시", "가평군", "연천군"
    ]
  },
  "인천": {
    fullName: "인천광역시",
    sigungus: [
      "연수구", "남동구", "부평구", "서해구", "검단구", "미추홀구", "계양구", "중구", "동구", "영종구", "제물포구", "강화군", "옹진군"
    ]
  },
  "부산": {
    fullName: "부산광역시",
    sigungus: [
      "해운대구", "수영구", "동래구", "남구", "연제구", "부산진구", "금정구", "북구",
      "강서구", "사상구", "사하구", "영도구", "중구", "서구", "동구", "기장군"
    ]
  },
  "대구": {
    fullName: "대구광역시",
    sigungus: [
      "수성구", "달서구", "중구", "동구", "서구", "남구", "북구", "달성군", "군위군"
    ]
  },
  "대전": {
    fullName: "대전광역시",
    sigungus: [
      "유성구", "서구", "중구", "동구", "대덕구"
    ]
  },
  "광주": {
    fullName: "광주광역시",
    sigungus: [
      "광산구", "서구", "남구", "북구", "동구"
    ]
  },
  "울산": {
    fullName: "울산광역시",
    sigungus: [
      "남구", "중구", "북구", "동구", "울주군"
    ]
  },
  "세종": {
    fullName: "세종특별자치시",
    sigungus: [
      "세종시 전체"
    ]
  },
  "강원": {
    fullName: "강원특별자치도",
    sigungus: [
      "춘천시", "원주시", "강릉시", "속초시", "동해시", "삼척시", "태백시",
      "홍천군", "횡성군", "영월군", "평창군", "정선군", "철원군", "화천군", "양구군", "인제군", "고성군", "양양군"
    ]
  },
  "충북": {
    fullName: "충청북도",
    sigungus: [
      "청주흥덕구", "청주상당구", "청주청원구", "청주서원구",
      "충주시", "제천시", "보은군", "옥천군", "영동군", "증평군", "진천군", "괴산군", "음성군", "단양군"
    ]
  },
  "충남": {
    fullName: "충청남도",
    sigungus: [
      "천안서북구", "천안동남구", "아산시", "서산시", "당진시", "공주시", "논산시",
      "보령시", "계룡시", "홍성군", "예산군", "부여군", "서천군", "청양군", "태안군", "금산군"
    ]
  },
  "전북": {
    fullName: "전북특별자치도",
    sigungus: [
      "전주완산구", "전주덕진구", "익산시", "군산시", "정읍시", "남원시", "김제시",
      "완주군", "진안군", "무주군", "장수군", "임실군", "순창군", "고창군", "부안군"
    ]
  },
  "전남": {
    fullName: "전라남도",
    sigungus: [
      "순천시", "여수시", "목포시", "나주시", "광양시", "담양군", "곡성군", "구례군",
      "고흥군", "보성군", "화순군", "장흥군", "강진군", "해남군", "영암군", "무안군", "함평군", "영광군", "장성군", "완도군", "진도군", "신안군"
    ]
  },
  "경북": {
    fullName: "경상북도",
    sigungus: [
      "포항남구", "포항북구", "구미시", "경주시", "경산시", "안동시", "김천시", "영주시",
      "영천시", "상주시", "문경시", "의성군", "청송군", "영양군", "영덕군", "청도군", "고령군", "성주군", "칠곡군", "예천군", "봉화군", "울진군", "울릉군"
    ]
  },
  "경남": {
    fullName: "경상남도",
    sigungus: [
      "창원의창구", "창원성산구", "창원마산합포구", "창원마산회원구", "창원진해구",
      "김해시", "진주시", "양산시", "거제시", "통영시", "사천시", "밀양시",
      "함안군", "창녕군", "고성군", "남해군", "하동군", "산청군", "함양군", "거창군", "합천군", "의령군"
    ]
  },
  "제주": {
    fullName: "제주특별자치도",
    sigungus: [
      "제주시", "서귀포시"
    ]
  }
};

// 지역명 → 대표 중심 좌표 매핑 (지도 중심 이동용)
const REGION_CENTERS: Record<string, { lat: number; lng: number }> = {
  "전체": { lat: 36.3504, lng: 127.3845 },
  "서울": { lat: 37.5665, lng: 126.9780 },
  "경기": { lat: 37.4138, lng: 127.5183 },
  "인천": { lat: 37.4562, lng: 126.7052 },
  "부산": { lat: 35.1796, lng: 129.0756 },
  "대구": { lat: 35.8714, lng: 128.6014 },
  "대전": { lat: 36.3504, lng: 127.3845 },
  "광주": { lat: 35.1595, lng: 126.8526 },
  "울산": { lat: 35.5384, lng: 129.3114 },
  "세종": { lat: 36.4800, lng: 127.2890 },
  "강원": { lat: 37.8228, lng: 128.1555 },
  "충북": { lat: 36.6357, lng: 127.4912 },
  "충남": { lat: 36.5184, lng: 126.8000 },
  "전북": { lat: 35.7175, lng: 127.1530 },
  "전남": { lat: 34.8161, lng: 126.4629 },
  "경북": { lat: 36.5760, lng: 128.5056 },
  "경남": { lat: 35.2383, lng: 128.6925 },
  "제주": { lat: 33.4996, lng: 126.5312 },

  // 주요 구/시 좌표
  "강남구": { lat: 37.5172, lng: 127.0473 },
  "서초구": { lat: 37.4837, lng: 127.0324 },
  "송파구": { lat: 37.5145, lng: 127.1059 },
  "용산구": { lat: 37.5311, lng: 126.9810 },
  "마포구": { lat: 37.5663, lng: 126.9014 },
  "수원영통구": { lat: 37.2596, lng: 127.0465 },
  "성남분당구": { lat: 37.3827, lng: 127.1189 },
  "화성동탄구": { lat: 37.2006, lng: 127.0982 },
  "해운대구": { lat: 35.1631, lng: 129.1636 },
  "수성구": { lat: 35.8580, lng: 128.6306 },
  "유성구": { lat: 36.3623, lng: 127.3563 },
  "광산구": { lat: 35.1395, lng: 126.7938 },
  "연수구": { lat: 37.4098, lng: 126.6783 },
};

const AptMap = dynamic(() => import("@/components/AptMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[480px] bg-slate-100 rounded-3xl animate-pulse flex items-center justify-center text-slate-400 text-sm">
      🗺️ 실거래 지도를 불러오는 중입니다...
    </div>
  ),
});

export default function ApartmentSearchPage() {
  // 2단계 지역 검색 조건 State (시/도 먼저 -> 시/군/구)
  const [sido, setSido] = useState("전체");
  const [sigungu, setSigungu] = useState("전체");

  // 기타 검색 조건 State
  const [builtYearOption, setBuiltYearOption] = useState("전체");
  const [householdOption, setHouseholdOption] = useState("전체");
  const [pyeongOption, setPyeongOption] = useState("전체");
  const [priceOption, setPriceOption] = useState("전체");
  const [trafficOption, setTrafficOption] = useState("전체");

  // 검색 결과 State
  const [results, setResults] = useState<Apartment[]>(APARTMENTS_DATA);
  const [isSearched, setIsSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  // 지도 중심 좌표 State (검색 결과 지역으로 자동 이동)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);

  // 시/도 변경 시 시군구 자동 초기화
  const handleSidoChange = (newSido: string) => {
    setSido(newSido);
    setSigungu("전체");
  };

  // 검색 실행 함수
  const handleSearch = () => {
    setLoading(true);
    setVisibleCount(24);

    setTimeout(() => {
      let filtered = [...APARTMENTS_DATA];

      // 1. 전국 2단계 지역 필터 (시/도 + 시/군/구)
      if (sido !== "전체") {
        if (sigungu !== "전체") {
          filtered = filtered.filter(
            (apt) =>
              apt.region.includes(sido) &&
              (apt.region.includes(sigungu) || apt.district.includes(sigungu))
          );
        } else {
          filtered = filtered.filter((apt) => apt.region.includes(sido));
        }
      }

      // 2. 입주년도 필터 (2026년 기준)
      if (builtYearOption !== "전체") {
        if (builtYearOption === "5년 이내") {
          filtered = filtered.filter((apt) => apt.built_year >= 2021);
        } else if (builtYearOption === "10년 이내") {
          filtered = filtered.filter((apt) => apt.built_year >= 2016);
        } else if (builtYearOption === "15년 이내") {
          filtered = filtered.filter((apt) => apt.built_year >= 2011);
        } else if (builtYearOption === "20년 이상") {
          filtered = filtered.filter((apt) => apt.built_year < 2006);
        }
      }

      // 3. 세대수 필터
      if (householdOption !== "전체") {
        if (householdOption === "500세대 이상") {
          filtered = filtered.filter((apt) => apt.household_count >= 500);
        } else if (householdOption === "1000세대 이상") {
          filtered = filtered.filter((apt) => apt.household_count >= 1000);
        } else if (householdOption === "3000세대 이상") {
          filtered = filtered.filter((apt) => apt.household_count >= 3000);
        }
      }

      // 4. 평형 필터
      if (pyeongOption !== "전체") {
        if (pyeongOption === "20평대") {
          filtered = filtered.filter((apt) => apt.area_pyeong >= 20 && apt.area_pyeong < 30);
        } else if (pyeongOption === "30평대") {
          filtered = filtered.filter((apt) => apt.area_pyeong >= 30 && apt.area_pyeong < 40);
        } else if (pyeongOption === "40평대 이상") {
          filtered = filtered.filter((apt) => apt.area_pyeong >= 40);
        }
      }

      // 5. 가격 필터 (price_min 기준, 만원 단위)
      if (priceOption !== "전체") {
        if (priceOption === "10억 이하") {
          filtered = filtered.filter((apt) => apt.price_min <= 100000);
        } else if (priceOption === "10억~15억") {
          filtered = filtered.filter((apt) => apt.price_min >= 100000 && apt.price_min <= 150000);
        } else if (priceOption === "15억~20억") {
          filtered = filtered.filter((apt) => apt.price_min >= 150000 && apt.price_min <= 200000);
        } else if (priceOption === "20억~30억") {
          filtered = filtered.filter((apt) => apt.price_min >= 200000 && apt.price_min <= 300000);
        } else if (priceOption === "30억 이상") {
          filtered = filtered.filter((apt) => apt.price_min >= 300000);
        }
      }

      // 6. 역세권 필터 (도보 분 기준)
      if (trafficOption !== "전체") {
        if (trafficOption === "초역세권(도보 3분)") {
          filtered = filtered.filter((apt) => (apt.walk_minutes || 99) <= 3);
        } else if (trafficOption === "역세권(도보 5분)") {
          filtered = filtered.filter((apt) => (apt.walk_minutes || 99) <= 5);
        } else if (trafficOption === "일반(도보 10분)") {
          filtered = filtered.filter((apt) => (apt.walk_minutes || 99) <= 10);
        }
      }

      setResults(filtered);
      setIsSearched(true);
      setLoading(false);

      // ── 검색 결과 지역으로 지도 이동 ──
      // 1순위: 선택한 시군구 또는 시도 중심 좌표
      let newCenter: { lat: number; lng: number } | undefined;
      if (sigungu !== "전체" && REGION_CENTERS[sigungu]) {
        newCenter = REGION_CENTERS[sigungu];
      } else if (sido !== "전체" && REGION_CENTERS[sido]) {
        newCenter = REGION_CENTERS[sido];
      }

      // 2순위: 필터된 아파트들의 평균 중심 좌표
      if (!newCenter && filtered.length > 0) {
        const validApts = filtered.filter((a) => a.lat && a.lng);
        if (validApts.length > 0) {
          const sample = validApts.slice(0, Math.min(8, validApts.length));
          const avgLat = sample.reduce((sum, a) => sum + a.lat, 0) / sample.length;
          const avgLng = sample.reduce((sum, a) => sum + a.lng, 0) / sample.length;
          newCenter = { lat: avgLat, lng: avgLng };
        }
      }

      if (newCenter) {
        setMapCenter(newCenter);
      }
    }, 250);
  };

  // 초기화 함수
  const handleReset = () => {
    setSido("전체");
    setSigungu("전체");
    setBuiltYearOption("전체");
    setHouseholdOption("전체");
    setPyeongOption("전체");
    setPriceOption("전체");
    setTrafficOption("전체");
    setResults(APARTMENTS_DATA);
    setIsSearched(false);
    setVisibleCount(24);
    setMapCenter(undefined);
  };

  const formatPrice = (price: number) => {
    const uk = Math.floor(price / 10000);
    const cheon = price % 10000;
    if (uk > 0 && cheon > 0) return `${uk}억 ${cheon.toLocaleString()}만`;
    if (uk > 0) return `${uk}억원`;
    return `${price.toLocaleString()}만원`;
  };

  const formatPriceRange = (min: number, max: number) => {
    if (!min && !max) return "시세 확인중";
    const minVal = min || max;
    const maxVal = max || min;

    const formatSingle = (val: number) => {
      const uk = val / 10000;
      if (uk >= 1) {
        return uk % 1 === 0 ? `${Math.floor(uk)}억` : `${uk.toFixed(1)}억`;
      }
      return `${Math.round(val).toLocaleString()}만`;
    };

    if (minVal === maxVal) {
      return formatSingle(minVal);
    }

    const minUk = minVal / 10000;
    const maxUk = maxVal / 10000;

    if (minUk >= 1) {
      const minStr = minUk % 1 === 0 ? `${Math.floor(minUk)}억` : `${minUk.toFixed(1)}억`;
      const maxStr = maxUk % 1 === 0 ? `${Math.floor(maxUk)}억` : `${maxUk.toFixed(1)}억`;
      return `${minStr} ~ ${maxStr}`;
    }

    return `${Math.round(minVal).toLocaleString()}만 ~ ${Math.round(maxVal).toLocaleString()}만`;
  };

  const formatRentMonthly = (apt: Apartment) => {
    const deposit = 5000;
    const rentBaseMin = apt.rent_min || Math.round(apt.price_min * 0.55);
    const rentBaseMax = apt.rent_max || Math.round(apt.price_max * 0.58);
    const monthlyMin = Math.max(40, Math.round(((Math.max(deposit, rentBaseMin) - deposit) * 0.048) / 12));
    const monthlyMax = Math.max(monthlyMin + 15, Math.round(((Math.max(deposit, rentBaseMax) - deposit) * 0.048) / 12));
    return `보증금 5천 / 월 ${monthlyMin}~${monthlyMax}만`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <span className="text-white text-lg font-bold">F</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              찾아줘
            </span>
          </Link>

          <div className="flex items-center gap-4 text-sm font-semibold text-slate-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">홈</Link>
            <span className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-0.5">🏢 아파트 찾기</span>
            <Link href="/redevelopment" className="hover:text-indigo-600 transition-colors hidden sm:inline">🔨 재개발</Link>
            <Link href="/subscriptions" className="hover:text-indigo-600 transition-colors hidden sm:inline">🏗️ 분양</Link>
            <Link href="/regional" className="hover:text-indigo-600 transition-colors hidden sm:inline">📍 지역정보</Link>
            <Link href="/community" className="hover:text-indigo-600 transition-colors hidden sm:inline font-bold">💬 커뮤니티</Link>
            <Link href="/pricing" className="hover:text-indigo-600 transition-colors hidden sm:inline font-bold text-amber-600">💎 요금제</Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Title Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              원하는 조건의 아파트를 찾아보세요
            </h1>
            <p className="text-indigo-200 text-xs sm:text-sm max-w-xl">
              지역, 입주년도, 세대수, 평형, 가격, 역세권까지 상세한 조건을 선택하고 나에게 꼭 맞는 최적의 단지를 찾아보세요.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* ===== 검색 조건 입력 카드 ===== */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>⚙️</span> 아파트 검색 조건 설정
            </h2>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>🔄</span> 필터 초기화
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. 지역 선택 (시/도 먼저 -> 시/군/구 2단계) */}
            <div className="space-y-2 col-span-1 md:col-span-2 lg:col-span-1">
              <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span>📍</span> 지역 선택 (시·도 / 시·군·구)
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {/* 1단계: 시/도 */}
                <select
                  value={sido}
                  onChange={(e) => handleSidoChange(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="전체">전국 전체</option>
                  {Object.keys(NATIONWIDE_REGIONS).map((s) => (
                    <option key={s} value={s}>
                      {s} ({NATIONWIDE_REGIONS[s].fullName})
                    </option>
                  ))}
                </select>

                {/* 2단계: 시/군/구 */}
                <select
                  value={sigungu}
                  onChange={(e) => setSigungu(e.target.value)}
                  disabled={sido === "전체"}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                >
                  <option value="전체">
                    {sido === "전체" ? "시·군·구 전체" : `${sido} 전체`}
                  </option>
                  {sido !== "전체" &&
                    NATIONWIDE_REGIONS[sido]?.sigungus.map((sg) => (
                      <option key={sg} value={sg}>
                        {sg}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* 2. 입주년도 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>🏗️</span> 입주년도 (연식)
              </label>
              <select
                value={builtYearOption}
                onChange={(e) => setBuiltYearOption(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="전체">전체 (연식 무관)</option>
                <option value="5년 이내">✨ 5년 이내 (신축)</option>
                <option value="10년 이내">🏢 10년 이내</option>
                <option value="15년 이내">🏡 15년 이내</option>
                <option value="20년 이상">🛠️ 20년 이상 (구축/재건축)</option>
              </select>
            </div>

            {/* 3. 세대수 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>🏘️</span> 단지 세대수
              </label>
              <select
                value={householdOption}
                onChange={(e) => setHouseholdOption(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="전체">전체 (세대수 무관)</option>
                <option value="500세대 이상">500세대 이상</option>
                <option value="1000세대 이상">1,000세대 이상 (대단지)</option>
                <option value="3000세대 이상">3,000세대 이상 (초대단지)</option>
              </select>
            </div>

            {/* 4. 평형 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>📐</span> 전용 평형
              </label>
              <select
                value={pyeongOption}
                onChange={(e) => setPyeongOption(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="전체">전체 (평형 무관)</option>
                <option value="20평대">20평대 (20~29평)</option>
                <option value="30평대">30평대 (30~39평)</option>
                <option value="40평대 이상">40평대 이상</option>
              </select>
            </div>

            {/* 5. 가격 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>💰</span> 매매 가격대
              </label>
              <select
                value={priceOption}
                onChange={(e) => setPriceOption(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="전체">전체 (가격 무관)</option>
                <option value="10억 이하">10억 이하</option>
                <option value="10억~15억">10억 ~ 15억원</option>
                <option value="15억~20억">15억 ~ 20억원</option>
                <option value="20억~30억">20억 ~ 30억원</option>
                <option value="30억 이상">30억원 이상 (고가 주택)</option>
              </select>
            </div>

            {/* 6. 역세권 */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span>🚇</span> 역세권 (도보 거리)
              </label>
              <select
                value={trafficOption}
                onChange={(e) => setTrafficOption(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="전체">전체 (거리 무관)</option>
                <option value="초역세권(도보 3분)">⚡ 초역세권 (도보 3분 이내)</option>
                <option value="역세권(도보 5분)">🚶 역세권 (도보 5분 이내)</option>
                <option value="일반(도보 10분)">🚶‍♂️ 도보 10분 이내</option>
              </select>
            </div>
          </div>

          {/* 검색 실행 버튼 */}
          <div className="pt-2">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-800 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.005] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>검색 진행 중...</span>
                </>
              ) : (
                <>
                  <span>🔍</span>
                  <span>조건에 맞는 아파트 검색하기</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ===== 검색 결과 지도 뷰 ===== */}
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>🗺️</span> 조건 검색 단지 실거래가 지도
            </h2>
          </div>
          <AptMap
            height={460}
            initialZoom={mapCenter ? 12 : 13}
            center={mapCenter}
          />
        </div>

        {/* ===== 검색 결과 리스트 ===== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>🏢</span> 검색 결과 단지 목록
            </h2>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              총 {results.length}개 단지 발견
            </span>
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
              <p className="text-3xl">🔍</p>
              <p className="text-slate-700 text-base font-bold">선택하신 조건에 해당하는 아파트 단지가 없습니다.</p>
              <p className="text-slate-400 text-xs">검색 조건을 조금 더 넓혀서 다시 검색해 보세요.</p>
              <button
                onClick={handleReset}
                className="mt-2 px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-2xl text-xs shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                필터 조건 전체 초기화
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.slice(0, visibleCount).map((apt) => (
                  <Link
                    key={apt.id}
                    href={`/apt/${apt.id}`}
                    className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                  >
                    {/* 가격대별 이미지 헤더 (메인 페이지와 동일한 기준 적용) */}
                    {(() => {
                      const feat = getApartmentHighlightFeature(apt);
                      const avgPrice = (apt.price_min + apt.price_max) / 2;
                      // 가격대별 이미지 + 오버레이 색상
                      const tierImg =
                        avgPrice >= 300000 ? "/apt-tier-ultra.jpg"     // 30억 이상
                        : avgPrice >= 200000 ? "/apt-tier-premium.jpg" // 20억~30억
                        : avgPrice >= 100000 ? "/apt-tier-mid.jpg"     // 10억~20억
                        : "/apt-tier-standard.jpg";                    // 10억 미만
                      const tierOverlay =
                        avgPrice >= 300000 ? "from-black/70 via-black/40 to-transparent"
                        : avgPrice >= 200000 ? "from-slate-900/65 via-slate-800/35 to-transparent"
                        : avgPrice >= 100000 ? "from-slate-800/60 via-slate-700/30 to-transparent"
                        : "from-slate-700/55 via-slate-600/25 to-transparent";
                      return (
                        <div className="relative h-[140px] overflow-hidden">
                          {/* 배경 이미지 */}
                          <img
                            src={tierImg}
                            alt={apt.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* 그라디언트 오버레이 */}
                          <div className={`absolute inset-0 bg-gradient-to-t ${tierOverlay}`} />
                          {/* 콘텐츠 */}
                          <div className="absolute inset-0 flex flex-col justify-end px-4 pb-3 text-white">
                            {/* 태그 */}
                            <div className="flex flex-wrap gap-1.5 mb-1.5">
                              {apt.tags?.slice(0, 3).map((tag) => (
                                <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/25 border border-white/40 backdrop-blur-sm">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                            {/* 지역 + 단지명 */}
                            <div className="text-[11px] font-semibold text-white/75 mb-0.5 drop-shadow">{apt.region} {apt.district}</div>
                            <h3 className="text-lg font-extrabold text-white leading-tight group-hover:text-white/90 transition-colors drop-shadow-md truncate">
                              {apt.name}
                            </h3>
                            {/* 세대수 / 연식 / 평형 */}
                            <div className="flex items-center gap-3 mt-1.5 text-[11px] text-white/70 font-semibold">
                              <span>🏢 {apt.household_count.toLocaleString()}세대</span>
                              <span>📅 {apt.built_year}년 ({2026 - apt.built_year}년차)</span>
                              <span>📐 {apt.area_pyeong}평</span>
                            </div>
                          </div>
                          {/* 핵심 특징 배지 (우상단) */}
                          <div className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold bg-black/40 backdrop-blur-sm border border-white/20 text-white rounded-full px-2.5 py-0.5">
                            <span>{feat.icon}</span>
                            <span>{feat.badge || feat.label}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* 본문 정보 */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                      {/* 가격 정보 */}
                      <div className="bg-slate-50 rounded-2xl p-3.5 space-y-2 border border-slate-200/80">
                        {/* 매매 시세 */}
                        <div className="flex justify-between items-center text-xs gap-2">
                          <span className="font-bold text-rose-600 flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                            <span>매매</span>
                          </span>
                          <span className="font-extrabold text-rose-600 text-xs sm:text-sm text-right ml-auto whitespace-nowrap tracking-tight">
                            {formatPriceRange(apt.price_min, apt.price_max)}
                          </span>
                        </div>

                        {/* 전세 시세 */}
                        <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-200/60 gap-2">
                          <span className="font-bold text-blue-600 flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                            <span>전세</span>
                          </span>
                          <div className="flex items-center gap-1.5 ml-auto text-right whitespace-nowrap">
                            <span className="font-bold text-blue-700 text-xs tracking-tight">
                              {formatPriceRange(apt.rent_min || Math.round(apt.price_min * 0.55), apt.rent_max || Math.round(apt.price_max * 0.58))}
                            </span>
                            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1 py-0.5 rounded border border-blue-200 shrink-0">
                              {apt.jeonseRatio || Math.round(((apt.rent_min || apt.price_min * 0.55) / apt.price_min) * 100)}%
                            </span>
                          </div>
                        </div>

                        {/* 월세 시세 */}
                        <div className="flex justify-between items-center text-xs pt-1.5 border-t border-slate-200/60 gap-2">
                          <span className="font-bold text-emerald-700 flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                            <span>월세</span>
                          </span>
                          <span className="text-xs font-semibold text-emerald-800 text-right ml-auto whitespace-nowrap tracking-tight">
                            {formatRentMonthly(apt)}
                          </span>
                        </div>

                        {/* 단지 정보: 면적 / 주차 / 규모 */}
                        <div className="pt-2 border-t border-slate-200/60 space-y-1">
                          <div className="flex justify-between items-center text-xs text-slate-600">
                            <span className="text-slate-400">전용면적</span>
                            <span className="font-semibold text-slate-800">
                              {apt.area_sqm}㎡ ({apt.area_pyeong}평형)
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-slate-600">
                            <span className="text-slate-400">주차 / 규모</span>
                            <span className="font-semibold text-slate-800">
                              {apt.parkingRatio ? `세대당 ${apt.parkingRatio}대` : (apt.parking || "주차등록")}
                              {apt.dong_count ? ` · ${apt.dong_count}개동` : ""}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* 학군 · 교통 점수 카드 */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100/70">
                          <div className="text-slate-400 text-[11px]">🎓 학군 점수</div>
                          <div className="font-bold text-blue-700 text-sm mt-0.5">{apt.school_score}점</div>
                        </div>
                        <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100/70">
                          <div className="text-slate-400 text-[11px]">🚇 교통/역세권 점수</div>
                          <div className="font-bold text-indigo-700 text-sm mt-0.5">{apt.traffic_score}점</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {results.length > visibleCount && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 24)}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold rounded-2xl shadow-sm transition-all text-sm cursor-pointer"
                  >
                    <span>단지 더보기 (+24개)</span>
                    <span className="text-xs text-slate-400">
                      ({Math.min(visibleCount, results.length)} / {results.length.toLocaleString()})
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
