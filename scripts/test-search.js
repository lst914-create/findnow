const fs = require('fs');
const path = require('path');
const data = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/lib/apartments-master.json'), 'utf8'));

function cleanKoreanParticle(word) {
  return word.replace(/(에서가장|에서|으로|이랑|하고|에게|부터|까지|에는|에|이|가|은|는|을|를|의|로|인)$/, '');
}

const STOP_WORDS = new Set([
  '아파트', '단지', '가장', '가까운', '근처', '주변', '어디', '정보', '시세',
  '추천', '찾아줘', '있는', '원해', '좋은', '살기', '입구', '인근', '도보',
  '역에서', '역이랑', '역근처', '역주변', '에서', '으로', '이랑', '하고', '과', '와'
]);

function extractSearchKeywords(rawQuery) {
  const trimmed = rawQuery.trim();
  const isHangangSearch = /(한강|리버|리버뷰|수변|강변|강조망)/i.test(trimmed);
  const isStationNearSearch = /(역세권|지하철역|전철역|역에서|역근처|역가까운)/i.test(trimmed);
  const isNearSearch = /(가장|가까운|근처|주변|인근|도보|앞|옆)/i.test(trimmed);

  let cleaned = trimmed
    .replace(/(\d+(?:\.\d+)?)\s*억\s*(?:(\d+)\s*천)?\s*(대|데|원)?/gi, ' ')
    .replace(/(전세|매매|월세|매매가)/gi, ' ')
    .replace(/(역이랑|역에서|역근처|역주변|역인근)/gi, '역 ')
    .replace(/(가장|가까운|아파트|단지|추천|찾아줘|있는|원해|주변|어디|정보|시세|살기|좋은)/gi, ' ');

  const rawTokens = trimmed.split(/\s+/);
  const cleanTokens = cleaned.split(/\s+/);
  const candidateKeywords = new Set();

  [...rawTokens, ...cleanTokens].forEach((t) => {
    let word = t.trim();
    if (!word) return;
    const stripped = cleanKoreanParticle(word);
    [word, stripped].forEach((w) => {
      if (w.length >= 2 && !STOP_WORDS.has(w) && !/^(전세|매매|월세|억|억대|억데|아파트|단지)$/.test(w) && !/^\d+억/.test(w)) {
        candidateKeywords.add(w);
      }
    });
    if (word.endsWith('역') && word.length > 2) candidateKeywords.add(word.slice(0, -1));
  });

  return {
    keywords: Array.from(candidateKeywords),
    isNearSearch,
    isHangangSearch,
    isStationNearSearch
  };
}

function scoreApartment(apt, queryInfo) {
  const { keywords, isHangangSearch } = queryInfo;
  let score = 0;
  if (keywords.length > 0) {
    let hasLocationOrNameMatch = false;
    for (const kw of keywords) {
      const lkw = kw.toLowerCase();
      if (apt.name && apt.name.toLowerCase().includes(lkw)) { score += 30; hasLocationOrNameMatch = true; }
      if (apt.district && apt.district.toLowerCase().includes(lkw)) { score += 35; hasLocationOrNameMatch = true; }
      if (apt.region && apt.region.toLowerCase().includes(lkw)) { score += 25; hasLocationOrNameMatch = true; }
      if (apt.station && apt.station.toLowerCase().includes(lkw)) { score += 25; hasLocationOrNameMatch = true; }
      if (apt.tags && apt.tags.some(t => t.toLowerCase().includes(lkw))) { score += 20; hasLocationOrNameMatch = true; }
      if (apt.description && apt.description.toLowerCase().includes(lkw)) { score += 15; hasLocationOrNameMatch = true; }
    }
    if (!hasLocationOrNameMatch) return 0;
  } else {
    score = 10;
  }

  if (isHangangSearch) {
    const hasHangangTag = apt.tags && apt.tags.some(t => /한강|리버|수변|강변/.test(t));
    const hasHangangDesc = /한강|리버|수변|강변/.test(apt.description || '');
    if (apt.hangang_minutes !== undefined || apt.is_hangang_view) {
      score += 150;
      if (apt.hangang_minutes) score += Math.max(0, (10 - apt.hangang_minutes) * 15);
      if (apt.is_hangang_view) score += 50;
    } else if (hasHangangTag || hasHangangDesc) {
      score += 80;
    } else {
      score -= 60;
    }
  }
  return Math.max(0, score);
}

const queries = [
  '남양주에서 한강이 가장 가까운 아파트',
  '덕소 한강뷰 아파트',
  '다산동 5억대 아파트'
];

for (const q of queries) {
  console.log('====================================');
  console.log('Query:', q);
  const qInfo = extractSearchKeywords(q);
  console.log('Keywords:', qInfo.keywords, 'isHangang:', qInfo.isHangangSearch);

  const scored = data
    .map(apt => ({ apt, score: scoreApartment(apt, qInfo) }))
    .filter(item => item.score > 0);

  scored.sort((a, b) => {
    if (qInfo.isHangangSearch) {
      const aRiver = a.apt.hangang_minutes ?? (a.apt.tags?.some(t => t.includes('한강')) ? 7 : 99);
      const bRiver = b.apt.hangang_minutes ?? (b.apt.tags?.some(t => t.includes('한강')) ? 7 : 99);
      if (aRiver !== bRiver) return aRiver - bRiver;
    }
    if (b.score !== a.score) return b.score - a.score;
    return 0;
  });

  console.log('Total Results:', scored.length);
  console.log('Top 5 Results:');
  scored.slice(0, 5).forEach((s, idx) => {
    console.log(`${idx + 1}. [${s.apt.region} ${s.apt.district}] ${s.apt.name} | 한강: ${s.apt.hangang_dist || '없음'} (${s.apt.hangang_minutes || '-'}분) | 점수: ${s.score}`);
  });
}
