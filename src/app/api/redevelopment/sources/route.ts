import { NextResponse } from "next/server";
import { publicRedevelopmentApi } from "@/lib/publicRedevelopmentApi";

/**
 * 재개발닷컴 동일 데이터 출처 메타데이터 및 연동 상태 API
 */
export async function GET() {
  const isLiveApiActive = !publicRedevelopmentApi.isMockMode;

  return NextResponse.json({
    service: "찾아줘 재개발",
    dataSources: [
      {
        category: "실거래가 정보",
        sourceName: "국토교통부 실거래가 공개시스템",
        portal: "공공데이터포털 (data.go.kr)",
        apiName: [
          "국토교통부_연립다세대 매매 실거래자료 (RTMSDataSvcRHTrade)",
          "국토교통부_단독/다가구 매매 실거래가 자료 (RTMSDataSvcSHTrade)",
          "국토교통부_아파트 매매 실거래자료 (RTMSDataSvcAptTrade)",
        ],
        status: isLiveApiActive ? "LIVE_CONNECTED" : "STANDBY_READY",
        updateCycle: "실시간 / 거래신고 익일 반영",
        coverage: "전국 250개 시군구 정비사업 구역 전수",
      },
      {
        category: "구역별 진행 정보",
        sourceName: "각 지자체 홈페이지 및 정비사업 정보몽땅",
        portal: "서울 열린데이터광장 및 행정안전부/국토교통부 공공데이터",
        apiName: [
          "서울시 정비사업 추진현황 (HsmpInfo Open API)",
          "전국재개발재건축정비사업표준데이터 (CSV/Batch)",
          "지자체별 고시·공고 정보",
        ],
        status: "LIVE_CONNECTED",
        updateCycle: "일별 / 지자체 인허가 고시 즉시",
        coverage: "전국 정비구역 11단계 인허가 타임라인",
      },
      {
        category: "건물 정보",
        sourceName: "국토교통부 건축물대장 (건축HUB)",
        portal: "공공데이터포털 (data.go.kr)",
        apiName: [
          "국토교통부_건축HUB_건축물대장정보 서비스 (BldRgstHubService)",
          "표제부 조회 (getBrTitleInfo)",
        ],
        status: isLiveApiActive ? "LIVE_CONNECTED" : "STANDBY_READY",
        updateCycle: "실시간 / 건축물 사용승인 및 변경 시",
        coverage: "전국 건축물 노후도, 주용도, 연면적, 층수, 건폐율, 용적률",
      },
    ],
    legalDisclaimer:
      "찾아줘의 정보는 공공데이터와 공개 자료를 바탕으로 한 참고용 정보이며 법적 효력이 없습니다. 정확한 내용은 관할 기관에서 확인하시기 바랍니다. 투자 판단과 그 결과에 대한 책임은 이용자 본인에게 있습니다.",
    environment: {
      hasApiKey: isLiveApiActive,
      configuredKeyName: "DATA_GO_KR_API_KEY",
    },
  });
}
