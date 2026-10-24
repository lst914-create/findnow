import { RedevelopmentZone, RedevelopmentNotice } from "./redevelopment";

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
        // 1. 고시 내역 추가 (중복 방지)
        const existingNotice = zone.notices?.find(n => n.title === notice.title || n.id === notice.id);
        if (!existingNotice) {
          const newNotice: RedevelopmentNotice = {
            id: notice.id,
            title: notice.title,
            org: `${notice.inst} 고시`,
            date: notice.date,
            type: "고시",
            link: "https://land.seoul.go.kr/land/rebuild/rebuildZoneMain.do",
          };
          zone.notices = [newNotice, ...(zone.notices || [])];
          newNoticesCount++;
        }

        // 2. 진행 단계 승격 변경 감지
        if (detectedStatus && detectedStatus !== zone.status) {
          changes.push({
            zoneId: zone.id,
            zoneName: zone.name,
            field: "status",
            oldValue: zone.status,
            newValue: detectedStatus,
            date: notice.date,
          });

          // 상태 및 일자 갱신
          zone.status = detectedStatus;
          if (notice.date) {
            zone.statusDate = notice.date;
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
    updatedCount: changes.length,
    newNoticesCount,
    changes,
  };

  return { updatedZones, syncResult };
}
