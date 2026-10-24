"use client";

import { UserProfile, UserRole } from "@/types/auth";

const STORAGE_KEY = "chajwo_auth_user_v1";

export const DEMO_ACCOUNTS: Record<UserRole, UserProfile> = {
  general: {
    id: "demo_general_01",
    email: "user@chajwo.com",
    name: "홍길동",
    role: "general",
    provider: "email",
    createdAt: "2026-01-15",
  },
  premium: {
    id: "demo_premium_01",
    email: "pro_investor@chajwo.com",
    name: "김프로",
    role: "premium",
    provider: "kakao",
    createdAt: "2026-02-01",
    subscription: {
      plan: "yearly",
      expiresAt: "2027-02-01",
      autoRenew: true,
    },
  },
  realtor: {
    id: "demo_realtor_01",
    email: "realtor@hangang.co.kr",
    name: "박대표 (한강공인)",
    role: "realtor",
    provider: "naver",
    createdAt: "2025-11-20",
    realtorInfo: {
      agencyName: "한강자이 공인중개사사무소",
      licenseNumber: "11650-2023-00124",
      contact: "02-555-1234",
      targetRegion: "서울 서초구 반포동",
      isVerified: true,
    },
  },
  business: {
    id: "demo_business_01",
    email: "academy@mathmaster.kr",
    name: "이원장 (매쓰마스터)",
    role: "business",
    provider: "google",
    createdAt: "2026-03-10",
    businessInfo: {
      category: "학원/교육",
      businessName: "매쓰마스터 수학학원 반포본원",
      businessNumber: "214-88-99881",
      location: "서울 서초구 신반포로 15",
      phone: "02-532-9900",
      isVerified: true,
    },
  },
};

export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredUser(user: UserProfile | null) {
  if (typeof window === "undefined") return;
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    // Storage event for reactive UI
    window.dispatchEvent(new Event("chajwo-auth-change"));
  } catch (e) {
    console.error("Failed to save auth state:", e);
  }
}
