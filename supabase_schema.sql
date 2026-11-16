-- ==============================================================================
-- 공공데이터 표준 7대 핵심 테이블 스키마 (Official Public Data Architecture)
-- ==============================================================================
-- 1. data_sources: 8대 공식 공공데이터 카탈로그 및 수집 관리
-- 2. apartments: 국토부 공동주택(K-apt) 및 지자체 주소/좌표 단지 마스터
-- 3. transactions: 국토교통부 매매/전월세 실거래 신고 원시 데이터
-- 4. redevelopment_projects: 국토부 전국 도시정비사업 및 서울 정보몽땅 구역 마스터
-- 5. housing_supply: 한국부동산원 청약홈 및 지자체 주택공급/입주예정 데이터
-- 6. commercial_stores: 소상공인시장진흥공단 전국 상가(상권) 점포 정보
-- 7. data_change_logs: 데이터 정합성 검증 및 변경 감사 이력
-- ==============================================================================

-- 1. [data_sources] 데이터 출처 및 수집 주기 메타데이터
CREATE TABLE IF NOT EXISTS public.data_sources (
    id VARCHAR(50) PRIMARY KEY,              -- 식별자 (예: 'apt-trade', 'kapt-info')
    category VARCHAR(100) NOT NULL,          -- 데이터 영역 (예: '아파트 매매 실거래가')
    source_name VARCHAR(200) NOT NULL,        -- 공식 출처명 (예: '국토교통부 실거래가 공개시스템')
    provider VARCHAR(100) NOT NULL,           -- 제공기관 (예: '국토교통부', '한국부동산원')
    portal_url TEXT NOT NULL,                 -- 출처 URL
    api_endpoint TEXT,                        -- API 엔드포인트 URL
    update_cycle VARCHAR(100) NOT NULL,       -- 갱신 주기 (예: '실시간', '월간')
    usage_terms TEXT NOT NULL,                -- 이용 조건 및 통계 혼용 주의사항
    stat_type VARCHAR(20) NOT NULL,           -- 'RAW' | 'INDEX' | 'MASTER' | 'PATCH'
    priority VARCHAR(20) DEFAULT '필수',      -- '필수' | '권장' | '보완'
    is_active BOOLEAN DEFAULT TRUE,           -- 수집 활성화 여부
    last_collected_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. [apartments] 아파트 단지 기본정보 (K-apt 공식 기본정보 기반)
CREATE TABLE IF NOT EXISTS public.apartments (
    id VARCHAR(100) PRIMARY KEY,              -- 단지 식별자 (예: 'kapt-A10025828')
    name VARCHAR(255) NOT NULL,               -- 공식 단지명
    bjd_code VARCHAR(10) NOT NULL,            -- 법정동 코드 10자리 (예: '4136011000')
    sido VARCHAR(50) NOT NULL,                -- 시도 (예: '경기도')
    sigungu VARCHAR(50) NOT NULL,             -- 시군구 (예: '남양주시')
    eupmyeondong VARCHAR(50) NOT NULL,        -- 읍면동 (예: '다산동')
    road_address TEXT,                        -- 도로명 주소
    jibun_address TEXT,                       -- 지번 주소
    lat DOUBLE PRECISION,                     -- 위도 (정규화된 정밀 좌표)
    lng DOUBLE PRECISION,                     -- 경도
    household_count INT NOT NULL DEFAULT 0,   -- 세대수 (공식 관리 세대수)
    building_count INT,                       -- 총 동수
    built_year INT,                           -- 준공년도
    use_approval_date DATE,                   -- 사용승인일
    builder VARCHAR(100),                     -- 시공사
    developer VARCHAR(100),                   -- 시행사
    heat_type VARCHAR(50),                    -- 난방방식 (지역난방/개별난방/중앙난방)
    hall_type VARCHAR(50),                    -- 현관구조 (계단식/복도식/혼합식)
    parking_count INT,                        -- 총 주차대수
    parking_ratio DOUBLE PRECISION,           -- 세대당 주차대수
    kapt_code VARCHAR(20),                    -- K-apt 단지 식별코드
    base_date DATE DEFAULT CURRENT_DATE,      -- 데이터 기준일
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. [transactions] 국토교통부 실거래 이력 (매매 / 전세 / 월세)
CREATE TABLE IF NOT EXISTS public.transactions (
    id VARCHAR(120) PRIMARY KEY,              -- 거래 고유 식별자 (지역-연월일-접수순번 해시)
    apartment_id VARCHAR(100) REFERENCES public.apartments(id) ON DELETE SET NULL,
    bjd_code VARCHAR(10) NOT NULL,            -- 법정동 코드
    trade_type VARCHAR(20) NOT NULL,          -- '매매' | '전세' | '월세'
    deal_date DATE NOT NULL,                  -- 계약일자 (YYYY-MM-DD)
    deal_year INT NOT NULL,                   -- 계약년도
    deal_month INT NOT NULL,                  -- 계약월
    deal_day INT,                             -- 계약일
    price INT NOT NULL DEFAULT 0,             -- 거래금액 or 보증금 (단위: 만원)
    monthly_rent INT NOT NULL DEFAULT 0,      -- 월세 (단위: 만원, 순수 전세는 0)
    area_sqm DOUBLE PRECISION NOT NULL,       -- 전용면적 (㎡)
    pyeong INT,                               -- 공급 평형 (환산)
    floor INT,                                -- 해당 층수
    apt_name_raw VARCHAR(255) NOT NULL,       -- 실거래 신고 원시 단지명
    jibun_raw VARCHAR(100),                   -- 원시 지번
    is_canceled BOOLEAN DEFAULT FALSE,        -- 거래 취소/해제 여부
    cancel_date DATE,                         -- 취소일자
    contract_term VARCHAR(50),                -- 계약구분 (신규/갱신)
    data_source_id VARCHAR(50) DEFAULT 'apt-trade', -- 'apt-trade' | 'apt-rent'
    base_date DATE DEFAULT CURRENT_DATE,      -- 수집 기준일
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. [redevelopment_projects] 전국 도시정비사업 구역 정보
CREATE TABLE IF NOT EXISTS public.redevelopment_projects (
    id VARCHAR(100) PRIMARY KEY,              -- 정비사업 구역 식별자
    name VARCHAR(255) NOT NULL,               -- 구역명 / 사업명
    bjd_code VARCHAR(10),                     -- 법정동 코드
    sido VARCHAR(50) NOT NULL,                -- 시도
    sigungu VARCHAR(50) NOT NULL,             -- 시군구
    dong VARCHAR(50),                         -- 동
    project_type VARCHAR(50) NOT NULL,        -- 재개발, 재건축, 가로주택, 소규모재건축 등
    stage VARCHAR(50) NOT NULL,               -- 기본계획, 정비구역지정, 조합설립, 사업시행인가, 관리처분인가, 착공, 준공
    stage_date DATE,                          -- 현재 단계 인가/고시일
    road_address TEXT,
    jibun_address TEXT,
    lat DOUBLE PRECISION,                     -- 구역 대표 위도
    lng DOUBLE PRECISION,                     -- 구역 대표 경도
    boundary_geojson JSONB,                   -- 구역 경계 폴리곤 (GeoJSON)
    planned_units INT,                        -- 건립 예정 세대수
    area_sqm DOUBLE PRECISION,                -- 구역 면적 (㎡)
    builder VARCHAR(100),                     -- 시공사
    union_name VARCHAR(150),                  -- 조합/추진위 명칭
    has_location BOOLEAN DEFAULT FALSE,       -- 정밀 좌표/경계 확보 여부
    update_source VARCHAR(100) NOT NULL,      -- '국토부 도시정비사업' | '정비사업 정보몽땅'
    base_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. [housing_supply] 주택 공급 및 분양·입주 예정 정보
CREATE TABLE IF NOT EXISTS public.housing_supply (
    id VARCHAR(100) PRIMARY KEY,              -- 공급 단지 식별자
    redevelopment_id VARCHAR(100) REFERENCES public.redevelopment_projects(id) ON DELETE SET NULL,
    apartment_id VARCHAR(100) REFERENCES public.apartments(id) ON DELETE SET NULL,
    complex_name VARCHAR(255) NOT NULL,       -- 공급 단지명
    bjd_code VARCHAR(10),                     -- 법정동 코드
    sido VARCHAR(50) NOT NULL,                -- 시도
    sigungu VARCHAR(50) NOT NULL,             -- 시군구
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    supply_type VARCHAR(50),                  -- '분양' | '임대' | '청약' | '입주예정'
    total_supply_units INT NOT NULL,          -- 총 공급 세대수
    general_supply_units INT,                 -- 일반 분양 세대수
    expected_move_in VARCHAR(20),             -- 입주 예정일 (YYYY.MM)
    construction_company VARCHAR(100),        -- 건설사
    confirmation_source VARCHAR(100) NOT NULL,-- '한국부동산원 청약홈' | '지자체 준공예정'
    source_url TEXT,
    base_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. [commercial_stores] 상가·상권 점포 정보
CREATE TABLE IF NOT EXISTS public.commercial_stores (
    id VARCHAR(50) PRIMARY KEY,               -- 상가업소번호 (bizesId)
    name VARCHAR(255) NOT NULL,               -- 상호명
    branch_name VARCHAR(100),                 -- 지점명
    category_main_code VARCHAR(10) NOT NULL,  -- 대분류 코드
    category_main_name VARCHAR(50) NOT NULL,  -- 대분류명 (음식, 소매, 학문 등)
    category_mid_code VARCHAR(10),            -- 중분류 코드
    category_mid_name VARCHAR(50),            -- 중분류명
    category_sub_code VARCHAR(10),            -- 소분류 코드
    category_sub_name VARCHAR(50),            -- 소분류명
    bjd_code VARCHAR(10),                     -- 법정동 코드
    sido VARCHAR(50) NOT NULL,
    sigungu VARCHAR(50) NOT NULL,
    dong VARCHAR(50),
    road_address TEXT,
    jibun_address TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    collected_base_date VARCHAR(20),          -- 수집 기준일시 (lastModTs)
    data_source_id VARCHAR(50) DEFAULT 'sbiz-store',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. [data_change_logs] 데이터 변경 이력 및 감사 로그
CREATE TABLE IF NOT EXISTS public.data_change_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,          -- 변경된 테이블명
    record_id VARCHAR(100) NOT NULL,          -- 대상 레코드 식별자
    field_name VARCHAR(100) NOT NULL,         -- 변경된 필드명
    old_value TEXT,                           -- 변경 전 값
    new_value TEXT,                           -- 변경 후 값
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- 확인 시점
    change_reason TEXT NOT NULL,              -- 변경 근거 및 사유
    source_name VARCHAR(100) NOT NULL         -- 근거 출처명
);

-- ==============================================================================
-- 검색 성능 및 공간 분석 최적화 인덱스
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_apartments_bjd ON public.apartments(bjd_code);
CREATE INDEX IF NOT EXISTS idx_apartments_coords ON public.apartments(lat, lng);
CREATE INDEX IF NOT EXISTS idx_apartments_sigungu ON public.apartments(sido, sigungu);
CREATE INDEX IF NOT EXISTS idx_apartments_kapt ON public.apartments(kapt_code);

CREATE INDEX IF NOT EXISTS idx_transactions_apt ON public.transactions(apartment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_bjd ON public.transactions(bjd_code);
CREATE INDEX IF NOT EXISTS idx_transactions_deal_date ON public.transactions(deal_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(trade_type);

CREATE INDEX IF NOT EXISTS idx_redevelopment_coords ON public.redevelopment_projects(lat, lng);
CREATE INDEX IF NOT EXISTS idx_redevelopment_stage ON public.redevelopment_projects(stage);
CREATE INDEX IF NOT EXISTS idx_redevelopment_sigungu ON public.redevelopment_projects(sido, sigungu);

CREATE INDEX IF NOT EXISTS idx_commercial_coords ON public.commercial_stores(lat, lng);
CREATE INDEX IF NOT EXISTS idx_commercial_category ON public.commercial_stores(category_main_name);

CREATE INDEX IF NOT EXISTS idx_housing_supply_sigungu ON public.housing_supply(sido, sigungu);

-- ==============================================================================
-- Row Level Security (RLS) 읽기 권한 개방
-- ==============================================================================
ALTER TABLE public.data_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on data_sources" ON public.data_sources FOR SELECT USING (true);

ALTER TABLE public.apartments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on apartments" ON public.apartments FOR SELECT USING (true);

ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on transactions" ON public.transactions FOR SELECT USING (true);

ALTER TABLE public.redevelopment_projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on redevelopment_projects" ON public.redevelopment_projects FOR SELECT USING (true);

ALTER TABLE public.housing_supply ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on housing_supply" ON public.housing_supply FOR SELECT USING (true);

ALTER TABLE public.commercial_stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on commercial_stores" ON public.commercial_stores FOR SELECT USING (true);

ALTER TABLE public.data_change_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read on data_change_logs" ON public.data_change_logs FOR SELECT USING (true);

-- ==============================================================================
-- 공식 데이터 출처 8종 시딩 (Image 1 기준 정규 메타데이터)
-- ==============================================================================
INSERT INTO public.data_sources (id, category, source_name, provider, portal_url, api_endpoint, update_cycle, usage_terms, stat_type, priority, is_active)
VALUES
(
    'apt-trade',
    '아파트 매매 실거래가',
    '국토교통부 실거래가 API',
    '국토교통부',
    'https://data.go.kr',
    'https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade',
    '실시간 / 계약 신고 즉시',
    '개별 실거래 신고 건별 원시 데이터. 거래일, 가격, 면적, 층, 단지명, 지역코드 필수 확보. 임의 가격 합성 금지',
    'RAW',
    '필수',
    TRUE
),
(
    'apt-rent',
    '전월세 거래',
    '국토교통부 전월세 API',
    '국토교통부',
    'https://data.go.kr',
    'https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent',
    '실시간 / 계약 신고 즉시',
    '개별 임대차 계약 원시 데이터. 보증금, 월세, 계약월, 면적, 단지명 필수 확보. 전세가율 계산 및 갱신여부 파악',
    'RAW',
    '필수',
    TRUE
),
(
    'kapt-info',
    '아파트 기본정보',
    '공동주택 기본정보 API (K-apt)',
    '한국부동산원',
    'https://data.go.kr',
    'https://apis.data.go.kr/1613000/AptBasisInfoServiceV5',
    '실시간',
    '의무관리대상 아파트 단지 공식 기본정보. 주소, 세대수, 동수, 난방방식, 승인일 필수 확보. 단지 마스터의 Single Source of Truth',
    'MASTER',
    '필수',
    TRUE
),
(
    'rone-stats',
    '부동산 시장 통계',
    '한국부동산원 R-ONE Open API',
    '한국부동산원',
    'https://www.reb.or.kr/r-one',
    'https://www.reb.or.kr/r-one/openapi/SttsApiTblData.do',
    '월간 / 주간',
    '표본 기반 시장 가격지수 및 거래량 통계. 개별 실거래가와 혼동되지 않도록 거시 지표 분석용으로만 권장 활용',
    'INDEX',
    '권장',
    TRUE
),
(
    'molit-redev',
    '전국 정비사업',
    '국토교통부 전국 도시정비사업 통합 데이터',
    '국토교통부',
    'https://data.go.kr',
    'https://apis.data.go.kr/1613000/UrbRehabPrjInfoSvc',
    '연간 / 분기',
    '전국 정비구역 공식 마스터. 구역명, 사업 유형, 추진 단계, 예정 세대수, 위치 식별 정보 필수 확보',
    'MASTER',
    '필수',
    TRUE
),
(
    'seoul-clean',
    '서울 정비사업',
    '정비사업 정보몽땅 및 서울 열린데이터광장',
    '서울특별시',
    'https://clean.seoul.go.kr',
    'http://openapi.seoul.go.kr:8088',
    '수시 / 단계 변경 시',
    '서울시 정비구역 위치, 최신 사업 단계, 고시·공고 이력, 변경 이력 보완용',
    'PATCH',
    '보완',
    TRUE
),
(
    'sbiz-store',
    '전국 상가·상권',
    '소상공인시장진흥공단 상가(상권)정보 API',
    '소상공인시장진흥공단',
    'https://data.go.kr',
    'https://apis.data.go.kr/B553077/api/open/sdsc2',
    '반기별 갱신',
    '점포 식별자(bizesId), 업종 분류, 주소, 위·경도 필수 확보. 반경 내 상권 인프라 분석용',
    'RAW',
    '필수',
    TRUE
),
(
    'geo-spatial',
    '지도·주소',
    '공공데이터포털 및 지도 사업자 공식 개발자 문서',
    '국토교통부 / 카카오',
    'https://developers.kakao.com',
    'https://dapi.kakao.com/v2/local',
    '실시간',
    '주소 정규화, 좌표 변환, 지도 표시 권한, 호출 제한 준수. 모든 공간 좌표계의 단일 기준점',
    'MASTER',
    '필수',
    TRUE
)
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    source_name = EXCLUDED.source_name,
    provider = EXCLUDED.provider,
    portal_url = EXCLUDED.portal_url,
    api_endpoint = EXCLUDED.api_endpoint,
    update_cycle = EXCLUDED.update_cycle,
    usage_terms = EXCLUDED.usage_terms,
    stat_type = EXCLUDED.stat_type,
    priority = EXCLUDED.priority,
    is_active = EXCLUDED.is_active;
