import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://findnow-five.vercel.app"),
  title: {
    default: "찾아줘 — 전국 아파트 실거래가·재개발 지도·청약 캘린더",
    template: "%s | 찾아줘",
  },
  description:
    "전국 22,000+ 아파트 실거래가 비교 및 전월세 시세, 전국 재개발 구역 단계별 분석, 청약홈 분양 캘린더를 한 곳에서 직관적으로 찾아보세요.",
  keywords: [
    "부동산",
    "아파트 실거래가",
    "아파트 시세",
    "재개발 구역",
    "정비사업",
    "청약 캘린더",
    "분양 정보",
    "부동산 계산기",
    "초품아 아파트",
    "찾아줘",
  ],
  authors: [{ name: "찾아줘 (FindNow)" }],
  openGraph: {
    title: "찾아줘 — 전국 아파트 실거래가·재개발 지도·청약 캘린더",
    description:
      "전국 22,000+ 아파트 실거래가 비교 및 전월세 시세, 전국 재개발 구역 단계별 분석, 청약홈 분양 캘린더를 한 곳에서 확인하세요.",
    url: "https://findnow-five.vercel.app",
    siteName: "찾아줘",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "찾아줘 — 내가 찾는 부동산 정보, 한 곳에서",
    description:
      "전국 아파트 실거래가 비교, 전국 재개발 지도, 분양 캘린더를 한눈에.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "찾아줘",
  },
  formatDetection: {
    telephone: false,
  },
};

import MobileBottomNav from "@/components/MobileBottomNav";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans pb-16 md:pb-0">
        <main className="flex-1 flex flex-col">{children}</main>
        <MobileBottomNav />
      </body>
    </html>
  );
}

