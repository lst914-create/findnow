const https = require('https');

const key = 'w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D';
const url = 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=' + key + '&LAWD_CD=11680&DEAL_YMD=202507&numOfRows=5';

console.log('Testing URL:', url.substring(0, 120) + '...');

let data = '';
https.get(url, function(res) {
  console.log('HTTP Status:', res.statusCode);
  res.on('data', function(chunk) { data += chunk; });
  res.on('end', function() {
    console.log('Response:');
    console.log(data.substring(0, 1200));
  });
}).on('error', function(e) {
  console.log('ERR:', e.message);
});
