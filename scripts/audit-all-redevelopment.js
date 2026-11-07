const fs = require('fs');
const path = require('path');

const files = [
  { name: 'master_redevelopment.json', path: 'public/data/master_redevelopment.json', isJson: true },
  { name: 'redevelopment-master.json', path: 'src/lib/redevelopment-master.json', isJson: true },
];

const suspiciousList = [];

// 신도시/신축 택지이면서 재건축/재개발로 둔갑된 가짜 키워드
const newTownKeywords = [
  '동탄', '위례', '판교', '광교', '송도', '청라', '배곧', '미사', '옥정', '운정', 
  '한강신도시', '세종', '다산', '별내', '갈매', '옥련', '고덕국제', '검단신도시'
];

for (const f of files) {
  const fullPath = path.join(__dirname, '..', f.path);
  if (!fs.existsSync(fullPath)) continue;
  const items = JSON.parse(fs.readFileSync(fullPath, 'utf8'));

  items.forEach(item => {
    const name = item.name || '';
    const addr = item.roadAddress || item.address || item.jibunAddress || '';
    const type = item.projectType || item.type || '';
    const id = item.id;

    // 1. 신도시 + 재건축/재개발/가로주택 조합 의심
    const matchedKw = newTownKeywords.filter(kw => name.includes(kw) || addr.includes(kw));
    if (matchedKw.length > 0) {
      // 단, 공공주택(왕숙2지구 등)이나 실제 구도심(예: 송도유원지 일대 등) 여부 확인
      suspiciousList.push({ file: f.name, id, name, type, addr, matchedKw });
    }

    // 2. 이름이 'OO1구역', 'OO2구역' 형태로 너무 전형적인 더미 형태 (예: city-1, siheung-1, hwaseong-1)
    if (/^[a-z]+-\d+$/.test(id)) {
      suspiciousList.push({ file: f.name, id, name, type, addr, reason: '더미 ID 형식 (city-number)' });
    }
  });
}

// nationwideZonesExtra.ts 검사
const extraPath = path.join(__dirname, '../src/lib/nationwideZonesExtra.ts');
if (fs.existsSync(extraPath)) {
  const extraContent = fs.readFileSync(extraPath, 'utf8');
  // eval / dynamic import 대신 정규식으로 전체 객체 id, name, type, address 파싱
  const regex = /"id":\s*"([^"]+)",\s*"name":\s*"([^"]+)",\s*"type":\s*"([^"]+)"[\s\S]*?"address":\s*"([^"]+)"/g;
  let match;
  while ((match = regex.exec(extraContent)) !== null) {
    const [_, id, name, type, addr] = match;
    const matchedKw = newTownKeywords.filter(kw => name.includes(kw) || addr.includes(kw));
    if (matchedKw.length > 0) {
      suspiciousList.push({ file: 'nationwideZonesExtra.ts', id, name, type, addr, matchedKw });
    }
    if (/^[a-z]+-\d+$/.test(id)) {
      suspiciousList.push({ file: 'nationwideZonesExtra.ts', id, name, type, addr, reason: '더미 ID 형식 (city-number)' });
    }
  }
}

console.log(`전체 의심 항목 수: ${suspiciousList.length}건\n`);
suspiciousList.forEach((s, idx) => {
  console.log(`[${idx + 1}] [${s.file}] id: "${s.id}" | ${s.name} (${s.type}) | 주소: ${s.addr}`);
  if (s.matchedKw) console.log(`    매칭 신도시 키워드: ${s.matchedKw.join(', ')}`);
  if (s.reason) console.log(`    의심 사유: ${s.reason}`);
});

