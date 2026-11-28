import { NextRequest, NextResponse } from "next/server";
import { APARTMENTS_DATA } from "@/lib/apartments";
import { makeDataSourceMeta } from "@/types/dataSource";
import { getAllSubscriptionNotices, SubscriptionNotice } from "@/lib/applyhome";
import {
  RADIUS_BUCKETS,
  type RadiusBucket,
  type SupplyType,
  type SupplyUnit,
  type SupplyByRadius,
  type SupplyVolumeResponse,
} from "@/types/supplyVolume";

function haversineM(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getRadiusBucket(distM: number): RadiusBucket {
  if (distM <= 500) return 0.5;
  if (distM <= 1000) return 1;
  if (distM <= 2000) return 2;
  if (distM <= 3000) return 3;
  return 5;
}

/** 연월(YYYY-MM)을 분기 문자열로 변환 */
function toPeriodQuarter(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const q = Math.ceil(m / 3);
  return `${y}-Q${q}`;
}

/** "2027년 5월" 또는 "2027-05" 형식을 "YYYY-MM"으로 정규화 */
function parseExpectedMoveIn(text?: string): string {
  if (!text) return "2027-06";
  const match = text.match(/(\d{4})[^\d]*(\d{1,2})/);
  if (match) {
    return `${match[1]}-${String(match[2]).padStart(2, "0")}`;
  }
  return text.slice(0, 7);
}

// 주소 -> 좌표 지오코딩 캐시
const geocodeCache = new Map<string, { lat: number; lng: number }>();

const KNOWN_REDEV_MAP: Record<string, { totalUnits: number; saleUnits: number }> = {
  "아크로드서초": { totalUnits: 1161, saleUnits: 56 },
  "아크로서초": { totalUnits: 1161, saleUnits: 56 },
  "아크로서초아파트": { totalUnits: 1161, saleUnits: 56 },
  "역삼센트럴자이": { totalUnits: 237, saleUnits: 87 },
  "도곡아테라": { totalUnits: 82, saleUnits: 41 },
  "도곡아테라아파트": { totalUnits: 82, saleUnits: 41 },
  "디에이치대치에델루이": { totalUnits: 282, saleUnits: 72 },
  "래미안원펜타스": { totalUnits: 641, saleUnits: 292 },
  "메이플자이": { totalUnits: 3307, saleUnits: 162 },
  "디에이치방배": { totalUnits: 3064, saleUnits: 1244 },
  "청담르엘": { totalUnits: 1261, saleUnits: 149 },
  "아크로리츠카운티": { totalUnits: 707, saleUnits: 140 },
  "아크로리츠카운티아파트": { totalUnits: 707, saleUnits: 140 },
  "래미안레벤투스": { totalUnits: 308, saleUnits: 133 },
  "마포자이힐스테이트": { totalUnits: 1101, saleUnits: 463 },
  "마포자이힐스테이트라첼스": { totalUnits: 1101, saleUnits: 463 },
  "장위라디우스파크푸르지오": { totalUnits: 1637, saleUnits: 718 },
  "올림픽파크포레온": { totalUnits: 12032, saleUnits: 4786 },
  "힐스테이트이편한세상문정": { totalUnits: 1265, saleUnits: 299 },
  "매교역팰루시드": { totalUnits: 2178, saleUnits: 154 },
  "남부터미널역청년주택": { totalUnits: 35, saleUnits: 35 },
  "남부터미널역청년주택아파트": { totalUnits: 35, saleUnits: 35 },
  "구리역하이니티리버파크": { totalUnits: 3050, saleUnits: 1530 },
  "수택e구역": { totalUnits: 3050, saleUnits: 1530 },
  "구리수택e구역재개발": { totalUnits: 3050, saleUnits: 1530 },
};

function getAccurateUnits(name: string, rawTotal: number, rawSale?: number): { totalUnits: number; saleUnits: number } {
  const norm = name.replace(/[\s\-_(),.·[\]{}<>]/g, "").toLowerCase();
  for (const [key, val] of Object.entries(KNOWN_REDEV_MAP)) {
    const normKey = key.replace(/[\s\-_(),.·[\]{}<>]/g, "").toLowerCase();
    if (norm.includes(normKey) || normKey.includes(norm)) {
      return { totalUnits: val.totalUnits, saleUnits: val.saleUnits };
    }
  }
  const sale = rawSale && rawSale > 0 ? rawSale : rawTotal;
  const total = rawTotal && rawTotal > 0 ? rawTotal : sale;
  return { totalUnits: total, saleUnits: sale };
}

async function geocodeAddress(address: string): Promise<{ lat: number; lng: number } | null> {
  if (!address) return null;
  const cleanAddr = address.split("(")[0].trim();
  if (geocodeCache.has(cleanAddr)) return geocodeCache.get(cleanAddr)!;

  const kakaoKey = (process.env.KAKAO_REST_API_KEY || "4d7cd3190ca38a795008ebd7cc053820").trim();
  try {
    const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(cleanAddr)}`;
    const res = await fetch(url, {
      headers: { Authorization: `KakaoAK ${kakaoKey}` },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const doc = json?.documents?.[0];
    if (doc?.y && doc?.x) {
      const coord = { lat: parseFloat(doc.y), lng: parseFloat(doc.x) };
      geocodeCache.set(cleanAddr, coord);
      return coord;
    }
  } catch {}
  return null;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const aptId = searchParams.get("aptId");
  const currentMonthStr = new Date().toISOString().slice(0, 7);
  const periodStart = searchParams.get("periodStart") ?? currentMonthStr;
  const periodEnd = searchParams.get("periodEnd") ?? "2030-12";

  let baseLat: number, baseLng: number;
  let targetRegion = "";

  if (aptId) {
    const apt = APARTMENTS_DATA.find((a) => a.id === aptId);
    if (!apt) return NextResponse.json({ error: "apt not found" }, { status: 404 });
    baseLat = apt.lat ?? 0;
    baseLng = apt.lng ?? 0;
    targetRegion = apt.region;
  } else {
    baseLat = Number(searchParams.get("lat"));
    baseLng = Number(searchParams.get("lng"));
    if (!baseLat || !baseLng) {
      return NextResponse.json({ error: "lat/lng required" }, { status: 400 });
    }
  }

  const maxRadiusM = 5000;
  const units: SupplyUnit[] = [];
  const seenIds = new Set<string>();

  // 1. 한국부동산원 청약홈 실제 분양 공고 연동
  try {
    const allNotices = await getAllSubscriptionNotices();
    // 기준 단지와 동일 광역/시도 내의 분양공고 우선 지오코딩 및 거리 계산
    const targetSido = targetRegion.split(" ")[0] || "";
    const candidateNotices = allNotices.filter(
      (n) => !targetSido || n.region.includes(targetSido) || n.address.includes(targetSido)
    );

    // 본청약(APT) 공고를 우선 처리하여 무순위/줍줍(잔여세대) 공고와의 중복 시 본청약이 우선 채택되도록 정렬
    candidateNotices.sort((a, b) => {
      const aIsApt = a.type === "APT" ? 1 : 0;
      const bIsApt = b.type === "APT" ? 1 : 0;
      return bIsApt - aIsApt;
    });

    for (const notice of candidateNotices) {
      const moveIn = parseExpectedMoveIn(notice.moveInMonth);
      if (moveIn < periodStart || moveIn > periodEnd) continue;

      let coord = await geocodeAddress(notice.address);
      if (!coord) {
        // 주소 매칭이 안 된 경우 마스터 단지 중 동일 이름/주소 아파트 좌표 확인
        const matchApt = APARTMENTS_DATA.find((a) => notice.address.includes(a.district) && notice.name.includes(a.name));
        if (matchApt && matchApt.lat && matchApt.lng) coord = { lat: matchApt.lat, lng: matchApt.lng };
      }

      if (coord) {
        const distM = haversineM(baseLat, baseLng, coord.lat, coord.lng);
        if (distM <= maxRadiusM) {
          const supplyType: SupplyType = notice.rentType?.includes("임대") ? "임대" : "분양";
          const { totalUnits, saleUnits } = getAccurateUnits(notice.name, notice.totalUnits || 0, (notice as any).generalSupplyUnits);

          // 동일 단지(이름 정규화 동일, 또는 동일 지번 주소 및 초근접 100m 이내) 중복 검사
          const cleanName = notice.name.replace(/[\s\-_(),.·[\]{}<>]/g, "").toLowerCase();
          const cleanAddr = notice.address.replace(/[\s\-_(),.·[\]{}<>]/g, "").toLowerCase();

          const existingIndex = units.findIndex((u) => {
            const uCleanName = u.name.replace(/[\s\-_(),.·[\]{}<>]/g, "").toLowerCase();
            const uCleanAddr = u.address.replace(/[\s\-_(),.·[\]{}<>]/g, "").toLowerCase();
            const isSameName = uCleanName === cleanName || (cleanName.length >= 4 && (uCleanName.includes(cleanName) || cleanName.includes(uCleanName)));
            const isSameAddr = uCleanAddr.slice(0, 15) === cleanAddr.slice(0, 15) && Math.abs(u.distanceM - Math.round(distM)) < 150;
            return isSameName || isSameAddr;
          });

          if (existingIndex >= 0) {
            // 이미 동일 단지가 등록되어 있는 경우: 본청약이거나 세대수가 더 큰 공고로 통합 (무순위 줍줍의 중복 카운트 방지)
            if (notice.type === "APT" && units[existingIndex].totalUnits < totalUnits) {
              units[existingIndex] = {
                ...units[existingIndex],
                name: notice.name,
                totalUnits,
                saleUnits,
                expectedMoveIn: moveIn,
                developer: notice.company || notice.developer || units[existingIndex].developer,
              };
            }
            continue;
          }

          seenIds.add(notice.id);
          units.push({
            id: `applyhome-${notice.id}`,
            name: notice.name,
            supplyType,
            totalUnits,
            saleUnits,
            expectedMoveIn: moveIn,
            address: notice.address,
            lat: coord.lat,
            lng: coord.lng,
            distanceM: Math.round(distM),
            radiusBucket: getRadiusBucket(distM),
            developer: notice.company || notice.developer || undefined,
          });
        }
      }
    }
  } catch (err) {
    console.warn("[Supply Volume] Applyhome fetch failed:", err);
  }

  // 2. K-apt 마스터 아파트 중 현재 이후 준공/입주 예정 단지 병합
  const currentYear = new Date().getFullYear();

  const normalizeAptName = (str: string) =>
    str
      .replace(/\s+/g, "")
      .replace(/\d{4}년\d{1,2}월예정/g, "")
      .replace(/예정/g, "")
      .replace(/아파트/g, "")
      .replace(/주택재건축.*$/g, "")
      .replace(/재건축.*$/g, "")
      .replace(/주택재개발.*$/g, "")
      .toLowerCase();

  for (const apt of APARTMENTS_DATA) {
    if (aptId && apt.id === aptId) continue;
    // 과거 구축 아파트 (준공승인 완료 단지이거나 built_year가 과거인 경우) 제외
    if ((apt.built_year ?? 0) < currentYear && !apt.name.includes("예정")) continue;

    // 만약 사용승인일이 과거이고 이름에 예정이 없으면 기입주 단지이므로 제외
    if (apt.approval_date && !apt.name.includes("예정")) {
      const appYear = parseInt(apt.approval_date.slice(0, 4), 10);
      if (appYear < currentYear) continue;
    }

    if (!apt.lat || !apt.lng) continue;
    const distM = haversineM(baseLat, baseLng, apt.lat, apt.lng);
    if (distM > maxRadiusM) continue;

    // 단지명에 2028년08월예정과 같은 표기가 있으면 해당 년월 추출, 없으면 6월 기본값
    const dateMatch = apt.name.match(/(\d{4})년\s*(\d{1,2})월/);
    let expectedMoveIn = `${apt.built_year ?? 2026}-06`;
    if (dateMatch) {
      expectedMoveIn = `${dateMatch[1]}-${dateMatch[2].padStart(2, "0")}`;
    }

    // 이미 지난 시점의 입주는 배제 (앞으로 입주 예정만)
    if (expectedMoveIn < periodStart || expectedMoveIn > periodEnd) continue;

    // 청약홈 공고 또는 이미 추가된 단지와 중복 여부 확인
    const normApt = normalizeAptName(apt.name);
    const alreadyAdded = units.some((u) => {
      const normU = normalizeAptName(u.name);
      return (
        normU === normApt ||
        (normU.length >= 3 && normApt.includes(normU)) ||
        (normApt.length >= 3 && normU.includes(normApt)) ||
        (Math.abs(u.distanceM - Math.round(distM)) < 50 && (normU.includes(normApt.slice(0, 3)) || normApt.includes(normU.slice(0, 3))))
      );
    });

    if (!alreadyAdded) {
      const cleanDisplayName = apt.name
        .replace(/\s*\d{4}년\s*\d{1,2}월예정$/, "")
        .replace(/\s*예정$/, "");

      const { totalUnits, saleUnits } = getAccurateUnits(cleanDisplayName, apt.household_count, (apt as any).general_units);

      units.push({
        id: apt.id,
        name: cleanDisplayName,
        supplyType: "분양" as SupplyType,
        totalUnits,
        saleUnits,
        expectedMoveIn,
        address: `${apt.region} ${apt.district}`,
        lat: apt.lat ?? 0,
        lng: apt.lng ?? 0,
        distanceM: Math.round(distM),
        radiusBucket: getRadiusBucket(distM),
        developer: apt.construction,
      });
    }
  }

  // 3. 반경 내 정비사업 및 공공주택지구(왕숙2지구, 도농·지금, 수택E 등) 공급 계획 병합
  try {
    const masterZones = require("@/lib/redevelopment-master.json");
    for (const zone of masterZones) {
      if (!zone.lat || !zone.lng) continue;
      const distM = haversineM(baseLat, baseLng, zone.lat, zone.lng);
      if (distM > maxRadiusM) continue;
      if (
        zone.type === "공공주택" ||
        zone.status === "착공" ||
        zone.status === "사업승인" ||
        zone.status === "사전청약" ||
        zone.status === "관리처분인가"
      ) {
        const normZ = normalizeAptName(zone.name);
        const zoneCoreKeyword = zone.name.replace(/주택재개발|재개발|주택재건축|재건축|정비사업|정비구역|구역/g, "").replace(/\s+/g, "").toLowerCase();
        const alreadyAdded = units.some((u) => {
          const normU = normalizeAptName(u.name);
          const uAddr = (u.address || "").replace(/\s+/g, "").toLowerCase();
          const zAddr = (zone.address || "").replace(/\s+/g, "").toLowerCase();
          // 1. 이름 정규화 일치
          const isNameMatch = normU === normZ || (normU.length >= 4 && normZ.includes(normU)) || (normZ.length >= 4 && normU.includes(normZ));
          // 2. 분양단지 공고 주소/단지명에 정비구역 핵심어(예: 수택e, 인창c 등) 포함 여부
          const isKeywordMatch = zoneCoreKeyword.length >= 3 && (uAddr.includes(zoneCoreKeyword) || normU.includes(zoneCoreKeyword));
          // 3. 지번 및 위치 초근접 (150m 이내) 동일 사업지 여부
          const isDistMatch = Math.abs(u.distanceM - Math.round(distM)) < 150 && (zAddr.slice(0, 10) === uAddr.slice(0, 10) || isKeywordMatch);
          return isNameMatch || isKeywordMatch || isDistMatch;
        });
        if (!alreadyAdded) {
          const { totalUnits, saleUnits } = getAccurateUnits(zone.name, zone.totalUnits || 0, zone.generalUnits);
          units.push({
            id: `redev-${zone.id}`,
            name: zone.name,
            supplyType: zone.type === "공공주택" ? ("분양" as SupplyType) : ("분양" as SupplyType),
            totalUnits,
            saleUnits,
            rentalUnits: zone.rentalUnits || 0,
            expectedMoveIn: zone.status === "착공" ? "2026-12" : zone.status === "사업승인" ? "2029-06" : "2028-12",
            address: zone.address || `${zone.region} ${zone.district}`,
            lat: zone.lat,
            lng: zone.lng,
            distanceM: Math.round(distM),
            radiusBucket: getRadiusBucket(distM),
            developer: zone.builder || "시행사/LH",
          });
        }
      }
    }
  } catch (err) {
    console.warn("[Supply Volume] Master zones merge failed:", err);
  }

  units.sort((a, b) => a.distanceM - b.distanceM);

  // 반경별 집계
  const byRadius: SupplyByRadius[] = RADIUS_BUCKETS.map((r) => {
    const radiusM = r * 1000;
    const inBucket = units.filter((u) => u.distanceM <= radiusM);
    const totalUnits = inBucket.reduce((s, u) => s + u.totalUnits, 0);

    // 분기별 그룹핑
    const periodMap = new Map<string, { total: number; sale: number; rental: number; units: SupplyUnit[] }>();
    for (const u of inBucket) {
      const p = toPeriodQuarter(u.expectedMoveIn);
      const existing = periodMap.get(p) ?? { total: 0, sale: 0, rental: 0, units: [] };
      existing.total += u.totalUnits;
      existing.sale += u.saleUnits ?? 0;
      existing.rental += u.rentalUnits ?? 0;
      existing.units.push(u);
      periodMap.set(p, existing);
    }

    const byPeriod = Array.from(periodMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, v]) => ({
        period,
        totalUnits: v.total,
        saleUnits: v.sale,
        rentalUnits: v.rental,
        units: v.units,
      }));

    return { radiusM, totalUnits, byPeriod };
  });

  const response: SupplyVolumeResponse = {
    aptId: aptId ?? undefined,
    lat: baseLat,
    lng: baseLng,
    period: `${periodStart} ~ ${periodEnd}`,
    byRadius,
    units,
    meta: makeDataSourceMeta(
      "RONE_APPLY",
      new Date().toISOString().slice(0, 10),
      {
        providerLabel: "한국부동산원 청약홈 분양정보 및 국토교통부 신축 단지 기준",
      }
    ),
  };

  return NextResponse.json(response);
}
