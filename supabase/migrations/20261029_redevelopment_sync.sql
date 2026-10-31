-- ============================================================
-- 정비사업 구역 오버라이드 테이블
-- 동기화 시 변경된 status / statusDate / notices 를 영구 저장
-- ============================================================
CREATE TABLE IF NOT EXISTS public.redevelopment_zone_overrides (
  zone_id        TEXT PRIMARY KEY,            -- REDEVELOPMENT_DATA의 id와 1:1 매핑
  status         TEXT,                        -- 최신 진행 단계
  status_date    TEXT,                        -- 단계 변경 일자 (YYYY.MM.DD)
  notices        JSONB    DEFAULT '[]'::jsonb, -- 누적 고시 목록 (RedevelopmentNotice[])
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 비활성화 (서버-사이드 service_role 접근 가정)
ALTER TABLE public.redevelopment_zone_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "service_role only"
  ON public.redevelopment_zone_overrides
  USING (auth.role() = 'service_role');

-- ============================================================
-- 동기화 로그 테이블
-- 매 동기화 실행 결과를 감사(audit) 목적으로 보존
-- ============================================================
CREATE TABLE IF NOT EXISTS public.redevelopment_sync_logs (
  id             BIGSERIAL PRIMARY KEY,
  synced_at      TIMESTAMPTZ DEFAULT NOW(),
  source         TEXT,                        -- 데이터 출처 (서울시 UPIS 등)
  total_scanned  INT,
  updated_count  INT,
  new_notices_count INT,
  changes        JSONB    DEFAULT '[]'::jsonb  -- SyncResult.changes[]
);

-- 90일 이상 된 로그 자동 삭제 (선택)
-- CREATE OR REPLACE FUNCTION prune_sync_logs() RETURNS void AS $$
--   DELETE FROM public.redevelopment_sync_logs WHERE synced_at < NOW() - INTERVAL '90 days';
-- $$ LANGUAGE sql;
