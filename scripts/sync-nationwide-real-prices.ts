import * as fs from "fs";
import * as path from "path";
import { LAWD_CODES } from "../src/lib/publicDataApi";

const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");
const apiKey = "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";

interface RawTrade {
  aptNm: string;
  dealAmount: number;
  buildYear: number | null;
  excluUseAr: number;
  umdNm: string;
  dealYear: number;
  dealMonth: number;
  floor: number;
}

function normalizeAptName(name: string): string {
  if (!name) return "";
  return name
    .replace(/[\s\-_(),.·]/g, "")
    .replace(/이편한세상|e\-편한세상/gi, "e편한세상")
    .replace(/자연앤e편한세상|자연&e편한세상/gi, "e편한세상")
    .replace(/에스케이뷰|sk\s*view/gi, "sk뷰")
    .replace(/대우\s*푸르지오(?!아)/gi, "푸르지오")
    .replace(/금호\s*어울림/gi, "금호어울림")
    .replace(/1차|ⅰ|i단지|1단지|Ⅰ/gi, "1")
    .replace(/2차|ⅱ|ii단지|2단지|Ⅱ/gi, "2")
    .replace(/3차|ⅲ|iii단지|3단지|Ⅲ/gi, "3")
    .replace(/4차|ⅳ|iv단지|4단지|Ⅳ/gi, "4")
    .replace(/5차|ⅴ|v단지|5단지|Ⅴ/gi, "5")
    .replace(/6차|ⅵ|vi단지|6단지|Ⅵ/gi, "6")
    .replace(/7차|ⅶ|vii단지|7단지|Ⅶ/gi, "7")
    .replace(/8차|ⅷ|viii단지|8단지|Ⅷ/gi, "8")
    .replace(/아파트|단지$/g, "")
    .toLowerCase();
}

function normalizeRegion(reg: string): string {
  if (!reg) return "";
  return reg.replace(/[\s시군구]/g, "");
}

function isRegionMatch(aptRegion: string, lawdRegion: string): boolean {
  if (!aptRegion || !lawdRegion) return false;
  // 화성시 특수 처리
  if (aptRegion.includes("화성") && lawdRegion.includes("화성")) return true;
  // 세종시 특수 처리
  if (aptRegion.includes("세종") && lawdRegion.includes("세종")) return true;
  // 인천 서구 / 검단 특수 처리
  if (aptRegion.includes("인천") && lawdRegion.includes("인천")) {
    if ((aptRegion.includes("검단") || aptRegion.includes("서해")) && lawdRegion.includes("서구")) return true;
  }

  const normApt = normalizeRegion(aptRegion);
  const normLawd = normalizeRegion(lawdRegion);

  if (normApt === normLawd || normApt.includes(normLawd) || normLawd.includes(normApt)) {
    return true;
  }
  return false;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchRegionTrades(lawdCd: string, months: string[]): Promise<RawTrade[]> {
  const trades: RawTrade[] = [];
  for (const ymd of months) {
    const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${apiKey}&LAWD_CD=${lawdCd}&DEAL_YMD=${ymd}&numOfRows=1000`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const xml = await res.text();
      const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
      for (const item of items) {
        const getVal = (tag: string) => {
          const m = item.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
          return m ? m[1].trim() : "";
        };
        const aptNm = getVal("aptNm");
        const dealAmtStr = getVal("dealAmount").replace(/,/g, "");
        if (!aptNm || !dealAmtStr) continue;
        trades.push({
          aptNm,
          dealAmount: parseInt(dealAmtStr, 10),
          buildYear: parseInt(getVal("buildYear"), 10) || null,
          excluUseAr: parseFloat(getVal("excluUseAr")) || 84,
          umdNm: getVal("umdNm"),
          dealYear: parseInt(getVal("dealYear"), 10),
          dealMonth: parseInt(getVal("dealMonth"), 10),
          floor: parseInt(getVal("floor"), 10) || 1,
        });
      }
    } catch (e) {}
    await sleep(25);
  }
  return trades;
}

async function main() {
  console.log("==========================================================================");
  console.log("🚀 [전국 264개 시·군·구 전수] 국토부 실거래가 기반 아파트 시세 정합성 완성");
  console.log("==========================================================================");

  const masterList: any[] = JSON.parse(fs.readFileSync(masterPath, "utf-8"));
  console.log(`📦 마스터 데이터: 총 ${masterList.length.toLocaleString()}개 단지 로드`);

  // 최근 6개월 스캔
  const months = ["202609", "202608", "202607", "202606", "202605", "202604"];

  // 화성시 분할 코드 추가 (41591: 동탄권, 41593: 서부권)
  const fullTargetCodes = [...LAWD_CODES];
  if (!fullTargetCodes.find((c) => c.code === "41591")) {
    fullTargetCodes.push({ region: "경기 화성시(동탄)", code: "41591" });
  }
  if (!fullTargetCodes.find((c) => c.code === "41593")) {
    fullTargetCodes.push({ region: "경기 화성시(서부)", code: "41593" });
  }

  console.log(`📍 전수 스캔 대상: 총 ${fullTargetCodes.length}개 법정동 코드`);

  let totalTradesCollected = 0;
  let totalMatched = 0;
  let totalDongEstimated = 0;

  for (let idx = 0; idx < fullTargetCodes.length; idx++) {
    const reg = fullTargetCodes[idx];
    const regionName = reg.region;
    const lawdCd = reg.code;

    const trades = await fetchRegionTrades(lawdCd, months);
    totalTradesCollected += trades.length;

    if (trades.length === 0) continue;

    process.stdout.write(`📡 [${idx + 1}/${fullTargetCodes.length}] ${regionName}: ${trades.length}건 실거래 집계 중...\n`);

    // 1. 동(umdNm)별 평당 거래가 집계
    const dongPyeongPrices: Record<string, number[]> = {};
    for (const t of trades) {
      const umd = t.umdNm;
      const pyeong = t.excluUseAr / 3.30578;
      if (pyeong > 5 && t.dealAmount > 0) {
        const pricePerPyeong = t.dealAmount / pyeong;
        if (!dongPyeongPrices[umd]) dongPyeongPrices[umd] = [];
        dongPyeongPrices[umd].push(pricePerPyeong);
      }
    }

    const dongAvgPricePerPyeong: Record<string, number> = {};
    for (const [dong, pps] of Object.entries(dongPyeongPrices)) {
      dongAvgPricePerPyeong[dong] = Math.round(pps.reduce((a, b) => a + b, 0) / pps.length);
    }

    const allPps = Object.values(dongPyeongPrices).flat();
    const regionAvgPricePerPyeong = allPps.length > 0
      ? Math.round(allPps.reduce((a, b) => a + b, 0) / allPps.length)
      : 3000;

    // 2. 해당 지역 아파트 정밀 매칭 (유연한 지역 매칭 적용)
    const regionApts = masterList.filter((a) => isRegionMatch(a.region, regionName));

    for (const apt of regionApts) {
      const normMaster = normalizeAptName(apt.name);
      const aptTrades = trades.filter((t) => {
        const dongMatch = !apt.district || !t.umdNm || apt.district.includes(t.umdNm) || t.umdNm.includes(apt.district);
        if (!dongMatch) return false;
        const normTrade = normalizeAptName(t.aptNm);
        return normMaster === normTrade || normMaster.includes(normTrade) || normTrade.includes(normMaster);
      });

      if (aptTrades.length > 0) {
        // [직접 실거래 1:1 매칭 성공]
        totalMatched++;
        const amounts = aptTrades.map((t) => t.dealAmount);
        const minP = Math.min(...amounts);
        const maxP = Math.max(...amounts);
        const avgP = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length);

        apt.price_min = minP;
        apt.price_max = maxP;

        // 실제 국토부 준공년도 반영
        const validBuildYear = aptTrades.find((t) => t.buildYear && t.buildYear > 1960)?.buildYear;
        if (validBuildYear) {
          apt.built_year = validBuildYear;
        }

        const jeonseRatio = (apt.jeonseRatio && apt.jeonseRatio >= 45 && apt.jeonseRatio <= 85) ? apt.jeonseRatio : 60;
        apt.rent_min = Math.round(minP * (jeonseRatio / 100));
        apt.rent_max = Math.round(maxP * (jeonseRatio / 100));
        apt.gapPrice = Math.max(0, Math.round(avgP * ((100 - jeonseRatio) / 100)));

        if (!apt.tags) apt.tags = [];
        if (!apt.tags.includes("실거래인증")) apt.tags.push("실거래인증");
        // 이전 추정 태그 제거
        apt.tags = apt.tags.filter((t: string) => t !== "동별시세기준");
        apt.isRealPrice = true;
      } else if (!apt.isRealPrice) {
        // [실거래 없는 단지]: 동별 실거래 평당가 × 평형으로 현실적 시세 산출
        const aptPyeong = apt.area_pyeong || (apt.area_sqm ? Math.round(apt.area_sqm / 3.3) : 32);
        const avgPpp = dongAvgPricePerPyeong[apt.district] || regionAvgPricePerPyeong;
        const estAvg = Math.round(avgPpp * aptPyeong);

        apt.price_min = Math.round(estAvg * 0.95);
        apt.price_max = Math.round(estAvg * 1.05);

        const jeonseRatio = (apt.jeonseRatio && apt.jeonseRatio >= 45 && apt.jeonseRatio <= 85) ? apt.jeonseRatio : 60;
        apt.rent_min = Math.round(apt.price_min * (jeonseRatio / 100));
        apt.rent_max = Math.round(apt.price_max * (jeonseRatio / 100));
        apt.gapPrice = Math.max(0, Math.round(estAvg * ((100 - jeonseRatio) / 100)));

        if (!apt.tags) apt.tags = [];
        if (!apt.tags.includes("동별시세기준")) apt.tags.push("동별시세기준");
        totalDongEstimated++;
      }
    }
  }

  console.log("\n==========================================================================");
  console.log(`🎉 전국 전수 동기화 최종 완료!`);
  console.log(`- 수집된 총 실거래 수: ${totalTradesCollected.toLocaleString()}건`);
  console.log(`- 국토부 직접 실거래 1:1 매칭 단지: ${totalMatched.toLocaleString()}개`);
  console.log(`- 동별 실거래 평당가 기반 교정 단지: ${totalDongEstimated.toLocaleString()}개`);
  console.log("==========================================================================");

  fs.writeFileSync(masterPath, JSON.stringify(masterList, null, 2), "utf-8");
  console.log(`💾 마스터 파일 저장 완료: ${masterPath}`);
}

main().catch(console.error);
