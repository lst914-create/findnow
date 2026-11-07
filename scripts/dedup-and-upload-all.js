const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

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

async function main() {
  const masterPath = path.resolve(__dirname, '../src/lib/apartments-master.json');
  const raw = fs.readFileSync(masterPath, 'utf-8');
  const list = JSON.parse(raw);

  // ID 기준 중복 제거 (유일한 ID만 유지)
  const uniqueMap = new Map();
  list.forEach((apt) => {
    if (!uniqueMap.has(apt.id)) {
      uniqueMap.set(apt.id, apt);
    }
  });

  const uniqueList = Array.from(uniqueMap.values());
  console.log(`기존 단지: ${list.length.toLocaleString()}개 -> ID 고유 단지: ${uniqueList.length.toLocaleString()}개`);

  // apartments-master.json 중복 제거본 저장
  fs.writeFileSync(masterPath, JSON.stringify(uniqueList, null, 2), 'utf-8');
  console.log('✅ apartments-master.json 중복 제거 완료!');

  // Supabase에 500개씩 일괄 Upsert
  const BATCH_SIZE = 500;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < uniqueList.length; i += BATCH_SIZE) {
    const chunk = uniqueList.slice(i, i + BATCH_SIZE).map((apt) => ({
      id: String(apt.id),
      name: apt.name || '',
      region: apt.region || '',
      district: apt.district || '',
      api_region: apt.apiRegion || null,
      lat: apt.lat ? Number(apt.lat) : null,
      lng: apt.lng ? Number(apt.lng) : null,
      price_min: apt.price_min ?? null,
      price_max: apt.price_max ?? null,
      rent_min: apt.rent_min ?? null,
      rent_max: apt.rent_max ?? null,
      gap_price: apt.gapPrice ?? null,
      jeonse_ratio: apt.jeonseRatio ?? null,
      area_sqm: apt.area_sqm ? Number(apt.area_sqm) : null,
      area_pyeong: apt.area_pyeong ?? null,
      built_year: apt.built_year ?? null,
      household_count: apt.household_count ?? null,
      dong_count: apt.dong_count ?? null,
      floor_top: apt.floor_top ?? null,
      floor_base: apt.floor_base ?? null,
      approval_date: apt.approval_date || null,
      construction: apt.construction || null,
      developer: apt.developer || null,
      parking_ratio: apt.parkingRatio ? Number(apt.parkingRatio) : null,
      heating_type: apt.heatingType || null,
      heating_fuel: apt.heatingFuel || null,
      school_score: apt.school_score ?? null,
      traffic_score: apt.traffic_score ?? null,
      nature_score: apt.nature_score ?? null,
      walk_minutes: apt.walk_minutes ?? null,
      tags: Array.isArray(apt.tags) ? apt.tags : [],
      facilities: Array.isArray(apt.facilities) ? apt.facilities : [],
      schools: Array.isArray(apt.schools) ? apt.schools : [],
      image_url: apt.image_url || null,
      description: apt.description || null,
      is_real_price: !!apt.isRealPrice,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('apartments').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`❌ 배치 ${Math.floor(i / BATCH_SIZE) + 1} 업로드 실패:`, error.message);
      failCount += chunk.length;
    } else {
      successCount += chunk.length;
      process.stdout.write(`\r진행률: ${successCount.toLocaleString()} / ${uniqueList.length.toLocaleString()} 완료 (${Math.round((successCount / uniqueList.length) * 100)}%)`);
    }
  }

  console.log(`\n\n🎉 Supabase 동기화 최종 완료! 성공: ${successCount.toLocaleString()}개 / 실패: ${failCount}개`);
}

main().catch(console.error);

