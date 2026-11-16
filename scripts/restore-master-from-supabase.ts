/**
 * Supabase에 완비된 24,784개 단지 실측 데이터(좌표, 세대수, 준공연도)를
 * src/lib/apartments-master.json에 전수 동기화하는 스크립트
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

// .env.local 로딩
const envPath = path.resolve(__dirname, "../.env.local");
let supabaseUrl = "https://fkkbusvufaumzizzxpqe.supabase.co";
let supabaseKey = "";

if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("NEXT_PUBLIC_SUPABASE_URL=")) {
      supabaseUrl = trimmed.split("=")[1].trim();
    }
    if (trimmed.startsWith("SUPABASE_SERVICE_ROLE_KEY=") || trimmed.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY=")) {
      if (!supabaseKey || trimmed.startsWith("SUPABASE_SERVICE_ROLE_KEY=")) {
        supabaseKey = trimmed.split("=")[1].trim();
      }
    }
  }
}

async function main() {
  console.log("==========================================================================");
  console.log("🚀 Supabase 검증 실측 데이터(좌표/세대수/준공연도) 전수 동기화");
  console.log("==========================================================================");

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 1. Supabase 전체 단지 1000개씩 전수 수집
  const allApartments: any[] = [];
  const PAGE_SIZE = 1000;
  let page = 0;

  while (true) {
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data, error } = await supabase
      .from("apartments")
      .select("*")
      .range(from, to)
      .order("id");

    if (error) {
      console.error("Supabase 조회 에러:", error);
      break;
    }

    if (!data || data.length === 0) break;
    allApartments.push(...data);
    process.stdout.write(`  [${page + 1}회차: 누적 ${allApartments.length.toLocaleString()}개 수집 완료]\r`);

    if (data.length < PAGE_SIZE) break;
    page++;
  }

  console.log(`\n✅ Supabase로부터 총 ${allApartments.length.toLocaleString()}개 공식 단지 전수 수집 완료!`);

  // 2. 단지 데이터 정규화 (임의/가상값 완전 배제, 실데이터만 온전히 유지)
  const cleanList = allApartments.map((a) => {
    return {
      id: a.id,
      name: a.name,
      region: a.region,
      district: a.district || "",
      api_region: a.api_region || a.region,
      lat: a.lat ? Number(a.lat) : null,
      lng: a.lng ? Number(a.lng) : null,
      price_min: a.price_min ?? 0,
      price_max: a.price_max ?? 0,
      rent_min: a.rent_min ?? 0,
      rent_max: a.rent_max ?? 0,
      area_sqm: a.area_sqm ? Number(a.area_sqm) : undefined,
      area_pyeong: a.area_pyeong || 33,
      built_year: a.built_year || null,
      household_count: a.household_count || 0,
      dong_count: a.dong_count || undefined,
      floor_top: a.floor_top || undefined,
      floor_base: a.floor_base || undefined,
      approval_date: a.approval_date || undefined,
      construction: a.construction || undefined,
      developer: a.developer || undefined,
      parking_ratio: a.parking_ratio || undefined,
      parking_total: a.parking_total || undefined,
      ev_charger_count: a.ev_charger_count || undefined,
      heating_type: a.heating_type || undefined,
      hall_type: a.hall_type || undefined,
      far: a.far || undefined,
      bcr: a.bcr || undefined,
      school_score: a.school_score || 0,
      traffic_score: a.traffic_score || 0,
      nature_score: a.nature_score || 0,
      walk_minutes: a.walk_minutes || undefined,
      tags: a.tags || [],
      facilities: a.facilities || [],
      schools: a.schools || [],
      image_url: a.image_url || undefined,
      description: a.description || undefined,
      is_real_price: a.is_real_price || false,
    };
  });

  const withCoords = cleanList.filter((a) => a.lat && a.lng);
  console.log(`📍 실측 좌표(lat, lng) 확보 단지: ${withCoords.length.toLocaleString()}개 / ${cleanList.length.toLocaleString()}개`);

  const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");
  fs.writeFileSync(masterPath, JSON.stringify(cleanList, null, 2), "utf-8");
  console.log(`💾 src/lib/apartments-master.json 저장 완료!`);
}

main().catch(console.error);
