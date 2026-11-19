const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/PC/Desktop/streamlit-detail-page/chajwo';
const MASTER_PATH = path.join(ROOT, 'src/lib/apartments-master.json');
const API_KEY = 'w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D';

function normalizeAptName(name) {
  if (!name) return '';
  return name
    .replace(/\(주\)|주식회사|\[주\]|\(유\)|유한회사/gi, '')
    .replace(/\d+동(?:\s*,\s*\d+동)*|\([0-9\-~,동\s]+\)/g, '')
    .replace(/[\s\-_(),.·\[\]{}<>]/g, '')
    .replace(/Ⅰ|ⅰ/g, '1')
    .replace(/Ⅱ|ⅱ/g, '2')
    .replace(/Ⅲ|ⅲ/g, '3')
    .replace(/Ⅳ|ⅳ/g, '4')
    .replace(/^(남양주|구리|하남|수원|용인|성남|화성|부천|안양|광명|평택|고양|일산|분당|판교|송파|강남|서초|강동|마포|영등포|노원|도봉|강북|성북|중랑|동대문|광진|성동|용산|중구|종로|서대문|은평|양천|강서|구로|금천|동작|관악|인천|대구|부산|대전|광주|울산|세종)/, '')
    .replace(/아파트|마을/g, '');
}

function fetchXml(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getVal = (xml, tag) => {
  const m = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return m ? m[1].trim() : '';
};

const parseItems = (xmlText) => xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];

async function main() {
  console.log('=== 국토부 아파트 분양권/입주권 전매 실거래 수집 & 마스터 DB 반영 (안정형) ===');

  const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
  console.log('총 마스터 단지 수:', masterData.length);

  // 1. 인덱스 구축 (sggCd + jibun, sggCd + baseJibun, sggCd + normName)
  const jibunIndex = new Map();
  const jibunBaseIndex = new Map();
  const normIndex = new Map();

  masterData.forEach((apt, idx) => {
    const sgg = apt.sgg_cd || apt.bjd_code || '';
    if (apt.district && apt.jibun) {
      const d = apt.district.trim();
      const j = apt.jibun.trim();
      const baseJ = j.split('-')[0];

      if (sgg) jibunIndex.set(`${sgg}|${d}|${j}`, idx);
      jibunIndex.set(`${d} ${j}`, idx);

      if (sgg && !jibunBaseIndex.has(`${sgg}|${d}|${baseJ}`)) {
        jibunBaseIndex.set(`${sgg}|${d}|${baseJ}`, idx);
      }
      if (!jibunBaseIndex.has(`${d} ${baseJ}`)) {
        jibunBaseIndex.set(`${d} ${baseJ}`, idx);
      }
    }
    const nKey = normalizeAptName(apt.name);
    if (nKey) {
      if (sgg) {
        const sKey = `${sgg}|${nKey}`;
        if (!normIndex.has(sKey)) normIndex.set(sKey, []);
        normIndex.get(sKey).push(idx);
      }
      if (!normIndex.has(nKey)) normIndex.set(nKey, []);
      normIndex.get(nKey).push(idx);
    }
  });

  // 주요 지역: 서울 25개 구 + 경기 핵심
  const targetLawds = [
    // 서울 25개 자치구
    "11110","11140","11170","11200","11215","11230","11260","11290","11305","11320",
    "11350","11380","11410","11440","11470","11500","11530","11545","11560","11590",
    "11620","11650","11680","11710","11740",
    // 경기 신축 대단지 지역
    "41111","41113","41115","41117", // 수원
    "41131","41133","41135", // 성남
    "41171","41173", // 안양
    "41281","41285","41287", // 고양
    "41360", // 남양주
    "41450", // 하남
    "41461","41463","41465", // 용인
    "41480", // 파주
    "41590"  // 화성
  ];

  // 최근 18개월 (2025년 ~ 2026년 거래 집중)
  const months = [
    "202611","202610","202609","202608","202607","202606","202605","202604","202603","202602","202601",
    "202512","202511","202510","202509","202508","202507","202506"
  ];

  const tasks = [];
  for (const lawd of targetLawds) {
    for (const ym of months) {
      tasks.push({ lawd, ym });
    }
  }

  console.log(`총 작업 수: ${tasks.length}개 API 요청`);

  const aptTradesBuffer = new Map();
  let totalCollected = 0;
  const CONCURRENCY = 2; // 초당 5건 이하 준수
  const DELAY_MS = 250;

  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async ({ lawd, ym }) => {
      const url = `https://apis.data.go.kr/1613000/RTMSDataSvcSilvTrade/getRTMSDataSvcSilvTrade?serviceKey=${API_KEY}&LAWD_CD=${lawd}&DEAL_YMD=${ym}&numOfRows=1000`;
      const xml = await fetchXml(url);
      if (!xml || xml.includes('LIMITED_NUMBER')) {
        return;
      }

      const items = parseItems(xml);
      for (const item of items) {
        const cancel = getVal(item, 'cdealType') || getVal(item, 'cancelDealType');
        if (cancel && cancel !== '' && cancel !== '0') continue;

        const aptNm = getVal(item, 'aptNm');
        const umdNm = getVal(item, 'umdNm').trim();
        const jibun = getVal(item, 'jibun').replace(/\s+/g, '');
        const dealAmtStr = getVal(item, 'dealAmount').replace(/,/g, '');
        const year = getVal(item, 'dealYear');
        const month = getVal(item, 'dealMonth').padStart(2, '0');
        const day = (getVal(item, 'dealDay') || '01').padStart(2, '0');
        const excluUseAr = parseFloat(getVal(item, 'excluUseAr')) || 84;
        const sggCd = getVal(item, 'sggCd') || lawd;

        const amount = parseInt(dealAmtStr, 10);
        if (!aptNm || isNaN(amount) || amount <= 0) continue;

        // 1순위: 지번 완전일치
        let masterIdx = jibunIndex.get(`${sggCd}|${umdNm}|${jibun}`) ?? jibunIndex.get(`${umdNm} ${jibun}`);

        // 2순위: 지번 기본번호 일치
        if (masterIdx === undefined && jibun) {
          const baseJibun = jibun.split('-')[0];
          masterIdx = jibunBaseIndex.get(`${sggCd}|${umdNm}|${baseJibun}`) ?? jibunBaseIndex.get(`${umdNm} ${baseJibun}`);
        }

        // 3순위: 단지명 정규화 일치
        if (masterIdx === undefined) {
          const nKey = normalizeAptName(aptNm);
          const candidates = normIndex.get(`${sggCd}|${nKey}`) || normIndex.get(nKey);
          if (candidates && candidates.length > 0) {
            masterIdx = candidates[0];
          }
        }

        if (masterIdx !== undefined) {
          if (!aptTradesBuffer.has(masterIdx)) {
            aptTradesBuffer.set(masterIdx, { trades: [] });
          }
          const buf = aptTradesBuffer.get(masterIdx);
          buf.trades.push({
            amount,
            dealDate: `${year}.${month}.${day}`,
            dealTime: new Date(`${year}-${month}-${day}`).getTime(),
            excluUseAr
          });
          totalCollected++;
        }
      }
    }));

    await sleep(DELAY_MS);
    if ((i + CONCURRENCY) % 50 === 0 || i + CONCURRENCY >= tasks.length) {
      console.log(`진행: ${Math.min(i + CONCURRENCY, tasks.length)}/${tasks.length} | 수집: ${totalCollected}건 | 매칭단지: ${aptTradesBuffer.size}개`);
    }
  }

  console.log(`\n분양권/입주권 수집 완료: 총 ${totalCollected}건, 매칭 단지: ${aptTradesBuffer.size}개`);

  // 마스터 DB 반영: 일반 매매 실거래가가 없는(avgPrice=0) 단지에 입주권 가격 1순위 적용
  let updatedCount = 0;
  const ONE_MONTH_MS = 31 * 24 * 60 * 60 * 1000;

  aptTradesBuffer.forEach((data, idx) => {
    const apt = masterData[idx];
    // 이미 일반 매매 실거래가가 있으면 건너뜀 (신축/거래없음 단지만 타겟)
    if (apt.avgPrice && apt.avgPrice > 0) {
      return;
    }

    const trades = data.trades;
    trades.sort((a, b) => b.dealTime - a.dealTime);

    const latest = trades[0];
    const recent1Month = trades.filter(t => latest.dealTime - t.dealTime <= ONE_MONTH_MS);

    let avgPrice;
    if (recent1Month.length >= 2) {
      avgPrice = Math.round(recent1Month.reduce((sum, t) => sum + t.amount, 0) / recent1Month.length);
    } else {
      avgPrice = latest.amount;
    }

    const allPrices = trades.map(t => t.amount);
    const price_max = Math.max(...allPrices);
    const price_min = Math.min(...allPrices);

    const jeonseRatio = apt.jeonseRatio || 56;
    const rent_max = Math.round(price_max * (jeonseRatio / 100));
    const rent_min = Math.round(price_min * (jeonseRatio / 100));
    const gapPrice = Math.max(0, avgPrice - rent_max);

    masterData[idx] = {
      ...apt,
      avgPrice,
      price_max,
      price_min,
      rent_max,
      rent_min,
      gapPrice,
      is_real_price: true,
      has_right_trade: true
    };

    console.log(`[★신축 단지 시세 반영] ${apt.name} (${apt.district} ${apt.jibun}) -> avgPrice: ${(avgPrice/10000).toFixed(1)}억 (${avgPrice}만원), 최고가: ${(price_max/10000).toFixed(1)}억`);
    updatedCount++;
  });

  console.log(`총 ${updatedCount}개 신축 아파트 단지 입주권 실거래가 반영 완료!`);
  fs.writeFileSync(MASTER_PATH, JSON.stringify(masterData, null, 0));
  console.log('apartments-master.json 저장 완료!');
}

main().catch(console.error);
