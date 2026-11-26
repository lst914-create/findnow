/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * 시군구(LAWD_CD) 단위 국토부 실거래(매매/연립/전월세) 일괄 수집 -> Supabase Storage(transactions-cache) 적재 스크립트
 *
 * 사용법:
 *   npx tsx scripts/sync-transactions-cache.ts 41310 41360
 *   npx tsx scripts/sync-transactions-cache.ts --capital   (수도권 핵심 20개 시군구)
 */
import * as fs from "fs";
import * as path from "path";
import { LAWD_CODES } from "../src/lib/publicDataApi";
import { isTransactionMatch } from "../src/lib/fetchTransactionsServer";
import { saveTransactionsToStore } from "../src/lib/transactionStore";
import masterApartments from "../src/lib/apartments-master.json";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.trim().match(/^([^#=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) {
      process.env[m[1].trim()] = m[2].trim();
    }
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchXmlWithRetry(url: string, retries = 4): Promise<string> {
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        await sleep(300 * i);
        continue;
      }
      if (!res.ok) return "";
      const text = await res.text();
      if (text.includes("LIMITED_NUMBER_OF_SERVICE_REQUESTS_PER_SECOND_EXCEEDS_ERROR")) {
        await sleep(350 * i);
        continue;
      }
      return text;
    } catch {
      if (i === retries) return "";
      await sleep(200);
    }
  }
  return "";
}

function parseTradeItems(xml: string, isRh = false) {
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const aptNm = (
      item.match(/<aptNm>([^<]*)<\/aptNm>/)?.[1] ||
      item.match(/<mhouseNm>([^<]*)<\/mhouseNm>/)?.[1] ||
      ""
    ).trim();
    const umdNm = item.match(/<umdNm>([^<]*)<\/umdNm>/)?.[1]?.trim() || "";
    const jibun = item.match(/<jibun>([^<]*)<\/jibun>/)?.[1]?.trim() || "";
    const buildYear = parseInt(item.match(/<buildYear>([^<]*)<\/buildYear>/)?.[1] || "0", 10);
    const excluUseAr = parseFloat(item.match(/<excluUseAr>([^<]*)<\/excluUseAr>/)?.[1] || "0");
    const floor = parseInt(item.match(/<floor>([^<]*)<\/floor>/)?.[1] || "1", 10);
    const dealYear = parseInt(item.match(/<dealYear>([^<]*)<\/dealYear>/)?.[1] || "0", 10);
    const dealMonth = parseInt(item.match(/<dealMonth>([^<]*)<\/dealMonth>/)?.[1] || "0", 10);
    const dealDay = parseInt(item.match(/<dealDay>([^<]*)<\/dealDay>/)?.[1] || "1", 10);
    const amountStr = item.match(/<dealAmount>([^<]*)<\/dealAmount>/)?.[1]?.replace(/,/g, "").trim() || "";
    const dealAmount = parseInt(amountStr, 10);

    if (aptNm && dealAmount > 0 && excluUseAr > 0) {
      items.push({
        aptNm,
        umdNm,
        jibun,
        buildYear,
        dealAmount,
        excluUseAr,
        floor,
        dealYear,
        dealMonth,
        dealDay,
        isRight: false,
        isRh,
      });
    }
  }
  return items;
}

function parseRentItems(xml: string) {
  const items: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    const aptNm = (
      item.match(/<aptNm>([^<]*)<\/aptNm>/)?.[1] ||
      item.match(/<mhouseNm>([^<]*)<\/mhouseNm>/)?.[1] ||
      ""
    ).trim();
    const umdNm = item.match(/<umdNm>([^<]*)<\/umdNm>/)?.[1]?.trim() || "";
    const jibun = item.match(/<jibun>([^<]*)<\/jibun>/)?.[1]?.trim() || "";
    const buildYear = parseInt(item.match(/<buildYear>([^<]*)<\/buildYear>/)?.[1] || "0", 10);
    const excluUseAr = parseFloat(item.match(/<excluUseAr>([^<]*)<\/excluUseAr>/)?.[1] || "0");
    const floor = parseInt(item.match(/<floor>([^<]*)<\/floor>/)?.[1] || "1", 10);
    const dealYear = parseInt(item.match(/<dealYear>([^<]*)<\/dealYear>/)?.[1] || "0", 10);
    const dealMonth = parseInt(item.match(/<dealMonth>([^<]*)<\/dealMonth>/)?.[1] || "0", 10);
    const dealDay = parseInt(item.match(/<dealDay>([^<]*)<\/dealDay>/)?.[1] || "1", 10);
    const depositStr = item.match(/<deposit>([^<]*)<\/deposit>/)?.[1]?.replace(/,/g, "").trim() || "";
    const rentStr = item.match(/<monthlyRent>([^<]*)<\/monthlyRent>/)?.[1]?.replace(/,/g, "").trim() || "";
    const depositAmount = parseInt(depositStr, 10);
    const monthlyRent = parseInt(rentStr, 10) || 0;

    if (aptNm && depositAmount > 0 && excluUseAr > 0) {
      items.push({
        aptNm,
        umdNm,
        jibun,
        buildYear,
        depositAmount,
        monthlyRent,
        excluUseAr,
        floor,
        dealYear,
        dealMonth,
        dealDay,
      });
    }
  }
  return items;
}

async function syncLawdCode(lawdCode: string, encodedKey: string, months = 36) {
  const lawdEntry = LAWD_CODES.find((l) => l.code === lawdCode);
  const regionLabel = lawdEntry?.region || lawdCode;

  // 해당 시군구의 마스터 단지 필터링
  const apts = (masterApartments as any[]).filter(
    (a) => a.sgg_cd === lawdCode || (lawdEntry && a.region === lawdEntry.region)
  );
  if (apts.length === 0) {
    console.log(`[${regionLabel} (${lawdCode})] 마스터 단지 0건 스킵`);
    return;
  }

  const now = new Date();
  const ymdList: string[] = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    ymdList.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`);
  }

  const allTrades: any[] = [];
  const allRents: any[] = [];

  const CONCURRENCY = 6;
  for (let i = 0; i < ymdList.length; i += CONCURRENCY) {
    const batch = ymdList.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map(async (ymd) => {
        const tradeUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${encodedKey}&LAWD_CD=${lawdCode}&DEAL_YMD=${ymd}&numOfRows=2000`;
        const rentUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent?serviceKey=${encodedKey}&LAWD_CD=${lawdCode}&DEAL_YMD=${ymd}&numOfRows=2000`;
        const [tXml, rXml] = await Promise.all([fetchXmlWithRetry(tradeUrl), fetchXmlWithRetry(rentUrl)]);
        return {
          trades: tXml ? parseTradeItems(tXml, false) : [],
          rents: rXml ? parseRentItems(rXml) : [],
        };
      })
    );
    for (const r of results) {
      allTrades.push(...r.trades);
      allRents.push(...r.rents);
    }
    await sleep(60);
  }

  console.log(
    `[${regionLabel} (${lawdCode})] 수집 완료: 매매 ${allTrades.length}건, 전월세 ${allRents.length}건 -> ${apts.length}개 단지 매칭 중...`
  );

  // 단지별 매칭 최적화: 법정동(umd_nm) 단위 그룹 인덱싱으로 306 x 75,000건 O(N*M) 루프 병목 제거
  const tradesByUmd = new Map<string, any[]>();
  for (const t of allTrades) {
    const k = (t.umdNm || "").trim();
    if (!tradesByUmd.has(k)) tradesByUmd.set(k, []);
    tradesByUmd.get(k)!.push(t);
  }
  const rentsByUmd = new Map<string, any[]>();
  for (const r of allRents) {
    const k = (r.umdNm || "").trim();
    if (!rentsByUmd.has(k)) rentsByUmd.set(k, []);
    rentsByUmd.get(k)!.push(r);
  }

  // 단지별 매칭 및 저장
  const matchedPayloads: { aptId: string; name: string; trades: any[]; rents: any[] }[] = [];

  for (const apt of apts) {
    const target = {
      name: apt.name,
      region: apt.region,
      district: apt.district,
      umd_nm: apt.umd_nm,
      jibun: apt.jibun,
      built_year: apt.built_year,
    };

    const targetDist = (apt.umd_nm || apt.district || "").replace(/[\s0-9]/g, "").replace(/(동|읍|면|리)$/, "");
    
    // 법정동이 일치하거나 유사한 거래만 후보군으로 압축 (75,000건 -> 수백건 수준)
    let candidateTrades: any[] = [];
    let candidateRents: any[] = [];

    if (targetDist) {
      for (const [umd, list] of tradesByUmd.entries()) {
        if (umd.includes(targetDist) || targetDist.includes(umd.replace(/[\s0-9]/g, "").replace(/(동|읍|면|리)$/, ""))) {
          candidateTrades.push(...list);
        }
      }
      for (const [umd, list] of rentsByUmd.entries()) {
        if (umd.includes(targetDist) || targetDist.includes(umd.replace(/[\s0-9]/g, "").replace(/(동|읍|면|리)$/, ""))) {
          candidateRents.push(...list);
        }
      }
    } else {
      candidateTrades = allTrades;
      candidateRents = allRents;
    }

    const aptTrades = candidateTrades
      .filter((t) =>
        isTransactionMatch(target, {
          aptNm: t.aptNm,
          umdNm: t.umdNm,
          jibun: t.jibun,
          buildYear: t.buildYear,
        })
      )
      .map((t) => ({
        dealAmount: t.dealAmount,
        excluUseAr: t.excluUseAr,
        floor: t.floor,
        dealYear: t.dealYear,
        dealMonth: t.dealMonth,
        dealDay: t.dealDay,
        buildYear: t.buildYear,
        aptName: t.aptNm,
        umdNm: t.umdNm,
        isRight: t.isRight,
      }))
      .sort((a, b) => b.dealYear - a.dealYear || b.dealMonth - a.dealMonth || b.dealDay - a.dealDay);

    const aptRents = candidateRents
      .filter((r) =>
        isTransactionMatch(target, {
          aptNm: r.aptNm,
          umdNm: r.umdNm,
          jibun: r.jibun,
          buildYear: r.buildYear,
        })
      )
      .map((r) => ({
        depositAmount: r.depositAmount,
        monthlyRent: r.monthlyRent,
        excluUseAr: r.excluUseAr,
        floor: r.floor,
        dealYear: r.dealYear,
        dealMonth: r.dealMonth,
        dealDay: r.dealDay,
        buildYear: r.buildYear,
        aptName: r.aptNm,
        umdNm: r.umdNm,
      }))
      .sort((a, b) => b.dealYear - a.dealYear || b.dealMonth - a.dealMonth || b.dealDay - a.dealDay);

    if (aptTrades.length > 0 || aptRents.length > 0) {
      matchedPayloads.push({ aptId: apt.id, name: apt.name, trades: aptTrades, rents: aptRents });
    }
  }

  // Supabase Storage 병렬 업로드
  let uploaded = 0;
  const UPLOAD_CONCURRENCY = 12;
  for (let i = 0; i < matchedPayloads.length; i += UPLOAD_CONCURRENCY) {
    const batch = matchedPayloads.slice(i, i + UPLOAD_CONCURRENCY);
    const res = await Promise.all(
      batch.map((p) => saveTransactionsToStore(p.aptId, p.trades, p.rents, months))
    );
    uploaded += res.filter(Boolean).length;
  }

  console.log(
    `[${regionLabel} (${lawdCode})] 업로드 완료: ${uploaded}/${matchedPayloads.length}개 단지 캐시 저장됨`
  );
}

async function main() {
  loadEnvLocal();

  const apiKey =
    process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY ||
    process.env.DATA_GO_KR_API_KEY ||
    "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";

  let cleanKey = apiKey.trim();
  try {
    cleanKey = decodeURIComponent(cleanKey);
  } catch {}
  const encodedKey = encodeURIComponent(cleanKey);

  const args = process.argv.slice(2);
  let codes: string[] = [];

  if (args.includes("--capital")) {
    codes = [
      "41310", // 구리시
      "41360", // 남양주시
      "11680", // 강남구
      "11650", // 서초구
      "11710", // 송파구
      "11440", // 마포구
      "11200", // 성동구
      "11170", // 용산구
      "11560", // 영등포구
      "11350", // 노원구
      "11320", // 도봉구
      "41450", // 하남시
      "41135", // 성남시 분당구
      "41590", // 화성시
      "41465", // 용인시 수지구
    ];
  } else {
    codes = args.filter((a) => /^\d{5}$/.test(a));
  }

  if (codes.length === 0) {
    codes = ["41310", "41360"];
  }

  console.log(`=== 실거래 사전 수집 시작 (${codes.length}개 시군구, 최근 36개월) ===`);
  for (const code of codes) {
    await syncLawdCode(code, encodedKey, 36);
  }
  console.log("=== 전체 완료 ===");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
