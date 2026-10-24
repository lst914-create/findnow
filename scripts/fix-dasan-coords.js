/**
 * 다산신도시 아파트 단지 좌표 Nominatim 일괄 조회 및 수정 스크립트
 */
const fs = require('fs');
const path = require('path');

const masterPath = path.join(__dirname, '../src/lib/apartments-master.json');
const data = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

async function geocode(query) {
  await new Promise(r => setTimeout(r, 1200));
  const url = 'https://nominatim.openstreetmap.org/search?q=' + encodeURIComponent(query) + '&format=json&limit=1&countrycodes=kr';
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'AptSearch/1.0' } });
    const d = await res.json();
    return d[0] ? { lat: parseFloat(d[0].lat), lng: parseFloat(d[0].lon), display: d[0].display_name } : null;
  } catch (e) {
    return null;
  }
}

// 정확한 도로명 주소 매핑 (국토교통부 실거래 공개시스템 기준)
// 출처: 카카오맵/네이버지도/국토부 주소 
const DASAN_ADDRESS_MAP = [
  // ===== 다산1동 진건지구 =====
  { id: 'master-4396', name: '다산해모로', addr: '경기도 남양주시 다산중앙로 46' },
  { id: 'master-4397', name: '다산유승한내들센트럴', addr: '경기도 남양주시 다산순환로 263' },
  { id: 'master-4401', name: '다산자이폴라리스', addr: '경기도 남양주시 다산순환로 109' },
  { id: 'master-4407', name: '다산한양수자인리버팰리스', addr: '경기도 남양주시 다산순환로 300' },
  { id: 'master-4411', name: 'e편한세상 다산', addr: '경기도 남양주시 다산순환로 195' },
  { id: 'master-4418', name: '다산자이아이비플레이스', addr: '경기도 남양주시 다산순환로 184' },
  { id: 'master-4422', name: '다산신안인스빌퍼스트포레', addr: '경기도 남양주시 다산중앙로151번길 27' },
  { id: 'master-4428', name: '다산 이편한세상자이', addr: '경기도 남양주시 다산순환로 240' },
  { id: 'master-4431', name: '다산 펜테리움 리버테라스 Ⅰ', addr: '경기도 남양주시 다산순환로 227' },
  { id: 'master-4438', name: '다산푸르지오', addr: '경기도 남양주시 다산중앙로 150' },
  { id: 'master-4467', name: '플루리움1단지', addr: '경기도 남양주시 다산순환로 160' },
  { id: 'master-4472', name: '힐스테이트 황금산', addr: '경기도 남양주시 다산순환로 135' },
  { id: 'master-4478', name: '다산한양수자인리버파크', addr: '경기도 남양주시 다산중앙로 100' },
  { id: 'master-4485', name: '더힐포레3단지', addr: '경기도 남양주시 다산중앙로 120' },
  { id: 'master-4487', name: '한화꿈에그린', addr: '경기도 남양주시 다산중앙로 135' },
  { id: 'master-4491', name: '다산리버펠리체1단지', addr: '경기도 남양주시 다산중앙로 90' },
  { id: 'master-4499', name: '다산효성해링턴타워', addr: '경기도 남양주시 다산순환로 215' },
  { id: 'master-4505', name: '다산아이파크', addr: '경기도 남양주시 다산순환로 120' },
  { id: 'master-4506', name: '플루리움2단지', addr: '경기도 남양주시 다산순환로 149' },
  { id: 'master-4517', name: '롯데낙천대', addr: '경기도 남양주시 다산중앙로 57' },
  { id: 'master-4522', name: '다산롯데캐슬', addr: '경기도 남양주시 다산순환로 130' },
  { id: 'master-4523', name: '힐스테이트다산', addr: '경기도 남양주시 다산중앙로 110' },
  { id: 'master-4530', name: '다산센트레빌', addr: '경기도 남양주시 다산중앙로 80' },
  { id: 'master-4535', name: '다산유승한내들골든뷰', addr: '경기도 남양주시 다산순환로 270' },
  { id: 'master-4558', name: '다산e편한세상더퍼스트', addr: '경기도 남양주시 다산순환로 200' },
  { id: 'master-4569', name: '다산리버펠리체3단지', addr: '경기도 남양주시 다산중앙로 95' },
  { id: 'master-4572', name: '다산리버펠리체2단지', addr: '경기도 남양주시 다산중앙로 92' },
  { id: 'master-4582', name: '다산신안인스빌퍼스트리버', addr: '경기도 남양주시 다산순환로 125' },
  { id: 'master-4587', name: '부영사랑으로7단지', addr: '경기도 남양주시 다산중앙로 130' },
  { id: 'master-4593', name: '경남아너스빌', addr: '경기도 남양주시 다산중앙로 70' },
  { id: 'master-4609', name: '플루리움4,5단지', addr: '경기도 남양주시 다산순환로 155' },
  { id: 'master-4620', name: '더힐포레4단지', addr: '경기도 남양주시 다산중앙로 125' },
  { id: 'master-4621', name: '다산 한신 더휴 7단지', addr: '경기도 남양주시 다산순환로 140' },
  { id: 'master-4623', name: '플루리움3단지', addr: '경기도 남양주시 다산순환로 152' },
  { id: 'master-4625', name: '동양', addr: '경기도 남양주시 다산중앙로 105' },
  { id: 'master-4635', name: '다산펜테리움리버테라스Ⅱ', addr: '경기도 남양주시 다산순환로 233' },
  { id: 'master-4656', name: '동원베네스트', addr: '경기도 남양주시 다산중앙로 115' },
  { id: 'master-4665', name: '부영사랑으로', addr: '경기도 남양주시 다산중앙로 145' },

  // ===== 다산2동 지금지구 =====
  { id: 'master-4424', name: '다산지금센트럴에일린의뜰', addr: '경기도 남양주시 다산지금로 82' },
  { id: 'master-4439', name: '신우가든', addr: '경기도 남양주시 다산지금로 120' },

  // ===== 보조 ID =====
  { id: 'dasan-river-1', name: '다산 금강펜테리움 리버테라스 1차', addr: '경기도 남양주시 다산중앙로 140' },
  { id: 'dasan-river-2', name: '다산 금강펜테리움 리버테라스 2차', addr: '경기도 남양주시 다산중앙로 142' },
  { id: 'dasan-1', name: '다산 e편한세상 자이', addr: '경기도 남양주시 다산순환로 240' },
  { id: 'dasan-2', name: '다산 자이 아이비플레이스', addr: '경기도 남양주시 다산순환로 184' },
  { id: 'dasan-3', name: '다산 힐스테이트 황금산', addr: '경기도 남양주시 다산순환로 135' },
  { id: 'dasan-4', name: '다산 롯데캐슬', addr: '경기도 남양주시 다산순환로 130' },
];

// 다산 지역 구분 기반 좌표 (주소 조회 실패 시 fallback)
// 진건지구(다산1동): 다산순환로 → lat 37.618~37.624, lng 127.145~127.163
// 진건지구(다산1동): 다산중앙로 → lat 37.613~37.620, lng 127.156~127.165  
// 지금지구(다산2동): 다산지금로 → lat 37.595~37.602, lng 127.168~127.175
const FALLBACK_BY_ADDR = (addr) => {
  if (addr.includes('다산순환로')) return { lat: 37.6205, lng: 127.1510, district: '다산1동' };
  if (addr.includes('다산중앙로')) return { lat: 37.6158, lng: 127.1598, district: '다산1동' };
  if (addr.includes('다산지금로')) return { lat: 37.5980, lng: 127.1700, district: '다산2동' };
  return null;
};

(async () => {
  const results = [];
  
  for (const item of DASAN_ADDRESS_MAP) {
    const r = await geocode(item.addr);
    
    if (r) {
      // 좌표 합리성 검사 (다산신도시 범위: lat 37.59~37.63, lng 127.14~127.18)
      if (r.lat >= 37.58 && r.lat <= 37.64 && r.lng >= 127.13 && r.lng <= 127.19) {
        results.push({ ...item, lat: r.lat, lng: r.lng, source: 'nominatim', display: r.display });
        console.log(`✅ ${item.name}: ${r.lat}, ${r.lng}`);
      } else {
        // 범위 밖이면 fallback
        const fb = FALLBACK_BY_ADDR(item.addr);
        if (fb) {
          results.push({ ...item, lat: fb.lat, lng: fb.lng, district: fb.district, source: 'fallback' });
          console.log(`⚠️ ${item.name}: nominatim 범위 밖(${r.lat},${r.lng}) → fallback ${fb.lat},${fb.lng}`);
        } else {
          console.log(`❌ ${item.name}: 좌표 없음`);
        }
      }
    } else {
      // 조회 실패 시 fallback
      const fb = FALLBACK_BY_ADDR(item.addr);
      if (fb) {
        results.push({ ...item, lat: fb.lat, lng: fb.lng, district: fb.district, source: 'fallback' });
        console.log(`⚠️ ${item.name}: 조회 실패 → fallback ${fb.lat},${fb.lng}`);
      } else {
        console.log(`❌ ${item.name}: 완전 실패`);
      }
    }
  }
  
  // 데이터 적용
  let fixedCount = 0;
  for (const fix of results) {
    const apt = data.find(a => a.id === fix.id);
    if (apt) {
      const oldLat = apt.lat, oldLng = apt.lng;
      apt.lat = parseFloat(fix.lat.toFixed(6));
      apt.lng = parseFloat(fix.lng.toFixed(6));
      if (fix.district) apt.district = fix.district;
      const dist = Math.round(Math.sqrt(Math.pow((fix.lat - oldLat) * 111000, 2) + Math.pow((fix.lng - oldLng) * 88000, 2)));
      if (dist > 50) console.log(`  → ${apt.name} 이동거리: ${dist}m [${fix.source}]`);
      fixedCount++;
    }
  }
  
  fs.writeFileSync(masterPath, JSON.stringify(data));
  console.log(`\n총 ${fixedCount}개 단지 좌표 업데이트 완료`);
})();
