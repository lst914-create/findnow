"use client";

import { useState } from "react";
import { UserProfile, UserRole } from "@/types/auth";
import { saveStoredUser } from "@/lib/authStore";

interface MyProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
  onOpenPricing: () => void;
}

export default function MyProfileModal({
  isOpen,
  onClose,
  currentUser,
  onUserUpdate,
  onOpenPricing,
}: MyProfileModalProps) {
  // 모드: "overview" (내 정보 요약), "upgrade" (등급 변경)
  const [tab, setTab] = useState<"overview" | "upgrade">("overview");

  // 전환 폼 상태
  const [targetRole, setTargetRole] = useState<UserRole>("premium");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  // 공인중개사 전환 정보
  const [agencyName, setAgencyName] = useState(currentUser.realtorInfo?.agencyName || "");
  const [licenseNumber, setLicenseNumber] = useState(currentUser.realtorInfo?.licenseNumber || "");
  const [targetRegion, setTargetRegion] = useState(currentUser.realtorInfo?.targetRegion || "서울 서초구");

  // 학원/식당 전환 정보
  const [businessCategory, setBusinessCategory] = useState<"학원/교육" | "식당/카페" | "병원/약국" | "생활/편의">(
    currentUser.businessInfo?.category || "학원/교육"
  );
  const [businessName, setBusinessName] = useState(currentUser.businessInfo?.businessName || "");
  const [businessLocation, setBusinessLocation] = useState(currentUser.businessInfo?.location || "");

  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // 등급 변경 실행 함수
  const handleUpgradeRole = (newRole: UserRole) => {
    setLoading(true);
    setTimeout(() => {
      const updated: UserProfile = {
        ...currentUser,
        role: newRole,
      };

      if (newRole === "premium") {
        updated.subscription = {
          plan: billingCycle,
          expiresAt: billingCycle === "yearly" ? "2027-10-24" : "2026-11-24",
          autoRenew: true,
        };
      } else if (newRole === "realtor") {
        updated.realtorInfo = {
          agencyName: agencyName || `${currentUser.name} 공인중개사사무소`,
          licenseNumber: licenseNumber || "11650-2024-00987",
          contact: currentUser.phone || "02-1234-5678",
          targetRegion: targetRegion || "서울시 전체",
          isVerified: true,
        };
      } else if (newRole === "business") {
        updated.businessInfo = {
          category: businessCategory,
          businessName: businessName || `${currentUser.name} 로컬 파트너 상점`,
          businessNumber: "214-88-99881",
          location: businessLocation || "서울시 인근 단지 상가",
          phone: currentUser.phone || "02-9876-5432",
          isVerified: true,
        };
      } else if (newRole === "general") {
        // 일반회원으로 다운그레이드
        updated.subscription = undefined;
      }

      saveStoredUser(updated);
      onUserUpdate(updated);
      setLoading(false);
      setToastMsg(`🎉 멤버십이 [${getRoleBadgeName(newRole)}]으로 성공적으로 변경되었습니다!`);
      setTimeout(() => {
        setToastMsg(null);
        setTab("overview");
      }, 1500);
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
        return "학원·식당 로컬 파트너";
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 dark:border-slate-800 my-auto animate-in zoom-in-95 duration-200">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center absolute top-5 right-5 transition-colors cursor-pointer"
          aria-label="닫기"
        >
          ✕
        </button>

        {/* 상단 안내 & 탭 */}
        <div className="mb-6">
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-4">
            <button
              type="button"
              onClick={() => setTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                tab === "overview"
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
              }`}
            >
              내 멤버십 정보
            </button>
            <button
              type="button"
              onClick={() => setTab("upgrade")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                tab === "upgrade"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 font-extrabold"
              }`}
            >
              <span>🚀 등급 변경 / 업그레이드</span>
            </button>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {tab === "overview" ? "마이페이지 & 멤버십 관리" : "멤버십 등급 변경"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {tab === "overview"
              ? "현재 이용 중인 회원 등급과 혜택을 확인하고 관리할 수 있습니다."
              : "일반회원에서 PRO 유료회원, 공인중개사, 학원·식당 회원으로 언제든 전환 가능합니다."}
          </p>
        </div>

        {/* 토스트 알림 메시지 */}
        {toastMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-bold text-center animate-bounce">
            {toastMsg}
          </div>
        )}

        {/* ================= 1. 내 정보 및 멤버십 현황 탭 ================= */}
        {tab === "overview" && (
          <div className="space-y-5">
            {/* 현재 멤버십 카드 */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-900/50 relative overflow-hidden shadow-md">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-indigo-300">현재 이용 중인 플랜</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  {getRoleBadgeName(currentUser.role)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl">
                  {currentUser.role === "premium"
                    ? "⭐"
                    : currentUser.role === "realtor"
                    ? "🏢"
                    : currentUser.role === "business"
                    ? "🏫"
                    : "👤"}
                </div>
                <div>
                  <h4 className="text-lg font-black">{currentUser.name}님</h4>
                  <p className="text-xs text-slate-400">{currentUser.email}</p>
                </div>
              </div>

              {/* 유료 구독 만료일 또는 파트너 정보 */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                {currentUser.role === "premium" && (
                  <>
                    <span>구독 주기: {currentUser.subscription?.plan === "yearly" ? "연간 결제" : "월간 결제"}</span>
                    <span className="text-amber-400 font-bold">만료 예정: {currentUser.subscription?.expiresAt}</span>
                  </>
                )}
                {currentUser.role === "realtor" && (
                  <>
                    <span>등록 상호: {currentUser.realtorInfo?.agencyName}</span>
                    <span className="text-emerald-400 font-bold">인증 완료 ✓</span>
                  </>
                )}
                {currentUser.role === "business" && (
                  <>
                    <span>등록 사업장: {currentUser.businessInfo?.businessName}</span>
                    <span className="text-emerald-400 font-bold">로컬 핀 등록중 ✓</span>
                  </>
                )}
                {currentUser.role === "general" && (
                  <>
                    <span className="text-slate-400">무료 플랜 이용 중</span>
                    <button
                      onClick={() => setTab("upgrade")}
                      className="text-amber-300 hover:underline font-extrabold"
                    >
                      PRO로 업그레이드하기 →
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* 현재 이용 가능한 권한 리스트 */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
              <div className="font-extrabold text-slate-700 dark:text-slate-200 mb-1">
                현재 등급 적용 혜택:
              </div>
              {currentUser.role === "general" && (
                <>
                  <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>전국 아파트 실거래가 및 시세 기본 조회</span>
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>한국부동산원 청약 캘린더 및 공고 열람</span>
                  </div>
                  <div className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 line-through">
                    <span>✕</span>
                    <span>과거 20개년 전체 거래 내역 정밀 분석 (PRO 전용)</span>
                  </div>
                  <div className="text-slate-400 dark:text-slate-500 flex items-center gap-1.5 line-through">
                    <span>✕</span>
                    <span>재개발 예상 분담금 AI 시뮬레이터 (PRO 전용)</span>
                  </div>
                </>
              )}
              {currentUser.role === "premium" && (
                <>
                  <div className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5">
                    <span className="text-amber-500">⭐</span>
                    <span>20년 과거 전체 실거래 상세 & 신고가/신저가 AI 분석 무제한</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5">
                    <span className="text-amber-500">⭐</span>
                    <span>재개발·재건축 단지별 예상 분담금 AI 계산기 무제한 이용</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5">
                    <span className="text-amber-500">⭐</span>
                    <span>급매물 및 관심단지 실시간 카카오톡 알림 발송</span>
                  </div>
                </>
              )}
              {currentUser.role === "realtor" && (
                <>
                  <div className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5">
                    <span className="text-blue-500">🏢</span>
                    <span>단지 상세페이지 내 대표 공인중개사 우선 노출 및 1:1 상담</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5">
                    <span className="text-blue-500">🏢</span>
                    <span>실매물 무제한 등록 & 허위매물 제로 공식 안심 마크</span>
                  </div>
                </>
              )}
              {currentUser.role === "business" && (
                <>
                  <div className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5">
                    <span className="text-emerald-500">🏫</span>
                    <span>단지 상세페이지 내 '우리동네 대표 학원·맛집' 최우선 노출</span>
                  </div>
                  <div className="text-slate-700 dark:text-slate-200 font-bold flex items-center gap-1.5">
                    <span className="text-emerald-500">🏫</span>
                    <span>지도 핀 원장 약력/메뉴판 등록 및 입주민 쿠폰 발행</span>
                  </div>
                </>
              )}
            </div>

            {/* 하단 액션 버튼 */}
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setTab("upgrade")}
                className="flex-1 py-3 px-4 rounded-2xl font-black text-xs sm:text-sm bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-500/25 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>멤버십 등급 변경하기</span>
                <span>→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="py-3 px-4 rounded-2xl font-bold text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                요금제 전체 비교
              </button>
            </div>
          </div>
        )}

        {/* ================= 2. 등급 변경 / 업그레이드 탭 ================= */}
        {tab === "upgrade" && (
          <div className="space-y-4">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
              변경하고자 하는 회원 등급을 선택하세요:
            </div>

            {/* 변경 대상 4대 회원 카드 */}
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
                  name: "PRO 유료회원",
                  desc: "AI 분석 & 카톡알림",
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
                const isSelected = targetRole === item.id;
                const isCurrent = currentUser.role === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTargetRole(item.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? "bg-indigo-50/80 dark:bg-indigo-950/70 border-indigo-600 ring-2 ring-indigo-500/30"
                        : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {isCurrent && (
                      <span className="absolute top-2 right-2 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-slate-700 text-white">
                        현재 등급
                      </span>
                    )}
                    {item.badge && !isCurrent && (
                      <span className="absolute top-2 right-2 text-[10px] font-extrabold px-1.5 py-0.2 rounded-md bg-rose-500 text-white">
                        {item.badge}
                      </span>
                    )}
                    <div className="text-xl mb-1">{item.icon}</div>
                    <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                      <span>{item.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{item.price}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 유료회원 전환 시 결제 주기 선택 */}
            {targetRole === "premium" && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs space-y-2">
                <div className="font-bold text-amber-950 dark:text-amber-200 flex items-center justify-between">
                  <span>결제 옵션 선택</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold">연간 20% 절약</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("yearly")}
                    className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      billingCycle === "yearly"
                        ? "bg-amber-400 text-slate-950 border-amber-400 shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div>연간 결제 (추천)</div>
                    <div className="text-[11px] opacity-90">₩15,900/월 (₩190,800/년)</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`p-2.5 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                      billingCycle === "monthly"
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <div>월간 결제</div>
                    <div className="text-[11px] opacity-90">₩19,900/월</div>
                  </button>
                </div>
              </div>
            )}

            {/* 공인중개사 전환 시 등록 정보 입력 */}
            {targetRole === "realtor" && (
              <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900/60 space-y-2 text-xs">
                <div className="font-extrabold text-blue-900 dark:text-blue-200">
                  🏢 공인중개사 인증 정보 입력
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    중개사무소 명칭
                  </label>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="예: 반포자이 한강공인중개사사무소"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                    중개등록번호
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="예: 11650-2024-00123"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-800 text-xs"
                  />
                </div>
              </div>
            )}

            {/* 학원 및 식당 전환 시 상호 정보 입력 */}
            {targetRole === "business" && (
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 space-y-2 text-xs">
                <div className="font-extrabold text-emerald-900 dark:text-emerald-200">
                  🏫🍽️ 학원·식당 로컬 파트너 정보
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      업종
                    </label>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-xs"
                    >
                      <option value="학원/교육">📚 학원/교육</option>
                      <option value="식당/카페">🍽️ 식당/카페</option>
                      <option value="병원/약국">🏥 병원/약국</option>
                      <option value="생활/편의">🛍️ 생활/편의</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                      상호명
                    </label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="예: 일등수학학원"
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 변경 실행 버튼 */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleUpgradeRole(targetRole)}
                disabled={loading || targetRole === currentUser.role}
                className={`w-full py-3.5 rounded-2xl font-black text-sm transition-all cursor-pointer shadow-md ${
                  targetRole === currentUser.role
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/25"
                }`}
              >
                {loading
                  ? "등급 변경 처리 중..."
                  : targetRole === currentUser.role
                  ? "현재 이미 이용 중인 등급입니다"
                  : `[${getRoleBadgeName(targetRole)}]으로 등급 즉시 변경하기`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
