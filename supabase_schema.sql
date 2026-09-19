-- 1. 아파트 단지 정보 테이블 생성
CREATE TABLE IF NOT EXISTS public.apartments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL, -- 예: 서울 강남구, 경기 성남시 분당구
    district VARCHAR(100) NOT NULL, -- 예: 대치동, 삼평동
    price_min INT NOT NULL, -- 단위: 만원 (예: 150000 -> 15억)
    price_max INT NOT NULL, -- 단위: 만원
    area_sqm INT NOT NULL, -- 전용면적 m2
    area_pyeong INT NOT NULL, -- 평형 (예: 34)
    built_year INT NOT NULL, -- 준공년도
    household_count INT NOT NULL, -- 세대수
    school_score INT DEFAULT 85, -- 학군 점수 (100점 만점)
    traffic_score INT DEFAULT 90, -- 교통/역세권 점수
    nature_score INT DEFAULT 80, -- 공원/환경 점수
    tags TEXT[], -- ['역세권', '신축', '초품아', '재건축']
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 설정 및 읽기 권한 개방
ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.apartments FOR SELECT USING (true);

-- 2. 서울/경기 주요 지역 아파트 더미 데이터 삽입
INSERT INTO public.apartments (name, region, district, price_min, price_max, area_sqm, area_pyeong, built_year, household_count, school_score, traffic_score, nature_score, tags, image_url)
VALUES
('래미안 대치팰리스 1단지', '서울 강남구', '대치동', 270000, 340000, 84, 34, 2015, 1278, 99, 92, 78, ARRAY['초품아', '학군대표', '역세권', '대단지'], 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'),
('반포 자이', '서울 서초구', '반포동', 280000, 360000, 84, 34, 2009, 3410, 96, 98, 85, ARRAY['역세권', '대단지', '한강조망', '커뮤니티'], 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80'),
('마포 프레스티지 자이', '서울 마포구', '염리동', 165000, 195000, 84, 34, 2021, 1694, 88, 95, 82, ARRAY['신축', '역세권', '직주근접', '대단지'], 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80'),
('헬리오시티', '서울 송파구', '가락동', 180000, 220000, 84, 33, 2018, 9510, 91, 93, 80, ARRAY['대단지', '초품아', '역세권', '신축'], 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'),
('판교 푸르지오 그랑블', '경기 성남시', '백현동', 220000, 260000, 98, 38, 2011, 948, 94, 99, 90, ARRAY['판교역세권', '직주근접', '공원인접', '학군굿'], 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'),
('킨텍스 꿈에그린', '경기 고양시', '대화동', 95000, 125000, 84, 35, 2019, 1880, 82, 89, 88, ARRAY['GTX호재', '신축', '대공원', '대단지'], 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80'),
('DMC 롯데캐슬 더 퍼스트', '서울 은평구', '수색동', 115000, 138000, 84, 34, 2020, 1192, 84, 91, 85, ARRAY['DMC직주근접', '신축', '역세권'], 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'),
('광교 중흥S-클래스', '경기 수원시', '하동', 135000, 175000, 84, 35, 2019, 2231, 90, 92, 98, ARRAY['호수공원뷰', '신축', '광교중앙역', '초품아'], 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80');
