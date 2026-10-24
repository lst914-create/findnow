import { RedevelopmentZone } from "./redevelopment";

/**
 * 전국 주요 시·도 정비사업 대표 구역 데이터
 * (국토교통부 실거래가 공개시스템 및 지자체 공공 인허가 데이터 기준)
 */
export const NATIONWIDE_REDEVELOPMENT_DATA: RedevelopmentZone[] = [
  // ----------------------------------------------------
  // [서울 추가 구역]
  // ----------------------------------------------------
  {
    id: "jangwi-6",
    name: "장위6구역 (라디체)",
    type: "재개발",
    status: "착공",
    statusDate: "2024.03.15",
    region: "서울",
    district: "성북구",
    address: "서울특별시 성북구 장위동 25-55 일대",
    lat: 37.6112,
    lng: 127.0358,
    polygon: [
      {
            "lat": 37.610834,
            "lng": 127.037653
      },
      {
            "lat": 37.611698,
            "lng": 127.037547
      },
      {
            "lat": 37.612404,
            "lng": 127.036716
      },
      {
            "lat": 37.612263,
            "lng": 127.035418
      },
      {
            "lat": 37.612101,
            "lng": 127.033966
      },
      {
            "lat": 37.611107,
            "lng": 127.033382
      },
      {
            "lat": 37.610429,
            "lng": 127.034562
      },
      {
            "lat": 37.609705,
            "lng": 127.035536
      },
      {
            "lat": 37.610039,
            "lng": 127.036957
      }
],
    totalUnits: 1637,
    ownersCount: 566,
    generalUnits: 718,
    rentalUnits: 285,
    generalRatio: 44,
    builder: "대우건설 (푸르지오 라디체)",
    zoneAreaM2: 105163,
    far: 264,
    bcr: 20,
    maxFloor: 33,
    totalBuildings: 15,
    recentTradePriceDisplay: "9.2억",
    avgLandPricePerPyeongManwon: 6850,
    pricePerPyeongByAge: {
      villa11To30Year: 6900,
      villaOver30Year: 6700,
      singleHouse: 3500,
    },
    askCount: 22,
    minPriceDisplay: "8.5억",
    minInvestmentDisplay: "6.2억",
    estimatedPremiumDisplay: "3.8억~4.5억",
    calcMetrics: {
      estimatedProportionRate: 108,
      avgOfficialPriceRatio: 130,
      unionPrice59Manwon: 54000,
      unionPrice84Manwon: 68000,
      generalPrice59Manwon: 82000,
      generalPrice84Manwon: 105000,
      expectedNewAptPrice84Manwon: 135000,
    },
    nearestStation: "석계역 (1·6호선) 도보 5분",
    walkMinutes: 5,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2008.04.03" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2010.06.28" },
      { name: "사업시행인가", isCompleted: true, isCurrent: false, date: "2015.02.10" },
      { name: "관리처분인가", isCompleted: true, isCurrent: false, date: "2019.08.20" },
      { name: "이주철거", isCompleted: true, isCurrent: false, date: "2023.01.10" },
      { name: "착공", isCompleted: true, isCurrent: true, date: "2024.03.15", description: "골조 공사 진행 중" },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-jw6-1",
        date: "2026.08.20",
        type: "다세대",
        builtYear: 2008,
        addressDetail: "장위동 28-12 3층",
        tradePriceManwon: 89000,
        tradePriceDisplay: "8.9억",
        officialPriceManwon: 28500,
        officialPriceDisplay: "2.85억",
        landPyeong: 12.8,
        exclusivePyeong: 18.2,
        landPricePerPyeongManwon: 6953,
      },
    ],
    notices: [
      {
        id: "nt-jw6-1",
        title: "장위6구역 주택재개발정비사업 공사 착공 및 분양일정 안내",
        org: "성북구청 고시",
        date: "2024.03.15",
        type: "고시",
      },
    ],
  },
  {
    id: "hannam-5",
    name: "한남5구역",
    type: "재개발",
    status: "건축심의",
    statusDate: "2024.05.30",
    region: "서울",
    district: "용산구",
    address: "서울특별시 용산구 동빙고동 60 일대",
    lat: 37.5258,
    lng: 126.9945,
    polygon: [
      {
            "lat": 37.525614,
            "lng": 126.996528
      },
      {
            "lat": 37.52673,
            "lng": 126.996248
      },
      {
            "lat": 37.527319,
            "lng": 126.994789
      },
      {
            "lat": 37.527007,
            "lng": 126.993167
      },
      {
            "lat": 37.525997,
            "lng": 126.992354
      },
      {
            "lat": 37.524865,
            "lng": 126.992743
      },
      {
            "lat": 37.524487,
            "lng": 126.99425
      },
      {
            "lat": 37.524838,
            "lng": 126.995563
      }
],
    totalUnits: 2560,
    ownersCount: 1540,
    generalUnits: 636,
    rentalUnits: 384,
    generalRatio: 25,
    builder: "DL이앤씨 (아크로 한남)",
    zoneAreaM2: 183707,
    far: 219,
    bcr: 29,
    maxFloor: 23,
    totalBuildings: 51,
    recentTradePriceDisplay: "26.5억",
    avgLandPricePerPyeongManwon: 16800,
    pricePerPyeongByAge: {
      villa11To30Year: 17200,
      villaOver30Year: 16500,
      singleHouse: 11000,
    },
    askCount: 38,
    minPriceDisplay: "22.0억",
    minInvestmentDisplay: "18.5억",
    estimatedPremiumDisplay: "12.0억~14.5억",
    calcMetrics: {
      estimatedProportionRate: 115,
      avgOfficialPriceRatio: 135,
      unionPrice59Manwon: 115000,
      unionPrice84Manwon: 148000,
      generalPrice59Manwon: 175000,
      generalPrice84Manwon: 225000,
      expectedNewAptPrice84Manwon: 360000,
    },
    nearestStation: "서빙고역 (경의중앙선) · 이촌역",
    walkMinutes: 6,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2009.10.01" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2012.08.14" },
      { name: "건축심의", isCompleted: true, isCurrent: true, date: "2024.05.30", description: "사업시행인가 총회 준비" },
      { name: "사업시행인가", isCompleted: false, isCurrent: false },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-hn5-1",
        date: "2026.09.10",
        type: "다세대",
        builtYear: 2002,
        addressDetail: "동빙고동 62 2층",
        tradePriceManwon: 265000,
        tradePriceDisplay: "26.5억",
        officialPriceManwon: 79000,
        officialPriceDisplay: "7.9억",
        landPyeong: 15.6,
        exclusivePyeong: 22.4,
        landPricePerPyeongManwon: 16987,
      },
    ],
    notices: [
      {
        id: "nt-hn5-1",
        title: "한남5재정비촉진구역 건축심의 조건부 가결 고시",
        org: "서울시청 고시",
        date: "2024.05.30",
        type: "고시",
      },
    ],
  },

  // ----------------------------------------------------
  // [경기도 대표 정비사업 구역]
  // ----------------------------------------------------
  {
    id: "gwangmyeong-12",
    name: "광명12구역",
    type: "재개발",
    status: "관리처분인가",
    statusDate: "2023.12.28",
    region: "경기",
    district: "광명시",
    address: "경기도 광명시 철산동 472-267 일대",
    lat: 37.4812,
    lng: 126.8598,
    polygon: [
      {
            "lat": 37.481592,
            "lng": 126.86197
      },
      {
            "lat": 37.482156,
            "lng": 126.860959
      },
      {
            "lat": 37.482683,
            "lng": 126.859905
      },
      {
            "lat": 37.482311,
            "lng": 126.858695
      },
      {
            "lat": 37.481632,
            "lng": 126.858069
      },
      {
            "lat": 37.480918,
            "lng": 126.858239
      },
      {
            "lat": 37.480191,
            "lng": 126.858577
      },
      {
            "lat": 37.479693,
            "lng": 126.859693
      },
      {
            "lat": 37.479961,
            "lng": 126.861033
      },
      {
            "lat": 37.480697,
            "lng": 126.861817
      }
],
    totalUnits: 2097,
    ownersCount: 1198,
    generalUnits: 680,
    rentalUnits: 219,
    generalRatio: 32,
    builder: "GS건설 (철산자이)",
    zoneAreaM2: 98200,
    far: 248,
    bcr: 19,
    maxFloor: 29,
    totalBuildings: 19,
    recentTradePriceDisplay: "7.8억",
    avgLandPricePerPyeongManwon: 5800,
    pricePerPyeongByAge: {
      villa11To30Year: 5900,
      villaOver30Year: 5700,
      singleHouse: 3100,
    },
    askCount: 41,
    minPriceDisplay: "6.9억",
    minInvestmentDisplay: "4.8억",
    estimatedPremiumDisplay: "3.2억~3.8억",
    calcMetrics: {
      estimatedProportionRate: 104,
      avgOfficialPriceRatio: 130,
      unionPrice59Manwon: 51000,
      unionPrice84Manwon: 65000,
      generalPrice59Manwon: 74000,
      generalPrice84Manwon: 96000,
      expectedNewAptPrice84Manwon: 125000,
    },
    nearestStation: "철산역 (7호선) 도보 4분 초역세권",
    walkMinutes: 4,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2010.12.07" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2016.09.28" },
      { name: "사업시행인가", isCompleted: true, isCurrent: false, date: "2020.10.15" },
      { name: "관리처분인가", isCompleted: true, isCurrent: true, date: "2023.12.28", description: "이주 계획 수립 중" },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-gm12-1",
        date: "2026.09.05",
        type: "다세대",
        builtYear: 1996,
        addressDetail: "철산동 475 2층",
        tradePriceManwon: 76500,
        tradePriceDisplay: "7.65억",
        officialPriceManwon: 24500,
        officialPriceDisplay: "2.45억",
        landPyeong: 13.1,
        exclusivePyeong: 17.8,
        landPricePerPyeongManwon: 5839,
      },
    ],
    notices: [
      {
        id: "nt-gm12-1",
        title: "광명제12R구역 주택재개발 관리처분계획인가 고시",
        org: "광명시청 고시",
        date: "2023.12.28",
        type: "고시",
      },
    ],
  },
  {
    id: "seongnam-sujin-1",
    name: "성남 수진1구역 (산성역 확장)",
    type: "재개발",
    status: "사업시행인가",
    statusDate: "2024.04.11",
    region: "경기",
    district: "성남시",
    address: "경기도 성남시 수정구 수진동 963 일대",
    lat: 37.4385,
    lng: 127.1352,
    polygon: [
      {
            "lat": 37.438125,
            "lng": 127.136614
      },
      {
            "lat": 37.439243,
            "lng": 127.136752
      },
      {
            "lat": 37.439594,
            "lng": 127.135568
      },
      {
            "lat": 37.439868,
            "lng": 127.134368
      },
      {
            "lat": 37.438855,
            "lng": 127.133862
      },
      {
            "lat": 37.437864,
            "lng": 127.133872
      },
      {
            "lat": 37.437469,
            "lng": 127.134853
      },
      {
            "lat": 37.437363,
            "lng": 127.135891
      }
],
    totalUnits: 5668,
    ownersCount: 2610,
    generalUnits: 2200,
    rentalUnits: 858,
    generalRatio: 38,
    builder: "대우건설 · 현대건설 · DL이앤씨 컨소시엄",
    zoneAreaM2: 261297,
    far: 265,
    bcr: 21,
    maxFloor: 35,
    totalBuildings: 48,
    recentTradePriceDisplay: "6.9억",
    avgLandPricePerPyeongManwon: 4950,
    pricePerPyeongByAge: {
      villa11To30Year: 5100,
      villaOver30Year: 4800,
      singleHouse: 2900,
    },
    askCount: 65,
    minPriceDisplay: "5.8억",
    minInvestmentDisplay: "4.1억",
    estimatedPremiumDisplay: "2.4억~3.0억",
    calcMetrics: {
      estimatedProportionRate: 106,
      avgOfficialPriceRatio: 130,
      unionPrice59Manwon: 48000,
      unionPrice84Manwon: 62000,
      generalPrice59Manwon: 69000,
      generalPrice84Manwon: 89000,
      expectedNewAptPrice84Manwon: 118000,
    },
    nearestStation: "수진역 · 모란역 (8호선·수인분당선)",
    walkMinutes: 5,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2020.12.31" },
      { name: "주민대표회의승인", isCompleted: true, isCurrent: false, date: "2021.04.15" },
      { name: "사업시행자지정(LH)", isCompleted: true, isCurrent: false, date: "2021.06.10" },
      { name: "사업시행인가", isCompleted: true, isCurrent: true, date: "2024.04.11", description: "관리처분인가 준비 중" },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-sj1-1",
        date: "2026.08.14",
        type: "단독",
        builtYear: 1988,
        addressDetail: "수진동 980 가동",
        tradePriceManwon: 69000,
        tradePriceDisplay: "6.9억",
        officialPriceManwon: 22000,
        officialPriceDisplay: "2.2억",
        landPyeong: 20.4,
        exclusivePyeong: 28.5,
        landPricePerPyeongManwon: 3382,
      },
    ],
    notices: [
      {
        id: "nt-sj1-1",
        title: "수진1구역 재개발사업 사업시행계획인가 고시",
        org: "성남시청 고시",
        date: "2024.04.11",
        type: "고시",
      },
    ],
  },
  {
    id: "suwon-paldal-3",
    name: "수원 팔달3구역",
    type: "재개발",
    status: "사업시행인가",
    statusDate: "2023.11.16",
    region: "경기",
    district: "수원시",
    address: "경기도 수원시 팔달구 매교동 209-14 일대",
    lat: 37.2685,
    lng: 127.0165,
    polygon: [
      {
            "lat": 37.268412,
            "lng": 127.017789
      },
      {
            "lat": 37.269113,
            "lng": 127.017401
      },
      {
            "lat": 37.270039,
            "lng": 127.016912
      },
      {
            "lat": 37.269939,
            "lng": 127.01576
      },
      {
            "lat": 37.26909,
            "lng": 127.015103
      },
      {
            "lat": 37.268081,
            "lng": 127.014931
      },
      {
            "lat": 37.267512,
            "lng": 127.015787
      },
      {
            "lat": 37.267183,
            "lng": 127.016643
      },
      {
            "lat": 37.267402,
            "lng": 127.017701
      }
],
    totalUnits: 1171,
    ownersCount: 610,
    generalUnits: 460,
    rentalUnits: 101,
    generalRatio: 39,
    builder: "HDC현대산업개발 (아이파크)",
    zoneAreaM2: 68500,
    far: 245,
    bcr: 22,
    maxFloor: 26,
    totalBuildings: 12,
    recentTradePriceDisplay: "5.3억",
    avgLandPricePerPyeongManwon: 3650,
    pricePerPyeongByAge: {
      villa11To30Year: 3700,
      villaOver30Year: 3550,
      singleHouse: 2200,
    },
    askCount: 28,
    minPriceDisplay: "4.5억",
    minInvestmentDisplay: "3.2억",
    estimatedPremiumDisplay: "1.6억~2.1억",
    calcMetrics: {
      estimatedProportionRate: 103,
      avgOfficialPriceRatio: 130,
      unionPrice59Manwon: 41000,
      unionPrice84Manwon: 54000,
      generalPrice59Manwon: 58000,
      generalPrice84Manwon: 76000,
      expectedNewAptPrice84Manwon: 98000,
    },
    nearestStation: "매교역 (수인분당선) 도보 6분",
    walkMinutes: 6,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2011.08.19" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2017.03.22" },
      { name: "사업시행인가", isCompleted: true, isCurrent: true, date: "2023.11.16", description: "감정평가 완료 및 분양신청 중" },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-pd3-1",
        date: "2026.07.29",
        type: "다세대",
        builtYear: 2001,
        addressDetail: "매교동 212 3층",
        tradePriceManwon: 52000,
        tradePriceDisplay: "5.2억",
        officialPriceManwon: 16500,
        officialPriceDisplay: "1.65억",
        landPyeong: 14.2,
        exclusivePyeong: 19.5,
        landPricePerPyeongManwon: 3661,
      },
    ],
    notices: [
      {
        id: "nt-pd3-1",
        title: "팔달115-3구역 주택재개발정비사업 사업시행인가 고시",
        org: "수원시청 고시",
        date: "2023.11.16",
        type: "고시",
      },
    ],
  },

  // ----------------------------------------------------
  // [인천광역시 대표 정비사업 구역]
  // ----------------------------------------------------
  {
    id: "incheon-juan-1",
    name: "주안1구역 (힐스테이트 푸르지오 주안)",
    type: "재개발",
    status: "착공",
    statusDate: "2023.09.20",
    region: "인천",
    district: "미추홀구",
    address: "인천광역시 미추홀구 주안동 1452-2 일대",
    lat: 37.4589,
    lng: 126.6748,
    polygon: [
      {
            "lat": 37.459014,
            "lng": 126.67679
      },
      {
            "lat": 37.459763,
            "lng": 126.676078
      },
      {
            "lat": 37.460123,
            "lng": 126.675177
      },
      {
            "lat": 37.460249,
            "lng": 126.674117
      },
      {
            "lat": 37.459452,
            "lng": 126.673693
      },
      {
            "lat": 37.458786,
            "lng": 126.672813
      },
      {
            "lat": 37.458239,
            "lng": 126.673822
      },
      {
            "lat": 37.457725,
            "lng": 126.674437
      },
      {
            "lat": 37.457546,
            "lng": 126.675485
      },
      {
            "lat": 37.458178,
            "lng": 126.676245
      }
],
    totalUnits: 2054,
    ownersCount: 980,
    generalUnits: 885,
    rentalUnits: 189,
    generalRatio: 43,
    builder: "현대건설 · 대우건설 컨소시엄",
    zoneAreaM2: 127400,
    far: 275,
    bcr: 18,
    maxFloor: 40,
    totalBuildings: 22,
    recentTradePriceDisplay: "4.7억",
    avgLandPricePerPyeongManwon: 2950,
    pricePerPyeongByAge: {
      villa11To30Year: 3000,
      villaOver30Year: 2850,
      singleHouse: 1900,
    },
    askCount: 34,
    minPriceDisplay: "3.9억",
    minInvestmentDisplay: "2.6억",
    estimatedPremiumDisplay: "1.2억~1.7억",
    calcMetrics: {
      estimatedProportionRate: 102,
      avgOfficialPriceRatio: 130,
      unionPrice59Manwon: 36000,
      unionPrice84Manwon: 48000,
      generalPrice59Manwon: 49000,
      generalPrice84Manwon: 65000,
      expectedNewAptPrice84Manwon: 78000,
    },
    nearestStation: "시민공원역 (인천2호선) · 주안역 (1호선)",
    walkMinutes: 5,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2008.05.26" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2010.02.18" },
      { name: "사업시행인가", isCompleted: true, isCurrent: false, date: "2016.12.09" },
      { name: "관리처분인가", isCompleted: true, isCurrent: false, date: "2019.04.12" },
      { name: "이주철거", isCompleted: true, isCurrent: false, date: "2022.06.30" },
      { name: "착공", isCompleted: true, isCurrent: true, date: "2023.09.20", description: "상부 골조 공사 순항 중" },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-ja1-1",
        date: "2026.08.19",
        type: "다세대",
        builtYear: 1999,
        addressDetail: "주안동 1455 2층",
        tradePriceManwon: 45000,
        tradePriceDisplay: "4.5억",
        officialPriceManwon: 15200,
        officialPriceDisplay: "1.52억",
        landPyeong: 15.2,
        exclusivePyeong: 20.1,
        landPricePerPyeongManwon: 2960,
      },
    ],
    notices: [
      {
        id: "nt-ja1-1",
        title: "주안1구역 주택재개발정비사업 공사 진행 및 분양 안내",
        org: "미추홀구청 고시",
        date: "2023.09.20",
        type: "고시",
      },
    ],
  },

  // ----------------------------------------------------
  // [부산광역시 대표 정비사업 구역]
  // ----------------------------------------------------
  {
    id: "busan-daeyeon-3",
    name: "대연3구역 (디아이엘)",
    type: "재개발",
    status: "착공",
    statusDate: "2023.07.10",
    region: "부산",
    district: "남구",
    address: "부산광역시 남구 대연동 1619 일대",
    lat: 35.1368,
    lng: 129.0782,
    polygon: [
      {
            "lat": 35.136623,
            "lng": 129.079965
      },
      {
            "lat": 35.137434,
            "lng": 129.07959
      },
      {
            "lat": 35.137848,
            "lng": 129.078666
      },
      {
            "lat": 35.138084,
            "lng": 129.077481
      },
      {
            "lat": 35.137532,
            "lng": 129.076293
      },
      {
            "lat": 35.136569,
            "lng": 129.076722
      },
      {
            "lat": 35.135617,
            "lng": 129.076933
      },
      {
            "lat": 35.13558,
            "lng": 129.078262
      },
      {
            "lat": 35.135671,
            "lng": 129.079607
      }
],
    totalUnits: 4488,
    ownersCount: 1850,
    generalUnits: 2382,
    rentalUnits: 256,
    generalRatio: 53,
    builder: "롯데건설 · HDC현대산업개발 (디아이엘)",
    zoneAreaM2: 251978,
    far: 278,
    bcr: 17,
    maxFloor: 36,
    totalBuildings: 28,
    recentTradePriceDisplay: "6.8억",
    avgLandPricePerPyeongManwon: 3450,
    pricePerPyeongByAge: {
      villa11To30Year: 3550,
      villaOver30Year: 3350,
      singleHouse: 2400,
    },
    askCount: 52,
    minPriceDisplay: "5.5억",
    minInvestmentDisplay: "3.9억",
    estimatedPremiumDisplay: "1.8억~2.5억",
    calcMetrics: {
      estimatedProportionRate: 105,
      avgOfficialPriceRatio: 130,
      unionPrice59Manwon: 42000,
      unionPrice84Manwon: 56000,
      generalPrice59Manwon: 59000,
      generalPrice84Manwon: 79000,
      expectedNewAptPrice84Manwon: 98000,
    },
    nearestStation: "못골역 (부산2호선) 도보 2분 초역세권",
    walkMinutes: 2,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2007.03.14" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2009.07.28" },
      { name: "사업시행인가", isCompleted: true, isCurrent: false, date: "2017.11.29" },
      { name: "관리처분인가", isCompleted: true, isCurrent: false, date: "2020.04.17" },
      { name: "이주철거", isCompleted: true, isCurrent: false, date: "2022.12.15" },
      { name: "착공", isCompleted: true, isCurrent: true, date: "2023.07.10", description: "대단지 골조 공사 진행 중" },
      { name: "일반분양", isCompleted: true, isCurrent: false, date: "2023.08.02" },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-dy3-1",
        date: "2026.09.12",
        type: "다세대",
        builtYear: 1995,
        addressDetail: "대연동 1622 2층",
        tradePriceManwon: 65000,
        tradePriceDisplay: "6.5억",
        officialPriceManwon: 21000,
        officialPriceDisplay: "2.1억",
        landPyeong: 18.5,
        exclusivePyeong: 24.1,
        landPricePerPyeongManwon: 3513,
      },
    ],
    notices: [
      {
        id: "nt-dy3-1",
        title: "대연3구역 주택재개발 정비사업 착공 및 입주예정일 공고",
        org: "부산 남구청 고시",
        date: "2023.07.10",
        type: "고시",
      },
    ],
  },
  {
    id: "busan-udong-3",
    name: "해운대 우동3구역",
    type: "재개발",
    status: "사업시행인가",
    statusDate: "2024.03.18",
    region: "부산",
    district: "해운대구",
    address: "부산광역시 해운대구 우동 229 일대",
    lat: 35.1625,
    lng: 129.1585,
    polygon: [
      {
            "lat": 35.162219,
            "lng": 129.16031
      },
      {
            "lat": 35.162998,
            "lng": 129.159923
      },
      {
            "lat": 35.163748,
            "lng": 129.159271
      },
      {
            "lat": 35.163712,
            "lng": 129.15795
      },
      {
            "lat": 35.163116,
            "lng": 129.157097
      },
      {
            "lat": 35.162309,
            "lng": 129.156276
      },
      {
            "lat": 35.161632,
            "lng": 129.157318
      },
      {
            "lat": 35.161114,
            "lng": 129.1584
      },
      {
            "lat": 35.16168,
            "lng": 129.159413
      }
],
    totalUnits: 2503,
    ownersCount: 1100,
    generalUnits: 1250,
    rentalUnits: 153,
    generalRatio: 50,
    builder: "현대건설 (디에이치 아센테)",
    zoneAreaM2: 160727,
    far: 295,
    bcr: 19,
    maxFloor: 39,
    totalBuildings: 24,
    recentTradePriceDisplay: "9.5억",
    avgLandPricePerPyeongManwon: 5200,
    pricePerPyeongByAge: {
      villa11To30Year: 5350,
      villaOver30Year: 5100,
      singleHouse: 3800,
    },
    askCount: 44,
    minPriceDisplay: "8.2억",
    minInvestmentDisplay: "6.0억",
    estimatedPremiumDisplay: "3.5억~4.6억",
    calcMetrics: {
      estimatedProportionRate: 110,
      avgOfficialPriceRatio: 135,
      unionPrice59Manwon: 56000,
      unionPrice84Manwon: 72000,
      generalPrice59Manwon: 78000,
      generalPrice84Manwon: 105000,
      expectedNewAptPrice84Manwon: 150000,
    },
    nearestStation: "해운대역 (부산2호선) 도보 5분",
    walkMinutes: 5,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2007.11.28" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2015.07.24" },
      { name: "건축심의", isCompleted: true, isCurrent: false, date: "2023.08.11" },
      { name: "사업시행인가", isCompleted: true, isCurrent: true, date: "2024.03.18", description: "관리처분인가 준비 중" },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-ud3-1",
        date: "2026.08.28",
        type: "다세대",
        builtYear: 1993,
        addressDetail: "우동 235 3층",
        tradePriceManwon: 92000,
        tradePriceDisplay: "9.2억",
        officialPriceManwon: 28500,
        officialPriceDisplay: "2.85억",
        landPyeong: 17.6,
        exclusivePyeong: 22.8,
        landPricePerPyeongManwon: 5227,
      },
    ],
    notices: [
      {
        id: "nt-ud3-1",
        title: "우동3구역 주택재개발정비사업 사업시행인가 고시",
        org: "부산 해운대구청 고시",
        date: "2024.03.18",
        type: "고시",
      },
    ],
  },

  // ----------------------------------------------------
  // [대전광역시 대표 정비사업 구역]
  // ----------------------------------------------------
  {
    id: "daejeon-doma-1",
    name: "대전 도마변동1구역 (힐스테이트 가장더퍼스트)",
    type: "재개발",
    status: "착공",
    statusDate: "2024.05.02",
    region: "대전",
    district: "서구",
    address: "대전광역시 서구 가장동 38-1 일대",
    lat: 36.3312,
    lng: 127.3912,
    polygon: [
      {
            "lat": 36.331122,
            "lng": 127.393056
      },
      {
            "lat": 36.331916,
            "lng": 127.392885
      },
      {
            "lat": 36.332545,
            "lng": 127.392143
      },
      {
            "lat": 36.332751,
            "lng": 127.39102
      },
      {
            "lat": 36.332257,
            "lng": 127.390112
      },
      {
            "lat": 36.331662,
            "lng": 127.389468
      },
      {
            "lat": 36.330884,
            "lng": 127.389398
      },
      {
            "lat": 36.330448,
            "lng": 127.390228
      },
      {
            "lat": 36.329898,
            "lng": 127.390851
      },
      {
            "lat": 36.329712,
            "lng": 127.391975
      },
      {
            "lat": 36.330324,
            "lng": 127.39281
      }
],
    totalUnits: 1779,
    ownersCount: 390,
    generalUnits: 1339,
    rentalUnits: 50,
    generalRatio: 75,
    builder: "현대건설 · 현대엔지니어링 (힐스테이트 가장더퍼스트)",
    zoneAreaM2: 104500,
    far: 249,
    bcr: 18,
    maxFloor: 38,
    totalBuildings: 15,
    recentTradePriceDisplay: "4.2억",
    avgLandPricePerPyeongManwon: 2600,
    pricePerPyeongByAge: {
      villa11To30Year: 2650,
      villaOver30Year: 2550,
      singleHouse: 1700,
    },
    askCount: 29,
    minPriceDisplay: "3.5억",
    minInvestmentDisplay: "2.3억",
    estimatedPremiumDisplay: "1.1억~1.5억",
    calcMetrics: {
      estimatedProportionRate: 107,
      avgOfficialPriceRatio: 130,
      unionPrice59Manwon: 32000,
      unionPrice84Manwon: 43000,
      generalPrice59Manwon: 44000,
      generalPrice84Manwon: 59000,
      expectedNewAptPrice84Manwon: 72000,
    },
    nearestStation: "용문역 (대전1호선) · 유등천 수변",
    walkMinutes: 8,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2009.08.07" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2018.11.20" },
      { name: "사업시행인가", isCompleted: true, isCurrent: false, date: "2021.03.12" },
      { name: "관리처분인가", isCompleted: true, isCurrent: false, date: "2022.09.28" },
      { name: "이주철거", isCompleted: true, isCurrent: false, date: "2023.11.10" },
      { name: "착공", isCompleted: true, isCurrent: true, date: "2024.05.02", description: "지하 터파기 및 기초 공사" },
      { name: "일반분양", isCompleted: true, isCurrent: false, date: "2024.05.15" },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-dm1-1",
        date: "2026.07.15",
        type: "다세대",
        builtYear: 1996,
        addressDetail: "가장동 42 2층",
        tradePriceManwon: 39500,
        tradePriceDisplay: "3.95억",
        officialPriceManwon: 13500,
        officialPriceDisplay: "1.35억",
        landPyeong: 15.1,
        exclusivePyeong: 21.3,
        landPricePerPyeongManwon: 2615,
      },
    ],
    notices: [
      {
        id: "nt-dm1-1",
        title: "도마·변동1구역 주택재개발 착공계 수리 및 분양 공고",
        org: "대전 서구청 고시",
        date: "2024.05.02",
        type: "고시",
      },
    ],
  },

  // ==========================================
  // 🚀 [중랑역 일대 및 서울 주요 핵심 정비구역 대량 보강]
  // ==========================================
  {
    id: "junghwa-1",
    name: "중화1구역 (리버센SK뷰롯데캐슬)",
    type: "재개발",
    status: "착공",
    statusDate: "2023.10.15",
    region: "서울",
    district: "중랑구",
    address: "서울특별시 중랑구 중화동 331-1 일대",
    lat: 37.5995,
    lng: 127.0782,
    polygon: [
      {
            "lat": 37.599409,
            "lng": 127.079744
      },
      {
            "lat": 37.60019,
            "lng": 127.07949
      },
      {
            "lat": 37.600667,
            "lng": 127.078851
      },
      {
            "lat": 37.600884,
            "lng": 127.078082
      },
      {
            "lat": 37.600707,
            "lng": 127.077237
      },
      {
            "lat": 37.599858,
            "lng": 127.077166
      },
      {
            "lat": 37.599224,
            "lng": 127.076931
      },
      {
            "lat": 37.598423,
            "lng": 127.077096
      },
      {
            "lat": 37.597966,
            "lng": 127.077867
      },
      {
            "lat": 37.598518,
            "lng": 127.078594
      },
      {
            "lat": 37.598635,
            "lng": 127.079433
      }
],
    totalUnits: 1055,
    ownersCount: 420,
    generalUnits: 501,
    rentalUnits: 134,
    generalRatio: 47,
    builder: "SK에코플랜트 · 롯데건설",
    zoneAreaM2: 51230,
    far: 299,
    bcr: 22,
    maxFloor: 35,
    totalBuildings: 8,
    recentTradePriceDisplay: "9.8억",
    avgLandPricePerPyeongManwon: 6200,
    pricePerPyeongByAge: {
      villa11To30Year: 6510,
      villaOver30Year: 6076,
      singleHouse: 4030,
    },
    askCount: 18,
    minPriceDisplay: "8.9억",
    minInvestmentDisplay: "5.8억",
    estimatedPremiumDisplay: "3.5억~4.2억",
    calcMetrics: {
      "estimatedProportionRate": 106,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 51000,
      "unionPrice84Manwon": 64000,
      "generalPrice59Manwon": 76000,
      "generalPrice84Manwon": 98000,
      "expectedNewAptPrice84Manwon": 120000
},
    nearestStation: "중화역 (7호선) 도보 3분 · 중랑역 (경의중앙) 도보 7분",
    walkMinutes: 4,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2020.11.25" },
      { name: "건축심의", isCompleted: true, isCurrent: false },
      { name: "사업시행인가", isCompleted: true, isCurrent: false },
      { name: "관리처분인가", isCompleted: true, isCurrent: false },
      { name: "이주철거", isCompleted: true, isCurrent: false },
      { name: "착공", isCompleted: true, isCurrent: true },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-junghwa-1-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 중랑구 중화동 331-1 2층",
        tradePriceManwon: 98000,
        tradePriceDisplay: "9.8억",
        officialPriceManwon: 34300,
        officialPriceDisplay: "3.4억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 6200,
      },
    ],
    notices: [
      {
        id: "nt-junghwa-1-1",
        title: "중화1구역 (리버센SK뷰롯데캐슬) 정비사업 인허가 및 공사 진행 현황 고시",
        org: "중랑구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "junghwa-2",
    name: "중화2구역",
    type: "재개발",
    status: "조합설립인가",
    statusDate: "2023.08.12",
    region: "서울",
    district: "중랑구",
    address: "서울특별시 중랑구 중화동 329-38 일대",
    lat: 37.6028,
    lng: 127.0762,
    polygon: [
      {
            "lat": 37.602929,
            "lng": 127.077844
      },
      {
            "lat": 37.603728,
            "lng": 127.077855
      },
      {
            "lat": 37.60403,
            "lng": 127.076783
      },
      {
            "lat": 37.604211,
            "lng": 127.07566
      },
      {
            "lat": 37.603769,
            "lng": 127.074662
      },
      {
            "lat": 37.603073,
            "lng": 127.073903
      },
      {
            "lat": 37.602401,
            "lng": 127.074824
      },
      {
            "lat": 37.601642,
            "lng": 127.075045
      },
      {
            "lat": 37.601411,
            "lng": 127.076141
      },
      {
            "lat": 37.601733,
            "lng": 127.077137
      },
      {
            "lat": 37.602284,
            "lng": 127.077727
      }
],
    totalUnits: 1580,
    ownersCount: 780,
    generalUnits: 580,
    rentalUnits: 220,
    generalRatio: 37,
    builder: "시공사 선정 준비 중 (포스코이앤씨 유력)",
    zoneAreaM2: 82500,
    far: 275,
    bcr: 21,
    maxFloor: 35,
    totalBuildings: 12,
    recentTradePriceDisplay: "6.5억",
    avgLandPricePerPyeongManwon: 5400,
    pricePerPyeongByAge: {
      villa11To30Year: 5670,
      villaOver30Year: 5292,
      singleHouse: 3510,
    },
    askCount: 34,
    minPriceDisplay: "5.9억",
    minInvestmentDisplay: "3.8억",
    estimatedPremiumDisplay: "2.5억~3.2억",
    calcMetrics: {
      "estimatedProportionRate": 104,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 48000,
      "unionPrice84Manwon": 61000,
      "generalPrice59Manwon": 72000,
      "generalPrice84Manwon": 92000,
      "expectedNewAptPrice84Manwon": 115000
},
    nearestStation: "중화역 (7호선) 도보 5분",
    walkMinutes: 5,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: true, date: "2020.11.25" },
      { name: "건축심의", isCompleted: false, isCurrent: false },
      { name: "사업시행인가", isCompleted: false, isCurrent: false },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-junghwa-2-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 중랑구 중화동 329-38 2층",
        tradePriceManwon: 65000,
        tradePriceDisplay: "6.5억",
        officialPriceManwon: 22750,
        officialPriceDisplay: "2.3억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 5400,
      },
    ],
    notices: [
      {
        id: "nt-junghwa-2-1",
        title: "중화2구역 정비사업 인허가 및 공사 진행 현황 고시",
        org: "중랑구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "junghwa-moa-1",
    name: "중화동 모아타운 1구역",
    type: "모아타운",
    status: "조합설립인가",
    statusDate: "2024.01.20",
    region: "서울",
    district: "중랑구",
    address: "서울특별시 중랑구 중화동 329-10 일대",
    lat: 37.6045,
    lng: 127.0792,
    polygon: [
      {
            "lat": 37.604672,
            "lng": 127.081006
      },
      {
            "lat": 37.605401,
            "lng": 127.080451
      },
      {
            "lat": 37.605825,
            "lng": 127.079533
      },
      {
            "lat": 37.605454,
            "lng": 127.078623
      },
      {
            "lat": 37.605223,
            "lng": 127.077509
      },
      {
            "lat": 37.604346,
            "lng": 127.077583
      },
      {
            "lat": 37.603674,
            "lng": 127.078053
      },
      {
            "lat": 37.603367,
            "lng": 127.078915
      },
      {
            "lat": 37.603327,
            "lng": 127.079909
      },
      {
            "lat": 37.603798,
            "lng": 127.080841
      }
],
    totalUnits: 980,
    ownersCount: 460,
    generalUnits: 380,
    rentalUnits: 140,
    generalRatio: 39,
    builder: "HDC현대산업개발 (아이파크)",
    zoneAreaM2: 45000,
    far: 250,
    bcr: 23,
    maxFloor: 25,
    totalBuildings: 7,
    recentTradePriceDisplay: "5.2억",
    avgLandPricePerPyeongManwon: 4800,
    pricePerPyeongByAge: {
      villa11To30Year: 5040,
      villaOver30Year: 4704,
      singleHouse: 3120,
    },
    askCount: 26,
    minPriceDisplay: "4.8억",
    minInvestmentDisplay: "2.9억",
    estimatedPremiumDisplay: "1.8억~2.4억",
    calcMetrics: {
      "estimatedProportionRate": 103,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 45000,
      "unionPrice84Manwon": 58000,
      "generalPrice59Manwon": 68000,
      "generalPrice84Manwon": 87000,
      "expectedNewAptPrice84Manwon": 108000
},
    nearestStation: "중화역 (7호선) 도보 6분",
    walkMinutes: 6,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: true, date: "2020.11.25" },
      { name: "건축심의", isCompleted: false, isCurrent: false },
      { name: "사업시행인가", isCompleted: false, isCurrent: false },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-junghwa-moa-1-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 중랑구 중화동 329-10 2층",
        tradePriceManwon: 52000,
        tradePriceDisplay: "5.2억",
        officialPriceManwon: 18200,
        officialPriceDisplay: "1.8억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 4800,
      },
    ],
    notices: [
      {
        id: "nt-junghwa-moa-1-1",
        title: "중화동 모아타운 1구역 정비사업 인허가 및 공사 진행 현황 고시",
        org: "중랑구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "sangbong-7",
    name: "상봉7구역",
    type: "재개발",
    status: "사업시행인가",
    statusDate: "2023.11.08",
    region: "서울",
    district: "중랑구",
    address: "서울특별시 중랑구 상봉동 88 일대",
    lat: 37.5975,
    lng: 127.0845,
    polygon: [
      {
            "lat": 37.597537,
            "lng": 127.086283
      },
      {
            "lat": 37.598402,
            "lng": 127.086276
      },
      {
            "lat": 37.598616,
            "lng": 127.085135
      },
      {
            "lat": 37.598754,
            "lng": 127.08421
      },
      {
            "lat": 37.598462,
            "lng": 127.083315
      },
      {
            "lat": 37.597833,
            "lng": 127.082802
      },
      {
            "lat": 37.597146,
            "lng": 127.083032
      },
      {
            "lat": 37.596504,
            "lng": 127.083404
      },
      {
            "lat": 37.595953,
            "lng": 127.08426
      },
      {
            "lat": 37.596083,
            "lng": 127.085435
      },
      {
            "lat": 37.596844,
            "lng": 127.085959
      }
],
    totalUnits: 840,
    ownersCount: 310,
    generalUnits: 410,
    rentalUnits: 120,
    generalRatio: 49,
    builder: "현대엔지니어링 (힐스테이트)",
    zoneAreaM2: 38500,
    far: 295,
    bcr: 24,
    maxFloor: 38,
    totalBuildings: 5,
    recentTradePriceDisplay: "7.8억",
    avgLandPricePerPyeongManwon: 5900,
    pricePerPyeongByAge: {
      villa11To30Year: 6195,
      villaOver30Year: 5782,
      singleHouse: 3835,
    },
    askCount: 21,
    minPriceDisplay: "7.2억",
    minInvestmentDisplay: "4.5억",
    estimatedPremiumDisplay: "2.8억~3.5억",
    calcMetrics: {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 49000,
      "unionPrice84Manwon": 62000,
      "generalPrice59Manwon": 74000,
      "generalPrice84Manwon": 95000,
      "expectedNewAptPrice84Manwon": 118000
},
    nearestStation: "상봉역 (7호선·경의중앙·경춘선·GTX-B) 도보 4분",
    walkMinutes: 4,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2020.11.25" },
      { name: "건축심의", isCompleted: true, isCurrent: false },
      { name: "사업시행인가", isCompleted: true, isCurrent: true },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-sangbong-7-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 중랑구 상봉동 88 2층",
        tradePriceManwon: 78000,
        tradePriceDisplay: "7.8억",
        officialPriceManwon: 27300,
        officialPriceDisplay: "2.7억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 5900,
      },
    ],
    notices: [
      {
        id: "nt-sangbong-7-1",
        title: "상봉7구역 정비사업 인허가 및 공사 진행 현황 고시",
        org: "중랑구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "sangbong-9",
    name: "상봉9구역 (상봉터미널 복합개발)",
    type: "재개발",
    status: "건축심의",
    statusDate: "2024.03.22",
    region: "서울",
    district: "중랑구",
    address: "서울특별시 중랑구 상봉동 83-1 일대",
    lat: 37.5955,
    lng: 127.0885,
    polygon: [
      {
            "lat": 37.595819,
            "lng": 127.090492
      },
      {
            "lat": 37.596381,
            "lng": 127.089306
      },
      {
            "lat": 37.596645,
            "lng": 127.088094
      },
      {
            "lat": 37.596213,
            "lng": 127.086777
      },
      {
            "lat": 37.595189,
            "lng": 127.086561
      },
      {
            "lat": 37.59453,
            "lng": 127.087613
      },
      {
            "lat": 37.59423,
            "lng": 127.08895
      },
      {
            "lat": 37.594779,
            "lng": 127.090243
      }
],
    totalUnits: 1999,
    ownersCount: 120,
    generalUnits: 1620,
    rentalUnits: 259,
    generalRatio: 81,
    builder: "포스코이앤씨 (더샵 랜드마크)",
    zoneAreaM2: 78000,
    far: 599,
    bcr: 48,
    maxFloor: 49,
    totalBuildings: 5,
    recentTradePriceDisplay: "11.5억",
    avgLandPricePerPyeongManwon: 7200,
    pricePerPyeongByAge: {
      villa11To30Year: 7560,
      villaOver30Year: 7056,
      singleHouse: 4680,
    },
    askCount: 15,
    minPriceDisplay: "10.2억",
    minInvestmentDisplay: "6.8억",
    estimatedPremiumDisplay: "4.5억~5.5억",
    calcMetrics: {
      "estimatedProportionRate": 115,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 56000,
      "unionPrice84Manwon": 71000,
      "generalPrice59Manwon": 84000,
      "generalPrice84Manwon": 108000,
      "expectedNewAptPrice84Manwon": 135000
},
    nearestStation: "상봉역·망우역 초역세권",
    walkMinutes: 2,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2020.11.25" },
      { name: "건축심의", isCompleted: true, isCurrent: true },
      { name: "사업시행인가", isCompleted: false, isCurrent: false },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-sangbong-9-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 중랑구 상봉동 83-1 2층",
        tradePriceManwon: 115000,
        tradePriceDisplay: "11.5억",
        officialPriceManwon: 40250,
        officialPriceDisplay: "4.0억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 7200,
      },
    ],
    notices: [
      {
        id: "nt-sangbong-9-1",
        title: "상봉9구역 (상봉터미널 복합개발) 정비사업 인허가 및 공사 진행 현황 고시",
        org: "중랑구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "myeonmok-moa-1",
    name: "면목본동 모아타운 1·2구역",
    type: "모아타운",
    status: "조합설립인가",
    statusDate: "2024.02.15",
    region: "서울",
    district: "중랑구",
    address: "서울특별시 중랑구 면목동 297-28 일대",
    lat: 37.5885,
    lng: 127.0875,
    polygon: [
      {
            "lat": 37.588863,
            "lng": 127.089701
      },
      {
            "lat": 37.589675,
            "lng": 127.088939
      },
      {
            "lat": 37.590049,
            "lng": 127.087685
      },
      {
            "lat": 37.589517,
            "lng": 127.086628
      },
      {
            "lat": 37.588996,
            "lng": 127.085829
      },
      {
            "lat": 37.588205,
            "lng": 127.085716
      },
      {
            "lat": 37.58746,
            "lng": 127.086226
      },
      {
            "lat": 37.587321,
            "lng": 127.087359
      },
      {
            "lat": 37.587548,
            "lng": 127.088317
      },
      {
            "lat": 37.588091,
            "lng": 127.088879
      }
],
    totalUnits: 1850,
    ownersCount: 890,
    generalUnits: 720,
    rentalUnits: 240,
    generalRatio: 39,
    builder: "DL건설 (e편한세상 모아타운)",
    zoneAreaM2: 92000,
    far: 250,
    bcr: 22,
    maxFloor: 28,
    totalBuildings: 14,
    recentTradePriceDisplay: "5.6억",
    avgLandPricePerPyeongManwon: 4600,
    pricePerPyeongByAge: {
      villa11To30Year: 4830,
      villaOver30Year: 4508,
      singleHouse: 2990,
    },
    askCount: 42,
    minPriceDisplay: "4.9억",
    minInvestmentDisplay: "2.8억",
    estimatedPremiumDisplay: "1.9억~2.6억",
    calcMetrics: {
      "estimatedProportionRate": 104,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 46000,
      "unionPrice84Manwon": 59000,
      "generalPrice59Manwon": 69000,
      "generalPrice84Manwon": 88000,
      "expectedNewAptPrice84Manwon": 110000
},
    nearestStation: "면목역 (7호선) 도보 6분",
    walkMinutes: 6,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: true, date: "2020.11.25" },
      { name: "건축심의", isCompleted: false, isCurrent: false },
      { name: "사업시행인가", isCompleted: false, isCurrent: false },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-myeonmok-moa-1-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 중랑구 면목동 297-28 2층",
        tradePriceManwon: 56000,
        tradePriceDisplay: "5.6억",
        officialPriceManwon: 19600,
        officialPriceDisplay: "2.0억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 4600,
      },
    ],
    notices: [
      {
        id: "nt-myeonmok-moa-1-1",
        title: "면목본동 모아타운 1·2구역 정비사업 인허가 및 공사 진행 현황 고시",
        org: "중랑구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "myeonmok-moa-3",
    name: "면목본동 모아타운 3·4·5구역",
    type: "모아타운",
    status: "정비구역지정",
    statusDate: "2023.12.18",
    region: "서울",
    district: "중랑구",
    address: "서울특별시 중랑구 면목동 298-10 일대",
    lat: 37.5845,
    lng: 127.088,
    polygon: [
      {
            "lat": 37.584429,
            "lng": 127.089699
      },
      {
            "lat": 37.585503,
            "lng": 127.089407
      },
      {
            "lat": 37.585876,
            "lng": 127.088092
      },
      {
            "lat": 37.585685,
            "lng": 127.086656
      },
      {
            "lat": 37.584584,
            "lng": 127.085998
      },
      {
            "lat": 37.583527,
            "lng": 127.086635
      },
      {
            "lat": 37.583152,
            "lng": 127.08791
      },
      {
            "lat": 37.583496,
            "lng": 127.089139
      }
],
    totalUnits: 2150,
    ownersCount: 1120,
    generalUnits: 780,
    rentalUnits: 250,
    generalRatio: 36,
    builder: "롯데건설 컨소시엄 협의 중",
    zoneAreaM2: 108000,
    far: 248,
    bcr: 23,
    maxFloor: 25,
    totalBuildings: 16,
    recentTradePriceDisplay: "4.9억",
    avgLandPricePerPyeongManwon: 4400,
    pricePerPyeongByAge: {
      villa11To30Year: 4620,
      villaOver30Year: 4312,
      singleHouse: 2860,
    },
    askCount: 48,
    minPriceDisplay: "4.3억",
    minInvestmentDisplay: "2.5억",
    estimatedPremiumDisplay: "1.6억~2.2억",
    calcMetrics: {
      "estimatedProportionRate": 102,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 44000,
      "unionPrice84Manwon": 57000,
      "generalPrice59Manwon": 67000,
      "generalPrice84Manwon": 86000,
      "expectedNewAptPrice84Manwon": 108000
},
    nearestStation: "면목역 (7호선) 도보 8분",
    walkMinutes: 8,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2020.11.25" },
      { name: "건축심의", isCompleted: false, isCurrent: false },
      { name: "사업시행인가", isCompleted: false, isCurrent: false },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-myeonmok-moa-3-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 중랑구 면목동 298-10 2층",
        tradePriceManwon: 49000,
        tradePriceDisplay: "4.9억",
        officialPriceManwon: 17150,
        officialPriceDisplay: "1.7억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 4400,
      },
    ],
    notices: [
      {
        id: "nt-myeonmok-moa-3-1",
        title: "면목본동 모아타운 3·4·5구역 정비사업 인허가 및 공사 진행 현황 고시",
        org: "중랑구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "myeonmok-7",
    name: "면목7구역",
    type: "신속통합기획",
    status: "조합설립인가",
    statusDate: "2024.04.10",
    region: "서울",
    district: "중랑구",
    address: "서울특별시 중랑구 면목동 55-14 일대",
    lat: 37.5785,
    lng: 127.086,
    polygon: [
      {
            "lat": 37.57843,
            "lng": 127.087613
      },
      {
            "lat": 37.579322,
            "lng": 127.087978
      },
      {
            "lat": 37.579549,
            "lng": 127.086636
      },
      {
            "lat": 37.57985,
            "lng": 127.085481
      },
      {
            "lat": 37.579211,
            "lng": 127.084704
      },
      {
            "lat": 37.578598,
            "lng": 127.083749
      },
      {
            "lat": 37.577733,
            "lng": 127.084154
      },
      {
            "lat": 37.577052,
            "lng": 127.085122
      },
      {
            "lat": 37.577178,
            "lng": 127.086508
      },
      {
            "lat": 37.577831,
            "lng": 127.087218
      }
],
    totalUnits: 1447,
    ownersCount: 650,
    generalUnits: 620,
    rentalUnits: 177,
    generalRatio: 43,
    builder: "GS건설 (자이) 유력",
    zoneAreaM2: 72000,
    far: 270,
    bcr: 21,
    maxFloor: 35,
    totalBuildings: 10,
    recentTradePriceDisplay: "6.2억",
    avgLandPricePerPyeongManwon: 4900,
    pricePerPyeongByAge: {
      villa11To30Year: 5145,
      villaOver30Year: 4802,
      singleHouse: 3185,
    },
    askCount: 28,
    minPriceDisplay: "5.5억",
    minInvestmentDisplay: "3.2억",
    estimatedPremiumDisplay: "2.2억~2.9억",
    calcMetrics: {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 47000,
      "unionPrice84Manwon": 60000,
      "generalPrice59Manwon": 71000,
      "generalPrice84Manwon": 91000,
      "expectedNewAptPrice84Manwon": 112000
},
    nearestStation: "사가정역 (7호선) 도보 5분",
    walkMinutes: 5,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: true, date: "2020.11.25" },
      { name: "건축심의", isCompleted: false, isCurrent: false },
      { name: "사업시행인가", isCompleted: false, isCurrent: false },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-myeonmok-7-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 중랑구 면목동 55-14 2층",
        tradePriceManwon: 62000,
        tradePriceDisplay: "6.2억",
        officialPriceManwon: 21700,
        officialPriceDisplay: "2.2억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 4900,
      },
    ],
    notices: [
      {
        id: "nt-myeonmok-7-1",
        title: "면목7구역 정비사업 인허가 및 공사 진행 현황 고시",
        org: "중랑구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "imun-1",
    name: "이문1구역 (래미안 라그란데)",
    type: "재개발",
    status: "착공",
    statusDate: "2023.08.25",
    region: "서울",
    district: "동대문구",
    address: "서울특별시 동대문구 이문동 257-42 일대",
    lat: 37.5985,
    lng: 127.062,
    polygon: [
      {
            "lat": 37.598544,
            "lng": 127.06376
      },
      {
            "lat": 37.599571,
            "lng": 127.063131
      },
      {
            "lat": 37.600033,
            "lng": 127.061952
      },
      {
            "lat": 37.599543,
            "lng": 127.060769
      },
      {
            "lat": 37.598457,
            "lng": 127.060267
      },
      {
            "lat": 37.597568,
            "lng": 127.061016
      },
      {
            "lat": 37.597448,
            "lng": 127.062033
      },
      {
            "lat": 37.597605,
            "lng": 127.063057
      }
],
    totalUnits: 3069,
    ownersCount: 1520,
    generalUnits: 920,
    rentalUnits: 629,
    generalRatio: 30,
    builder: "삼성물산 (래미안 라그란데)",
    zoneAreaM2: 145000,
    far: 247,
    bcr: 19,
    maxFloor: 27,
    totalBuildings: 39,
    recentTradePriceDisplay: "11.2억",
    avgLandPricePerPyeongManwon: 7800,
    pricePerPyeongByAge: {
      villa11To30Year: 8190,
      villaOver30Year: 7644,
      singleHouse: 5070,
    },
    askCount: 36,
    minPriceDisplay: "10.4억",
    minInvestmentDisplay: "7.1억",
    estimatedPremiumDisplay: "4.8억~5.5억",
    calcMetrics: {
      "estimatedProportionRate": 108,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 54000,
      "unionPrice84Manwon": 68000,
      "generalPrice59Manwon": 84000,
      "generalPrice84Manwon": 108000,
      "expectedNewAptPrice84Manwon": 132000
},
    nearestStation: "외대앞역 (1호선) 도보 4분 · 신이문역 (1호선) 도보 7분",
    walkMinutes: 4,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2020.11.25" },
      { name: "건축심의", isCompleted: true, isCurrent: false },
      { name: "사업시행인가", isCompleted: true, isCurrent: false },
      { name: "관리처분인가", isCompleted: true, isCurrent: false },
      { name: "이주철거", isCompleted: true, isCurrent: false },
      { name: "착공", isCompleted: true, isCurrent: true },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-imun-1-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 동대문구 이문동 257-42 2층",
        tradePriceManwon: 112000,
        tradePriceDisplay: "11.2억",
        officialPriceManwon: 39200,
        officialPriceDisplay: "3.9억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 7800,
      },
    ],
    notices: [
      {
        id: "nt-imun-1-1",
        title: "이문1구역 (래미안 라그란데) 정비사업 인허가 및 공사 진행 현황 고시",
        org: "동대문구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "imun-3",
    name: "이문3구역 (이문 아이파크자이)",
    type: "재개발",
    status: "착공",
    statusDate: "2023.10.20",
    region: "서울",
    district: "동대문구",
    address: "서울특별시 동대문구 이문동 149-8 일대",
    lat: 37.596,
    lng: 127.0655,
    polygon: [
      {
            "lat": 37.596286,
            "lng": 127.06758
      },
      {
            "lat": 37.596882,
            "lng": 127.066621
      },
      {
            "lat": 37.597276,
            "lng": 127.065728
      },
      {
            "lat": 37.597062,
            "lng": 127.064734
      },
      {
            "lat": 37.596487,
            "lng": 127.064143
      },
      {
            "lat": 37.595797,
            "lng": 127.064025
      },
      {
            "lat": 37.595203,
            "lng": 127.064486
      },
      {
            "lat": 37.594853,
            "lng": 127.065295
      },
      {
            "lat": 37.595047,
            "lng": 127.066187
      },
      {
            "lat": 37.595548,
            "lng": 127.066758
      }
],
    totalUnits: 4321,
    ownersCount: 2280,
    generalUnits: 1483,
    rentalUnits: 558,
    generalRatio: 34,
    builder: "HDC현대산업개발 · GS건설",
    zoneAreaM2: 158000,
    far: 440,
    bcr: 25,
    maxFloor: 41,
    totalBuildings: 25,
    recentTradePriceDisplay: "12.8억",
    avgLandPricePerPyeongManwon: 8400,
    pricePerPyeongByAge: {
      villa11To30Year: 8820,
      villaOver30Year: 8232,
      singleHouse: 5460,
    },
    askCount: 52,
    minPriceDisplay: "11.6억",
    minInvestmentDisplay: "8.2억",
    estimatedPremiumDisplay: "5.2억~6.2억",
    calcMetrics: {
      "estimatedProportionRate": 109,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 57000,
      "unionPrice84Manwon": 72000,
      "generalPrice59Manwon": 89000,
      "generalPrice84Manwon": 115000,
      "expectedNewAptPrice84Manwon": 140000
},
    nearestStation: "외대앞역 (1호선) 초역세권 (도보 1분)",
    walkMinutes: 1,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2020.11.25" },
      { name: "건축심의", isCompleted: true, isCurrent: false },
      { name: "사업시행인가", isCompleted: true, isCurrent: false },
      { name: "관리처분인가", isCompleted: true, isCurrent: false },
      { name: "이주철거", isCompleted: true, isCurrent: false },
      { name: "착공", isCompleted: true, isCurrent: true },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-imun-3-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 동대문구 이문동 149-8 2층",
        tradePriceManwon: 128000,
        tradePriceDisplay: "12.8억",
        officialPriceManwon: 44800,
        officialPriceDisplay: "4.5억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 8400,
      },
    ],
    notices: [
      {
        id: "nt-imun-3-1",
        title: "이문3구역 (이문 아이파크자이) 정비사업 인허가 및 공사 진행 현황 고시",
        org: "동대문구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "imun-4",
    name: "이문4구역",
    type: "재개발",
    status: "사업시행인가",
    statusDate: "2023.02.16",
    region: "서울",
    district: "동대문구",
    address: "서울특별시 동대문구 이문동 86-1 일대",
    lat: 37.5995,
    lng: 127.0685,
    polygon: [
      {
            "lat": 37.599257,
            "lng": 127.070201
      },
      {
            "lat": 37.60007,
            "lng": 127.069783
      },
      {
            "lat": 37.600821,
            "lng": 127.068907
      },
      {
            "lat": 37.600543,
            "lng": 127.067498
      },
      {
            "lat": 37.599765,
            "lng": 127.066643
      },
      {
            "lat": 37.598734,
            "lng": 127.066776
      },
      {
            "lat": 37.597971,
            "lng": 127.068028
      },
      {
            "lat": 37.598349,
            "lng": 127.069606
      }
],
    totalUnits: 3628,
    ownersCount: 1480,
    generalUnits: 1540,
    rentalUnits: 608,
    generalRatio: 42,
    builder: "롯데건설 · 현대건설 컨소시엄",
    zoneAreaM2: 149856,
    far: 317,
    bcr: 22,
    maxFloor: 40,
    totalBuildings: 22,
    recentTradePriceDisplay: "8.9억",
    avgLandPricePerPyeongManwon: 6900,
    pricePerPyeongByAge: {
      villa11To30Year: 7245,
      villaOver30Year: 6762,
      singleHouse: 4485,
    },
    askCount: 45,
    minPriceDisplay: "8.1억",
    minInvestmentDisplay: "5.4억",
    estimatedPremiumDisplay: "3.6억~4.4억",
    calcMetrics: {
      "estimatedProportionRate": 107,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 53000,
      "unionPrice84Manwon": 67000,
      "generalPrice59Manwon": 82000,
      "generalPrice84Manwon": 105000,
      "expectedNewAptPrice84Manwon": 135000
},
    nearestStation: "신이문역 (1호선) 도보 3분 · 중랑천 수변 산책로",
    walkMinutes: 3,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2020.11.25" },
      { name: "건축심의", isCompleted: true, isCurrent: false },
      { name: "사업시행인가", isCompleted: true, isCurrent: true },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-imun-4-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 동대문구 이문동 86-1 2층",
        tradePriceManwon: 89000,
        tradePriceDisplay: "8.9억",
        officialPriceManwon: 31150,
        officialPriceDisplay: "3.1억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 6900,
      },
    ],
    notices: [
      {
        id: "nt-imun-4-1",
        title: "이문4구역 정비사업 인허가 및 공사 진행 현황 고시",
        org: "동대문구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "hwigyeong-3",
    name: "휘경3구역 (휘경자이 디센시아)",
    type: "재개발",
    status: "착공",
    statusDate: "2023.04.10",
    region: "서울",
    district: "동대문구",
    address: "서울특별시 동대문구 휘경동 172 일대",
    lat: 37.5915,
    lng: 127.0695,
    polygon: [
      {
            "lat": 37.591511,
            "lng": 127.071052
      },
      {
            "lat": 37.592087,
            "lng": 127.070722
      },
      {
            "lat": 37.592882,
            "lng": 127.07034
      },
      {
            "lat": 37.593076,
            "lng": 127.069171
      },
      {
            "lat": 37.592492,
            "lng": 127.068305
      },
      {
            "lat": 37.591931,
            "lng": 127.067426
      },
      {
            "lat": 37.591059,
            "lng": 127.067518
      },
      {
            "lat": 37.590657,
            "lng": 127.068522
      },
      {
            "lat": 37.590229,
            "lng": 127.069267
      },
      {
            "lat": 37.590176,
            "lng": 127.070346
      },
      {
            "lat": 37.590709,
            "lng": 127.071213
      }
],
    totalUnits: 1806,
    ownersCount: 790,
    generalUnits: 710,
    rentalUnits: 306,
    generalRatio: 39,
    builder: "GS건설 (휘경자이 디센시아)",
    zoneAreaM2: 64500,
    far: 299,
    bcr: 20,
    maxFloor: 35,
    totalBuildings: 14,
    recentTradePriceDisplay: "10.5억",
    avgLandPricePerPyeongManwon: 7400,
    pricePerPyeongByAge: {
      villa11To30Year: 7770,
      villaOver30Year: 7252,
      singleHouse: 4810,
    },
    askCount: 29,
    minPriceDisplay: "9.8억",
    minInvestmentDisplay: "6.5억",
    estimatedPremiumDisplay: "4.2억~5.0억",
    calcMetrics: {
      "estimatedProportionRate": 107,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 52000,
      "unionPrice84Manwon": 66000,
      "generalPrice59Manwon": 81000,
      "generalPrice84Manwon": 102000,
      "expectedNewAptPrice84Manwon": 128000
},
    nearestStation: "회기역 (1·경의중앙·경춘) · 외대앞역 더블역세권",
    walkMinutes: 3,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2020.11.25" },
      { name: "건축심의", isCompleted: true, isCurrent: false },
      { name: "사업시행인가", isCompleted: true, isCurrent: false },
      { name: "관리처분인가", isCompleted: true, isCurrent: false },
      { name: "이주철거", isCompleted: true, isCurrent: false },
      { name: "착공", isCompleted: true, isCurrent: true },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-hwigyeong-3-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 동대문구 휘경동 172 2층",
        tradePriceManwon: 105000,
        tradePriceDisplay: "10.5억",
        officialPriceManwon: 36750,
        officialPriceDisplay: "3.7억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 7400,
      },
    ],
    notices: [
      {
        id: "nt-hwigyeong-3-1",
        title: "휘경3구역 (휘경자이 디센시아) 정비사업 인허가 및 공사 진행 현황 고시",
        org: "동대문구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "jeonnong-8",
    name: "전농8구역",
    type: "재개발",
    status: "건축심의",
    statusDate: "2024.03.14",
    region: "서울",
    district: "동대문구",
    address: "서울특별시 동대문구 전농동 204 일대",
    lat: 37.5835,
    lng: 127.0625,
    polygon: [
      {
            "lat": 37.583405,
            "lng": 127.064588
      },
      {
            "lat": 37.58418,
            "lng": 127.063666
      },
      {
            "lat": 37.584734,
            "lng": 127.062626
      },
      {
            "lat": 37.584612,
            "lng": 127.061048
      },
      {
            "lat": 37.583593,
            "lng": 127.060454
      },
      {
            "lat": 37.582649,
            "lng": 127.06104
      },
      {
            "lat": 37.582136,
            "lng": 127.062361
      },
      {
            "lat": 37.582506,
            "lng": 127.063798
      }
],
    totalUnits: 1750,
    ownersCount: 680,
    generalUnits: 790,
    rentalUnits: 280,
    generalRatio: 45,
    builder: "롯데건설 (롯데캐슬 르베르)",
    zoneAreaM2: 93700,
    far: 280,
    bcr: 21,
    maxFloor: 32,
    totalBuildings: 15,
    recentTradePriceDisplay: "8.2억",
    avgLandPricePerPyeongManwon: 6400,
    pricePerPyeongByAge: {
      villa11To30Year: 6720,
      villaOver30Year: 6272,
      singleHouse: 4160,
    },
    askCount: 38,
    minPriceDisplay: "7.5억",
    minInvestmentDisplay: "4.9억",
    estimatedPremiumDisplay: "3.2억~3.9억",
    calcMetrics: {
      "estimatedProportionRate": 106,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 50000,
      "unionPrice84Manwon": 63000,
      "generalPrice59Manwon": 77000,
      "generalPrice84Manwon": 99000,
      "expectedNewAptPrice84Manwon": 125000
},
    nearestStation: "청량리역 (1호선·수도권광역급행철도) 도보 8분",
    walkMinutes: 8,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2020.11.25" },
      { name: "건축심의", isCompleted: true, isCurrent: true },
      { name: "사업시행인가", isCompleted: false, isCurrent: false },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-jeonnong-8-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 동대문구 전농동 204 2층",
        tradePriceManwon: 82000,
        tradePriceDisplay: "8.2억",
        officialPriceManwon: 28700,
        officialPriceDisplay: "2.9억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 6400,
      },
    ],
    notices: [
      {
        id: "nt-jeonnong-8-1",
        title: "전농8구역 정비사업 인허가 및 공사 진행 현황 고시",
        org: "동대문구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "jeonnong-9",
    name: "전농9구역 (공공재개발)",
    type: "신속통합기획",
    status: "조합설립인가",
    statusDate: "2023.12.28",
    region: "서울",
    district: "동대문구",
    address: "서울특별시 동대문구 전농동 103-236 일대",
    lat: 37.581,
    lng: 127.0585,
    polygon: [
      {
            "lat": 37.581072,
            "lng": 127.060098
      },
      {
            "lat": 37.581997,
            "lng": 127.059424
      },
      {
            "lat": 37.582292,
            "lng": 127.05844
      },
      {
            "lat": 37.582046,
            "lng": 127.057335
      },
      {
            "lat": 37.580928,
            "lng": 127.056918
      },
      {
            "lat": 37.579973,
            "lng": 127.057548
      },
      {
            "lat": 37.579715,
            "lng": 127.05856
      },
      {
            "lat": 37.580194,
            "lng": 127.059398
      }
],
    totalUnits: 1159,
    ownersCount: 520,
    generalUnits: 430,
    rentalUnits: 209,
    generalRatio: 37,
    builder: "LH · 현대건설",
    zoneAreaM2: 50000,
    far: 300,
    bcr: 23,
    maxFloor: 35,
    totalBuildings: 9,
    recentTradePriceDisplay: "7.3억",
    avgLandPricePerPyeongManwon: 6100,
    pricePerPyeongByAge: {
      villa11To30Year: 6405,
      villaOver30Year: 5978,
      singleHouse: 3965,
    },
    askCount: 25,
    minPriceDisplay: "6.7억",
    minInvestmentDisplay: "4.2억",
    estimatedPremiumDisplay: "2.8억~3.5억",
    calcMetrics: {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 49000,
      "unionPrice84Manwon": 62000,
      "generalPrice59Manwon": 75000,
      "generalPrice84Manwon": 96000,
      "expectedNewAptPrice84Manwon": 122000
},
    nearestStation: "청량리역 도보 5분 (GTX-B·C 환승센터)",
    walkMinutes: 5,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: true, date: "2020.11.25" },
      { name: "건축심의", isCompleted: false, isCurrent: false },
      { name: "사업시행인가", isCompleted: false, isCurrent: false },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-jeonnong-9-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 동대문구 전농동 103-236 2층",
        tradePriceManwon: 73000,
        tradePriceDisplay: "7.3억",
        officialPriceManwon: 25550,
        officialPriceDisplay: "2.6억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 6100,
      },
    ],
    notices: [
      {
        id: "nt-jeonnong-9-1",
        title: "전농9구역 (공공재개발) 정비사업 인허가 및 공사 진행 현황 고시",
        org: "동대문구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "cheongnyangni-6",
    name: "청량리6구역",
    type: "재개발",
    status: "사업시행인가",
    statusDate: "2024.02.20",
    region: "서울",
    district: "동대문구",
    address: "서울특별시 동대문구 청량리동 205 일대",
    lat: 37.589,
    lng: 127.0485,
    polygon: [
      {
            "lat": 37.588669,
            "lng": 127.050563
      },
      {
            "lat": 37.589538,
            "lng": 127.049957
      },
      {
            "lat": 37.590311,
            "lng": 127.049266
      },
      {
            "lat": 37.590305,
            "lng": 127.04793
      },
      {
            "lat": 37.589565,
            "lng": 127.047266
      },
      {
            "lat": 37.588847,
            "lng": 127.046839
      },
      {
            "lat": 37.587921,
            "lng": 127.047108
      },
      {
            "lat": 37.587547,
            "lng": 127.048405
      },
      {
            "lat": 37.587823,
            "lng": 127.049757
      }
],
    totalUnits: 1493,
    ownersCount: 680,
    generalUnits: 580,
    rentalUnits: 233,
    generalRatio: 39,
    builder: "GS건설 (자이)",
    zoneAreaM2: 83000,
    far: 260,
    bcr: 21,
    maxFloor: 28,
    totalBuildings: 16,
    recentTradePriceDisplay: "8.6억",
    avgLandPricePerPyeongManwon: 6700,
    pricePerPyeongByAge: {
      villa11To30Year: 7035,
      villaOver30Year: 6566,
      singleHouse: 4355,
    },
    askCount: 32,
    minPriceDisplay: "7.9억",
    minInvestmentDisplay: "5.1억",
    estimatedPremiumDisplay: "3.5억~4.3억",
    calcMetrics: {
      "estimatedProportionRate": 106,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 51000,
      "unionPrice84Manwon": 65000,
      "generalPrice59Manwon": 79000,
      "generalPrice84Manwon": 102000,
      "expectedNewAptPrice84Manwon": 130000
},
    nearestStation: "청량리역 도보 7분 · 고려대역 도보 8분",
    walkMinutes: 7,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2020.11.25" },
      { name: "건축심의", isCompleted: true, isCurrent: false },
      { name: "사업시행인가", isCompleted: true, isCurrent: true },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-cheongnyangni-6-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 동대문구 청량리동 205 2층",
        tradePriceManwon: 86000,
        tradePriceDisplay: "8.6억",
        officialPriceManwon: 30100,
        officialPriceDisplay: "3.0억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 6700,
      },
    ],
    notices: [
      {
        id: "nt-cheongnyangni-6-1",
        title: "청량리6구역 정비사업 인허가 및 공사 진행 현황 고시",
        org: "동대문구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "cheongnyangni-7",
    name: "청량리7구역 (롯데캐슬 하이루체)",
    type: "재개발",
    status: "착공",
    statusDate: "2023.07.15",
    region: "서울",
    district: "동대문구",
    address: "서울특별시 동대문구 청량리동 199 일대",
    lat: 37.587,
    lng: 127.046,
    polygon: [
      {
            "lat": 37.587242,
            "lng": 127.048185
      },
      {
            "lat": 37.588132,
            "lng": 127.047676
      },
      {
            "lat": 37.588324,
            "lng": 127.0463
      },
      {
            "lat": 37.588088,
            "lng": 127.045152
      },
      {
            "lat": 37.587502,
            "lng": 127.04449
      },
      {
            "lat": 37.586753,
            "lng": 127.043767
      },
      {
            "lat": 37.586089,
            "lng": 127.044652
      },
      {
            "lat": 37.585536,
            "lng": 127.045668
      },
      {
            "lat": 37.585663,
            "lng": 127.047043
      },
      {
            "lat": 37.586367,
            "lng": 127.0479
      }
],
    totalUnits: 761,
    ownersCount: 380,
    generalUnits: 247,
    rentalUnits: 134,
    generalRatio: 32,
    builder: "롯데건설 (롯데캐슬 하이루체)",
    zoneAreaM2: 34500,
    far: 242,
    bcr: 20,
    maxFloor: 18,
    totalBuildings: 9,
    recentTradePriceDisplay: "9.5억",
    avgLandPricePerPyeongManwon: 7100,
    pricePerPyeongByAge: {
      villa11To30Year: 7455,
      villaOver30Year: 6958,
      singleHouse: 4615,
    },
    askCount: 22,
    minPriceDisplay: "8.8억",
    minInvestmentDisplay: "5.7억",
    estimatedPremiumDisplay: "3.8억~4.6억",
    calcMetrics: {
      "estimatedProportionRate": 107,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 52000,
      "unionPrice84Manwon": 66000,
      "generalPrice59Manwon": 82000,
      "generalPrice84Manwon": 104000,
      "expectedNewAptPrice84Manwon": 132000
},
    nearestStation: "청량리역 도보 6분",
    walkMinutes: 6,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2020.11.25" },
      { name: "건축심의", isCompleted: true, isCurrent: false },
      { name: "사업시행인가", isCompleted: true, isCurrent: false },
      { name: "관리처분인가", isCompleted: true, isCurrent: false },
      { name: "이주철거", isCompleted: true, isCurrent: false },
      { name: "착공", isCompleted: true, isCurrent: true },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-cheongnyangni-7-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 동대문구 청량리동 199 2층",
        tradePriceManwon: 95000,
        tradePriceDisplay: "9.5억",
        officialPriceManwon: 33250,
        officialPriceDisplay: "3.3억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 7100,
      },
    ],
    notices: [
      {
        id: "nt-cheongnyangni-7-1",
        title: "청량리7구역 (롯데캐슬 하이루체) 정비사업 인허가 및 공사 진행 현황 고시",
        org: "동대문구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "jangwi-4",
    name: "장위4구역 (장위자이 레디언트)",
    type: "재개발",
    status: "착공",
    statusDate: "2023.01.20",
    region: "서울",
    district: "성북구",
    address: "서울특별시 성북구 장위동 62-1 일대",
    lat: 37.6155,
    lng: 127.058,
    polygon: [
      {
            "lat": 37.615496,
            "lng": 127.059558
      },
      {
            "lat": 37.616295,
            "lng": 127.059532
      },
      {
            "lat": 37.616901,
            "lng": 127.058794
      },
      {
            "lat": 37.61698,
            "lng": 127.057743
      },
      {
            "lat": 37.616656,
            "lng": 127.056774
      },
      {
            "lat": 37.615869,
            "lng": 127.056468
      },
      {
            "lat": 37.615114,
            "lng": 127.056365
      },
      {
            "lat": 37.614594,
            "lng": 127.057028
      },
      {
            "lat": 37.614064,
            "lng": 127.057741
      },
      {
            "lat": 37.614066,
            "lng": 127.0588
      },
      {
            "lat": 37.614788,
            "lng": 127.059355
      }
],
    totalUnits: 2840,
    ownersCount: 960,
    generalUnits: 1330,
    rentalUnits: 550,
    generalRatio: 47,
    builder: "GS건설 (장위자이 레디언트)",
    zoneAreaM2: 153000,
    far: 262,
    bcr: 20,
    maxFloor: 31,
    totalBuildings: 31,
    recentTradePriceDisplay: "10.8억",
    avgLandPricePerPyeongManwon: 7200,
    pricePerPyeongByAge: {
      villa11To30Year: 7560,
      villaOver30Year: 7056,
      singleHouse: 4680,
    },
    askCount: 44,
    minPriceDisplay: "9.9억",
    minInvestmentDisplay: "6.8억",
    estimatedPremiumDisplay: "4.1억~4.9억",
    calcMetrics: {
      "estimatedProportionRate": 108,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 53000,
      "unionPrice84Manwon": 67000,
      "generalPrice59Manwon": 82000,
      "generalPrice84Manwon": 105000,
      "expectedNewAptPrice84Manwon": 135000
},
    nearestStation: "돌곶이역 (6호선) 도보 2분 · 석계역 도보 9분",
    walkMinutes: 2,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2020.11.25" },
      { name: "건축심의", isCompleted: true, isCurrent: false },
      { name: "사업시행인가", isCompleted: true, isCurrent: false },
      { name: "관리처분인가", isCompleted: true, isCurrent: false },
      { name: "이주철거", isCompleted: true, isCurrent: false },
      { name: "착공", isCompleted: true, isCurrent: true },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-jangwi-4-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 성북구 장위동 62-1 2층",
        tradePriceManwon: 108000,
        tradePriceDisplay: "10.8억",
        officialPriceManwon: 37800,
        officialPriceDisplay: "3.8억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 7200,
      },
    ],
    notices: [
      {
        id: "nt-jangwi-4-1",
        title: "장위4구역 (장위자이 레디언트) 정비사업 인허가 및 공사 진행 현황 고시",
        org: "성북구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "jangwi-10",
    name: "장위10구역",
    type: "재개발",
    status: "관리처분인가",
    statusDate: "2023.11.10",
    region: "서울",
    district: "성북구",
    address: "서울특별시 성북구 장위동 68-37 일대",
    lat: 37.6105,
    lng: 127.0515,
    polygon: [
      {
            "lat": 37.610659,
            "lng": 127.053221
      },
      {
            "lat": 37.611232,
            "lng": 127.052615
      },
      {
            "lat": 37.611669,
            "lng": 127.051811
      },
      {
            "lat": 37.611854,
            "lng": 127.050555
      },
      {
            "lat": 37.611081,
            "lng": 127.049936
      },
      {
            "lat": 37.610352,
            "lng": 127.049896
      },
      {
            "lat": 37.609616,
            "lng": 127.050153
      },
      {
            "lat": 37.609458,
            "lng": 127.051223
      },
      {
            "lat": 37.609557,
            "lng": 127.052158
      },
      {
            "lat": 37.609836,
            "lng": 127.053287
      }
],
    totalUnits: 2004,
    ownersCount: 890,
    generalUnits: 780,
    rentalUnits: 334,
    generalRatio: 39,
    builder: "대우건설 (푸르지오 마크원)",
    zoneAreaM2: 94000,
    far: 263,
    bcr: 21,
    maxFloor: 32,
    totalBuildings: 20,
    recentTradePriceDisplay: "8.5억",
    avgLandPricePerPyeongManwon: 6600,
    pricePerPyeongByAge: {
      villa11To30Year: 6930,
      villaOver30Year: 6468,
      singleHouse: 4290,
    },
    askCount: 38,
    minPriceDisplay: "7.8억",
    minInvestmentDisplay: "5.2억",
    estimatedPremiumDisplay: "3.4억~4.1억",
    calcMetrics: {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 51000,
      "unionPrice84Manwon": 64000,
      "generalPrice59Manwon": 78000,
      "generalPrice84Manwon": 100000,
      "expectedNewAptPrice84Manwon": 128000
},
    nearestStation: "돌곶이역 (6호선) 도보 5분",
    walkMinutes: 5,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: false, date: "2020.11.25" },
      { name: "건축심의", isCompleted: true, isCurrent: false },
      { name: "사업시행인가", isCompleted: true, isCurrent: false },
      { name: "관리처분인가", isCompleted: true, isCurrent: true },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-jangwi-10-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 성북구 장위동 68-37 2층",
        tradePriceManwon: 85000,
        tradePriceDisplay: "8.5억",
        officialPriceManwon: 29750,
        officialPriceDisplay: "3.0억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 6600,
      },
    ],
    notices: [
      {
        id: "nt-jangwi-10-1",
        title: "장위10구역 정비사업 인허가 및 공사 진행 현황 고시",
        org: "성북구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
  {
    id: "seokgwan-1",
    name: "석관1구역 (모아타운)",
    type: "모아타운",
    status: "조합설립인가",
    statusDate: "2024.01.18",
    region: "서울",
    district: "성북구",
    address: "서울특별시 성북구 석관동 1-39 일대",
    lat: 37.6075,
    lng: 127.0685,
    polygon: [
      {
            "lat": 37.607608,
            "lng": 127.070794
      },
      {
            "lat": 37.608269,
            "lng": 127.070067
      },
      {
            "lat": 37.608622,
            "lng": 127.069138
      },
      {
            "lat": 37.608534,
            "lng": 127.068157
      },
      {
            "lat": 37.608364,
            "lng": 127.067181
      },
      {
            "lat": 37.607746,
            "lng": 127.066772
      },
      {
            "lat": 37.607118,
            "lng": 127.066937
      },
      {
            "lat": 37.606334,
            "lng": 127.067169
      },
      {
            "lat": 37.606371,
            "lng": 127.068377
      },
      {
            "lat": 37.60619,
            "lng": 127.069592
      },
      {
            "lat": 37.606871,
            "lng": 127.070259
      }
],
    totalUnits: 1240,
    ownersCount: 560,
    generalUnits: 510,
    rentalUnits: 170,
    generalRatio: 41,
    builder: "코오롱글로벌 (하늘채)",
    zoneAreaM2: 58000,
    far: 250,
    bcr: 22,
    maxFloor: 25,
    totalBuildings: 10,
    recentTradePriceDisplay: "5.8억",
    avgLandPricePerPyeongManwon: 5100,
    pricePerPyeongByAge: {
      villa11To30Year: 5355,
      villaOver30Year: 4998,
      singleHouse: 3315,
    },
    askCount: 27,
    minPriceDisplay: "5.2억",
    minInvestmentDisplay: "3.1억",
    estimatedPremiumDisplay: "2.1억~2.8억",
    calcMetrics: {
      "estimatedProportionRate": 104,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 47000,
      "unionPrice84Manwon": 60000,
      "generalPrice59Manwon": 71000,
      "generalPrice84Manwon": 91000,
      "expectedNewAptPrice84Manwon": 114000
},
    nearestStation: "석계역·돌곶이역 더블역세권",
    walkMinutes: 5,
    stages: [
      { name: "정비구역지정", isCompleted: true, isCurrent: false, date: "2018.06.10" },
      { name: "조합설립인가", isCompleted: true, isCurrent: true, date: "2020.11.25" },
      { name: "건축심의", isCompleted: false, isCurrent: false },
      { name: "사업시행인가", isCompleted: false, isCurrent: false },
      { name: "관리처분인가", isCompleted: false, isCurrent: false },
      { name: "이주철거", isCompleted: false, isCurrent: false },
      { name: "착공", isCompleted: false, isCurrent: false },
      { name: "일반분양", isCompleted: false, isCurrent: false },
      { name: "준공", isCompleted: false, isCurrent: false },
    ],
    transactions: [
      {
        id: "tx-seokgwan-1-1",
        date: "2026.08.12",
        type: "다세대",
        builtYear: 2005,
        addressDetail: "서울특별시 성북구 석관동 1-39 2층",
        tradePriceManwon: 58000,
        tradePriceDisplay: "5.8억",
        officialPriceManwon: 20300,
        officialPriceDisplay: "2.0억",
        landPyeong: 11.5,
        exclusivePyeong: 16.8,
        landPricePerPyeongManwon: 5100,
      },
    ],
    notices: [
      {
        id: "nt-seokgwan-1-1",
        title: "석관1구역 (모아타운) 정비사업 인허가 및 공사 진행 현황 고시",
        org: "성북구청 고시",
        date: "2024.04.10",
        type: "고시",
      },
    ],
  },
];
