"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { APARTMENTS_DATA, Apartment, getApartmentHighlightFeature } from "@/lib/apartments";
import AptCardActionButtons from "@/components/AptCardActionButtons";
import { searchApartmentsWithNlp } from "@/lib/nlpSearch";

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
      "김해시", "양산시", "진주시", "거제시", "통영시", "사천시", "밀양시",
      "함안군", "거창군", "창녕군", "고성군", "하동군", "합천군", "남해군", "산청군", "함양군", "의령군"
    ]
  },
  "제주": {
    fullName: "제주특별자치도",
    sigungus: [
      "제주시", "서귀포시"
    ]
  }
};

// 시·도 및 시군구 대표 중심 좌표 매핑
const REGION_CENTERS: Record<string, { lat: number; lng: number }> = {
  "서울": { lat: 37.5665, lng: 126.9780 },
  "경기": { lat: 37.4138, lng: 127.5183 },
  "인천": { lat: 37.4563, lng: 126.7052 },
  "부산": { lat: 35.1796, lng: 129.0756 },
  "대구": { lat: 35.8714, lng: 128.6014 },
  "대전": { lat: 36.3504, lng: 127.3845 },
  "광주": { lat: 35.1595, lng: 126.8526 },
  "울산": { lat: 35.5384, lng: 129.3114 },
  "세종": { lat: 36.4800, lng: 127.2890 },
  "강원": { lat: 37.8228, lng: 128.1555 },
  "충북": { lat: 36.6357, lng: 127.4917 },
  "충남": { lat: 36.6588, lng: 126.6728 },
  "전북": { lat: 35.8202, lng: 127.1088 },
  "전남": { lat: 34.8161, lng: 126.4629 },
  "경북": { lat: 36.5760, lng: 128.5056 },
  "경남": { lat: 35.2383, lng: 128.6924 },
  "제주": { lat: 33.4996, lng: 126.5312 },
  "구리시": { lat: 37.5943, lng: 127.1402 },
  "남양주시": { lat: 37.6360, lng: 127.2165 },
  "성남분당구": { lat: 37.3827, lng: 127.1189 },
  "수원영통구": { lat: 37.2596, lng: 127.0465 },
  "용인수지구": { lat: 37.3220, lng: 127.0975 },
  "하남시": { lat: 37.5393, lng: 127.2148 },
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

function ApartmentSearchContent() {
  const searchParams = useSearchParams();

  // 검색 모드: 'nlp' (자연어 조합 검색 - 2번째 이미지) | 'filter' (조건 설정 - 1번째 이미지)
  const [searchMode, setSearchMode] = useState<"nlp" | "filter">("nlp");

  // 자연어 검색어 State
  const [nlpQuery, setNlpQuery] = useState("");
  const [nlpSummary, setNlpSummary] = useState<string | null>(null);

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
  // 지도 중심 좌표 State
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);

  // URL 쿼리 파라미터(?q=...) 전달 시 자동 검색 실행
  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q.trim()) {
      setNlpQuery(q.trim());
      setSearchMode("nlp");
      executeNlpSearch(q.trim());
    }
  }, [searchParams]);

  // 스마트 자연어 조합 검색 실행 함수
  const executeNlpSearch = async (queryText: string) => {
    if (!queryText.trim()) return;
    setLoading(true);
    setVisibleCount(24);

    try {
      const res = await searchApartmentsWithNlp(queryText.trim(), APARTMENTS_DATA);
      setResults(res.apartments);
      setNlpSummary(res.summaryBadge);
      setIsSearched(true);

      if (res.targetCenter) {
        setMapCenter(res.targetCenter);
      }
    } catch (err) {
      console.error("NLP Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNlpFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeNlpSearch(nlpQuery);
  };

  const triggerQuickSearch = (keyword: string) => {
    setNlpQuery(keyword);
    executeNlpSearch(keyword);
  };

  // 시/도 변경 시 시군구 자동 초기화
  const handleSidoChange = (newSido: string) => {
    setSido(newSido);
    setSigungu("전체");
  };

  // 조건 필터 검색 실행 함수
  const handleFilterSearch = () => {
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
      setNlpSummary(null);

      // 지역 중심 좌표 이동
      let newCenter: { lat: number; lng: number } | undefined;
      if (sigungu !== "전체" && REGION_CENTERS[sigungu]) {
        newCenter = REGION_CENTERS[sigungu];
      } else if (sido !== "전체" && REGION_CENTERS[sido]) {
        newCenter = REGION_CENTERS[sido];
      }

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
    setNlpQuery("");
    setNlpSummary(null);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-24 w-full">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
              <span className="text-white text-base sm:text-lg font-bold">F</span>
            </div>
            <span className="text-lg sm:text-xl font-bold gradient-text">찾아줘</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-semibold text-slate-600 shrink-0">
            <Link href="/" className="hover:text-indigo-600 transition-colors">홈</Link>
            <span className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-0.5 whitespace-nowrap">🏢 아파트 찾기</span>
            <Link href="/redevelopment" className="hover:text-indigo-600 transition-colors hidden sm:inline">🔨 재개발</Link>
            <Link href="/redevelopment/recommend" className="hover:text-indigo-600 transition-colors hidden sm:inline">🎯 구역추천</Link>
            <Link href="/subscriptions" className="hover:text-indigo-600 transition-colors hidden sm:inline">🏗️ 분양</Link>
            <Link href="/regional" className="hover:text-indigo-600 transition-colors hidden sm:inline">📍 지역정보</Link>
            <Link href="/community" className="hover:text-indigo-600 transition-colors hidden sm:inline font-bold">💬 커뮤니티</Link>
            <Link href="/pricing" className="hover:text-indigo-600 transition-colors hidden sm:inline font-bold text-amber-600">💎 요금제</Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Title Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="relative z-10 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-200 text-xs font-bold backdrop-blur-sm border border-indigo-400/20">
              <span>⚡</span> 전국 24,000+ 아파트 실거래 데이터 완벽 연동
            </div>
            <h1 className="text-xl sm:text-4xl font-extrabold tracking-tight">
              원하는 조건의 아파트를 찾아보세요
            </h1>
            <p className="text-indigo-200 text-xs sm:text-sm max-w-xl">
              검색어를 자연스럽게 조합하여 입력하거나, 세부 조건을 직접 선택하여 나에게 딱 맞는 최적의 단지를 찾아보세요.
            </p>
          </div>
          <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* 🌟 2가지 검색 방식 선택 탭 바 (스마트 조합 검색 VS 상세 조건 설정) */}
        <div className="flex items-center gap-1.5 sm:gap-2 p-1 sm:p-1.5 bg-slate-200/70 rounded-2xl max-w-md mx-auto sm:mx-0 shadow-inner w-full">
          <button
            type="button"
            onClick={() => setSearchMode("nlp")}
            className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer min-w-0 ${searchMode === "nlp"
                ? "bg-white text-indigo-700 shadow-md shadow-slate-300 scale-[1.01]"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <span>💬</span>
            <span className="sm:hidden whitespace-nowrap">스마트 검색</span>
            <span className="hidden sm:inline whitespace-nowrap">검색어 직접 입력 (스마트 조합)</span>
          </button>
          <button
            type="button"
            onClick={() => setSearchMode("filter")}
            className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1 sm:gap-2 cursor-pointer min-w-0 ${searchMode === "filter"
                ? "bg-white text-indigo-700 shadow-md shadow-slate-300 scale-[1.01]"
                : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <span>⚙️</span>
            <span className="sm:hidden whitespace-nowrap">조건 필터 검색</span>
            <span className="hidden sm:inline whitespace-nowrap">상세 조건 설정 (필터 검색)</span>
          </button>
        </div>

        {/* ===== 방식 1: 검색어 조합 스마트 입력 UI (두번째 첨부 이미지 스타일) ===== */}
        {searchMode === "nlp" && (
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-blue-50/60 rounded-3xl border border-indigo-100 shadow-sm p-4 sm:p-10 text-center space-y-4 w-full">
            <h2 className="text-lg sm:text-3xl font-extrabold text-slate-900 leading-snug break-keep">
              내가 찾는 부동산 정보,<br className="sm:hidden" />
              <span className="text-indigo-600 ml-1">한 눈에 직관적으로 비교해줘</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto break-keep font-medium">
              원하는 지역이나 단지명을 검색하세요.<br />
              시세, 세대수, 준공년도, 학군 및 역세권 점수까지 확인하세요.
            </p>

            {/* 통합 검색창 */}
            <form onSubmit={handleNlpFormSubmit} className="max-w-2xl mx-auto pt-2 w-full">
              <div className="relative flex items-center bg-white rounded-2xl border-2 border-indigo-200/90 hover:border-indigo-500 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100 shadow-md p-1 sm:p-2 transition-all w-full">
                <div className="pl-2.5 sm:pl-3.5 text-slate-400 shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={nlpQuery}
                  onChange={(e) => setNlpQuery(e.target.value)}
                  placeholder="예: 잠실역 5억대 / 구리 토평동 25평"
                  className="flex-1 min-w-0 px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-base bg-transparent outline-none text-slate-900 placeholder:text-slate-400 font-medium"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="shrink-0 px-3.5 sm:px-8 py-2 sm:py-3 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/30 transition-all cursor-pointer flex items-center justify-center gap-1 disabled:opacity-80 text-xs sm:text-base whitespace-nowrap"
                >
                  {loading ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>검색중</span>
                    </>
                  ) : (
                    <span>찾아줘</span>
                  )}
                </button>
              </div>
            </form>

            {/* 추천 검색어 칩 */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 pt-2 max-w-full">
              <span className="text-xs text-slate-400 font-semibold mr-1 shrink-0">💡 추천 키워드:</span>
              {[
                "잠실역 5억대 아파트",
                "구리 토평동 25평",
                "마포 30평대 10억 이하",
                "분당 신축 역세권",
                "해운대 84 대단지",
                "송도 6억대"
              ].map((keyword) => (
                <button
                  key={keyword}
                  type="button"
                  onClick={() => triggerQuickSearch(keyword)}
                  className="text-[11px] sm:text-xs font-semibold px-2.5 sm:px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/60 transition-all shadow-2xs cursor-pointer break-keep"
                >
                  #{keyword}
                </button>
              ))}
            </div>

            {/* 검색 파싱 분석 결과 배지 */}
            {nlpSummary && (
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-200/80 rounded-2xl text-indigo-900 text-xs sm:text-sm font-semibold shadow-2xs animate-fadeIn max-w-full">
                <span>🎯</span>
                <span className="break-keep">{nlpSummary}</span>
              </div>
            )}
          </div>
        )}

        {/* ===== 방식 2: 상세 조건 설정 UI (첫번째 첨부 이미지 스타일) ===== */}
        {searchMode === "filter" && (
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

                  <select
                    value={sigungu}
                    onChange={(e) => setSigungu(e.target.value)}
                    disabled={sido === "전체"}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="전체">시·군·구 전체</option>
                    {sido !== "전체" &&
                      NATIONWIDE_REGIONS[sido]?.sigungus.map((sg) => (
                        <option key={sg} value={sg}>
                          {sg}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              {/* 2. 입주년도 (연식) */}
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
                  <option value="5년 이내">✨ 5년 이내 (신축, 2021년~)</option>
                  <option value="10년 이내">🏢 10년 이내 (준신축, 2016년~)</option>
                  <option value="15년 이내">🏡 15년 이내 (2011년~)</option>
                  <option value="20년 이상">🧱 20년 이상 (구축/재건축 대상)</option>
                </select>
              </div>

              {/* 3. 단지 세대수 */}
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
                  <option value="500세대 이상">500세대 이상 (중대단지)</option>
                  <option value="1000세대 이상">1,000세대 이상 (대단지)</option>
                  <option value="3000세대 이상">3,000세대 이상 (초대형 랜드마크)</option>
                </select>
              </div>

              {/* 4. 전용 평형 */}
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
                  <option value="20평대">20평대 (전용 59㎡ 내외)</option>
                  <option value="30평대">30평대 (전용 84㎡ 국민평형)</option>
                  <option value="40평대 이상">40평대 이상 (대형 평형)</option>
                </select>
              </div>

              {/* 5. 매매 가격대 */}
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
                  <option value="10억 이하">10억 이하 (가성비·실속)</option>
                  <option value="10억~15억">10억 ~ 15억 (중상위)</option>
                  <option value="15억~20억">15억 ~ 20억 (상위권)</option>
                  <option value="20억~30억">20억 ~ 30억 (하이엔드)</option>
                  <option value="30억 이상">30억 이상 (초고가 랜드마크)</option>
                </select>
              </div>

              {/* 6. 역세권 도보 거리 */}
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
                onClick={handleFilterSearch}
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
        )}

        {/* ===== 검색 결과 지도 뷰 ===== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>🗺️</span> 아파트 실거래가 지도
            </h2>
            {isSearched && (
              <span className="text-xs font-semibold text-slate-500">
                지도에서 단지 마커를 클릭하면 상세 시세를 확인할 수 있습니다.
              </span>
            )}
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
              <p className="text-slate-400 text-xs">검색 조건을 조금 더 넓히거나 다른 검색어로 찾아보세요.</p>
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
                    {/* 가격대별 이미지 헤더 */}
                    {(() => {
                      const feat = getApartmentHighlightFeature(apt);
                      const avgPrice = (apt.price_min + apt.price_max) / 2;
                      const tierImg =
                        avgPrice >= 300000 ? "/apt-tier-ultra.jpg"
                          : avgPrice >= 200000 ? "/apt-tier-premium.jpg"
                            : avgPrice >= 100000 ? "/apt-tier-mid.jpg"
                              : "/apt-tier-standard.jpg";
                      const tierOverlay =
                        avgPrice >= 300000 ? "from-black/70 via-black/40 to-transparent"
                          : avgPrice >= 200000 ? "from-slate-900/65 via-slate-800/35 to-transparent"
                            : avgPrice >= 100000 ? "from-slate-800/60 via-slate-700/30 to-transparent"
                              : "from-slate-700/55 via-slate-600/25 to-transparent";
                      return (
                        <div className="relative h-[140px] overflow-hidden">
                          <img
                            src={tierImg}
                            alt={apt.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${tierOverlay}`} />

                          {/* 단지명 & 지역 */}
                          <div className="absolute bottom-3 left-3 right-3 text-white">
                            <span className="text-[10px] font-semibold text-white/80 bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
                              {apt.region} {apt.district}
                            </span>
                            <h3 className="text-base font-extrabold truncate mt-1 drop-shadow-sm">
                              {apt.name}
                            </h3>
                          </div>

                          {/* 뱃지 */}
                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                              {apt.area_pyeong}평
                            </span>
                            {feat && (
                              <span className="bg-white/90 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                {feat.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* 카드 본문 */}
                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-2">
                        {/* 시세 정보 */}
                        <div className="flex items-baseline justify-between border-b border-slate-100 pb-2.5">
                          <span className="text-xs font-semibold text-slate-500">실거래 매매가</span>
                          <span className="text-base font-black text-indigo-600">
                            {formatPriceRange(apt.price_min, apt.price_max)}
                          </span>
                        </div>

                        {/* 전월세 시세 */}
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span>전월세 추정</span>
                          <span className="font-semibold text-slate-700">
                            {formatRentMonthly(apt)}
                          </span>
                        </div>

                        {/* 단지 주요 정보 스펙 (세대수, 연식, 도보시간) */}
                        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                          <div className="bg-slate-50 rounded-xl p-2">
                            <div className="text-[10px] text-slate-400 font-medium">세대수</div>
                            <div className="text-xs font-bold text-slate-800 mt-0.5">
                              {apt.household_count.toLocaleString()}세대
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-2">
                            <div className="text-[10px] text-slate-400 font-medium">준공연도</div>
                            <div className="text-xs font-bold text-slate-800 mt-0.5">
                              {apt.built_year}년
                            </div>
                          </div>
                          <div className="bg-slate-50 rounded-xl p-2">
                            <div className="text-[10px] text-slate-400 font-medium">역세권</div>
                            <div className="text-xs font-bold text-indigo-600 mt-0.5">
                              {apt.walk_minutes ? `도보 ${apt.walk_minutes}분` : "인근"}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 관심 등록 및 공유 버튼 */}
                      <div className="pt-2 border-t border-slate-100">
                        <AptCardActionButtons apt={apt} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* 더보기 버튼 */}
              {visibleCount < results.length && (
                <div className="pt-6 text-center">
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 24)}
                    className="px-8 py-3.5 bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 font-bold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer"
                  >
                    아파트 단지 더보기 ({visibleCount} / {results.length})
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

export default function ApartmentSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-bold text-slate-600">아파트 검색 페이지를 불러오는 중입니다...</p>
          </div>
        </div>
      }
    >
      <ApartmentSearchContent />
    </Suspense>
  );
}
