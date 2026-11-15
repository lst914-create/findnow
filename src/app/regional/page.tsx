"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { RegionalPlace, RegionalCategory, getCategoryLabel } from "@/lib/regionalApi";

// 아파트 찾기와 동일한 전국 17개 시·도 및 시·군·구 매핑
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
    sigungus: ["연수구", "남동구", "부평구", "서해구", "검단구", "미추홀구", "계양구", "중구", "동구", "영종구", "제물포구", "강화군", "옹진군"]
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
    sigungus: ["수성구", "달서구", "중구", "동구", "서구", "남구", "북구", "달성군", "군위군"]
  },
  "대전": {
    fullName: "대전광역시",
    sigungus: ["유성구", "서구", "중구", "동구", "대덕구"]
  },
  "광주": {
    fullName: "광주광역시",
    sigungus: ["광산구", "서구", "남구", "북구", "동구"]
  },
  "울산": {
    fullName: "울산광역시",
    sigungus: ["남구", "중구", "북구", "동구", "울주군"]
  },
  "세종": {
    fullName: "세종특별자치시",
    sigungus: ["세종시 전체"]
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
    sigungus: ["제주시", "서귀포시"]
  }
};

const CATEGORY_TABS = [
  { label: "전체 모아보기", value: "all", icon: "🌟" },
  { label: "관광지 / 명소", value: "tourist", icon: "🏞️" },
  { label: "관광·문화시설", value: "facility", icon: "🏛️" },
  { label: "지역 대표 맛집", value: "food", icon: "🍽️" },
  { label: "특수·복합시설", value: "special", icon: "🛍️" },
];

export default function RegionalInfoPage() {
  const [sido, setSido] = useState("서울");
  const [sigungu, setSigungu] = useState("강남구");
  const [selectedCategory, setSelectedCategory] = useState<RegionalCategory | "all">("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [places, setPlaces] = useState<RegionalPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    touristCount: 0,
    facilityCount: 0,
    specialCount: 0,
    foodCount: 0,
  });

  // 현재 선택된 지역 문자열 (API 호출용)
  const selectedRegion = sigungu === "전체" ? sido : `${sido} ${sigungu}`;

  // 시·도 변경 시 시·군·구 초기화
  const handleSidoChange = (newSido: string) => {
    setSido(newSido);
    setSigungu("전체");
  };

  // 데이터 조회 함수
  const fetchPlaces = async (region: string, category: string, keyword: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        region,
        category,
        keyword,
      });
      const res = await fetch(`/api/regional?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setPlaces(data.places || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.error("Failed to fetch regional places:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces(selectedRegion, selectedCategory, searchKeyword);
  }, [selectedRegion, selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPlaces(selectedRegion, selectedCategory, searchKeyword);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      {/* 1. GNB 헤더 */}
      <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
                <span className="text-white text-base sm:text-lg font-bold">F</span>
              </div>
              <span className="text-lg sm:text-xl font-bold gradient-text">찾아줘</span>
            </Link>

            {/* 네비게이션 */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold">
              <Link
                href="/search"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                🏢 아파트 찾기
              </Link>
              <Link
                href="/redevelopment"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                🔨 재개발·정비사업
              </Link>
              <Link
                href="/subscriptions"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                🏗️ 분양
              </Link>
              <Link
                href="/regional"
                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200"
              >
                📍 지역정보
              </Link>
              <Link
                href="/community"
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-1 font-bold"
              >
                <span>💬 커뮤니티</span>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* 2. 히어로 배너 */}
      <section className="bg-gradient-to-b from-sky-900 via-indigo-950 to-slate-950 text-white py-10 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-xs font-bold mb-3">
                <span>📍 지역 인프라 & 라이프스타일 탐색</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                지역별 관광지 · 문화시설 · 특수시설 · 맛집
              </h1>
              <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
                거주지 주변의 주요 명소부터 박물관·미술관, 대형 복합쇼핑몰(스타필드·아울렛) 및 종합병원, 지역 대표 맛집까지 한눈에 확인하세요.
              </p>
            </div>

            {/* 통계 요약 칩 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 shrink-0 bg-white/5 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
              <div className="px-3 py-2 bg-white/5 rounded-xl text-center">
                <div className="text-[11px] font-medium text-sky-300">🏞️ 관광지</div>
                <div className="text-xl font-black text-white">{stats.touristCount}곳</div>
              </div>
              <div className="px-3 py-2 bg-white/5 rounded-xl text-center">
                <div className="text-[11px] font-medium text-indigo-300">🏛️ 문화시설</div>
                <div className="text-xl font-black text-white">{stats.facilityCount}곳</div>
              </div>
              <div className="px-3 py-2 bg-white/5 rounded-xl text-center">
                <div className="text-[11px] font-medium text-amber-300">🍽️ 맛집</div>
                <div className="text-xl font-black text-white">{stats.foodCount}곳</div>
              </div>
              <div className="px-3 py-2 bg-white/5 rounded-xl text-center">
                <div className="text-[11px] font-medium text-emerald-300">🛍️ 특수시설</div>
                <div className="text-xl font-black text-white">{stats.specialCount}곳</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 컨트롤 바 (지역 선택, 카테고리 탭, 검색바) */}
      <section className="bg-white border-b border-slate-200/80 sticky top-16 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 space-y-3">

          {/* 아파트 찾기와 동일한 2단계 드롭다운 지역 선택 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0">
              <span>📍</span> 지역 선택:
            </span>
            <div className="flex items-center gap-2">
              {/* 1단계: 시·도 선택 */}
              <select
                value={sido}
                onChange={(e) => handleSidoChange(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                {Object.keys(NATIONWIDE_REGIONS).map((s) => (
                  <option key={s} value={s}>
                    {s} ({NATIONWIDE_REGIONS[s].fullName})
                  </option>
                ))}
              </select>

              {/* 2단계: 시·군·구 선택 */}
              <select
                value={sigungu}
                onChange={(e) => setSigungu(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
              >
                <option value="전체">시·군·구 전체</option>
                {NATIONWIDE_REGIONS[sido]?.sigungus.map((sg) => (
                  <option key={sg} value={sg}>{sg}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 카테고리 탭 & 검색창 */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
            {/* 카테고리 탭 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs font-bold">
              {CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedCategory(tab.value as any)}
                  className={`px-3 py-1.5 rounded-xl whitespace-nowrap border transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === tab.value
                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-2xs font-extrabold"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* 검색 폼 */}
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="장소명, 스타필드, 호수공원, 카페 검색..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-14 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                🔍
              </span>
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-slate-900 hover:bg-blue-600 text-white text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-semibold"
              >
                검색
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 4. 장소 리스트 메인 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex-1 w-full">
        <div className="flex items-center justify-between mb-5">
          <div className="text-xs sm:text-sm text-slate-500 font-medium">
            <span className="font-bold text-slate-900">{selectedRegion}</span> 기준{" "}
            <span className="font-extrabold text-blue-600">{places.length}</span>개의 주요 장소
          </div>
          {searchKeyword && (
            <button
              onClick={() => {
                setSearchKeyword("");
                fetchPlaces(selectedRegion, selectedCategory, "");
              }}
              className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
            >
              검색어 초기화 ↺
            </button>
          )}
        </div>

        {/* 로딩 인디케이터 */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs animate-pulse space-y-4"
              >
                <div className="h-40 bg-slate-200 rounded-2xl" />
                <div className="h-6 w-3/4 bg-slate-200 rounded-lg" />
                <div className="h-4 w-full bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : places.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {places.map((place) => {
              const categoryBadge = (() => {
                switch (place.category) {
                  case "tourist":
                    return "bg-sky-50 text-sky-700 border-sky-200";
                  case "facility":
                    return "bg-indigo-50 text-indigo-700 border-indigo-200";
                  case "food":
                    return "bg-amber-50 text-amber-700 border-amber-200";
                  case "special":
                    return "bg-emerald-50 text-emerald-700 border-emerald-200";
                }
              })();

              return (
                <div
                  key={place.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5"
                >
                  <div>
                    {/* 대표 썸네일 이미지 */}
                    {place.imageUrl && (
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={place.imageUrl}
                          alt={place.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold border backdrop-blur-md shadow-xs ${categoryBadge}`}
                          >
                            {getCategoryLabel(place.category).split(" ")[0]}{" "}
                            {place.categoryDetail || getCategoryLabel(place.category)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="p-5">
                      {/* 장소명 */}
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-1 mb-1">
                        {place.title}
                      </h3>

                      {/* 세부 분류 */}
                      <div className="text-xs font-semibold text-slate-500 mb-2 truncate">
                        {place.categoryDetail}
                      </div>

                      {/* 주소 */}
                      <p className="text-xs text-slate-600 line-clamp-1 mb-1.5 flex items-start gap-1">
                        <span className="shrink-0 text-slate-400">📍</span>
                        <span className="truncate">{place.roadAddress || place.address}</span>
                      </p>

                      {/* 전화번호 */}
                      {place.tel && (
                        <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                          <span className="shrink-0 text-slate-400">📞</span>
                          <a
                            href={`tel:${place.tel.replace(/[^0-9]/g, "")}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {place.tel}
                          </a>
                        </p>
                      )}

                      {/* 설명/개요 (있는 경우) */}
                      {place.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mb-3 leading-relaxed">
                          {place.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 하단 버튼 액션 */}
                  <div className="p-5 pt-0 flex items-center gap-2">
                    <a
                      href={place.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer text-center"
                    >
                      카카오맵 상세 정보 ↗
                    </a>
                    {place.lat > 0 && place.lng > 0 && (
                      <a
                        href={`https://map.kakao.com/link/to/${encodeURIComponent(
                          place.title
                        )},${place.lat},${place.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center whitespace-nowrap"
                        title="카카오맵 길찾기"
                      >
                        🚗 길찾기
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs max-w-lg mx-auto">
            <span className="text-4xl block mb-3">📍</span>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              해당 조건의 장소를 찾을 수 없습니다.
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              지역명을 변경하거나 다른 카테고리를 선택해 보세요.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchKeyword("");
                fetchPlaces(selectedRegion, "all", "");
              }}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors cursor-pointer"
            >
              전체 장소 보기
            </button>
          </div>
        )}

        {/* 5. 지역 인프라 가이드 안내 */}
        <section className="mt-14 bg-gradient-to-br from-slate-900 to-sky-950 rounded-3xl p-6 sm:p-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">💡</span>
            <h2 className="text-lg font-bold">부동산 가치를 결정하는 핵심 지역 인프라</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="font-bold text-white mb-1.5 flex items-center gap-1">
                <span>🛍️</span> 특수시설(스타필드·대형마트)
              </div>
              <p className="leading-relaxed">
                스타필드, 롯데몰 등 대형 복합쇼핑몰과 종합병원은 도보·차량 10분 내 거주 선호도를 극대화하여 아파트 가치를 견인하는 핵심 몰세권 인프라입니다.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="font-bold text-white mb-1.5 flex items-center gap-1">
                <span>🏞️</span> 자연환경 및 힐링 관광명소
              </div>
              <p className="leading-relaxed">
                호수공원, 수목원, 도립공원 등 대형 녹지와 명소는 입주민의 삶의 질(숲세권·공세권 프리미엄)을 높여 매매 및 전세 수요를 탄탄하게 유지합니다.
              </p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
              <div className="font-bold text-white mb-1.5 flex items-center gap-1">
                <span>🍽️</span> 상권 활성화 및 중심 맛집거리
              </div>
              <p className="leading-relaxed">
                전통시장, 대표 맛집 골목, 카페거리가 형성된 지역은 유동인구가 풍부하여 상권과 교통망이 지속적으로 발전하는 선순환 구조를 가집니다.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>찾아줘 — 카카오 로컬 REST API 및 한국관광공사 TourAPI 연동 지역정보 서비스</div>
          <div>제공되는 정보는 위치 기준 데이터이며 실제 영업 시간 등은 각 매장 및 카카오맵을 확인하시기 바랍니다.</div>
        </div>
      </footer>
    </div>
  );
}
