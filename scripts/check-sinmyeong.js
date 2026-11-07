const fs = require('fs');

const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) env[match[1]] = (match[2]||'').trim().replace(/^['"]|['"]$/g, '');
});

async function checkSinmyeong() {
  const apiKey = env.DATA_GO_KR_API_KEY || env.NEXT_PUBLIC_DATA_GO_KR_API_KEY;
  let cleanApiKey = apiKey.trim();
  try { cleanApiKey = decodeURIComponent(cleanApiKey); } catch {}
  const encodedKey = encodeURIComponent(cleanApiKey);
  
  // 구리시 LAWD_CD = 41310
  for (const ymd of ['202410', '202409', '202408', '202407', '202406']) {
    const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${encodedKey}&LAWD_CD=41310&DEAL_YMD=${ymd}&numOfRows=1000`;
    const res = await fetch(url);
    const text = await res.text();
    const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];
    
    const matched = items.filter(i => i.includes('신명'));
    if (matched.length > 0) {
      console.log(`[${ymd}] Total 신명 items: ${matched.length}`);
      matched.forEach(i => {
        const aptNm = i.match(/<aptNm>(.*?)<\/aptNm>/)?.[1];
        const umdNm = i.match(/<umdNm>(.*?)<\/umdNm>/)?.[1];
        const dealAmount = i.match(/<dealAmount>(.*?)<\/dealAmount>/)?.[1];
        const dealDay = i.match(/<dealDay>(.*?)<\/dealDay>/)?.[1];
        console.log(`  aptNm: "${aptNm}", umdNm: "${umdNm}", amount: ${dealAmount}, day: ${dealDay}`);
      });
    }
  }
}
checkSinmyeong();
