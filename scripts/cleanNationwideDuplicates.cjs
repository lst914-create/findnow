const fs = require('fs');
const path = require('path');

const masterPath = path.resolve(__dirname, '../src/lib/apartments-master.json');
const publicMasterPath = path.resolve(__dirname, '../public/data/master_apartments.json');

const rawData = JSON.parse(fs.readFileSync(masterPath, 'utf8'));
console.log(`[시작] 원본 아파트 수: ${rawData.length}개`);

// 1. 인창동 핵심 단지 4개 정밀 교정
const inchangTargetIds = ['kapt-A47177317', 'kapt-A47183301', 'kapt-A10025318', 'kapt-A10027803'];
for (const a of rawData) {
  if (a.id === 'kapt-A47177317') {
    // 인창2차e편한세상 (본 단지 621세대 정상화)
    a.name = '인창2차e편한세상';
    a.jibun_address = '경기 구리시 인창동 705';
    a.road_address = '경기 구리시 동구릉로65번길 39';
    a.lat = 37.610500;
    a.lng = 127.136000;
    a.built_year = 2006;
    a.household_count = 621;
    a.dong_count = 11;
    a.price_min = 60000;
    a.price_max = 75000;
    a.avgPrice = 70000; // 34평 대표 실거래 시세 7.0억
    a.description = '경기 구리시 인창동에 위치한 인창2차e편한세상 아파트입니다.';
    console.log('✓ 인창2차e편한세상 (kapt-A47177317) 단지 중심 및 7.0억 시세 정상화');
  } else if (a.id === 'kapt-A47183301') {
    // 인창e편한세상1차 (인창동 309-6, 154세대 1개동으로 정식 복원)
    a.name = '인창e편한세상1차';
    a.jibun_address = '경기 구리시 인창동 309-6';
    a.road_address = '경기 구리시 동구릉로 64';
    a.lat = 37.605300;
    a.lng = 127.137800;
    a.built_year = 2004;
    a.household_count = 154;
    a.dong_count = 1;
    a.price_min = 48000;
    a.price_max = 56000;
    a.avgPrice = 53000;
    a.description = '경기 구리시 인창동에 위치한 인창e편한세상 1차 아파트입니다.';
    console.log('✓ 인창e편한세상1차 (kapt-A47183301) 인창초 남쪽 정상 위치 및 1차 스펙으로 복원');
  } else if (a.id === 'kapt-A10025318') {
    // 구리인창공원우림필유 (인창동 711, 8.6억 정상 유지)
    a.name = '구리인창공원우림필유';
    a.lat = 37.605586;
    a.lng = 127.135614;
    a.jibun_address = '경기 구리시 인창동 711';
    a.road_address = '경기 구리시 동구릉로66번길 14';
    a.avgPrice = 85950;
    a.household_count = 121;
    a.dong_count = 2;
    console.log('✓ 구리인창공원우림필유 (kapt-A10025318) 정식 명칭 및 8.6억 확정');
  } else if (a.id === 'kapt-A10027803') {
    // 구리우림아파트 -> 인창동 711에서 수택동 684-9 실제 위치로 복원
    a.name = '구리우림아파트';
    a.region = '경기 구리시';
    a.district = '수택동';
    a.jibun_address = '경기 구리시 수택동 684-9';
    a.road_address = '경기 구리시 이문안로139번길 9';
    a.lat = 37.593850;
    a.lng = 127.143520;
    a.built_year = 1999;
    a.household_count = 266;
    a.dong_count = 3;
    a.price_min = 38000;
    a.price_max = 45000;
    a.avgPrice = 42000;
    a.description = '경기 구리시 수택동에 위치한 구리우림아파트입니다.';
    console.log('✓ 구리우림아파트 (kapt-A10027803) 인창동 오염 해제 -> 수택동 684-9 실제 위치로 복원');
  }
}

// 2. 동탄 핵심 오염 단지 정밀 교정
for (const a of rawData) {
  if (a.id === 'kapt-A10027465') {
    // 동탄2 반도유보라아이비파크3차: 여울동 1044 (동탄대로12길 17), 5.8억
    a.name = '동탄2반도유보라아이비파크3차아파트';
    a.district = '여울동';
    a.jibun_address = '경기 화성시 여울동 1044';
    a.road_address = '경기 화성시 동탄대로12길 17';
    a.lat = 37.186500;
    a.lng = 127.093500;
    a.household_count = 1135;
    a.built_year = 2016;
    a.price_min = 52000;
    a.price_max = 63000;
    a.avgPrice = 58000;
    console.log('✓ 동탄2반도유보라아이비파크3차 (kapt-A10027465) 롯데캐슬 좌표 오염 해제 -> 여울동 1044 복원');
  } else if (a.id === 'kapt-A10020095') {
    // 동탄파라곤2: 반송동 102
    a.district = '반송동';
    a.jibun_address = '경기 화성시 반송동 102';
    a.road_address = '경기 화성시 동탄지성로 14';
    a.lat = 37.202300;
    a.lng = 127.072500;
    a.price_min = 60000;
    a.price_max = 70000;
    a.avgPrice = 65000;
    console.log('✓ 동탄파라곤2 (kapt-A10020095) 여울동 오염 해제 -> 반송동 102 복원');
  }
}

// 3. 전국 동일 좌표 중복 정제
// 1) 0.00001도 수준으로 동일한 좌표 그룹 빌드
const coordMap = new Map();
rawData.forEach((a, idx) => {
  if (a.lat && a.lng) {
    const key = `${a.lat.toFixed(5)},${a.lng.toFixed(5)}`;
    if (!coordMap.has(key)) coordMap.set(key, []);
    coordMap.get(key).push({ apt: a, idx });
  }
});

const removeIndices = new Set();
let mergedGhostCount = 0;
let mergedDuplicateCount = 0;
let separatedDistinctCount = 0;

coordMap.forEach((items, key) => {
  if (items.length <= 1) return;

  const names = items.map(it => it.apt.name.replace(/\s+/g, ''));
  const getPrice = (a) => (a.avgPrice || a.price_max || a.price_min || 0);

  // 단지명 유사도 검사
  const isSameComplex = names.some((n1, i) =>
    names.some((n2, j) => {
      if (i === j) return false;
      const clean1 = n1.replace(/[0-9]+단지|[0-9]+차|아파트/g, '');
      const clean2 = n2.replace(/[0-9]+단지|[0-9]+차|아파트/g, '');
      return clean1.length >= 2 && clean2.length >= 2 && (clean1.includes(clean2) || clean2.includes(clean1));
    })
  );

  if (isSameComplex) {
    const withPrice = items.filter(it => getPrice(it.apt) > 0);
    const withoutPrice = items.filter(it => getPrice(it.apt) === 0);

    if (withPrice.length > 0 && withoutPrice.length > 0) {
      // 실거래가 0원인 유령/미인증 중복 엔트리 제거
      withoutPrice.forEach(it => {
        removeIndices.add(it.idx);
        mergedGhostCount++;
      });
    } else if (withPrice.length > 1) {
      // 둘 다 실거래가가 있는 동일 단지 중복 -> 1개만 남기고 나머지 제거
      for (let i = 1; i < withPrice.length; i++) {
        removeIndices.add(withPrice[i].idx);
        mergedDuplicateCount++;
      }
    } else if (withoutPrice.length > 1) {
      // 둘 다 0원인 동일 단지 중복 -> 1개만 남기고 제거
      for (let i = 1; i < withoutPrice.length; i++) {
        removeIndices.add(withoutPrice[i].idx);
        mergedGhostCount++;
      }
    }
  } else {
    // 완전히 별개인 단지인데 동일 좌표에 겹쳐있는 경우:
    // 30~50m 간격(위도 0.0003도씩)으로 부드럽게 오프셋 분리하여 마커 충돌 방지
    const angleStep = (2 * Math.PI) / items.length;
    items.forEach((it, i) => {
      if (i > 0) {
        const radius = 0.00028; // 약 30미터
        const angle = angleStep * i;
        it.apt.lat = Number((it.apt.lat + radius * Math.cos(angle)).toFixed(6));
        it.apt.lng = Number((it.apt.lng + radius * Math.sin(angle)).toFixed(6));
        separatedDistinctCount++;
      }
    });
  }
});

console.log(`\n[정제 결과 요약]`);
console.log(`- 실거래가 0원 유령 중복 제거: ${mergedGhostCount}개`);
console.log(`- 동일 단지 이중 코드 중복 제거: ${mergedDuplicateCount}개`);
console.log(`- 동일 좌표에 겹쳐있던 별개 단지 오프셋 분리: ${separatedDistinctCount}개`);

// 최종 필터링된 배열
const cleanedData = rawData.filter((_, idx) => !removeIndices.has(idx));
console.log(`[완료] 최종 정제된 아파트 수: ${cleanedData.length}개 (기존 대비 ${removeIndices.size}개 중복 제거)`);

// 파일 저장 (apartments-master.json & public/data/master_apartments.json)
fs.writeFileSync(masterPath, JSON.stringify(cleanedData, null, 2), 'utf8');
fs.writeFileSync(publicMasterPath, JSON.stringify(cleanedData, null, 2), 'utf8');
console.log(`✓ src/lib/apartments-master.json 저장 완료`);
console.log(`✓ public/data/master_apartments.json 동기화 저장 완료`);
