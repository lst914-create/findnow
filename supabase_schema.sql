-- 1. 아파트 단지 정보 테이블 생성 (국토교통부 공공데이터 스키마 확장)
CREATE TABLE IF NOT EXISTS public.apartments (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL, -- 예: 서울 강남구, 경기 남양주시
    district VARCHAR(100) NOT NULL, -- 예: 대치동, 다산동
    lawd_code VARCHAR(20), -- 법정동 코드 (예: 41360)
    price_min INT NOT NULL, -- 매매가 최소 (단위: 만원)
    price_max INT NOT NULL, -- 매매가 최대
    rent_min INT, -- 전세가 최소 (단위: 만원)
    rent_max INT, -- 전세가 최대
    area_sqm INT NOT NULL, -- 전용면적 m2
    area_pyeong INT NOT NULL, -- 평형 (예: 34)
    built_year INT NOT NULL, -- 준공년도
    household_count INT NOT NULL, -- 세대수
    construction VARCHAR(100), -- 시공사
    parking VARCHAR(50), -- 주차
    heating VARCHAR(50), -- 난방
    school_score INT DEFAULT 85, -- 학군 점수
    traffic_score INT DEFAULT 90, -- 교통 점수
    nature_score INT DEFAULT 80, -- 공원 점수
    station VARCHAR(100), -- 인근 지하철역
    station_dist VARCHAR(100), -- 지하철역 거리
    walk_minutes INT DEFAULT 5, -- 도보 분
    lat DOUBLE PRECISION, -- 위도
    lng DOUBLE PRECISION, -- 경도
    tags TEXT[], -- ['역세권', '신축', '초품아', '5억대전세']
    image_url TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 아파트 실거래 이력 테이블 생성 (국토교통부 매매/전세 실거래)
CREATE TABLE IF NOT EXISTS public.real_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    apartment_id VARCHAR(100) REFERENCES public.apartments(id) ON DELETE CASCADE,
    trade_type VARCHAR(20) NOT NULL, -- '매매' | '전세' | '월세'
    deal_price INT NOT NULL, -- 금액 (만원)
    monthly_price INT DEFAULT 0, -- 월세 (만원)
    area_sqm DOUBLE PRECISION NOT NULL,
    floor INT,
    deal_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 설정 및 읽기 권한 개방
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on apartments" ON public.apartments FOR SELECT USING (true);

ALTER TABLE public.real_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access on transactions" ON public.real_transactions FOR SELECT USING (true);

-- 검색 성능 최적화 인덱스
CREATE INDEX IF NOT EXISTS idx_apartments_region ON public.apartments(region);
CREATE INDEX IF NOT EXISTS idx_apartments_district ON public.apartments(district);
CREATE INDEX IF NOT EXISTS idx_apartments_lawd ON public.apartments(lawd_code);

-- 2. 서울 25개 자치구 + 경기 31개 시·군 + 인천 송도 전역 대표 아파트 데이터 삽입 (총 57개 단지)
INSERT INTO public.apartments (name, region, district, price_min, price_max, area_sqm, area_pyeong, built_year, household_count, school_score, traffic_score, nature_score, tags, image_url)
VALUES
-- 서울 25개 구
('래미안 대치팰리스 1단지', '서울 강남구', '대치동', 270000, 340000, 84, 34, 2015, 1278, 99, 92, 78, ARRAY['초품아', '학군대표', '역세권', '대단지'], 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
('반포 자이', '서울 서초구', '반포동', 280000, 360000, 84, 34, 2009, 3410, 96, 98, 85, ARRAY['역세권', '대단지', '한강조망', '커뮤니티'], 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'),
('마포 프레스티지 자이', '서울 마포구', '염리동', 165000, 195000, 84, 34, 2021, 1694, 88, 95, 82, ARRAY['신축', '역세권', '직주근접', '대단지'], 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
('헬리오시티', '서울 송파구', '가락동', 180000, 220000, 84, 33, 2018, 9510, 91, 93, 80, ARRAY['대단지', '초품아', '역세권', '신축'], 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
('DMC 롯데캐슬 더 퍼스트', '서울 은평구', '수색동', 115000, 138000, 84, 34, 2020, 1192, 84, 91, 85, ARRAY['DMC직주근접', '신축', '역세권'], 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'),
('올림픽파크 포레온', '서울 강동구', '둔촌동', 170000, 210000, 84, 34, 2025, 12032, 95, 94, 92, ARRAY['초대단지', '신축입주', '올림픽공원'], 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'),
('SK 북한산시티', '서울 강북구', '미아동', 68000, 82000, 84, 33, 2004, 3830, 80, 83, 95, ARRAY['숲세권', '북한산뷰', '대단지'], 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
('마곡 엠밸리 7단지', '서울 강서구', '마곡동', 145000, 175000, 84, 34, 2014, 1004, 89, 97, 90, ARRAY['마곡지구', '역세권', '직주근접'], 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'),
('e편한세상 서울대입구 1단지', '서울 관악구', '봉천동', 105000, 128000, 84, 34, 2019, 1531, 83, 90, 86, ARRAY['신축', '강남접근성', '대단지'], 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
('자양 더샵스타시티', '서울 광진구', '자양동', 175000, 220000, 101, 39, 2007, 1177, 91, 98, 88, ARRAY['주상복합', '건대입구역', '한강생활권'], 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
('신도림 디큐브시티', '서울 구로구', '신도림동', 130000, 160000, 84, 34, 2011, 524, 86, 99, 82, ARRAY['초역세권', '백화점연결', '교통요충지'], 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'),
('독산 롯데캐슬 골드파크 1차', '서울 금천구', '독산동', 88000, 108000, 84, 34, 2016, 1743, 81, 88, 84, ARRAY['대단지', '금천구대장', '신안산선호재'], 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'),
('중계 주공5단지', '서울 노원구', '중계동', 72000, 95000, 84, 31, 1992, 2328, 97, 85, 89, ARRAY['노원학군', '은행사거리', '재건축기대'], 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'),
('창동 주공19단지', '서울 도봉구', '창동', 65000, 85000, 84, 32, 1988, 1764, 82, 93, 86, ARRAY['창동아레나', 'GTX-C', '재건축추진'], 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
('답십리 래미안 위브', '서울 동대문구', '답십리동', 108000, 132000, 84, 33, 2014, 2652, 85, 91, 84, ARRAY['광화문직주근접', '대단지', '역세권'], 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
('흑석 아크로리버하임', '서울 동작구', '흑석동', 190000, 240000, 84, 34, 2019, 1073, 90, 96, 97, ARRAY['한강뷰', '9호선역세권', '프리미엄'], 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'),
('신촌 e편한세상', '서울 서대문구', '북아현동', 140000, 175000, 84, 34, 2017, 1910, 87, 97, 83, ARRAY['광화문역세권', '신축대단지', '이대역'], 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
('성수 아크로서울포레스트', '서울 성동구', '성수동1가', 550000, 750000, 159, 62, 2020, 280, 94, 97, 100, ARRAY['서울숲조망', '하이엔드', '초고층'], 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'),
('길음 래미안 센터피스', '서울 성북구', '길음동', 110000, 135000, 84, 34, 2019, 2352, 86, 94, 84, ARRAY['미아사거리역', '신축대단지', '초품아'], 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'),
('목동 신시가지 7단지', '서울 양천구', '목동', 195000, 240000, 84, 35, 1986, 2550, 99, 95, 91, ARRAY['목동학군', '목동역', '대지지분최대'], 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'),
('여의도 시범아파트', '서울 영등포구', '여의도동', 210000, 270000, 84, 36, 1971, 1790, 92, 96, 98, ARRAY['여의도재건축', '한강변', '신통기획'], 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
('한남 더 힐', '서울 용산구', '한남동', 750000, 1100000, 208, 85, 2011, 600, 93, 92, 99, ARRAY['대한민국최고가', '배산임수', '단독단지형'], 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
('경희궁 자이 2단지', '서울 종로구', '홍파동', 170000, 205000, 84, 34, 2017, 1148, 89, 98, 90, ARRAY['도심직주근접', '서대문역', '종로대장'], 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'),
('남산타운', '서울 중구', '신당동', 115000, 142000, 84, 32, 2002, 5150, 84, 94, 96, ARRAY['남산조망', '버티고개역', '초대단지'], 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
('면목 라온프라이빗', '서울 중랑구', '면목동', 82000, 98000, 84, 33, 2020, 453, 80, 87, 89, ARRAY['중랑천공원', '신축', '동부간선지하화'], 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'),

-- 경기 31개 시·군
('판교 푸르지오 그랑블', '경기 성남시', '백현동', 220000, 260000, 98, 38, 2011, 948, 94, 99, 90, ARRAY['판교역세권', '직주근접', '공원인접'], 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'),
('킨텍스 꿈에그린', '경기 고양시', '대화동', 95000, 125000, 84, 35, 2019, 1880, 82, 89, 88, ARRAY['GTX호재', '신축', '대공원', '대단지'], 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'),
('광교 중흥S-클래스', '경기 수원시', '이의동', 135000, 175000, 84, 35, 2019, 2231, 90, 92, 98, ARRAY['호수공원뷰', '신축', '광교중앙역'], 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'),
('평촌 더샵 아이파크', '경기 안양시', '호계동', 88000, 110000, 84, 34, 2019, 1174, 92, 88, 84, ARRAY['평촌학원가', '신축', '대단지'], 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
('수지 래미안 이스트팰리스 3단지', '경기 용인시', '동천동', 92000, 115000, 101, 39, 2010, 885, 93, 87, 94, ARRAY['수지학군', '리조트형', '신분당선'], 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'),
('부천 힐스테이트 중동', '경기 부천시', '중동', 89000, 115000, 84, 35, 2022, 999, 85, 97, 88, ARRAY['7호선역세권', '부천시청역', '신축주상복합'], 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
('안산 그랑시티자이 1차', '경기 안산시', '사동', 68000, 85000, 84, 35, 2020, 3728, 84, 86, 95, ARRAY['신안산선호재', '초대단지', '시화호뷰'], 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'),
('다산 e편한세상 자이', '경기 남양주시', '다산동', 78000, 95000, 84, 34, 2018, 1685, 86, 92, 90, ARRAY['8호선연장', '다산신도시', '초품아'], 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
('동탄역 롯데캐슬', '경기 화성시', '오산동', 145000, 185000, 84, 34, 2021, 940, 89, 100, 87, ARRAY['SRT/GTX동탄역', '롯데백화점연결', '동탄대장'], 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
('힐스테이트 지제역', '경기 평택시', '세교동', 58000, 72000, 84, 33, 2020, 1519, 80, 93, 82, ARRAY['평택지제역', '삼성캠퍼스', 'SRT역세권'], 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'),
('의정부역 센트럴자이앤위브캐슬', '경기 의정부시', '의정부동', 65000, 82000, 84, 34, 2022, 2473, 81, 94, 83, ARRAY['GTX-C호재', '의정부역', '초대단지'], 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'),
('운정신도시 아이파크', '경기 파주시', '동패동', 67000, 83000, 84, 34, 2020, 3042, 84, 91, 92, ARRAY['GTX-A운정역', '운정신도시', '초대단지'], 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'),
('시흥 은계 자이', '경기 시흥시', '은행동', 59000, 73000, 84, 33, 2020, 1719, 82, 85, 88, ARRAY['은계지구', '서해선', '신축대단지'], 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
('걸포 북변 파크자이', '경기 김포시', '걸포동', 68000, 86000, 84, 34, 2020, 4229, 83, 88, 91, ARRAY['김포골드라인', '걸포북변역', '초대단지'], 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'),
('철산 자이 더 헤리티지', '경기 광명시', '철산동', 105000, 130000, 84, 34, 2025, 3804, 90, 95, 85, ARRAY['7호선철산역', '광명재개발', '신축입주'], 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
('경기광주역 e편한세상', '경기 광주시', '역동', 62000, 76000, 84, 33, 2016, 2122, 81, 92, 87, ARRAY['경강선역세권', '판교15분', '대단지'], 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
('산본 래미안 하이퍼스', '경기 군포시', '산본동', 76000, 92000, 84, 34, 2010, 2644, 88, 91, 89, ARRAY['4호선산본역', '산본대장', '초품아'], 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'),
('이천 자이 더 리체', '경기 이천시', '증포동', 48000, 59000, 84, 33, 2026, 558, 79, 82, 88, ARRAY['하이닉스직주근접', '이천신축', '브랜드자이'], 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'),
('오산 세교 자이', '경기 오산시', '세교동', 45000, 56000, 84, 33, 2018, 1110, 80, 86, 89, ARRAY['오산대역', '세교신도시', '가성비'], 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'),
('미사강변 더샵 센트럴포레', '경기 하남시', '풍산동', 93000, 115000, 84, 34, 2017, 487, 88, 93, 94, ARRAY['5호선하남풍산역', '미사강변', '한강공원'], 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'),
('양주 옥정 대방노블랜드 1차', '경기 양주시', '옥정동', 46000, 58000, 84, 34, 2021, 1483, 81, 87, 90, ARRAY['7호선연장호재', '옥정신도시', '수영장보유'], 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
('갈매역 아이파크', '경기 구리시', '갈매동', 75000, 90000, 84, 34, 2018, 1196, 84, 93, 87, ARRAY['갈매역초역세권', '구리갈매지구', '상권연결'], 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'),
('안성 아양 시티프라디움', '경기 안성시', '옥산동', 38000, 47000, 84, 33, 2018, 688, 78, 79, 86, ARRAY['아양지구', '안성대장', '초품아'], 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
('포천 KCC스위첸', '경기 포천시', '어룡동', 34000, 42000, 84, 33, 2017, 461, 76, 80, 89, ARRAY['7호선포천연장', '포천시청생활권', '브랜드아파트'], 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
('의왕 포일 엘센트로', '경기 의왕시', '포일동', 110000, 138000, 84, 34, 2019, 1774, 89, 96, 91, ARRAY['인덕원역GTX', '의왕대장', '신축대단지'], 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'),
('여주역 휴먼빌', '경기 여주시', '교동', 39000, 48000, 84, 33, 2023, 640, 77, 89, 88, ARRAY['경강선여주역', '판교출퇴근', '신축단지'], 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'),
('양평 한라비발디 1단지', '경기 양평군', '양평읍', 42000, 51000, 84, 34, 2023, 750, 78, 88, 96, ARRAY['KTX양평역', '남한강조망', '친환경'], 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'),
('동두천 송내 주공 5단지', '경기 동두천시', '송내동', 22000, 29000, 84, 32, 2003, 1104, 75, 83, 86, ARRAY['1호선지행역', '가성비최고', '송내지구'], 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80'),
('과천 푸르지오 써밋', '경기 과천시', '중앙동', 185000, 235000, 84, 34, 2020, 1571, 97, 96, 98, ARRAY['과천대장', '4호선초역세권', '관악산뷰'], 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
('가평 자이', '경기 가평군', '가평읍', 36000, 45000, 84, 34, 2023, 505, 76, 87, 99, ARRAY['ITX가평역', '북한강수변공원', '자이프리미엄'], 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'),
('연천 전곡 e편한세상', '경기 연천군', '전곡읍', 28000, 35000, 84, 33, 2019, 461, 74, 84, 92, ARRAY['1호선연천연장', '전곡역', '브랜드아파트'], 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),

-- 인천 송도
('송도 더샵 센트럴파크 2차', '인천 연수구', '송도동', 75000, 98000, 98, 39, 2011, 632, 89, 86, 97, ARRAY['센트럴파크뷰', '국제학교', '공원인접'], 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80');
