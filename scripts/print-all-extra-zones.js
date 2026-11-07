const fs = require('fs');
const path = require('path');

const extraContent = fs.readFileSync(path.join(__dirname, '../src/lib/nationwideZonesExtra.ts'), 'utf8');

const regex = /"id":\s*"([a-z0-9_-]+)",\s*"name":\s*"([^"]+)",\s*"type":\s*"([^"]+)"[\s\S]*?"address":\s*"([^"]+)"/g;
let m;
const allExtra = [];
while ((m = regex.exec(extraContent)) !== null) {
  allExtra.push({ id: m[1], name: m[2], type: m[3], address: m[4] });
}

console.log('Total in nationwideZonesExtra.ts:', allExtra.length);
allExtra.forEach((item, idx) => {
  // 실제 진짜 구역인지 아니면 가공된 임의 구역인지 체크
  console.log(`[${idx+1}] ${item.id.padEnd(20)} | ${item.name.padEnd(16)} | ${item.address}`);
});

