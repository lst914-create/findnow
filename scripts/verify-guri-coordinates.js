const fs = require('fs');
const path = require('path');

const apiKey = '4d7cd3190ca38a795008ebd7cc053820';
const masterPath = path.join(__dirname, '../src/lib/apartments-master.json');
const data = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

// 거리 계산 (미터 단위)
function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 구리시 및 남양주시 단지 필터링
const guriApts = data.filter(a => a.region && (a.region.includes('구리') || a.region.includes('남양주')));
console.log(`구리/남양주 단지 수: ${guriApts.length}개`);

async function verifyApt(apt) {
  // 카카오 검색어로 시도할 후보들
  const queries = [
    apt.name,
    apt.name.replace(/아파트$/, ''),
    `${apt.district || ''} ${apt.name}`.trim(),
    apt.name.replace(/토평검배마을/, '토평'),
    apt.name.replace(/토평검배마을SK신일/, 'SK신일아파트'),
  ];

  for (const q of queries) {
    try {
      const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(q)}&category_group_code=APT`;
      const res = await fetch(url, { headers: { Authorization: `KakaoAK ${apiKey}` } });
      if (!res.ok) continue;
      const json = await res.json();
      if (json.documents && json.documents.length > 0) {
        // 동일 시군구 일치 확인
        const doc = json.documents.find(d => d.address_name.includes(apt.district || '') || d.place_name.includes(apt.name.slice(0, 3))) || json.documents[0];
        const realLat = parseFloat(doc.y);
        const realLng = parseFloat(doc.x);
        const dist = getDistanceMeters(apt.lat, apt.lng, realLat, realLng);
        if (dist > 300) { // 300m 이상 차이나면 오류!
          return {
            id: apt.id,
            name: apt.name,
            current: { lat: apt.lat, lng: apt.lng },
            real: { lat: realLat, lng: realLng, place: doc.place_name, address: doc.address_name },
            diffMeters: Math.round(dist)
          };
        }
        return null;
      }
    } catch (e) {}
  }
  return null;
}

async function run() {
  console.log('구리시 단지 좌표 오차 전수 검증 시작...');
  const guriOnly = guriApts.filter(a => a.region.includes('구리'));
  for (const apt of guriOnly) {
    const error = await verifyApt(apt);
    if (error) {
      console.log(`🚨 [위치 오류 발견] ${error.name} (오차: ${error.diffMeters}m)`);
      console.log(`   현재: lat ${error.current.lat}, lng ${error.current.lng}`);
      console.log(`   실제: lat ${error.real.lat}, lng ${error.real.lng} (${error.real.place}, ${error.real.address})`);
    }
  }
}

run();

