const fs = require('fs');
const path = require('path');

const masterPath = path.join(__dirname, '../src/lib/apartments-master.json');
const data = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

console.log('총 단지 수:', data.length);

// 1. 위경도 범위 유효성 검사 (대한민국 영토 범위: 위도 33.0 ~ 38.6, 경도 124.6 ~ 131.9)
const outOfBounds = [];
const strangeCoords = [];

data.forEach(apt => {
  if (!apt.lat || !apt.lng || apt.lat < 33.0 || apt.lat > 38.6 || apt.lng < 124.6 || apt.lng > 131.9) {
    outOfBounds.push({ id: apt.id, name: apt.name, lat: apt.lat, lng: apt.lng });
  }

  // 서울/경기/인천인데 엉뚱한 좌표인 경우
  const r = apt.region || '';
  if (r.includes('서울') && (apt.lat < 37.4 || apt.lat > 37.75 || apt.lng < 126.75 || apt.lng > 127.25)) {
    strangeCoords.push({ id: apt.id, name: apt.name, region: r, lat: apt.lat, lng: apt.lng, reason: '서울 범위 이탈' });
  }
  if (r.includes('구리') && (apt.lat < 37.56 || apt.lat > 37.64 || apt.lng < 127.11 || apt.lng > 127.18)) {
    strangeCoords.push({ id: apt.id, name: apt.name, region: r, lat: apt.lat, lng: apt.lng, reason: '구리시 범위 이탈' });
  }
  if (r.includes('남양주') && (apt.lat < 37.54 || apt.lat > 37.82 || apt.lng < 127.08 || apt.lng > 127.42)) {
    strangeCoords.push({ id: apt.id, name: apt.name, region: r, lat: apt.lat, lng: apt.lng, reason: '남양주시 범위 이탈' });
  }
});

console.log(`❌ 대한민국 영토 범위 이탈 단지: ${outOfBounds.length}건`);
console.log(`⚠️ 시군구 경계 이상 이탈 단지: ${strangeCoords.length}건`);
strangeCoords.forEach(s => {
  console.log(`- [${s.reason}] ${s.name} (${s.region}) | lat: ${s.lat}, lng: ${s.lng}`);
});

