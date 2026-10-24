import { resolveStationOrPlace, getDistanceMeters } from "../src/lib/searchGeoHelper";
import * as fs from "fs";
import * as path from "path";

const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");
const master = JSON.parse(fs.readFileSync(masterPath, "utf-8"));

async function test() {
  const query = "도농역 도보 10분 거리 8억 이내 아파트";
  const stationLoc = await resolveStationOrPlace(query);
  console.log("해석된 거점:", stationLoc);

  const maxPrice = 80000;
  const maxWalkMin = 10;
  const maxMeters = maxWalkMin * 80 + 150; // 950m

  const matched = master
    .map((a: any) => {
      if (!a.lat || !a.lng || !stationLoc) return null;
      const distM = getDistanceMeters(stationLoc.lat, stationLoc.lng, a.lat, a.lng);
      const walkMin = Math.round(distM / 80);
      return { ...a, distM, walkMin };
    })
    .filter((a: any) => {
      if (!a) return false;
      if (a.distM > maxMeters) return false;
      if (a.price_min > maxPrice) return false;
      return true;
    })
    .sort((a: any, b: any) => a.distM - b.distM);

  console.log(`\n🎉 도농역 10분 거리 + 8억 이내 일치 단지: 총 ${matched.length}개`);
  matched.slice(0, 10).forEach((a: any, i: number) => {
    const pMin = (a.price_min / 10000).toFixed(1);
    const pMax = (a.price_max / 10000).toFixed(1);
    const rMin = (a.rent_min / 10000).toFixed(1);
    const rMax = (a.rent_max / 10000).toFixed(1);
    console.log(
      `${i + 1}. ${a.name} (${a.region} ${a.district}) - 도보 ${a.walkMin}분 (${a.distM}m)\n` +
      `   매매: ${pMin}~${pMax}억 | 전세: ${rMin}~${rMax}억 (전세가율 ${a.jeonseRatio}%)`
    );
  });
}

test().catch(console.error);
