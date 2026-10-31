import { NextResponse } from "next/server";
import { publicRedevelopmentApi } from "@/lib/publicRedevelopmentApi";
import { isRoneApiActive } from "@/lib/roneMarketApi";
import { isStoreApiActive } from "@/lib/storeInfoApi";

/**
 * 찾아줘 데이터 출처 메타데이터 및 연동 상태 통합 API
 *
 * 이미지 기준 8개 데이터 영역 전체 반영:
 * 1. 아파트 매매 실거래가 (국토교통부)          - 필수
 * 2. 전월세 거래 (국토교통부)                   - 필수
 * 3. 아파트 기본정보 (공동주택 기본정보 API)     - 필수
 * 4. 부동산 시장 통계 (한국부동산원 R-ONE)       - 권장
 * 5. 전국 정비사업 (국토교통부 통합데이터)       - 필수
 * 6. 서울 정비사업 (정보몽땅+열린데이터광장)     - 보완
 * 7. 전국 상가상권 (소상공인진흥공단)            - 필수
 * 8. 지도·주소 (공공데이터포털+카카오)           - 필수
 */
export async function GET() {
  const isDataGoActive = !publicRedevelopmentApi.isMockMode;
  const isRoneActive = isRoneApiActive();
  const isStoreActive = isStoreApiActive();

  return NextResponse.json({
    service: "찾아줘",
    dataSourcesVersion: "2.0",
    dataSources: [
      // ── [1] 아파트 매매 실거래가 ──────────────────────────────────────────
      {
        id: "apt-trade",
        category: "아파트 매매 실거래가",
        priority: "필수",
        sourceName: "국토교통부 실거래가 공개시스템",
        portal: "공공데이터포털 (data.go.kr)",
        apiEndpoint: "https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade",
        apiName: "국토교통부_아파트 매매 실거래자료 (RTMSDataSvcAptTrade)",
        dataRole: "개별 실거래 신고 원시 데이터 (지역코드 LAWD_CD + 계약년월 DEAL_YMD 기준 개별 계약건)",
        statSeparationNotice: "개별 계약 체결가 분석용이며, 한국부동산원 등의 거시 표본 가격지수와 집계 기준이 다르므로 하나의 지표로 혼용하지 않고 분리 제공합니다.",
        verifiedFields: ["거래일 (dealYear/Month/Day)", "가격 (dealAmount)", "면적 (excluUseAr)", "층 (floor)", "단지명 (aptNm)", "지역코드 (LAWD_CD)", "취소여부 (dealingGbn)"],
        routePath: "/api/transactions",
        status: isDataGoActive ? "LIVE_CONNECTED" : "STANDBY_READY",
        updateCycle: "실시간 / 거래신고 익일 반영",
        coverage: "전국 250개 시군구",
      },
      // ── [2] 전월세 거래 ──────────────────────────────────────────────────
      {
        id: "apt-rent",
        category: "전월세 거래",
        priority: "필수",
        sourceName: "국토교통부 전월세 실거래가 공개시스템",
        portal: "공공데이터포털 (data.go.kr)",
        apiEndpoint: "https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent",
        apiName: "국토교통부_아파트 전월세 실거래자료 (RTMSDataSvcAptRent)",
        dataRole: "개별 임대차 신고 원시 데이터 (보증금/월세 개별 계약건)",
        statSeparationNotice: "실제 임대차 계약 체결 및 전세가율 산출용이며, 거시 통계와 분리 적용합니다.",
        verifiedFields: ["보증금 (deposit)", "월세 (monthlyRent)", "계약월 (dealYear/Month)", "면적 (excluUseAr)", "단지명 (aptNm)", "계약구분 (contractType)", "취소여부 (dealingGbn)"],
        routePath: "/api/transactions",
        status: isDataGoActive ? "LIVE_CONNECTED" : "STANDBY_READY",
        updateCycle: "실시간 / 거래신고 익일 반영",
        coverage: "전국 250개 시군구",
      },
      // ── [3] 아파트 기본정보 (K-apt) ───────────────────────────────────────
      {
        id: "kapt-info",
        category: "아파트 기본정보",
        priority: "필수",
        sourceName: "공동주택 기본정보 서비스 (K-apt)",
        portal: "공공데이터포털 (data.go.kr)",
        apiEndpoint: "https://apis.data.go.kr/1613000/AptBasisInfoServiceV5",
        apiName: [
          "공동주택 기본정보 (getAphusBassInfoV5)",
          "공동주택 상세정보 (getAphusDtlInfoV5)",
        ],
        verifiedFields: ["주소 (kaptAddr/doroJuso)", "세대수 (kaptdaCnt)", "동수 (kaptDongCnt)", "난방방식 (codeHeatNm)", "사용승인일 (kaptUsedate)", "시공사 (kaptBcompany)", "주차대수", "CCTV수"],
        routePath: "/api/kapt",
        status: isDataGoActive ? "LIVE_CONNECTED" : "STANDBY_READY",
        updateCycle: "실시간",
        coverage: "전국 공동주택 단지",
      },
      // ── [4] 부동산 시장 통계 (R-ONE) ─────────────────────────────────────
      {
        id: "rone-stats",
        category: "부동산 시장 통계",
        priority: "권장",
        sourceName: "한국부동산원 R-ONE Open API",
        portal: "한국부동산원 (reb.or.kr)",
        apiEndpoint: "https://www.reb.or.kr/r-one/openapi/SttsApiTblData.do",
        apiName: "한국부동산원_R-ONE 부동산통계정보 (SttsApiTblData)",
        dataRole: "거시 시장 가격지수 (표본 기반 가격동향 및 시장 흐름 판단)",
        statSeparationNotice: "한국부동산원 표본 가격지수 통계이며, 국토교통부 개별 실거래가와 집계 기준이 다르므로 단일 지표로 합성하지 않고 거시 시장 추세 판단용으로 엄격히 분리 제공합니다.",
        verifiedFields: ["가격지수 (매매/전세, 기준시점=100.0)", "전월대비 변동률 (%)", "거래량 (월간 집계)"],
        routePath: "/api/market-stats",
        status: isRoneActive ? "LIVE_CONNECTED" : "KEY_REQUIRED",
        configKey: "RONE_API_KEY",
        updateCycle: "월간 / 주간",
        coverage: "전국·광역시도·시군구",
      },
      // ── [5] 전국 정비사업 ─────────────────────────────────────────────────
      {
        id: "national-redevelopment",
        category: "전국 정비사업",
        priority: "필수",
        sourceName: "국토교통부 전국 도시정비사업 통합 데이터",
        portal: "공공데이터포털 (data.go.kr)",
        apiEndpoint: "https://www.data.go.kr/data/15044691/fileData.do",
        apiName: [
          "전국재개발재건축정비사업표준데이터 (CSV/파일)",
          "서울시 정비사업 추진현황 (HsmpInfo Open API)",
        ],
        dataRole: "전국 정비구역 마스터 베이스라인 확보 (사업유형, 추진단계, 예정세대수)",
        governanceArchitecture: "전국 기본 목록은 국토교통부 연간 갱신 데이터로 베이스라인을 확보하고, 최근 사업단계 변경 사항은 지자체 고시·공고 및 서울 정보몽땅 등으로 보완하는 2-Tier 하이브리드 거버넌스를 적용합니다.",
        verifiedFields: ["구역명", "사업 유형 (재개발/재건축 등)", "추진 단계", "예정 세대수 (PLAN_HSHLD_CO)", "위치 식별 가능 여부 (hasLocation)", "사업면적 (HSMP_AR)", "시공사"],
        routePath: "/api/redevelopment",
        status: "LIVE_CONNECTED",
        updateCycle: "연간 갱신 (전국 기본 목록 베이스라인)",
        coverage: "전국 정비구역",
      },
      // ── [6] 서울 정비사업 ─────────────────────────────────────────────────
      {
        id: "seoul-redevelopment",
        category: "서울 정비사업",
        priority: "보완",
        sourceName: "정비사업 정보몽땅 (cleanup.seoul.go.kr) + 서울 열린데이터광장",
        portal: "서울 열린데이터광장 (data.seoul.go.kr)",
        apiEndpoint: "https://openapi.seoul.go.kr:8088/{key}/json/HsmpInfo",
        apiName: [
          "서울시 정비사업 추진현황 (HsmpInfo)",
          "서울시 정비사업 고시·공고 (upisAnnouncement)",
        ],
        dataRole: "최근 추진현황 및 인허가 고시·공고 실시간/수시 보완 패치",
        verifiedFields: ["구역 위치 (SGG_NM + 주소)", "사업 단계 (HSMP_STTS_NM)", "고시·공고 (title/date/org)", "변경 이력 (hasChangeHistory)"],
        routePath: "/api/redevelopment/notices",
        status: "LIVE_CONNECTED",
        configKey: "SEOUL_OPENAPI_KEY",
        updateCycle: "일별 / 수시",
        coverage: "서울시 전체 정비구역",
      },
      // ── [7] 전국 상가상권 ─────────────────────────────────────────────────
      {
        id: "store-info",
        category: "전국 상가상권",
        priority: "필수",
        sourceName: "소상공인시장진흥공단 상가(상권)정보 서비스",
        portal: "공공데이터포털 (data.go.kr)",
        apiEndpoint: "https://apis.data.go.kr/B553077/api/open/sdsc2",
        apiName: "소상공인_상가(상권)정보 (sdsc2)",
        dataRole: "초기 업종 분포 분석 (업종 대/중/소분류 점포 수, 위치 좌표)",
        dataLimitationNotice: "본 API는 점포 등록 현황 기준의 초기 업종 분포 분석용이며, 개별 점포의 매출액이나 유동인구를 알 수 없으므로 이를 임의로 추정하거나 확정 상권 지표로 가정하지 않습니다.",
        verifiedFields: ["점포 식별자 (bizesId)", "업종 (indsLclsNm/indsMclsNm/indsSclsNm)", "주소 (rdnAdr/lnoAdr)", "위도·경도 (lat/lon)", "갱신일자 (lastModTs)"],
        routePath: "/api/stores",
        status: isStoreActive ? "LIVE_CONNECTED" : "STANDBY_READY",
        updateCycle: "분기 / 갱신일자 기준",
        coverage: "전국 전체 상가",
      },
      // ── [8] 지도·주소 ─────────────────────────────────────────────────────
      {
        id: "geocoding",
        category: "지도·주소",
        priority: "필수",
        sourceName: "카카오 로컬 REST API + 공공데이터포털 도로명주소 API",
        portal: "Kakao Developers (developers.kakao.com) + data.go.kr",
        apiEndpoint: "https://dapi.kakao.com/v2/local",
        apiName: [
          "카카오 키워드 검색 (search/keyword.json)",
          "카카오 주소 검색 (search/address.json)",
          "국토교통부 VWorld WFS (정비구역 경계)",
        ],
        verifiedFields: ["주소 정규화 (address_name)", "좌표 변환 (x/y→lng/lat)", "지도 표시 권한 (KakaoAK)", "호출 제한 (rate-limit 대응 캐싱)"],
        routePath: "/api/geocode",
        status: "LIVE_CONNECTED",
        updateCycle: "실시간",
        coverage: "전국",
      },
    ],
    summary: {
      totalSources: 8,
      liveConnected: [
        isDataGoActive && "apt-trade",
        isDataGoActive && "apt-rent",
        isDataGoActive && "kapt-info",
        isRoneActive && "rone-stats",
        "national-redevelopment",
        "seoul-redevelopment",
        isStoreActive && "store-info",
        "geocoding",
      ].filter(Boolean),
      keyRequired: [
        !isRoneActive && "RONE_API_KEY (한국부동산원 R-ONE)",
        !isDataGoActive && "DATA_GO_KR_API_KEY (국토교통부/소상공인)",
      ].filter(Boolean),
    },
    legalDisclaimer:
      "찾아줘의 정보는 공공데이터와 공개 자료를 바탕으로 한 참고용 정보이며 법적 효력이 없습니다. 정확한 내용은 관할 기관에서 확인하시기 바랍니다. 투자 판단과 그 결과에 대한 책임은 이용자 본인에게 있습니다.",
    environment: {
      DATA_GO_KR_API_KEY: isDataGoActive,
      RONE_API_KEY: isRoneActive,
      SEOUL_OPENAPI_KEY: !!(process.env.SEOUL_OPENAPI_KEY),
      VWORLD_API_KEY: !!(process.env.VWORLD_API_KEY),
      KAKAO_REST_API_KEY: !!(process.env.KAKAO_REST_API_KEY || process.env.NEXT_PUBLIC_KAKAO_REST_KEY),
    },
  });
}
