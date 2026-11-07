const fs = require('fs');
const list = JSON.parse(fs.readFileSync('./src/lib/apartments-master.json', 'utf8'));

const kakaoApts = list.filter(a => a.id.startsWith('kakao-'));
console.log('Total kakao apts:', kakaoApts.length);

function getDistM(lat1, lon1, lat2, lon2) {
  const R = 6371e3;
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const dp = (lat2 - lat1) * Math.PI / 180;
  const dl = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

const duplicates = [];
const kaptApts = list.filter(a => a.id.startsWith('kapt-'));

kakaoApts.forEach(k => {
  if (!k.lat || !k.lng) return;
  const cleanKName = k.name.replace(/아파트|단지|마을|\s+/g, '');
  
  for (const p of kaptApts) {
    if (!p.lat || !p.lng) continue;
    const dist = getDistM(k.lat, k.lng, p.lat, p.lng);
    if (dist < 150) { // 150m 이내 같은 위치
      const cleanPName = p.name.replace(/아파트|단지|마을|\s+/g, '');
      if (cleanKName.includes(cleanPName) || cleanPName.includes(cleanKName) || cleanKName === cleanPName) {
        duplicates.push({ kakao: k, kapt: p, dist: Math.round(dist) });
        break;
      }
    }
  }
});

console.log('Duplicates between kakao and kapt within 150m:', duplicates.length);
duplicates.slice(0, 30).forEach(d => {
  console.log(`[중복 ${d.dist}m] kakao: ${d.kakao.id} (${d.kakao.name}) vs kapt: ${d.kapt.id} (${d.kapt.name}) in ${d.kapt.region}`);
});

