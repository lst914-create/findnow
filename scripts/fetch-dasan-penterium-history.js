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
  
  for (const ymd of ['202410', '202409', '202408', '202407', '202406', '202405', '202404', '202403', '202402', '202401']) {
    const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${encodedKey}&LAWD_CD=41360&DEAL_YMD=${ymd}&numOfRows=1000`;
    const res = await fetch(url);
    const text = await res.text();
    const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];
    const matched = items.filter(i => i.includes('펜테리움') || i.includes('리버테라스'));
    matched.forEach(i => {
      const aptNm = i.match(/<aptNm>(.*?)<\/aptNm>/)?.[1];
      const dealAmount = i.match(/<dealAmount>(.*?)<\/dealAmount>/)?.[1];
      const floor = i.match(/<floor>(.*?)<\/floor>/)?.[1];
      const day = i.match(/<dealDay>(.*?)<\/dealDay>/)?.[1];
      const exclu = i.match(/<excluUseAr>(.*?)<\/excluUseAr>/)?.[1];
      const umd = i.match(/<umdNm>(.*?)<\/umdNm>/)?.[1];
      if (umd === '다산동') {
        console.log(ymd, aptNm, dealAmount + '만원', exclu + '㎡', floor + '층', day + '일');
      }
    });
  }
}
run();

