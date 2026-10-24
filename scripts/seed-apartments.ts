import { createClient } from "@supabase/supabase-js";
import { APARTMENTS_DATA } from "../src/lib/apartments";
import * as fs from "fs";
import * as path from "path";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx < 0) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (key && val) process.env[key] = val;
  }
}

async function main() {
  loadEnvLocal();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Supabase 설정 없음 - .env.local 확인");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("=================================================");
  console.log("🌱 apartments 테이블 시드 스크립트");
  console.log("=================================================");
  console.log(`📦 ${APARTMENTS_DATA.length}개 단지 데이터 삽입 시도...`);

  const rows = APARTMENTS_DATA.map((apt) => ({
    id: apt.id,
    name: apt.name,
    region: apt.region,
    district: apt.district,
    price_min: apt.price_min,
    price_max: apt.price_max,
    rent_min: apt.rent_min ?? null,
    rent_max: apt.rent_max ?? null,
    area_sqm: apt.area_sqm,
    area_pyeong: apt.area_pyeong,
    built_year: apt.built_year,
    household_count: apt.household_count,
    school_score: apt.school_score,
    traffic_score: apt.traffic_score,
    nature_score: apt.nature_score,
    station: apt.station ?? null,
    station_dist: apt.station_dist ?? null,
    walk_minutes: apt.walk_minutes ?? null,
    lat: apt.lat,
    lng: apt.lng,
    tags: apt.tags,
    image_url: apt.image_url,
    description: apt.description ?? null,
  }));

  const { error } = await supabase
    .from("apartments")
    .upsert(rows, { onConflict: "id" });

  if (error) {
    console.error("❌ 삽입 실패:", error.message);
    console.error("   힌트:", error.hint);
    console.error("   상세:", JSON.stringify(error, null, 2));
    console.log("");
    console.log("📌 RLS 정책으로 INSERT가 막혔을 수 있습니다.");
    console.log("   Supabase 대시보드 → SQL 편집기에서 아래 명령을 실행하세요:");
    console.log("   CREATE POLICY \"Allow public insert on apartments\" ON public.apartments FOR INSERT WITH CHECK (true);");
  } else {
    console.log("✅ 삽입/업데이트 완료!");

    const { count } = await supabase
      .from("apartments")
      .select("*", { count: "exact", head: true });

    console.log(`📊 Supabase apartments 테이블 총 단지 수: ${count}개`);
  }
}

main().catch(console.error);
