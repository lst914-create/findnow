"use client";

import { useState } from "react";
import { UserRole, UserProfile } from "@/types/auth";
import { saveStoredUser, DEMO_ACCOUNTS } from "@/lib/authStore";
import PricingSection from "./PricingSection";

interface UnifiedAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "signup" | "pricing";
  initialRole?: UserRole;
  onAuthSuccess?: (user: UserProfile) => void;
}

export default function UnifiedAuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  initialRole = "general",
  onAuthSuccess,
}: UnifiedAuthModalProps) {
  // 모드: "login" (로그인), "signup" (회원가입), "pricing" (요금제 선택)
  const [mode, setMode] = useState<"login" | "signup" | "pricing">(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  // 로그인 폼 State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // 회원가입 공통 폼 State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // 공인중개사 회원 전용 필드
  const [agencyName, setAgencyName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [realtorContact, setRealtorContact] = useState("");
  const [targetRegion, setTargetRegion] = useState("서울 서초구");

  // 학원 및 식당/상가 회원 전용 필드
  const [businessCategory, setBusinessCategory] = useState<"학원/교육" | "식당/카페" | "병원/약국" | "생활/편의">("학원/교육");
  const [businessName, setBusinessName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [businessLocation, setBusinessLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // 데모 계정 원클릭 로그인
  const handleQuickDemoLogin = (role: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      const demoUser = DEMO_ACCOUNTS[role];
      saveStoredUser(demoUser);
      setLoading(false);
      setSuccessMsg(`🎉 ${demoUser.name} (${getRoleBadgeName(role)}) 계정으로 로그인되었습니다!`);
      if (onAuthSuccess) onAuthSuccess(demoUser);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    }, 400);
  };

  // 소셜 간편 로그인 및 간편가입
  const handleSocialLogin = (provider: "kakao" | "naver" | "google") => {
    setLoading(true);
    setTimeout(() => {
      const providerLabel = provider === "kakao" ? "카카오" : provider === "naver" ? "네이버" : "Google";
      const newUser: UserProfile = {
        id: `social_${Date.now()}`,
        name: name || `${providerLabel} 회원`,
        email: `${provider}_user@chajwo.com`,
        role: selectedRole,
        provider,
        phone: phone || "010-0000-0000",
        createdAt: new Date().toISOString().slice(0, 10),
      };

      if (selectedRole === "premium") {
        newUser.subscription = {
          plan: billingCycle,
          expiresAt: billingCycle === "yearly" ? "2027-10-24" : "2026-11-24",
          autoRenew: true,
        };
      } else if (selectedRole === "realtor") {
        newUser.realtorInfo = {
          agencyName: agencyName || `${providerLabel} 파트너 공인중개사무소`,
          licenseNumber: licenseNumber || "11650-2024-00987",
          contact: realtorContact || phone || "02-1234-5678",
          targetRegion: targetRegion || "서울시 전체",
          isVerified: true,
        };
      } else if (selectedRole === "business") {
        newUser.businessInfo = {
          category: businessCategory,
          businessName: businessName || `${providerLabel} 로컬 파트너 상점`,
          businessNumber: businessNumber || "214-88-77665",
          location: businessLocation || "서울시 인근 단지",
          phone: phone || "02-9876-5432",
          isVerified: true,
        };
      }

      saveStoredUser(newUser);
      setLoading(false);
      setSuccessMsg(
        mode === "signup"
          ? `🎉 ${providerLabel} 간편가입 완료! [${getRoleBadgeName(selectedRole)}]으로 등록되었습니다.`
          : `🎉 ${providerLabel} 계정으로 로그인되었습니다!`
      );
      if (onAuthSuccess) onAuthSuccess(newUser);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1300);
    }, 500);
  };

  // 이메일 로그인 제출
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      alert("이메일과 비밀번호를 입력해주세요.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const user: UserProfile = {
        id: `user_${Date.now()}`,
        email: loginEmail,
        name: loginEmail.split("@")[0] || "회원",
        role: "general",
        provider: "email",
        createdAt: new Date().toISOString().slice(0, 10),
      };
      saveStoredUser(user);
      setLoading(false);
      setSuccessMsg(`환영합니다, ${user.name}님!`);
      if (onAuthSuccess) onAuthSuccess(user);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1200);
    }, 500);
  };

  // 회원가입 제출 (4개 회원 유형 지원)
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("이름, 이메일, 비밀번호를 모두 입력해주세요.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newUser: UserProfile = {
        id: `user_${Date.now()}`,
        email,
        name,
        role: selectedRole,
        provider: "email",
        phone,
        createdAt: new Date().toISOString().slice(0, 10),
      };

      if (selectedRole === "premium") {
        newUser.subscription = {
          plan: billingCycle,
          expiresAt: billingCycle === "yearly" ? "2027-10-24" : "2026-11-24",
          autoRenew: true,
        };
      } else if (selectedRole === "realtor") {
        newUser.realtorInfo = {
          agencyName: agencyName || `${name} 공인중개사사무소`,
          licenseNumber: licenseNumber || "중개등록번호 확인중",
          contact: realtorContact || phone || "02-1234-5678",
          targetRegion: targetRegion || "서울시 전체",
          isVerified: true,
        };
      } else if (selectedRole === "business") {
        newUser.businessInfo = {
          category: businessCategory,
          businessName: businessName || `${name} 상점`,
          businessNumber: businessNumber || "사업자등록 심사중",
          location: businessLocation || "서울시 인근 단지",
          phone: phone || "02-9876-5432",
          isVerified: true,
        };
      }

      saveStoredUser(newUser);
      setLoading(false);
      setSuccessMsg(`🎉 ${getRoleBadgeName(selectedRole)} 가입이 성공적으로 완료되었습니다!`);
      if (onAuthSuccess) onAuthSuccess(newUser);
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1400);
    }, 600);
  };

  function getRoleBadgeName(role: UserRole) {
    switch (role) {
      case "general":
        return "일반 회원";
      case "premium":
        return "PRO 유료 회원";
      case "realtor":
        return "공인중개사 회원";
      case "business":
        return "학원·식당 회원";
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      {/* 1. 요금제 안내 풀 뷰 모드 */}
      {mode === "pricing" ? (
        <div className="w-full max-w-7xl my-auto animate-in zoom-in-95 duration-200">
          <PricingSection
            selectedRole={selectedRole}
            showCloseButton={true}
            onClose={onClose}
            onSelectPlan={(role, cycle) => {
              setSelectedRole(role);
              setBillingCycle(cycle);
              setMode("signup");
            }}
          />
        </div>
      ) : (
        /* 2. 로그인 및 회원가입 모달 모드 */
        <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 dark:border-slate-800 my-auto animate-in zoom-in-95 duration-200 font-sans">
          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center absolute top-5 right-5 transition-colors cursor-pointer"
            aria-label="닫기"
          >
            ✕
          </button>

          {/* 성공 알림 토스트 */}
          {successMsg && (
            <div className="mb-5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-bold text-center animate-bounce">
              {successMsg}
            </div>
          )}

          {/* 상단 탭: 로그인 vs 회원가입 vs 요금제 보기 */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                로그인
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  mode === "signup"
                    ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
                }`}
              >
                회원가입
              </button>
            </div>

            <button
              type="button"
              onClick={() => setMode("pricing")}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>💎 요금제 전체 비교</span>
              <span>→</span>
            </button>
          </div>

          {/* ======================= 로그인 뷰 ======================= */}
          {mode === "login" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  찾아줘에 오신 것을 환영합니다
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  부동산 정보 탐색과 맞춤 실거래 알림을 시작해보세요.
                </p>
              </div>

              {/* 간편 데모 1초 로그인 (테스트용) */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
                <div className="text-[11px] font-extrabold text-slate-600 dark:text-slate-300 mb-2 flex items-center justify-between">
                  <span>⚡ 빠른 데모 체험 (원클릭 로그인)</span>
                  <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">비번 입력 없음</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("general")}
                    className="p-2 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 hover:border-indigo-400 transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>👤</span>
                    <span>일반 회원</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("premium")}
                    className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 hover:bg-rose-100 transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>⭐</span>
                    <span>PRO 유료회원</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("realtor")}
                    className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🏢</span>
                    <span>공인중개사</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickDemoLogin("business")}
                    className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-all text-left flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>🏫🍽️</span>
                    <span>학원·식당회원</span>
                  </button>
                </div>
              </div>

              {/* 이메일 로그인 폼 */}
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    이메일 주소
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="example@chajwo.com"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    비밀번호
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-black text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? "로그인 중..." : "이메일로 로그인"}
                </button>
              </form>

              {/* 구분선 */}
              <div className="relative text-center my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <span className="relative px-3 bg-white dark:bg-slate-900 text-xs text-slate-400 font-semibold">
                  또는 SNS 3초 간편 로그인
                </span>
              </div>

              {/* 소셜 로그인 버튼들 */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("kakao")}
                  className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] transition-all"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.828 1.838 5.309 4.62 6.702l-1.18 4.364c-.105.388.337.697.666.467l5.148-3.418c.245.02.493.033.746.033 5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
                  </svg>
                  <span>카카오로 3초 만에 시작하기</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("naver")}
                  className="w-full py-3 px-4 rounded-2xl font-bold text-xs bg-[#03C75A] hover:bg-[#02b351] text-white flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99] transition-all"
                >
                  <span className="font-black text-sm leading-none">N</span>
                  <span>네이버로 시작하기</span>
                </button>
              </div>
            </div>
          )}

          {/* ======================= 회원가입 뷰 (4개 유형) ======================= */}
          {mode === "signup" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  회원 유형을 선택해주세요
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  활동 목적에 맞는 회원 유형을 선택하시면 최적화된 혜택이 적용됩니다.
                </p>
              </div>

              {/* 4대 회원 유형 선택 카드 탭 */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    id: "general" as UserRole,
                    name: "일반 회원",
                    desc: "무료 이용",
                    icon: "👤",
                    price: "₩0",
                  },
                  {
                    id: "premium" as UserRole,
                    name: "유료 회원",
                    desc: "PRO 투자자",
                    icon: "⭐",
                    price: "₩15,900/월",
                    badge: "인기🔥",
                  },
                  {
                    id: "realtor" as UserRole,
                    name: "공인중개사",
                    desc: "단지 대표 중개사",
                    icon: "🏢",
                    price: "₩39,000/월",
                  },
                  {
                    id: "business" as UserRole,
                    name: "학원 및 식당",
                    desc: "로컬 상권 홍보",
                    icon: "🏫🍽️",
                    price: "₩23,000/월",
                  },
                ].map((item) => {
                  const isCur = selectedRole === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedRole(item.id)}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                        isCur
                          ? "bg-indigo-50/80 dark:bg-indigo-950/70 border-indigo-600 ring-2 ring-indigo-500/30"
                          : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {item.badge && (
                        <span className="absolute top-2 right-2 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-rose-500 text-white">
                          {item.badge}
                        </span>
                      )}
                      <div className="text-xl mb-1">{item.icon}</div>
                      <div className="text-xs font-black text-slate-900 dark:text-white">
                        {item.name}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {item.desc} · <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.price}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* 선택된 유형 혜택 요약 칩 */}
              <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900/60 text-xs">
                <div className="font-bold text-indigo-950 dark:text-indigo-200 flex items-center justify-between">
                  <span>선택된 혜택: {getRoleBadgeName(selectedRole)}</span>
                  <button
                    type="button"
                    onClick={() => setMode("pricing")}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 underline font-bold"
                  >
                    상세 요금제 보기
                  </button>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {selectedRole === "general" && "✓ 전국 실거래가 조회 및 청약 캘린더 기본 열람 (무료)"}
                  {selectedRole === "premium" && "✓ 20년 과거 거래 분석 + 예상 분담금 AI 계산기 + 급매물 카톡 실시간 알림"}
                  {selectedRole === "realtor" && "✓ 단지 상세페이지 대표 중개사무소 노출 + 무제한 매물 등록 + 1:1 상담 연결"}
                  {selectedRole === "business" && "✓ 단지 상세페이지 내 '우리동네 대표 학원·맛집' 최우선 노출 + 쿠폰 발행"}
                </div>
              </div>

              {/* SNS 3초 간편가입 버튼 (카카오, 네이버, Google) */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span>⚡ 3초 SNS 간편가입</span>
                  <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-extrabold bg-indigo-50 dark:bg-indigo-950/70 px-2 py-0.5 rounded-full">
                    인기 추천
                  </span>
                </div>

                {/* 카카오 간편가입 */}
                <button
                  type="button"
                  onClick={() => handleSocialLogin("kakao")}
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-2xl font-black text-xs sm:text-sm bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] flex items-center justify-center gap-2 cursor-pointer shadow-xs hover:shadow-md active:scale-[0.99] transition-all"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.828 1.838 5.309 4.62 6.702l-1.18 4.364c-.105.388.337.697.666.467l5.148-3.418c.245.02.493.033.746.033 5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
                  </svg>
                  <span>카카오로 3초 간편가입 ({getRoleBadgeName(selectedRole)})</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  {/* 네이버 간편가입 */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("naver")}
                    disabled={loading}
                    className="py-3 px-3 rounded-2xl font-bold text-xs bg-[#03C75A] hover:bg-[#02b351] text-white flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.99] transition-all"
                  >
                    <span className="font-black text-sm leading-none">N</span>
                    <span>네이버로 간편가입</span>
                  </button>

                  {/* Google 간편가입 */}
                  <button
                    type="button"
                    onClick={() => handleSocialLogin("google")}
                    disabled={loading}
                    className="py-3 px-3 rounded-2xl font-bold text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.99] transition-all"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                    </svg>
                    <span>Google로 가입</span>
                  </button>
                </div>
              </div>

              {/* 구분선 */}
              <div className="relative text-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                </div>
                <span className="relative px-3 bg-white dark:bg-slate-900 text-[11px] text-slate-400 font-semibold">
                  또는 이메일 정보 직접 입력 가입
                </span>
              </div>

              {/* 회원가입 입력 폼 */}
              <form onSubmit={handleSignUpSubmit} className="space-y-3">
                {/* 1. 공통 기본 정보 */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      이름 (대표자명)
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="홍길동"
                      required
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      휴대폰 번호
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="010-1234-5678"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    이메일 주소 (아이디)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    비밀번호 설정
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6자 이상 입력"
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* 2. 공인중개사 회원 전용 필드 */}
                {selectedRole === "realtor" && (
                  <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-2.5 text-xs animate-in fade-in">
                    <div className="font-extrabold text-blue-900 dark:text-blue-200">
                      🏢 공인중개사 전용 등록 정보
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        중개사무소 명칭
                      </label>
                      <input
                        type="text"
                        value={agencyName}
                        onChange={(e) => setAgencyName(e.target.value)}
                        placeholder="예: 한강자이 공인중개사사무소"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          중개등록번호
                        </label>
                        <input
                          type="text"
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          placeholder="11650-2023-00124"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          주요 활동 지역
                        </label>
                        <input
                          type="text"
                          value={targetRegion}
                          onChange={(e) => setTargetRegion(e.target.value)}
                          placeholder="서울 서초구 반포동"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. 학원 및 식당 회원 전용 필드 */}
                {selectedRole === "business" && (
                  <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 space-y-2.5 text-xs animate-in fade-in">
                    <div className="font-extrabold text-emerald-900 dark:text-emerald-200">
                      🏫🍽️ 학원·식당 사업장 정보
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          업종 분류
                        </label>
                        <select
                          value={businessCategory}
                          onChange={(e) => setBusinessCategory(e.target.value as any)}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-xs"
                        >
                          <option value="학원/교육">📚 학원/교육시설</option>
                          <option value="식당/카페">🍽️ 식당/카페/베이커리</option>
                          <option value="병원/약국">🏥 병원/의원/약국</option>
                          <option value="생활/편의">🛍️ 생활/마트/피트니스</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                          상호명 (학원명/가게명)
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="예: 매쓰마스터 수학학원"
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-xs"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        사업장 주소 (인근 아파트 단지)
                      </label>
                      <input
                        type="text"
                        value={businessLocation}
                        onChange={(e) => setBusinessLocation(e.target.value)}
                        placeholder="예: 래미안 원베일리 상가 3층"
                        className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 제출 버튼 */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-2xl font-black text-sm bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-lg shadow-indigo-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? "가입 처리 중..." : `${getRoleBadgeName(selectedRole)} 가입 완료하기`}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
