"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Apartment {
  id: string;
  name: string;
  region: string;
  district: string;
  price_min: number;
  price_max: number;
  area_sqm: number;
  area_pyeong: number;
  built_year: number;
  household_count: number;
  school_score: number;
  traffic_score: number;
  nature_score: number;
  tags: string[];
  image_url: string;
}

const QUICK_TAGS = [
  { label: "전체", icon: "🏢", query: "" },
  { label: "서울", icon: "🏙️", query: "서울" },
  { label: "경기", icon: "🏘️", query: "경기" },
  { label: "역세권", icon: "🚇", query: "역세권" },
  { label: "신축", icon: "✨", query: "신축" },
  { label: "대단지", icon: "🏗️", query: "대단지" },
  { label: "초품아", icon: "🏫", query: "초품아" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState("");
  const [modalApt, setModalApt] = useState<Apartment | null>(null);

  // Supabase에서 아파트 목록 가져오기
  const fetchApartments = async (keyword = "", tag = "") => {
    setLoading(true);
    let query = supabase.from("apartments").select("*");

    if (keyword) {
      query = query.or(`name.ilike.%${keyword}%,region.ilike.%${keyword}%,district.ilike.%${keyword}%`);
    }

    if (tag && tag !== "전체") {
      if (tag === "서울" || tag === "경기") {
        query = query.ilike("region", `%${tag}%`);
      } else {
        query = query.contains("tags", [tag]);
      }
    }

    const { data, error } = await query;
    if (error) {
      console.error("Error fetching apartments:", error);
    } else {
      setApartments(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApartments(searchQuery, selectedTag);
  };

  const handleTagClick = (tagQuery: string) => {
    setSelectedTag(tagQuery);
    fetchApartments(searchQuery, tagQuery);
  };

  const formatPrice = (price: number) => {
    const uk = Math.floor(price / 10000);
    const cheon = price % 10000;
    if (uk > 0 && cheon > 0) return `${uk}억 ${cheon.toLocaleString()}만`;
    if (uk > 0) return `${uk}억원`;
    return `${price.toLocaleString()}만원`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-md">
              F
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              찾아줘
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              로그인
            </button>
            <button className="px-4 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition-all">
              공인중개사 등록
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 sm:py-24 bg-gradient-to-b from-blue-50/50 via-slate-50 to-slate-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-semibold mb-6">
            <span>✨ Real-time Supabase Data Connected</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            서울·경기 아파트 실거래가 & 조건검색
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              원하는 집을 한 눈에 찾아줘
            </span>
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
            단지명, 지역(대치동, 분당 등), 또는 특징태그를 검색해보세요.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto mb-6">
            <div className="flex items-center bg-white rounded-2xl border border-slate-300 p-2 shadow-xl shadow-slate-200/50 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
              <span className="pl-4 text-slate-400">🔍</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="예: 대치동, 반포 자이, 역세권, 34평"
                className="w-full px-4 py-3 bg-transparent outline-none text-slate-800 placeholder:text-slate-400 text-sm sm:text-base"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all text-sm sm:text-base shrink-0"
              >
                검색
              </button>
            </div>
          </form>

          {/* Quick Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag.label}
                onClick={() => handleTagClick(tag.query)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedTag === tag.query
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                <span>{tag.icon}</span>
                <span>{tag.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content: Real-time Apartments Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">🏢 아파트 검색 결과</h2>
            <p className="text-slate-500 text-sm mt-1">
              Supabase 실시간 데이터베이스에서 불러온 검색 결과입니다. (총 {apartments.length}개 단지)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : apartments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-slate-500 font-medium">검색 조건에 일치하는 아파트가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {apartments.map((apt) => (
              <div
                key={apt.id}
                onClick={() => setModalApt(apt)}
                className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={apt.image_url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80"}
                    alt={apt.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                    {apt.tags?.map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-xs font-semibold text-blue-600 mb-1">
                      {apt.region} {apt.district}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {apt.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>매매 시세</span>
                      <span className="font-bold text-sm text-slate-900">
                        {formatPrice(apt.price_min)} ~ {formatPrice(apt.price_max)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>평형 / 준공</span>
                      <span className="font-semibold text-slate-700">
                        {apt.area_pyeong}평 ({apt.area_sqm}㎡) / {apt.built_year}년
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal Detail View */}
      {modalApt && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-56">
              <img src={modalApt.image_url} alt={modalApt.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setModalApt(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <div className="text-xs font-semibold text-blue-600 mb-1">
                {modalApt.region} {modalApt.district}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">{modalApt.name}</h3>
              <div className="flex flex-wrap gap-1.5 mb-6">
                {modalApt.tags?.map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-lg">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                <div>
                  <div className="text-xs text-slate-400">매매 예상 시세</div>
                  <div className="text-base font-extrabold text-blue-600 mt-0.5">
                    {formatPrice(modalApt.price_min)} ~ {formatPrice(modalApt.price_max)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">단지 세대수</div>
                  <div className="text-base font-bold text-slate-800 mt-0.5">
                    {modalApt.household_count.toLocaleString()}세대 ({modalApt.built_year}년)
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">학군 점수</div>
                  <div className="text-base font-bold text-slate-800 mt-0.5">🎓 {modalApt.school_score}점</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">교통/역세권 점수</div>
                  <div className="text-base font-bold text-slate-800 mt-0.5">🚇 {modalApt.traffic_score}점</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md">
                  상세 실거래 리포트 받기 (무료)
                </button>
                <button
                  onClick={() => setModalApt(null)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-sm transition-all"
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
