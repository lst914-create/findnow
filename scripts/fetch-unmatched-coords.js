const fs = require('fs');
const path = require('path');

const summaryList = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'unmatched-summary.json'), 'utf8'));

// 캐시 파일이 있으면 불러오기
const cachePath = path.resolve(__dirname, 'extra-dong-coordinates.json');
let cache = {};
if (fs.existsSync(cachePath)) {
  try {
    cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
  } catch (e) {}
}

function cleanQuery(key) {
  let [reg, dist] = key.split('__');
  // 괄호 제거
  dist = dist.replace(/\(.*\)/, '').trim();
  // 정규화된 시/도
  reg = reg.replace(/^경기\s*/, '경기도 ').replace(/^서울\s*/, '서울특별시 ').replace(/^인천\s*/, '인천광역시 ');
  return `${reg} ${dist}`.trim();
}

async function fetchCoord(query) {
  // 1차 Nominatim
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'ChajwoGeoCodingFix/1.0 (contact: info@chajwo.kr)' }
    });
    const data = await res.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(parseFloat(data[0].lat).toFixed(6)),
        lng: parseFloat(parseFloat(data[0].lon).toFixed(6))
      };
    }
  } catch (e) {
    // ignore
  }

  // 검색 실패 시 동 이름만으로 재시도 (예: '용인시 양지읍 양지리' 등)
  const parts = query.split(' ');
  if (parts.length > 2) {
    const simplified = parts[1] + ' ' + parts[parts.length - 1];
    const url2 = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(simplified)}&format=json&limit=1`;
    try {
      const res = await fetch(url2, {
        headers: { 'User-Agent': 'ChajwoGeoCodingFix/1.0 (contact: info@chajwo.kr)' }
      });
      const data = await res.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(parseFloat(data[0].lat).toFixed(6)),
          lng: parseFloat(parseFloat(data[0].lon).toFixed(6))
        };
      }
    } catch (e) {}
  }

  return null;
}

async function main() {
  console.log(`총 ${summaryList.length}개 대상 지오코딩 시작...`);
  let success = 0;
  let fail = 0;

  for (let i = 0; i < summaryList.length; i++) {
    const [rawKey, count] = summaryList[i];
    if (cache[rawKey]) {
      success++;
      continue;
    }

    const query = cleanQuery(rawKey);
    process.stdout.write(`[${i + 1}/${summaryList.length}] ${rawKey} (${query})... `);
    const coord = await fetchCoord(query);

    if (coord) {
      cache[rawKey] = coord;
      console.log(`성공 (${coord.lat}, ${coord.lng})`);
      success++;
    } else {
      console.log(`❌ 실패`);
      fail++;
    }

    // 중간 저장
    if (i % 5 === 0) {
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
    }

    // Rate limit 준수 (400ms)
    await new Promise(r => setTimeout(r, 400));
  }

  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
  console.log(`\n완료! 성공: ${success}, 실패: ${fail}`);
}

main().catch(console.error);
