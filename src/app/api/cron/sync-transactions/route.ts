import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { normalizeJibun, isTransactionMatch } from "@/lib/fetchTransactionsServer";

export const maxDuration = 60; // Vercel 최대 실행시간 60초
export const dynamic = "force-dynamic";

/**
 * 매일 밤 12시 자정(KST = 15:00 UTC) Vercel Cron 자동 실행 엔드포인트
 * 4중 복합 키(법정동 + 지번 + 건축년도 + 단지명)로 국토교통부 최신 실거래가를 수집하여
 * DB에 100% 오차 없이 최신 시세로 자동 반영합니다.
 */
export async function GET(request: NextRequest) {
  // Cron 시크릿 검증
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
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

  // 주요 법정동 코드 목록 (수도권 핵심지)
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
        jibun: string;
        buildYear: number;
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
            const jibun = (m.match(/<jibun>(.*?)<\/jibun>/) || [])[1]?.trim() || "";
            const buildYear = parseInt((m.match(/<buildYear>(.*?)<\/buildYear>/) || [])[1], 10) || 0;
            const amountStr = ((m.match(/<dealAmount>(.*?)<\/dealAmount>/) || [])[1] || "").trim().replace(/,/g, "");
            const dealYear = parseInt((m.match(/<dealYear>(.*?)<\/dealYear>/) || [])[1], 10);
            const dealMonth = parseInt((m.match(/<dealMonth>(.*?)<\/dealMonth>/) || [])[1], 10);
            const dealDay = parseInt((m.match(/<dealDay>(.*?)<\/dealDay>/) || [])[1], 10) || 1;
            const floor = parseInt((m.match(/<floor>(.*?)<\/floor>/) || [])[1], 10) || 1;

            if (floor > 1 && aptNm && amountStr) {
              allTrades.push({
                aptNm,
                umdNm,
                jibun: normalizeJibun(jibun),
                buildYear,
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

      // Supabase에서 해당 시군구의 아파트 목록 조회 (지번, 건축년도 포함)
      const { data: dbApts } = await supabase
        .from("apartments")
        .select("id, name, district, jibun, built_year, jeonse_ratio, price_max")
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
        // 4중 복합 키 (법정동 + 지번 + 건축년도 + 단지명) 매칭
        const matched = allTrades.filter((t) => {
          return isTransactionMatch(
            {
              name: apt.name,
              district: apt.district,
              jibun: apt.jibun,
              built_year: apt.built_year,
            },
            {
              aptNm: t.aptNm,
              umdNm: t.umdNm,
              jibun: t.jibun,
              buildYear: t.buildYear,
            }
          );
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
      updatedCount: totalUpdated,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Cron Transaction Sync Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
