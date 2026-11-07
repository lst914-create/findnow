const fs = require('fs');
const path = require('path');

const extraContent = fs.readFileSync(path.join(__dirname, '../src/lib/nationwideZonesExtra.ts'), 'utf8');

const regex = /"id":\s*"([a-z0-9_-]+)",\s*"name":\s*"([^"]+)",\s*"type":\s*"([^"]+)"[\s\S]*?"address":\s*"([^"]+)"/g;
let m;
const list = [];
while ((m = regex.exec(extraContent)) !== null) {
  list.push({ id: m[1], name: m[2], type: m[3], address: m[4] });
}

console.log('Total zones in nationwideZonesExtra.ts:', list.length);

// 가짜/허위 의심 패턴:
// 1) 신도시 택지지구에 '재건축'이나 '재개발'을 붙인 것 (동탄, 미사, 배곧, 민락, 회천, 웅천, 운정, 양주회천 등)
// 2) 실제 지자체 고시에 없는 가상의 구역명
const fakeList = list.filter(item => {
  const n = item.name;
  const a = item.address;
  // 신도시 + 재건축/재개발
  if (n.includes('동탄') || a.includes('동탄')) return true;
  if (n.includes('미사') || a.includes('미사')) return true;
  if (n.includes('배곧') || a.includes('배곧')) return true;
  if (n.includes('민락') || a.includes('민락')) return true;
  if (n.includes('회천') || a.includes('회천')) return true;
  if (n.includes('웅천') || a.includes('웅천')) return true;
  if (n.includes('다산') || a.includes('다산')) return true;
  return false;
});

console.log(`\n🚫 명백한 가짜 신도시 재개발/재건축 구역: ${fakeList.length}건`);
fakeList.forEach(item => {
  console.log(`- id: "${item.id}" | ${item.name} (${item.type}) | 주소: ${item.address}`);
});

