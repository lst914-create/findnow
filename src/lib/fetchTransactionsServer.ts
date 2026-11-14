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

  const tNorm = normalizeAptName(targetName);
  const cNorm = normalizeAptName(candidateName);

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
 * 서버 사이드에서 실거래 데이터를 0ms로 사전 조회하여 클라이언트에 즉시 전달
 */
export async function getTransactionsForApartment(apt: any, months = 36): Promise<{ trades: any[]; rents: any[] }> {
  if (!apt || !apt.name) return { trades: [], rents: [] };

  // 1. 프리셋 데이터가 있으면 0ms 즉시 반환
  const preloaded = getPreloadedTransactions(apt);
  if (preloaded.isPreset && preloaded.trades.length > 0) {
    return { trades: preloaded.trades, rents: preloaded.rents };
  }

  const region = apt.apiRegion || apt.region || "";
  const district = apt.district || "";
  const aptName = apt.name || "";

  // 2. 서버 메모리 캐시 확인
  const cacheKey = `${apt.id}_${aptName.trim().toLowerCase()}_${district.trim().toLowerCase()}_${months}`;
  const cached = serverTransactionsCache.get(cacheKey);
  const nowTime = Date.now();
  if (cached && (nowTime - cached.timestamp < CACHE_TTL_MS)) {
    return { trades: cached.trades, rents: cached.rents };
  }

  // 법정동 코드 탐색
  const lawdEntry = findLawdCode(region, district) ||
    LAWD_CODES.find((l) => l.region === region || region.includes(l.region) || l.region.includes(region)) ||
    LAWD_CODES.find((l) => {
      const parts = region.split(" ");
      return parts.some((p: string) => p.length >= 2 && l.region.includes(p));
    });

  if (!lawdEntry) {
    return { trades: [], rents: [] };
  }

  const apiKey =
    process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY ||
    process.env.DATA_GO_KR_API_KEY ||
    "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";

  let cleanApiKey = apiKey.trim();
  try {
    cleanApiKey = decodeURIComponent(cleanApiKey);
  } catch {}
  const encodedKey = encodeURIComponent(cleanApiKey);

  // YYYYMM 목록
  const dealYmdList: string[] = [];
  const now = new Date();
  const baseYear = now.getFullYear();
  const baseMonth = now.getMonth();

  for (let i = 0; i < months; i++) {
    const d = new Date(baseYear, baseMonth - i, 1);
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
    dealYmdList.push(ymd);
  }

  const getVal = (xml: string, tag: string) => {
    const m = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
    return m ? m[1].trim() : "";
  };
  const parseItems = (xmlText: string) => xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];

  const trades: any[] = [];
  const rents: any[] = [];

  try {
    const CHUNK_SIZE = 12;
    for (let c = 0; c < dealYmdList.length; c += CHUNK_SIZE) {
      const chunk = dealYmdList.slice(c, c + CHUNK_SIZE);
      const chunkPromises = chunk.map(async (dealYmd) => {
        const tradeUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${encodedKey}&LAWD_CD=${lawdEntry.code}&DEAL_YMD=${dealYmd}&numOfRows=1000`;
        const rentUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent?serviceKey=${encodedKey}&LAWD_CD=${lawdEntry.code}&DEAL_YMD=${dealYmd}&numOfRows=1000`;

        const [tradeRes, rentRes] = await Promise.all([
          fetch(tradeUrl, { next: { revalidate: 3600 } }).catch(() => null),
          fetch(rentUrl, { next: { revalidate: 3600 } }).catch(() => null),
        ]);

        const monthlyTrades: any[] = [];
        const monthlyRents: any[] = [];

        if (tradeRes && tradeRes.ok) {
          const xml = await tradeRes.text();
          for (const item of parseItems(xml)) {
            const itemAptName = getVal(item, "aptNm");
            const itemUmdNm = getVal(item, "umdNm");

            if (isAptNameMatch(aptName, itemAptName, region, district, itemUmdNm)) {
              const amountStr = getVal(item, "dealAmount").replace(/,/g, "");
              const dealAmount = parseInt(amountStr, 10);
              const excluUseAr = parseFloat(getVal(item, "excluUseAr"));
              const floor = parseInt(getVal(item, "floor") || "1", 10);
              const dealYear = parseInt(getVal(item, "dealYear"), 10);
              const dealMonth = parseInt(getVal(item, "dealMonth"), 10);
              const dealDay = parseInt(getVal(item, "dealDay"), 10);
              const buildYear = parseInt(getVal(item, "buildYear") || "0", 10);

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
                });
              }
            }
          }
        }

        if (rentRes && rentRes.ok) {
          const xml = await rentRes.text();
          for (const item of parseItems(xml)) {
            const itemAptName = getVal(item, "aptNm");
            const itemUmdNm = getVal(item, "umdNm");

            if (isAptNameMatch(aptName, itemAptName, region, district, itemUmdNm)) {
              const depositStr = getVal(item, "deposit").replace(/,/g, "");
              const rentStr = getVal(item, "monthlyRent").replace(/,/g, "");
              const depositAmount = parseInt(depositStr, 10);
              const monthlyRent = parseInt(rentStr, 10) || 0;
              const excluUseAr = parseFloat(getVal(item, "excluUseAr"));
              const floor = parseInt(getVal(item, "floor") || "1", 10);
              const dealYear = parseInt(getVal(item, "dealYear"), 10);
              const dealMonth = parseInt(getVal(item, "dealMonth"), 10);
              const dealDay = parseInt(getVal(item, "dealDay"), 10);
              const buildYear = parseInt(getVal(item, "buildYear") || "0", 10);

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

      const chunkResults = await Promise.all(chunkPromises);
      for (const res of chunkResults) {
        trades.push(...res.monthlyTrades);
        rents.push(...res.monthlyRents);
      }
    }

    // 최신 계약일자 순 정렬
    trades.sort((a, b) => {
      if (b.dealYear !== a.dealYear) return b.dealYear - a.dealYear;
      if (b.dealMonth !== a.dealMonth) return b.dealMonth - a.dealMonth;
      return b.dealDay - a.dealDay;
    });

    rents.sort((a, b) => {
      if (b.dealYear !== a.dealYear) return b.dealYear - a.dealYear;
      if (b.dealMonth !== a.dealMonth) return b.dealMonth - a.dealMonth;
      return b.dealDay - a.dealDay;
    });

    // 서버 캐시 저장 (24시간)
    serverTransactionsCache.set(cacheKey, { trades, rents, timestamp: Date.now() });

    return { trades, rents };
  } catch (err) {
    console.error("[getTransactionsForApartment] fetch error:", err);
    return { trades: [], rents: [] };
  }
}
