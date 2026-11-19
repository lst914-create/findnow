const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/PC/Desktop/streamlit-detail-page/chajwo';
const MASTER_PATH = path.join(ROOT, 'src/lib/apartments-master.json');
const CACHE_PATH = path.join(ROOT, 'src/lib/transactionsCache.ts');
const API_KEY = 'w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D';

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
  console.log('=== 신축/주요 단지 공식 실거래(매매+입주권) 0초 즉시 프리셋 캐시 구축 ===');

  const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));

  // 즉시 캐시 구축 대상 주요 신축/입주권 및 핵심 단지
  const targetApts = [
    { id: 'kapt-A10020230', name: '잠실르엘', lawd: '11710', umd: '신천동', isPresale: true },
    { id: 'kapt-A10020294', name: '잠실래미안아이파크', lawd: '11710', umd: '신천동', isPresale: true },
    { id: 'kakao-11322897', name: '대치풍림아이원1차아파트', lawd: '11680', umd: '대치동', isPresale: false },
    { id: 'kakao-11349664', name: '대치풍림아이원2차아파트', lawd: '11680', umd: '대치동', isPresale: false },
    { id: 'kapt-A10025596', name: '다산한강반도유보라', lawd: '41360', umd: '다산동', isPresale: false },
    { id: 'kapt-A13822003', name: '잠실리센츠', lawd: '11710', umd: '잠실동', isPresale: false },
    { id: 'kapt-A13803001', name: '잠실엘스', lawd: '11710', umd: '잠실동', isPresale: false },
    { id: 'kapt-A13808001', name: '트리지움', lawd: '11710', umd: '잠실동', isPresale: false },
    { id: 'kapt-A13809001', name: '레이크팰리스', lawd: '11710', umd: '잠실동', isPresale: false },
    { id: 'kapt-A13875301', name: '파크리오', lawd: '11710', umd: '신천동', isPresale: false },
    { id: 'kapt-A10025983', name: '디에이치방배', lawd: '11650', umd: '방배동', isPresale: true },
    { id: 'kapt-A10025984', name: '청담르엘', lawd: '11680', umd: '청담동', isPresale: true },
    { id: 'kapt-A10025985', name: '디에이치 대치 에델루이아파트', lawd: '11680', umd: '대치동', isPresale: true },
  ];

  const months = [
    '202611','202610','202609','202608','202607','202606','202605','202604','202603','202602','202601',
    '202512','202511','202510','202509','202508','202507','202506','202505','202504','202503','202502','202501'
  ];

  const presetTrades = {};

  for (const target of targetApts) {
    console.log(`수집 중: [${target.id}] ${target.name} (${target.umd})...`);
    const aptTrades = [];

    for (const ym of months) {
      // 일반 매매 조회
      const tradeUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${API_KEY}&LAWD_CD=${target.lawd}&DEAL_YMD=${ym}&numOfRows=1000`;
      const xmlTrade = await fetchXml(tradeUrl);

      const parseAndPush = (xml, isRight = false) => {
        if (!xml) return;
        const items = parseItems(xml);
        for (const it of items) {
          const cancel = getVal(it, 'cdealType') || getVal(it, 'cancelDealType');
          if (cancel && cancel !== '' && cancel !== '0') continue;

          const aptNm = getVal(it, 'aptNm');
          const umdNm = getVal(it, 'umdNm').trim();
          const cleanT = target.name.replace(/\s+/g, '').replace(/아파트/g, '');
          const cleanA = aptNm.replace(/\s+/g, '').replace(/아파트/g, '');

          if (umdNm.includes(target.umd) && (cleanA.includes(cleanT) || cleanT.includes(cleanA))) {
            const amtStr = getVal(it, 'dealAmount').replace(/,/g, '');
            const dealAmount = parseInt(amtStr, 10);
            const excluUseAr = parseFloat(getVal(it, 'excluUseAr')) || 84;
            const floor = parseInt(getVal(it, 'floor') || '1', 10);
            const dealYear = parseInt(getVal(it, 'dealYear'), 10);
            const dealMonth = parseInt(getVal(it, 'dealMonth'), 10);
            const dealDay = parseInt(getVal(it, 'dealDay') || '1', 10);
            const buildYear = parseInt(getVal(it, 'buildYear') || '2020', 10);

            if (dealAmount > 0) {
              aptTrades.push({
                aptName: aptNm,
                dealAmount,
                dealYear,
                dealMonth,
                dealDay,
                excluUseAr,
                floor,
                buildYear,
                umdNm,
                isRight
              });
            }
          }
        }
      };

      parseAndPush(xmlTrade, false);

      // 입주권/분양권 조회 (신축 단지이거나 거래가 적은 경우)
      if (target.isPresale) {
        const silvUrl = `https://apis.data.go.kr/1613000/RTMSDataSvcSilvTrade/getRTMSDataSvcSilvTrade?serviceKey=${API_KEY}&LAWD_CD=${target.lawd}&DEAL_YMD=${ym}&numOfRows=1000`;
        const xmlSilv = await fetchXml(silvUrl);
        parseAndPush(xmlSilv, true);
      }

      await sleep(100);
    }

    // 최신 거래일 순 정렬
    aptTrades.sort((a, b) => (b.dealYear*10000 + b.dealMonth*100 + b.dealDay) - (a.dealYear*10000 + a.dealMonth*100 + a.dealDay));
    presetTrades[target.id] = aptTrades;
    console.log(`  -> 수집 완료: ${aptTrades.length}건 거래 적재 완료!`);
  }

  // transactionsCache.ts 소스코드 생성
  const cacheSource = `/**
 * 국토교통부 공식 실거래가(매매 + 입주권) 0초 즉시 사전 캐시 모듈
 * - 사용자의 첫 상세페이지 진입 시 5초 딜레이를 0ms로 원천 차단하고 0초 즉시 렌더링
 * - 국토교통부 공공데이터포털 공식 API에서 수집된 실제 거래 내역만 적재
 */

export interface CachedTrade {
  aptName: string;
  dealAmount: number; // 만원
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  excluUseAr: number;
  floor: number;
  buildYear: number;
  umdNm: string;
  isRight?: boolean;
}

export interface CachedRent {
  aptName: string;
  depositAmount: number; // 만원
  monthlyRent: number;
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  excluUseAr: number;
  floor: number;
  buildYear: number;
  umdNm: string;
}

// 공식 실거래가 프리셋 캐시 (주요 단지 0초 즉시 반환)
const PRESET_TRADES: Record<string, CachedTrade[]> = ${JSON.stringify(presetTrades, null, 2)};
const PRESET_RENTS: Record<string, CachedRent[]> = {};

/**
 * 사전 캐시된 확정 거래 조회 함수
 * - 공식 API 데이터 기반 0ms 즉시 반환
 */
export function getPreloadedTransactions(apt: any): { trades: CachedTrade[]; rents: CachedRent[]; isPreset: boolean } {
  if (!apt || !apt.name) return { trades: [], rents: [], isPreset: false };

  // 1. 단지 ID 기반 캐시 확인
  if (apt.id && PRESET_TRADES[apt.id] && PRESET_TRADES[apt.id].length > 0) {
    return {
      trades: PRESET_TRADES[apt.id],
      rents: PRESET_RENTS[apt.id] || [],
      isPreset: true,
    };
  }

  // 2. 단지명 기반 폴백 캐시 확인
  for (const [k, v] of Object.entries(PRESET_TRADES)) {
    if (v.length > 0 && v[0].aptName.replace(/\\s+/g, '') === apt.name.replace(/\\s+/g, '')) {
      return {
        trades: v,
        rents: PRESET_RENTS[k] || [],
        isPreset: true,
      };
    }
  }

  return { trades: [], rents: [], isPreset: false };
}
`;

  fs.writeFileSync(CACHE_PATH, cacheSource, 'utf8');
  console.log('src/lib/transactionsCache.ts 생성 완료!');
}

main().catch(console.error);
