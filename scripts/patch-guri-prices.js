const fs = require('fs');
const path = require('path');

const masterPath = path.resolve(__dirname, '../src/lib/apartments-master.json');
const data = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

const updates = {
  '수택금호어울림': { min: 58000, max: 68000, pyeong: 34, sqm: 84.9 },
  '한양수자인구리역리버시티': { min: 82000, max: 95000, pyeong: 34, sqm: 84.9 },
  '리버프라임 토평': { min: 65000, max: 75000, pyeong: 34, sqm: 84.9 },
  '교문우성한양': { min: 62000, max: 74000, pyeong: 34, sqm: 84.9 },
  '힐스테이트 구리역 ': { min: 85000, max: 98000, pyeong: 34, sqm: 84.9 }
};

let count = 0;
data.forEach(apt => {
  const key = apt.name.trim();
  if (updates[key] || updates[apt.name]) {
    const u = updates[key] || updates[apt.name];
    apt.price_min = u.min;
    apt.price_max = u.max;
    apt.area_pyeong = u.pyeong;
    apt.area_sqm = u.sqm;
    apt.isRealPrice = true;
    const jr = apt.jeonseRatio || 60;
    apt.rent_min = Math.round(u.min * (jr / 100));
    apt.rent_max = Math.round(u.max * (jr / 100));
    apt.gapPrice = Math.round(u.max * ((100 - jr) / 100));
    console.log('구리 업데이트: ' + apt.name + ' -> ' + u.min + '~' + u.max);
    count++;
  }
});

fs.writeFileSync(masterPath, JSON.stringify(data, null, 2), 'utf8');
console.log('총 구리 업데이트: ' + count + '개');

