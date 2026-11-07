const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const env = {};
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
  });
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || 'https://fkkbusvufaumzizzxpqe.supabase.co';
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// 국토부 실제 최근 1개월/최종 실거래가 기준값 매핑
const REAL_PRICES = {
  "다산한강반도유보라": { price: 102000, rent: 68000, pyeong: 34 },
  "다산금강펜테리움리버테라스2차": { price: 110000, rent: 65000, pyeong: 34 },
  "다산신안인스빌퍼스트리버": { price: 98000, rent: 58000, pyeong: 34 },
  "다산금강펜테리움리버테라스1차": { price: 109000, rent: 62000, pyeong: 34 },
  "다산신안인스빌퍼스트포레": { price: 101000, rent: 59000, pyeong: 34 },
  "한화꿈에그린아파트": { price: 75000, rent: 45000, pyeong: 34 },
  "한화꿈에그린": { price: 75000, rent: 45000, pyeong: 34 },
  "남양주다산롯데낙천대아파트": { price: 72800, rent: 43000, pyeong: 34 },
  "제일아파트": { price: 42000, rent: 26000, pyeong: 26 },
  "창조아파트": { price: 17000, rent: 11000, pyeong: 24 },
  "교문장자마을신명": { price: 78000, rent: 48000, pyeong: 34 },
};

async function main() {
  const masterPath = path.resolve(__dirname, '../src/lib/apartments-master.json');
  const list = JSON.parse(fs.readFileSync(masterPath, 'utf-8'));

  let updatedCount = 0;
  const toUpsert = [];

  list.forEach((apt) => {
    for (const [key, val] of Object.entries(REAL_PRICES)) {
      if (apt.name.includes(key)) {
        apt.price_min = val.price;
        apt.price_max = val.price;
        apt.rent_min = val.rent;
        apt.rent_max = val.rent;
        apt.area_pyeong = val.pyeong;
        apt.isRealPrice = true;
        updatedCount++;
        toUpsert.push(apt);
        break;
      }
    }
  });

  console.log(`단지 가격 동기화: ${updatedCount}개 갱신 완료`);
  fs.writeFileSync(masterPath, JSON.stringify(list, null, 2), 'utf-8');

  if (SERVICE_ROLE_KEY && toUpsert.length > 0) {
    const chunk = toUpsert.map((apt) => ({
      id: String(apt.id),
      name: apt.name,
      region: apt.region,
      district: apt.district,
      lat: apt.lat,
      lng: apt.lng,
      price_min: apt.price_min,
      price_max: apt.price_max,
      rent_min: apt.rent_min,
      rent_max: apt.rent_max,
      area_sqm: apt.area_sqm,
      area_pyeong: apt.area_pyeong,
      is_real_price: true,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('apartments').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error('Supabase update failed:', error.message);
    } else {
      console.log(`Supabase ${chunk.length}개 단지 동기화 완료!`);
    }
  }
}

main().catch(console.error);
