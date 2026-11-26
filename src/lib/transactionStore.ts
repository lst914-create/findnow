/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const BUCKET_NAME = "transactions-cache";
const DEFAULT_SUPABASE_URL = "https://fkkbusvufaumzizzxpqe.supabase.co";
const CACHE_FRESH_MS = 1000 * 60 * 60 * 24; // 24시간

export interface StoredTransactionsPayload {
  aptId: string;
  trades: any[];
  rents: any[];
  months: number;
  updatedAt: number;
}

function getSupabaseUrl(): string {
  return (process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL).replace(/\/$/, "");
}

function getAdminClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

function getObjectPath(aptId: string): string {
  // 파일명 안전 정규화 (슬래시/공백 등 제거)
  const safeId = encodeURIComponent(aptId.trim());
  return `apts/${safeId}.json`;
}

/**
 * Supabase Storage CDN에서 사전 수집된 단지별 실거래 데이터를 초고속(30~80ms) 조회합니다.
 */
export async function getCachedTransactionsFromStore(
  aptId: string
): Promise<{ payload: StoredTransactionsPayload; isStale: boolean } | null> {
  if (!aptId) return null;
  const url = `${getSupabaseUrl()}/storage/v1/object/public/${BUCKET_NAME}/${getObjectPath(aptId)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 1200);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      cache: "no-store",
    });
    if (!res.ok) return null;

    const data = (await res.json()) as StoredTransactionsPayload;
    if (!data || !Array.isArray(data.trades) || !Array.isArray(data.rents)) {
      return null;
    }

    const updatedAt = typeof data.updatedAt === "number" ? data.updatedAt : 0;
    const isStale = Date.now() - updatedAt > CACHE_FRESH_MS;
    return { payload: data, isStale };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * 조회된 단지별 실거래 데이터를 Supabase Storage에 저장(Self-healing Cache)합니다.
 * 다음 요청부터는 국토부 API 호출 없이 0.05초 만에 즉시 응답합니다.
 */
export async function saveTransactionsToStore(
  aptId: string,
  trades: any[],
  rents: any[],
  months = 36
): Promise<boolean> {
  if (!aptId) return false;
  if (trades.length === 0 && rents.length === 0) return false;

  const sb = getAdminClient();
  if (!sb) return false;

  const payload: StoredTransactionsPayload = {
    aptId,
    trades,
    rents,
    months,
    updatedAt: Date.now(),
  };

  try {
    const body = Buffer.from(JSON.stringify(payload), "utf8");
    const { error } = await sb.storage
      .from(BUCKET_NAME)
      .upload(getObjectPath(aptId), body, {
        contentType: "application/json; charset=utf-8",
        cacheControl: "3600",
        upsert: true,
      });

    if (error) {
      console.warn(`[transactionStore] upload error (${aptId}):`, error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn(`[transactionStore] save error (${aptId}):`, e);
    return false;
  }
}
