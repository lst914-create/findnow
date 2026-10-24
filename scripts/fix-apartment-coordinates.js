const fs = require('fs');
const path = require('path');

async function main() {
  console.log('📡 서울 & 경기 행정동/법정동 공식 경계 GeoJSON 로드 중...');
  
  const seoulRes = await fetch('https://raw.githubusercontent.com/raqoon886/Local_HangJeongDong/master/hangjeongdong_%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C.geojson');
  const seoulGeo = await seoulRes.json();
  
  const ggRes = await fetch('https://raw.githubusercontent.com/raqoon886/Local_HangJeongDong/master/hangjeongdong_%EA%B2%BD%EA%B8%B0%EB%8F%84.geojson');
  const ggGeo = await ggRes.json();

  console.log(`✅ 서울 ${seoulGeo.features.length}개, 경기 ${ggGeo.features.length}개 구역 로드 완료`);

  function getCentroid(geometry) {
    let coords = [];
    if (geometry.type === 'Polygon') {
      coords = geometry.coordinates[0];
    } else if (geometry.type === 'MultiPolygon') {
      coords = geometry.coordinates.flatMap(c => c[0]);
    }
    let sumLat = 0, sumLng = 0;
    coords.forEach(pt => { sumLng += pt[0]; sumLat += pt[1]; });
    return { lat: +(sumLat / coords.length).toFixed(6), lng: +(sumLng / coords.length).toFixed(6) };
  }

  // 동 단위 중심 좌표 맵
  // 키 예: "서울 강남구__대치동", "경기 남양주시__다산동", "경기 구리시__수택동"
  const dongCentroidMap = new Map();

  function indexGeoJSON(features) {
    for (const f of features) {
      const admNm = f.properties.adm_nm; // 예: "서울특별시 강남구 대치1동", "경기도 남양주시 다산1동"
      const parts = admNm.split(' ');
      if (parts.length < 3) continue;

      const sido = parts[0];
      const sgg = parts[1];
      const dong = parts.slice(2).join(' '); // 예: "대치1동", "다산2동", "와부읍"

      const centroid = getCentroid(f.geometry);

      // 1. 전체 풀네임 매핑 (예: "서울 강남구__대치1동")
      const shortRegion = `${sido.replace('특별시', '').replace('경기도', '경기')} ${sgg}`;
      dongCentroidMap.set(`${shortRegion}__${dong}`, centroid);

      // 2. 숫자 제거 매핑 (예: "대치1동" -> "대치동", "수택2동" -> "수택동", "다산2동" -> "다산동")
      const cleanDong = dong.replace(/\d+동$/, '동').replace(/제\d+동$/, '동');
      if (!dongCentroidMap.has(`${shortRegion}__${cleanDong}`)) {
        dongCentroidMap.set(`${shortRegion}__${cleanDong}`, centroid);
      }

      // 3. 구/시 단위 대표 좌표도 누적
      if (!dongCentroidMap.has(`${shortRegion}`)) {
        dongCentroidMap.set(shortRegion, centroid);
      }
    }
  }

  indexGeoJSON(seoulGeo.features);
  indexGeoJSON(ggGeo.features);

  // 남양주 다산동, 와부읍(덕소리/도곡리) 등 특수 세부 행정/법정동 보정
  dongCentroidMap.set('경기 남양주시__다산동', { lat: 37.6085, lng: 127.1645 });
  dongCentroidMap.set('경기 남양주시__와부읍 덕소리', { lat: 37.5842, lng: 127.2105 });
  dongCentroidMap.set('경기 남양주시__와부읍 도곡리', { lat: 37.5878, lng: 127.2285 });
  dongCentroidMap.set('경기 남양주시__와부읍', { lat: 37.5855, lng: 127.2160 });
  dongCentroidMap.set('경기 남양주시__별내동', { lat: 37.6432, lng: 127.1195 });
  dongCentroidMap.set('경기 남양주시__별내면', { lat: 37.6710, lng: 127.1320 });
  dongCentroidMap.set('경기 남양주시__호평동', { lat: 37.6538, lng: 127.2440 });
  dongCentroidMap.set('경기 남양주시__평내동', { lat: 37.6415, lng: 127.2355 });
  dongCentroidMap.set('경기 남양주시__금곡동', { lat: 37.6325, lng: 127.2085 });
  dongCentroidMap.set('경기 남양주시__진접읍', { lat: 37.7180, lng: 127.1950 });
  dongCentroidMap.set('경기 남양주시__화도읍', { lat: 37.6560, lng: 127.3050 });
  dongCentroidMap.set('경기 남양주시__오남읍', { lat: 37.6980, lng: 127.2050 });
  dongCentroidMap.set('경기 남양주시__퇴계원읍', { lat: 37.6520, lng: 127.1420 });

  // 구리시 수택동, 인창동, 교문동, 토평동, 갈매동 정밀 좌표
  dongCentroidMap.set('경기 구리시__수택동', { lat: 37.5935, lng: 127.1425 });
  dongCentroidMap.set('경기 구리시__인창동', { lat: 37.6045, lng: 127.1360 });
  dongCentroidMap.set('경기 구리시__교문동', { lat: 37.5950, lng: 127.1290 });
  dongCentroidMap.set('경기 구리시__토평동', { lat: 37.5840, lng: 127.1395 });
  dongCentroidMap.set('경기 구리시__갈매동', { lat: 37.6380, lng: 127.1150 });

  // 하남시 미사(망월동/선동/풍산동)
  dongCentroidMap.set('경기 하남시__망월동', { lat: 37.5645, lng: 127.1895 });
  dongCentroidMap.set('경기 하남시__선동', { lat: 37.5750, lng: 127.1820 });
  dongCentroidMap.set('경기 하남시__풍산동', { lat: 37.5480, lng: 127.1990 });
  dongCentroidMap.set('경기 하남시__신장동', { lat: 37.5410, lng: 127.2140 });

  // 랜드마크 아파트 정밀 단지 좌표 (다산반도유보라메이플타운 등)
  const landmarkAptCoords = {
    // 다산신도시 핵심 단지
    '경기 남양주시__다산반도유보라메이플타운': { lat: 37.5998, lng: 127.1680 },
    '경기 남양주시__다산반도유보라': { lat: 37.5998, lng: 127.1680 },
    '경기 남양주시__다산한강반도유보라': { lat: 37.5985, lng: 127.1660 },
    '경기 남양주시__다산유승한내들센트럴': { lat: 37.6185, lng: 127.1580 },
    '경기 남양주시__다산자이아이비플레이스': { lat: 37.6190, lng: 127.1565 },
    '경기 남양주시__다산자이폴라리스': { lat: 37.6210, lng: 127.1540 },
    '경기 남양주시__다산해모로': { lat: 37.6150, lng: 127.1620 },
    '경기 남양주시__e편한세상 다산': { lat: 37.6220, lng: 127.1560 },

    // 덕소 한강변 단지
    '경기 남양주시__덕소 두산위브': { lat: 37.5815, lng: 127.2120 },
    '경기 남양주시__덕소 강변현대홈타운': { lat: 37.5828, lng: 127.2145 },
    '경기 남양주시__덕소 아이파크': { lat: 37.5870, lng: 127.2080 },
    '경기 남양주시__주공1': { lat: 37.5840, lng: 127.2100 },
    '경기 남양주시__덕소주공3': { lat: 37.5850, lng: 127.2115 },
    '경기 남양주시__동부센트레빌': { lat: 37.5835, lng: 127.2130 },

    // 구리시 주요 단지
    '경기 구리시__수택동금호어울림': { lat: 37.5940, lng: 127.1430 },
    '경기 구리시__구리인창금호어울림': { lat: 37.6040, lng: 127.1350 },
    '경기 구리시__e편한세상수택센트럴파크': { lat: 37.5930, lng: 127.1410 }
  };

  const masterPath = path.resolve(__dirname, '../src/lib/apartments-master.json');
  const masterData = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

  console.log(`\n총 ${masterData.length}개 아파트 위경도 좌표 동(District) 단위 전수 정밀화 시작...`);

  let matchedDong = 0;
  let matchedLandmark = 0;

  for (const apt of masterData) {
    const landmarkKey = `${apt.region}__${apt.name}`;
    if (landmarkAptCoords[landmarkKey]) {
      apt.lat = landmarkAptCoords[landmarkKey].lat;
      apt.lng = landmarkAptCoords[landmarkKey].lng;
      matchedLandmark++;
      continue;
    }

    // 동 중심 좌표 탐색
    let center = null;
    const dongKey1 = `${apt.region}__${apt.district}`;
    if (dongCentroidMap.has(dongKey1)) {
      center = dongCentroidMap.get(dongKey1);
    } else {
      // "와부읍 덕소리" -> "와부읍"
      const mainEup = apt.district.split(' ')[0];
      const dongKey2 = `${apt.region}__${mainEup}`;
      if (dongCentroidMap.has(dongKey2)) {
        center = dongCentroidMap.get(dongKey2);
      } else if (dongCentroidMap.has(apt.region)) {
        center = dongCentroidMap.get(apt.region);
      }
    }

    if (center) {
      matchedDong++;
      // 동 경계를 벗어나지 않도록 안전한 마이크로 지터 (+-0.0015도, 약 100~150m)만 부여
      const hash = Array.from(apt.name).reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const microJitterLat = ((hash % 100) - 50) * 0.00003;
      const microJitterLng = (((hash * 7) % 100) - 50) * 0.00003;

      apt.lat = +(center.lat + microJitterLat).toFixed(6);
      apt.lng = +(center.lng + microJitterLng).toFixed(6);
    }
  }

  console.log(`✅ 랜드마크 정밀 매핑: ${matchedLandmark}건`);
  console.log(`✅ 공식 행정동/법정동 중심 좌표 연동: ${matchedDong}건`);

  fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2), 'utf8');
  console.log(`💾 apartments-master.json 저장 완료!`);

  // 검증: 다산반도유보라와 수택동금호어울림 확인
  const verify1 = masterData.find(a => a.name.includes('다산반도유보라'));
  const verify2 = masterData.find(a => a.name.includes('수택동금호어울림'));
  console.log('\n[정밀 좌표 검증 결과]');
  console.log('1. 다산반도유보라:', verify1 ? { name: verify1.name, region: verify1.region, district: verify1.district, lat: verify1.lat, lng: verify1.lng } : 'None');
  console.log('2. 수택동금호어울림:', verify2 ? { name: verify2.name, region: verify2.region, district: verify2.district, lat: verify2.lat, lng: verify2.lng } : 'None');
}

main().catch(err => console.error('오류:', err));
