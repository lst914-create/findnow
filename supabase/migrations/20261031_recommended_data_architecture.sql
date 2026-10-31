-- ==============================================================================
-- 권장 데이터 구조 초기 데이터베이스 설계 DDL
-- 
-- [계층 구조]
-- 1. 공통 지역·위치 데이터: 주소, 좌표(lat/lng), 법정동 코드(bjd_code), 데이터 기준일(base_date)
-- 2. 도메인 데이터:
--    - apartments (아파트 단지 마스터)
--    - transactions (실거래 이력)
--    - redevelopment_projects (정비사업 구역 마스터)
--    - housing_supply (주택 공급 및 입주 예정)
--    - commercial_stores (상가/상권 점포)
-- 3. 거버넌스 및 감사:
--    - data_sources (공공데이터 출처 및 수집 주기 메타데이터)
--    - data_change_logs (데이터 변경 이력 및 정합성 감사 로그)
-- 
-- [정합성 원칙]
-- 주소 문자열만으로 연결하지 않고, 단지 고유 식별자 + 법정동 코드 + 좌표 + 구역 경계를 함께 활용
-- ==============================================================================

-- ── 1. data_sources (데이터 출처 관리 테이블) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.data_sources (
    id VARCHAR(50) PRIMARY KEY,                   -- 예: 'apt-trade', 'rone-stats', 'store-info'
    category VARCHAR(100) NOT NULL,               -- 예: '아파트 매매 실거래가', '부동산 시장 통계'
    source_name VARCHAR(200) NOT NULL,            -- 예: '국토교통부 실거래가 공개시스템'
    provider VARCHAR(100) NOT NULL,               -- 제공기관 (예: '국토교통부', '한국부동산원')
    portal_url TEXT NOT NULL,                     -- 출처 URL
    api_endpoint TEXT,                            -- API 엔드포인트 URL
    update_cycle VARCHAR(50) NOT NULL,            -- 갱신 주기 (예: '실시간', '월간', '연간')
    usage_terms TEXT,                             -- 이용 조건 및 법적 유의사항
    stat_type VARCHAR(50) DEFAULT 'RAW',          -- 'RAW'(원시실거래) | 'INDEX'(지수/통계) | 'MASTER'(기본목록)
    is_active BOOLEAN DEFAULT TRUE,
    last_collected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. apartments (아파트 단지 정보 테이블) ───────────────────────────────────
CREATE TABLE IF NOT EXISTS public.apartments (
    id VARCHAR(100) PRIMARY KEY,                  -- 단지 고유 식별자 (K-apt 코드 또는 자체 규격화 ID)
    name VARCHAR(255) NOT NULL,                   -- 단지명
    bjd_code VARCHAR(10) NOT NULL,                -- 법정동 코드 (10자리)
    sido VARCHAR(50) NOT NULL,                    -- 시도 (예: '서울특별시', '경기도')
    sigungu VARCHAR(50) NOT NULL,                 -- 시군구 (예: '강남구', '성남시 분당구')
    eupmyeondong VARCHAR(50) NOT NULL,            -- 읍면동 (예: '대치동', '백현동')
    road_address TEXT,                            -- 도로명 주소
    jibun_address TEXT,                           -- 지번 주소
    lat DOUBLE PRECISION,                         -- 위도 (WGS84)
    lng DOUBLE PRECISION,                         -- 경도 (WGS84)
    household_count INT DEFAULT 0,                -- 세대수
    building_count INT,                           -- 동수
    built_year INT,                               -- 준공년도
    use_approval_date DATE,                       -- 사용승인일
    builder VARCHAR(100),                         -- 시공사
    heat_type VARCHAR(50),                        -- 난방방식
    parking_count INT,                            -- 총 주차대수
    kapt_code VARCHAR(50),                        -- 공동주택관리정보시스템(K-apt) 단지 식별코드
    base_date DATE DEFAULT CURRENT_DATE,          -- 데이터 기준일
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 3. transactions (실거래 이력 테이블) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    apartment_id VARCHAR(100) REFERENCES public.apartments(id) ON DELETE SET NULL,
    bjd_code VARCHAR(10) NOT NULL,                -- 법정동 코드 (단지 매핑 전에도 보존)
    trade_type VARCHAR(20) NOT NULL,              -- '매매' | '전세' | '월세'
    deal_date DATE NOT NULL,                      -- 계약일 (dealYear + dealMonth + dealDay)
    deal_year INT NOT NULL,
    deal_month INT NOT NULL,
    deal_day INT,
    price INT NOT NULL,                           -- 거래금액 (만원)
    monthly_rent INT DEFAULT 0,                   -- 월세 (만원, 전세/매매는 0)
    area_sqm DOUBLE PRECISION NOT NULL,           -- 전용면적 (㎡)
    floor INT,                                    -- 층수
    apt_name_raw VARCHAR(255) NOT NULL,           -- 원본 신고 단지명 (매핑 검증용)
    jibun_raw VARCHAR(100),                       -- 원본 신고 지번
    is_canceled BOOLEAN DEFAULT FALSE,            -- 해제/취소 여부 (dealingGbn)
    cancel_date DATE,                             -- 취소일자
    contract_term VARCHAR(50),                    -- 계약기간 (전월세)
    data_source_id VARCHAR(50) REFERENCES public.data_sources(id) DEFAULT 'apt-trade',
    base_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 4. redevelopment_projects (정비사업 구역 마스터 테이블) ───────────────────
CREATE TABLE IF NOT EXISTS public.redevelopment_projects (
    id VARCHAR(100) PRIMARY KEY,                  -- 구역 고유 식별자
    name VARCHAR(255) NOT NULL,                   -- 사업명 (구역명)
    bjd_code VARCHAR(10),                         -- 대표 법정동 코드
    sido VARCHAR(50) NOT NULL,
    sigungu VARCHAR(50) NOT NULL,
    dong VARCHAR(50),
    project_type VARCHAR(50) NOT NULL,            -- 사업 유형 ('재개발', '재건축', '소규모재건축', '가로주택' 등)
    stage VARCHAR(100) NOT NULL,                  -- 추진 단계 ('정비구역지정', '조합설립인가', '사업시행인가', '관리처분인가', '착공', '준공')
    stage_date DATE,                              -- 현 단계 인가/고시일자
    road_address TEXT,                            -- 도로명 주소
    jibun_address TEXT,                           -- 지번 주소
    lat DOUBLE PRECISION,                         -- 구역 중심 위도
    lng DOUBLE PRECISION,                         -- 구역 중심 경도
    boundary_geojson JSONB,                       -- 구역 경계 폴리곤 (GeoJSON Geometry)
    planned_units INT,                            -- 예정 세대수 (PLAN_HSHLD_CO)
    area_sqm DOUBLE PRECISION,                    -- 사업 구역 면적 (㎡)
    builder VARCHAR(100),                         -- 시공사
    union_name VARCHAR(200),                      -- 조합명
    has_location BOOLEAN DEFAULT FALSE,           -- 위치 식별 가능 여부
    data_tier VARCHAR(30) DEFAULT 'BASELINE_ANNUAL', -- 'BASELINE_ANNUAL' (연간기본) | 'PATCHED_LOCAL_GOV' (지자체보완)
    last_update_cycle VARCHAR(30) DEFAULT 'ANNUAL',
    update_source VARCHAR(100),                   -- 출처 (국토부 연간 데이터 / 서울 정보몽땅 등)
    base_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 5. housing_supply (주택 공급 및 입주 예정 테이블) ──────────────────────────
CREATE TABLE IF NOT EXISTS public.housing_supply (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    redevelopment_id VARCHAR(100) REFERENCES public.redevelopment_projects(id) ON DELETE SET NULL,
    apartment_id VARCHAR(100) REFERENCES public.apartments(id) ON DELETE SET NULL,
    complex_name VARCHAR(255) NOT NULL,           -- 공급 단지명
    bjd_code VARCHAR(10),                         -- 법정동 코드
    sido VARCHAR(50) NOT NULL,
    sigungu VARCHAR(50) NOT NULL,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    supply_type VARCHAR(50),                      -- '분양' | '임대' | '청약' | '입주예정'
    total_supply_units INT NOT NULL,              -- 총 공급 세대수
    general_supply_units INT,                     -- 일반 분양 세대수
    expected_move_in DATE,                        -- 입주 예정월/일
    construction_company VARCHAR(100),            -- 시공사
    confirmation_source VARCHAR(200) NOT NULL,    -- 확인 출처 (예: '청약홈', '지자체 입주예정물량', '사업시행인가고시')
    source_url TEXT,
    base_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 6. commercial_stores (상가·상권 점포 테이블) ──────────────────────────────
CREATE TABLE IF NOT EXISTS public.commercial_stores (
    id VARCHAR(50) PRIMARY KEY,                   -- 점포 고유 식별자 (bizesId)
    name VARCHAR(255) NOT NULL,                   -- 상호명
    branch_name VARCHAR(100),                     -- 지점명
    category_main_code VARCHAR(10) NOT NULL,      -- 업종 대분류 코드 (Q=음식, D=소매, I=생활서비스 등)
    category_main_name VARCHAR(50) NOT NULL,      -- 업종 대분류명
    category_mid_code VARCHAR(10),                -- 업종 중분류 코드
    category_mid_name VARCHAR(50),                -- 업종 중분류명
    category_sub_code VARCHAR(10),                -- 업종 소분류 코드
    category_sub_name VARCHAR(50),                -- 업종 소분류명
    bjd_code VARCHAR(10),                         -- 법정동 코드
    adong_code VARCHAR(10),                       -- 행정동 코드
    sido VARCHAR(50) NOT NULL,
    sigungu VARCHAR(50) NOT NULL,
    dong VARCHAR(50),
    road_address TEXT,
    jibun_address TEXT,
    lat DOUBLE PRECISION,                         -- 위도 (WGS84)
    lng DOUBLE PRECISION,                         -- 경도 (WGS84)
    collected_base_date DATE,                     -- 수집 기준일 (lastModTs 기반)
    data_source_id VARCHAR(50) REFERENCES public.data_sources(id) DEFAULT 'store-info',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 7. data_change_logs (데이터 변경 이력 및 정합성 감사 로그) ───────────────────
CREATE TABLE IF NOT EXISTS public.data_change_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,              -- 변경 대상 테이블명
    record_id VARCHAR(100) NOT NULL,              -- 변경 레코드 ID
    field_name VARCHAR(50) NOT NULL,              -- 변경 필드명 (예: 'stage', 'is_canceled', 'price')
    old_value TEXT,                               -- 변경 전 값
    new_value TEXT,                               -- 변경 후 값
    verified_at TIMESTAMPTZ DEFAULT NOW(),        -- 확인 시점
    change_reason TEXT,                           -- 변경 근거 (예: '지자체 인허가 고시 2026-103호', '실거래 취소 신고')
    source_name VARCHAR(100) NOT NULL,            -- 출처명 (예: '정비사업 정보몽땅', '국토부 실거래 해제자료')
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 성능 및 공간 검색 최적화 인덱스 (단지식별자 + 법정동코드 + 좌표 + 구역경계 복합)
-- ==============================================================================

-- 1. apartments 인덱스
CREATE INDEX IF NOT EXISTS idx_apartments_bjd ON public.apartments(bjd_code);
CREATE INDEX IF NOT EXISTS idx_apartments_sigungu ON public.apartments(sigungu);
CREATE INDEX IF NOT EXISTS idx_apartments_coords ON public.apartments(lat, lng);
CREATE INDEX IF NOT EXISTS idx_apartments_kapt ON public.apartments(kapt_code);

-- 2. transactions 인덱스
CREATE INDEX IF NOT EXISTS idx_transactions_apt_id ON public.transactions(apartment_id);
CREATE INDEX IF NOT EXISTS idx_transactions_bjd_date ON public.transactions(bjd_code, deal_date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_deal_year_month ON public.transactions(deal_year, deal_month);
CREATE INDEX IF NOT EXISTS idx_transactions_trade_type ON public.transactions(trade_type);
CREATE INDEX IF NOT EXISTS idx_transactions_canceled ON public.transactions(is_canceled);

-- 3. redevelopment_projects 인덱스
CREATE INDEX IF NOT EXISTS idx_redevelopment_bjd ON public.redevelopment_projects(bjd_code);
CREATE INDEX IF NOT EXISTS idx_redevelopment_coords ON public.redevelopment_projects(lat, lng);
CREATE INDEX IF NOT EXISTS idx_redevelopment_stage ON public.redevelopment_projects(stage);
CREATE INDEX IF NOT EXISTS idx_redevelopment_tier ON public.redevelopment_projects(data_tier);

-- 4. housing_supply 인덱스
CREATE INDEX IF NOT EXISTS idx_supply_redevelopment ON public.housing_supply(redevelopment_id);
CREATE INDEX IF NOT EXISTS idx_supply_apt ON public.housing_supply(apartment_id);
CREATE INDEX IF NOT EXISTS idx_supply_expected_date ON public.housing_supply(expected_move_in);

-- 5. commercial_stores 인덱스
CREATE INDEX IF NOT EXISTS idx_stores_coords ON public.commercial_stores(lat, lng);
CREATE INDEX IF NOT EXISTS idx_stores_category_main ON public.commercial_stores(category_main_code);
CREATE INDEX IF NOT EXISTS idx_stores_bjd ON public.commercial_stores(bjd_code);

-- 6. data_change_logs 인덱스
CREATE INDEX IF NOT EXISTS idx_logs_target ON public.data_change_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_logs_verified_at ON public.data_change_logs(verified_at DESC);

-- ==============================================================================
-- 초기 data_sources 8대 공공데이터 기준 데이터 시딩
-- ==============================================================================
INSERT INTO public.data_sources (id, category, source_name, provider, portal_url, api_endpoint, update_cycle, usage_terms, stat_type)
VALUES
('apt-trade', '아파트 매매 실거래가', '국토교통부 실거래가 공개시스템', '국토교통부', 'https://data.go.kr', 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade', '실시간/익일', '개별 실거래 신고 건별 원시 자료. 표본 가격지수와 임의 합성 금지', 'RAW'),
('apt-rent', '전월세 거래', '국토교통부 전월세 실거래가 공개시스템', '국토교통부', 'https://data.go.kr', 'https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent', '실시간/익일', '개별 임대차 계약 원시 자료. 전세가율 및 갱신여부 파악용', 'RAW'),
('kapt-info', '아파트 기본정보', '공동주택 기본정보 서비스 (K-apt)', '한국부동산원', 'https://data.go.kr', 'https://apis.data.go.kr/1613000/AptBasisInfoServiceV5', '실시간', '전국 의무관리대상 공동주택 기본 스펙 및 관리정보', 'MASTER'),
('rone-stats', '부동산 시장 통계', '한국부동산원 R-ONE Open API', '한국부동산원', 'https://reb.or.kr/r-one', 'https://www.reb.or.kr/r-one/openapi/SttsApiTblData.do', '월간/주간', '표본 기반 시장 가격지수(기준시점=100.0) 및 월간 거래량 통계. 개별 실거래가와 혼용 불가', 'INDEX'),
('national-redevelopment', '전국 정비사업', '국토교통부 전국 도시정비사업 통합 데이터', '국토교통부', 'https://data.go.kr', 'https://www.data.go.kr/data/15044691/fileData.do', '연간 갱신', '전국 정비구역 마스터 베이스라인. 최근 변동 사항은 지자체 고시로 보완', 'MASTER'),
('seoul-redevelopment', '서울 정비사업', '정비사업 정보몽땅 + 서울열린데이터광장', '서울특별시', 'https://data.seoul.go.kr', 'https://openapi.seoul.go.kr:8088/{key}/json/HsmpInfo', '일별/수시', '서울시 정비사업 추진단계 및 고시·공고 실시간/수시 보완 패치', 'PATCH'),
('store-info', '전국 상가상권', '소상공인시장진흥공단 상가(상권)정보 서비스', '소상공인시장진흥공단', 'https://data.go.kr', 'https://apis.data.go.kr/B553077/api/open/sdsc2', '분기/수시', '초기 업종 분포 분석용. 점포 데이터만으로 매출액이나 유동인구 추정 금지', 'RAW'),
('geocoding', '지도·주소', '카카오 로컬 API + 공공데이터포털 도로명주소', '카카오/행정안전부', 'https://developers.kakao.com', 'https://dapi.kakao.com/v2/local', '실시간', '주소 정규화 및 WGS84 좌표계 변환', 'MASTER')
ON CONFLICT (id) DO UPDATE SET
    source_name = EXCLUDED.source_name,
    update_cycle = EXCLUDED.update_cycle,
    usage_terms = EXCLUDED.usage_terms,
    stat_type = EXCLUDED.stat_type,
    updated_at = NOW();
