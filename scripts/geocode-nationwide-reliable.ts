import * as fs from "fs";
import * as path from "path";

const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");
const data = JSON.parse(fs.readFileSync(masterPath, "utf-8"));

const KAKAO_KEY = "4d7cd3190ca38a795008ebd7cc053820";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function cleanAptName(raw: string): string {
  return raw
    .replace(/입주자대표회의|관리사무소|아파트입주자대표회의|입대의/g, "")
    .replace(/[\(\)\[\]]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildQuery(apt: any): string {
  const reg = (apt.region || "").trim();
  const dist = (apt.district || "").trim();
  const name = cleanAptName(apt.name || "");

  // district가 'null', undefined이거나 region에 이미 포함된 경우 제외
  let parts: string[] = [reg];
  if (dist && dist !== "null" && dist !== "undefined" && !reg.includes(dist)) {
    parts.push(dist);
  }
  parts.push(name);
  return parts.join(" ");
}

// 429 Rate limit 안전 재시도 fetch
async function fetchKakaoWithRetry(query: string, maxRetries = 3): Promise<{ lat: number; lng: number } | null> {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=3`;
      const res = await fetch(url, {
        headers: { Authorization: `KakaoAK ${KAKAO_KEY}` },
      });

      if (res.status === 429) {
        // 속도 제한 걸리면 300ms 쉬고 재시도
        await sleep(300 + attempt * 200);
        attempt++;
        continue;
      }

      if (!res.ok) return null;

      const json = await res.json();
      if (json.documents && json.documents.length > 0) {
        const doc =
          json.documents.find(
            (d: any) =>
              d.category_name?.includes("아파트") ||
              d.category_name?.includes("주거") ||
              d.place_name?.includes("아파트")
          ) || json.documents[0];

        return {
          lat: parseFloat(parseFloat(doc.y).toFixed(6)),
          lng: parseFloat(parseFloat(doc.x).toFixed(6)),
        };
      }
      return null;
    } catch {
      await sleep(200);
      attempt++;
    }
  }
  return null;
}

// 동시성 8로 안전하게 순회 (초당 약 35~40 req/sec로 카카오 제한 철저히 준수)
async function runConcurrent<T>(items: T[], fn: (item: T, idx: number) => Promise<void>, concurrency: number) {
  let index = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (index < items.length) {
      const currentIdx = index++;
      await fn(items[currentIdx], currentIdx);
      await sleep(25); // 안전 간격
    }
  });
  await Promise.all(workers);
}

async function main() {
  console.log("==========================================================");
  console.log("🛡️ [안전 100% 전수] 카카오 실측 건물 위치 정확 매핑 시작");
  console.log("==========================================================");

  // 서울(서초, 강남, 송파, 마포, 용산 등) 및 경기/인천/광역시 우선순위 정렬
  const priorityRegions = [
    "서초구", "강남구", "송파구", "용산구", "마포구", "성동구", "영등포구", "양천구", "강동구", "동작구", "관악구",
    "분당구", "수지구", "과천", "남양주", "하남", "광명", "안양", "수원", "일산", "화성", "인천", "부산", "대구", "대전"
  ];

  data.sort((a: any, b: any) => {
    const aPrio = priorityRegions.findIndex((r) => (a.region + a.district).includes(r));
    const bPrio = priorityRegions.findIndex((r) => (b.region + b.district).includes(r));
    const aScore = aPrio >= 0 ? aPrio : 999;
    const bScore = bPrio >= 0 ? bPrio : 999;
    return aScore - bScore;
  });

  console.log(`전체 대상: ${data.length}개 단지 (우선순위 정렬 완료)`);

  let successCount = 0;
  let processed = 0;
  const startTime = Date.now();

  await runConcurrent(
    data,
    async (apt: any) => {
      const query = buildQuery(apt);
      const res = await fetchKakaoWithRetry(query);

      if (res) {
        apt.lat = res.lat;
        apt.lng = res.lng;
        successCount++;
      }

      processed++;
      if (processed % 200 === 0 || processed === data.length) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const rate = (processed / parseFloat(elapsed)).toFixed(1);
        const successRate = ((successCount / processed) * 100).toFixed(1);
        console.log(
          `📍 진행: [${processed}/${data.length}] (${((processed / data.length) * 100).toFixed(1)}%) | 실측매핑: ${successCount}개 (${successRate}%) | ${rate}건/초 | 최근: ${apt.region} ${apt.name}`
        );

        // 500개마다 디스크 저장 (중간에 웹에서 바로 실시간 조회 가능)
        if (processed % 500 === 0) {
          fs.writeFileSync(masterPath, JSON.stringify(data, null, 2), "utf-8");
          console.log(`💾 데이터셋 저장 완료 (${processed}단지 실시간 반영)`);
        }
      }
    },
    8 // 동시 8개 요청 (초당 약 35 req/sec 준수)
  );

  fs.writeFileSync(masterPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`\n🎉 최종 완료! 총 ${data.length}개 중 ${successCount}개 단지 카카오 공식 건물 위치 1:1 매핑 완료!`);
}

main().catch(console.error);
