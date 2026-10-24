import { NATIONWIDE_REDEVELOPMENT_DATA } from "./nationwideZones";
import { NATIONWIDE_EXTRA_DATA } from "./nationwideZonesExtra";
import masterZonesRaw from "./redevelopment-master.json";

export interface RedevelopmentStage {
  name: string;
  isCompleted: boolean;
  isCurrent: boolean;
  date?: string;
  description?: string;
  monthsInProgress?: number;
  medianMonths?: number;
}

export interface RedevelopmentTransaction {
  id: string;
  date: string;
  type: "다세대" | "단독" | "다가구" | "아파트" | "상가";
  builtYear: number;
  addressDetail: string;
  floor?: string;
  tradePriceManwon: number;
  tradePriceDisplay: string;
  officialPriceManwon?: number;
  officialPriceDisplay?: string;
  landPyeong: number;        // 대지지분 (평)
  exclusivePyeong: number;   // 전용면적 (평)
  landPricePerPyeongManwon: number; // 대지지분 평당가 (만원/평)
  isCanceled?: boolean;
}

export interface RedevelopmentNotice {
  id: string;
  title: string;
  org: string;
  date: string;
  type: "고시" | "공고" | "보도자료" | "결재문서" | "입찰공고";
  contentSnippet?: string;
  isNew?: boolean;
  link?: string;
}

// 공급 계획 타입별 세대수
export interface SupplyPlanRow {
  typeRange: string;
  salesUnits: number;
  rentalUnits: number;
}

// 구역현황 (노후도 등)
export interface ZoneStatus {
  totalBuildings: number;
  deterioratedBuildings: number;
  deteriorationRate: number;
  avgBuildingAge: number;
  singleHouseCount: number;
  villaCount: number;
  commercialCount: number;
}

// 토지면적 분류
export interface LandAreaStats {
  byType: { label: string; areaM2: number; ratio: number }[];
  byUse: { label: string; areaM2: number; ratio: number }[];
  byOwner: { label: string; areaM2: number; ratio: number }[];
}

// 토지거래허가구역
export interface LandPermitInfo {
  apartment: boolean | "예정";
  villa: boolean | "예정";
  land: boolean | "예정";
  apartmentExpiry?: string;
  landStartDate?: string;
}

// 규제지역
export interface RegulationInfo {
  adjustedArea: boolean;
  overheatedArea: boolean;
  speculativeArea: boolean;
  priceCapped: boolean;
}

// 인근 구역 비교
export interface NearbyZone {
  name: string;
  status: string;
  totalUnits: number;
  generalUnits?: number;
  generalRatio: number;
  recentPriceDisplay: string;
  pricePerPyeongManwon?: number; // 대지지분 평당가 (만원/평)
  distance: string;
  areaManM2?: string;           // 사업 면적 (예: "7.8만㎡")
  type?: string;                // 사업종류 (예: "재개발", "신통기획", "모아타운")
  deteriorationRate?: number;   // 노후도 (%)
  askCount?: number;            // 매물 수
}

// 인근 아파트
export interface NearbyApartment {
  name: string;
  address: string;
  completedYear: number;
  totalUnits: number;
  recentPriceDisplay: string;
  distance: string;
}

// 학군
export interface SchoolInfo {
  name: string;
  type: "초등학교" | "중학교" | "고등학교";
  distance: string;
  walkMinutes: number;
  rating?: string;
}

// 대중교통
export interface TransitInfo {
  type: "지하철" | "버스";
  name: string;
  line?: string;
  distance: string;
  walkMinutes: number;
}

// FAQ
export interface FaqItem {
  question: string;
  answer: string;
  detail?: string;
}

// 종교/학교 시설
export interface FacilityInfo {
  name: string;
  type: "교회" | "성당" | "절" | "학교" | "기타";
  address?: string;
}

export interface RedevelopmentCalcMetrics {
  estimatedProportionRate: number; // 추정 비례율 (%) 예: 105
  avgOfficialPriceRatio: number;   // 공시가격 대비 감정평가율 (%) 예: 130
  unionPrice59Manwon: number;      // 59㎡ (25평형) 조합원 분양가 (만원) 예: 65000 (6.5억)
  unionPrice84Manwon: number;      // 84㎡ (34평형) 조합원 분양가 (만원) 예: 88000 (8.8억)
  generalPrice59Manwon: number;    // 59㎡ 일반 분양가 (만원) 예: 85000 (8.5억)
  generalPrice84Manwon: number;    // 84㎡ 일반 분양가 (만원) 예: 115000 (11.5억)
  expectedNewAptPrice84Manwon: number; // 입주 시점 예상 시세 (만원) 예: 150000 (15억)
}

export interface RedevelopmentZone {
  id: string;
  name: string;
  type: "재개발" | "재건축" | "신속통합기획" | "모아타운" | "공공재개발";
  status:
    | "기본계획수립"
    | "정비구역지정"
    | "추진위원회승인"
    | "조합설립인가"
    | "건축심의"
    | "사업시행인가"
    | "관리처분인가"
    | "이주철거"
    | "착공"
    | "일반분양"
    | "준공";
  statusDate: string;
  region: string;
  district: string;
  address: string;
  lat: number;
  lng: number;

  // 구역 실제 폴리곤 경계선 좌표 (위도/경도 배열)
  polygon: { lat: number; lng: number }[];

  // 사업성 핵심 지표
  totalUnits: number;          // 계획 총 세대수
  ownersCount: number;         // 조합원(토지등소유자) 수
  generalUnits: number;        // 일반분양 세대수
  rentalUnits: number;         // 임대 세대수
  generalRatio: number;        // 일반분양 비율 (%)
  builder: string;             // 시공사

  // 구역 물리 지표
  zoneAreaM2: number;
  far: number;                 // 용적률 (%)
  bcr: number;                 // 건폐율 (%)
  maxFloor: number;            // 최고 층수
  totalBuildings: number;      // 동수

  // 실거래 지표
  recentTradePriceDisplay: string;
  avgLandPricePerPyeongManwon: number;
  pricePerPyeongByAge: {
    villaUnder10Year?: number;
    villa11To30Year?: number;
    villaOver30Year?: number;
    singleHouse?: number;
  };

  // 매물 및 투자 지표
  askCount: number;
  auctionCount?: number;
  communityCount?: number;
  minPriceDisplay: string;
  minInvestmentDisplay: string;
  estimatedPremiumDisplay: string;

  // 투자 수익률 및 분담금 계산용 메트릭스
  calcMetrics: RedevelopmentCalcMetrics;

  // 공급 계획 타입별
  supplyPlan?: SupplyPlanRow[];

  // 구역현황/노후도
  zoneStatus?: ZoneStatus;

  // 토지면적 통계
  landAreaStats?: LandAreaStats;

  // 토지거래허가구역
  landPermit?: LandPermitInfo;

  // 규제지역
  regulation?: RegulationInfo;

  // 타임라인 단계
  stages: RedevelopmentStage[];

  // 실거래 목록
  transactions: RedevelopmentTransaction[];

  // 고시공고/자료실
  notices: RedevelopmentNotice[];
  documents?: { title: string; url?: string; type: "link" | "file" }[];

  // 인근 구역 비교
  nearbyZones?: NearbyZone[];

  // 인근 아파트
  nearbyApartments?: NearbyApartment[];

  // 학군
  schools?: SchoolInfo[];

  // 대중교통
  transit?: TransitInfo[];

  // 종교/학교 시설
  facilities?: FacilityInfo[];

  // FAQ
  faq?: FaqItem[];

  // 인근 지하철역
  nearestStation: string;
  walkMinutes: number;

  // 개발여건 설명
  developmentConditions?: string;

  // 추진주체
  unionOfficeAddress?: string;
  unionPhone?: string;
}

export const REDEVELOPMENT_STAGES_ORDER = [
  "기본계획수립",
  "정비구역지정",
  "추진위원회승인",
  "조합설립인가",
  "건축심의",
  "사업시행인가",
  "관리처분인가",
  "이주철거",
  "착공",
  "일반분양",
  "준공",
] as const;

export const REDEVELOPMENT_DATA: RedevelopmentZone[] = [
  {
    id: "jangwi-14",
    name: "장위14구역",
    type: "재개발",
    status: "건축심의",
    statusDate: "2024.04.18",
    region: "서울",
    district: "성북구",
    address: "서울특별시 성북구 장위동 233-336 일대",
    lat: 37.612896,
    lng: 127.04378,
    polygon: [
      { lat: 37.6152, lng: 127.0415 },
      { lat: 37.6158, lng: 127.0448 },
      { lat: 37.6142, lng: 127.0472 },
      { lat: 37.6115, lng: 127.0465 },
      { lat: 37.6105, lng: 127.0432 },
      { lat: 37.6121, lng: 127.0408 },
    ],
    totalUnits: 2846,
    ownersCount: 1427,
    generalUnits: 880,
    rentalUnits: 539,
    generalRatio: 31,
    builder: "SK에코플랜트 · HDC현대산업개발",
    zoneAreaM2: 145000,
    far: 245,
    bcr: 19,
    maxFloor: 33,
    totalBuildings: 25,
    recentTradePriceDisplay: "7.5억",
    avgLandPricePerPyeongManwon: 8750,
    pricePerPyeongByAge: {
      villaUnder10Year: undefined,
      villa11To30Year: 9508,
      villaOver30Year: 9218,
      singleHouse: 2504,
    },
    askCount: 58,
    auctionCount: 0,
    communityCount: 23,
    minPriceDisplay: "5.5억",
    minInvestmentDisplay: "3.8억",
    estimatedPremiumDisplay: "2.3억~2.8억",
    calcMetrics: {
      estimatedProportionRate: 104,
      avgOfficialPriceRatio: 130,
      unionPrice59Manwon: 54000,
      unionPrice84Manwon: 72000,
      generalPrice59Manwon: 76000,
      generalPrice84Manwon: 102000,
      expectedNewAptPrice84Manwon: 130000,
    },
    supplyPlan: [
      { typeRange: "~40㎡", salesUnits: 99, rentalUnits: 148 },
      { typeRange: "40~50㎡", salesUnits: 106, rentalUnits: 158 },
      { typeRange: "50~60㎡", salesUnits: 715, rentalUnits: 118 },
      { typeRange: "60~85㎡", salesUnits: 1268, rentalUnits: 115 },
      { typeRange: "85㎡~", salesUnits: 119, rentalUnits: 0 },
    ],
    zoneStatus: {
      totalBuildings: 1089,
      deterioratedBuildings: 920,
      deteriorationRate: 84.5,
      avgBuildingAge: 38,
      singleHouseCount: 312,
      villaCount: 688,
      commercialCount: 89,
    },
    landAreaStats: {
      byType: [
        { label: "대지", areaM2: 118430, ratio: 81.6 },
        { label: "도로", areaM2: 18250, ratio: 12.6 },
        { label: "공원·녹지", areaM2: 5820, ratio: 4.0 },
        { label: "기타", areaM2: 2675, ratio: 1.8 },
      ],
      byUse: [
        { label: "주거지역", areaM2: 125800, ratio: 86.7 },
        { label: "상업지역", areaM2: 8200, ratio: 5.6 },
        { label: "도로", areaM2: 11175, ratio: 7.7 },
      ],
      byOwner: [
        { label: "개인 소유", areaM2: 130650, ratio: 90.0 },
        { label: "법인 소유", areaM2: 8700, ratio: 6.0 },
        { label: "국·공유지", areaM2: 5825, ratio: 4.0 },
      ],
    },
    landPermit: {
      apartment: true,
      villa: false,
      land: "예정",
      apartmentExpiry: "~26.12.31",
      landStartDate: "26.10.17~",
    },
    regulation: {
      adjustedArea: true,
      overheatedArea: true,
      speculativeArea: false,
      priceCapped: false,
    },
    nearestStation: "상월곡역 (6호선)",
    walkMinutes: 8,
    developmentConditions: "장위14구역은 서울 성북구 장위동에 위치한 재정비촉진구역으로, 6호선 상월곡역과 월계역 사이의 역세권에 인접해 있습니다. 인근에 석관초·중고등학교가 밀집해 있어 학군 여건이 양호하며, 장위뉴타운 내 여러 구역과 함께 개발되어 인프라 공동 혜택이 기대됩니다. SK에코플랜트·HDC현산이 시공을 맡아 프리미엄 브랜드 아파트로 변모할 예정입니다.",
    unionOfficeAddress: "서울특별시 성북구 돌곶이로 151, 4층 (장위동)",
    unionPhone: "02-000-0000",
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2008.04.03" },
      { name: "추진위원회승인", isCompleted: true, isCurrent: false, date: "2008.05.30" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2010.05.26" },
      { name: "시공사선정", isCompleted: true, isCurrent: false, date: "2010.07.11", description: "SK에코플랜트 · HDC현대산업개발" },
      { name: "건축심의", isCompleted: true, isCurrent: true, date: "2026.03.26", description: "재정비촉진계획 변경 결정 및 지형도면 고시" },
      { name: "사업시행인가", isCompleted: false, isCurrent: false, monthsInProgress: 196, medianMonths: 36, description: "196개월째 진행 중 (중앙값 36개월)" },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "준공 (예상)", isCompleted: false, isCurrent: false, description: "2034년 예상" },
    ],
    transactions: [
      {
        id: "tx-jw14-1",
        date: "2026.09.17",
        type: "단독",
        builtYear: 1973,
        addressDetail: "장위동 231-454",
        tradePriceManwon: 75000,
        tradePriceDisplay: "7.5억",
        officialPriceManwon: 25500,
        officialPriceDisplay: "2.55억",
        landPyeong: 29.95,
        exclusivePyeong: 18.02,
        landPricePerPyeongManwon: 2504,
      },
      {
        id: "tx-jw14-2",
        date: "2026.09.17",
        type: "다세대",
        builtYear: 2002,
        addressDetail: "청운트윈스빌A동 3층",
        floor: "3층",
        tradePriceManwon: 67000,
        tradePriceDisplay: "6.7억",
        officialPriceManwon: 21900,
        officialPriceDisplay: "2.19억",
        landPyeong: 7.99,
        exclusivePyeong: 16.7,
        landPricePerPyeongManwon: 8387,
      },
      {
        id: "tx-jw14-3",
        date: "2026.09.08",
        type: "다세대",
        builtYear: 1979,
        addressDetail: "장위동 233-173 1층",
        floor: "1층",
        tradePriceManwon: 66000,
        tradePriceDisplay: "6.6억",
        officialPriceManwon: 17200,
        officialPriceDisplay: "1.72억",
        landPyeong: 7.86,
        exclusivePyeong: 8.61,
        landPricePerPyeongManwon: 8392,
        isCanceled: true,
      },
      {
        id: "tx-jw14-4",
        date: "2026.08.10",
        type: "다세대",
        builtYear: 2002,
        addressDetail: "토암쉐르빌 2층",
        floor: "2층",
        tradePriceManwon: 61500,
        tradePriceDisplay: "6.15억",
        officialPriceManwon: 18800,
        officialPriceDisplay: "1.88억",
        landPyeong: 6.49,
        exclusivePyeong: 13.52,
        landPricePerPyeongManwon: 9478,
      },
      {
        id: "tx-jw14-5",
        date: "2026.08.08",
        type: "다세대",
        builtYear: 1979,
        addressDetail: "장위동 233-173 1층",
        floor: "1층",
        tradePriceManwon: 66000,
        tradePriceDisplay: "6.6억",
        officialPriceManwon: 17800,
        officialPriceDisplay: "1.78억",
        landPyeong: 7.86,
        exclusivePyeong: 10.89,
        landPricePerPyeongManwon: 8392,
      },
      {
        id: "tx-jw14-6",
        date: "2026.07.25",
        type: "다세대",
        builtYear: 2003,
        addressDetail: "장위동 232-15 4층",
        floor: "4층",
        tradePriceManwon: 58000,
        tradePriceDisplay: "5.8억",
        officialPriceManwon: 16500,
        officialPriceDisplay: "1.65억",
        landPyeong: 6.82,
        exclusivePyeong: 12.4,
        landPricePerPyeongManwon: 8504,
      },
      {
        id: "tx-jw14-7",
        date: "2026.07.12",
        type: "단독",
        builtYear: 1982,
        addressDetail: "장위동 231-102",
        tradePriceManwon: 92000,
        tradePriceDisplay: "9.2억",
        officialPriceManwon: 34000,
        officialPriceDisplay: "3.4억",
        landPyeong: 38.5,
        exclusivePyeong: 24.1,
        landPricePerPyeongManwon: 2390,
      },
      {
        id: "tx-jw14-8",
        date: "2026.06.30",
        type: "다세대",
        builtYear: 1995,
        addressDetail: "한성빌라 2층",
        floor: "2층",
        tradePriceManwon: 63000,
        tradePriceDisplay: "6.3억",
        officialPriceManwon: 18200,
        officialPriceDisplay: "1.82억",
        landPyeong: 7.15,
        exclusivePyeong: 14.8,
        landPricePerPyeongManwon: 8811,
      },
      {
        id: "tx-jw14-9",
        date: "2026.06.18",
        type: "다세대",
        builtYear: 2018,
        addressDetail: "라온팰리스 3층",
        floor: "3층",
        tradePriceManwon: 71000,
        tradePriceDisplay: "7.1억",
        officialPriceManwon: 24000,
        officialPriceDisplay: "2.4억",
        landPyeong: 7.42,
        exclusivePyeong: 15.3,
        landPricePerPyeongManwon: 9568,
      },
      {
        id: "tx-jw14-10",
        date: "2026.05.28",
        type: "다세대",
        builtYear: 1991,
        addressDetail: "장위동 233-88 1층",
        floor: "1층",
        tradePriceManwon: 59000,
        tradePriceDisplay: "5.9억",
        officialPriceManwon: 15900,
        officialPriceDisplay: "1.59억",
        landPyeong: 6.95,
        exclusivePyeong: 11.2,
        landPricePerPyeongManwon: 8489,
      },
      {
        id: "tx-jw14-11",
        date: "2026.05.15",
        type: "단독",
        builtYear: 1978,
        addressDetail: "장위동 231-501",
        tradePriceManwon: 85000,
        tradePriceDisplay: "8.5억",
        officialPriceManwon: 29500,
        officialPriceDisplay: "2.95억",
        landPyeong: 33.2,
        exclusivePyeong: 21.0,
        landPricePerPyeongManwon: 2560,
      },
      {
        id: "tx-jw14-12",
        date: "2026.04.22",
        type: "다세대",
        builtYear: 2004,
        addressDetail: "대명빌라 B동 2층",
        floor: "2층",
        tradePriceManwon: 65000,
        tradePriceDisplay: "6.5억",
        officialPriceManwon: 19800,
        officialPriceDisplay: "1.98억",
        landPyeong: 7.3,
        exclusivePyeong: 13.9,
        landPricePerPyeongManwon: 8904,
      },
      {
        id: "tx-jw14-13",
        date: "2026.03.30",
        type: "다세대",
        builtYear: 1988,
        addressDetail: "장위동 232-44 3층",
        floor: "3층",
        tradePriceManwon: 62000,
        tradePriceDisplay: "6.2억",
        officialPriceManwon: 17500,
        officialPriceDisplay: "1.75억",
        landPyeong: 7.05,
        exclusivePyeong: 12.1,
        landPricePerPyeongManwon: 8794,
      },
      {
        id: "tx-jw14-14",
        date: "2026.03.11",
        type: "다세대",
        builtYear: 2001,
        addressDetail: "성지아트빌 4층",
        floor: "4층",
        tradePriceManwon: 68000,
        tradePriceDisplay: "6.8억",
        officialPriceManwon: 22100,
        officialPriceDisplay: "2.21억",
        landPyeong: 7.8,
        exclusivePyeong: 16.2,
        landPricePerPyeongManwon: 8717,
      },
    ],
    notices: [
      {
        id: "nt-jw14-1",
        title: "통합심의 신청에 따른 업무 협의",
        org: "서울시 성북구 결재문서",
        date: "2026.10.06",
        type: "결재문서",
        isNew: true,
      },
      {
        id: "nt-jw14-2",
        title: "환경영향평가(초안) 공람 및 주민설명회 개최 공고",
        org: "서울시 성북구 공고",
        date: "2026.08.06",
        type: "공고",
      },
      {
        id: "nt-jw14-3",
        title: "재정비촉진계획 변경 결정 및 지형도면 고시",
        org: "서울시 고시",
        date: "2026.03.26",
        type: "고시",
      },
      {
        id: "nt-jw14-4",
        title: "재정비촉진(변경)계획(안) (재)공람 공고",
        org: "서울시 성북구 공고",
        date: "2026.01.22",
        type: "공고",
      },
      {
        id: "nt-jw14-5",
        title: "장위14구역, 2,846세대 공급 '청신호' … 규제철폐36호 적용",
        org: "서울시 보도자료",
        date: "2025.12.21",
        type: "보도자료",
      },
      {
        id: "nt-jw14-6",
        title: "서울시, 장위14구역 등 건축심의 통과…총 3,561세대 공급",
        org: "서울시 보도자료",
        date: "2023.11.29",
        type: "보도자료",
      },
    ],
    documents: [
      { title: "정비사업 정보몽땅", url: "https://cleanup.seoul.go.kr", type: "link" },
      { title: "재정비촉진계획 변경 결정 및 지형도면 고시.pdf", type: "file" },
    ],
    nearbyZones: [
      {
        name: "장위1구역",
        status: "관리처분인가",
        type: "재개발",
        areaManM2: "8.2만㎡",
        totalUnits: 1845,
        generalUnits: 516,
        generalRatio: 28,
        recentPriceDisplay: "9.2억",
        pricePerPyeongManwon: 9200,
        deteriorationRate: 86,
        askCount: 32,
        distance: "0.5km",
      },
      {
        name: "장위4구역",
        status: "착공",
        type: "재개발",
        areaManM2: "15.3만㎡",
        totalUnits: 2840,
        generalUnits: 937,
        generalRatio: 33,
        recentPriceDisplay: "8.8억",
        pricePerPyeongManwon: 8800,
        deteriorationRate: 88,
        askCount: 45,
        distance: "0.7km",
      },
      {
        name: "장위6구역",
        status: "사업시행인가",
        type: "재개발",
        areaManM2: "6.9만㎡",
        totalUnits: 1302,
        generalUnits: 338,
        generalRatio: 26,
        recentPriceDisplay: "8.1억",
        pricePerPyeongManwon: 8100,
        deteriorationRate: 81,
        askCount: 28,
        distance: "0.9km",
      },
      {
        name: "장위7구역",
        status: "건축심의",
        type: "재개발",
        areaManM2: "7.5만㎡",
        totalUnits: 1553,
        generalUnits: 450,
        generalRatio: 29,
        recentPriceDisplay: "8.5억",
        pricePerPyeongManwon: 8500,
        deteriorationRate: 83,
        askCount: 39,
        distance: "1.1km",
      },
      {
        name: "장위10구역",
        status: "이주/철거",
        type: "재개발",
        areaManM2: "9.4만㎡",
        totalUnits: 2004,
        generalUnits: 841,
        generalRatio: 42,
        recentPriceDisplay: "9.5억",
        pricePerPyeongManwon: 9500,
        deteriorationRate: 89,
        askCount: 18,
        distance: "1.3km",
      },
      {
        name: "장위15구역",
        status: "조합설립인가",
        type: "재개발",
        areaManM2: "18.9만㎡",
        totalUnits: 3200,
        generalUnits: 1100,
        generalRatio: 34,
        recentPriceDisplay: "7.6억",
        pricePerPyeongManwon: 7600,
        deteriorationRate: 78,
        askCount: 52,
        distance: "1.5km",
      },
    ],
    nearbyApartments: [
      { name: "꿈의숲아이파크", address: "장위동 44", completedYear: 2018, totalUnits: 1056, recentPriceDisplay: "11.5억", distance: "0.8km" },
      { name: "장위자이레디언트", address: "장위동 116", completedYear: 2022, totalUnits: 1806, recentPriceDisplay: "13.2억", distance: "1.2km" },
      { name: "래미안장위퍼스트하이", address: "장위동 25", completedYear: 2020, totalUnits: 2840, recentPriceDisplay: "12.8억", distance: "1.5km" },
      { name: "석관두산위브", address: "석관동 108", completedYear: 2010, totalUnits: 1342, recentPriceDisplay: "9.8억", distance: "1.7km" },
    ],
    schools: [
      { name: "장위초등학교", type: "초등학교", distance: "350m", walkMinutes: 5 },
      { name: "석관초등학교", type: "초등학교", distance: "600m", walkMinutes: 8 },
      { name: "석관중학교", type: "중학교", distance: "450m", walkMinutes: 6 },
      { name: "석관고등학교", type: "고등학교", distance: "500m", walkMinutes: 7 },
    ],
    transit: [
      { type: "지하철", name: "상월곡역", line: "6호선", distance: "650m", walkMinutes: 8 },
      { type: "지하철", name: "월계역", line: "1호선", distance: "950m", walkMinutes: 12 },
      { type: "버스", name: "장위3동주민센터", distance: "120m", walkMinutes: 2 },
      { type: "버스", name: "장위동경남아파트", distance: "200m", walkMinutes: 3 },
    ],
    facilities: [
      { name: "장위동성당", type: "성당", address: "장위동 102" },
      { name: "석관교회", type: "교회", address: "석관동 88" },
      { name: "장위초등학교", type: "학교", address: "장위동 280" },
    ],
    faq: [
      {
        question: "언제쯤 입주할 수 있나요?",
        answer: "2034년 예상 (약 7년 후)",
        detail: "현재 사업시행인가 단계로, 이후 관리처분인가, 이주·철거, 착공을 거쳐야 합니다. 통상적으로 건축심의 이후 입주까지 8~10년 소요됩니다.",
      },
      {
        question: "매수 시 실거주 의무가 있나요?",
        answer: "없음 (갭투자 가능)",
        detail: "조정대상지역에서는 일부 제한이 있을 수 있으나, 재개발 구역 내 주택 매수 후 관리처분인가 이전에는 갭투자(전세 레버리지)가 가능합니다.",
      },
      {
        question: "조합원 지위 양도가 가능한가요?",
        answer: "가능 (관리처분인가 전까지)",
        detail: "정비사업의 경우 관리처분인가 이후에는 조합원 지위 양도가 제한됩니다. 현재 건축심의 단계이므로 양도가 가능합니다.",
      },
    ],
  },

  {
    id: "hannam-3",
    name: "한남3구역",
    type: "재개발",
    status: "이주철거",
    statusDate: "2023.10.30",
    region: "서울",
    district: "용산구",
    address: "서울특별시 용산구 한남동 686 일대",
    lat: 37.5312,
    lng: 127.0015,
    polygon: [
      { lat: 37.5358, lng: 126.9975 },
      { lat: 37.5365, lng: 127.0052 },
      { lat: 37.5322, lng: 127.0085 },
      { lat: 37.5281, lng: 127.0042 },
      { lat: 37.5275, lng: 126.9985 },
      { lat: 37.5308, lng: 126.9958 },
    ],
    totalUnits: 5816,
    ownersCount: 3880,
    generalUnits: 1060,
    rentalUnits: 876,
    generalRatio: 18,
    builder: "현대건설 (디에이치 한남)",
    zoneAreaM2: 386395,
    far: 232,
    bcr: 42,
    maxFloor: 22,
    totalBuildings: 197,
    recentTradePriceDisplay: "23.5억",
    avgLandPricePerPyeongManwon: 16500,
    pricePerPyeongByAge: {
      villaUnder10Year: undefined,
      villa11To30Year: 17200,
      villaOver30Year: 16100,
      singleHouse: 8200,
    },
    askCount: 84,
    minPriceDisplay: "18.5억",
    minInvestmentDisplay: "15.2억",
    estimatedPremiumDisplay: "11.5억~13억",
    calcMetrics: {
      estimatedProportionRate: 110,
      avgOfficialPriceRatio: 140,
      unionPrice59Manwon: 115000,
      unionPrice84Manwon: 154000,
      generalPrice59Manwon: 168000,
      generalPrice84Manwon: 225000,
      expectedNewAptPrice84Manwon: 320000,
    },
    nearestStation: "이태원역 (6호선) · 한남역",
    walkMinutes: 7,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2009.10.01" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2012.09.04" },
      { name: "건축심의", isCompleted: true, isCurrent: false, date: "2017.10.24" },
      { name: "사업시행인가", isCompleted: true, isCurrent: false, date: "2019.03.29" },
      { name: "관리처분인가", isCompleted: true, isCurrent: false, date: "2023.06.23" },
      { name: "이주철거", isCompleted: true, isCurrent: true, date: "2023.10.30", description: "이주율 95% 달성, 철거 준비 중" },
      { name: "착공", isCompleted: false, isCurrent: false, description: "2025년 착공 예정" },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-hn3-1",
        date: "2026.09.28",
        type: "다세대",
        builtYear: 1998,
        addressDetail: "보광동 265 2층",
        floor: "2층",
        tradePriceManwon: 195000,
        tradePriceDisplay: "19.5억",
        officialPriceManwon: 68000,
        officialPriceDisplay: "6.8억",
        landPyeong: 11.2,
        exclusivePyeong: 18.5,
        landPricePerPyeongManwon: 17410,
      },
      {
        id: "tx-hn3-2",
        date: "2026.08.20",
        type: "단독",
        builtYear: 1977,
        addressDetail: "한남동 686-21",
        tradePriceManwon: 285000,
        tradePriceDisplay: "28.5억",
        officialPriceManwon: 125000,
        officialPriceDisplay: "12.5억",
        landPyeong: 34.5,
        exclusivePyeong: 28.1,
        landPricePerPyeongManwon: 8260,
      },
    ],
    notices: [
      {
        id: "nt-hn3-1",
        title: "한남3구역 주택재개발사업 관리처분계획 변경인가 고시",
        org: "서울시 용산구 고시",
        date: "2024.05.10",
        type: "고시",
      },
    ],
  },
  {
    id: "hannam-4",
    name: "한남4구역",
    type: "재개발",
    status: "사업시행인가",
    statusDate: "2024.02.27",
    region: "서울",
    district: "용산구",
    address: "서울특별시 용산구 보광동 360 일대",
    lat: 37.5278,
    lng: 127.0062,
    polygon: [
      { lat: 37.5312, lng: 127.0035 },
      { lat: 37.5318, lng: 127.0095 },
      { lat: 37.5272, lng: 127.0112 },
      { lat: 37.5245, lng: 127.0065 },
      { lat: 37.5265, lng: 127.0028 },
    ],
    totalUnits: 2331,
    ownersCount: 1166,
    generalUnits: 815,
    rentalUnits: 350,
    generalRatio: 35,
    builder: "시공사 선정 중 (삼성물산 vs 현대건설 경쟁)",
    zoneAreaM2: 160258,
    far: 226,
    bcr: 31,
    maxFloor: 22,
    totalBuildings: 51,
    recentTradePriceDisplay: "17.8억",
    avgLandPricePerPyeongManwon: 15800,
    pricePerPyeongByAge: {
      villa11To30Year: 16400,
      villaOver30Year: 15200,
      singleHouse: 7800,
    },
    askCount: 42,
    minPriceDisplay: "14.5억",
    minInvestmentDisplay: "12.1억",
    estimatedPremiumDisplay: "9.2억~11억",
    calcMetrics: {
      estimatedProportionRate: 108,
      avgOfficialPriceRatio: 135,
      unionPrice59Manwon: 108000,
      unionPrice84Manwon: 146000,
      generalPrice59Manwon: 155000,
      generalPrice84Manwon: 210000,
      expectedNewAptPrice84Manwon: 290000,
    },
    nearestStation: "서빙고역 (경의중앙) · 이태원역",
    walkMinutes: 10,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2009.10.01" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2015.01.06" },
      { name: "건축심의", isCompleted: true, isCurrent: false, date: "2023.01.17" },
      { name: "사업시행인가", isCompleted: true, isCurrent: true, date: "2024.02.27", description: "2024년 시공사 선정 및 감평 절차" },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-hn4-1",
        date: "2026.09.11",
        type: "다세대",
        builtYear: 1995,
        addressDetail: "보광동 362-10 1층",
        tradePriceManwon: 168000,
        tradePriceDisplay: "16.8억",
        officialPriceManwon: 54000,
        officialPriceDisplay: "5.4억",
        landPyeong: 10.4,
        exclusivePyeong: 15.2,
        landPricePerPyeongManwon: 16153,
      },
    ],
    notices: [
      {
        id: "nt-hn4-1",
        title: "한남4재정비촉진구역 사업시행계획인가 고시",
        org: "서울시 용산구 고시",
        date: "2024.02.28",
        type: "고시",
      },
    ],
  },
  {
    id: "noryangjin-1",
    name: "노량진1구역",
    type: "재개발",
    status: "사업시행인가",
    statusDate: "2022.03.11",
    region: "서울",
    district: "동작구",
    address: "서울특별시 동작구 노량진동 278-2 일대",
    lat: 37.5115,
    lng: 126.9452,
    polygon: [
      { lat: 37.5142, lng: 126.9418 },
      { lat: 37.5148, lng: 126.9485 },
      { lat: 37.5098, lng: 126.9492 },
      { lat: 37.5085, lng: 126.9435 },
      { lat: 37.5108, lng: 126.9405 },
    ],
    totalUnits: 2992,
    ownersCount: 1018,
    generalUnits: 1435,
    rentalUnits: 539,
    generalRatio: 48,
    builder: "포스코이앤씨 (오티에르 노량진)",
    zoneAreaM2: 132187,
    far: 265,
    bcr: 22,
    maxFloor: 33,
    totalBuildings: 28,
    recentTradePriceDisplay: "13.2억",
    avgLandPricePerPyeongManwon: 11200,
    pricePerPyeongByAge: {
      villa11To30Year: 12100,
      villaOver30Year: 11500,
      singleHouse: 4600,
    },
    askCount: 65,
    minPriceDisplay: "10.8억",
    minInvestmentDisplay: "8.5억",
    estimatedPremiumDisplay: "6.5억~7.5억",
    calcMetrics: {
      estimatedProportionRate: 112,
      avgOfficialPriceRatio: 135,
      unionPrice59Manwon: 78000,
      unionPrice84Manwon: 102000,
      generalPrice59Manwon: 115000,
      generalPrice84Manwon: 152000,
      expectedNewAptPrice84Manwon: 210000,
    },
    nearestStation: "노량진역 (1·9호선)",
    walkMinutes: 5,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2009.12.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2017.11.03" },
      { name: "건축심의", isCompleted: true, isCurrent: false, date: "2020.08.18" },
      { name: "사업시행인가", isCompleted: true, isCurrent: true, date: "2022.03.11", description: "포스코이앤씨 시공사 선정 완료, 관리처분 준비" },
      { name: "관리처분인가", isCompleted: false, isCurrent: false, description: "2025년 총회 예정" },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-nr1-1",
        date: "2026.09.21",
        type: "다세대",
        builtYear: 1999,
        addressDetail: "노량진동 285-12 2층",
        tradePriceManwon: 128000,
        tradePriceDisplay: "12.8억",
        officialPriceManwon: 41000,
        officialPriceDisplay: "4.1억",
        landPyeong: 10.8,
        exclusivePyeong: 17.1,
        landPricePerPyeongManwon: 11851,
      },
    ],
    notices: [
      {
        id: "nt-nr1-1",
        title: "노량진1구역 시공사 선정 입찰 결과 및 사업설명회 안내",
        org: "동작구청 공고",
        date: "2024.04.30",
        type: "공고",
      },
    ],
  },
  {
    id: "seongsu-1",
    name: "성수전략정비구역 1지구",
    type: "재개발",
    status: "조합설립인가",
    statusDate: "2017.07.25",
    region: "서울",
    district: "성동구",
    address: "서울특별시 성동구 성수동1가 72-10 일대",
    lat: 37.5385,
    lng: 127.0438,
    polygon: [
      { lat: 37.5415, lng: 127.0395 },
      { lat: 37.5422, lng: 127.0475 },
      { lat: 37.5365, lng: 127.0488 },
      { lat: 37.5345, lng: 127.0425 },
      { lat: 37.5372, lng: 127.0382 },
    ],
    totalUnits: 3019,
    ownersCount: 1379,
    generalUnits: 1150,
    rentalUnits: 490,
    generalRatio: 38,
    builder: "시공사 미정 (초고층 70층 정비계획 변경 추진)",
    zoneAreaM2: 194398,
    far: 314,
    bcr: 20,
    maxFloor: 70,
    totalBuildings: 18,
    recentTradePriceDisplay: "26.5억",
    avgLandPricePerPyeongManwon: 19800,
    pricePerPyeongByAge: {
      villa11To30Year: 21000,
      villaOver30Year: 19500,
      singleHouse: 11000,
    },
    askCount: 38,
    minPriceDisplay: "22.0억",
    minInvestmentDisplay: "19.0억",
    estimatedPremiumDisplay: "14억~16억",
    calcMetrics: {
      estimatedProportionRate: 115,
      avgOfficialPriceRatio: 140,
      unionPrice59Manwon: 135000,
      unionPrice84Manwon: 185000,
      generalPrice59Manwon: 195000,
      generalPrice84Manwon: 265000,
      expectedNewAptPrice84Manwon: 380000,
    },
    nearestStation: "서울숲역 (수인분당선)",
    walkMinutes: 6,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2011.02.17" },
      { name: "추진위원회승인", isCompleted: true, isCurrent: false, date: "2011.06.30" },
      { name: "조합설립인가", isCompleted: true, isCurrent: true, date: "2017.07.25", description: "최고 70층 초고층 높이 완화 정비계획 변경안 심의 중" },
      { name: "건축심의", isCompleted: false, isCurrent: false },
      { name: "사업시행인가", isCompleted: false, isCurrent: false },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-ss1-1",
        date: "2026.09.05",
        type: "다세대",
        builtYear: 1991,
        addressDetail: "성수동1가 72-120 3층",
        tradePriceManwon: 245000,
        tradePriceDisplay: "24.5억",
        officialPriceManwon: 76000,
        officialPriceDisplay: "7.6억",
        landPyeong: 11.5,
        exclusivePyeong: 17.8,
        landPricePerPyeongManwon: 21304,
      },
    ],
    notices: [
      {
        id: "nt-ss1-1",
        title: "성수전략정비구역 제1지구 도시정비형 재개발 정비계획 결정(변경) 주민공람",
        org: "서울시 성동구 고시",
        date: "2024.03.14",
        type: "고시",
      },
    ],
  },
  {
    id: "gwangmyeong-11",
    name: "광명11구역",
    type: "재개발",
    status: "이주철거",
    statusDate: "2023.09.15",
    region: "경기",
    district: "광명시",
    address: "경기도 광명시 광명4동 158-403 일대",
    lat: 37.4795,
    lng: 126.8552,
    polygon: [
      { lat: 37.4828, lng: 126.8522 },
      { lat: 37.4832, lng: 126.8585 },
      { lat: 37.4772, lng: 126.8592 },
      { lat: 37.4755, lng: 126.8535 },
      { lat: 37.4792, lng: 126.8512 },
    ],
    totalUnits: 4291,
    ownersCount: 3267,
    generalUnits: 652,
    rentalUnits: 372,
    generalRatio: 15,
    builder: "현대건설 · HDC현대산업개발 (힐스테이트 아이파크)",
    zoneAreaM2: 198419,
    far: 271,
    bcr: 16,
    maxFloor: 42,
    totalBuildings: 25,
    recentTradePriceDisplay: "7.1억",
    avgLandPricePerPyeongManwon: 5400,
    pricePerPyeongByAge: {
      villa11To30Year: 5800,
      villaOver30Year: 5200,
      singleHouse: 2400,
    },
    askCount: 78,
    minPriceDisplay: "5.8억",
    minInvestmentDisplay: "4.2억",
    estimatedPremiumDisplay: "2.8억~3.4억",
    calcMetrics: {
      estimatedProportionRate: 102,
      avgOfficialPriceRatio: 125,
      unionPrice59Manwon: 48000,
      unionPrice84Manwon: 65000,
      generalPrice59Manwon: 72000,
      generalPrice84Manwon: 98000,
      expectedNewAptPrice84Manwon: 125000,
    },
    nearestStation: "광명사거리역 (7호선)",
    walkMinutes: 3,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2011.12.06" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2016.04.05" },
      { name: "사업시행인가", isCompleted: true, isCurrent: false, date: "2019.08.14" },
      { name: "관리처분인가", isCompleted: true, isCurrent: false, date: "2021.09.13" },
      { name: "이주철거", isCompleted: true, isCurrent: true, date: "2023.09.15", description: "철거 공사 막바지 및 착공계 제출 준비" },
      { name: "착공", isCompleted: false, isCurrent: false, description: "2025년 상반기 분양 목표" },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-gm11-1",
        date: "2026.09.14",
        type: "다세대",
        builtYear: 1996,
        addressDetail: "광명동 158-202 2층",
        tradePriceManwon: 68000,
        tradePriceDisplay: "6.8억",
        officialPriceManwon: 23000,
        officialPriceDisplay: "2.3억",
        landPyeong: 11.8,
        exclusivePyeong: 18.2,
        landPricePerPyeongManwon: 5762,
      },
    ],
    notices: [
      {
        id: "nt-gm11-1",
        title: "광명 제11R구역 주택재개발정비사업 사업시행계획(변경)인가 고시",
        org: "경기도 광명시 고시",
        date: "2024.01.18",
        type: "고시",
      },
    ],
  },
  {
    id: "hyochang-north",
    name: "효창공원앞역 북측구역",
    type: "신속통합기획",
    status: "정비구역지정",
    statusDate: "2023.11.20",
    region: "서울",
    district: "용산구",
    address: "서울특별시 용산구 효창동 5 일대",
    lat: 37.5398,
    lng: 126.9614,
    polygon: [
      { lat: 37.5425, lng: 126.9585 },
      { lat: 37.5428, lng: 126.9645 },
      { lat: 37.5375, lng: 126.9652 },
      { lat: 37.5368, lng: 126.9602 },
      { lat: 37.5395, lng: 126.9575 },
    ],
    totalUnits: 1450,
    ownersCount: 620,
    generalUnits: 580,
    rentalUnits: 250,
    generalRatio: 40,
    builder: "시공사 미정 (신속통합기획 가결)",
    zoneAreaM2: 78000,
    far: 250,
    bcr: 23,
    maxFloor: 35,
    totalBuildings: 14,
    recentTradePriceDisplay: "8.9억",
    avgLandPricePerPyeongManwon: 9800,
    pricePerPyeongByAge: {
      villa11To30Year: 10400,
      villaOver30Year: 9500,
      singleHouse: 4200,
    },
    askCount: 32,
    minPriceDisplay: "7.2억",
    minInvestmentDisplay: "5.5억",
    estimatedPremiumDisplay: "3.5억~4.2억",
    calcMetrics: {
      estimatedProportionRate: 106,
      avgOfficialPriceRatio: 130,
      unionPrice59Manwon: 72000,
      unionPrice84Manwon: 95000,
      generalPrice59Manwon: 102000,
      generalPrice84Manwon: 138000,
      expectedNewAptPrice84Manwon: 190000,
    },
    nearestStation: "효창공원앞역 (6호선·경의중앙)",
    walkMinutes: 3,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: true, date: "2023.11.20", description: "서울시 신속통합기획 기획안 확정" },
      { name: "추진위원회승인", isCompleted: false, isCurrent: false },
      { name: "조합설립인가", isCompleted: false, isCurrent: false },
      { name: "건축심의", isCompleted: false, isCurrent: false },
      { name: "사업시행인가", isCompleted: false, isCurrent: false },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-hc-1",
        date: "2026.09.22",
        type: "다세대",
        builtYear: 2001,
        addressDetail: "효창동 5-21 3층",
        tradePriceManwon: 87000,
        tradePriceDisplay: "8.7억",
        officialPriceManwon: 28000,
        officialPriceDisplay: "2.8억",
        landPyeong: 8.5,
        exclusivePyeong: 14.8,
        landPricePerPyeongManwon: 10235,
      },
    ],
    notices: [
      {
        id: "nt-hc-1",
        title: "효창공원앞역 역세권 장기전세 및 신속통합기획 정비구역 지정 고시",
        org: "서울시 용산구 고시",
        date: "2023.11.23",
        type: "고시",
      },
    ],
  },
  {
    id: "bukahyeon-2",
    name: "북아현2구역",
    type: "재개발",
    status: "사업시행인가",
    statusDate: "2023.03.14",
    region: "서울",
    district: "서대문구",
    address: "서울특별시 서대문구 북아현동 520 일대",
    lat: 37.5595,
    lng: 126.9545,
    polygon: [
      { lat: 37.5625, lng: 126.9515 },
      { lat: 37.5628, lng: 126.9578 },
      { lat: 37.5572, lng: 126.9585 },
      { lat: 37.5565, lng: 126.9525 },
      { lat: 37.5595, lng: 126.9502 },
    ],
    totalUnits: 2320,
    ownersCount: 1280,
    generalUnits: 650,
    rentalUnits: 390,
    generalRatio: 28,
    builder: "삼성물산 · DL이앤씨",
    zoneAreaM2: 124294,
    far: 260,
    bcr: 21,
    maxFloor: 29,
    totalBuildings: 22,
    recentTradePriceDisplay: "12.4억",
    avgLandPricePerPyeongManwon: 10500,
    pricePerPyeongByAge: {
      villa11To30Year: 11200,
      villaOver30Year: 10100,
      singleHouse: 4900,
    },
    askCount: 47,
    minPriceDisplay: "9.8억",
    minInvestmentDisplay: "7.9억",
    estimatedPremiumDisplay: "5.8억~6.8억",
    calcMetrics: {
      estimatedProportionRate: 105,
      avgOfficialPriceRatio: 130,
      unionPrice59Manwon: 76000,
      unionPrice84Manwon: 98000,
      generalPrice59Manwon: 110000,
      generalPrice84Manwon: 145000,
      expectedNewAptPrice84Manwon: 200000,
    },
    nearestStation: "아현역 (2호선) · 충정로역",
    walkMinutes: 4,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2008.02.05" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2009.05.20" },
      { name: "건축심의", isCompleted: true, isCurrent: false, date: "2021.11.12" },
      { name: "사업시행인가", isCompleted: true, isCurrent: true, date: "2023.03.14", description: "관리처분총회 준비 중" },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-ba2-1",
        date: "2026.09.19",
        type: "다세대",
        builtYear: 1997,
        addressDetail: "북아현동 522 2층",
        tradePriceManwon: 119000,
        tradePriceDisplay: "11.9억",
        officialPriceManwon: 38000,
        officialPriceDisplay: "3.8억",
        landPyeong: 11.2,
        exclusivePyeong: 17.5,
        landPricePerPyeongManwon: 10625,
      },
    ],
    notices: [
      {
        id: "nt-ba2-1",
        title: "북아현2재정비촉진구역 사업시행계획 변경인가 고시",
        org: "서대문구청 고시",
        date: "2023.03.16",
        type: "고시",
      },
    ],
  },
  ...NATIONWIDE_REDEVELOPMENT_DATA,
  ...NATIONWIDE_EXTRA_DATA,
];
