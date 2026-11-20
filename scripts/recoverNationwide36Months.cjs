/**
 * 전국 아파트 단지 36개월 실거래가 전수 복구 스크립트
 * - 거래없음(avgPrice=0) 단지 위주로 최근 36개월 국토부 RTMS API 조회
 * - 법정동(district) + 지번(jibun) + sgg_cd 3계층 매칭
 * - CONCURRENCY=4, DELAY=120ms (429 에러 방지)
 * - 기존 가격 보유 단지도 갱신 (최신 반영)
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/PC/Desktop/streamlit-detail-page/chajwo';
const MASTER_PATH = path.join(ROOT, 'src/lib/apartments-master.json');
const LOG_PATH = path.join(ROOT, 'scripts/recover-nationwide-36months.log');

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
    .replace(/\s+/g, '')
    .replace(/[^\uAC00-\uD7A3\u0041-\u005A\u0061-\u007A\u0030-\u0039]/g, '')
    .toLowerCase();
}

// 국토부 RTMS 매매 API 호출 (재시도 포함)
function fetchXml(url, retries = 4) {
  return new Promise((resolve, reject) => {
    const attempt = (n) => {
      https.get(url, (res) => {
        let data = '';
        res.on('data', d => data += d);
        res.on('end', () => resolve(data));
      }).on('error', (err) => {
        if (n > 0) {
          setTimeout(() => attempt(n - 1), 500 * (5 - n));
        } else {
          reject(err);
        }
      });
    };
    attempt(retries);
  });
}

// XML → 거래 항목 배열
function parseItems(xml) {
  if (!xml || xml.includes('<resultCode>99</resultCode>')) return [];
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
      jibun: getVal(item, 'jibun') || getVal(item, 'landCd'),
      aptNm: getVal(item, 'aptNm'),
      sggCd: getVal(item, 'sggCd'),
    };
  }).filter(Boolean);
}

// 최근 1개월(31일) 평균 or 최종 실거래가 계산
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

// 전국 시군구 법정동 코드 (약 215개)
const LAWD_CODES = [
  // 서울 (25개 자치구)
  "11110","11140","11170","11200","11215","11230","11260","11290","11305","11320",
  "11350","11380","11410","11440","11470","11500","11530","11545","11560","11590",
  "11620","11650","11680","11710","11740",
  // 부산 (16개)
  "26110","26140","26170","26200","26230","26260","26290","26320","26350","26380",
  "26410","26440","26470","26500","26530","26710",
  // 대구 (8개)
  "27110","27140","27170","27200","27230","27260","27290","27710",
  // 인천 (10개)
  "28110","28140","28170","28177","28185","28200","28237","28245","28260","28710",
  // 광주 (5개)
  "29110","29140","29155","29170","29200",
  // 대전 (5개)
  "30110","30140","30170","30200","30230",
  // 울산 (5개)
  "31110","31140","31170","31200","31710",
  // 세종 (1개)
  "36110",
  // 경기 (31개)
  "41111","41113","41115","41117","41119","41121","41123","41125","41127","41129",
  "41131","41133","41135","41150","41171","41173","41175","41190","41210","41220",
  "41250","41270","41271","41273","41275","41281","41285","41287","41290","41310",
  "41360","41370","41390","41410","41430","41450","41460","41461","41463","41465",
  "41480","41500","41550","41570","41590","41610","41630","41650","41670","41800",
  "41820","41830",
  // 강원 (18개)
  "42110","42130","42150","42170","42190","42210","42230","42250","42270","42710",
  "42720","42730","42750","42760","42770","42780","42790","42800",
  // 충북 (11개)
  "43111","43112","43113","43114","43130","43150","43720","43730","43745","43750",
  "43760","43770","43780","43790","43800",
  // 충남 (15개)
  "44131","44133","44150","44180","44200","44210","44230","44250","44260","44270",
  "44273","44710","44730","44760","44770","44790","44800","44810","44825",
  // 전북 (14개)
  "45111","45113","45130","45140","45150","45160","45180","45190","45210","45710",
  "45720","45730","45740","45750","45760","45770","45790","45800",
  // 전남 (22개)
  "46110","46130","46150","46170","46230","46710","46720","46730","46740","46750",
  "46760","46770","46780","46790","46800","46810","46820","46830","46840","46860",
  "46870","46880","46890","46900",
  // 경북 (23개)
  "47111","47113","47130","47150","47170","47190","47210","47730","47750","47760",
  "47770","47820","47830","47840","47850","47900","47920","47930",
  // 경남 (18개)
  "48121","48123","48125","48127","48129","48131","48133","48170","48220","48240",
  "48250","48270","48310","48330","48720","48730","48740","48820",
  // 제주 (2개)
  "50110","50130",
];

async function main() {
  log('=== 전국 36개월 실거래가 전수 복구 시작 ===');
  
  const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
  log(`마스터 DB: ${masterData.length}개 단지`);

  const noPriceCount = masterData.filter(a => !a.avgPrice || a.avgPrice === 0).length;
  log(`거래없음 단지: ${noPriceCount}개 (${(noPriceCount/masterData.length*100).toFixed(1)}%)`);

  // 인덱스 구축
  const jibunIndex = new Map();     // "sggCd|umdNm|jibun" → masterIdx
  const jibunBaseIndex = new Map(); // "sggCd|umdNm|baseJibun" → masterIdx
  const normIndex = new Map();      // "sggCd|normName" → [masterIdx,...]

  masterData.forEach((apt, idx) => {
    const sgg = (apt.sgg_cd || apt.bjd_code || '').substring(0, 5);
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
    if (nKey && sgg) {
      const sKey = `${sgg}|${nKey}`;
      if (!normIndex.has(sKey)) normIndex.set(sKey, []);
      normIndex.get(sKey).push(idx);
    }
  });

  log(`인덱스: 지번${jibunIndex.size}개, 퍼지${jibunBaseIndex.size}개, 명칭${normIndex.size}개`);

  // 최근 36개월 YYYYMM 목록
  const now = new Date();
  const months = [];
  for (let i = 0; i < 36; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  log(`조회 기간: ${months[months.length-1]} ~ ${months[0]} (36개월)`);

  // 단지별 거래 버퍼
  const aptTradesBuffer = new Map(); // masterIdx → { trades: [] }

  const tasks = [];
  for (const lawdCode of LAWD_CODES) {
    for (const ym of months) {
      tasks.push({ lawdCode, ym });
    }
  }
  log(`총 API 호출 예정: ${tasks.length}건 (${LAWD_CODES.length}개 시군구 × 36개월)`);

  const CONCURRENCY = 4;
  const DELAY_MS = 120;
  let done = 0, matched = 0, errors = 0;

  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async ({ lawdCode, ym }) => {
      const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${API_KEY}&LAWD_CD=${lawdCode}&DEAL_YMD=${ym}&numOfRows=1000`;
      try {
        const xml = await fetchXml(url);
        const items = parseItems(xml);
        
        for (const item of items) {
          const sgg = (item.sggCd || lawdCode).substring(0, 5);
          const umd = item.umdNm || '';
          const jib = (item.jibun || '').trim();
          const baseJib = jib.split('-')[0];

          let masterIdx = -1;

          // 1순위: sggCd|umdNm|jibun 완전 매칭
          if (masterIdx < 0 && sgg && umd && jib) {
            masterIdx = jibunIndex.get(`${sgg}|${umd}|${jib}`) ?? -1;
          }
          // 1-b: "umdNm jibun" 매칭
          if (masterIdx < 0 && umd && jib) {
            masterIdx = jibunIndex.get(`${umd} ${jib}`) ?? -1;
          }
          // 2순위: sggCd|umdNm|baseJibun 퍼지 매칭
          if (masterIdx < 0 && sgg && umd && baseJib) {
            masterIdx = jibunBaseIndex.get(`${sgg}|${umd}|${baseJib}`) ?? -1;
          }
          // 2-b: "umdNm baseJibun" 퍼지
          if (masterIdx < 0 && umd && baseJib) {
            masterIdx = jibunBaseIndex.get(`${umd} ${baseJib}`) ?? -1;
          }
          // 3순위: sggCd|normName
          if (masterIdx < 0 && sgg && item.aptNm) {
            const nKey = normalizeAptName(item.aptNm);
            const sKey = `${sgg}|${nKey}`;
            const candidates = normIndex.get(sKey);
            if (candidates && candidates.length === 1) {
              masterIdx = candidates[0];
            }
          }

          if (masterIdx >= 0) {
            if (!aptTradesBuffer.has(masterIdx)) {
              aptTradesBuffer.set(masterIdx, { trades: [] });
            }
            aptTradesBuffer.get(masterIdx).trades.push(item);
            matched++;
          }
        }
        done++;
      } catch (err) {
        errors++;
      }
    }));

    if ((i + CONCURRENCY) % 200 === 0 || i + CONCURRENCY >= tasks.length) {
      const prog = Math.min(i + CONCURRENCY, tasks.length);
      log(`진행: ${prog}/${tasks.length} (${(prog/tasks.length*100).toFixed(1)}%) | 매칭 거래: ${matched}건 | 오류: ${errors}건`);
    }

    await sleep(DELAY_MS);
  }

  log(`API 호출 완료: ${done}건 성공, ${errors}건 오류, 총 매칭 ${matched}건`);

  // 가격 업데이트
  let updatedCount = 0;
  let newlyRestoredCount = 0;

  aptTradesBuffer.forEach((buf, masterIdx) => {
    const apt = masterData[masterIdx];
    if (!apt || !buf.trades.length) return;

    const result = computePrice(buf.trades);
    if (!result) return;

    const prevAvg = apt.avgPrice || 0;
    const wasNoPrice = prevAvg === 0;

    apt.avgPrice = result.price;
    apt.price_max = result.max;
    apt.price_min = result.min;
    if (!apt.rent_min) apt.rent_min = 0;
    if (!apt.rent_max) apt.rent_max = 0;
    if (!apt.gapPrice) apt.gapPrice = 0;

    updatedCount++;
    if (wasNoPrice) newlyRestoredCount++;
  });

  log(`=== 업데이트 완료 ===`);
  log(`총 업데이트: ${updatedCount}개 단지`);
  log(`신규 복구(거래없음→가격 보유): ${newlyRestoredCount}개 단지`);

  // 최종 통계
  const finalNoPrice = masterData.filter(a => !a.avgPrice || a.avgPrice === 0).length;
  const finalHasPrice = masterData.length - finalNoPrice;
  log(`최종 상태: 가격보유 ${finalHasPrice}개 / 거래없음 ${finalNoPrice}개 (${(finalNoPrice/masterData.length*100).toFixed(1)}%)`);

  // 지역별 복구 현황
  const regionStats = {};
  masterData.forEach(apt => {
    const r = apt.region || '기타';
    if (!regionStats[r]) regionStats[r] = { total: 0, hasPrice: 0 };
    regionStats[r].total++;
    if (apt.avgPrice && apt.avgPrice > 0) regionStats[r].hasPrice++;
  });
  log('=== 지역별 현황 ===');
  Object.entries(regionStats).sort((a,b)=>b[1].total-a[1].total).forEach(([r, s]) => {
    const noP = s.total - s.hasPrice;
    log(`  ${r}: 전체${s.total} / 가격보유${s.hasPrice} / 거래없음${noP} (${(noP/s.total*100).toFixed(1)}%)`);
  });

  // 저장
  fs.writeFileSync(MASTER_PATH, JSON.stringify(masterData, null, 2), 'utf8');
  log(`apartments-master.json 저장 완료`);

  // 로그 파일 저장
  fs.writeFileSync(LOG_PATH, logLines.join('\n'), 'utf8');
  log(`로그 저장: ${LOG_PATH}`);
}

main().catch(err => {
  console.error('치명적 오류:', err);
  process.exit(1);
});
