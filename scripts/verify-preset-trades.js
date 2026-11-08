// transactionsCache.ts의 프리셋 거래 매핑 검증 스크립트
const path = require("path");
const fs = require("fs");

// apartments-master.json 로드
const masterPath = path.join(__dirname, "../src/lib/apartments-master.json");
const apts = JSON.parse(fs.readFileSync(masterPath, "utf8"));

// transactionsCache.ts에서 PRESET_TRADES 로직을 JS로 재현
const PRESET_TRADES = {
  "창조": [{ aptName: "창조아파트", dealAmount: 17000, umdNm: "다산동" }],
  "제일": [{ aptName: "제일아파트", dealAmount: 42000, umdNm: "다산동" }],
  "롯데낙천대": [{ aptName: "남양주다산롯데낙천대아파트", dealAmount: 72800, umdNm: "다산동" }],
  "꿈에그린": [{ aptName: "한화꿈에그린아파트", dealAmount: 75000, umdNm: "다산동" }],
  "교문장자마을신명": [{ aptName: "교문장자마을신명", dealAmount: 78000, umdNm: "교문동" }],
  "신명스카이뷰": [{ aptName: "신명스카이뷰아파트", dealAmount: 53000, umdNm: "토평동" }],
  "다산한강반도유보라": [{ aptName: "다산한강반도유보라", dealAmount: 102000, umdNm: "다산동" }],
  "금강펜테리움리버테라스2차": [{ aptName: "다산금강펜테리움리버테라스2차", dealAmount: 110000, umdNm: "다산동" }],
  "신안인스빌퍼스트리버": [{ aptName: "다산신안인스빌퍼스트리버", dealAmount: 98000, umdNm: "다산동" }],
  "금강펜테리움리버테라스1차": [{ aptName: "다산금강펜테리움리버테라스1차", dealAmount: 109000, umdNm: "다산동" }],
  "오창우림필유2차": [{ aptName: "오창우림필유2차아파트", dealAmount: 27150, umdNm: "오창읍" }],
  "오창우림필유1차": [{ aptName: "오창우림필유1차아파트", dealAmount: 25800, umdNm: "오창읍" }],
};

function getPreloadedTransactions(apt) {
  if (!apt || !apt.name) return { trades: [], isPreset: false };
  const name = apt.name;

  for (const [key, preset] of Object.entries(PRESET_TRADES)) {
    if (name.includes(key)) {
      // 법정동 검증
      if (preset[0]?.umdNm && apt.district && !apt.district.includes(preset[0].umdNm) && !preset[0].umdNm.includes(apt.district)) {
        continue;
      }
      return { trades: preset, isPreset: true, matchedKey: key };
    }
  }
  return { trades: [], isPreset: false };
}

console.log("=== PRESET 거래 매핑 검증 ===\n");

// 1. 신명스카이뷰 검증
const skyview = apts.find(a => a.name && a.name.includes("신명스카이뷰") && a.district === "토평동");
if (skyview) {
  const result = getPreloadedTransactions(skyview);
  console.log(`신명스카이뷰아파트 (토평동):`);
  console.log(`  isPreset: ${result.isPreset}`);
  console.log(`  matchedKey: ${result.matchedKey}`);
  console.log(`  price: ${result.trades[0]?.dealAmount}만원 (${result.trades[0]?.dealAmount/10000}억)`);
  console.log(`  expected: 5.3억 (53000만)`);
  console.log(`  ✅ OK: ${result.trades[0]?.dealAmount === 53000}\n`);
} else {
  console.log("❌ 신명스카이뷰아파트 (토평동) 미발견\n");
}

// 2. 교문장자마을신명 검증 (신명스카이뷰에 매칭되면 안 됨)
const gyomun = apts.find(a => a.name && a.name.includes("교문장자마을신명"));
if (gyomun) {
  const result = getPreloadedTransactions(gyomun);
  console.log(`교문장자마을신명 (교문동):`);
  console.log(`  isPreset: ${result.isPreset}`);
  console.log(`  matchedKey: ${result.matchedKey}`);
  console.log(`  price: ${result.trades[0]?.dealAmount}만원`);
  console.log(`  ✅ OK: ${result.matchedKey === "교문장자마을신명"}\n`);
} else {
  console.log("교문장자마을신명 미발견 (정상일 수 있음)\n");
}

// 3. 인창어반포레 - preset 없어야 함
const inchang = apts.find(a => a.name && a.name.includes("인창어반포레"));
if (inchang) {
  const result = getPreloadedTransactions(inchang);
  console.log(`이편한세상 인창어반포레 (인창동):`);
  console.log(`  isPreset: ${result.isPreset} (false 여야 함)`);
  console.log(`  price_max: ${inchang.price_max}만원 (${inchang.price_max/10000}억)`);
  console.log(`  ✅ OK (no preset): ${!result.isPreset}\n`);
}

// 4. 전국 단지 중 "신명" 포함 단지 확인
console.log("=== '신명' 포함 단지 전국 목록 ===");
const sinmyeongApts = apts.filter(a => a.name && a.name.includes("신명"));
sinmyeongApts.slice(0, 20).forEach(a => {
  const result = getPreloadedTransactions(a);
  const icon = result.isPreset ? "✅" : "⬜";
  const price = result.isPreset ? `${result.trades[0]?.dealAmount/10000}억` : `fallback(${a.price_max/10000}억)`;
  console.log(`${icon} ${a.name} (${a.district}) → ${price} [key: ${result.matchedKey || '-'}]`);
});

console.log(`\n총 '신명' 포함 단지: ${sinmyeongApts.length}개`);

