import * as fs from "fs";
import * as path from "path";
import { LAWD_CODES } from "../src/lib/publicDataApi";

const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");
const masterData: any[] = JSON.parse(fs.readFileSync(masterPath, "utf-8"));

const apiKey =
  process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY ||
  process.env.DATA_GO_KR_API_KEY ||
  "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";

interface RawTrade {
  aptNm: string;
  umdNm: string;
  amount: number; // 만원
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  area: number; // 전용면적 m2
  supplyPyeong: number; // 공급평형 (25, 30, 34, 40 등)
  region: string;
}

// 전용면적(m2) -> 분양/공급 평형 변환
function areaToSupplyPyeong(areaSqm: number): number {
  if (areaSqm < 45) return 18;
  if (areaSqm < 65) return 25; // 전용 59m2 -> 24~25평형
  if (areaSqm < 78) return 30; // 전용 74m2 -> 30평형
  if (areaSqm < 90) return 34; // 전용 84m2 -> 34평형 (국평)
  if (areaSqm < 110) return 40; // 전용 101~105m2 -> 40평형
  if (areaSqm < 135) return 48; // 전용 114~125m2 -> 48평형
  return 55;
}

function normalize(str: string): string {
  if (!str) return "";
  return str
    .replace(/[\s\-_(),.·]/g, "")
    .toLowerCase()
    .replace(/1차|ⅰ|i단지|1단지|Ⅰ/gi, "1")
    .replace(/2차|ⅱ|ii단지|2단지|Ⅱ/gi, "2")
    .replace(/3차|ⅲ|iii단지|3단지|Ⅲ/gi, "3")
    .replace(/4차|ⅳ|iv단지|4단지|Ⅳ/gi, "4")
    .replace(/5차|ⅴ|v단지|5단지|Ⅴ/gi, "5");
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchTrades(lawdCd: string, dealYmd: string, regionName: string): Promise<RawTrade[]> {
  const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${apiKey}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&numOfRows=1000`;
  const trades: RawTrade[] = [];
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

    for (const it of items) {
      const getVal = (tag: string) => {
        const m = it.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
        return m ? m[1].trim() : "";
      };

      const aptNm = getVal("aptNm");
      const dealAmtStr = getVal("dealAmount").replace(/,/g, "");
      if (!aptNm || !dealAmtStr) continue;

      const umdNm = getVal("umdNm");
      const area = parseFloat(getVal("excluUseAr")) || 84;
      const dealYear = parseInt(getVal("dealYear"), 10);
      const dealMonth = parseInt(getVal("dealMonth"), 10);
      const dealDay = parseInt(getVal("dealDay"), 10);
      const amount = parseInt(dealAmtStr, 10);

      trades.push({
        aptNm,
        umdNm,
        amount,
        dealYear,
        dealMonth,
        dealDay,
        area,
        supplyPyeong: areaToSupplyPyeong(area),
        region: regionName,
      });
    }
  } catch (err) {
    console.error(`[오류] ${regionName} (${dealYmd}):`, err);
  }
  return trades;
}

// 단지명 매칭 검증
function isNameMatch(targetName: string, candName: string): boolean {
  const tNorm = normalize(targetName);
  const cNorm = normalize(candName);
  if (tNorm === cNorm) return true;

  // 차수 불일치 방지
  const t1 = tNorm.includes("1");
  const t2 = tNorm.includes("2");
  const c1 = cNorm.includes("1");
  const c2 = cNorm.includes("2");
  if ((t1 && c2) || (t2 && c1)) return false;

  const tCore = tNorm.replace(/아파트|단지/g, "");
  const cCore = cNorm.replace(/아파트|단지/g, "");

  if (tCore.length >= 3 && cCore.length >= 3) {
    if (tCore === cCore || tCore.includes(cCore) || cCore.includes(tCore)) {
      return true;
    }
  }
  return false;
}

async function main() {
  console.log("=========================================================================");
  console.log("🚀 [전국 국토교통부 실거래가 전수 스캔] 서울 25개 자치구 + 경기 전체");
  console.log("   - 평형별(84㎡/59㎡ 등) 거래 분리 및 주력 평형 기준 정밀 시세 산출");
  console.log("=========================================================================");

  // 2026년 9월, 8월, 7월 (최근 3개월 최신 실거래)
  const dealYmdList = ["202609", "202608", "202607"];

  // 서울/경기 전체 지역 대상
  const targetRegions = LAWD_CODES.filter((c) => c.region.startsWith("서울") || c.region.startsWith("경기"));
  console.log(`📍 스캔 대상: 총 ${targetRegions.length}개 지역 (${dealYmdList.join(", ")})`);

  const allTrades: RawTrade[] = [];
  let completedRegions = 0;

  for (const reg of targetRegions) {
    let regTradesCount = 0;
    for (const dealYmd of dealYmdList) {
      const trades = await fetchTrades(reg.code, dealYmd, reg.region);
      trades.forEach((t) => allTrades.push(t));
      regTradesCount += trades.length;
      await sleep(40); // rate limit 방지
    }
    completedRegions++;
    if (completedRegions % 5 === 0 || completedRegions === targetRegions.length) {
      console.log(`📡 [${completedRegions}/${targetRegions.length}] 진행 중... 현재까지 총 ${allTrades.length.toLocaleString()}건 실거래 수집됨`);
    }
  }

  console.log(`\n🎉 실거래 수집 완료! 총 ${allTrades.length.toLocaleString()}건의 2026년 최신 거래 데이터 확보`);

  // 지역별 + 읍면동별 + 단지명별 그룹화
  // key: `${region}__${umdNm}__${normalizedAptName}`
  const tradeMap = new Map<string, RawTrade[]>();
  for (const t of allTrades) {
    const key = `${t.region}__${t.umdNm}__${normalize(t.aptNm)}`;
    if (!tradeMap.has(key)) tradeMap.set(key, []);
    tradeMap.get(key)!.push(t);
  }

  // 읍면동 무관 지역별 단지명 그룹 (보조 검색용)
  const regionAptMap = new Map<string, RawTrade[]>();
  for (const t of allTrades) {
    const key = `${t.region}__${normalize(t.aptNm)}`;
    if (!regionAptMap.has(key)) regionAptMap.set(key, []);
    regionAptMap.get(key)!.push(t);
  }

  console.log(`📊 고유 단지 그룹 수: ${tradeMap.size}개 그룹`);

  // 마스터 데이터 단지별 정밀 시세 갱신
  let updatedCount = 0;

  for (const apt of masterData) {
    const aptRegion = apt.region;
    const aptDist = apt.district || "";
    const aptNorm = normalize(apt.name);

    // 1. 매칭되는 실거래 레코드 탐색
    let matchedTrades: RawTrade[] = [];

    // 1-1. 지역 + 읍면동 + 단지명 매칭 시도
    for (const [key, trades] of tradeMap.entries()) {
      const [reg, umd, tNorm] = key.split("__");
      // 지역 일치 검사
      if (aptRegion.includes(reg) || reg.includes(aptRegion)) {
        // 읍면동 검사 (단지 district와 거래 umdNm)
        const distMatch = !aptDist || !umd || aptDist.includes(umd) || umd.includes(aptDist) ||
          (aptDist.includes("다산") && umd.includes("다산")) ||
          (aptDist.includes("잠실") && umd.includes("잠실")) ||
          (aptDist.includes("반포") && umd.includes("반포")) ||
          (aptDist.includes("대치") && umd.includes("대치"));

        if (distMatch && isNameMatch(apt.name, trades[0].aptNm)) {
          matchedTrades = trades;
          break;
        }
      }
    }

    // 1-2. 읍면동 불일치 시 같은 구/시 내 단지명 정밀 매칭
    if (matchedTrades.length === 0) {
      for (const [key, trades] of regionAptMap.entries()) {
        const [reg, tNorm] = key.split("__");
        if ((aptRegion.includes(reg) || reg.includes(aptRegion)) && isNameMatch(apt.name, trades[0].aptNm)) {
          matchedTrades = trades;
          break;
        }
      }
    }

    if (matchedTrades.length > 0) {
      // 최신 거래일자 순 정렬 (2026.09 -> 2026.08 -> 2026.07)
      matchedTrades.sort((a, b) => {
        const da = new Date(a.dealYear, a.dealMonth - 1, a.dealDay || 1).getTime();
        const db = new Date(b.dealYear, b.dealMonth - 1, b.dealDay || 1).getTime();
        return db - da;
      });

      // =========================================================================
      // [핵심 혁신] 평형별 거래 분리: 마스터 평형과 일치하는 거래 우선 매칭
      // =========================================================================
      const targetPyeong = apt.area_pyeong || 34;

      // 1) 마스터의 대표 평형(예: 34평)과 일치하는 거래들 필터링
      let pyeongTrades = matchedTrades.filter((t) => t.supplyPyeong === targetPyeong);

      // 2) 만약 해당 평형 거래가 없으면, 국민평형(34평) 거래가 있는지 확인
      if (pyeongTrades.length === 0) {
        pyeongTrades = matchedTrades.filter((t) => t.supplyPyeong === 34);
      }

      // 3) 34평 거래도 없으면 25평(59m2) 거래 확인
      if (pyeongTrades.length === 0) {
        pyeongTrades = matchedTrades.filter((t) => t.supplyPyeong === 25);
      }

      // 4) 그래도 없으면 가장 거래량이 많은 주력 평형 선택
      if (pyeongTrades.length === 0) {
        const countByPyeong = new Map<number, number>();
        matchedTrades.forEach((t) => {
          countByPyeong.set(t.supplyPyeong, (countByPyeong.get(t.supplyPyeong) || 0) + 1);
        });
        const dominantPyeong = Array.from(countByPyeong.entries()).sort((a, b) => b[1] - a[1])[0][0];
        pyeongTrades = matchedTrades.filter((t) => t.supplyPyeong === dominantPyeong);
      }

      // 주력 평형으로 단지 평형 정보 동기화 (평형 왜곡 방지)
      const finalPyeong = pyeongTrades[0].supplyPyeong;
      const finalAreaSqm = Math.round(pyeongTrades[0].area);
      apt.area_pyeong = finalPyeong;
      apt.area_sqm = finalAreaSqm;

      // 해당 평형의 최근 최대 5건 실거래가 기준 시세 산출
      const recent = pyeongTrades.slice(0, Math.min(5, pyeongTrades.length));
      const prices = recent.map((t) => t.amount);
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      const avgP = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

      apt.price_min = minP;
      apt.price_max = maxP;

      // 전세가/갭투자도 해당 평형의 실거래가 기준으로 정합성 있게 계산
      const jeonseRatio = apt.jeonseRatio || 56;
      apt.rent_min = Math.round(minP * (jeonseRatio / 100));
      apt.rent_max = Math.round(maxP * (jeonseRatio / 100));
      apt.gapPrice = Math.max(0, Math.round(avgP * ((100 - jeonseRatio) / 100)));

      updatedCount++;
    }
  }

  console.log(`\n🎉 총 ${updatedCount.toLocaleString()}개 단지 2026년 최신 국토부 실거래가 정밀 동기화 완료!`);

  fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2), "utf-8");
  console.log(`💾 마스터 데이터셋 업데이트 저장 완료: ${masterPath}`);

  // 주요 랜드마크 검증 출력
  console.log("\n=================== [주요 랜드마크 실거래가 검증] ===================");
  const verifyList = [
    "다산한강반도유보라", "다산금강펜테리움 리버테라스 1차", "잠실엘스", "은마",
    "마포래미안푸르지오", "반포자이", "아크로리버파크", "킨텍스원시티", "판교푸르지오그랑블"
  ];
  for (const name of verifyList) {
    const item = masterData.find((a: any) => a.name.includes(name));
    if (item) {
      const avg = Math.round((item.price_min + item.price_max) / 2);
      const uk = Math.floor(avg / 10000);
      const cheon = Math.floor((avg % 10000) / 1000);
      const avgStr = uk > 0 ? (cheon > 0 ? `${uk}.${cheon}억` : `${uk}.0억`) : `${avg}만`;
      console.log(`📍 ${item.name} (${item.region}): ${item.area_pyeong}평형 -> 최근 실거래: ${avgStr} (범위: ${(item.price_min/10000).toFixed(1)}억~${(item.price_max/10000).toFixed(1)}억, 전세: ${(item.rent_min/10000).toFixed(1)}억, 갭: ${(item.gapPrice/10000).toFixed(1)}억)`);
    }
  }
}

main().catch(console.error);
