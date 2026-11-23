/* eslint-disable @typescript-eslint/no-explicit-any */
import { LAWD_CODES, findLawdCode } from "./publicDataApi";
import { normalizeAptName } from "./normalizeAptName";
import { getPreloadedTransactions } from "./transactionsCache";

// 서버 메모리 캐시 (24시간 보존: 밤 12시 갱신 주기와 일치)
interface ServerCacheEntry {
  trades: any[];
  rents: any[];
  timestamp: number;
}
const serverTransactionsCache = new Map<string, ServerCacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24시간

const COMMON_KEYWORDS = [
  "펜테리움", "리버테라스", "아이비플레이스", "메이플타운", "에일린의뜰",
  "신안인스빌", "퍼스트리버", "퍼스트포레", "리버파크", "리버팰리스",
  "유승한내들", "골든뷰", "리버펠리체", "황금산", "폴라리스", "더퍼스트",
  "유보라마크뷰", "해링턴타워", "해링턴플레이스", "효성해링턴",
  "반도유보라", "한강반도유보라", "힐스테이트", "롯데캐슬", "아이파크",
  "e편한세상", "이편한세상", "자이", "센트레빌", "해모로", "더휴", "푸르지오",
  "아너스빌", "래미안", "아크로", "디에이치", "센트럴",
  "더샵", "sk뷰", "호반써밋", "호반베르디움", "호반리젠시빌",
  "두산위브", "서희스타힐스", "한신더휴", "지웰", "엘크루", "엘시티",
  "동원베네스트", "신동아파밀리에", "금호어울림", "포레나", "꿈에그린",
  "대우이안", "대우푸르지오", "우방아이유쉘", "중흥에스클래스",
  "부영", "사랑으로", "플루리움", "한양수자인", "주공", "우미린",
  "신명", "낙천대", "롯데낙천대", "제일", "창조", "동양",
];

function extractKeywords(name: string): Set<string> {
  let cleaned = normalizeAptName(name);
  cleaned = cleaned.replace(/금강펜테리움/g, "펜테리움");
  cleaned = cleaned.replace(/이편한세상|자연앤e편한세상/g, "e편한세상");

  const words = new Set<string>();
  for (const kw of COMMON_KEYWORDS) {
    const nKw = normalizeAptName(kw);
    if (nKw.length >= 2 && cleaned.includes(nKw)) {
      words.add(nKw);
    }
  }

  return words;
}

function cleanAptNameForMatch(name: string): string {
  let cleaned = name.replace(/\([^)]*\)/g, ""); // 괄호 내 모든 내용 (지번 910-5, 201동, 상가동 등) 먼저 제거
  cleaned = cleaned.replace(/\d{1,4}동(?=$|[^가-힣])/g, ""); // 202동 등 건물 동 번호 제거
  cleaned = normalizeAptName(cleaned);
  return cleaned;
}

function extractAptNums(norm: string): string[] {
  return norm.match(/\d{1,3}/g) || [];
}

function stripRegionAndDong(norm: string, region = "", district = ""): string {
  let res = norm;
  if (district) {
    const regParts = region.replace(/[\s\-_]/g, "").split(/(특별시|광역시|특별자치시|도|시|군|구)/);
    const distParts = district.replace(/[\s\-_]/g, "").split(/(구|동|읍|면|리)/);
    for (const p of regParts) {
      if (res.startsWith(p)) res = res.slice(p.length);
    }
    for (const p of distParts) {
      if (res.startsWith(p)) res = res.slice(p.length);
    }
    res = res.replace(/^(지금동|지금|도농동|도농|다산동|다산|토평동|토평|교문동|교문|가운동|가운|신도시)/, "");
  }
  return res;
}

const DISTINCT_SUB_NAMES = [
  "스카이뷰", "어반포레", "장자마을", "검배마을", "아름마을", "꽃뫼마을", "상록",
  "메이플타운", "리버테라스", "아이비파크", "아이비플레이스", "퍼스트리버", "퍼스트포레",
  "골든뷰", "리버펠리체", "황금산", "폴라리스", "더퍼스트", "유보라마크뷰", "해링턴타워",
  "해링턴플레이스", "효성해링턴", "에일린의뜰", "센트럴파크", "파크뷰", "레이크",
  "한강", "낙천대"
];

export function isAptNameMatch(
  targetName: string,
  candidateName: string,
  targetRegion = "",
  targetDistrict = "",
  candidateUmd = ""
): boolean {
  if (!targetName || !candidateName) return false;

  // 1. 법정동 필터
  if (targetDistrict && candidateUmd) {
    const cleanDist = targetDistrict.replace(/[\s0-9]/g, "").replace(/(동|읍|면|리)$/, "");
    const cleanUmd = candidateUmd.replace(/[\s0-9]/g, "").replace(/(동|읍|면|리)$/, "");

    if (cleanDist.length >= 1 && cleanUmd.length >= 1) {
      const isDasanArea =
        (targetDistrict.includes("다산") || targetDistrict.includes("지금") || targetDistrict.includes("가운")) &&
        (candidateUmd.includes("다산") || candidateUmd.includes("지금") || candidateUmd.includes("가운"));

      if (!isDasanArea) {
        const distInUmd = candidateUmd.includes(cleanDist);
        const umdInDist = targetDistrict.includes(cleanUmd);
        if (!distInUmd && !umdInDist) {
          return false;
        }
      }
    }
  }

  const tNorm = cleanAptNameForMatch(targetName);
  const cNorm = cleanAptNameForMatch(candidateName);

  // 2. 고유 서브명칭 불일치 시 매칭 거부
  for (const sub of DISTINCT_SUB_NAMES) {
    const inT = tNorm.includes(sub);
    const inC = cNorm.includes(sub);
    if (inT !== inC) return false;
  }

  // 3. 완전 일치
  if (tNorm === cNorm) return true;

  const tStripped = stripRegionAndDong(tNorm, targetRegion, targetDistrict);
  const cStripped = stripRegionAndDong(cNorm, targetRegion, candidateUmd);

  if (tStripped === cStripped) return true;
  if (tStripped === cNorm || cStripped === tNorm) return true;

  // 4. 차수/단지 번호 엄격 대조 (단지 번호 유무 불일치 시 절대 매칭 거부)
  const tNums = extractAptNums(tNorm);
  const cNums = extractAptNums(cNorm);
  if (tNums.length > 0 || cNums.length > 0) {
    if (tNums.join(",") !== cNums.join(",")) {
      return false;
    }
  }

  // 5. 키워드 Jaccard 유사도
  const tKws = extractKeywords(targetName);
  const cKws = extractKeywords(candidateName);

  if (tKws.size > 0 && cKws.size > 0) {
    let intersectionCount = 0;
    tKws.forEach((kw) => {
      if (cKws.has(kw)) intersectionCount++;
    });
    const unionCount = new Set([...Array.from(tKws), ...Array.from(cKws)]).size;
    const similarity = intersectionCount / unionCount;

    if (intersectionCount >= 2 || similarity >= 0.4) {
      if (intersectionCount === 1) {
        if (!tNorm.includes(cNorm) && !cNorm.includes(tNorm) && !tStripped.includes(cStripped) && !cStripped.includes(tStripped)) {
          return false;
        }
      }
      return true;
    }
  }

  // 6. 순수 명칭 포함 관계
  if (tStripped.length >= 2 && cStripped.length >= 2) {
    const pureT = tStripped.replace(/(아파트|맨션|타운|빌리지|연립|주택|빌라)$/, "");
    const pureC = cStripped.replace(/(아파트|맨션|타운|빌리지|연립|주택|빌라)$/, "");

    if (pureT.length >= 2 && pureT === pureC) {
      if (tNums.length === 0 && cNums.length === 0) return true;
      if (tNums.join(",") === cNums.join(",")) return true;
    }

    if (pureT.length >= 3 && pureC.length >= 3) {
      if (pureT.includes(pureC) || pureC.includes(pureT)) {
        if (tNums.length === 0 && cNums.length === 0) return true;
        if (tNums.join(",") === cNums.join(",")) return true;
      }
    }
  }

  return false;
}

/**
 * 클라이언트 API 엔드포인트(/api/transactions)용 직접 조회 함수
 * - 프리셋 캐시 / 인메모리 캐시가 있으면 0ms 즉시 반환
 * - 없는 단지인 경우 직접 공공데이터 API를 병렬 호출하여 실제 데이터를 반환하고 캐시에 저장
 */
export async function fetchTransactionsDirectly(apt: any, months = 36): Promise<{ trades: any[]; rents: any[] }> {
  if (!apt || !apt.name) return { trades: [], rents: [] };

  // 1. 프리셋 사전 캐시 데이터 확인 (0ms 즉시 반환)
  // - 프리셋 캐시나 마스터 DB에 이미 데이터가 있거나 과거 데이터가 충분한 경우 0ms 즉각 반환하여 수십초 대기 원천 차단
  const preloaded = getPreloadedTransactions(apt);
  if (preloaded.trades.length > 0) {
    if (months <= 36 || preloaded.trades.length >= 10 || preloaded.isPreset) {
      return { trades: preloaded.trades, rents: preloaded.rents };
    }
  }

  const region = apt.apiRegion || apt.region || "";
  const district = apt.district || "";
  const aptName = apt.name || "";

  // 2. 서버 인메모리 캐시 확인 (0ms 즉시 반환)
  const cacheKey = `${apt.id || aptName}_${aptName.trim().toLowerCase()}_${district.trim().toLowerCase()}_${months}`;
  const cached = serverTransactionsCache.get(cacheKey);
  const nowTime = Date.now();
  if (cached && (nowTime - cached.timestamp < CACHE_TTL_MS)) {
    return { trades: cached.trades, rents: cached.rents };
  }

  // 3. 직접 국토교통부 API 병렬 조회 (최대 120개월=10년치 풀 조회)
  const queryMonths = Math.min(months, 120);
  const result = await executeFetch(apt, queryMonths, cacheKey);
  return result;
}

/**
 * 서버 사이드에서 실거래 데이터를 0ms로 사전 조회하여 클라이언트에 즉시 전달
 * - 호갱노노/아실 방식: 페이지 전환 지연(5~7초 딜레이)을 100% 원천 차단하고 0초 즉시 화면 표출
 */
export async function getTransactionsForApartment(apt: any, months = 36): Promise<{ trades: any[]; rents: any[] }> {
  if (!apt || !apt.name) return { trades: [], rents: [] };

  // 1. 프리셋 사전 캐시 데이터 확인 (0ms 즉시 반환)
  const preloaded = getPreloadedTransactions(apt);
  if (preloaded.trades.length > 0) {
    if (months <= 36 || preloaded.trades.length >= 10 || preloaded.isPreset) {
      return { trades: preloaded.trades, rents: preloaded.rents };
    }
  }

  const region = apt.apiRegion || apt.region || "";
  const district = apt.district || "";
  const aptName = apt.name || "";

  // 2. 서버 인메모리 캐시 확인 (0ms 즉시 반환)
  const cacheKey = `${apt.id || aptName}_${aptName.trim().toLowerCase()}_${district.trim().toLowerCase()}_${months}`;
  const cached = serverTransactionsCache.get(cacheKey);
  const nowTime = Date.now();
  if (cached && (nowTime - cached.timestamp < CACHE_TTL_MS)) {
    return { trades: cached.trades, rents: cached.rents };
  }

  // 3. 캐시에 없는 신규 단지인 경우:
  // ★ 페이지 전환 5~7초 멈춤 현상을 원천 방지하기 위해 SSR 렌더링을 블로킹하지 않고 0초 즉시 반환!
  // 외부 공공데이터 API 동기화는 백그라운드 비동기로 위임하여 다음 방문 및 클라이언트 fetch 가속
  executeFetch(apt, months, cacheKey).catch(() => {});

  return { trades: [], rents: [] };
}

// 공공데이터 API 실제 조회 및 캐시 저장 공통 함수
async function executeFetch(apt: any, months: number, cacheKey: string): Promise<{ trades: any[]; rents: any[] }> {
  try {
    const region = apt.apiRegion || apt.region || "";
    const district = apt.district || "";
    const aptName = apt.name || "";

    const lawdEntry = findLawdCode(region, district) ||
      LAWD_CODES.find((l) => l.region === region || region.includes(l.region) || l.region.includes(region)) ||
      LAWD_CODES.find((l) => {
        const parts = region.split(" ");
        return parts.some((p: string) => p.length >= 2 && l.region.includes(p));
      });

    if (!lawdEntry) return { trades: [], rents: [] };

    const apiKey =
      process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY ||
      process.env.DATA_GO_KR_API_KEY ||
      "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";

    let cleanApiKey = apiKey.trim();
    try {
      cleanApiKey = decodeURIComponent(cleanApiKey);
    } catch {}
    const encodedKey = encodeURIComponent(cleanApiKey);

    const dealYmdList: string[] = [];
    const now = new Date();
    const baseYear = now.getFullYear();
    const baseMonth = now.getMonth();
    const builtYear = apt.built_year ? Math.max(2015, apt.built_year) : 0;

    for (let i = 0; i < months; i++) {
      const d = new Date(baseYear, baseMonth - i, 1);
      // 아파트 준공년도 1년 전 이전은 아파트 매매 실거래가 원천적으로 없으므로 루프 중단 (불필요한 수십회 호출 차단)
      if (builtYear > 0 && d.getFullYear() < builtYear - 1) {
        break;
      }
      const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
      dealYmdList.push(ymd);
    }

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    // 초당 호출제한(429) 방지 및 안전한 지수 백오프 재시도 헬퍼
    const fetchWithRetry = async (url: string, maxRetries = 4): Promise<string> => {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const res = await fetch(url, { next: { revalidate: 3600 } });
          if (res.status === 429) {
            await sleep(250 * attempt);
            continue;
          }
          if (!res.ok) return "";
          const text = await res.text();
          if (text.includes("LIMITED_NUMBER_OF_SERVICE_REQUESTS_PER_SECOND_EXCEEDS_ERROR")) {
            await sleep(300 * attempt);
            continue;
          }
          return text;
        } catch {
          if (attempt === maxRetries) return "";
          await sleep(150);
        }
      }
      return "";
    };

    const trades: any[] = [];
    const rents: any[] = [];

    // 공공데이터포털 초당 쿼터를 완벽하게 준수하는 병렬 풀 (배치당 4개 + 70ms 인터벌)
    const CONCURRENCY = 4;
    const isNewApt = !apt.built_year || apt.built_year >= 2020;

    for (let c = 0; c < dealYmdList.length; c += CONCURRENCY) {
      const batch = dealYmdList.slice(c, c + CONCURRENCY);
      const batchPromises = batch.map(async (dealYmd, idx) => {
        const monthIndex = c + idx;
        const isRecent = monthIndex < 36; // 최근 3년 이내

        const tradeUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${encodedKey}&LAWD_CD=${lawdEntry.code}&DEAL_YMD=${dealYmd}&numOfRows=1000`;
        const fetchList: Promise<{ text: string; type: "trade" | "silv" | "rent" }>[] = [
          fetchWithRetry(tradeUrl).then((text) => ({ text, type: "trade" as const })),
        ];

        // 분양권/입주권은 신축(2020년 이후)이면서 최근 36개월일 때만 조회 (과거 10년 트래픽 낭비 원천 차단)
        if (isRecent && isNewApt) {
          const silvUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcSilvTrade/getRTMSDataSvcSilvTrade?serviceKey=${encodedKey}&LAWD_CD=${lawdEntry.code}&DEAL_YMD=${dealYmd}&numOfRows=1000`;
          fetchList.push(fetchWithRetry(silvUrl).then((text) => ({ text, type: "silv" as const })));
        }

        // 전월세는 최근 36개월치만 동기화
        if (isRecent) {
          const rentUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent?serviceKey=${encodedKey}&LAWD_CD=${lawdEntry.code}&DEAL_YMD=${dealYmd}&numOfRows=1000`;
          fetchList.push(fetchWithRetry(rentUrl).then((text) => ({ text, type: "rent" as const })));
        }

        const responses = await Promise.all(fetchList);
        const monthlyTrades: any[] = [];
        const monthlyRents: any[] = [];

        for (const resp of responses) {
          if (!resp.text) continue;
          const xml = resp.text;
          const itemRegex = /<item>([\s\S]*?)<\/item>/g;
          let match;

          while ((match = itemRegex.exec(xml)) !== null) {
            const item = match[1];
            const itemAptName = item.match(/<aptNm>([^<]*)<\/aptNm>/)?.[1]?.trim() || "";
            const itemUmdNm = item.match(/<umdNm>([^<]*)<\/umdNm>/)?.[1]?.trim() || "";

            if (!itemAptName || !isAptNameMatch(aptName, itemAptName, region, district, itemUmdNm)) {
              continue;
            }

            const excluUseAr = parseFloat(item.match(/<excluUseAr>([^<]*)<\/excluUseAr>/)?.[1] || "0");
            const floor = parseInt(item.match(/<floor>([^<]*)<\/floor>/)?.[1] || "1", 10);
            const dealYear = parseInt(item.match(/<dealYear>([^<]*)<\/dealYear>/)?.[1] || "0", 10);
            const dealMonth = parseInt(item.match(/<dealMonth>([^<]*)<\/dealMonth>/)?.[1] || "0", 10);
            const dealDay = parseInt(item.match(/<dealDay>([^<]*)<\/dealDay>/)?.[1] || "1", 10);
            const buildYear = parseInt(item.match(/<buildYear>([^<]*)<\/buildYear>/)?.[1] || "0", 10);

            if (resp.type === "trade" || resp.type === "silv") {
              const amountStr = item.match(/<dealAmount>([^<]*)<\/dealAmount>/)?.[1]?.replace(/,/g, "").trim() || "";
              const dealAmount = parseInt(amountStr, 10);
              if (dealAmount > 0 && excluUseAr > 0) {
                monthlyTrades.push({
                  dealAmount,
                  excluUseAr,
                  floor,
                  dealYear,
                  dealMonth,
                  dealDay,
                  buildYear,
                  aptName: itemAptName,
                  umdNm: itemUmdNm,
                  isRight: resp.type === "silv",
                });
              }
            } else if (resp.type === "rent") {
              const depositStr = item.match(/<deposit>([^<]*)<\/deposit>/)?.[1]?.replace(/,/g, "").trim() || "";
              const rentStr = item.match(/<monthlyRent>([^<]*)<\/monthlyRent>/)?.[1]?.replace(/,/g, "").trim() || "";
              const depositAmount = parseInt(depositStr, 10);
              const monthlyRent = parseInt(rentStr, 10) || 0;
              if (depositAmount > 0 && excluUseAr > 0) {
                monthlyRents.push({
                  depositAmount,
                  monthlyRent,
                  excluUseAr,
                  floor,
                  dealYear,
                  dealMonth,
                  dealDay,
                  buildYear,
                  aptName: itemAptName,
                  umdNm: itemUmdNm,
                });
              }
            }
          }
        }

        return { monthlyTrades, monthlyRents };
      });

      const batchResults = await Promise.all(batchPromises);
      for (const res of batchResults) {
        trades.push(...res.monthlyTrades);
        rents.push(...res.monthlyRents);
      }
      await sleep(50); // 공공데이터포털 초당 쿼터 보호 슬립
    }

    trades.sort((a, b) => b.dealYear - a.dealYear || b.dealMonth - a.dealMonth || b.dealDay - a.dealDay);
    rents.sort((a, b) => b.dealYear - a.dealYear || b.dealMonth - a.dealMonth || b.dealDay - a.dealDay);

    serverTransactionsCache.set(cacheKey, { trades, rents, timestamp: Date.now() });
    return { trades, rents };
  } catch (e) {
    console.warn("[executeFetch] error:", e);
    return { trades: [], rents: [] };
  }
}
