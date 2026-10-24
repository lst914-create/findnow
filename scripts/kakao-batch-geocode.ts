import * as fs from "fs";
import * as path from "path";

// .env.local 로드
function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  const env: Record<string, string> = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
    }
  }
  return env;
}

const env = loadEnv();
const KAKAO_KEY =
  process.env.KAKAO_REST_API_KEY ||
  env.KAKAO_REST_API_KEY ||
  env.NEXT_PUBLIC_KAKAO_REST_KEY ||
  "4d7cd3190ca38a795008ebd7cc053820";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchKakao(query: string) {
  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
      query
    )}&size=3`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${KAKAO_KEY}` },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.documents && data.documents.length > 0) {
      const doc =
        data.documents.find(
          (d: any) =>
            d.category_name?.includes("아파트") ||
            d.category_name?.includes("주거") ||
            d.place_name?.includes("아파트")
        ) || data.documents[0];

      return {
        lat: parseFloat(parseFloat(doc.y).toFixed(6)),
        lng: parseFloat(parseFloat(doc.x).toFixed(6)),
        roadAddress: doc.road_address_name || doc.address_name,
        placeName: doc.place_name,
      };
    }
  } catch (err) {
    // ignore
  }
  return null;
}

async function main() {
  console.log("==================================================");
  console.log("🚀 [카카오 로컬 API] 아파트 단지 고정밀 지오코딩 검증");
  console.log("==================================================");

  const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");
  const cachePath = path.resolve(__dirname, "kakao-coords-cache.json");

  const apartments = JSON.parse(fs.readFileSync(masterPath, "utf-8"));
  let cache: Record<string, { lat: number; lng: number; roadAddress?: string }> = {};

  if (fs.existsSync(cachePath)) {
    try {
      cache = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
      console.log(`📦 기존 캐시 ${Object.keys(cache).length}건 로드 완료`);
    } catch (e) {}
  }

  // 대표 주요 단지 100개 우선 정밀 보정 테스트
  const targets = apartments.slice(0, 100);
  let updatedCount = 0;

  console.log(`🔍 상위 ${targets.length}개 대표 단지 카카오 좌표 정밀 검증 시작...`);

  for (let i = 0; i < targets.length; i++) {
    const apt = targets[i];
    const cacheKey = `${apt.region}__${apt.name}`;

    if (cache[cacheKey]) {
      apt.lat = cache[cacheKey].lat;
      apt.lng = cache[cacheKey].lng;
      continue;
    }

    const query = `${apt.region} ${apt.name}`;
    const result = await fetchKakao(query);

    if (result) {
      apt.lat = result.lat;
      apt.lng = result.lng;
      cache[cacheKey] = {
        lat: result.lat,
        lng: result.lng,
        roadAddress: result.roadAddress,
      };
      updatedCount++;
      console.log(`[${i + 1}/${targets.length}] ✅ ${apt.name} → (${result.lat}, ${result.lng}) [${result.placeName || ""}]`);
    } else {
      console.log(`[${i + 1}/${targets.length}] ⚠️  ${apt.name} (기존 좌표 유지)`);
    }

    // Rate limit 고려 (100ms 딜레이)
    await sleep(100);

    // 20개마다 캐시 저장
    if (i % 20 === 0) {
      fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf-8");
    }
  }

  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), "utf-8");
  fs.writeFileSync(masterPath, JSON.stringify(apartments, null, 2), "utf-8");

  console.log("==================================================");
  console.log(`✨ 카카오 지오코딩 검증 완료! (신규 정밀 매칭: ${updatedCount}건)`);
  console.log("==================================================");
}

main().catch(console.error);
