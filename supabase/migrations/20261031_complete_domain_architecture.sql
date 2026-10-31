-- ==============================================================================
-- 20261031_complete_domain_architecture.sql
-- 
-- 3. 추가할 데이터 구조 DDL 마이그레이션 (이미지 요구사항 6대 신규 테이블)
--
-- 1. redevelopment_projects     : 정비사업 정보 영구 저장
-- 2. redevelopment_notices      : 공고 이력 및 단계 변경 근거 보존
-- 3. commercial_stores          : 개별 점포 정보
-- 4. data_sources               : 출처 및 이용 조건 관리
-- 5. data_sync_logs             : 수집 성공·실패와 갱신 이력
-- 6. apartment_nearby_summary   : 주변 정보 집계 결과 캐시
-- ==============================================================================

-- PostGIS 확장 활성화 (위치 기반 공간 검색 및 폴리곤 인덱싱)
CREATE EXTENSION IF NOT EXISTS postgis;

-- ── 1. data_sources (출처 및 이용 조건 관리) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS public.data_sources (
    source_id VARCHAR(50) PRIMARY KEY,                   -- 예: 'national-redevelopment', 'store-info', 'apt-trade'
    provider VARCHAR(100) NOT NULL,                      -- 제공 기관 (국토교통부, 소상공인시장진흥공단 등)
    source_name VARCHAR(200) NOT NULL,                   -- 공식 데이터셋명
    source_url TEXT NOT NULL,                            -- 출처 포털/API URL
    update_cycle VARCHAR(50) NOT NULL,                   -- 갱신 주기 (실시간, 분기 1회, 연간 등)
    terms_checked_at TIMESTAMPTZ,                        -- 이용 조건 정기 확인 일시
    usage_terms TEXT,                                    -- 이용 조건 및 제한사항 (상권 데이터로 매출 추정 금지 등)
    stat_type VARCHAR(50) DEFAULT 'MASTER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. data_sync_logs (수집 성공·실패와 갱신 이력) ───────────────────────────
CREATE TABLE IF NOT EXISTS public.data_sync_logs (
    id BIGSERIAL PRIMARY KEY,
    source_id VARCHAR(50) REFERENCES public.data_sources(source_id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    finished_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL,                         -- 'SUCCESS' | 'FAILED' | 'PARTIAL' | 'RUNNING'
    records_count INT DEFAULT 0,                         -- 갱신/적재 건수
    error_message TEXT,                                  -- 실패 시 에러 내용
    execution_type VARCHAR(20) DEFAULT 'CRON',           -- 'CRON' | 'MANUAL' | 'API'
    metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_sync_logs_source ON public.data_sync_logs(source_id, started_at DESC);

-- ── 3. redevelopment_projects (정비사업 정보 영구 저장) ─────────────────────────
CREATE TABLE IF NOT EXISTS public.redevelopment_projects (
    id VARCHAR(100) PRIMARY KEY,                         -- 구역 고유 ID
    name VARCHAR(255) NOT NULL,                          -- 사업명/구역명
    status VARCHAR(100) NOT NULL,                        -- 추진 단계 ('정비구역지정', '조합설립인가', '사업시행인가', '관리처분인가', '착공', '준공')
    status_date DATE,                                    -- 현 단계 인가/고시일
    geometry GEOMETRY(Geometry, 4326),                   -- PostGIS 공간 지오메트리 (Polygon/MultiPolygon)
    boundary_geojson JSONB,                              -- 경계 GeoJSON (클라이언트 즉시 렌더링용)
    source_id VARCHAR(50) REFERENCES public.data_sources(source_id) DEFAULT 'national-redevelopment',
    bjd_code VARCHAR(10),                                -- 10자리 법정동 코드
    sido VARCHAR(50) NOT NULL,
    sigungu VARCHAR(50) NOT NULL,
    dong VARCHAR(50),
    lat DOUBLE PRECISION,                                -- 구역 중심 위도
    lng DOUBLE PRECISION,                                -- 구역 중심 경도
    planned_units INT,                                   -- 예정 세대수
    area_sqm DOUBLE PRECISION,                           -- 구역 면적 (㎡)
    builder VARCHAR(100),                                -- 시공사
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_redev_status ON public.redevelopment_projects(status);
CREATE INDEX IF NOT EXISTS idx_redev_bjd ON public.redevelopment_projects(bjd_code);
CREATE INDEX IF NOT EXISTS idx_redev_coords ON public.redevelopment_projects(lat, lng);
CREATE INDEX IF NOT EXISTS idx_redev_geom ON public.redevelopment_projects USING GIST(geometry);

-- ── 4. redevelopment_notices (공고 이력 및 단계 변경 근거) ─────────────────────
CREATE TABLE IF NOT EXISTS public.redevelopment_notices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id VARCHAR(100) REFERENCES public.redevelopment_projects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,                         -- 고시·공고 제목
    published_at DATE NOT NULL,                          -- 공고 일자
    source_url TEXT,                                     -- 공식 고시 URL (단계 변경 증거)
    source_name VARCHAR(100) NOT NULL,                   -- 발행처 (구청, 지자체 공보 등)
    detected_stage VARCHAR(100),                         -- 마이닝된 단계
    is_verified BOOLEAN DEFAULT TRUE,                    -- 역행 검증 통과 여부
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notices_project ON public.redevelopment_notices(project_id, published_at DESC);

-- ── 5. commercial_stores (개별 점포 정보) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.commercial_stores (
    store_id VARCHAR(50) PRIMARY KEY,                    -- 점포 고유번호 (bizesId)
    name VARCHAR(255) NOT NULL,                          -- 상호명
    branch_name VARCHAR(100),                            -- 지점명
    category_code VARCHAR(10) NOT NULL,                  -- 상권업종 대분류 코드 (Q, D, H 등)
    category_name VARCHAR(50) NOT NULL,                  -- 업종명 (음식, 소매, 의료 등)
    address TEXT NOT NULL,                               -- 도로명/지번 주소
    bjd_code VARCHAR(10),                                -- 법정동 코드
    lat DOUBLE PRECISION NOT NULL,                       -- WGS84 위도
    lng DOUBLE PRECISION NOT NULL,                       -- WGS84 경도
    location_geom GEOMETRY(Point, 4326),                 -- PostGIS 점포 포인트
    collected_at TIMESTAMPTZ DEFAULT NOW(),              -- 수집 일시
    source_id VARCHAR(50) REFERENCES public.data_sources(source_id) DEFAULT 'store-info'
);

CREATE INDEX IF NOT EXISTS idx_stores_cat ON public.commercial_stores(category_code);
CREATE INDEX IF NOT EXISTS idx_stores_bjd ON public.commercial_stores(bjd_code);
CREATE INDEX IF NOT EXISTS idx_stores_coords ON public.commercial_stores(lat, lng);
CREATE INDEX IF NOT EXISTS idx_stores_geom ON public.commercial_stores USING GIST(location_geom);

-- ── 6. apartment_nearby_summary (주변 정보 집계 결과 캐시) ─────────────────────
CREATE TABLE IF NOT EXISTS public.apartment_nearby_summary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    apartment_id VARCHAR(100) NOT NULL,                  -- 대상 단지 ID
    radius_m INT NOT NULL,                               -- 반경 (1000m, 3000m)
    summary_date DATE NOT NULL DEFAULT CURRENT_DATE,     -- 집계 기준일
    redev_count INT DEFAULT 0,                           -- 정비사업 구역 수
    redev_planned_units INT DEFAULT 0,                   -- 정비사업 계획 세대수
    supply_units INT DEFAULT 0,                          -- 입주 예정 세대수
    store_count INT DEFAULT 0,                           -- 상가 점포 수
    top_categories JSONB DEFAULT '[]'::jsonb,            -- 주요 업종 분포 JSON
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '7 days',
    UNIQUE (apartment_id, radius_m, summary_date)
);

CREATE INDEX IF NOT EXISTS idx_summary_apt_radius ON public.apartment_nearby_summary(apartment_id, radius_m, summary_date DESC);

-- ── data_sources 초기 시드 보강 ──────────────────────────────────────────────
INSERT INTO public.data_sources (source_id, provider, source_name, source_url, update_cycle, terms_checked_at, usage_terms)
VALUES
('national-redevelopment', '국토교통부', '전국 도시정비사업 통합 데이터', 'https://data.go.kr', '연간 갱신', NOW(), '기본 목록용. 지자체 고시로 보완 필수'),
('seoul-redevelopment', '서울특별시', '정비사업 정보몽땅', 'https://cleanup.seoul.go.kr', '수시 갱신', NOW(), '공식 고시 URL과 날짜 보존 필수'),
('store-info', '소상공인시장진흥공단', '상가(상권)정보 서비스', 'https://data.go.kr', '분기 갱신', NOW(), '업종 분포 전용. 매출액/유동인구 추정 금지'),
('housing-supply', '한국부동산원', '청약홈 공급 및 입주 통계', 'https://applyhome.co.kr', '사업 공고 시', NOW(), '청약홈 공고 기준 세대수 구분')
ON CONFLICT (source_id) DO UPDATE SET
    terms_checked_at = NOW(),
    updated_at = NOW();
