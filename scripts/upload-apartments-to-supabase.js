/**
 * apartments-master.json -> Supabase apartments 테이블 대량 업로드 스크립트
 */
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// .env.local 로딩
const env = {};
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) env[match[1]] = (match[2] || '').trim().replace(/^['"]|['"]$/g, '');
  });
}

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fkkbusvufaumzizzxpqe.supabase.co';
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function upload() {
  console.log('🚀 apartments-master.json 로딩 중...');
  const jsonPath = path.join(__dirname, '../src/lib/apartments-master.json');
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const data = JSON.parse(raw);

  const list = Array.isArray(data) ? data : Object.values(data);
  console.log(`총 ${list.length.toLocaleString()}개 단지 데이터 준비 완료.`);

  // 500개 단위 배치 업로드
  const BATCH_SIZE = 500;
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < list.length; i += BATCH_SIZE) {
    const chunk = list.slice(i, i + BATCH_SIZE).map((apt) => ({
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
      parking_total: apt.parking_total ?? null,
      parking_ground: apt.parking_ground ?? null,
      parking_underground: apt.parking_underground ?? null,
      ev_charger_count: apt.ev_charger_count ?? null,
      heating_type: apt.heatingType || null,
      heating_fuel: apt.heatingFuel || null,
      hall_type: apt.hallType || null,
      far: apt.far ?? null,
      bcr: apt.bcr ?? null,
      management_type: apt.managementType || null,
      management_tel: apt.managementTel || null,
      cctv_count: apt.cctvCount ?? null,
      elevator_count: apt.elevatorCount ?? null,
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
      area_distributions: apt.area_distributions ? apt.area_distributions : null,
      updated_at: new Date().toISOString(),
    }));

    const { error } = await supabase.from('apartments').upsert(chunk, { onConflict: 'id' });

    if (error) {
      console.error(`❌ 배치 ${i / BATCH_SIZE + 1} 업로드 실패:`, error.message);
      failCount += chunk.length;
      // 첫 실패 시 상세 에러 출력 후 중단
      if (i === 0) {
        console.error('상세 에러 원인:', error);
        return;
      }
    } else {
      successCount += chunk.length;
      process.stdout.write(`\r진행률: ${successCount.toLocaleString()} / ${list.length.toLocaleString()} 완료 (${Math.round((successCount / list.length) * 100)}%)`);
    }
  }

  console.log(`\n\n🎉 업로드 완료! 성공: ${successCount.toLocaleString()}개 / 실패: ${failCount}개`);
}

upload().catch(console.error);

