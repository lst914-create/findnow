import { createClient } from "@supabase/supabase-js";
import { RedevelopmentZone, RedevelopmentNotice } from "./redevelopment";
import { validateStageTransition } from "./redevelopmentStageValidator";

export interface SyncResult {
  success: boolean;
  timestamp: string;
  source: string;
  totalScanned: number;
  updatedCount: number;
  newNoticesCount: number;
  changes: {
    zoneId: string;
    zoneName: string;
    field: string;
    oldValue: string;
    newValue: string;
    date: string;
  }[];
}

export interface PublicNoticeItem {
  id: string;
  title: string;
  inst: string; // 관할 자치구/시도 (예: "관악구", "도봉구")
  date: string; // YYYY-MM-DD
  content?: string;
  rawType?: string;
}

// 지자체 고시 제목/본문에서 정비사업 진행단계(status) 추출 정규식
const STATUS_EXTRACTION_RULES: { status: RedevelopmentZone["status"]; patterns: RegExp[] }[] = [
  {
    status: "준공",
    patterns: [/준공인가/, /준공검사/, /준공고시/],
  },
  {
    status: "착공",
    patterns: [/착공신고/, /착공고시/, /공사착공/],
  },
  {
    status: "이주철거",
    patterns: [/관리처분인가\s*완료/, /이주개시/, /철거공사/, /주민이주/],
  },
  {
    status: "관리처분인가",
    patterns: [/관리처분계획\s*인가/, /관리처분인가/, /관리처분계획변경인가/],
  },
  {
    status: "사업시행인가",
    patterns: [/사업시행계획\s*인가/, /사업시행인가/, /사업시행계획변경인가/],
  },
  {
    status: "건축심의",
    patterns: [/건축심의\s*통과/, /건축심의\s*완료/, /건축위원회\s*심의/],
  },
  {
    status: "조합설립인가",
    patterns: [/조합설립\s*인가/, /조합설립인가/, /조합변경인가/],
  },
  {
    status: "추진위원회승인",
    patterns: [/추진위원회\s*승인/, /추진위승인/],
  },
  {
    status: "정비구역지정",
    patterns: [/정비구역\s*지정/, /정비계획\s*결정/, /정비구역지정\s*및\s*정비계획/],
  },
];

/**
 * 지자체 고시문 텍스트로부터 정비사업 진행단계 추출
 */
export function extractStatusFromNotice(text: string): RedevelopmentZone["status"] | null {
  for (const rule of STATUS_EXTRACTION_RULES) {
    for (const pattern of rule.patterns) {
      if (pattern.test(text)) {
        return rule.status;
      }
    }
  }
  return null;
}

/**
 * 고시문 제목에서 구역명 추출
 * 예: "봉천제4-1-2구역 주택재개발 정비계획 변경 및 지형도면 정정 고시" -> "봉천4-1-2"
 */
export function extractZoneNameFromTitle(title: string): string | null {
  const match = title.match(/([가-힣0-9·\-]+(?:구역|지구|마을|동))/);
  if (match) {
    return match[1].replace(/제(\d+)/g, "$1"); // 봉천제4-1-2 -> 봉천4-1-2
  }
  return null;
}

/**
 * 이름 유사도 또는 포함 관계 검증
 */
export function isZoneMatched(existingName: string, candidate: string): boolean {
  const norm1 = existingName.replace(/제/g, "").replace(/\s+/g, "").replace(/주택재개발|재개발|재건축|가로주택/g, "");
  const norm2 = candidate.replace(/제/g, "").replace(/\s+/g, "").replace(/주택재개발|재개발|재건축|가로주택/g, "");

  return norm1.includes(norm2) || norm2.includes(norm1);
}

/**
 * 서울시 열린데이터광장 OpenAPI 고시 정보 수집 (upisAnnouncement)
 */
export async function fetchSeoulPublicNotices(apiKey: string = "sample", count: number = 5): Promise<PublicNoticeItem[]> {
  try {
    const endIdx = apiKey === "sample" ? 5 : Math.min(count, 100);
    const url = `http://openapi.seoul.go.kr:8088/${apiKey}/json/upisAnnouncement/1/${endIdx}/`;

    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      console.warn(`[Seoul API] Failed to fetch: HTTP ${res.status}`);
      return [];
    }

    const data = await res.json();
    if (!data?.upisAnnouncement?.row) {
      return [];
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.upisAnnouncement.row.map((r: any) => ({
      id: r.ANCMNT_MNG_CD || `anc-${Date.now()}-${Math.random()}`,
      title: r.TTL || "",
      inst: r.ANCMNT_INST || "서울시",
      date: (r.ANCMNT_YMD || "").slice(0, 10).replace(/-/g, "."),
      content: r.CN || "",
      rawType: r.ANCMNT_TYPE || "고시",
    }));
  } catch (err) {
    console.error("[Seoul API] Error during fetch:", err);
    return [];
  }
}

/**
 * 고시문 목록을 바탕으로 정비사업 구역 데이터 동기화
 */
export function applyNoticesToZones(
  zones: RedevelopmentZone[],
  notices: PublicNoticeItem[]
): { updatedZones: RedevelopmentZone[]; syncResult: SyncResult } {
  const updatedZones = [...zones];
  const changes: SyncResult["changes"] = [];
  let newNoticesCount = 0;

  for (const notice of notices) {
    const fullText = `${notice.title} ${notice.content || ""}`;
    const detectedStatus = extractStatusFromNotice(fullText);

    // 자치구 일치 및 구역명 매칭
    for (let i = 0; i < updatedZones.length; i++) {
      const zone = updatedZones[i];
      const matchDistrict = !notice.inst || zone.district.includes(notice.inst) || zone.address.includes(notice.inst);
      const matchName = isZoneMatched(zone.name, notice.title);

      if (matchName && matchDistrict) {
        // 1. 고시 내역 추가 (중복 방지 & 공식 URL 보존)
        const existingNotice = zone.notices?.find(n => n.title === notice.title || n.id === notice.id);
        const noticeUrl = "https://land.seoul.go.kr/land/rebuild/rebuildZoneMain.do";

        if (!existingNotice) {
          const newNotice: RedevelopmentNotice = {
            id: notice.id,
            title: notice.title,
            org: `${notice.inst} 고시`,
            date: notice.date,
            type: "고시",
            link: noticeUrl,
          };
          zone.notices = [newNotice, ...(zone.notices || [])];
          newNoticesCount++;
        }

        // 2. 단계 전이 및 역행 방지 검증 (Stage Regression Prevention)
        if (detectedStatus) {
          const transition = validateStageTransition(
            zone.status,
            zone.statusDate,
            detectedStatus,
            {
              projectId: zone.id,
              title: notice.title,
              publishedAt: notice.date,
              sourceUrl: noticeUrl,
              sourceName: notice.inst,
            }
          );

          if (transition.allowed && transition.finalStage !== zone.status) {
            changes.push({
              zoneId: zone.id,
              zoneName: zone.name,
              field: "status",
              oldValue: zone.status,
              newValue: transition.finalStage,
              date: notice.date,
            });

            // 상태 및 일자 정상 승격 갱신
            zone.status = transition.finalStage as RedevelopmentZone["status"];
            if (notice.date) {
              zone.statusDate = notice.date;
            }
          } else if (!transition.allowed && transition.requiresManualReview) {
            // 단계 역행 또는 검토 필요 건 감사 기록
            console.warn(`[정비사업 단계검증] ${zone.name}: ${transition.reason}`);
            changes.push({
              zoneId: zone.id,
              zoneName: zone.name,
              field: "status_regression_blocked",
              oldValue: zone.status,
              newValue: `차단됨(${detectedStatus}) - ${transition.reason}`,
              date: notice.date,
            });
          }
        }
      }
    }
  }

  const syncResult: SyncResult = {
    success: true,
    timestamp: new Date().toISOString(),
    source: "서울시 UPIS 정비사업 도시계획 고시 API & 공공데이터포털",
    totalScanned: notices.length,
    updatedCount: changes.filter((c) => c.field === "status").length,
    newNoticesCount,
    changes,
  };

  return { updatedZones, syncResult };
}

// ---------------------------------------------------------------------------
// Supabase 영구 저장 helpers
// ---------------------------------------------------------------------------

/**
 * service_role 키를 사용하는 서버-전용 Supabase 클라이언트
 * (RLS 우회를 위해 anon key 대신 service_role key 사용)
 */
function getServerSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  // service_role 키가 있으면 우선 사용, 없으면 anon key fallback
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    "";
  return createClient(url, key);
}

/**
 * 동기화 결과를 Supabase에 영구 저장합니다.
 *  - 변경된 구역마다 `redevelopment_zone_overrides`에 upsert
 *  - 동기화 실행 요약을 `redevelopment_sync_logs`에 insert
 */
export async function persistSyncResultToSupabase(
  updatedZones: RedevelopmentZone[],
  syncResult: SyncResult
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = getServerSupabase();

    // 1. 변경이 발생한 구역 ID 목록
    const changedZoneIds = new Set(syncResult.changes.map((c) => c.zoneId));

    if (changedZoneIds.size > 0) {
      const upsertRows = updatedZones
        .filter((z) => changedZoneIds.has(z.id))
        .map((z) => ({
          zone_id: z.id,
          status: z.status,
          status_date: z.statusDate,
          notices: z.notices as unknown as object,
          updated_at: new Date().toISOString(),
        }));

      const { error: upsertError } = await supabase
        .from("redevelopment_zone_overrides")
        .upsert(upsertRows, { onConflict: "zone_id" });

      if (upsertError) {
        console.error("[Sync] zone_overrides upsert 오류:", upsertError.message);
        return { ok: false, error: upsertError.message };
      }
    }

    // 2. 새 고시가 추가된 구역도 notices만 업데이트 (status 변경 없이 고시만 추가된 경우)
    if (syncResult.newNoticesCount > 0) {
      const noticeOnlyZones = updatedZones.filter(
        (z) => !changedZoneIds.has(z.id) && z.notices.some((n) => n.isNew)
      );
      if (noticeOnlyZones.length > 0) {
        const noticeRows = noticeOnlyZones.map((z) => ({
          zone_id: z.id,
          status: z.status,
          status_date: z.statusDate,
          notices: z.notices as unknown as object,
          updated_at: new Date().toISOString(),
        }));
        await supabase
          .from("redevelopment_zone_overrides")
          .upsert(noticeRows, { onConflict: "zone_id" });
      }
    }

    // 3. 동기화 실행 로그 기록
    const { error: logError } = await supabase
      .from("redevelopment_sync_logs")
      .insert({
        source: syncResult.source,
        total_scanned: syncResult.totalScanned,
        updated_count: syncResult.updatedCount,
        new_notices_count: syncResult.newNoticesCount,
        changes: syncResult.changes as unknown as object,
      });

    if (logError) {
      console.warn("[Sync] sync_logs insert 오류 (비치명적):", logError.message);
    }

    return { ok: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Sync] persistSyncResultToSupabase 예외:", message);
    return { ok: false, error: message };
  }
}

/**
 * Supabase에 저장된 오버라이드를 정적 데이터 위에 병합하여 반환합니다.
 * 재배포 후에도 최신 status/notices가 유지됩니다.
 */
export async function loadZoneOverridesFromSupabase(
  zones: RedevelopmentZone[]
): Promise<RedevelopmentZone[]> {
  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from("redevelopment_zone_overrides")
      .select("zone_id, status, status_date, notices");

    if (error || !data) {
      console.warn("[Sync] zone_overrides 로드 실패:", error?.message);
      return zones; // fallback: 정적 데이터 그대로 반환
    }

    const overrideMap = new Map(data.map((row) => [row.zone_id, row]));

    return zones.map((z) => {
      const override = overrideMap.get(z.id);
      if (!override) return z;

      return {
        ...z,
        status: (override.status as RedevelopmentZone["status"]) ?? z.status,
        statusDate: override.status_date ?? z.statusDate,
        notices: Array.isArray(override.notices)
          ? (override.notices as RedevelopmentNotice[])
          : z.notices,
      };
    });
  } catch (err) {
    console.warn("[Sync] loadZoneOverridesFromSupabase 예외:", err);
    return zones;
  }
}
