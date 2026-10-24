export type UserRole = "general" | "premium" | "realtor" | "business";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  provider: "email" | "kakao" | "naver" | "google";
  avatar?: string;
  phone?: string;
  createdAt: string;

  // 유료 회원 정보
  subscription?: {
    plan: "monthly" | "yearly";
    expiresAt: string;
    autoRenew: boolean;
  };

  // 공인중개사 회원 전용 정보
  realtorInfo?: {
    agencyName: string;
    licenseNumber: string;
    contact: string;
    targetRegion: string;
    isVerified: boolean;
  };

  // 학원 및 식당/상가 회원 전용 정보
  businessInfo?: {
    category: "학원/교육" | "식당/카페" | "병원/약국" | "생활/편의";
    businessName: string;
    businessNumber: string;
    location: string;
    phone: string;
    isVerified: boolean;
  };
}

export interface PricingPlan {
  id: UserRole;
  name: string;
  badge?: string;
  subtitle: string;
  monthlyPrice: number;
  yearlyPricePerMonth: number;
  yearlyTotal: number;
  ctaText: string;
  isPopular?: boolean;
  highlightColor?: string;
  targetUser: string;
  features: Array<{
    text: string;
    highlight?: boolean;
    included: boolean;
  }>;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "general",
    name: "일반 회원",
    subtitle: "전국 실거래가와 기본 부동산 정보를 자유롭게 탐색",
    monthlyPrice: 0,
    yearlyPricePerMonth: 0,
    yearlyTotal: 0,
    ctaText: "무료로 시작하기",
    targetUser: "부동산 실거래 및 청약 정보를 찾는 일반 개인",
    features: [
      { text: "전국 아파트 실거래가 및 시세 기본 조회", included: true },
      { text: "한국부동산원 청약 캘린더 및 일정 열람", included: true },
      { text: "재개발·정비사업 구역 현황 및 단계 확인", included: true },
      { text: "지역 명소 및 주변 시설 정보 검색", included: true },
      { text: "실시간 입주민 커뮤니티 글 열람 및 댓글 작성", included: true },
      { text: "과거 20개년 전체 거래 내역 정밀 분석", included: false },
      { text: "재개발 예상 분담금/비례율 AI 시뮬레이터", included: false },
      { text: "급매물 & 실거래가 실시간 카톡 알림", included: false },
    ],
  },
  {
    id: "premium",
    name: "유료 회원 (PRO)",
    badge: "가장 인기 있는 🔥",
    isPopular: true,
    subtitle: "성공적인 내집마련과 부동산 투자를 위한 프리미엄 AI 분석",
    monthlyPrice: 19900,
    yearlyPricePerMonth: 15900,
    yearlyTotal: 190800,
    ctaText: "지금 구독하기",
    highlightColor: "#e11d48",
    targetUser: "적극적인 실거주 갈아타기 & 정비사업 투자자",
    features: [
      { text: "과거 20개년 전체 거래 내역 및 신저/신고가 정밀 분석", highlight: true, included: true },
      { text: "재개발·재건축 단지별 예상 분담금 및 비례율 AI 계산기 무제한", highlight: true, included: true },
      { text: "청약 가점 커트라인 예측 및 분양가 적정성 AI 리포트", highlight: true, included: true },
      { text: "학군·학원가·교통 역세권 심층 입지 분석 리포트 다운로드", included: true },
      { text: "관심 구역 실거래 및 급매물 실시간 카카오톡 알림 (무제한)", highlight: true, included: true },
      { text: "전문가 추천 임장 루트 및 정비구역 분석 브리핑", included: true },
      { text: "모든 일반 회원 기능 포함", included: true },
    ],
  },
  {
    id: "realtor",
    name: "공인중개사 회원",
    badge: "전문 파트너 🏢",
    subtitle: "단지 대표 공인중개사 인증과 검증된 매수·매도 고객 다이렉트 매칭",
    monthlyPrice: 49000,
    yearlyPricePerMonth: 39000,
    yearlyTotal: 468000,
    ctaText: "중개사 회원 가입",
    highlightColor: "#3b82f6",
    targetUser: "단지 내 독점 영업 및 매물 홍보가 필요한 개업공인중개사",
    features: [
      { text: "해당 단지·지역 '공식 인증 중개사' 프로필 및 뱃지 부여", highlight: true, included: true },
      { text: "아파트·재개발 상세페이지 내 대표 중개사무소 우선 노출", highlight: true, included: true },
      { text: "실매물 등록 무제한 & 허위매물 제로 공식 안심 마크", highlight: true, included: true },
      { text: "입주민 및 잠재 매수자와의 1:1 안심 채팅 상담 연결", highlight: true, included: true },
      { text: "지역 실거래가 주간 동향 및 시장 리포트 공인중개사용 배포", included: true },
      { text: "중개사무소 전용 매물 관리 및 고객 DB 대시보드", included: true },
      { text: "유료 회원(PRO) AI 분석 데이터 전체 열람 권한 포함", included: true },
    ],
  },
  {
    id: "business",
    name: "학원 및 식당 회원",
    badge: "로컬 파트너 🏫🍽️",
    subtitle: "아파트 입주민 대상 학원가·동네 맛집·상권 직접 브랜딩 및 홍보",
    monthlyPrice: 29000,
    yearlyPricePerMonth: 23000,
    yearlyTotal: 276000,
    ctaText: "로컬 파트너 가입",
    highlightColor: "#10b981",
    targetUser: "아파트 배후 세대 고객 유치가 필수적인 원장님 & 외식업 대표님",
    features: [
      { text: "단지 상세페이지 내 '우리동네 대표 학원·맛집' 탭 최우선 노출", highlight: true, included: true },
      { text: "지역정보 및 지도 내 브랜드 핀(원장 약력, 커리큘럼, 메뉴판) 등록", highlight: true, included: true },
      { text: "입주민 대상 특별 할인 쿠폰 & 체험 프로모션 이벤트 발행", highlight: true, included: true },
      { text: "아파트 커뮤니티 내 '동네 인증 상점' 공식 뱃지 부여", included: true },
      { text: "월간 입주민 유입 통계 및 페이지 조회 분석 대시보드", included: true },
      { text: "신규 입주 단지 타겟 맞춤 오픈 이벤트 배너 지원", included: true },
      { text: "지역 주민 Q&A 및 커뮤니티 소통 채널 제공", included: true },
    ],
  },
];
