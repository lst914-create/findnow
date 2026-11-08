const normalizeAptName = (name) => (name || '').replace(/[\s\(\)\[\]\-_]/g, '').toLowerCase();
const DISTINCT_SUB_NAMES = [
  "스카이뷰", "어반포레", "장자마을", "검배마을", "아름마을", "꽃뫼마을", "상록",
  "메이플타운", "리버테라스", "아이비파크", "아이비플레이스", "퍼스트리버", "퍼스트포레",
  "골든뷰", "리버펠리체", "황금산", "폴라리스", "더퍼스트", "유보라마크뷰", "해링턴타워",
  "해링턴플레이스", "효성해링턴", "에일린의뜰", "센트럴파크", "파크뷰", "레이크",
  "한강", "낙천대"
];

function isAptNameMatch(targetName, candidateName, targetRegion = '', targetDistrict = '', candidateUmd = '') {
  if (!targetName || !candidateName) return false;
  if (targetDistrict && candidateUmd) {
    const cleanDist = targetDistrict.replace(/[\s0-9]/g, '').replace(/(동|읍|면|리)$/, '');
    const cleanUmd = candidateUmd.replace(/[\s0-9]/g, '').replace(/(동|읍|면|리)$/, '');
    if (cleanDist.length >= 1 && cleanUmd.length >= 1) {
      const isDasanArea = (targetDistrict.includes('다산') || targetDistrict.includes('지금') || targetDistrict.includes('가운')) &&
        (candidateUmd.includes('다산') || candidateUmd.includes('지금') || candidateUmd.includes('가운'));
      if (!isDasanArea) {
        const distInUmd = candidateUmd.includes(cleanDist);
        const umdInDist = targetDistrict.includes(cleanUmd);
        if (!distInUmd && !umdInDist) return false;
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

// 전국 주요 시도별 크로스 매칭 테스트 케이스
const testCases = [
  // 1. 서울: 마포구 아현동 vs 공덕동 (다른 법정동)
  { target: ['마포래미안푸르지오', '서울 마포구', '아현동'], candidate: ['공덕래미안', '공덕동'], expect: false, desc: '서울 마포 아현동 vs 공덕동 다른 법정동 차단' },
  // 2. 서울: 송파구 잠실동 vs 신천동 (다른 법정동)
  { target: ['잠실엘스', '서울 송파구', '잠실동'], candidate: ['파크리오', '신천동'], expect: false, desc: '서울 송파 잠실동 vs 신천동 다른 법정동 차단' },
  // 3. 부산: 해운대구 우동 vs 중동 (1글자 법정동 완벽 차단!)
  { target: ['해운대자이1차', '부산 해운대구', '우동'], candidate: ['해운대자이2차', '중동'], expect: false, desc: '부산 해운대 우동 vs 중동 1글자 법정동 차단' },
  // 4. 대구: 수성구 범어동 vs 만촌동 (다른 법정동)
  { target: ['범어에일린의뜰', '대구 수성구', '범어동'], candidate: ['만촌에일린의뜰', '만촌동'], expect: false, desc: '대구 수성 범어동 vs 만촌동 다른 법정동 차단' },
  // 5. 대전: 유성구 봉명동 vs 상대동 (다른 법정동)
  { target: ['도안호반베르디움', '대전 유성구', '봉명동'], candidate: ['트리풀시티', '상대동'], expect: false, desc: '대전 유성 봉명동 vs 상대동 다른 법정동 차단' },
  // 6. 광주: 광산구 수완동 vs 신가동 (다른 법정동)
  { target: ['수완진아리채', '광주 광산구', '수완동'], candidate: ['신가진아리채', '신가동'], expect: false, desc: '광주 광산 수완동 vs 신가동 다른 법정동 차단' },
  // 7. 경기 구리: 토평동 신명스카이뷰 vs 교문동 장자마을신명
  { target: ['신명스카이뷰아파트', '경기 구리시', '토평동'], candidate: ['장자마을신명', '교문동'], expect: false, desc: '경기 구리 토평동 vs 교문동 신명 혼입 차단' },
  // 8. 경기 구리: 토평동 신명스카이뷰 vs 토평동 신명스카이뷰 (정상)
  { target: ['신명스카이뷰아파트', '경기 구리시', '토평동'], candidate: ['신명스카이뷰', '토평동'], expect: true, desc: '동일 법정동 정상 단지 매칭 허용' },
  // 9. 인천: 연수구 송도동 vs 동춘동
  { target: ['송도더샵센트럴파크', '인천 연수구', '송도동'], candidate: ['동춘더샵', '동춘동'], expect: false, desc: '인천 연수 송도동 vs 동춘동 차단' },
  // 10. 울산: 남구 신정동 vs 삼산동
  { target: ['문수로아이파크', '울산 남구', '신정동'], candidate: ['삼산아이파크', '삼산동'], expect: false, desc: '울산 남구 신정동 vs 삼산동 차단' },
];

let allPassed = true;
testCases.forEach((tc, idx) => {
  const actual = isAptNameMatch(tc.target[0], tc.candidate[0], tc.target[1], tc.target[2], tc.candidate[1]);
  const pass = actual === tc.expect;
  if (!pass) allPassed = false;
  console.log(`[${pass ? 'PASS ✅' : 'FAIL ❌'}] ${tc.desc} -> 결과: ${actual}`);
});

console.log(`\n전국 단위 검증 결과: ${allPassed ? '모든 테스트 케이스 100% 통과 🎉' : '일부 실패 ❌'}`);
