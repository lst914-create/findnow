const fs = require("fs");
const path = require("path");

const masterPath = path.resolve(__dirname, "../src/lib/apartments-master.json");
const backupPath = path.resolve(__dirname, "../src/lib/apartments-master.backup.json");
const publicMasterPath = path.resolve(__dirname, "../public/data/master_apartments.json");

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function cleanAptNameForMatch(raw) {
  if (!raw) return { coreName: "", numberTag: "" };
  let s = raw.trim();

  // 지번 괄호 제거 (예: (910-5))
  s = s.replace(/\(\d{1,4}(-\d+)?\)/g, "");

  // 동 범위 패턴 제거 (예: 101동~111동아파트, 101동아파트, 202동)
  s = s.replace(/\d{1,4}동\s*~\s*\d{1,4}동(아파트)?/g, "");
  s = s.replace(/\d{1,4}동(아파트)?$/g, "");

  // 공백 및 특수기호 정규화
  s = s.replace(/[\s\-_(),.·]/g, "").toLowerCase();

  // 차수 또는 단지 번호 추출 (1~9차, 1~9단지)
  let numberTag = "";
  const numMatch = s.match(/([1-9])(차|단지|차아파트|단지아파트)/);
  if (numMatch) {
    numberTag = numMatch[1];
  }

  // 아파트 접미사 제거
  s = s.replace(/아파트|단지$/g, "");
  // 대표 브랜드 정규화
  s = s
    .replace(/이편한세상|e\-편한세상/gi, "e편한세상")
    .replace(/자연앤e편한세상|자연&e편한세상/gi, "e편한세상")
    .replace(/에스케이뷰|sk\s*view/gi, "sk뷰")
    .replace(/대우\s*푸르지오(?!아)/gi, "푸르지오")
    .replace(/금호\s*어울림/gi, "금호어울림");

  return { coreName: s, numberTag };
}

function areIdenticalApartments(a, b, dist) {
  if (dist > 120) return false;

  const aClean = cleanAptNameForMatch(a.name);
  const bClean = cleanAptNameForMatch(b.name);

  // 차수나 단지 번호가 서로 다르면 절대 같은 단지가 아님 (예: 1차 vs 2차, 1단지 vs 2단지)
  if (aClean.numberTag && bClean.numberTag && aClean.numberTag !== bClean.numberTag) {
    return false;
  }
  // 한쪽만 차수가 있는 경우에도 핵심 이름이 다르면 결합 금지
  if ((aClean.numberTag && !bClean.numberTag) || (!aClean.numberTag && bClean.numberTag)) {
    if (aClean.numberTag !== "1" && bClean.numberTag !== "1") {
      return false;
    }
  }

  // 핵심 단지명이 완전 일치
  if (aClean.coreName === bClean.coreName) return true;

  // 동 범위만 붙어있는 케이스
  const normA = a.name.replace(/[\s아파트]/g, "");
  const normB = b.name.replace(/[\s아파트]/g, "");
  if (normA.startsWith(normB) || normB.startsWith(normA)) {
    return true;
  }

  return false;
}

function run() {
  console.log("==========================================================================");
  console.log("🛠️ 전국 아파트 마스터 데이터셋 근본적 전수 정제 파이프라인 가동");
  console.log("==========================================================================");

  const raw = fs.readFileSync(masterPath, "utf-8");
  const list = JSON.parse(raw);
  console.log(`📦 원본 단지 수: ${list.length.toLocaleString()}개`);

  // 백업 파일 생성
  fs.writeFileSync(backupPath, raw, "utf-8");
  console.log(`💾 원본 안전 백업 생성 완료: ${backupPath}`);

  // 1단계: 중복 단지 전수 검출 및 병합
  console.log("\n[1단계] 전국 중복 단지 전수 검출 및 단일화 시작...");

  // Spatial grid (약 200m 단위 격자)
  const grid = {};
  for (let i = 0; i < list.length; i++) {
    const apt = list[i];
    if (!apt.lat || !apt.lng) continue;
    const key = Math.floor(apt.lat * 500) + "_" + Math.floor(apt.lng * 500);
    if (!grid[key]) grid[key] = [];
    grid[key].push(i);
  }

  const toRemoveIndices = new Set();
  let mergedCount = 0;

  for (const [key, indices] of Object.entries(grid)) {
    const [latBin, lngBin] = key.split("_").map(Number);
    const candidateIndices = [];
    for (let dLat = -1; dLat <= 1; dLat++) {
      for (let dLng = -1; dLng <= 1; dLng++) {
        const neighborKey = latBin + dLat + "_" + (lngBin + dLng);
        if (grid[neighborKey]) {
          candidateIndices.push(...grid[neighborKey]);
        }
      }
    }

    for (let i = 0; i < indices.length; i++) {
      const idxA = indices[i];
      if (toRemoveIndices.has(idxA)) continue;
      const aptA = list[idxA];

      for (let j = 0; j < candidateIndices.length; j++) {
        const idxB = candidateIndices[j];
        if (idxA === idxB || toRemoveIndices.has(idxB) || toRemoveIndices.has(idxA)) continue;
        const aptB = list[idxB];

        const dist = getDistance(aptA.lat, aptA.lng, aptB.lat, aptB.lng);
        if (areIdenticalApartments(aptA, aptB, dist)) {
          const aIsReal = aptA.tags && aptA.tags.includes("실거래인증");
          const bIsReal = aptB.tags && aptB.tags.includes("실거래인증");

          let keep;
          let drop;
          let dropIdx;

          if (aIsReal && !bIsReal) {
            keep = aptA;
            drop = aptB;
            dropIdx = idxB;
          } else if (!aIsReal && bIsReal) {
            keep = aptB;
            drop = aptA;
            dropIdx = idxA;
          } else if (aptA.id.startsWith("kakao-") && aptB.id.startsWith("kapt-")) {
            keep = aptA;
            drop = aptB;
            dropIdx = idxB;
          } else if (aptB.id.startsWith("kakao-") && aptA.id.startsWith("kapt-")) {
            keep = aptB;
            drop = aptA;
            dropIdx = idxA;
          } else {
            keep = aptA.name.length <= aptB.name.length ? aptA : aptB;
            drop = keep === aptA ? aptB : aptA;
            dropIdx = keep === aptA ? idxB : idxA;
          }

          // 메타데이터 통합 (세대수, 주차, 난방 등)
          if (!keep.household_count && drop.household_count) keep.household_count = drop.household_count;
          if (!keep.built_year && drop.built_year) keep.built_year = drop.built_year;
          if (!keep.parking && drop.parking) keep.parking = drop.parking;
          if (!keep.heating && drop.heating) keep.heating = drop.heating;
          if (!keep.construction && drop.construction) keep.construction = drop.construction;

          toRemoveIndices.add(dropIdx);
          mergedCount++;
        }
      }
    }
  }

  const deduplicatedList = list.filter((_, idx) => !toRemoveIndices.has(idx));
  console.log(`✅ 중복 병합 완료: ${mergedCount}개 중복 단지 통합 제거`);
  console.log(`📦 잔여 단지 수: ${deduplicatedList.length.toLocaleString()}개`);

  // 2단계: 실거래 미검증 가짜 가격(해시 기반 난수) 전면 차단
  console.log("\n[2단계] 실거래 미검증 단지의 가짜/추정 가격 전면 차단 및 클렌징...");

  let clearedFakePriceCount = 0;
  let verifiedCount = 0;

  for (const apt of deduplicatedList) {
    const isVerified = apt.tags && apt.tags.includes("실거래인증");
    if (isVerified && apt.price_min > 0) {
      verifiedCount++;
    } else {
      if (apt.price_min > 0 || apt.price_max > 0) {
        apt.price_min = 0;
        apt.price_max = 0;
        apt.rent_min = 0;
        apt.rent_max = 0;
        apt.gapPrice = 0;
        clearedFakePriceCount++;
      }
      if (!apt.tags) apt.tags = [];
      apt.tags = apt.tags.filter((t) => t !== "동별시세기준");
      if (!apt.tags.includes("거래신고대기")) {
        apt.tags.push("거래신고대기");
      }
    }

    // 설명문(description) 정제 (실시간 연동 등 불필요 문구 제거)
    if (apt.description) {
      apt.description = apt.description
        .replace(/\s*국토교통부\s*실거래\s*데이터가\s*실시간\s*연동되어\s*있습니다\.?/g, "")
        .replace(/\s*국토교통부\s*실거래가\s*공개시스템\s*및\s*K-apt\s*공식\s*공공데이터가\s*실시간\s*연동되어\s*있습니다\.?/g, "")
        .replace(/\s*카카오\s*공식\s*위치\s*정보\s*및\s*국토교통부\s*실거래\s*데이터가\s*실시간\s*연동되어\s*있습니다\.?/g, "")
        .replace(/\s*카카오\s*공식\s*위치\s*정보\s*및\s*실거래\s*데이터가\s*실시간\s*연동되어\s*있습니다\.?/g, "")
        .replace(/\s*실시간\s*연동되어\s*있습니다\.?/g, "")
        .trim();
    }
  }

  console.log(`✅ 가짜/추정 가격 차단 완료: ${clearedFakePriceCount.toLocaleString()}개 단지 시세 0 처리 (가짜 데이터 노출 원천 차단)`);
  console.log(`✅ 국토부 1:1 실거래 검증 완료 정상 단지: ${verifiedCount.toLocaleString()}개 (실제 거래 시세 100% 정상 유지)`);

  // 파일 저장
  fs.writeFileSync(masterPath, JSON.stringify(deduplicatedList, null, 2), "utf-8");
  fs.writeFileSync(publicMasterPath, JSON.stringify(deduplicatedList, null, 2), "utf-8");
  console.log(`\n💾 마스터 데이터 저장 완료!`);
  console.log(`- ${masterPath}`);
  console.log(`- ${publicMasterPath}`);
}

run();

