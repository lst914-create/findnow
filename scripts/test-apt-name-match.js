const normalizeAptName = (name) => (name || '').replace(/[\s\(\)\[\]\-_]/g, '').toLowerCase();
const extractKeywords = (name) => new Set((name || '').split(/[\s\(\)]+/).filter(Boolean));
const extractAptNums = (norm) => norm.match(/\d{1,3}/g) || [];
const stripRegionAndDong = (norm) => norm.replace(/^(지금동|지금|도농동|도농|다산동|다산|토평동|토평|교문동|교문|가운동|가운|신도시)/, '');
const DISTINCT_SUB_NAMES = ['스카이뷰', '어반포레', '장자마을', '검배마을'];

function isAptNameMatch(targetName, candidateName, targetRegion = '', targetDistrict = '', candidateUmd = '') {
  if (!targetName || !candidateName) return false;
  if (targetDistrict && candidateUmd) {
    const cleanDist = targetDistrict.replace(/[\s0-9]/g, '').replace(/(동|읍|면|리)$/, '');
    const cleanUmd = candidateUmd.replace(/[\s0-9]/g, '').replace(/(동|읍|면|리)$/, '');
    if (cleanDist.length >= 2 && cleanUmd.length >= 2) {
      const isDasanArea = (targetDistrict.includes('다산') || targetDistrict.includes('지금')) && (candidateUmd.includes('다산') || candidateUmd.includes('지금'));
      if (!isDasanArea) {
        if (!candidateUmd.includes(cleanDist) && !targetDistrict.includes(cleanUmd)) return false;
      }
    }
  }
  const tNorm = normalizeAptName(targetName);
  const cNorm = normalizeAptName(candidateName);
  for (const sub of DISTINCT_SUB_NAMES) {
    if (tNorm.includes(sub) !== cNorm.includes(sub)) return false;
  }
  return true;
}

console.log('1. 토평동 신명스카이뷰 vs 교문동 장자마을신명:', isAptNameMatch('신명스카이뷰아파트', '장자마을(신명)', '경기 구리시', '토평동', '교문동'));
console.log('2. 토평동 신명스카이뷰 vs 교문동 신명:', isAptNameMatch('신명스카이뷰아파트', '신명', '경기 구리시', '토평동', '교문동'));
console.log('3. 토평동 신명스카이뷰 vs 토평동 신명스카이뷰:', isAptNameMatch('신명스카이뷰아파트', '신명스카이뷰', '경기 구리시', '토평동', '토평동'));

