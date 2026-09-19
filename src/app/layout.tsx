import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "찾아줘 — 내가 찾는 부동산 정보, 한 곳에서",
  description:
    "서울·경기 아파트 검색, 실거래가 비교, 재개발·분양 정보까지. 조건을 입력하면 찾아줘가 바로 찾아드립니다.",
  keywords: [
    "부동산",
    "아파트 검색",
    "실거래가",
    "재개발",
    "분양",
    "서울 아파트",
    "경기 아파트",
    "찾아줘",
  ],
  openGraph: {
    title: "찾아줘 — 내가 찾는 부동산 정보, 한 곳에서",
    description:
      "서울·경기 아파트 검색, 실거래가 비교, 재개발·분양 정보까지. 조건을 입력하면 찾아줘가 바로 찾아드립니다.",
    type: "website",
    locale: "ko_KR",
    siteName: "찾아줘",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
