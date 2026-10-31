import * as fs from "fs";
import * as path from "path";
import { Apartment } from "../src/lib/apartments";

const masterPath = path.resolve(process.cwd(), "src/lib/apartments-master.json");
const backupPath = path.resolve(process.cwd(), "src/lib/apartments-master.backup.json");

function restoreAllApartments() {
  console.log("=================================================================");
  console.log("🔄 [전국 아파트 단지 전수 복원] 삭제된 6,791개 단지 복구 및 정규화");
  console.log("=================================================================");

  if (!fs.existsSync(backupPath)) {
    console.error("❌ 백업 파일을 찾을 수 없습니다:", backupPath);
    return;
  }

  const backupData: Apartment[] = JSON.parse(fs.readFileSync(backupPath, "utf8"));
  const currentData: Apartment[] = fs.existsSync(masterPath)
    ? JSON.parse(fs.readFileSync(masterPath, "utf8"))
    : [];

  const currentMap = new Map<string, Apartment>(currentData.map((a) => [a.id, a]));
  const mergedList: Apartment[] = [];
  let restoredCount = 0;
  let preservedCount = 0;

  for (const bApt of backupData) {
    if (!bApt.id || !bApt.name) continue;

    // 유효한 대한민국 좌표 범위 확인 (위도 33~39, 경도 124~132)
    if (!bApt.lat || !bApt.lng || bApt.lat < 33 || bApt.lat > 39 || bApt.lng < 124 || bApt.lng > 132) {
      continue;
    }

    const currentApt = currentMap.get(bApt.id);
    if (currentApt) {
      // 이미 정제된 데이터는 보존
      mergedList.push(currentApt);
      preservedCount++;
    } else {
      // 삭제되었던 정상 단지 복원
      const cleanTags = (bApt.tags || []).filter((t) => t !== "동별시세기준");
      
      const restoredApt: Apartment = {
        ...bApt,
        tags: cleanTags,
        description: bApt.description && !bApt.description.includes("동별시세기준")
          ? bApt.description
          : `${bApt.region} ${bApt.district}에 위치한 공동주택입니다. 국토교통부 실거래가 및 건축물대장 데이터와 연동됩니다.`,
      };

      mergedList.push(restoredApt);
      restoredCount++;
    }
  }

  // 남양주 다산동 핵심 단지 검증
  const dasanTargets = mergedList.filter(
    (a) =>
      a.region?.includes("남양주") &&
      (a.name?.includes("금강펜테리움") ||
        a.name?.includes("리버테라스") ||
        a.name?.includes("신안인스빌") ||
        a.name?.includes("반도유보라") ||
        a.name?.includes("퍼스트포레"))
  );

  console.log(`\n✅ 복원 완료 결과:`);
  console.log(` - 기존 유지 단지: ${preservedCount}개`);
  console.log(` - 복원된 누락 단지: ${restoredCount}개`);
  console.log(` - 최종 전국 단지 총수: ${mergedList.length}개`);
  console.log(` - 다산동 핵심 복원 단지 수: ${dasanTargets.length}개`);
  console.log(`   └ 단지명 샘플: ${dasanTargets.map((d) => d.name).join(", ")}`);

  fs.writeFileSync(masterPath, JSON.stringify(mergedList, null, 2), "utf8");
  console.log(`\n💾 저장 완료: ${masterPath}`);
}

restoreAllApartments();
