/**
 * 전국 아파트 국토교통부 실거래가 전수 수집 및 마스터 데이터 갱신 스크립트
 * 
 * [핵심 규칙 준수]
 * 1. 전국 단위 동일 적용
 * 2. 평형별로 엄격 분류 (34평 우선, 없으면 최고가 평형)
 * 3. 최근 1개월 내 복수 거래 -> 산술 평균가격
 * 4. 1건이거나 1개월/1년 전 거래 -> 가장 마지막 실거래가 그대로
 * 5. 중간값(min/max 평균) 절대 사용 금지 (price_min = price_max = finalPrice)
 * 6. 교차 지역(Cross-region) 매칭 원천 차단 (반드시 같은 시군구 코드 내에서만 매칭)
 * 7. 임시 추정 더미(가짜 12억, 13억, 1.10526 비율 더미) 완전 삭제 및 실거래로 대체
 */

const fs = require('fs');
const path = require('path');

const MASTER_PATH = path.join(__dirname, '../src/lib/apartments-master.json');
const RAW_KEY = 'w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D';
const API_KEY = encodeURIComponent(decodeURIComponent(RAW_KEY));

// 공급 평형 변환 (전용면적 -> 대표 공급평형)
function getSupplyPyeong(excluUseAr) {
  const ar = parseFloat(excluUseAr);
  if (isNaN(ar) || ar <= 0) return 34;
  if (ar < 45) return 18;
  if (ar < 65) return 25; // 전용 59㎡ -> 25평형
  if (ar < 80) return 30; // 전용 74㎡ -> 30평형
  if (ar < 95) return 34; // 전용 84㎡ -> 34평형 (국평)
  if (ar < 125) return 40; // 전용 101~115㎡ -> 40평형
  return 50;
}

// 단지명 표준 정규화
function normalizeAptName(name) {
  if (!name) return '';
  return name
    .replace(/\(주\)|주식회사|\[주\]|\(유\)|유한회사/gi, '')
    .replace(/[\s\-_(),.·[\]{}<>]/g, '')
    .replace(/아파트|마을/g, '')
    // 신도시/택지지구
    .replace(/다산지금|다산진건|다산신도시/g, '다산')
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
    // 브랜드
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
    .replace(/한화꿈에그린|한화포레나/gi, '포레나')
    .replace(/중흥에스클래스|중흥s\-클래스/gi, '중흥s클래스')
    .replace(/디에이치|the\s*h/gi, '디에이치')
    .replace(/아크로|acro/gi, '아크로')
    .replace(/블록|블럭|bl/gi, '')
    // 차수/단지
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchTradesForLawdMonth(lawdCd, ymd) {
  const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${API_KEY}&LAWD_CD=${lawdCd}&DEAL_YMD=${ymd}&numOfRows=1000`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const xml = await res.text();
    const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
    const trades = [];
    for (const item of items) {
      const get = (tag) => {
        const m = item.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
        return m ? m[1].trim() : '';
      };
      const cancelCheck = get('cdealType') || get('cancelDealType');
      if (cancelCheck && cancelCheck.trim() !== '' && cancelCheck.trim() !== '0') continue;

      const aptNm = get('aptNm');
      const dealAmtStr = get('dealAmount').replace(/,/g, '');
      const year = get('dealYear');
      const month = get('dealMonth').padStart(2, '0');
      const day = (get('dealDay') || '01').padStart(2, '0');
      const excluUseAr = parseFloat(get('excluUseAr')) || 0;
      const umdNm = get('umdNm');
      const floor = parseInt(get('floor'), 10) || 1;

      if (!aptNm || !dealAmtStr) continue;
      const amount = parseInt(dealAmtStr, 10);
      if (isNaN(amount) || amount <= 0) continue;

      trades.push({
        aptNm,
        normName: normalizeAptName(aptNm),
        umdNm,
        amount,
        dealDate: `${year}.${month}.${day}`,
        dealTime: new Date(`${year}-${month}-${day}`).getTime(),
        excluUseAr,
        supplyPyeong: getSupplyPyeong(excluUseAr),
        floor,
      });
    }
    return trades;
  } catch (e) {
    return [];
  }
}

// 220+ 전국 유효 LAWD 코드 매핑
const REGION_TO_LAWD = {
  // 서울 (25개 구)
  '서울 종로구': '11110', '서울 중구': '11140', '서울 용산구': '11170', '서울 성동구': '11200',
  '서울 광진구': '11215', '서울 동대문구': '11230', '서울 중랑구': '11260', '서울 성북구': '11290',
  '서울 강북구': '11305', '서울 도봉구': '11320', '서울 노원구': '11350', '서울 은평구': '11380',
  '서울 서대문구': '11410', '서울 마포구': '11440', '서울 양천구': '11470', '서울 강서구': '11500',
  '서울 구로구': '11530', '서울 금천구': '11545', '서울 영등포구': '11560', '서울 동작구': '11590',
  '서울 관악구': '11620', '서울 서초구': '11650', '서울 강남구': '11680', '서울 송파구': '11710',
  '서울 강동구': '11740',

  // 부산 (16개 구·군)
  '부산 중구': '26110', '부산 서구': '26140', '부산 동구': '26170', '부산 영도구': '26200',
  '부산 부산진구': '26230', '부산 동래구': '26260', '부산 남구': '26290', '부산 북구': '26320',
  '부산 해운대구': '26350', '부산 사하구': '26380', '부산 금정구': '26410', '부산 강서구': '26440',
  '부산 연제구': '26470', '부산 수영구': '26500', '부산 사상구': '26530', '부산 기장군': '26710',

  // 대구 (9개 구·군)
  '대구 중구': '27110', '대구 동구': '27140', '대구 서구': '27170', '대구 남구': '27200',
  '대구 북구': '27230', '대구 수성구': '27260', '대구 달서구': '27290', '대구 달성군': '27710',
  '대구 군위군': '27720',

  // 인천 (10개 구·군 + 신설 자치구 코드)
  '인천 중구': '28155', '인천 영종구': '28155',
  '인천 동구': '28125', '인천 제물포구': '28125',
  '인천 미추홀구': '28177', '인천 연수구': '28185', '인천 남동구': '28200',
  '인천 부평구': '28237', '인천 계양구': '28245',
  '인천 서구': '28275', '인천 서해구': '28275', '인천 검단구': '28290',
  '인천 강화군': '28710',

  // 대전 (5개 구)
  '대전 동구': '30110', '대전 중구': '30140', '대전 서구': '30170', '대전 유성구': '30200', '대전 대덕구': '30230',

  // 울산 (5개 구·군)
  '울산 중구': '31110', '울산 남구': '31140', '울산 동구': '31170', '울산 북구': '31200', '울산 울주군': '31710',

  // 세종
  '세종 null': '36110', '세종 세종시': '36110',

  // 경기 (전체 시·구)
  '경기 수원장안구': '41111', '경기 수원권선구': '41113', '경기 수원팔달구': '41115', '경기 수원영통구': '41117',
  '경기 성남수정구': '41131', '경기 성남중원구': '41133', '경기 성남분당구': '41135',
  '경기 의정부시': '41150', '경기 안양만안구': '41171', '경기 안양동안구': '41173',
  '경기 부천원미구': '41192', '경기 부천소사구': '41194', '경기 부천오정구': '41196',
  '경기 광명시': '41210', '경기 평택시': '41220', '경기 동두천시': '41250',
  '경기 안산상록구': '41271', '경기 안산단원구': '41273',
  '경기 고양덕양구': '41281', '경기 고양일산동구': '41285', '경기 고양일산서구': '41287',
  '경기 과천시': '41290', '경기 구리시': '41310', '경기 남양주시': '41360',
  '경기 오산시': '41370', '경기 시흥시': '41390', '경기 군포시': '41410',
  '경기 의왕시': '41430', '경기 하남시': '41450',
  '경기 용인처인구': '41461', '경기 용인기흥구': '41463', '경기 용인수지구': '41465',
  '경기 파주시': '41480', '경기 이천시': '41500', '경기 안성시': '41550',
  '경기 김포시': '41570',
  '경기 화성시': '41595', '경기 화성동탄구': '41595', '경기 화성만세구': '41593', '경기 화성병점구': '41591', '경기 화성효행구': '41593',
  '경기 광주시': '41610', '경기 양주시': '41630', '경기 포천시': '41650',
  '경기 여주시': '41670', '경기 연천군': '41800', '경기 가평군': '41820', '경기 양평군': '41830',

  // 강원 (강원특별자치도 51xxx)
  '강원 춘천시': '51110', '강원 원주시': '51130', '강원 강릉시': '51150', '강원 동해시': '51170',
  '강원 태백시': '51190', '강원 속초시': '51210', '강원 삼척시': '51230', '강원 홍천군': '51720',
  '강원 횡성군': '51730', '강원 영월군': '51750', '강원 평창군': '51760', '강원 정선군': '51770',
  '강원 철원군': '51780', '강원 화천군': '51790', '강원 양구군': '51800', '강원 인제군': '51810',
  '강원 고성군': '51820', '강원 양양군': '51830',

  // 충북 (43xxx)
  '충북 청주상당구': '43111', '충북 청주서원구': '43112', '충북 청주흥덕구': '43113', '충북 청주청원구': '43114',
  '충북 충주시': '43130', '충북 제천시': '43150', '충북 보은군': '43720', '충북 옥천군': '43730',
  '충북 영동군': '43740', '충북 증평군': '43745', '충북 진천군': '43750', '충북 괴산군': '43760',
  '충북 음성군': '43770', '충북 단양군': '43800',

  // 충남 (44xxx)
  '충남 천안동남구': '44131', '충남 천안서북구': '44133', '충남 공주시': '44150', '충남 보령시': '44180',
  '충남 아산시': '44200', '충남 서산시': '44210', '충남 논산시': '44230', '충남 계룡시': '44250',
  '충남 당진시': '44270', '충남 금산군': '44710', '충남 부여군': '44760', '충남 서천군': '44770',
  '충남 청양군': '44790', '충남 홍성군': '44800', '충남 예산군': '44810', '충남 태안군': '44825',

  // 전북 (전북특별자치도 52xxx)
  '전북 전주완산구': '52111', '전북 전주덕진구': '52113', '전북 군산시': '52130', '전북 익산시': '52140',
  '전북 정읍시': '52180', '전북 남원시': '52190', '전북 김제시': '52210', '전북 완주군': '52710',
  '전북 진안군': '52720', '전북 무주군': '52730', '전북 장수군': '52740', '전북 임실군': '52750',
  '전북 순창군': '52770', '전북 고창군': '52790', '전북 부안군': '52800',

  // 경북 (47xxx)
  '경북 포항북구': '47111', '경북 포항남구': '47113', '경북 경주시': '47130', '경북 김천시': '47150',
  '경북 안동시': '47170', '경북 구미시': '47190', '경북 영주시': '47210', '경북 영천시': '47230',
  '경북 상주시': '47250', '경북 문경시': '47280', '경북 경산시': '47290', '경북 의성군': '47730',
  '경북 청송군': '47750', '경북 영양군': '47760', '경북 영덕군': '47770', '경북 청도군': '47820',
  '경북 고령군': '47830', '경북 성주군': '47840', '경북 칠곡군': '47850', '경북 예천군': '47900',
  '경북 봉화군': '47920', '경북 울진군': '47930',

  // 경남 (48xxx)
  '경남 창원의창구': '48121', '경남 창원성산구': '48123', '경남 창원마산합포구': '48125',
  '경남 창원마산회원구': '48127', '경남 창원진해구': '48129', '경남 진주시': '48170',
  '경남 통영시': '48220', '경남 사천시': '48240', '경남 김해시': '48250', '경남 밀양시': '48270',
  '경남 거제시': '48310', '경남 양산시': '48330', '경남 의령군': '48720', '경남 함안군': '48730',
  '경남 창녕군': '48740', '경남 고성군': '48820', '경남 남해군': '48840', '경남 하동군': '48850',
  '경남 산청군': '48860', '경남 함양군': '48870', '경남 거창군': '48880', '경남 합천군': '48890',

  // 제주 (50xxx)
  '제주 제주시': '50110', '제주 서귀포시': '50130',
};

async function main() {
  console.log('========================================================================');
  console.log('🚀 [전국 국토교통부 실거래가 전수 수집 및 마스터 데이터 갱신]');
  console.log('========================================================================\n');

  const master = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
  console.log(`📦 전체 마스터 데이터: 총 ${master.length.toLocaleString()}개 단지`);

  // 수집할 기간: 최근 6개월 (202610 ~ 202605) + 202510, 202410 (과거 거래 보완)
  const months = ['202610', '202609', '202608', '202607', '202606', '202605', '202510', '202410'];
  console.log(`📅 수집 대상 월: ${months.join(', ')}`);

  // 고유 LAWD 코드 목록 추출
  const lawdToRegions = new Map(); // lawdCd -> Set of region strings
  for (const [reg, code] of Object.entries(REGION_TO_LAWD)) {
    if (!lawdToRegions.has(code)) lawdToRegions.set(code, new Set());
    lawdToRegions.get(code).add(reg);
  }
  const uniqueLawds = Array.from(lawdToRegions.keys());
  console.log(`📍 전수 수집 대상 시군구 코드: 총 ${uniqueLawds.length}개 지역\n`);

  // 지역별 수집된 거래 데이터
  const tradesByLawd = new Map(); // lawdCd -> RawTrade[]
  let totalTrades = 0;
  let batchIndex = 0;

  // 병렬 10개씩 배치 수집
  const BATCH_SIZE = 10;
  for (let i = 0; i < uniqueLawds.length; i += BATCH_SIZE) {
    const chunk = uniqueLawds.slice(i, i + BATCH_SIZE);
    await Promise.all(
      chunk.map(async (lawdCd) => {
        const lawdTrades = [];
        for (const ym of months) {
          const t = await fetchTradesForLawdMonth(lawdCd, ym);
          lawdTrades.push(...t);
        }
        tradesByLawd.set(lawdCd, lawdTrades);
        totalTrades += lawdTrades.length;
      })
    );
    batchIndex += chunk.length;
    process.stdout.write(`📡 [${batchIndex}/${uniqueLawds.length}] 시군구 실거래 수집 중... (누적: ${totalTrades.toLocaleString()}건)\r`);
  }

  console.log(`\n\n🎉 전국 실거래 전수 수집 완료! 총 ${totalTrades.toLocaleString()}건의 거래 확보\n`);

  // =========================================================================
  // 단지 매칭 및 실거래가 계산 (STRICT REGION MATCHING)
  // =========================================================================
  console.log('🔄 단지별 평형 분류 및 사용자 엄격 가격 산출 규칙 적용 중...');
  const ONE_MONTH_MS = 31 * 24 * 60 * 60 * 1000;

  let realUpdatedCount = 0;
  let dummyCleanedCount = 0;

  for (const apt of master) {
    const lawdCd = REGION_TO_LAWD[apt.region];
    const regionTrades = lawdCd ? (tradesByLawd.get(lawdCd) || []) : [];

    let matchedTrades = [];

    if (regionTrades.length > 0) {
      const aptNorm = normalizeAptName(apt.name);
      const cleanDist = apt.district ? apt.district.replace(/(동|읍|면|리)$/, '') : '';

      // 1) 단지명 정규화 일치
      matchedTrades = regionTrades.filter((t) => {
        if (t.normName === aptNorm) return true;
        // 읍면동 불일치 방지: 거래의 umdNm이 있다면 단지 district와 비교
        if (cleanDist && t.umdNm && !t.umdNm.includes(cleanDist) && !cleanDist.includes(t.umdNm)) {
          // 다른 동이면 이름이 특수하게 긴 경우(4글자 이상)만 허용
          if (aptNorm.length < 5) return false;
        }
        // 동 접두사 제거 매칭 (예: 수택금호어울림 vs 금호어울림)
        if (cleanDist && aptNorm.startsWith(cleanDist)) {
          const stripped = aptNorm.slice(cleanDist.length);
          if (stripped.length >= 2 && (t.normName === stripped || t.normName.includes(stripped))) {
            return true;
          }
        }
        // 거래명이 동 접두사를 가진 경우 (예: 수택동금호어울림 vs 수택금호어울림)
        if (cleanDist && t.normName.startsWith(cleanDist)) {
          const stripped = t.normName.slice(cleanDist.length);
          if (stripped.length >= 2 && (aptNorm === stripped || aptNorm.includes(stripped))) {
            return true;
          }
        }
        // 포함 관계 (단지명이 4글자 이상일 때만)
        if (aptNorm.length >= 4 && t.normName.length >= 4) {
          if (aptNorm.includes(t.normName) || t.normName.includes(aptNorm)) {
            return true;
          }
        }
        return false;
      });
    }

    if (matchedTrades.length > 0) {
      // 평형별 그룹화
      const pyeongMap = new Map();
      for (const t of matchedTrades) {
        const arr = pyeongMap.get(t.supplyPyeong) || [];
        arr.push(t);
        pyeongMap.set(t.supplyPyeong, arr);
      }

      // [사용자 핵심 규칙]
      // 1순위: 34평 (32~35평대)
      let selectedTrades = pyeongMap.get(34) || matchedTrades.filter((t) => t.supplyPyeong >= 32 && t.supplyPyeong <= 35);
      let selectedPyeong = 34;

      if (!selectedTrades || selectedTrades.length === 0) {
        // 2순위: 34평이 없다면 가장 비싼 금액의 평수와 그 가격!
        let maxPrice = -1;
        pyeongMap.forEach((trades, pNum) => {
          const highestInP = Math.max(...trades.map((t) => t.amount));
          if (highestInP > maxPrice) {
            maxPrice = highestInP;
            selectedTrades = trades;
            selectedPyeong = pNum;
          }
        });
      }

      if (selectedTrades && selectedTrades.length > 0) {
        // 최신순 정렬
        selectedTrades.sort((a, b) => b.dealTime - a.dealTime);
        const latest = selectedTrades[0];

        // 최근 1개월(31일) 이내 거래 필터
        const recent1Month = selectedTrades.filter((t) => latest.dealTime - t.dealTime <= ONE_MONTH_MS);

        let finalPrice = latest.amount;
        if (recent1Month.length >= 2) {
          // 최근 1개월 내 2건 이상 -> 평균가격
          finalPrice = Math.round(recent1Month.reduce((s, t) => s + t.amount, 0) / recent1Month.length);
        } else {
          // 1건이거나 1개월/1년 전 -> 마지막 거래가격 그대로
          finalPrice = latest.amount;
        }

        // [사용자 핵심 규칙]: 중간값 사용 절대 금지! price_min = price_max = finalPrice
        apt.price_min = finalPrice;
        apt.price_max = finalPrice;
        apt.area_pyeong = selectedPyeong;
        apt.area_sqm = Math.round(latest.excluUseAr);
        apt.isRealPrice = true;

        const jr = (apt.jeonseRatio && apt.jeonseRatio >= 40 && apt.jeonseRatio <= 85) ? apt.jeonseRatio : 60;
        apt.rent_min = Math.round(finalPrice * (jr / 100));
        apt.rent_max = Math.round(finalPrice * (jr / 100));
        apt.gapPrice = Math.max(0, Math.round(finalPrice * ((100 - jr) / 100)));

        realUpdatedCount++;
        continue;
      }
    }

    // [임시 추정 더미 삭제]
    // 실거래가 없는 단지는 가짜 추정치(12억, 13억 1626만, 1.10526 비율 등)를 0으로 리셋하여 삭제
    if (!apt.isRealPrice || apt.price_min >= 100000 && !apt.region.includes('서울')) {
      apt.price_min = 0;
      apt.price_max = 0;
      apt.rent_min = 0;
      apt.rent_max = 0;
      apt.gapPrice = 0;
      apt.isRealPrice = false;
      dummyCleanedCount++;
    }
  }

  console.log(`\n========================================================================`);
  console.log(`🎉 전국 전수 갱신 완료!`);
  console.log(`- 실제 국토부 실거래가 매칭 단지: ${realUpdatedCount.toLocaleString()}개`);
  console.log(`- 가짜 임시 추정 더미 삭제/정리 단지: ${dummyCleanedCount.toLocaleString()}개`);
  console.log(`========================================================================\n`);

  fs.writeFileSync(MASTER_PATH, JSON.stringify(master, null, 2), 'utf8');
  console.log(`💾 마스터 파일 저장 완료: ${MASTER_PATH}`);
}

main().catch(console.error);

