const fs = require('fs');
const path = require('path');

const master = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/lib/redevelopment-master.json'), 'utf-8'));
console.log('redevelopment-master.json count:', master.length);

const redevCode = fs.readFileSync(path.join(__dirname, '../src/lib/redevelopment.ts'), 'utf-8');
const nationwideCode = fs.readFileSync(path.join(__dirname, '../src/lib/nationwideZones.ts'), 'utf-8');
const extraCode = fs.readFileSync(path.join(__dirname, '../src/lib/nationwideZonesExtra.ts'), 'utf-8');

function extractIds(code) {
  const ids = [];
  const regex = /id:\s*["']([^"']+)["']/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    // tx- 나 nt- 로 시작하는 것은 제외 (트랜잭션이나 공고)
    if (!match[1].startsWith('tx-') && !match[1].startsWith('nt-')) {
      ids.push(match[1]);
    }
  }
  return ids;
}

const redevIds = extractIds(redevCode);
const nationwideIds = extractIds(nationwideCode);
const extraIds = extractIds(extraCode);

const allCodeIds = new Set([...redevIds, ...nationwideIds, ...extraIds]);
console.log('Total zone IDs in code (redevelopment.ts + nationwide + extra):', allCodeIds.size);

const masterIds = new Set(master.map(m => m.id));

const inCodeNotInMaster = [...allCodeIds].filter(id => !masterIds.has(id));
console.log('In Code but not in master.json count:', inCodeNotInMaster.length);
if (inCodeNotInMaster.length > 0) {
  console.log('Sample in code not in master:', inCodeNotInMaster.slice(0, 10));
}

const inMasterNotInCode = master.filter(m => !allCodeIds.has(m.id)).map(m => ({ id: m.id, name: m.name }));
console.log('In master.json but not in Code (재개발 지도 누락):', inMasterNotInCode);

