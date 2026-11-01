/**
 * 매칭 실패 아파트 진단 스크립트
 * 실거래 데이터와 실제로 비교해서 왜 매칭이 안 되는지 확인
 */
const fs = require('fs');
const path = require('path');

const MASTER_PATH = path.join(__dirname, '../src/lib/apartments-master.json');
const RAW_KEY = 'w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D';
const API_KEY = encodeURIComponent(decodeURIComponent(RAW_KEY));

const REGION_LAWD = {
  '서울 강남구': '11680',
  '경기 성남분당구': '41135',
  '광주 광산구': '29200',
  '광주 북구': '29170',
  '경기 화성동탄구': '41590',
  '전남 목포시': '46110',
  '경기 파주시': '41480',
  '전남 순천시': '46150',
};

function normalize(name) {
  if (!name) return '';
  return name
    .replace(/\s+/g, '')
    .replace(/아파트$/, '')
    .replace(/[()（）\[\]]/g, '')
    .replace(/[1-9]차$/, '')
    .replace(/블록$|블럭$|BL$/, '')
    .replace(/\d+블록$|\d+블럭$/, '')
    .toLowerCase();
}

async function fetchTrades(lawdCd, dealYm) {
  const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${API_KEY}&numOfRows=1000&pageNo=1&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYm}`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const xml = await res.text();
  const items = [];
  const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
  for (const item of itemMatches) {
    const get = (tag) => { const m = item.match(new RegExp(`<${tag}>([^<]*)</${tag}>`)); return m ? m[1].trim() : ''; };
    const cancelCheck = get('cdealType');
    if (cancelCheck && cancelCheck.trim() !== '' && cancelCheck.trim() !== '0') continue;
    items.push({ aptNm: get('aptNm'), dealAmount: get('dealAmount').replace(/,/g,''), excluUseAr: get('excluUseAr'), umdNm: get('umdNm') });
  }
  return items;
}

async function main() {
  const master = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
  const dummies = master.filter(a => !a.isRealPrice);
  console.log(`Remaining dummies: ${dummies.length}\n`);

  // 각 지역별로 샘플 진단
  for (const [region, lawdCd] of Object.entries(REGION_LAWD)) {
    const regionDummies = dummies.filter(a => a.region === region).slice(0, 5);
    if (regionDummies.length === 0) continue;

    const trades = await fetchTrades(lawdCd, '202410');
    const tradeNames = [...new Set(trades.map(t => t.aptNm))].sort();

    console.log(`\n=== ${region} (${lawdCd}) | API trades: ${trades.length}건 ===`);
    console.log('-- 매칭 실패 더미 아파트:');
    for (const apt of regionDummies) {
      const normName = normalize(apt.name);
      const matched = trades.filter(t => {
        const tn = normalize(t.aptNm);
        return tn === normName || tn.includes(normName) || normName.includes(tn);
      });
      console.log(`  [더미] "${apt.name}" → norm:"${normName}" → 매칭:${matched.length}건`);
      if (matched.length === 0 && tradeNames.length > 0) {
        // 비슷한 이름 찾기
        const similar = tradeNames.filter(tn => {
          const n = normalize(tn);
          return n.length > 2 && (n.includes(normName.substring(0,4)) || normName.includes(n.substring(0,4)));
        }).slice(0,3);
        if (similar.length > 0) console.log(`    → 비슷한 API 이름: ${similar.join(', ')}`);
      }
    }
  }
}

main().catch(console.error);

