"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { REDEVELOPMENT_DATA, RedevelopmentZone } from "@/lib/redevelopment";

// 설문 선택지 타입
type BudgetOption = "3억 미만" | "3~5억" | "5~7억" | "7~10억" | "10억 이상";
type ResidencyOption = "실거주 가능" | "실거주 협의 가능" | "실거주 어려움";
type PeriodOption = "3년 안쪽" | "4~7년" | "8년 이상";
type HouseCountOption = "무주택" | "1주택" | "2주택 이상" | "응답하지 않음";

export default function RedevelopmentRecommendPage() {
  // 설문 상태
  const [budget, setBudget] = useState<BudgetOption>("3~5억");
  const [residency, setResidency] = useState<ResidencyOption>("실거주 가능");
  const [period, setPeriod] = useState<PeriodOption>("4~7년");
  const [houseCount, setHouseCount] = useState<HouseCountOption>("무주택");
  // 투자 vs 실거주 비율 (기본 50:50, 0 = 100% 실거주, 100 = 100% 투자)
  const [investRatio, setInvestRatio] = useState<number>(50);

  // 약관 동의 상태
  const [agreeRequired, setAgreeRequired] = useState(false);
  const [agreeOptionalEvent, setAgreeOptionalEvent] = useState(false);
  const [agreeOptionalOverseas, setAgreeOptionalOverseas] = useState(false);

  // 결과 화면 전환 상태
  const [showResult, setShowResult] = useState(false);
  // 유료 결제 모달 상태
  const [showPayModal, setShowPayModal] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // 추천 구역 알고리즘 매칭
  const recommendedZones = useMemo(() => {
    // 1. 예산별 필터링
    let targetZones = [...REDEVELOPMENT_DATA];

    // 투자금 매칭
    if (budget === "3억 미만") {
      targetZones = targetZones.filter((z) => {
        const minInv = parseFloat(z.minInvestmentDisplay || "99");
        return minInv <= 3.5 || z.type === "모아타운" || z.type === "신속통합기획";
      });
    } else if (budget === "3~5억") {
      targetZones = targetZones.filter((z) => {
        const minInv = parseFloat(z.minInvestmentDisplay || "0");
        return (minInv >= 2.5 && minInv <= 6.0) || z.region.includes("서울") || z.district.includes("성북") || z.district.includes("강북");
      });
    } else if (budget === "5~7억") {
      targetZones = targetZones.filter((z) => {
        const minInv = parseFloat(z.minInvestmentDisplay || "0");
        return (minInv >= 4.5 && minInv <= 8.5) || z.district.includes("서대문") || z.district.includes("동대문");
      });
    } else if (budget === "7~10억") {
      targetZones = targetZones.filter((z) => {
        const minInv = parseFloat(z.minInvestmentDisplay || "0");
        return minInv >= 6.5 || z.district.includes("마포") || z.district.includes("용산");
      });
    } else {
      // 10억 이상 (상급지)
      targetZones = targetZones.filter((z) => {
        const minInv = parseFloat(z.minInvestmentDisplay || "0");
        return minInv >= 9.0 || z.district.includes("강남") || z.district.includes("서초") || z.district.includes("용산") || z.district.includes("성동");
      });
    }

    // 2. 소요 기간별 가중치 (단계 필터)
    if (period === "3년 안쪽") {
      // 빠른 착공/관리처분/이주 중심
      targetZones.sort((a, b) => {
        const fastStages = ["착공", "이주철거", "관리처분인가"];
        const aScore = fastStages.includes(a.status) ? 10 : 0;
        const bScore = fastStages.includes(b.status) ? 10 : 0;
        return bScore - aScore;
      });
    } else if (period === "8년 이상") {
      // 초기 단계 (추진위, 구역지정, 조합설립) - 시세차익 극대화
      targetZones.sort((a, b) => {
        const earlyStages = ["정비구역지정", "조합설립인가", "건축심의"];
        const aScore = earlyStages.includes(a.status) ? 10 : 0;
        const bScore = earlyStages.includes(b.status) ? 10 : 0;
        return bScore - aScore;
      });
    }

    // 3. 투자 vs 실거주 비율 가중치
    // 투자 비중이 높을수록(>50) 일반분양비율/프리미엄 상승여력 우선, 실거주가 높을수록 대단지/교통(역세권) 우선
    targetZones.sort((a, b) => {
      const aInvestScore = (a.generalRatio || 25) * 1.5;
      const bInvestScore = (b.generalRatio || 25) * 1.5;
      const aLiveScore = (a.totalUnits || 1000) / 100 + (10 - Math.min(a.walkMinutes || 10, 10));
      const bLiveScore = (b.totalUnits || 1000) / 100 + (10 - Math.min(b.walkMinutes || 10, 10));

      const aTotal = (aInvestScore * investRatio) + (aLiveScore * (100 - investRatio));
      const bTotal = (bInvestScore * investRatio) + (bLiveScore * (100 - investRatio));
      return bTotal - aTotal;
    });

    // 최소 3개 확보 (부족할 경우 마스터 데이터에서 채움)
    const results: RedevelopmentZone[] = [];
    const usedIds = new Set<string>();

    for (const z of targetZones) {
      if (!usedIds.has(z.id)) {
        usedIds.add(z.id);
        results.push(z);
        if (results.length >= 3) break;
      }
    }

    if (results.length < 3) {
      for (const z of REDEVELOPMENT_DATA) {
        if (!usedIds.has(z.id)) {
          usedIds.add(z.id);
          results.push(z);
          if (results.length >= 3) break;
        }
      }
    }

    return results;
  }, [budget, residency, period, houseCount, investRatio]);

  // 상위 1순위 공개 구역
  const topZone = recommendedZones[0];
  // 2, 3순위 잠금 구역
  const subZones = recommendedZones.slice(1, 3);

  // 투자/실거주 라벨
  const investRatioLabel = useMemo(() => {
    if (investRatio >= 90) return "순수 투자 100% (시세차익 극대화)";
    if (investRatio >= 70) return "투자 중심 70% : 실거주 30%";
    if (investRatio >= 40 && investRatio <= 60) return "투자 50% : 실거주 50% (황금 밸런스)";
    if (investRatio >= 20) return "실거주 중심 70% : 투자 30%";
    return "실거주 100% (쾌적한 주거환경/입주 우선)";
  }, [investRatio]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* 1. 상단 글로벌 네비게이션 바 */}
      <header className="h-14 md:h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-md">
              <span className="text-white text-base font-black">F</span>
            </div>
            <span className="text-lg font-black tracking-tight text-slate-900">찾아줘</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600">
            <Link href="/redevelopment" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              🔨 재개발 지도
            </Link>
            <Link
              href="/redevelopment/recommend"
              className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1.5"
            >
              <span>🎯 맞춤 구역추천</span>
              <span className="text-[10px] bg-blue-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                AI
              </span>
            </Link>
            <Link href="/subscriptions" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              🏗️ 분양정보
            </Link>
            <Link href="/search" className="px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
              🏢 아파트 찾기
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/redevelopment"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200"
          >
            <span>🗺️ 지도에서 구역 찾기</span>
          </Link>
        </div>
      </header>

      {/* 2. 메인 컨텐츠 영역 */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {!showResult ? (
          /* ==================== 1단계: 조건 입력 폼 ==================== */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 space-y-9">
            {/* 상단 안내 */}
            <div className="border-b border-slate-100 pb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold mb-3">
                <span>🎯</span>
                <span>맞춤 정비구역 AI 매칭</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                내 조건에 딱 맞는 재개발 구역 추천
              </h1>
              <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1.5 leading-relaxed">
                자금, 실거주 여부, 보유 기간, 투자 비중을 종합 분석하여 최적의 사업 구역을 1:1로 매칭해 드립니다.
              </p>
            </div>

            {/* 문항 01: 매입 예산 */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-black text-base sm:text-lg">01</span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                    대출을 포함해 얼마까지 매입할 계획인가요?
                  </h3>
                  <p className="text-slate-500 text-xs font-normal mt-0.5">
                    예: 내 돈 3억 + 확인한 대출 2억 = 5억. 취득세와 추가분담금은 따로 준비해야 해요.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {(["3억 미만", "3~5억", "5~7억", "7~10억", "10억 이상"] as BudgetOption[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setBudget(opt)}
                    className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                      budget === opt
                        ? "border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs ring-1 ring-blue-600"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 문항 02: 직접 거주 가능 여부 */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-black text-base sm:text-lg">02</span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                    매입한 집에 직접 거주할 수 있나요?
                  </h3>
                  <p className="text-slate-500 text-xs font-normal mt-0.5">
                    내 생활 조건을 묻는 질문이에요. 선택만으로 법적 실거주 요건이 충족되지는 않아요.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(["실거주 가능", "실거주 협의 가능", "실거주 어려움"] as ResidencyOption[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setResidency(opt)}
                    className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                      residency === opt
                        ? "border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs ring-1 ring-blue-600"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 문항 03: 자금 묶어둘 기간 */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-black text-base sm:text-lg">03</span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                    자금을 몇 년 정도 묶어둘 수 있나요?
                  </h3>
                  <p className="text-slate-500 text-xs font-normal mt-0.5">
                    내가 기다릴 수 있는 기간이에요. 이 기간 안에 입주할 수 있다는 뜻은 아니에요.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {(["3년 안쪽", "4~7년", "8년 이상"] as PeriodOption[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setPeriod(opt)}
                    className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                      period === opt
                        ? "border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs ring-1 ring-blue-600"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* 문항 04: 보유 주택 수 */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-black text-base sm:text-lg">04</span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                    현재 보유한 주택이 있나요?
                  </h3>
                  <p className="text-slate-500 text-xs font-normal mt-0.5">
                    순위가 아니라, 이후 세금·대출 확인사항에 참고해요.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {(["무주택", "1주택", "2주택 이상", "응답하지 않음"] as HouseCountOption[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setHouseCount(opt)}
                    className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center ${
                      houseCount === opt
                        ? "border-blue-600 bg-blue-50/70 text-blue-700 shadow-xs ring-1 ring-blue-600"
                        : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            {/* ⭐ 문항 05 (사용자 요청 추가): 투자 vs 실거주 비율 */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex items-start gap-2">
                <span className="text-blue-600 font-black text-base sm:text-lg">05</span>
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                      투자 목적과 실거주 목적의 비중은 어떻게 되나요?
                    </h3>
                  </div>
                  <p className="text-slate-500 text-xs font-normal mt-0.5">
                    시세차익 중심의 갭투자형 구역과 쾌적한 주거만족도 중심의 입주형 구역을 차등 추천합니다.
                  </p>
                </div>
              </div>

              {/* 비율 슬라이더 및 프리셋 */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between text-xs font-extrabold">
                  <span className="text-emerald-700">🏡 실거주 {100 - investRatio}%</span>
                  <span className="text-blue-700 text-sm font-black px-2.5 py-1 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    {investRatioLabel}
                  </span>
                  <span className="text-blue-700">📈 투자 {investRatio}%</span>
                </div>

                {/* 인터랙티브 슬라이더 */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={investRatio}
                  onChange={(e) => setInvestRatio(parseInt(e.target.value, 10))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />

                {/* 5대 빠른 프리셋 선택 버튼 */}
                <div className="grid grid-cols-5 gap-1.5 text-center">
                  {[
                    { label: "실거주 100", val: 0 },
                    { label: "실거주 70", val: 30 },
                    { label: "반반 50:50", val: 50 },
                    { label: "투자 70", val: 70 },
                    { label: "순수투자 100", val: 100 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setInvestRatio(preset.val)}
                      className={`py-1.5 px-1 rounded-lg text-[11px] font-bold border transition-colors ${
                        investRatio === preset.val
                          ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                          : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 약관 및 동의 체크박스 (이미지 2 동일) */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              {/* 필수 동의 */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreeRequired}
                  onChange={(e) => setAgreeRequired(e.target.checked)}
                  className="mt-1 w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                />
                <span className="text-xs text-slate-700 leading-relaxed font-medium">
                  <span className="text-blue-600 font-bold">[필수]</span> 조건별 미리보기 생성·보관을 위해 예산·거주
                  가능 여부·보유 기간·주택 보유 구간, 임의 브라우저 식별값과 동의 기록을 생성 후 30일간 처리하는 데
                  동의합니다. 동의를 거부할 수 있으나 목록을 생성할 수 없습니다.{" "}
                  <span className="underline text-slate-500 hover:text-slate-800 cursor-pointer">개인정보 안내</span>
                </span>
              </label>

              {/* 선택 광고 성과 측정 안내 박스 */}
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
                <div>
                  <h4 className="text-xs font-bold text-slate-800">광고 성과 측정은 선택입니다.</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                    동의하면 분석 광고를 보고 추천 결과를 확인했는지 측정합니다. 동의하지 않아도 무료 추천을 볼 수
                    있습니다.{" "}
                    <span className="underline text-slate-600 hover:text-slate-900 cursor-pointer">제공 정보 확인</span>
                  </p>
                </div>

                <div className="space-y-2 pt-1 border-t border-slate-200/60">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeOptionalEvent}
                      onChange={(e) => setAgreeOptionalEvent(e.target.checked)}
                      className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 font-medium">
                      [선택] 결과 확인 이벤트와 방문 정보를 제공하는 데 동의합니다.
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeOptionalOverseas}
                      onChange={(e) => setAgreeOptionalOverseas(e.target.checked)}
                      className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 font-medium">
                      [선택] 위 정보의 국외(미국) 이전에 동의합니다.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* 추천 구역 확인하기 버튼 */}
            <div className="pt-2">
              <button
                type="button"
                disabled={!agreeRequired}
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setShowResult(true);
                }}
                className={`w-full py-4 rounded-2xl font-black text-base shadow-lg transition-all ${
                  agreeRequired
                    ? "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20 active:scale-[0.99] cursor-pointer"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
              >
                추천 구역 확인하기
              </button>
            </div>
          </div>
        ) : (
          /* ==================== 2단계: 추천 결과 화면 (이미지 3 동일) ==================== */
          <div className="space-y-6 animate-fadeIn">
            {/* 상단 헤더 & 조건 변경 버튼 */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  내게 맞는 추천 재개발 구역 목록
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm font-medium mt-1">
                  입력한 조건과 현재 확인 가능한 자료를 기준으로, 먼저 살펴볼 구역을 순서대로 정리했습니다.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowResult(false)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs shrink-0 self-start sm:self-auto"
              >
                <span>✨</span>
                <span>조건 변경하기</span>
              </button>
            </div>

            {/* 조건 요약 바 */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 flex flex-wrap items-center gap-2 text-xs font-bold shadow-2xs">
              <span className="text-slate-400 font-medium">적용 조건:</span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
                예산 {budget}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                {residency}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
                보유기간 {period}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                {houseCount}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-black">
                {investRatioLabel}
              </span>
            </div>

            {/* 메인 결과 카드 (이미지 3의 다크 헤더 카드 형태) */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg">
              {/* 다크 배너 헤더 */}
              <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 tracking-wider">추천 구역 목록</span>
                  <h3 className="text-lg sm:text-xl font-black tracking-tight mt-0.5">내 조건에 맞춘 투자구역</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-slate-800 text-blue-400 text-xs font-extrabold border border-slate-700">
                  {isUnlocked ? "3곳 전체 공개됨" : "1곳 우선 공개"}
                </span>
              </div>

              {/* 01 가장 먼저 살펴볼 추천 구역 (무료 오픈) */}
              {topZone && (
                <div className="p-6 sm:p-8 border-b border-slate-100 bg-blue-50/20">
                  <div className="flex items-start gap-4">
                    <span className="text-blue-600 font-black text-xl sm:text-2xl mt-0.5 shrink-0">01</span>
                    <div className="space-y-3 w-full">
                      <div>
                        <span className="text-[11px] font-extrabold text-blue-600 tracking-wide">
                          가장 먼저 살펴볼 추천 구역
                        </span>
                        <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                            {topZone.name}
                          </h2>
                          <span className="text-xs text-slate-500 font-bold">
                            📍 {topZone.district} · {topZone.type} ({topZone.status})
                          </span>
                        </div>
                      </div>

                      {/* 핵심 지표 칩 그리드 */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                          <span className="text-[10px] text-slate-400 font-bold">초기 투자금</span>
                          <div className="text-sm sm:text-base font-black text-blue-600">
                            {topZone.minInvestmentDisplay || "3.5억~"}
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                          <span className="text-[10px] text-slate-400 font-bold">예정 세대수</span>
                          <div className="text-sm sm:text-base font-black text-slate-900">
                            {topZone.totalUnits.toLocaleString()}세대
                          </div>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                          <span className="text-[10px] text-slate-400 font-bold">진행 단계</span>
                          <div className="text-sm sm:text-base font-black text-slate-900">{topZone.status}</div>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs">
                          <span className="text-[10px] text-slate-400 font-bold">시공사</span>
                          <div className="text-xs sm:text-sm font-black text-slate-800 truncate">
                            {topZone.builder || "미정"}
                          </div>
                        </div>
                      </div>

                      {/* AI 맞춤 추천 분석 사유 */}
                      <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-2xs space-y-2">
                        <div className="flex items-center gap-1.5 text-xs font-black text-blue-700">
                          <span>💡</span>
                          <span>내 조건과 일치하는 이유</span>
                        </div>
                        <ul className="text-xs text-slate-600 space-y-1 font-medium list-disc list-inside">
                          <li>
                            입력하신 예산(<strong className="text-slate-900">{budget}</strong>) 내에서 소액 갭투자가
                            가능한 매물이 실거래되고 있습니다.
                          </li>
                          <li>
                            현재 단계(<strong className="text-slate-900">{topZone.status}</strong>) 기준, 예상 보유
                            기간(<strong className="text-slate-900">{period}</strong>)과 시기적으로 가장 이상적입니다.
                          </li>
                          <li>
                            선택하신 투자·실거주 비중({investRatioLabel})에 따라 높은 사업성과 우수한 학군/교통 인프라를
                            동시에 갖추고 있습니다.
                          </li>
                        </ul>
                      </div>

                      {/* 지도 및 상세 링크 */}
                      <div className="pt-1">
                        <Link
                          href={`/redevelopment?zone=${topZone.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                          <span>🗺️ 지도에서 이 구역 경계선 및 실거래가 확인하기 →</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 🔒 나머지 구역 블러/잠금 안내 영역 (이미지 3 동일) */}
              {!isUnlocked ? (
                <div className="p-6 bg-slate-50 border-b border-slate-200/80">
                  <div className="bg-blue-50/80 rounded-2xl p-4 border border-blue-200 flex items-start gap-3">
                    <span className="text-blue-600 text-lg mt-0.5">🔒</span>
                    <div>
                      <h4 className="text-sm font-black text-blue-950">
                        나머지 추천 구역과 추천 이유는 전체 목록에서 제공합니다.
                      </h4>
                      <p className="text-xs text-blue-800/80 font-medium mt-0.5 leading-relaxed">
                        추천 구역 2곳과 3곳의 이름, 세 구역 모두의 조건별 추천 이유, 비교표와 다음 확인사항이
                        포함됩니다.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* 02 추천 구역 (잠금 또는 오픈) */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-slate-300 font-black text-lg">02</span>
                  <div>
                    {isUnlocked && subZones[0] ? (
                      <div>
                        <div className="text-base font-black text-slate-900">{subZones[0].name}</div>
                        <div className="text-xs text-slate-500 font-medium">
                          {subZones[0].district} · {subZones[0].status} · 초기 {subZones[0].minInvestmentDisplay}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-bold text-slate-500">추천 구역 2</div>
                    )}
                  </div>
                </div>

                {!isUnlocked ? (
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <span>🔒</span>
                    <span>전체 목록에서 공개</span>
                  </span>
                ) : (
                  <Link
                    href={`/redevelopment?zone=${subZones[0]?.id}`}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    상세보기 →
                  </Link>
                )}
              </div>

              {/* 03 추천 구역 (잠금 또는 오픈) */}
              <div className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-slate-300 font-black text-lg">03</span>
                  <div>
                    {isUnlocked && subZones[1] ? (
                      <div>
                        <div className="text-base font-black text-slate-900">{subZones[1].name}</div>
                        <div className="text-xs text-slate-500 font-medium">
                          {subZones[1].district} · {subZones[1].status} · 초기 {subZones[1].minInvestmentDisplay}
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-bold text-slate-500">추천 구역 3</div>
                    )}
                  </div>
                </div>

                {!isUnlocked ? (
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <span>🔒</span>
                    <span>전체 목록에서 공개</span>
                  </span>
                ) : (
                  <Link
                    href={`/redevelopment?zone=${subZones[1]?.id}`}
                    className="text-xs font-bold text-blue-600 hover:underline"
                  >
                    상세보기 →
                  </Link>
                )}
              </div>
            </div>

            {/* 하단 결제/액션 바 (이미지 3 하단 동일) */}
            {!isUnlocked ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                <div>
                  <h4 className="text-base font-black text-slate-900">나머지 추천구역과 투자전략 확인하기</h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    구역 2, 3곳의 상세 분석 및 3개 구역 비교 리포트를 즉시 열람할 수 있습니다.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowPayModal(true)}
                  className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-sm rounded-2xl shadow-md transition-all active:scale-95 shrink-0 text-center cursor-pointer"
                >
                  4,900원 결제하기
                </button>
              </div>
            ) : null}
          </div>
        )}
      </main>

      {/* 결제 확인 모달 */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-scaleUp">
            <div className="text-center space-y-2">
              <span className="text-3xl">💎</span>
              <h3 className="text-xl font-black text-slate-900">맞춤 추천 구역 전체 열람</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                테스트 모드입니다. [결제 완료]를 클릭하시면 2, 3순위 추천 구역과 비교 분석 리포트가 즉시 잠금 해제됩니다.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <div className="flex justify-between font-bold text-slate-600">
                <span>상품명</span>
                <span className="text-slate-900">재개발 맞춤 추천 구역 3선 리포트</span>
              </div>
              <div className="flex justify-between font-bold text-slate-600">
                <span>결제 금액</span>
                <span className="text-blue-600 text-sm font-black">4,900원</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowPayModal(false)}
                className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsUnlocked(true);
                  setShowPayModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md cursor-pointer"
              >
                결제 완료 (잠금해제)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
