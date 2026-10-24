/**
 * 찾아줘 올인원(All-in-One) 통합 검색 엔진
 * - 아파트 실거래 데이터 (22,343개)
 * - 재개발·재건축 정비사업 구역
 * - 한국부동산원 청약홈 분양 공고
 * - 지역별 명소 / 관광지 / 맛집 / 인프라
 */

import { Apartment, APARTMENTS_DATA } from "./apartments";
import { REDEVELOPMENT_DATA, RedevelopmentZone } from "./redevelopment";
import masterSubscriptionsRaw from "./subscriptions-master.json";
import { SubscriptionNotice } from "./applyhome";
import { RegionalPlace, getRegionalPlaces } from "./regionalApi";
import { resolveStationOrPlace, getDistanceMeters } from "./searchGeoHelper";

export type SearchDomain = "all" | "apt" | "redev" | "subscription" | "regional";

export interface ParsedUnifiedIntent {
  rawQuery: string;
  primaryDomain: SearchDomain;
  detectedDomains: SearchDomain[];
  regionKeyword?: string;
  stationName?: string;
  maxWalkMinutes?: number;
  priceMaxManwon?: number;
  priceMinManwon?: number;
  isPriceUpperBound: boolean;
  isPriceLowerBound: boolean;
  cleanKeywords: string[];
}

export interface UnifiedSearchOutput {
  intent: ParsedUnifiedIntent;
  summaryTitle: string;
  summaryBadge: string;
  apartments: Apartment[];
  redevZones: RedevelopmentZone[];
  subscriptions: SubscriptionNotice[];
  regionalPlaces: RegionalPlace[];
  counts: {
    total: number;
    apt: number;
    redev: number;
    subscription: number;
    regional: number;
  };
}

// 금액 파싱 헬퍼 (예: "10억", "6억 이내", "5천만" -> 만원 단위 변환)
function extractPriceConditions(query: string) {
  let priceMaxManwon: number | undefined;
  let priceMinManwon: number | undefined;
  let isPriceUpperBound = false;
  let isPriceLowerBound = false;

  // "10억 이내", "6억 이하", "6억 밑으로", "10억 안으로"
  const upperMatch = query.match(/(\d+(?:\.\d+)?)\s*억\s*(?:(\d+)\s*천)?\s*(?:원)?\s*(이내|이하|미만|안으로|밑으로)/i);
  if (upperMatch) {
    const uk = parseFloat(upperMatch[1]);
    const cheon = upperMatch[2] ? parseInt(upperMatch[2], 10) : 0;
    priceMaxManwon = Math.round(uk * 10000 + cheon * 1000);
    isPriceUpperBound = true;
  }

  // "10억 이상", "10억 초과", "10억 넘는"
  const lowerMatch = query.match(/(\d+(?:\.\d+)?)\s*억\s*(?:(\d+)\s*천)?\s*(?:원)?\s*(이상|초과|위로|넘는)/i);
  if (lowerMatch) {
    const uk = parseFloat(lowerMatch[1]);
    const cheon = lowerMatch[2] ? parseInt(lowerMatch[2], 10) : 0;
    priceMinManwon = Math.round(uk * 10000 + cheon * 1000);
    isPriceLowerBound = true;
  }

  // 단독 "10억", "6억원" (투자비 10억, 분양가 6억 등)
  if (!upperMatch && !lowerMatch) {
    const singleMatch = query.match(/(?:투자비|투자금|예산|분양가|금액|가격)?\s*(\d+(?:\.\d+)?)\s*억\s*(?:(\d+)\s*천)?\s*(?:원|대)?/i);
    if (singleMatch) {
      const uk = parseFloat(singleMatch[1]);
      const cheon = singleMatch[2] ? parseInt(singleMatch[2], 10) : 0;
      const target = Math.round(uk * 10000 + cheon * 1000);
      // 투자비나 분양가 질문인 경우 대개 해당 금액 이하(상한선) 의미
      priceMaxManwon = target;
      isPriceUpperBound = true;
    }
  }

  return { priceMaxManwon, priceMinManwon, isPriceUpperBound, isPriceLowerBound };
}

// 도보 시간 파싱
function extractWalkMinutes(query: string): number | undefined {
  const match = query.match(/(?:도보\s*)?(\d+)\s*분(?:\s*거리|\s*이내|\s*안|\s*소요)?/i);
  if (match) return parseInt(match[1], 10);
  if (/초역세권/i.test(query)) return 4;
  if (/역세권|역근처/i.test(query)) return 8;
  return undefined;
}

// 지역 키워드 후보군
const MAJOR_REGIONS = [
  "서울", "경기", "인천", "부산", "대구", "대전", "광주", "울산", "세종", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주",
  "구리", "양평", "남양주", "수원", "성남", "판교", "분당", "용인", "화성", "동탄", "하남", "일산", "고양", "평택", "안양", "부천", "광명", "과천",
  "강남", "서초", "송파", "잠실", "용산", "마포", "성동", "노원", "영등포", "여의도", "강동", "동작", "양천", "목동", "성북", "장위", "은평", "북아현", "한남", "성수",
  "해운대", "수영", "수성", "유성", "송도", "청라", "검단"
];

export function parseUnifiedQuery(rawQuery: string): ParsedUnifiedIntent {
  const q = rawQuery.trim();
  const detectedDomains: SearchDomain[] = [];

  // 도메인 감지
  const isRedev = /재개발|재건축|정비사업|정비구역|조합|모아타운|신통기획|신속통합|사업시행|관리처분|프리미엄|물건/i.test(q);
  const isSub = /청약|분양|분양가|분양정보|특공|특별공급|1순위|2순위|무순위|줍줍|당첨|모델하우스/i.test(q);
  const isRegional = /가야하는|가볼만한|꼭\s*가야|명소|관광|맛집|식당|카페|여행|핫플|볼거리|나들이|추천해/i.test(q);
  const isApt = /아파트|단지|역세권|실거래|전세|매매가|초품아|도보/i.test(q);

  if (isRedev) detectedDomains.push("redev");
  if (isSub) detectedDomains.push("subscription");
  if (isRegional) detectedDomains.push("regional");
  if (isApt) detectedDomains.push("apt");

  // 주 도메인(Primary Domain) 결정
  let primaryDomain: SearchDomain = "all";
  if (isRedev && !isSub && !isRegional && !isApt) primaryDomain = "redev";
  else if (isSub && !isRedev && !isRegional) primaryDomain = "subscription";
  else if (isRegional && !isRedev && !isSub) primaryDomain = "regional";
  else if (isApt && !isRedev && !isSub && !isRegional) primaryDomain = "apt";
  else if (detectedDomains.length === 1) primaryDomain = detectedDomains[0];

  // 지역명 감지
  let regionKeyword: string | undefined;
  for (const reg of MAJOR_REGIONS) {
    if (q.includes(reg)) {
      regionKeyword = reg;
      break;
    }
  }

  // 역 이름 감지
  let stationName: string | undefined;
  const stationMatch = q.match(/([가-힣]{2,8}역)/);
  if (stationMatch) {
    stationName = stationMatch[1];
  }

  const { priceMaxManwon, priceMinManwon, isPriceUpperBound, isPriceLowerBound } = extractPriceConditions(q);
  const maxWalkMinutes = extractWalkMinutes(q);

  // 불용어 정제 후 핵심 키워드
  const cleanTokens = q
    .replace(/(?:투자비|투자금|분양가|매매가|전세가|도보|거리|이내|이하|이상|미만|초과|안으로|밑으로)/g, " ")
    .replace(/(\d+(?:\.\d+)?)\s*억\s*(?:(\d+)\s*천)?/g, " ")
    .replace(/(?:\d+)\s*분/g, " ")
    .replace(/(아파트|재개발|청약|분양|분양정보|물건|지역정보|추천해줘|추천|찾아줘|있는|곳들|곳|어디)/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/(에서|으로|이랑|하고|에게|부터|까지|에는|에|이|가|은|는|을|를|의|로|인)$/, "").trim())
    .filter((w) => w.length >= 2);

  return {
    rawQuery: q,
    primaryDomain,
    detectedDomains,
    regionKeyword,
    stationName,
    maxWalkMinutes,
    priceMaxManwon,
    priceMinManwon,
    isPriceUpperBound,
    isPriceLowerBound,
    cleanKeywords: Array.from(new Set(cleanTokens)),
  };
}

export async function executeUnifiedSearch(rawQuery: string): Promise<UnifiedSearchOutput> {
  const intent = parseUnifiedQuery(rawQuery);
  const { regionKeyword, stationName, maxWalkMinutes, priceMaxManwon, priceMinManwon, cleanKeywords } = intent;

  // 1. 🏢 아파트 검색
  let matchedApts: Apartment[] = [];
  const aptPool = APARTMENTS_DATA.length > 0 ? APARTMENTS_DATA : [];

  if (stationName) {
    // 지하철역 중심 검색
    const stationLoc = await resolveStationOrPlace(stationName);
    if (stationLoc) {
      const walkLimit = maxWalkMinutes || 10;
      const maxAllowedMeters = walkLimit * 80 + 200;

      for (const apt of aptPool) {
        if (!apt.lat || !apt.lng) continue;
        const dist = getDistanceMeters(stationLoc.lat, stationLoc.lng, apt.lat, apt.lng);
        if (dist > maxAllowedMeters) continue;

        // 가격 상한
        if (priceMaxManwon && apt.price_min > priceMaxManwon) continue;
        if (priceMinManwon && apt.price_max < priceMinManwon) continue;

        const walkMin = Math.round(dist / 80);
        matchedApts.push({
          ...apt,
          walk_minutes: walkMin,
          station: stationLoc.name,
          station_dist: `도보 ${walkMin}분 (${dist}m)`,
        });
      }
      matchedApts.sort((a, b) => (a.walk_minutes || 99) - (b.walk_minutes || 99));
    }
  }

  // 지하철역으로 못 찾았거나 역 키워드가 없는 경우 키워드/지역/가격 검색
  if (matchedApts.length === 0) {
    matchedApts = aptPool.filter((apt) => {
      // 지역 조건
      if (regionKeyword) {
        const regMatch = apt.region.includes(regionKeyword) || apt.district.includes(regionKeyword);
        if (!regMatch) return false;
      }
      // 가격 조건
      if (priceMaxManwon && apt.price_min > priceMaxManwon) return false;
      if (priceMinManwon && apt.price_max < priceMinManwon) return false;
      // 도보 거리 조건
      if (maxWalkMinutes && (apt.walk_minutes || 99) > maxWalkMinutes) return false;

      // 추가 키워드 매칭
      if (cleanKeywords.length > 0) {
        const text = `${apt.name} ${apt.region} ${apt.district} ${apt.tags?.join(" ") || ""}`.toLowerCase();
        return cleanKeywords.some((k) => text.includes(k.toLowerCase()));
      }
      return true;
    });

    // 정렬: 역세권/학군/시세 우수순
    matchedApts.sort((a, b) => (b.traffic_score + b.school_score) - (a.traffic_score + a.school_score));
  }

  // 2. 🔨 재개발·정비사업 검색
  const redevPool = (REDEVELOPMENT_DATA || []) as RedevelopmentZone[];
  let matchedRedev = redevPool.filter((zone) => {
    // 1) 지역 매칭
    if (regionKeyword) {
      const rMatch =
        zone.region.includes(regionKeyword) ||
        zone.district.includes(regionKeyword) ||
        zone.address.includes(regionKeyword) ||
        zone.name.includes(regionKeyword);
      if (!rMatch) return false;
    }

    // 2) 투자금 / 가격 조건 매칭 (예: 10억 이하로 진행 가능한 물건)
    if (priceMaxManwon) {
      // 구역 내 최소 투자금 또는 실거래가 검사
      let minInv = 0;
      if (zone.minInvestmentDisplay) {
        const num = parseFloat(zone.minInvestmentDisplay.replace(/[^0-9.]/g, ""));
        if (!isNaN(num)) minInv = Math.round(num * 10000);
      } else if (zone.calcMetrics?.unionPrice59Manwon) {
        minInv = zone.calcMetrics.unionPrice59Manwon;
      } else if (zone.transactions && zone.transactions.length > 0) {
        minInv = Math.min(...zone.transactions.map((t) => t.tradePriceManwon));
      }

      // 최소 투자금이 상한을 초과하면 제외 (상한 10억인데 최저가 12억이면 불가)
      if (minInv > 0 && minInv > priceMaxManwon * 1.1) {
        return false;
      }
    }

    // 3) 키워드 매칭
    if (cleanKeywords.length > 0) {
      const text = `${zone.name} ${zone.type} ${zone.status} ${zone.builder} ${zone.region} ${zone.district}`.toLowerCase();
      const hasMatch = cleanKeywords.some((k) => text.includes(k.toLowerCase()));
      if (!hasMatch && !regionKeyword) return false;
    }

    return true;
  });

  // 사업 단계 빠른 순 및 세대수 큰 순 정렬
  matchedRedev.sort((a, b) => (b.totalUnits || 0) - (a.totalUnits || 0));

  // 3. 🏗️ 분양·청약 공고 검색
  const subPool = (masterSubscriptionsRaw as unknown as SubscriptionNotice[]) || [];
  let matchedSubs = subPool.filter((notice) => {
    // 1) 지역 매칭
    if (regionKeyword) {
      const rMatch =
        notice.region.includes(regionKeyword) ||
        notice.address.includes(regionKeyword) ||
        notice.name.includes(regionKeyword);
      if (!rMatch) return false;
    }

    // 2) 분양가 조건 매칭 (예: 6억 이내)
    if (priceMaxManwon) {
      const minPrice = notice.minPriceManwon || 0;
      // 최저 분양가가 상한을 넘으면 제외 (예: 최저 7억인데 6억 이내 조건이면 제외)
      if (minPrice > 0 && minPrice > priceMaxManwon) {
        return false;
      }
    }

    // 3) 키워드 매칭
    if (cleanKeywords.length > 0) {
      const text = `${notice.name} ${notice.detailType} ${notice.type} ${notice.company || ""} ${notice.address}`.toLowerCase();
      const hasMatch = cleanKeywords.some((k) => text.includes(k.toLowerCase()));
      if (!hasMatch && !regionKeyword) return false;
    }

    return true;
  });

  // 청약접수중 > 접수예정 > 마감 순 정렬
  matchedSubs.sort((a, b) => {
    const statusWeight = (s: string) => {
      if (s === "청약접수중") return 4;
      if (s === "접수예정") return 3;
      if (s === "마감/발표대기") return 2;
      return 1;
    };
    return statusWeight(b.status) - statusWeight(a.status);
  });

  // 4. 📍 지역정보 (명소 / 가볼만한 곳 / 맛집) 검색
  let matchedRegional: RegionalPlace[] = [];
  try {
    const targetRegionForApi = regionKeyword || "서울";
    const keywordForApi = cleanKeywords.join(" ") || (intent.primaryDomain === "regional" ? "관광 명소" : "");
    const places = await getRegionalPlaces(targetRegionForApi, "all", keywordForApi);
    if (places && places.length > 0) {
      matchedRegional = places;
    }
  } catch (err) {
    console.error("Failed to fetch regional places in unified search:", err);
  }

  // 요약 타이틀 및 뱃지 생성
  let summaryTitle = "";
  let summaryBadge = "통합 검색";

  if (intent.primaryDomain === "redev") {
    summaryBadge = "🔨 재개발·정비사업";
    summaryTitle = `${regionKeyword || "전국"} ${priceMaxManwon ? `${Math.round(priceMaxManwon / 10000)}억 이하 ` : ""}추천 정비구역`;
  } else if (intent.primaryDomain === "subscription") {
    summaryBadge = "🏗️ 분양·청약 정보";
    summaryTitle = `${regionKeyword || "전국"} ${priceMaxManwon ? `분양가 ${Math.round(priceMaxManwon / 10000)}억 이내 ` : ""}청약 공고`;
  } else if (intent.primaryDomain === "regional") {
    summaryBadge = "📍 지역 명소·추천";
    summaryTitle = `${regionKeyword || "지역"} 꼭 가봐야 할 추천 명소 및 인프라`;
  } else if (intent.primaryDomain === "apt") {
    summaryBadge = "🏢 아파트 실거래";
    summaryTitle = `${stationName || regionKeyword || "추천"} ${maxWalkMinutes ? `도보 ${maxWalkMinutes}분 ` : ""}아파트 단지`;
  } else {
    summaryBadge = "🌟 올인원 통합 결과";
    summaryTitle = `"${rawQuery}" 관련 부동산·지역 종합 검색 결과`;
  }

  return {
    intent,
    summaryTitle,
    summaryBadge,
    apartments: matchedApts,
    redevZones: matchedRedev,
    subscriptions: matchedSubs,
    regionalPlaces: matchedRegional,
    counts: {
      total: matchedApts.length + matchedRedev.length + matchedSubs.length + matchedRegional.length,
      apt: matchedApts.length,
      redev: matchedRedev.length,
      subscription: matchedSubs.length,
      regional: matchedRegional.length,
    },
  };
}
