const fs = require('fs');

const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) env[match[1]] = (match[2]||'').trim().replace(/^['"]|['"]$/g, '');
});

async function run() {
  const apiKey = env.DATA_GO_KR_API_KEY || env.NEXT_PUBLIC_DATA_GO_KR_API_KEY;
  let cleanApiKey = apiKey.trim();
  try { cleanApiKey = decodeURIComponent(cleanApiKey); } catch {}
  const encodedKey = encodeURIComponent(cleanApiKey);
  
  const lawdCode = '41360'; // 남양주시
  const aptMap = new Map(); // aptNm -> { umdNm, count, latestAmount }

  for (const ymd of ['202410', '202409', '202408', '202407', '202406', '202405', '202404', '202403', '202402', '202401']) {
    const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${encodedKey}&LAWD_CD=${lawdCode}&DEAL_YMD=${ymd}&numOfRows=1000`;
    try {
      const res = await fetch(url);
      const text = await res.text();
      const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];
      for (const item of items) {
        const aptNm = item.match(/<aptNm>(.*?)<\/aptNm>/)?.[1];
        const umdNm = item.match(/<umdNm>(.*?)<\/umdNm>/)?.[1];
        const dealAmount = item.match(/<dealAmount>(.*?)<\/dealAmount>/)?.[1];
        if (aptNm && umdNm) {
          const key = `${umdNm}_${aptNm}`;
          if (!aptMap.has(key)) {
            aptMap.set(key, { aptNm, umdNm, latestAmount: dealAmount });
          }
        }
      }
    } catch (e) {}
  }

  console.log(`남양주시 10개월간 실거래 신고된 고유 아파트 단지 수: ${aptMap.size}개`);
  
  // 우리 기존 master DB와 대조
  const master = JSON.parse(fs.readFileSync('src/lib/apartments-master.json', 'utf8'));
  const masterNames = new Set(master.filter(a => a.region.includes('남양주')).map(a => a.name));
  
  let missingCount = 0;
  console.log('\n[누락된 아파트 샘플]');
  for (const [k, v] of aptMap.entries()) {
    const hasInMaster = Array.from(masterNames).some(m => m.includes(v.aptNm) || v.aptNm.includes(m.replace(/아파트$/, '')));
    if (!hasInMaster) {
      missingCount++;
      if (missingCount <= 15) {
        console.log(`- [${v.umdNm}] ${v.aptNm} (최근 거래가: ${v.latestAmount}만원)`);
      }
    }
  }
  console.log(`남양주시에서만 기존 DB에 없는 누락 아파트: 총 ${missingCount}개!`);
}

run();
