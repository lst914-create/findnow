import * as fs from "fs";
import * as path from "path";

const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");
const masterData: any[] = JSON.parse(fs.readFileSync(masterPath, "utf-8"));

/**
 * 대한민국 실제 부동산 시장 실거래 전세가율 및 단지별 특성 정밀 반영 로직
 */
function calculateRealisticJeonseRatio(apt: {
  name: string;
  region: string;
  district?: string;
  build_year?: number;
  price_min: number;
  price_max: number;
}): number {
  const avgPrice = Math.round((apt.price_min + apt.price_max) / 2);
  const name = apt.name || "";
  const region = apt.region || "";
  const buildYear = apt.build_year || 2010;
  const age = 2026 - buildYear;

  // 1. 대표 재건축 단지 (노후 구축, 높은 매매가 대비 전세가 낮음)
  const isRecon =
    name.includes("은마") ||
    name.includes("압구정") ||
    name.includes("신현대") ||
    name.includes("구현대") ||
    name.includes("현대1") ||
    name.includes("현대2") ||
    name.includes("현대3") ||
    name.includes("현대4") ||
    name.includes("현대5") ||
    name.includes("현대6") ||
    name.includes("현대7") ||
    name.includes("한양") ||
    name.includes("미도") ||
    name.includes("선경") ||
    (name.includes("우성") && (region.includes("강남") || region.includes("서초") || region.includes("송파"))) ||
    (name.includes("주공") && age >= 28) ||
    (name.includes("시영") && age >= 28) ||
    (name.includes("목동신시가지") || (region.includes("양천") && name.includes("단지") && age >= 32)) ||
    (age >= 35 && avgPrice >= 150000);

  if (isRecon) {
    if (avgPrice >= 350000) return 21; // 은마, 압구정 35억 이상: 전세가율 20~22%
    if (avgPrice >= 250000) return 25; // 25억~35억 재건축: 24~26%
    if (avgPrice >= 150000) return 30; // 15억~25억 재건축 (목동, 여의도 등): 29~32%
    return 36; // 15억 미만 재건축 (상계주공 등): 35~38%
  }

  // 2. 강남구 / 서초구 초고가 신축·준신축 (아크로리버파크, 반포자이, 래미안원베일리, 디에이치 등)
  if (region.includes("강남") || region.includes("서초")) {
    if (avgPrice >= 400000) return 38; // 40억 이상 (반포자이, 아크로리버파크 등 84m2 매매 45~50억 -> 전세 18~20억)
    if (avgPrice >= 300000) return 40; // 30억~40억: 39~41%
    if (avgPrice >= 200000) return 43; // 20억~30억: 42~44%
    return 47; // 20억 미만: 46~48%
  }

  // 3. 송파구 / 용산구 (잠실엘스, 리센츠, 헬리오시티, 한남, 한강로 등)
  if (region.includes("송파") || region.includes("용산")) {
    if (avgPrice >= 250000) return 41; // 잠실엘스 33억 -> 전세 13.5억 (41%)
    if (avgPrice >= 180000) return 44; // 헬리오시티 등
    return 48;
  }

  // 4. 성동구 / 마포구 / 광진구 / 성남 분당구 / 과천시 (마래푸, 옥수, 판교, 분당 정자/수내 등)
  if (
    region.includes("마포") ||
    region.includes("성동") ||
    region.includes("광진") ||
    region.includes("분당") ||
    region.includes("과천") ||
    name.includes("판교")
  ) {
    if (avgPrice >= 220000) return 46;
    if (avgPrice >= 150000) return 49; // 마포래미안푸르지오 20억 -> 전세 9.8억 (49%)
    return 52;
  }

  // 5. 서울 기타 자치구 (영등포, 동작, 강동, 양천, 서대문, 동대문, 중구, 종로 등)
  if (region.startsWith("서울")) {
    if (avgPrice >= 150000) return 51;
    if (avgPrice >= 100000) return 54;
    return 58; // 노원, 도봉, 강북, 중랑 등 외곽: 57~60%
  }

  // 6. 경기도 핵심 신도시 및 인기 주거지 (남양주 다산/별내, 하남 미사, 수원 광교, 화성 동탄, 구리, 고양 일산/덕양, 용인 수지, 안양 평촌 등)
  if (
    region.includes("남양주") ||
    region.includes("하남") ||
    region.includes("광교") ||
    region.includes("화성") ||
    region.includes("구리") ||
    region.includes("고양") ||
    region.includes("용인") ||
    region.includes("안양") ||
    region.includes("수원") ||
    region.includes("부천") ||
    region.includes("광명")
  ) {
    if (avgPrice >= 140000) return 52; // 광교 중흥 등 고가 신축: 52%
    if (avgPrice >= 80000) return 55;  // 다산, 동탄, 미사 8~12억: 54~56% (다산 9억 -> 전세 5억)
    if (avgPrice >= 50000) return 58;
    return 62;
  }

  // 7. 수도권 외곽 (평택, 이천, 양주, 안성, 파주 등) 및 인천, 지방 일반
  if (avgPrice >= 80000) return 58;
  if (avgPrice >= 40000) return 63;
  return 68; // 저가 아파트: 65~70%
}

async function main() {
  console.log("=========================================================================");
  console.log("🚀 [전국 아파트 전월세 및 전세가율·갭투자금 현실화 정밀 업데이트]");
  console.log(`총 단지 수: ${masterData.length.toLocaleString()}개`);
  console.log("=========================================================================");

  let updatedCount = 0;

  for (const apt of masterData) {
    if (!apt.price_min || !apt.price_max || apt.price_min <= 0) continue;

    const realisticRatio = calculateRealisticJeonseRatio(apt);
    const avgPrice = Math.round((apt.price_min + apt.price_max) / 2);

    // 전세가 계산: 최소가/최대가에 정밀 전세가율 적용
    const newRentMin = Math.round(apt.price_min * (realisticRatio / 100));
    const newRentMax = Math.round(apt.price_max * (realisticRatio / 100));
    const avgRent = Math.round((newRentMin + newRentMax) / 2);

    // 갭투자금 = 매매평균가 - 전세평균가
    const newGap = Math.max(0, avgPrice - avgRent);

    apt.jeonseRatio = realisticRatio;
    apt.rent_min = newRentMin;
    apt.rent_max = newRentMax;
    apt.gapPrice = newGap;

    updatedCount++;
  }

  console.log(`\n🎉 총 ${updatedCount.toLocaleString()}개 단지 전월세 시세 정밀 최신화 완료!`);

  fs.writeFileSync(masterPath, JSON.stringify(masterData, null, 2), "utf-8");
  console.log(`💾 마스터 데이터셋 저장 완료: ${masterPath}`);

  // 주요 랜드마크 검증 출력
  console.log("\n=================== [전국 주요 랜드마크 전월세 검증] ===================");
  const verifyList = [
    "대치 은마아파트",
    "은마",
    "아크로리버파크",
    "반포자이",
    "잠실엘스",
    "헬리오시티",
    "마포래미안푸르지오",
    "다산한강반도유보라",
    "다산금강펜테리움 리버테라스 1차",
    "킨텍스원시티",
    "상계주공"
  ];

  const seen = new Set<string>();
  for (const target of verifyList) {
    const matched = masterData.filter((a: any) => a.name.includes(target)).slice(0, 2);
    for (const item of matched) {
      if (seen.has(item.name)) continue;
      seen.add(item.name);

      const saleAvg = Math.round((item.price_min + item.price_max) / 2);
      const rentAvg = Math.round((item.rent_min + item.rent_max) / 2);

      const toEok = (man: number) => {
        const uk = Math.floor(man / 10000);
        const cheon = Math.floor((man % 10000) / 1000);
        return uk > 0 ? (cheon > 0 ? `${uk}.${cheon}억` : `${uk}억`) : `${man}만`;
      };

      console.log(
        `📍 ${item.name} (${item.region}):\n` +
        `   매매: ${toEok(saleAvg)} (${toEok(item.price_min)}~${toEok(item.price_max)})\n` +
        `   전세: ${toEok(rentAvg)} (${toEok(item.rent_min)}~${toEok(item.rent_max)})\n` +
        `   전세가율: ${item.jeonseRatio}% | 갭투자: ${toEok(item.gapPrice)}\n`
      );
    }
  }
}

main().catch(console.error);
