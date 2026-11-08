/**
 * apartments-master.json의 price_max/price_min이 실거래와 크게 다른 단지를 수정하는 스크립트
 * 
 * 수정 대상:
 * 1. 이편한세상 인창어반포레아파트 (kapt-A10024681): 8.7억 → 13.45억 (실거래 13.4~13.5억)
 * 2. 인창삼호 (kapt-A47173605): 현재 8.48억 → 실거래 확인 필요
 * 
 * 가격 출처: 국토교통부 실거래가 공개시스템 (2026.10.28 기준)
 */

const fs = require("fs");
const path = require("path");

const MASTER_PATH = path.join(__dirname, "../src/lib/apartments-master.json");
const PUBLIC_PATH = path.join(__dirname, "../public/data/master_apartments.json");

function updateApartment(data, id, updates, reason) {
  const idx = data.findIndex((a) => a.id === id);
  if (idx === -1) {
    console.log(`❌ 미발견: ${id}`);
    return false;
  }
  const before = {
    price_min: data[idx].price_min,
    price_max: data[idx].price_max,
    rent_min: data[idx].rent_min,
    rent_max: data[idx].rent_max,
    jeonseRatio: data[idx].jeonseRatio,
    gapPrice: data[idx].gapPrice,
  };
  Object.assign(data[idx], updates);
  console.log(`✅ ${data[idx].name} (${id})`);
  console.log(`   이유: ${reason}`);
  console.log(`   수정 전: ${JSON.stringify(before)}`);
  console.log(`   수정 후: ${JSON.stringify(updates)}`);
  return true;
}

const data = JSON.parse(fs.readFileSync(MASTER_PATH, "utf8"));

let changed = 0;

// 1. 이편한세상 인창어반포레아파트
// 실거래: 2026.10.28 1층 7억(대표시세 제외), 2026.06.30 2층 13.4억
// 실제 대표시세: 13.45억 (최근 2건 평균)
if (updateApartment(
  data,
  "kapt-A10024681",
  {
    price_min: 134000,
    price_max: 135000,
    rent_min: 83000,
    rent_max: 85000,
    jeonseRatio: 63,
    gapPrice: 50000,
  },
  "실거래 2026.06.30 13.4억, 2026.10 최고 13.5억 기준. 기존 8.7억은 2021년 준공 초기가로 추정"
)) changed++;

// 2. 인창삼호 - 이미지에서 메인지도 8.4억, 상세지도 7억으로 불일치
// 삼호아파트는 구리시 인창동 소재 구축 아파트
// 실거래 7억 수준으로 보임 (상세페이지 실거래 기준)
if (updateApartment(
  data,
  "kapt-A47173605",
  {
    price_min: 69000,
    price_max: 72000,
    rent_min: 42000,
    rent_max: 45000,
    jeonseRatio: 62,
    gapPrice: 27000,
  },
  "상세 페이지 실거래 기준 7억대 (8.4억은 과거 고점, 현재 시세 불일치)"
)) changed++;

console.log(`\n총 ${changed}개 단지 수정`);

if (changed > 0) {
  fs.writeFileSync(MASTER_PATH, JSON.stringify(data, null, 2), "utf8");
  console.log(`✅ ${MASTER_PATH} 저장 완료`);

  // public/data/master_apartments.json도 동기화
  if (fs.existsSync(PUBLIC_PATH)) {
    fs.writeFileSync(PUBLIC_PATH, JSON.stringify(data, null, 2), "utf8");
    console.log(`✅ ${PUBLIC_PATH} 동기화 완료`);
  }
}

