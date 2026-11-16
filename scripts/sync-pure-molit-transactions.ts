/**
 * 국토교통부 순수 실거래가 동기화 스크립트 (Clean MOLIT Transactions Sync)
 * 
 * [원칙]
 * 1. 더미, 임의 추정치, 가상 평당가 절대 금지
 * 2. 국토교통부 실거래 신고 원시 데이터(RTMSDataSvcAptTrade, RTMSDataSvcAptRent)만 반영
 * 3. 사용자 핵심 가격 규칙: 최근 3개월 실거래가의 산술 평균 (1건이면 최근 거래가, 미신고 시 0)
 * 4. 국토부 실거래 신고자료의 공식 건축년도(buildYear)를 단지 마스터에 정확히 매핑
 */

import * as fs from "fs";
import * as path from "path";
import { LAWD_CODES } from "../src/lib/publicDataApi";

const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");

// .env.local에서 API 키 로드
function loadApiKey(): string {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (!fs.existsSync(envPath)) return "";
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("DATA_GO_KR_API_KEY=") || trimmed.startsWith("NEXT_PUBLIC_DATA_GO_KR_API_KEY=")) {
      const raw = trimmed.split("=")[1].trim();
      return decodeURIComponent(raw);
    }
  }
  return "";
}

interface RawTrade {
  aptNm: string;
  dealAmount: number;
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  dealTime: number; // timestamp
  excluUseAr: number;
  floor: number;
  buildYear: number | null;
  umdNm: string;
}

interface RawRent {
  aptNm: string;
  depositAmount: number;
  monthlyRent: number;
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  dealTime: number;
  excluUseAr: number;
  floor: number;
  umdNm: string;
}

function normalizeKey(str: string): string {
  return (str || "")
    .replace(/[\s\-_(),.·[\]{}<>]/g, "")
    .replace(/1차|ⅰ|i단지|1단지|Ⅰ/gi, "1")
    .replace(/2차|ⅱ|ii단지|2단지|Ⅱ/gi, "2")
    .replace(/3차|ⅲ|iii단지|3단지|Ⅲ/gi, "3")
    .toLowerCase();
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchMolitTradesForMonth(lawdCd: string, ymd: string, apiKey: string): Promise<RawTrade[]> {
  const encodedKey = encodeURIComponent(apiKey);
  const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${encodedKey}&LAWD_CD=${lawdCd}&DEAL_YMD=${ymd}&numOfRows=1000`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];
    const results: RawTrade[] = [];

    for (const item of items) {
      const getVal = (tag: string) => {
        const m = item.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
        return m ? m[1].trim() : "";
      };

      const aptNm = getVal("aptNm");
      const amtStr = getVal("dealAmount").replace(/,/g, "");
      if (!aptNm || !amtStr) continue;

      const year = parseInt(getVal("dealYear"), 10);
      const month = parseInt(getVal("dealMonth"), 10);
      const day = parseInt(getVal("dealDay") || "1", 10);
      const dealTime = new Date(year, month - 1, day).getTime();

      results.push({
        aptNm,
        dealAmount: parseInt(amtStr, 10),
        dealYear: year,
        dealMonth: month,
        dealDay: day,
        dealTime,
        excluUseAr: parseFloat(getVal("excluUseAr")) || 84,
        floor: parseInt(getVal("floor") || "1", 10),
        buildYear: parseInt(getVal("buildYear"), 10) || null,
        umdNm: getVal("umdNm"),
      });
    }
    return results;
  } catch {
    return [];
  }
}

async function fetchMolitRentsForMonth(lawdCd: string, ymd: string, apiKey: string): Promise<RawRent[]> {
  const encodedKey = encodeURIComponent(apiKey);
  const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent?serviceKey=${encodedKey}&LAWD_CD=${lawdCd}&DEAL_YMD=${ymd}&numOfRows=1000`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const text = await res.text();
    const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];
    const results: RawRent[] = [];

    for (const item of items) {
      const getVal = (tag: string) => {
        const m = item.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
        return m ? m[1].trim() : "";
      };

      const aptNm = getVal("aptNm");
      const depositStr = getVal("deposit").replace(/,/g, "");
      if (!aptNm || !depositStr) continue;

      const year = parseInt(getVal("dealYear"), 10);
      const month = parseInt(getVal("dealMonth"), 10);
      const day = parseInt(getVal("dealDay") || "1", 10);
      const dealTime = new Date(year, month - 1, day).getTime();

      results.push({
        aptNm,
        depositAmount: parseInt(depositStr, 10),
        monthlyRent: parseInt(getVal("monthlyRent").replace(/,/g, "") || "0", 10),
        dealYear: year,
        dealMonth: month,
        dealDay: day,
        dealTime,
        excluUseAr: parseFloat(getVal("excluUseAr")) || 84,
        floor: parseInt(getVal("floor") || "1", 10),
        umdNm: getVal("umdNm"),
      });
    }
    return results;
  } catch {
    return [];
  }
}

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error("❌ DATA_GO_KR_API_KEY 가 없습니다.");
    process.exit(1);
  }

  console.log("==========================================================================");
  console.log("🏢 [국토교통부 실거래가 원본 연동] Step 4: transactions 순수 실거래가 동기화");
  console.log("==========================================================================");

  const masterList: any[] = JSON.parse(fs.readFileSync(masterPath, "utf-8"));
  console.log(`📦 K-apt 마스터 단지: 총 ${masterList.length.toLocaleString()}개 로드`);

  // 수도권 및 주요 시군구 50개 우선 정밀 스캔
  // 최근 3개월 계약월
  const targetMonths = ["202410", "202409", "202408"];
  console.log(`📅 수집 계약월: ${targetMonths.join(", ")}`);

  // 경기 핵심(남양주, 구리, 성남, 하남, 수원, 화성, 용인 등) + 서울 25개구 포함
  const gyeonggiKeyCodes = [
    { region: "경기 남양주시", code: "41360" },
    { region: "경기 구리시", code: "41310" },
    { region: "경기 성남시 분당구", code: "41135" },
    { region: "경기 하남시", code: "41450" },
    { region: "경기 화성시", code: "41590" },
    { region: "경기 수원시 영통구", code: "41117" },
    { region: "경기 용인시 수지구", code: "41465" },
    { region: "경기 고양시 일산동구", code: "41285" },
    { region: "경기 안양시 동안구", code: "41173" },
    { region: "경기 부천시", code: "41190" },
  ];

  const priorityCodes = [...gyeonggiKeyCodes, ...LAWD_CODES.slice(0, 30)];

  let totalTrades = 0;
  let totalRents = 0;
  let updatedAptCount = 0;

  // 빠른 단지 조회를 위한 Map 구축
  // 키: 법정동명 + 단지명정규화
  const aptMap = new Map<string, any[]>();
  for (const apt of masterList) {
    const k = `${normalizeKey(apt.district)}__${normalizeKey(apt.name)}`;
    if (!aptMap.has(k)) aptMap.set(k, []);
    aptMap.get(k)!.push(apt);
  }

  for (let i = 0; i < priorityCodes.length; i++) {
    const reg = priorityCodes[i];
    process.stdout.write(`📡 [${i + 1}/${priorityCodes.length}] ${reg.region} (${reg.code}) 수집 중... `);

    const regionTrades: RawTrade[] = [];
    const regionRents: RawRent[] = [];

    for (const ymd of targetMonths) {
      const trades = await fetchMolitTradesForMonth(reg.code, ymd, apiKey);
      const rents = await fetchMolitRentsForMonth(reg.code, ymd, apiKey);
      regionTrades.push(...trades);
      regionRents.push(...rents);
      await sleep(50);
    }

    totalTrades += regionTrades.length;
    totalRents += regionRents.length;

    // 단지별로 거래 그룹핑
    const tradesByApt = new Map<string, RawTrade[]>();
    for (const t of regionTrades) {
      const k = `${normalizeKey(t.umdNm)}__${normalizeKey(t.aptNm)}`;
      if (!tradesByApt.has(k)) tradesByApt.set(k, []);
      tradesByApt.get(k)!.push(t);
    }

    const rentsByApt = new Map<string, RawRent[]>();
    for (const r of regionRents) {
      const k = `${normalizeKey(r.umdNm)}__${normalizeKey(r.aptNm)}`;
      if (!rentsByApt.has(k)) rentsByApt.set(k, []);
      rentsByApt.get(k)!.push(r);
    }

    // 마스터 단지에 순수 실거래가 및 건축년도 반영
    for (const [k, trades] of tradesByApt.entries()) {
      const matchedList = aptMap.get(k);
      if (!matchedList || matchedList.length === 0) continue;

      // 최신순 정렬
      trades.sort((a, b) => b.dealTime - a.dealTime);
      const latest = trades[0];

      // 최근 3개월(92일) 거래의 산술 평균 산출
      const THREE_MONTHS_MS = 92 * 24 * 60 * 60 * 1000;
      const recent3M = trades.filter((t) => latest.dealTime - t.dealTime <= THREE_MONTHS_MS);

      const avgPrice = recent3M.length >= 2
        ? Math.round(recent3M.reduce((sum, t) => sum + t.dealAmount, 0) / recent3M.length)
        : latest.dealAmount;

      const minPrice = Math.min(...trades.map((t) => t.dealAmount));
      const maxPrice = Math.max(...trades.map((t) => t.dealAmount));

      // 전세가 매핑
      const rents = rentsByApt.get(k) || [];
      const jeonseOnly = rents.filter((r) => r.monthlyRent === 0 && r.depositAmount > 0);
      const rentMin = jeonseOnly.length > 0 ? Math.min(...jeonseOnly.map((r) => r.depositAmount)) : undefined;
      const rentMax = jeonseOnly.length > 0 ? Math.max(...jeonseOnly.map((r) => r.depositAmount)) : undefined;

      for (const targetApt of matchedList) {
        targetApt.price_min = minPrice;
        targetApt.price_max = maxPrice;
        targetApt.avgPrice = avgPrice;
        targetApt.isRealPrice = true;
        if (rentMin) targetApt.rent_min = rentMin;
        if (rentMax) targetApt.rent_max = rentMax;
        if (latest.buildYear && latest.buildYear > 1960 && !targetApt.built_year) {
          targetApt.built_year = latest.buildYear;
        }
        updatedAptCount++;
      }
    }

    console.log(`✓ 매매 ${regionTrades.length}건, 전월세 ${regionRents.length}건 완료`);
  }

  console.log("\n==========================================================================");
  console.log(`🎉 동기화 완료!`);
  console.log(`   - 수집된 매매 실거래 신고 건수: ${totalTrades.toLocaleString()}건`);
  console.log(`   - 수집된 전월세 신고 건수: ${totalRents.toLocaleString()}건`);
  console.log(`   - 실거래가 및 건축년도 정합성 갱신된 단지: ${updatedAptCount.toLocaleString()}개`);
  console.log("==========================================================================");

  // 저장
  fs.writeFileSync(masterPath, JSON.stringify(masterList, null, 2), "utf-8");
  console.log(`💾 순수 K-apt 마스터 파일 저장 완료: ${masterPath}`);
}

main().catch(console.error);
