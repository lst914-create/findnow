/**
 * 전국 잔여 누락 지역 36개월 실거래가(매매 + 분양권/입주권) 전수 복구 스크립트
 * - 강원특별자치도(51xxx), 전북특별자치도(52xxx) 전 시군
 * - 인천 신설 자치구(검단 28290, 영종 28155, 제물포 28125, 서해 28275)
 * - 경기 화성시 구별(41591, 41593, 41595), 경기 부천시 일반구(41192, 41194, 41196)
 * - 경북 경산(47290), 영천(47230), 상주(47250), 문경(47280)
 * - 세종특별자치시(36110) 퍼지/단지명 매칭 강화
 * - 부산 기장, 대구 달성, 울산 울주, 경남 양산, 충남 홍성/예산 등
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/PC/Desktop/streamlit-detail-page/chajwo';
const MASTER_PATH = path.join(ROOT, 'src/lib/apartments-master.json');
const LOG_PATH = path.join(ROOT, 'scripts/recover-remaining-nationwide.log');

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

// 2차 전수 복구 대상 시군구 코드 (총 54개 주요 누락 지역)
const TARGET_CODES = [
  // 1. 강원특별자치도 (51xxx 전체 18개 시군)
  { code: '51110', name: '강원 춘천시' },
  { code: '51130', name: '강원 원주시' },
  { code: '51150', name: '강원 강릉시' },
  { code: '51170', name: '강원 동해시' },
  { code: '51190', name: '강원 태백시' },
  { code: '51210', name: '강원 속초시' },
  { code: '51230', name: '강원 삼척시' },
  { code: '51720', name: '강원 홍천군' },
  { code: '51730', name: '강원 횡성군' },
  { code: '51750', name: '강원 영월군' },
  { code: '51760', name: '강원 평창군' },
  { code: '51770', name: '강원 정선군' },
  { code: '51780', name: '강원 철원군' },
  { code: '51790', name: '강원 화천군' },
  { code: '51800', name: '강원 양구군' },
  { code: '51810', name: '강원 인제군' },
  { code: '51820', name: '강원 고성군' },
  { code: '51830', name: '강원 양양군' },

  // 2. 전북특별자치도 (52xxx 전체 14개 시군)
  { code: '52111', name: '전북 전주완산구' },
  { code: '52113', name: '전북 전주덕진구' },
  { code: '52130', name: '전북 군산시' },
  { code: '52140', name: '전북 익산시' },
  { code: '52180', name: '전북 정읍시' },
  { code: '52190', name: '전북 남원시' },
  { code: '52210', name: '전북 김제시' },
  { code: '52710', name: '전북 완주군' },
  { code: '52720', name: '전북 진안군' },
  { code: '52730', name: '전북 무주군' },
  { code: '52740', name: '전북 장수군' },
  { code: '52750', name: '전북 임실군' },
  { code: '52760', name: '전북 순창군' },
  { code: '52770', name: '전북 고창군' },
  { code: '52790', name: '전북 부안군' },

  // 3. 인천 신설 자치구 (4개)
  { code: '28290', name: '인천 검단구' },
  { code: '28155', name: '인천 영종구' },
  { code: '28125', name: '인천 제물포구' },
  { code: '28275', name: '인천 서해구' },

  // 4. 경기 화성시 & 부천시 구별 신설/부활 코드 (7개)
  { code: '41595', name: '경기 화성동탄구/병점구' },
  { code: '41591', name: '경기 화성만세구' },
  { code: '41593', name: '경기 화성효행구' },
  { code: '41192', name: '경기 부천원미구' },
  { code: '41194', name: '경기 부천소사구' },
  { code: '41196', name: '경기 부천오정구' },
  { code: '41190', name: '경기 부천시 전체' },

  // 5. 경북 누락 시군 (4개)
  { code: '47290', name: '경북 경산시' },
  { code: '47230', name: '경북 영천시' },
  { code: '47250', name: '경북 상주시' },
  { code: '47280', name: '경북 문경시' },

  // 6. 세종특별자치시
  { code: '36110', name: '세종특별자치시' },

  // 7. 기타 거래없음 다수 군/시 단위
  { code: '26710', name: '부산 기장군' },
  { code: '27710', name: '대구 달성군' },
  { code: '31710', name: '울산 울주군' },
  { code: '48330', name: '경남 양산시' },
  { code: '48730', name: '경남 함안군' },
  { code: '48740', name: '경남 창녕군' },
  { code: '44800', name: '충남 홍성군' },
  { code: '44810', name: '충남 예산군' },
  { code: '44825', name: '충남 태안군' },
  { code: '43745', name: '충북 증평군' },
];

async function main() {
  log('=== 전국 잔여 누락 지역 36개월 실거래가 전수 복구 시작 ===');

  const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
  log(`마스터 DB 전체: ${masterData.length}개 단지`);

  const prevNoPrice = masterData.filter(a => !a.avgPrice || a.avgPrice === 0).length;
  log(`현재 거래없음 단지: ${prevNoPrice}개 (${(prevNoPrice / masterData.length * 100).toFixed(1)}%)`);

  // 인덱스 구축
  const jibunIndex = new Map();         // "sgg|umd|jibun" -> masterIdx
  const jibunBaseIndex = new Map();     // "sgg|umd|baseJibun" -> masterIdx
  const normIndex = new Map();          // "sgg|normName" -> [masterIdx]
  const districtJibunIndex = new Map(); // "umd|jibun" -> [masterIdx]
  const districtBaseIndex = new Map();  // "umd|baseJibun" -> [masterIdx]
  const allNormIndex = new Map();       // "normName" -> [masterIdx]

  masterData.forEach((apt, idx) => {
    const sgg = (apt.sgg_cd || apt.bjd_code || '').substring(0, 5);
    const d = (apt.district || apt.umd_nm || '').trim();
    const j = (apt.jibun || '').trim();
    const baseJ = j.split('-')[0];

    if (d && j) {
      if (sgg) {
        jibunIndex.set(`${sgg}|${d}|${j}`, idx);
        if (!jibunBaseIndex.has(`${sgg}|${d}|${baseJ}`)) {
          jibunBaseIndex.set(`${sgg}|${d}|${baseJ}`, idx);
        }
      }

      const djKey = `${d}|${j}`;
      if (!districtJibunIndex.has(djKey)) districtJibunIndex.set(djKey, []);
      districtJibunIndex.get(djKey).push(idx);

      const dbKey = `${d}|${baseJ}`;
      if (!districtBaseIndex.has(dbKey)) districtBaseIndex.set(dbKey, []);
      districtBaseIndex.get(dbKey).push(idx);
    }

    const nKey = normalizeAptName(apt.name);
    if (nKey) {
      if (sgg) {
        const sKey = `${sgg}|${nKey}`;
        if (!normIndex.has(sKey)) normIndex.set(sKey, []);
        normIndex.get(sKey).push(idx);
      }
      if (!allNormIndex.has(nKey)) allNormIndex.set(nKey, []);
      allNormIndex.get(nKey).push(idx);
    }
  });

  log(`인덱스 구축 완료: 지번완전 ${jibunIndex.size}개, 단지명 ${normIndex.size}개`);

  // 최근 36개월 YYYYMM 목록
  const now = new Date();
  const months = [];
  for (let i = 0; i < 36; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  log(`조회 기간: ${months[months.length - 1]} ~ ${months[0]} (36개월)`);

  // 호출 태스크 목록 (매매 + 분양권/입주권)
  const tasks = [];
  for (const t of TARGET_CODES) {
    for (const ym of months) {
      tasks.push({ code: t.code, name: t.name, ym, type: 'trade' });
      tasks.push({ code: t.code, name: t.name, ym, type: 'silv' });
    }
  }
  log(`총 API 호출 예정: ${tasks.length}건 (${TARGET_CODES.length}개 시군구 × 36개월 × 2개 엔드포인트)`);

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

          // 1순위: sgg|umd|jibun 완전 일치
          if (masterIdx < 0 && sgg && umd && jib) {
            masterIdx = jibunIndex.get(`${sgg}|${umd}|${jib}`) ?? -1;
          }
          // 2순위: sgg|umd|baseJibun 퍼지 일치
          if (masterIdx < 0 && sgg && umd && baseJib) {
            masterIdx = jibunBaseIndex.get(`${sgg}|${umd}|${baseJib}`) ?? -1;
          }
          // 3순위: umd|jibun (해당 법정동+지번 단일 단지)
          if (masterIdx < 0 && umd && jib) {
            const cands = districtJibunIndex.get(`${umd}|${jib}`);
            if (cands && cands.length === 1) {
              masterIdx = cands[0];
            }
          }
          // 4순위: sgg|normName (시군구 내 단지명 일치)
          if (masterIdx < 0 && sgg && item.aptNm) {
            const nKey = normalizeAptName(item.aptNm);
            const candidates = normIndex.get(`${sgg}|${nKey}`);
            if (candidates && candidates.length === 1) {
              masterIdx = candidates[0];
            }
          }
          // 5순위: 세종시 특별 매칭 (36110인 경우 umd|baseJibun 또는 단지명 부분일치)
          if (masterIdx < 0 && sgg === '36110') {
            if (umd && baseJib) {
              const cands = districtBaseIndex.get(`${umd}|${baseJib}`);
              if (cands && cands.length === 1) {
                masterIdx = cands[0];
              }
            }
            if (masterIdx < 0 && item.aptNm) {
              const nKey = normalizeAptName(item.aptNm);
              const cands = allNormIndex.get(nKey);
              if (cands && cands.length === 1) {
                masterIdx = cands[0];
              }
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

    if ((i + CONCURRENCY) % 300 === 0 || i + CONCURRENCY >= tasks.length) {
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

    updatedCount++;
    if (wasNoPrice) newlyRestoredCount++;
  });

  log(`=== 2차 복구 완료 ===`);
  log(`총 업데이트: ${updatedCount}개 단지`);
  log(`신규 복구(거래없음 -> 가격 보유): ${newlyRestoredCount}개 단지`);

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
