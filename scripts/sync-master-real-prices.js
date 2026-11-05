const fs = require('fs');
const path = require('path');

const apiKey = "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";

// 정규화 함수
function normalizeAptName(name) {
  if (!name) return "";
  return name
    .replace(/\(주\)|주식회사|\[주\]|\(유\)|유한회사/gi, "")
    .replace(/[\s\-_(),.·[\]{}<>]/g, "")
    .replace(/아파트|마을/g, "")
    .replace(/다산지금|다산진건|다산신도시/g, "다산")
    .replace(/금강펜테리움/gi, "펜테리움")
    .replace(/자연앤e편한세상|자연&e편한세상|이편한세상|e\-편한세상/gi, "e편한세상")
    .replace(/1차|ⅰ|i단지|1단지|Ⅰ/gi, "1")
    .replace(/2차|ⅱ|ii단지|2단지|Ⅱ/gi, "2")
    .replace(/3차|ⅲ|iii단지|3단지|Ⅲ/gi, "3")
    .toLowerCase();
}

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchTrades(lawdCd, ymdList) {
  const trades = [];
  for (const ymd of ymdList) {
    try {
      const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${apiKey}&LAWD_CD=${lawdCd}&DEAL_YMD=${ymd}&numOfRows=1000`;
      const res = await fetch(url);
      if (!res.ok) continue;
      const text = await res.text();
      const matches = text.match(/<item>[\s\S]*?<\/item>/g) || [];
      for (const m of matches) {
        const aptNm = (m.match(/<aptNm>(.*?)<\/aptNm>/) || [])[1]?.trim() || "";
        const umdNm = (m.match(/<umdNm>(.*?)<\/umdNm>/) || [])[1]?.trim() || "";
        const amountStr = ((m.match(/<dealAmount>(.*?)<\/dealAmount>/) || [])[1] || "").trim().replace(/,/g, "");
        const dealYear = parseInt((m.match(/<dealYear>(.*?)<\/dealYear>/) || [])[1], 10);
        const dealMonth = parseInt((m.match(/<dealMonth>(.*?)<\/dealMonth>/) || [])[1], 10);
        const dealDay = parseInt((m.match(/<dealDay>(.*?)<\/dealDay>/) || [])[1], 10) || 1;
        const area = parseFloat((m.match(/<excluUseAr>(.*?)<\/excluUseAr>/) || [])[1]);
        const floor = parseInt((m.match(/<floor>(.*?)<\/floor>/) || [])[1], 10) || 1;

        if (aptNm && amountStr) {
          trades.push({
            aptNm,
            umdNm,
            amount: parseInt(amountStr, 10),
            dealYear,
            dealMonth,
            dealDay,
            dealTime: new Date(dealYear, dealMonth - 1, dealDay).getTime(),
            dealDate: `${dealYear}.${String(dealMonth).padStart(2, "0")}.${String(dealDay).padStart(2, "0")}`,
            area,
            floor,
          });
        }
      }
    } catch (e) {
      console.warn(`Error fetching ${lawdCd} ${ymd}:`, e.message);
    }
    await sleep(30);
  }
  return trades;
}

async function main() {
  console.log('정밀 실거래가 동기화 시작...');
  const masterPath = path.resolve(__dirname, '../src/lib/apartments-master.json');
  const masterData = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

  const now = new Date();
  const ymdList = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    ymdList.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  // 1. 남양주 실거래 수집
  console.log('남양주시 실거래 수집 중...');
  const nyjTrades = await fetchTrades('41360', ymdList);
  // 1층 제외
  const validTrades = nyjTrades.filter(t => t.floor > 1);

  let updated = 0;

  for (const apt of masterData) {
    if (!apt.region || !apt.region.includes('남양주')) continue;

    const normApt = normalizeAptName(apt.name);
    const aptDistrict = apt.district || '';

    // 동 일치 + 이름 정규화 일치 검사
    const matched = validTrades.filter(t => {
      // 1. 읍면동이 지정되어 있으면 읍면동 검사 (다산동, 지금동, 도농동)
      if (aptDistrict && t.umdNm) {
        const isDasanGroup = (d) => /다산|도농|지금|가운/.test(d);
        if (isDasanGroup(aptDistrict) && !isDasanGroup(t.umdNm)) return false;
        if (!isDasanGroup(aptDistrict) && !t.umdNm.includes(aptDistrict.replace(/[동읍면]/g, ''))) return false;
      }

      const normT = normalizeAptName(t.aptNm);
      // 정확한 정규화 일치
      if (normApt === normT) return true;
      // 단지 차수(1, 2)가 다르면 매칭 금지
      const numApt = normApt.match(/\d+/g)?.join('');
      const numT = normT.match(/\d+/g)?.join('');
      if (numApt !== numT) return false;

      // 이름 포함 관계 (최소 4글자 이상)
      if (normApt.length >= 4 && normT.length >= 4) {
        if (normApt.includes(normT) || normT.includes(normApt)) return true;
      }
      return false;
    });

    if (matched.length === 0) continue;

    matched.sort((a, b) => b.dealTime - a.dealTime);
    const latest = matched[0];
    const ONE_MONTH_MS = 31 * 24 * 60 * 60 * 1000;
    const recent1Month = matched.filter(t => latest.dealTime - t.dealTime <= ONE_MONTH_MS);

    let finalPrice;
    if (recent1Month.length >= 2) {
      finalPrice = Math.round(recent1Month.reduce((sum, t) => sum + t.amount, 0) / recent1Month.length);
    } else {
      finalPrice = latest.amount;
    }

    const prev = apt.price_max;
    apt.price_max = finalPrice;
    apt.price_min = finalPrice;
    apt.isRealPrice = true;
    if (apt.jeonseRatio) {
      apt.rent_max = Math.round(finalPrice * (apt.jeonseRatio / 100));
      apt.rent_min = apt.rent_max;
      apt.gapPrice = Math.max(0, finalPrice - apt.rent_max);
    }
    updated++;

    if (apt.name.includes('다산한강반도유보라') || apt.name.includes('다산금강펜테리움') || apt.name.includes('다산신안인스빌')) {
      console.log(`🎯 [정밀동기화] ${apt.name}: ${(prev / 10000).toFixed(1)}억 -> ${(finalPrice / 10000).toFixed(1)}억 (최근1개월 ${recent1Month.length}건 기준, 최신:${(latest.amount / 10000).toFixed(2)}억)`);
    }
  }

  fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2), 'utf-8');
  console.log(`\n🎉 완료! 총 ${updated}개 단지 정밀 실거래가 동기화 완료`);
}

main().catch(console.error);
