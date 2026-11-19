/**
 * [마스터 DB 실거래가 전수 일괄 갱신 스크립트 (안정형)]
 * 공공데이터포털 Rate Limit을 준수하며 안정적으로 전국 실거래가를 수집하여
 * apartments-master.json의 모든 단지 가격(price_max, price_min, avgPrice, rent_max, rent_min, gapPrice)을
 * 최신 국토부 실거래가로 100% 전수 동기화합니다.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/PC/Desktop/streamlit-detail-page/chajwo';
const MASTER_PATH = path.join(ROOT, 'src/lib/apartments-master.json');
const LOG_PATH = path.join(ROOT, 'scripts/sync-master-prices.log');

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
    .replace(/Ⅴ|ⅴ/g, '5')
    .replace(/Ⅵ|ⅵ/g, '6')
    .replace(/Ⅶ|ⅶ/g, '7')
    .replace(/Ⅷ|ⅷ/g, '8')
    .replace(/Ⅸ|ⅸ/g, '9')
    .replace(/^(남양주|구리|하남|수원|용인|성남|화성|부천|안양|광명|평택|고양|일산|분당|판교|송파|강남|서초|강동|마포|영등포|노원|도봉|강북|성북|중랑|동대문|광진|성동|용산|중구|종로|서대문|은평|양천|강서|구로|금천|동작|관악|인천|대구|부산|대전|광주|울산|세종)/, '')
    .replace(/아파트|마을/g, '')
    .replace(/다산지금|다산진건|다산신도시/g, '다산')
    .replace(/교문장자|장자마을|토평/g, '')
    .replace(/동탄2신도시|동탄신도시|동탄2/g, '동탄')
    .replace(/미사강변도시|미사강변/g, '미사')
    .replace(/위례신도시/g, '위례')
    .replace(/송도국제도시/g, '송도')
    .replace(/청라국제도시/g, '청라')
    .replace(/배곧신도시/g, '배곧')
    .replace(/운정신도시/g, '운정')
    .replace(/검단신도시/g, '검단')
    .replace(/옥정신도시|양주옥정/g, '옥정')
    .replace(/가운마을/g, '가운')
    .replace(/부영사랑으로|사랑으로\s*부영|사랑으로/gi, '부영')
    .replace(/금강펜테리움|펜테리움/gi, '펜테리움')
    .replace(/자연앤e편한세상|자연&e편한세상|이편한세상|e\-편한세상/gi, 'e편한세상')
    .replace(/에스케이뷰|sk\s*view|에스케이/gi, 'sk')
    .replace(/대우\s*푸르지오(?!아)/gi, '푸르지오')
    .replace(/금호\s*어울림/gi, '금호어울림')
    .replace(/호반\s*베르디움/gi, '호반베르디움')
    .replace(/호반\s*써밋/gi, '호반써밋')
    .replace(/유승\s*한내들/gi, '유승한내들')
    .replace(/신안\s*인스빌/gi, '신안인스빌')
    .replace(/한신\s*휴플러스|한신\s*더휴/gi, '한신더휴')
    .replace(/센트럴에일린의뜰/gi, '에일린의뜰')
    .replace(/더샵|the\s*sharp/gi, '더샵')
    .replace(/아이파크|i\-park/gi, '아이파크')
    .replace(/두산위브|두산\s*위브/gi, '두산위브')
    .replace(/한화꿈에그린/gi, '꿈에그린')
    .replace(/롯데낙천대/gi, '낙천대')
    .replace(/중흥에스클래스|중흥s\-클래스/gi, '중흥s클래스')
    .replace(/디에이치|the\s*h/gi, '디에이치')
    .replace(/아크로|acro/gi, '아크로')
    .replace(/스카이뷰/gi, '')
    .replace(/블록|블럭|bl/gi, '')
    .replace(/1차|1단지/gi, '1')
    .replace(/2차|2단지/gi, '2')
    .replace(/3차|3단지/gi, '3')
    .replace(/4차|4단지/gi, '4')
    .replace(/5차|5단지/gi, '5')
    .replace(/6차|6단지/gi, '6')
    .replace(/7차|7단지/gi, '7')
    .replace(/8차|8단지/gi, '8')
    .replace(/9차|9단지/gi, '9')
    .toLowerCase();
}

function fetchXml(url) {
  return new Promise((resolve) => {
    https.get(url, { timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve('')).on('timeout', function() { this.destroy(); resolve(''); });
  });
}

function getVal(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return m ? m[1].trim() : '';
}

function parseItems(xml) {
  return xml.match(/<item>[\s\S]*?<\/item>/g) || [];
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// 사용자 핵심 가격 규칙: 상세페이지(AptDetailClient)와 100% 일치하는 최근 1개월(31일) 평균(2건 이상), 1건이면 마지막 실거래가
function computeAccurateTradePrice(trades) {
  if (!trades.length) return null;
  trades.sort((a, b) => b.dealTime - a.dealTime);

  const latest = trades[0];
  const ONE_MONTH_MS = 31 * 24 * 60 * 60 * 1000;
  const recent1Month = trades.filter(t => latest.dealTime - t.dealTime <= ONE_MONTH_MS);

  let finalPrice = latest.amount;
  if (recent1Month.length >= 2) {
    finalPrice = Math.round(recent1Month.reduce((sum, t) => sum + t.amount, 0) / recent1Month.length);
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

// 전국 시군구 법정동 코드 목록
const LAWD_CODES = [
  "11110","11140","11170","11200","11215","11230","11260","11290","11305","11320",
  "11350","11380","11410","11440","11470","11500","11530","11545","11560","11590",
  "11620","11650","11680","11710","11740",
  "21010","21020","21030","21040","21050","21060","21070","21080","21090","21100",
  "21110","21120","21130","21140","21150","21160",
  "23010","23020","23030","23040","23050","23060","23070","23080","23090","23100",
  "23110","23120","23130","23140","23150","23160",
  "29010","29020","29030","29040","29050","29060","29070","29080","29090","29100",
  "29110","29120","29130","29140","29150","29160","29170","29180","29190","29200",
  "31010","31020","31030","31040","31050","31060","31070","31080","31090","31100",
  "31110","31120","31130","31140","31150","31160","31170","31180","31190","31200",
  "36110",
  "41111","41113","41115","41117","41119","41121","41123","41125","41127","41129",
  "41131","41133","41135","41150","41171","41173","41175","41190","41210","41220",
  "41250","41270","41271","41273","41275","41281","41285","41287","41290","41310",
  "41360","41370","41390","41410","41430","41450","41460","41461","41463","41465",
  "41480","41500","41550","41570","41590","41610","41630","41650","41670","41800",
  "41820","41830",
  "43111","43112","43113","43114","43130","43150","43720","43730","43745","43750",
  "43760","43770","43780","43790","43800",
  "44131","44133","44150","44180","44200","44210","44230","44250","44260","44270",
  "44273","44710","44730","44760","44770","44790","44800","44810","44825",
  "45111","45113","45130","45140","45150","45160","45180","45190","45210","45710",
  "45720","45730","45740","45750","45760","45770","45790","45800",
  "46110","46130","46150","46170","46230","46710","46720","46730","46740","46750",
  "46760","46770","46780","46790","46800","46810","46820","46830","46840","46860",
  "46870","46880","46890","46900",
  "47111","47113","47130","47150","47170","47190","47210","47730","47750","47760",
  "47770","47820","47830","47840","47850","47900","47920","47930",
  "48121","48123","48125","48127","48129","48131","48133","48170","48220","48240",
  "48250","48270","48310","48320","48330","48720","48730","48740","48820","48840",
  "48850","48860","48870","48880","48890",
  "50110","50130","50710","50720","50730",
  "51110","51130","51150","51170","51190","51210","51720","51730","51750","51760",
  "51770","51780","51790","51800","51810","51820","51830","51840",
  "52111","52113","52130","52140","52150","52180","52190","52210","52710","52720",
  "52730","52740","52750","52760","52770","52780","52790","52800",
];

async function main() {
  const startTime = Date.now();
  const log = (msg) => {
    const ts = new Date().toISOString().substring(11, 19);
    const line = `[${ts}] ${msg}`;
    console.log(line);
    fs.appendFileSync(LOG_PATH, line + '\n');
  };

  if (fs.existsSync(LOG_PATH)) fs.unlinkSync(LOG_PATH);
  log('=== 마스터 DB 최신 실거래가 전수 동기화 시작 (안정형) ===');

  const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
  log(`마스터 DB 로드: 총 ${masterData.length}개 단지`);

  // 지번 및 정규화 인덱스 빌드
  const jibunIndex = new Map();
  const normIndex = new Map();

  masterData.forEach((apt, idx) => {
    if (apt.district && apt.jibun) {
      const jKey = `${apt.district.trim()} ${apt.jibun.trim()}`;
      jibunIndex.set(jKey, idx);
      if (apt.sgg_cd) {
        jibunIndex.set(`${apt.sgg_cd}|${apt.district.trim()}|${apt.jibun.trim()}`, idx);
      }
    }
    const nKey = normalizeAptName(apt.name);
    if (nKey) {
      if (!normIndex.has(nKey)) normIndex.set(nKey, []);
      normIndex.get(nKey).push(idx);
    }
  });

  log(`지번 인덱스: ${jibunIndex.size}개, 명칭 인덱스: ${normIndex.size}개`);

  // 최근 6개월 YYYYMM
  const now = new Date();
  const months = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  log(`조회 기간: ${months[0]} ~ ${months[months.length - 1]}`);

  // 단지별 거래 수집 버퍼: masterIndex -> { trades: [] }
  const aptTradesBuffer = new Map();

  // 안전한 호출 설정: 동시 4개, 딜레이 120ms
  const CONCURRENCY = 4;
  const DELAY_MS = 120;
  let totalApiCalls = 0;
  let totalTradesCollected = 0;

  // 전체 작업 큐
  const tasks = [];
  for (const lawdCode of LAWD_CODES) {
    for (const ym of months) {
      tasks.push({ lawdCode, ym });
    }
  }

  log(`총 API 호출 예정: ${tasks.length}건 (${LAWD_CODES.length}개 시군구 × ${months.length}개월)`);

  for (let i = 0; i < tasks.length; i += CONCURRENCY) {
    const batch = tasks.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(async ({ lawdCode, ym }) => {
      const tradeUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${API_KEY}&LAWD_CD=${lawdCode}&DEAL_YMD=${ym}&numOfRows=1000`;
      const xml = await fetchXml(tradeUrl);
      if (!xml) return;

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
        const sggCd = getVal(item, 'sggCd') || lawdCode;

        const amount = parseInt(dealAmtStr, 10);
        if (!aptNm || isNaN(amount) || amount <= 0) continue;

        // 1순위: 지번 매칭
        let masterIdx = jibunIndex.get(`${sggCd}|${umdNm}|${jibun}`) ?? jibunIndex.get(`${umdNm} ${jibun}`);
        // 2순위: 단지명 매칭
        if (masterIdx === undefined) {
          const nKey = normalizeAptName(aptNm);
          const candidates = normIndex.get(nKey);
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
          totalTradesCollected++;
        }
      }
      totalApiCalls++;
    }));

    if ((i + CONCURRENCY) % 100 === 0 || i + CONCURRENCY >= tasks.length) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      const done = Math.min(i + CONCURRENCY, tasks.length);
      log(`진행: ${done}/${tasks.length} (${elapsed}s) | 수집된 실거래: ${totalTradesCollected}건, 매칭된 마스터 단지: ${aptTradesBuffer.size}개`);
    }

    await sleep(DELAY_MS);
  }

  log(`\nRTMS 실거래 수집 완료: 총 ${totalTradesCollected}건, 매칭된 마스터 단지: ${aptTradesBuffer.size}개`);

  // 마스터 DB 전수 갱신
  log('마스터 DB 가격 필드 국토부 실거래가로 전수 동기화 중...');
  let updatedCount = 0;

  aptTradesBuffer.forEach((data, idx) => {
    const calc = computeAccurateTradePrice(data.trades);
    if (calc) {
      const apt = masterData[idx];
      apt.price_max = calc.max;
      apt.price_min = calc.min;
      apt.avgPrice = calc.price; // 최근 3개월 평균 또는 마지막 실거래가
      apt.is_real_price = true;
      apt.isRealPrice = true;

      // 전세가 없으면 통상 전세가율 56% 자동 계산
      if (!apt.rent_max || apt.rent_max <= 0) {
        apt.rent_max = Math.round(calc.price * 0.56);
        apt.rent_min = Math.round(calc.min * 0.56);
      }
      apt.gapPrice = Math.max(0, apt.avgPrice - apt.rent_max);

      updatedCount++;
    }
  });

  log(`실거래가로 정밀 갱신된 단지 수: ${updatedCount}개`);

  // 다산한강반도유보라 검증
  const targetCheck = masterData.find(a => a.name && a.name.includes('다산한강반도유보라'));
  if (targetCheck) {
    log(`[검증] 다산한강반도유보라: price_max=${targetCheck.price_max}, price_min=${targetCheck.price_min}, avgPrice=${targetCheck.avgPrice}, rent_max=${targetCheck.rent_max}`);
  }

  // 파일 저장
  log('마스터 DB 저장 중...');
  fs.writeFileSync(MASTER_PATH, JSON.stringify(masterData, null, 2), 'utf8');
  log(`마스터 DB 저장 완료: ${MASTER_PATH}`);

  const totalSec = ((Date.now() - startTime) / 1000).toFixed(1);
  log(`=== 전체 작업 완료 (소요시간: ${totalSec}s) ===`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
