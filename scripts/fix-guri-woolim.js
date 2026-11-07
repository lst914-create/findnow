const fs = require('fs');
const path = require('path');

const masterPath = path.join(__dirname, '../src/lib/apartments-master.json');
const data = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

data.forEach(apt => {
  if (apt.name === '구리우림아파트' && apt.region === '경기 구리시') {
    apt.district = '인창동';
    apt.description = '경기 구리시 인창동에 위치한 구리인창공원우림필유아파트입니다.';
  }
});

fs.writeFileSync(masterPath, JSON.stringify(data, null, 2), 'utf8');
console.log('✅ 구리우림아파트 법정동 인창동 수정 완료');

