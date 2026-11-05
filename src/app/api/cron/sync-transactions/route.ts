import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { normalizeAptName } from "@/lib/normalizeAptName";

export const maxDuration = 60; // Vercel 최대 실행시간 60초
export const dynamic = "force-dynamic";

/**
 * 매일 밤 12시(자정 KST = 15:00 UTC) Vercel Cron 자동 실행 엔드포인트
 * 국토교통부 최신 실거래가를 수집하여 Supabase DB에 최신 시세로 자동 반영합니다.
 */
export async function GET(request: NextRequest) {
  // Cron 시크릿 검증 (Vercel Cron 헤더 또는 CRON_SECRET 확인)
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    // Vercel 자체 cron 요청인 경우 통과
    const isVercelCron = request.headers.get("user-agent")?.includes("vercel-cron");
    if (!isVercelCron) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://fkkbusvufaumzizzxpqe.supabase.co";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceKey) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY missing" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });

  const apiKey =
    process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY ||
    process.env.DATA_GO_KR_API_KEY ||
    "w9iCzz0a9bHCdvlFLmOvVtA78NPktsoY3YIcAeQSSMbh%2FKpkxYz0AOokaJxZaO%2BMICURNdUrUpFznmKtumOvOA%3D%3D";

  // 당월 및 전월 YMD
  const now = new Date();
  const currentYmd = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevYmd = `${prevMonth.getFullYear()}${String(prevMonth.getMonth() + 1).padStart(2, "0")}`;
  const targetMonths = [currentYmd, prevYmd];

  // 주요 주요 법정동 코드 목록 (수도권 핵심지)
  const targetLawds = [
    { code: "41360", name: "남양주시" },
    { code: "41310", name: "구리시" },
    { code: "11680", name: "강남구" },
    { code: "11650", name: "서초구" },
    { code: "11710", name: "송파구" },
    { code: "11440", name: "마포구" },
    { code: "11200", name: "성동구" },
    { code: "41450", name: "하남시" },
    { code: "41135", name: "성남시분당구" },
  ];

  let totalUpdated = 0;
  const ONE_MONTH_MS = 31 * 24 * 60 * 60 * 1000;

  try {
    for (const lawd of targetLawds) {
      const allTrades: Array<{
        aptNm: string;
        umdNm: string;
        amount: number;
        dealTime: number;
        floor: number;
      }> = [];

      for (const ymd of targetMonths) {
        try {
          const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${apiKey}&LAWD_CD=${lawd.code}&DEAL_YMD=${ymd}&numOfRows=1000`;
          const res = await fetch(url, { next: { revalidate: 0 } });
          if (!res.ok) continue;
          const text = await res.text();
          const matches = text.match(/<item>[\s\S]*?<\/item>/g) || [];

          for (const m of matches) {
            const aptNm = (m.match(/<aptNm>(.*?)<\/aptNm>/) || [])[1]?.trim() || "";
            const umdNm = (m.match(/<umdNm>(.*?)<\/umdNm>/) || [])[1]?.trim() || "";
            const amountStr = ((m.match(/<dealAmount>(.*?)<\/dealAmount>/) || [])[1] || "").trim().replace(/,/g, "");
            const dealYear = parseInt((m.match(/<dealYear>(.*?)<\/dealYear>/) || [])[1], 10);
            const dealMonth = parseInt((m.match(/<dealMonth>(.*?)<\/dealMonth>/) || [])[1], 10);
            const dealDay = parseInt((m.match(/<dealDay>(.*?)<\/dealDay>/) || [])[1], 10) || 1;
            const floor = parseInt((m.match(/<floor>(.*?)<\/floor>/) || [])[1], 10) || 1;

            // 1층 거래 제외
            if (floor > 1 && aptNm && amountStr) {
              allTrades.push({
                aptNm,
                umdNm,
                amount: parseInt(amountStr, 10),
                dealTime: new Date(dealYear, dealMonth - 1, dealDay).getTime(),
                floor,
              });
            }
          }
        } catch (e) {
          console.warn(`[Sync] Lawd ${lawd.code} ${ymd} error:`, e);
        }
      }

      if (allTrades.length === 0) continue;

      // Supabase에서 해당 시군구의 아파트 목록 조회
      const { data: dbApts } = await supabase
        .from("apartments")
        .select("id, name, district, jeonse_ratio, price_max")
        .ilike("region", `%${lawd.name.replace(/시|구/, "")}%`);

      if (!dbApts || dbApts.length === 0) continue;

      const updates: Array<{
        id: string;
        price_max: number;
        price_min: number;
        rent_max?: number;
        rent_min?: number;
        gap_price?: number;
        is_real_price: boolean;
        updated_at: string;
      }> = [];

      for (const apt of dbApts) {
        const normApt = normalizeAptName(apt.name);
        const aptDistrict = apt.district || "";

        const matched = allTrades.filter((t) => {
          if (aptDistrict && t.umdNm) {
            const isGroup = (d: string) => /다산|도농|지금|가운/.test(d);
            if (isGroup(aptDistrict) && !isGroup(t.umdNm)) return false;
            if (!isGroup(aptDistrict) && !t.umdNm.includes(aptDistrict.replace(/[동읍면]/g, ""))) return false;
          }
          const normT = normalizeAptName(t.aptNm);
          if (normApt === normT) return true;
          const numApt = normApt.match(/\d+/g)?.join("");
          const numT = normT.match(/\d+/g)?.join("");
          if (numApt !== numT) return false;
          return normApt.length >= 4 && normT.length >= 4 && (normApt.includes(normT) || normT.includes(normApt));
        });

        if (matched.length === 0) continue;

        matched.sort((a, b) => b.dealTime - a.dealTime);
        const latest = matched[0];
        const recent1Month = matched.filter((t) => latest.dealTime - t.dealTime <= ONE_MONTH_MS);

        let finalPrice: number;
        if (recent1Month.length >= 2) {
          finalPrice = Math.round(recent1Month.reduce((sum, t) => sum + t.amount, 0) / recent1Month.length);
        } else {
          finalPrice = latest.amount;
        }

        // 변동이 있을 때만 업데이트
        if (apt.price_max !== finalPrice) {
          const ratio = apt.jeonse_ratio || 60;
          const rentMax = Math.round(finalPrice * (ratio / 100));
          updates.push({
            id: apt.id,
            price_max: finalPrice,
            price_min: finalPrice,
            rent_max: rentMax,
            rent_min: rentMax,
            gap_price: Math.max(0, finalPrice - rentMax),
            is_real_price: true,
            updated_at: new Date().toISOString(),
          });
        }
      }

      if (updates.length > 0) {
        await supabase.from("apartments").upsert(updates, { onConflict: "id" });
        totalUpdated += updates.length;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Nightly sync complete. Updated ${totalUpdated} apartments.`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[Nightly Sync Error]:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
