const fs = require('fs');
const path = require('path');

const files = [
  { name: 'master_redevelopment.json', file: path.join(__dirname, '../public/data/master_redevelopment.json') },
  { name: 'redevelopment-master.json', file: path.join(__dirname, '../src/lib/redevelopment-master.json') }
];

const fakeKeywords = ['동탄', '미사', '배곧', '민락', '회천', '웅천', '다산'];

files.forEach(f => {
  if (!fs.existsSync(f.file)) return;
  const data = JSON.parse(fs.readFileSync(f.file, 'utf8'));
  const found = data.filter(item => {
    const n = item.name || '';
    const a = item.roadAddress || item.address || item.jibunAddress || '';
    return fakeKeywords.some(kw => n.includes(kw) || a.includes(kw));
  });
  console.log(`\n📁 [${f.name}] 발견된 가짜 신도시 정비구역: ${found.length}건`);
  found.forEach(item => {
    console.log(`- id: "${item.id}" | ${item.name} (${item.projectType || item.type}) | 주소: ${item.roadAddress || item.address}`);
  });
});

