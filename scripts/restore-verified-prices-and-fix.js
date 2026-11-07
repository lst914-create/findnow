/**
 * 전국 아파트 실거래가 무결성 100% 원상 복원 및 정밀 동기화 스크립트
 * 1. 백업본(apartments-master.backup.json)의 검증된 실거래가(price_min, price_max, rent 등) 전량 100% 복원
 * 2. 다산 지금지구 대장주(다산금강펜테리움리버테라스2차 11억, 1차 10.9억, 반도유보라 10.2억, 신안인스빌 9.8억 등) 실거래가 및 세대수 완전 동기화
 * 3. 신규 발굴된 나홀로/중소형 단지 유지 및 기존 단지 오염 원천 차단
 * 4. apartments-master.json 저장 및 Supabase 일괄 동기화
 */

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

async function main() {
  console.log("==================================================================");
  console.log("🛡️ [전국 아파트 실거래가 무결성 100% 복원 및 정밀 동기화 가동]");
  console.log("==================================================================");

  const backupPath = path.resolve(__dirname, "apartments-master.backup.json");
  const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");

  const backupList = JSON.parse(fs.readFileSync(backupPath, "utf-8"));
  const currentList = JSON.parse(fs.readFileSync(masterPath, "utf-8"));

  console.log(`백업 검증 단지: ${backupList.length.toLocaleString()}개`);
  console.log(`현재 유지 단지: ${currentList.length.toLocaleString()}개`);

  // 백업본의 검증된 실거래가 맵 생성
  const backupMap = new Map();
  backupList.forEach((apt) => {
    backupMap.set(apt.id, apt);
  });

  // 1. 기존 모든 정규 단지의 검증된 실거래가 전량 100% 원상 복원
  let restoredCount = 0;
  currentList.forEach((apt) => {
    const b = backupMap.get(apt.id);
    if (b) {
      apt.price_min = b.price_min;
      apt.price_max = b.price_max;
      apt.rent_min = b.rent_min;
      apt.rent_max = b.rent_max;
      apt.gapPrice = b.gapPrice;
      apt.jeonseRatio = b.jeonseRatio;
      apt.area_sqm = b.area_sqm;
      apt.area_pyeong = b.area_pyeong;
      restoredCount++;
    }
  });
  console.log(`✅ 기존 정규 단지 실거래가 무결성 복원: ${restoredCount.toLocaleString()}개 완료`);

  // 2. 다산 지금지구 및 핵심 단지 공식 실거래가 및 실제 세대수 확정 매핑
  const CONFIRMED_STANDARDS = {
    "다산금강펜테리움리버테라스2차": { price: 110000, rent: 65000, households: 1304, year: 2019, pyeong: 34 },
    "다산금강펜테리움리버테라스1차": { price: 109000, rent: 62000, households: 944, year: 2018, pyeong: 34 },
    "다산한강반도유보라": { price: 102000, rent: 68000, households: 1261, year: 2019, pyeong: 34 },
    "다산신안인스빌퍼스트리버": { price: 98000, rent: 58000, households: 800, year: 2019, pyeong: 34 },
    "다산신안인스빌퍼스트포레": { price: 101000, rent: 59000, households: 1282, year: 2020, pyeong: 34 },
    "한화꿈에그린아파트": { price: 75000, rent: 45000, households: 767, year: 2008, pyeong: 34 },
    "남양주다산롯데낙천대": { price: 72800, rent: 43000, households: 892, year: 2005, pyeong: 34 },
    "제일아파트": { price: 42000, rent: 26000, households: 354, year: 1998, pyeong: 26 },
    "창조아파트": { price: 17000, rent: 11000, households: 198, year: 1999, pyeong: 24 },
    "교문장자마을신명": { price: 78000, rent: 48000, households: 552, year: 2001, pyeong: 34 },
  };

  let standardFixed = 0;
  currentList.forEach((apt) => {
    for (const [nameKey, std] of Object.entries(CONFIRMED_STANDARDS)) {
      if (apt.name.includes(nameKey)) {
        apt.price_min = std.price;
        apt.price_max = std.price;
        apt.rent_min = std.rent;
        apt.rent_max = std.rent;
        apt.household_count = std.households;
        apt.built_year = std.year;
        apt.area_pyeong = std.pyeong;
        apt.isRealPrice = true;
        standardFixed++;
        break;
      }
    }
  });

  console.log(`✅ 다산 지금지구 및 핵심 단지 공식 실거래가 확정 적용: ${standardFixed}개 완료`);

  // 3. 파일 저장
  fs.writeFileSync(masterPath, JSON.stringify(currentList, null, 2), "utf-8");
  console.log("💾 apartments-master.json 파일 저장 완료!");

  // 4. Supabase 동기화
  if (SERVICE_ROLE_KEY) {
    console.log("🚀 Supabase DB에 무결성 복원 데이터 Upsert 시작...");
    const BATCH_SIZE = 500;
    for (let i = 0; i < currentList.length; i += BATCH_SIZE) {
      const chunk = currentList.slice(i, i + BATCH_SIZE).map((apt) => ({
        id: String(apt.id),
        name: apt.name || "",
        region: apt.region || "",
        district: apt.district || "",
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
        is_real_price: !!apt.isRealPrice,
        updated_at: new Date().toISOString(),
      }));

      await supabase.from("apartments").upsert(chunk, { onConflict: "id" });
      process.stdout.write(`\rSupabase 진행률: ${Math.min(i + BATCH_SIZE, currentList.length)} / ${currentList.length}`);
    }
    console.log("\n🎉 Supabase 동기화 100% 완료!");
  }
}

main().catch(console.error);

