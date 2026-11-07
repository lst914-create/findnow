const fs = require('fs');

const env = {};
fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) env[match[1]] = (match[2]||'').trim().replace(/^['"]|['"]$/g, '');
});

const KAKAO_KEY = env.KAKAO_REST_API_KEY || env.NEXT_PUBLIC_KAKAO_REST_KEY || '4d7cd3190ca38a795008ebd7cc053820';

async function testKakaoSearch() {
  const query = '다산동 아파트';
  const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=15&page=1`;
  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${KAKAO_KEY}` }
  });
  const data = await res.json();
  console.log(`Kakao search '${query}' total:`, data.meta?.total_count);
  if (data.documents) {
    data.documents.slice(0, 5).forEach(d => {
      console.log(`- [${d.place_name}] ${d.address_name} (${d.y}, ${d.x})`);
    });
  }
}

testKakaoSearch();
