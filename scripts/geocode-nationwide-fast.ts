import * as fs from "fs";
import * as path from "path";

const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");
const data = JSON.parse(fs.readFileSync(masterPath, "utf-8"));

const KAKAO_KEY = "4d7cd3190ca38a795008ebd7cc053820";

// 단지명 클렌징
function cleanName(raw: string): string {
  return raw
    .replace(/입주자대표회의|관리사무소|아파트입주자대표회의|입대의/g, "")
    .replace(/[\(\)\[\]]/g, " ")
    .trim();
}

async function fetchKakaoPlace(query: string): Promise<{ lat: number; lng: number; placeName: string } | null> {
  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=3`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${KAKAO_KEY}` },
    });
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
        placeName: doc.place_name,
      };
    }
  } catch {}
  return null;
}

// 동시성 제어 큐
async function runConcurrent<T>(items: T[], fn: (item: T, idx: number) => Promise<void>, concurrency: number) {
  let index = 0;
  const workers = Array.from({ length: concurrency }, async () => {
    while (index < items.length) {
      const currentIdx = index++;
      await fn(items[currentIdx], currentIdx);
    }
  });
  await Promise.all(workers);
}

async function main() {
  console.log("==========================================================");
  console.log("⚡ [초고속 병렬] 전국 아파트 단지 카카오 실측 건물 위치 전수 정밀 매핑");
  console.log("==========================================================");

  // 1. 서울 서초구, 강남구, 송파구, 과천, 성남, 하남, 남양주 등 긴급 대상 우선 정렬
  // 사용자가 보고 계신 지역(서초 방배/우면/내곡 등)을 1순위로 즉각 보정!
  const priorityRegions = ["서초구", "강남구", "송파구", "과천", "남양주", "성남", "용인", "수원", "하남"];

  data.sort((a: any, b: any) => {
    const aPrio = priorityRegions.some((r) => a.region.includes(r) || a.district.includes(r)) ? 0 : 1;
    const bPrio = priorityRegions.some((r) => b.region.includes(r) || b.district.includes(r)) ? 0 : 1;
    return aPrio - bPrio;
  });

  console.log(`전체 아파트 수: ${data.length}개 (서초/강남/수도권 최우선 배치)`);

  let successCount = 0;
  let processed = 0;
  const startTime = Date.now();

  await runConcurrent(
    data,
    async (apt: any, idx: number) => {
      const cName = cleanName(apt.name);
      const query = `${apt.region} ${apt.district || ""} ${cName}`.trim();
      const res = await fetchKakaoPlace(query);

      if (res) {
        apt.lat = res.lat;
        apt.lng = res.lng;
        successCount++;
      }

      processed++;
      if (processed % 200 === 0 || processed === data.length) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const rate = (processed / parseFloat(elapsed)).toFixed(1);
        console.log(
          `🚀 진행률: [${processed}/${data.length}] (${((processed / data.length) * 100).toFixed(1)}%) | 실측성공: ${successCount}건 | 속도: ${rate}건/초 | (${apt.region} ${apt.name})`
        );

        // 1000건마다 디스크 즉시 저장 (사용자 화면에서 새로고침 시 실시간 반영)
        if (processed % 1000 === 0) {
          fs.writeFileSync(masterPath, JSON.stringify(data, null, 2), "utf-8");
          console.log(`💾 중간 저장 완료 (${processed}건 반영됨)`);
        }
      }
    },
    20 // 동시 20개 워커
  );

  // 최종 저장
  fs.writeFileSync(masterPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`\n🎉 전국 ${data.length}개 단지 전수 정밀 매핑 최종 완료! (실측 성공: ${successCount}건)`);
}

main().catch(console.error);
