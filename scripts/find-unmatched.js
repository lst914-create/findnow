const fs = require('fs');
const path = require('path');

async function check() {
  const seoulGeo = await (await fetch('https://raw.githubusercontent.com/raqoon886/Local_HangJeongDong/master/hangjeongdong_%EC%84%9C%EC%9A%B8%ED%8A%B9%EB%B3%84%EC%8B%9C.geojson')).json();
  const ggGeo = await (await fetch('https://raw.githubusercontent.com/raqoon886/Local_HangJeongDong/master/hangjeongdong_%EA%B2%BD%EA%B8%B0%EB%8F%84.geojson')).json();

  function norm(s) {
    if (!s) return '';
    return s.replace(/특별시|광역시|특별자치시|특별자치도|경기도/g, '경기')
            .replace(/서울경기/g, '서울')
            .replace(/\s+/g, '')
            .replace(/·/g, '')
            .toLowerCase();
  }

  function getCentroid(geometry) {
    let coords = [];
    if (geometry.type === 'Polygon') coords = geometry.coordinates[0];
    else if (geometry.type === 'MultiPolygon') coords = geometry.coordinates.flatMap(c => c[0]);
    let sumLat = 0, sumLng = 0;
    coords.forEach(pt => { sumLng += pt[0]; sumLat += pt[1]; });
    return { lat: +(sumLat / coords.length).toFixed(6), lng: +(sumLng / coords.length).toFixed(6) };
  }

  const dongMap = new Map();
  function addCoord(region, dong, pt) {
    const rKey = norm(region);
    const dKey = norm(dong);
    dongMap.set(rKey + '__' + dKey, pt);
    const dClean = dong.replace(/\d+동$/, '동').replace(/\d+가$/, '동').replace(/제\d+/, '');
    dongMap.set(rKey + '__' + norm(dClean), pt);
    if (dong.includes('본동')) {
      dongMap.set(rKey + '__' + norm(dong.replace('본동', '동')), pt);
    }
    if (rKey.includes('부천시')) {
      const rNoGu = rKey.replace(/(원미구|소사구|오정구)/, '');
      dongMap.set(rNoGu + '__' + dKey, pt);
      dongMap.set(rNoGu + '__' + norm(dClean), pt);
    }
  }

  for (const f of [...seoulGeo.features, ...ggGeo.features]) {
    const pt = getCentroid(f.geometry);
    const parts = f.properties.adm_nm.split(' ');
    const region = parts.slice(0, 2).join('');
    const dong = parts.slice(2).join('');
    addCoord(region, dong, pt);
  }

  // apply-full-geo-mapping.js 의 수동 리스트들도 동일하게 추가
  // (부천, 군포, 오산, 광주, 양주, 하남, 파주, 시흥, 평택, 의정부, 이천, 안성, 여주 등)
  // apply-full-geo-mapping.js 에서 함수를 가져오거나 매핑 테이블 포함

  // 간편하게: apply-full-geo-mapping.js의 내용을 수정해서 정확한 fallback 목록을 파일로 덤프하도록 해보자.
}
