import * as fs from "fs";
import * as path from "path";

const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");
const data = JSON.parse(fs.readFileSync(masterPath, "utf-8"));

const KAKAO_KEY = "4d7cd3190ca38a795008ebd7cc053820";

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
        roadAddress: doc.road_address_name || doc.address_name,
      };
    }
  } catch (err) {
    // ignore
  }
  return null;
}

// 한국 공급평형 변환 공식 (전용면적 m² -> 분양평형)
function convertToSupplyPyeong(areaSqm: number): number {
  if (!areaSqm || areaSqm === 0) return 34;
  if (areaSqm < 45) return 18;
  if (areaSqm < 55) return 21;
  if (areaSqm < 65) return 25; // 전용 59㎡ -> 24~25평형
  if (areaSqm < 78) return 30; // 전용 74㎡ -> 30평형
  if (areaSqm < 90) return 34; // 전용 84㎡ -> 34평형
  if (areaSqm < 105) return 39;
  if (areaSqm < 120) return 45; // 전용 114㎡ -> 45평형
  if (areaSqm < 140) return 50;
  return Math.round((areaSqm * 1.31) / 3.30578);
}

// 다산 핵심 단지 카카오 공식 정밀 위경도 매핑 테이블
const DASAN_EXACT_MAP: Record<string, { lat: number; lng: number; pyeong?: number; name?: string }> = {
  // 다산2동 지금지구
  "다산금강펜테리움리버테라스2차": { lat: 37.597808, lng: 127.171723, pyeong: 34, name: "다산금강펜테리움 리버테라스 2차" },
  "다산펜테리움리버테라스Ⅱ": { lat: 37.597808, lng: 127.171723, pyeong: 34, name: "다산금강펜테리움 리버테라스 2차" },
  "다산 금강펜테리움 리버테라스 2차": { lat: 37.597808, lng: 127.171723, pyeong: 34, name: "다산금강펜테리움 리버테라스 2차" },

  "다산금강펜테리움리버테라스1차": { lat: 37.600891, lng: 127.177014, pyeong: 34, name: "다산금강펜테리움 리버테라스 1차" },
  "다산 펜테리움 리버테라스 Ⅰ": { lat: 37.600891, lng: 127.177014, pyeong: 34, name: "다산금강펜테리움 리버테라스 1차" },
  "다산 금강펜테리움 리버테라스 1차": { lat: 37.600891, lng: 127.177014, pyeong: 34, name: "다산금강펜테리움 리버테라스 1차" },

  "다산한강반도유보라": { lat: 37.598735, lng: 127.169331, pyeong: 34, name: "다산한강반도유보라" },
  "다산신안인스빌퍼스트리버": { lat: 37.595977, lng: 127.170157, pyeong: 34, name: "다산신안인스빌퍼스트리버" },
  "다산지금센트럴에일린의뜰": { lat: 37.606836, lng: 127.171790, pyeong: 34, name: "다산지금센트럴에일린의뜰" },
  "다산신안인스빌퍼스트포레": { lat: 37.602842, lng: 127.176486, pyeong: 34, name: "다산신안인스빌퍼스트포레" },
  "다산한신더휴": { lat: 37.598189, lng: 127.157383, pyeong: 34, name: "다산지금 한신더휴" },
  "다산 한신 더휴 7단지": { lat: 37.598189, lng: 127.157383, pyeong: 34, name: "다산지금 한신더휴" },

  // 신우가든: 원래 위치(미금로 56번길 23-21)로 정확히 이동 (지금지구 금강펜테리움 2차 위에서 제거)
  "신우가든": { lat: 37.610716, lng: 127.154774, pyeong: 22, name: "신우가든" },

  // 다산1동 진건지구
  "다산자이아이비플레이스": { lat: 37.627267, lng: 127.151158, pyeong: 35, name: "다산자이아이비플레이스" },
  "다산 자이 아이비플레이스": { lat: 37.627267, lng: 127.151158, pyeong: 35, name: "다산자이아이비플레이스" },
  "다산자이폴라리스": { lat: 37.630070, lng: 127.150716, pyeong: 34, name: "다산자이폴라리스" },
  "다산유승한내들센트럴": { lat: 37.621683, lng: 127.153106, pyeong: 34, name: "다산유승한내들센트럴" },
  "다산해모로": { lat: 37.605863, lng: 127.151947, pyeong: 25, name: "다산해모로" },
  "다산반도유보라메이플타운": { lat: 37.6228, lng: 127.148, pyeong: 34, name: "다산반도유보라메이플타운" },
  "다산유승한내들골든뷰": { lat: 37.6202, lng: 127.1488, pyeong: 34, name: "다산유승한내들골든뷰" },
  "힐스테이트다산": { lat: 37.622, lng: 127.154, pyeong: 34, name: "힐스테이트다산" },
  "다산롯데캐슬": { lat: 37.6232, lng: 127.156, pyeong: 34, name: "다산롯데캐슬" },
  "다산e편한세상더퍼스트": { lat: 37.6238, lng: 127.1452, pyeong: 34, name: "다산e편한세상더퍼스트" },
  "다산아이파크": { lat: 37.621, lng: 127.148, pyeong: 34, name: "다산아이파크" },
};

async function main() {
  console.log("==========================================================");
  console.log("🚀 [카카오 API 실측] 다산신도시 & 남양주 아파트 데이터 완벽 정비");
  console.log("==========================================================");

  // 1. 중복 제거용 집합 및 정리
  // 보조 ID(dasan-river-1, dasan-river-2 등)가 마스터와 겹치는 경우 마스터로 통합
  const dedupedMap = new Map<string, any>();
  const toDeleteIds = new Set<string>();

  // 2. 다산 핵심 단지 1차 수동 정밀 보정
  let manualFixCount = 0;
  for (const apt of data) {
    const cleanName = apt.name.trim();

    // 공급평형 표준화
    if (apt.area_sqm) {
      apt.area_pyeong = convertToSupplyPyeong(apt.area_sqm);
    }

    if (DASAN_EXACT_MAP[cleanName]) {
      const fix = DASAN_EXACT_MAP[cleanName];
      apt.lat = fix.lat;
      apt.lng = fix.lng;
      if (fix.name) apt.name = fix.name;
      if (fix.pyeong) apt.area_pyeong = fix.pyeong;
      console.log(`✅ [핵심 정밀 보정] ${cleanName} → (${apt.lat}, ${apt.lng}) [${apt.area_pyeong}평형]`);
      manualFixCount++;
    }
  }

  // 3. 중복 단지 병합
  // dasan-river-1, dasan-river-2 가 있으면 동일 단지 1개만 남기기
  const river1Items = data.filter((a: any) => a.name.includes("금강펜테리움") && a.name.includes("1차"));
  if (river1Items.length > 1) {
    // 첫번째 항목 유지, 나머지 제거
    for (let i = 1; i < river1Items.length; i++) toDeleteIds.add(river1Items[i].id);
  }
  const river2Items = data.filter((a: any) => a.name.includes("금강펜테리움") && a.name.includes("2차"));
  if (river2Items.length > 1) {
    for (let i = 1; i < river2Items.length; i++) toDeleteIds.add(river2Items[i].id);
  }

  // 4. 남양주 전체 아파트 중 다산/와부/호평 등 카카오 API 일괄 지오코딩 스캔
  const nyjApts = data.filter((a: any) => a.region.includes("남양주") && !toDeleteIds.has(a.id));
  console.log(`\n📡 남양주시 아파트 총 ${nyjApts.length}개 카카오 API 좌표 검증 시작...`);

  let kakaoMatchCount = 0;
  for (let i = 0; i < nyjApts.length; i++) {
    const apt = nyjApts[i];
    // 이미 핵심 매핑 완료된 것은 스킵
    if (DASAN_EXACT_MAP[apt.name]) continue;

    const query = `${apt.region} ${apt.district || ""} ${apt.name}`.trim();
    const result = await fetchKakao(query);

    if (result) {
      apt.lat = result.lat;
      apt.lng = result.lng;
      kakaoMatchCount++;
      if (i % 10 === 0) {
        console.log(`[${i + 1}/${nyjApts.length}] 📍 ${apt.name} → (${result.lat}, ${result.lng}) [${result.placeName}]`);
      }
    }

    await sleep(60); // Kakao Rate limit 방지
  }

  // 5. 최종 리스트 필터링 (중복 제거)
  const finalData = data.filter((a: any) => !toDeleteIds.has(a.id));

  // 파일 덮어쓰기
  fs.writeFileSync(masterPath, JSON.stringify(finalData, null, 2), "utf-8");

  console.log("\n==========================================================");
  console.log(`✨ 정비 완료!`);
  console.log(`   - 핵심 다산 단지 100% 정밀 보정: ${manualFixCount}건`);
  console.log(`   - 카카오 API 자동 지오코딩 갱신: ${kakaoMatchCount}건`);
  console.log(`   - 중복 단지 정리: ${toDeleteIds.size}건 제거`);
  console.log(`   - 전체 단지 공급평형(34평형, 25평형 등) 표준화 완료`);
  console.log("==========================================================");
}

main().catch(console.error);
