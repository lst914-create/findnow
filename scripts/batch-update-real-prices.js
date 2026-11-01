const fs = require('fs');
const path = require('path');

const masterPath = path.resolve(__dirname, '../src/lib/apartments-master.json');
const masterData = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

const apiKey = "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";
const encodedKey = encodeURIComponent(decodeURIComponent(apiKey));

// 주요 핵심 45개 시·군·구 (더미 단지 집중 지역)
const TARGET_LAWDS = [
  // 서울
  { region: '서울 강남구', code: '11680' },
  { region: '서울 서초구', code: '11650' },
  { region: '서울 송파구', code: '11710' },
  { region: '서울 마포구', code: '11440' },
  { region: '서울 용산구', code: '11170' },
  { region: '서울 성동구', code: '11200' },
  { region: '서울 노원구', code: '11350' },
  { region: '서울 양천구', code: '11470' },
  { region: '서울 영등포구', code: '11560' },
  { region: '서울 강동구', code: '11740' },
  { region: '서울 강서구', code: '11500' },
  { region: '서울 은평구', code: '11380' },
  { region: '서울 성북구', code: '11290' },
  { region: '서울 구로구', code: '11530' },
  // 경기
  { region: '경기 화성시', code: '41590' },
  { region: '경기 남양주시', code: '41360' },
  { region: '경기 구리시', code: '41310' },
  { region: '경기 하남시', code: '41450' },
  { region: '경기 파주시', code: '41480' },
  { region: '경기 평택시', code: '41220' },
  { region: '경기 김포시', code: '41570' },
  { region: '경기 시흥시', code: '41390' },
  { region: '경기 군포시', code: '41410' },
  { region: '경기 의정부시', code: '41150' },
  { region: '경기 양주시', code: '41630' },
  // 광주 / 대구 / 대전 / 인천 / 부산
  { region: '광주 북구', code: '29170' },
  { region: '광주 서구', code: '29140' },
  { region: '광주 남구', code: '29155' },
  { region: '대구 수성구', code: '27260' },
  { region: '대구 달서구', code: '27290' },
  { region: '대구 북구', code: '27230' },
  { region: '대전 유성구', code: '30200' },
  { region: '인천 연수구', code: '28185' },
  { region: '인천 남동구', code: '28200' },
  { region: '인천 서구', code: '28260' },
  { region: '부산 해운대구', code: '26350' },
  { region: '부산 수영구', code: '26500' },
  { region: '세종특별자치시', code: '36110' },
];

function normalize(name) {
  if (!name) return "";
  return name
    .replace(/\(주\)|주식회사|\[주\]/gi, "")
    .replace(/[\s\-_(),.·[\]{}<>]/g, "")
    .replace(/아파트|마을/g, "")
    .replace(/다산지금|다산진건|다산신도시/g, "다산")
    .replace(/동탄2신도시|동탄신도시|동탄2/g, "동탄")
    .replace(/미사강변도시|미사강변/g, "미사")
    .replace(/위례신도시/g, "위례")
    .replace(/송도국제도시/g, "송도")
    .replace(/배곧신도시/g, "배곧")
    .replace(/운정신도시/g, "운정")
    .replace(/옥정신도시|양주옥정/g, "옥정")
    .replace(/부영사랑으로|사랑으로\s*부영|사랑으로/gi, "부영")
    .replace(/금강펜테리움/gi, "펜테리움")
    .replace(/자연앤e편한세상|자연&e편한세상|이편한세상|e\-편한세상/gi, "e편한세상")
    .replace(/에스케이뷰|sk\s*view/gi, "sk뷰")
    .replace(/대우\s*푸르지오(?!아)/gi, "푸르지오")
    .replace(/금호\s*어울림/gi, "금호어울림")
    .replace(/호반\s*베르디움/gi, "호반베르디움")
    .replace(/호반\s*써밋/gi, "호반써밋")
    .replace(/유승\s*한내들/gi, "유승한내들")
    .replace(/신안\s*인스빌/gi, "신안인스빌")
    .replace(/한신\s*휴플러스|한신\s*더휴/gi, "한신더휴")
    .replace(/더샵|the\s*sharp/gi, "더샵")
    .replace(/아이파크|i\-park/gi, "아이파크")
    .replace(/블록|블럭|bl/gi, "")
    .replace(/1차|ⅰ|i단지|1단지|Ⅰ/gi, "1")
    .replace(/2차|ⅱ|ii단지|2단지|Ⅱ/gi, "2")
    .replace(/3차|ⅲ|iii단지|3단지|Ⅲ/gi, "3")
    .replace(/4차|ⅳ|iv단지|4단지|Ⅳ/gi, "4")
    .replace(/5차|ⅴ|v단지|5단지|Ⅴ/gi, "5")
    .toLowerCase();
}

function getSupplyPyeong(excluUseAr) {
  if (excluUseAr < 45) return Math.max(10, Math.round(excluUseAr * 0.45));
  if (excluUseAr < 65) return 25;
  if (excluUseAr < 80) return 30;
  if (excluUseAr < 95) return 34;
  if (excluUseAr < 125) return 40;
  return Math.round(excluUseAr * 0.36);
}

const getVal = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return m ? m[1].trim() : "";
};

const parseItems = (xmlText) => xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];

async function fetchTradesForLawd(lawdCd, months) {
  const trades = [];
  for (const m of months) {
    try {
      const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${encodedKey}&LAWD_CD=${lawdCd}&DEAL_YMD=${m}&numOfRows=1000`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const xml = await res.text();
      for (const item of parseItems(xml)) {
        const cancelCheck = getVal(item, "cdealType") || getVal(item, "cancelDealType");
        if (cancelCheck && cancelCheck.trim() !== "" && cancelCheck.trim() !== "0") continue;

        const aptNm = getVal(item, "aptNm");
        const umdNm = getVal(item, "umdNm");
        const dealAmtStr = getVal(item, "dealAmount").replace(/,/g, "");
        const year = getVal(item, "dealYear");
        const month = getVal(item, "dealMonth").padStart(2, "0");
        const day = (getVal(item, "dealDay") || "01").padStart(2, "0");
        const excluUseAr = parseFloat(getVal(item, "excluUseAr")) || 0;
        const floor = parseInt(getVal(item, "floor"), 10) || 1;

        if (!aptNm || !dealAmtStr) continue;
        const amount = parseInt(dealAmtStr, 10);
        if (isNaN(amount) || amount <= 0) continue;

        const supplyPyeong = getSupplyPyeong(excluUseAr);
        const dealTime = new Date(`${year}-${month}-${day}`).getTime();

        trades.push({
          aptNm,
          umdNm,
          normName: normalize(aptNm),
          amount,
          dealDate: `${year}.${month}.${day}`,
          dealTime,
          floor,
          areaSqm: excluUseAr,
          supplyPyeong
        });
      }
    } catch (e) {
      // ignore
    }
  }
  return trades;
}

async function main() {
  console.log("🚀 전국 핵심 지역 실거래가 대량 수집 및 더미 데이터 전면 갱신 시작...");

  // 최근 3개월 (202410, 202409, 202408)
  const months = ["202410", "202409", "202408"];
  const allTrades = [];

  for (let i = 0; i < TARGET_LAWDS.length; i++) {
    const t = TARGET_LAWDS[i];
    console.log(`[${i + 1}/${TARGET_LAWDS.length}] ${t.region} (${t.code}) 수집 중...`);
    const trades = await fetchTradesForLawd(t.code, months);
    console.log(`   수집 완료: ${trades.length}건`);
    trades.forEach(tr => allTrades.push({ region: t.region, trade: tr }));
  }

  console.log(`\n총 수집된 전국 거래 건수: ${allTrades.length}건`);

  // 단지별 + 평형별 그룹화
  // key: normName 또는 normName + umd
  const tradesByApt = new Map();
  for (const { trade } of allTrades) {
    const key = trade.normName;
    if (!tradesByApt.has(key)) tradesByApt.set(key, []);
    tradesByApt.get(key).push(trade);

    // 동 이름 조합 키도 추가 (예: 수택 + 금호어울림)
    if (trade.umdNm) {
      const cleanUmd = trade.umdNm.replace(/(동|읍|면|리)$/, "");
      if (cleanUmd && cleanUmd.length >= 2) {
        const aliasKey = normalize(`${cleanUmd}${trade.aptNm}`);
        if (!tradesByApt.has(aliasKey)) tradesByApt.set(aliasKey, []);
        tradesByApt.get(aliasKey).push(trade);
      }
    }
  }

  console.log(`고유 단지 매칭 키: ${tradesByApt.size}개`);

  // 마스터 데이터 갱신
  let updatedCount = 0;
  const ONE_MONTH_MS = 31 * 24 * 60 * 60 * 1000;

  for (const apt of masterData) {
    const norm = normalize(apt.name);
    // 1) 완전 정규화 일치 조회
    let trades = tradesByApt.get(norm);

    // 2) 동 이름 접두사 떼고 조회
    if (!trades && apt.district) {
      const cleanDist = apt.district.replace(/(동|읍|면|리)$/, "");
      if (apt.name.startsWith(cleanDist)) {
        const stripped = normalize(apt.name.slice(cleanDist.length));
        trades = tradesByApt.get(stripped);
      }
    }

    if (!trades || trades.length === 0) continue;

    // 평형별 그룹화
    const pyeongMap = new Map();
    trades.forEach(t => {
      const arr = pyeongMap.get(t.supplyPyeong) || [];
      arr.push(t);
      pyeongMap.set(t.supplyPyeong, arr);
    });

    // 1순위: 34평 거래
    const pyeong34 = pyeongMap.get(34) || trades.filter(t => t.supplyPyeong >= 32 && t.supplyPyeong <= 35);
    let selectedTrades = null;
    let selectedPyeong = 34;

    if (pyeong34 && pyeong34.length > 0) {
      selectedTrades = pyeong34;
      selectedPyeong = 34;
    } else {
      // 2순위: 가장 비싼 금액의 평형
      let maxP = -1;
      pyeongMap.forEach((pTrades, pNum) => {
        const latestP = pTrades.sort((a,b) => b.dealTime - a.dealTime)[0].amount;
        if (latestP > maxP) {
          maxP = latestP;
          selectedTrades = pTrades;
          selectedPyeong = pNum;
        }
      });
    }

    if (!selectedTrades || selectedTrades.length === 0) continue;

    selectedTrades.sort((a, b) => b.dealTime - a.dealTime);
    const latest = selectedTrades[0];
    const recent1M = selectedTrades.filter(t => latest.dealTime - t.dealTime <= ONE_MONTH_MS);

    let finalPrice = latest.amount;
    if (recent1M.length >= 2) {
      finalPrice = Math.round(recent1M.reduce((sum, t) => sum + t.amount, 0) / recent1M.length);
    }

    // 마스터 데이터 실제 실거래가로 갱신
    apt.price_min = finalPrice;
    apt.price_max = finalPrice;
    apt.area_pyeong = selectedPyeong;
    apt.area_sqm = Math.round(latest.areaSqm * 10) / 10;
    apt.isRealPrice = true;

    const jr = apt.jeonseRatio || 60;
    apt.rent_min = Math.round(finalPrice * (jr / 100));
    apt.rent_max = Math.round(finalPrice * (jr / 100));
    apt.gapPrice = Math.round(finalPrice * ((100 - jr) / 100));

    updatedCount++;
  }

  console.log(`\n🎉 총 ${updatedCount}개 단지 실제 국토부 실거래가로 전면 갱신 완료!`);

  // 더미 비율(1.10526)이 남아있는 단지들 중 실거래 미수집 단지들도 가격 범위를 정돈
  let cleanedCount = 0;
  for (const apt of masterData) {
    if (Math.abs(apt.price_max / apt.price_min - 1.10526) < 0.001) {
      // 가짜 min/max 범위 대신 대표 단일값으로 통일
      apt.price_max = apt.price_min;
      cleanedCount++;
    }
  }
  console.log(`🧹 더미 비율(1.10526) 잔여 단지 정돈 완료: ${cleanedCount}개`);

  fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2), 'utf8');
  console.log("💾 apartments-master.json 저장 완료!");
}

main().catch(console.error);

