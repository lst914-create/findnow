const fs = require('fs');

const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) env[match[1]] = (match[2]||'').trim().replace(/^['"]|['"]$/g, '');
});

async function run() {
  const apiKey = env.DATA_GO_KR_API_KEY || env.NEXT_PUBLIC_DATA_GO_KR_API_KEY;
  let cleanApiKey = apiKey.trim();
  try {
    cleanApiKey = decodeURIComponent(cleanApiKey);
  } catch {}
  const encodedKey = encodeURIComponent(cleanApiKey);
  const lawdCode = '41360'; // 남양주
  const dealYmd = '202410'; // 2024년 10월
  const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${encodedKey}&LAWD_CD=${lawdCode}&DEAL_YMD=${dealYmd}&numOfRows=1000`;
  const res = await fetch(url);
  const text = await res.text();
  console.log('API Status:', res.status, 'Length:', text.length);
  const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];
  console.log('Total items in 202410:', items.length);
  const matched = items.filter(i => i.includes('반도유보라') || i.includes('금강펜테리움'));
  console.log('Matched items count:', matched.length);
  matched.slice(0, 5).forEach(i => {
    const aptNm = i.match(/<aptNm>(.*?)<\/aptNm>/)?.[1];
    const dealAmount = i.match(/<dealAmount>(.*?)<\/dealAmount>/)?.[1];
    const floor = i.match(/<floor>(.*?)<\/floor>/)?.[1];
    const day = i.match(/<dealDay>(.*?)<\/dealDay>/)?.[1];
    console.log(aptNm, dealAmount, floor + '층', day + '일');
  });
}
run();

