"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Apartment {
  id: string | number;
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
  station?: string;
  station_dist?: string;
}

const INITIAL_MOCK_APARTMENTS: Apartment[] = [
  {
    id: "1",
    name: "래미안 대치팰리스 1단지",
    region: "서울 강남구",
    district: "대치동",
    price_min: 270000,
    price_max: 340000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2015,
    household_count: 1278,
    school_score: 99,
    traffic_score: 92,
    nature_score: 78,
    tags: ["초품아", "학군대표", "역세권", "대단지"],
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    station: "대치역(3호선)",
    station_dist: "240m (도보 3분)",
  },
  {
    id: "2",
    name: "반포 자이",
    region: "서울 서초구",
    district: "반포동",
    price_min: 280000,
    price_max: 360000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2009,
    household_count: 3410,
    school_score: 96,
    traffic_score: 98,
    nature_score: 85,
    tags: ["역세권", "대단지", "한강조망", "커뮤니티"],
    image_url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    station: "사평역(9호선)",
    station_dist: "180m (도보 2분)",
  },
  {
    id: "3",
    name: "마포 프레스티지 자이",
    region: "서울 마포구",
    district: "염리동",
    price_min: 165000,
    price_max: 195000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2021,
    household_count: 1694,
    school_score: 88,
    traffic_score: 95,
    nature_score: 82,
    tags: ["신축", "역세권", "직주근접", "대단지"],
    image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    station: "이대역(2호선)",
    station_dist: "350m (도보 5분)",
  },
  {
    id: "4",
    name: "헬리오시티",
    region: "서울 송파구",
    district: "가락동",
    price_min: 180000,
    price_max: 220000,
    area_sqm: 84,
    area_pyeong: 33,
    built_year: 2018,
    household_count: 9510,
    school_score: 91,
    traffic_score: 93,
    nature_score: 80,
    tags: ["대단지", "초품아", "역세권", "신축"],
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    station: "송파역(8호선)",
    station_dist: "150m (도보 2분)",
  },
  {
    id: "5",
    name: "판교 푸르지오 그랑블",
    region: "경기 성남시",
    district: "백현동",
    price_min: 220000,
    price_max: 260000,
    area_sqm: 98,
    area_pyeong: 38,
    built_year: 2011,
    household_count: 948,
    school_score: 94,
    traffic_score: 99,
    nature_score: 90,
    tags: ["판교역세권", "직주근접", "공원인접", "학군굿"],
    image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    station: "판교역(신분당선)",
    station_dist: "200m (도보 3분)",
  },
  {
    id: "6",
    name: "킨텍스 꿈에그린",
    region: "경기 고양시",
    district: "대화동",
    price_min: 95000,
    price_max: 125000,
    area_sqm: 84,
    area_pyeong: 35,
    built_year: 2019,
    household_count: 1880,
    school_score: 82,
    traffic_score: 89,
    nature_score: 88,
    tags: ["GTX호재", "신축", "대공원", "대단지"],
    image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    station: "킨텍스역(GTX-A)",
    station_dist: "300m (도보 4분)",
  },
  {
    id: "7",
    name: "DMC 롯데캐슬 더 퍼스트",
    region: "서울 은평구",
    district: "수색동",
    price_min: 115000,
    price_max: 138000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2020,
    household_count: 1192,
    school_score: 84,
    traffic_score: 91,
    nature_score: 85,
    tags: ["DMC직주근접", "신축", "역세권"],
    image_url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    station: "수색역(경의중앙선)",
    station_dist: "400m (도보 6분)",
  },
  {
    id: "8",
    name: "광교 중흥S-클래스",
    region: "경기 수원시",
    district: "하동",
    price_min: 135000,
    price_max: 175000,
    area_sqm: 84,
    area_pyeong: 35,
    built_year: 2019,
    household_count: 2231,
    school_score: 90,
    traffic_score: 92,
    nature_score: 98,
    tags: ["호수공원뷰", "신축", "광교중앙역", "초품아"],
    image_url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
    station: "광교중앙역(신분당선)",
    station_dist: "500m (도보 7분)",
  },
  {
    id: "9",
    name: "아크로리버파크",
    region: "서울 서초구",
    district: "반포동",
    price_min: 350000,
    price_max: 420000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2016,
    household_count: 1612,
    school_score: 98,
    traffic_score: 97,
    nature_score: 99,
    tags: ["한강조망", "프리미엄", "신반포역", "초품아"],
    image_url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
    station: "신반포역(9호선)",
    station_dist: "350m (도보 5분)",
  },
  {
    id: "10",
    name: "올림픽파크 포레온 (둔촌주공)",
    region: "서울 강동구",
    district: "둔촌동",
    price_min: 170000,
    price_max: 210000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2025,
    household_count: 12032,
    school_score: 95,
    traffic_score: 94,
    nature_score: 92,
    tags: ["초대단지", "신축입주", "올림픽공원", "학군인접"],
    image_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    station: "둔촌동역(5호선)",
    station_dist: "200m (도보 3분)",
  },
  {
    id: "11",
    name: "평촌 더샵 아이파크",
    region: "경기 안양시",
    district: "호계동",
    price_min: 88000,
    price_max: 110000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2019,
    household_count: 1174,
    school_score: 92,
    traffic_score: 88,
    nature_score: 84,
    tags: ["평촌학원가", "신축", "대단지"],
    image_url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    station: "범계역(4호선)",
    station_dist: "800m (도보 11분)",
  },
  {
    id: "12",
    name: "송도 더샵 센트럴파크 2차",
    region: "인천 연수구",
    district: "송도동",
    price_min: 75000,
    price_max: 98000,
    area_sqm: 98,
    area_pyeong: 39,
    built_year: 2011,
    household_count: 632,
    school_score: 89,
    traffic_score: 86,
    nature_score: 97,
    tags: ["센트럴파크뷰", "국제학교", "공원인접"],
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    station: "센트럴파크역(인천1호선)",
    station_dist: "300m (도보 4분)",
  },
];

const QUICK_TAGS = [
  { label: "전체", icon: "🏢", query: "" },
  { label: "서울", icon: "🏙️", query: "서울" },
  { label: "경기", icon: "🏘️", query: "경기" },
  { label: "역세권", icon: "🚇", query: "역세권" },
  { label: "신축", icon: "✨", query: "신축" },
  { label: "대단지", icon: "🏗️", query: "대단지" },
  { label: "초품아", icon: "🏫", query: "초품아" },
];

const TODAY_STATS = [
  { label: "등록 아파트", value: "12,847", unit: "단지", icon: "🏢" },
  { label: "오늘 실거래", value: "234", unit: "건", icon: "📊" },
  { label: "분양 예정", value: "18", unit: "단지", icon: "🏗️" },
  { label: "검색 이용", value: "5,420", unit: "회", icon: "🔍" },
];

const NAV_ITEMS = [
  { label: "아파트 찾기", href: "/", icon: "🏢" },
  { label: "재개발", href: "#", icon: "🔨" },
  { label: "분양", href: "#", icon: "🏗️" },
  { label: "실거래가", href: "#", icon: "💰" },
  { label: "지역정보", href: "#", icon: "📍" },
  { label: "블로그", href: "#", icon: "📝" },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [apartments, setApartments] = useState<Apartment[]>(INITIAL_MOCK_APARTMENTS);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchApartments = async (keyword = searchQuery, tag = selectedTag) => {
    setLoading(true);
    let supabaseSuccess = false;

    try {
      let query = supabase.from("apartments").select("*");

      if (keyword.trim()) {
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
      if (!error && data && data.length > 0) {
        setApartments(data);
        supabaseSuccess = true;
      }
    } catch {
      supabaseSuccess = false;
    }

    if (!supabaseSuccess) {
      let filtered = INITIAL_MOCK_APARTMENTS;

      if (keyword.trim()) {
        const words = keyword.toLowerCase().split(" ");
        filtered = filtered.filter((apt) =>
          words.some(
            (w) =>
              apt.name.toLowerCase().includes(w) ||
              apt.region.toLowerCase().includes(w) ||
              apt.district.toLowerCase().includes(w) ||
              apt.tags.some((t) => t.toLowerCase().includes(w))
          )
        );
      }

      if (tag && tag !== "전체") {
        if (tag === "서울" || tag === "경기") {
          filtered = filtered.filter((apt) => apt.region.includes(tag));
        } else {
          filtered = filtered.filter((apt) => apt.tags.includes(tag));
        }
      }

      setApartments(filtered);
    }
    setLoading(false);
  };

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
    <div className="min-h-screen bg-surface-50 text-surface-900 font-sans">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-lg shadow-brand-500/5 bg-white/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
                <span className="text-white text-lg font-bold">F</span>
              </div>
              <span className="text-xl font-bold gradient-text">찾아줘</span>
            </a>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200"
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 transition-all duration-200 cursor-pointer">
                로그인
              </button>
              <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] transition-all duration-200 cursor-pointer">
                시작하기
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-surface-50 to-accent-50" />
          <div className="absolute top-20 -left-32 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 -right-32 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl animate-float delay-300" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100/60 border border-brand-200/60 mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            <span className="text-sm font-medium text-brand-700">서울·경기 핵심 아파트 정보 검색</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            <span className="text-surface-900">내가 찾는 부동산 정보,</span>
            <br />
            <span className="gradient-text">한 눈에 직관적으로 비교해줘</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
            원하는 지역이나 단지명을 검색하세요. 시세, 세대수, 준공년도, 학군 및 지하철 역세권 점수까지 화면에서 바로 확인하실 수 있습니다.
          </p>

          {/* Search Input Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
            <div className="search-glow relative flex items-center bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 p-2">
              <div className="pl-3 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="예: 반포동, 래미안, 역세권, 34평"
                className="flex-1 px-4 py-3 text-base sm:text-lg bg-transparent outline-none placeholder:text-gray-400 text-surface-900"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                찾아줘
              </button>
            </div>
          </form>

          {/* Quick Tags */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {QUICK_TAGS.map((tag) => (
              <button
                key={tag.label}
                onClick={() => handleTagClick(tag.query)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedTag === tag.query
                    ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
                    : "bg-white/80 border border-gray-200/80 text-gray-600 hover:bg-brand-50 hover:text-brand-600"
                }`}
              >
                <span className="text-base">{tag.icon}</span>
                {tag.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative py-6 -mt-8 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass rounded-2xl shadow-xl shadow-gray-200/30 p-6 bg-white/70 backdrop-blur-md border border-white">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {TODAY_STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl mb-1">{stat.icon}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">
                    {stat.value}
                    <span className="text-sm font-medium text-gray-400 ml-1">{stat.unit}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Apartment Grid (All Info Direct View - No Popups Required) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">🏢 아파트 검색 결과</h2>
            <p className="text-gray-500 mt-1">
              팝업을 띄우지 않고 시세, 학군, 교통, 세대수 상세 정보를 카드 화면에서 직접 확인하실 수 있습니다. (총 {apartments.length}개)
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-96 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : apartments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg font-medium">검색 조건에 맞는 아파트가 없습니다.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTag("");
                setApartments(INITIAL_MOCK_APARTMENTS);
              }}
              className="mt-4 px-4 py-2 bg-brand-50 text-brand-600 font-semibold rounded-xl text-sm cursor-pointer"
            >
              전체 목록 다시 보기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apartments.map((apt) => (
              <div
                key={apt.id}
                className="group relative bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-500/10 transition-all duration-300 flex flex-col"
              >
                <div className="h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-accent-400" />

                {/* Top Image Banner with Tags */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={apt.image_url}
                    alt={apt.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
                    {apt.tags?.map((tag) => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/95 text-brand-700 shadow-sm backdrop-blur-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Content - Full Detailed Info View */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-brand-600 mb-1">
                      {apt.region} {apt.district}
                    </div>
                    <h3 className="text-xl font-bold text-surface-900 group-hover:text-brand-600 transition-colors">
                      {apt.name}
                    </h3>
                  </div>

                  {/* Price & Primary Specs */}
                  <div className="bg-surface-50 p-3.5 rounded-xl border border-gray-100 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-500">매매 시세</span>
                      <span className="text-base font-extrabold text-warm-500">
                        {formatPrice(apt.price_min)} ~ {formatPrice(apt.price_max)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-600 pt-1 border-t border-gray-200/60">
                      <span>단지 정보</span>
                      <span className="font-semibold text-gray-800">
                        {apt.area_pyeong}평 ({apt.area_sqm}㎡) / {apt.household_count.toLocaleString()}세대 ({apt.built_year}년)
                      </span>
                    </div>
                  </div>

                  {/* Detailed Indicators directly shown (Station, School, Traffic, Nature) */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-brand-50/60 p-2.5 rounded-lg border border-brand-100/60">
                      <div className="text-gray-400 text-[11px]">🎓 학군 점수</div>
                      <div className="font-bold text-brand-700 text-sm mt-0.5">{apt.school_score}점</div>
                    </div>
                    <div className="bg-accent-50/60 p-2.5 rounded-lg border border-accent-100/60">
                      <div className="text-gray-400 text-[11px]">🚇 교통/역세권 점수</div>
                      <div className="font-bold text-accent-700 text-sm mt-0.5">{apt.traffic_score}점</div>
                    </div>
                  </div>

                  {/* Station Distance */}
                  {apt.station && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 pt-1">
                      <span>🚇</span>
                      <span className="font-medium text-gray-700">{apt.station}</span>
                      <span className="text-brand-600 font-semibold">({apt.station_dist})</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
