const apiKey = "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";
const decodedKey = decodeURIComponent(apiKey);

async function testKapt() {
  const endpoints = [
    // 한국부동산원_공동주택 단지 목록제공 서비스
    `https://apis.data.go.kr/1613000/AptListService2/getTotalAptList?serviceKey=${apiKey}&pageNo=1&numOfRows=10`,
    `https://apis.data.go.kr/1613000/AptListService2/getTotalAptList?serviceKey=${encodeURIComponent(decodedKey)}&pageNo=1&numOfRows=10`,
    // 국토교통부 공동주택 기본정보
    `https://apis.data.go.kr/1613000/AptBasisInfoService1/getAphusBassInfo?serviceKey=${apiKey}&kaptCode=A13508601`,
    // 서울시 공동주택 정보 or 공공데이터
  ];

  for (const u of endpoints) {
    try {
      console.log('Testing URL:', u.split('?')[0]);
      const res = await fetch(u);
      console.log('Status:', res.status);
      const text = await res.text();
      console.log('Response sample:', text.slice(0, 300));
      console.log('-----------------------------');
    } catch(e) {
      console.error('Error:', e.message);
    }
  }
}
testKapt();
