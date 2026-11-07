const fs = require('fs');
const path = require('path');

const apiKey = '4d7cd3190ca38a795008ebd7cc053820';
const masterPath = path.join(__dirname, '../src/lib/apartments-master.json');
const data = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

// 1. 토평검배마을SK신일의 좌표 수정
// 카카오 공식 POI: 'SK신일아파트' (경기 구리시 토평동 1008)
// 실제 위경도: 37.592684, 127.153508
let updatedCount = 0;
data.forEach(apt => {
  if (apt.id === 'kapt-A47176404' || (apt.name && apt.name.includes('토평검배마을SK신일'))) {
    console.log(`[수정 전] ${apt.name} (id: ${apt.id}): lat ${apt.lat}, lng ${apt.lng}`);
    apt.lat = 37.592684;
    apt.lng = 127.153508;
    console.log(`[수정 후] ${apt.name}: lat ${apt.lat}, lng ${apt.lng} (토평동 1008 실존 단지 중앙)`);
    updatedCount++;
  }
});

fs.writeFileSync(masterPath, JSON.stringify(data, null, 2), 'utf8');
console.log(`apartments-master.json 업데이트 완료: ${updatedCount}건`);

// 2. public/data/master_apartments.json도 동기화
const publicMasterPath = path.join(__dirname, '../public/data/master_apartments.json');
if (fs.existsSync(publicMasterPath)) {
  const publicData = JSON.parse(fs.readFileSync(publicMasterPath, 'utf8'));
  let pubCount = 0;
  publicData.forEach(apt => {
    if (apt.id === 'kapt-A47176404' || (apt.name && apt.name.includes('토평검배마을SK신일'))) {
      apt.lat = 37.592684;
      apt.lng = 127.153508;
      pubCount++;
    }
  });
  fs.writeFileSync(publicMasterPath, JSON.stringify(publicData, null, 2), 'utf8');
  console.log(`master_apartments.json 업데이트 완료: ${pubCount}건`);
}

