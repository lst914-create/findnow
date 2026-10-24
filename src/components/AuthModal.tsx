"use client";

import { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { name: string; email: string; provider: string }) => void;
  title?: string;
  subtitle?: string;
}

export default function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  title = "3초 간편회원가입",
  subtitle = "회원가입 후 정비구역 전체 실거래가와 실시간 알림을 받아보세요.",
}: AuthModalProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSocialLogin = (provider: string, name: string) => {
    setLoadingProvider(provider);
    setTimeout(() => {
      setLoadingProvider(null);
      onSuccess({
        name,
        email: `${provider}_user@example.com`,
        provider,
      });
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-100 animate-in zoom-in-95 duration-200">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full absolute top-4 right-4 transition-colors"
          title="닫기"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 상단 헤더 */}
        <div className="text-center mt-2 mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl shadow-2xs">
            🔍
          </div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 혜택 뱃지 */}
        <div className="bg-slate-50 rounded-2xl p-3 mb-6 border border-slate-100 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>과거 20년간 전체 실거래 내역 열람</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>관심 구역 실시간 실거래가 카톡 알림</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 font-medium">
            <span className="text-emerald-500 font-bold">✓</span>
            <span>구역별 예상 분담금 및 비례율 시뮬레이션</span>
          </div>
        </div>

        {/* 간편 로그인/가입 버튼 리스트 */}
        <div className="space-y-2.5">
          {/* 카카오 */}
          <button
            onClick={() => handleSocialLogin("kakao", "카카오 회원")}
            disabled={!!loadingProvider}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-[#FEE500] text-[#191919] hover:bg-[#FADA0A] active:scale-[0.99] transition-all shadow-xs"
          >
            {loadingProvider === "kakao" ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-800 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 3c-5.523 0-10 3.582-10 8 0 2.828 1.838 5.309 4.62 6.702l-1.18 4.364c-.105.388.337.697.666.467l5.148-3.418c.245.02.493.033.746.033 5.523 0 10-3.582 10-8s-4.477-8-10-8z" />
              </svg>
            )}
            <span>카카오로 3초 만에 시작하기</span>
          </button>

          {/* 네이버 */}
          <button
            onClick={() => handleSocialLogin("naver", "네이버 회원")}
            disabled={!!loadingProvider}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-[#03C75A] text-white hover:bg-[#02b351] active:scale-[0.99] transition-all shadow-xs"
          >
            {loadingProvider === "naver" ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span className="font-black text-sm leading-none">N</span>
            )}
            <span>네이버로 시작하기</span>
          </button>

          {/* 구글 */}
          <button
            onClick={() => handleSocialLogin("google", "구글 회원")}
            disabled={!!loadingProvider}
            className="w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 active:scale-[0.99] transition-all shadow-xs"
          >
            {loadingProvider === "google" ? (
              <span className="inline-block w-4 h-4 border-2 border-slate-700 border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Google 계정으로 시작하기</span>
          </button>
        </div>

        {/* 약관 안내 */}
        <p className="text-[10px] text-slate-400 text-center mt-5 leading-relaxed">
          가입 시 찾아줘의 <span className="underline cursor-pointer">서비스 이용약관</span> 및{" "}
          <span className="underline cursor-pointer">개인정보 처리방침</span>에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
