/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 청약홈 전국 분양정보 API 동기화 스크립트
 * 
 * - 아파트 분양공고 (getAPTLttotPblancDetail) 1~2페이지 (총 600개)
 * - 무순위 잔여세대 줍줍 (getRemndrLttotPblancDetail) (300개)
 * - 오피스텔/도시형 (getUrbtyOfctlLttotPblancDetail) (100개)
 * - 주요 공고의 모델 분양가 사전 병합
 * 
 * 실행: npx tsx scripts/sync-subscriptions.ts
 */

import fs from "fs";
import path from "path";

const API_KEY =
  process.env.DATA_GO_KR_API_KEY ||
  "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";

function normalizeDateStr(dateStr?: string | null): string {
  if (!dateStr) return "";
  const cleaned = dateStr.replace(/[^0-9]/g, "");
  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
  }
  return dateStr.trim();
}

function formatMoveInMonth(ym?: string | null): string | undefined {
  if (!ym) return undefined;
  const cleaned = ym.replace(/[^0-9]/g, "");
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 4)}년 ${parseInt(cleaned.slice(4, 6), 10)}월`;
  }
  return ym;
}

function computeStatusAndDDay(receptStartStr: string, receptEndStr: string, winnerAnnounceStr: string) {
  const parseDate = (s: string) => {
    if (!s) return null;
    const p = s.split("-").map(Number);
    if (p.length !== 3) return null;
    return new Date(p[0], p[1] - 1, p[2]);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = parseDate(receptStartStr);
  const end = parseDate(receptEndStr);
  const announce = parseDate(winnerAnnounceStr);

  if (start && today < start) {
    const diffDays = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: "접수예정",
      dDayText: diffDays === 1 ? "내일 접수" : `D-${diffDays}`,
      statusBadgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    };
  }

  if (start && end && today >= start && today <= end) {
    const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return {
      status: "청약접수중",
      dDayText: diffDays === 0 ? "오늘 마감 🔥" : `마감 D-${diffDays}`,
      statusBadgeColor: "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold animate-pulse",
    };
  }

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

async function fetchAptPage(page: number, perPage: number): Promise<any[]> {
  const url = `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?page=${page}&perPage=${perPage}&serviceKey=${API_KEY}`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(`[Apt Page ${page}] Error:`, err);
    return [];
  }
}

async function fetchRemndrPage(page: number, perPage: number): Promise<any[]> {
  const url = `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getRemndrLttotPblancDetail?page=${page}&perPage=${perPage}&serviceKey=${API_KEY}`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(`[Remndr Page ${page}] Error:`, err);
    return [];
  }
}

async function fetchOfctlPage(page: number, perPage: number): Promise<any[]> {
  const url = `https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getUrbtyOfctlLttotPblancDetail?page=${page}&perPage=${perPage}&serviceKey=${API_KEY}`;
  try {
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(`[Ofctl Page ${page}] Error:`, err);
    return [];
  }
}

async function syncAllSubscriptions() {
  console.log("==================================================");
  console.log("🚀 [청약홈] 전국 분양정보 공공데이터 수집 시작...");
  console.log("==================================================");

  // 1. 아파트 1~2페이지 (각 300건 = 600건)
  console.log("📡 아파트 분양 공고 수집 중 (600건 목표)...");
  const [apt1, apt2] = await Promise.all([
    fetchAptPage(1, 300),
    fetchAptPage(2, 300),
  ]);
  const aptRaw = [...apt1, ...apt2];
  console.log(`✅ 아파트 공고 ${aptRaw.length}건 수집 완료.`);

  // 2. 무순위/잔여세대 (300건)
  console.log("📡 무순위/줍줍 분양 공고 수집 중 (300건 목표)...");
  const remndrRaw = await fetchRemndrPage(1, 300);
  console.log(`✅ 무순위 공고 ${remndrRaw.length}건 수집 완료.`);

  // 3. 오피스텔/도시형 (100건)
  console.log("📡 오피스텔/도시형 공고 수집 중 (100건 목표)...");
  const ofctlRaw = await fetchOfctlPage(1, 100);
  console.log(`✅ 오피스텔 공고 ${ofctlRaw.length}건 수집 완료.`);

  // 4. 데이터 가공 및 표준화
  const allNotices: any[] = [];

  // 아파트 매핑
  for (const item of aptRaw) {
    const recruitDate = normalizeDateStr(item.RCRIT_PBLANC_DE);
    const receptStart = normalizeDateStr(item.RCEPT_BGNDE || item.SPSPLY_RCEPT_BGNDE);
    const receptEnd = normalizeDateStr(item.RCEPT_ENDDE || item.GNRL_RNK2_CRSPAREA_ENDDE);
    const winnerAnnounce = normalizeDateStr(item.PRZWNER_PRESNATN_DE);
    const { status, dDayText, statusBadgeColor } = computeStatusAndDDay(receptStart, receptEnd, winnerAnnounce);

    allNotices.push({
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
      pblancUrl: item.PBLANC_URL || `https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancDetail.do?houseManageNo=${item.HOUSE_MANAGE_NO}&pblancNo=${item.PBLANC_NO}`,
      status,
      statusBadgeColor,
      dDayText,
    });
  }

  // 무순위 매핑
  for (const item of remndrRaw) {
    const recruitDate = normalizeDateStr(item.RCRIT_PBLANC_DE);
    const receptStart = normalizeDateStr(item.SUBSCRPT_RCEPT_BGNDE || item.GNRL_RCEPT_BGNDE);
    const receptEnd = normalizeDateStr(item.SUBSCRPT_RCEPT_ENDDE || item.GNRL_RCEPT_ENDDE || receptStart);
    const winnerAnnounce = normalizeDateStr(item.PRZWNER_PRESNATN_DE);
    const { status, dDayText, statusBadgeColor } = computeStatusAndDDay(receptStart, receptEnd, winnerAnnounce);

    allNotices.push({
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
      pblancUrl: item.PBLANC_URL || `https://www.applyhome.co.kr/ai/aia/selectAPTRemndrLttotPblancDetailView.do?houseManageNo=${item.HOUSE_MANAGE_NO}&pblancNo=${item.PBLANC_NO}`,
      status,
      statusBadgeColor,
      dDayText,
    });
  }

  // 오피스텔 매핑
  for (const item of ofctlRaw) {
    const recruitDate = normalizeDateStr(item.RCRIT_PBLANC_DE);
    const receptStart = normalizeDateStr(item.SUBSCRPT_RCEPT_BGNDE);
    const receptEnd = normalizeDateStr(item.SUBSCRPT_RCEPT_ENDDE || receptStart);
    const winnerAnnounce = normalizeDateStr(item.PRZWNER_PRESNATN_DE);
    const { status, dDayText, statusBadgeColor } = computeStatusAndDDay(receptStart, receptEnd, winnerAnnounce);

    allNotices.push({
      id: String(item.HOUSE_MANAGE_NO),
      pblancNo: String(item.PBLANC_NO),
      name: item.HOUSE_NM || "오피스텔/도시형",
      region: item.SUBSCRPT_AREA_CODE_NM || "기타",
      address: item.HSSPLY_ADRES || "",
      zip: item.HSSPLY_ZIP,
      type: "오피스텔",
      detailType: item.HOUSE_DTL_SECD_NM || "오피스텔",
      rentType: "분양",
      totalUnits: Number(item.TOT_SUPLY_HSHLDCO) || 0,
      recruitDate,
      receptStartDate: receptStart,
      receptEndDate: receptEnd,
      winnerAnnounceDate: winnerAnnounce,
      contractStartDate: normalizeDateStr(item.CNTRCT_CNCLS_BGNDE),
      contractEndDate: normalizeDateStr(item.CNTRCT_CNCLS_ENDDE),
      moveInMonth: formatMoveInMonth(item.MVN_PREARNGE_YM),
      company: item.CNSTRCT_ENTRPS_NM || undefined,
      developer: item.BSNS_MBY_NM || undefined,
      tel: item.MDHS_TELNO || undefined,
      homepage: item.HMPG_ADRES || undefined,
      pblancUrl: item.PBLANC_URL || `https://www.applyhome.co.kr/ai/aia/selectUrbtyOfctlLttotPblancDetailView.do?houseManageNo=${item.HOUSE_MANAGE_NO}&pblancNo=${item.PBLANC_NO}`,
      status,
      statusBadgeColor,
      dDayText,
    });
  }

  // 중복 제거 (id_pblancNo 기준)
  const uniqueMap = new Map<string, any>();
  for (const n of allNotices) {
    const key = `${n.id}_${n.pblancNo}`;
    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, n);
    }
  }
  const uniqueNotices = Array.from(uniqueMap.values());

  // 정렬: 1) 청약접수중 우선, 2) 접수예정, 3) 모집공고일 최신순
  uniqueNotices.sort((a, b) => {
    const weight = (s: string) => (s === "청약접수중" ? 4 : s === "접수예정" ? 3 : s === "마감/발표대기" ? 2 : 1);
    const diff = weight(b.status) - weight(a.status);
    if (diff !== 0) return diff;
    return (b.recruitDate || "").localeCompare(a.recruitDate || "");
  });

  // 지역별 통계 출력
  const regionStats: Record<string, number> = {};
  for (const n of uniqueNotices) {
    regionStats[n.region] = (regionStats[n.region] || 0) + 1;
  }

  console.log("\n📊 [전국 17개 시도별 분양 공고 현황]");
  console.log(regionStats);
  console.log(`\n총 수집된 유니크 분양 공고: ${uniqueNotices.length}건`);

  // 마스터 파일 저장
  const outPath = path.join(__dirname, "..", "src", "lib", "subscriptions-master.json");
  fs.writeFileSync(outPath, JSON.stringify(uniqueNotices, null, 2), "utf8");
  console.log(`💾 저장 완료: ${outPath}`);
  console.log("==================================================");
}

syncAllSubscriptions();
