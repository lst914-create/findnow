/**
 * 삼성동 누락 단지(금호어울림, 강변삼부, 삼부아파트) 신규 추가 및 래미안삼성1차 위치 보정 스크립트
 */

const fs = require('fs');
const path = require('path');

const MASTER_PATH = path.join(__dirname, '../src/lib/apartments-master.json');
const data = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));

// 1. 래미안삼성1차(kapt-A13509013) 좌표 및 정보 보정
const raemian = data.find(a => a.id === 'kapt-A13509013');
if (raemian) {
  raemian.name = '래미안삼성1차아파트';
  raemian.lat = 37.516605;
  raemian.lng = 127.064097; // 301~303동 중심 좌표
  raemian.jibun = '102';
  raemian.household_count = 261;
  raemian.built_year = 2005;
  raemian.area_pyeong = 41;
  raemian.avgPrice = 368000; // 36.8억
  raemian.price_max = 368000;
  raemian.price_min = 212000;
}

// 2. 신규 단지 목록 (소규모 나홀로 단지 추가)
const newApts = [
  {
    id: 'rtms-11680-102-2',
    name: '삼성금호어울림아파트',
    region: '서울 강남구',
    district: '삼성동',
    api_region: '서울 강남구',
    lat: 37.516840,
    lng: 127.064774,
    avgPrice: 259000,
    price_min: 185000,
    price_max: 259000,
    rent_min: 0,
    rent_max: 0,
    gapPrice: 0,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2003,
    household_count: 46,
    dong_count: 1,
    floor_top: 15,
    floor_base: 1,
    approval_date: '2003.11.20',
    construction: '금호건설(주)',
    developer: '시행사/사업주체',
    parking_ratio: 1.2,
    parking_total: 55,
    ev_charger_count: 2,
    heating_type: '개별난방',
    hall_type: '계단식',
    far: 240,
    bcr: 22,
    school_score: 92,
    traffic_score: 95,
    nature_score: 85,
    walk_minutes: 7,
    tags: ['공동주택', '실거래가연동', '역세권'],
    facilities: ['관리사무소', '주민공동시설', '자전거보관소', '분리수거장'],
    schools: [],
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: '서울 강남구 삼성동에 위치한 삼성금호어울림아파트입니다. 국토교통부 실거래 데이터가 실시간 연동되어 있습니다.',
    is_real_price: true,
    umd_nm: '삼성동',
    jibun: '102-2',
    jibun_address: '서울 강남구 삼성동 102-2',
    sgg_cd: '11680',
    bjd_code: '11680'
  },
  {
    id: 'rtms-11680-99-12',
    name: '강변삼부아파트',
    region: '서울 강남구',
    district: '삼성동',
    api_region: '서울 강남구',
    lat: 37.517074,
    lng: 127.065523,
    avgPrice: 215000,
    price_min: 158000,
    price_max: 215000,
    rent_min: 0,
    rent_max: 0,
    gapPrice: 0,
    area_sqm: 76,
    area_pyeong: 30,
    built_year: 1999,
    household_count: 86,
    dong_count: 1,
    floor_top: 15,
    floor_base: 1,
    approval_date: '1999.08.14',
    construction: '삼부토건(주)',
    developer: '시행사/사업주체',
    parking_ratio: 1.1,
    parking_total: 95,
    ev_charger_count: 2,
    heating_type: '개별난방',
    hall_type: '계단식',
    far: 235,
    bcr: 21,
    school_score: 91,
    traffic_score: 94,
    nature_score: 88,
    walk_minutes: 8,
    tags: ['공동주택', '실거래가연동', '한강변'],
    facilities: ['관리사무소', '주민공동시설', '자전거보관소', '분리수거장'],
    schools: [],
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: '서울 강남구 삼성동에 위치한 강변삼부아파트입니다. 국토교통부 실거래 데이터가 실시간 연동되어 있습니다.',
    is_real_price: true,
    umd_nm: '삼성동',
    jibun: '99-12',
    jibun_address: '서울 강남구 삼성동 99-12',
    sgg_cd: '11680',
    bjd_code: '11680'
  },
  {
    id: 'rtms-11680-99-13',
    name: '삼부아파트',
    region: '서울 강남구',
    district: '삼성동',
    api_region: '서울 강남구',
    lat: 37.516993,
    lng: 127.065140,
    avgPrice: 200000,
    price_min: 145000,
    price_max: 200000,
    rent_min: 0,
    rent_max: 0,
    gapPrice: 0,
    area_sqm: 84,
    area_pyeong: 32,
    built_year: 1999,
    household_count: 48,
    dong_count: 1,
    floor_top: 12,
    floor_base: 1,
    approval_date: '1999.09.28',
    construction: '삼부토건(주)',
    developer: '시행사/사업주체',
    parking_ratio: 1.0,
    parking_total: 48,
    ev_charger_count: 1,
    heating_type: '개별난방',
    hall_type: '계단식',
    far: 230,
    bcr: 22,
    school_score: 90,
    traffic_score: 93,
    nature_score: 87,
    walk_minutes: 8,
    tags: ['공동주택', '실거래가연동'],
    facilities: ['관리사무소', '주민공동시설', '자전거보관소', '분리수거장'],
    schools: [],
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    description: '서울 강남구 삼성동에 위치한 삼부아파트입니다. 국토교통부 실거래 데이터가 실시간 연동되어 있습니다.',
    is_real_price: true,
    umd_nm: '삼성동',
    jibun: '99-13',
    jibun_address: '서울 강남구 삼성동 99-13',
    sgg_cd: '11680',
    bjd_code: '11680'
  }
];

// 중복 여부 확인 후 추가
newApts.forEach(apt => {
  const existing = data.find(a => a.id === apt.id || (a.district === apt.district && a.jibun === apt.jibun));
  if (!existing) {
    data.push(apt);
    console.log('[단지추가]', apt.name, apt.district, apt.jibun, apt.avgPrice + '만');
  } else {
    console.log('[기존단지갱신]', existing.name, '->', apt.name);
    Object.assign(existing, apt);
  }
});

fs.writeFileSync(MASTER_PATH, JSON.stringify(data, null, 2), 'utf8');
console.log('총 단지 수:', data.length);
console.log('저장 완료!');
