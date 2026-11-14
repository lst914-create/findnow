import { Apartment } from "./apartments";
import { resolveStationOrPlace, getDistanceMeters, GeoLocation, KNOWN_STATIONS } from "./searchGeoHelper";

export interface ParsedSearchQuery {
  keywords: string[];
  stationName?: string;
  maxWalkMinutes?: number;
  isNearSearch: boolean;
  isHangangSearch: boolean;
  isStationNearSearch: boolean;
  isNewApartment?: boolean; // 신축
  isLargeComplex?: boolean; // 대단지
  isSchoolZone?: boolean; // 초품아
  tradeType?: "rent" | "sale";
  targetPriceManwon?: number;
  priceMinManwon?: number;
  priceMaxManwon?: number;
  isPriceUpperBound?: boolean;
  isPriceLowerBound?: boolean;
  minPyeong?: number;
  maxPyeong?: number;
  summaryText?: string;
}

export const STOP_WORDS = new Set([
  "아파트", "단지", "가장", "가까운", "근처", "주변", "어디", "정보", "시세",
  "추천", "찾아줘", "있는", "원해", "좋은", "살기", "입구", "인근", "도보",
  "역에서", "역이랑", "역근처", "역주변", "에서", "으로", "이랑", "하고", "과", "와",
  "거리", "거리의", "분", "10분", "5분", "3분", "7분", "15분", "20분",
  "이내", "이하", "미만", "이상", "초과", "밑으로", "위로", "안으로", "정도",
  "대", "원", "억", "평", "평대"
]);

export function cleanKoreanParticle(word: string): string {
  return word.replace(/(에서가장|에서|으로|이랑|하고|에게|부터|까지|에는|에|이|가|은|는|을|를|의|로|인)$/, "");
}

export function extractSearchKeywords(rawQuery: string): ParsedSearchQuery {
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
  const isNewApartment = /(신축|새아파트|최신)/i.test(trimmed);
  const isLargeComplex = /(대단지|대형단지|1000세대|천세대)/i.test(trimmed);
  const isSchoolZone = /(초품아|초등학교|안심통학|학군)/i.test(trimmed);

  // 1. 거래 형태 감지 (전세, 매매, 월세)
  let tradeType: "rent" | "sale" | undefined;
  if (/전세/i.test(trimmed)) tradeType = "rent";
  else if (/(매매|매매가)/i.test(trimmed)) tradeType = "sale";

  // 2. 평형 감지 ("20평대", "30평대", "40평대", "84", "59" 등)
  let minPyeong: number | undefined;
  let maxPyeong: number | undefined;

  const pyeongRangeMatch = trimmed.match(/(\d+)\s*평대/i);
  if (pyeongRangeMatch) {
    const p = parseInt(pyeongRangeMatch[1], 10);
    minPyeong = p;
    maxPyeong = p + 9;
  } else {
    const singlePyeongMatch = trimmed.match(/(\d+)\s*평/i);
    if (singlePyeongMatch) {
      const p = parseInt(singlePyeongMatch[1], 10);
      minPyeong = Math.max(10, p - 3);
      maxPyeong = p + 3;
    } else if (/\b84\b|84타입|84m/i.test(trimmed)) {
      minPyeong = 30;
      maxPyeong = 36;
    } else if (/\b59\b|59타입|59m/i.test(trimmed)) {
      minPyeong = 22;
      maxPyeong = 27;
    }
  }

  // 3. 가격 감지 (이내/이하/이상/대 등 정밀 파싱)
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

  // 4. 도보 시간 감지 ("도보 10분", "10분 거리", "초역세권")
  let maxWalkMinutes: number | undefined;
  const walkMatch = trimmed.match(/(?:도보\s*)?(\d+)\s*분(?:\s*거리|\s*이내|\s*안|\s*소요)?/i);
  if (walkMatch) {
    maxWalkMinutes = parseInt(walkMatch[1], 10);
  } else if (/초역세권/i.test(trimmed)) {
    maxWalkMinutes = 4;
  } else if (/(역세권|역근처|역인근)/i.test(trimmed)) {
    maxWalkMinutes = 8;
  }

  // 5. 역 이름 감지
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

  // 6. 토큰 정제 (오탐 유발 단어 제거)
  const cleaned = trimmed
    .replace(/(\d+(?:\.\d+)?)\s*억\s*(?:(\d+)\s*천)?\s*(?:이내|이하|미만|이상|초과|안으로|밑으로|위로|대|데|원)?/gi, " ")
    .replace(/(\d+)\s*평(?:대)?/gi, " ")
    .replace(/(?:도보\s*)?\d+\s*분(?:\s*거리|\s*이내|\s*안|\s*소요)?/gi, " ")
    .replace(/(도보|거리|이내|이하|이상|미만|초과|밑으로|위로|안으로|분)/gi, " ")
    .replace(/(전세|매매|월세|매매가)/gi, " ")
    .replace(/(신축|새아파트|대단지|초품아)/gi, " ")
    .replace(/(역이랑|역에서|역근처|역주변|역인근)/gi, "역 ")
    .replace(/(가장|가까운|아파트|단지|추천|찾아줘|있는|원해|주변|어디|정보|시세|살기|좋은)/gi, " ");

  const rawTokens = trimmed.split(/\s+/);
  const cleanTokens = cleaned.split(/\s+/);

  const candidateKeywords = new Set<string>();

  [...rawTokens, ...cleanTokens].forEach((t) => {
    const word = t.trim();
    if (!word) return;

    const stripped = cleanKoreanParticle(word);
    [word, stripped].forEach((w) => {
      if (
        w.length >= 2 &&
        !STOP_WORDS.has(w) &&
        !/^(전세|매매|월세|억|억대|억데|아파트|단지|거리|도보|이내|이하|이상|평|평대)$/.test(w) &&
        !/^\d+억/.test(w) &&
        !/^\d+분/.test(w) &&
        !/^\d+평/.test(w)
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
    isNewApartment,
    isLargeComplex,
    isSchoolZone,
    tradeType,
    targetPriceManwon,
    priceMinManwon,
    priceMaxManwon,
    isPriceUpperBound,
    isPriceLowerBound,
    minPyeong,
    maxPyeong,
  };
}

export function scoreApartment(apt: Apartment, queryInfo: ParsedSearchQuery): number {
  const {
    keywords,
    tradeType,
    priceMinManwon,
    priceMaxManwon,
    isPriceUpperBound,
    isPriceLowerBound,
    minPyeong,
    maxPyeong,
    isNewApartment,
    isLargeComplex,
    isSchoolZone,
  } = queryInfo;

  // 1. 가격 상한/하한 엄격 필터링
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

  // 2. 평형 필터링
  if (minPyeong && apt.area_pyeong && apt.area_pyeong < minPyeong) return 0;
  if (maxPyeong && apt.area_pyeong && apt.area_pyeong > maxPyeong) return 0;

  // 3. 신축/대단지 필터링
  if (isNewApartment && apt.built_year && apt.built_year < 2019 && !apt.tags?.includes("신축")) return 0;
  if (isLargeComplex && apt.household_count && apt.household_count < 800) return 0;
  if (isSchoolZone && (!apt.schools || apt.schools.length === 0) && !apt.tags?.includes("초품아")) return 0;

  let score = 0;

  if (keywords.length > 0) {
    let hasLocationOrNameMatch = false;

    for (const kw of keywords) {
      const lkw = kw.toLowerCase();

      // 이름 매칭
      if (apt.name.toLowerCase().includes(lkw)) {
        score += 45;
        hasLocationOrNameMatch = true;
      }
      // 세부 동/읍/면 (예: 다산동, 토평동, 대치동 등)
      if (apt.district && apt.district.toLowerCase().includes(lkw)) {
        score += 50;
        hasLocationOrNameMatch = true;
      }
      // 시/도/군 (예: 구리시, 남양주시, 서울)
      if (apt.region && apt.region.toLowerCase().includes(lkw)) {
        score += 30;
        hasLocationOrNameMatch = true;
      }
      // 지하철역
      if (apt.station && apt.station.toLowerCase().includes(lkw)) {
        score += 35;
        hasLocationOrNameMatch = true;
      }
      // 태그 매칭
      if (apt.tags?.some((t) => t.toLowerCase().includes(lkw))) {
        score += 15;
      }
    }

    if (!hasLocationOrNameMatch && queryInfo.targetPriceManwon === undefined && !queryInfo.stationName) {
      return 0;
    }
  } else {
    // 키워드가 없지만 가격 조건만 주어진 경우
    score = 10;
  }

  // 가격 근접도 가산점 (targetPriceManwon이 있을 때)
  if (queryInfo.targetPriceManwon) {
    const aptPrice = (apt.price_min + apt.price_max) / 2;
    const diff = Math.abs(aptPrice - queryInfo.targetPriceManwon);
    const priceScore = Math.max(0, 30 - Math.round((diff / queryInfo.targetPriceManwon) * 30));
    score += priceScore;
  }

  return score;
}

export interface NlpSearchResult {
  apartments: Apartment[];
  targetCenter: { lat: number; lng: number } | null;
  queryInfo: ParsedSearchQuery;
  summaryBadge: string;
}

export async function searchApartmentsWithNlp(
  rawQuery: string,
  allApartments: Apartment[]
): Promise<NlpSearchResult> {
  const queryInfo = extractSearchKeywords(rawQuery);
  const { keywords } = queryInfo;

  let filtered = allApartments;
  let targetCenter: { lat: number; lng: number } | null = null;
  let summaryParts: string[] = [];

  // 1. 역 위치 해석 (예: "잠실역", "도농역")
  const stationLoc = await resolveStationOrPlace(rawQuery);

  if (stationLoc) {
    targetCenter = { lat: stationLoc.lat, lng: stationLoc.lng };
    const walkMinLimit = queryInfo.maxWalkMinutes || 15;
    let maxAllowedMeters = walkMinLimit * 80 + 200; // 기본 15분(1,400m) 여유 오차

    summaryParts.push(`${stationLoc.name} 인근 도보 생활권`);

    const checkAptList = (maxM: number) => {
      const list: (Apartment & { distMeters: number })[] = [];
      for (const apt of allApartments) {
        if (!apt.lat || !apt.lng) continue;
        const distM = getDistanceMeters(stationLoc.lat, stationLoc.lng, apt.lat, apt.lng);
        const walkMin = Math.round(distM / 80);

        if (distM > maxM) continue;

        // 가격 상한
        if (queryInfo.isPriceUpperBound && queryInfo.priceMaxManwon) {
          if (queryInfo.tradeType === "rent") {
            const rentMin = apt.rent_min || Math.round(apt.price_min * 0.55);
            if (rentMin > queryInfo.priceMaxManwon) continue;
          } else {
            if (apt.price_min > queryInfo.priceMaxManwon) continue;
          }
        }

        // 가격 하한
        if (queryInfo.isPriceLowerBound && queryInfo.priceMinManwon) {
          if (queryInfo.tradeType === "rent") {
            const rentMax = apt.rent_max || Math.round(apt.price_max * 0.6);
            if (rentMax < queryInfo.priceMinManwon) continue;
          } else {
            if (apt.price_max < queryInfo.priceMinManwon) continue;
          }
        }

        // 평형 필터
        if (queryInfo.minPyeong && apt.area_pyeong && apt.area_pyeong < queryInfo.minPyeong) continue;
        if (queryInfo.maxPyeong && apt.area_pyeong && apt.area_pyeong > queryInfo.maxPyeong) continue;

        list.push({
          ...apt,
          walk_minutes: walkMin,
          station: stationLoc.name,
          station_dist: `${stationLoc.name} 도보 ${walkMin}분 (${distM}m)`,
          distMeters: distM,
        });
      }
      return list;
    };

    let stationMatched = checkAptList(maxAllowedMeters);

    // 1차 반경에서 3개 미만인 경우 3km(도보 35분 생활권)까지 자동 확장
    if (stationMatched.length < 3) {
      stationMatched = checkAptList(3000);
    }

    stationMatched.sort((a, b) => a.distMeters - b.distMeters);
    filtered = stationMatched;
  } else if (keywords.length > 0 || queryInfo.targetPriceManwon !== undefined) {
    const scored = allApartments
      .map((apt) => ({ apt, score: scoreApartment(apt, queryInfo) }))
      .filter((item) => item.score > 0);

    scored.sort((a, b) => b.score - a.score);
    filtered = scored.map((item) => item.apt);
  }

  // 가격 요약 텍스트
  if (queryInfo.isPriceUpperBound && queryInfo.priceMaxManwon) {
    summaryParts.push(`${Math.round(queryInfo.priceMaxManwon / 10000)}억 이하`);
  } else if (queryInfo.isPriceLowerBound && queryInfo.priceMinManwon) {
    summaryParts.push(`${Math.round(queryInfo.priceMinManwon / 10000)}억 이상`);
  } else if (queryInfo.targetPriceManwon) {
    summaryParts.push(`${Math.round(queryInfo.targetPriceManwon / 10000)}억대`);
  }

  // 평형 요약 텍스트
  if (queryInfo.minPyeong) {
    summaryParts.push(`${queryInfo.minPyeong}평대`);
  }

  // 중심 좌표가 없으면 결과 단지 평균 좌표로 설정
  if (!targetCenter && filtered.length > 0) {
    const validApts = filtered.filter((a) => a.lat && a.lng);
    if (validApts.length > 0) {
      const sample = validApts.slice(0, Math.min(8, validApts.length));
      const avgLat = sample.reduce((sum, a) => sum + a.lat, 0) / sample.length;
      const avgLng = sample.reduce((sum, a) => sum + a.lng, 0) / sample.length;
      targetCenter = { lat: avgLat, lng: avgLng };
    }
  }

  const summaryBadge = summaryParts.length > 0
    ? `조건 분석: [${summaryParts.join(" · ")}] 기준 총 ${filtered.length}개 단지 발견`
    : `검색어 기준 총 ${filtered.length}개 단지 발견`;

  return {
    apartments: filtered,
    targetCenter,
    queryInfo,
    summaryBadge,
  };
}

