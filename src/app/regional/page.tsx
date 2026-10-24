"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { RegionalPlace, RegionalCategory, getCategoryLabel } from "@/lib/regionalApi";

const POPULAR_REGIONS = [
  { label: "서울 강남구", value: "서울 강남구" },
  { label: "서울 종로구", value: "서울 종로구" },
  { label: "서울 용산구", value: "서울 용산구" },
  { label: "서울 송파구", value: "서울 송파구" },
  { label: "서울 마포구", value: "서울 마포구" },
  { label: "경기 성남시(판교·분당)", value: "경기 성남시" },
  { label: "경기 수원시(광교)", value: "경기 수원시" },
  { label: "경기 화성시(동탄)", value: "경기 화성시" },
  { label: "경기 남양주시(다산)", value: "경기 남양주시" },
  { label: "부산 해운대구", value: "부산 해운대구" },
  { label: "부산 수영구", value: "부산 수영구" },
  { label: "제주 제주시", value: "제주 제주시" },
];

const CATEGORY_TABS = [
  { label: "전체 모아보기", value: "all", icon: "🌟" },
  { label: "관광지 / 명소", value: "tourist", icon: "🏞️" },
  { label: "관광·문화시설", value: "facility", icon: "🏛️" },
  { label: "지역 대표 맛집", value: "food", icon: "🍽️" },
  { label: "특수·복합시설", value: "special", icon: "🛍️" },
];

export default function RegionalInfoPage() {
  const [selectedRegion, setSelectedRegion] = useState("서울 강남구");
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
              <span className="text-2xl group-hover:scale-110 transition-transform">🔍</span>
              <span className="text-xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent tracking-tight">
                찾아줘
              </span>
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

          <div className="flex items-center gap-2">
            <div className="text-xs font-semibold text-slate-500 hidden sm:flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
              <span>카카오 로컬 & TourAPI 실시간 연동</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
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

      {/* 3. 컨트롤 바 (지역 칩, 카테고리 탭, 검색바) */}
      <section className="bg-white border-b border-slate-200/80 sticky top-16 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 space-y-3">
          {/* 주요 지역 칩 바로가기 */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
            <span className="text-slate-400 font-bold shrink-0 mr-1">지역 선택:</span>
            {POPULAR_REGIONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setSelectedRegion(r.value)}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  selectedRegion === r.value
                    ? "bg-slate-900 text-white shadow-xs font-bold"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {r.label}
              </button>
            ))}
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
