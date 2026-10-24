import * as fs from "fs";
import * as path from "path";

const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");
const masterData = JSON.parse(fs.readFileSync(masterPath, "utf-8"));

const apiKey = "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";

interface TradeItem {
  aptNm: string;
  amount: number;
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  area: number;
  umdNm: string;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchTradesForLawd(lawdCd: string, months: string[]): Promise<TradeItem[]> {
  const items: TradeItem[] = [];
  for (const m of months) {
    try {
      const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${apiKey}&LAWD_CD=${lawdCd}&DEAL_YMD=${m}&numOfRows=1000`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const xml = await res.text();
      const matches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
      for (const it of matches) {
        const aptNm = (it.match(/<aptNm>(.*?)<\/aptNm>/) || [])[1]?.trim() || "";
        const umdNm = (it.match(/<umdNm>(.*?)<\/umdNm>/) || [])[1]?.trim() || "";
        const amountStr = ((it.match(/<dealAmount>(.*?)<\/dealAmount>/) || [])[1] || "").trim().replace(/,/g, "");
        const dealYear = parseInt((it.match(/<dealYear>(.*?)<\/dealYear>/) || [])[1], 10);
        const dealMonth = parseInt((it.match(/<dealMonth>(.*?)<\/dealMonth>/) || [])[1], 10);
        const dealDay = parseInt((it.match(/<dealDay>(.*?)<\/dealDay>/) || [])[1], 10);
        const area = parseFloat((it.match(/<excluUseAr>(.*?)<\/excluUseAr>/) || [])[1]);
        if (aptNm && amountStr) {
          items.push({
            aptNm,
            umdNm,
            amount: parseInt(amountStr, 10),
            dealYear,
            dealMonth,
            dealDay,
            area,
          });
        }
      }
    } catch (e) {
      console.error(`Error fetching ${lawdCd} ${m}:`, e);
    }
    await sleep(50);
  }
  return items;
}

function normalize(str: string) {
  return str.replace(/[\s\-_(),.·]/g, "").toLowerCase()
    .replace(/1차|ⅰ|i단지|1단지|Ⅰ/gi, "1")
    .replace(/2차|ⅱ|ii단지|2단지|Ⅱ/gi, "2")
    .replace(/3차|ⅲ|iii단지|3단지|Ⅲ/gi, "3");
}

async function main() {
  console.log("🚀 국토교통부 2026년 최신 실거래가 수집 및 마스터 데이터 갱신 시작...");
  
  // 남양주시(41360), 구리시(41310), 하남시(41450) 등 인접 지역 최신 3개월 수집
  const months = ["202609", "202608", "202607"];
  const targetLawds = [
    { code: "41360", name: "경기 남양주시" },
    { code: "41310", name: "경기 구리시" },
    { code: "41450", name: "경기 하남시" },
  ];

  const allTrades: { region: string; trade: TradeItem }[] = [];
  for (const t of targetLawds) {
    console.log(`📡 [${t.name}] 실거래 수집 중...`);
    const trades = await fetchTradesForLawd(t.code, months);
    console.log(`   수집 완료: ${trades.length}건`);
    for (const tr of trades) {
      allTrades.push({ region: t.name, trade: tr });
    }
  }

  // 단지별 그룹화
  const groupedByApt = new Map<string, TradeItem[]>();
  for (const { region, trade } of allTrades) {
    const key = `${region}__${trade.aptNm}`;
    if (!groupedByApt.has(key)) {
      groupedByApt.set(key, []);
    }
    groupedByApt.get(key)!.push(trade);
  }

  console.log(`\n총 고유 단지 수: ${groupedByApt.size}개`);

  // 마스터 데이터 업데이트
  let updatedCount = 0;
  for (const apt of masterData) {
    // 1. 단지명 매칭 시도
    let matchedTrades: TradeItem[] | null = null;
    const aptNorm = normalize(apt.name);

    for (const [key, trades] of groupedByApt.entries()) {
      const [reg, tradeAptNm] = key.split("__");
      if (apt.region.includes(reg.replace("경기 ", "")) || reg.includes(apt.region)) {
        const tradeNorm = normalize(tradeAptNm);
        if (
          aptNorm === tradeNorm ||
          aptNorm.includes(tradeNorm) ||
          tradeNorm.includes(aptNorm) ||
          (aptNorm.includes("반도유보라") && tradeNorm.includes("반도유보라") && !tradeNorm.includes("별내") && !tradeNorm.includes("메이플") && !aptNorm.includes("메이플")) ||
          (aptNorm.includes("리버테라스2") && tradeNorm.includes("리버테라스2")) ||
          (aptNorm.includes("리버테라스1") && tradeNorm.includes("리버테라스1")) ||
          (aptNorm.includes("퍼스트리버") && tradeNorm.includes("퍼스트리버")) ||
          (aptNorm.includes("퍼스트포레") && tradeNorm.includes("퍼스트포레")) ||
          (aptNorm.includes("아이비플레이스") && tradeNorm.includes("아이비플레이스")) ||
          (aptNorm.includes("폴라리스") && tradeNorm.includes("폴라리스")) ||
          (aptNorm.includes("에일린의뜰") && tradeNorm.includes("에일린의뜰"))
        ) {
          matchedTrades = trades;
          break;
        }
      }
    }

    if (matchedTrades && matchedTrades.length > 0) {
      // 최근 거래일자 순 정렬
      matchedTrades.sort((a, b) => {
        const da = new Date(a.dealYear, a.dealMonth - 1, a.dealDay || 1).getTime();
        const db = new Date(b.dealYear, b.dealMonth - 1, b.dealDay || 1).getTime();
        return db - da;
      });

      // 최근 5건 거래 기준 통계
      const recent = matchedTrades.slice(0, Math.min(5, matchedTrades.length));
      const prices = recent.map((t) => t.amount);
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      const avgP = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

      const oldMin = apt.price_min;
      const oldMax = apt.price_max;
      const oldAvg = Math.round((oldMin + oldMax) / 2);

      apt.price_min = minP;
      apt.price_max = maxP;
      
      // 전세가/월세/전세가율/갭투자 갱신
      const jeonseRatio = apt.jeonseRatio || 55;
      apt.rent_min = Math.round(minP * (jeonseRatio / 100));
      apt.rent_max = Math.round(maxP * (jeonseRatio / 100));
      apt.gapPrice = Math.round(avgP * ((100 - jeonseRatio) / 100));

      if (apt.name.includes("다산") || apt.name.includes("반도유보라") || apt.name.includes("펜테리움")) {
        console.log(`✅ [업데이트] ${apt.name} (${apt.region} ${apt.district}):`);
        console.log(`   기존: ${oldMin}~${oldMax} (평균 ${(oldAvg / 10000).toFixed(1)}억)`);
        console.log(`   신규: ${minP}~${maxP} (평균 ${(avgP / 10000).toFixed(1)}억, 최근 5건 기준)`);
      }
      updatedCount++;
    }
  }

  console.log(`\n총 ${updatedCount}개 단지 실거래가 최신화 완료!`);
  fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2), "utf-8");
  console.log(`💾 저장 완료: ${masterPath}`);
}

main().catch(console.error);


