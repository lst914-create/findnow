/**
 * [5단계] 전국 RTMS 실거래가 수집 → jibun 기반 마스터 DB 보강 스크립트
 *
 * 실행: node scripts/buildJibunLookup.cjs
 *
 * 처리 흐름:
 * 1. 전국 276개 법정동 × 12개월 RTMS API 호출
 * 2. 각 거래에서 sggCd+umdNm+jibun+aptNm+buildYear 수집
 * 3. aptNm 기준으로 그룹화 → 단지별 대표 jibun 확정
 * 4. normalizeAptName 매칭으로 마스터 DB에 bjd_code, jibun, sggCd, umdNm 추가
 * 5. jibunLookup.json 생성 (key: "sggCd|umdNm|jibun" → masterAptName)
 * 6. 보강된 apartments-master.json 저장
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── 경로 설정 ──────────────────────────────────────────────────
const ROOT = 'c:/Users/PC/Desktop/streamlit-detail-page/chajwo';
const MASTER_PATH = path.join(ROOT, 'src/lib/apartments-master.json');
const OUTPUT_MASTER = path.join(ROOT, 'src/lib/apartments-master.json');
const OUTPUT_LOOKUP = path.join(ROOT, 'src/lib/jibun-lookup.json');
const LOG_PATH = path.join(ROOT, 'scripts/jibun-build.log');

const API_KEY = 'w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D';
const CONCURRENCY = 5;   // 동시 요청 수
const DELAY_MS = 120;    // 요청 간 딜레이

// ── 법정동 코드 목록 (publicDataApi.ts에서 추출) ──────────────
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

// ── normalizeAptName (TypeScript → JS 포팅) ────────────────────
function normalizeAptName(name) {
  if (!name) return '';
  return name
    .replace(/\(주\)|주식회사|\[주\]|\(유\)|유한회사/gi, '')
    .replace(/\d+동(?:\s*,\s*\d+동)*|\([0-9\-~,동\s]+\)/g, '')
    .replace(/[\s\-_(),.·\[\]{}<>]/g, '')
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
    .replace(/금강펜테리움/gi, '펜테리움')
    .replace(/자연앤e편한세상|자연&e편한세상|이편한세상|e\-편한세상/gi, 'e편한세상')
    .replace(/에스케이뷰|sk\s*view/gi, 'sk뷰')
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
    .replace(/블록|블럭|bl/gi, '')
    .replace(/1차|ⅰ|i단지|1단지|Ⅰ/gi, '1')
    .replace(/2차|ⅱ|ii단지|2단지|Ⅱ/gi, '2')
    .replace(/3차|ⅲ|iii단지|3단지|Ⅲ/gi, '3')
    .replace(/4차|ⅳ|iv단지|4단지|Ⅳ/gi, '4')
    .replace(/5차|ⅴ|v단지|5단지|Ⅴ/gi, '5')
    .replace(/6차|ⅵ|vi단지|6단지|Ⅵ/gi, '6')
    .replace(/7차|ⅶ|vii단지|7단지|Ⅶ/gi, '7')
    .replace(/8차|ⅷ|viii단지|8단지|Ⅷ/gi, '8')
    .replace(/9차|ⅸ|ix단지|9단지|Ⅸ/gi, '9')
    .toLowerCase();
}

// ── HTTP 유틸 ──────────────────────────────────────────────────
function fetchXml(url) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', () => resolve(''));
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getVal(xml, tag) {
  const m = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
  return m ? m[1].trim() : '';
}

function parseItems(xml) {
  return xml.match(/<item>[\s\S]*?<\/item>/g) || [];
}

// ── 배치 실행 유틸 ─────────────────────────────────────────────
async function runBatch(tasks, concurrency, fn) {
  const results = [];
  for (let i = 0; i < tasks.length; i += concurrency) {
    const batch = tasks.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
    if (i + concurrency < tasks.length) await sleep(DELAY_MS);
  }
  return results;
}

// ── 메인 로직 ─────────────────────────────────────────────────
async function main() {
  const startTime = Date.now();
  const log = (msg) => {
    const ts = new Date().toISOString().substring(11, 19);
    const line = `[${ts}] ${msg}`;
    console.log(line);
    fs.appendFileSync(LOG_PATH, line + '\n');
  };

  // 로그 초기화
  if (fs.existsSync(LOG_PATH)) fs.unlinkSync(LOG_PATH);
  log('=== jibun 기반 마스터 DB 보강 시작 ===');

  // 마스터 DB 로드
  log('마스터 DB 로드 중...');
  const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
  log(`마스터 단지 수: ${masterData.length}`);

  // 마스터 normName → index 맵
  const masterNormMap = new Map();
  for (let i = 0; i < masterData.length; i++) {
    const apt = masterData[i];
    if (!apt.name) continue;
    const key = normalizeAptName(apt.name);
    if (key) {
      if (!masterNormMap.has(key)) masterNormMap.set(key, []);
      masterNormMap.get(key).push(i);
    }
  }
  log(`마스터 normName 키 수: ${masterNormMap.size}`);

  // RTMS 수집 대상: 최근 12개월 YYYYMM 목록
  const now = new Date();
  const months = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  log(`조회 월: ${months[0]} ~ ${months[months.length - 1]}`);

  // 전체 작업 목록 생성
  const tasks = [];
  for (const lawdCode of LAWD_CODES) {
    for (const ym of months) {
      tasks.push({ lawdCode, ym });
    }
  }
  log(`총 API 호출 예정: ${tasks.length}건 (${LAWD_CODES.length}지역 × ${months.length}개월)`);

  // 단지별 거래 수집: normName → Set<"sggCd|umdNm|jibun"> + buildYear 투표
  // 구조: tradeMap[normName] = { jibunCounts: Map<key, count>, buildYearCounts: Map<year, count>, aptNmSamples: Set }
  const tradeMap = new Map();

  let doneCount = 0;
  let errorCount = 0;
  let tradeTotal = 0;

  const processTask = async ({ lawdCode, ym }) => {
    const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${API_KEY}&LAWD_CD=${lawdCode}&DEAL_YMD=${ym}&numOfRows=1000`;
    const xml = await fetchXml(url);
    if (!xml) { errorCount++; return; }

    const items = parseItems(xml);
    for (const item of items) {
      const cancel = getVal(item, 'cdealType') || getVal(item, 'cancelDealType');
      if (cancel && cancel !== '' && cancel !== '0') continue;

      const aptNm = getVal(item, 'aptNm');
      const sggCd = getVal(item, 'sggCd');
      const umdNm = getVal(item, 'umdNm');
      const jibun = getVal(item, 'jibun').replace(/\s+/g, ''); // 공백 제거
      const buildYear = getVal(item, 'buildYear');

      if (!aptNm || !sggCd || !jibun) continue;

      const normName = normalizeAptName(aptNm);
      if (!normName) continue;

      const jibunKey = `${sggCd}|${umdNm}|${jibun}`;

      if (!tradeMap.has(normName)) {
        tradeMap.set(normName, {
          jibunCounts: new Map(),
          buildYearCounts: new Map(),
          aptNmSamples: new Set(),
          sggCdSamples: new Set(),
        });
      }
      const entry = tradeMap.get(normName);
      entry.jibunCounts.set(jibunKey, (entry.jibunCounts.get(jibunKey) || 0) + 1);
      if (buildYear) entry.buildYearCounts.set(buildYear, (entry.buildYearCounts.get(buildYear) || 0) + 1);
      entry.aptNmSamples.add(aptNm);
      entry.sggCdSamples.add(sggCd);
      tradeTotal++;
    }

    doneCount++;
    if (doneCount % 100 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(0);
      log(`진행: ${doneCount}/${tasks.length} (${elapsed}s, 거래 ${tradeTotal}건, 단지 ${tradeMap.size}개)`);
    }
  };

  log('RTMS API 수집 시작...');
  await runBatch(tasks, CONCURRENCY, processTask);
  log(`수집 완료: ${doneCount}/${tasks.length} (에러: ${errorCount}건, 총 거래: ${tradeTotal}건, 발견 단지: ${tradeMap.size}개)`);

  // ── 마스터 DB 보강 ──────────────────────────────────────────
  log('\n마스터 DB jibun 보강 시작...');
  let matchCount = 0;
  let noMatchCount = 0;
  const jibunLookup = {}; // "sggCd|umdNm|jibun" → masterAptId

  for (const [normName, entry] of tradeMap) {
    // 1. 가장 많이 등장한 jibun 선택
    let bestJibunKey = '';
    let bestCount = 0;
    for (const [key, cnt] of entry.jibunCounts) {
      if (cnt > bestCount) { bestCount = cnt; bestJibunKey = key; }
    }
    if (!bestJibunKey) continue;

    // 2. 가장 많이 등장한 buildYear 선택
    let bestBuildYear = '';
    let bestBYCount = 0;
    for (const [yr, cnt] of entry.buildYearCounts) {
      if (cnt > bestBYCount) { bestBYCount = cnt; bestBuildYear = yr; }
    }

    const [sggCd, umdNm, jibun] = bestJibunKey.split('|');
    // bjdCode: sggCd(5자리) + umdNm 조합 (법정동 코드 10자리는 별도 테이블 없이 sggCd로 대체)

    // 3. 마스터 DB 매칭
    const masterIndices = masterNormMap.get(normName) || [];
    if (masterIndices.length === 0) {
      noMatchCount++;
      continue;
    }

    // 여러 단지가 같은 normName → buildYear로 필터
    let targetIdx = masterIndices[0];
    if (masterIndices.length > 1 && bestBuildYear) {
      const byYearMatch = masterIndices.find(i => {
        const apt = masterData[i];
        return apt.built_year && String(apt.built_year) === bestBuildYear;
      });
      if (byYearMatch !== undefined) targetIdx = byYearMatch;
    }

    const apt = masterData[targetIdx];
    // 보강
    apt.sgg_cd = sggCd;
    apt.umd_nm = umdNm;
    apt.jibun = jibun;
    apt.bjd_code = sggCd; // 5자리 (추후 10자리로 확장 가능)

    // jibunLookup 등록
    jibunLookup[bestJibunKey] = { id: apt.id, name: apt.name };

    matchCount++;
  }

  log(`마스터 매칭 결과: 성공 ${matchCount}건 / 미매칭 ${noMatchCount}건`);

  // ── 저장 ───────────────────────────────────────────────────
  log('\n파일 저장 중...');
  fs.writeFileSync(OUTPUT_MASTER, JSON.stringify(masterData, null, 2), 'utf8');
  log(`마스터 DB 저장 완료: ${OUTPUT_MASTER}`);

  fs.writeFileSync(OUTPUT_LOOKUP, JSON.stringify(jibunLookup, null, 2), 'utf8');
  log(`jibun 룩업 저장 완료: ${OUTPUT_LOOKUP} (${Object.keys(jibunLookup).length}개 항목)`);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  log(`\n=== 완료 (소요시간: ${elapsed}s) ===`);
  log(`매칭률: ${((matchCount / (matchCount + noMatchCount)) * 100).toFixed(1)}%`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
