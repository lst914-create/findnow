const fs = require('fs');
const path = require('path');

const masterPath = path.join(__dirname, '../src/lib/apartments-master.json');
const data = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

// 구리시 단지 전체
const guriApts = data.filter(a => a.region && a.region.includes('구리'));
console.log(`구리시 단지 수: ${guriApts.length}개`);

// 구리시 법정동별 실제 정상 위경도 바운딩 박스
const GURI_DONGS = {
  '갈매동': { minLat: 37.625, maxLat: 37.655, minLng: 127.105, maxLng: 127.135 },
  '인창동': { minLat: 37.595, maxLat: 37.625, minLng: 127.125, maxLng: 127.155 },
  '교문동': { minLat: 37.585, maxLat: 37.610, minLng: 127.125, maxLng: 127.155 },
  '수택동': { minLat: 37.585, maxLat: 37.605, minLng: 127.135, maxLng: 127.155 },
  '토평동': { minLat: 37.582, maxLat: 37.598, minLng: 127.140, maxLng: 127.158 },
  '아천동': { minLat: 37.560, maxLat: 37.585, minLng: 127.105, maxLng: 127.140 },
};

const dongErrors = [];
guriApts.forEach(apt => {
  const d = apt.district || '';
  const box = GURI_DONGS[d];
  if (box) {
    if (apt.lat < box.minLat || apt.lat > box.maxLat || apt.lng < box.minLng || apt.lng > box.maxLng) {
      dongErrors.push({ id: apt.id, name: apt.name, district: d, lat: apt.lat, lng: apt.lng });
    }
  }
});

console.log(`구리시 법정동 경계 불일치 단지: ${dongErrors.length}건`);
dongErrors.forEach(err => {
  console.log(`🚨 [법정동 이탈] ${err.name} (${err.district}) | lat: ${err.lat}, lng: ${err.lng}`);
});

