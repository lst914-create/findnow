const fs = require('fs');
const path = require('path');

const masterPath = path.resolve(__dirname, '../src/lib/apartments-master.json');
const data = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

const updates = {
  '다산역자연앤푸르지오': { min: 72000, max: 84000, pyeong: 25, sqm: 59.9 },
  '다산 포레스트 2단지': { min: 70000, max: 82000, pyeong: 34, sqm: 84.6 },
  '다산지금데시앙': { min: 68000, max: 78000, pyeong: 34, sqm: 84.7 },
  '다산진건데시앙': { min: 65000, max: 75000, pyeong: 34, sqm: 84.7 },
  '다산지금 경기행복주택': { min: 35000, max: 45000, pyeong: 20, sqm: 44.0 },
  '다산 메트로 3단지': { min: 72000, max: 85000, pyeong: 34, sqm: 84.6 },
  '다산센트럴파크': { min: 75000, max: 88000, pyeong: 34, sqm: 84.7 },
  '다산역 경기행복주택아파트': { min: 35000, max: 45000, pyeong: 20, sqm: 44.0 },
  '다산금강펜테리움리버테라스2차': { min: 85000, max: 96000, pyeong: 34, sqm: 84.9 },
  '다산센트럴에일린의뜰아파트': { min: 80000, max: 92000, pyeong: 34, sqm: 84.9 },
  '다산금강펜테리움리버테라스1차': { min: 82000, max: 93000, pyeong: 34, sqm: 84.9 },
  '가운휴먼시아1단지': { min: 58000, max: 68000, pyeong: 33, sqm: 84.8 },
  '가운휴먼시아2단지': { min: 59000, max: 70000, pyeong: 34, sqm: 84.9 },
  '도농사랑으로7단지 부영아파트': { min: 48000, max: 56000, pyeong: 32, sqm: 84.5 }
};

let count = 0;
data.forEach(apt => {
  if (updates[apt.name]) {
    const u = updates[apt.name];
    apt.price_min = u.min;
    apt.price_max = u.max;
    apt.area_pyeong = u.pyeong;
    apt.area_sqm = u.sqm;
    apt.isRealPrice = true;
    const avg = Math.round((u.min + u.max) / 2);
    const jr = apt.jeonseRatio || 56;
    apt.rent_min = Math.round(u.min * (jr / 100));
    apt.rent_max = Math.round(u.max * (jr / 100));
    apt.gapPrice = Math.round(avg * ((100 - jr) / 100));
    console.log('업데이트 완료: ' + apt.name + ' -> ' + u.min + '~' + u.max + ' (평균: ' + (avg / 10000).toFixed(1) + '억)');
    count++;
  }
});

fs.writeFileSync(masterPath, JSON.stringify(data, null, 2), 'utf8');
console.log('총 업데이트 단지 수: ' + count + '개');

