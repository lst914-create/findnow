/**
 * 전국 더미 아파트 실거래가 갱신 스크립트 (2차 - 미처리 지역 전체)
 * 최근 3개월(2024-08 ~ 2024-10) 데이터를 MOLIT API에서 수집
 * 34평 우선, 없으면 최고가 평형
 * 최근 1개월 내 2건 이상 → 평균, 아니면 마지막 거래가
 */

const fs = require('fs');
const path = require('path');

const MASTER_PATH = path.join(__dirname, '../src/lib/apartments-master.json');
const RAW_KEY = 'w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D';
const API_KEY = encodeURIComponent(decodeURIComponent(RAW_KEY));

// region → LAWD 코드 매핑 (전국)
const REGION_LAWD = {
  // 서울
  '서울 종로구': '11110',
  '서울 중구': '11140',
  '서울 용산구': '11170',
  '서울 성동구': '11200',
  '서울 광진구': '11215',
  '서울 동대문구': '11230',
  '서울 중랑구': '11260',
  '서울 성북구': '11290',
  '서울 강북구': '11305',
  '서울 도봉구': '11320',
  '서울 노원구': '11350',
  '서울 은평구': '11380',
  '서울 서대문구': '11410',
  '서울 마포구': '11440',
  '서울 양천구': '11470',
  '서울 강서구': '11500',
  '서울 구로구': '11530',
  '서울 금천구': '11545',
  '서울 영등포구': '11560',
  '서울 동작구': '11590',
  '서울 관악구': '11620',
  '서울 서초구': '11650',
  '서울 강남구': '11680',
  '서울 송파구': '11710',
  '서울 강동구': '11740',
  // 부산
  '부산 중구': '26110',
  '부산 서구': '26140',
  '부산 동구': '26170',
  '부산 영도구': '26200',
  '부산 부산진구': '26230',
  '부산 동래구': '26260',
  '부산 남구': '26290',
  '부산 북구': '26320',
  '부산 해운대구': '26350',
  '부산 사하구': '26380',
  '부산 금정구': '26410',
  '부산 강서구': '26440',
  '부산 연제구': '26470',
  '부산 수영구': '26500',
  '부산 사상구': '26530',
  '부산 기장군': '26710',
  // 대구
  '대구 중구': '27110',
  '대구 동구': '27140',
  '대구 서구': '27170',
  '대구 남구': '27200',
  '대구 북구': '27230',
  '대구 수성구': '27260',
  '대구 달서구': '27290',
  '대구 달성군': '27710',
  '대구 군위군': '27720',
  // 인천
  '인천 중구': '28110',
  '인천 동구': '28140',
  '인천 미추홀구': '28177',
  '인천 연수구': '28185',
  '인천 남동구': '28200',
  '인천 부평구': '28237',
  '인천 계양구': '28245',
  '인천 서구': '28260',
  '인천 강화군': '28710',
  '인천 옹진군': '28720',
  // 인천 신설 구
  '인천 검단구': '28260',   // 서구에서 분리, 일단 서구 코드
  '인천 서해구': '28260',   // 서구에서 분리
  '인천 영종구': '28110',   // 중구에서 분리
  '인천 제물포구': '28177', // 미추홀구에서 분리
  // 광주
  '광주 동구': '29110',
  '광주 서구': '29140',
  '광주 남구': '29155',
  '광주 북구': '29170',
  '광주 광산구': '29200',
  // 대전
  '대전 동구': '30110',
  '대전 중구': '30140',
  '대전 서구': '30170',
  '대전 유성구': '30200',
  '대전 대덕구': '30230',
  // 울산
  '울산 중구': '31110',
  '울산 남구': '31140',
  '울산 동구': '31170',
  '울산 북구': '31200',
  '울산 울주군': '31710',
  // 세종
  '세종 null': '36110',
  '세종 세종시': '36110',
  // 경기
  '경기 수원장안구': '41111',
  '경기 수원권선구': '41113',
  '경기 수원팔달구': '41115',
  '경기 수원영통구': '41117',
  '경기 성남수정구': '41131',
  '경기 성남중원구': '41133',
  '경기 성남분당구': '41135',
  '경기 의정부시': '41150',
  '경기 안양만안구': '41171',
  '경기 안양동안구': '41173',
  '경기 부천원미구': '41192',
  '경기 부천소사구': '41194',
  '경기 부천오정구': '41196',
  '경기 광명시': '41210',
  '경기 평택시': '41220',
  '경기 동두천시': '41250',
  '경기 안산상록구': '41271',
  '경기 안산단원구': '41273',
  '경기 고양덕양구': '41281',
  '경기 고양일산동구': '41285',
  '경기 고양일산서구': '41287',
  '경기 과천시': '41290',
  '경기 구리시': '41310',
  '경기 남양주시': '41360',
  '경기 오산시': '41370',
  '경기 시흥시': '41390',
  '경기 군포시': '41410',
  '경기 의왕시': '41430',
  '경기 하남시': '41450',
  '경기 용인처인구': '41461',
  '경기 용인기흥구': '41463',
  '경기 용인수지구': '41465',
  '경기 파주시': '41480',
  '경기 이천시': '41500',
  '경기 안성시': '41550',
  '경기 김포시': '41570',
  '경기 화성시': '41590',
  '경기 화성동탄구': '41590',   // 화성시 코드 공통 사용
  '경기 화성만세구': '41590',
  '경기 화성병점구': '41590',
  '경기 화성효행구': '41590',
  '경기 광주시': '41610',
  '경기 양주시': '41630',
  '경기 포천시': '41650',
  '경기 여주시': '41670',
  '경기 연천군': '41800',
  '경기 가평군': '41820',
  '경기 양평군': '41830',
  // 강원
  '강원 춘천시': '51110',
  '강원 원주시': '51130',
  '강원 강릉시': '51150',
  '강원 동해시': '51170',
  '강원 태백시': '51190',
  '강원 속초시': '51210',
  '강원 삼척시': '51230',
  '강원 홍천군': '51720',
  '강원 횡성군': '51730',
  '강원 영월군': '51750',
  '강원 평창군': '51760',
  '강원 정선군': '51770',
  '강원 철원군': '51780',
  '강원 화천군': '51790',
  '강원 양구군': '51800',
  '강원 인제군': '51810',
  '강원 고성군': '51820',
  '강원 양양군': '51830',
  // 충북
  '충북 청주상당구': '43111',
  '충북 청주서원구': '43112',
  '충북 청주흥덕구': '43113',
  '충북 청주청원구': '43114',
  '충북 충주시': '43130',
  '충북 제천시': '43150',
  '충북 보은군': '43720',
  '충북 옥천군': '43730',
  '충북 영동군': '43740',
  '충북 증평군': '43745',
  '충북 진천군': '43750',
  '충북 괴산군': '43760',
  '충북 음성군': '43770',
  '충북 단양군': '43800',
  // 충남
  '충남 천안동남구': '44131',
  '충남 천안서북구': '44133',
  '충남 공주시': '44150',
  '충남 보령시': '44180',
  '충남 아산시': '44200',
  '충남 서산시': '44210',
  '충남 논산시': '44230',
  '충남 계룡시': '44250',
  '충남 당진시': '44270',
  '충남 금산군': '44710',
  '충남 부여군': '44760',
  '충남 서천군': '44770',
  '충남 청양군': '44790',
  '충남 홍성군': '44800',
  '충남 예산군': '44810',
  '충남 태안군': '44825',
  // 전북
  '전북 전주완산구': '52111',
  '전북 전주덕진구': '52113',
  '전북 군산시': '52130',
  '전북 익산시': '52140',
  '전북 정읍시': '52180',
  '전북 남원시': '52190',
  '전북 김제시': '52210',
  '전북 완주군': '52710',
  '전북 진안군': '52720',
  '전북 무주군': '52730',
  '전북 장수군': '52740',
  '전북 임실군': '52750',
  '전북 순창군': '52770',
  '전북 고창군': '52790',
  '전북 부안군': '52800',
  // 전남
  '전남 목포시': '46110',
  '전남 여수시': '46130',
  '전남 순천시': '46150',
  '전남 나주시': '46170',
  '전남 광양시': '46230',
  '전남 담양군': '46710',
  '전남 곡성군': '46720',
  '전남 구례군': '46730',
  '전남 고흥군': '46770',
  '전남 보성군': '46780',
  '전남 화순군': '46790',
  '전남 장흥군': '46800',
  '전남 강진군': '46810',
  '전남 해남군': '46820',
  '전남 영암군': '46830',
  '전남 무안군': '46840',
  '전남 함평군': '46860',
  '전남 영광군': '46870',
  '전남 장성군': '46880',
  '전남 완도군': '46890',
  '전남 진도군': '46900',
  '전남 신안군': '46910',
  // 경북
  '경북 포항북구': '47111',
  '경북 포항남구': '47113',
  '경북 경주시': '47130',
  '경북 김천시': '47150',
  '경북 안동시': '47170',
  '경북 구미시': '47190',
  '경북 영주시': '47210',
  '경북 영천시': '47230',
  '경북 상주시': '47250',
  '경북 문경시': '47280',
  '경북 경산시': '47290',
  '경북 의성군': '47730',
  '경북 청송군': '47750',
  '경북 영양군': '47760',
  '경북 영덕군': '47770',
  '경북 청도군': '47820',
  '경북 고령군': '47830',
  '경북 성주군': '47840',
  '경북 칠곡군': '47850',
  '경북 예천군': '47900',
  '경북 봉화군': '47920',
  '경북 울진군': '47930',
  '경북 울릉군': '47940',
  // 경남
  '경남 창원의창구': '48121',
  '경남 창원성산구': '48123',
  '경남 창원마산합포구': '48125',
  '경남 창원마산회원구': '48127',
  '경남 창원진해구': '48129',
  '경남 진주시': '48170',
  '경남 통영시': '48220',
  '경남 사천시': '48240',
  '경남 김해시': '48250',
  '경남 밀양시': '48270',
  '경남 거제시': '48310',
  '경남 양산시': '48330',
  '경남 의령군': '48720',
  '경남 함안군': '48730',
  '경남 창녕군': '48740',
  '경남 고성군': '48820',
  '경남 남해군': '48840',
  '경남 하동군': '48850',
  '경남 산청군': '48860',
  '경남 함양군': '48870',
  '경남 거창군': '48880',
  '경남 합천군': '48890',
  // 제주
  '제주 제주시': '50110',
  '제주 서귀포시': '50130',
};

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function getSupplyPyeong(excluUseAr) {
  const ar = parseFloat(excluUseAr);
  if (isNaN(ar)) return null;
  if (ar >= 59 && ar < 70) return 25;
  if (ar >= 70 && ar < 80) return 30;
  if (ar >= 80 && ar < 95) return 34;
  if (ar >= 95 && ar < 115) return 40;
  if (ar >= 115 && ar < 135) return 50;
  if (ar >= 135) return 60;
  if (ar >= 49 && ar < 59) return 20;
  if (ar >= 33 && ar < 49) return 15;
  return Math.round(ar / 3.305785);
}

function normalize(name) {
  if (!name) return '';
  return name
    .replace(/\s+/g, '')
    .replace(/아파트$/,'')
    .replace(/[()（）\[\]]/g,'')
    .replace(/[1-9]차$/,'')
    .replace(/블록$|블럭$|BL$/,'')
    .replace(/\d+블록$|\d+블럭$/,'')
    .replace(/더샵/g,'더샵')
    .toLowerCase();
}

async function fetchTrades(lawdCd, dealYm) {
  const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${API_KEY}&numOfRows=1000&pageNo=1&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYm}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const xml = await res.text();
    const items = [];
    const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    for (const item of itemMatches) {
      const get = (tag) => {
        const m = item.match(new RegExp(`<${tag}>([^<]*)<\/${tag}>`));
        return m ? m[1].trim() : '';
      };
      const cancelCheck = get('cdealType') || get('cancelDealType');
      if (cancelCheck && cancelCheck.trim() !== '' && cancelCheck.trim() !== '0') continue;
      items.push({
        aptNm: get('aptNm'),
        dealAmount: get('dealAmount').replace(/,/g,''),
        excluUseAr: get('excluUseAr'),
        dealYear: get('dealYear'),
        dealMonth: get('dealMonth'),
        dealDay: get('dealDay'),
        umdNm: get('umdNm'),
      });
    }
    return items;
  } catch(e) {
    return [];
  }
}

function computePrice(trades) {
  // 최근 1개월 내 거래 (2024-10 기준)
  const recent = trades.filter(t => t.dealYear === '2024' && t.dealMonth === '10');
  if (recent.length >= 2) {
    const avg = recent.reduce((s,t) => s + parseInt(t.dealAmount), 0) / recent.length;
    return Math.round(avg);
  }
  // 아니면 마지막 거래가
  const sorted = [...trades].sort((a,b) => {
    const da = new Date(`${a.dealYear}-${String(a.dealMonth).padStart(2,'0')}-${String(a.dealDay||'01').padStart(2,'0')}`);
    const db = new Date(`${b.dealYear}-${String(b.dealMonth).padStart(2,'0')}-${String(b.dealDay||'01').padStart(2,'0')}`);
    return db - da;
  });
  return parseInt(sorted[0].dealAmount);
}

async function main() {
  console.log('Loading master data...');
  const master = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
  
  const dummies = master.filter(a => !a.isRealPrice);
  console.log(`Dummy apartments: ${dummies.length}`);

  // 처리할 지역 목록
  const regionSet = new Set(dummies.map(a => a.region).filter(Boolean));
  console.log(`Unique dummy regions: ${regionSet.size}`);

  // 수집할 달 (최근 3개월)
  const months = ['202410', '202409', '202408'];
  
  // 지역별로 거래 데이터 수집
  const tradesByLawd = {}; // lawdCd → trades[]
  
  const processedLawds = new Set();
  let regionIdx = 0;
  for (const region of regionSet) {
    regionIdx++;
    const lawdCd = REGION_LAWD[region];
    if (!lawdCd) {
      console.log(`  [SKIP] No LAWD for: ${region}`);
      continue;
    }
    if (processedLawds.has(lawdCd)) {
      // 이미 수집한 코드 - 결과 공유
      if (!tradesByLawd[lawdCd]) tradesByLawd[lawdCd] = [];
      continue;
    }
    processedLawds.add(lawdCd);
    
    const allTrades = [];
    for (const ym of months) {
      await sleep(150);
      const trades = await fetchTrades(lawdCd, ym);
      allTrades.push(...trades);
    }
    tradesByLawd[lawdCd] = allTrades;
    
    if (regionIdx % 10 === 0) {
      console.log(`  Progress: ${regionIdx}/${regionSet.size} regions | lawdCd=${lawdCd} | trades=${allTrades.length}`);
    }
  }

  console.log('\nMatching trades to dummy apartments...');
  let updatedCount = 0;
  let notFoundCount = 0;

  const masterMap = new Map(master.map(a => [a.id, a]));

  for (const apt of dummies) {
    const lawdCd = REGION_LAWD[apt.region];
    if (!lawdCd) { notFoundCount++; continue; }

    const allTrades = tradesByLawd[lawdCd] || [];
    if (allTrades.length === 0) { notFoundCount++; continue; }

    const normName = normalize(apt.name);
    
    // 이름 매칭
    const matched = allTrades.filter(t => {
      const tn = normalize(t.aptNm);
      return tn === normName || tn.includes(normName) || normName.includes(tn);
    });

    if (matched.length === 0) { notFoundCount++; continue; }

    // 34평 우선, 없으면 최고가 평형
    const byPyeong = {};
    for (const t of matched) {
      const py = getSupplyPyeong(t.excluUseAr);
      if (!py) continue;
      if (!byPyeong[py]) byPyeong[py] = [];
      byPyeong[py].push(t);
    }

    let selectedTrades = byPyeong[34];
    if (!selectedTrades || selectedTrades.length === 0) {
      // 최고가 평형
      let maxPrice = -1;
      for (const [py, trades] of Object.entries(byPyeong)) {
        const maxT = Math.max(...trades.map(t => parseInt(t.dealAmount)));
        if (maxT > maxPrice) {
          maxPrice = maxT;
          selectedTrades = trades;
        }
      }
    }

    if (!selectedTrades || selectedTrades.length === 0) { notFoundCount++; continue; }

    const price = computePrice(selectedTrades);
    if (isNaN(price) || price <= 0) { notFoundCount++; continue; }

    const obj = masterMap.get(apt.id);
    if (obj) {
      obj.price_min = price;
      obj.price_max = price;
      obj.isRealPrice = true;
      updatedCount++;
    }
  }

  console.log(`\nUpdated: ${updatedCount} | Not found: ${notFoundCount}`);
  console.log('Saving...');
  fs.writeFileSync(MASTER_PATH, JSON.stringify(master, null, 2));
  console.log('Done!');

  // 최종 통계
  const realCount = master.filter(a => a.isRealPrice).length;
  console.log(`\nFinal: ${realCount} / ${master.length} (${Math.round(realCount/master.length*100)}%) real prices`);
}

main().catch(console.error);

