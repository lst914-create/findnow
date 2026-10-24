/**
 * 한국부동산원 청약홈 분양정보 OpenAPI 연동 라이브러리
 * - 아파트 분양공고 목록 & 상세 (getAPTLttotPblancDetail)
 * - 아파트 주택형별 분양가/공급규모 (getAPTLttotPblancMdl)
 * - 무순위/잔여세대 분양공고 (getRemndrLttotPblancDetail)
 * - 무순위 주택형별 분양가 (getRemndrLttotPblancMdl)
 */

import masterSubscriptionsRaw from "./subscriptions-master.json";

export interface SubscriptionModel {
  modelNo: string;
  houseType: string; // 전용면적 타입 (예: "084.9200", "059.8800")
  exclusiveAreaSqm: number; // 전용면적 (m2)
  pyeong: number; // 평형 환산 (예: 25, 34)
  supplyAreaSqm?: number; // 공급면적
  topPriceManwon: number; // 최고 공급금액 (만원)
  supplyUnits: number; // 일반공급 세대수
  specialSupplyUnits: number; // 특별공급 세대수
  subBreakdown?: {
    multiChild?: number; // 다자녀
    newlywed?: number; // 신혼부부
    firstLife?: number; // 생애최초
    oldParents?: number; // 노부모부양
    institution?: number; // 기관추천
    newborn?: number; // 신생아
  };
}

export type SubscriptionStatus =
  | "청약접수중"
  | "접수예정"
  | "마감/발표대기"
  | "발표완료";

export interface SubscriptionNotice {
  id: string; // 주택관리번호 (HOUSE_MANAGE_NO)
  pblancNo: string; // 공고번호 (PBLANC_NO)
  name: string; // 주택명 (HOUSE_NM)
  region: string; // 공급지역명 (SUBSCRPT_AREA_CODE_NM - 예: 서울, 경기, 부산)
  address: string; // 공급위치 (HSSPLY_ADRES)
  zip?: string;
  type: "APT" | "무순위" | "오피스텔";
  detailType: string; // 민영, 국민, 무순위, 공공 등
  rentType: string; // 분양주택, 분양전환공공임대 등
  totalUnits: number; // 총 공급 세대수 (TOT_SUPLY_HSHLDCO)
  recruitDate: string; // 모집공고일 (YYYY-MM-DD)
  receptStartDate: string; // 청약접수 시작일 (YYYY-MM-DD)
  receptEndDate: string; // 청약접수 종료일 (YYYY-MM-DD)
  specialSupplyStartDate?: string; // 특별공급 시작일
  specialSupplyEndDate?: string;
  rank1Date?: string; // 1순위 접수일
  rank2Date?: string; // 2순위 접수일
  winnerAnnounceDate: string; // 당첨자 발표일 (YYYY-MM-DD)
  contractStartDate?: string; // 계약 시작일
  contractEndDate?: string;
  moveInMonth?: string; // 입주예정월 (예: "2027-03")
  company?: string; // 시공사
  developer?: string; // 시행사/사업주체
  tel?: string; // 문의처
  homepage?: string; // 분양 공식 홈페이지
  pblancUrl: string; // 청약홈 원문 상세 URL
  status: SubscriptionStatus;
  statusBadgeColor: string; // tailwind color class
  dDayText: string; // "D-3", "오늘 접수", "접수 마감"
  minPriceManwon?: number; // 최저 분양가 (만원)
  maxPriceManwon?: number; // 최고 분양가 (만원)
  models?: SubscriptionModel[]; // 주택형 모델 목록
}

export interface SubscriptionSummaryStats {
  totalCount: number;
  ongoingCount: number; // 청약접수중
  upcomingCount: number; // 접수예정
  remndrCount: number; // 무순위 줍줍
  seoulCount: number;
  gyeonggiCount: number;
  otherCount: number;
}

// ==========================================
// 메모리 캐시 (10분 TTL)
// ==========================================
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}
const CACHE_TTL_MS = 10 * 60 * 1000;
let noticesCache: CacheEntry<SubscriptionNotice[]> | null = null;
const modelCache = new Map<string, CacheEntry<SubscriptionModel[]>>();

/**
 * 날짜 문자열 YYYY-MM-DD 또는 YYYYMMDD를 표준화
 */
function normalizeDateStr(dateStr?: string | null): string {
  if (!dateStr) return "";
  const cleaned = dateStr.replace(/[^0-9]/g, "");
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
  }
  return dateStr.trim();
}

/**
 * 입주예정월 포맷 (202803 -> 2028년 03월)
 */
function formatMoveInMonth(ym?: string | null): string | undefined {
  if (!ym) return undefined;
  const cleaned = ym.replace(/[^0-9]/g, "");
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 4)}년 ${parseInt(cleaned.slice(4, 6), 10)}월`;
  }
  return ym;
}

/**
 * 청약 상태 및 D-Day 계산
 */
function computeStatusAndDDay(
  receptStartStr: string,
  receptEndStr: string,
  winnerAnnounceStr: string
): { status: SubscriptionStatus; dDayText: string; statusBadgeColor: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parseDate = (dStr: string) => {
    if (!dStr) return null;
    const parts = dStr.split("-").map(Number);
    if (parts.length === 3) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
    return null;
  };

  const start = parseDate(receptStartStr);
  const end = parseDate(receptEndStr);
  const announce = parseDate(winnerAnnounceStr);

  // 1. 접수 시작일 이전 -> 접수예정
  if (start && today < start) {
    const diffDays = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: "접수예정",
      dDayText: diffDays === 1 ? "내일 접수" : `D-${diffDays}`,
      statusBadgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    };
  }

  // 2. 접수 기간 내 -> 청약접수중
  if (start && end && today >= start && today <= end) {
    const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: "청약접수중",
      dDayText: diffDays === 0 ? "오늘 마감 🔥" : `마감 D-${diffDays}`,
      statusBadgeColor: "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold animate-pulse",
    };
  }

  // 3. 접수 마감 후 당첨자 발표일 전 -> 마감/발표대기
  if (end && today > end) {
    if (announce && today <= announce) {
      const diffDays = Math.ceil((announce.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return {
        status: "마감/발표대기",
        dDayText: diffDays === 0 ? "오늘 당첨발표" : `발표 D-${diffDays}`,
        statusBadgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      };
    }
    return {
      status: "발표완료",
      dDayText: "접수마감",
      statusBadgeColor: "bg-slate-100 text-slate-500 border-slate-200",
    };
  }

  return {
    status: "접수예정",
    dDayText: "-",
    statusBadgeColor: "bg-slate-100 text-slate-600 border-slate-200",
  };
}

/**
 * 공공데이터 API 키 취득
 */
function getApiKey(): string {
  return (
    process.env.DATA_GO_KR_API_KEY ||
    process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY ||
    "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D"
  );
}

/**
 * 1. 아파트 분양 공고 목록 수집 (전국 17개 시도 커버, 최대 600건)
 */
async function fetchAptNoticesFromApplyhome(): Promise<SubscriptionNotice[]> {
  const serviceKey = getApiKey();
  const fetchPage = async (page: number) => {
    const url = `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=${page}&perPage=300&serviceKey=${serviceKey}`;
    try {
      const res = await fetch(url, {
        next: { revalidate: 600 },
        headers: { Accept: "application/json" },
      });
      if (!res.ok) return [];
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  };

  try {
    const [p1, p2] = await Promise.all([fetchPage(1), fetchPage(2)]);
    const dataList = [...p1, ...p2];
    if (dataList.length === 0) return [];

    return dataList.map((item: any) => {
      const recruitDate = normalizeDateStr(item.RCRIT_PBLANC_DE);
      const receptStart = normalizeDateStr(item.RCEPT_BGNDE || item.SPSPLY_RCEPT_BGNDE);
      const receptEnd = normalizeDateStr(item.RCEPT_ENDDE || item.GNRL_RNK2_CRSPAREA_ENDDE);
      const winnerAnnounce = normalizeDateStr(item.PRZWNER_PRESNATN_DE);

      const { status, dDayText, statusBadgeColor } = computeStatusAndDDay(
        receptStart,
        receptEnd,
        winnerAnnounce
      );

      return {
        id: String(item.HOUSE_MANAGE_NO),
        pblancNo: String(item.PBLANC_NO),
        name: item.HOUSE_NM || "아파트 분양",
        region: item.SUBSCRPT_AREA_CODE_NM || "기타",
        address: item.HSSPLY_ADRES || "",
        zip: item.HSSPLY_ZIP,
        type: "APT",
        detailType: item.HOUSE_DTL_SECD_NM || "민영",
        rentType: item.RENT_SECD_NM || "분양주택",
        totalUnits: Number(item.TOT_SUPLY_HSHLDCO) || 0,
        recruitDate,
        receptStartDate: receptStart,
        receptEndDate: receptEnd,
        specialSupplyStartDate: normalizeDateStr(item.SPSPLY_RCEPT_BGNDE),
        specialSupplyEndDate: normalizeDateStr(item.SPSPLY_RCEPT_ENDDE),
        rank1Date: normalizeDateStr(item.GNRL_RNK1_CRSPAREA_RCPTDE),
        rank2Date: normalizeDateStr(item.GNRL_RNK2_CRSPAREA_RCPTDE),
        winnerAnnounceDate: winnerAnnounce,
        contractStartDate: normalizeDateStr(item.CNTRCT_CNCLS_BGNDE),
        contractEndDate: normalizeDateStr(item.CNTRCT_CNCLS_ENDDE),
        moveInMonth: formatMoveInMonth(item.MVN_PREARNGE_YM),
        company: item.CNSTRCT_ENTRPS_NM || undefined,
        developer: item.BSNS_MBY_NM || undefined,
        tel: item.MDHS_TELNO || undefined,
        homepage: item.HMPG_ADRES || undefined,
        pblancUrl:
          item.PBLANC_URL ||
          `https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancDetail.do?houseManageNo=${item.HOUSE_MANAGE_NO}&pblancNo=${item.PBLANC_NO}`,
        status,
        statusBadgeColor,
        dDayText,
      };
    });
  } catch (error) {
    console.error("[ApplyHome APT] Request error:", error);
    return [];
  }
}

/**
 * 2. 무순위/잔여세대 (줍줍) 공고 수집 (전국 300개)
 */
async function fetchRemndrNoticesFromApplyhome(): Promise<SubscriptionNotice[]> {
  const serviceKey = getApiKey();
  const url = `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getRemndrLttotPblancDetail?page=1&perPage=300&serviceKey=${serviceKey}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      console.warn(`[ApplyHome Remndr] fetch failed: status ${res.status}`);
      return [];
    }

    const json = await res.json();
    const dataList = json.data || [];

    return dataList.map((item: any) => {
      const recruitDate = normalizeDateStr(item.RCRIT_PBLANC_DE);
      const receptStart = normalizeDateStr(item.SUBSCRPT_RCEPT_BGNDE || item.GNRL_RCEPT_BGNDE);
      const receptEnd = normalizeDateStr(item.SUBSCRPT_RCEPT_ENDDE || item.GNRL_RCEPT_ENDDE || receptStart);
      const winnerAnnounce = normalizeDateStr(item.PRZWNER_PRESNATN_DE);

      const { status, dDayText, statusBadgeColor } = computeStatusAndDDay(
        receptStart,
        receptEnd,
        winnerAnnounce
      );

      return {
        id: String(item.HOUSE_MANAGE_NO),
        pblancNo: String(item.PBLANC_NO),
        name: item.HOUSE_NM || "무순위 잔여세대",
        region: item.SUBSCRPT_AREA_CODE_NM || "기타",
        address: item.HSSPLY_ADRES || "",
        zip: item.HSSPLY_ZIP,
        type: "무순위",
        detailType: "무순위/줍줍",
        rentType: "분양주택",
        totalUnits: Number(item.TOT_SUPLY_HSHLDCO) || 0,
        recruitDate,
        receptStartDate: receptStart,
        receptEndDate: receptEnd,
        winnerAnnounceDate: winnerAnnounce,
        contractStartDate: normalizeDateStr(item.CNTRCT_CNCLS_BGNDE),
        contractEndDate: normalizeDateStr(item.CNTRCT_CNCLS_ENDDE),
        moveInMonth: formatMoveInMonth(item.MVN_PREARNGE_YM),
        developer: item.BSNS_MBY_NM || undefined,
        tel: item.MDHS_TELNO || undefined,
        homepage: item.HMPG_ADRES || undefined,
        pblancUrl:
          item.PBLANC_URL ||
          `https://www.applyhome.co.kr/ai/aia/selectAPTRemndrLttotPblancDetailView.do?houseManageNo=${item.HOUSE_MANAGE_NO}&pblancNo=${item.PBLANC_NO}`,
        status,
        statusBadgeColor,
        dDayText,
      };
    });
  } catch (error) {
    console.error("[ApplyHome Remndr] Request error:", error);
    return [];
  }
}

/**
 * 3. 주택형 모델별 분양가 및 공급 세대수 조회
 */
export async function fetchSubscriptionModels(
  houseManageNo: string,
  type: "APT" | "무순위" = "APT"
): Promise<SubscriptionModel[]> {
  const cacheKey = `${type}_${houseManageNo}`;
  const now = Date.now();
  if (modelCache.has(cacheKey)) {
    const cached = modelCache.get(cacheKey)!;
    if (now - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
  }

  const serviceKey = getApiKey();
  const endpoint =
    type === "무순위" ? "getRemndrLttotPblancMdl" : "getAPTLttotPblancMdl";
  const url = `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/${endpoint}?page=1&perPage=50&serviceKey=${serviceKey}&cond[HOUSE_MANAGE_NO::EQ]=${houseManageNo}`;

  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];

    const json = await res.json();
    const dataList = json.data || [];

    const models: SubscriptionModel[] = dataList.map((m: any) => {
      const houseTy = (m.HOUSE_TY || "").trim();
      const numExclu = parseFloat(houseTy) || 0;
      const pyeong = Math.round(numExclu * 0.3025);
      const topPrice = parseInt(String(m.LTTOT_TOP_AMOUNT || "0").replace(/,/g, ""), 10);

      return {
        modelNo: String(m.MODEL_NO || "01"),
        houseType: houseTy,
        exclusiveAreaSqm: numExclu,
        pyeong: pyeong > 0 ? pyeong : Math.round(numExclu / 3.3),
        supplyAreaSqm: m.SUPLY_AR ? parseFloat(m.SUPLY_AR) : undefined,
        topPriceManwon: topPrice,
        supplyUnits: Number(m.SUPLY_HSHLDCO) || 0,
        specialSupplyUnits: Number(m.SPSPLY_HSHLDCO) || 0,
        subBreakdown: {
          multiChild: Number(m.MNYCH_HSHLDCO) || 0,
          newlywed: Number(m.NWWDS_HSHLDCO) || 0,
          firstLife: Number(m.LFE_FRST_HSHLDCO) || 0,
          oldParents: Number(m.OLD_PARNTS_SUPORT_HSHLDCO) || 0,
          institution: Number(m.INSTT_RECOMEND_HSHLDCO) || 0,
          newborn: Number(m.NWBB_HSHLDCO) || 0,
        },
      };
    });

    modelCache.set(cacheKey, { data: models, timestamp: now });
    return models;
  } catch (error) {
    console.warn(`[ApplyHome Models] failed for ${houseManageNo}:`, error);
    return [];
  }
}

/**
 * 4. 전체 분양 정보 종합 조회 (캐시 적용 및 최신순 정렬)
 */
export async function getAllSubscriptionNotices(forceRefresh = false): Promise<SubscriptionNotice[]> {
  const now = Date.now();
  if (!forceRefresh && noticesCache && now - noticesCache.timestamp < CACHE_TTL_MS) {
    return noticesCache.data;
  }

  // 병렬 수집: 일반 APT 공고 + 무순위(줍줍) 공고
  const [aptNotices, remndrNotices] = await Promise.all([
    fetchAptNoticesFromApplyhome(),
    fetchRemndrNoticesFromApplyhome(),
  ]);

  const fetched = [...aptNotices, ...remndrNotices];

  // 마스터 데이터(1000건)와 최신 API 데이터 병합 (중복 방지 및 항상 전국 1000+건 보장)
  const masterList = (masterSubscriptionsRaw as any[]) as SubscriptionNotice[];
  const mergedMap = new Map<string, SubscriptionNotice>();

  // 1. 마스터 데이터 먼저 로드
  for (const item of masterList) {
    const key = `${item.id}_${item.pblancNo}`;
    mergedMap.set(key, item);
  }

  // 2. 실시간 새로 수집된 공고로 덮어쓰기/추가
  for (const item of fetched) {
    const key = `${item.id}_${item.pblancNo}`;
    mergedMap.set(key, item);
  }

  let combined = Array.from(mergedMap.values());

  // 만약 비어있을 경우 폴백
  if (combined.length === 0) {
    combined = getFallbackSubscriptionNotices();
  }

  // 최신 상태 재계산
  combined = combined.map((item) => {
    const { status, dDayText, statusBadgeColor } = computeStatusAndDDay(
      item.receptStartDate,
      item.receptEndDate,
      item.winnerAnnounceDate
    );
    return { ...item, status, dDayText, statusBadgeColor };
  });

  // 정렬 순서: 1) 청약접수중 우선, 2) 접수예정, 3) 모집공고일 최신순
  combined.sort((a, b) => {
    const statusWeight = (s: SubscriptionStatus) => {
      if (s === "청약접수중") return 4;
      if (s === "접수예정") return 3;
      if (s === "마감/발표대기") return 2;
      return 1;
    };
    const diffWeight = statusWeight(b.status) - statusWeight(a.status);
    if (diffWeight !== 0) return diffWeight;

    return (b.recruitDate || "").localeCompare(a.recruitDate || "");
  });

  noticesCache = { data: combined, timestamp: now };
  return combined;
}

/**
 * 5. 통계 요약 계산
 */
export function computeSubscriptionStats(notices: SubscriptionNotice[]): SubscriptionSummaryStats {
  let ongoingCount = 0;
  let upcomingCount = 0;
  let remndrCount = 0;
  let seoulCount = 0;
  let gyeonggiCount = 0;
  let otherCount = 0;

  for (const n of notices) {
    if (n.status === "청약접수중") ongoingCount++;
    if (n.status === "접수예정") upcomingCount++;
    if (n.type === "무순위") remndrCount++;

    if (n.region.includes("서울")) seoulCount++;
    else if (n.region.includes("경기") || n.region.includes("인천")) gyeonggiCount++;
    else otherCount++;
  }

  return {
    totalCount: notices.length,
    ongoingCount,
    upcomingCount,
    remndrCount,
    seoulCount,
    gyeonggiCount,
    otherCount,
  };
}

/**
 * 6. 금액 포맷팅 헬퍼 (예: 69280 -> 6억 9,280만)
 */
export function formatSubscriptionPrice(manwon?: number): string {
  if (!manwon || manwon <= 0) return "가격 정보 확인";
  const uk = Math.floor(manwon / 10000);
  const remainder = manwon % 10000;
  if (uk > 0) {
    return remainder > 0
      ? `${uk}억 ${remainder.toLocaleString()}만`
      : `${uk}억원`;
  }
  return `${manwon.toLocaleString()}만원`;
}

/**
 * API 장애 시를 대비한 고품질 Fallback Seed 공고
 */
function getFallbackSubscriptionNotices(): SubscriptionNotice[] {
  return [
    {
      id: "2026000514",
      pblancNo: "2026000514",
      name: "트리븐센텀 2단지",
      region: "부산",
      address: "부산광역시 해운대구 반여동 610-5번지 일원",
      type: "APT",
      detailType: "민영",
      rentType: "분양주택",
      totalUnits: 792,
      recruitDate: "2026-10-16",
      receptStartDate: "2026-10-26",
      receptEndDate: "2026-10-28",
      specialSupplyStartDate: "2026-10-26",
      rank1Date: "2026-10-27",
      rank2Date: "2026-10-28",
      winnerAnnounceDate: "2026-11-05",
      moveInMonth: "2031년 2월",
      company: "두산에너빌리티(주)",
      developer: "주식회사 하나자산신탁",
      tel: "1644-5344",
      homepage: "https://www.trivn-doosan-centum.com/",
      pblancUrl: "https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancDetail.do?houseManageNo=2026000514&pblancNo=2026000514",
      status: "접수예정",
      statusBadgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      dDayText: "D-9",
      minPriceManwon: 48900,
      maxPriceManwon: 69280,
    },
    {
      id: "2026000509",
      pblancNo: "2026000509",
      name: "아크메르 동탄 99",
      region: "경기",
      address: "경기도 화성시 동탄구 반송동 99번지 일원",
      type: "APT",
      detailType: "민영",
      rentType: "분양주택",
      totalUnits: 996,
      recruitDate: "2026-10-16",
      receptStartDate: "2026-10-26",
      receptEndDate: "2026-10-28",
      specialSupplyStartDate: "2026-10-26",
      rank1Date: "2026-10-27",
      rank2Date: "2026-10-28",
      winnerAnnounceDate: "2026-11-04",
      moveInMonth: "2029년 6월",
      company: "대우건설",
      tel: "1588-0000",
      pblancUrl: "https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancDetail.do?houseManageNo=2026000509&pblancNo=2026000509",
      status: "접수예정",
      statusBadgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      dDayText: "D-9",
      minPriceManwon: 62000,
      maxPriceManwon: 98000,
    },
    {
      id: "2026910264",
      pblancNo: "2026910264",
      name: "시흥 은계 에피트 (조합원 취소분 잔여세대)",
      region: "경기",
      address: "경기도 시흥시 은행동 289-31번지 일원",
      type: "무순위",
      detailType: "무순위/줍줍",
      rentType: "분양주택",
      totalUnits: 16,
      recruitDate: "2026-10-15",
      receptStartDate: "2026-10-20",
      receptEndDate: "2026-10-20",
      winnerAnnounceDate: "2026-10-23",
      moveInMonth: "2026년 10월",
      developer: "신극동아파트 가로주택정비사업조합",
      tel: "031-318-4998",
      homepage: "http://efete-eungye.com/",
      pblancUrl: "https://www.applyhome.co.kr/ai/aia/selectAPTRemndrLttotPblancDetailView.do?houseManageNo=2026910264&pblancNo=2026910264",
      status: "접수예정",
      statusBadgeColor: "bg-amber-50 text-amber-700 border-amber-300",
      dDayText: "D-3",
      minPriceManwon: 37900,
      maxPriceManwon: 41000,
    },
  ];
}
