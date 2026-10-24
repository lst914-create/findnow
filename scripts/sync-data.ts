import { createClient } from "@supabase/supabase-js";
import { LAWD_CODES, fetchMolitTradeData, fetchMolitRentData } from "../src/lib/publicDataApi";
import * as fs from "fs";
import * as path from "path";

// .env.local 파일을 수동으로 파싱해서 환경변수로 로드 (tsx는 Next.js 런타임이 아님)
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
    if (key && val) {
      process.env[key] = val;
    }
  }
}

// 간단한 딜레이 함수 (API Rate Limit 방지)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  loadEnvLocal();

  console.log("=================================================");
  console.log("🚀 [국토교통부 API → Supabase] 실거래 데이터 동기화");
  console.log("=================================================");

  const apiKey = process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY || process.env.DATA_GO_KR_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  if (!apiKey) {
    console.error("❌ API Key가 미설정 상태입니다. .env.local 파일을 확인해주세요.");
    process.exit(1);
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Supabase 설정이 없습니다. .env.local 파일을 확인해주세요.");
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log("✅ 공공데이터포털 API Key 감지!");
  console.log("✅ Supabase 연결 준비 완료!");
  console.log(`📍 총 ${LAWD_CODES.length}개 서울/경기 지역 스캔 시작...`);
  console.log("");

  // 최근 3개월 데이터 수집 (2025년 6~8월)
  const dealYmdList = ["202508", "202507", "202506"];

  let totalTrades = 0;
  let totalRents = 0;
  let totalUpserted = 0;
  let totalErrors = 0;

  // Supabase에서 모든 아파트 목록 캐시 (매핑 효율화)
  const { data: allApts } = await supabase.from("apartments").select("id, name, region");
  const aptCache = allApts || [];
  console.log(`📋 Supabase apartments 캐시: ${aptCache.length}개 단지`);
  console.log("");

  for (const item of LAWD_CODES) {
    process.stdout.write(`📡 [${item.region}] (LAWD_CD=${item.code}) 수집 중...`);

    let regionTrades = 0;
    let regionRents = 0;

    for (const dealYmd of dealYmdList) {
      // 매매 실거래
      const trades = await fetchMolitTradeData(item.code, dealYmd);
      regionTrades += trades.length;

      for (const trade of trades) {
        const dealDate = `${trade.dealYear}-${String(trade.dealMonth).padStart(2, "0")}-${String(trade.dealDay).padStart(2, "0")}`;

        // 아파트명 매핑: cache에서 부분 매칭
        const matchedApt = aptCache.find(
          (apt) =>
            apt.region === item.region &&
            (apt.name.includes(trade.aptName) || trade.aptName.includes(apt.name.split(" ")[0]))
        );

        if (matchedApt) {
          const { error } = await supabase.from("real_transactions").insert({
            apartment_id: matchedApt.id,
            trade_type: "매매",
            deal_price: trade.dealAmount,
            monthly_price: 0,
            area_sqm: trade.excluUseAr,
            floor: trade.floor || 0,
            deal_date: dealDate,
          });

          if (error && !error.message.includes("duplicate")) totalErrors++;
          else totalUpserted++;
        }
      }

      // 전월세 실거래
      const rents = await fetchMolitRentData(item.code, dealYmd);
      regionRents += rents.length;

      for (const rent of rents) {
        const dealDate = `${rent.dealYear}-${String(rent.dealMonth).padStart(2, "0")}-${String(rent.dealDay).padStart(2, "0")}`;
        const tradeType = rent.monthlyRent > 0 ? "월세" : "전세";

        const matchedApt = aptCache.find(
          (apt) =>
            apt.region === item.region &&
            (apt.name.includes(rent.aptName) || rent.aptName.includes(apt.name.split(" ")[0]))
        );

        if (matchedApt) {
          const { error } = await supabase.from("real_transactions").insert({
            apartment_id: matchedApt.id,
            trade_type: tradeType,
            deal_price: rent.depositAmount,
            monthly_price: rent.monthlyRent,
            area_sqm: rent.excluUseAr,
            floor: rent.floor || 0,
            deal_date: dealDate,
          });

          if (error && !error.message.includes("duplicate")) totalErrors++;
          else totalUpserted++;
        }
      }

      // API Rate Limit 방지를 위한 딜레이
      await sleep(300);
    }

    totalTrades += regionTrades;
    totalRents += regionRents;
    console.log(` ✓ 매매 ${regionTrades}건 / 전월세 ${regionRents}건`);
  }

  console.log("");
  console.log("=================================================");
  console.log(`✅ 전체 데이터 수집 완료!`);
  console.log(`   📊 매매 실거래 수집: ${totalTrades}건`);
  console.log(`   🏠 전월세 실거래 수집: ${totalRents}건`);
  console.log(`   💾 Supabase 저장 성공: ${totalUpserted}건`);
  console.log(`   ⚠️  저장 실패 (매핑 불일치 등): ${totalErrors}건`);
  console.log(`   🗺️  대상 지역: 서울 25개 구 + 경기 31개 시·군 + 인천 연수구`);
  console.log("=================================================");
  console.log("✨ 동기화 완료! 이제 사이트에서 실거래 데이터를 확인하세요.");
}

main().catch((err) => {
  console.error("❌ Data sync failed:", err);
  process.exit(1);
});
