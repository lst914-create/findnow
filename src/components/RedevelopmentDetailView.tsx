"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { RedevelopmentZone, RedevelopmentTransaction } from "@/lib/redevelopment";
import RedevelopmentInvestmentCalculator from "@/components/RedevelopmentInvestmentCalculator";
import RedevelopmentPriceTrendChart from "@/components/RedevelopmentPriceTrendChart";
import AuthModal from "@/components/AuthModal";
import RedevelopmentFooter from "@/components/RedevelopmentFooter";
import RedevelopmentCommunitySection from "@/components/RedevelopmentCommunitySection";

interface RedevelopmentDetailViewProps {
  zone: RedevelopmentZone;
  onClose: () => void;
}

const SECTIONS = [
  { id: "section-trades", label: "실거래" },
  { id: "section-progress", label: "진행현황" },
  { id: "section-supply", label: "공급·구역현황" },
  { id: "section-surroundings", label: "입지·인근비교" },
  { id: "section-calculator", label: "분담금·수익률" },
  { id: "section-notices", label: "고시·공고" },
  { id: "section-faq", label: "FAQ" },
  { id: "section-community", label: "구역토론" },
  { id: "section-source", label: "데이터출처" },
];

export default function RedevelopmentDetailView({
  zone,
  onClose,
}: RedevelopmentDetailViewProps) {
  const [activeSection, setActiveSection] = useState<string>("section-trades");
  const [jibunFilter, setJibunFilter] = useState("");
  const [selectedDong, setSelectedDong] = useState("장위동");
  const [txViewMode, setTxViewMode] = useState<"table" | "card">("table"); // 재개발닷컴 스타일의 표 기본
  const [noticeTypeFilter, setNoticeTypeFilter] = useState<string>("전체");
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // 회원가입 & 더보기 & 알림받기 상태
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; provider: string } | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState<"more" | "alert">("more");
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [isAlertSubscribed, setIsAlertSubscribed] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 섹션 스크롤 스파이 (Scrollspy)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollPosition = container.scrollTop + 140; // 스티키 헤더 높이 보정

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const sec = document.getElementById(SECTIONS[i].id);
        if (sec && sec.offsetTop <= scrollPosition) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  // 탭 클릭 시 해당 섹션으로 부드러운 스크롤 이동
  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const target = document.getElementById(sectionId);
    const container = scrollContainerRef.current;
    if (target && container) {
      const headerOffset = 60;
      const targetPosition = target.offsetTop - headerOffset;
      container.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: "smooth",
      });
    }
  };

  // 주소 복사
  const handleCopyAddress = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(zone.address);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  };

  // 간편 회원가입 / 로그인 성공 처리
  const handleAuthSuccess = (userData: { name: string; email: string; provider: string }) => {
    setIsLoggedIn(true);
    setUser(userData);
    if (authModalReason === "more") {
      setShowAllTransactions(true);
    } else if (authModalReason === "alert") {
      setIsAlertSubscribed(true);
    }
  };

  // 국토교통부 실시간 API 연동 상태
  const [liveTrades, setLiveTrades] = useState<any[]>([]);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [liveApiActive, setLiveApiActive] = useState(false);

  // 구역 변경 시 국토교통부 실시간 실거래가 API 다이렉트 연동
  useEffect(() => {
    let ignore = false;
    async function loadLiveTrades() {
      setIsLiveLoading(true);
      try {
        const res = await fetch(`/api/redevelopment/real-trade?zoneId=${zone.id}&months=12`);
        if (res.ok) {
          const data = await res.json();
          if (!ignore && data.trades && data.trades.length > 0) {
            setLiveTrades(data.trades);
            setLiveApiActive(true);
          }
        }
      } catch (err) {
        console.error("국토교통부 API 연동 오류:", err);
      } finally {
        if (!ignore) setIsLiveLoading(false);
      }
    }
    loadLiveTrades();
    return () => { ignore = true; };
  }, [zone.id]);

  // 기본 구역 데이터 + 국토교통부 실시간 데이터 병합
  const allMergedTransactions = useMemo(() => {
    if (liveTrades.length === 0) return zone.transactions;

    const formattedLive: RedevelopmentTransaction[] = liveTrades.map((t, idx) => ({
      id: `live-molit-${idx}`,
      date: t.date,
      type: t.houseType,
      builtYear: t.builtYear,
      addressDetail: t.addressDetail,
      floor: t.floor,
      tradePriceManwon: t.tradePriceManwon,
      tradePriceDisplay:
        t.tradePriceManwon >= 10000
          ? `${(t.tradePriceManwon / 10000).toFixed(1).replace(".0", "")}억`
          : `${t.tradePriceManwon.toLocaleString()}만`,
      landPyeong: Number(
        (t.landAreaM2
          ? t.landAreaM2 / 3.30578
          : (t.exclusiveAreaM2 * 0.45) / 3.30578
        ).toFixed(1)
      ),
      exclusivePyeong: Number((t.exclusiveAreaM2 / 3.30578).toFixed(1)),
      landPricePerPyeongManwon: Math.round(
        t.tradePriceManwon /
          Math.max(
            1,
            (t.landAreaM2 || t.exclusiveAreaM2 * 0.45) / 3.30578
          )
      ),
    }));

    return [...formattedLive, ...zone.transactions].sort((a, b) =>
      b.date.localeCompare(a.date)
    );
  }, [liveTrades, zone.transactions]);

  // 실거래 필터
  const filteredTransactions = allMergedTransactions.filter((tx) =>
    jibunFilter
      ? tx.addressDetail.includes(jibunFilter) ||
        tx.type.includes(jibunFilter) ||
        tx.date.includes(jibunFilter)
      : true
  );

  // 고시공고 필터
  const filteredNotices = zone.notices.filter((n) =>
    noticeTypeFilter === "전체" ? true : n.type === noticeTypeFilter
  );

  return (
    <div className="flex flex-col h-full bg-white border-l border-slate-200 overflow-hidden shadow-2xl">
      {/* ======================================================== */}
      {/* 1. 상단 슬림 고정 헤더: 뱃지 + 구역 이름 + 닫기 버튼 */}
      {/* ======================================================== */}
      <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-slate-100 bg-white sticky top-0 z-30 shadow-2xs shrink-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 shrink-0 whitespace-nowrap">
                {zone.type}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs text-slate-600 bg-slate-100 font-medium shrink-0 whitespace-nowrap">
                {zone.region} {zone.district}
              </span>
              {zone.landPermit && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shrink-0 whitespace-nowrap">
                  토지거래허가구역
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
              {zone.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors shrink-0 cursor-pointer"
            title="닫기"
          >
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. 롱 스크롤 본문 컨테이너: 정보 확인 영역 극대화 (화면의 80% 이상) */}
      {/* ======================================================== */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto scroll-smooth"
      >
        {/* 구역 메타 요약 정보 (스크롤 시 자연스럽게 위로 올라감) */}
        <div className="p-3.5 sm:p-5 bg-white border-b border-slate-100 space-y-2.5">
          {/* 🌟 명확하게 잘 보이는 대표 소재지 주소 바 */}
          <div className="flex items-center justify-between text-xs py-2 px-3 bg-slate-100/80 hover:bg-slate-100 rounded-xl text-slate-800 font-medium border border-slate-200/80 transition-colors">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-base leading-none">📍</span>
              <span className="text-slate-500 font-normal shrink-0">소재지:</span>
              <span className="font-bold text-slate-900 truncate">
                {zone.address}
              </span>
            </div>
            <button
              onClick={handleCopyAddress}
              className="ml-2 px-2 py-0.5 rounded-md bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-600 border border-slate-200 shadow-2xs shrink-0 transition-colors cursor-pointer"
              title="주소 복사"
            >
              {copiedAddress ? "복사완료 ✓" : "복사"}
            </button>
          </div>

          {/* 핵심 메타 라인: 단계, 세대수, 시공사 */}
          <div className="flex flex-wrap items-center gap-2 text-xs py-2 px-3 bg-slate-50 rounded-xl text-slate-700 font-semibold border border-slate-100 whitespace-nowrap">
            <span className="text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md font-bold shrink-0">
              {zone.status} ({zone.statusDate})
            </span>
            <span className="text-slate-300">│</span>
            <span className="shrink-0">{zone.totalUnits.toLocaleString()}세대</span>
            <span className="text-slate-300">│</span>
            <span className="text-slate-600 truncate">시공: {zone.builder}</span>
          </div>

          {/* 공급 통계 바 (소유자, 일반분양, 임대) */}
          <div className="flex items-center justify-between text-xs px-3 py-2 bg-blue-50/50 rounded-xl text-slate-700 font-medium border border-blue-100/60 whitespace-nowrap">
            <div>
              <span className="text-slate-500">소유자 </span>
              <strong className="text-slate-900">{zone.ownersCount.toLocaleString()}명</strong>
            </div>
            <span className="text-blue-200">│</span>
            <div>
              <span className="text-slate-500">일반분양 </span>
              <strong className="text-blue-600 font-bold">
                {zone.generalUnits.toLocaleString()}세대 ({zone.generalRatio}%)
              </strong>
            </div>
            <span className="text-blue-200">│</span>
            <div>
              <span className="text-slate-500">임대 </span>
              <strong className="text-slate-900">{zone.rentalUnits.toLocaleString()}세대</strong>
            </div>
          </div>

          {/* 퀵 지표 뱃지 */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs scrollbar-none pb-0.5 whitespace-nowrap">
            <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold flex items-center gap-1 shrink-0">
              <span>매물</span>
              <span className="text-blue-600 font-bold">{zone.askCount}건</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold flex items-center gap-1 shrink-0">
              <span>초기투자</span>
              <span className="text-slate-900 font-bold">{zone.minInvestmentDisplay}~</span>
            </div>
            <div className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold flex items-center gap-1 shrink-0">
              <span>프리미엄(P)</span>
              <span className="text-purple-600 font-bold">{zone.estimatedPremiumDisplay}</span>
            </div>
            {zone.zoneStatus && (
              <div className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-semibold flex items-center gap-1 shrink-0 border border-red-100">
                <span>노후도</span>
                <span className="font-bold">{zone.zoneStatus.deteriorationRate}%</span>
              </div>
            )}
          </div>
        </div>

        {/* 스티키 탭 네비게이션: 요약 카드를 지나면 최상단에 고정되어 섹션 탐색을 돕습니다 */}
        <div className="flex border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-20 px-3 overflow-x-auto scrollbar-none text-xs sm:text-sm font-bold shadow-2xs shrink-0 whitespace-nowrap">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              onClick={() => scrollToSection(sec.id)}
              className={`py-2.5 sm:py-3 px-2.5 shrink-0 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeSection === sec.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {sec.label}
              {sec.id === "section-trades" && ` (${zone.transactions.length})`}
              {sec.id === "section-notices" && ` (${zone.notices.length})`}
            </button>
          ))}
        </div>

        {/* 본문 섹션들 */}
        <div className="p-4 sm:p-6 space-y-10">
        {/* -------------------------------------------------------- */}
        {/* [섹션 1] 실거래 정보 */}
        {/* -------------------------------------------------------- */}
        {/* -------------------------------------------------------- */}
        {/* [섹션 1] 실거래 정보 */}
        {/* -------------------------------------------------------- */}
        <section id="section-trades" className="space-y-4 pt-1">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>💰</span> 실거래 시세 및 내역
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  {allMergedTransactions.length}건
                </span>
              </h3>
              {liveApiActive && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  국토교통부 실시간 API
                </span>
              )}
              {isLiveLoading && (
                <span className="text-[10px] text-blue-500 animate-spin">⏳</span>
              )}
            </div>
            {isLoggedIn && (
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ✓ {user?.name || "회원"}님 로그인됨
              </span>
            )}
          </div>

          {/* 🌟 [1] 재개발닷컴 스타일: 실거래가 추이 그래프를 가장 위에 배치 */}
          <RedevelopmentPriceTrendChart />

          {/* 연식별 대지지분 평당가 요약 박스 */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                대지지분 평당가 시세
              </span>
              <span className="text-[11px] text-slate-400">단위: 만원/평</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-semibold text-emerald-700">다세대 ~10년</div>
                <div className="text-sm font-black text-slate-800 mt-1">
                  {zone.pricePerPyeongByAge.villaUnder10Year
                    ? `${zone.pricePerPyeongByAge.villaUnder10Year.toLocaleString()}`
                    : "-"}
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-semibold text-teal-700">다세대 11~30년</div>
                <div className="text-sm font-black text-blue-600 mt-1">
                  {zone.pricePerPyeongByAge.villa11To30Year
                    ? `${zone.pricePerPyeongByAge.villa11To30Year.toLocaleString()}`
                    : "-"}
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-semibold text-indigo-700">다세대 31년~</div>
                <div className="text-sm font-black text-indigo-900 mt-1">
                  {zone.pricePerPyeongByAge.villaOver30Year
                    ? `${zone.pricePerPyeongByAge.villaOver30Year.toLocaleString()}`
                    : "-"}
                </div>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">
                <div className="text-[11px] font-semibold text-amber-700">단독·다가구</div>
                <div className="text-sm font-black text-amber-900 mt-1">
                  {zone.pricePerPyeongByAge.singleHouse
                    ? `${zone.pricePerPyeongByAge.singleHouse.toLocaleString()}`
                    : "-"}
                </div>
              </div>
            </div>
            <div className="text-[11px] text-slate-500 mt-2 text-center tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
              재개발 투자는 건물 면적보다 권리가액의 기초가 되는 <strong className="text-slate-700 font-semibold">대지지분과 평당 단가</strong>가 핵심 지표입니다.
            </div>
          </div>

          {/* 재개발닷컴 시그니처 보라색 툴팁 */}
          {showTooltip && (
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs py-2 px-3.5 rounded-xl flex items-center justify-between shadow-md">
              <span className="font-bold flex items-center gap-1.5">
                <span>👆</span>
                <span>눌러서 상세 내역을 확인해보세요</span>
              </span>
              <button
                onClick={() => setShowTooltip(false)}
                className="text-white/80 hover:text-white text-sm font-bold ml-2"
                title="닫기"
              >
                ✕
              </button>
            </div>
          )}

          {/* 🌟 [2] 재개발닷컴 스타일 실거래 목록 표 */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-2xs">
            <table className="w-full text-xs text-left min-w-[420px]">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 whitespace-nowrap">계약일</th>
                  <th className="py-2.5 px-2.5 whitespace-nowrap">유형</th>
                  <th className="py-2.5 px-3">소재지</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">매매가</th>
                  <th className="py-2.5 px-3 text-right whitespace-nowrap">대지지분</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(showAllTransactions
                  ? filteredTransactions
                  : filteredTransactions.slice(0, 5)
                ).map((tx) => {
                  const shortDate = tx.date.startsWith("20") ? tx.date.slice(2) : tx.date;
                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                        tx.isCanceled ? "opacity-45 bg-slate-50" : ""
                      }`}
                    >
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-semibold align-top text-[11px]">
                        {shortDate}
                        {tx.isCanceled && (
                          <span className="block text-[10px] text-red-500 font-bold">
                            거래취소
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2.5 whitespace-nowrap align-top">
                        <div className="font-bold text-slate-800">{tx.type}</div>
                        <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                          {tx.builtYear}년
                        </div>
                      </td>
                      <td className="py-3 px-3 align-top">
                        <div className="font-bold text-slate-900 leading-tight">
                          {tx.addressDetail}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          전용 {tx.exclusivePyeong}평
                          {tx.floor && ` · ${tx.floor}`}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap align-top">
                        <div className="font-black text-slate-900 text-sm">
                          {tx.tradePriceDisplay}
                        </div>
                        {tx.officialPriceDisplay && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            공시 {tx.officialPriceDisplay}
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap align-top">
                        <div className="font-bold text-blue-600 text-xs">
                          {tx.landPricePerPyeongManwon
                            ? `${tx.landPricePerPyeongManwon.toLocaleString()}만/평`
                            : "-"}
                        </div>
                        <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                          {tx.landPyeong}평
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                      검색 조건에 맞는 실거래 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 🌟 [3] '더보기' 버튼 (회원가입한 사람 한정 열람 가능) */}
          {!showAllTransactions && filteredTransactions.length > 5 && (
            <div className="text-center pt-1">
              <button
                onClick={() => {
                  if (!isLoggedIn) {
                    setAuthModalReason("more");
                    setIsAuthModalOpen(true);
                  } else {
                    setShowAllTransactions(true);
                  }
                }}
                className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5"
              >
                <span>더보기</span>
                <span className="text-[10px] opacity-80">({filteredTransactions.length - 5}건 더보기)</span>
                <span>▾</span>
              </button>
              {!isLoggedIn && (
                <p className="text-[10px] text-slate-400 mt-1">
                  🔒 회원가입 시 전체 과거 20년간 실거래 내역을 무료로 열람할 수 있습니다.
                </p>
              )}
            </div>
          )}

          {/* 🌟 [4] '새로운 실거래가 알림받기' 풀위드 버튼 (회원 전용) */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setAuthModalReason("alert");
                  setIsAuthModalOpen(true);
                } else {
                  setIsAlertSubscribed(true);
                }
              }}
              className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] ${
                isAlertSubscribed
                  ? "bg-emerald-600 text-white"
                  : "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white hover:opacity-95"
              }`}
            >
              <span>🔔</span>
              <span>
                {isAlertSubscribed
                  ? `${zone.name} 실거래가 알림 등록 완료 ✓`
                  : "새로운 실거래가 알림받기"}
              </span>
            </button>
            {isAlertSubscribed && (
              <p className="text-[11px] text-emerald-600 text-center mt-1.5 font-bold animate-in fade-in">
                ✅ {zone.name}에 새로운 실거래가 등록되면 즉시 알림을 발송해 드립니다.
              </p>
            )}
          </div>

          {/* 🌟 [5] 하단 동/지번 검색 바 (재개발닷컴 스타일) */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <select
              value={selectedDong}
              onChange={(e) => setSelectedDong(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
            >
              <option value="장위동">장위동</option>
              <option value="수유동">수유동</option>
              <option value="미아동">미아동</option>
              <option value="전체">전체동</option>
            </select>
            <input
              type="text"
              placeholder="지번 (예: 231-454)"
              value={jibunFilter}
              onChange={(e) => setJibunFilter(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
            <button
              onClick={() => {}}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors shrink-0"
            >
              검색
            </button>
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* [섹션 2] 사업진행현황 */}
        {/* -------------------------------------------------------- */}
        <section id="section-progress" className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>🚀</span> 사업진행현황
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                현재: {zone.status}
              </span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              고시일: {zone.statusDate}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 font-medium">현재 정비사업 단계</span>
                <div className="text-lg font-black text-slate-900 mt-0.5">
                  {zone.status}
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 font-medium">최근 결정/고시</span>
                <div className="text-sm font-bold text-emerald-600 mt-0.5">
                  {zone.statusDate}
                </div>
              </div>
            </div>
          </div>

          {/* 타임라인 단계 리스트 */}
          <div className="space-y-0">
            {zone.stages.map((stage, idx) => {
              const isPassed = stage.isCompleted && !stage.isCurrent;
              const isLast = idx === zone.stages.length - 1;

              return (
                <div key={idx} className="flex items-start gap-3 relative">
                  {/* 좌측: 선과 원이 완벽하게 겹치는 타임라인 축 */}
                  <div className="flex flex-col items-center self-stretch shrink-0 w-5 relative">
                    {/* 상단 연결선: 원의 상단 중심까지 연결 (첫 번째 아이템은 카드 패딩 높이만큼 공간 확보) */}
                    {idx > 0 ? (
                      <div className="w-0.5 h-3.5 bg-slate-200 shrink-0" />
                    ) : (
                      <div className="h-3.5 shrink-0" />
                    )}

                    {/* 원: 우측 카드의 텍스트 첫 행(정비구역지정 등)과 정확히 동일한 수직 행 높이 */}
                    <div className="h-5 flex items-center justify-center shrink-0 z-10">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                          stage.isCurrent
                            ? "bg-blue-600 border-white ring-4 ring-blue-100 shadow-xs scale-110"
                            : isPassed
                            ? "bg-emerald-500 border-white shadow-2xs"
                            : "bg-slate-300 border-white"
                        }`}
                      />
                    </div>

                    {/* 하단 연결선: 원의 하단부터 다음 단계까지 매끄럽게 연결 */}
                    {!isLast && (
                      <div className="w-0.5 flex-1 bg-slate-200" />
                    )}
                  </div>

                  {/* 우측: 카드 컨텐츠 */}
                  <div
                    className={`flex-1 p-3.5 rounded-xl border mb-3 transition-all ${
                      stage.isCurrent
                        ? "bg-blue-50/50 border-blue-200 shadow-2xs"
                        : "bg-white border-slate-200"
                    }`}
                  >
                    <div className="flex items-center justify-between min-h-5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-bold ${
                            stage.isCurrent
                              ? "text-blue-700"
                              : isPassed
                              ? "text-slate-800"
                              : "text-slate-400"
                          }`}
                        >
                          {stage.name}
                        </span>
                        {stage.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-700 animate-pulse">
                            현재 단계
                          </span>
                        )}
                        {isPassed && (
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-50 text-emerald-600">
                            완료
                          </span>
                        )}
                      </div>
                      {stage.date && (
                        <span className="text-xs font-semibold text-slate-500">
                          {stage.date}
                        </span>
                      )}
                    </div>

                    {/* 소요 개월수 vs 중앙값 비교 */}
                    {stage.monthsInProgress && (
                      <div className="mt-2 text-xs bg-amber-50 text-amber-800 p-2.5 rounded-lg border border-amber-200/60">
                        <div className="font-bold flex items-center justify-between">
                          <span>진행 기간: {stage.monthsInProgress}개월째 진행 중</span>
                          {stage.medianMonths && (
                            <span className="text-[11px] text-amber-600">
                              서울시 평균: {stage.medianMonths}개월
                            </span>
                          )}
                        </div>
                        {stage.medianMonths && (
                          <div className="w-full bg-amber-200/60 h-2 rounded-full mt-2 overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full"
                              style={{
                                width: `${Math.min(
                                  100,
                                  (stage.monthsInProgress / (stage.medianMonths * 2)) * 100
                                )}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {stage.description && (
                      <p className="text-xs text-slate-600 mt-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {stage.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* [섹션 3] 공급계획 & 구역현황 (노후도 / 토지면적) */}
        {/* -------------------------------------------------------- */}
        <section id="section-supply" className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <span>🏢</span> 공급 계획 & 구역 현황 (노후도)
          </h3>

          {/* 공급 세대수 타입별 계획 */}
          {zone.supplyPlan && (
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span>📐</span> 타입별 공급 계획
                </h4>
                <span className="text-[11px] text-slate-400 font-semibold">
                  총 {zone.totalUnits.toLocaleString()}세대
                </span>
              </div>
              <div className="overflow-x-auto border border-slate-100 rounded-xl">
                <table className="w-full text-xs text-left min-w-[340px]">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3 whitespace-nowrap">전용면적</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">분양(세대)</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">임대(세대)</th>
                      <th className="py-2.5 px-3 text-right whitespace-nowrap">합계(세대)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {zone.supplyPlan.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="py-2.5 px-3 font-semibold text-slate-800 whitespace-nowrap">{row.typeRange}</td>
                        <td className="py-2.5 px-3 text-right font-medium text-blue-600 whitespace-nowrap">
                          {row.salesUnits.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-medium text-slate-600 whitespace-nowrap">
                          {row.rentalUnits.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right font-black text-slate-900 whitespace-nowrap">
                          {(row.salesUnits + row.rentalUnits).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 노후도 및 구역 현황 */}
          {zone.zoneStatus && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                <span>🏚️</span> 구역 노후도 및 건축물 현황
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">노후도 비율</span>
                  <strong className="text-base font-black text-red-600">
                    {zone.zoneStatus.deteriorationRate}%
                  </strong>
                  <span className="text-[10px] text-slate-400 block">법적 요건(67%) 충족</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">총 건축물</span>
                  <strong className="text-base font-black text-slate-800">
                    {zone.zoneStatus.totalBuildings.toLocaleString()}동
                  </strong>
                  <span className="text-[10px] text-slate-400 block">
                    노후 {zone.zoneStatus.deterioratedBuildings}동
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">평균 건축연한</span>
                  <strong className="text-base font-black text-slate-800">
                    {zone.zoneStatus.avgBuildingAge}년
                  </strong>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">다세대/단독</span>
                  <strong className="text-sm font-bold text-slate-800">
                    {zone.zoneStatus.villaCount} / {zone.zoneStatus.singleHouseCount}동
                  </strong>
                  <span className="text-[10px] text-slate-400 block">
                    상가 {zone.zoneStatus.commercialCount}동
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 토지면적 통계 */}
          {zone.landAreaStats && (
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
                  <span>📐</span> 유형별 토지면적
                </h4>
                <div className="space-y-2">
                  {zone.landAreaStats.byType.map((item, i) => (
                    <div key={i} className="text-xs">
                      <div className="flex justify-between font-semibold mb-1">
                        <span className="text-slate-700">{item.label}</span>
                        <span className="text-slate-900 font-bold">
                          {item.areaM2.toLocaleString()}㎡ ({item.ratio}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-500 h-full rounded-full"
                          style={{ width: `${item.ratio}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <span>🏷️</span> 용도별 토지면적
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {zone.landAreaStats.byUse.map((item, i) => (
                      <div key={i} className="flex justify-between border-b border-slate-50 pb-1">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-bold text-slate-800">
                          {item.areaM2.toLocaleString()}㎡ ({item.ratio}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                    <span>👤</span> 소유자별 토지면적
                  </h4>
                  <div className="space-y-1.5 text-xs">
                    {zone.landAreaStats.byOwner.map((item, i) => (
                      <div key={i} className="flex justify-between border-b border-slate-50 pb-1">
                        <span className="text-slate-600">{item.label}</span>
                        <span className="font-bold text-slate-800">
                          {item.areaM2.toLocaleString()}㎡ ({item.ratio}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* -------------------------------------------------------- */}
        {/* [섹션 4] 입지 & 인근 비교 */}
        {/* -------------------------------------------------------- */}
        <section id="section-surroundings" className="space-y-4 pt-4 border-t border-slate-200">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <span>📍</span> 입지 & 인근 구역/아파트 비교
          </h3>

          {/* 토지거래허가구역 & 규제지역 상태 박스 */}
          {(zone.landPermit || zone.regulation) && (
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200">
              <h4 className="text-xs font-bold text-amber-900 mb-2.5 flex items-center gap-1.5">
                <span>⚖️</span> 토지거래허가 및 부동산 규제 현황
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {zone.landPermit && (
                  <>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                      <span className="text-[11px] text-slate-500 block">아파트 토허제</span>
                      <strong className="text-amber-800 font-bold">
                        {zone.landPermit.apartment ? `지정 (${zone.landPermit.apartmentExpiry})` : "해제/미지정"}
                      </strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                      <span className="text-[11px] text-slate-500 block">토지·비주택 토허제</span>
                      <strong className="text-amber-800 font-bold">
                        {zone.landPermit.land === true
                          ? "지정"
                          : zone.landPermit.land === "예정"
                          ? `지정 예정 (${zone.landPermit.landStartDate})`
                          : "해제"}
                      </strong>
                    </div>
                  </>
                )}
                {zone.regulation && (
                  <>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                      <span className="text-[11px] text-slate-500 block">조정대상지역</span>
                      <strong className="text-slate-800 font-bold">
                        {zone.regulation.adjustedArea ? "지정" : "해제"}
                      </strong>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-amber-100">
                      <span className="text-[11px] text-slate-500 block">투기과열지구</span>
                      <strong className="text-slate-800 font-bold">
                        {zone.regulation.overheatedArea ? "지정" : "해제"}
                      </strong>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* 인근 구역 비교 */}
          {zone.nearbyZones && zone.nearbyZones.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-900 mb-4">인근 구역</h3>

              {/* 🌟 [1] 재개발닷컴 스타일: 평당가 비교 바 차트 (현재 구역 기준선 관통) */}
              <div className="relative space-y-2.5">
                {/* 보라색 세로 점선 기준선 (현재 구역 우측 끝 관통) */}
                <div className="absolute top-0 bottom-0 left-[68%] w-0 border-r-2 border-dashed border-[#8576e0] z-10 pointer-events-none" />

                {/* (A) 현재 구역 행 (보라색 바) */}
                <div className="relative w-full h-11 bg-[#f4f5f7] rounded-xl flex items-center overflow-hidden">
                  <div
                    style={{ width: "68%" }}
                    className="h-full bg-gradient-to-r from-[#5054d4] to-[#695fe6] text-white flex items-center justify-between px-3.5 shrink-0 z-0"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-xs sm:text-sm truncate">{zone.name} (현재 구역)</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/25 text-white whitespace-nowrap">
                        {zone.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center font-bold text-slate-800 text-xs sm:text-sm whitespace-nowrap z-0 pr-2">
                    {zone.avgLandPricePerPyeongManwon
                      ? `${Math.round(zone.avgLandPricePerPyeongManwon).toLocaleString()}만/평`
                      : zone.recentTradePriceDisplay}
                  </div>
                </div>

                {/* (B) 인근 구역 바 리스트 */}
                {zone.nearbyZones.map((nz, i) => {
                  const currentPrice = zone.avgLandPricePerPyeongManwon || 8750;
                  const nzPrice = nz.pricePerPyeongManwon || 8500;
                  const isHigher = nzPrice > currentPrice;

                  // 68% 기준선 비례 폭 계산 (현재보다 비싸면 선을 넘어가고, 저렴하면 선 안쪽에 위치)
                  const barWidthPercent = isHigher
                    ? Math.min(84, Math.max(74, Math.round((nzPrice / currentPrice) * 68)))
                    : Math.min(58, Math.max(34, Math.round((nzPrice / currentPrice) * 68)));

                  const nzPriceText = nz.pricePerPyeongManwon
                    ? `${nz.pricePerPyeongManwon.toLocaleString()}만/평`
                    : nz.recentPriceDisplay;

                  return (
                    <div key={i} className="relative w-full h-11 bg-[#f4f5f7] rounded-xl flex items-center overflow-hidden">
                      <div
                        style={{ width: `${barWidthPercent}%` }}
                        className={`h-full text-white flex items-center px-3.5 gap-2 shrink-0 z-0 transition-all ${
                          isHigher ? "bg-[#fa5278]" : "bg-[#05b68a]"
                        }`}
                      >
                        <span className="font-bold text-xs sm:text-sm truncate">{nz.name}</span>
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-white/25 text-white whitespace-nowrap">
                          {nz.status}
                        </span>
                        <span className="text-[11px] font-medium text-white/90 whitespace-nowrap">{nz.distance}</span>
                      </div>

                      {isHigher ? (
                        <div className="flex-1 flex items-center justify-center font-bold text-slate-800 text-xs sm:text-sm whitespace-nowrap z-0 pr-2">
                          {nzPriceText}
                        </div>
                      ) : (
                        <>
                          <div className="px-3 font-bold text-slate-800 text-xs sm:text-sm whitespace-nowrap z-0">
                            {nzPriceText}
                          </div>
                          <div className="flex-1" />
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* 🌟 [2] 재개발닷컴 스타일: 매트릭스 상세 비교 테이블 */}
              <div className="mt-6 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs sm:text-sm text-center border-collapse min-w-[540px]">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="py-3 px-3 w-28 bg-white border-r border-slate-100" />
                        <th className="py-3 px-4 font-extrabold text-[#4850e0] bg-[#f5f7ff] border-r border-[#e8ecfc] whitespace-nowrap min-w-[100px]">
                          {zone.name}
                        </th>
                        {zone.nearbyZones.map((nz, i) => (
                          <th
                            key={i}
                            className="py-3 px-4 font-bold text-slate-800 bg-white border-r border-slate-100 whitespace-nowrap min-w-[100px] last:border-r-0"
                          >
                            {nz.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* 행 1: 사업 면적 */}
                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-600 bg-white border-r border-slate-100 whitespace-nowrap">
                          사업 면적
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 bg-[#f5f7ff] border-r border-[#e8ecfc] whitespace-nowrap">
                          {Math.round((zone.zoneAreaM2 / 10000) * 10) / 10}만㎡
                        </td>
                        {zone.nearbyZones.map((nz, i) => (
                          <td key={i} className="py-3 px-4 text-slate-700 font-medium border-r border-slate-100 whitespace-nowrap last:border-r-0">
                            {nz.areaManM2 || "-"}
                          </td>
                        ))}
                      </tr>

                      {/* 행 2: 사업종류 */}
                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-600 bg-white border-r border-slate-100 whitespace-nowrap">
                          사업종류
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 bg-[#f5f7ff] border-r border-[#e8ecfc] whitespace-nowrap">
                          {zone.type}
                        </td>
                        {zone.nearbyZones.map((nz, i) => (
                          <td key={i} className="py-3 px-4 text-slate-700 font-medium border-r border-slate-100 whitespace-nowrap last:border-r-0">
                            {nz.type || "재개발"}
                          </td>
                        ))}
                      </tr>

                      {/* 행 3: 진행단계 */}
                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-600 bg-white border-r border-slate-100 whitespace-nowrap">
                          진행단계
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 bg-[#f5f7ff] border-r border-[#e8ecfc] whitespace-nowrap">
                          {zone.status}
                        </td>
                        {zone.nearbyZones.map((nz, i) => (
                          <td key={i} className="py-3 px-4 text-slate-700 font-medium border-r border-slate-100 whitespace-nowrap last:border-r-0">
                            {nz.status}
                          </td>
                        ))}
                      </tr>

                      {/* 행 4: 공급세대 */}
                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-600 bg-white border-r border-slate-100 whitespace-nowrap">
                          공급세대
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 bg-[#f5f7ff] border-r border-[#e8ecfc] whitespace-nowrap">
                          {zone.totalUnits ? `${zone.totalUnits.toLocaleString()}세대` : "-"}
                        </td>
                        {zone.nearbyZones.map((nz, i) => (
                          <td key={i} className="py-3 px-4 text-slate-700 font-medium border-r border-slate-100 whitespace-nowrap last:border-r-0">
                            {nz.totalUnits ? `${nz.totalUnits.toLocaleString()}세대` : "-"}
                          </td>
                        ))}
                      </tr>

                      {/* 행 5: 일반분양 */}
                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-600 bg-white border-r border-slate-100 whitespace-nowrap">
                          일반분양
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 bg-[#f5f7ff] border-r border-[#e8ecfc] whitespace-nowrap">
                          {zone.generalUnits ? `${zone.generalUnits.toLocaleString()}세대` : "-"}
                        </td>
                        {zone.nearbyZones.map((nz, i) => (
                          <td key={i} className="py-3 px-4 text-slate-700 font-medium border-r border-slate-100 whitespace-nowrap last:border-r-0">
                            {nz.generalUnits ? `${nz.generalUnits.toLocaleString()}세대` : "-"}
                          </td>
                        ))}
                      </tr>

                      {/* 행 6: 노후도 */}
                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-600 bg-white border-r border-slate-100 whitespace-nowrap">
                          노후도 <span className="text-[10px] text-slate-400 font-normal">(30년)</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 bg-[#f5f7ff] border-r border-[#e8ecfc] whitespace-nowrap">
                          {zone.zoneStatus?.deteriorationRate ? `${zone.zoneStatus.deteriorationRate}%` : "72%"}
                        </td>
                        {zone.nearbyZones.map((nz, i) => (
                          <td key={i} className="py-3 px-4 text-slate-700 font-medium border-r border-slate-100 whitespace-nowrap last:border-r-0">
                            {nz.deteriorationRate ? `${nz.deteriorationRate}%` : "-"}
                          </td>
                        ))}
                      </tr>

                      {/* 행 7: 매물 수 */}
                      <tr className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3 font-medium text-slate-600 bg-white border-r border-slate-100 whitespace-nowrap">
                          매물 수
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 bg-[#f5f7ff] border-r border-[#e8ecfc] whitespace-nowrap">
                          {zone.askCount ? `${zone.askCount}건` : "25건"}
                        </td>
                        {zone.nearbyZones.map((nz, i) => (
                          <td key={i} className="py-3 px-4 text-slate-700 font-medium border-r border-slate-100 whitespace-nowrap last:border-r-0">
                            {nz.askCount ? `${nz.askCount}건` : "-"}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 인근 아파트 시세 */}
          {zone.nearbyApartments && zone.nearbyApartments.length > 0 && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                <span>🏢</span> 인근 주요 아파트 단지 시세
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {zone.nearbyApartments.map((apt, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{apt.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {apt.completedYear}년 준공 · {apt.totalUnits.toLocaleString()}세대 ({apt.distance})
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-blue-600 text-sm">
                        {apt.recentPriceDisplay}
                      </div>
                      <div className="text-[10px] text-slate-400">최근 실거래</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 학군 및 대중교통 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {zone.schools && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <span>🎓</span> 학군 정보
                </h4>
                <div className="space-y-2 text-xs">
                  {zone.schools.map((sch, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-1">
                      <div>
                        <span className="font-semibold text-slate-800">{sch.name}</span>
                        <span className="text-[10px] text-slate-400 ml-1.5">({sch.type})</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        도보 {sch.walkMinutes}분 ({sch.distance})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {zone.transit && (
              <div className="bg-white p-4 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
                  <span>🚇</span> 대중교통
                </h4>
                <div className="space-y-2 text-xs">
                  {zone.transit.map((tr, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            tr.type === "지하철"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {tr.type} {tr.line}
                        </span>
                        <span className="font-semibold text-slate-800">{tr.name}</span>
                      </div>
                      <div className="text-slate-500 text-[11px]">
                        도보 {tr.walkMinutes}분 ({tr.distance})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 개발 여건 분석 */}
          {zone.developmentConditions && (
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <h4 className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <span>💡</span> 개발 여건 분석
              </h4>
              <p className="text-slate-600 leading-relaxed">
                {zone.developmentConditions}
              </p>
              {zone.unionOfficeAddress && (
                <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-700">조합 사무소: </span>
                  {zone.unionOfficeAddress}
                </div>
              )}
            </div>
          )}
        </section>

        {/* -------------------------------------------------------- */}
        {/* [섹션 5] 분담금 & 수익률 계산기 */}
        {/* -------------------------------------------------------- */}
        <section id="section-calculator" className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>🧮</span> 분담금 및 투자수익률 계산기
            </h3>
            <span className="text-[11px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
              실시간 시뮬레이션
            </span>
          </div>
          <RedevelopmentInvestmentCalculator zone={zone} />
        </section>

        {/* -------------------------------------------------------- */}
        {/* [섹션 6] 고시·공고 & 보도자료 */}
        {/* -------------------------------------------------------- */}
        <section id="section-notices" className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>📢</span> 고시·공고 및 보도자료
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                {zone.notices.length}건
              </span>
            </h3>
          </div>

          {/* 필터 칩 */}
          <div className="flex gap-1.5 overflow-x-auto text-xs pb-1">
            {["전체", "고시", "공고", "보도자료", "결재문서"].map((type) => (
              <button
                key={type}
                onClick={() => setNoticeTypeFilter(type)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  noticeTypeFilter === type
                    ? "bg-blue-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* 목록 */}
          <div className="space-y-2.5">
            {filteredNotices.map((notice) => (
              <div
                key={notice.id}
                className="p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-2xs transition-all bg-white"
              >
                <div className="flex items-center gap-2 mb-1.5 text-[11px]">
                  <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    {notice.type}
                  </span>
                  <span className="text-slate-500">{notice.org}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-400">{notice.date}</span>
                  {notice.isNew && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-red-100 text-red-600">
                      NEW
                    </span>
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-900 leading-snug">
                  {notice.title}
                </h4>
              </div>
            ))}
            {filteredNotices.length === 0 && (
              <div className="py-8 text-center text-slate-400 text-xs">
                등록된 고시/공고가 없습니다.
              </div>
            )}
          </div>

          {/* 외부 관련 자료실 링크 */}
          {zone.documents && zone.documents.length > 0 && (
            <div className="pt-3 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 mb-2">📁 관련 자료 및 외부 링크</h4>
              <div className="space-y-1.5">
                {zone.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-medium">{doc.title}</span>
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 font-bold hover:underline"
                      >
                        열기 ↗
                      </a>
                    ) : (
                      <span className="text-slate-400 text-[11px]">첨부 문서</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* -------------------------------------------------------- */}
        {/* [섹션 7] FAQ (자주 묻는 질문) */}
        {/* -------------------------------------------------------- */}
        <section id="section-faq" className="space-y-4 pt-4 border-t border-slate-200 pb-10">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <span>❓</span> 자주 묻는 질문 (FAQ)
          </h3>

          <div className="space-y-3">
            {zone.faq && zone.faq.length > 0 ? (
              zone.faq.map((item, idx) => {
                const isExpanded = expandedFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs"
                  >
                    <button
                      onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-black text-sm">Q.</span>
                        <span className="text-xs sm:text-sm font-bold text-slate-900">
                          {item.question}
                        </span>
                      </div>
                      <span className="text-slate-400 text-xs">
                        {isExpanded ? "▲" : "▼"}
                      </span>
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 bg-slate-50 border-t border-slate-100 text-xs text-slate-700 space-y-2">
                        <div className="font-bold text-blue-700">
                          👉 {item.answer}
                        </div>
                        {item.detail && (
                          <p className="text-slate-600 leading-relaxed">
                            {item.detail}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                등록된 FAQ 항목이 없습니다.
              </div>
            )}
          </div>
        </section>

        {/* -------------------------------------------------------- */}
        {/* [섹션 7.5] 구역 커뮤니티 (자주 묻는 질문 밑) */}
        {/* -------------------------------------------------------- */}
        <section id="section-community">
          <RedevelopmentCommunitySection
            zoneName={zone.name}
            zoneId={zone.id}
            zoneStep={zone.status}
            zoneLocation={zone.address}
            premium={zone.estimatedPremiumDisplay}
          />
        </section>

        {/* -------------------------------------------------------- */}
        {/* [섹션 8] 데이터 출처 & 사업자정보 & 법적 고지 (재개발닷컴 원문 동일) */}
        {/* -------------------------------------------------------- */}
        <section id="section-source" className="pt-2">
          <RedevelopmentFooter />
        </section>
        </div>
      </div>

      {/* 간편회원가입 모달 */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        title={
          authModalReason === "more"
            ? "과거 전체 실거래가 열람"
            : "새로운 실거래가 카톡 알림"
        }
        subtitle={
          authModalReason === "more"
            ? "간편가입 후 20년간의 정비구역 실거래 내역을 무료로 확인하세요."
            : "새로운 실거래 계약이 등록되는 즉시 실시간 알림을 보내드립니다."
        }
      />
    </div>
  );
}
