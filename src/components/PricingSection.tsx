"use client";

import { useState } from "react";
import { PRICING_PLANS, UserRole } from "@/types/auth";

interface PricingSectionProps {
  onSelectPlan: (role: UserRole, billingCycle: "monthly" | "yearly") => void;
  selectedRole?: UserRole;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export default function PricingSection({
  onSelectPlan,
  selectedRole,
  showCloseButton,
  onClose,
}: PricingSectionProps) {
  // 결제 주기: "yearly" (연간 결제 - 20% 절약) vs "monthly" (매월 결제)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <div className="bg-[#0c0e12] text-white rounded-3xl p-5 sm:p-8 lg:p-10 border border-slate-800 shadow-2xl relative overflow-hidden font-sans">
      {/* 닫기 버튼 (모달일 경우) */}
      {showCloseButton && onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer z-20"
          aria-label="닫기"
        >
          ✕
        </button>
      )}

      {/* 상단 헤더 */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-bold text-amber-400 mb-4">
          <span>✨ 찾아줘 멤버십 & 파트너 요금제</span>
        </div>
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3">
          귀하에게 맞는 요금제 선택
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
          일반 개인 회원부터 프로 투자자, 단지 대표 공인중개사, 학원 및 식당 로컬 비즈니스까지 꼭 필요한 맞춤 기능을 제공합니다.
        </p>

        {/* 결제 주기 스위처 (매월 결제 vs 매년 결제 [절약하기 20%]) */}
        <div className="mt-6 inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              billingCycle === "monthly"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            매월 결제
          </button>
          <button
            type="button"
            onClick={() => setBillingCycle("yearly")}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === "yearly"
                ? "bg-amber-400 text-slate-950 font-black shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>매년 결제</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-emerald-500 text-white font-extrabold leading-none">
              절약하기 20%
            </span>
          </button>
        </div>
      </div>

      {/* 4개 요금제 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 max-w-7xl mx-auto items-stretch">
        {PRICING_PLANS.map((plan) => {
          const isSelected = selectedRole === plan.id;
          const isPro = plan.isPopular;
          const displayPrice =
            plan.id === "general"
              ? 0
              : billingCycle === "yearly"
              ? plan.yearlyPricePerMonth
              : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl flex flex-col justify-between transition-all duration-200 relative ${
                isPro
                  ? "bg-[#161922] border-2 border-rose-500/80 shadow-[0_0_40px_rgba(225,29,72,0.18)] order-first md:order-none"
                  : isSelected
                  ? "bg-[#141720] border-2 border-indigo-500 shadow-lg"
                  : "bg-[#12141a] border border-slate-800/80 hover:border-slate-700"
              }`}
            >
              {/* 상단 하이라이트 배너 (가장 인기 있는) */}
              {isPro && (
                <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white text-xs font-black text-center py-2 rounded-t-[22px] tracking-wide shadow-sm">
                  🔥 가장 인기 있는 멤버십
                </div>
              )}

              <div className={`p-5 sm:p-6 flex-1 flex flex-col justify-between ${!isPro ? "pt-6" : ""}`}>
                {/* 카드 상단 정보 */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold text-slate-400">
                      {plan.badge ? plan.badge : "기본 플랜"}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-semibold">
                      {plan.targetUser.split(" ")[0]}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1.5 min-h-[32px] leading-relaxed">
                    {plan.subtitle}
                  </p>

                  {/* 가격 영역 */}
                  <div className="mt-5 pb-5 border-b border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-white">
                        {displayPrice === 0 ? "무료" : `₩${displayPrice.toLocaleString()}`}
                      </span>
                      {displayPrice > 0 && (
                        <span className="text-xs font-medium text-slate-400">/월</span>
                      )}
                    </div>
                    {displayPrice > 0 ? (
                      <div className="text-[11px] text-slate-400 mt-1">
                        {billingCycle === "yearly"
                          ? `₩${plan.yearlyTotal.toLocaleString()} 매년 청구 (20% 할인)`
                          : `₩${plan.monthlyPrice.toLocaleString()} 매월 청구`}
                      </div>
                    ) : (
                      <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
                        별도 비용 없이 평생 무료 이용
                      </div>
                    )}
                  </div>

                  {/* CTA 버튼 */}
                  <div className="mt-5">
                    <button
                      type="button"
                      onClick={() => onSelectPlan(plan.id, billingCycle)}
                      className={`w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm transition-all duration-150 cursor-pointer flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                        isPro
                          ? "bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 shadow-lg shadow-amber-400/20 font-black"
                          : plan.id === "general"
                          ? "bg-slate-800 hover:bg-slate-700 text-white border border-slate-700"
                          : plan.id === "realtor"
                          ? "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20"
                          : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                      }`}
                    >
                      <span>{plan.ctaText}</span>
                      <span>→</span>
                    </button>
                  </div>

                  {/* 라디오 버튼 결제 옵션 (유료 요금제용 미리보기) */}
                  {displayPrice > 0 && (
                    <div className="mt-4 p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2 text-xs">
                      <label
                        className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
                          billingCycle === "yearly" ? "text-amber-300 font-bold" : "text-slate-400"
                        }`}
                        onClick={() => setBillingCycle("yearly")}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`billing-${plan.id}`}
                            checked={billingCycle === "yearly"}
                            onChange={() => setBillingCycle("yearly")}
                            className="accent-amber-400 cursor-pointer"
                          />
                          <span>연간 결제 (20% 할인)</span>
                        </div>
                        <span className="text-[11px]">₩{plan.yearlyPricePerMonth.toLocaleString()}/월</span>
                      </label>

                      <label
                        className={`flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
                          billingCycle === "monthly" ? "text-white font-bold" : "text-slate-400"
                        }`}
                        onClick={() => setBillingCycle("monthly")}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`billing-${plan.id}`}
                            checked={billingCycle === "monthly"}
                            onChange={() => setBillingCycle("monthly")}
                            className="accent-amber-400 cursor-pointer"
                          />
                          <span>월간 결제</span>
                        </div>
                        <span className="text-[11px]">₩{plan.monthlyPrice.toLocaleString()}/월</span>
                      </label>
                    </div>
                  )}

                  {/* 주요 기능 특징 목록 */}
                  <div className="mt-6 space-y-2.5">
                    <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                      포함된 핵심 혜택:
                    </div>
                    {plan.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className={`flex items-start gap-2.5 text-xs leading-snug ${
                          feat.included
                            ? feat.highlight
                              ? "text-amber-200 font-bold"
                              : "text-slate-300"
                            : "text-slate-600 line-through"
                        }`}
                      >
                        <span
                          className={`shrink-0 text-xs ${
                            feat.included
                              ? feat.highlight
                                ? "text-amber-400"
                                : "text-emerald-400"
                              : "text-slate-600"
                          }`}
                        >
                          {feat.included ? "✓" : "✕"}
                        </span>
                        <span>{feat.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 하단 보증 뱃지 */}
                <div className="pt-6 mt-6 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
                  {plan.id === "general" && "가입 후 바로 무료 검색 가능"}
                  {plan.id === "premium" && "14일 무료 체험 · 언제든 해지 가능"}
                  {plan.id === "realtor" && "사업자등록증/중개등록증 확인 후 인증 마크 부여"}
                  {plan.id === "business" && "상호명 및 상권 맵 즉시 등록 지원"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 요금제 하단 자주 묻는 질문(FAQ) 힌트 */}
      <div className="mt-12 pt-8 border-t border-slate-800/80 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>🔒</span>
          <span>안전한 256비트 암호화 결제 · 영수증 및 세금계산서 발행 가능</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hover:text-slate-200 cursor-pointer">이용약관</span>
          <span>·</span>
          <span className="hover:text-slate-200 cursor-pointer">개인정보처리방침</span>
          <span>·</span>
          <span className="hover:text-slate-200 cursor-pointer">고객센터 문의하기</span>
        </div>
      </div>
    </div>
  );
}
