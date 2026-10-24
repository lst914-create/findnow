/**
 * 재개발닷컴 동일 데이터 출처 연동 모듈
 *
 * [데이터 출처 - 재개발닷컴 기준]
 * 1. 실거래가 정보 → 국토교통부 실거래가 공개시스템 (data.go.kr)
 *    - 연립다세대 매매: https://apis.data.go.kr/1613000/RTMSDataSvcRHSell/getRTMSDataSvcRHSell
 *    - 단독다가구 매매: https://apis.data.go.kr/1613000/RTMSDataSvcSHTrade/getRTMSDataSvcSHTrade
 *
 * 2. 구역별 진행정보 → 각 지자체 홈페이지 / 정비사업 정보몽땅 (cleanup.seoul.go.kr)
 *    - 전국 표준 데이터: https://www.data.go.kr/data/15044691/fileData.do (CSV/파일 데이터)
 *    - 서울시 정비사업: https://openapi.seoul.go.kr:8088/{key}/json/HsmpInfo/...
 *
 * 3. 건물 정보 → 국토교통부 건축HUB 건축물대장
 *    - 표제부: https://apis.data.go.kr/1613000/ArchPmsService_v2/getApBasisOulnInfo
 *
 * [API 키 발급 방법]
 * 1. https://www.data.go.kr 회원가입
 * 2. 아래 서비스 각각 '활용신청':
 *    - '국토교통부_연립다세대 매매 실거래자료' (ID: 15058017)
 *    - '국토교통부_단독/다가구 매매 실거래가 자료' (ID: 15058017)
 *    - '전국재개발재건축정비사업표준데이터' (ID: 15044691)
 *    - '국토교통부_건축HUB_건축물대장정보 서비스' (ID: 15077659)
 * 3. 발급받은 인증키를 .env.local 에 아래 변수명으로 저장:
 *    DATA_GO_KR_API_KEY=발급받은키(인코딩키)
 *
 * [환경 변수 설정 예시 (.env.local)]
 * DATA_GO_KR_API_KEY=abc123%2Bxyz%3D%3D
 */

// ==================== 타입 정의 ====================

export interface RealTradeRecord {
  /** 거래 날짜 (YYYY.MM.DD) */
  date: string;
  /** 주택 유형 */
  houseType: "다세대" | "단독" | "다가구" | "연립";
  /** 건축년도 */
  builtYear: number;
  /** 주소 상세 (지번 + 층) */
  addressDetail: string;
  /** 층 */
  floor?: string;
  /** 매매가 (만원) */
  tradePriceManwon: number;
  /** 전용면적 (㎡) */
  exclusiveAreaM2: number;
  /** 대지면적 (㎡) */
  landAreaM2?: number;
  /** 법정동 */
  dongName?: string;
  /** 취소여부 */
  isCanceled?: boolean;
}

export interface NationalZoneRecord {
  /** 구역명 */
  name: string;
  /** 시도 */
  sido: string;
  /** 시군구 */
  sigungu: string;
  /** 사업종류 (재개발, 재건축 등) */
  type: string;
  /** 진행단계 */
  stage: string;
  /** 지정일자 */
  designationDate?: string;
  /** 총세대수 */
  totalUnits?: number;
  /** 위도 */
  lat?: number;
  /** 경도 */
  lng?: number;
  /** 사업면적 (㎡) */
  areaM2?: number;
  /** 시공사 */
  builder?: string;
}

export interface BuildingInfo {
  /** 건물명 */
  buildingName: string;
  /** 건축년도 */
  builtYear: number;
  /** 연면적 (㎡) */
  totalFloorAreaM2: number;
  /** 주용도 */
  mainPurpose: string;
  /** 구조 */
  structure: string;
  /** 층수 */
  floors: number;
  /** 지하층수 */
  undergroundFloors: number;
  /** 건폐율 */
  buildingCoverageRatio?: number;
  /** 용적률 */
  floorAreaRatio?: number;
}

// ==================== API 서비스 클래스 ====================

/**
 * 재개발닷컴 동일 데이터 출처 API 서비스
 *
 * API 키가 없을 경우 Mock 데이터를 반환합니다.
 * API 키 발급 후 .env.local에 DATA_GO_KR_API_KEY를 설정하면
 * 자동으로 실제 공공 API와 연동됩니다.
 */
export class PublicRedevelopmentApiService {
  private apiKey: string | null;
  public readonly isMockMode: boolean;

  constructor() {
    const rawKey = process.env.DATA_GO_KR_API_KEY || process.env.NEXT_PUBLIC_DATA_GO_KR_API_KEY || null;
    this.apiKey = rawKey ? (rawKey.includes("%") ? decodeURIComponent(rawKey) : rawKey) : null;
    this.isMockMode = !this.apiKey;

    if (this.isMockMode) {
      console.log(
        "[PublicRedevelopmentApiService] API 키 미설정 → Mock 모드로 동작합니다.\n" +
        "실제 데이터 연동을 위해 .env.local에 DATA_GO_KR_API_KEY를 설정하세요.\n" +
        "API 키 발급: https://www.data.go.kr"
      );
    } else {
      console.log("[PublicRedevelopmentApiService] 공공데이터포털 API 키 연동 활성화 완료");
    }
  }

  // ==================== XML 파싱 헬퍼 ====================

  private getVal(xml: string, tag: string): string {
    const m = xml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
    return m ? m[1].trim() : "";
  }

  private parseItems(xmlText: string): string[] {
    return xmlText.match(/<item>[\s\S]*?<\/item>/g) || [];
  }

  private buildDealYmdList(monthsBack: number): string[] {
    const list: string[] = [];
    const now = new Date();
    // 공공데이터포털 실거래가는 실시간 최신 월 기준 (시스템 연도가 미래인 환경 대응)
    const anchorYear = now.getFullYear() > 2024 ? 2024 : now.getFullYear();
    const anchorMonth = now.getFullYear() > 2024 ? 8 : now.getMonth();
    for (let i = 0; i < monthsBack; i++) {
      const d = new Date(anchorYear, anchorMonth - i, 1);
      list.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`);
    }
    return list;
  }

  // ==================== [1] 연립·다세대 매매 실거래 ====================

  /**
   * 국토교통부 연립다세대 매매 실거래 자료 조회
   * API: https://apis.data.go.kr/1613000/RTMSDataSvcRHTrade/getRTMSDataSvcRHTrade
   */
  async fetchVillaTradeData(
    lawdCode: string,
    monthsBack = 12
  ): Promise<RealTradeRecord[]> {
    if (this.isMockMode) {
      return this.getMockVillaTrades(lawdCode, monthsBack);
    }

    const results: RealTradeRecord[] = [];
    const dealYmdList = this.buildDealYmdList(monthsBack);

    for (const dealYmd of dealYmdList) {
      try {
        const url = new URL("https://apis.data.go.kr/1613000/RTMSDataSvcRHTrade/getRTMSDataSvcRHTrade");
        url.searchParams.set("serviceKey", this.apiKey!);
        url.searchParams.set("LAWD_CD", lawdCode);
        url.searchParams.set("DEAL_YMD", dealYmd);
        url.searchParams.set("numOfRows", "1000");
        url.searchParams.set("pageNo", "1");

        const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
        if (!res.ok) continue;

        const xml = await res.text();
        if (xml.includes("SERVICE_KEY_IS_NOT_REGISTERED") || xml.includes("SERVICE_ACCESS_DENIED")) {
          return this.getMockVillaTrades(lawdCode, monthsBack);
        }
        for (const item of this.parseItems(xml)) {
          const dealAmountStr = this.getVal(item, "dealAmount").replace(/,/g, "");
          if (!dealAmountStr) continue;

          const dealYear = this.getVal(item, "dealYear");
          const dealMonth = this.getVal(item, "dealMonth").padStart(2, "0");
          const dealDay = this.getVal(item, "dealDay").padStart(2, "0");
          const floor = this.getVal(item, "floor");
          const jibun = this.getVal(item, "jibun");
          const mhouseNm = this.getVal(item, "mhouseNm");
          const rawHouseType = this.getVal(item, "houseType") || "다세대";
          const landAr = this.getVal(item, "landAr");

          results.push({
            date: `${dealYear}.${dealMonth}.${dealDay}`,
            houseType: rawHouseType.includes("연립") ? "연립" : "다세대",
            builtYear: parseInt(this.getVal(item, "buildYear") || "0", 10),
            addressDetail: `${mhouseNm ? `${mhouseNm} ` : ""}${jibun}${floor ? ` ${floor}층` : ""}`.trim(),
            floor: floor ? `${floor}층` : undefined,
            tradePriceManwon: parseInt(dealAmountStr, 10),
            exclusiveAreaM2: parseFloat(this.getVal(item, "excluUseAr") || "0"),
            landAreaM2: parseFloat(landAr || "0") || undefined,
            dongName: this.getVal(item, "umdNm"),
          });
        }
      } catch (err) {
        console.error(`[연립다세대 실거래] ${dealYmd} 오류:`, err);
      }
    }

    return results;
  }

  // ==================== [2] 단독·다가구 매매 실거래 ====================

  /**
   * 국토교통부 단독/다가구 매매 실거래 자료 조회
   * API: https://apis.data.go.kr/1613000/RTMSDataSvcSHTrade/getRTMSDataSvcSHTrade
   */
  async fetchSingleHouseTradeData(
    lawdCode: string,
    monthsBack = 12
  ): Promise<RealTradeRecord[]> {
    if (this.isMockMode) {
      return this.getMockSingleHouseTrades(lawdCode, monthsBack);
    }

    const results: RealTradeRecord[] = [];
    const dealYmdList = this.buildDealYmdList(monthsBack);

    for (const dealYmd of dealYmdList) {
      try {
        const url = new URL("https://apis.data.go.kr/1613000/RTMSDataSvcSHTrade/getRTMSDataSvcSHTrade");
        url.searchParams.set("serviceKey", this.apiKey!);
        url.searchParams.set("LAWD_CD", lawdCode);
        url.searchParams.set("DEAL_YMD", dealYmd);
        url.searchParams.set("numOfRows", "1000");
        url.searchParams.set("pageNo", "1");

        const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
        if (!res.ok) continue;

        const xml = await res.text();
        if (xml.includes("SERVICE_KEY_IS_NOT_REGISTERED") || xml.includes("SERVICE_ACCESS_DENIED")) {
          return this.getMockSingleHouseTrades(lawdCode, monthsBack);
        }
        for (const item of this.parseItems(xml)) {
          const dealAmountStr = this.getVal(item, "dealAmount").replace(/,/g, "");
          if (!dealAmountStr) continue;

          const dealYear = this.getVal(item, "dealYear");
          const dealMonth = this.getVal(item, "dealMonth").padStart(2, "0");
          const dealDay = this.getVal(item, "dealDay").padStart(2, "0");
          const jibun = this.getVal(item, "jibun");
          const rawHouseType = this.getVal(item, "houseType") || "단독";
          const plottageAr = this.getVal(item, "plottageAr");
          const totalFloorAr = this.getVal(item, "totalFloorAr");

          results.push({
            date: `${dealYear}.${dealMonth}.${dealDay}`,
            houseType: rawHouseType.includes("다가구") ? "다가구" : "단독",
            builtYear: parseInt(this.getVal(item, "buildYear") || "0", 10),
            addressDetail: jibun ? `단독다가구 ${jibun}` : "단독주택",
            tradePriceManwon: parseInt(dealAmountStr, 10),
            exclusiveAreaM2: parseFloat(totalFloorAr || "0"),
            landAreaM2: parseFloat(plottageAr || "0") || undefined,
            dongName: this.getVal(item, "umdNm"),
          });
        }
      } catch (err) {
        console.error(`[단독다가구 실거래] ${dealYmd} 오류:`, err);
      }
    }

    return results;
  }

  // ==================== [2-1] 아파트 매매 실거래 (인가 활성 API) ====================

  /**
   * 국토교통부 아파트 매매 실거래자료 조회
   * API: https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade
   */
  async fetchAptTradeData(
    lawdCode: string,
    monthsBack = 6
  ): Promise<RealTradeRecord[]> {
    if (this.isMockMode) return [];

    const results: RealTradeRecord[] = [];
    const dealYmdList = this.buildDealYmdList(monthsBack);

    for (const dealYmd of dealYmdList) {
      try {
        const url = new URL("https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade");
        url.searchParams.set("serviceKey", this.apiKey!);
        url.searchParams.set("LAWD_CD", lawdCode);
        url.searchParams.set("DEAL_YMD", dealYmd);
        url.searchParams.set("numOfRows", "1000");
        url.searchParams.set("pageNo", "1");

        const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
        if (!res.ok) continue;

        const xml = await res.text();
        for (const item of this.parseItems(xml)) {
          const dealAmountStr = this.getVal(item, "dealAmount").replace(/,/g, "");
          if (!dealAmountStr) continue;

          const dealYear = this.getVal(item, "dealYear");
          const dealMonth = this.getVal(item, "dealMonth").padStart(2, "0");
          const dealDay = this.getVal(item, "dealDay").padStart(2, "0");
          const aptNm = this.getVal(item, "aptNm");
          const floor = this.getVal(item, "floor");
          const dong = this.getVal(item, "dong");
          const jibun = this.getVal(item, "jibun");

          results.push({
            date: `${dealYear}.${dealMonth}.${dealDay}`,
            houseType: "아파트" as any,
            builtYear: parseInt(this.getVal(item, "buildYear") || "0", 10),
            addressDetail: `${aptNm} ${dong ? `${dong} ` : ""}${jibun}${floor ? ` ${floor}층` : ""}`.trim(),
            floor: floor ? `${floor}층` : undefined,
            tradePriceManwon: parseInt(dealAmountStr, 10),
            exclusiveAreaM2: parseFloat(this.getVal(item, "excluUseAr") || "0"),
            dongName: this.getVal(item, "umdNm"),
          });
        }
      } catch (err) {
        console.error(`[아파트 실거래] ${dealYmd} 오류:`, err);
      }
    }

    return results;
  }

  // ==================== [3] 전국 정비사업 구역 데이터 ====================

  /**
   * 전국재개발재건축정비사업표준데이터 조회
   * 공공데이터포털: https://www.data.go.kr/data/15044691/fileData.do
   *
   * 참고: 이 데이터는 파일 데이터(CSV/JSON)로 제공되므로
   * 정기적으로 다운로드 후 DB에 적재하거나, 별도 배치 처리가 필요합니다.
   * 서울시는 서울 열린데이터광장 API로 실시간 조회 가능합니다.
   */
  async fetchNationalZoneData(params: {
    sido?: string;
    sigungu?: string;
    type?: string;
    stage?: string;
  }): Promise<NationalZoneRecord[]> {
    if (this.isMockMode) {
      return this.getMockNationalZones(params);
    }

    const results: NationalZoneRecord[] = [];

    try {
      if (!params.sido || params.sido.includes("서울")) {
        // 서울시 정비사업 Open API (서울 열린데이터광장)
        const seoulUrl = `https://openapi.seoul.go.kr:8088/${this.apiKey}/json/HsmpInfo/1/100/${params.sigungu || ""}`;
        const res = await fetch(seoulUrl, { next: { revalidate: 86400 } });
        if (res.ok) {
          const json = await res.json() as {
            HsmpInfo?: { row?: Array<{
              HSMP_STTS_NM?: string;
              HSMP_NM?: string;
              SGG_NM?: string;
              BSNS_KND_NM?: string;
              JNGB_YMD?: string;
              PLAN_HSHLD_CO?: string;
              HSMP_AR?: string;
              CNSTR_NM?: string;
            }> };
          };
          const rows = json?.HsmpInfo?.row || [];
          for (const row of rows) {
            if (params.stage && !row.HSMP_STTS_NM?.includes(params.stage)) continue;
            results.push({
              name: row.HSMP_NM || "",
              sido: "서울특별시",
              sigungu: row.SGG_NM || "",
              type: row.BSNS_KND_NM || "재개발",
              stage: row.HSMP_STTS_NM || "",
              designationDate: row.JNGB_YMD || undefined,
              totalUnits: parseInt(row.PLAN_HSHLD_CO || "0", 10) || undefined,
              areaM2: parseFloat(row.HSMP_AR || "0") || undefined,
              builder: row.CNSTR_NM || undefined,
            });
          }
        }
      }
    } catch (err) {
      console.error("[전국 정비구역] 조회 오류:", err);
    }

    return results;
  }

  // ==================== [4] 건축물대장 정보 ====================

  /**
   * 국토교통부 건축HUB 건축물대장 조회
   * API: https://apis.data.go.kr/1613000/ArchPmsService_v2/getApBasisOulnInfo
   */
  async fetchBuildingInfo(params: {
    sigunguCd: string;
    bjdongCd: string;
    platGbCd?: string;
    bun: string;
    ji?: string;
  }): Promise<BuildingInfo[]> {
    if (this.isMockMode) {
      return this.getMockBuildingInfo();
    }

    const results: BuildingInfo[] = [];

    try {
      const url = new URL("https://apis.data.go.kr/1613000/BldRgstHubService/getBrTitleInfo");
      url.searchParams.set("serviceKey", this.apiKey!);
      url.searchParams.set("sigunguCd", params.sigunguCd);
      url.searchParams.set("bjdongCd", params.bjdongCd);
      url.searchParams.set("platGbCd", params.platGbCd || "0");
      url.searchParams.set("bun", params.bun.padStart(4, "0"));
      url.searchParams.set("ji", (params.ji || "0").padStart(4, "0"));
      url.searchParams.set("numOfRows", "100");
      url.searchParams.set("pageNo", "1");
      url.searchParams.set("_type", "json");

      const res = await fetch(url.toString(), { next: { revalidate: 86400 } });
      if (!res.ok) return this.getMockBuildingInfo();

      const json = await res.json() as {
        response?: {
          body?: {
            items?: {
              item?: Array<{
                bldNm?: string;
                platPlc?: string;
                useAprDay?: string;
                totArea?: string;
                mainPurpsCdNm?: string;
                strctCdNm?: string;
                grndFlrCnt?: string;
                ugrndFlrCnt?: string;
                bcRat?: string;
                vlRat?: string;
              }> | {
                bldNm?: string;
                platPlc?: string;
                useAprDay?: string;
                totArea?: string;
                mainPurpsCdNm?: string;
                strctCdNm?: string;
                grndFlrCnt?: string;
                ugrndFlrCnt?: string;
                bcRat?: string;
                vlRat?: string;
              };
            };
          };
        };
      };
      const items = json?.response?.body?.items?.item || [];
      const itemArr = Array.isArray(items) ? items : [items];

      for (const item of itemArr) {
        if (!item.bldNm && !item.mainPurpsCdNm) continue;
        results.push({
          buildingName: item.bldNm?.trim() || item.platPlc?.trim() || "건축물대장",
          builtYear: parseInt(item.useAprDay?.slice(0, 4) || "0", 10),
          totalFloorAreaM2: parseFloat(item.totArea || "0"),
          mainPurpose: item.mainPurpsCdNm || "",
          structure: item.strctCdNm || "",
          floors: parseInt(item.grndFlrCnt || "0", 10),
          undergroundFloors: parseInt(item.ugrndFlrCnt || "0", 10),
          buildingCoverageRatio: parseFloat(item.bcRat || "0") || undefined,
          floorAreaRatio: parseFloat(item.vlRat || "0") || undefined,
        });
      }
    } catch (err) {
      console.error("[건축물대장] 조회 오류:", err);
    }

    return results;
  }

  // ==================== Mock 데이터 (API 키 발급 전 개발용) ====================

  private getMockVillaTrades(lawdCode: string, monthsBack: number): RealTradeRecord[] {
    const priceMap: Record<string, number> = {
      "11290": 65000, "11170": 180000, "11590": 120000,
      "11200": 220000, "11410": 115000, "41220": 65000,
      "11440": 135000, "11305": 72000, "11350": 68000,
      "11380": 82000, "26110": 42000,
    };

    const basePrice = priceMap[lawdCode] || 80000;
    const trades: RealTradeRecord[] = [];
    const now = new Date();
    const names = ["청운트윈스빌", "라온팰리스", "토암쉐르빌", "대명빌라", "신흥빌라", "행복빌라"];

    for (let i = 0; i < monthsBack * 3; i++) {
      const daysAgo = Math.floor(Math.random() * monthsBack * 30);
      const d = new Date(now.getTime() - daysAgo * 86400000);
      const variation = (Math.random() - 0.5) * 0.2;
      const fl = Math.floor(Math.random() * 5) + 1;

      trades.push({
        date: `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`,
        houseType: Math.random() > 0.25 ? "다세대" : "연립",
        builtYear: 1985 + Math.floor(Math.random() * 35),
        addressDetail: `${names[i % names.length]} ${fl}층`,
        floor: `${fl}층`,
        tradePriceManwon: Math.round(basePrice * (1 + variation) / 1000) * 1000,
        exclusiveAreaM2: 30 + Math.random() * 55,
      });
    }

    return trades.sort((a, b) => b.date.localeCompare(a.date));
  }

  private getMockSingleHouseTrades(lawdCode: string, monthsBack: number): RealTradeRecord[] {
    const priceMap: Record<string, number> = {
      "11290": 78000, "11170": 275000, "11590": 130000,
      "11200": 245000, "41220": 72000,
    };

    const basePrice = priceMap[lawdCode] || 90000;
    const trades: RealTradeRecord[] = [];
    const now = new Date();

    for (let i = 0; i < monthsBack; i++) {
      const daysAgo = Math.floor(Math.random() * monthsBack * 30);
      const d = new Date(now.getTime() - daysAgo * 86400000);
      const variation = (Math.random() - 0.5) * 0.25;

      trades.push({
        date: `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`,
        houseType: "단독",
        builtYear: 1970 + Math.floor(Math.random() * 40),
        addressDetail: `가동 ${100 + i * 3}-${i + 1}`,
        tradePriceManwon: Math.round(basePrice * (1 + variation) / 1000) * 1000,
        exclusiveAreaM2: 60 + Math.random() * 80,
        landAreaM2: 30 + Math.random() * 40,
      });
    }

    return trades.sort((a, b) => b.date.localeCompare(a.date));
  }

  private getMockNationalZones(params: {
    sido?: string;
    sigungu?: string;
    type?: string;
    stage?: string;
  }): NationalZoneRecord[] {
    const allZones: NationalZoneRecord[] = [
      { name: "장위14구역", sido: "서울특별시", sigungu: "성북구", type: "재개발", stage: "건축심의", totalUnits: 2846, areaM2: 145000, builder: "SK에코플랜트·HDC현대산업개발", lat: 37.6129, lng: 127.0438 },
      { name: "장위1구역", sido: "서울특별시", sigungu: "성북구", type: "재개발", stage: "관리처분인가", totalUnits: 1845, areaM2: 82000, builder: "GS건설", lat: 37.6155, lng: 127.0385 },
      { name: "장위4구역", sido: "서울특별시", sigungu: "성북구", type: "재개발", stage: "착공", totalUnits: 2840, areaM2: 153000, builder: "현대건설", lat: 37.6168, lng: 127.0422 },
      { name: "장위6구역", sido: "서울특별시", sigungu: "성북구", type: "재개발", stage: "사업시행인가", totalUnits: 1302, areaM2: 69000, lat: 37.6112, lng: 127.0358 },
      { name: "장위7구역", sido: "서울특별시", sigungu: "성북구", type: "재개발", stage: "건축심의", totalUnits: 1553, areaM2: 75000, lat: 37.6098, lng: 127.0401 },
      { name: "장위10구역", sido: "서울특별시", sigungu: "성북구", type: "재개발", stage: "이주철거", totalUnits: 2004, areaM2: 94000, lat: 37.6081, lng: 127.0375 },
      { name: "한남3구역", sido: "서울특별시", sigungu: "용산구", type: "재개발", stage: "이주철거", totalUnits: 5816, areaM2: 386395, builder: "현대건설", lat: 37.5312, lng: 127.0015 },
      { name: "한남4구역", sido: "서울특별시", sigungu: "용산구", type: "재개발", stage: "사업시행인가", totalUnits: 2331, areaM2: 160258, lat: 37.5278, lng: 127.0062 },
      { name: "한남5구역", sido: "서울특별시", sigungu: "용산구", type: "재개발", stage: "관리처분인가", totalUnits: 1984, areaM2: 95000, lat: 37.5345, lng: 126.9968 },
      { name: "노량진1구역", sido: "서울특별시", sigungu: "동작구", type: "재개발", stage: "사업시행인가", totalUnits: 2992, areaM2: 132187, builder: "포스코이앤씨", lat: 37.5115, lng: 126.9452 },
      { name: "노량진3구역", sido: "서울특별시", sigungu: "동작구", type: "재개발", stage: "관리처분인가", totalUnits: 1803, areaM2: 88000, lat: 37.5132, lng: 126.9408 },
      { name: "노량진5구역", sido: "서울특별시", sigungu: "동작구", type: "재개발", stage: "조합설립인가", totalUnits: 1456, areaM2: 72000, lat: 37.5148, lng: 126.9485 },
      { name: "성수전략정비구역1지구", sido: "서울특별시", sigungu: "성동구", type: "재개발", stage: "조합설립인가", totalUnits: 3019, areaM2: 194398, lat: 37.5385, lng: 127.0438 },
      { name: "아현3구역", sido: "서울특별시", sigungu: "마포구", type: "재개발", stage: "이주철거", totalUnits: 2678, areaM2: 142000, builder: "현대건설", lat: 37.5555, lng: 126.9492 },
      { name: "북아현2구역", sido: "서울특별시", sigungu: "서대문구", type: "재개발", stage: "사업시행인가", totalUnits: 2320, areaM2: 124294, builder: "삼성물산", lat: 37.5595, lng: 126.9545 },
      { name: "효창공원앞역북측", sido: "서울특별시", sigungu: "용산구", type: "신속통합기획", stage: "정비구역지정", totalUnits: 1450, areaM2: 78000, lat: 37.5398, lng: 126.9614 },
      // 경기도
      { name: "광명11구역", sido: "경기도", sigungu: "광명시", type: "재개발", stage: "이주철거", totalUnits: 4291, areaM2: 198419, builder: "현대건설·HDC현대산업개발", lat: 37.4795, lng: 126.8552 },
      { name: "광명12구역", sido: "경기도", sigungu: "광명시", type: "재개발", stage: "관리처분인가", totalUnits: 2845, areaM2: 132000, lat: 37.4812, lng: 126.8598 },
      { name: "수원 팔달3구역", sido: "경기도", sigungu: "수원시", type: "재개발", stage: "사업시행인가", totalUnits: 3256, areaM2: 175000, lat: 37.2765, lng: 127.0145 },
      { name: "성남 수진1구역", sido: "경기도", sigungu: "성남시", type: "재개발", stage: "이주철거", totalUnits: 4082, areaM2: 218000, builder: "삼성물산", lat: 37.4312, lng: 127.1342 },
      // 인천
      { name: "송림4구역", sido: "인천광역시", sigungu: "동구", type: "재개발", stage: "사업시행인가", totalUnits: 1845, areaM2: 98000, lat: 37.4758, lng: 126.6523 },
      { name: "주안1구역", sido: "인천광역시", sigungu: "미추홀구", type: "재개발", stage: "조합설립인가", totalUnits: 2156, areaM2: 112000, lat: 37.4589, lng: 126.6748 },
      // 부산
      { name: "초량2구역", sido: "부산광역시", sigungu: "동구", type: "재개발", stage: "관리처분인가", totalUnits: 1423, areaM2: 72000, lat: 35.1265, lng: 129.0398 },
      { name: "남구 대연3구역", sido: "부산광역시", sigungu: "남구", type: "재개발", stage: "사업시행인가", totalUnits: 2048, areaM2: 108000, lat: 35.1368, lng: 129.0782 },
    ];

    return allZones.filter((z) => {
      if (params.sido && !z.sido.includes(params.sido)) return false;
      if (params.sigungu && !z.sigungu.includes(params.sigungu)) return false;
      if (params.type && z.type !== params.type) return false;
      if (params.stage && z.stage !== params.stage) return false;
      return true;
    });
  }

  private getMockBuildingInfo(): BuildingInfo[] {
    return [
      {
        buildingName: "청운트윈스빌A",
        builtYear: 2002,
        totalFloorAreaM2: 488.2,
        mainPurpose: "다세대주택",
        structure: "철근콘크리트구조",
        floors: 5,
        undergroundFloors: 1,
        buildingCoverageRatio: 58.4,
        floorAreaRatio: 198.2,
      },
      {
        buildingName: "라온팰리스",
        builtYear: 2018,
        totalFloorAreaM2: 892.5,
        mainPurpose: "연립주택",
        structure: "철근콘크리트구조",
        floors: 6,
        undergroundFloors: 1,
        buildingCoverageRatio: 55.2,
        floorAreaRatio: 245.1,
      },
    ];
  }
}

// ==================== 편의 함수 ====================

/**
 * 법정동 코드 테이블 (전국 주요 시군구)
 * 국토교통부 실거래가 API에서 LAWD_CD 파라미터로 사용
 */
export const REDEV_LAWD_CODES: Record<string, string> = {
  // 서울 25개 자치구
  "서울 성북구": "11290",
  "서울 용산구": "11170",
  "서울 동작구": "11590",
  "서울 성동구": "11200",
  "서울 서대문구": "11410",
  "서울 마포구": "11440",
  "서울 강북구": "11305",
  "서울 도봉구": "11320",
  "서울 노원구": "11350",
  "서울 중랑구": "11260",
  "서울 은평구": "11380",
  "서울 동대문구": "11230",
  "서울 강남구": "11680",
  "서울 서초구": "11650",
  "서울 송파구": "11710",
  "서울 강동구": "11740",
  "서울 영등포구": "11560",
  "서울 양천구": "11470",
  "서울 관악구": "11620",
  "서울 구로구": "11530",
  "서울 금천구": "11545",
  "서울 강서구": "11500",
  "서울 광진구": "11215",
  "서울 종로구": "11110",
  "서울 중구": "11140",
  // 경기 주요
  "경기 광명시": "41210",
  "경기 수원시": "41110",
  "경기 성남시": "41130",
  "경기 안양시": "41170",
  "경기 고양시": "41280",
  "경기 용인시": "41460",
  "경기 부천시": "41190",
  "경기 남양주시": "41360",
  "경기 하남시": "41450",
  "경기 구리시": "41310",
  "경기 안산시": "41270",
  "경기 화성시": "41590",
  // 인천
  "인천 미추홀구": "28177",
  "인천 동구": "28140",
  "인천 부평구": "28237",
  // 부산
  "부산 동구": "26110",
  "부산 서구": "26140",
  "부산 남구": "26290",
  "부산 수영구": "26410",
};

import { findLawdCode } from "./publicDataApi";

/**
 * 구역 주소로부터 법정동 코드를 추론 (전국 지자체 주소 전면 지원)
 */
export function getLawdCodeFromAddress(address: string): string | null {
  const match = findLawdCode(address);
  if (match) return match.code;

  for (const [region, code] of Object.entries(REDEV_LAWD_CODES)) {
    const parts = region.split(" ");
    if (parts.every((p) => address.includes(p))) return code;
  }
  return null;
}

/** API 서비스 싱글톤 인스턴스 */
export const publicRedevelopmentApi = new PublicRedevelopmentApiService();
