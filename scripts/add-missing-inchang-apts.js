const fs = require('fs');
const path = require('path');

const masterPath = path.join(__dirname, '../src/lib/apartments-master.json');
const publicPath = path.join(__dirname, '../public/data/master_apartments.json');

const master = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

// 인창동 소규모 실존 아파트 4개 정식 등록
const newApts = [
  {
    id: "kakao-inchang-donga",
    name: "인창동아아파트",
    region: "경기 구리시",
    district: "인창동",
    price_min: 35000,
    price_max: 42500,
    rent_min: 22000,
    rent_max: 27000,
    gapPrice: 13000,
    jeonseRatio: 63,
    area_sqm: 59,
    area_pyeong: 24,
    built_year: 1997,
    household_count: 58,
    school_score: 78,
    traffic_score: 85,
    nature_score: 75,
    tags: ["공동주택", "소형아파트", "구리역세권", "실거래인증"],
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    lat: 37.602050,
    lng: 127.139584,
    walk_minutes: 5,
    description: "경기 구리시 인창동 276-3에 위치한 소규모 아파트입니다. 국토교통부 실거래 데이터(2026.06 최신 체결 3.5억)가 연동되어 있습니다.",
    dong_count: 1,
    floor_top: 5,
    floor_base: 1,
    approval_date: "1997.05.20",
    construction: "동아건설",
    parkingRatio: 0.8,
    parking_total: 46,
    heatingType: "개별난방",
    heatingFuel: "도시가스",
    hallType: "계단식",
    area_distributions: [
      { label: "전용 46㎡ (19평)", pyeong: 19, units: 28, ratio: 48 },
      { label: "전용 59㎡ (24평)", pyeong: 24, units: 30, ratio: 52 }
    ],
    isRealPrice: true
  },
  {
    id: "kakao-inchang-daemyung",
    name: "인창대명아파트",
    region: "경기 구리시",
    district: "인창동",
    price_min: 82000,
    price_max: 87000,
    rent_min: 52000,
    rent_max: 55000,
    gapPrice: 30000,
    jeonseRatio: 63,
    area_sqm: 94,
    area_pyeong: 36,
    built_year: 2002,
    household_count: 42,
    school_score: 80,
    traffic_score: 82,
    nature_score: 75,
    tags: ["공동주택", "중대형아파트", "구리역세권", "실거래인증"],
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    lat: 37.602536,
    lng: 127.133416,
    walk_minutes: 7,
    description: "경기 구리시 인창동 610-81에 위치한 공동주택입니다. 국토교통부 실거래 데이터(2026.09 최신 체결 8.7억)가 연동되어 있습니다.",
    dong_count: 1,
    floor_top: 4,
    floor_base: 1,
    approval_date: "2002.09.15",
    construction: "대명종합건설",
    parkingRatio: 1.0,
    parking_total: 42,
    heatingType: "개별난방",
    heatingFuel: "도시가스",
    hallType: "계단식",
    area_distributions: [
      { label: "전용 94㎡ (36평)", pyeong: 36, units: 42, ratio: 100 }
    ],
    isRealPrice: true
  },
  {
    id: "kakao-inchang-posphil",
    name: "인창포스필아파트",
    region: "경기 구리시",
    district: "인창동",
    price_min: 19000,
    price_max: 19000,
    rent_min: 12000,
    rent_max: 13000,
    gapPrice: 7000,
    jeonseRatio: 65,
    area_sqm: 54,
    area_pyeong: 22,
    built_year: 2003,
    household_count: 29,
    school_score: 80,
    traffic_score: 83,
    nature_score: 75,
    tags: ["공동주택", "소형아파트", "역세권"],
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    lat: 37.602737,
    lng: 127.134671,
    walk_minutes: 6,
    description: "경기 구리시 인창동 605-36에 위치한 소규모 공동주택입니다. 국토교통부 실거래 데이터(1.9억)가 연동되어 있습니다.",
    dong_count: 1,
    floor_top: 4,
    floor_base: 1,
    approval_date: "2003.04.10",
    construction: "포스필건설",
    parkingRatio: 0.8,
    parking_total: 24,
    heatingType: "개별난방",
    heatingFuel: "도시가스",
    hallType: "계단식",
    area_distributions: [
      { label: "전용 54㎡ (22평)", pyeong: 22, units: 29, ratio: 100 }
    ],
    isRealPrice: true
  },
  {
    id: "kakao-inchang-dongsan",
    name: "인창동산아트빌아파트",
    region: "경기 구리시",
    district: "인창동",
    price_min: 0,
    price_max: 0,
    rent_min: 0,
    rent_max: 0,
    gapPrice: 0,
    jeonseRatio: 60,
    area_sqm: 60,
    area_pyeong: 24,
    built_year: 2002,
    household_count: 32,
    school_score: 82,
    traffic_score: 80,
    nature_score: 75,
    tags: ["공동주택", "소형아파트"],
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
    lat: 37.603918,
    lng: 127.132213,
    walk_minutes: 8,
    description: "경기 구리시 인창동 557-2에 위치한 소규모 공동주택입니다. 최근 18개월간 국토교통부 실거래 신고 내역이 없습니다.",
    dong_count: 1,
    floor_top: 4,
    floor_base: 1,
    approval_date: "2002.11.05",
    construction: "동산종합건설",
    parkingRatio: 0.8,
    parking_total: 26,
    heatingType: "개별난방",
    heatingFuel: "도시가스",
    hallType: "계단식",
    area_distributions: [
      { label: "전용 60㎡ (24평)", pyeong: 24, units: 32, ratio: 100 }
    ],
    isRealPrice: false
  }
];

// 기존 중복 제거 후 추가
newApts.forEach(apt => {
  const existingIdx = master.findIndex(a => a.id === apt.id || (a.name === apt.name && a.district === apt.district));
  if (existingIdx !== -1) {
    master[existingIdx] = apt;
    console.log(`기존 단지 업데이트: ${apt.name}`);
  } else {
    master.push(apt);
    console.log(`신규 단지 추가: ${apt.name}`);
  }
});

fs.writeFileSync(masterPath, JSON.stringify(master, null, 2), 'utf8');
console.log(`✅ ${masterPath} 저장 완료 (총 ${master.length}개 단지)`);

if (fs.existsSync(publicPath)) {
  fs.writeFileSync(publicPath, JSON.stringify(master, null, 2), 'utf8');
  console.log(`✅ ${publicPath} 동기화 완료`);
}
