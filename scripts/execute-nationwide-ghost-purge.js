const fs = require('fs');
const path = require('path');

const masterPath = path.resolve(__dirname, '../src/lib/apartments-master.json');
const list = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

console.log('==================================================================');
console.log('🧹 [전국 아파트 데이터베이스 유령 단지/중복/오좌표/시세왜곡 전수 클렌징]');
console.log('==================================================================');
console.log(`기존 총 단지 수: ${list.length.toLocaleString()}개`);

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

const toRemoveIds = new Set();
const removedAuditLog = [];

function markRemove(apt, category, reason) {
  if (toRemoveIds.has(apt.id)) return;
  toRemoveIds.add(apt.id);
  removedAuditLog.push({
    id: apt.id,
    name: apt.name,
    region: apt.region,
    district: apt.district,
    category,
    reason,
  });
}

// ── 1. 비주거 시설 / 관리기구 / 재건축예정 유령 단지 ──
const badFacilityRegex = /(제\d*관리사무소|관리사무소|입주자대표회의|커뮤니티센터|노인정|경로당|주차장|지하주차장|경비실|경비소|재건축아파트\s*예정|재건축예정)/;
list.forEach(a => {
  if (badFacilityRegex.test(a.name)) {
    markRemove(a, '비주거시설_관리기구', `단지명에 비주거 시설 표기: ${a.name}`);
  }
});

// ── 2. 좌표 결측 및 대한민국 범위 밖 이상치 ──
list.forEach(a => {
  if (toRemoveIds.has(a.id)) return;
  if (!a.lat || !a.lng || a.lat < 33.0 || a.lat > 38.8 || a.lng < 125.0 || a.lng > 131.5) {
    markRemove(a, '좌표이탈', `대한민국 범위 외 좌표 (${a.lat}, ${a.lng})`);
  }
});

// ── 3. 소속 시군구 중심 대비 40km 이상 극단적 오좌표 단지 ──
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

  // 대도시/시지역에서 40km 이상 동떨어진 오좌표
  if (distKm > 40 && !a.region.includes('강원') && !a.region.includes('경북') && !a.region.includes('전남')) {
    markRemove(a, '극단적오좌표', `소속 시군구 중심에서 ${Math.round(distKm)}km 이탈 (${a.lat}, ${a.lng})`);
  }
});

// ── 4. K-apt 공식 단지와 동일 위치(120m 이내) 카카오 POI 중복 단지 ──
const kaptApts = list.filter(a => a.id.startsWith('kapt-') && !toRemoveIds.has(a.id));
const kakaoApts = list.filter(a => a.id.startsWith('kakao-') && !toRemoveIds.has(a.id));

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
        markRemove(k, '초근접_카카오중복', `공식 단지(${p.name}, ${p.id})와 ${Math.round(dist)}m 중복`);
        break;
      }
    }
  }
});

console.log(`\n총 영구 삭제 대상 유령/중복 단지: ${toRemoveIds.size}개`);

// ── 5. 유령 단지 삭제 실행 ──
const cleanedList = list.filter(a => !toRemoveIds.has(a.id));
console.log(`삭제 후 잔여 정상 단지 수: ${cleanedList.length.toLocaleString()}개`);

// ── 6. 동명이인(단지명 충돌)으로 인한 타지역 초고가 실거래가 왜곡 단지 정상화 ──
// 동별 중간값 재계산
const dongPrices = {};
cleanedList.forEach(a => {
  if (!a.region || !a.district || !a.price_max) return;
  const key = `${a.region}_${a.district}`;
  if (!dongPrices[key]) dongPrices[key] = [];
  dongPrices[key].push(a.price_max);
});

const dongMedians = {};
Object.keys(dongPrices).forEach(k => {
  const arr = dongPrices[k].sort((a,b) => a-b);
  dongMedians[k] = arr[Math.floor(arr.length / 2)];
});

let priceFixedCount = 0;
cleanedList.forEach(a => {
  if (!a.region || !a.district || !a.price_max) return;
  const key = `${a.region}_${a.district}`;
  const median = dongMedians[key];
  if (!median || median < 10000) return;

  // 강남/서초/용산/송파 등 펜트하우스 밀집지 제외
  if (/강남|서초|용산|송파|성동/.test(a.region)) return;

  // 동 중간값 대비 3.5배 이상 비정상 시세 왜곡 단지 보정
  if (a.price_max > median * 3.5 && a.price_max >= 100000) {
    const originalMax = a.price_max;
    // 해당 동의 상위 80% 수준(중간값 * 1.35)으로 현실적 보정
    const correctedPrice = Math.round(median * 1.35);
    a.price_max = correctedPrice;
    a.price_min = Math.round(correctedPrice * 0.9);
    a.rent_max = Math.round(correctedPrice * 0.65);
    a.rent_min = Math.round(correctedPrice * 0.58);
    a.gapPrice = a.price_max - a.rent_max;
    priceFixedCount++;
    console.log(`🔧 [시세 정상화] ${a.id} ${a.name} (${a.region} ${a.district}): ${originalMax}만원 -> ${correctedPrice}만원 (동 중간값: ${median}만원)`);
  }
});

console.log(`\n✅ 타지역 고가 매핑 왜곡 시세 정상화 완료: ${priceFixedCount}개 단지`);

// 파일 저장
fs.writeFileSync(masterPath, JSON.stringify(cleanedList, null, 2), 'utf8');
console.log(`💾 apartments-master.json 최신화 완료!`);

// 감사 로그 요약 출력
const summaryByCategory = {};
removedAuditLog.forEach(l => {
  summaryByCategory[l.category] = (summaryByCategory[l.category] || 0) + 1;
});
console.log('\n=== 삭제 사유별 요약 ===');
for (const [cat, count] of Object.entries(summaryByCategory)) {
  console.log(`- ${cat}: ${count}개`);
}

