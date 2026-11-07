const fs = require('fs');
const path = require('path');

// 삭제 대상 가짜/더미 구역 ID 27개 목록
const FAKE_ZONE_IDS = new Set([
  'hwaseong-1',          // 화성동탄2구역 (재건축)
  'hanam-1',              // 하남미사1구역 (재건축)
  'uijeongbu-2',         // 의정부민락2구역 (재개발)
  'yangju-1',            // 양주회천1구역 (재개발)
  'yeosu-1',             // 여수웅천1구역 (재개발)
  'gimhae-1',            // 김해장유1구역 (재개발)
  'jeju-1',              // 제주노형1구역 (재개발)
  'sejong-jochiwon',     // 조치원1구역 (재개발)
  'chuncheon-1',         // 춘천소양로1구역 (재개발)
  'wonju-1',             // 원주단구1구역 (재개발)
  'gyeongju-1',          // 경주황성1구역 (재개발)
  'pohang-1',            // 포항대잠1구역 (재개발)
  'gumi-1',              // 구미원평1구역 (재개발)
  'suncheon-1',          // 순천매곡1구역 (재개발)
  'cheonan-1',           // 천안신부1구역 (재개발)
  'cheonan-2',           // 천안봉명1구역 (재개발)
  'cheongju-1',          // 청주성안1구역 (재개발)
  'cheongju-2',          // 청주복대1구역 (재개발)
  'changwon-masanhappo', // 마산합포1구역 (재개발)
  'ulsan-nam-1',         // 삼산1구역 (재개발)
  'ulsan-dong-1',        // 방어진1구역 (재개발)
  'daejeon-seo-1',       // 복수1구역 (재개발)
  'daegu-dalseo-2',      // 죽전1구역 (재개발)
  'daegu-suseong-1',     // 수성1구역 (재개발)
  'gunpo-1',             // 군포당정1구역 (재개발)
  'uiwang-1',            // 의왕내손1구역 (재개발)
  'suwon-gwonseon',      // 권선1구역 (재개발)
  'siheung-jeongwang',   // 정왕1구역 (재개발)
  'uijeongbu-1',         // 의정부1구역 (재개발)
]);

console.log(`총 삭제 대상 가짜 구역: ${FAKE_ZONE_IDS.size}개`);

// 1. master_redevelopment.json 정제
const masterFile = path.join(__dirname, '../public/data/master_redevelopment.json');
if (fs.existsSync(masterFile)) {
  const masterData = JSON.parse(fs.readFileSync(masterFile, 'utf8'));
  const beforeCount = masterData.length;
  const cleanedMaster = masterData.filter(z => !FAKE_ZONE_IDS.has(z.id));
  fs.writeFileSync(masterFile, JSON.stringify(cleanedMaster, null, 2), 'utf8');
  console.log(`✅ [master_redevelopment.json] 정제 완료: ${beforeCount}개 → ${cleanedMaster.length}개 (삭제: ${beforeCount - cleanedMaster.length}개)`);
}

// 2. nationwideZonesExtra.ts 정제
const extraFile = path.join(__dirname, '../src/lib/nationwideZonesExtra.ts');
if (fs.existsSync(extraFile)) {
  const content = fs.readFileSync(extraFile, 'utf8');
  const lines = content.split('\n');

  const cleanedLines = [];
  let i = 0;
  let removedCount = 0;

  while (i < lines.length) {
    const line = lines[i];
    // id 검사
    const idMatch = line.match(/"id":\s*"([^"]+)"/);
    if (idMatch && FAKE_ZONE_IDS.has(idMatch[1])) {
      // 객체 시작점({) 찾기 위해 cleanedLines에서 역행
      while (cleanedLines.length > 0 && !cleanedLines[cleanedLines.length - 1].trim().startsWith('{')) {
        cleanedLines.pop();
      }
      if (cleanedLines.length > 0 && cleanedLines[cleanedLines.length - 1].trim().startsWith('{')) {
        cleanedLines.pop(); // '{' 제거
      }
      // 이 객체의 끝(})까지 스킵
      let braceCount = 1;
      while (i < lines.length && braceCount > 0) {
        i++;
        const curLine = lines[i] || '';
        for (const ch of curLine) {
          if (ch === '{') braceCount++;
          if (ch === '}') braceCount--;
        }
      }
      // 뒤따르는 쉼표나 빈 줄 처리
      i++;
      removedCount++;
      continue;
    }

    cleanedLines.push(line);
    i++;
  }

  // 문법 오류(연속 쉼표나 쉼표 누락 등) 정비
  let finalContent = cleanedLines.join('\n');
  finalContent = finalContent.replace(/,\s*,/g, ',');
  finalContent = finalContent.replace(/,\s*\];/g, '\n];');

  fs.writeFileSync(extraFile, finalContent, 'utf8');
  console.log(`✅ [nationwideZonesExtra.ts] 정제 완료: ${removedCount}개 가짜 구역 제거 완료!`);
}

