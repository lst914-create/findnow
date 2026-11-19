/**
 * [마스터 DB 무결성 전면 정제 및 가짜 데이터 박멸 스크립트]
 * 1. 카카오 POI 중복 단지 및 커뮤니티센터 등 비주거 부속시설 전면 영구 삭제
 * 2. 잠실 센트럴파크 청년주택의 가짜 63억/78평 완전 박멸 -> 정상 청년임대(0원) 전환
 * 3. 잠실월드메르디앙 오좌표(리센츠 부지) -> 실제 주소(잠실동 175-4)로 분리 정렬
 * 4. 리센츠 아파트는 K-apt 공식 잠실리센츠 단 1개 마커만 남기고 최신 실거래가(33.6억) 확정
 * 5. 전국 국토부 실거래 내역 없는 모든 단지의 가짜 해시 가격 전수 0(가격없음) 초기화
 */

const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/PC/Desktop/streamlit-detail-page/chajwo';
const MASTER_PATH = path.join(ROOT, 'src/lib/apartments-master.json');
const LOOKUP_PATH = path.join(ROOT, 'src/lib/jibun-lookup.json');

function getDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function normalizeKey(str) {
  return (str || '').replace(/[\s\-_(),.·\[\]{}<>]/g, '').toLowerCase();
}

function main() {
  console.log('=== 마스터 DB 전면 정제 및 가짜 데이터 박멸 작업 시작 ===');

  const rawData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
  console.log(`기존 단지 수: 총 ${rawData.length}개`);

  // 1. K-apt 공식 단지 분리
  const kaptList = rawData.filter(d => d.id.startsWith('kapt-'));
  const nonKaptList = rawData.filter(d => !d.id.startsWith('kapt-'));
  console.log(`K-apt 공식 단지: ${kaptList.length}개, 기타/카카오 단지: ${nonKaptList.length}개`);

  // K-apt 명칭 및 좌표 인덱스 생성
  const kaptNameIndex = new Map();
  kaptList.forEach(k => {
    const key = `${normalizeKey(k.region)}__${normalizeKey(k.district)}__${normalizeKey(k.name).replace(/아파트|주상복합/g, '')}`;
    kaptNameIndex.set(key, k);
  });

  // 2. 카카오 단지 정제 (부속시설 및 중복 단지 100% 영구 삭제)
  const FACILITY_REGEX = /센터|상가|사무소|노인|어린이|유치원|주차|충전|부대|복리|관리실|경로당|마을회관|스포츠|골프|수영/;
  let removedFacilityCount = 0;
  let removedDupCount = 0;
  const survivorsNonKapt = [];

  for (const item of nonKaptList) {
    const name = item.name || '';

    // A. 비주거 시설물 완전 제거
    if (FACILITY_REGEX.test(name)) {
      removedFacilityCount++;
      continue;
    }

    // B. K-apt와 이름/지역 중복 제거
    const normName = normalizeKey(name).replace(/아파트|주상복합/g, '');
    const key = `${normalizeKey(item.region)}__${normalizeKey(item.district)}__${normName}`;
    if (kaptNameIndex.has(key)) {
      removedDupCount++;
      continue;
    }

    // C. K-apt 단지와 150m 이내 초근접 중복 제거
    let isNearKapt = false;
    if (item.lat && item.lng) {
      for (const kapt of kaptList) {
        if (kapt.region === item.region && kapt.lat && kapt.lng) {
          const dist = getDistanceMeters(item.lat, item.lng, kapt.lat, kapt.lng);
          if (dist <= 150) {
            isNearKapt = true;
            break;
          }
        }
      }
    }
    if (isNearKapt) {
      removedDupCount++;
      continue;
    }

    // 살아남은 순수 소형/단독 주거 단지만 보존
    survivorsNonKapt.push(item);
  }

  console.log(`카카오 부속시설 영구 삭제: ${removedFacilityCount}개`);
  console.log(`K-apt 공식 단지와 중복된 카카오 단지 영구 삭제: ${removedDupCount}개`);
  console.log(`정제 후 남은 순수 단독 소형 주거 단지: ${survivorsNonKapt.length}개`);

  // 병합
  let cleanedList = [...kaptList, ...survivorsNonKapt];
  console.log(`1차 정제 후 단지 수: ${cleanedList.length}개`);

  // 3. 잠실동 집중 정렬 (리센츠 4중 마커 원천 박멸)
  // - kakao 리센츠아파트 및 커뮤니티센터는 위에서 이미 삭제됨
  // - 월드메르디앙 오좌표(리센츠 부지) -> 실제 잠실동 175-4로 이전
  const wm = cleanedList.find(d => d.id === 'kapt-A10027523');
  if (wm) {
    console.log('[정렬] 잠실월드메르디앙 오좌표 보정: 리센츠 부지 -> 잠실동 175-4');
    wm.jibun = '175-4';
    wm.lat = 37.511462;
    wm.lng = 127.079102;
    wm.jibun_address = '서울 송파구 잠실동 175-4';
  }

  // - 잠실리센츠 공식 단지 최신 실거래가 확정 (34평 33.6억)
  const recents = cleanedList.find(d => d.id === 'kapt-A13822003');
  if (recents) {
    console.log('[확정] 잠실리센츠 공식 실거래가 갱신: 34평 33.6억');
    recents.avgPrice = 336000;
    recents.price_max = 395000;
    recents.price_min = 149500;
    recents.area_pyeong = 34;
    recents.area_sqm = 84.99;
    recents.household_count = 5563;
    recents.built_year = 2008;
    recents.is_real_price = true;
    recents.isRealPrice = true;
    recents.jibun = '22';
    recents.lat = 37.512753;
    recents.lng = 127.088419;
  }

  // 4. 잠실센트럴파크 (청년안심주택) 가짜 63억/78평 박멸
  const centralPark = cleanedList.find(d => d.id === 'kapt-A10023070');
  if (centralPark) {
    console.log('[박멸] 잠실 센트럴파크 청년주택 가짜 63억/78평 -> 0원(청년안심주택) 정상화');
    centralPark.price_min = 0;
    centralPark.price_max = 0;
    centralPark.avgPrice = 0;
    centralPark.rent_min = 0;
    centralPark.rent_max = 0;
    centralPark.gapPrice = 0;
    centralPark.area_pyeong = 8;
    centralPark.area_sqm = 26.4;
    centralPark.household_count = 223;
    centralPark.dong_count = 1;
    centralPark.isRentalOnly = true;
    centralPark.rentalType = '청년안심주택';
    centralPark.is_real_price = false;
    centralPark.isRealPrice = false;
    centralPark.description = '서울 송파구 잠실동에 위치한 역세권 청년안심주택(공공지원민간임대)입니다.';
  }

  // 5. 전국 단지 전수 가짜/더미 가격 박멸 (호갱노노 정직한 2중 원칙)
  // - 실거래가 수집(is_real_price === true)이 되지 않은 단지는 매매 거래가 없으므로 가짜 가격 전수 0 처리!
  let purgedDummyPriceCount = 0;
  for (const item of cleanedList) {
    // 실거래가 확정 단지가 아니면서 과거 가짜 가격이 남아있는 경우
    if (!item.is_real_price && !item.isRealPrice) {
      if ((item.price_max && item.price_max > 0) || (item.avgPrice && item.avgPrice > 0)) {
        item.price_min = 0;
        item.price_max = 0;
        item.avgPrice = 0;
        item.rent_min = 0;
        item.rent_max = 0;
        item.gapPrice = 0;
        purgedDummyPriceCount++;
      }
    }
  }
  console.log(`전국 실거래 없는 단지의 가짜 해시 가격 전수 0 초기화: ${purgedDummyPriceCount}개 단지 박멸 완료`);

  // 리센츠 부지 검증
  const checkRecents = cleanedList.filter(d => 
    d.region && d.region.includes('송파') && d.district && d.district.includes('잠실동') &&
    d.lat >= 37.511 && d.lat <= 37.514 && d.lng >= 127.086 && d.lng <= 127.090
  );
  console.log(`\n[검증] 리센츠 부지 내 남은 마커 수: ${checkRecents.length}개`);
  checkRecents.forEach(r => console.log(`  -> ${r.id} | ${r.name} | ${r.avgPrice ? (r.avgPrice/10000).toFixed(1)+'억' : '가격없음'}`));

  // 파일 저장
  fs.writeFileSync(MASTER_PATH, JSON.stringify(cleanedList, null, 2), 'utf8');
  console.log(`\n💾 정제된 마스터 DB 저장 완료: 총 ${cleanedList.length}개 단지 (${MASTER_PATH})`);

  // 6. jibun-lookup.json 재생성
  const lookup = {};
  cleanedList.forEach(a => {
    if (a.district && a.jibun) {
      const key = `${a.district.trim()} ${a.jibun.trim()}`;
      if (!lookup[key]) lookup[key] = [];
      lookup[key].push({ id: a.id, name: a.name });
    }
  });
  fs.writeFileSync(LOOKUP_PATH, JSON.stringify(lookup, null, 2), 'utf8');
  console.log(`💾 jibun-lookup.json 동기화 완료: ${Object.keys(lookup).length}개 고유 지번`);
  console.log('=== 전체 무결성 정제 작업 완료 ===');
}

main();
