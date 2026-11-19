const fs = require('fs');
const path = require('path');

const ROOT = 'c:/Users/PC/Desktop/streamlit-detail-page/chajwo';
const MASTER_PATH = path.join(ROOT, 'src/lib/apartments-master.json');
const PDA_PATH = path.join(ROOT, 'src/lib/publicDataApi.ts');

const pdaContent = fs.readFileSync(PDA_PATH, 'utf8');

// 정규식으로 LAWD_CODES 파싱
const lines = pdaContent.split('\n');
const lawdList = [];
for (const line of lines) {
  const regMatch = line.match(/region:\s*["']([^"']+)["']/);
  const codeMatch = line.match(/code:\s*["']([^"']+)["']/);
  if (regMatch && codeMatch) {
    const aliasMatch = line.match(/aliases:\s*(\[[^\]]+\])/);
    let aliases = [];
    if (aliasMatch) {
      try {
        aliases = eval(aliasMatch[1]);
      } catch (e) {}
    }
    lawdList.push({ region: regMatch[1], code: codeMatch[1], aliases });
  }
}

console.log('추출된 LAWD_CODES 수:', lawdList.length);

function normalizeRegionSearch(region, district = "") {
  let text = `${region || ""} ${district || ""}`.trim();

  return text
    .replace(/(성남)(수정구|중원구|분당구)/g, "$1시 $2")
    .replace(/(수원)(장안구|권선구|팔달구|영통구)/g, "$1시 $2")
    .replace(/(용인)(처인구|기흥구|수지구)/g, "$1시 $2")
    .replace(/(안양)(만안구|동안구)/g, "$1시 $2")
    .replace(/(고양)(덕양구|일산동구|일산서구)/g, "$1시 $2")
    .replace(/(부천)(원미구|소사구|오정구)/g, "$1시 $2")
    .replace(/(안산)(상록구|단원구)/g, "$1시 $2")
    .replace(/(천안)(동남구|서북구)/g, "$1시 $2")
    .replace(/(청주)(상당구|서원구|흥덕구|청원구)/g, "$1시 $2")
    .replace(/(포항)(남구|북구)/g, "$1시 $2")
    .replace(/(창원)(의창구|성산구|마산합포구|마산회원구|진해구)/g, "$1시 $2")
    .replace(/(전주)(완산구|덕진구)/g, "$1시 $2");
}

function findLawdCode(region, district = "") {
  if (!region && !district) return null;

  const normalized = normalizeRegionSearch(region, district);
  const cleanNorm = normalized.replace(/[\s\-_(),]/g, "");

  // 1. 완전 일치 (region 이름)
  const exact = lawdList.find((l) => l.region === normalized || l.region === region);
  if (exact) return exact;

  // 2. 구 단위 우선 매칭
  const hasSpecificGu = /([가-힣]{1,5}구)/.test(normalized);
  if (hasSpecificGu) {
    const guMatch = normalized.match(/([가-힣]{1,5}구)/)?.[1];
    if (guMatch) {
      const matchedGu = lawdList.find(
        (l) =>
          l.region.endsWith(guMatch) &&
          (normalized.includes(l.region.split(" ")[0]) || cleanNorm.includes(l.region.replace(/[\s]/g, "")))
      );
      if (matchedGu) return matchedGu;
    }
  }

  // 3. district 포함 매칭
  if (district) {
    const withDistrict = lawdList.find(
      (l) =>
        (l.region.includes(district) || (l.aliases && l.aliases.some((a) => a.includes(district)))) &&
        cleanNorm.includes(l.region.split(" ")[0])
    );
    if (withDistrict) return withDistrict;
  }

  // 4. aliases 완전 일치
  const byAlias = lawdList.find(
    (l) => l.aliases && l.aliases.some((a) => a === normalized || a === region)
  );
  if (byAlias) return byAlias;

  // 5. aliases 부분 일치
  const byAliasPartial = lawdList.find(
    (l) => l.aliases && l.aliases.some((a) => cleanNorm.includes(a.replace(/[\s\-_(),]/g, "")))
  );
  if (byAliasPartial) return byAliasPartial;

  // 6. 포함 일치 (cleanNorm 기준)
  const partial = lawdList.find((l) => {
    const cleanL = l.region.replace(/[\s\-_(),]/g, "");
    return cleanNorm.includes(cleanL) || cleanL.includes(cleanNorm);
  });
  if (partial) return partial;

  return null;
}

const masterData = JSON.parse(fs.readFileSync(MASTER_PATH, 'utf8'));
let updatedCount = 0;
let alreadyCount = 0;
let failList = [];

const enriched = masterData.map(apt => {
  // 항상 가장 정확한 findLawdCode로 검증/보강
  const found = findLawdCode(apt.region, apt.district);
  const sgg = found ? found.code : (apt.sgg_cd || apt.bjd_code || null);

  if (sgg) {
    if (!apt.sgg_cd) updatedCount++;
    else alreadyCount++;
    return {
      ...apt,
      sgg_cd: sgg,
      bjd_code: sgg
    };
  }

  failList.push(`${apt.id} | ${apt.name} | ${apt.region} | ${apt.district}`);
  return apt;
});

console.log('총 단지 수:', masterData.length);
console.log('기존 보유:', alreadyCount);
console.log('신규 보강:', updatedCount);
console.log('총 sgg_cd 보유율:', ((alreadyCount + updatedCount) / masterData.length * 100).toFixed(2) + '%');
console.log('미해결 단지 수:', failList.length);
if (failList.length > 0) {
  console.log('미해결 샘플 10개:\n', failList.slice(0, 10).join('\n'));
}

// 파일 저장
fs.writeFileSync(MASTER_PATH, JSON.stringify(enriched, null, 0));
console.log('apartments-master.json 전수 sgg_cd 보강 저장 완료!');
