"use client";

import { useState, useEffect } from "react";

/* ========================================
   Data
   ======================================== */

const QUICK_TAGS = [
  { label: "서울 아파트", icon: "🏙️", query: "서울 아파트" },
  { label: "경기 아파트", icon: "🏘️", query: "경기 아파트" },
  { label: "역세권", icon: "🚇", query: "역세권 아파트" },
  { label: "재개발", icon: "🔨", query: "재개발" },
  { label: "재건축", icon: "🏗️", query: "재건축" },
  { label: "분양", icon: "📋", query: "분양" },
  { label: "실거래가", icon: "💰", query: "실거래가" },
  { label: "입주예정", icon: "📅", query: "입주예정 아파트" },
];

const POPULAR_APARTMENTS = [
  {
    id: 1,
    name: "래미안 원베일리",
    district: "서초구 반포동",
    year: 2023,
    households: 2990,
    area: "84㎡",
    price: "35.5억",
    station: "신반포역",
    distance: "350m",
    tag: "인기",
  },
  {
    id: 2,
    name: "아크로리버파크",
    district: "서초구 반포동",
    year: 2016,
    households: 1612,
    area: "84㎡",
    price: "38.0억",
    station: "고속터미널역",
    distance: "500m",
    tag: "프리미엄",
  },
  {
    id: 3,
    name: "헬리오시티",
    district: "송파구 가락동",
    year: 2018,
    households: 9510,
    area: "84㎡",
    price: "18.5억",
    station: "송파역",
    distance: "200m",
    tag: "대단지",
  },
  {
    id: 4,
    name: "둔촌주공",
    district: "강동구 둔촌동",
    year: 2024,
    households: 12032,
    area: "84㎡",
    price: "16.8억",
    station: "둔촌동역",
    distance: "300m",
    tag: "신축",
  },
];

const REGIONS = [
  { name: "강남구", count: 342, hot: true },
  { name: "서초구", count: 287, hot: true },
  { name: "송파구", count: 412, hot: true },
  { name: "강동구", count: 198 },
  { name: "마포구", count: 256 },
  { name: "용산구", count: 167, hot: true },
  { name: "성동구", count: 203 },
  { name: "광진구", count: 178 },
  { name: "영등포구", count: 234 },
  { name: "동작구", count: 189 },
  { name: "양천구", count: 312 },
  { name: "구로구", count: 198 },
];

const TODAY_STATS = [
  { label: "등록 아파트", value: "12,847", unit: "단지", icon: "🏢" },
  { label: "오늘 실거래", value: "234", unit: "건", icon: "📊" },
  { label: "분양 예정", value: "18", unit: "단지", icon: "🏗️" },
  { label: "검색 이용", value: "5,420", unit: "회", icon: "🔍" },
];

const NAV_ITEMS = [
  { label: "아파트 찾기", href: "/apt", icon: "🏢" },
  { label: "재개발", href: "/redevelopment", icon: "🔨" },
  { label: "분양", href: "/sale", icon: "🏗️" },
  { label: "실거래가", href: "/price", icon: "💰" },
  { label: "지역정보", href: "/area", icon: "📍" },
  { label: "블로그", href: "/blog", icon: "📝" },
];

/* ========================================
   Components
   ======================================== */

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass shadow-lg shadow-brand-500/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
              <span className="text-white text-lg font-bold">F</span>
            </div>
            <span className="text-xl font-bold gradient-text">찾아줘</span>
          </a>

          {/* Desktop Nav */}
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

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 transition-all duration-200 cursor-pointer">
              로그인
            </button>
            <button className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] transition-all duration-200 cursor-pointer">
              시작하기
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-brand-50 transition-colors cursor-pointer"
              aria-label="메뉴 열기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-fade-in">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-all"
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 mt-4 px-3">
              <button className="flex-1 py-2.5 rounded-xl text-sm font-medium text-brand-600 border border-brand-200 hover:bg-brand-50 transition-all cursor-pointer">
                로그인
              </button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 transition-all cursor-pointer">
                시작하기
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const placeholders = [
    "석수역 근처 2019년 입주 아파트 찾아줘",
    "강남 84㎡ 10억 이하 아파트",
    "송파구 500세대 이상 신축 아파트",
    "역세권 재개발 구역 찾아줘",
  ];

  const [currentPlaceholder, setCurrentPlaceholder] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPlaceholder((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-surface-50 to-accent-50" />
        <div className="absolute top-20 -left-32 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 -right-32 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl animate-float delay-300" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-100/20 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, oklch(0.4 0.1 250) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100/60 border border-brand-200/60 mb-8">
          <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
          <span className="text-sm font-medium text-brand-700">
            서울·경기 아파트 검색 서비스
          </span>
        </div>

        {/* Title */}
        <h1 className="animate-fade-in-up delay-100 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
          <span className="text-surface-900">내가 찾는 부동산 정보,</span>
          <br />
          <span className="gradient-text">한 곳에서 찾아줘</span>
        </h1>

        {/* Subtitle */}
        <p className="animate-fade-in-up delay-200 text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          조건을 입력하면 <strong className="text-gray-700">찾아줘</strong>가 바로
          찾아드립니다.
          <br className="hidden sm:block" />
          아파트 검색부터 실거래가 비교까지, 쉽고 빠르게.
        </p>

        {/* Search Box */}
        <div className="animate-fade-in-up delay-300 max-w-2xl mx-auto mb-8">
          <div
            className={`search-glow relative flex items-center bg-white rounded-2xl border transition-all duration-300 ${
              isFocused
                ? "border-brand-300 shadow-xl shadow-brand-500/10"
                : "border-gray-200 shadow-lg shadow-gray-200/50"
            }`}
          >
            <div className="pl-5 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              id="main-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={placeholders[currentPlaceholder]}
              className="flex-1 px-4 py-4 sm:py-5 text-base sm:text-lg bg-transparent outline-none placeholder:text-gray-400 text-surface-900"
            />
            <button
              id="search-button"
              className="mr-2 px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 text-sm sm:text-base cursor-pointer"
            >
              찾아줘
            </button>
          </div>
        </div>

        {/* Quick Tags */}
        <div className="animate-fade-in-up delay-400 flex flex-wrap justify-center gap-2 sm:gap-3">
          {QUICK_TAGS.map((tag, i) => (
            <button
              key={tag.label}
              className={`group flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
                bg-white/70 border border-gray-200/70 text-gray-600
                hover:bg-brand-50 hover:border-brand-200 hover:text-brand-600 hover:shadow-md hover:shadow-brand-500/5
                hover:-translate-y-0.5
                delay-${(i + 1) * 100}`}
            >
              <span className="text-base group-hover:scale-110 transition-transform">
                {tag.icon}
              </span>
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="relative py-6 -mt-12 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass rounded-2xl shadow-xl shadow-gray-200/30 p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {TODAY_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`animate-fade-in-up delay-${(i + 1) * 100} text-center group`}
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">
                  {stat.value}
                  <span className="text-sm font-medium text-gray-400 ml-1">
                    {stat.unit}
                  </span>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PopularApartments() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">
              🏢 인기 아파트
            </h2>
            <p className="text-gray-500 mt-2">
              가장 많이 검색된 아파트를 확인하세요
            </p>
          </div>
          <a
            href="/apt"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors"
          >
            전체보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_APARTMENTS.map((apt, i) => (
            <div
              key={apt.id}
              className={`animate-fade-in-up delay-${(i + 1) * 100} group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-brand-500/8 hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
            >
              {/* Top gradient bar */}
              <div className="h-1.5 bg-gradient-to-r from-brand-400 via-brand-500 to-accent-400" />

              <div className="p-5">
                {/* Tag */}
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 border border-brand-100">
                  {apt.tag}
                </span>

                {/* Name */}
                <h3 className="text-lg font-bold text-surface-900 mt-3 group-hover:text-brand-600 transition-colors">
                  {apt.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {apt.district}
                </p>

                {/* Details */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center text-xs">
                      📅
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400">입주</div>
                      <div className="text-sm font-semibold text-surface-800">{apt.year}년</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-brand-50 flex items-center justify-center text-xs">
                      🏠
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400">세대</div>
                      <div className="text-sm font-semibold text-surface-800">{apt.households.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-warm-50 flex items-center justify-center text-xs">
                      💰
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400">{apt.area}</div>
                      <div className="text-sm font-bold text-warm-500">{apt.price}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-accent-50 flex items-center justify-center text-xs">
                      🚇
                    </div>
                    <div>
                      <div className="text-[11px] text-gray-400">{apt.station}</div>
                      <div className="text-sm font-semibold text-accent-500">{apt.distance}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-5">
                  <button className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:shadow-lg hover:shadow-brand-500/25 transition-all cursor-pointer">
                    상세보기
                  </button>
                  <button className="px-3 py-2.5 rounded-xl text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 transition-all cursor-pointer">
                    비교
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionSection() {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-surface-50 to-surface-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">
            📍 지역별 아파트 찾기
          </h2>
          <p className="text-gray-500 mt-2">
            서울 주요 지역의 아파트를 한눈에 살펴보세요
          </p>
        </div>

        {/* Region Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {REGIONS.map((region, i) => (
            <a
              key={region.name}
              href={`/apt/search?district=${region.name}`}
              className={`animate-fade-in-up delay-${((i % 6) + 1) * 100} group relative flex flex-col items-center justify-center p-5 bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:shadow-lg hover:shadow-brand-500/8 hover:-translate-y-1 transition-all duration-300`}
            >
              {region.hot && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              )}
              <span className="text-lg font-bold text-surface-900 group-hover:text-brand-600 transition-colors">
                {region.name}
              </span>
              <span className="text-xs text-gray-400 mt-1">
                {region.count}개 단지
              </span>
            </a>
          ))}
        </div>

        {/* More regions */}
        <div className="text-center mt-8">
          <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-100 hover:border-brand-200 transition-all cursor-pointer">
            경기도 지역도 보기
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function ServiceSection() {
  const services = [
    {
      icon: "🔍",
      title: "스마트 검색",
      description: "자연어로 검색하면 AI가 조건을 해석해서 맞는 아파트를 찾아드립니다.",
      color: "from-brand-500 to-brand-600",
      bg: "bg-brand-50",
    },
    {
      icon: "🔄",
      title: "아파트 비교",
      description: "관심 있는 아파트를 나란히 비교하고, 상세 분석 리포트를 받아보세요.",
      color: "from-accent-400 to-accent-500",
      bg: "bg-accent-50",
    },
    {
      icon: "📊",
      title: "실거래가",
      description: "국토교통부 실거래가 데이터를 기반으로 가격 추이를 확인하세요.",
      color: "from-warm-400 to-warm-500",
      bg: "bg-warm-50",
    },
    {
      icon: "🏗️",
      title: "재개발·분양",
      description: "재개발 구역, 분양 일정, 청약 정보를 한 곳에서 확인하세요.",
      color: "from-brand-400 to-accent-400",
      bg: "bg-brand-50",
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight">
            ✨ 찾아줘가 도와드립니다
          </h2>
          <p className="text-gray-500 mt-2">
            부동산 정보, 어렵게 찾지 마세요
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <div
              key={service.title}
              className={`animate-fade-in-up delay-${(i + 1) * 100} group relative p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-xl hover:shadow-brand-500/8 hover:-translate-y-1 transition-all duration-300 cursor-pointer`}
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${service.bg} text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {service.icon}
              </div>
              <h3 className="text-lg font-bold text-surface-900 mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {service.description}
              </p>
              <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r ${service.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-8 sm:p-12 text-center">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />

          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              지금 바로 찾아보세요
            </h2>
            <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">
              서울·경기 아파트 검색부터 실거래가 비교까지,
              <br className="hidden sm:block" />
              찾아줘가 한 번에 찾아드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/apt"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold bg-white text-brand-600 hover:bg-brand-50 shadow-xl shadow-black/10 hover:scale-[1.02] transition-all duration-200"
              >
                🔍 아파트 검색하기
              </a>
              <a
                href="/apt/compare"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-all duration-200"
              >
                🔄 아파트 비교하기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-surface-900 text-gray-400 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center">
                <span className="text-white text-sm font-bold">F</span>
              </div>
              <span className="text-lg font-bold text-white">찾아줘</span>
            </div>
            <p className="text-sm leading-relaxed">
              내가 찾는 부동산 정보,
              <br />한 곳에서 찾아줘
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">서비스</h4>
            <ul className="space-y-2.5">
              <li><a href="/apt" className="text-sm hover:text-white transition-colors">아파트 찾기</a></li>
              <li><a href="/redevelopment" className="text-sm hover:text-white transition-colors">재개발 찾기</a></li>
              <li><a href="/sale" className="text-sm hover:text-white transition-colors">분양 찾기</a></li>
              <li><a href="/price" className="text-sm hover:text-white transition-colors">실거래가</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">정보</h4>
            <ul className="space-y-2.5">
              <li><a href="/area" className="text-sm hover:text-white transition-colors">지역정보</a></li>
              <li><a href="/blog" className="text-sm hover:text-white transition-colors">블로그</a></li>
              <li><a href="/guide" className="text-sm hover:text-white transition-colors">이용 가이드</a></li>
              <li><a href="/faq" className="text-sm hover:text-white transition-colors">자주 묻는 질문</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">고객지원</h4>
            <ul className="space-y-2.5">
              <li><a href="/terms" className="text-sm hover:text-white transition-colors">이용약관</a></li>
              <li><a href="/privacy" className="text-sm hover:text-white transition-colors">개인정보처리방침</a></li>
              <li><a href="/contact" className="text-sm hover:text-white transition-colors">문의하기</a></li>
              <li><a href="/agent" className="text-sm hover:text-white transition-colors">중개사 등록</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © 2026 찾아줘. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            부동산 데이터 출처: 국토교통부 실거래가 공개시스템 · 공공데이터포털
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ========================================
   Main Page
   ======================================== */

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <PopularApartments />
        <ServiceSection />
        <RegionSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
