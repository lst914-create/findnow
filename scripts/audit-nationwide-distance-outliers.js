const fs = require('fs');
const list = JSON.parse(fs.readFileSync('./src/lib/apartments-master.json', 'utf8'));

function getDistKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

// 각 시군구별 평균 중심 좌표 구하기
const sigunguGroups = {};
list.forEach(a => {
  if (!a.lat || !a.lng || !a.region) return;
  const key = a.region.trim();
  if (!sigunguGroups[key]) sigunguGroups[key] = [];
  sigunguGroups[key].push({ lat: a.lat, lng: a.lng });
});

const sigunguCenters = {};
Object.keys(sigunguGroups).forEach(k => {
  const arr = sigunguGroups[k];
  const lats = arr.map(x => x.lat).sort((a,b) => a-b);
  const lngs = arr.map(x => x.lng).sort((a,b) => a-b);
  sigunguCenters[k] = {
    lat: lats[Math.floor(lats.length / 2)],
    lng: lngs[Math.floor(lngs.length / 2)],
    count: arr.length
  };
});

// 시군구 중심에서 현저히 벗어난 이상치 단지 적발
const outliers = [];
list.forEach(a => {
  if (!a.lat || !a.lng || !a.region) return;
  const center = sigunguCenters[a.region.trim()];
  if (!center) return;
  const dist = getDistKm(center.lat, center.lng, a.lat, a.lng);
  
  // 서울/대도시 시군구는 반경 12km 초과 시 오좌표
  let threshold = 25;
  if (a.region.includes('서울') || a.region.includes('부산') || a.region.includes('대구') || a.region.includes('인천')) {
    threshold = 12;
  } else if (a.region.includes('강원') || a.region.includes('경북') || a.region.includes('전남')) {
    threshold = 45;
  }
  
  if (dist > threshold) {
    outliers.push({ apt: a, distKm: Math.round(dist), center });
  }
});

console.log('Total extreme distance outliers:', outliers.length);
outliers.forEach(o => {
  console.log(`[${o.distKm}km 오차] ${o.apt.id} | ${o.apt.name} | ${o.apt.region} ${o.apt.district || ''} | coords: (${o.apt.lat}, ${o.apt.lng})`);
});

