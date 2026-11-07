const fs = require('fs');
const list = JSON.parse(fs.readFileSync('./src/lib/apartments-master.json', 'utf8'));

console.log('Total apartments before audit:', list.length);

function getDistM(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function getDistKm(lat1, lng1, lat2, lng2) {
  return getDistM(lat1, lng1, lat2, lng2) / 1000;
}

// 1. 관리기구 및 비주거 시설 패턴
const badFacilityRegex = /(제\d*관리사무소|관리사무소|입주자대표회의|커뮤니티센터|노인정|경로당|주차장|지하주차장|경비실|경비소|재건축아파트\s*예정|재건축예정)/;

const toRemoveIds = new Set();
const removedReasons = {};

function markRemove(id, reason, apt) {
  toRemoveIds.add(id);
  if (!removedReasons[reason]) removedReasons[reason] = [];
  removedReasons[reason].push(apt);
}

// 1단계: 비주거 시설 검사
list.forEach(a => {
  if (badFacilityRegex.test(a.name)) {
    markRemove(a.id, '비주거시설/관리기구/재건축예정', a);
  }
});

// 2단계: 좌표가 없거나 대한민국 범위를 벗어난 이상치
list.forEach(a => {
  if (toRemoveIds.has(a.id)) return;
  if (!a.lat || !a.lng || a.lat < 33.0 || a.lat > 38.8 || a.lng < 125.0 || a.lng > 131.5) {
    markRemove(a.id, '좌표결측_또는_한반도범위이탈', a);
  }
});

// 3단계: 시군구 중심 대비 30km 이상 극단적 오좌표 단지 (도서지역 제외)
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
  };
});

list.forEach(a => {
  if (toRemoveIds.has(a.id)) return;
  if (!a.lat || !a.lng || !a.region) return;
  const center = sigunguCenters[a.region.trim()];
  if (!center) return;
  const distKm = getDistKm(center.lat, center.lng, a.lat, a.lng);

  // 대도시(서울, 인천, 경기 시지역, 부산 등)에서 25km 이상 떨어졌거나, 타도/원거리(40km 이상)에 찍힌 오좌표
  if (distKm > 40 && !a.region.includes('강원') && !a.region.includes('경북') && !a.region.includes('전남')) {
    markRemove(a.id, `극단적오좌표_${Math.round(distKm)}km이탈`, a);
  }
});

// 4단계: K-apt 공식 단지와 150m 이내 중복되는 kakao POI 단지
const kaptApts = list.filter(a => a.id.startsWith('kapt-') && !toRemoveIds.has(a.id));
const kakaoApts = list.filter(a => a.id.startsWith('kakao-') && !toRemoveIds.has(a.id));

// 공간 그리드로 빠른 검색 (0.002도 ≈ 220m)
const grid = new Map();
kaptApts.forEach(p => {
  const gx = Math.floor(p.lat * 500);
  const gy = Math.floor(p.lng * 500);
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const key = `${gx + dx},${gy + dy}`;
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push(p);
    }
  }
});

kakaoApts.forEach(k => {
  if (toRemoveIds.has(k.id)) return;
  const gx = Math.floor(k.lat * 500);
  const gy = Math.floor(k.lng * 500);
  const key = `${gx},${gy}`;
  const candidates = grid.get(key) || [];

  const cleanKName = k.name.replace(/아파트|단지|마을|\s+/g, '');

  for (const p of candidates) {
    const dist = getDistM(k.lat, k.lng, p.lat, p.lng);
    if (dist < 120) {
      const cleanPName = p.name.replace(/아파트|단지|마을|\s+/g, '');
      if (
        cleanKName === cleanPName ||
        (cleanKName.length >= 3 && cleanPName.includes(cleanKName)) ||
        (cleanPName.length >= 3 && cleanKName.includes(cleanPName))
      ) {
        markRemove(k.id, `kapt단지_초근접중복_${p.name}`, k);
        break;
      }
    }
  }
});

console.log('=== 클렌징 대상 유령/중복 단지 통계 ===');
let totalToRemove = 0;
for (const [reason, items] of Object.entries(removedReasons)) {
  console.log(`- [${reason}]: ${items.length}개`);
  totalToRemove += items.length;
}
console.log(`총 삭제 대상: ${totalToRemove}개 (전체 ${list.length}개 중)`);

