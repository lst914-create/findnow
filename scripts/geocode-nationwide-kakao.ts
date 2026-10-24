import * as fs from "fs";
import * as path from "path";

const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");
const data = JSON.parse(fs.readFileSync(masterPath, "utf-8"));

const KAKAO_KEY = "4d7cd3190ca38a795008ebd7cc053820";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

// 단지명 클렌징 (입주자대표회의, 노이즈 제거)
function cleanName(raw: string): string {
  return raw
    .replace(/입주자대표회의|관리사무소|아파트입주자대표회의/g, "")
    .replace(/[\(\)\[\]]/g, " ")
    .trim();
}

async function main() {
  console.log("==========================================================");
  console.log("🗺️ 전국 아파트 단지 카카오 공식 실측 건물 위치 전수 정밀 매핑");
  console.log("==========================================================");
  console.log(`전체 아파트 수: ${data.length}개`);

  // 서울, 경기, 인천, 5대 광역시 등 주요 수도권/대도시 우선 정밀 매핑
  // (동 대표 좌표로 몰려있는 단지들을 실제 카카오맵 건물 위치로 분산/이동)
  let successCount = 0;
  let batchCount = 0;

  for (let i = 0; i < data.length; i++) {
    const apt = data[i];
    const cName = cleanName(apt.name);

    // 검색 쿼리 구성: 예: "서울 송파구 잠실동 잠실엘스"
    const query = `${apt.region} ${apt.district || ""} ${cName}`.trim();
    const result = await fetchKakaoPlace(query);

    if (result) {
      apt.lat = result.lat;
      apt.lng = result.lng;
      successCount++;
    }

    batchCount++;
    if (batchCount % 100 === 0) {
      console.log(`진행 중: [${batchCount}/${data.length}] - ${successCount}개 단지 실제 건물 좌표 매핑 완료 (${apt.region} ${apt.name})`);
      // 500개마다 중간 저장 (안정성 확보)
      if (batchCount % 500 === 0) {
        fs.writeFileSync(masterPath, JSON.stringify(data, null, 2), "utf-8");
      }
    }

    await sleep(20); // 초당 약 50건 안전 호출
  }

  fs.writeFileSync(masterPath, JSON.stringify(data, null, 2), "utf-8");
  console.log(`\n🎉 전국 전수 정밀 매핑 완료! (성공: ${successCount}개)`);
}

main().catch(console.error);
