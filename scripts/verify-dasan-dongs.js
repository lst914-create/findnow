const fs = require('fs');
const path = require('path');

const masterPath = path.join(__dirname, '../src/lib/apartments-master.json');
const data = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

// 남양주 다산동 단지들 검사
const dasanApts = data.filter(a => a.district && a.district.includes('다산'));
console.log(`다산동 단지 수: ${dasanApts.length}개`);

// 다산신도시 정상 바운딩 박스:
// 진건지구 (다산역 북측): lat 37.605 ~ 37.625, lng 127.145 ~ 127.165
// 지금지구 (남측 한강변): lat 37.585 ~ 37.605, lng 127.155 ~ 127.185
const dasanErrors = dasanApts.filter(apt => {
  const isJingeon = apt.lat >= 37.605 && apt.lat <= 37.635 && apt.lng >= 127.140 && apt.lng <= 127.170;
  const isJigeum = apt.lat >= 37.580 && apt.lat <= 37.605 && apt.lng >= 127.150 && apt.lng <= 127.190;
  return !isJingeon && !isJigeum;
});

console.log(`다산동 경계 이상 이탈 단지: ${dasanErrors.length}건`);
dasanErrors.forEach(err => {
  console.log(`🚨 [다산동 이탈] ${err.name} | lat: ${err.lat}, lng: ${err.lng}`);
});

