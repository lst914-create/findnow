/**
 * Supabase apartments 테이블 생성 스크립트
 * Service role key를 사용하여 Management API로 DDL 실행
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://fkkbusvufaumzizzxpqe.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const PROJECT_REF = 'fkkbusvufaumzizzxpqe';

const DDL = `
-- apartments 테이블 생성 (기존에 있으면 유지)
CREATE TABLE IF NOT EXISTS apartments (
  id                  TEXT PRIMARY KEY,
  name                TEXT NOT NULL,
  region              TEXT,
  district            TEXT,
  api_region          TEXT,
  lat                 FLOAT8,
  lng                 FLOAT8,

  price_min           INT,
  price_max           INT,
  rent_min            INT,
  rent_max            INT,
  gap_price           INT,
  jeonse_ratio        INT,

  area_sqm            FLOAT8,
  area_pyeong         INT,
  built_year          INT,
  household_count     INT,
  dong_count          INT,
  floor_top           INT,
  floor_base          INT,
  approval_date       TEXT,

  construction        TEXT,
  developer           TEXT,
  parking_ratio       FLOAT8,
  parking_total       INT,
  parking_ground      INT,
  parking_underground INT,
  ev_charger_count    INT,
  heating_type        TEXT,
  heating_fuel        TEXT,
  hall_type           TEXT,
  far                 INT,
  bcr                 INT,
  management_type     TEXT,
  management_tel      TEXT,
  cctv_count          INT,
  elevator_count      INT,

  school_score        INT,
  traffic_score       INT,
  nature_score        INT,
  walk_minutes        INT,

  tags                TEXT[],
  facilities          TEXT[],
  schools             TEXT[],
  image_url           TEXT,
  description         TEXT,
  is_real_price       BOOLEAN DEFAULT false,
  area_distributions  JSONB,

  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 위치 기반 인덱스 (반경 검색용)
CREATE INDEX IF NOT EXISTS apartments_lat_lng_idx ON apartments (lat, lng);
-- 지역 검색 인덱스
CREATE INDEX IF NOT EXISTS apartments_region_idx ON apartments (region, district);
-- 이름 검색 인덱스
CREATE INDEX IF NOT EXISTS apartments_name_idx ON apartments (name);
`;

async function main() {
  console.log('Supabase apartments 테이블 생성 시작...');
  
  // 방법 1: Management API (PAT 없이 service role로 시도)
  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: DDL }),
    });
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Management API 성공:', JSON.stringify(data).slice(0, 200));
      return;
    }
    
    const err = await res.text();
    console.log(`Management API 응답 ${res.status}:`, err.slice(0, 200));
  } catch (e) {
    console.log('Management API 오류:', e.message);
  }

  // 방법 2: PostgREST RPC (pg_query 함수가 있으면 사용)
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_ddl`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql: DDL }),
    });
    
    if (res.ok) {
      console.log('✅ RPC exec_ddl 성공');
      return;
    }
    console.log('RPC exec_ddl 응답:', res.status);
  } catch (e) {
    console.log('RPC 오류:', e.message);
  }

  // 방법 3: supabase-js SDK로 더미 테이블 체크 (테이블 존재 여부만 확인)
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/apartments?limit=1`, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
    });
    
    if (res.ok) {
      console.log('✅ apartments 테이블 이미 존재함 - 업로드 단계로 진행 가능');
      return;
    }
    
    const err = await res.text();
    console.log('테이블 체크 응답:', res.status, err.slice(0, 200));
    
    if (res.status === 404 || err.includes('does not exist')) {
      console.log('\n⚠️  테이블이 없습니다.');
      console.log('Supabase 대시보드 → SQL Editor에서 아래 SQL을 실행하세요:');
      console.log('\n' + DDL);
    }
  } catch (e) {
    console.log('테이블 체크 오류:', e.message);
  }
}

main().catch(console.error);

