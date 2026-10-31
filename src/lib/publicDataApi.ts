/**
 * 국토교통부 공공데이터 포털 API 및 Geocoding 서비스 연동 모듈
 */

export interface MolitAptInfo {
  kaptCode: string;
  kaptName: string;
  as1: string; // 시도 (예: 서울특별시)
  as2: string; // 시군구 (예: 강남구)
  as3: string; // 읍면동 (예: 대치동)
  kaptAddr: string;
  kaptdaCnt: number; // 세대수
  kaptUsedate: string; // 사용승인일 (준공년도)
  bcode: string; // 법정동코드
  lat?: number;
  lng?: number;
}

export interface MolitTradeRecord {
  aptName: string;
  dealAmount: number; // 만원
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  excluUseAr: number; // 전용면적 m2
  floor: number;
  buildYear: number;
  umdNm: string;
}

export interface MolitRentRecord {
  aptName: string;
  depositAmount: number; // 만원 (전세 보증금)
  monthlyRent: number; // 월세
  dealYear: number;
  dealMonth: number;
  dealDay: number;
  excluUseAr: number;
  floor: number;
  buildYear: number;
  umdNm: string;
}

// 전국 17개 시·도 전체(250여개 시·군·구) 국토교통부 실거래가 법정동 코드(LAWD_CD) 마스터 목록
export const LAWD_CODES: { region: string; code: string; aliases?: string[] }[] = [
  // ==================== [1] 서울특별시 (25개 자치구) ====================
  { region: "서울 종로구", code: "11110", aliases: ["서울특별시 종로구", "종로구"] },
  { region: "서울 중구", code: "11140", aliases: ["서울특별시 중구", "서울시 중구"] },
  { region: "서울 용산구", code: "11170", aliases: ["서울특별시 용산구", "용산구"] },
  { region: "서울 성동구", code: "11200", aliases: ["서울특별시 성동구", "성동구"] },
  { region: "서울 광진구", code: "11215", aliases: ["서울특별시 광진구", "광진구"] },
  { region: "서울 동대문구", code: "11230", aliases: ["서울특별시 동대문구", "동대문구"] },
  { region: "서울 중랑구", code: "11260", aliases: ["서울특별시 중랑구", "중랑구"] },
  { region: "서울 성북구", code: "11290", aliases: ["서울특별시 성북구", "성북구"] },
  { region: "서울 강북구", code: "11305", aliases: ["서울특별시 강북구", "강북구"] },
  { region: "서울 도봉구", code: "11320", aliases: ["서울특별시 도봉구", "도봉구"] },
  { region: "서울 노원구", code: "11350", aliases: ["서울특별시 노원구", "노원구"] },
  { region: "서울 은평구", code: "11380", aliases: ["서울특별시 은평구", "은평구"] },
  { region: "서울 서대문구", code: "11410", aliases: ["서울특별시 서대문구", "서대문구"] },
  { region: "서울 마포구", code: "11440", aliases: ["서울특별시 마포구", "마포구"] },
  { region: "서울 양천구", code: "11470", aliases: ["서울특별시 양천구", "양천구"] },
  { region: "서울 강서구", code: "11500", aliases: ["서울특별시 강서구", "서울 강서"] },
  { region: "서울 구로구", code: "11530", aliases: ["서울특별시 구로구", "구로구"] },
  { region: "서울 금천구", code: "11545", aliases: ["서울특별시 금천구", "금천구"] },
  { region: "서울 영등포구", code: "11560", aliases: ["서울특별시 영등포구", "영등포구", "영등포"] },
  { region: "서울 동작구", code: "11590", aliases: ["서울특별시 동작구", "동작구"] },
  { region: "서울 관악구", code: "11620", aliases: ["서울특별시 관악구", "관악구"] },
  { region: "서울 서초구", code: "11650", aliases: ["서울특별시 서초구", "서초구"] },
  { region: "서울 강남구", code: "11680", aliases: ["서울특별시 강남구", "강남구"] },
  { region: "서울 송파구", code: "11710", aliases: ["서울특별시 송파구", "송파구"] },
  { region: "서울 강동구", code: "11740", aliases: ["서울특별시 강동구", "강동구"] },

  // ==================== [2] 부산광역시 (16개 구·군) ====================
  { region: "부산 중구", code: "26110", aliases: ["부산광역시 중구"] },
  { region: "부산 서구", code: "26140", aliases: ["부산광역시 서구"] },
  { region: "부산 동구", code: "26170", aliases: ["부산광역시 동구"] },
  { region: "부산 영도구", code: "26200", aliases: ["부산광역시 영도구", "영도구"] },
  { region: "부산 부산진구", code: "26230", aliases: ["부산광역시 부산진구", "부산진구", "서면"] },
  { region: "부산 동래구", code: "26260", aliases: ["부산광역시 동래구", "동래구"] },
  { region: "부산 남구", code: "26290", aliases: ["부산광역시 남구", "대연동"] },
  { region: "부산 북구", code: "26320", aliases: ["부산광역시 북구", "화명동"] },
  { region: "부산 해운대구", code: "26350", aliases: ["부산광역시 해운대구", "해운대구", "해운대", "마린시티", "센텀시티"] },
  { region: "부산 사하구", code: "26380", aliases: ["부산광역시 사하구", "사하구"] },
  { region: "부산 금정구", code: "26410", aliases: ["부산광역시 금정구", "금정구"] },
  { region: "부산 강서구", code: "26440", aliases: ["부산광역시 강서구", "명지", "에코델타"] },
  { region: "부산 연제구", code: "26470", aliases: ["부산광역시 연제구", "연제구", "연산동"] },
  { region: "부산 수영구", code: "26500", aliases: ["부산광역시 수영구", "수영구", "남천동", "광안리"] },
  { region: "부산 사상구", code: "26530", aliases: ["부산광역시 사상구", "사상구"] },
  { region: "부산 기장군", code: "26710", aliases: ["부산광역시 기장군", "기장군", "일광"] },

  // ==================== [3] 대구광역시 (9개 구·군) ====================
  { region: "대구 중구", code: "27110", aliases: ["대구광역시 중구", "동성로"] },
  { region: "대구 동구", code: "27140", aliases: ["대구광역시 동구", "신서혁신"] },
  { region: "대구 서구", code: "27170", aliases: ["대구광역시 서구"] },
  { region: "대구 남구", code: "27200", aliases: ["대구광역시 남구", "봉덕동"] },
  { region: "대구 북구", code: "27230", aliases: ["대구광역시 북구", "칠곡"] },
  { region: "대구 수성구", code: "27260", aliases: ["대구광역시 수성구", "수성구", "범어동", "만촌동"] },
  { region: "대구 달서구", code: "27290", aliases: ["대구광역시 달서구", "달서구", "월배"] },
  { region: "대구 달성군", code: "27710", aliases: ["대구광역시 달성군", "달성군", "테크노폴리스"] },
  { region: "대구 군위군", code: "27720", aliases: ["대구광역시 군위군", "군위군"] },

  // ==================== [4] 인천광역시 (10개 구·군) ====================
  { region: "인천 중구", code: "28110", aliases: ["인천광역시 중구", "영종도", "영종국제도시", "하늘도시", "영종구", "인천 영종구"] },
  { region: "인천 동구", code: "28140", aliases: ["인천광역시 동구", "송림동", "제물포구", "인천 제물포구", "제물포"] },
  { region: "인천 미추홀구", code: "28177", aliases: ["인천광역시 미추홀구", "미추홀구", "용현동", "주안동"] },
  { region: "인천 연수구", code: "28185", aliases: ["인천광역시 연수구", "연수구", "송도", "송도국제도시"] },
  { region: "인천 남동구", code: "28200", aliases: ["인천광역시 남동구", "남동구", "구월동", "논현동"] },
  { region: "인천 부평구", code: "28237", aliases: ["인천광역시 부평구", "부평구", "부평동", "삼산동"] },
  { region: "인천 계양구", code: "28245", aliases: ["인천광역시 계양구", "계양구", "작전동"] },
  { region: "인천 서구", code: "28260", aliases: ["인천광역시 서구", "서구", "청라", "청라국제도시", "검단", "검단신도시", "루원시티", "검단구", "인천 검단구", "서해구", "인천 서해구"] },
  { region: "인천 강화군", code: "28710", aliases: ["인천광역시 강화군", "강화군"] },
  { region: "인천 옹진군", code: "28720", aliases: ["인천광역시 옹진군", "옹진군"] },

  // ==================== [5] 광주광역시 (5개 자치구) ====================
  { region: "광주 동구", code: "29110", aliases: ["광주광역시 동구", "학동", "금남로"] },
  { region: "광주 서구", code: "29140", aliases: ["광주광역시 서구", "상무지구", "화정동"] },
  { region: "광주 남구", code: "29155", aliases: ["광주광역시 남구", "봉선동", "백운동"] },
  { region: "광주 북구", code: "29170", aliases: ["광주광역시 북구", "신용동", "일곡동"] },
  { region: "광주 광산구", code: "29200", aliases: ["광주광역시 광산구", "광산구", "수완지구", "첨단지구"] },

  // ==================== [6] 대전광역시 (5개 자치구) ====================
  { region: "대전 동구", code: "30110", aliases: ["대전광역시 동구", "용운동"] },
  { region: "대전 중구", code: "30140", aliases: ["대전광역시 중구", "목동", "선화동"] },
  { region: "대전 서구", code: "30170", aliases: ["대전광역시 서구", "둔산동", "탄방동", "도안신도시"] },
  { region: "대전 유성구", code: "30200", aliases: ["대전광역시 유성구", "유성구", "도룡동", "상대동", "노은동"] },
  { region: "대전 대덕구", code: "30230", aliases: ["대전광역시 대덕구", "송촌동", "신탄진"] },

  // ==================== [7] 울산광역시 (5개 구·군) ====================
  { region: "울산 중구", code: "31110", aliases: ["울산광역시 중구", "우정혁신", "유곡동"] },
  { region: "울산 남구", code: "31140", aliases: ["울산광역시 남구", "옥동", "신정동", "삼산동"] },
  { region: "울산 동구", code: "31170", aliases: ["울산광역시 동구", "전하동"] },
  { region: "울산 북구", code: "31200", aliases: ["울산광역시 북구", "송정지구", "매곡동"] },
  { region: "울산 울주군", code: "31710", aliases: ["울산광역시 울주군", "울주군", "범서읍", "구영리"] },

  // ==================== [8] 세종특별자치시 ====================
  { region: "세종 세종시", code: "36110", aliases: ["세종특별자치시", "세종시", "세종", "새뜸마을", "나릿재마을", "어진동", "나성동", "보람동", "도담동"] },

  // ==================== [9] 경기도 (31개 시·군) ====================
  // 수원시
  { region: "경기 수원시", code: "41110", aliases: ["경기도 수원시", "수원시", "수원"] },
  { region: "경기 수원시 장안구", code: "41111", aliases: ["수원시 장안구", "장안구", "정자동"] },
  { region: "경기 수원시 권선구", code: "41113", aliases: ["수원시 권선구", "권선구", "호매실"] },
  { region: "경기 수원시 팔달구", code: "41115", aliases: ["수원시 팔달구", "팔달구", "인계동"] },
  { region: "경기 수원시 영통구", code: "41117", aliases: ["수원시 영통구", "영통구", "광교", "광교신도시", "영통동"] },
  // 성남시
  { region: "경기 성남시", code: "41130", aliases: ["경기도 성남시", "성남시", "성남"] },
  { region: "경기 성남시 수정구", code: "41131", aliases: ["성남시 수정구", "수정구", "위례", "위례신도시", "산성동"] },
  { region: "경기 성남시 중원구", code: "41133", aliases: ["성남시 중원구", "중원구", "은행동", "금광동"] },
  { region: "경기 성남시 분당구", code: "41135", aliases: ["성남시 분당구", "분당구", "분당", "판교", "판교신도시", "정자동", "백현동"] },
  // 의정부시
  { region: "경기 의정부시", code: "41150", aliases: ["경기도 의정부시", "의정부시", "의정부"] },
  // 안양시
  { region: "경기 안양시", code: "41170", aliases: ["경기도 안양시", "안양시", "안양"] },
  { region: "경기 안양시 만안구", code: "41171", aliases: ["안양시 만안구", "만안구", "안양동"] },
  { region: "경기 안양시 동안구", code: "41173", aliases: ["안양시 동안구", "동안구", "평촌", "평촌신도시", "비산동"] },
  // 부천시
  { region: "경기 부천시", code: "41190", aliases: ["경기도 부천시", "부천시", "부천", "중동", "상동"] },
  { region: "경기 부천시 원미구", code: "41192", aliases: ["부천시 원미구", "원미구"] },
  { region: "경기 부천시 소사구", code: "41194", aliases: ["부천시 소사구", "소사구", "옥길동"] },
  { region: "경기 부천시 오정구", code: "41196", aliases: ["부천시 오정구", "오정구"] },
  // 광명시
  { region: "경기 광명시", code: "41210", aliases: ["경기도 광명시", "광명시", "광명", "철산동", "일직동"] },
  // 평택시
  { region: "경기 평택시", code: "41220", aliases: ["경기도 평택시", "평택시", "평택", "고덕", "고덕국제도시", "동삭동"] },
  // 동두천시
  { region: "경기 동두천시", code: "41250", aliases: ["경기도 동두천시", "동두천시"] },
  // 안산시
  { region: "경기 안산시", code: "41270", aliases: ["경기도 안산시", "안산시", "안산", "그랑시티자이"] },
  { region: "경기 안산시 상록구", code: "41271", aliases: ["안산시 상록구", "상록구", "사동"] },
  { region: "경기 안산시 단원구", code: "41273", aliases: ["안산시 단원구", "단원구", "고잔동"] },
  // 고양시
  { region: "경기 고양시", code: "41280", aliases: ["경기도 고양시", "고양시", "고양", "일산"] },
  { region: "경기 고양시 덕양구", code: "41281", aliases: ["고양시 덕양구", "덕양구", "삼송", "원흥", "향동", "지축", "덕은"] },
  { region: "경기 고양시 일산동구", code: "41285", aliases: ["고양시 일산동구", "일산동구", "마두동", "백석동", "식사동"] },
  { region: "경기 고양시 일산서구", code: "41287", aliases: ["고양시 일산서구", "일산서구", "킨텍스", "주엽동", "탄현동"] },
  // 과천시
  { region: "경기 과천시", code: "41290", aliases: ["경기도 과천시", "과천시", "과천", "원문동", "별양동", "갈현동"] },
  // 구리시
  { region: "경기 구리시", code: "41310", aliases: ["경기도 구리시", "구리시", "구리", "갈매동", "인창동", "수택동"] },
  // 남양주시
  { region: "경기 남양주시", code: "41360", aliases: ["경기도 남양주시", "남양주시", "남양주", "다산동", "별내동", "와부읍", "평내동", "호평동"] },
  // 오산시
  { region: "경기 오산시", code: "41370", aliases: ["경기도 오산시", "오산시", "오산", "세교", "세교신도시"] },
  // 시흥시
  { region: "경기 시흥시", code: "41390", aliases: ["경기도 시흥시", "시흥시", "시흥", "배곧", "배곧신도시", "은계"] },
  // 군포시
  { region: "경기 군포시", code: "41410", aliases: ["경기도 군포시", "군포시", "군포", "산본", "산본신도시"] },
  // 의왕시
  { region: "경기 의왕시", code: "41430", aliases: ["경기도 의왕시", "의왕시", "의왕", "포일동", "백운호수"] },
  // 하남시
  { region: "경기 하남시", code: "41450", aliases: ["경기도 하남시", "하남시", "하남", "미사", "미사강변", "감일", "위례"] },
  // 용인시
  { region: "경기 용인시", code: "41460", aliases: ["경기도 용인시", "용인시", "용인"] },
  { region: "경기 용인시 처인구", code: "41461", aliases: ["용인시 처인구", "처인구", "역북동", "남사읍"] },
  { region: "경기 용인시 기흥구", code: "41463", aliases: ["용인시 기흥구", "기흥구", "동백", "보정동", "구갈동"] },
  { region: "경기 용인시 수지구", code: "41465", aliases: ["용인시 수지구", "수지구", "수지", "성복동", "신봉동", "동천동", "풍덕천동"] },
  // 파주시
  { region: "경기 파주시", code: "41480", aliases: ["경기도 파주시", "파주시", "파주", "운정", "운정신도시", "동패동", "목동동"] },
  // 이천시
  { region: "경기 이천시", code: "41500", aliases: ["경기도 이천시", "이천시", "이천", "안흥동", "증포동"] },
  // 안성시
  { region: "경기 안성시", code: "41550", aliases: ["경기도 안성시", "안성시", "안성", "공도읍"] },
  // 김포시
  { region: "경기 김포시", code: "41570", aliases: ["경기도 김포시", "김포시", "김포", "한강신도시", "구래동", "장기동", "풍무동", "걸포동"] },
  // 화성시 (국토교통부 행정출장소 분할 코드)
  { region: "경기 화성시", code: "41595", aliases: ["경기도 화성시", "화성시", "화성", "동탄", "동탄신도시", "동탄1", "동탄2", "병점", "반월동", "능동"] },
  { region: "경기 화성시 동탄구", code: "41595", aliases: ["화성동탄", "화성동탄구", "동탄", "동탄역", "오산동", "청계동", "영천동", "목동", "산척동", "송동", "장지동", "신동", "반송동", "석우동", "능동", "반월동", "병점동", "진안동", "기산동", "반정동", "화성병점구"] },
  { region: "경기 화성시 봉담구", code: "41593", aliases: ["화성효행구", "봉담", "비봉", "정남", "봉담읍", "비봉면", "정남면", "기안동", "와우리", "수영리"] },
  { region: "경기 화성시 남양구", code: "41591", aliases: ["화성만세구", "남양", "향남", "송산", "새솔동", "마도", "서신", "팔탄", "장안", "우정", "양감", "남양읍", "향남읍"] },
  // 광주시
  { region: "경기 광주시", code: "41610", aliases: ["경기도 광주시", "경기 광주", "광주시(경기)", "태전동", "역동"] },
  // 양주시
  { region: "경기 양주시", code: "41630", aliases: ["경기도 양주시", "양주시", "양주", "옥정", "옥정신도시", "회천"] },
  // 포천시
  { region: "경기 포천시", code: "41650", aliases: ["경기도 포천시", "포천시", "포천"] },
  // 여주시
  { region: "경기 여주시", code: "41670", aliases: ["경기도 여주시", "여주시", "여주", "교동"] },
  // 연천·가평·양평 군
  { region: "경기 연천군", code: "41800", aliases: ["경기도 연천군", "연천군", "연천"] },
  { region: "경기 가평군", code: "41820", aliases: ["경기도 가평군", "가평군", "가평"] },
  { region: "경기 양평군", code: "41830", aliases: ["경기도 양평군", "양평군", "양평", "양평읍"] },

  // ==================== [10] 강원특별자치도 (18개 시·군) ====================
  { region: "강원 춘천시", code: "51110", aliases: ["강원특별자치도 춘천시", "강원도 춘천시", "춘천시", "춘천", "온의동", "퇴계동"] },
  { region: "강원 원주시", code: "51130", aliases: ["강원특별자치도 원주시", "강원도 원주시", "원주시", "원주", "기업도시", "혁신도시", "무실동"] },
  { region: "강원 강릉시", code: "51150", aliases: ["강원특별자치도 강릉시", "강원도 강릉시", "강릉시", "강릉", "유천동", "교동"] },
  { region: "강원 동해시", code: "51170", aliases: ["강원특별자치도 동해시", "동해시", "동해"] },
  { region: "강원 태백시", code: "51190", aliases: ["강원특별자치도 태백시", "태백시", "태백"] },
  { region: "강원 속초시", code: "51210", aliases: ["강원특별자치도 속초시", "강원도 속초시", "속초시", "속초", "조양동", "동명동"] },
  { region: "강원 삼척시", code: "51230", aliases: ["강원특별자치도 삼척시", "삼척시", "삼척"] },
  { region: "강원 홍천군", code: "51720", aliases: ["강원특별자치도 홍천군", "홍천군", "홍천"] },
  { region: "강원 횡성군", code: "51730", aliases: ["강원특별자치도 횡성군", "횡성군"] },
  { region: "강원 영월군", code: "51750", aliases: ["강원특별자치도 영월군", "영월군"] },
  { region: "강원 평창군", code: "51760", aliases: ["강원특별자치도 평창군", "평창군"] },
  { region: "강원 정선군", code: "51770", aliases: ["강원특별자치도 정선군", "정선군"] },
  { region: "강원 철원군", code: "51780", aliases: ["강원특별자치도 철원군", "철원군"] },
  { region: "강원 화천군", code: "51790", aliases: ["강원특별자치도 화천군", "화천군"] },
  { region: "강원 양구군", code: "51800", aliases: ["강원특별자치도 양구군", "양구군"] },
  { region: "강원 인제군", code: "51810", aliases: ["강원특별자치도 인제군", "인제군"] },
  { region: "강원 고성군", code: "51820", aliases: ["강원특별자치도 고성군", "강원 고성군"] },
  { region: "강원 양양군", code: "51830", aliases: ["강원특별자치도 양양군", "양양군", "양양"] },

  // ==================== [11] 충청북도 (11개 시·군) ====================
  { region: "충북 청주시 상당구", code: "43111", aliases: ["충청북도 청주시 상당구", "청주시 상당구", "상당구", "용암동"] },
  { region: "충북 청주시 서원구", code: "43112", aliases: ["충청북도 청주시 서원구", "청주시 서원구", "서원구", "산남동", "분평동"] },
  { region: "충북 청주시 흥덕구", code: "43113", aliases: ["충청북도 청주시 흥덕구", "청주시 흥덕구", "흥덕구", "복대동", "지웰시티", "가경동", "오송"] },
  { region: "충북 청주시 청원구", code: "43114", aliases: ["충청북도 청주시 청원구", "청주시 청원구", "청원구", "오창", "율량동"] },
  { region: "충북 청주시", code: "43110", aliases: ["충청북도 청주시", "청주시", "청주"] },
  { region: "충북 충주시", code: "43130", aliases: ["충청북도 충주시", "충주시", "충주", "연수동", "호암동"] },
  { region: "충북 제천시", code: "43150", aliases: ["충청북도 제천시", "제천시", "제천"] },
  { region: "충북 보은군", code: "43720", aliases: ["충청북도 보은군", "보은군"] },
  { region: "충북 옥천군", code: "43730", aliases: ["충청북도 옥천군", "옥천군"] },
  { region: "충북 영동군", code: "43740", aliases: ["충청북도 영동군", "영동군"] },
  { region: "충북 증평군", code: "43745", aliases: ["충청북도 증평군", "증평군"] },
  { region: "충북 진천군", code: "43750", aliases: ["충청북도 진천군", "진천군", "충북혁신도시"] },
  { region: "충북 괴산군", code: "43760", aliases: ["충청북도 괴산군", "괴산군"] },
  { region: "충북 음성군", code: "43770", aliases: ["충청북도 음성군", "음성군", "맹동면"] },
  { region: "충북 단양군", code: "43800", aliases: ["충청북도 단양군", "단양군"] },

  // ==================== [12] 충청남도 (15개 시·군) ====================
  { region: "충남 천안시 동남구", code: "44131", aliases: ["충청남도 천안시 동남구", "천안시 동남구", "신부동", "청수동"] },
  { region: "충남 천안시 서북구", code: "44133", aliases: ["충청남도 천안시 서북구", "천안시 서북구", "불당동", "신불당", "백석동", "두정동", "성성동"] },
  { region: "충남 천안시", code: "44130", aliases: ["충청남도 천안시", "천안시", "천안"] },
  { region: "충남 공주시", code: "44150", aliases: ["충청남도 공주시", "공주시", "공주", "신관동"] },
  { region: "충남 보령시", code: "44180", aliases: ["충청남도 보령시", "보령시", "보령", "대천"] },
  { region: "충남 아산시", code: "44200", aliases: ["충청남도 아산시", "아산시", "아산", "탕정", "배방", "모종동", "풍기동"] },
  { region: "충남 서산시", code: "44210", aliases: ["충청남도 서산시", "서산시", "서산", "예천동"] },
  { region: "충남 논산시", code: "44230", aliases: ["충청남도 논산시", "논산시", "논산"] },
  { region: "충남 계룡시", code: "44250", aliases: ["충청남도 계룡시", "계룡시", "계룡", "두마면"] },
  { region: "충남 당진시", code: "44270", aliases: ["충청남도 당진시", "당진시", "당진", "수청동", "송악"] },
  { region: "충남 금산군", code: "44710", aliases: ["충청남도 금산군", "금산군"] },
  { region: "충남 부여군", code: "44760", aliases: ["충청남도 부여군", "부여군"] },
  { region: "충남 서천군", code: "44770", aliases: ["충청남도 서천군", "서천군"] },
  { region: "충남 청양군", code: "44790", aliases: ["충청남도 청양군", "청양군"] },
  { region: "충남 홍성군", code: "44800", aliases: ["충청남도 홍성군", "홍성군", "내포", "내포신도시"] },
  { region: "충남 예산군", code: "44810", aliases: ["충청남도 예산군", "예산군"] },
  { region: "충남 태안군", code: "44825", aliases: ["충청남도 태안군", "태안군"] },

  // ==================== [13] 전북특별자치도 (14개 시·군) ====================
  { region: "전북 전주시 완산구", code: "52111", aliases: ["전북특별자치도 전주시 완산구", "전주시 완산구", "효자동", "서신동", "효천지구"] },
  { region: "전북 전주시 덕진구", code: "52113", aliases: ["전북특별자치도 전주시 덕진구", "전주시 덕진구", "에코시티", "송천동", "혁신", "만성동"] },
  { region: "전북 전주시", code: "52110", aliases: ["전북특별자치도 전주시", "전라북도 전주시", "전주시", "전주"] },
  { region: "전북 군산시", code: "52130", aliases: ["전북특별자치도 군산시", "군산시", "군산", "디오션시티", "조촌동", "수송동"] },
  { region: "전북 익산시", code: "52140", aliases: ["전북특별자치도 익산시", "익산시", "익산", "모현동", "영등동", "부송동"] },
  { region: "전북 정읍시", code: "52180", aliases: ["전북특별자치도 정읍시", "정읍시", "정읍"] },
  { region: "전북 남원시", code: "52190", aliases: ["전북특별자치도 남원시", "남원시", "남원"] },
  { region: "전북 김제시", code: "52210", aliases: ["전북특별자치도 김제시", "김제시", "김제"] },
  { region: "전북 완주군", code: "52710", aliases: ["전북특별자치도 완주군", "완주군", "삼봉지구", "이서면"] },
  { region: "전북 진안군", code: "52720", aliases: ["전북 진안군", "진안군"] },
  { region: "전북 무주군", code: "52730", aliases: ["전북 무주군", "무주군"] },
  { region: "전북 장수군", code: "52740", aliases: ["전북 장수군", "장수군"] },
  { region: "전북 임실군", code: "52750", aliases: ["전북 임실군", "임실군"] },
  { region: "전북 순창군", code: "52770", aliases: ["전북 순창군", "순창군"] },
  { region: "전북 고창군", code: "52790", aliases: ["전북 고창군", "고창군"] },
  { region: "전북 부안군", code: "52800", aliases: ["전북 부안군", "부안군"] },

  // ==================== [14] 전라남도 (22개 시·군) ====================
  { region: "전남 목포시", code: "46110", aliases: ["전라남도 목포시", "목포시", "목포", "남악", "옥암동"] },
  { region: "전남 여수시", code: "46130", aliases: ["전라남도 여수시", "여수시", "여수", "웅천", "웅천동", "학동", "문수동"] },
  { region: "전남 순천시", code: "46150", aliases: ["전라남도 순천시", "순천시", "순천", "신대지구", "조례동", "왕지동"] },
  { region: "전남 나주시", code: "46170", aliases: ["전라남도 나주시", "나주시", "나주", "빛가람동", "광주전남혁신도시"] },
  { region: "전남 광양시", code: "46230", aliases: ["전라남도 광양시", "광양시", "광양", "중마동", "마동"] },
  { region: "전남 담양군", code: "46710", aliases: ["전라남도 담양군", "담양군"] },
  { region: "전남 곡성군", code: "46720", aliases: ["전라남도 곡성군", "곡성군"] },
  { region: "전남 구례군", code: "46730", aliases: ["전라남도 구례군", "구례군"] },
  { region: "전남 고흥군", code: "46770", aliases: ["전라남도 고흥군", "고흥군"] },
  { region: "전남 보성군", code: "46780", aliases: ["전라남도 보성군", "보성군"] },
  { region: "전남 화순군", code: "46790", aliases: ["전라남도 화순군", "화순군", "화순읍"] },
  { region: "전남 장흥군", code: "46800", aliases: ["전라남도 장흥군", "장흥군"] },
  { region: "전남 강진군", code: "46810", aliases: ["전라남도 강진군", "강진군"] },
  { region: "전남 해남군", code: "46820", aliases: ["전라남도 해남군", "해남군"] },
  { region: "전남 영암군", code: "46830", aliases: ["전라남도 영암군", "영암군", "삼호읍"] },
  { region: "전남 무안군", code: "46840", aliases: ["전라남도 무안군", "무안군", "남악신도시", "삼향읍"] },
  { region: "전남 함평군", code: "46860", aliases: ["전라남도 함평군", "함평군"] },
  { region: "전남 영광군", code: "46870", aliases: ["전라남도 영광군", "영광군"] },
  { region: "전남 장성군", code: "46880", aliases: ["전라남도 장성군", "장성군"] },
  { region: "전남 완도군", code: "46890", aliases: ["전라남도 완도군", "완도군"] },
  { region: "전남 진도군", code: "46900", aliases: ["전라남도 진도군", "진도군"] },
  { region: "전남 신안군", code: "46910", aliases: ["전라남도 신안군", "신안군"] },

  // ==================== [15] 경상북도 (22개 시·군) ====================
  { region: "경북 포항시 남구", code: "47111", aliases: ["경상북도 포항시 남구", "포항시 남구", "지곡동", "효자동", "대이동"] },
  { region: "경북 포항시 북구", code: "47113", aliases: ["경상북도 포항시 북구", "포항시 북구", "장성동", "양덕동", "이인지구"] },
  { region: "경북 포항시", code: "47110", aliases: ["경상북도 포항시", "포항시", "포항"] },
  { region: "경북 경주시", code: "47130", aliases: ["경상북도 경주시", "경주시", "경주", "용강동", "황성동"] },
  { region: "경북 김천시", code: "47150", aliases: ["경상북도 김천시", "김천시", "김천", "율곡동", "경북혁신도시"] },
  { region: "경북 안동시", code: "47170", aliases: ["경상북도 안동시", "안동시", "안동", "옥동", "경북도청신도시"] },
  { region: "경북 구미시", code: "47190", aliases: ["경상북도 구미시", "구미시", "구미", "옥계동", "문성리", "송정동"] },
  { region: "경북 영주시", code: "47210", aliases: ["경상북도 영주시", "영주시", "영주", "가흥동"] },
  { region: "경북 영천시", code: "47230", aliases: ["경상북도 영천시", "영천시", "영천"] },
  { region: "경북 상주시", code: "47250", aliases: ["경상북도 상주시", "상주시", "상주"] },
  { region: "경북 문경시", code: "47280", aliases: ["경상북도 문경시", "문경시", "문경", "점촌"] },
  { region: "경북 경산시", code: "47290", aliases: ["경상북도 경산시", "경산시", "경산", "중산동", "펜타힐즈", "하양읍"] },
  { region: "경북 의성군", code: "47730", aliases: ["경상북도 의성군", "의성군"] },
  { region: "경북 청송군", code: "47750", aliases: ["경상북도 청송군", "청송군"] },
  { region: "경북 영양군", code: "47760", aliases: ["경상북도 영양군", "영양군"] },
  { region: "경북 영덕군", code: "47770", aliases: ["경상북도 영덕군", "영덕군"] },
  { region: "경북 청도군", code: "47820", aliases: ["경상북도 청도군", "청도군"] },
  { region: "경북 고령군", code: "47830", aliases: ["경상북도 고령군", "고령군"] },
  { region: "경북 성주군", code: "47840", aliases: ["경상북도 성주군", "성주군"] },
  { region: "경북 칠곡군", code: "47850", aliases: ["경상북도 칠곡군", "칠곡군", "석적읍", "왜관읍"] },
  { region: "경북 예천군", code: "47900", aliases: ["경상북도 예천군", "예천군", "호명읍"] },
  { region: "경북 봉화군", code: "47920", aliases: ["경상북도 봉화군", "봉화군"] },
  { region: "경북 울진군", code: "47930", aliases: ["경상북도 울진군", "울진군"] },
  { region: "경북 울릉군", code: "47940", aliases: ["경상북도 울릉군", "울릉군"] },

  // ==================== [16] 경상남도 (18개 시·군) ====================
  { region: "경남 창원시 의창구", code: "48121", aliases: ["경상남도 창원시 의창구", "창원시 의창구", "의창구", "중동", "유니시티", "팔용동"] },
  { region: "경남 창원시 성산구", code: "48123", aliases: ["경상남도 창원시 성산구", "창원시 성산구", "성산구", "용호동", "상남동", "가음동"] },
  { region: "경남 창원시 마산합포구", code: "48125", aliases: ["경상남도 창원시 마산합포구", "마산합포구", "월영동"] },
  { region: "경남 창원시 마산회원구", code: "48127", aliases: ["경상남도 창원시 마산회원구", "마산회원구", "양덕동"] },
  { region: "경남 창원시 진해구", code: "48129", aliases: ["경상남도 창원시 진해구", "진해구", "진해", "자은동", "용원동"] },
  { region: "경남 창원시", code: "48120", aliases: ["경상남도 창원시", "창원시", "창원", "마산"] },
  { region: "경남 진주시", code: "48170", aliases: ["경상남도 진주시", "진주시", "진주", "충무공동", "경남혁신도시", "초전동", "평거동"] },
  { region: "경남 통영시", code: "48220", aliases: ["경상남도 통영시", "통영시", "통영", "죽림"] },
  { region: "경남 사천시", code: "48240", aliases: ["경상남도 사천시", "사천시", "사천"] },
  { region: "경남 김해시", code: "48250", aliases: ["경상남도 김해시", "김해시", "김해", "율하", "율하지구", "장유", "내외동", "삼계동"] },
  { region: "경남 밀양시", code: "48270", aliases: ["경상남도 밀양시", "밀양시", "밀양", "삼문동"] },
  { region: "경남 거제시", code: "48310", aliases: ["경상남도 거제시", "거제시", "거제", "수월동", "상문동", "고현동"] },
  { region: "경남 양산시", code: "48330", aliases: ["경상남도 양산시", "양산시", "양산", "물금", "물금읍", "양산물금신도시", "동면", "사송"] },
  { region: "경남 의령군", code: "48720", aliases: ["경상남도 의령군", "의령군"] },
  { region: "경남 함안군", code: "48730", aliases: ["경상남도 함안군", "함안군"] },
  { region: "경남 창녕군", code: "48740", aliases: ["경상남도 창녕군", "창녕군"] },
  { region: "경남 고성군", code: "48820", aliases: ["경상남도 고성군", "경남 고성군"] },
  { region: "경남 남해군", code: "48840", aliases: ["경상남도 남해군", "남해군"] },
  { region: "경남 하동군", code: "48850", aliases: ["경상남도 하동군", "하동군"] },
  { region: "경남 산청군", code: "48860", aliases: ["경상남도 산청군", "산청군"] },
  { region: "경남 함양군", code: "48870", aliases: ["경상남도 함양군", "함양군"] },
  { region: "경남 거창군", code: "48880", aliases: ["경상남도 거창군", "거창군"] },
  { region: "경남 합천군", code: "48890", aliases: ["경상남도 합천군", "합천군"] },

  // ==================== [17] 제주특별자치도 (2개 행정시) ====================
  { region: "제주 제주시", code: "50110", aliases: ["제주특별자치도 제주시", "제주시", "제주", "노형동", "연동", "아라동", "이도동"] },
  { region: "제주 서귀포시", code: "50130", aliases: ["제주특별자치도 서귀포시", "서귀포시", "서귀포", "강정동", "영어교육도시", "대정읍"] },
];

/**
 * 시와 구가 붙어있는 경우(예: '경기 성남분당구' -> '경기 성남시 분당구') 정규화
 */
function normalizeRegionSearch(region: string, district = ""): string {
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

/**
 * 지역명(region) 및 읍면동(district)으로부터 국토교통부 법정동 코드(5자리)를 지능적으로 탐색
 * - 구(區) 단위 하위 행정구가 있는 시의 경우 통합 시 코드가 아닌 해당 구 단위 코드를 최우선 매칭
 */
export function findLawdCode(region: string, district = ""): { region: string; code: string } | null {
  if (!region && !district) return null;

  const normalized = normalizeRegionSearch(region, district);
  const cleanNorm = normalized.replace(/[\s\-_(),]/g, "");

  // 1. 완전 일치 (region 이름)
  const exact = LAWD_CODES.find((l) => l.region === normalized || l.region === region);
  if (exact) return exact;

  // 2. 구 단위 우선 매칭: normalized에 특정 '구'가 있으면 구 단위 항목 우선 필터링
  //    (예: 41130 성남시 전체가 아니라 41135 분당구를 우선 매칭)
  const hasSpecificGu = /([가-힣]{1,5}구)/.test(normalized);
  if (hasSpecificGu) {
    const guMatch = normalized.match(/([가-힣]{1,5}구)/)?.[1];
    if (guMatch) {
      const matchedGu = LAWD_CODES.find(
        (l) =>
          l.region.endsWith(guMatch) &&
          (normalized.includes(l.region.split(" ")[0]) || cleanNorm.includes(l.region.replace(/[\s]/g, "")))
      );
      if (matchedGu) return matchedGu;
    }
  }

  // 3. district 포함 매칭
  if (district) {
    const withDistrict = LAWD_CODES.find(
      (l) =>
        (l.region.includes(district) || (l.aliases && l.aliases.some((a) => a.includes(district)))) &&
        (l.region.includes(region) || region.includes(l.region.split(" ")[0]))
    );
    if (withDistrict) return withDistrict;
  }

  // 4. 별칭(aliases) 일치 검사
  const aliasMatch = LAWD_CODES.find((l) =>
    l.aliases?.some((a) => {
      const cleanAlias = a.replace(/[\s\-_(),]/g, "");
      return cleanNorm.includes(cleanAlias) || cleanAlias.includes(cleanNorm);
    })
  );
  if (aliasMatch) return aliasMatch;

  // 5. 부분 포함 검사 (가장 긴 매칭 우선)
  let bestMatch: { region: string; code: string } | null = null;
  let maxScore = 0;

  for (const entry of LAWD_CODES) {
    const rParts = entry.region.split(" ");
    const matches = rParts.filter((p) => normalized.includes(p));
    if (matches.length >= 2 && matches.length > maxScore) {
      maxScore = matches.length;
      bestMatch = entry;
    }
  }

  if (bestMatch) return bestMatch;

  // 6. 단일 키워드
  for (const entry of LAWD_CODES) {
    const guOrSi = entry.region.split(" ")[1];
    if (guOrSi && (normalized.includes(guOrSi) || guOrSi.includes(normalized))) {
      return entry;
    }
  }

  return null;
}

/**
 * 국토교통부 아파트 매매 실거래가 API 호출
 */
export async function fetchMolitTradeData(lawdCd: string, dealYmd: string): Promise<MolitTradeRecord[]> {
  const rawKey = process.env.DATA_GO_KR_API_KEY || process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY;
  if (!rawKey) return [];
  const apiKey = rawKey.includes("%") ? rawKey : encodeURIComponent(rawKey);

  try {
    const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${apiKey}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&numOfRows=1000`;

    const res = await fetch(url);
    if (!res.ok) return [];

    const xmlText = await res.text();
    const items: MolitTradeRecord[] = [];
    const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];

    for (const itemXml of itemMatches) {
      const getVal = (tag: string) => {
        const m = itemXml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
        return m ? m[1].trim() : "";
      };

      // 실제 API 응답 태그명: aptNm, dealAmount, dealYear, dealMonth, dealDay, excluUseAr, floor, buildYear, umdNm
      const dealAmtStr = getVal("dealAmount").replace(/,/g, "");
      if (dealAmtStr) {
        items.push({
          aptName: getVal("aptNm"),
          dealAmount: parseInt(dealAmtStr, 10),
          dealYear: parseInt(getVal("dealYear"), 10),
          dealMonth: parseInt(getVal("dealMonth"), 10),
          dealDay: parseInt(getVal("dealDay"), 10),
          excluUseAr: parseFloat(getVal("excluUseAr")),
          floor: parseInt(getVal("floor"), 10),
          buildYear: parseInt(getVal("buildYear"), 10),
          umdNm: getVal("umdNm"),
        });
      }
    }
    return items;
  } catch (error) {
    console.warn(`[MOLIT API Error] LAWD_CD=${lawdCd}:`, error);
    return [];
  }
}

/**
 * 국토교통부 아파트 전월세 실거래가 API 호출
 */
export async function fetchMolitRentData(lawdCd: string, dealYmd: string): Promise<MolitRentRecord[]> {
  const rawKey = process.env.DATA_GO_KR_API_KEY || process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY;
  if (!rawKey) return [];
  const apiKey = rawKey.includes("%") ? rawKey : encodeURIComponent(rawKey);

  try {
    const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent?serviceKey=${apiKey}&LAWD_CD=${lawdCd}&DEAL_YMD=${dealYmd}&numOfRows=1000`;

    const res = await fetch(url);
    if (!res.ok) return [];

    const xmlText = await res.text();
    const items: MolitRentRecord[] = [];
    const itemMatches = xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];

    for (const itemXml of itemMatches) {
      const getVal = (tag: string) => {
        const m = itemXml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
        return m ? m[1].trim() : "";
      };

      // 국토부 API 응답 태그명 (버전에 따라 영문/한글 혼용 대응)
      const depositRaw = getVal("deposit") || getVal("보증금액") || getVal("보증금");
      const depositStr = depositRaw.replace(/,/g, "").trim();
      const rentRaw = getVal("monthlyRent") || getVal("월세금액") || getVal("월세금") || getVal("월세");
      const rentStr = rentRaw.replace(/,/g, "").trim();

      if (depositStr) {
        items.push({
          aptName: getVal("aptNm") || getVal("아파트"),
          depositAmount: parseInt(depositStr, 10),
          monthlyRent: rentStr ? parseInt(rentStr, 10) : 0,
          dealYear: parseInt(getVal("dealYear") || getVal("년"), 10),
          dealMonth: parseInt(getVal("dealMonth") || getVal("월"), 10),
          dealDay: parseInt(getVal("dealDay") || getVal("일"), 10),
          excluUseAr: parseFloat(getVal("excluUseAr") || getVal("전용면적")),
          floor: parseInt(getVal("floor") || getVal("층"), 10),
          buildYear: parseInt(getVal("buildYear") || getVal("건축년도"), 10),
          umdNm: getVal("umdNm") || getVal("법정동"),
        });
      }
    }
    return items;
  } catch (error) {
    console.warn(`[MOLIT Rent API Error] LAWD_CD=${lawdCd}:`, error);
    return [];
  }
}
