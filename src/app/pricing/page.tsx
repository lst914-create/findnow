"use client";

import { useState } from "react";
import Link from "next/link";
import { UserRole } from "@/types/auth";
import PricingSection from "@/components/PricingSection";
import UnifiedAuthModal from "@/components/UnifiedAuthModal";

export default function PricingPage() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("premium");

  const handleSelectPlan = (role: UserRole) => {
    setSelectedRole(role);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#090b0e] text-white font-sans flex flex-col">
      {/* GNB Header */}
      <header className="h-16 bg-[#0c0e12]/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl group-hover:scale-110 transition-transform">🔍</span>
              <span className="text-xl font-black bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent tracking-tight">
                찾아줘
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-semibold text-slate-300">
              <Link href="/search" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
                🏢 아파트 찾기
              </Link>
              <Link href="/redevelopment" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
                🔨 재개발
              </Link>
              <Link href="/subscriptions" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
                🏗️ 분양·청약
              </Link>
              <Link href="/regional" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
                📍 지역정보
              </Link>
              <Link href="/community" className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-800 transition-colors">
                💬 커뮤니티
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSelectedRole("general");
                setAuthModalOpen(true);
              }}
              className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              로그인
            </button>
            <button
              onClick={() => {
                setSelectedRole("premium");
                setAuthModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-all shadow-sm cursor-pointer"
            >
              회원가입
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        <PricingSection onSelectPlan={handleSelectPlan} />
      </main>

      {/* Auth Modal */}
      <UnifiedAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode="signup"
        initialRole={selectedRole}
      />
    </div>
  );
}
