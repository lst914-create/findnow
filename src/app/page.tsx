"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { APARTMENTS_DATA, Apartment, getApartmentHighlightFeature } from "@/lib/apartments";
import { executeUnifiedSearch, UnifiedSearchOutput } from "@/lib/unifiedSearch";
import UnifiedSearchResultsView from "@/components/UnifiedSearchResultsView";
import UnifiedAuthModal from "@/components/UnifiedAuthModal";
import MyProfileModal from "@/components/MyProfileModal";
import { getStoredUser, saveStoredUser } from "@/lib/authStore";
import { UserProfile, UserRole } from "@/types/auth";

const AptMap = dynamic(() => import("@/components/AptMap"), { ssr: false });

const INITIAL_MOCK_APARTMENTS: Apartment[] = APARTMENTS_DATA;

const QUICK_TAGS = [
  { label: "전체", icon: "🏢", query: "" },
  { label: "서울", icon: "🏙️", query: "서울" },
  { label: "경기", icon: "🏘️", query: "경기" },
  { label: "인천", icon: "🌊", query: "인천" },
  { label: "부산", icon: "🏖️", query: "부산" },
  { label: "대구", icon: "🌳", query: "대구" },
  { label: "대전/세종", icon: "🏛️", query: "대전 세종" },
  { label: "한강변", icon: "🌊", query: "한강" },
  { label: "역세권", icon: "🚇", query: "역세권" },
  { label: "신축", icon: "✨", query: "신축" },
  { label: "대단지", icon: "🏗️", query: "대단지" },
  { label: "초품아", icon: "🏫", query: "초품아" },
];

const NAV_ITEMS = [
  { label: "아파트 찾기", href: "/search", icon: "🏢" },
  { label: "재개발", href: "/redevelopment", icon: "🔨" },
  { label: "분양·청약", href: "/subscriptions", icon: "📅" },
  { label: "지역정보", href: "/regional", icon: "📍" },
  { label: "커뮤니티", href: "/community", icon: "💬" },
  { label: "요금제 안내", href: "/pricing", icon: "💎" },
  { label: "뉴스&정보", href: "#", icon: "📰" },
];

import { resolveStationOrPlace, getDistanceMeters, GeoLocation, KNOWN_STATIONS } from "@/lib/searchGeoHelper";

const STOP_WORDS = new Set([
  "아파트", "단지", "가장", "가까운", "근처", "주변", "어디", "정보", "시세",
  "추천", "찾아줘", "있는", "원해", "좋은", "살기", "입구", "인근", "도보",
  "역에서", "역이랑", "역근처", "역주변", "에서", "으로", "이랑", "하고", "과", "와",
  // 거리 / 시간 / 범위 불용어 (오탐 원천 차단)
  "거리", "거리의", "분", "10분", "5분", "3분", "7분", "15분", "20분",
  "이내", "이하", "미만", "이상", "초과", "밑으로", "위로", "안으로", "정도",
  "대", "원", "억"
]);

interface ParsedSearchQuery {
  keywords: string[];
  stationName?: string;
  maxWalkMinutes?: number;
  isNearSearch: boolean;
  isHangangSearch: boolean;
  isStationNearSearch: boolean;
  tradeType?: "rent" | "sale";
  targetPriceManwon?: number;
  priceMinManwon?: number;
  priceMaxManwon?: number;
  isPriceUpperBound?: boolean;
  isPriceLowerBound?: boolean;
}

// 한국어 조사 및 불용어 제거 헬퍼
function cleanKoreanParticle(word: string): string {
  return word.replace(/(에서가장|에서|으로|이랑|하고|에게|부터|까지|에는|에|이|가|은|는|을|를|의|로|인)$/, "");
}

function extractSearchKeywords(rawQuery: string): ParsedSearchQuery {
  const trimmed = rawQuery.trim();
  if (!trimmed) {
    return {
      keywords: [],
      isNearSearch: false,
      isHangangSearch: false,
      isStationNearSearch: false,
    };
  }

  // 특수 의도 탐지
  const isHangangSearch = /(한강|리버|리버뷰|수변|강변|강조망)/i.test(trimmed);
  const isStationNearSearch = /(역세권|지하철역|전철역|역에서|역근처|역가까운)/i.test(trimmed);
  const isNearSearch = /(가장|가까운|근처|주변|인근|도보|앞|옆)/i.test(trimmed);

  // 1. 거래 형태 감지 (전세, 매매, 월세)
  let tradeType: "rent" | "sale" | undefined;
  if (/전세/i.test(trimmed)) tradeType = "rent";
  else if (/(매매|매매가)/i.test(trimmed)) tradeType = "sale";

  // 2. 가격 감지 (이내/이하/이상/대 등 정밀 파싱)
  let isPriceUpperBound = false;
  let isPriceLowerBound = false;
  let priceMinManwon: number | undefined;
  let priceMaxManwon: number | undefined;
  let targetPriceManwon: number | undefined;

  // "8억 이내", "8억 이하", "8억 미만", "8억 밑으로", "8억 안으로"
  const upperMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*억\s*(?:(\d+)\s*천)?\s*(?:원)?\s*(이내|이하|미만|안으로|밑으로)/i);
  if (upperMatch) {
    const uk = parseFloat(upperMatch[1]);
    const cheon = upperMatch[2] ? parseInt(upperMatch[2], 10) : 0;
    priceMaxManwon = Math.round(uk * 10000 + cheon * 1000);
    isPriceUpperBound = true;
    targetPriceManwon = priceMaxManwon;
  }

  // "8억 이상", "8억 초과", "8억 위로", "8억 넘는"
  const lowerMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*억\s*(?:(\d+)\s*천)?\s*(?:원)?\s*(이상|초과|위로|넘는)/i);
  if (lowerMatch) {
    const uk = parseFloat(lowerMatch[1]);
    const cheon = lowerMatch[2] ? parseInt(lowerMatch[2], 10) : 0;
    priceMinManwon = Math.round(uk * 10000 + cheon * 1000);
    isPriceLowerBound = true;
    targetPriceManwon = priceMinManwon;
  }

  if (!upperMatch && !lowerMatch) {
    const ukMatch = trimmed.match(/(\d+(?:\.\d+)?)\s*억\s*(?:(\d+)\s*천)?\s*(대|데|원)?/i);
    if (ukMatch) {
      const uk = parseFloat(ukMatch[1]);
      const cheon = ukMatch[2] ? parseInt(ukMatch[2], 10) : 0;
      targetPriceManwon = Math.round(uk * 10000 + cheon * 1000);

      if (ukMatch[3] === "대" || ukMatch[3] === "데") {
        priceMinManwon = Math.max(0, targetPriceManwon - 15000);
        priceMaxManwon = targetPriceManwon + 15000;
      } else {
        priceMinManwon = Math.max(0, targetPriceManwon - 10000);
        priceMaxManwon = targetPriceManwon + 10000;
      }
    }
  }

  // 3. 도보 시간 감지 ("도보 10분", "10분 거리", "초역세권")
  let maxWalkMinutes: number | undefined;
  const walkMatch = trimmed.match(/(?:도보\s*)?(\d+)\s*분(?:\s*거리|\s*이내|\s*안|\s*소요)?/i);
  if (walkMatch) {
    maxWalkMinutes = parseInt(walkMatch[1], 10);
  } else if (/초역세권/i.test(trimmed)) {
    maxWalkMinutes = 4;
  } else if (/(역세권|역근처|역인근)/i.test(trimmed)) {
    maxWalkMinutes = 8;
  }

  // 4. 역 이름 감지
  let stationName: string | undefined;
  const stationMatch = trimmed.match(/([가-힣]{2,8}역)/);
  if (stationMatch) {
    stationName = stationMatch[1];
  } else {
    for (const st of Object.keys(KNOWN_STATIONS)) {
      if (trimmed.includes(st)) {
        stationName = st.endsWith("역") ? st : `${st}역`;
        break;
      }
    }
  }

  // 5. 토큰 정제 (오탐 유발 단어 완벽 제거)
  const cleaned = trimmed
    .replace(/(\d+(?:\.\d+)?)\s*억\s*(?:(\d+)\s*천)?\s*(?:이내|이하|미만|이상|초과|안으로|밑으로|위로|대|데|원)?/gi, " ")
    .replace(/(?:도보\s*)?\d+\s*분(?:\s*거리|\s*이내|\s*안|\s*소요)?/gi, " ")
    .replace(/(도보|거리|이내|이하|이상|미만|초과|밑으로|위로|안으로|분)/gi, " ")
    .replace(/(전세|매매|월세|매매가)/gi, " ")
    .replace(/(역이랑|역에서|역근처|역주변|역인근)/gi, "역 ")
    .replace(/(가장|가까운|아파트|단지|추천|찾아줘|있는|원해|주변|어디|정보|시세|살기|좋은)/gi, " ");

  const rawTokens = trimmed.split(/\s+/);
  const cleanTokens = cleaned.split(/\s+/);

  const candidateKeywords = new Set<string>();

  [...rawTokens, ...cleanTokens].forEach((t) => {
    const word = t.trim();
    if (!word) return;

    // 조사 제거 적용
    const stripped = cleanKoreanParticle(word);
    [word, stripped].forEach((w) => {
      if (
        w.length >= 2 &&
        !STOP_WORDS.has(w) &&
        !/^(전세|매매|월세|억|억대|억데|아파트|단지|거리|도보|이내|이하|이상)$/.test(w) &&
        !/^\d+억/.test(w) &&
        !/^\d+분/.test(w)
      ) {
        candidateKeywords.add(w);
      }
    });

    if (word.endsWith("역") && word.length > 2) {
      candidateKeywords.add(word.slice(0, -1));
    }
  });

  return {
    keywords: Array.from(candidateKeywords),
    stationName,
    maxWalkMinutes,
    isNearSearch,
    isHangangSearch,
    isStationNearSearch,
    tradeType,
    targetPriceManwon,
    priceMinManwon,
    priceMaxManwon,
    isPriceUpperBound,
    isPriceLowerBound,
  };
}

function scoreApartment(apt: Apartment, queryInfo: ParsedSearchQuery): number {
  const { keywords, tradeType, priceMinManwon, priceMaxManwon, isPriceUpperBound, isPriceLowerBound, isHangangSearch } = queryInfo;

  // 1. 가격 상한/하한 엄격 필터링 (8억 이내인데 11억, 21억 아파트가 노출되는 현상 원천 차단)
  if (isPriceUpperBound && priceMaxManwon) {
    if (tradeType === "rent") {
      const rentMin = apt.rent_min || Math.round(apt.price_min * 0.55);
      if (rentMin > priceMaxManwon) return 0;
    } else {
      if (apt.price_min > priceMaxManwon) return 0;
    }
  }

  if (isPriceLowerBound && priceMinManwon) {
    if (tradeType === "rent") {
      const rentMax = apt.rent_max || Math.round(apt.price_max * 0.6);
      if (rentMax < priceMinManwon) return 0;
    } else {
      if (apt.price_max < priceMinManwon) return 0;
    }
  }

  let score = 0;

  if (keywords.length > 0) {
    let hasLocationOrNameMatch = false;

    for (const kw of keywords) {
      const lkw = kw.toLowerCase();

      // 이름 매칭
      if (apt.name.toLowerCase().includes(lkw)) {
        score += 35;
        hasLocationOrNameMatch = true;
      }
      // 세부 동/읍/면 (예: 다산동, 대치동 등)
      if (apt.district.toLowerCase().includes(lkw)) {
        score += 40;
        hasLocationOrNameMatch = true;
      }
      // 시/도/군 (예: 남양주시, 경기)
      if (apt.region.toLowerCase().includes(lkw)) {
        score += 25;
        hasLocationOrNameMatch = true;
      }
      // 지하철역
      if (apt.station && apt.station.toLowerCase().includes(lkw)) {
        score += 35;
        hasLocationOrNameMatch = true;
      }
      // 태그 매칭
      if (apt.tags?.some((t) => t.toLowerCase().includes(lkw))) {
        score += 20;
        hasLocationOrNameMatch = true;
      }
      // 설명 매칭
      if (apt.description?.toLowerCase().includes(lkw)) {
        score += 15;
        hasLocationOrNameMatch = true;
      }
    }

    if (!hasLocationOrNameMatch) return 0;
  } else {
    score = 10;
  }

  // 한강 / 수변 특화 쿼리 시 가중치
  if (isHangangSearch) {
    const hasHangangTag = apt.tags?.some((t) => /한강|리버|수변|강변/.test(t));
    const hasHangangDesc = /한강|리버|수변|강변/.test(apt.description || "");

    if (apt.hangang_minutes !== undefined || apt.is_hangang_view) {
      score += 150;
      if (apt.hangang_minutes) {
        score += Math.max(0, (10 - apt.hangang_minutes) * 15);
      }
      if (apt.is_hangang_view) {
        score += 50;
      }
    } else if (hasHangangTag || hasHangangDesc) {
      score += 80;
    } else {
      score -= 60;
    }
  }

  // 일반 가격 매칭 가점
  if (priceMinManwon !== undefined && priceMaxManwon !== undefined && !isPriceUpperBound && !isPriceLowerBound) {
    if (tradeType === "rent") {
      const rentMin = apt.rent_min || apt.price_min * 0.55;
      const rentMax = apt.rent_max || apt.price_max * 0.6;
      if (rentMin <= priceMaxManwon && rentMax >= priceMinManwon) score += 35;
    } else if (tradeType === "sale") {
      if (apt.price_min <= priceMaxManwon && apt.price_max >= priceMinManwon) score += 35;
    } else {
      const rentMin = apt.rent_min || apt.price_min * 0.55;
      const rentMax = apt.rent_max || apt.price_max * 0.6;
      if (
        (apt.price_min <= priceMaxManwon && apt.price_max >= priceMinManwon) ||
        (rentMin <= priceMaxManwon && rentMax >= priceMinManwon)
      ) {
        score += 25;
      }
    }
  }

  return Math.max(0, score);
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [apartments, setApartments] = useState<Apartment[]>(INITIAL_MOCK_APARTMENTS);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [visibleCount, setVisibleCount] = useState(24);
  const [mapRegionSummary, setMapRegionSummary] = useState<string>("수도권 주요 지역");
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [isMapDriven, setIsMapDriven] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // useRef로 동기 차단 (state는 async이므로 await 후에도 콜백이 이전 값 읽는 race condition 방지)
  const isMapDrivenRef = useRef<boolean>(true);
  const [searchResultStats, setSearchResultStats] = useState<null | {
    count: number;
    avgPrice: number;
    avgRent: number;
    minPrice: number;
    maxPrice: number;
    avgJeonseRatio: number;
    topRegion: string;
    avgHousehold: number;
  }>(null);
  const [lastSearchLabel, setLastSearchLabel] = useState<string>("");
  const [unifiedResults, setUnifiedResults] = useState<UnifiedSearchOutput | null>(null);

  // 인증 및 요금제 모달 상태
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup" | "pricing">("login");
  const [authInitialRole, setAuthInitialRole] = useState<UserRole>("general");
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  useEffect(() => {
    setCurrentUser(getStoredUser());
    const handleAuthChange = () => setCurrentUser(getStoredUser());
    window.addEventListener("chajwo-auth-change", handleAuthChange);
    return () => window.removeEventListener("chajwo-auth-change", handleAuthChange);
  }, []);

  const openAuth = (authMode: "login" | "signup" | "pricing", role: UserRole = "general") => {
    setAuthModalMode(authMode);
    setAuthInitialRole(role);
    setAuthModalOpen(true);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    saveStoredUser(null);
  };

  // 지도 이동 시 해당 뷰포트 내 아파트 단지 목록으로 하단 리스트 실시간 동기화
  // isMapDrivenRef (동기 ref)를 기반으로 차단 → 검색 중/후 덮어쓰기 완전 차단
  const handleViewportApartmentsChange = (viewportApts: Apartment[], regionSummary?: string) => {
    if (regionSummary) setMapRegionSummary(regionSummary);
    if (isMapDrivenRef.current && viewportApts.length > 0) {
      setApartments(viewportApts);
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToResults = () => {
    setTimeout(() => {
      const target =
        document.getElementById("unified-results-section") ||
        document.getElementById("map-section") ||
        document.getElementById("apt-list");
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 150);
  };

  const fetchApartments = async (keyword = searchQuery, tag = selectedTag) => {
    setLoading(true);
    setVisibleCount(24);
    // 지도 연동 즉시 차단 (ref 동기 업데이트 → await 완료 후에도 지도 콜백이 덮어쓰기 불가)
    isMapDrivenRef.current = false;
    setIsMapDriven(false);
    const rawTrim = keyword.trim();

    // 🌟 올인원 통합 검색 수행 (아파트, 재개발, 청약, 지역명소 종합 탐색)
    let unifiedRes: UnifiedSearchOutput | null = null;
    if (rawTrim) {
      try {
        unifiedRes = await executeUnifiedSearch(rawTrim);
        setUnifiedResults(unifiedRes);
      } catch (err) {
        console.error("Unified search execution error:", err);
      }
    } else {
      setUnifiedResults(null);
    }

    const queryInfo = extractSearchKeywords(rawTrim);
    const { keywords, isNearSearch } = queryInfo;

    let filtered = INITIAL_MOCK_APARTMENTS;
    let targetCenter: { lat: number; lng: number } | null = null;

    if (rawTrim) {
      // 통합 검색에서 아파트 결과가 산출되었을 경우 해당 결과 우선 적용
      if (unifiedRes && unifiedRes.apartments.length > 0) {
        filtered = unifiedRes.apartments;
        const firstWithCoords = filtered.find((a) => a.lat && a.lng);
        if (firstWithCoords) {
          targetCenter = { lat: firstWithCoords.lat, lng: firstWithCoords.lng };
        }
      } else {
      // 1. 지하철역 및 주요 거점 위치 해석 (도농역, 강남역, 판교역 등)
      const stationLoc = await resolveStationOrPlace(rawTrim);

      if (stationLoc) {
        targetCenter = { lat: stationLoc.lat, lng: stationLoc.lng };
        // 도보 분수 지정 여부 (기본값: 도보 10분, 초역세권: 4분, 역세권: 8분)
        const walkMinLimit = queryInfo.maxWalkMinutes || 10;
        const maxAllowedMeters = walkMinLimit * 80 + 150; // 여유 오차 150m 허용 (10분 기준 950m)

        const stationMatched: (Apartment & { distMeters: number })[] = [];
        for (const apt of INITIAL_MOCK_APARTMENTS) {
          if (!apt.lat || !apt.lng) continue;
          const distM = getDistanceMeters(stationLoc.lat, stationLoc.lng, apt.lat, apt.lng);
          const walkMin = Math.round(distM / 80);

          // 1) 역 도보 반경 필터링
          if (distM > maxAllowedMeters) continue;

          // 2) 가격 상한 필터링 ("8억 이내", "8억 이하", "8억 미만")
          if (queryInfo.isPriceUpperBound && queryInfo.priceMaxManwon) {
            if (queryInfo.tradeType === "rent") {
              const rentMin = apt.rent_min || Math.round(apt.price_min * 0.55);
              if (rentMin > queryInfo.priceMaxManwon) continue;
            } else {
              if (apt.price_min > queryInfo.priceMaxManwon) continue;
            }
          }

          // 3) 가격 하한 필터링 ("8억 이상", "8억 초과")
          if (queryInfo.isPriceLowerBound && queryInfo.priceMinManwon) {
            if (queryInfo.tradeType === "rent") {
              const rentMax = apt.rent_max || Math.round(apt.price_max * 0.6);
              if (rentMax < queryInfo.priceMinManwon) continue;
            } else {
              if (apt.price_max < queryInfo.priceMinManwon) continue;
            }
          }

          stationMatched.push({
            ...apt,
            walk_minutes: walkMin,
            station: stationLoc.name,
            station_dist: `도보 ${walkMin}분 (${distM}m)`,
            distMeters: distM,
          });
        }

        // 역에서 가장 가까운 도보 거리 순서로 정렬
        stationMatched.sort((a, b) => a.distMeters - b.distMeters);
        // ★ 역 검색이 확정된 경우, 결과가 0개여도 폴백 없이 그대로 표시 (엉뚱한 결과 차단)
        filtered = stationMatched;
      } else if (keywords.length > 0 || queryInfo.targetPriceManwon !== undefined) {
        // 2. 일반 자연어 키워드/지역/단지명 스코어링 검색 (가격 조건 엄격 적용)
        const scored = INITIAL_MOCK_APARTMENTS
          .map((apt) => ({ apt, score: scoreApartment(apt, queryInfo) }))
          .filter((item) => item.score > 0);

        scored.sort((a, b) => {
          if (queryInfo.isHangangSearch) {
            const aRiver = a.apt.hangang_minutes ?? (a.apt.tags?.some((t) => t.includes("한강")) ? 7 : 99);
            const bRiver = b.apt.hangang_minutes ?? (b.apt.tags?.some((t) => t.includes("한강")) ? 7 : 99);
            if (aRiver !== bRiver) return aRiver - bRiver;
          }

          if (b.score !== a.score) return b.score - a.score;

          if (queryInfo.isStationNearSearch) {
            return (a.apt.walk_minutes || 99) - (b.apt.walk_minutes || 99);
          }

          if (queryInfo.isNearSearch && !queryInfo.isHangangSearch) {
            return (a.apt.walk_minutes || 99) - (b.apt.walk_minutes || 99);
          }
          return 0;
        });

        filtered = scored.map((item) => item.apt);
      }
      }
    }

    if (tag && tag !== "전체") {
      if (tag === "서울" || tag === "경기") {
        filtered = filtered.filter((apt) => apt.region.includes(tag));
      } else if (tag === "한강" || tag === "한강변") {
        filtered = filtered.filter(
          (apt) => apt.hangang_dist || apt.is_hangang_view || apt.tags?.some((t) => /한강|리버|수변|강변/.test(t))
        );
      } else if (tag === "역세권") {
        filtered = filtered.filter(
          (apt) => apt.tags?.includes("역세권") || (apt.walk_minutes && apt.walk_minutes <= 7) || apt.station
        );
      } else if (tag === "신축") {
        filtered = filtered.filter((apt) => apt.built_year >= 2019 || apt.tags?.includes("신축"));
      } else if (tag === "대단지") {
        filtered = filtered.filter((apt) => apt.household_count >= 1000 || apt.tags?.includes("대단지"));
      } else if (tag === "초품아") {
        filtered = filtered.filter((apt) => apt.tags?.includes("초품아") || (apt.schools && apt.schools.length > 0));
      } else {
        filtered = filtered.filter((apt) => apt.tags?.includes(tag));
      }
    }

    setApartments(filtered);

    // 검색 결과 중심 좌표 연동 (지하철역이 없더라도 검색된 아파트들의 중심 위치로 지도 이동)
    if (!targetCenter && filtered.length > 0) {
      const validApts = filtered.filter((a) => a.lat && a.lng);
      if (validApts.length > 0) {
        const sample = validApts.slice(0, Math.min(6, validApts.length));
        const avgLat = sample.reduce((sum, a) => sum + a.lat, 0) / sample.length;
        const avgLng = sample.reduce((sum, a) => sum + a.lng, 0) / sample.length;
        targetCenter = { lat: avgLat, lng: avgLng };
      }
    }

    if (targetCenter) {
      setMapCenter(targetCenter);
    }

    // 검색 결과 통계 계산
    if (filtered.length > 0) {
      const total = filtered.length;
      const avgPrice = Math.round(filtered.reduce((s, a) => s + (a.price_min + a.price_max) / 2, 0) / total);
      const avgRent = Math.round(filtered.reduce((s, a) => {
        const rMin = a.rent_min || Math.round(a.price_min * 0.55);
        const rMax = a.rent_max || Math.round(a.price_max * 0.58);
        return s + (rMin + rMax) / 2;
      }, 0) / total);
      const minPrice = Math.min(...filtered.map((a) => a.price_min));
      const maxPrice = Math.max(...filtered.map((a) => a.price_max));
      const avgJeonseRatio = Math.round(
        filtered.reduce((s, a) => {
          const rMin = a.rent_min || Math.round(a.price_min * 0.55);
          return s + (rMin / a.price_min) * 100;
        }, 0) / total
      );
      // 지역 분포 최다 지역
      const regionCount: Record<string, number> = {};
      filtered.forEach((a) => {
        const key = a.region.split(" ").slice(0, 2).join(" ");
        regionCount[key] = (regionCount[key] || 0) + 1;
      });
      const topRegion = Object.entries(regionCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "";
      const avgHousehold = Math.round(filtered.reduce((s, a) => s + a.household_count, 0) / total);

      setSearchResultStats({ count: total, avgPrice, avgRent, minPrice, maxPrice, avgJeonseRatio, topRegion, avgHousehold });
      setLastSearchLabel(keyword.trim() || tag || "전체");
    } else {
      setSearchResultStats(null);
    }

    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsMapDriven(false);
    fetchApartments(searchQuery, selectedTag);
    scrollToResults();
  };

  const handleTagClick = (tagQuery: string) => {
    isMapDrivenRef.current = false;
    setIsMapDriven(false);
    setSelectedTag(tagQuery);
    fetchApartments(searchQuery, tagQuery);
    scrollToResults();
  };

  const formatPrice = (price: number) => {
    const uk = Math.floor(price / 10000);
    const cheon = price % 10000;
    if (uk > 0 && cheon > 0) return `${uk}억 ${cheon.toLocaleString()}만`;
    if (uk > 0) return `${uk}억원`;
    return `${price.toLocaleString()}만원`;
  };

  const formatPriceRange = (min: number, max: number) => {
    if (!min && !max) return "시세 확인중";
    const minVal = min || max;
    const maxVal = max || min;

    const formatSingle = (val: number) => {
      const uk = val / 10000;
      if (uk >= 1) {
        return uk % 1 === 0 ? `${Math.floor(uk)}억` : `${uk.toFixed(1)}억`;
      }
      return `${Math.round(val).toLocaleString()}만`;
    };

    if (minVal === maxVal) {
      return formatSingle(minVal);
    }

    const minUk = minVal / 10000;
    const maxUk = maxVal / 10000;

    if (minUk >= 1) {
      // 억 단위 범위: '33.8억 ~ 34.5억' 형태로 간결하고 정돈되게 표시 (모바일 줄바꿈 원천 방지)
      const minStr = minUk % 1 === 0 ? `${Math.floor(minUk)}억` : `${minUk.toFixed(1)}억`;
      const maxStr = maxUk % 1 === 0 ? `${Math.floor(maxUk)}억` : `${maxUk.toFixed(1)}억`;
      return `${minStr} ~ ${maxStr}`;
    }

    return `${Math.round(minVal).toLocaleString()}만 ~ ${Math.round(maxVal).toLocaleString()}만`;
  };

  const formatRentMonthly = (apt: Apartment) => {
    const deposit = 5000;
    const rentBaseMin = apt.rent_min || Math.round(apt.price_min * 0.55);
    const rentBaseMax = apt.rent_max || Math.round(apt.price_max * 0.58);
    const monthlyMin = Math.max(40, Math.round(((Math.max(deposit, rentBaseMin) - deposit) * 0.048) / 12));
    const monthlyMax = Math.max(monthlyMin + 15, Math.round(((Math.max(deposit, rentBaseMax) - deposit) * 0.048) / 12));
    return `보증금 5천 / 월 ${monthlyMin}~${monthlyMax}만`;
  };

  return (
    <div className="min-h-screen bg-surface-50 text-surface-900 font-sans pb-mobile-nav sm:pb-0">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-lg shadow-brand-500/5 bg-white/80 backdrop-blur-md" : "bg-transparent"
        }`}
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-lg shadow-brand-500/25 group-hover:shadow-brand-500/40 transition-shadow">
                <span className="text-white text-base sm:text-lg font-bold">F</span>
              </div>
              <span className="text-lg sm:text-xl font-bold gradient-text">찾아줘</span>
            </a>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200"
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setProfileModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
                    title="마이페이지 / 멤버십 등급 관리"
                  >
                    <span>
                      {currentUser.role === "premium"
                        ? "⭐"
                        : currentUser.role === "realtor"
                        ? "🏢"
                        : currentUser.role === "business"
                        ? "🏫"
                        : "👤"}
                    </span>
                    <span className="truncate max-w-[100px]">{currentUser.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-extrabold">
                      {currentUser.role === "general"
                        ? "일반"
                        : currentUser.role === "premium"
                        ? "PRO"
                        : currentUser.role === "realtor"
                        ? "중개사"
                        : "파트너"}
                    </span>
                    <span className="text-[11px] text-slate-400">⚙️</span>
                  </button>

                  {/* 일반 회원일 경우 헤더에 눈에 띄는 빠른 업그레이드 버튼 노출 */}
                  {currentUser.role === "general" && (
                    <button
                      onClick={() => setProfileModalOpen(true)}
                      className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black text-xs shadow-xs hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span>⭐</span>
                      <span>PRO 업그레이드</span>
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1 transition-colors cursor-pointer"
                  >
                    로그아웃
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => openAuth("login")}
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-brand-600 hover:bg-brand-50 transition-all duration-200 cursor-pointer"
                  >
                    로그인
                  </button>
                  <button
                    onClick={() => openAuth("pricing")}
                    className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                  >
                    시작하기 (요금제)
                  </button>
                </>
              )}
              {/* Mobile hamburger */}
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl text-gray-700 hover:text-brand-600 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="메뉴 열기"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/97 backdrop-blur-xl border-t border-gray-100 shadow-xl animate-fade-in">
            <div className="px-4 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-700 hover:text-brand-600 hover:bg-brand-50 active:bg-brand-100 transition-all"
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                  <span className="ml-auto text-gray-300">→</span>
                </a>
              ))}
              <div className="pt-2 pb-1 flex flex-col gap-2">
                {currentUser ? (
                  <>
                    <button
                      onClick={() => {
                        setProfileModalOpen(true);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2.5 rounded-2xl text-xs font-bold text-indigo-700 border border-indigo-200 bg-indigo-50 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>⚙️ 마이페이지 / 멤버십 등급 변경</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full py-2 rounded-2xl text-xs font-semibold text-rose-600 border border-rose-200 bg-rose-50 cursor-pointer"
                    >
                      로그아웃 ({currentUser.name})
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => openAuth("login")}
                      className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-brand-600 border border-brand-200 bg-brand-50 cursor-pointer"
                    >
                      로그인
                    </button>
                    <button
                      onClick={() => openAuth("pricing")}
                      className="flex-1 py-2.5 rounded-2xl text-sm font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 shadow-sm cursor-pointer"
                    >
                      요금제 가입
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative flex items-center justify-center overflow-x-hidden pt-20 sm:pt-28 pb-4 sm:pb-10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-surface-50 to-accent-50" />
          <div className="absolute top-20 -left-32 w-72 sm:w-96 h-72 sm:h-96 bg-brand-200/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 -right-32 w-72 sm:w-96 h-72 sm:h-96 bg-accent-200/30 rounded-full blur-3xl animate-float delay-300" />
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-3 sm:py-8">
          <h1 className="text-[17px] min-[360px]:text-[19px] min-[400px]:text-[22px] sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-3 sm:mb-6 leading-snug sm:leading-[1.3]">
            <span className="text-surface-900 block whitespace-nowrap">내가 찾는 부동산 정보,</span>
            <span className="gradient-text block mt-1 sm:mt-2.5 whitespace-nowrap">한 눈에 직관적으로 비교해줘</span>
          </h1>

          <p className="text-xs sm:text-base text-gray-500 max-w-2xl mx-auto mb-4 sm:mb-8 leading-relaxed font-medium break-keep">
            원하는 지역이나 단지명을 검색하세요.<br />
            시세, 세대수, 준공년도, 학군 및 역세권 점수까지 확인하세요.
          </p>

          {/* Search Input Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-5 sm:mb-7">
            <div className="search-glow relative flex items-center bg-white rounded-2xl border border-gray-200 shadow-lg shadow-gray-200/50 p-1.5 sm:p-2">
              <div className="pl-3 text-gray-400 shrink-0">
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                inputMode="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="예: 잠실역 5억대 아파트"
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-base bg-transparent outline-none placeholder:text-gray-400 text-surface-900 min-w-0"
              />
              <button
                type="submit"
                disabled={loading}
                className="shrink-0 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 shadow-lg shadow-brand-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 min-w-[72px] sm:min-w-[90px] disabled:opacity-80"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs sm:text-sm">검색중</span>
                  </>
                ) : (
                  <span className="text-sm sm:text-base">찾아줘</span>
                )}
              </button>
            </div>
          </form>

          {/* 5가지 핵심 부동산 서비스 바로가기 */}
          {/* Mobile view only (< 640px): horizontal swipe row */}
          <div className="flex sm:hidden gap-2 overflow-x-auto scrollbar-none max-w-4xl mx-auto px-1 pb-2">
            {[
              { href: "/search", icon: "🏢", label: "아파트 검색" },
              { href: "/redevelopment", icon: "🔨", label: "재개발 지도" },
              { href: "/subscriptions", icon: "🏗️", label: "분양·청약" },
              { href: "/regional", icon: "📍", label: "지역정보" },
              { href: "/community", icon: "💬", label: "커뮤니티", hot: true },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/95 border border-gray-100 shadow-sm active:scale-[0.95] transition-all min-w-[76px] shrink-0"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[11px] font-bold text-gray-700 whitespace-nowrap">{item.label}</span>
                {item.hot && <span className="bg-indigo-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[9px] leading-none">HOT</span>}
              </Link>
            ))}
          </div>

          {/* Desktop view only (>= 640px): 5-col grid */}
          <div className="hidden sm:grid grid-cols-5 gap-3 max-w-4xl mx-auto">
            <Link href="/search" className="group flex items-center justify-center gap-1.5 px-3 py-3 rounded-2xl bg-white/95 hover:bg-indigo-50/90 border border-indigo-100 hover:border-indigo-300 text-indigo-700 font-bold text-sm shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-center">
              <span className="text-lg">🏢</span><span>아파트 검색</span><span className="text-xs opacity-60 group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
            <Link href="/redevelopment" className="group flex items-center justify-center gap-1.5 px-3 py-3 rounded-2xl bg-white/95 hover:bg-emerald-50/90 border border-emerald-100 hover:border-emerald-300 text-emerald-800 font-bold text-sm shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-center">
              <span className="text-lg animate-pulse">🔨</span><span>재개발 지도</span><span className="text-xs opacity-60 group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
            <Link href="/subscriptions" className="group flex items-center justify-center gap-1.5 px-3 py-3 rounded-2xl bg-white/95 hover:bg-amber-50/90 border border-amber-100 hover:border-amber-300 text-amber-800 font-bold text-sm shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-center">
              <span className="text-lg">🏗️</span><span>분양·청약</span><span className="text-xs opacity-60 group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
            <Link href="/regional" className="group flex items-center justify-center gap-1.5 px-3 py-3 rounded-2xl bg-white/90 hover:bg-sky-50/90 border border-sky-100 hover:border-sky-300 text-sky-800 font-bold text-sm shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-center">
              <span className="text-lg">📍</span><span>지역정보</span><span className="text-xs opacity-60 group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
            <Link href="/community" className="group flex items-center justify-center gap-1.5 px-3 py-3 rounded-2xl bg-linear-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:to-purple-500/20 border border-indigo-200 hover:border-indigo-400 text-indigo-900 font-bold text-sm shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer text-center">
              <span className="text-lg">💬</span><span>커뮤니티</span><span className="bg-indigo-600 text-white font-extrabold px-1.5 py-0.5 rounded text-[10px] leading-none">HOT</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 🌟 올인원 통합 검색 결과 뷰 (아파트, 재개발, 청약, 지역명소 종합 제시) */}
      {unifiedResults && (
        <section id="unified-results-section" className="relative py-8 -mt-4 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <UnifiedSearchResultsView
              results={unifiedResults}
              onResetSearch={() => {
                setUnifiedResults(null);
                setSearchQuery("");
                setIsMapDriven(true);
                isMapDrivenRef.current = true;
                setApartments(INITIAL_MOCK_APARTMENTS);
                setSearchResultStats(null);
              }}
            />
          </div>
        </section>
      )}

      {/* 검색 결과 통계 카드 (아파트 검색 시 보조 표시) */}
      {searchResultStats && !unifiedResults && (
        <section className="relative py-6 -mt-8 z-20 animate-[fadeIn_0.4s_ease]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-2xl shadow-xl shadow-gray-200/30 p-5 bg-white/80 backdrop-blur-md border border-white">
              {/* 헤더 */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm font-bold text-brand-600 bg-brand-50 border border-brand-200 px-3 py-0.5 rounded-full">
                  📊 &quot;{lastSearchLabel}&quot; 검색 결과 요약
                </span>
                <span className="text-xs text-gray-400 font-medium">총 {searchResultStats.count.toLocaleString()}개 단지 기준</span>
              </div>
              {/* 통계 그리드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-rose-50 rounded-xl p-3.5 border border-rose-100">
                  <div className="text-[11px] font-semibold text-rose-400 mb-1">🏢 해당 단지 수</div>
                  <div className="text-2xl font-extrabold text-rose-600 tracking-tight">
                    {searchResultStats.count.toLocaleString()}<span className="text-sm font-semibold text-rose-400 ml-1">개</span>
                  </div>
                  <div className="text-[11px] text-rose-400 mt-1">최다 지역: {searchResultStats.topRegion}</div>
                </div>

                <div className="bg-brand-50 rounded-xl p-3.5 border border-brand-100">
                  <div className="text-[11px] font-semibold text-brand-400 mb-1">💰 평균 실거래가</div>
                  <div className="text-2xl font-extrabold text-brand-700 tracking-tight">
                    {(() => {
                      const uk = Math.floor(searchResultStats.avgPrice / 10000);
                      const cheon = Math.round((searchResultStats.avgPrice % 10000) / 1000) * 1000;
                      return uk > 0 ? `${uk}억${cheon > 0 ? ` ${(cheon/1000).toFixed(0)}천` : ""}` : `${searchResultStats.avgPrice.toLocaleString()}만`;
                    })()}
                  </div>
                  <div className="text-[11px] text-brand-400 mt-1">
                    최저 {Math.floor(searchResultStats.minPrice/10000)}억 ~ 최고 {Math.floor(searchResultStats.maxPrice/10000)}억
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-3.5 border border-blue-100">
                  <div className="text-[11px] font-semibold text-blue-400 mb-1">🏠 평균 전세가</div>
                  <div className="text-2xl font-extrabold text-blue-700 tracking-tight">
                    {(() => {
                      const uk = Math.floor(searchResultStats.avgRent / 10000);
                      const cheon = Math.round((searchResultStats.avgRent % 10000) / 1000) * 1000;
                      return uk > 0 ? `${uk}억${cheon > 0 ? ` ${(cheon/1000).toFixed(0)}천` : ""}` : `${searchResultStats.avgRent.toLocaleString()}만`;
                    })()}
                  </div>
                  <div className="text-[11px] text-blue-400 mt-1">전세가율 평균 {searchResultStats.avgJeonseRatio}%</div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-100">
                  <div className="text-[11px] font-semibold text-emerald-500 mb-1">👥 평균 세대수</div>
                  <div className="text-2xl font-extrabold text-emerald-700 tracking-tight">
                    {searchResultStats.avgHousehold.toLocaleString()}<span className="text-sm font-semibold text-emerald-400 ml-1">세대</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1">단지 규모 평균</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================
          호갱노노 지도 섹션 (실시간 지역 이동 연동)
          ======================================== */}
      <section id="map-section" className="py-2 sm:py-4 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200 shadow-xl">
          <AptMap
            center={mapCenter}
            onVisibleApartmentsChange={handleViewportApartmentsChange}
          />
        </div>
      </section>

      {/* Apartment Grid */}
      <section id="apt-list" className="py-4 sm:py-8 pb-6 sm:pb-16 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-bold text-surface-900 tracking-tight flex items-center gap-2">
              <span>{isMapDriven ? "🗺️" : "🏢"}</span>
              <span>
                {isMapDriven
                  ? `${mapRegionSummary} 일대 시세`
                  : searchQuery
                  ? `'${searchQuery}' 검색 결과`
                  : "아파트 단지 목록"}
              </span>
            </h2>
            <span className="text-xs sm:text-sm font-bold text-brand-600 bg-brand-50 border border-brand-200/80 px-3 py-1 rounded-full">
              총 {apartments.length}개 단지
            </span>
            {isMapDriven && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                지도 화면 실시간 연동중
              </span>
            )}
          </div>

          {!isMapDriven && (
            <button
              onClick={() => {
                isMapDrivenRef.current = true;
                setIsMapDriven(true);
                setSearchQuery("");
                setSelectedTag("");
                setSearchResultStats(null);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 transition-all cursor-pointer shadow-sm w-fit"
            >
              <span>🗺️</span>
              <span>지도 이동 지역 시세로 다시 보기</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-72 sm:h-96 animate-pulse border border-gray-100" />
            ))}
          </div>
        ) : apartments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg font-medium">검색 조건에 맞는 아파트가 없습니다.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTag("");
                setApartments(INITIAL_MOCK_APARTMENTS);
              }}
              className="mt-4 px-4 py-2 bg-brand-50 text-brand-600 font-semibold rounded-xl text-sm cursor-pointer"
            >
              전체 목록 다시 보기
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {apartments.slice(0, visibleCount).map((apt) => (
                <Link
                  href={`/apt/${apt.id}`}
                  key={apt.id}
                  className="group relative bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* 가격대별 이미지 헤더 */}
                  {(() => {
                    const feat = getApartmentHighlightFeature(apt);
                    const avgPrice = (apt.price_min + apt.price_max) / 2;
                    // 가격대별 이미지 + 오버레이 색상
                    const tierImg =
                      avgPrice >= 300000 ? "/apt-tier-ultra.jpg"     // 30억 이상
                      : avgPrice >= 200000 ? "/apt-tier-premium.jpg" // 20억~30억
                      : avgPrice >= 100000 ? "/apt-tier-mid.jpg"     // 10억~20억
                      : "/apt-tier-standard.jpg";                    // 10억 미만
                    const tierOverlay =
                      avgPrice >= 300000 ? "from-black/70 via-black/40 to-transparent"
                      : avgPrice >= 200000 ? "from-slate-900/65 via-slate-800/35 to-transparent"
                      : avgPrice >= 100000 ? "from-slate-800/60 via-slate-700/30 to-transparent"
                      : "from-slate-700/55 via-slate-600/25 to-transparent";
                    return (
                      <div className="relative h-[140px] overflow-hidden">
                        {/* 배경 이미지 */}
                        <img
                          src={tierImg}
                          alt={apt.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* 그라디언트 오버레이 */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${tierOverlay}`} />
                        {/* 콘텐츠 */}
                        <div className="absolute inset-0 flex flex-col justify-end px-4 pb-3 text-white">
                          {/* 태그 */}
                          <div className="flex flex-wrap gap-1.5 mb-1.5">
                            {apt.tags?.slice(0, 3).map((tag) => (
                              <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/25 border border-white/40 backdrop-blur-sm">
                                #{tag}
                              </span>
                            ))}
                          </div>
                          {/* 지역 + 단지명 */}
                          <div className="text-[11px] font-semibold text-white/75 mb-0.5 drop-shadow">{apt.region} {apt.district}</div>
                          <h3 className="text-lg font-extrabold text-white leading-tight group-hover:text-white/90 transition-colors drop-shadow-md">
                            {apt.name}
                          </h3>
                          {/* 세대수 / 연식 / 평형 */}
                          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-white/70 font-semibold">
                            <span>🏢 {apt.household_count.toLocaleString()}세대</span>
                            <span>📅 {apt.built_year}년 ({2026 - apt.built_year}년차)</span>
                            <span>📐 {apt.area_pyeong}평</span>
                          </div>
                        </div>
                        {/* 핵심 특징 배지 (우상단) */}
                        <div className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold bg-black/40 backdrop-blur-sm border border-white/20 text-white rounded-full px-2.5 py-0.5">
                          <span>{feat.icon}</span>
                          <span>{feat.badge || feat.label}</span>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Card Content - Full Detailed Info View */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">

                    {/* Price & Primary Specs (매매 + 전월세) */}
                    <div className="bg-surface-50 p-3.5 rounded-xl border border-gray-100 space-y-2">
                      {/* 매매 시세 */}
                      <div className="flex justify-between items-center gap-2">
                        <span className="text-xs font-bold text-rose-600 flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
                          <span>매매</span>
                          {apt.tags?.includes("실거래인증") ? (
                            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0 whitespace-nowrap">실거래 인증</span>
                          ) : (
                            <span className="text-[10px] font-normal text-slate-500 bg-slate-100 px-1 py-0.5 rounded shrink-0 whitespace-nowrap">동별 시세</span>
                          )}
                        </span>
                        <span className="text-sm sm:text-base font-extrabold text-rose-600 text-right ml-auto whitespace-nowrap tracking-tight">
                          {formatPriceRange(apt.price_min, apt.price_max)}
                        </span>
                      </div>

                      {/* 전세 시세 */}
                      <div className="flex justify-between items-center gap-2 pt-1.5 border-t border-gray-200/50">
                        <span className="text-xs font-bold text-blue-600 flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
                          <span>전세</span>
                        </span>
                        <div className="flex items-center gap-1.5 ml-auto text-right whitespace-nowrap">
                          <span className="text-xs sm:text-sm font-bold text-blue-700 tracking-tight">
                            {formatPriceRange(apt.rent_min || Math.round(apt.price_min * 0.55), apt.rent_max || Math.round(apt.price_max * 0.58))}
                          </span>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100 shrink-0">
                            {apt.jeonseRatio || Math.round(((apt.rent_min || apt.price_min * 0.55) / apt.price_min) * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* 월세 시세 */}
                      <div className="flex justify-between items-center gap-2 pt-1.5 border-t border-gray-200/50">
                        <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                          <span>월세</span>
                        </span>
                        <span className="text-xs font-semibold text-emerald-800 text-right ml-auto whitespace-nowrap tracking-tight">
                          {formatRentMonthly(apt)}
                        </span>
                      </div>

                      {/* 단지 정보: 면적 / 주차 / 규모 */}
                      <div className="pt-2 border-t border-gray-200/60 space-y-1">
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span className="text-gray-400">전용면적</span>
                          <span className="font-semibold text-gray-800">
                            {apt.area_sqm}㎡ ({apt.area_pyeong}평형)
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <span className="text-gray-400">주차 / 규모</span>
                          <span className="font-semibold text-slate-800">
                            {apt.parkingRatio ? `세대당 ${apt.parkingRatio}대` : (apt.parking || "주차등록")}
                            {apt.dong_count ? ` · ${apt.dong_count}개동` : ""}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 학군 · 교통 점수 */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-brand-50/60 p-2.5 rounded-lg border border-brand-100/60">
                        <div className="text-gray-400 text-[11px]">🎓 학군 점수</div>
                        <div className="font-bold text-brand-700 text-sm mt-0.5">{apt.school_score}점</div>
                      </div>
                      <div className="bg-accent-50/60 p-2.5 rounded-lg border border-accent-100/60">
                        <div className="text-gray-400 text-[11px]">🚇 교통/역세권 점수</div>
                        <div className="font-bold text-accent-700 text-sm mt-0.5">{apt.traffic_score}점</div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {apartments.length > visibleCount && (
              <div className="mt-10 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 24)}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-brand-500 text-brand-600 hover:bg-brand-50 hover:border-brand-600 font-bold rounded-2xl shadow-sm transition-all text-sm cursor-pointer"
                >
                  <span>단지 더보기 (+24개)</span>
                  <span className="text-xs text-gray-400">
                    ({Math.min(visibleCount, apartments.length)} / {apartments.length.toLocaleString()})
                  </span>
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* 실시간 부동산 커뮤니티 라운지 섹션 */}
      <section className="py-12 bg-linear-to-b from-slate-50 to-indigo-50/40 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span>실시간 소통 라운지</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                지금 가장 뜨거운 부동산 이야기 💬
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                아파트 실거주기부터 재개발 구역 소식, 청약 가점, 동네 이야기까지 이웃들과 함께 나눠보세요.
              </p>
            </div>
            <Link
              href="/community"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md shrink-0 cursor-pointer"
            >
              <span>전체 커뮤니티 보기</span>
              <span>→</span>
            </Link>
          </div>

          {/* 4대 카테고리 대표 토크 카드 그리드 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. 아파트 찾기 */}
            <Link
              href="/community"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold text-[11px]">
                    🏢 아파트 찾기
                  </span>
                  <span className="text-slate-400 text-[10px]">1시간 전</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1.5">
                  마래푸 vs 헬리오시티 34평 18억대 갈아타기 실거주 비교 임장기
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  직장 광화문/여의도 접근성과 대단지 평지 인프라, 초품아 학군 비교...
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-medium text-slate-600">여의도금융맨</span>
                <span className="text-indigo-600 font-semibold">투표 943명 참여 🔥</span>
              </div>
            </Link>

            {/* 2. 재개발·정비 */}
            <Link
              href="/community"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 font-bold text-[11px]">
                    🔨 재개발·정비
                  </span>
                  <span className="text-slate-400 text-[10px]">35분 전</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 mb-1.5">
                  성수전략정비구역 4지구 77층 초고층 설계 변경안 주민 설명회 후기
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  한강 영구조망 비율 대폭 상향, 현대 디에이치 vs 삼물 래미안 수주전...
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-medium text-slate-600">성수한강러 (조합원)</span>
                <span className="text-amber-600 font-semibold">추천 154</span>
              </div>
            </Link>

            {/* 3. 분양·청약 */}
            <Link
              href="/community"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[11px]">
                    🏗️ 분양·청약톡
                  </span>
                  <span className="text-slate-400 text-[10px]">10분 전</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-1.5">
                  동탄역 대방 엘리움 무순위 잔여 2가구 공고! 시세차익 4억?
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  분양가 6억 초반대 그대로 나와 로또 줍줍 예상, 화성시 무주택 세대주 조건...
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-medium text-slate-600">동탄출퇴근러</span>
                <span className="text-emerald-600 font-semibold">댓글 19개</span>
              </div>
            </Link>

            {/* 4. 지역·상권 */}
            <Link
              href="/community"
              className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 font-bold text-[11px]">
                    📍 지역·상권·학군
                  </span>
                  <span className="text-slate-400 text-[10px]">2시간 전</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors line-clamp-2 mb-1.5">
                  GTX-A 수서-동탄 개통 6개월차, 주변 아파트 체감 교통과 상권 변화
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  17분만에 수서 도착 혁명 맞음. 수서역 환승 팁 및 롯백 상권 유동인구 솔직 정리...
                </p>
              </div>
              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-medium text-slate-600">동탄수서통근</span>
                <span className="text-purple-600 font-semibold">추천 92</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 로그인, 회원가입 & 요금제 통합 모달 */}
      <UnifiedAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        initialRole={authInitialRole}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      {/* 내 정보 & 멤버십 등급 변경(업그레이드) 모달 */}
      {currentUser && (
        <MyProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          currentUser={currentUser}
          onUserUpdate={(updated) => {
            setCurrentUser(updated);
          }}
          onOpenPricing={() => openAuth("pricing")}
        />
      )}
    </div>
  );
}
