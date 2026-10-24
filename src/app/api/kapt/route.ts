import { NextRequest, NextResponse } from "next/server";

// 인메모리 캐시 (1시간 TTL)
const kaptCache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL_MS = 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  let kaptCode = searchParams.get("kaptCode") || "";

  // kapt-A10019911 형식에서 접두사 제거
  if (kaptCode.startsWith("kapt-")) {
    kaptCode = kaptCode.replace("kapt-", "");
  }

  if (!kaptCode) {
    return NextResponse.json(
      { success: false, error: "kaptCode 파라미터가 필요합니다." },
      { status: 400 }
    );
  }

  // 캐시 확인
  const cached = kaptCache.get(kaptCode);
  if (cached && cached.expiry > Date.now()) {
    return NextResponse.json({
      success: true,
      data: cached.data,
      source: "cache",
    });
  }

  const rawKey =
    process.env.DATA_GO_KR_API_KEY ||
    process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY ||
    "";
  const apiKey = decodeURIComponent(rawKey);

  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "공공데이터 API 키가 설정되지 않았습니다." },
      { status: 500 }
    );
  }

  try {
    const encodedKey = encodeURIComponent(apiKey);

    // 1. 기본정보 (AptBasisInfoServiceV5 / getAphusBassInfoV5)
    // 2. 상세정보 (AptBasisInfoServiceV5 / getAphusDtlInfoV5)
    const basePromise = fetch(
      `https://apis.data.go.kr/1613000/AptBasisInfoServiceV5/getAphusBassInfoV5?serviceKey=${encodedKey}&kaptCode=${encodeURIComponent(
        kaptCode
      )}`,
      { next: { revalidate: 3600 } }
    ).then((r) => r.json()).catch(() => null);

    const dtlPromise = fetch(
      `https://apis.data.go.kr/1613000/AptBasisInfoServiceV5/getAphusDtlInfoV5?serviceKey=${encodedKey}&kaptCode=${encodeURIComponent(
        kaptCode
      )}`,
      { next: { revalidate: 3600 } }
    ).then((r) => r.json()).catch(() => null);

    const [baseJson, dtlJson] = await Promise.all([basePromise, dtlPromise]);

    const baseItem = baseJson?.response?.body?.item;
    const dtlItem = dtlJson?.response?.body?.item;

    if (!baseItem && !dtlItem) {
      return NextResponse.json(
        {
          success: false,
          error: "해당 단지의 K-apt 공공데이터를 찾을 수 없습니다.",
        },
        { status: 404 }
      );
    }

    // 주차 대수 정밀 계산
    const parkingGround = Number(dtlItem?.kaptdPcnt) || 0;
    const parkingUnderground = Number(dtlItem?.kaptdPcntu) || 0;
    const parkingTotal = parkingGround + parkingUnderground;
    const households = Number(baseItem?.kaptdaCnt) || Number(baseItem?.hoCnt) || 0;
    const parkingRatio =
      households > 0 && parkingTotal > 0
        ? Number((parkingTotal / households).toFixed(2))
        : null;

    // 전기차 충전기 수
    const evGround = Number(dtlItem?.groundElChargerCnt) || 0;
    const evUnderground = Number(dtlItem?.undergroundElChargerCnt) || 0;
    const evTotal = evGround + evUnderground;

    // 사용승인일 포맷팅 (예: 19990416 -> 1999.04.16)
    let approvalDate = baseItem?.kaptUsedate || "";
    if (approvalDate && approvalDate.length === 8) {
      approvalDate = `${approvalDate.slice(0, 4)}.${approvalDate.slice(
        4,
        6
      )}.${approvalDate.slice(6, 8)}`;
    }

    // 부대복리시설 문자열 파싱
    const rawFacilities = dtlItem?.welfareFacility || "";
    const facilities = rawFacilities
      ? rawFacilities
          .split(/[,·/]/)
          .map((s: string) => s.trim())
          .filter(Boolean)
      : [];

    // 평형별 세대수 분포 (60이하, 85이하, 135이하, 135초과)
    const m60 = Number(baseItem?.kaptMparea60) || 0;
    const m85 = Number(baseItem?.kaptMparea85) || 0;
    const m135 = Number(baseItem?.kaptMparea135) || 0;
    const m136 = Number(baseItem?.kaptMparea136) || 0;
    const sumM = m60 + m85 + m135 + m136;

    const areaDistributions = [];
    if (sumM > 0) {
      if (m60 > 0) {
        areaDistributions.push({
          label: "소형 (60㎡ 이하)",
          units: m60,
          ratio: Math.round((m60 / sumM) * 100),
          pyeong: 24,
        });
      }
      if (m85 > 0) {
        areaDistributions.push({
          label: "중소형 (60~85㎡)",
          units: m85,
          ratio: Math.round((m85 / sumM) * 100),
          pyeong: 34,
        });
      }
      if (m135 > 0) {
        areaDistributions.push({
          label: "중대형 (85~135㎡)",
          units: m135,
          ratio: Math.round((m135 / sumM) * 100),
          pyeong: 45,
        });
      }
      if (m136 > 0) {
        areaDistributions.push({
          label: "대형 (135㎡ 초과)",
          units: m136,
          ratio: Math.round((m136 / sumM) * 100),
          pyeong: 55,
        });
      }
    }

    // 정제된 결과 조합
    const enrichedData = {
      kaptCode,
      name: baseItem?.kaptName || dtlItem?.kaptName,
      address: baseItem?.kaptAddr || dtlItem?.kaptAddr,
      doroJuso: baseItem?.doroJuso || "",
      zipcode: baseItem?.zipcode || "",
      saleType: baseItem?.codeSaleNm || "분양", // 분양 / 임대
      household_count: households,
      dong_count: Number(baseItem?.kaptDongCnt) || null,
      floor_top: Number(baseItem?.kaptTopFloor) || null,
      floor_base: Number(baseItem?.kaptBaseFloor) || null,
      approval_date: approvalDate,
      construction: baseItem?.kaptBcompany || null, // 시공사
      developer: baseItem?.kaptAcompany || null, // 시행사
      total_area_sqm: Number(baseItem?.kaptTarea) || null, // 연면적
      private_area_sqm: Number(baseItem?.privArea) || null, // 전용면적합계
      heatingType: baseItem?.codeHeatNm || null, // 개별난방 / 지역난방 등
      hallType: baseItem?.codeHallNm || null, // 계단식 / 복도식 / 혼합식
      managementType: baseItem?.codeMgrNm || dtlItem?.codeMgr || null, // 위탁관리 / 자치관리
      managementTel: baseItem?.kaptTel || null,
      managementCompany: dtlItem?.kaptCcompany || null,
      securityType: dtlItem?.codeSec || null,
      cleaningType: dtlItem?.codeClean || null,
      disinfectionType: dtlItem?.codeDisinf || null,
      garbageType: dtlItem?.codeGarbage || null, // 음식물쓰레기종량제 등
      buildingStructure: dtlItem?.codeStr || null, // 철근콘크리트구조 등
      electricityContract: dtlItem?.codeEcon || null, // 단일계약 / 종합계약
      waterSupply: dtlItem?.codeWsupply || null,
      elevatorCount: Number(dtlItem?.kaptdEcnt) || null,
      cctvCount: Number(dtlItem?.kaptdCccnt) || null,
      parking_total: parkingTotal > 0 ? parkingTotal : null,
      parking_ground: parkingGround,
      parking_underground: parkingUnderground,
      parkingRatio: parkingRatio,
      ev_total: evTotal,
      ev_ground: evGround,
      ev_underground: evUnderground,
      facilities: facilities,
      subwayLine: dtlItem?.subwayLine || null,
      subwayStation: dtlItem?.subwayStation || null,
      subwayWalkTime: dtlItem?.kaptdWtimesub || null,
      busWalkTime: dtlItem?.kaptdWtimebus || null,
      nearbyFacilities: dtlItem?.convenientFacility || null,
      nearbySchools: dtlItem?.educationFacility || null,
      area_distributions: areaDistributions,
    };

    // 캐시 저장
    kaptCache.set(kaptCode, {
      data: enrichedData,
      expiry: Date.now() + CACHE_TTL_MS,
    });

    return NextResponse.json({
      success: true,
      data: enrichedData,
      source: "api.data.go.kr",
    });
  } catch (error: any) {
    console.error("K-apt API fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "K-apt API 통신 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
