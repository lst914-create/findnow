"use client";

import { useState } from "react";
import { RedevelopmentZone } from "@/lib/redevelopment";

interface RedevelopmentInvestmentCalculatorProps {
  zone: RedevelopmentZone;
}

export default function RedevelopmentInvestmentCalculator({
  zone,
}: RedevelopmentInvestmentCalculatorProps) {
  // 1. 매물 기본 정보 입력값 (단위: 만원)
  const [purchasePriceManwon, setPurchasePriceManwon] = useState<number>(
    zone.transactions[0]?.tradePriceManwon || 65000
  );
  const [jeonseDepositManwon, setJeonseDepositManwon] = useState<number>(25000); // 전세/임대보증금
  const [officialPriceManwon, setOfficialPriceManwon] = useState<number>(
    zone.transactions[0]?.officialPriceManwon || 20000
  );

  // 2. 사업성 변수 슬라이더
  const [appraisalRatio, setAppraisalRatio] = useState<number>(
    zone.calcMetrics.avgOfficialPriceRatio || 130
  ); // 감정평가율 (%)
  const [proportionRate, setProportionRate] = useState<number>(
    zone.calcMetrics.estimatedProportionRate || 105
  ); // 비례율 (%)

  // 3. 희망 배정 평형 선택 (59㎡ vs 84㎡)
  const [targetType, setTargetType] = useState<"59" | "84">("84");

  // === 실시간 계산 로직 ===
  // 1) 초기투자금 (Gap)
  const initialInvestment = Math.max(0, purchasePriceManwon - jeonseDepositManwon);

  // 2) 추정 감정평가액 = 공시가격 * (감정평가율 / 100)
  const estimatedAppraisalPrice = Math.round(officialPriceManwon * (appraisalRatio / 100));

  // 3) 추정 프리미엄(P) = 매매가 - 추정 감정평가액
  const estimatedPremium = purchasePriceManwon - estimatedAppraisalPrice;

  // 4) 추정 권리가액 = 감정평가액 * (비례율 / 100)
  const estimatedRightPrice = Math.round(estimatedAppraisalPrice * (proportionRate / 100));

  // 5) 조합원 분양가
  const unionPrice =
    targetType === "59"
      ? zone.calcMetrics.unionPrice59Manwon
      : zone.calcMetrics.unionPrice84Manwon;

  // 6) 예상 추가 분담금 = 조합원 분양가 - 권리가액 (음수면 환급금)
  const estimatedContribution = unionPrice - estimatedRightPrice;

  // 7) 총 투자금액 = 매매가 + 추가분담금 (또는 조합원분양가 + 프리미엄)
  const totalInvestment = purchasePriceManwon + estimatedContribution;

  // 8) 입주 시 예상 신축 시세 및 기대 수익
  const expectedMarketPrice =
    targetType === "59"
      ? Math.round(zone.calcMetrics.expectedNewAptPrice84Manwon * 0.78)
      : zone.calcMetrics.expectedNewAptPrice84Manwon;

  const expectedProfit = expectedMarketPrice - totalInvestment;
  const returnOnEquity = initialInvestment > 0 ? (expectedProfit / initialInvestment) * 100 : 0;

  // 억/천 단위 변환 헬퍼
  const formatUkCheon = (manwon: number): string => {
    if (manwon < 0) return `-${formatUkCheon(-manwon)}`;
    const uk = Math.floor(manwon / 10000);
    const cheon = Math.round((manwon % 10000) / 1000) * 1000;
    if (uk === 0) return `${(cheon / 1000).toFixed(0)}천만원`;
    if (cheon === 0) return `${uk}억원`;
    return `${uk}억 ${(cheon / 1000).toFixed(0)}천만원`;
  };

  return (
    <div className="space-y-6">
      {/* 계산기 헤더 소개 */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow-md">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">🧮</span>
          <h3 className="text-base font-extrabold tracking-tight">
            {zone.name} 조합원 분담금 & 수익률 계산기
          </h3>
        </div>
        <p className="text-xs text-blue-100/90 leading-relaxed">
          매매가와 공시가격을 입력하면 <strong>감정평가액, 권리가액, 추가분담금, 총투자비용</strong>을 실시간 시뮬레이션합니다.
        </p>
      </div>

      {/* 1. 매물 정보 입력 영역 */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span>🏠</span> 1단계: 검토 중인 물건(빌라/단독) 정보 입력
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-500 font-semibold mb-1">
              매매 희망가 (만원)
            </label>
            <input
              type="number"
              step="1000"
              value={purchasePriceManwon}
              onChange={(e) => setPurchasePriceManwon(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[11px] text-blue-600 font-bold block mt-1">
              = {formatUkCheon(purchasePriceManwon)}
            </span>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">
              전세 / 보증금 (만원)
            </label>
            <input
              type="number"
              step="1000"
              value={jeonseDepositManwon}
              onChange={(e) => setJeonseDepositManwon(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              = {formatUkCheon(jeonseDepositManwon)}
            </span>
          </div>

          <div>
            <label className="block text-slate-500 font-semibold mb-1">
              공시가격 (만원)
            </label>
            <input
              type="number"
              step="1000"
              value={officialPriceManwon}
              onChange={(e) => setOfficialPriceManwon(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              = {formatUkCheon(officialPriceManwon)}
            </span>
          </div>
        </div>
      </div>

      {/* 2. 사업성 변수 & 희망 평형 선택 */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <span>⚙️</span> 2단계: 사업성 변수 & 희망 배정 평형
        </h4>

        {/* 희망 평형 토글 버튼 */}
        <div>
          <label className="block text-xs text-slate-500 font-semibold mb-2">
            입주 희망 신축 아파트 타입
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setTargetType("59")}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border ${
                targetType === "59"
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
            >
              <div>59㎡ (25평형)</div>
              <div className="text-[11px] opacity-80">
                조합원분양가: {formatUkCheon(zone.calcMetrics.unionPrice59Manwon)}
              </div>
            </button>

            <button
              onClick={() => setTargetType("84")}
              className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border ${
                targetType === "84"
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }`}
            >
              <div>84㎡ (34평형) 국민평형</div>
              <div className="text-[11px] opacity-80">
                조합원분양가: {formatUkCheon(zone.calcMetrics.unionPrice84Manwon)}
              </div>
            </button>
          </div>
        </div>

        {/* 슬라이더: 감정평가율 & 비례율 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-600 font-semibold">공시가 대비 감정평가율</span>
              <strong className="text-blue-600">{appraisalRatio}%</strong>
            </div>
            <input
              type="range"
              min="100"
              max="160"
              value={appraisalRatio}
              onChange={(e) => setAppraisalRatio(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>보수적(100%)</span>
              <span>평균(130%)</span>
              <span>낙관적(160%)</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-slate-600 font-semibold">정비사업 비례율</span>
              <strong className="text-indigo-600">{proportionRate}%</strong>
            </div>
            <input
              type="range"
              min="90"
              max="130"
              value={proportionRate}
              onChange={(e) => setProportionRate(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>90%</span>
              <span>105%</span>
              <span>130%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 시뮬레이션 결과 리포트 카드 */}
      <div className="bg-white rounded-2xl border-2 border-blue-600/30 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <span className="text-xs font-bold text-slate-500">시뮬레이션 분석 리포트</span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800">
            {targetType}㎡ 배정 기준
          </span>
        </div>

        {/* 4대 핵심 결과 수치 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block mb-0.5">초기 실투자금 (Gap)</span>
            <strong className="text-base font-black text-slate-900">
              {formatUkCheon(initialInvestment)}
            </strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block mb-0.5">추정 프리미엄 (P)</span>
            <strong className="text-base font-black text-purple-600">
              {formatUkCheon(estimatedPremium)}
            </strong>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 block mb-0.5">추정 권리가액</span>
            <strong className="text-base font-black text-slate-900">
              {formatUkCheon(estimatedRightPrice)}
            </strong>
          </div>

          <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
            <span className="text-[11px] text-blue-700 font-bold block mb-0.5">
              {estimatedContribution >= 0 ? "예상 추가분담금" : "예상 환급금"}
            </span>
            <strong className="text-base font-black text-blue-700">
              {estimatedContribution >= 0
                ? formatUkCheon(estimatedContribution)
                : `${formatUkCheon(-estimatedContribution)} 환급`}
            </strong>
          </div>
        </div>

        {/* 최종 총 투자비용 vs 신축 예상 시세 및 수익률 */}
        <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">내 총 투자원가 (매수가 + 분담금)</span>
            <strong className="text-sm font-bold text-yellow-300">
              {formatUkCheon(totalInvestment)}
            </strong>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300">입주 시 신축 예상 시세</span>
            <strong className="text-sm font-bold text-white">
              {formatUkCheon(expectedMarketPrice)}
            </strong>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <div>
              <span className="text-xs text-emerald-400 font-bold block">기대 시세차익</span>
              <strong className="text-lg font-black text-emerald-400">
                +{formatUkCheon(expectedProfit)}
              </strong>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-300 block">초투 대비 수익률(ROI)</span>
              <strong className="text-lg font-black text-white">
                {returnOnEquity > 0 ? `+${returnOnEquity.toFixed(1)}%` : "0%"}
              </strong>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed text-center">
          * 본 계산은 공시지가 및 통상적인 사업성 가정을 기초로 한 추정치이며, 조합 관리처분계획 인가 및 최종 감정평가 결과에 따라 변동될 수 있습니다.
        </p>
      </div>
    </div>
  );
}
