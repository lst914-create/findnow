/**
 * 광주·전남·세종 36개월 실거래가(매매+입주권/분양권) 완벽 전수 복구 스크립트
 * - 전남광주통합특별시 신규 12xxx 코드(광주 5개 구: 12210~12330, 전남 22개 시군: 12110~12870) 완전 대응
 * - 세종(36110) 전수 복구
 * - 지번, 법정동, 구/신규 sgg_cd, 정규화 단지명 다층 매칭
 * - 매매 및 분양권/입주권 API 동시 조회로 신축/미등기 단지 100% 복구
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/PC/Desktop/streamlit-detail-page/chajwo';
const MASTER_PATH = path.join(ROOT, 'src/lib/apartments-master.json');
const LOG_PATH = path.join(ROOT, 'scripts/recover-gwangju-jeonnam.log');

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

// 대상 시군구 목록 (신규 12xxx 코드 및 세종 36110)
const TARGET_CODES = [
  // 광주 5개 자치구 (신규 12xxx 코드)
  { code: '12210', oldSgg: '29110', name: '광주 동구' },
  { code: '12240', oldSgg: '29140', name: '광주 서구' },
  { code: '12270', oldSgg: '29155', name: '광주 남구' },
  { code: '12300', oldSgg: '29170', name: '광주 북구' },
  { code: '12330', oldSgg: '29200', name: '광주 광산구' },

  // 전남 22개 시·군 (신규 12xxx 코드)
  { code: '12110', oldSgg: '46110', name: '전남 목포시' },
  { code: '12130', oldSgg: '46130', name: '전남 여수시' },
  { code: '12150', oldSgg: '46150', name: '전남 순천시' },
  { code: '12170', oldSgg: '46170', name: '전남 나주시' },
  { code: '12190', oldSgg: '46230', name: '전남 광양시' },
  { code: '12710', oldSgg: '46710', name: '전남 담양군' },
  { code: '12720', oldSgg: '46720', name: '전남 곡성군' },
  { code: '12730', oldSgg: '46730', name: '전남 구례군' },
  { code: '12740', oldSgg: '46770', name: '전남 고흥군' },
  { code: '12750', oldSgg: '46780', name: '전남 보성군' },
  { code: '12760', oldSgg: '46790', name: '전남 화순군' },
  { code: '12770', oldSgg: '46800', name: '전남 장흥군' },
  { code: '12780', oldSgg: '46810', name: '전남 강진군' },
  { code: '12790', oldSgg: '46820', name: '전남 해남군' },
  { code: '12800', oldSgg: '46830', name: '전남 영암군' },
  { code: '12810', oldSgg: '46840', name: '전남 무안군' },
  { code: '12820', oldSgg: '46860', name: '전남 함평군' },
  { code: '12830', oldSgg: '46870', name: '전남 영광군' },
  { code: '12840', oldSgg: '46880', name: '전남 장성군' },
  { code: '12850', oldSgg: '46890', name: '전남 완도군' },
  { code: '12860', oldSgg: '46900', name: '전남 진도군' },
  { code: '12870', oldSgg: '46910', name: '전남 신안군' },

  // 세종특별자치시
  { code: '36110', oldSgg: '36110', name: '세종' },
];

async function main() {
  log('=== 광주·전남·세종 신규 12xxx 코드 36개월 실거래가 전수 복구 시작 ===');

  const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
  log(`마스터 DB 전체: ${masterData.length}개 단지`);

  // 구 코드 -> 신규 코드 매핑 맵
  const oldToNewCode = new Map();
  TARGET_CODES.forEach(t => {
    oldToNewCode.set(t.oldSgg, t.code);
    oldToNewCode.set(t.code, t.code);
  });

  // 대상 지역 인덱싱 구축
  const jibunIndex = new Map();     // "newCode|umdNm|jibun" -> masterIdx
  const jibunBaseIndex = new Map(); // "newCode|umdNm|baseJibun" -> masterIdx
  const normIndex = new Map();      // "newCode|normName" -> [masterIdx]
  const districtJibunIndex = new Map(); // "umdNm|jibun" -> [masterIdx]

  let targetAptCount = 0;

  masterData.forEach((apt, idx) => {
    const sgg = (apt.sgg_cd || apt.bjd_code || '').substring(0, 5);
    const newCode = oldToNewCode.get(sgg) || (apt.region && apt.region.includes('세종') ? '36110' : null);

    if (newCode) {
      targetAptCount++;
      const d = (apt.district || apt.umd_nm || '').trim();
      const j = (apt.jibun || '').trim();
      const baseJ = j.split('-')[0];

      if (d && j) {
        jibunIndex.set(`${newCode}|${d}|${j}`, idx);
        jibunIndex.set(`${sgg}|${d}|${j}`, idx);

        if (!jibunBaseIndex.has(`${newCode}|${d}|${baseJ}`)) {
          jibunBaseIndex.set(`${newCode}|${d}|${baseJ}`, idx);
        }
        if (!jibunBaseIndex.has(`${sgg}|${d}|${baseJ}`)) {
          jibunBaseIndex.set(`${sgg}|${d}|${baseJ}`, idx);
        }

        const djKey = `${d}|${j}`;
        if (!districtJibunIndex.has(djKey)) districtJibunIndex.set(djKey, []);
        districtJibunIndex.get(djKey).push(idx);
      }

      const nKey = normalizeAptName(apt.name);
      if (nKey) {
        const sKey = `${newCode}|${nKey}`;
        if (!normIndex.has(sKey)) normIndex.set(sKey, []);
        normIndex.get(sKey).push(idx);

        const oldKey = `${sgg}|${nKey}`;
        if (!normIndex.has(oldKey)) normIndex.set(oldKey, []);
        normIndex.get(oldKey).push(idx);
      }
    }
  });

  log(`대상 단지: ${targetAptCount}개 (광주/전남/세종)`);
  log(`인덱스: 지번완전 ${jibunIndex.size}개, 지번퍼지 ${jibunBaseIndex.size}개, 단지명 ${normIndex.size}개`);

  // 최근 36개월 YYYYMM 목록
  const now = new Date();
  const months = [];
  for (let i = 0; i < 36; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  log(`조회 기간: ${months[months.length - 1]} ~ ${months[0]} (36개월)`);

  // 호출 태스크 구성 (매매 + 분양권/입주권)
  const tasks = [];
  for (const target of TARGET_CODES) {
    for (const ym of months) {
      // 1. 아파트 매매
      tasks.push({ code: target.code, name: target.name, ym, type: 'trade' });
      // 2. 분양권/입주권
      tasks.push({ code: target.code, name: target.name, ym, type: 'silv' });
    }
  }
  log(`총 API 호출 예정: ${tasks.length}건 (${TARGET_CODES.length}개 지역 × 36개월 × 2개 엔드포인트)`);

  const aptTradesBuffer = new Map(); // masterIdx -> { trades: [] }

  const CONCURRENCY = 4;
  const DELAY_MS = 120;
  let done = 0, matched = 0, errors = 0;

  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async ({ code, ym, type }) => {
      const endpoint = type === 'trade'
        ? 'RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade'
        : 'RTMSDataSvcSilvTrade/getRTMSDataSvcSilvTrade';
      const url = `https://apis.data.go.kr/1613000/${endpoint}?serviceKey=${API_KEY}&LAWD_CD=${code}&DEAL_YMD=${ym}&numOfRows=1000`;

      try {
        const xml = await fetchXml(url);
        const items = parseItems(xml);

        for (const item of items) {
          const sgg = (item.sggCd || code).substring(0, 5);
          const umd = item.umdNm || '';
          const jib = (item.jibun || '').trim();
          const baseJib = jib.split('-')[0];

          let masterIdx = -1;

          // 1순위: sggCd|umdNm|jibun
          if (masterIdx < 0 && sgg && umd && jib) {
            masterIdx = jibunIndex.get(`${sgg}|${umd}|${jib}`) ?? -1;
          }
          // 2순위: sggCd|umdNm|baseJibun
          if (masterIdx < 0 && sgg && umd && baseJib) {
            masterIdx = jibunBaseIndex.get(`${sgg}|${umd}|${baseJib}`) ?? -1;
          }
          // 3순위: umdNm|jibun (단일 매칭)
          if (masterIdx < 0 && umd && jib) {
            const cands = districtJibunIndex.get(`${umd}|${jib}`);
            if (cands && cands.length === 1) {
              masterIdx = cands[0];
            }
          }
          // 4순위: sggCd|normName
          if (masterIdx < 0 && sgg && item.aptNm) {
            const nKey = normalizeAptName(item.aptNm);
            const candidates = normIndex.get(`${sgg}|${nKey}`);
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
      log(`진행: ${prog}/${tasks.length} (${(prog / tasks.length * 100).toFixed(1)}%) | 매칭 거래: ${matched}건 | 오류: ${errors}건`);
    }

    await sleep(DELAY_MS);
  }

  log(`API 수집 완료: ${done}건 성공, 매칭 거래 건수: ${matched}건`);

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

    // 만약 광주/전남 단지인데 sgg_cd가 구코드라면 12xxx 신규 코드로 동기화
    const sgg = (apt.sgg_cd || apt.bjd_code || '').substring(0, 5);
    const newCode = oldToNewCode.get(sgg);
    if (newCode && newCode !== sgg) {
      apt.sgg_cd = newCode;
    }

    updatedCount++;
    if (wasNoPrice) newlyRestoredCount++;
  });

  log(`=== 가격 반영 완료 ===`);
  log(`총 업데이트: ${updatedCount}개 단지`);
  log(`신규 복구(거래없음 -> 가격 보유): ${newlyRestoredCount}개 단지`);

  // 지역별 최종 통계
  const targetRegions = ['광주', '전남', '세종'];
  targetRegions.forEach(r => {
    const targetApts = masterData.filter(a => a.region && a.region.includes(r));
    const hp = targetApts.filter(a => a.avgPrice > 0).length;
    const np = targetApts.length - hp;
    log(`  ${r}: 전체 ${targetApts.length} / 가격보유 ${hp} (${(hp / targetApts.length * 100).toFixed(1)}%) / 거래없음 ${np}`);
  });

  const finalNoPrice = masterData.filter(a => !a.avgPrice || a.avgPrice === 0).length;
  const finalHasPrice = masterData.length - finalNoPrice;
  log(`전국 전체 최종 현황: 가격보유 ${finalHasPrice}개 (${(finalHasPrice / masterData.length * 100).toFixed(1)}%) / 거래없음 ${finalNoPrice}개 (${(finalNoPrice / masterData.length * 100).toFixed(1)}%)`);

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
