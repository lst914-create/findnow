const fs = require('fs');
const path = require('path');

const extraContent = fs.readFileSync(path.join(__dirname, '../src/lib/nationwideZonesExtra.ts'), 'utf8');

const regex = /"id":\s*"([a-z0-9_-]+)",\s*"name":\s*"([^"]+)",\s*"type":\s*"([^"]+)",\s*"status":\s*"([^"]+)"[\s\S]*?"district":\s*"([^"]+)",\s*"address":\s*"([^"]+)"/g;
let m;
const list = [];
while ((m = regex.exec(extraContent)) !== null) {
  list.push({ id: m[1], name: m[2], type: m[3], status: m[4], district: m[5], address: m[6] });
}

console.log('Total zones:', list.length);

// 가상/더미로 추정되는 구역들:
// 번지수가 '1258-8', '1258-1', '456-8', '456-1', '756-8', '852-8' 등 패턴화된 임의 지번들
const patternZips = ['1258-', '456-', '758-', '852-', '756-', '452-'];
const suspicious = list.filter(item => {
  return patternZips.some(pz => item.address.includes(pz));
});

console.log(`\n패턴화된 가짜 임의 지번을 가진 더미 구역 목록 (${suspicious.length}건):`);
suspicious.forEach(s => {
  console.log(`${s.id.padEnd(16)} | ${s.name.padEnd(16)} | ${s.district.padEnd(8)} | ${s.address}`);
});

