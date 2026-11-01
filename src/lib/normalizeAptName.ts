/**
 * 국토교통부 실거래가 공개시스템(RTMS) 단지명과
 * K-apt 공동주택 마스터 단지명 간의 상호 매칭을 위한 표준 정규화 함수
 */
export function normalizeAptName(name: string): string {
  if (!name) return "";

  return name
    // 1. 공백, 특수문자, 괄호류 제거
    .replace(/[\s\-_(),.·[\]{}<>]/g, "")
    // 2. 단지명에 흔히 붙는 '아파트', '마을' 단어 제거
    .replace(/아파트|마을/g, "")
    // 3. 주요 브랜드명 / 시행사명 / 택지지구 접두사 상호 변환 (국토부 신고명 vs K-apt 등록명)
    .replace(/다산지금|다산진건|다산신도시/g, "다산")
    .replace(/가운마을/g, "가운")
    .replace(/부영사랑으로|사랑으로\s*부영|사랑으로/gi, "부영")
    .replace(/금강펜테리움/gi, "펜테리움")
    .replace(/자연앤e편한세상|자연&e편한세상|이편한세상|e\-편한세상/gi, "e편한세상")
    .replace(/에스케이뷰|sk\s*view/gi, "sk뷰")
    .replace(/대우\s*푸르지오(?!아)/gi, "푸르지오")
    .replace(/금호\s*어울림/gi, "금호어울림")
    .replace(/호반\s*베르디움/gi, "호반베르디움")
    .replace(/호반\s*써밋/gi, "호반써밋")
    .replace(/유승\s*한내들/gi, "유승한내들")
    .replace(/신안\s*인스빌/gi, "신안인스빌")
    .replace(/한신\s*휴플러스|한신\s*더휴/gi, "한신더휴")
    .replace(/센트럴에일린의뜰/gi, "에일린의뜰")
    // 4. 차수/단지/로마숫자 번호 표준화 (1~9차/단지)
    .replace(/1차|ⅰ|i단지|1단지|Ⅰ/gi, "1")
    .replace(/2차|ⅱ|ii단지|2단지|Ⅱ/gi, "2")
    .replace(/3차|ⅲ|iii단지|3단지|Ⅲ/gi, "3")
    .replace(/4차|ⅳ|iv단지|4단지|Ⅳ/gi, "4")
    .replace(/5차|ⅴ|v단지|5단지|Ⅴ/gi, "5")
    .replace(/6차|ⅵ|vi단지|6단지|Ⅵ/gi, "6")
    .replace(/7차|ⅶ|vii단지|7단지|Ⅶ/gi, "7")
    .replace(/8차|ⅷ|viii단지|8단지|Ⅷ/gi, "8")
    .replace(/9차|ⅸ|ix단지|9단지|Ⅸ/gi, "9")
    // 5. 영문 소문자화
    .toLowerCase();
}
