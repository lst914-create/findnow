import * as fs from "fs";
import * as path from "path";

const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");
const data: any[] = JSON.parse(fs.readFileSync(masterPath, "utf-8"));
const KAKAO_KEY = "4d7cd3190ca38a795008ebd7cc053820";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchKakao(query: string) {
  try {
    const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(query)}&size=5`;
    const res = await fetch(url, { headers: { Authorization: `KakaoAK ${KAKAO_KEY}` } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function main() {
  console.log("=== 오창 대원칸타빌 및 전국 동명이단지 좌표 정밀 분리/교정 ===");

  // 1. 오창 대원칸타빌 1지구(각리) vs 2지구(창리) 정확한 분리
  const ochang1 = data.find(
    (a) => a.name === "오창대원칸타빌" && a.district.includes("오창")
  );
  if (ochang1) {
    ochang1.name = "오창대원칸타빌";
    ochang1.region = "충북 청주청원구";
    ochang1.district = "오창읍 각리";
    ochang1.lat = 36.707597;
    ochang1.lng = 127.422506;
    ochang1.price_min = 25000;
    ochang1.price_max = 29000;
    ochang1.area_pyeong = 34;
    console.log("🎯 [오창대원칸타빌 (1지구 각리)] 실측 위치 1:1 교정 완료! -> lat: 36.707597, lng: 127.422506");
  }

  const ochang2 = data.find(
    (a) => a.name.includes("오창2지구") && a.name.includes("대원칸타빌")
  );
  if (ochang2) {
    ochang2.district = "오창읍 창리";
    ochang2.lat = 36.738517;
    ochang2.lng = 127.450608;
    console.log("🎯 [오창2지구 대원칸타빌 (2지구 창리)] 위치 확인 -> lat: 36.738517, lng: 127.450608");
  }

  // 2. 동일 좌표로 겹쳐있는 1차/2차, 단지명 차이 단지들 정밀 재조회 및 분리
  console.log("\n🚀 전국 중복 좌표 단지 카카오 공식 실측 건물 1:1 재매핑 진행 중...");
  
  const coordMap = new Map<string, any[]>();
  data.forEach((a) => {
    const k = `${a.lat.toFixed(5)},${a.lng.toFixed(5)}`;
    if (!coordMap.has(k)) coordMap.set(k, []);
    coordMap.get(k)!.push(a);
  });

  let fixedCount = 0;
  for (const [, list] of coordMap.entries()) {
    if (list.length <= 1) continue;

    // 만약 이름이 다른 단지들이라면 개별 검색으로 실제 위치 분리
    for (const apt of list) {
      const q = `${apt.region} ${apt.district || ""} ${apt.name}`.trim();
      const res = await fetchKakao(q);
      if (res && res.documents && res.documents.length > 0) {
        const doc =
          res.documents.find(
            (d: any) =>
              d.category_name?.includes("아파트") ||
              d.place_name?.includes("아파트")
          ) || res.documents[0];

        const realLat = parseFloat(parseFloat(doc.y).toFixed(6));
        const realLng = parseFloat(parseFloat(doc.x).toFixed(6));

        // 기존 겹치던 좌표와 다른 실제 건물이 발견되면 분리
        if (Math.abs(apt.lat - realLat) > 0.0001 || Math.abs(apt.lng - realLng) > 0.0001) {
          apt.lat = realLat;
          apt.lng = realLng;
          fixedCount++;
          console.log(`  📍 분리 매핑: ${apt.region} ${apt.name} -> [${realLat}, ${realLng}] (${doc.place_name})`);
        }
      }
      await sleep(25);
    }
  }

  console.log(`\n✅ 총 ${fixedCount}개 중복 겹침 단지 좌표 개별 실측 위치로 분리 완료!`);

  // 저장
  fs.writeFileSync(masterPath, JSON.stringify(data, null, 2), "utf-8");
  console.log("💾 마스터 파일 저장 완료!");
}

main().catch(console.error);
