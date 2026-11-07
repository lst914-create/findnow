const fs = require('fs');
const list = JSON.parse(fs.readFileSync('./src/lib/apartments-master.json', 'utf8'));

// 동별 평균 시세 계산
const dongPrices = {};
list.forEach(a => {
  if (!a.region || !a.district || !a.price_max) return;
  const key = `${a.region}_${a.district}`;
  if (!dongPrices[key]) dongPrices[key] = [];
  dongPrices[key].push(a.price_max);
});

const dongMedians = {};
Object.keys(dongPrices).forEach(k => {
  const arr = dongPrices[k].sort((a,b) => a-b);
  dongMedians[k] = arr[Math.floor(arr.length / 2)];
});

// 동네 중간값 대비 3배 이상 비정상적으로 튀는 단지 (단, 20억 미만 동네에서 발생한 이상치)
const priceAnomalies = [];
list.forEach(a => {
  if (!a.region || !a.district || !a.price_max) return;
  const key = `${a.region}_${a.district}`;
  const median = dongMedians[key];
  if (!median || median < 10000) return; // 1억 미만 동네 제외
  
  // 강남/서초/용산/송파 등 펜트하우스 밀집 지역은 제외
  if (/강남|서초|용산|송파|성동/.test(a.region)) return;
  
  if (a.price_max > median * 3.5 && a.price_max >= 100000) {
    priceAnomalies.push({
      id: a.id,
      name: a.name,
      region: a.region,
      district: a.district,
      price: a.price_max,
      dongMedian: median,
      ratio: (a.price_max / median).toFixed(1)
    });
  }
});

console.log('Price anomalies count:', priceAnomalies.length);
priceAnomalies.forEach(p => {
  console.log(`[시세 괴리 ${p.ratio}배] ${p.id} | ${p.name} | ${p.region} ${p.district} | 단지시세: ${p.price}만원 vs 동중간값: ${p.dongMedian}만원`);
});

