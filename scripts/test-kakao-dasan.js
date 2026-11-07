const fs = require('fs');
const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) env[match[1]] = (match[2]||'').trim().replace(/^['"]|['"]$/g, '');
});

const KAKAO_KEY = env.KAKAO_REST_API_KEY || '4d7cd3190ca38a795008ebd7cc053820';

async function testDasan() {
  const query = '남양주시 다산동 아파트';
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=15&page=1`;
  const res = await fetch(url, { headers: { Authorization: `KakaoAK ${KAKAO_KEY}` } });
  const json = await res.json();
  console.log('Total count:', json.meta?.total_count);
  json.documents.forEach(d => {
    console.log(d.place_name, '|', d.category_name, '|', d.address_name);
  });
}
testDasan();
