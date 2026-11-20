/**
 * 화성동탄구(41597) 36개월 전수 수집 및 동일 지번 복수 단지(라포르테세종 등) 100% 복구 스크립트
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/PC/Desktop/streamlit-detail-page/chajwo';
const MASTER_PATH = path.join(ROOT, 'src/lib/apartments-master.json');
const LOG_PATH = path.join(ROOT, 'scripts/recover-final-dongtan.log');

const API_KEY = 'w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D';

const logLines = [];
function log(msg) {
  const line = `[${new Date().toISOString()}] ${msg}`;
  console.log(line);
  logLines.push(line);
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getVal(item, tag) {
  const m = item.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return m ? m[1].trim() : '';
}

function normalizeAptName(name) {
  if (!name) return '';
  return name
    .replace(/\(주\)|주식회사|\[주\]|\(유\)|유한회사/gi, '')
    .replace(/\d+단지\s*,\s*\d+단지*|\([0-9\-~,\s]+\)/g, '')
    .replace(/[\s\-_(),.·\[\]{}<>]/g, '')
    .replace(/①/g, '1')
    .replace(/②/g, '2')
    .replace(/③/g, '3')
    .replace(/④/g, '4')
    .replace(/⑤/g, '5')
    .replace(/⑥/g, '6')
    .replace(/⑦/g, '7')
    .replace(/⑧/g, '8')
    .replace(/⑨/g, '9')
    .replace(/아파트|마을/g, '')
    .toLowerCase();
}

function fetchXml(url, retries = 4) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => resolve(data));
      }).on('error', (err) => {
        if (n > 0) setTimeout(() => attempt(n - 1), 600 * (5 - n));
        else reject(err);
      });
    };
    attempt(retries);
  });
}

function parseItems(xml) {
  if (!xml || xml.includes('<resultCode>99</resultCode>') || xml.includes('LIMITED_NUMBER')) return [];
  const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
  return itemMatches.map(item => {
    const year = getVal(item, 'dealYear') || getVal(item, 'year');
    const month = getVal(item, 'dealMonth') || getVal(item, 'month');
    const day = getVal(item, 'dealDay') || getVal(item, 'day');
    const amtStr = (getVal(item, 'dealAmount') || getVal(item, 'amount') || '').replace(/,/g, '').trim();
    const amt = parseInt(amtStr, 10);
    if (!year || !month || isNaN(amt) || amt <= 0) return null;
    return {
      amount: amt,
      dealTime: new Date(`${year}-${String(month).padStart(2, '0')}-${String(day || 1).padStart(2, '0')}`).getTime(),
      dealDate: `${year}.${String(month).padStart(2, '0')}.${String(day || 1).padStart(2, '0')}`,
      umdNm: getVal(item, 'umdNm'),
      jibun: (getVal(item, 'jibun') || getVal(item, 'landCd') || '').trim(),
      aptNm: getVal(item, 'aptNm'),
      sggCd: getVal(item, 'sggCd'),
    };
  }).filter(Boolean);
}

function computePrice(trades) {
  if (!trades.length) return null;
  trades.sort((a, b) => b.dealTime - a.dealTime);
  const latest = trades[0];
  const ONE_MONTH_MS = 31 * 24 * 60 * 60 * 1000;
  const recent = trades.filter(t => latest.dealTime - t.dealTime <= ONE_MONTH_MS);
  let finalPrice = latest.amount;
  if (recent.length >= 2) {
    finalPrice = Math.round(recent.reduce((sum, t) => sum + t.amount, 0) / recent.length);
  }
  const allAmounts = trades.map(t => t.amount);
  return {
    price: finalPrice,
    min: Math.min(...allAmounts),
    max: Math.max(...allAmounts),
    latest: latest.amount,
    count: trades.length,
    latestDate: latest.dealDate
  };
}

async function main() {
  log('=== 1. 동일 지번 단지 가격 자동 동기화 시작 (라포르테세종 등) ===');

  const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
  log(`마스터 DB 전체: ${masterData.length}개 단지`);

  // 지번별 그룹핑: "sgg|umd|jibun" -> [aptIndex...]
  const jibunGroup = new Map();
  masterData.forEach((apt, idx) => {
    const sgg = (apt.sgg_cd || apt.bjd_code || '').substring(0, 5);
    const d = (apt.district || apt.umd_nm || '').trim();
    const j = (apt.jibun || '').trim();
    if (d && j && j !== '0') {
      const key = `${sgg}|${d}|${j}`;
      if (!jibunGroup.has(key)) jibunGroup.set(key, []);
      jibunGroup.get(key).push(idx);

      const djKey = `${d}|${j}`;
      if (!jibunGroup.has(djKey)) jibunGroup.set(djKey, []);
      jibunGroup.get(djKey).push(idx);
    }
  });

  let duplicateSyncCount = 0;
  jibunGroup.forEach((indices) => {
    if (indices.length <= 1) return;
    // 그룹 내 가격을 보유한 단지 찾기
    const pricedApt = indices.map(i => masterData[i]).find(a => a.avgPrice && a.avgPrice > 0);
    if (!pricedApt) return;

    indices.forEach(i => {
      const target = masterData[i];
      if (!target.avgPrice || target.avgPrice === 0) {
        target.avgPrice = pricedApt.avgPrice;
        target.price_min = pricedApt.price_min;
        target.price_max = pricedApt.price_max;
        if (!target.rent_min) target.rent_min = pricedApt.rent_min || 0;
        if (!target.rent_max) target.rent_max = pricedApt.rent_max || 0;
        if (!target.gapPrice) target.gapPrice = pricedApt.gapPrice || 0;
        duplicateSyncCount++;
        log(`[동일지번복구] ${target.name} (${target.district} ${target.jibun}) <- ${pricedApt.name} 실거래가 ${pricedApt.avgPrice}만`);
      }
    });
  });

  log(`동일 지번 단지 자동 복구 완료: ${duplicateSyncCount}개 단지 가격 적재`);

  // ==========================================
  // 2. 화성동탄구 (41597) 36개월 전수 수집
  // ==========================================
  log('=== 2. 화성동탄구(41597) 36개월 실거래가(매매+분양권) 수집 시작 ===');

  const now = new Date();
  const months = [];
  for (let i = 0; i < 36; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`);
  }

  // 동탄구 단지 인덱싱
  const dongtanJibunIndex = new Map();
  const dongtanNormIndex = new Map();

  masterData.forEach((apt, idx) => {
    if (apt.region && apt.region.includes('화성')) {
      const d = (apt.district || apt.umd_nm || '').trim();
      const j = (apt.jibun || '').trim();
      const baseJ = j.split('-')[0];

      if (d && j) {
        if (!dongtanJibunIndex.has(`${d}|${j}`)) dongtanJibunIndex.set(`${d}|${j}`, []);
        dongtanJibunIndex.get(`${d}|${j}`).push(idx);

        if (!dongtanJibunIndex.has(`${d}|${baseJ}`)) dongtanJibunIndex.set(`${d}|${baseJ}`, []);
        dongtanJibunIndex.get(`${d}|${baseJ}`).push(idx);
      }

      const nKey = normalizeAptName(apt.name);
      if (nKey) {
        if (!dongtanNormIndex.has(nKey)) dongtanNormIndex.set(nKey, []);
        dongtanNormIndex.get(nKey).push(idx);
      }
    }
  });

  const aptTradesBuffer = new Map();
  let dongtanMatched = 0;

  for (const ym of months) {
    for (const type of ['trade', 'silv']) {
      const endpoint = type === 'trade'
        ? 'RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade'
        : 'RTMSDataSvcSilvTrade/getRTMSDataSvcSilvTrade';
      const url = `https://apis.data.go.kr/1613000/${endpoint}?serviceKey=${API_KEY}&LAWD_CD=41597&DEAL_YMD=${ym}&numOfRows=1000`;

      try {
        const xml = await fetchXml(url);
        const items = parseItems(xml);

        for (const item of items) {
          const umd = item.umdNm || '';
          const jib = (item.jibun || '').trim();
          const baseJib = jib.split('-')[0];

          let matchedIndices = [];

          if (umd && jib && dongtanJibunIndex.has(`${umd}|${jib}`)) {
            matchedIndices = dongtanJibunIndex.get(`${umd}|${jib}`);
          } else if (umd && baseJib && dongtanJibunIndex.has(`${umd}|${baseJib}`)) {
            matchedIndices = dongtanJibunIndex.get(`${umd}|${baseJib}`);
          } else if (item.aptNm) {
            const nKey = normalizeAptName(item.aptNm);
            if (dongtanNormIndex.has(nKey)) {
              matchedIndices = dongtanNormIndex.get(nKey);
            }
          }

          for (const idx of matchedIndices) {
            if (!aptTradesBuffer.has(idx)) {
              aptTradesBuffer.set(idx, { trades: [] });
            }
            aptTradesBuffer.get(idx).trades.push(item);
            dongtanMatched++;
          }
        }
      } catch (err) {}
      await sleep(100);
    }
  }

  log(`화성동탄구(41597) API 수집 완료: 매칭 거래 ${dongtanMatched}건`);

  let dongtanUpdated = 0;
  aptTradesBuffer.forEach((buf, idx) => {
    const apt = masterData[idx];
    if (!apt || !buf.trades.length) return;

    const result = computePrice(buf.trades);
    if (!result) return;

    const wasNoPrice = !apt.avgPrice || apt.avgPrice === 0;
    apt.avgPrice = result.price;
    apt.price_min = result.min;
    apt.price_max = result.max;
    if (!apt.rent_min) apt.rent_min = 0;
    if (!apt.rent_max) apt.rent_max = 0;
    if (!apt.gapPrice) apt.gapPrice = 0;
    apt.sgg_cd = '41597'; // 동탄구 신규 코드로 갱신

    if (wasNoPrice) dongtanUpdated++;
  });

  log(`화성동탄구 신규 복구 완료: ${dongtanUpdated}개 단지 가격 적재`);

  // 최종 상태 집계
  const finalNoPrice = masterData.filter(a => !a.avgPrice || a.avgPrice === 0).length;
  const finalHasPrice = masterData.length - finalNoPrice;
  log(`=== 최종 현황 ===`);
  log(`전국 전체 가격보유: ${finalHasPrice}개 (${(finalHasPrice / masterData.length * 100).toFixed(1)}%)`);
  log(`전국 전체 거래없음: ${finalNoPrice}개 (${(finalNoPrice / masterData.length * 100).toFixed(1)}%)`);

  const dongtanFinal = masterData.filter(a => a.region === '경기 화성동탄구');
  const dHp = dongtanFinal.filter(a => a.avgPrice > 0).length;
  log(`화성동탄구 최종: 가격보유 ${dHp}/${dongtanFinal.length} (${(dHp / dongtanFinal.length * 100).toFixed(1)}%)`);

  const sejongFinal = masterData.filter(a => a.region && a.region.includes('세종'));
  const sHp = sejongFinal.filter(a => a.avgPrice > 0).length;
  log(`세종시 최종: 가격보유 ${sHp}/${sejongFinal.length} (${(sHp / sejongFinal.length * 100).toFixed(1)}%)`);

  // 파일 저장
  fs.writeFileSync(MASTER_PATH, JSON.stringify(masterData, null, 2), 'utf8');
  log(`apartments-master.json 저장 완료`);

  fs.writeFileSync(LOG_PATH, logLines.join('\n'), 'utf8');
  log(`로그 저장: ${LOG_PATH}`);
}

main().catch(err => {
  console.error('치명적 오류:', err);
  process.exit(1);
});
