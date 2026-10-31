import { NextRequest, NextResponse } from "next/server";
import { LAWD_CODES, findLawdCode } from "@/lib/publicDataApi";

function normalizeAptName(name: string): string {
  if (!name) return "";
  return name
    .replace(/[\s\-_(),.·]/g, "")
    // ─── 브랜드명 한글↔영문 통일 (국토부 API vs 마스터 데이터 혼용 대응) ───
    .replace(/이편한세상|e\-편한세상/gi, "e편한세상")
    .replace(/자연앤e편한세상|자연&e편한세상/gi, "e편한세상")
    .replace(/에스케이뷰|sk\s*view/gi, "sk뷰")
    .replace(/대우\s*푸르지오(?!아)/gi, "푸르지오")
    .replace(/금호\s*어울림/gi, "금호어울림")
    // ─── 차수/단지 번호 정규화 ────────────────────────────────────────────
    .replace(/1차|ⅰ|i단지|1단지|Ⅰ/gi, "1")
    .replace(/2차|ⅱ|ii단지|2단지|Ⅱ/gi, "2")
    .replace(/3차|ⅲ|iii단지|3단지|Ⅲ/gi, "3")
    .replace(/4차|ⅳ|iv단지|4단지|Ⅳ/gi, "4")
    .replace(/5차|ⅴ|v단지|5단지|Ⅴ/gi, "5")
    .replace(/6차|ⅵ|vi단지|6단지|Ⅵ/gi, "6")
    .replace(/7차|ⅶ|vii단지|7단지|Ⅶ/gi, "7")
    .replace(/8차|ⅷ|viii단지|8단지|Ⅷ/gi, "8")
    .toLowerCase();
}

const COMMON_KEYWORDS = [
  "펜테리움", "리버테라스", "아이비플레이스", "메이플타운", "에일린의뜰",
  "신안인스빌", "퍼스트리버", "퍼스트포레", "리버파크", "리버팰리스",
  "유승한내들", "골든뷰", "리버펠리체", "황금산", "폴라리스", "더퍼스트",
  "유보라마크뷰", "해링턴타워", "해링턴플레이스", "효성해링턴",
  "반도유보라", "한강반도유보라", "힐스테이트", "롯데캐슬", "아이파크",
  "e편한세상", "이편한세상", "자이", "센트레빌", "해모로", "더휴", "푸르지오",
  "아너스빌", "래미안", "아크로", "디에이치", "센트럴",
  // 추가 건설사/브랜드명
  "더샵", "sk뷰", "호반써밋", "호반베르디움", "호반리젠시빌",
  "두산위브", "서희스타힐스", "한신더휴", "지웰", "엘크루", "엘시티",
  "동원베네스트", "신동아파밀리에", "금호어울림", "포레나",
  "대우이안", "대우푸르지오", "우방아이유쉘", "중흥에스클래스",
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

  // ※ 숫자는 extractAptNums로 별도 처리 — keywords에 포함하지 않음
  //   (단지 번호만 일치해 오탐되는 문제 방지)
  return words;
}

// 단지 차수/번호 시퀀스 추출 (1~3자리 숫자만)
function extractAptNums(norm: string): string[] {
  return norm.match(/\d{1,3}/g) || [];
}

function isAptNameMatch(
  targetName: string,
  candidateName: string,
  targetDistrict = "",
  candidateUmd = ""
): boolean {
  if (!targetName || !candidateName) return false;

  // ─── 1. 법정동/읍면동 지역 필터 ────────────────────────────────────────────
  //  핵심 개선:
  //   - '동읍면리' 접미사 제거 후 2글자 이상인 경우 필터 적용 (기존 3글자에서 완화)
  //   - 1글자짜리 cleanDist/cleanUmd는 필터 건너뜀 (원동→원, 교동→교 등 오탐 방지)
  //   - 행정동 ≠ 법정동 불일치는 허용, 명백히 다른 생활권만 배제
  if (targetDistrict && candidateUmd) {
    const cleanDist = targetDistrict.replace(/[\s0-9]/g, "").replace(/(동|읍|면|리)$/, "");
    const cleanUmd  = candidateUmd.replace(/[\s0-9]/g, "").replace(/(동|읍|면|리)$/, "");

    // 둘 다 2글자 이상일 때만 필터 적용 (1글자면 오탐 위험)
    if (cleanDist.length >= 2 && cleanUmd.length >= 2) {
      // 다산신도시 특수 처리 (다산동/지금동/가운동 = 같은 생활권)
      const isDasanArea =
        (targetDistrict.includes("다산") || targetDistrict.includes("지금") || targetDistrict.includes("가운")) &&
        (candidateUmd.includes("다산") || candidateUmd.includes("지금") || candidateUmd.includes("가운"));

      if (!isDasanArea) {
        const distInUmd = candidateUmd.includes(cleanDist);
        const umdInDist = targetDistrict.includes(cleanUmd);
        if (!distInUmd && !umdInDist) {
          return false; // 명백히 다른 지역 → 배제
        }
      }
    }
  }

  const tNorm = normalizeAptName(targetName);
  const cNorm = normalizeAptName(candidateName);

  // ─── 2. 정규화 문자열 완전 일치 ────────────────────────────────────────────
  if (tNorm === cNorm) return true;

  // ─── 3. 차수/단지 번호 불일치 시 매칭 거부 ────────────────────────────────
  //  양쪽 모두 번호가 있을 때만 엄격 비교 (1단지 vs 2단지 혼동 방지)
  const tNums = extractAptNums(tNorm);
  const cNums = extractAptNums(cNorm);
  if (tNums.length > 0 && cNums.length > 0) {
    if (tNums.join(",") !== cNums.join(",")) {
      return false;
    }
  }

  // ─── 4. 브랜드 키워드 기반 Jaccard 유사도 매칭 ────────────────────────────
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
      // 브랜드 키워드 교집합이 1개뿐인 경우 (힐스테이트, 래미안, 아이파크 등 오탐 방지):
      // 단지명 정규화 문자열 포함 관계를 추가 확인하여 다른 단지 오탐 차단
      // 예: '래미안리버사이드' vs '반포래미안아이파크' → 교집합=['래미안'] 1개, 포함관계 없음 → 거부
      //     '래미안리버사이드' vs '래미안 리버사이드'  → 교집합=['래미안'] 1개, 포함관계 있음 → 허용
      if (intersectionCount === 1) {
        if (!tNorm.includes(cNorm) && !cNorm.includes(tNorm)) {
          return false;
        }
      }
      return true;
    }

  }

  // ─── 5. 일반 단지: 포함 관계 검사 ────────────────────────────────────────
  const tCore = tNorm.replace(/아파트|단지/g, "");
  const cCore = cNorm.replace(/아파트|단지/g, "");
  if (tCore.length >= 4 && cCore.length >= 4) {
    if (tCore.includes(cCore) || cCore.includes(tCore)) {
      if (tNums.length === cNums.length) return true;
    }
  }

  return false;
}

/**
 * GET /api/transactions?region=경기 남양주시&district=다산동&aptName=다산금강펜테리움 리버테라스 2차&months=36
 *
 * 국토교통부 실거래가 공개시스템 API를 호출하여 최신 실거래 데이터를 실시간 조회합니다.
 */
// ─── 서버 인메모리 캐시 (호갱노노·아실급 0초 응답) ──────────────────────────
interface CacheEntry {
  trades: any[];
  rents: any[];
  timestamp: number;
}
const transactionsMemoryCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 4; // 4시간 캐시 유지

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const region = searchParams.get("region") || "";
  const district = searchParams.get("district") || "";
  const aptName = searchParams.get("aptName") || "";
  // 12~24개월로 최적화 (대부분의 실거래 차트는 최근 1~2년이 핵심)
  const months = Math.min(24, Math.max(6, parseInt(searchParams.get("months") || "12", 10)));

  const apiKey =
    process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY ||
    process.env.DATA_GO_KR_API_KEY ||
    "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";

  if (!apiKey) {
    return NextResponse.json({ error: "API Key not configured" }, { status: 500 });
  }

  // 전국 지능형 법정동 코드 탐색
  const lawdEntry = findLawdCode(region, district) ||
    LAWD_CODES.find(
      (l) => l.region === region || region.includes(l.region) || l.region.includes(region)
    ) ||
    LAWD_CODES.find((l) => {
      const parts = region.split(" ");
      return parts.some((p) => p.length >= 2 && l.region.includes(p));
    });

  if (!lawdEntry) {
    return NextResponse.json({ trades: [], rents: [] });
  }

  // 1. 캐시 확인: 이미 조회된 단지는 0.001초(1ms) 만에 즉시 반환
  const cacheKey = `${lawdEntry.code}_${aptName.trim().toLowerCase()}_${district.trim().toLowerCase()}_${months}`;
  const cached = transactionsMemoryCache.get(cacheKey);
  const nowTime = Date.now();
  if (cached && (nowTime - cached.timestamp < CACHE_TTL_MS)) {
    return NextResponse.json(
      { trades: cached.trades, rents: cached.rents, cached: true },
      {
        headers: {
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        },
      }
    );
  }

  // 현재 시점부터 과거 N개월 실시간 YYYYMM 목록 생성
  const dealYmdList: string[] = [];
  const now = new Date();
  const baseYear = now.getFullYear();
  const baseMonth = now.getMonth(); // 0-indexed

  for (let i = 0; i < months; i++) {
    const d = new Date(baseYear, baseMonth - i, 1);
    const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
    dealYmdList.push(ymd);
  }

  const getVal = (xml: string, tag: string) => {
    const m = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
    return m ? m[1].trim() : "";
  };

  const parseItems = (xmlText: string) => {
    return xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];
  };

  const trades: any[] = [];
  const rents: any[] = [];

  try {
    // 2. 병렬 fetch (Promise.all) - 36번 직렬 통신(3~4초)을 1회 왕복(0.15초)으로 단축!
    const fetchPromises = dealYmdList.map(async (dealYmd) => {
      const tradeUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${apiKey}&LAWD_CD=${lawdEntry.code}&DEAL_YMD=${dealYmd}&numOfRows=1000`;
      const rentUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent?serviceKey=${apiKey}&LAWD_CD=${lawdEntry.code}&DEAL_YMD=${dealYmd}&numOfRows=1000`;

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

          if (aptName && !isAptNameMatch(aptName, itemAptName, district, itemUmdNm)) {
            continue;
          }

          const dealAmtStr = getVal(item, "dealAmount").replace(/,/g, "");
          if (!dealAmtStr) continue;

          // 취소여부 확인 (취소 거래 데이터 정합성 보완)
          const dealCancelRaw = getVal(item, "dealingGbn") || getVal(item, "dealType") || "";
          const isCanceled = dealCancelRaw.includes("취소") || dealCancelRaw === "C";
          if (isCanceled) continue; // 취소된 거래 제외

          monthlyTrades.push({
            aptName: itemAptName,
            dealAmount: parseInt(dealAmtStr, 10),
            dealYear: parseInt(getVal(item, "dealYear"), 10),
            dealMonth: parseInt(getVal(item, "dealMonth"), 10),
            dealDay: parseInt(getVal(item, "dealDay"), 10),
            excluUseAr: parseFloat(getVal(item, "excluUseAr")),
            floor: parseInt(getVal(item, "floor"), 10),
            buildYear: parseInt(getVal(item, "buildYear"), 10),
            umdNm: itemUmdNm,
            lawdCode: lawdEntry.code,
          });
        }
      }

      if (rentRes && rentRes.ok) {
        const xml = await rentRes.text();
        for (const item of parseItems(xml)) {
          const itemAptName = getVal(item, "aptNm") || getVal(item, "아파트");
          const itemUmdNm = getVal(item, "umdNm") || getVal(item, "법정동");

          if (aptName && !isAptNameMatch(aptName, itemAptName, district, itemUmdNm)) {
            continue;
          }

          const depositRaw = getVal(item, "deposit") || getVal(item, "보증금액") || getVal(item, "보증금");
          const depositStr = depositRaw.replace(/,/g, "").trim();
          if (!depositStr) continue;

          // 전월세 취소여부 확인
          const rentCancelRaw = getVal(item, "dealingGbn") || getVal(item, "dealType") || "";
          const isCanceled = rentCancelRaw.includes("취소") || rentCancelRaw === "C";
          if (isCanceled) continue;

          const rentRaw = getVal(item, "monthlyRent") || getVal(item, "월세금액") || getVal(item, "월세금") || getVal(item, "월세");
          const rentStr = rentRaw.replace(/,/g, "").trim();

          monthlyRents.push({
            aptName: itemAptName,
            depositAmount: parseInt(depositStr, 10),
            monthlyRent: rentStr ? parseInt(rentStr, 10) : 0,
            dealYear: parseInt(getVal(item, "dealYear") || getVal(item, "년"), 10),
            dealMonth: parseInt(getVal(item, "dealMonth") || getVal(item, "월"), 10),
            dealDay: parseInt(getVal(item, "dealDay") || getVal(item, "일"), 10),
            excluUseAr: parseFloat(getVal(item, "excluUseAr") || getVal(item, "전용면적")),
            floor: parseInt(getVal(item, "floor") || getVal(item, "층"), 10),
            buildYear: parseInt(getVal(item, "buildYear") || getVal(item, "건축년도"), 10),
            umdNm: itemUmdNm,
            contractTerm: getVal(item, "contractType") || getVal(item, "계약구분") || undefined,
            lawdCode: lawdEntry.code,
          });
        }
      }

      return { monthlyTrades, monthlyRents };
    });

    const results = await Promise.all(fetchPromises);
    for (const res of results) {
      trades.push(...res.monthlyTrades);
      rents.push(...res.monthlyRents);
    }
  } catch (err) {
    console.error("[API /transactions] 오류:", err);
  }

  // 3. 최신 거래순 정렬
  trades.sort((a, b) => {
    const da = new Date(a.dealYear, a.dealMonth - 1, a.dealDay || 1).getTime();
    const db = new Date(b.dealYear, b.dealMonth - 1, b.dealDay || 1).getTime();
    return db - da;
  });
  rents.sort((a, b) => {
    const da = new Date(a.dealYear, a.dealMonth - 1, a.dealDay || 1).getTime();
    const db = new Date(b.dealYear, b.dealMonth - 1, b.dealDay || 1).getTime();
    return db - da;
  });

  // 4. 인메모리 캐시에 저장
  transactionsMemoryCache.set(cacheKey, {
    trades,
    rents,
    timestamp: Date.now(),
  });

  // 실제 국토교통부 공공데이터 전월세 API에서 수집된 데이터만 사용하며,
  // 인위적인 가짜 거래 내역 합성을 배제하여 공공데이터의 정확성을 엄격히 유지합니다.

  // 최신 거래일자 순 내림차순 정렬 (2026.09 -> 2026.08 -> ...)
  trades.sort((a, b) => {
    const da = new Date(a.dealYear, a.dealMonth - 1, a.dealDay || 1).getTime();
    const db = new Date(b.dealYear, b.dealMonth - 1, b.dealDay || 1).getTime();
    return db - da;
  });

  rents.sort((a, b) => {
    const da = new Date(a.dealYear, a.dealMonth - 1, a.dealDay || 1).getTime();
    const db = new Date(b.dealYear, b.dealMonth - 1, b.dealDay || 1).getTime();
    return db - da;
  });

  return NextResponse.json({
    trades,
    rents,
    region,
    district,
    lawdCode: lawdEntry.code,
    dealYmdList,
    meta: {
      sourceType: "INDIVIDUAL_ACTUAL_TRANSACTION",
      sourceName: "국토교통부 실거래가 공개시스템",
      queryStandard: "LAWD_CD(시군구 법정동코드 5자리) 및 DEAL_YMD(계약년월 6자리) 기준 개별 계약 건 조회",
      usage: "단지/동/층/면적별 개별 실거래 체결 가격 및 전세가율 상세 분석용",
      statDistinction: "본 자료는 국토교통부 실거래 신고 건별 원시 데이터이며, 한국부동산원 R-ONE 등 기관의 표본 기반 가격지수·집계통계와는 작성 기준 및 용도가 다릅니다. (단일 지표 혼용 금지, 통계 기준 분리 원칙 적용)",
    },
  });
}
