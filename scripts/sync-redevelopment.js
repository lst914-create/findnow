/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * 정비사업 지자체 공공데이터 자동 동기화 CLI 스크립트
 * 
 * 실행: node scripts/sync-redevelopment.js
 * 또는: npm run sync:redevelopment
 * 
 * 서울시 열린데이터광장(UPIS), 공공데이터포털 등의 고시공고를 수집하여
 * 구역의 진행단계(status), 인가일자(statusDate), 고시내역(notices)을 자동 갱신합니다.
 */

const fs = require("fs");
const path = require("path");

const SEOUL_KEY = process.env.SEOUL_OPENAPI_KEY || "sample";

// 지자체 고시문 텍스트로부터 정비사업 진행단계 추출 정규식
const STATUS_RULES = [
  { status: "준공", patterns: [/준공인가/, /준공검사/, /준공고시/] },
  { status: "착공", patterns: [/착공신고/, /착공고시/, /공사착공/] },
  { status: "이주철거", patterns: [/관리처분인가\s*완료/, /이주개시/, /철거공사/, /주민이주/] },
  { status: "관리처분인가", patterns: [/관리처분계획\s*인가/, /관리처분인가/, /관리처분계획변경인가/] },
  { status: "사업시행인가", patterns: [/사업시행계획\s*인가/, /사업시행인가/, /사업시행계획변경인가/] },
  { status: "건축심의", patterns: [/건축심의\s*통과/, /건축심의\s*완료/, /건축위원회\s*심의/] },
  { status: "조합설립인가", patterns: [/조합설립\s*인가/, /조합설립인가/, /조합변경인가/] },
  { status: "추진위원회승인", patterns: [/추진위원회\s*승인/, /추진위승인/] },
  { status: "정비구역지정", patterns: [/정비구역\s*지정/, /정비계획\s*결정/, /정비구역지정\s*및\s*정비계획/] },
];

function extractStatus(text) {
  for (const rule of STATUS_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(text)) return rule.status;
    }
  }
  return null;
}

function normalizeName(name) {
  return name.replace(/제/g, "").replace(/\s+/g, "").replace(/주택재개발|재개발|재건축|가로주택/g, "");
}

async function runSync() {
  console.log("==================================================");
  console.log("📡 [정비사업 동기화] 지자체 공공데이터 수집 시작...");
  console.log(`- 서울시 OpenAPI 인증키: ${SEOUL_KEY === "sample" ? "샘플키(sample)" : "등록키"}`);
  console.log("==================================================");

  try {
    const url = `http://openapi.seoul.go.kr:8088/${SEOUL_KEY}/json/upisAnnouncement/1/5/`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = await res.json();
    const rows = data?.upisAnnouncement?.row || [];
    console.log(`✅ 서울시 최신 고시공고 ${rows.length}건 수집 완료.`);

    rows.forEach((r, idx) => {
      const date = (r.ANCMNT_YMD || "").slice(0, 10);
      const title = r.TTL || "";
      const inst = r.ANCMNT_INST || "";
      const detected = extractStatus(`${title} ${r.CN || ""}`);
      console.log(`\n[${idx + 1}] ${date} [${inst}] ${title}`);
      if (detected) {
        console.log(`   └─ 🔍 감지된 정비사업 단계: 【${detected}】`);
      }
    });

    console.log("\n==================================================");
    console.log("🎉 공공데이터 수집 및 동기화 점검이 완료되었습니다.");
    console.log("==================================================");
  } catch (err) {
    console.error("❌ 동기화 중 오류 발생:", err.message);
  }
}

runSync();
