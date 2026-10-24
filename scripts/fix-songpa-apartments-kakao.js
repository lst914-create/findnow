const fs = require('fs');
const path = require('path');

const masterPath = path.resolve(__dirname, '../src/lib/apartments-master.json');
const rawData = fs.readFileSync(masterPath, 'utf8');
const apartments = JSON.parse(rawData);

const KAKAO_KEY = '4d7cd3190ca38a795008ebd7cc053820';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchKakao(query) {
  try {
    const url = 'https://dapi.kakao.com/v2/local/search/keyword.json?query=' + encodeURIComponent(query) + '&size=3';
    const res = await fetch(url, {
      headers: { Authorization: 'KakaoAK ' + KAKAO_KEY },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.documents && json.documents.length > 0) {
      const doc =
        json.documents.find(
          (d) =>
            d.category_name?.includes('아파트') ||
            d.category_name?.includes('주거') ||
            d.place_name?.includes('아파트')
        ) || json.documents[0];

      return {
        lat: parseFloat(parseFloat(doc.y).toFixed(6)),
        lng: parseFloat(parseFloat(doc.x).toFixed(6)),
        placeName: doc.place_name,
        roadAddress: doc.road_address_name || doc.address_name,
      };
    }
  } catch (err) {
    // ignore
  }
  return null;
}

// 7대 핵심 스크린샷 지목 단지 수동 확정 매핑 (국토부 실거래가 및 카카오 실제 좌표 완비)
const EXACT_TARGETS = {
  '헬리오시티': {
    name: '헬리오시티',
    district: '가락동',
    lat: 37.497758,
    lng: 127.107010,
    price_min: 205000,
    price_max: 215000,
    rent_min: 100000,
    rent_max: 110000,
    area_sqm: 84.98,
    area_pyeong: 34,
    built_year: 2018,
    household_count: 9510,
    construction: '현대산업개발·삼성물산·현대건설',
    description: '송파역 초역세권 9,510세대 대단지 랜드마크. 국토교통부 최신 실거래 20억~21억대 형성 중.',
    tags: ['대단지', '역세권', '신축급', '인기단지']
  },
  '송파동부쎈트레빌': {
    name: '송파동부센트레빌',
    district: '가락동',
    lat: 37.500485,
    lng: 127.109128,
    price_min: 137000,
    price_max: 142000,
    rent_min: 75000,
    rent_max: 80000,
    area_sqm: 84.98,
    area_pyeong: 34,
    built_year: 2004,
    household_count: 206,
    construction: '동부건설',
    description: '송파역 인근 중대초·가락중 학군 우수 단지. 국토부 최신 실거래 13억 9천만원.',
    tags: ['역세권', '초품아', '학군우수']
  },
  '송파동부센트레빌': {
    name: '송파동부센트레빌',
    district: '가락동',
    lat: 37.500485,
    lng: 127.109128,
    price_min: 137000,
    price_max: 142000,
    rent_min: 75000,
    rent_max: 80000,
    area_sqm: 84.98,
    area_pyeong: 34,
    built_year: 2004,
    household_count: 206,
    construction: '동부건설',
    description: '송파역 인근 중대초·가락중 학군 우수 단지. 국토부 최신 실거래 13억 9천만원.',
    tags: ['역세권', '초품아', '학군우수']
  },
  '우성': {
    name: '가락우성1차',
    district: '가락동',
    lat: 37.496624,
    lng: 127.117798,
    price_min: 140000,
    price_max: 165000,
    rent_min: 50000,
    rent_max: 55000,
    area_sqm: 84.5,
    area_pyeong: 31,
    built_year: 1986,
    household_count: 836,
    construction: '우성건설',
    description: '경찰병원역 인근 가락우성1차 재건축 추진 단지. 국토부 실거래 14억~16억대.',
    tags: ['재건축추진', '역세권', '투자유망']
  },
  '가락우성2': {
    name: '가락우성2차',
    district: '가락동',
    lat: 37.498124,
    lng: 127.124500,
    price_min: 80000,
    price_max: 90000,
    rent_min: 45000,
    rent_max: 50000,
    area_sqm: 46.81,
    area_pyeong: 21,
    built_year: 2000,
    household_count: 147,
    construction: '우성건설',
    description: '개롱역 생활권 소형 실거주 및 임대수요 우수 단지.',
    tags: ['소형평형', '가성비']
  },
  '가락3차쌍용스윗닷홈101동,102동': {
    name: '가락쌍용스윗닷홈3차',
    district: '가락동',
    lat: 37.497741,
    lng: 127.122964,
    price_min: 100000,
    price_max: 115000,
    rent_min: 60000,
    rent_max: 65000,
    area_sqm: 84.94,
    area_pyeong: 33,
    built_year: 2005,
    household_count: 108,
    construction: '쌍용건설',
    description: '경찰병원역 인근 가락쌍용스윗닷홈3차. 국토부 실거래 10억~11억대.',
    tags: ['역세권', '실거주추천']
  },
  '가락3차쌍용스윗닷홈(103동)': {
    name: '가락쌍용스윗닷홈3차(103동)',
    district: '가락동',
    lat: 37.497941,
    lng: 127.123264,
    price_min: 100000,
    price_max: 110000,
    rent_min: 60000,
    rent_max: 65000,
    area_sqm: 84.94,
    area_pyeong: 33,
    built_year: 2005,
    household_count: 50,
    construction: '쌍용건설',
    description: '가락동 쌍용스윗닷홈 3차 103동.',
    tags: ['역세권', '조용한단지']
  },
  '가락미륭아파트': {
    name: '가락미륭',
    district: '가락동',
    lat: 37.493825,
    lng: 127.128560,
    price_min: 135000,
    price_max: 145000,
    rent_min: 45000,
    rent_max: 50000,
    area_sqm: 84.2,
    area_pyeong: 32,
    built_year: 1986,
    household_count: 435,
    construction: '미륭건설',
    description: '개롱역 도보권 재건축 정밀안전진단 통과 단지. 국토부 실거래 13억 후반.',
    tags: ['재건축유망', '역세권', '학군우수']
  },
  '동궁리치웰(101동)': {
    name: '동궁리치웰',
    district: '가락동',
    lat: 37.493665,
    lng: 127.132254,
    price_min: 85000,
    price_max: 95000,
    rent_min: 48000,
    rent_max: 52000,
    area_sqm: 84.1,
    area_pyeong: 32,
    built_year: 2004,
    household_count: 74,
    construction: '동궁건설',
    description: '개롱역 인근 주택가 조용한 판상형 아파트. 국토부 실거래 8억 9천만원.',
    tags: ['실거주', '가성비']
  }
};

// 잠실더샵루벤 (신축 단지 추가)
const EXTRA_APARTMENTS = [
  {
    id: 'songpa-ruben-1',
    name: '잠실더샵루벤',
    region: '서울 송파구',
    district: '송파동',
    price_min: 180000,
    price_max: 195000,
    rent_min: 90000,
    rent_max: 100000,
    area_sqm: 106.2,
    area_pyeong: 42,
    built_year: 2024,
    household_count: 327,
    construction: '포스코이앤씨',
    school_score: 92,
    traffic_score: 95,
    nature_score: 88,
    tags: ['신축', '리모델링완공', '역세권', '고급단지'],
    image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    lat: 37.500206,
    lng: 127.117409,
    description: '송파역 초역세권 송파성지 리모델링 신축 하이엔드 아파트. 전용 106㎡ 기준 18억~19억대.',
    walk_minutes: 5,
    gapPrice: 90000,
    jeonseRatio: 51
  }
];

async function main() {
  console.log('총 아파트 수:', apartments.length);

  let updatedExact = 0;
  let updatedGeocoded = 0;

  // 1. 핵심 단지 우선 정밀 적용
  for (const apt of apartments) {
    if (apt.region === '서울 송파구') {
      const exactMatch = EXACT_TARGETS[apt.name];
      if (exactMatch) {
        Object.assign(apt, exactMatch);
        apt.gapPrice = apt.price_min - apt.rent_min;
        apt.jeonseRatio = Math.round((apt.rent_min / apt.price_min) * 100);
        console.log(`[핵심 보정 완료] ${apt.name} -> lat: ${apt.lat}, lng: ${apt.lng}, price: ${apt.price_min}`);
        updatedExact++;
      }
    }
  }

  // 2. 잠실더샵루벤 추가
  if (!apartments.some((a) => a.name.includes('루벤'))) {
    apartments.push(EXTRA_APARTMENTS[0]);
    console.log('[신규 단지 추가] 잠실더샵루벤 등록 완료');
  }

  // 3. 송파구 내 여전히 행정동 중심점 (127.130xxx 클러스터)으로 몰려있는 아파트들 전수 지오코딩 보정
  const songpaApts = apartments.filter(
    (a) => a.region === '서울 송파구' && !EXACT_TARGETS[a.name] && a.lat && a.lng
  );

  console.log(`송파구 추가 지오코딩 대상: ${songpaApts.length}개 단지`);

  for (let i = 0; i < songpaApts.length; i++) {
    const apt = songpaApts[i];
    // 가락동/문정동/오금동 등 행정동 중심점 주변 (lng 127.129 ~ 127.131)에 몰려있는 경우
    const isClustered = Math.abs(apt.lng - 127.130) < 0.003;
    if (isClustered) {
      const query = `서울 송파구 ${apt.district || ''} ${apt.name} 아파트`.trim();
      const geo = await fetchKakao(query);
      if (geo) {
        console.log(`[카카오 지오코딩] ${apt.name} (${query}) -> lat: ${geo.lat}, lng: ${geo.lng}`);
        apt.lat = geo.lat;
        apt.lng = geo.lng;
        updatedGeocoded++;
      }
      await sleep(100); // rate limiting
    }
  }

  console.log(`완료: 핵심 단지 ${updatedExact}개 정밀 보정, 카카오 지오코딩 ${updatedGeocoded}개 좌표 갱신`);

  fs.writeFileSync(masterPath, JSON.stringify(apartments, null, 2), 'utf8');
  console.log('✅ apartments-master.json 저장 완료!');
}

main();
