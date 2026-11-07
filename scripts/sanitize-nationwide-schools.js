const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/lib/apartments-master.json');
const apts = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

let fixedCount = 0;
let dasanCount = 0;

for (const apt of apts) {
  const isSeoul = (apt.region || '').includes('서울');

  // 다산동 특별 정밀 보정
  const isDasan = (apt.region || '').includes('남양주') && 
    ((apt.district || '').includes('다산') || (apt.name || '').includes('다산'));

  if (isDasan) {
    dasanCount++;
    // 지금지구 (한강변 / 남측): 반도유보라, 금강펜테리움, 신안인스빌 등
    const isJigeumOrHangang = /반도유보라|금강펜테리움|신안인스빌|데시앙|에일린의뜰|센트럴에이치|지금/.test(apt.name) ||
      (apt.lat && apt.lat < 37.605);
    
    if (isJigeumOrHangang) {
      apt.school_name = '다산한강초등학교';
      if (apt.name.includes('반도유보라')) {
        apt.school_dist = '도보 4분 (289m)';
      }
    } else {
      apt.school_name = '다산새봄초등학교';
    }
    fixedCount++;
    continue;
  }

  // 전국 비서울 아파트인데 '서울'로 시작하는 잘못된 학교명 정제
  if (!isSeoul && apt.school_name && apt.school_name.startsWith('서울')) {
    // apt.schools 배열에서 초등학교 탐색
    const realSchool = apt.schools?.find(s => s.includes('초등') && !s.startsWith('서울'));
    if (realSchool) {
      apt.school_name = realSchool;
    } else {
      // 잘못 붙은 '서울' 접두사 제거
      apt.school_name = apt.school_name.replace(/^서울/, '');
    }
    fixedCount++;
  }
}

console.log(`전국 아파트 ${apts.length}개 중:`);
console.log(`- 다산동 정밀 보정: ${dasanCount}개 단지`);
console.log(`- 비서울 잘못된 서울 접두사 정제: ${fixedCount}개 단지`);

fs.writeFileSync(filePath, JSON.stringify(apts, null, 2), 'utf-8');
console.log('apartments-master.json 정제 저장 완료!');

