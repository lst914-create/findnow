import { RedevelopmentZone } from "./redevelopment";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 전국 정비사업 추가 구역 데이터 - 공공데이터 기반 실제 정비사업 구역 (전국 시도별)
// 출처: 국토교통부 정비사업 정보몽땅, 서울시 정비사업 현황, 각 지자체 고시

export const NATIONWIDE_EXTRA_DATA: RedevelopmentZone[] = [
  {
    "id": "nowon-sanggye-1",
    "name": "상계1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2020.06.15",
    "region": "서울",
    "district": "노원구",
    "address": "서울특별시 노원구 상계동 204-54 일대",
    "lat": 37.6599,
    "lng": 127.0624,
    "polygon": [
      {
        "lat": 37.659638,
        "lng": 127.064528
      },
      {
        "lat": 37.660748,
        "lng": 127.063865
      },
      {
        "lat": 37.661226,
        "lng": 127.06266
      },
      {
        "lat": 37.661466,
        "lng": 127.060955
      },
      {
        "lat": 37.660127,
        "lng": 127.060561
      },
      {
        "lat": 37.658866,
        "lng": 127.060613
      },
      {
        "lat": 37.658151,
        "lng": 127.062057
      },
      {
        "lat": 37.658751,
        "lng": 127.06346
      }
    ],
    "totalUnits": 1854,
    "ownersCount": 892,
    "generalUnits": 723,
    "rentalUnits": 239,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 142000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 12,
    "recentTradePriceDisplay": "50.4억",
    "avgLandPricePerPyeongManwon": 4200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4410,
      "villaOver30Year": 3990,
      "singleHouse": 1470
    },
    "askCount": 10,
    "minPriceDisplay": "46.2억",
    "minInvestmentDisplay": "29.4억",
    "estimatedPremiumDisplay": "16.8억~25.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 25200,
      "unionPrice84Manwon": 33600,
      "generalPrice59Manwon": 33600,
      "generalPrice84Manwon": 46200,
      "expectedNewAptPrice84Manwon": 58800
    },
    "nearestStation": "당고개역 (4호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2020.06.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2020.06.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2020.06.15"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "nowon-sanggye-2",
    "name": "상계2구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.11.08",
    "region": "서울",
    "district": "노원구",
    "address": "서울특별시 노원구 상계동 136-2 일대",
    "lat": 37.6558,
    "lng": 127.0602,
    "polygon": [
      {
        "lat": 37.655802,
        "lng": 127.06201
      },
      {
        "lat": 37.656731,
        "lng": 127.061494
      },
      {
        "lat": 37.657859,
        "lng": 127.060622
      },
      {
        "lat": 37.657175,
        "lng": 127.05927
      },
      {
        "lat": 37.656444,
        "lng": 127.058124
      },
      {
        "lat": 37.655145,
        "lng": 127.058105
      },
      {
        "lat": 37.654471,
        "lng": 127.059306
      },
      {
        "lat": 37.65433,
        "lng": 127.060505
      },
      {
        "lat": 37.654383,
        "lng": 127.062177
      }
    ],
    "totalUnits": 2412,
    "ownersCount": 1045,
    "generalUnits": 985,
    "rentalUnits": 382,
    "generalRatio": 41,
    "builder": "HDC현대산업개발",
    "zoneAreaM2": 165000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 16,
    "recentTradePriceDisplay": "54.0억",
    "avgLandPricePerPyeongManwon": 4500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4725,
      "villaOver30Year": 4275,
      "singleHouse": 1575
    },
    "askCount": 10,
    "minPriceDisplay": "49.5억",
    "minInvestmentDisplay": "31.5억",
    "estimatedPremiumDisplay": "18.0억~27.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 27000,
      "unionPrice84Manwon": 36000,
      "generalPrice59Manwon": 36000,
      "generalPrice84Manwon": 49500,
      "expectedNewAptPrice84Manwon": 63000
    },
    "nearestStation": "노원역 (7호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.08"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.08"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.08"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.11.08"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "nowon-sanggye-3",
    "name": "상계3구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.03.10",
    "region": "서울",
    "district": "노원구",
    "address": "서울특별시 노원구 상계동 1039-1 일대",
    "lat": 37.6541,
    "lng": 127.0588,
    "polygon": [
      {
        "lat": 37.653992,
        "lng": 127.060192
      },
      {
        "lat": 37.655009,
        "lng": 127.060532
      },
      {
        "lat": 37.655336,
        "lng": 127.059401
      },
      {
        "lat": 37.655657,
        "lng": 127.058391
      },
      {
        "lat": 37.65516,
        "lng": 127.05741
      },
      {
        "lat": 37.654214,
        "lng": 127.057325
      },
      {
        "lat": 37.653451,
        "lng": 127.057563
      },
      {
        "lat": 37.652383,
        "lng": 127.057965
      },
      {
        "lat": 37.652527,
        "lng": 127.059213
      },
      {
        "lat": 37.653197,
        "lng": 127.059985
      }
    ],
    "totalUnits": 1643,
    "ownersCount": 756,
    "generalUnits": 643,
    "rentalUnits": 254,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 118000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "49.2억",
    "avgLandPricePerPyeongManwon": 4100,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4305,
      "villaOver30Year": 3895,
      "singleHouse": 1435
    },
    "askCount": 10,
    "minPriceDisplay": "45.1억",
    "minInvestmentDisplay": "28.7억",
    "estimatedPremiumDisplay": "16.4억~24.6억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 24600,
      "unionPrice84Manwon": 32800,
      "generalPrice59Manwon": 32800,
      "generalPrice84Manwon": 45100,
      "expectedNewAptPrice84Manwon": 57400
    },
    "nearestStation": "마들역 (7호선) 도보 6분",
    "walkMinutes": 6,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.03.10"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.03.10"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.03.10"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "nowon-sanggye-4",
    "name": "상계4구역",
    "type": "재개발",
    "status": "정비구역지정",
    "statusDate": "2022.08.25",
    "region": "서울",
    "district": "노원구",
    "address": "서울특별시 노원구 상계동 1062 일대",
    "lat": 37.6522,
    "lng": 127.0571,
    "polygon": [
      {
        "lat": 37.652041,
        "lng": 127.0593
      },
      {
        "lat": 37.652673,
        "lng": 127.058609
      },
      {
        "lat": 37.653292,
        "lng": 127.058132
      },
      {
        "lat": 37.653486,
        "lng": 127.057041
      },
      {
        "lat": 37.653053,
        "lng": 127.056182
      },
      {
        "lat": 37.652591,
        "lng": 127.055643
      },
      {
        "lat": 37.651945,
        "lng": 127.054797
      },
      {
        "lat": 37.651329,
        "lng": 127.055611
      },
      {
        "lat": 37.651139,
        "lng": 127.056663
      },
      {
        "lat": 37.650873,
        "lng": 127.057779
      },
      {
        "lat": 37.651475,
        "lng": 127.058496
      }
    ],
    "totalUnits": 987,
    "ownersCount": 453,
    "generalUnits": 385,
    "rentalUnits": 149,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 75000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 6,
    "recentTradePriceDisplay": "46.8억",
    "avgLandPricePerPyeongManwon": 3900,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4095,
      "villaOver30Year": 3705,
      "singleHouse": 1365
    },
    "askCount": 10,
    "minPriceDisplay": "42.9억",
    "minInvestmentDisplay": "27.3억",
    "estimatedPremiumDisplay": "15.6억~23.4억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 23400,
      "unionPrice84Manwon": 31200,
      "generalPrice59Manwon": 31200,
      "generalPrice84Manwon": 42900,
      "expectedNewAptPrice84Manwon": 54600
    },
    "nearestStation": "마들역 (7호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.08.25"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "nowon-wolgye-1",
    "name": "월계1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2023.04.22",
    "region": "서울",
    "district": "노원구",
    "address": "서울특별시 노원구 월계동 38-18 일대",
    "lat": 37.6268,
    "lng": 127.0548,
    "polygon": [
      {
        "lat": 37.626961,
        "lng": 127.056882
      },
      {
        "lat": 37.627872,
        "lng": 127.056111
      },
      {
        "lat": 37.628287,
        "lng": 127.054946
      },
      {
        "lat": 37.628087,
        "lng": 127.053658
      },
      {
        "lat": 37.627119,
        "lng": 127.053267
      },
      {
        "lat": 37.62612,
        "lng": 127.053027
      },
      {
        "lat": 37.62547,
        "lng": 127.054046
      },
      {
        "lat": 37.625536,
        "lng": 127.055236
      },
      {
        "lat": 37.626026,
        "lng": 127.0562
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 582,
    "generalUnits": 485,
    "rentalUnits": 178,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 96000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "57.6억",
    "avgLandPricePerPyeongManwon": 4800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 5040,
      "villaOver30Year": 4560,
      "singleHouse": 1680
    },
    "askCount": 10,
    "minPriceDisplay": "52.8억",
    "minInvestmentDisplay": "33.6억",
    "estimatedPremiumDisplay": "19.2억~28.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 28800,
      "unionPrice84Manwon": 38400,
      "generalPrice59Manwon": 38400,
      "generalPrice84Manwon": 52800,
      "expectedNewAptPrice84Manwon": 67200
    },
    "nearestStation": "광운대역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.22"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.22"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.22"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.22"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.04.22"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "nowon-wolgye-2",
    "name": "월계2구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.09.14",
    "region": "서울",
    "district": "노원구",
    "address": "서울특별시 노원구 월계동 392-1 일대",
    "lat": 37.6245,
    "lng": 127.0521,
    "polygon": [
      {
        "lat": 37.624479,
        "lng": 127.054071
      },
      {
        "lat": 37.625373,
        "lng": 127.053506
      },
      {
        "lat": 37.625831,
        "lng": 127.052135
      },
      {
        "lat": 37.62527,
        "lng": 127.050939
      },
      {
        "lat": 37.624522,
        "lng": 127.050029
      },
      {
        "lat": 37.623645,
        "lng": 127.050722
      },
      {
        "lat": 37.623396,
        "lng": 127.052071
      },
      {
        "lat": 37.623673,
        "lng": 127.053346
      }
    ],
    "totalUnits": 876,
    "ownersCount": 421,
    "generalUnits": 342,
    "rentalUnits": 113,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 68000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 5,
    "recentTradePriceDisplay": "54.0억",
    "avgLandPricePerPyeongManwon": 4500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4725,
      "villaOver30Year": 4275,
      "singleHouse": 1575
    },
    "askCount": 10,
    "minPriceDisplay": "49.5억",
    "minInvestmentDisplay": "31.5억",
    "estimatedPremiumDisplay": "18.0억~27.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 27000,
      "unionPrice84Manwon": 36000,
      "generalPrice59Manwon": 36000,
      "generalPrice84Manwon": 49500,
      "expectedNewAptPrice84Manwon": 63000
    },
    "nearestStation": "광운대역 (1호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.09.14"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.09.14"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.09.14"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "nowon-junggye",
    "name": "중계본동",
    "type": "재개발",
    "status": "정비구역지정",
    "statusDate": "2023.12.01",
    "region": "서울",
    "district": "노원구",
    "address": "서울특별시 노원구 중계동 453 일대",
    "lat": 37.6412,
    "lng": 127.0742,
    "polygon": [
      {
        "lat": 37.641069,
        "lng": 127.076793
      },
      {
        "lat": 37.642048,
        "lng": 127.075923
      },
      {
        "lat": 37.642515,
        "lng": 127.074689
      },
      {
        "lat": 37.642536,
        "lng": 127.073255
      },
      {
        "lat": 37.641756,
        "lng": 127.072391
      },
      {
        "lat": 37.640849,
        "lng": 127.072381
      },
      {
        "lat": 37.639834,
        "lng": 127.072838
      },
      {
        "lat": 37.639378,
        "lng": 127.074469
      },
      {
        "lat": 37.640256,
        "lng": 127.07562
      }
    ],
    "totalUnits": 1532,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 234,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 118000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "51.6억",
    "avgLandPricePerPyeongManwon": 4300,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4515,
      "villaOver30Year": 4085,
      "singleHouse": 1505
    },
    "askCount": 10,
    "minPriceDisplay": "47.3억",
    "minInvestmentDisplay": "30.1억",
    "estimatedPremiumDisplay": "17.2억~25.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 25800,
      "unionPrice84Manwon": 34400,
      "generalPrice59Manwon": 34400,
      "generalPrice84Manwon": 47300,
      "expectedNewAptPrice84Manwon": 60200
    },
    "nearestStation": "하계역 (7호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.12.01"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "nowon-gongneung",
    "name": "공릉2구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2020.11.28",
    "region": "서울",
    "district": "노원구",
    "address": "서울특별시 노원구 공릉동 112-1 일대",
    "lat": 37.6218,
    "lng": 127.0741,
    "polygon": [
      {
        "lat": 37.621713,
        "lng": 127.075299
      },
      {
        "lat": 37.622328,
        "lng": 127.075386
      },
      {
        "lat": 37.62279,
        "lng": 127.07472
      },
      {
        "lat": 37.622937,
        "lng": 127.073755
      },
      {
        "lat": 37.622366,
        "lng": 127.073207
      },
      {
        "lat": 37.621921,
        "lng": 127.072435
      },
      {
        "lat": 37.621204,
        "lng": 127.072647
      },
      {
        "lat": 37.620983,
        "lng": 127.073589
      },
      {
        "lat": 37.620555,
        "lng": 127.074478
      },
      {
        "lat": 37.620942,
        "lng": 127.075452
      }
    ],
    "totalUnits": 743,
    "ownersCount": 356,
    "generalUnits": 289,
    "rentalUnits": 98,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 57000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 4,
    "recentTradePriceDisplay": "50.4억",
    "avgLandPricePerPyeongManwon": 4200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4410,
      "villaOver30Year": 3990,
      "singleHouse": 1470
    },
    "askCount": 10,
    "minPriceDisplay": "46.2억",
    "minInvestmentDisplay": "29.4억",
    "estimatedPremiumDisplay": "16.8억~25.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 25200,
      "unionPrice84Manwon": 33600,
      "generalPrice59Manwon": 33600,
      "generalPrice84Manwon": 46200,
      "expectedNewAptPrice84Manwon": 58800
    },
    "nearestStation": "태릉입구역 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2020.11.28"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2020.11.28"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2020.11.28"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "dobong-changdong-1",
    "name": "창동1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.07.15",
    "region": "서울",
    "district": "도봉구",
    "address": "서울특별시 도봉구 창동 196-10 일대",
    "lat": 37.6524,
    "lng": 127.0452,
    "polygon": [
      {
        "lat": 37.652757,
        "lng": 127.047802
      },
      {
        "lat": 37.653561,
        "lng": 127.046493
      },
      {
        "lat": 37.654057,
        "lng": 127.04518
      },
      {
        "lat": 37.653651,
        "lng": 127.043756
      },
      {
        "lat": 37.652668,
        "lng": 127.043034
      },
      {
        "lat": 37.651433,
        "lng": 127.042982
      },
      {
        "lat": 37.651197,
        "lng": 127.044625
      },
      {
        "lat": 37.650889,
        "lng": 127.045964
      },
      {
        "lat": 37.651657,
        "lng": 127.046977
      }
    ],
    "totalUnits": 1687,
    "ownersCount": 789,
    "generalUnits": 658,
    "rentalUnits": 229,
    "generalRatio": 39,
    "builder": "대우건설",
    "zoneAreaM2": 128000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "55.2억",
    "avgLandPricePerPyeongManwon": 4600,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4830,
      "villaOver30Year": 4370,
      "singleHouse": 1610
    },
    "askCount": 10,
    "minPriceDisplay": "50.6억",
    "minInvestmentDisplay": "32.2억",
    "estimatedPremiumDisplay": "18.4억~27.6억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 27600,
      "unionPrice84Manwon": 36800,
      "generalPrice59Manwon": 36800,
      "generalPrice84Manwon": 50600,
      "expectedNewAptPrice84Manwon": 64400
    },
    "nearestStation": "창동역 (1·4호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.07.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "dobong-changdong-2",
    "name": "창동2구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.04.08",
    "region": "서울",
    "district": "도봉구",
    "address": "서울특별시 도봉구 창동 205-1 일대",
    "lat": 37.6508,
    "lng": 127.0435,
    "polygon": [
      {
        "lat": 37.650906,
        "lng": 127.044934
      },
      {
        "lat": 37.651695,
        "lng": 127.044698
      },
      {
        "lat": 37.652121,
        "lng": 127.043857
      },
      {
        "lat": 37.652034,
        "lng": 127.042895
      },
      {
        "lat": 37.651611,
        "lng": 127.04194
      },
      {
        "lat": 37.65071,
        "lng": 127.042284
      },
      {
        "lat": 37.649929,
        "lng": 127.042333
      },
      {
        "lat": 37.649587,
        "lng": 127.043173
      },
      {
        "lat": 37.649744,
        "lng": 127.044018
      },
      {
        "lat": 37.650146,
        "lng": 127.044758
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "52.8억",
    "avgLandPricePerPyeongManwon": 4400,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4620,
      "villaOver30Year": 4180,
      "singleHouse": 1540
    },
    "askCount": 10,
    "minPriceDisplay": "48.4억",
    "minInvestmentDisplay": "30.8억",
    "estimatedPremiumDisplay": "17.6억~26.4억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 26400,
      "unionPrice84Manwon": 35200,
      "generalPrice59Manwon": 35200,
      "generalPrice84Manwon": 48400,
      "expectedNewAptPrice84Manwon": 61600
    },
    "nearestStation": "창동역 (1·4호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.04.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.04.08"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.04.08"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "dobong-dobong",
    "name": "도봉1구역",
    "type": "재개발",
    "status": "정비구역지정",
    "statusDate": "2023.05.20",
    "region": "서울",
    "district": "도봉구",
    "address": "서울특별시 도봉구 도봉동 478 일대",
    "lat": 37.6645,
    "lng": 127.0418,
    "polygon": [
      {
        "lat": 37.664745,
        "lng": 127.043141
      },
      {
        "lat": 37.665466,
        "lng": 127.043081
      },
      {
        "lat": 37.665825,
        "lng": 127.042129
      },
      {
        "lat": 37.66536,
        "lng": 127.041269
      },
      {
        "lat": 37.665069,
        "lng": 127.040586
      },
      {
        "lat": 37.664535,
        "lng": 127.039858
      },
      {
        "lat": 37.663796,
        "lng": 127.040112
      },
      {
        "lat": 37.663443,
        "lng": 127.04105
      },
      {
        "lat": 37.663341,
        "lng": 127.041997
      },
      {
        "lat": 37.663519,
        "lng": 127.042969
      },
      {
        "lat": 37.664157,
        "lng": 127.043344
      }
    ],
    "totalUnits": 892,
    "ownersCount": 425,
    "generalUnits": 349,
    "rentalUnits": 118,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 68000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 5,
    "recentTradePriceDisplay": "45.6억",
    "avgLandPricePerPyeongManwon": 3800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3990,
      "villaOver30Year": 3610,
      "singleHouse": 1330
    },
    "askCount": 10,
    "minPriceDisplay": "41.8억",
    "minInvestmentDisplay": "26.6억",
    "estimatedPremiumDisplay": "15.2억~22.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 22800,
      "unionPrice84Manwon": 30400,
      "generalPrice59Manwon": 30400,
      "generalPrice84Manwon": 41800,
      "expectedNewAptPrice84Manwon": 53200
    },
    "nearestStation": "도봉역 (1호선) 도보 6분",
    "walkMinutes": 6,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.05.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "dobong-ssanmun",
    "name": "쌍문동 재개발",
    "type": "재개발",
    "status": "추진위원회승인",
    "statusDate": "2022.10.15",
    "region": "서울",
    "district": "도봉구",
    "address": "서울특별시 도봉구 쌍문동 225-15 일대",
    "lat": 37.6565,
    "lng": 127.0398,
    "polygon": [
      {
        "lat": 37.656366,
        "lng": 127.040972
      },
      {
        "lat": 37.657122,
        "lng": 127.041091
      },
      {
        "lat": 37.657704,
        "lng": 127.04054
      },
      {
        "lat": 37.658057,
        "lng": 127.039757
      },
      {
        "lat": 37.657583,
        "lng": 127.03905
      },
      {
        "lat": 37.657155,
        "lng": 127.038232
      },
      {
        "lat": 37.656214,
        "lng": 127.038103
      },
      {
        "lat": 37.655405,
        "lng": 127.038583
      },
      {
        "lat": 37.655152,
        "lng": 127.039438
      },
      {
        "lat": 37.654921,
        "lng": 127.040319
      },
      {
        "lat": 37.655742,
        "lng": 127.04074
      }
    ],
    "totalUnits": 1243,
    "ownersCount": 586,
    "generalUnits": 485,
    "rentalUnits": 172,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 96000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "48.0억",
    "avgLandPricePerPyeongManwon": 4000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4200,
      "villaOver30Year": 3800,
      "singleHouse": 1400
    },
    "askCount": 10,
    "minPriceDisplay": "44.0억",
    "minInvestmentDisplay": "28.0억",
    "estimatedPremiumDisplay": "16.0억~24.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 24000,
      "unionPrice84Manwon": 32000,
      "generalPrice59Manwon": 32000,
      "generalPrice84Manwon": 44000,
      "expectedNewAptPrice84Manwon": 56000
    },
    "nearestStation": "쌍문역 (4호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.10.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "dobong-banghak",
    "name": "방학1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2020.08.22",
    "region": "서울",
    "district": "도봉구",
    "address": "서울특별시 도봉구 방학동 347-1 일대",
    "lat": 37.6712,
    "lng": 127.0358,
    "polygon": [
      {
        "lat": 37.671198,
        "lng": 127.036944
      },
      {
        "lat": 37.67199,
        "lng": 127.037128
      },
      {
        "lat": 37.672116,
        "lng": 127.036165
      },
      {
        "lat": 37.672419,
        "lng": 127.035322
      },
      {
        "lat": 37.671792,
        "lng": 127.034813
      },
      {
        "lat": 37.671202,
        "lng": 127.034494
      },
      {
        "lat": 37.670658,
        "lng": 127.034889
      },
      {
        "lat": 37.670183,
        "lng": 127.035395
      },
      {
        "lat": 37.670134,
        "lng": 127.036218
      },
      {
        "lat": 37.670414,
        "lng": 127.03711
      }
    ],
    "totalUnits": 876,
    "ownersCount": 415,
    "generalUnits": 342,
    "rentalUnits": 119,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 67000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 5,
    "recentTradePriceDisplay": "44.4억",
    "avgLandPricePerPyeongManwon": 3700,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3885,
      "villaOver30Year": 3515,
      "singleHouse": 1295
    },
    "askCount": 10,
    "minPriceDisplay": "40.7억",
    "minInvestmentDisplay": "25.9억",
    "estimatedPremiumDisplay": "14.8억~22.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 22200,
      "unionPrice84Manwon": 29600,
      "generalPrice59Manwon": 29600,
      "generalPrice84Manwon": 40700,
      "expectedNewAptPrice84Manwon": 51800
    },
    "nearestStation": "방학역 (1호선) 도보 6분",
    "walkMinutes": 6,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2020.08.22"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2020.08.22"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2020.08.22"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangbuk-mia-1",
    "name": "미아1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.08.30",
    "region": "서울",
    "district": "강북구",
    "address": "서울특별시 강북구 미아동 392-1 일대",
    "lat": 37.6318,
    "lng": 127.0262,
    "polygon": [
      {
        "lat": 37.631518,
        "lng": 127.028037
      },
      {
        "lat": 37.632617,
        "lng": 127.028092
      },
      {
        "lat": 37.633298,
        "lng": 127.027212
      },
      {
        "lat": 37.633392,
        "lng": 127.026221
      },
      {
        "lat": 37.633476,
        "lng": 127.025131
      },
      {
        "lat": 37.632458,
        "lng": 127.024776
      },
      {
        "lat": 37.631564,
        "lng": 127.024355
      },
      {
        "lat": 37.630516,
        "lng": 127.024646
      },
      {
        "lat": 37.629852,
        "lng": 127.025588
      },
      {
        "lat": 37.629948,
        "lng": 127.026729
      },
      {
        "lat": 37.630559,
        "lng": 127.027625
      }
    ],
    "totalUnits": 1876,
    "ownersCount": 856,
    "generalUnits": 732,
    "rentalUnits": 288,
    "generalRatio": 39,
    "builder": "삼성물산",
    "zoneAreaM2": 145000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 12,
    "recentTradePriceDisplay": "62.4억",
    "avgLandPricePerPyeongManwon": 5200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 5460,
      "villaOver30Year": 4940,
      "singleHouse": 1820
    },
    "askCount": 10,
    "minPriceDisplay": "57.2억",
    "minInvestmentDisplay": "36.4억",
    "estimatedPremiumDisplay": "20.8억~31.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 31200,
      "unionPrice84Manwon": 41600,
      "generalPrice59Manwon": 41600,
      "generalPrice84Manwon": 57200,
      "expectedNewAptPrice84Manwon": 72800
    },
    "nearestStation": "미아사거리역 (4호선) 도보 3분",
    "walkMinutes": 3,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.30"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.30"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.30"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.30"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.30"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.08.30"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangbuk-mia-4",
    "name": "미아4구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.03.14",
    "region": "서울",
    "district": "강북구",
    "address": "서울특별시 강북구 미아동 471-17 일대",
    "lat": 37.6352,
    "lng": 127.0285,
    "polygon": [
      {
        "lat": 37.634978,
        "lng": 127.030538
      },
      {
        "lat": 37.636218,
        "lng": 127.030576
      },
      {
        "lat": 37.636538,
        "lng": 127.028817
      },
      {
        "lat": 37.636497,
        "lng": 127.027115
      },
      {
        "lat": 37.635477,
        "lng": 127.025951
      },
      {
        "lat": 37.63415,
        "lng": 127.026358
      },
      {
        "lat": 37.633531,
        "lng": 127.028105
      },
      {
        "lat": 37.63387,
        "lng": 127.029919
      }
    ],
    "totalUnits": 1435,
    "ownersCount": 672,
    "generalUnits": 559,
    "rentalUnits": 204,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 112000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 9,
    "recentTradePriceDisplay": "60.0억",
    "avgLandPricePerPyeongManwon": 5000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 5250,
      "villaOver30Year": 4750,
      "singleHouse": 1750
    },
    "askCount": 10,
    "minPriceDisplay": "55.0억",
    "minInvestmentDisplay": "35.0억",
    "estimatedPremiumDisplay": "20.0억~30.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 30000,
      "unionPrice84Manwon": 40000,
      "generalPrice59Manwon": 40000,
      "generalPrice84Manwon": 55000,
      "expectedNewAptPrice84Manwon": 70000
    },
    "nearestStation": "미아삼거리역 (6호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.03.14"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.03.14"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.03.14"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.03.14"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.03.14"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangbuk-beon-dong",
    "name": "번동 재개발",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.07.20",
    "region": "서울",
    "district": "강북구",
    "address": "서울특별시 강북구 번동 175-11 일대",
    "lat": 37.6389,
    "lng": 127.0298,
    "polygon": [
      {
        "lat": 37.639233,
        "lng": 127.031484
      },
      {
        "lat": 37.640199,
        "lng": 127.031023
      },
      {
        "lat": 37.640154,
        "lng": 127.029659
      },
      {
        "lat": 37.639917,
        "lng": 127.028451
      },
      {
        "lat": 37.639017,
        "lng": 127.028088
      },
      {
        "lat": 37.638086,
        "lng": 127.028237
      },
      {
        "lat": 37.637781,
        "lng": 127.029394
      },
      {
        "lat": 37.63758,
        "lng": 127.030615
      },
      {
        "lat": 37.638362,
        "lng": 127.031328
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "54.0억",
    "avgLandPricePerPyeongManwon": 4500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4725,
      "villaOver30Year": 4275,
      "singleHouse": 1575
    },
    "askCount": 10,
    "minPriceDisplay": "49.5억",
    "minInvestmentDisplay": "31.5억",
    "estimatedPremiumDisplay": "18.0억~27.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 27000,
      "unionPrice84Manwon": 36000,
      "generalPrice59Manwon": 36000,
      "generalPrice84Manwon": 49500,
      "expectedNewAptPrice84Manwon": 63000
    },
    "nearestStation": "수유역 (4호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.07.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.07.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.07.20"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangbuk-suyu",
    "name": "수유3구역",
    "type": "재개발",
    "status": "정비구역지정",
    "statusDate": "2023.02.08",
    "region": "서울",
    "district": "강북구",
    "address": "서울특별시 강북구 수유동 56-42 일대",
    "lat": 37.6425,
    "lng": 127.0271,
    "polygon": [
      {
        "lat": 37.642524,
        "lng": 127.028726
      },
      {
        "lat": 37.643238,
        "lng": 127.028423
      },
      {
        "lat": 37.643607,
        "lng": 127.027556
      },
      {
        "lat": 37.643718,
        "lng": 127.026525
      },
      {
        "lat": 37.643149,
        "lng": 127.025833
      },
      {
        "lat": 37.642475,
        "lng": 127.0254
      },
      {
        "lat": 37.641611,
        "lng": 127.025505
      },
      {
        "lat": 37.641309,
        "lng": 127.02661
      },
      {
        "lat": 37.641443,
        "lng": 127.027599
      },
      {
        "lat": 37.641655,
        "lng": 127.028749
      }
    ],
    "totalUnits": 987,
    "ownersCount": 462,
    "generalUnits": 385,
    "rentalUnits": 142,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 76000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 6,
    "recentTradePriceDisplay": "50.4억",
    "avgLandPricePerPyeongManwon": 4200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4410,
      "villaOver30Year": 3990,
      "singleHouse": 1470
    },
    "askCount": 10,
    "minPriceDisplay": "46.2억",
    "minInvestmentDisplay": "29.4억",
    "estimatedPremiumDisplay": "16.8억~25.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 25200,
      "unionPrice84Manwon": 33600,
      "generalPrice59Manwon": 33600,
      "generalPrice84Manwon": 46200,
      "expectedNewAptPrice84Manwon": 58800
    },
    "nearestStation": "수유역 (4호선) 도보 6분",
    "walkMinutes": 6,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.02.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangbuk-insubong",
    "name": "인수봉구역",
    "type": "재개발",
    "status": "추진위원회승인",
    "statusDate": "2023.09.15",
    "region": "서울",
    "district": "강북구",
    "address": "서울특별시 강북구 우이동 243 일대",
    "lat": 37.6485,
    "lng": 127.0122,
    "polygon": [
      {
        "lat": 37.648613,
        "lng": 127.013187
      },
      {
        "lat": 37.649145,
        "lng": 127.012798
      },
      {
        "lat": 37.649493,
        "lng": 127.012262
      },
      {
        "lat": 37.649489,
        "lng": 127.011493
      },
      {
        "lat": 37.648772,
        "lng": 127.011112
      },
      {
        "lat": 37.647937,
        "lng": 127.011095
      },
      {
        "lat": 37.647573,
        "lng": 127.011806
      },
      {
        "lat": 37.647634,
        "lng": 127.012447
      },
      {
        "lat": 37.647812,
        "lng": 127.013204
      }
    ],
    "totalUnits": 654,
    "ownersCount": 312,
    "generalUnits": 255,
    "rentalUnits": 89,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 50000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 4,
    "recentTradePriceDisplay": "45.6억",
    "avgLandPricePerPyeongManwon": 3800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3990,
      "villaOver30Year": 3610,
      "singleHouse": 1330
    },
    "askCount": 10,
    "minPriceDisplay": "41.8억",
    "minInvestmentDisplay": "26.6억",
    "estimatedPremiumDisplay": "15.2억~22.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 22800,
      "unionPrice84Manwon": 30400,
      "generalPrice59Manwon": 30400,
      "generalPrice84Manwon": 41800,
      "expectedNewAptPrice84Manwon": 53200
    },
    "nearestStation": "우이신설경전철 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.09.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "eunpyeong-bulgwang-1",
    "name": "불광1구역",
    "type": "재개발",
    "status": "착공",
    "statusDate": "2023.05.10",
    "region": "서울",
    "district": "은평구",
    "address": "서울특별시 은평구 불광동 454 일대",
    "lat": 37.6112,
    "lng": 126.9294,
    "polygon": [
      {
        "lat": 37.610678,
        "lng": 126.93228
      },
      {
        "lat": 37.612219,
        "lng": 126.932272
      },
      {
        "lat": 37.612664,
        "lng": 126.930053
      },
      {
        "lat": 37.612532,
        "lng": 126.928234
      },
      {
        "lat": 37.611634,
        "lng": 126.927002
      },
      {
        "lat": 37.610281,
        "lng": 126.92681
      },
      {
        "lat": 37.609173,
        "lng": 126.928495
      },
      {
        "lat": 37.609857,
        "lng": 126.930575
      }
    ],
    "totalUnits": 2124,
    "ownersCount": 954,
    "generalUnits": 829,
    "rentalUnits": 341,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 165000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 14,
    "recentTradePriceDisplay": "69.6억",
    "avgLandPricePerPyeongManwon": 5800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 6090,
      "villaOver30Year": 5510,
      "singleHouse": 2030
    },
    "askCount": 10,
    "minPriceDisplay": "63.8억",
    "minInvestmentDisplay": "40.6억",
    "estimatedPremiumDisplay": "23.2억~34.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 34800,
      "unionPrice84Manwon": 46400,
      "generalPrice59Manwon": 46400,
      "generalPrice84Manwon": 63800,
      "expectedNewAptPrice84Manwon": 81200
    },
    "nearestStation": "불광역 (3·6호선) 도보 3분",
    "walkMinutes": 3,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.10"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.10"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.10"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.10"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.10"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.10"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.10"
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.05.10"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "eunpyeong-yeokchon",
    "name": "역촌1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.11.18",
    "region": "서울",
    "district": "은평구",
    "address": "서울특별시 은평구 역촌동 122-20 일대",
    "lat": 37.6078,
    "lng": 126.9218,
    "polygon": [
      {
        "lat": 37.608035,
        "lng": 126.923598
      },
      {
        "lat": 37.609179,
        "lng": 126.923467
      },
      {
        "lat": 37.609273,
        "lng": 126.921758
      },
      {
        "lat": 37.608877,
        "lng": 126.920394
      },
      {
        "lat": 37.60806,
        "lng": 126.919315
      },
      {
        "lat": 37.607065,
        "lng": 126.919975
      },
      {
        "lat": 37.606378,
        "lng": 126.921071
      },
      {
        "lat": 37.60645,
        "lng": 126.92258
      },
      {
        "lat": 37.60695,
        "lng": 126.924105
      }
    ],
    "totalUnits": 1543,
    "ownersCount": 712,
    "generalUnits": 601,
    "rentalUnits": 230,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "66.0억",
    "avgLandPricePerPyeongManwon": 5500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 5775,
      "villaOver30Year": 5225,
      "singleHouse": 1925
    },
    "askCount": 10,
    "minPriceDisplay": "60.5억",
    "minInvestmentDisplay": "38.5억",
    "estimatedPremiumDisplay": "22.0억~33.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 33000,
      "unionPrice84Manwon": 44000,
      "generalPrice59Manwon": 44000,
      "generalPrice84Manwon": 60500,
      "expectedNewAptPrice84Manwon": 77000
    },
    "nearestStation": "역촌역 (6호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.11.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "eunpyeong-eunpyeong-new",
    "name": "응암2구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.06.25",
    "region": "서울",
    "district": "은평구",
    "address": "서울특별시 은평구 응암동 278-1 일대",
    "lat": 37.6045,
    "lng": 126.9175,
    "polygon": [
      {
        "lat": 37.604195,
        "lng": 126.919683
      },
      {
        "lat": 37.60532,
        "lng": 126.919752
      },
      {
        "lat": 37.606245,
        "lng": 126.918742
      },
      {
        "lat": 37.606435,
        "lng": 126.917161
      },
      {
        "lat": 37.605593,
        "lng": 126.916131
      },
      {
        "lat": 37.604842,
        "lng": 126.915052
      },
      {
        "lat": 37.603656,
        "lng": 126.915181
      },
      {
        "lat": 37.602798,
        "lng": 126.916289
      },
      {
        "lat": 37.602627,
        "lng": 126.917828
      },
      {
        "lat": 37.603149,
        "lng": 126.919193
      }
    ],
    "totalUnits": 1876,
    "ownersCount": 856,
    "generalUnits": 732,
    "rentalUnits": 288,
    "generalRatio": 39,
    "builder": "포스코이앤씨",
    "zoneAreaM2": 145000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 12,
    "recentTradePriceDisplay": "67.2억",
    "avgLandPricePerPyeongManwon": 5600,
    "pricePerPyeongByAge": {
      "villa11To30Year": 5880,
      "villaOver30Year": 5320,
      "singleHouse": 1960
    },
    "askCount": 10,
    "minPriceDisplay": "61.6억",
    "minInvestmentDisplay": "39.2억",
    "estimatedPremiumDisplay": "22.4억~33.6억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 33600,
      "unionPrice84Manwon": 44800,
      "generalPrice59Manwon": 44800,
      "generalPrice84Manwon": 61600,
      "expectedNewAptPrice84Manwon": 78400
    },
    "nearestStation": "응암역 (6호선) 도보 4분",
    "walkMinutes": 4,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.06.25"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.06.25"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.06.25"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.06.25"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.06.25"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.06.25"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "eunpyeong-susaek",
    "name": "수색·증산 뉴타운",
    "type": "재개발",
    "status": "착공",
    "statusDate": "2024.01.15",
    "region": "서울",
    "district": "은평구",
    "address": "서울특별시 은평구 수색동 100-2 일대",
    "lat": 37.5918,
    "lng": 126.9002,
    "polygon": [
      {
        "lat": 37.592305,
        "lng": 126.902513
      },
      {
        "lat": 37.593791,
        "lng": 126.90189
      },
      {
        "lat": 37.594028,
        "lng": 126.899985
      },
      {
        "lat": 37.593645,
        "lng": 126.898024
      },
      {
        "lat": 37.592052,
        "lng": 126.897004
      },
      {
        "lat": 37.590753,
        "lng": 126.898388
      },
      {
        "lat": 37.589768,
        "lng": 126.899532
      },
      {
        "lat": 37.589642,
        "lng": 126.901382
      },
      {
        "lat": 37.590892,
        "lng": 126.902488
      }
    ],
    "totalUnits": 3254,
    "ownersCount": 1458,
    "generalUnits": 1268,
    "rentalUnits": 528,
    "generalRatio": 39,
    "builder": "삼성물산·롯데건설",
    "zoneAreaM2": 255000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 21,
    "recentTradePriceDisplay": "74.4억",
    "avgLandPricePerPyeongManwon": 6200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 6510,
      "villaOver30Year": 5890,
      "singleHouse": 2170
    },
    "askCount": 10,
    "minPriceDisplay": "68.2억",
    "minInvestmentDisplay": "43.4억",
    "estimatedPremiumDisplay": "24.8억~37.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 37200,
      "unionPrice84Manwon": 49600,
      "generalPrice59Manwon": 49600,
      "generalPrice84Manwon": 68200,
      "expectedNewAptPrice84Manwon": 86800
    },
    "nearestStation": "수색역 (경의중앙선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.01.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.01.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.01.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.01.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.01.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.01.15"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.01.15"
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2024.01.15"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "eunpyeong-sinsa",
    "name": "신사1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.05.30",
    "region": "서울",
    "district": "은평구",
    "address": "서울특별시 은평구 신사동 55-1 일대",
    "lat": 37.6165,
    "lng": 126.9328,
    "polygon": [
      {
        "lat": 37.616288,
        "lng": 126.934144
      },
      {
        "lat": 37.61718,
        "lng": 126.934339
      },
      {
        "lat": 37.617801,
        "lng": 126.933427
      },
      {
        "lat": 37.617795,
        "lng": 126.932248
      },
      {
        "lat": 37.617036,
        "lng": 126.931693
      },
      {
        "lat": 37.616279,
        "lng": 126.931029
      },
      {
        "lat": 37.615687,
        "lng": 126.931914
      },
      {
        "lat": 37.615113,
        "lng": 126.932766
      },
      {
        "lat": 37.615734,
        "lng": 126.93357
      }
    ],
    "totalUnits": 987,
    "ownersCount": 462,
    "generalUnits": 385,
    "rentalUnits": 142,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 76000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 6,
    "recentTradePriceDisplay": "62.4억",
    "avgLandPricePerPyeongManwon": 5200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 5460,
      "villaOver30Year": 4940,
      "singleHouse": 1820
    },
    "askCount": 10,
    "minPriceDisplay": "57.2억",
    "minInvestmentDisplay": "36.4억",
    "estimatedPremiumDisplay": "20.8억~31.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 31200,
      "unionPrice84Manwon": 41600,
      "generalPrice59Manwon": 41600,
      "generalPrice84Manwon": 57200,
      "expectedNewAptPrice84Manwon": 72800
    },
    "nearestStation": "구산역 (6호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.05.30"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.05.30"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.05.30"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "mapo-ahyeon-1",
    "name": "아현1구역",
    "type": "재개발",
    "status": "착공",
    "statusDate": "2022.09.08",
    "region": "서울",
    "district": "마포구",
    "address": "서울특별시 마포구 아현동 458-1 일대",
    "lat": 37.5521,
    "lng": 126.9502,
    "polygon": [
      {
        "lat": 37.551594,
        "lng": 126.952523
      },
      {
        "lat": 37.553335,
        "lng": 126.952486
      },
      {
        "lat": 37.553877,
        "lng": 126.950688
      },
      {
        "lat": 37.553855,
        "lng": 126.949003
      },
      {
        "lat": 37.552607,
        "lng": 126.947872
      },
      {
        "lat": 37.55112,
        "lng": 126.948385
      },
      {
        "lat": 37.550344,
        "lng": 126.949718
      },
      {
        "lat": 37.550346,
        "lng": 126.951396
      }
    ],
    "totalUnits": 2456,
    "ownersCount": 1089,
    "generalUnits": 956,
    "rentalUnits": 401,
    "generalRatio": 39,
    "builder": "대림산업",
    "zoneAreaM2": 192000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 16,
    "recentTradePriceDisplay": "117.6억",
    "avgLandPricePerPyeongManwon": 9800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 10290,
      "villaOver30Year": 9310,
      "singleHouse": 3430
    },
    "askCount": 10,
    "minPriceDisplay": "107.8억",
    "minInvestmentDisplay": "68.6억",
    "estimatedPremiumDisplay": "39.2억~58.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 58800,
      "unionPrice84Manwon": 78400,
      "generalPrice59Manwon": 78400,
      "generalPrice84Manwon": 107800,
      "expectedNewAptPrice84Manwon": 137200
    },
    "nearestStation": "아현역 (5호선) 도보 3분",
    "walkMinutes": 3,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.08"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.08"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.08"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.08"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.08"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.08"
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.09.08"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "mapo-ahyeon-3",
    "name": "아현3구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2023.04.12",
    "region": "서울",
    "district": "마포구",
    "address": "서울특별시 마포구 아현동 595-3 일대",
    "lat": 37.5545,
    "lng": 126.9478,
    "polygon": [
      {
        "lat": 37.554907,
        "lng": 126.949603
      },
      {
        "lat": 37.555891,
        "lng": 126.949124
      },
      {
        "lat": 37.556364,
        "lng": 126.947924
      },
      {
        "lat": 37.555891,
        "lng": 126.946759
      },
      {
        "lat": 37.555074,
        "lng": 126.946084
      },
      {
        "lat": 37.554043,
        "lng": 126.945778
      },
      {
        "lat": 37.553075,
        "lng": 126.946443
      },
      {
        "lat": 37.553094,
        "lng": 126.947706
      },
      {
        "lat": 37.553257,
        "lng": 126.948731
      },
      {
        "lat": 37.553867,
        "lng": 126.949693
      }
    ],
    "totalUnits": 1876,
    "ownersCount": 832,
    "generalUnits": 731,
    "rentalUnits": 313,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 147000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 12,
    "recentTradePriceDisplay": "114.0억",
    "avgLandPricePerPyeongManwon": 9500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 9975,
      "villaOver30Year": 9025,
      "singleHouse": 3325
    },
    "askCount": 10,
    "minPriceDisplay": "104.5억",
    "minInvestmentDisplay": "66.5억",
    "estimatedPremiumDisplay": "38.0억~57.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 57000,
      "unionPrice84Manwon": 76000,
      "generalPrice59Manwon": 76000,
      "generalPrice84Manwon": 104500,
      "expectedNewAptPrice84Manwon": 133000
    },
    "nearestStation": "공덕역 (5·6호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.12"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.12"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.12"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.12"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.04.12"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "mapo-dohwa",
    "name": "도화2구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2024.02.20",
    "region": "서울",
    "district": "마포구",
    "address": "서울특별시 마포구 도화동 156-4 일대",
    "lat": 37.5498,
    "lng": 126.9452,
    "polygon": [
      {
        "lat": 37.549653,
        "lng": 126.947282
      },
      {
        "lat": 37.550454,
        "lng": 126.946995
      },
      {
        "lat": 37.550915,
        "lng": 126.946111
      },
      {
        "lat": 37.551344,
        "lng": 126.945105
      },
      {
        "lat": 37.551054,
        "lng": 126.943956
      },
      {
        "lat": 37.550353,
        "lng": 126.943281
      },
      {
        "lat": 37.549565,
        "lng": 126.943457
      },
      {
        "lat": 37.548989,
        "lng": 126.943997
      },
      {
        "lat": 37.548315,
        "lng": 126.944686
      },
      {
        "lat": 37.54821,
        "lng": 126.945963
      },
      {
        "lat": 37.548949,
        "lng": 126.946707
      }
    ],
    "totalUnits": 1354,
    "ownersCount": 625,
    "generalUnits": 528,
    "rentalUnits": 201,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 106000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 9,
    "recentTradePriceDisplay": "122.4억",
    "avgLandPricePerPyeongManwon": 10200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 10710,
      "villaOver30Year": 9690,
      "singleHouse": 3570
    },
    "askCount": 10,
    "minPriceDisplay": "112.2억",
    "minInvestmentDisplay": "71.4억",
    "estimatedPremiumDisplay": "40.8억~61.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 61200,
      "unionPrice84Manwon": 81600,
      "generalPrice59Manwon": 81600,
      "generalPrice84Manwon": 112200,
      "expectedNewAptPrice84Manwon": 142800
    },
    "nearestStation": "마포역 (5호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.02.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.02.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.02.20"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.02.20"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.02.20"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2024.02.20"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "mapo-mangwon",
    "name": "망원재개발",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.08.15",
    "region": "서울",
    "district": "마포구",
    "address": "서울특별시 마포구 망원동 474-3 일대",
    "lat": 37.5564,
    "lng": 126.9075,
    "polygon": [
      {
        "lat": 37.556127,
        "lng": 126.908713
      },
      {
        "lat": 37.556965,
        "lng": 126.909106
      },
      {
        "lat": 37.557606,
        "lng": 126.908445
      },
      {
        "lat": 37.557666,
        "lng": 126.907608
      },
      {
        "lat": 37.55782,
        "lng": 126.90673
      },
      {
        "lat": 37.557193,
        "lng": 126.906056
      },
      {
        "lat": 37.556298,
        "lng": 126.905757
      },
      {
        "lat": 37.55561,
        "lng": 126.906395
      },
      {
        "lat": 37.55493,
        "lng": 126.906919
      },
      {
        "lat": 37.554799,
        "lng": 126.907836
      },
      {
        "lat": 37.555403,
        "lng": 126.908495
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 578,
    "generalUnits": 485,
    "rentalUnits": 182,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "108.0억",
    "avgLandPricePerPyeongManwon": 9000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 9450,
      "villaOver30Year": 8550,
      "singleHouse": 3150
    },
    "askCount": 10,
    "minPriceDisplay": "99.0억",
    "minInvestmentDisplay": "63.0억",
    "estimatedPremiumDisplay": "36.0억~54.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 54000,
      "unionPrice84Manwon": 72000,
      "generalPrice59Manwon": 72000,
      "generalPrice84Manwon": 99000,
      "expectedNewAptPrice84Manwon": 126000
    },
    "nearestStation": "망원역 (6호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.08.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.08.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.08.15"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "seodaemun-hongeun",
    "name": "홍은2구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.08.10",
    "region": "서울",
    "district": "서대문구",
    "address": "서울특별시 서대문구 홍은동 352-8 일대",
    "lat": 37.5921,
    "lng": 126.9364,
    "polygon": [
      {
        "lat": 37.591982,
        "lng": 126.938525
      },
      {
        "lat": 37.593143,
        "lng": 126.938111
      },
      {
        "lat": 37.593652,
        "lng": 126.93657
      },
      {
        "lat": 37.593455,
        "lng": 126.934775
      },
      {
        "lat": 37.592205,
        "lng": 126.934511
      },
      {
        "lat": 37.590903,
        "lng": 126.934437
      },
      {
        "lat": 37.590587,
        "lng": 126.936234
      },
      {
        "lat": 37.590772,
        "lng": 126.937993
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "포스코이앤씨",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "93.6억",
    "avgLandPricePerPyeongManwon": 7800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 8190,
      "villaOver30Year": 7410,
      "singleHouse": 2730
    },
    "askCount": 10,
    "minPriceDisplay": "85.8억",
    "minInvestmentDisplay": "54.6억",
    "estimatedPremiumDisplay": "31.2억~46.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 46800,
      "unionPrice84Manwon": 62400,
      "generalPrice59Manwon": 62400,
      "generalPrice84Manwon": 85800,
      "expectedNewAptPrice84Manwon": 109200
    },
    "nearestStation": "홍제역 (3호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.10"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.10"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.10"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.10"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.08.10"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "seodaemun-namgajwa",
    "name": "남가좌1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.09.15",
    "region": "서울",
    "district": "서대문구",
    "address": "서울특별시 서대문구 남가좌동 279-60 일대",
    "lat": 37.5782,
    "lng": 126.9211,
    "polygon": [
      {
        "lat": 37.578507,
        "lng": 126.923169
      },
      {
        "lat": 37.579378,
        "lng": 126.922375
      },
      {
        "lat": 37.580002,
        "lng": 126.921404
      },
      {
        "lat": 37.580155,
        "lng": 126.920006
      },
      {
        "lat": 37.579043,
        "lng": 126.919283
      },
      {
        "lat": 37.57787,
        "lng": 126.918881
      },
      {
        "lat": 37.576921,
        "lng": 126.919716
      },
      {
        "lat": 37.576488,
        "lng": 126.920811
      },
      {
        "lat": 37.576498,
        "lng": 126.922053
      },
      {
        "lat": 37.577204,
        "lng": 126.923248
      }
    ],
    "totalUnits": 2134,
    "ownersCount": 985,
    "generalUnits": 832,
    "rentalUnits": 317,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 166000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 14,
    "recentTradePriceDisplay": "98.4억",
    "avgLandPricePerPyeongManwon": 8200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 8610,
      "villaOver30Year": 7790,
      "singleHouse": 2870
    },
    "askCount": 10,
    "minPriceDisplay": "90.2억",
    "minInvestmentDisplay": "57.4억",
    "estimatedPremiumDisplay": "32.8억~49.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 49200,
      "unionPrice84Manwon": 65600,
      "generalPrice59Manwon": 65600,
      "generalPrice84Manwon": 90200,
      "expectedNewAptPrice84Manwon": 114800
    },
    "nearestStation": "가좌역 (경의선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.09.15"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "seodaemun-bukgajwa",
    "name": "북가좌2구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.06.28",
    "region": "서울",
    "district": "서대문구",
    "address": "서울특별시 서대문구 북가좌동 212-15 일대",
    "lat": 37.5812,
    "lng": 126.9198,
    "polygon": [
      {
        "lat": 37.581555,
        "lng": 126.921079
      },
      {
        "lat": 37.582677,
        "lng": 126.920634
      },
      {
        "lat": 37.582816,
        "lng": 126.919354
      },
      {
        "lat": 37.581844,
        "lng": 126.918665
      },
      {
        "lat": 37.580832,
        "lng": 126.918475
      },
      {
        "lat": 37.579691,
        "lng": 126.918947
      },
      {
        "lat": 37.579506,
        "lng": 126.920268
      },
      {
        "lat": 37.580369,
        "lng": 126.921264
      }
    ],
    "totalUnits": 1654,
    "ownersCount": 762,
    "generalUnits": 645,
    "rentalUnits": 247,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 129000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "102.0억",
    "avgLandPricePerPyeongManwon": 8500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 8925,
      "villaOver30Year": 8075,
      "singleHouse": 2975
    },
    "askCount": 10,
    "minPriceDisplay": "93.5억",
    "minInvestmentDisplay": "59.5억",
    "estimatedPremiumDisplay": "34.0억~51.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 51000,
      "unionPrice84Manwon": 68000,
      "generalPrice59Manwon": 68000,
      "generalPrice84Manwon": 93500,
      "expectedNewAptPrice84Manwon": 119000
    },
    "nearestStation": "수색역 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.28"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.28"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.28"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.28"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.06.28"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "dongjak-heuksuk",
    "name": "흑석11구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2024.01.18",
    "region": "서울",
    "district": "동작구",
    "address": "서울특별시 동작구 흑석동 213-14 일대",
    "lat": 37.5074,
    "lng": 126.9641,
    "polygon": [
      {
        "lat": 37.50744,
        "lng": 126.966913
      },
      {
        "lat": 37.508405,
        "lng": 126.965686
      },
      {
        "lat": 37.508973,
        "lng": 126.964439
      },
      {
        "lat": 37.509041,
        "lng": 126.962736
      },
      {
        "lat": 37.507953,
        "lng": 126.961874
      },
      {
        "lat": 37.506624,
        "lng": 126.961333
      },
      {
        "lat": 37.506101,
        "lng": 126.963113
      },
      {
        "lat": 37.505583,
        "lng": 126.964592
      },
      {
        "lat": 37.506373,
        "lng": 126.965854
      }
    ],
    "totalUnits": 1987,
    "ownersCount": 912,
    "generalUnits": 775,
    "rentalUnits": 300,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 155000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 13,
    "recentTradePriceDisplay": "138.0억",
    "avgLandPricePerPyeongManwon": 11500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 12075,
      "villaOver30Year": 10925,
      "singleHouse": 4025
    },
    "askCount": 10,
    "minPriceDisplay": "126.5억",
    "minInvestmentDisplay": "80.5억",
    "estimatedPremiumDisplay": "46.0억~69.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 69000,
      "unionPrice84Manwon": 92000,
      "generalPrice59Manwon": 92000,
      "generalPrice84Manwon": 126500,
      "expectedNewAptPrice84Manwon": 161000
    },
    "nearestStation": "흑석역 (9호선) 도보 3분",
    "walkMinutes": 3,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.01.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.01.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.01.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.01.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.01.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2024.01.18"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "dongjak-noryangjin-1",
    "name": "노량진1구역",
    "type": "재개발",
    "status": "착공",
    "statusDate": "2023.08.25",
    "region": "서울",
    "district": "동작구",
    "address": "서울특별시 동작구 노량진동 236-1 일대",
    "lat": 37.5132,
    "lng": 126.9415,
    "polygon": [
      {
        "lat": 37.512602,
        "lng": 126.944093
      },
      {
        "lat": 37.513746,
        "lng": 126.943304
      },
      {
        "lat": 37.5147,
        "lng": 126.942721
      },
      {
        "lat": 37.514799,
        "lng": 126.941422
      },
      {
        "lat": 37.514823,
        "lng": 126.939937
      },
      {
        "lat": 37.513722,
        "lng": 126.939236
      },
      {
        "lat": 37.512383,
        "lng": 126.938801
      },
      {
        "lat": 37.511254,
        "lng": 126.939916
      },
      {
        "lat": 37.511162,
        "lng": 126.941599
      },
      {
        "lat": 37.511489,
        "lng": 126.943147
      }
    ],
    "totalUnits": 2456,
    "ownersCount": 1124,
    "generalUnits": 957,
    "rentalUnits": 375,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 192000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 16,
    "recentTradePriceDisplay": "129.6억",
    "avgLandPricePerPyeongManwon": 10800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 11340,
      "villaOver30Year": 10260,
      "singleHouse": 3780
    },
    "askCount": 10,
    "minPriceDisplay": "118.8억",
    "minInvestmentDisplay": "75.6억",
    "estimatedPremiumDisplay": "43.2억~64.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 64800,
      "unionPrice84Manwon": 86400,
      "generalPrice59Manwon": 86400,
      "generalPrice84Manwon": 118800,
      "expectedNewAptPrice84Manwon": 151200
    },
    "nearestStation": "노량진역 (1·9호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.25"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.25"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.25"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.25"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.25"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.25"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.25"
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.08.25"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "dongjak-noryangjin-2",
    "name": "노량진2구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.12.05",
    "region": "서울",
    "district": "동작구",
    "address": "서울특별시 동작구 노량진동 145-26 일대",
    "lat": 37.5118,
    "lng": 126.9392,
    "polygon": [
      {
        "lat": 37.511749,
        "lng": 126.941222
      },
      {
        "lat": 37.512705,
        "lng": 126.941031
      },
      {
        "lat": 37.513081,
        "lng": 126.939636
      },
      {
        "lat": 37.5133,
        "lng": 126.937964
      },
      {
        "lat": 37.512399,
        "lng": 126.936909
      },
      {
        "lat": 37.511211,
        "lng": 126.936316
      },
      {
        "lat": 37.510179,
        "lng": 126.937597
      },
      {
        "lat": 37.510144,
        "lng": 126.939553
      },
      {
        "lat": 37.510599,
        "lng": 126.941271
      }
    ],
    "totalUnits": 1654,
    "ownersCount": 762,
    "generalUnits": 645,
    "rentalUnits": 247,
    "generalRatio": 39,
    "builder": "대우건설",
    "zoneAreaM2": 129000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "126.0억",
    "avgLandPricePerPyeongManwon": 10500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 11025,
      "villaOver30Year": 9975,
      "singleHouse": 3675
    },
    "askCount": 10,
    "minPriceDisplay": "115.5억",
    "minInvestmentDisplay": "73.5억",
    "estimatedPremiumDisplay": "42.0억~63.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 63000,
      "unionPrice84Manwon": 84000,
      "generalPrice59Manwon": 84000,
      "generalPrice84Manwon": 115500,
      "expectedNewAptPrice84Manwon": 147000
    },
    "nearestStation": "노량진역 (1·9호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.12.05"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.12.05"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.12.05"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.12.05"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.12.05"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "dongjak-sangdo",
    "name": "상도3구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.10.22",
    "region": "서울",
    "district": "동작구",
    "address": "서울특별시 동작구 상도동 316-15 일대",
    "lat": 37.5042,
    "lng": 126.9362,
    "polygon": [
      {
        "lat": 37.50403,
        "lng": 126.937762
      },
      {
        "lat": 37.504975,
        "lng": 126.937324
      },
      {
        "lat": 37.50564,
        "lng": 126.936605
      },
      {
        "lat": 37.505509,
        "lng": 126.935633
      },
      {
        "lat": 37.504899,
        "lng": 126.934805
      },
      {
        "lat": 37.503811,
        "lng": 126.93467
      },
      {
        "lat": 37.503294,
        "lng": 126.935556
      },
      {
        "lat": 37.502987,
        "lng": 126.936281
      },
      {
        "lat": 37.503319,
        "lng": 126.937029
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 578,
    "generalUnits": 485,
    "rentalUnits": 182,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "117.6억",
    "avgLandPricePerPyeongManwon": 9800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 10290,
      "villaOver30Year": 9310,
      "singleHouse": 3430
    },
    "askCount": 10,
    "minPriceDisplay": "107.8억",
    "minInvestmentDisplay": "68.6억",
    "estimatedPremiumDisplay": "39.2억~58.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 58800,
      "unionPrice84Manwon": 78400,
      "generalPrice59Manwon": 78400,
      "generalPrice84Manwon": 107800,
      "expectedNewAptPrice84Manwon": 137200
    },
    "nearestStation": "상도역 (7호선) 도보 6분",
    "walkMinutes": 6,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.10.22"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.10.22"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.10.22"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gwanak-sinlim-5",
    "name": "신림5구역",
    "type": "재개발",
    "status": "착공",
    "statusDate": "2024.02.08",
    "region": "서울",
    "district": "관악구",
    "address": "서울특별시 관악구 신림동 547-8 일대",
    "lat": 37.4842,
    "lng": 126.9072,
    "polygon": [
      {
        "lat": 37.483848,
        "lng": 126.909755
      },
      {
        "lat": 37.484965,
        "lng": 126.909763
      },
      {
        "lat": 37.486076,
        "lng": 126.908817
      },
      {
        "lat": 37.485958,
        "lng": 126.90691
      },
      {
        "lat": 37.485453,
        "lng": 126.905483
      },
      {
        "lat": 37.484489,
        "lng": 126.905106
      },
      {
        "lat": 37.483462,
        "lng": 126.904728
      },
      {
        "lat": 37.482617,
        "lng": 126.905835
      },
      {
        "lat": 37.482452,
        "lng": 126.907489
      },
      {
        "lat": 37.482691,
        "lng": 126.909267
      }
    ],
    "totalUnits": 1987,
    "ownersCount": 912,
    "generalUnits": 775,
    "rentalUnits": 300,
    "generalRatio": 39,
    "builder": "삼성물산",
    "zoneAreaM2": 155000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 13,
    "recentTradePriceDisplay": "102.0억",
    "avgLandPricePerPyeongManwon": 8500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 8925,
      "villaOver30Year": 8075,
      "singleHouse": 2975
    },
    "askCount": 10,
    "minPriceDisplay": "93.5억",
    "minInvestmentDisplay": "59.5억",
    "estimatedPremiumDisplay": "34.0억~51.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 51000,
      "unionPrice84Manwon": 68000,
      "generalPrice59Manwon": 68000,
      "generalPrice84Manwon": 93500,
      "expectedNewAptPrice84Manwon": 119000
    },
    "nearestStation": "신림역 (2호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.02.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.02.08"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.02.08"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.02.08"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.02.08"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.02.08"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.02.08"
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2024.02.08"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gwanak-sinlim-11",
    "name": "신림11구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.10.30",
    "region": "서울",
    "district": "관악구",
    "address": "서울특별시 관악구 신림동 1112-3 일대",
    "lat": 37.4872,
    "lng": 126.9124,
    "polygon": [
      {
        "lat": 37.487357,
        "lng": 126.914319
      },
      {
        "lat": 37.488096,
        "lng": 126.913822
      },
      {
        "lat": 37.488706,
        "lng": 126.913044
      },
      {
        "lat": 37.488378,
        "lng": 126.912023
      },
      {
        "lat": 37.488291,
        "lng": 126.910919
      },
      {
        "lat": 37.487436,
        "lng": 126.910765
      },
      {
        "lat": 37.486699,
        "lng": 126.910847
      },
      {
        "lat": 37.485675,
        "lng": 126.911044
      },
      {
        "lat": 37.485974,
        "lng": 126.912339
      },
      {
        "lat": 37.48583,
        "lng": 126.913426
      },
      {
        "lat": 37.486447,
        "lng": 126.914298
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "98.4억",
    "avgLandPricePerPyeongManwon": 8200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 8610,
      "villaOver30Year": 7790,
      "singleHouse": 2870
    },
    "askCount": 10,
    "minPriceDisplay": "90.2억",
    "minInvestmentDisplay": "57.4억",
    "estimatedPremiumDisplay": "32.8억~49.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 49200,
      "unionPrice84Manwon": 65600,
      "generalPrice59Manwon": 65600,
      "generalPrice84Manwon": 90200,
      "expectedNewAptPrice84Manwon": 114800
    },
    "nearestStation": "신림역 (2호선) 도보 6분",
    "walkMinutes": 6,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.30"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.30"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.30"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.30"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.10.30"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gwanak-bongheon",
    "name": "봉천3구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.11.14",
    "region": "서울",
    "district": "관악구",
    "address": "서울특별시 관악구 봉천동 891-12 일대",
    "lat": 37.4785,
    "lng": 126.9285,
    "polygon": [
      {
        "lat": 37.478608,
        "lng": 126.930708
      },
      {
        "lat": 37.479591,
        "lng": 126.92989
      },
      {
        "lat": 37.480303,
        "lng": 126.928308
      },
      {
        "lat": 37.479725,
        "lng": 126.926414
      },
      {
        "lat": 37.478396,
        "lng": 126.926385
      },
      {
        "lat": 37.47697,
        "lng": 126.92655
      },
      {
        "lat": 37.477183,
        "lng": 126.92864
      },
      {
        "lat": 37.477286,
        "lng": 126.930567
      }
    ],
    "totalUnits": 1765,
    "ownersCount": 812,
    "generalUnits": 688,
    "rentalUnits": 265,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 137000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "105.6억",
    "avgLandPricePerPyeongManwon": 8800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 9240,
      "villaOver30Year": 8360,
      "singleHouse": 3080
    },
    "askCount": 10,
    "minPriceDisplay": "96.8억",
    "minInvestmentDisplay": "61.6억",
    "estimatedPremiumDisplay": "35.2억~52.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 52800,
      "unionPrice84Manwon": 70400,
      "generalPrice59Manwon": 70400,
      "generalPrice84Manwon": 96800,
      "expectedNewAptPrice84Manwon": 123200
    },
    "nearestStation": "봉천역 (2호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.14"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.14"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.14"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.14"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.14"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.11.14"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangseo-banghwa",
    "name": "방화5구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.09.20",
    "region": "서울",
    "district": "강서구",
    "address": "서울특별시 강서구 방화동 652-5 일대",
    "lat": 37.5628,
    "lng": 126.8112,
    "polygon": [
      {
        "lat": 37.563015,
        "lng": 126.812911
      },
      {
        "lat": 37.563892,
        "lng": 126.812598
      },
      {
        "lat": 37.564359,
        "lng": 126.811712
      },
      {
        "lat": 37.564594,
        "lng": 126.810635
      },
      {
        "lat": 37.563798,
        "lng": 126.809951
      },
      {
        "lat": 37.563019,
        "lng": 126.809593
      },
      {
        "lat": 37.562222,
        "lng": 126.809792
      },
      {
        "lat": 37.561272,
        "lng": 126.81011
      },
      {
        "lat": 37.561332,
        "lng": 126.811191
      },
      {
        "lat": 37.561593,
        "lng": 126.81204
      },
      {
        "lat": 37.56212,
        "lng": 126.812808
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "포스코이앤씨",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "81.6억",
    "avgLandPricePerPyeongManwon": 6800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 7140,
      "villaOver30Year": 6460,
      "singleHouse": 2380
    },
    "askCount": 10,
    "minPriceDisplay": "74.8억",
    "minInvestmentDisplay": "47.6억",
    "estimatedPremiumDisplay": "27.2억~40.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 40800,
      "unionPrice84Manwon": 54400,
      "generalPrice59Manwon": 54400,
      "generalPrice84Manwon": 74800,
      "expectedNewAptPrice84Manwon": 95200
    },
    "nearestStation": "방화역 (5호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.20"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.20"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.09.20"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangseo-hwagok-2",
    "name": "화곡2구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.07.08",
    "region": "서울",
    "district": "강서구",
    "address": "서울특별시 강서구 화곡동 367-12 일대",
    "lat": 37.5452,
    "lng": 126.8468,
    "polygon": [
      {
        "lat": 37.545579,
        "lng": 126.849728
      },
      {
        "lat": 37.546311,
        "lng": 126.848121
      },
      {
        "lat": 37.546816,
        "lng": 126.846776
      },
      {
        "lat": 37.546645,
        "lng": 126.845009
      },
      {
        "lat": 37.545478,
        "lng": 126.844375
      },
      {
        "lat": 37.54447,
        "lng": 126.845012
      },
      {
        "lat": 37.543744,
        "lng": 126.846058
      },
      {
        "lat": 37.543672,
        "lng": 126.847631
      },
      {
        "lat": 37.544185,
        "lng": 126.849406
      }
    ],
    "totalUnits": 1987,
    "ownersCount": 912,
    "generalUnits": 775,
    "rentalUnits": 300,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 155000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 13,
    "recentTradePriceDisplay": "86.4억",
    "avgLandPricePerPyeongManwon": 7200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 7560,
      "villaOver30Year": 6840,
      "singleHouse": 2520
    },
    "askCount": 10,
    "minPriceDisplay": "79.2억",
    "minInvestmentDisplay": "50.4억",
    "estimatedPremiumDisplay": "28.8억~43.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 43200,
      "unionPrice84Manwon": 57600,
      "generalPrice59Manwon": 57600,
      "generalPrice84Manwon": 79200,
      "expectedNewAptPrice84Manwon": 100800
    },
    "nearestStation": "화곡역 (5호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.08"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.08"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.08"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.08"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.07.08"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangseo-hwagok-9",
    "name": "화곡9구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.04.15",
    "region": "서울",
    "district": "강서구",
    "address": "서울특별시 강서구 화곡동 1145-8 일대",
    "lat": 37.5478,
    "lng": 126.8512,
    "polygon": [
      {
        "lat": 37.547522,
        "lng": 126.853152
      },
      {
        "lat": 37.548861,
        "lng": 126.85328
      },
      {
        "lat": 37.549093,
        "lng": 126.851528
      },
      {
        "lat": 37.549253,
        "lng": 126.849881
      },
      {
        "lat": 37.548078,
        "lng": 126.849254
      },
      {
        "lat": 37.546718,
        "lng": 126.849078
      },
      {
        "lat": 37.546373,
        "lng": 126.850838
      },
      {
        "lat": 37.546528,
        "lng": 126.852355
      }
    ],
    "totalUnits": 1654,
    "ownersCount": 762,
    "generalUnits": 645,
    "rentalUnits": 247,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 129000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "84.0억",
    "avgLandPricePerPyeongManwon": 7000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 7350,
      "villaOver30Year": 6650,
      "singleHouse": 2450
    },
    "askCount": 10,
    "minPriceDisplay": "77.0억",
    "minInvestmentDisplay": "49.0억",
    "estimatedPremiumDisplay": "28.0억~42.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 42000,
      "unionPrice84Manwon": 56000,
      "generalPrice59Manwon": 56000,
      "generalPrice84Manwon": 77000,
      "expectedNewAptPrice84Manwon": 98000
    },
    "nearestStation": "까치산역 (5·2호선) 도보 6분",
    "walkMinutes": 6,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.04.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.04.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.04.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.04.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.04.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "guro-guro-1",
    "name": "구로1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.11.25",
    "region": "서울",
    "district": "구로구",
    "address": "서울특별시 구로구 구로동 1224-15 일대",
    "lat": 37.5085,
    "lng": 126.8842,
    "polygon": [
      {
        "lat": 37.508546,
        "lng": 126.885619
      },
      {
        "lat": 37.509243,
        "lng": 126.885324
      },
      {
        "lat": 37.510226,
        "lng": 126.884951
      },
      {
        "lat": 37.509776,
        "lng": 126.883961
      },
      {
        "lat": 37.509753,
        "lng": 126.882983
      },
      {
        "lat": 37.508807,
        "lng": 126.882949
      },
      {
        "lat": 37.508095,
        "lng": 126.882921
      },
      {
        "lat": 37.507543,
        "lng": 126.88339
      },
      {
        "lat": 37.50683,
        "lng": 126.884009
      },
      {
        "lat": 37.507012,
        "lng": 126.884976
      },
      {
        "lat": 37.5077,
        "lng": 126.885606
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "삼성물산",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "88.8억",
    "avgLandPricePerPyeongManwon": 7400,
    "pricePerPyeongByAge": {
      "villa11To30Year": 7770,
      "villaOver30Year": 7030,
      "singleHouse": 2590
    },
    "askCount": 10,
    "minPriceDisplay": "81.4억",
    "minInvestmentDisplay": "51.8억",
    "estimatedPremiumDisplay": "29.6억~44.4억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 44400,
      "unionPrice84Manwon": 59200,
      "generalPrice59Manwon": 59200,
      "generalPrice84Manwon": 81400,
      "expectedNewAptPrice84Manwon": 103600
    },
    "nearestStation": "구로역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.25"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.25"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.25"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.25"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.11.25"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "guro-oryu",
    "name": "오류1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.06.18",
    "region": "서울",
    "district": "구로구",
    "address": "서울특별시 구로구 오류동 288-12 일대",
    "lat": 37.4985,
    "lng": 126.8572,
    "polygon": [
      {
        "lat": 37.498601,
        "lng": 126.858592
      },
      {
        "lat": 37.499262,
        "lng": 126.858134
      },
      {
        "lat": 37.499626,
        "lng": 126.857319
      },
      {
        "lat": 37.499529,
        "lng": 126.856311
      },
      {
        "lat": 37.498872,
        "lng": 126.855483
      },
      {
        "lat": 37.49797,
        "lng": 126.855809
      },
      {
        "lat": 37.4974,
        "lng": 126.856572
      },
      {
        "lat": 37.497289,
        "lng": 126.857602
      },
      {
        "lat": 37.497672,
        "lng": 126.858659
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "84.0억",
    "avgLandPricePerPyeongManwon": 7000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 7350,
      "villaOver30Year": 6650,
      "singleHouse": 2450
    },
    "askCount": 10,
    "minPriceDisplay": "77.0억",
    "minInvestmentDisplay": "49.0억",
    "estimatedPremiumDisplay": "28.0억~42.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 42000,
      "unionPrice84Manwon": 56000,
      "generalPrice59Manwon": 56000,
      "generalPrice84Manwon": 77000,
      "expectedNewAptPrice84Manwon": 98000
    },
    "nearestStation": "오류동역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.06.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.06.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.06.18"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "yeongdeungpo-singil-7",
    "name": "신길7구역",
    "type": "재개발",
    "status": "착공",
    "statusDate": "2023.03.15",
    "region": "서울",
    "district": "영등포구",
    "address": "서울특별시 영등포구 신길동 1162-4 일대",
    "lat": 37.5082,
    "lng": 126.9188,
    "polygon": [
      {
        "lat": 37.508726,
        "lng": 126.921939
      },
      {
        "lat": 37.509858,
        "lng": 126.920633
      },
      {
        "lat": 37.509984,
        "lng": 126.918577
      },
      {
        "lat": 37.509474,
        "lng": 126.916845
      },
      {
        "lat": 37.508392,
        "lng": 126.915634
      },
      {
        "lat": 37.507237,
        "lng": 126.916629
      },
      {
        "lat": 37.506644,
        "lng": 126.918133
      },
      {
        "lat": 37.506383,
        "lng": 126.920094
      },
      {
        "lat": 37.507565,
        "lng": 126.920879
      }
    ],
    "totalUnits": 1987,
    "ownersCount": 912,
    "generalUnits": 775,
    "rentalUnits": 300,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 155000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 13,
    "recentTradePriceDisplay": "117.6억",
    "avgLandPricePerPyeongManwon": 9800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 10290,
      "villaOver30Year": 9310,
      "singleHouse": 3430
    },
    "askCount": 10,
    "minPriceDisplay": "107.8억",
    "minInvestmentDisplay": "68.6억",
    "estimatedPremiumDisplay": "39.2억~58.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 58800,
      "unionPrice84Manwon": 78400,
      "generalPrice59Manwon": 78400,
      "generalPrice84Manwon": 107800,
      "expectedNewAptPrice84Manwon": 137200
    },
    "nearestStation": "신풍역 (7호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.03.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.03.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.03.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.03.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.03.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.03.15"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.03.15"
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.03.15"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "yeongdeungpo-singil-13",
    "name": "신길13구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.07.20",
    "region": "서울",
    "district": "영등포구",
    "address": "서울특별시 영등포구 신길동 1182-1 일대",
    "lat": 37.5112,
    "lng": 126.9215,
    "polygon": [
      {
        "lat": 37.511381,
        "lng": 126.923892
      },
      {
        "lat": 37.512587,
        "lng": 126.922969
      },
      {
        "lat": 37.513149,
        "lng": 126.921255
      },
      {
        "lat": 37.512029,
        "lng": 126.920202
      },
      {
        "lat": 37.511031,
        "lng": 126.919265
      },
      {
        "lat": 37.509946,
        "lng": 126.920172
      },
      {
        "lat": 37.50994,
        "lng": 126.921658
      },
      {
        "lat": 37.510054,
        "lng": 126.923294
      }
    ],
    "totalUnits": 1654,
    "ownersCount": 762,
    "generalUnits": 645,
    "rentalUnits": 247,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 129000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "114.0억",
    "avgLandPricePerPyeongManwon": 9500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 9975,
      "villaOver30Year": 9025,
      "singleHouse": 3325
    },
    "askCount": 10,
    "minPriceDisplay": "104.5억",
    "minInvestmentDisplay": "66.5억",
    "estimatedPremiumDisplay": "38.0억~57.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 57000,
      "unionPrice84Manwon": 76000,
      "generalPrice59Manwon": 76000,
      "generalPrice84Manwon": 104500,
      "expectedNewAptPrice84Manwon": 133000
    },
    "nearestStation": "신대방역 (2호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.20"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.20"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.07.20"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "yeongdeungpo-yeongdeungpo",
    "name": "영등포1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.10.12",
    "region": "서울",
    "district": "영등포구",
    "address": "서울특별시 영등포구 영등포동 265-1 일대",
    "lat": 37.5182,
    "lng": 126.9072,
    "polygon": [
      {
        "lat": 37.518239,
        "lng": 126.90927
      },
      {
        "lat": 37.519491,
        "lng": 126.909012
      },
      {
        "lat": 37.519797,
        "lng": 126.9075
      },
      {
        "lat": 37.519885,
        "lng": 126.905933
      },
      {
        "lat": 37.518703,
        "lng": 126.905359
      },
      {
        "lat": 37.517608,
        "lng": 126.905331
      },
      {
        "lat": 37.516661,
        "lng": 126.906162
      },
      {
        "lat": 37.516506,
        "lng": 126.90762
      },
      {
        "lat": 37.517051,
        "lng": 126.908974
      }
    ],
    "totalUnits": 2134,
    "ownersCount": 985,
    "generalUnits": 832,
    "rentalUnits": 317,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 166000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 14,
    "recentTradePriceDisplay": "126.0억",
    "avgLandPricePerPyeongManwon": 10500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 11025,
      "villaOver30Year": 9975,
      "singleHouse": 3675
    },
    "askCount": 10,
    "minPriceDisplay": "115.5억",
    "minInvestmentDisplay": "73.5억",
    "estimatedPremiumDisplay": "42.0억~63.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 63000,
      "unionPrice84Manwon": 84000,
      "generalPrice59Manwon": 84000,
      "generalPrice84Manwon": 115500,
      "expectedNewAptPrice84Manwon": 147000
    },
    "nearestStation": "영등포역 (1호선) 도보 3분",
    "walkMinutes": 3,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.12"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.12"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.12"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.12"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.12"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.10.12"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "yeongdeungpo-daerim",
    "name": "대림2구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.05.18",
    "region": "서울",
    "district": "영등포구",
    "address": "서울특별시 영등포구 대림동 356-18 일대",
    "lat": 37.4942,
    "lng": 126.8985,
    "polygon": [
      {
        "lat": 37.494295,
        "lng": 126.900761
      },
      {
        "lat": 37.495407,
        "lng": 126.900064
      },
      {
        "lat": 37.495926,
        "lng": 126.898759
      },
      {
        "lat": 37.495626,
        "lng": 126.897389
      },
      {
        "lat": 37.494665,
        "lng": 126.896679
      },
      {
        "lat": 37.493719,
        "lng": 126.897128
      },
      {
        "lat": 37.492526,
        "lng": 126.897469
      },
      {
        "lat": 37.492973,
        "lng": 126.898838
      },
      {
        "lat": 37.493167,
        "lng": 126.900144
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "포스코이앤씨",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "110.4억",
    "avgLandPricePerPyeongManwon": 9200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 9660,
      "villaOver30Year": 8740,
      "singleHouse": 3220
    },
    "askCount": 10,
    "minPriceDisplay": "101.2억",
    "minInvestmentDisplay": "64.4억",
    "estimatedPremiumDisplay": "36.8억~55.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 55200,
      "unionPrice84Manwon": 73600,
      "generalPrice59Manwon": 73600,
      "generalPrice84Manwon": 101200,
      "expectedNewAptPrice84Manwon": 128800
    },
    "nearestStation": "대림역 (2·7호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.05.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.05.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.05.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.05.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.05.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "dongdaemun-dapsimni",
    "name": "답십리16구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.12.08",
    "region": "서울",
    "district": "동대문구",
    "address": "서울특별시 동대문구 답십리동 218-46 일대",
    "lat": 37.5652,
    "lng": 127.0572,
    "polygon": [
      {
        "lat": 37.565546,
        "lng": 127.059888
      },
      {
        "lat": 37.566163,
        "lng": 127.058571
      },
      {
        "lat": 37.566758,
        "lng": 127.057486
      },
      {
        "lat": 37.566727,
        "lng": 127.055891
      },
      {
        "lat": 37.566016,
        "lng": 127.054492
      },
      {
        "lat": 37.564922,
        "lng": 127.055041
      },
      {
        "lat": 37.564049,
        "lng": 127.055562
      },
      {
        "lat": 37.563535,
        "lng": 127.056894
      },
      {
        "lat": 37.563531,
        "lng": 127.05863
      },
      {
        "lat": 37.564474,
        "lng": 127.05961
      }
    ],
    "totalUnits": 1765,
    "ownersCount": 812,
    "generalUnits": 688,
    "rentalUnits": 265,
    "generalRatio": 39,
    "builder": "대우건설",
    "zoneAreaM2": 137000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "98.4억",
    "avgLandPricePerPyeongManwon": 8200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 8610,
      "villaOver30Year": 7790,
      "singleHouse": 2870
    },
    "askCount": 10,
    "minPriceDisplay": "90.2억",
    "minInvestmentDisplay": "57.4억",
    "estimatedPremiumDisplay": "32.8억~49.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 49200,
      "unionPrice84Manwon": 65600,
      "generalPrice59Manwon": 65600,
      "generalPrice84Manwon": 90200,
      "expectedNewAptPrice84Manwon": 114800
    },
    "nearestStation": "답십리역 (5호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.08"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.08"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.08"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.08"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.12.08"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "dongdaemun-jangan",
    "name": "장안1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.08.14",
    "region": "서울",
    "district": "동대문구",
    "address": "서울특별시 동대문구 장안동 254-18 일대",
    "lat": 37.5712,
    "lng": 127.0658,
    "polygon": [
      {
        "lat": 37.57159,
        "lng": 127.068137
      },
      {
        "lat": 37.57236,
        "lng": 127.06684
      },
      {
        "lat": 37.572933,
        "lng": 127.065159
      },
      {
        "lat": 37.572027,
        "lng": 127.063756
      },
      {
        "lat": 37.570803,
        "lng": 127.063419
      },
      {
        "lat": 37.570126,
        "lng": 127.064837
      },
      {
        "lat": 37.569711,
        "lng": 127.066351
      },
      {
        "lat": 37.570483,
        "lng": 127.067573
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "93.6억",
    "avgLandPricePerPyeongManwon": 7800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 8190,
      "villaOver30Year": 7410,
      "singleHouse": 2730
    },
    "askCount": 10,
    "minPriceDisplay": "85.8억",
    "minInvestmentDisplay": "54.6억",
    "estimatedPremiumDisplay": "31.2억~46.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 46800,
      "unionPrice84Manwon": 62400,
      "generalPrice59Manwon": 62400,
      "generalPrice84Manwon": 85800,
      "expectedNewAptPrice84Manwon": 109200
    },
    "nearestStation": "장한평역 (5호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.14"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.14"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.14"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.14"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.08.14"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "dongdaemun-hwigyeong",
    "name": "휘경3구역",
    "type": "재개발",
    "status": "착공",
    "statusDate": "2023.06.20",
    "region": "서울",
    "district": "동대문구",
    "address": "서울특별시 동대문구 휘경동 162-8 일대",
    "lat": 37.5948,
    "lng": 127.0618,
    "polygon": [
      {
        "lat": 37.59462,
        "lng": 127.064465
      },
      {
        "lat": 37.595682,
        "lng": 127.063491
      },
      {
        "lat": 37.596403,
        "lng": 127.062061
      },
      {
        "lat": 37.596096,
        "lng": 127.060169
      },
      {
        "lat": 37.594954,
        "lng": 127.059512
      },
      {
        "lat": 37.594065,
        "lng": 127.060391
      },
      {
        "lat": 37.593026,
        "lng": 127.061511
      },
      {
        "lat": 37.593606,
        "lng": 127.063302
      }
    ],
    "totalUnits": 1354,
    "ownersCount": 625,
    "generalUnits": 528,
    "rentalUnits": 201,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 106000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 9,
    "recentTradePriceDisplay": "90.0억",
    "avgLandPricePerPyeongManwon": 7500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 7875,
      "villaOver30Year": 7125,
      "singleHouse": 2625
    },
    "askCount": 10,
    "minPriceDisplay": "82.5억",
    "minInvestmentDisplay": "52.5억",
    "estimatedPremiumDisplay": "30.0억~45.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 45000,
      "unionPrice84Manwon": 60000,
      "generalPrice59Manwon": 60000,
      "generalPrice84Manwon": 82500,
      "expectedNewAptPrice84Manwon": 105000
    },
    "nearestStation": "회기역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.06.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.06.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.06.20"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.06.20"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.06.20"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.06.20"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.06.20"
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.06.20"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "dongdaemun-cheongnyangni",
    "name": "청량리역세권",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.12.20",
    "region": "서울",
    "district": "동대문구",
    "address": "서울특별시 동대문구 청량리동 264-1 일대",
    "lat": 37.5795,
    "lng": 127.0452,
    "polygon": [
      {
        "lat": 37.579566,
        "lng": 127.047219
      },
      {
        "lat": 37.580503,
        "lng": 127.046912
      },
      {
        "lat": 37.581202,
        "lng": 127.046034
      },
      {
        "lat": 37.581075,
        "lng": 127.044855
      },
      {
        "lat": 37.580951,
        "lng": 127.043579
      },
      {
        "lat": 37.579981,
        "lng": 127.042925
      },
      {
        "lat": 37.57895,
        "lng": 127.043249
      },
      {
        "lat": 37.577798,
        "lng": 127.043574
      },
      {
        "lat": 37.577806,
        "lng": 127.044989
      },
      {
        "lat": 37.57782,
        "lng": 127.046211
      },
      {
        "lat": 37.5785,
        "lng": 127.047225
      }
    ],
    "totalUnits": 2456,
    "ownersCount": 1124,
    "generalUnits": 957,
    "rentalUnits": 375,
    "generalRatio": 39,
    "builder": "삼성물산",
    "zoneAreaM2": 192000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 16,
    "recentTradePriceDisplay": "114.0억",
    "avgLandPricePerPyeongManwon": 9500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 9975,
      "villaOver30Year": 9025,
      "singleHouse": 3325
    },
    "askCount": 10,
    "minPriceDisplay": "104.5억",
    "minInvestmentDisplay": "66.5억",
    "estimatedPremiumDisplay": "38.0억~57.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 57000,
      "unionPrice84Manwon": 76000,
      "generalPrice59Manwon": 76000,
      "generalPrice84Manwon": 104500,
      "expectedNewAptPrice84Manwon": 133000
    },
    "nearestStation": "청량리역 복합환승센터 도보 3분",
    "walkMinutes": 3,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.12.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.12.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.12.20"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.12.20"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.12.20"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "jungnang-mangujeung-1",
    "name": "면목1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.09.15",
    "region": "서울",
    "district": "중랑구",
    "address": "서울특별시 중랑구 면목동 372-1 일대",
    "lat": 37.5742,
    "lng": 127.0882,
    "polygon": [
      {
        "lat": 37.574216,
        "lng": 127.090641
      },
      {
        "lat": 37.575301,
        "lng": 127.089746
      },
      {
        "lat": 37.575846,
        "lng": 127.088178
      },
      {
        "lat": 37.575439,
        "lng": 127.086395
      },
      {
        "lat": 37.574187,
        "lng": 127.086166
      },
      {
        "lat": 37.573177,
        "lng": 127.086765
      },
      {
        "lat": 37.572531,
        "lng": 127.088222
      },
      {
        "lat": 37.572874,
        "lng": 127.090132
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "86.4억",
    "avgLandPricePerPyeongManwon": 7200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 7560,
      "villaOver30Year": 6840,
      "singleHouse": 2520
    },
    "askCount": 10,
    "minPriceDisplay": "79.2억",
    "minInvestmentDisplay": "50.4억",
    "estimatedPremiumDisplay": "28.8억~43.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 43200,
      "unionPrice84Manwon": 57600,
      "generalPrice59Manwon": 57600,
      "generalPrice84Manwon": 79200,
      "expectedNewAptPrice84Manwon": 100800
    },
    "nearestStation": "사가정역 (7호선) 도보 6분",
    "walkMinutes": 6,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.09.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "jungnang-mangujeung-3",
    "name": "면목3구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.11.10",
    "region": "서울",
    "district": "중랑구",
    "address": "서울특별시 중랑구 면목동 412-25 일대",
    "lat": 37.5768,
    "lng": 127.0912,
    "polygon": [
      {
        "lat": 37.576563,
        "lng": 127.092789
      },
      {
        "lat": 37.577471,
        "lng": 127.092752
      },
      {
        "lat": 37.577877,
        "lng": 127.091847
      },
      {
        "lat": 37.578012,
        "lng": 127.090997
      },
      {
        "lat": 37.577821,
        "lng": 127.090058
      },
      {
        "lat": 37.577072,
        "lng": 127.089373
      },
      {
        "lat": 37.576101,
        "lng": 127.089583
      },
      {
        "lat": 37.575698,
        "lng": 127.090538
      },
      {
        "lat": 37.575225,
        "lng": 127.091464
      },
      {
        "lat": 37.575827,
        "lng": 127.092288
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "84.0억",
    "avgLandPricePerPyeongManwon": 7000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 7350,
      "villaOver30Year": 6650,
      "singleHouse": 2450
    },
    "askCount": 10,
    "minPriceDisplay": "77.0억",
    "minInvestmentDisplay": "49.0억",
    "estimatedPremiumDisplay": "28.0억~42.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 42000,
      "unionPrice84Manwon": 56000,
      "generalPrice59Manwon": 56000,
      "generalPrice84Manwon": 77000,
      "expectedNewAptPrice84Manwon": 98000
    },
    "nearestStation": "사가정역 (7호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.11.10"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.11.10"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.11.10"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "jungnang-sinnaeri",
    "name": "신내2구역",
    "type": "재개발",
    "status": "추진위원회승인",
    "statusDate": "2023.04.05",
    "region": "서울",
    "district": "중랑구",
    "address": "서울특별시 중랑구 신내동 642-1 일대",
    "lat": 37.6098,
    "lng": 127.1042,
    "polygon": [
      {
        "lat": 37.609973,
        "lng": 127.105475
      },
      {
        "lat": 37.610802,
        "lng": 127.10533
      },
      {
        "lat": 37.611048,
        "lng": 127.104431
      },
      {
        "lat": 37.610707,
        "lng": 127.103698
      },
      {
        "lat": 37.610458,
        "lng": 127.102795
      },
      {
        "lat": 37.609622,
        "lng": 127.102889
      },
      {
        "lat": 37.6089,
        "lng": 127.103186
      },
      {
        "lat": 37.608411,
        "lng": 127.103943
      },
      {
        "lat": 37.608551,
        "lng": 127.104892
      },
      {
        "lat": 37.609238,
        "lng": 127.1054
      }
    ],
    "totalUnits": 876,
    "ownersCount": 412,
    "generalUnits": 341,
    "rentalUnits": 133,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 68000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 5,
    "recentTradePriceDisplay": "69.6억",
    "avgLandPricePerPyeongManwon": 5800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 6090,
      "villaOver30Year": 5510,
      "singleHouse": 2030
    },
    "askCount": 10,
    "minPriceDisplay": "63.8억",
    "minInvestmentDisplay": "40.6억",
    "estimatedPremiumDisplay": "23.2억~34.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 34800,
      "unionPrice84Manwon": 46400,
      "generalPrice59Manwon": 46400,
      "generalPrice84Manwon": 63800,
      "expectedNewAptPrice84Manwon": 81200
    },
    "nearestStation": "신내역 (경춘선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.05"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.04.05"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "jungnang-jungwha-2",
    "name": "중화2구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2020.07.18",
    "region": "서울",
    "district": "중랑구",
    "address": "서울특별시 중랑구 중화동 512-18 일대",
    "lat": 37.6018,
    "lng": 127.0802,
    "polygon": [
      {
        "lat": 37.602159,
        "lng": 127.082099
      },
      {
        "lat": 37.603247,
        "lng": 127.081372
      },
      {
        "lat": 37.603039,
        "lng": 127.079753
      },
      {
        "lat": 37.602545,
        "lng": 127.078443
      },
      {
        "lat": 37.601421,
        "lng": 127.078196
      },
      {
        "lat": 37.600419,
        "lng": 127.079082
      },
      {
        "lat": 37.600527,
        "lng": 127.080659
      },
      {
        "lat": 37.600936,
        "lng": 127.082236
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 578,
    "generalUnits": 485,
    "rentalUnits": 182,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "81.6억",
    "avgLandPricePerPyeongManwon": 6800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 7140,
      "villaOver30Year": 6460,
      "singleHouse": 2380
    },
    "askCount": 10,
    "minPriceDisplay": "74.8억",
    "minInvestmentDisplay": "47.6억",
    "estimatedPremiumDisplay": "27.2억~40.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 40800,
      "unionPrice84Manwon": 54400,
      "generalPrice59Manwon": 54400,
      "generalPrice84Manwon": 74800,
      "expectedNewAptPrice84Manwon": 95200
    },
    "nearestStation": "중화역 (7호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2020.07.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2020.07.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2020.07.18"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "jungnang-muk",
    "name": "묵1구역",
    "type": "재개발",
    "status": "정비구역지정",
    "statusDate": "2023.08.28",
    "region": "서울",
    "district": "중랑구",
    "address": "서울특별시 중랑구 묵동 218-4 일대",
    "lat": 37.6158,
    "lng": 127.0898,
    "polygon": [
      {
        "lat": 37.615528,
        "lng": 127.091158
      },
      {
        "lat": 37.616404,
        "lng": 127.091012
      },
      {
        "lat": 37.616896,
        "lng": 127.090369
      },
      {
        "lat": 37.616953,
        "lng": 127.089661
      },
      {
        "lat": 37.616719,
        "lng": 127.08898
      },
      {
        "lat": 37.616064,
        "lng": 127.088482
      },
      {
        "lat": 37.615327,
        "lng": 127.08885
      },
      {
        "lat": 37.614633,
        "lng": 127.089194
      },
      {
        "lat": 37.614399,
        "lng": 127.089969
      },
      {
        "lat": 37.615052,
        "lng": 127.090467
      }
    ],
    "totalUnits": 987,
    "ownersCount": 462,
    "generalUnits": 385,
    "rentalUnits": 142,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 76000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 6,
    "recentTradePriceDisplay": "66.0억",
    "avgLandPricePerPyeongManwon": 5500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 5775,
      "villaOver30Year": 5225,
      "singleHouse": 1925
    },
    "askCount": 10,
    "minPriceDisplay": "60.5억",
    "minInvestmentDisplay": "38.5억",
    "estimatedPremiumDisplay": "22.0억~33.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 33000,
      "unionPrice84Manwon": 44000,
      "generalPrice59Manwon": 44000,
      "generalPrice84Manwon": 60500,
      "expectedNewAptPrice84Manwon": 77000
    },
    "nearestStation": "먹골역 (7호선) 도보 6분",
    "walkMinutes": 6,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.08.28"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "jungnang-junggyeong",
    "name": "중화역 주변",
    "type": "재개발",
    "status": "추진위원회승인",
    "statusDate": "2023.11.15",
    "region": "서울",
    "district": "중랑구",
    "address": "서울특별시 중랑구 중화동 480-9 일대",
    "lat": 37.5988,
    "lng": 127.0765,
    "polygon": [
      {
        "lat": 37.598968,
        "lng": 127.077471
      },
      {
        "lat": 37.599489,
        "lng": 127.07719
      },
      {
        "lat": 37.599995,
        "lng": 127.07667
      },
      {
        "lat": 37.599696,
        "lng": 127.075997
      },
      {
        "lat": 37.599374,
        "lng": 127.075256
      },
      {
        "lat": 37.59864,
        "lng": 127.075576
      },
      {
        "lat": 37.597861,
        "lng": 127.075561
      },
      {
        "lat": 37.597519,
        "lng": 127.076318
      },
      {
        "lat": 37.597953,
        "lng": 127.076976
      },
      {
        "lat": 37.598369,
        "lng": 127.077434
      }
    ],
    "totalUnits": 789,
    "ownersCount": 378,
    "generalUnits": 308,
    "rentalUnits": 103,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 61000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 5,
    "recentTradePriceDisplay": "78.0억",
    "avgLandPricePerPyeongManwon": 6500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 6825,
      "villaOver30Year": 6175,
      "singleHouse": 2275
    },
    "askCount": 10,
    "minPriceDisplay": "71.5억",
    "minInvestmentDisplay": "45.5억",
    "estimatedPremiumDisplay": "26.0억~39.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 39000,
      "unionPrice84Manwon": 52000,
      "generalPrice59Manwon": 52000,
      "generalPrice84Manwon": 71500,
      "expectedNewAptPrice84Manwon": 91000
    },
    "nearestStation": "중화역 (7호선) 도보 4분",
    "walkMinutes": 4,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.11.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "jungnang-sangbong-1",
    "name": "상봉1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.03.20",
    "region": "서울",
    "district": "중랑구",
    "address": "서울특별시 중랑구 상봉동 165-3 일대",
    "lat": 37.5958,
    "lng": 127.0822,
    "polygon": [
      {
        "lat": 37.59595,
        "lng": 127.083915
      },
      {
        "lat": 37.596635,
        "lng": 127.083481
      },
      {
        "lat": 37.597289,
        "lng": 127.08261
      },
      {
        "lat": 37.596991,
        "lng": 127.081395
      },
      {
        "lat": 37.596351,
        "lng": 127.08076
      },
      {
        "lat": 37.595644,
        "lng": 127.080411
      },
      {
        "lat": 37.594961,
        "lng": 127.080912
      },
      {
        "lat": 37.594392,
        "lng": 127.081812
      },
      {
        "lat": 37.594831,
        "lng": 127.082855
      },
      {
        "lat": 37.595215,
        "lng": 127.083728
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "84.0억",
    "avgLandPricePerPyeongManwon": 7000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 7350,
      "villaOver30Year": 6650,
      "singleHouse": 2450
    },
    "askCount": 10,
    "minPriceDisplay": "77.0억",
    "minInvestmentDisplay": "49.0억",
    "estimatedPremiumDisplay": "28.0억~42.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 42000,
      "unionPrice84Manwon": 56000,
      "generalPrice59Manwon": 56000,
      "generalPrice84Manwon": 77000,
      "expectedNewAptPrice84Manwon": 98000
    },
    "nearestStation": "상봉역 (경의중앙선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.03.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.03.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.03.20"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "jungnang-sangbong-2",
    "name": "상봉2구역",
    "type": "재개발",
    "status": "추진위원회승인",
    "statusDate": "2023.01.12",
    "region": "서울",
    "district": "중랑구",
    "address": "서울특별시 중랑구 상봉동 208-1 일대",
    "lat": 37.5978,
    "lng": 127.0845,
    "polygon": [
      {
        "lat": 37.597992,
        "lng": 127.086261
      },
      {
        "lat": 37.59888,
        "lng": 127.085935
      },
      {
        "lat": 37.59903,
        "lng": 127.084511
      },
      {
        "lat": 37.598622,
        "lng": 127.083433
      },
      {
        "lat": 37.59801,
        "lng": 127.082697
      },
      {
        "lat": 37.597233,
        "lng": 127.082941
      },
      {
        "lat": 37.596544,
        "lng": 127.083771
      },
      {
        "lat": 37.596858,
        "lng": 127.085027
      },
      {
        "lat": 37.597228,
        "lng": 127.08603
      }
    ],
    "totalUnits": 987,
    "ownersCount": 462,
    "generalUnits": 385,
    "rentalUnits": 140,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 76000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 6,
    "recentTradePriceDisplay": "81.6억",
    "avgLandPricePerPyeongManwon": 6800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 7140,
      "villaOver30Year": 6460,
      "singleHouse": 2380
    },
    "askCount": 10,
    "minPriceDisplay": "74.8억",
    "minInvestmentDisplay": "47.6억",
    "estimatedPremiumDisplay": "27.2억~40.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 40800,
      "unionPrice84Manwon": 54400,
      "generalPrice59Manwon": 54400,
      "generalPrice84Manwon": 74800,
      "expectedNewAptPrice84Manwon": 95200
    },
    "nearestStation": "상봉역 (경의중앙선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.01.12"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.01.12"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "seongdong-haengdang",
    "name": "행당7구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.09.18",
    "region": "서울",
    "district": "성동구",
    "address": "서울특별시 성동구 행당동 167-28 일대",
    "lat": 37.5612,
    "lng": 127.0342,
    "polygon": [
      {
        "lat": 37.561048,
        "lng": 127.035633
      },
      {
        "lat": 37.562043,
        "lng": 127.035267
      },
      {
        "lat": 37.563123,
        "lng": 127.034412
      },
      {
        "lat": 37.56257,
        "lng": 127.033075
      },
      {
        "lat": 37.561395,
        "lng": 127.032356
      },
      {
        "lat": 37.560179,
        "lng": 127.032907
      },
      {
        "lat": 37.559533,
        "lng": 127.034017
      },
      {
        "lat": 37.559746,
        "lng": 127.035394
      }
    ],
    "totalUnits": 1765,
    "ownersCount": 812,
    "generalUnits": 688,
    "rentalUnits": 265,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 137000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "138.0억",
    "avgLandPricePerPyeongManwon": 11500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 12075,
      "villaOver30Year": 10925,
      "singleHouse": 4025
    },
    "askCount": 10,
    "minPriceDisplay": "126.5억",
    "minInvestmentDisplay": "80.5억",
    "estimatedPremiumDisplay": "46.0억~69.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 69000,
      "unionPrice84Manwon": 92000,
      "generalPrice59Manwon": 92000,
      "generalPrice84Manwon": 126500,
      "expectedNewAptPrice84Manwon": 161000
    },
    "nearestStation": "왕십리역 (2·5호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.09.18"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "seongdong-wangsimni",
    "name": "왕십리 뉴타운",
    "type": "재개발",
    "status": "일반분양",
    "statusDate": "2024.06.15",
    "region": "서울",
    "district": "성동구",
    "address": "서울특별시 성동구 상왕십리동 175-1 일대",
    "lat": 37.5618,
    "lng": 127.0368,
    "polygon": [
      {
        "lat": 37.561904,
        "lng": 127.038963
      },
      {
        "lat": 37.563154,
        "lng": 127.038017
      },
      {
        "lat": 37.5642,
        "lng": 127.036687
      },
      {
        "lat": 37.563025,
        "lng": 127.035469
      },
      {
        "lat": 37.561679,
        "lng": 127.034292
      },
      {
        "lat": 37.559998,
        "lng": 127.03518
      },
      {
        "lat": 37.559332,
        "lng": 127.036916
      },
      {
        "lat": 37.560497,
        "lng": 127.038216
      }
    ],
    "totalUnits": 2876,
    "ownersCount": 1285,
    "generalUnits": 1118,
    "rentalUnits": 473,
    "generalRatio": 39,
    "builder": "대림산업",
    "zoneAreaM2": 225000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 19,
    "recentTradePriceDisplay": "174.0억",
    "avgLandPricePerPyeongManwon": 14500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 15225,
      "villaOver30Year": 13775,
      "singleHouse": 5075
    },
    "askCount": 10,
    "minPriceDisplay": "159.5억",
    "minInvestmentDisplay": "101.5억",
    "estimatedPremiumDisplay": "58.0억~87.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 87000,
      "unionPrice84Manwon": 116000,
      "generalPrice59Manwon": 116000,
      "generalPrice84Manwon": 159500,
      "expectedNewAptPrice84Manwon": 203000
    },
    "nearestStation": "왕십리역 도보 3분",
    "walkMinutes": 3,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.06.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.06.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.06.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.06.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.06.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.06.15"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.06.15"
      },
      {
        "name": "착공",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2024.06.15"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2024.06.15"
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "seongdong-seongsu",
    "name": "성수전략정비구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.11.10",
    "region": "서울",
    "district": "성동구",
    "address": "서울특별시 성동구 성수동 1가 615-1 일대",
    "lat": 37.5445,
    "lng": 127.0582,
    "polygon": [
      {
        "lat": 37.544286,
        "lng": 127.06099
      },
      {
        "lat": 37.545764,
        "lng": 127.060599
      },
      {
        "lat": 37.546654,
        "lng": 127.058983
      },
      {
        "lat": 37.546226,
        "lng": 127.05719
      },
      {
        "lat": 37.545465,
        "lng": 127.055601
      },
      {
        "lat": 37.543822,
        "lng": 127.054761
      },
      {
        "lat": 37.542454,
        "lng": 127.056298
      },
      {
        "lat": 37.54214,
        "lng": 127.058431
      },
      {
        "lat": 37.542838,
        "lng": 127.060302
      }
    ],
    "totalUnits": 3254,
    "ownersCount": 1458,
    "generalUnits": 1268,
    "rentalUnits": 528,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 255000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 21,
    "recentTradePriceDisplay": "201.6억",
    "avgLandPricePerPyeongManwon": 16800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 17640,
      "villaOver30Year": 15960,
      "singleHouse": 5880
    },
    "askCount": 10,
    "minPriceDisplay": "184.8억",
    "minInvestmentDisplay": "117.6억",
    "estimatedPremiumDisplay": "67.2억~100.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 100800,
      "unionPrice84Manwon": 134400,
      "generalPrice59Manwon": 134400,
      "generalPrice84Manwon": 184800,
      "expectedNewAptPrice84Manwon": 235200
    },
    "nearestStation": "성수역 (2호선) 도보 3분",
    "walkMinutes": 3,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.10"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.10"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.10"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.10"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.11.10"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gwangjin-jayang",
    "name": "자양재개발",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.05.28",
    "region": "서울",
    "district": "광진구",
    "address": "서울특별시 광진구 자양동 628-14 일대",
    "lat": 37.5368,
    "lng": 127.0712,
    "polygon": [
      {
        "lat": 37.536564,
        "lng": 127.073084
      },
      {
        "lat": 37.537615,
        "lng": 127.072898
      },
      {
        "lat": 37.53792,
        "lng": 127.071493
      },
      {
        "lat": 37.537656,
        "lng": 127.070343
      },
      {
        "lat": 37.537039,
        "lng": 127.069292
      },
      {
        "lat": 37.535998,
        "lng": 127.069527
      },
      {
        "lat": 37.535555,
        "lng": 127.070874
      },
      {
        "lat": 37.535734,
        "lng": 127.072267
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "138.0억",
    "avgLandPricePerPyeongManwon": 11500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 12075,
      "villaOver30Year": 10925,
      "singleHouse": 4025
    },
    "askCount": 10,
    "minPriceDisplay": "126.5억",
    "minInvestmentDisplay": "80.5억",
    "estimatedPremiumDisplay": "46.0억~69.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 69000,
      "unionPrice84Manwon": 92000,
      "generalPrice59Manwon": 92000,
      "generalPrice84Manwon": 126500,
      "expectedNewAptPrice84Manwon": 161000
    },
    "nearestStation": "뚝섬역 (2호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.05.28"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.05.28"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.05.28"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangdong-dunchon",
    "name": "둔촌주공 재건축",
    "type": "재건축",
    "status": "일반분양",
    "statusDate": "2023.11.01",
    "region": "서울",
    "district": "강동구",
    "address": "서울특별시 강동구 둔촌동 167 일대",
    "lat": 37.5312,
    "lng": 127.1348,
    "polygon": [
      {
        "lat": 37.531117,
        "lng": 127.140103
      },
      {
        "lat": 37.532889,
        "lng": 127.137733
      },
      {
        "lat": 37.534235,
        "lng": 127.135642
      },
      {
        "lat": 37.533969,
        "lng": 127.132683
      },
      {
        "lat": 37.532427,
        "lng": 127.130404
      },
      {
        "lat": 37.530092,
        "lng": 127.130248
      },
      {
        "lat": 37.527764,
        "lng": 127.131894
      },
      {
        "lat": 37.527522,
        "lng": 127.135588
      },
      {
        "lat": 37.529056,
        "lng": 127.138206
      }
    ],
    "totalUnits": 12032,
    "ownersCount": 5930,
    "generalUnits": 4786,
    "rentalUnits": 2316,
    "generalRatio": 40,
    "builder": "현대건설·대우건설·롯데건설·HDC현대산업개발",
    "zoneAreaM2": 745000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 80,
    "recentTradePriceDisplay": "153.6억",
    "avgLandPricePerPyeongManwon": 12800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 13440,
      "villaOver30Year": 12160,
      "singleHouse": 4480
    },
    "askCount": 10,
    "minPriceDisplay": "140.8억",
    "minInvestmentDisplay": "89.6억",
    "estimatedPremiumDisplay": "51.2억~76.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 76800,
      "unionPrice84Manwon": 102400,
      "generalPrice59Manwon": 102400,
      "generalPrice84Manwon": 140800,
      "expectedNewAptPrice84Manwon": 179200
    },
    "nearestStation": "올림픽공원역 (5·9호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.01"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.01"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.01"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.01"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.01"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.01"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.01"
      },
      {
        "name": "착공",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.01"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.11.01"
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangdong-godeok-3",
    "name": "고덕3단지",
    "type": "재건축",
    "status": "관리처분인가",
    "statusDate": "2023.12.15",
    "region": "서울",
    "district": "강동구",
    "address": "서울특별시 강동구 고덕동 458-1 일대",
    "lat": 37.5532,
    "lng": 127.1528,
    "polygon": [
      {
        "lat": 37.554,
        "lng": 127.164
      },
      {
        "lat": 37.5565,
        "lng": 127.171
      },
      {
        "lat": 37.5535,
        "lng": 127.1735
      },
      {
        "lat": 37.5505,
        "lng": 127.1685
      },
      {
        "lat": 37.5515,
        "lng": 127.1645
      }
    ],
    "totalUnits": 2456,
    "ownersCount": 1124,
    "generalUnits": 957,
    "rentalUnits": 375,
    "generalRatio": 39,
    "builder": "삼성물산",
    "zoneAreaM2": 192000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 16,
    "recentTradePriceDisplay": "162.0억",
    "avgLandPricePerPyeongManwon": 13500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 14175,
      "villaOver30Year": 12825,
      "singleHouse": 4725
    },
    "askCount": 10,
    "minPriceDisplay": "148.5억",
    "minInvestmentDisplay": "94.5억",
    "estimatedPremiumDisplay": "54.0억~81.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 81000,
      "unionPrice84Manwon": 108000,
      "generalPrice59Manwon": 108000,
      "generalPrice84Manwon": 148500,
      "expectedNewAptPrice84Manwon": 189000
    },
    "nearestStation": "고덕역 (5호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.12.15"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangdong-amsa",
    "name": "암사재개발",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.10.28",
    "region": "서울",
    "district": "강동구",
    "address": "서울특별시 강동구 암사동 426-15 일대",
    "lat": 37.5498,
    "lng": 127.1348,
    "polygon": [
      {
        "lat": 37.54973,
        "lng": 127.137744
      },
      {
        "lat": 37.550777,
        "lng": 127.136439
      },
      {
        "lat": 37.551644,
        "lng": 127.134907
      },
      {
        "lat": 37.551039,
        "lng": 127.133009
      },
      {
        "lat": 37.549863,
        "lng": 127.132166
      },
      {
        "lat": 37.548838,
        "lng": 127.133186
      },
      {
        "lat": 37.548185,
        "lng": 127.134706
      },
      {
        "lat": 37.548747,
        "lng": 127.136322
      }
    ],
    "totalUnits": 1654,
    "ownersCount": 762,
    "generalUnits": 645,
    "rentalUnits": 247,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 129000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "153.6억",
    "avgLandPricePerPyeongManwon": 12800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 13440,
      "villaOver30Year": 12160,
      "singleHouse": 4480
    },
    "askCount": 10,
    "minPriceDisplay": "140.8억",
    "minInvestmentDisplay": "89.6억",
    "estimatedPremiumDisplay": "51.2억~76.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 76800,
      "unionPrice84Manwon": 102400,
      "generalPrice59Manwon": 102400,
      "generalPrice84Manwon": 140800,
      "expectedNewAptPrice84Manwon": 179200
    },
    "nearestStation": "암사역 (8호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.28"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.28"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.28"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.28"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.10.28"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangnam-gaepo-dc",
    "name": "개포현대1차 재건축",
    "type": "재건축",
    "status": "관리처분인가",
    "statusDate": "2023.07.20",
    "region": "서울",
    "district": "강남구",
    "address": "서울특별시 강남구 개포동 1241-1",
    "lat": 37.4778,
    "lng": 127.0598,
    "polygon": [
      {
        "lat": 37.47827,
        "lng": 127.061986
      },
      {
        "lat": 37.479413,
        "lng": 127.060982
      },
      {
        "lat": 37.479689,
        "lng": 127.05911
      },
      {
        "lat": 37.478707,
        "lng": 127.057696
      },
      {
        "lat": 37.47727,
        "lng": 127.057334
      },
      {
        "lat": 37.476343,
        "lng": 127.058732
      },
      {
        "lat": 37.476478,
        "lng": 127.060283
      },
      {
        "lat": 37.476987,
        "lng": 127.061687
      }
    ],
    "totalUnits": 1858,
    "ownersCount": 1028,
    "generalUnits": 712,
    "rentalUnits": 118,
    "generalRatio": 38,
    "builder": "포스코이앤씨",
    "zoneAreaM2": 145000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 12,
    "recentTradePriceDisplay": "420.0억",
    "avgLandPricePerPyeongManwon": 35000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 36750,
      "villaOver30Year": 33250,
      "singleHouse": 12250
    },
    "askCount": 10,
    "minPriceDisplay": "385.0억",
    "minInvestmentDisplay": "245.0억",
    "estimatedPremiumDisplay": "140.0억~210.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 210000,
      "unionPrice84Manwon": 280000,
      "generalPrice59Manwon": 280000,
      "generalPrice84Manwon": 385000,
      "expectedNewAptPrice84Manwon": 490000
    },
    "nearestStation": "대치역 (3호선) 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.20"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.20"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.20"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.07.20"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangnam-daechi",
    "name": "대치미도 재건축",
    "type": "재건축",
    "status": "사업시행인가",
    "statusDate": "2022.06.15",
    "region": "서울",
    "district": "강남구",
    "address": "서울특별시 강남구 대치동 896-6",
    "lat": 37.4968,
    "lng": 127.0648,
    "polygon": [
      {
        "lat": 37.496443,
        "lng": 127.066327
      },
      {
        "lat": 37.497454,
        "lng": 127.066378
      },
      {
        "lat": 37.498558,
        "lng": 127.065879
      },
      {
        "lat": 37.498236,
        "lng": 127.064681
      },
      {
        "lat": 37.498123,
        "lng": 127.063651
      },
      {
        "lat": 37.497195,
        "lng": 127.063111
      },
      {
        "lat": 37.49618,
        "lng": 127.063305
      },
      {
        "lat": 37.495256,
        "lng": 127.063852
      },
      {
        "lat": 37.495191,
        "lng": 127.064934
      },
      {
        "lat": 37.495596,
        "lng": 127.065846
      }
    ],
    "totalUnits": 1848,
    "ownersCount": 1022,
    "generalUnits": 718,
    "rentalUnits": 108,
    "generalRatio": 39,
    "builder": "삼성물산",
    "zoneAreaM2": 145000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 12,
    "recentTradePriceDisplay": "504.0억",
    "avgLandPricePerPyeongManwon": 42000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 44100,
      "villaOver30Year": 39900,
      "singleHouse": 14700
    },
    "askCount": 10,
    "minPriceDisplay": "462.0억",
    "minInvestmentDisplay": "294.0억",
    "estimatedPremiumDisplay": "168.0억~252.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 252000,
      "unionPrice84Manwon": 336000,
      "generalPrice59Manwon": 336000,
      "generalPrice84Manwon": 462000,
      "expectedNewAptPrice84Manwon": 588000
    },
    "nearestStation": "한티역 (분당선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.06.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gangnam-apgujeong",
    "name": "압구정 특별계획구역",
    "type": "재건축",
    "status": "정비구역지정",
    "statusDate": "2024.01.08",
    "region": "서울",
    "district": "강남구",
    "address": "서울특별시 강남구 압구정동 458",
    "lat": 37.5278,
    "lng": 127.0282,
    "polygon": [
      {
        "lat": 37.527237,
        "lng": 127.033534
      },
      {
        "lat": 37.529201,
        "lng": 127.032005
      },
      {
        "lat": 37.531369,
        "lng": 127.030716
      },
      {
        "lat": 37.531357,
        "lng": 127.027357
      },
      {
        "lat": 37.530189,
        "lng": 127.024761
      },
      {
        "lat": 37.528308,
        "lng": 127.02339
      },
      {
        "lat": 37.526398,
        "lng": 127.024394
      },
      {
        "lat": 37.525278,
        "lng": 127.026422
      },
      {
        "lat": 37.524789,
        "lng": 127.028913
      },
      {
        "lat": 37.525127,
        "lng": 127.032048
      }
    ],
    "totalUnits": 8572,
    "ownersCount": 5218,
    "generalUnits": 3048,
    "rentalUnits": 306,
    "generalRatio": 36,
    "builder": "미정",
    "zoneAreaM2": 670000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 57,
    "recentTradePriceDisplay": "780.0억",
    "avgLandPricePerPyeongManwon": 65000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 68250,
      "villaOver30Year": 61750,
      "singleHouse": 22750
    },
    "askCount": 10,
    "minPriceDisplay": "715.0억",
    "minInvestmentDisplay": "455.0억",
    "estimatedPremiumDisplay": "260.0억~390.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 390000,
      "unionPrice84Manwon": 520000,
      "generalPrice59Manwon": 520000,
      "generalPrice84Manwon": 715000,
      "expectedNewAptPrice84Manwon": 910000
    },
    "nearestStation": "압구정역 (3호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2024.01.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "seocho-banpo",
    "name": "반포주공1단지 재건축",
    "type": "재건축",
    "status": "착공",
    "statusDate": "2022.04.20",
    "region": "서울",
    "district": "서초구",
    "address": "서울특별시 서초구 반포동 1-1 일대",
    "lat": 37.5132,
    "lng": 127.0128,
    "polygon": [
      {
        "lat": 37.512918,
        "lng": 127.015796
      },
      {
        "lat": 37.514293,
        "lng": 127.015742
      },
      {
        "lat": 37.51492,
        "lng": 127.013999
      },
      {
        "lat": 37.514962,
        "lng": 127.012339
      },
      {
        "lat": 37.514754,
        "lng": 127.010452
      },
      {
        "lat": 37.513507,
        "lng": 127.009538
      },
      {
        "lat": 37.512257,
        "lng": 127.010262
      },
      {
        "lat": 37.511334,
        "lng": 127.011499
      },
      {
        "lat": 37.511158,
        "lng": 127.013334
      },
      {
        "lat": 37.511908,
        "lng": 127.014753
      }
    ],
    "totalUnits": 2990,
    "ownersCount": 1500,
    "generalUnits": 1140,
    "rentalUnits": 350,
    "generalRatio": 38,
    "builder": "현대건설",
    "zoneAreaM2": 234000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 19,
    "recentTradePriceDisplay": "660.0억",
    "avgLandPricePerPyeongManwon": 55000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 57750,
      "villaOver30Year": 52250,
      "singleHouse": 19250
    },
    "askCount": 10,
    "minPriceDisplay": "605.0억",
    "minInvestmentDisplay": "385.0억",
    "estimatedPremiumDisplay": "220.0억~330.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 330000,
      "unionPrice84Manwon": 440000,
      "generalPrice59Manwon": 440000,
      "generalPrice84Manwon": 605000,
      "expectedNewAptPrice84Manwon": 770000
    },
    "nearestStation": "반포역 (9호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.04.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.04.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.04.20"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.04.20"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.04.20"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.04.20"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.04.20"
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.04.20"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "seocho-bangbae-2",
    "name": "방배2구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.10.05",
    "region": "서울",
    "district": "서초구",
    "address": "서울특별시 서초구 방배동 853-6 일대",
    "lat": 37.4878,
    "lng": 126.9928,
    "polygon": [
      {
        "lat": 37.487448,
        "lng": 126.994372
      },
      {
        "lat": 37.488369,
        "lng": 126.994426
      },
      {
        "lat": 37.48905,
        "lng": 126.993786
      },
      {
        "lat": 37.489009,
        "lng": 126.992904
      },
      {
        "lat": 37.489273,
        "lng": 126.991996
      },
      {
        "lat": 37.488441,
        "lng": 126.991626
      },
      {
        "lat": 37.487698,
        "lng": 126.991039
      },
      {
        "lat": 37.487073,
        "lng": 126.991777
      },
      {
        "lat": 37.486268,
        "lng": 126.992191
      },
      {
        "lat": 37.486381,
        "lng": 126.993099
      },
      {
        "lat": 37.486794,
        "lng": 126.99381
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "대우건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "456.0억",
    "avgLandPricePerPyeongManwon": 38000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 39900,
      "villaOver30Year": 36100,
      "singleHouse": 13300
    },
    "askCount": 10,
    "minPriceDisplay": "418.0억",
    "minInvestmentDisplay": "266.0억",
    "estimatedPremiumDisplay": "152.0억~228.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 228000,
      "unionPrice84Manwon": 304000,
      "generalPrice59Manwon": 304000,
      "generalPrice84Manwon": 418000,
      "expectedNewAptPrice84Manwon": 532000
    },
    "nearestStation": "방배역 (2호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.05"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.05"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.05"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.05"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.10.05"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "songpa-sanseong",
    "name": "마천재개발",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.05.12",
    "region": "서울",
    "district": "송파구",
    "address": "서울특별시 송파구 마천동 115-1 일대",
    "lat": 37.5018,
    "lng": 127.1412,
    "polygon": [
      {
        "lat": 37.501711,
        "lng": 127.144157
      },
      {
        "lat": 37.502815,
        "lng": 127.143255
      },
      {
        "lat": 37.503637,
        "lng": 127.141838
      },
      {
        "lat": 37.503547,
        "lng": 127.139805
      },
      {
        "lat": 37.502438,
        "lng": 127.138841
      },
      {
        "lat": 37.50128,
        "lng": 127.138627
      },
      {
        "lat": 37.500729,
        "lng": 127.140139
      },
      {
        "lat": 37.500384,
        "lng": 127.141482
      },
      {
        "lat": 37.50047,
        "lng": 127.14343
      }
    ],
    "totalUnits": 1654,
    "ownersCount": 762,
    "generalUnits": 645,
    "rentalUnits": 247,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 129000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "234.0억",
    "avgLandPricePerPyeongManwon": 19500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 20475,
      "villaOver30Year": 18525,
      "singleHouse": 6825
    },
    "askCount": 10,
    "minPriceDisplay": "214.5억",
    "minInvestmentDisplay": "136.5억",
    "estimatedPremiumDisplay": "78.0억~117.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 117000,
      "unionPrice84Manwon": 156000,
      "generalPrice59Manwon": 156000,
      "generalPrice84Manwon": 214500,
      "expectedNewAptPrice84Manwon": 273000
    },
    "nearestStation": "마천역 (5호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.05.12"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.05.12"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.05.12"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.05.12"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.05.12"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "suwon-jidong-1",
    "name": "지동1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.08.20",
    "region": "경기",
    "district": "수원시 팔달구",
    "address": "경기도 수원시 팔달구 지동 521-1 일대",
    "lat": 37.2598,
    "lng": 127.0218,
    "polygon": [
      {
        "lat": 37.259604,
        "lng": 127.022999
      },
      {
        "lat": 37.260572,
        "lng": 127.02292
      },
      {
        "lat": 37.261344,
        "lng": 127.022069
      },
      {
        "lat": 37.260919,
        "lng": 127.020978
      },
      {
        "lat": 37.260027,
        "lng": 127.020408
      },
      {
        "lat": 37.259089,
        "lng": 127.020768
      },
      {
        "lat": 37.258534,
        "lng": 127.02158
      },
      {
        "lat": 37.258865,
        "lng": 127.022487
      }
    ],
    "totalUnits": 1254,
    "ownersCount": 582,
    "generalUnits": 489,
    "rentalUnits": 183,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 98000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "45.6억",
    "avgLandPricePerPyeongManwon": 3800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3990,
      "villaOver30Year": 3610,
      "singleHouse": 1330
    },
    "askCount": 10,
    "minPriceDisplay": "41.8억",
    "minInvestmentDisplay": "26.6억",
    "estimatedPremiumDisplay": "15.2억~22.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 22800,
      "unionPrice84Manwon": 30400,
      "generalPrice59Manwon": 30400,
      "generalPrice84Manwon": 41800,
      "expectedNewAptPrice84Manwon": 53200
    },
    "nearestStation": "수원역 (1호선) 도보 12분",
    "walkMinutes": 12,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.20"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.20"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.08.20"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "suwon-gwonseon",
    "name": "권선1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.11.15",
    "region": "경기",
    "district": "수원시 권선구",
    "address": "경기도 수원시 권선구 권선동 1258-3 일대",
    "lat": 37.2512,
    "lng": 127.0125,
    "polygon": [
      {
        "lat": 37.251131,
        "lng": 127.014297
      },
      {
        "lat": 37.251762,
        "lng": 127.013747
      },
      {
        "lat": 37.25232,
        "lng": 127.01324
      },
      {
        "lat": 37.252662,
        "lng": 127.012324
      },
      {
        "lat": 37.252364,
        "lng": 127.011335
      },
      {
        "lat": 37.251671,
        "lng": 127.010773
      },
      {
        "lat": 37.250925,
        "lng": 127.011044
      },
      {
        "lat": 37.250221,
        "lng": 127.011305
      },
      {
        "lat": 37.24976,
        "lng": 127.012143
      },
      {
        "lat": 37.249899,
        "lng": 127.013162
      },
      {
        "lat": 37.250542,
        "lng": 127.013676
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 578,
    "generalUnits": 485,
    "rentalUnits": 182,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "42.0억",
    "avgLandPricePerPyeongManwon": 3500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3675,
      "villaOver30Year": 3325,
      "singleHouse": 1225
    },
    "askCount": 10,
    "minPriceDisplay": "38.5억",
    "minInvestmentDisplay": "24.5억",
    "estimatedPremiumDisplay": "14.0억~21.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 21000,
      "unionPrice84Manwon": 28000,
      "generalPrice59Manwon": 28000,
      "generalPrice84Manwon": 38500,
      "expectedNewAptPrice84Manwon": 49000
    },
    "nearestStation": "수원역 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.11.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "suwon-jidong-2",
    "name": "지동2구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.06.08",
    "region": "경기",
    "district": "수원시 팔달구",
    "address": "경기도 수원시 팔달구 지동 638-22 일대",
    "lat": 37.2618,
    "lng": 127.0245,
    "polygon": [
      {
        "lat": 37.261547,
        "lng": 127.026267
      },
      {
        "lat": 37.262437,
        "lng": 127.026388
      },
      {
        "lat": 37.262918,
        "lng": 127.025214
      },
      {
        "lat": 37.262948,
        "lng": 127.023941
      },
      {
        "lat": 37.26238,
        "lng": 127.023093
      },
      {
        "lat": 37.261652,
        "lng": 127.022769
      },
      {
        "lat": 37.261055,
        "lng": 127.023446
      },
      {
        "lat": 37.260309,
        "lng": 127.0244
      },
      {
        "lat": 37.260615,
        "lng": 127.025905
      }
    ],
    "totalUnits": 987,
    "ownersCount": 462,
    "generalUnits": 385,
    "rentalUnits": 142,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 76000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 6,
    "recentTradePriceDisplay": "43.2억",
    "avgLandPricePerPyeongManwon": 3600,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3780,
      "villaOver30Year": 3420,
      "singleHouse": 1260
    },
    "askCount": 10,
    "minPriceDisplay": "39.6억",
    "minInvestmentDisplay": "25.2억",
    "estimatedPremiumDisplay": "14.4억~21.6억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 21600,
      "unionPrice84Manwon": 28800,
      "generalPrice59Manwon": 28800,
      "generalPrice84Manwon": 39600,
      "expectedNewAptPrice84Manwon": 50400
    },
    "nearestStation": "수원역 도보 15분",
    "walkMinutes": 15,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.06.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.06.08"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.06.08"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "suwon-yngtong",
    "name": "영통1구역",
    "type": "재건축",
    "status": "정비구역지정",
    "statusDate": "2024.02.15",
    "region": "경기",
    "district": "수원시 영통구",
    "address": "경기도 수원시 영통구 영통동 1012-1 일대",
    "lat": 37.2645,
    "lng": 127.0548,
    "polygon": [
      {
        "lat": 37.264821,
        "lng": 127.057133
      },
      {
        "lat": 37.265425,
        "lng": 127.056115
      },
      {
        "lat": 37.265937,
        "lng": 127.055283
      },
      {
        "lat": 37.265814,
        "lng": 127.054213
      },
      {
        "lat": 37.265596,
        "lng": 127.052983
      },
      {
        "lat": 37.264676,
        "lng": 127.052569
      },
      {
        "lat": 37.263711,
        "lng": 127.052717
      },
      {
        "lat": 37.263221,
        "lng": 127.053797
      },
      {
        "lat": 37.263072,
        "lng": 127.054873
      },
      {
        "lat": 37.263271,
        "lng": 127.055941
      },
      {
        "lat": 37.263922,
        "lng": 127.05667
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 812,
    "generalUnits": 598,
    "rentalUnits": 124,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "66.0억",
    "avgLandPricePerPyeongManwon": 5500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 5775,
      "villaOver30Year": 5225,
      "singleHouse": 1925
    },
    "askCount": 10,
    "minPriceDisplay": "60.5억",
    "minInvestmentDisplay": "38.5억",
    "estimatedPremiumDisplay": "22.0억~33.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 33000,
      "unionPrice84Manwon": 44000,
      "generalPrice59Manwon": 44000,
      "generalPrice84Manwon": 60500,
      "expectedNewAptPrice84Manwon": 77000
    },
    "nearestStation": "영통역 (수인분당선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2024.02.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "goyang-ilsan-1",
    "name": "일산2구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.11.20",
    "region": "경기",
    "district": "고양시 일산동구",
    "address": "경기도 고양시 일산동구 백석동 1268-1 일대",
    "lat": 37.6712,
    "lng": 126.7952,
    "polygon": [
      {
        "lat": 37.670796,
        "lng": 126.797066
      },
      {
        "lat": 37.671957,
        "lng": 126.797222
      },
      {
        "lat": 37.672644,
        "lng": 126.796278
      },
      {
        "lat": 37.673075,
        "lng": 126.795332
      },
      {
        "lat": 37.672552,
        "lng": 126.794461
      },
      {
        "lat": 37.67191,
        "lng": 126.793897
      },
      {
        "lat": 37.671076,
        "lng": 126.793486
      },
      {
        "lat": 37.670081,
        "lng": 126.793709
      },
      {
        "lat": 37.669768,
        "lng": 126.794668
      },
      {
        "lat": 37.669273,
        "lng": 126.795621
      },
      {
        "lat": 37.669849,
        "lng": 126.796553
      }
    ],
    "totalUnits": 2134,
    "ownersCount": 985,
    "generalUnits": 832,
    "rentalUnits": 317,
    "generalRatio": 39,
    "builder": "대림산업",
    "zoneAreaM2": 166000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 14,
    "recentTradePriceDisplay": "57.6억",
    "avgLandPricePerPyeongManwon": 4800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 5040,
      "villaOver30Year": 4560,
      "singleHouse": 1680
    },
    "askCount": 10,
    "minPriceDisplay": "52.8억",
    "minInvestmentDisplay": "33.6억",
    "estimatedPremiumDisplay": "19.2억~28.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 28800,
      "unionPrice84Manwon": 38400,
      "generalPrice59Manwon": 38400,
      "generalPrice84Manwon": 52800,
      "expectedNewAptPrice84Manwon": 67200
    },
    "nearestStation": "백석역 (3호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.20"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.20"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.20"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.11.20"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "goyang-neunggok",
    "name": "능곡재개발",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.06.18",
    "region": "경기",
    "district": "고양시 덕양구",
    "address": "경기도 고양시 덕양구 능곡동 378-5 일대",
    "lat": 37.6412,
    "lng": 126.8518,
    "polygon": [
      {
        "lat": 37.640859,
        "lng": 126.853819
      },
      {
        "lat": 37.642056,
        "lng": 126.853804
      },
      {
        "lat": 37.642792,
        "lng": 126.85235
      },
      {
        "lat": 37.642243,
        "lng": 126.850889
      },
      {
        "lat": 37.641524,
        "lng": 126.849885
      },
      {
        "lat": 37.640448,
        "lng": 126.850041
      },
      {
        "lat": 37.639811,
        "lng": 126.85132
      },
      {
        "lat": 37.640136,
        "lng": 126.852728
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "54.0억",
    "avgLandPricePerPyeongManwon": 4500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4725,
      "villaOver30Year": 4275,
      "singleHouse": 1575
    },
    "askCount": 10,
    "minPriceDisplay": "49.5억",
    "minInvestmentDisplay": "31.5억",
    "estimatedPremiumDisplay": "18.0억~27.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 27000,
      "unionPrice84Manwon": 36000,
      "generalPrice59Manwon": 36000,
      "generalPrice84Manwon": 49500,
      "expectedNewAptPrice84Manwon": 63000
    },
    "nearestStation": "능곡역 (경의중앙선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.06.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "goyang-sindae",
    "name": "신대1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.08.15",
    "region": "경기",
    "district": "고양시 덕양구",
    "address": "경기도 고양시 덕양구 신대동 256-1 일대",
    "lat": 37.6352,
    "lng": 126.8412,
    "polygon": [
      {
        "lat": 37.635456,
        "lng": 126.842505
      },
      {
        "lat": 37.636552,
        "lng": 126.842188
      },
      {
        "lat": 37.63662,
        "lng": 126.840822
      },
      {
        "lat": 37.636011,
        "lng": 126.839697
      },
      {
        "lat": 37.63484,
        "lng": 126.839367
      },
      {
        "lat": 37.633894,
        "lng": 126.840245
      },
      {
        "lat": 37.633926,
        "lng": 126.841539
      },
      {
        "lat": 37.634434,
        "lng": 126.84262
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "50.4억",
    "avgLandPricePerPyeongManwon": 4200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4410,
      "villaOver30Year": 3990,
      "singleHouse": 1470
    },
    "askCount": 10,
    "minPriceDisplay": "46.2억",
    "minInvestmentDisplay": "29.4억",
    "estimatedPremiumDisplay": "16.8억~25.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 25200,
      "unionPrice84Manwon": 33600,
      "generalPrice59Manwon": 33600,
      "generalPrice84Manwon": 46200,
      "expectedNewAptPrice84Manwon": 58800
    },
    "nearestStation": "행신역 (경의선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.08.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.08.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.08.15"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "goyang-hwajung",
    "name": "화정역세권",
    "type": "재건축",
    "status": "추진위원회승인",
    "statusDate": "2023.09.10",
    "region": "경기",
    "district": "고양시 덕양구",
    "address": "경기도 고양시 덕양구 화정동 938-1 일대",
    "lat": 37.6318,
    "lng": 126.8318,
    "polygon": [
      {
        "lat": 37.631877,
        "lng": 126.833341
      },
      {
        "lat": 37.63277,
        "lng": 126.833235
      },
      {
        "lat": 37.632997,
        "lng": 126.832178
      },
      {
        "lat": 37.6333,
        "lng": 126.83108
      },
      {
        "lat": 37.632527,
        "lng": 126.83041
      },
      {
        "lat": 37.631718,
        "lng": 126.830156
      },
      {
        "lat": 37.630719,
        "lng": 126.8302
      },
      {
        "lat": 37.630404,
        "lng": 126.831359
      },
      {
        "lat": 37.630653,
        "lng": 126.83235
      },
      {
        "lat": 37.630949,
        "lng": 126.833426
      }
    ],
    "totalUnits": 1243,
    "ownersCount": 748,
    "generalUnits": 485,
    "rentalUnits": 110,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "48.0억",
    "avgLandPricePerPyeongManwon": 4000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4200,
      "villaOver30Year": 3800,
      "singleHouse": 1400
    },
    "askCount": 10,
    "minPriceDisplay": "44.0억",
    "minInvestmentDisplay": "28.0억",
    "estimatedPremiumDisplay": "16.0억~24.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 24000,
      "unionPrice84Manwon": 32000,
      "generalPrice59Manwon": 32000,
      "generalPrice84Manwon": 44000,
      "expectedNewAptPrice84Manwon": 56000
    },
    "nearestStation": "화정역 (3호선) 도보 3분",
    "walkMinutes": 3,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.10"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.09.10"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "anyang-mangpo",
    "name": "망포1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.08.15",
    "region": "경기",
    "district": "안양시 만안구",
    "address": "경기도 안양시 만안구 안양동 674-25 일대",
    "lat": 37.3985,
    "lng": 126.9348,
    "polygon": [
      {
        "lat": 37.398619,
        "lng": 126.937019
      },
      {
        "lat": 37.3995,
        "lng": 126.93635
      },
      {
        "lat": 37.400003,
        "lng": 126.935457
      },
      {
        "lat": 37.400194,
        "lng": 126.934403
      },
      {
        "lat": 37.399475,
        "lng": 126.933717
      },
      {
        "lat": 37.398812,
        "lng": 126.933252
      },
      {
        "lat": 37.398065,
        "lng": 126.933431
      },
      {
        "lat": 37.397136,
        "lng": 126.933616
      },
      {
        "lat": 37.39706,
        "lng": 126.934666
      },
      {
        "lat": 37.397186,
        "lng": 126.935594
      },
      {
        "lat": 37.397752,
        "lng": 126.936317
      }
    ],
    "totalUnits": 1654,
    "ownersCount": 762,
    "generalUnits": 645,
    "rentalUnits": 247,
    "generalRatio": 39,
    "builder": "포스코이앤씨",
    "zoneAreaM2": 129000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "50.4억",
    "avgLandPricePerPyeongManwon": 4200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4410,
      "villaOver30Year": 3990,
      "singleHouse": 1470
    },
    "askCount": 10,
    "minPriceDisplay": "46.2억",
    "minInvestmentDisplay": "29.4억",
    "estimatedPremiumDisplay": "16.8억~25.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 25200,
      "unionPrice84Manwon": 33600,
      "generalPrice59Manwon": 33600,
      "generalPrice84Manwon": 46200,
      "expectedNewAptPrice84Manwon": 58800
    },
    "nearestStation": "안양역 (1호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.08.15"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "anyang-gwanyang",
    "name": "관양1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.07.25",
    "region": "경기",
    "district": "안양시 동안구",
    "address": "경기도 안양시 동안구 관양동 1125-12 일대",
    "lat": 37.3922,
    "lng": 126.9578,
    "polygon": [
      {
        "lat": 37.392154,
        "lng": 126.960333
      },
      {
        "lat": 37.393354,
        "lng": 126.960089
      },
      {
        "lat": 37.393682,
        "lng": 126.958279
      },
      {
        "lat": 37.393822,
        "lng": 126.956423
      },
      {
        "lat": 37.392831,
        "lng": 126.9553
      },
      {
        "lat": 37.391627,
        "lng": 126.955089
      },
      {
        "lat": 37.390812,
        "lng": 126.956457
      },
      {
        "lat": 37.390467,
        "lng": 126.958201
      },
      {
        "lat": 37.391004,
        "lng": 126.959915
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "삼성물산",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "57.6억",
    "avgLandPricePerPyeongManwon": 4800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 5040,
      "villaOver30Year": 4560,
      "singleHouse": 1680
    },
    "askCount": 10,
    "minPriceDisplay": "52.8억",
    "minInvestmentDisplay": "33.6억",
    "estimatedPremiumDisplay": "19.2억~28.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 28800,
      "unionPrice84Manwon": 38400,
      "generalPrice59Manwon": 38400,
      "generalPrice84Manwon": 52800,
      "expectedNewAptPrice84Manwon": 67200
    },
    "nearestStation": "범계역 (4호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.25"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.25"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.25"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.25"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.07.25"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "anyang-bisan",
    "name": "비산1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.09.20",
    "region": "경기",
    "district": "안양시 동안구",
    "address": "경기도 안양시 동안구 비산동 1025-3 일대",
    "lat": 37.3978,
    "lng": 126.9418,
    "polygon": [
      {
        "lat": 37.39756,
        "lng": 126.943007
      },
      {
        "lat": 37.398236,
        "lng": 126.943003
      },
      {
        "lat": 37.399041,
        "lng": 126.942673
      },
      {
        "lat": 37.399009,
        "lng": 126.941678
      },
      {
        "lat": 37.398737,
        "lng": 126.940852
      },
      {
        "lat": 37.398065,
        "lng": 126.940466
      },
      {
        "lat": 37.397249,
        "lng": 126.940278
      },
      {
        "lat": 37.396901,
        "lng": 126.941168
      },
      {
        "lat": 37.396311,
        "lng": 126.94195
      },
      {
        "lat": 37.39692,
        "lng": 126.942691
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "54.0억",
    "avgLandPricePerPyeongManwon": 4500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4725,
      "villaOver30Year": 4275,
      "singleHouse": 1575
    },
    "askCount": 10,
    "minPriceDisplay": "49.5억",
    "minInvestmentDisplay": "31.5억",
    "estimatedPremiumDisplay": "18.0억~27.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 27000,
      "unionPrice84Manwon": 36000,
      "generalPrice59Manwon": 36000,
      "generalPrice84Manwon": 49500,
      "expectedNewAptPrice84Manwon": 63000
    },
    "nearestStation": "범계역 (4호선) 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.09.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.09.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.09.20"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "bucheon-simgok",
    "name": "심곡1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.10.08",
    "region": "경기",
    "district": "부천시",
    "address": "경기도 부천시 심곡동 125-5 일대",
    "lat": 37.5012,
    "lng": 126.7822,
    "polygon": [
      {
        "lat": 37.500991,
        "lng": 126.783912
      },
      {
        "lat": 37.501925,
        "lng": 126.78343
      },
      {
        "lat": 37.502893,
        "lng": 126.782777
      },
      {
        "lat": 37.502901,
        "lng": 126.78144
      },
      {
        "lat": 37.501837,
        "lng": 126.780879
      },
      {
        "lat": 37.500848,
        "lng": 126.780484
      },
      {
        "lat": 37.499807,
        "lng": 126.781045
      },
      {
        "lat": 37.499292,
        "lng": 126.782289
      },
      {
        "lat": 37.499927,
        "lng": 126.783459
      }
    ],
    "totalUnits": 1876,
    "ownersCount": 856,
    "generalUnits": 732,
    "rentalUnits": 288,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 145000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 12,
    "recentTradePriceDisplay": "54.0억",
    "avgLandPricePerPyeongManwon": 4500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4725,
      "villaOver30Year": 4275,
      "singleHouse": 1575
    },
    "askCount": 10,
    "minPriceDisplay": "49.5억",
    "minInvestmentDisplay": "31.5억",
    "estimatedPremiumDisplay": "18.0억~27.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 27000,
      "unionPrice84Manwon": 36000,
      "generalPrice59Manwon": 36000,
      "generalPrice84Manwon": 49500,
      "expectedNewAptPrice84Manwon": 63000
    },
    "nearestStation": "부천역 (1호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.08"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.08"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.08"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.08"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.10.08"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "bucheon-sosa",
    "name": "소사역세권",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.09.18",
    "region": "경기",
    "district": "부천시",
    "address": "경기도 부천시 소사동 358-12 일대",
    "lat": 37.4868,
    "lng": 126.7988,
    "polygon": [
      {
        "lat": 37.486918,
        "lng": 126.800909
      },
      {
        "lat": 37.487594,
        "lng": 126.800355
      },
      {
        "lat": 37.488141,
        "lng": 126.799524
      },
      {
        "lat": 37.488344,
        "lng": 126.798265
      },
      {
        "lat": 37.488044,
        "lng": 126.796883
      },
      {
        "lat": 37.487155,
        "lng": 126.796195
      },
      {
        "lat": 37.486287,
        "lng": 126.796806
      },
      {
        "lat": 37.485542,
        "lng": 126.797419
      },
      {
        "lat": 37.4853,
        "lng": 126.798666
      },
      {
        "lat": 37.485519,
        "lng": 126.799883
      },
      {
        "lat": 37.485916,
        "lng": 126.801307
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "50.4억",
    "avgLandPricePerPyeongManwon": 4200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4410,
      "villaOver30Year": 3990,
      "singleHouse": 1470
    },
    "askCount": 10,
    "minPriceDisplay": "46.2억",
    "minInvestmentDisplay": "29.4억",
    "estimatedPremiumDisplay": "16.8억~25.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 25200,
      "unionPrice84Manwon": 33600,
      "generalPrice59Manwon": 33600,
      "generalPrice84Manwon": 46200,
      "expectedNewAptPrice84Manwon": 58800
    },
    "nearestStation": "소사역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.09.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "bucheon-yeogok",
    "name": "역곡2구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.07.12",
    "region": "경기",
    "district": "부천시",
    "address": "경기도 부천시 역곡동 164-8 일대",
    "lat": 37.4912,
    "lng": 126.8068,
    "polygon": [
      {
        "lat": 37.490855,
        "lng": 126.808925
      },
      {
        "lat": 37.491684,
        "lng": 126.808235
      },
      {
        "lat": 37.492174,
        "lng": 126.807426
      },
      {
        "lat": 37.492722,
        "lng": 126.806134
      },
      {
        "lat": 37.491993,
        "lng": 126.805029
      },
      {
        "lat": 37.491043,
        "lng": 126.804762
      },
      {
        "lat": 37.490035,
        "lng": 126.805164
      },
      {
        "lat": 37.489959,
        "lng": 126.806688
      },
      {
        "lat": 37.490343,
        "lng": 126.807737
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "48.0억",
    "avgLandPricePerPyeongManwon": 4000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4200,
      "villaOver30Year": 3800,
      "singleHouse": 1400
    },
    "askCount": 10,
    "minPriceDisplay": "44.0억",
    "minInvestmentDisplay": "28.0억",
    "estimatedPremiumDisplay": "16.0억~24.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 24000,
      "unionPrice84Manwon": 32000,
      "generalPrice59Manwon": 32000,
      "generalPrice84Manwon": 44000,
      "expectedNewAptPrice84Manwon": 56000
    },
    "nearestStation": "역곡역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.07.12"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.07.12"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.07.12"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "bucheon-bucheon-new",
    "name": "부천시청역세권",
    "type": "재건축",
    "status": "추진위원회승인",
    "statusDate": "2023.11.05",
    "region": "경기",
    "district": "부천시",
    "address": "경기도 부천시 중동 1175-1 일대",
    "lat": 37.5012,
    "lng": 126.7642,
    "polygon": [
      {
        "lat": 37.501526,
        "lng": 126.765509
      },
      {
        "lat": 37.502051,
        "lng": 126.76491
      },
      {
        "lat": 37.502346,
        "lng": 126.764283
      },
      {
        "lat": 37.502209,
        "lng": 126.763581
      },
      {
        "lat": 37.501706,
        "lng": 126.762974
      },
      {
        "lat": 37.500943,
        "lng": 126.763169
      },
      {
        "lat": 37.500196,
        "lng": 126.763362
      },
      {
        "lat": 37.499948,
        "lng": 126.76411
      },
      {
        "lat": 37.500321,
        "lng": 126.764739
      },
      {
        "lat": 37.500801,
        "lng": 126.765167
      }
    ],
    "totalUnits": 987,
    "ownersCount": 585,
    "generalUnits": 385,
    "rentalUnits": 117,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 77000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 6,
    "recentTradePriceDisplay": "62.4억",
    "avgLandPricePerPyeongManwon": 5200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 5460,
      "villaOver30Year": 4940,
      "singleHouse": 1820
    },
    "askCount": 10,
    "minPriceDisplay": "57.2억",
    "minInvestmentDisplay": "36.4억",
    "estimatedPremiumDisplay": "20.8억~31.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 31200,
      "unionPrice84Manwon": 41600,
      "generalPrice59Manwon": 41600,
      "generalPrice84Manwon": 57200,
      "expectedNewAptPrice84Manwon": 72800
    },
    "nearestStation": "부천시청역 (7호선) 도보 3분",
    "walkMinutes": 3,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.05"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.11.05"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "namyangju-hoepyeong",
    "name": "회평재개발",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.08.05",
    "region": "경기",
    "district": "남양주시",
    "address": "경기도 남양주시 화도읍 원가락리 234-1 일대",
    "lat": 37.6378,
    "lng": 127.3082,
    "polygon": [
      {
        "lat": 37.638103,
        "lng": 127.310115
      },
      {
        "lat": 37.639058,
        "lng": 127.309469
      },
      {
        "lat": 37.639557,
        "lng": 127.308152
      },
      {
        "lat": 37.638972,
        "lng": 127.306908
      },
      {
        "lat": 37.638055,
        "lng": 127.306118
      },
      {
        "lat": 37.637038,
        "lng": 127.306621
      },
      {
        "lat": 37.636287,
        "lng": 127.307555
      },
      {
        "lat": 37.636624,
        "lng": 127.308775
      },
      {
        "lat": 37.636957,
        "lng": 127.310133
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "38.4억",
    "avgLandPricePerPyeongManwon": 3200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3360,
      "villaOver30Year": 3040,
      "singleHouse": 1120
    },
    "askCount": 10,
    "minPriceDisplay": "35.2억",
    "minInvestmentDisplay": "22.4억",
    "estimatedPremiumDisplay": "12.8억~19.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 19200,
      "unionPrice84Manwon": 25600,
      "generalPrice59Manwon": 25600,
      "generalPrice84Manwon": 35200,
      "expectedNewAptPrice84Manwon": 44800
    },
    "nearestStation": "화도역 (경춘선) 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.05"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.05"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.05"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.05"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.08.05"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "namyangju-dasan",
    "name": "다산신도시재건축",
    "type": "재건축",
    "status": "정비구역지정",
    "statusDate": "2024.01.20",
    "region": "경기",
    "district": "남양주시",
    "address": "경기도 남양주시 다산동 6512-1 일대",
    "lat": 37.5978,
    "lng": 127.1742,
    "polygon": [
      {
        "lat": 37.597835,
        "lng": 127.17726
      },
      {
        "lat": 37.599301,
        "lng": 127.176478
      },
      {
        "lat": 37.599703,
        "lng": 127.174147
      },
      {
        "lat": 37.599299,
        "lng": 127.171756
      },
      {
        "lat": 37.597761,
        "lng": 127.17077
      },
      {
        "lat": 37.596209,
        "lng": 127.171784
      },
      {
        "lat": 37.595936,
        "lng": 127.174252
      },
      {
        "lat": 37.596557,
        "lng": 127.176226
      }
    ],
    "totalUnits": 2134,
    "ownersCount": 985,
    "generalUnits": 832,
    "rentalUnits": 317,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 166000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 14,
    "recentTradePriceDisplay": "57.6억",
    "avgLandPricePerPyeongManwon": 4800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 5040,
      "villaOver30Year": 4560,
      "singleHouse": 1680
    },
    "askCount": 10,
    "minPriceDisplay": "52.8억",
    "minInvestmentDisplay": "33.6억",
    "estimatedPremiumDisplay": "19.2억~28.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 28800,
      "unionPrice84Manwon": 38400,
      "generalPrice59Manwon": 38400,
      "generalPrice84Manwon": 52800,
      "expectedNewAptPrice84Manwon": 67200
    },
    "nearestStation": "다산역 인근",
    "walkMinutes": 15,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2024.01.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "siheung-jeongwang",
    "name": "정왕1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.09.22",
    "region": "경기",
    "district": "시흥시",
    "address": "경기도 시흥시 정왕동 1265-5 일대",
    "lat": 37.3445,
    "lng": 126.7318,
    "polygon": [
      {
        "lat": 37.344571,
        "lng": 126.734878
      },
      {
        "lat": 37.345467,
        "lng": 126.733731
      },
      {
        "lat": 37.345739,
        "lng": 126.732353
      },
      {
        "lat": 37.345884,
        "lng": 126.73101
      },
      {
        "lat": 37.345298,
        "lng": 126.729948
      },
      {
        "lat": 37.344449,
        "lng": 126.729568
      },
      {
        "lat": 37.343523,
        "lng": 126.72985
      },
      {
        "lat": 37.342965,
        "lng": 126.731115
      },
      {
        "lat": 37.343024,
        "lng": 126.732642
      },
      {
        "lat": 37.343644,
        "lng": 126.733787
      }
    ],
    "totalUnits": 1654,
    "ownersCount": 762,
    "generalUnits": 645,
    "rentalUnits": 247,
    "generalRatio": 39,
    "builder": "대우건설",
    "zoneAreaM2": 129000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "36.0억",
    "avgLandPricePerPyeongManwon": 3000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3150,
      "villaOver30Year": 2850,
      "singleHouse": 1050
    },
    "askCount": 10,
    "minPriceDisplay": "33.0억",
    "minInvestmentDisplay": "21.0억",
    "estimatedPremiumDisplay": "12.0억~18.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 18000,
      "unionPrice84Manwon": 24000,
      "generalPrice59Manwon": 24000,
      "generalPrice84Manwon": 33000,
      "expectedNewAptPrice84Manwon": 42000
    },
    "nearestStation": "정왕역 (수인분당선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.22"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.22"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.22"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.22"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.22"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.09.22"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gwacheon-jungang-1",
    "name": "과천주공6단지",
    "type": "재건축",
    "status": "착공",
    "statusDate": "2023.02.15",
    "region": "경기",
    "district": "과천시",
    "address": "경기도 과천시 별양동 1-2 일대",
    "lat": 37.4298,
    "lng": 127.0048,
    "polygon": [
      {
        "lat": 37.430058,
        "lng": 127.006752
      },
      {
        "lat": 37.431017,
        "lng": 127.00657
      },
      {
        "lat": 37.431974,
        "lng": 127.005555
      },
      {
        "lat": 37.431284,
        "lng": 127.004137
      },
      {
        "lat": 37.430774,
        "lng": 127.003175
      },
      {
        "lat": 37.430014,
        "lng": 127.002153
      },
      {
        "lat": 37.428976,
        "lng": 127.002567
      },
      {
        "lat": 37.428346,
        "lng": 127.00363
      },
      {
        "lat": 37.428266,
        "lng": 127.00487
      },
      {
        "lat": 37.428127,
        "lng": 127.006363
      },
      {
        "lat": 37.428995,
        "lng": 127.007411
      }
    ],
    "totalUnits": 2198,
    "ownersCount": 1012,
    "generalUnits": 852,
    "rentalUnits": 334,
    "generalRatio": 39,
    "builder": "삼성물산",
    "zoneAreaM2": 172000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 14,
    "recentTradePriceDisplay": "114.0억",
    "avgLandPricePerPyeongManwon": 9500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 9975,
      "villaOver30Year": 9025,
      "singleHouse": 3325
    },
    "askCount": 10,
    "minPriceDisplay": "104.5억",
    "minInvestmentDisplay": "66.5억",
    "estimatedPremiumDisplay": "38.0억~57.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 57000,
      "unionPrice84Manwon": 76000,
      "generalPrice59Manwon": 76000,
      "generalPrice84Manwon": 104500,
      "expectedNewAptPrice84Manwon": 133000
    },
    "nearestStation": "과천역 (4호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.02.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.02.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.02.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.02.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.02.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.02.15"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.02.15"
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.02.15"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "uiwang-1",
    "name": "의왕내손1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.10.22",
    "region": "경기",
    "district": "의왕시",
    "address": "경기도 의왕시 내손동 1258-8 일대",
    "lat": 37.3548,
    "lng": 126.9718,
    "polygon": [
      {
        "lat": 37.354985,
        "lng": 126.973773
      },
      {
        "lat": 37.356261,
        "lng": 126.973723
      },
      {
        "lat": 37.35645,
        "lng": 126.971895
      },
      {
        "lat": 37.356124,
        "lng": 126.970319
      },
      {
        "lat": 37.355232,
        "lng": 126.968932
      },
      {
        "lat": 37.353988,
        "lng": 126.969564
      },
      {
        "lat": 37.352931,
        "lng": 126.970692
      },
      {
        "lat": 37.353094,
        "lng": 126.972589
      },
      {
        "lat": 37.35395,
        "lng": 126.973747
      }
    ],
    "totalUnits": 1765,
    "ownersCount": 812,
    "generalUnits": 688,
    "rentalUnits": 265,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 137000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "54.0억",
    "avgLandPricePerPyeongManwon": 4500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4725,
      "villaOver30Year": 4275,
      "singleHouse": 1575
    },
    "askCount": 10,
    "minPriceDisplay": "49.5억",
    "minInvestmentDisplay": "31.5억",
    "estimatedPremiumDisplay": "18.0억~27.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 27000,
      "unionPrice84Manwon": 36000,
      "generalPrice59Manwon": 36000,
      "generalPrice84Manwon": 49500,
      "expectedNewAptPrice84Manwon": 63000
    },
    "nearestStation": "의왕역 (1호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.22"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.22"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.22"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.22"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.22"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.10.22"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gunpo-1",
    "name": "군포당정1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.09.28",
    "region": "경기",
    "district": "군포시",
    "address": "경기도 군포시 당정동 456-12 일대",
    "lat": 37.3448,
    "lng": 126.9348,
    "polygon": [
      {
        "lat": 37.345147,
        "lng": 126.936779
      },
      {
        "lat": 37.345825,
        "lng": 126.936189
      },
      {
        "lat": 37.346586,
        "lng": 126.935269
      },
      {
        "lat": 37.34653,
        "lng": 126.933757
      },
      {
        "lat": 37.345585,
        "lng": 126.933153
      },
      {
        "lat": 37.344853,
        "lng": 126.932655
      },
      {
        "lat": 37.343903,
        "lng": 126.932599
      },
      {
        "lat": 37.343565,
        "lng": 126.9339
      },
      {
        "lat": 37.343309,
        "lng": 126.935033
      },
      {
        "lat": 37.343599,
        "lng": 126.936209
      },
      {
        "lat": 37.344375,
        "lng": 126.936661
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "50.4억",
    "avgLandPricePerPyeongManwon": 4200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4410,
      "villaOver30Year": 3990,
      "singleHouse": 1470
    },
    "askCount": 10,
    "minPriceDisplay": "46.2억",
    "minInvestmentDisplay": "29.4억",
    "estimatedPremiumDisplay": "16.8억~25.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 25200,
      "unionPrice84Manwon": 33600,
      "generalPrice59Manwon": 33600,
      "generalPrice84Manwon": 46200,
      "expectedNewAptPrice84Manwon": 58800
    },
    "nearestStation": "당정역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.28"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.28"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.28"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.28"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.09.28"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "ansan-1",
    "name": "안산고잔1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.09.08",
    "region": "경기",
    "district": "안산시 단원구",
    "address": "경기도 안산시 단원구 고잔동 752-15 일대",
    "lat": 37.3215,
    "lng": 126.8318,
    "polygon": [
      {
        "lat": 37.321355,
        "lng": 126.833181
      },
      {
        "lat": 37.322614,
        "lng": 126.833527
      },
      {
        "lat": 37.32311,
        "lng": 126.832285
      },
      {
        "lat": 37.323067,
        "lng": 126.831084
      },
      {
        "lat": 37.322201,
        "lng": 126.830323
      },
      {
        "lat": 37.321161,
        "lng": 126.830366
      },
      {
        "lat": 37.319948,
        "lng": 126.830621
      },
      {
        "lat": 37.319805,
        "lng": 126.831916
      },
      {
        "lat": 37.319996,
        "lng": 126.833295
      }
    ],
    "totalUnits": 1876,
    "ownersCount": 856,
    "generalUnits": 732,
    "rentalUnits": 288,
    "generalRatio": 39,
    "builder": "삼성물산",
    "zoneAreaM2": 145000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 12,
    "recentTradePriceDisplay": "45.6억",
    "avgLandPricePerPyeongManwon": 3800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3990,
      "villaOver30Year": 3610,
      "singleHouse": 1330
    },
    "askCount": 10,
    "minPriceDisplay": "41.8억",
    "minInvestmentDisplay": "26.6억",
    "estimatedPremiumDisplay": "15.2억~22.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 22800,
      "unionPrice84Manwon": 30400,
      "generalPrice59Manwon": 30400,
      "generalPrice84Manwon": 41800,
      "expectedNewAptPrice84Manwon": 53200
    },
    "nearestStation": "고잔역 (4호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.08"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.08"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.08"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.08"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.09.08"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "hwaseong-1",
    "name": "화성동탄2구역",
    "type": "재건축",
    "status": "추진위원회승인",
    "statusDate": "2023.11.20",
    "region": "경기",
    "district": "화성시",
    "address": "경기도 화성시 동탄동 1258-1 일대",
    "lat": 37.2012,
    "lng": 127.0648,
    "polygon": [
      {
        "lat": 37.200941,
        "lng": 127.066259
      },
      {
        "lat": 37.202099,
        "lng": 127.066259
      },
      {
        "lat": 37.202308,
        "lng": 127.065035
      },
      {
        "lat": 37.202157,
        "lng": 127.064093
      },
      {
        "lat": 37.201465,
        "lng": 127.063302
      },
      {
        "lat": 37.200477,
        "lng": 127.063628
      },
      {
        "lat": 37.19985,
        "lng": 127.064513
      },
      {
        "lat": 37.199848,
        "lng": 127.065799
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 748,
    "generalUnits": 485,
    "rentalUnits": 112,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "66.0억",
    "avgLandPricePerPyeongManwon": 5500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 5775,
      "villaOver30Year": 5225,
      "singleHouse": 1925
    },
    "askCount": 10,
    "minPriceDisplay": "60.5억",
    "minInvestmentDisplay": "38.5억",
    "estimatedPremiumDisplay": "22.0억~33.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 33000,
      "unionPrice84Manwon": 44000,
      "generalPrice59Manwon": 44000,
      "generalPrice84Manwon": 60500,
      "expectedNewAptPrice84Manwon": 77000
    },
    "nearestStation": "동탄역 (GTX-A·SRT) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.11.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "hanam-1",
    "name": "하남미사1구역",
    "type": "재건축",
    "status": "추진위원회승인",
    "statusDate": "2023.10.28",
    "region": "경기",
    "district": "하남시",
    "address": "경기도 하남시 미사동 456-1 일대",
    "lat": 37.5512,
    "lng": 127.1948,
    "polygon": [
      {
        "lat": 37.551132,
        "lng": 127.196285
      },
      {
        "lat": 37.551997,
        "lng": 127.195887
      },
      {
        "lat": 37.552807,
        "lng": 127.195177
      },
      {
        "lat": 37.552271,
        "lng": 127.194227
      },
      {
        "lat": 37.55177,
        "lng": 127.193387
      },
      {
        "lat": 37.550867,
        "lng": 127.193687
      },
      {
        "lat": 37.550244,
        "lng": 127.194162
      },
      {
        "lat": 37.549794,
        "lng": 127.194986
      },
      {
        "lat": 37.550275,
        "lng": 127.19584
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 748,
    "generalUnits": 485,
    "rentalUnits": 112,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "81.6억",
    "avgLandPricePerPyeongManwon": 6800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 7140,
      "villaOver30Year": 6460,
      "singleHouse": 2380
    },
    "askCount": 10,
    "minPriceDisplay": "74.8억",
    "minInvestmentDisplay": "47.6억",
    "estimatedPremiumDisplay": "27.2억~40.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 40800,
      "unionPrice84Manwon": 54400,
      "generalPrice59Manwon": 54400,
      "generalPrice84Manwon": 74800,
      "expectedNewAptPrice84Manwon": 95200
    },
    "nearestStation": "미사역 (5호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.28"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.10.28"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "uijeongbu-1",
    "name": "의정부1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.11.15",
    "region": "경기",
    "district": "의정부시",
    "address": "경기도 의정부시 의정부동 452-8 일대",
    "lat": 37.7348,
    "lng": 127.0472,
    "polygon": [
      {
        "lat": 37.734292,
        "lng": 127.049864
      },
      {
        "lat": 37.735446,
        "lng": 127.048905
      },
      {
        "lat": 37.736311,
        "lng": 127.047829
      },
      {
        "lat": 37.736174,
        "lng": 127.046062
      },
      {
        "lat": 37.735315,
        "lng": 127.0445
      },
      {
        "lat": 37.73412,
        "lng": 127.045406
      },
      {
        "lat": 37.733258,
        "lng": 127.046558
      },
      {
        "lat": 37.733662,
        "lng": 127.048142
      }
    ],
    "totalUnits": 1765,
    "ownersCount": 812,
    "generalUnits": 688,
    "rentalUnits": 265,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 137000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "54.0억",
    "avgLandPricePerPyeongManwon": 4500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4725,
      "villaOver30Year": 4275,
      "singleHouse": 1575
    },
    "askCount": 10,
    "minPriceDisplay": "49.5억",
    "minInvestmentDisplay": "31.5억",
    "estimatedPremiumDisplay": "18.0억~27.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 27000,
      "unionPrice84Manwon": 36000,
      "generalPrice59Manwon": 36000,
      "generalPrice84Manwon": 49500,
      "expectedNewAptPrice84Manwon": 63000
    },
    "nearestStation": "의정부역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.11.15"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "uijeongbu-2",
    "name": "의정부민락2구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.10.25",
    "region": "경기",
    "district": "의정부시",
    "address": "경기도 의정부시 민락동 1258-8 일대",
    "lat": 37.7512,
    "lng": 127.0718,
    "polygon": [
      {
        "lat": 37.751452,
        "lng": 127.073378
      },
      {
        "lat": 37.75235,
        "lng": 127.072984
      },
      {
        "lat": 37.752667,
        "lng": 127.07174
      },
      {
        "lat": 37.752519,
        "lng": 127.070257
      },
      {
        "lat": 37.751385,
        "lng": 127.07012
      },
      {
        "lat": 37.750413,
        "lng": 127.07014
      },
      {
        "lat": 37.750045,
        "lng": 127.071303
      },
      {
        "lat": 37.749981,
        "lng": 127.072438
      },
      {
        "lat": 37.750344,
        "lng": 127.073888
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "50.4억",
    "avgLandPricePerPyeongManwon": 4200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4410,
      "villaOver30Year": 3990,
      "singleHouse": 1470
    },
    "askCount": 10,
    "minPriceDisplay": "46.2억",
    "minInvestmentDisplay": "29.4억",
    "estimatedPremiumDisplay": "16.8억~25.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 25200,
      "unionPrice84Manwon": 33600,
      "generalPrice59Manwon": 33600,
      "generalPrice84Manwon": 46200,
      "expectedNewAptPrice84Manwon": 58800
    },
    "nearestStation": "민락역 인근",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.25"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.25"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.25"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.25"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.10.25"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gwangju-gyeonggi-1",
    "name": "광주태전1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.08.18",
    "region": "경기",
    "district": "광주시",
    "address": "경기도 광주시 태전동 658-8 일대",
    "lat": 37.4248,
    "lng": 127.2548,
    "polygon": [
      {
        "lat": 37.424674,
        "lng": 127.256399
      },
      {
        "lat": 37.425399,
        "lng": 127.256134
      },
      {
        "lat": 37.425928,
        "lng": 127.255549
      },
      {
        "lat": 37.425914,
        "lng": 127.254733
      },
      {
        "lat": 37.425828,
        "lng": 127.253943
      },
      {
        "lat": 37.425383,
        "lng": 127.253092
      },
      {
        "lat": 37.4245,
        "lng": 127.253031
      },
      {
        "lat": 37.423724,
        "lng": 127.253501
      },
      {
        "lat": 37.423503,
        "lng": 127.254441
      },
      {
        "lat": 37.423673,
        "lng": 127.255258
      },
      {
        "lat": 37.423783,
        "lng": 127.256313
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 578,
    "generalUnits": 485,
    "rentalUnits": 182,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "42.0억",
    "avgLandPricePerPyeongManwon": 3500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3675,
      "villaOver30Year": 3325,
      "singleHouse": 1225
    },
    "askCount": 10,
    "minPriceDisplay": "38.5억",
    "minInvestmentDisplay": "24.5억",
    "estimatedPremiumDisplay": "14.0억~21.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 21000,
      "unionPrice84Manwon": 28000,
      "generalPrice59Manwon": 28000,
      "generalPrice84Manwon": 38500,
      "expectedNewAptPrice84Manwon": 49000
    },
    "nearestStation": "경기광주역 (경강선) 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.08.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "yangju-1",
    "name": "양주회천1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.11.22",
    "region": "경기",
    "district": "양주시",
    "address": "경기도 양주시 회천동 456-8 일대",
    "lat": 37.7448,
    "lng": 127.0648,
    "polygon": [
      {
        "lat": 37.744612,
        "lng": 127.066166
      },
      {
        "lat": 37.745503,
        "lng": 127.065693
      },
      {
        "lat": 37.746182,
        "lng": 127.064979
      },
      {
        "lat": 37.745868,
        "lng": 127.064007
      },
      {
        "lat": 37.745005,
        "lng": 127.063312
      },
      {
        "lat": 37.744084,
        "lng": 127.06389
      },
      {
        "lat": 37.743235,
        "lng": 127.064597
      },
      {
        "lat": 37.743528,
        "lng": 127.065744
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "38.4억",
    "avgLandPricePerPyeongManwon": 3200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3360,
      "villaOver30Year": 3040,
      "singleHouse": 1120
    },
    "askCount": 10,
    "minPriceDisplay": "35.2억",
    "minInvestmentDisplay": "22.4억",
    "estimatedPremiumDisplay": "12.8억~19.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 19200,
      "unionPrice84Manwon": 25600,
      "generalPrice59Manwon": 25600,
      "generalPrice84Manwon": 35200,
      "expectedNewAptPrice84Manwon": 44800
    },
    "nearestStation": "양주역 (1호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.11.22"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.11.22"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.11.22"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "incheon-bupyeong-1",
    "name": "부평1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.10.15",
    "region": "인천",
    "district": "부평구",
    "address": "인천광역시 부평구 부평동 545-2 일대",
    "lat": 37.5058,
    "lng": 126.7208,
    "polygon": [
      {
        "lat": 37.505861,
        "lng": 126.723353
      },
      {
        "lat": 37.507161,
        "lng": 126.723512
      },
      {
        "lat": 37.507367,
        "lng": 126.721497
      },
      {
        "lat": 37.50788,
        "lng": 126.719608
      },
      {
        "lat": 37.506673,
        "lng": 126.718765
      },
      {
        "lat": 37.505731,
        "lng": 126.717869
      },
      {
        "lat": 37.504904,
        "lng": 126.719014
      },
      {
        "lat": 37.50409,
        "lng": 126.720039
      },
      {
        "lat": 37.503984,
        "lng": 126.721841
      },
      {
        "lat": 37.504667,
        "lng": 126.723441
      }
    ],
    "totalUnits": 2134,
    "ownersCount": 985,
    "generalUnits": 832,
    "rentalUnits": 317,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 166000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 14,
    "recentTradePriceDisplay": "45.6억",
    "avgLandPricePerPyeongManwon": 3800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3990,
      "villaOver30Year": 3610,
      "singleHouse": 1330
    },
    "askCount": 10,
    "minPriceDisplay": "41.8억",
    "minInvestmentDisplay": "26.6억",
    "estimatedPremiumDisplay": "15.2억~22.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 22800,
      "unionPrice84Manwon": 30400,
      "generalPrice59Manwon": 30400,
      "generalPrice84Manwon": 41800,
      "expectedNewAptPrice84Manwon": 53200
    },
    "nearestStation": "부평역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.10.15"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "incheon-bupyeong-4",
    "name": "부평4구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.09.28",
    "region": "인천",
    "district": "부평구",
    "address": "인천광역시 부평구 부개동 412-15 일대",
    "lat": 37.5112,
    "lng": 126.7182,
    "polygon": [
      {
        "lat": 37.511326,
        "lng": 126.721098
      },
      {
        "lat": 37.512154,
        "lng": 126.719685
      },
      {
        "lat": 37.512843,
        "lng": 126.71847
      },
      {
        "lat": 37.512265,
        "lng": 126.717144
      },
      {
        "lat": 37.51164,
        "lng": 126.715963
      },
      {
        "lat": 37.510515,
        "lng": 126.715879
      },
      {
        "lat": 37.509593,
        "lng": 126.717019
      },
      {
        "lat": 37.50957,
        "lng": 126.718791
      },
      {
        "lat": 37.510304,
        "lng": 126.720015
      }
    ],
    "totalUnits": 1654,
    "ownersCount": 762,
    "generalUnits": 645,
    "rentalUnits": 247,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 129000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "43.2억",
    "avgLandPricePerPyeongManwon": 3600,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3780,
      "villaOver30Year": 3420,
      "singleHouse": 1260
    },
    "askCount": 10,
    "minPriceDisplay": "39.6억",
    "minInvestmentDisplay": "25.2억",
    "estimatedPremiumDisplay": "14.4억~21.6억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 21600,
      "unionPrice84Manwon": 28800,
      "generalPrice59Manwon": 28800,
      "generalPrice84Manwon": 39600,
      "expectedNewAptPrice84Manwon": 50400
    },
    "nearestStation": "부개역 (1호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.28"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.28"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.28"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.28"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.09.28"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "incheon-juan",
    "name": "주안1구역",
    "type": "재개발",
    "status": "착공",
    "statusDate": "2023.04.10",
    "region": "인천",
    "district": "미추홀구",
    "address": "인천광역시 미추홀구 주안동 1125-8 일대",
    "lat": 37.4632,
    "lng": 126.6972,
    "polygon": [
      {
        "lat": 37.462896,
        "lng": 126.699814
      },
      {
        "lat": 37.464107,
        "lng": 126.699463
      },
      {
        "lat": 37.464919,
        "lng": 126.698097
      },
      {
        "lat": 37.464802,
        "lng": 126.696332
      },
      {
        "lat": 37.464187,
        "lng": 126.694666
      },
      {
        "lat": 37.462856,
        "lng": 126.694452
      },
      {
        "lat": 37.461718,
        "lng": 126.695406
      },
      {
        "lat": 37.461788,
        "lng": 126.697213
      },
      {
        "lat": 37.461829,
        "lng": 126.698902
      }
    ],
    "totalUnits": 1987,
    "ownersCount": 912,
    "generalUnits": 775,
    "rentalUnits": 300,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 155000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 13,
    "recentTradePriceDisplay": "40.8억",
    "avgLandPricePerPyeongManwon": 3400,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3570,
      "villaOver30Year": 3230,
      "singleHouse": 1190
    },
    "askCount": 10,
    "minPriceDisplay": "37.4억",
    "minInvestmentDisplay": "23.8억",
    "estimatedPremiumDisplay": "13.6억~20.4억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 20400,
      "unionPrice84Manwon": 27200,
      "generalPrice59Manwon": 27200,
      "generalPrice84Manwon": 37400,
      "expectedNewAptPrice84Manwon": 47600
    },
    "nearestStation": "주안역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.10"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.10"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.10"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.10"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.10"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.10"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.10"
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.04.10"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "incheon-juan-4",
    "name": "주안4구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.11.18",
    "region": "인천",
    "district": "미추홀구",
    "address": "인천광역시 미추홀구 주안동 482-12 일대",
    "lat": 37.4658,
    "lng": 126.6942,
    "polygon": [
      {
        "lat": 37.466062,
        "lng": 126.69604
      },
      {
        "lat": 37.466706,
        "lng": 126.695375
      },
      {
        "lat": 37.467065,
        "lng": 126.694408
      },
      {
        "lat": 37.467133,
        "lng": 126.693144
      },
      {
        "lat": 37.466331,
        "lng": 126.692569
      },
      {
        "lat": 37.465557,
        "lng": 126.692496
      },
      {
        "lat": 37.464437,
        "lng": 126.692432
      },
      {
        "lat": 37.464544,
        "lng": 126.693994
      },
      {
        "lat": 37.464162,
        "lng": 126.695498
      },
      {
        "lat": 37.465052,
        "lng": 126.696497
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "대우건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "38.4억",
    "avgLandPricePerPyeongManwon": 3200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3360,
      "villaOver30Year": 3040,
      "singleHouse": 1120
    },
    "askCount": 10,
    "minPriceDisplay": "35.2억",
    "minInvestmentDisplay": "22.4억",
    "estimatedPremiumDisplay": "12.8억~19.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 19200,
      "unionPrice84Manwon": 25600,
      "generalPrice59Manwon": 25600,
      "generalPrice84Manwon": 35200,
      "expectedNewAptPrice84Manwon": 44800
    },
    "nearestStation": "주안역 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.11.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "incheon-seo-gajwa",
    "name": "가좌1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.08.22",
    "region": "인천",
    "district": "서구",
    "address": "인천광역시 서구 가좌동 628-5 일대",
    "lat": 37.4958,
    "lng": 126.6742,
    "polygon": [
      {
        "lat": 37.496083,
        "lng": 126.675885
      },
      {
        "lat": 37.49691,
        "lng": 126.675407
      },
      {
        "lat": 37.496984,
        "lng": 126.674069
      },
      {
        "lat": 37.496713,
        "lng": 126.672862
      },
      {
        "lat": 37.495918,
        "lng": 126.672448
      },
      {
        "lat": 37.494981,
        "lng": 126.672382
      },
      {
        "lat": 37.494719,
        "lng": 126.673738
      },
      {
        "lat": 37.494833,
        "lng": 126.674855
      },
      {
        "lat": 37.495322,
        "lng": 126.675691
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "33.6억",
    "avgLandPricePerPyeongManwon": 2800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2940,
      "villaOver30Year": 2660,
      "singleHouse": 980
    },
    "askCount": 10,
    "minPriceDisplay": "30.8억",
    "minInvestmentDisplay": "19.6억",
    "estimatedPremiumDisplay": "11.2억~16.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 16800,
      "unionPrice84Manwon": 22400,
      "generalPrice59Manwon": 22400,
      "generalPrice84Manwon": 30800,
      "expectedNewAptPrice84Manwon": 39200
    },
    "nearestStation": "가좌역 (경인선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.08.22"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.08.22"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.08.22"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "incheon-gyeyang",
    "name": "계양1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.06.30",
    "region": "인천",
    "district": "계양구",
    "address": "인천광역시 계양구 계산동 891-15 일대",
    "lat": 37.5378,
    "lng": 126.7218,
    "polygon": [
      {
        "lat": 37.537994,
        "lng": 126.724346
      },
      {
        "lat": 37.538899,
        "lng": 126.723347
      },
      {
        "lat": 37.53954,
        "lng": 126.721961
      },
      {
        "lat": 37.538803,
        "lng": 126.720704
      },
      {
        "lat": 37.538209,
        "lng": 126.71929
      },
      {
        "lat": 37.537037,
        "lng": 126.719529
      },
      {
        "lat": 37.53633,
        "lng": 126.720851
      },
      {
        "lat": 37.536221,
        "lng": 126.722489
      },
      {
        "lat": 37.537073,
        "lng": 126.723421
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "포스코이앤씨",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "38.4억",
    "avgLandPricePerPyeongManwon": 3200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3360,
      "villaOver30Year": 3040,
      "singleHouse": 1120
    },
    "askCount": 10,
    "minPriceDisplay": "35.2억",
    "minInvestmentDisplay": "22.4억",
    "estimatedPremiumDisplay": "12.8억~19.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 19200,
      "unionPrice84Manwon": 25600,
      "generalPrice59Manwon": 25600,
      "generalPrice84Manwon": 35200,
      "expectedNewAptPrice84Manwon": 44800
    },
    "nearestStation": "계산역 (인천1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.30"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.30"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.30"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.30"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.06.30"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "incheon-dong-1",
    "name": "동인천역세권",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.12.01",
    "region": "인천",
    "district": "동구",
    "address": "인천광역시 동구 송림동 289-1 일대",
    "lat": 37.4798,
    "lng": 126.6478,
    "polygon": [
      {
        "lat": 37.480121,
        "lng": 126.649956
      },
      {
        "lat": 37.481396,
        "lng": 126.649524
      },
      {
        "lat": 37.481299,
        "lng": 126.647751
      },
      {
        "lat": 37.481329,
        "lng": 126.645978
      },
      {
        "lat": 37.480001,
        "lng": 126.646002
      },
      {
        "lat": 37.478846,
        "lng": 126.645686
      },
      {
        "lat": 37.478524,
        "lng": 126.647219
      },
      {
        "lat": 37.478094,
        "lng": 126.648703
      },
      {
        "lat": 37.478994,
        "lng": 126.649798
      }
    ],
    "totalUnits": 1876,
    "ownersCount": 856,
    "generalUnits": 732,
    "rentalUnits": 288,
    "generalRatio": 39,
    "builder": "삼성물산",
    "zoneAreaM2": 145000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 12,
    "recentTradePriceDisplay": "36.0억",
    "avgLandPricePerPyeongManwon": 3000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3150,
      "villaOver30Year": 2850,
      "singleHouse": 1050
    },
    "askCount": 10,
    "minPriceDisplay": "33.0억",
    "minInvestmentDisplay": "21.0억",
    "estimatedPremiumDisplay": "12.0억~18.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 18000,
      "unionPrice84Manwon": 24000,
      "generalPrice59Manwon": 24000,
      "generalPrice84Manwon": 33000,
      "expectedNewAptPrice84Manwon": 42000
    },
    "nearestStation": "동인천역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.01"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.01"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.01"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.01"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.12.01"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.12.01"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "incheon-namdong",
    "name": "남동구 인주대로",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.10.25",
    "region": "인천",
    "district": "남동구",
    "address": "인천광역시 남동구 구월동 1548-12 일대",
    "lat": 37.4512,
    "lng": 126.7312,
    "polygon": [
      {
        "lat": 37.451154,
        "lng": 126.733591
      },
      {
        "lat": 37.452007,
        "lng": 126.733305
      },
      {
        "lat": 37.452887,
        "lng": 126.732504
      },
      {
        "lat": 37.452746,
        "lng": 126.730926
      },
      {
        "lat": 37.452468,
        "lng": 126.729581
      },
      {
        "lat": 37.451611,
        "lng": 126.729233
      },
      {
        "lat": 37.450838,
        "lng": 126.729027
      },
      {
        "lat": 37.450023,
        "lng": 126.729502
      },
      {
        "lat": 37.449672,
        "lng": 126.730782
      },
      {
        "lat": 37.449871,
        "lng": 126.732075
      },
      {
        "lat": 37.450353,
        "lng": 126.733133
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "42.0억",
    "avgLandPricePerPyeongManwon": 3500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3675,
      "villaOver30Year": 3325,
      "singleHouse": 1225
    },
    "askCount": 10,
    "minPriceDisplay": "38.5억",
    "minInvestmentDisplay": "24.5억",
    "estimatedPremiumDisplay": "14.0억~21.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 21000,
      "unionPrice84Manwon": 28000,
      "generalPrice59Manwon": 28000,
      "generalPrice84Manwon": 38500,
      "expectedNewAptPrice84Manwon": 49000
    },
    "nearestStation": "간석오거리역 (인천1호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.25"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.25"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.25"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.25"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.10.25"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "busan-dongnae-1",
    "name": "온천2구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.07.18",
    "region": "부산",
    "district": "동래구",
    "address": "부산광역시 동래구 온천동 558-2 일대",
    "lat": 35.2012,
    "lng": 129.0752,
    "polygon": [
      {
        "lat": 35.200991,
        "lng": 129.07664
      },
      {
        "lat": 35.202087,
        "lng": 129.077028
      },
      {
        "lat": 35.202849,
        "lng": 129.076083
      },
      {
        "lat": 35.20304,
        "lng": 129.074882
      },
      {
        "lat": 35.202328,
        "lng": 129.073992
      },
      {
        "lat": 35.201477,
        "lng": 129.073289
      },
      {
        "lat": 35.200404,
        "lng": 129.073559
      },
      {
        "lat": 35.199951,
        "lng": 129.074531
      },
      {
        "lat": 35.199238,
        "lng": 129.075539
      },
      {
        "lat": 35.200207,
        "lng": 129.076264
      }
    ],
    "totalUnits": 1765,
    "ownersCount": 812,
    "generalUnits": 688,
    "rentalUnits": 265,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 137000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "45.6억",
    "avgLandPricePerPyeongManwon": 3800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3990,
      "villaOver30Year": 3610,
      "singleHouse": 1330
    },
    "askCount": 10,
    "minPriceDisplay": "41.8억",
    "minInvestmentDisplay": "26.6억",
    "estimatedPremiumDisplay": "15.2억~22.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 22800,
      "unionPrice84Manwon": 30400,
      "generalPrice59Manwon": 30400,
      "generalPrice84Manwon": 41800,
      "expectedNewAptPrice84Manwon": 53200
    },
    "nearestStation": "온천장역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.07.18"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "busan-dongnae-2",
    "name": "명장1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.09.12",
    "region": "부산",
    "district": "동래구",
    "address": "부산광역시 동래구 명장동 285-15 일대",
    "lat": 35.2145,
    "lng": 129.0818,
    "polygon": [
      {
        "lat": 35.214159,
        "lng": 129.084581
      },
      {
        "lat": 35.21514,
        "lng": 129.084306
      },
      {
        "lat": 35.215916,
        "lng": 129.08338
      },
      {
        "lat": 35.215991,
        "lng": 129.081911
      },
      {
        "lat": 35.21597,
        "lng": 129.080468
      },
      {
        "lat": 35.215242,
        "lng": 129.07954
      },
      {
        "lat": 35.214376,
        "lng": 129.079764
      },
      {
        "lat": 35.213354,
        "lng": 129.079516
      },
      {
        "lat": 35.213257,
        "lng": 129.081126
      },
      {
        "lat": 35.212871,
        "lng": 129.082421
      },
      {
        "lat": 35.213494,
        "lng": 129.083457
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "43.2억",
    "avgLandPricePerPyeongManwon": 3600,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3780,
      "villaOver30Year": 3420,
      "singleHouse": 1260
    },
    "askCount": 10,
    "minPriceDisplay": "39.6억",
    "minInvestmentDisplay": "25.2억",
    "estimatedPremiumDisplay": "14.4억~21.6억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 21600,
      "unionPrice84Manwon": 28800,
      "generalPrice59Manwon": 28800,
      "generalPrice84Manwon": 39600,
      "expectedNewAptPrice84Manwon": 50400
    },
    "nearestStation": "명장역 (4호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.12"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.12"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.12"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.12"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.09.12"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "busan-yeonje-1",
    "name": "연제1구역",
    "type": "재개발",
    "status": "착공",
    "statusDate": "2023.05.20",
    "region": "부산",
    "district": "연제구",
    "address": "부산광역시 연제구 연산동 1421-8 일대",
    "lat": 35.1912,
    "lng": 129.0812,
    "polygon": [
      {
        "lat": 35.191605,
        "lng": 129.083228
      },
      {
        "lat": 35.192606,
        "lng": 129.082755
      },
      {
        "lat": 35.193003,
        "lng": 129.081308
      },
      {
        "lat": 35.192878,
        "lng": 129.079653
      },
      {
        "lat": 35.191927,
        "lng": 129.07849
      },
      {
        "lat": 35.190814,
        "lng": 129.079265
      },
      {
        "lat": 35.189709,
        "lng": 129.079552
      },
      {
        "lat": 35.189198,
        "lng": 129.08108
      },
      {
        "lat": 35.189492,
        "lng": 129.082774
      },
      {
        "lat": 35.19064,
        "lng": 129.083288
      }
    ],
    "totalUnits": 1987,
    "ownersCount": 912,
    "generalUnits": 775,
    "rentalUnits": 300,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 155000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 13,
    "recentTradePriceDisplay": "46.8억",
    "avgLandPricePerPyeongManwon": 3900,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4095,
      "villaOver30Year": 3705,
      "singleHouse": 1365
    },
    "askCount": 10,
    "minPriceDisplay": "42.9억",
    "minInvestmentDisplay": "27.3억",
    "estimatedPremiumDisplay": "15.6억~23.4억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 23400,
      "unionPrice84Manwon": 31200,
      "generalPrice59Manwon": 31200,
      "generalPrice84Manwon": 42900,
      "expectedNewAptPrice84Manwon": 54600
    },
    "nearestStation": "연산역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.20"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.20"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.20"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.20"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.20"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.20"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.05.20"
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.05.20"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "busan-yeonje-2",
    "name": "연제2구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.08.15",
    "region": "부산",
    "district": "연제구",
    "address": "부산광역시 연제구 거제동 1025-12 일대",
    "lat": 35.1878,
    "lng": 129.0845,
    "polygon": [
      {
        "lat": 35.187994,
        "lng": 129.086372
      },
      {
        "lat": 35.188812,
        "lng": 129.085955
      },
      {
        "lat": 35.189483,
        "lng": 129.085134
      },
      {
        "lat": 35.189557,
        "lng": 129.083925
      },
      {
        "lat": 35.188646,
        "lng": 129.083374
      },
      {
        "lat": 35.188069,
        "lng": 129.082527
      },
      {
        "lat": 35.187101,
        "lng": 129.082569
      },
      {
        "lat": 35.186309,
        "lng": 129.083302
      },
      {
        "lat": 35.186397,
        "lng": 129.084468
      },
      {
        "lat": 35.186277,
        "lng": 129.085623
      },
      {
        "lat": 35.18722,
        "lng": 129.085947
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "포스코이앤씨",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "44.4억",
    "avgLandPricePerPyeongManwon": 3700,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3885,
      "villaOver30Year": 3515,
      "singleHouse": 1295
    },
    "askCount": 10,
    "minPriceDisplay": "40.7억",
    "minInvestmentDisplay": "25.9억",
    "estimatedPremiumDisplay": "14.8억~22.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 22200,
      "unionPrice84Manwon": 29600,
      "generalPrice59Manwon": 29600,
      "generalPrice84Manwon": 40700,
      "expectedNewAptPrice84Manwon": 51800
    },
    "nearestStation": "거제역 (3호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.08.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "busan-busanjin-1",
    "name": "부전1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.11.05",
    "region": "부산",
    "district": "부산진구",
    "address": "부산광역시 부산진구 부전동 235-8 일대",
    "lat": 35.1578,
    "lng": 129.0578,
    "polygon": [
      {
        "lat": 35.157943,
        "lng": 129.060045
      },
      {
        "lat": 35.158966,
        "lng": 129.059765
      },
      {
        "lat": 35.159754,
        "lng": 129.058449
      },
      {
        "lat": 35.159493,
        "lng": 129.056713
      },
      {
        "lat": 35.158913,
        "lng": 129.055006
      },
      {
        "lat": 35.157662,
        "lng": 129.055631
      },
      {
        "lat": 35.156383,
        "lng": 129.055412
      },
      {
        "lat": 35.155789,
        "lng": 129.057132
      },
      {
        "lat": 35.15631,
        "lng": 129.058757
      },
      {
        "lat": 35.156802,
        "lng": 129.060304
      }
    ],
    "totalUnits": 2134,
    "ownersCount": 985,
    "generalUnits": 832,
    "rentalUnits": 317,
    "generalRatio": 39,
    "builder": "삼성물산",
    "zoneAreaM2": 166000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 14,
    "recentTradePriceDisplay": "50.4억",
    "avgLandPricePerPyeongManwon": 4200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4410,
      "villaOver30Year": 3990,
      "singleHouse": 1470
    },
    "askCount": 10,
    "minPriceDisplay": "46.2억",
    "minInvestmentDisplay": "29.4억",
    "estimatedPremiumDisplay": "16.8억~25.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 25200,
      "unionPrice84Manwon": 33600,
      "generalPrice59Manwon": 33600,
      "generalPrice84Manwon": 46200,
      "expectedNewAptPrice84Manwon": 58800
    },
    "nearestStation": "서면역 (1·2호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.05"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.05"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.05"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.05"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.11.05"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.11.05"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "busan-busanjin-2",
    "name": "당감2구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.10.22",
    "region": "부산",
    "district": "부산진구",
    "address": "부산광역시 부산진구 당감동 125-4 일대",
    "lat": 35.1612,
    "lng": 129.0418,
    "polygon": [
      {
        "lat": 35.161529,
        "lng": 129.043972
      },
      {
        "lat": 35.162446,
        "lng": 129.043586
      },
      {
        "lat": 35.162788,
        "lng": 129.042297
      },
      {
        "lat": 35.163007,
        "lng": 129.040841
      },
      {
        "lat": 35.161976,
        "lng": 129.040322
      },
      {
        "lat": 35.161337,
        "lng": 129.039107
      },
      {
        "lat": 35.160331,
        "lng": 129.03952
      },
      {
        "lat": 35.159945,
        "lng": 129.040818
      },
      {
        "lat": 35.159477,
        "lng": 129.041973
      },
      {
        "lat": 35.160023,
        "lng": 129.043056
      },
      {
        "lat": 35.160724,
        "lng": 129.043617
      }
    ],
    "totalUnits": 1654,
    "ownersCount": 762,
    "generalUnits": 645,
    "rentalUnits": 247,
    "generalRatio": 39,
    "builder": "대우건설",
    "zoneAreaM2": 129000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "45.6억",
    "avgLandPricePerPyeongManwon": 3800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3990,
      "villaOver30Year": 3610,
      "singleHouse": 1330
    },
    "askCount": 10,
    "minPriceDisplay": "41.8억",
    "minInvestmentDisplay": "26.6억",
    "estimatedPremiumDisplay": "15.2억~22.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 22800,
      "unionPrice84Manwon": 30400,
      "generalPrice59Manwon": 30400,
      "generalPrice84Manwon": 41800,
      "expectedNewAptPrice84Manwon": 53200
    },
    "nearestStation": "당감역 (2호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.22"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.22"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.22"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.22"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.10.22"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "busan-dong-1",
    "name": "범일1구역",
    "type": "재개발",
    "status": "착공",
    "statusDate": "2023.08.10",
    "region": "부산",
    "district": "동구",
    "address": "부산광역시 동구 범일동 215-8 일대",
    "lat": 35.1388,
    "lng": 129.0612,
    "polygon": [
      {
        "lat": 35.138879,
        "lng": 129.063279
      },
      {
        "lat": 35.139723,
        "lng": 129.062284
      },
      {
        "lat": 35.140606,
        "lng": 129.061085
      },
      {
        "lat": 35.139784,
        "lng": 129.059794
      },
      {
        "lat": 35.138734,
        "lng": 129.059449
      },
      {
        "lat": 35.137856,
        "lng": 129.060091
      },
      {
        "lat": 35.137096,
        "lng": 129.061308
      },
      {
        "lat": 35.137624,
        "lng": 129.06288
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "42.0억",
    "avgLandPricePerPyeongManwon": 3500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3675,
      "villaOver30Year": 3325,
      "singleHouse": 1225
    },
    "askCount": 10,
    "minPriceDisplay": "38.5억",
    "minInvestmentDisplay": "24.5억",
    "estimatedPremiumDisplay": "14.0억~21.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 21000,
      "unionPrice84Manwon": 28000,
      "generalPrice59Manwon": 28000,
      "generalPrice84Manwon": 38500,
      "expectedNewAptPrice84Manwon": 49000
    },
    "nearestStation": "범일역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.10"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.10"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.10"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.10"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.10"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.10"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.10"
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.08.10"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "busan-seo-1",
    "name": "서구 아미동",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.07.28",
    "region": "부산",
    "district": "서구",
    "address": "부산광역시 서구 아미동 125-5 일대",
    "lat": 35.1158,
    "lng": 129.0178,
    "polygon": [
      {
        "lat": 35.115491,
        "lng": 129.019803
      },
      {
        "lat": 35.116363,
        "lng": 129.019764
      },
      {
        "lat": 35.117147,
        "lng": 129.019125
      },
      {
        "lat": 35.117394,
        "lng": 129.017932
      },
      {
        "lat": 35.116764,
        "lng": 129.017077
      },
      {
        "lat": 35.116323,
        "lng": 129.016484
      },
      {
        "lat": 35.115676,
        "lng": 129.01576
      },
      {
        "lat": 35.114989,
        "lng": 129.016375
      },
      {
        "lat": 35.114477,
        "lng": 129.017158
      },
      {
        "lat": 35.114485,
        "lng": 129.018202
      },
      {
        "lat": 35.115007,
        "lng": 129.018885
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 578,
    "generalUnits": 485,
    "rentalUnits": 182,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "38.4억",
    "avgLandPricePerPyeongManwon": 3200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3360,
      "villaOver30Year": 3040,
      "singleHouse": 1120
    },
    "askCount": 10,
    "minPriceDisplay": "35.2억",
    "minInvestmentDisplay": "22.4억",
    "estimatedPremiumDisplay": "12.8억~19.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 19200,
      "unionPrice84Manwon": 25600,
      "generalPrice59Manwon": 25600,
      "generalPrice84Manwon": 35200,
      "expectedNewAptPrice84Manwon": 44800
    },
    "nearestStation": "토성역 (1호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.28"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.28"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.28"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.28"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.07.28"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "busan-saha-1",
    "name": "괴정1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.09.25",
    "region": "부산",
    "district": "사하구",
    "address": "부산광역시 사하구 괴정동 568-12 일대",
    "lat": 35.0958,
    "lng": 128.9978,
    "polygon": [
      {
        "lat": 35.095962,
        "lng": 128.999833
      },
      {
        "lat": 35.097128,
        "lng": 128.999237
      },
      {
        "lat": 35.097474,
        "lng": 128.997961
      },
      {
        "lat": 35.097051,
        "lng": 128.996858
      },
      {
        "lat": 35.096153,
        "lng": 128.996389
      },
      {
        "lat": 35.095074,
        "lng": 128.996113
      },
      {
        "lat": 35.094181,
        "lng": 128.996983
      },
      {
        "lat": 35.094283,
        "lng": 128.998236
      },
      {
        "lat": 35.095002,
        "lng": 128.999025
      }
    ],
    "totalUnits": 1765,
    "ownersCount": 812,
    "generalUnits": 688,
    "rentalUnits": 265,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 137000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "39.6억",
    "avgLandPricePerPyeongManwon": 3300,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3465,
      "villaOver30Year": 3135,
      "singleHouse": 1155
    },
    "askCount": 10,
    "minPriceDisplay": "36.3억",
    "minInvestmentDisplay": "23.1억",
    "estimatedPremiumDisplay": "13.2억~19.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 19800,
      "unionPrice84Manwon": 26400,
      "generalPrice59Manwon": 26400,
      "generalPrice84Manwon": 36300,
      "expectedNewAptPrice84Manwon": 46200
    },
    "nearestStation": "괴정역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.25"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.25"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.25"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.25"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.25"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.09.25"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "busan-jung-1",
    "name": "영주1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.06.14",
    "region": "부산",
    "district": "중구",
    "address": "부산광역시 중구 영주동 56-8 일대",
    "lat": 35.1098,
    "lng": 129.0352,
    "polygon": [
      {
        "lat": 35.110165,
        "lng": 129.036746
      },
      {
        "lat": 35.11103,
        "lng": 129.036031
      },
      {
        "lat": 35.11149,
        "lng": 129.034601
      },
      {
        "lat": 35.110488,
        "lng": 129.033671
      },
      {
        "lat": 35.109398,
        "lng": 129.033496
      },
      {
        "lat": 35.108587,
        "lng": 129.03438
      },
      {
        "lat": 35.108278,
        "lng": 129.03574
      },
      {
        "lat": 35.109001,
        "lng": 129.036976
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "포스코이앤씨",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "45.6억",
    "avgLandPricePerPyeongManwon": 3800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3990,
      "villaOver30Year": 3610,
      "singleHouse": 1330
    },
    "askCount": 10,
    "minPriceDisplay": "41.8억",
    "minInvestmentDisplay": "26.6억",
    "estimatedPremiumDisplay": "15.2억~22.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 22800,
      "unionPrice84Manwon": 30400,
      "generalPrice59Manwon": 30400,
      "generalPrice84Manwon": 41800,
      "expectedNewAptPrice84Manwon": 53200
    },
    "nearestStation": "부산역 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.14"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.14"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.14"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.06.14"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.06.14"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "busan-haeundae-1",
    "name": "반송1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.12.15",
    "region": "부산",
    "district": "해운대구",
    "address": "부산광역시 해운대구 반송동 485-8 일대",
    "lat": 35.2212,
    "lng": 129.1258,
    "polygon": [
      {
        "lat": 35.221429,
        "lng": 129.127679
      },
      {
        "lat": 35.222087,
        "lng": 129.127197
      },
      {
        "lat": 35.2225,
        "lng": 129.126289
      },
      {
        "lat": 35.222713,
        "lng": 129.125069
      },
      {
        "lat": 35.222423,
        "lng": 129.123593
      },
      {
        "lat": 35.221338,
        "lng": 129.123957
      },
      {
        "lat": 35.220596,
        "lng": 129.124029
      },
      {
        "lat": 35.219875,
        "lng": 129.124646
      },
      {
        "lat": 35.219888,
        "lng": 129.125865
      },
      {
        "lat": 35.219762,
        "lng": 129.127252
      },
      {
        "lat": 35.220626,
        "lng": 129.127813
      }
    ],
    "totalUnits": 1654,
    "ownersCount": 762,
    "generalUnits": 645,
    "rentalUnits": 247,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 129000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "46.8억",
    "avgLandPricePerPyeongManwon": 3900,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4095,
      "villaOver30Year": 3705,
      "singleHouse": 1365
    },
    "askCount": 10,
    "minPriceDisplay": "42.9억",
    "minInvestmentDisplay": "27.3억",
    "estimatedPremiumDisplay": "15.6억~23.4억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 23400,
      "unionPrice84Manwon": 31200,
      "generalPrice59Manwon": 31200,
      "generalPrice84Manwon": 42900,
      "expectedNewAptPrice84Manwon": 54600
    },
    "nearestStation": "반여농산물시장역 (4호선) 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.12.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.12.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.12.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.12.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.12.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "daegu-jung-1",
    "name": "향촌1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.08.22",
    "region": "대구",
    "district": "중구",
    "address": "대구광역시 중구 향촌동 68-8 일대",
    "lat": 35.8712,
    "lng": 128.5948,
    "polygon": [
      {
        "lat": 35.871295,
        "lng": 128.596653
      },
      {
        "lat": 35.872361,
        "lng": 128.596188
      },
      {
        "lat": 35.872603,
        "lng": 128.594985
      },
      {
        "lat": 35.872477,
        "lng": 128.593853
      },
      {
        "lat": 35.871655,
        "lng": 128.593088
      },
      {
        "lat": 35.870649,
        "lng": 128.593359
      },
      {
        "lat": 35.869703,
        "lng": 128.593952
      },
      {
        "lat": 35.869413,
        "lng": 128.595277
      },
      {
        "lat": 35.870224,
        "lng": 128.596278
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "삼성물산",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "45.6억",
    "avgLandPricePerPyeongManwon": 3800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3990,
      "villaOver30Year": 3610,
      "singleHouse": 1330
    },
    "askCount": 10,
    "minPriceDisplay": "41.8억",
    "minInvestmentDisplay": "26.6억",
    "estimatedPremiumDisplay": "15.2억~22.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 22800,
      "unionPrice84Manwon": 30400,
      "generalPrice59Manwon": 30400,
      "generalPrice84Manwon": 41800,
      "expectedNewAptPrice84Manwon": 53200
    },
    "nearestStation": "중앙로역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.22"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.22"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.22"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.22"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.22"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.08.22"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "daegu-suseong-1",
    "name": "수성1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.09.18",
    "region": "대구",
    "district": "수성구",
    "address": "대구광역시 수성구 수성동 456-12 일대",
    "lat": 35.8578,
    "lng": 128.6312,
    "polygon": [
      {
        "lat": 35.858216,
        "lng": 128.633124
      },
      {
        "lat": 35.859453,
        "lng": 128.632521
      },
      {
        "lat": 35.859254,
        "lng": 128.631124
      },
      {
        "lat": 35.859123,
        "lng": 128.629906
      },
      {
        "lat": 35.858068,
        "lng": 128.628949
      },
      {
        "lat": 35.85673,
        "lng": 128.629452
      },
      {
        "lat": 35.855951,
        "lng": 128.630598
      },
      {
        "lat": 35.856154,
        "lng": 128.631932
      },
      {
        "lat": 35.856842,
        "lng": 128.633172
      }
    ],
    "totalUnits": 1987,
    "ownersCount": 912,
    "generalUnits": 775,
    "rentalUnits": 300,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 155000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 13,
    "recentTradePriceDisplay": "50.4억",
    "avgLandPricePerPyeongManwon": 4200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4410,
      "villaOver30Year": 3990,
      "singleHouse": 1470
    },
    "askCount": 10,
    "minPriceDisplay": "46.2억",
    "minInvestmentDisplay": "29.4억",
    "estimatedPremiumDisplay": "16.8억~25.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 25200,
      "unionPrice84Manwon": 33600,
      "generalPrice59Manwon": 33600,
      "generalPrice84Manwon": 46200,
      "expectedNewAptPrice84Manwon": 58800
    },
    "nearestStation": "수성못역 (2호선) 도보 7분",
    "walkMinutes": 7,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.09.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "daegu-suseong-2",
    "name": "황금1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.07.28",
    "region": "대구",
    "district": "수성구",
    "address": "대구광역시 수성구 황금동 512-8 일대",
    "lat": 35.8512,
    "lng": 128.6278,
    "polygon": [
      {
        "lat": 35.850897,
        "lng": 128.630198
      },
      {
        "lat": 35.851657,
        "lng": 128.629359
      },
      {
        "lat": 35.852379,
        "lng": 128.62884
      },
      {
        "lat": 35.8528,
        "lng": 128.627502
      },
      {
        "lat": 35.852285,
        "lng": 128.626221
      },
      {
        "lat": 35.851483,
        "lng": 128.625562
      },
      {
        "lat": 35.85064,
        "lng": 128.625887
      },
      {
        "lat": 35.849827,
        "lng": 128.62659
      },
      {
        "lat": 35.849818,
        "lng": 128.628058
      },
      {
        "lat": 35.850101,
        "lng": 128.629399
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "48.0억",
    "avgLandPricePerPyeongManwon": 4000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4200,
      "villaOver30Year": 3800,
      "singleHouse": 1400
    },
    "askCount": 10,
    "minPriceDisplay": "44.0억",
    "minInvestmentDisplay": "28.0억",
    "estimatedPremiumDisplay": "16.0억~24.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 24000,
      "unionPrice84Manwon": 32000,
      "generalPrice59Manwon": 32000,
      "generalPrice84Manwon": 44000,
      "expectedNewAptPrice84Manwon": 56000
    },
    "nearestStation": "황금역 (2호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.07.28"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.07.28"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.07.28"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "daegu-dalseo-1",
    "name": "감삼1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.10.12",
    "region": "대구",
    "district": "달서구",
    "address": "대구광역시 달서구 감삼동 728-15 일대",
    "lat": 35.8498,
    "lng": 128.5618,
    "polygon": [
      {
        "lat": 35.850144,
        "lng": 128.563666
      },
      {
        "lat": 35.850905,
        "lng": 128.563171
      },
      {
        "lat": 35.85129,
        "lng": 128.562179
      },
      {
        "lat": 35.851315,
        "lng": 128.561026
      },
      {
        "lat": 35.850796,
        "lng": 128.560011
      },
      {
        "lat": 35.849888,
        "lng": 128.559607
      },
      {
        "lat": 35.848936,
        "lng": 128.559848
      },
      {
        "lat": 35.848537,
        "lng": 128.560951
      },
      {
        "lat": 35.848145,
        "lng": 128.561995
      },
      {
        "lat": 35.84828,
        "lng": 128.56333
      },
      {
        "lat": 35.849329,
        "lng": 128.563533
      }
    ],
    "totalUnits": 1765,
    "ownersCount": 812,
    "generalUnits": 688,
    "rentalUnits": 265,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 137000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "43.2억",
    "avgLandPricePerPyeongManwon": 3600,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3780,
      "villaOver30Year": 3420,
      "singleHouse": 1260
    },
    "askCount": 10,
    "minPriceDisplay": "39.6억",
    "minInvestmentDisplay": "25.2억",
    "estimatedPremiumDisplay": "14.4억~21.6억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 21600,
      "unionPrice84Manwon": 28800,
      "generalPrice59Manwon": 28800,
      "generalPrice84Manwon": 39600,
      "expectedNewAptPrice84Manwon": 50400
    },
    "nearestStation": "감삼역 (2호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.12"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.12"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.12"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.12"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.12"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.10.12"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "daegu-dalseo-2",
    "name": "죽전1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.08.05",
    "region": "대구",
    "district": "달서구",
    "address": "대구광역시 달서구 죽전동 456-8 일대",
    "lat": 35.8412,
    "lng": 128.5348,
    "polygon": [
      {
        "lat": 35.84124,
        "lng": 128.536406
      },
      {
        "lat": 35.842064,
        "lng": 128.536061
      },
      {
        "lat": 35.842657,
        "lng": 128.535282
      },
      {
        "lat": 35.842698,
        "lng": 128.5342
      },
      {
        "lat": 35.842095,
        "lng": 128.533329
      },
      {
        "lat": 35.841154,
        "lng": 128.532975
      },
      {
        "lat": 35.84039,
        "lng": 128.533617
      },
      {
        "lat": 35.839714,
        "lng": 128.534309
      },
      {
        "lat": 35.839508,
        "lng": 128.535478
      },
      {
        "lat": 35.840451,
        "lng": 128.536031
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "40.8억",
    "avgLandPricePerPyeongManwon": 3400,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3570,
      "villaOver30Year": 3230,
      "singleHouse": 1190
    },
    "askCount": 10,
    "minPriceDisplay": "37.4억",
    "minInvestmentDisplay": "23.8억",
    "estimatedPremiumDisplay": "13.6억~20.4억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 20400,
      "unionPrice84Manwon": 27200,
      "generalPrice59Manwon": 27200,
      "generalPrice84Manwon": 37400,
      "expectedNewAptPrice84Manwon": 47600
    },
    "nearestStation": "용산역 (2호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.05"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.05"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.05"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.05"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.08.05"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "daegu-dong-1",
    "name": "지저동구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.07.15",
    "region": "대구",
    "district": "동구",
    "address": "대구광역시 동구 지저동 256-5 일대",
    "lat": 35.8912,
    "lng": 128.6212,
    "polygon": [
      {
        "lat": 35.891525,
        "lng": 128.622322
      },
      {
        "lat": 35.892422,
        "lng": 128.622023
      },
      {
        "lat": 35.892856,
        "lng": 128.621015
      },
      {
        "lat": 35.892255,
        "lng": 128.620085
      },
      {
        "lat": 35.891299,
        "lng": 128.619651
      },
      {
        "lat": 35.890356,
        "lng": 128.62004
      },
      {
        "lat": 35.889766,
        "lng": 128.620847
      },
      {
        "lat": 35.890013,
        "lng": 128.621793
      },
      {
        "lat": 35.890565,
        "lng": 128.62266
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 578,
    "generalUnits": 485,
    "rentalUnits": 182,
    "generalRatio": 39,
    "builder": "대우건설",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "38.4억",
    "avgLandPricePerPyeongManwon": 3200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3360,
      "villaOver30Year": 3040,
      "singleHouse": 1120
    },
    "askCount": 10,
    "minPriceDisplay": "35.2억",
    "minInvestmentDisplay": "22.4억",
    "estimatedPremiumDisplay": "12.8억~19.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 19200,
      "unionPrice84Manwon": 25600,
      "generalPrice59Manwon": 25600,
      "generalPrice84Manwon": 35200,
      "expectedNewAptPrice84Manwon": 44800
    },
    "nearestStation": "아양교역 (1호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.07.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.07.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "daegu-buk-1",
    "name": "칠성1구역",
    "type": "재개발",
    "status": "착공",
    "statusDate": "2023.04.08",
    "region": "대구",
    "district": "북구",
    "address": "대구광역시 북구 칠성동 625-12 일대",
    "lat": 35.8848,
    "lng": 128.5948,
    "polygon": [
      {
        "lat": 35.884498,
        "lng": 128.596334
      },
      {
        "lat": 35.88553,
        "lng": 128.596747
      },
      {
        "lat": 35.886236,
        "lng": 128.595883
      },
      {
        "lat": 35.886906,
        "lng": 128.594927
      },
      {
        "lat": 35.886219,
        "lng": 128.593973
      },
      {
        "lat": 35.88558,
        "lng": 128.593275
      },
      {
        "lat": 35.884672,
        "lng": 128.593236
      },
      {
        "lat": 35.88376,
        "lng": 128.593401
      },
      {
        "lat": 35.883282,
        "lng": 128.594237
      },
      {
        "lat": 35.883017,
        "lng": 128.595227
      },
      {
        "lat": 35.883412,
        "lng": 128.596274
      }
    ],
    "totalUnits": 1987,
    "ownersCount": 912,
    "generalUnits": 775,
    "rentalUnits": 300,
    "generalRatio": 39,
    "builder": "포스코이앤씨",
    "zoneAreaM2": 155000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 13,
    "recentTradePriceDisplay": "42.0억",
    "avgLandPricePerPyeongManwon": 3500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3675,
      "villaOver30Year": 3325,
      "singleHouse": 1225
    },
    "askCount": 10,
    "minPriceDisplay": "38.5억",
    "minInvestmentDisplay": "24.5억",
    "estimatedPremiumDisplay": "14.0억~21.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 21000,
      "unionPrice84Manwon": 28000,
      "generalPrice59Manwon": 28000,
      "generalPrice84Manwon": 38500,
      "expectedNewAptPrice84Manwon": 49000
    },
    "nearestStation": "칠성시장역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.08"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.08"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.08"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.08"
      },
      {
        "name": "관리처분인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.08"
      },
      {
        "name": "이주철거",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.04.08"
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.04.08"
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "daegu-seo-1",
    "name": "내당1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.10.25",
    "region": "대구",
    "district": "서구",
    "address": "대구광역시 서구 내당동 785-8 일대",
    "lat": 35.8612,
    "lng": 128.5618,
    "polygon": [
      {
        "lat": 35.861203,
        "lng": 128.563578
      },
      {
        "lat": 35.862146,
        "lng": 128.563547
      },
      {
        "lat": 35.862625,
        "lng": 128.562419
      },
      {
        "lat": 35.862758,
        "lng": 128.561112
      },
      {
        "lat": 35.862099,
        "lng": 128.560122
      },
      {
        "lat": 35.861195,
        "lng": 128.559244
      },
      {
        "lat": 35.86015,
        "lng": 128.559863
      },
      {
        "lat": 35.859448,
        "lng": 128.561039
      },
      {
        "lat": 35.859541,
        "lng": 128.562533
      },
      {
        "lat": 35.860135,
        "lng": 128.563788
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "39.6억",
    "avgLandPricePerPyeongManwon": 3300,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3465,
      "villaOver30Year": 3135,
      "singleHouse": 1155
    },
    "askCount": 10,
    "minPriceDisplay": "36.3억",
    "minInvestmentDisplay": "23.1억",
    "estimatedPremiumDisplay": "13.2억~19.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 19800,
      "unionPrice84Manwon": 26400,
      "generalPrice59Manwon": 26400,
      "generalPrice84Manwon": 36300,
      "expectedNewAptPrice84Manwon": 46200
    },
    "nearestStation": "내당역 (2호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.25"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.25"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.25"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.25"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.10.25"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gwangju-dong-1",
    "name": "충장로1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.09.22",
    "region": "광주",
    "district": "동구",
    "address": "광주광역시 동구 충장로5가 125-8 일대",
    "lat": 35.1448,
    "lng": 126.9218,
    "polygon": [
      {
        "lat": 35.145059,
        "lng": 126.923998
      },
      {
        "lat": 35.146303,
        "lng": 126.923379
      },
      {
        "lat": 35.146094,
        "lng": 126.921455
      },
      {
        "lat": 35.145683,
        "lng": 126.919902
      },
      {
        "lat": 35.144536,
        "lng": 126.919565
      },
      {
        "lat": 35.14346,
        "lng": 126.920392
      },
      {
        "lat": 35.143257,
        "lng": 126.922211
      },
      {
        "lat": 35.143801,
        "lng": 126.923948
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "33.6억",
    "avgLandPricePerPyeongManwon": 2800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2940,
      "villaOver30Year": 2660,
      "singleHouse": 980
    },
    "askCount": 10,
    "minPriceDisplay": "30.8억",
    "minInvestmentDisplay": "19.6억",
    "estimatedPremiumDisplay": "11.2억~16.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 16800,
      "unionPrice84Manwon": 22400,
      "generalPrice59Manwon": 22400,
      "generalPrice84Manwon": 30800,
      "expectedNewAptPrice84Manwon": 39200
    },
    "nearestStation": "문화전당역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.22"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.22"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.22"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.22"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.09.22"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gwangju-seo-1",
    "name": "양동1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.07.18",
    "region": "광주",
    "district": "서구",
    "address": "광주광역시 서구 양동 568-12 일대",
    "lat": 35.1458,
    "lng": 126.8948,
    "polygon": [
      {
        "lat": 35.145568,
        "lng": 126.8965
      },
      {
        "lat": 35.146567,
        "lng": 126.896518
      },
      {
        "lat": 35.147228,
        "lng": 126.895472
      },
      {
        "lat": 35.147053,
        "lng": 126.89421
      },
      {
        "lat": 35.146651,
        "lng": 126.892894
      },
      {
        "lat": 35.145538,
        "lng": 126.892875
      },
      {
        "lat": 35.14456,
        "lng": 126.893454
      },
      {
        "lat": 35.143818,
        "lng": 126.8948
      },
      {
        "lat": 35.144261,
        "lng": 126.896471
      }
    ],
    "totalUnits": 1765,
    "ownersCount": 812,
    "generalUnits": 688,
    "rentalUnits": 265,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 137000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "31.2억",
    "avgLandPricePerPyeongManwon": 2600,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2730,
      "villaOver30Year": 2470,
      "singleHouse": 910
    },
    "askCount": 10,
    "minPriceDisplay": "28.6억",
    "minInvestmentDisplay": "18.2억",
    "estimatedPremiumDisplay": "10.4억~15.6억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 15600,
      "unionPrice84Manwon": 20800,
      "generalPrice59Manwon": 20800,
      "generalPrice84Manwon": 28600,
      "expectedNewAptPrice84Manwon": 36400
    },
    "nearestStation": "농성역 (1호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.07.18"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gwangju-buk-1",
    "name": "용봉1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.08.10",
    "region": "광주",
    "district": "북구",
    "address": "광주광역시 북구 용봉동 625-8 일대",
    "lat": 35.1748,
    "lng": 126.9048,
    "polygon": [
      {
        "lat": 35.175203,
        "lng": 126.906891
      },
      {
        "lat": 35.175882,
        "lng": 126.905698
      },
      {
        "lat": 35.176291,
        "lng": 126.90414
      },
      {
        "lat": 35.175566,
        "lng": 126.902681
      },
      {
        "lat": 35.174377,
        "lng": 126.902606
      },
      {
        "lat": 35.173578,
        "lng": 126.903786
      },
      {
        "lat": 35.173036,
        "lng": 126.905581
      },
      {
        "lat": 35.174198,
        "lng": 126.906465
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "32.4억",
    "avgLandPricePerPyeongManwon": 2700,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2835,
      "villaOver30Year": 2565,
      "singleHouse": 945
    },
    "askCount": 10,
    "minPriceDisplay": "29.7억",
    "minInvestmentDisplay": "18.9억",
    "estimatedPremiumDisplay": "10.8억~16.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 16200,
      "unionPrice84Manwon": 21600,
      "generalPrice59Manwon": 21600,
      "generalPrice84Manwon": 29700,
      "expectedNewAptPrice84Manwon": 37800
    },
    "nearestStation": "운암역 (1호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.10"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.10"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.10"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.10"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.08.10"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gwangju-nam-1",
    "name": "봉선1구역",
    "type": "재건축",
    "status": "추진위원회승인",
    "statusDate": "2023.06.15",
    "region": "광주",
    "district": "남구",
    "address": "광주광역시 남구 봉선동 856-12 일대",
    "lat": 35.1248,
    "lng": 126.9118,
    "polygon": [
      {
        "lat": 35.125043,
        "lng": 126.912963
      },
      {
        "lat": 35.125728,
        "lng": 126.912686
      },
      {
        "lat": 35.126348,
        "lng": 126.911952
      },
      {
        "lat": 35.125813,
        "lng": 126.91114
      },
      {
        "lat": 35.125388,
        "lng": 126.9103
      },
      {
        "lat": 35.124549,
        "lng": 126.910596
      },
      {
        "lat": 35.123826,
        "lng": 126.910871
      },
      {
        "lat": 35.123357,
        "lng": 126.911658
      },
      {
        "lat": 35.123531,
        "lng": 126.912627
      },
      {
        "lat": 35.124249,
        "lng": 126.913207
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 672,
    "generalUnits": 438,
    "rentalUnits": 114,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "36.0억",
    "avgLandPricePerPyeongManwon": 3000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3150,
      "villaOver30Year": 2850,
      "singleHouse": 1050
    },
    "askCount": 10,
    "minPriceDisplay": "33.0억",
    "minInvestmentDisplay": "21.0억",
    "estimatedPremiumDisplay": "12.0억~18.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 18000,
      "unionPrice84Manwon": 24000,
      "generalPrice59Manwon": 24000,
      "generalPrice84Manwon": 33000,
      "expectedNewAptPrice84Manwon": 42000
    },
    "nearestStation": "남광주역 (1호선) 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.06.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.06.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "daejeon-dong-1",
    "name": "판암1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.08.28",
    "region": "대전",
    "district": "동구",
    "address": "대전광역시 동구 판암동 268-5 일대",
    "lat": 36.3212,
    "lng": 127.4518,
    "polygon": [
      {
        "lat": 36.32086,
        "lng": 127.453659
      },
      {
        "lat": 36.321915,
        "lng": 127.453589
      },
      {
        "lat": 36.322404,
        "lng": 127.452452
      },
      {
        "lat": 36.322494,
        "lng": 127.4513
      },
      {
        "lat": 36.321892,
        "lng": 127.45045
      },
      {
        "lat": 36.320985,
        "lng": 127.44955
      },
      {
        "lat": 36.320162,
        "lng": 127.450567
      },
      {
        "lat": 36.319925,
        "lng": 127.451713
      },
      {
        "lat": 36.320041,
        "lng": 127.452906
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "30.0억",
    "avgLandPricePerPyeongManwon": 2500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2625,
      "villaOver30Year": 2375,
      "singleHouse": 875
    },
    "askCount": 10,
    "minPriceDisplay": "27.5억",
    "minInvestmentDisplay": "17.5억",
    "estimatedPremiumDisplay": "10.0억~15.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 15000,
      "unionPrice84Manwon": 20000,
      "generalPrice59Manwon": 20000,
      "generalPrice84Manwon": 27500,
      "expectedNewAptPrice84Manwon": 35000
    },
    "nearestStation": "판암역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.28"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.28"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.28"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.28"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.28"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.08.28"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "daejeon-jung-1",
    "name": "은행1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.09.15",
    "region": "대전",
    "district": "중구",
    "address": "대전광역시 중구 은행동 215-8 일대",
    "lat": 36.3248,
    "lng": 127.4228,
    "polygon": [
      {
        "lat": 36.324559,
        "lng": 127.424814
      },
      {
        "lat": 36.325632,
        "lng": 127.424654
      },
      {
        "lat": 36.326517,
        "lng": 127.423592
      },
      {
        "lat": 36.32648,
        "lng": 127.421942
      },
      {
        "lat": 36.325653,
        "lng": 127.420751
      },
      {
        "lat": 36.324425,
        "lng": 127.420208
      },
      {
        "lat": 36.323354,
        "lng": 127.421233
      },
      {
        "lat": 36.322674,
        "lng": 127.422846
      },
      {
        "lat": 36.323535,
        "lng": 127.424264
      }
    ],
    "totalUnits": 1987,
    "ownersCount": 912,
    "generalUnits": 775,
    "rentalUnits": 300,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 155000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 13,
    "recentTradePriceDisplay": "33.6억",
    "avgLandPricePerPyeongManwon": 2800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2940,
      "villaOver30Year": 2660,
      "singleHouse": 980
    },
    "askCount": 10,
    "minPriceDisplay": "30.8억",
    "minInvestmentDisplay": "19.6억",
    "estimatedPremiumDisplay": "11.2억~16.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 16800,
      "unionPrice84Manwon": 22400,
      "generalPrice59Manwon": 22400,
      "generalPrice84Manwon": 30800,
      "expectedNewAptPrice84Manwon": 39200
    },
    "nearestStation": "중앙로역 (1호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.09.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "daejeon-seo-1",
    "name": "복수1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.11.15",
    "region": "대전",
    "district": "서구",
    "address": "대전광역시 서구 복수동 456-12 일대",
    "lat": 36.3298,
    "lng": 127.4018,
    "polygon": [
      {
        "lat": 36.330169,
        "lng": 127.403409
      },
      {
        "lat": 36.33088,
        "lng": 127.402871
      },
      {
        "lat": 36.331099,
        "lng": 127.401843
      },
      {
        "lat": 36.330907,
        "lng": 127.400813
      },
      {
        "lat": 36.330339,
        "lng": 127.399824
      },
      {
        "lat": 36.329485,
        "lng": 127.400428
      },
      {
        "lat": 36.32854,
        "lng": 127.40055
      },
      {
        "lat": 36.328622,
        "lng": 127.401761
      },
      {
        "lat": 36.328852,
        "lng": 127.402645
      },
      {
        "lat": 36.329375,
        "lng": 127.403359
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "31.2억",
    "avgLandPricePerPyeongManwon": 2600,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2730,
      "villaOver30Year": 2470,
      "singleHouse": 910
    },
    "askCount": 10,
    "minPriceDisplay": "28.6억",
    "minInvestmentDisplay": "18.2억",
    "estimatedPremiumDisplay": "10.4억~15.6억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 15600,
      "unionPrice84Manwon": 20800,
      "generalPrice59Manwon": 20800,
      "generalPrice84Manwon": 28600,
      "expectedNewAptPrice84Manwon": 36400
    },
    "nearestStation": "용문역 (1호선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.11.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.11.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.11.15"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "daejeon-yuseong-1",
    "name": "노은1구역",
    "type": "재건축",
    "status": "추진위원회승인",
    "statusDate": "2023.09.08",
    "region": "대전",
    "district": "유성구",
    "address": "대전광역시 유성구 노은동 1012-1 일대",
    "lat": 36.3748,
    "lng": 127.3752,
    "polygon": [
      {
        "lat": 36.374829,
        "lng": 127.376867
      },
      {
        "lat": 36.375654,
        "lng": 127.376606
      },
      {
        "lat": 36.376308,
        "lng": 127.375922
      },
      {
        "lat": 36.376196,
        "lng": 127.374949
      },
      {
        "lat": 36.376038,
        "lng": 127.373971
      },
      {
        "lat": 36.375227,
        "lng": 127.373474
      },
      {
        "lat": 36.374324,
        "lng": 127.373528
      },
      {
        "lat": 36.37371,
        "lng": 127.374197
      },
      {
        "lat": 36.373669,
        "lng": 127.375045
      },
      {
        "lat": 36.373804,
        "lng": 127.375727
      },
      {
        "lat": 36.373984,
        "lng": 127.37666
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 748,
    "generalUnits": 485,
    "rentalUnits": 112,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "38.4억",
    "avgLandPricePerPyeongManwon": 3200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3360,
      "villaOver30Year": 3040,
      "singleHouse": 1120
    },
    "askCount": 10,
    "minPriceDisplay": "35.2억",
    "minInvestmentDisplay": "22.4억",
    "estimatedPremiumDisplay": "12.8억~19.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 19200,
      "unionPrice84Manwon": 25600,
      "generalPrice59Manwon": 25600,
      "generalPrice84Manwon": 35200,
      "expectedNewAptPrice84Manwon": 44800
    },
    "nearestStation": "노은역 (2호선) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.09.08"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "daejeon-daedeok-1",
    "name": "오정1구역",
    "type": "재개발",
    "status": "정비구역지정",
    "statusDate": "2023.12.05",
    "region": "대전",
    "district": "대덕구",
    "address": "대전광역시 대덕구 오정동 698-8 일대",
    "lat": 36.3618,
    "lng": 127.4318,
    "polygon": [
      {
        "lat": 36.361561,
        "lng": 127.433661
      },
      {
        "lat": 36.36229,
        "lng": 127.433364
      },
      {
        "lat": 36.362859,
        "lng": 127.432674
      },
      {
        "lat": 36.363232,
        "lng": 127.431532
      },
      {
        "lat": 36.362538,
        "lng": 127.430766
      },
      {
        "lat": 36.362025,
        "lng": 127.43005
      },
      {
        "lat": 36.361239,
        "lng": 127.43001
      },
      {
        "lat": 36.360677,
        "lng": 127.430873
      },
      {
        "lat": 36.360568,
        "lng": 127.43203
      },
      {
        "lat": 36.361004,
        "lng": 127.432916
      }
    ],
    "totalUnits": 987,
    "ownersCount": 462,
    "generalUnits": 385,
    "rentalUnits": 140,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 76000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 6,
    "recentTradePriceDisplay": "26.4억",
    "avgLandPricePerPyeongManwon": 2200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2310,
      "villaOver30Year": 2090,
      "singleHouse": 770
    },
    "askCount": 10,
    "minPriceDisplay": "24.2억",
    "minInvestmentDisplay": "15.4억",
    "estimatedPremiumDisplay": "8.8억~13.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 13200,
      "unionPrice84Manwon": 17600,
      "generalPrice59Manwon": 17600,
      "generalPrice84Manwon": 24200,
      "expectedNewAptPrice84Manwon": 30800
    },
    "nearestStation": "대전역 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.12.05"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "ulsan-jung-1",
    "name": "옥교1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.08.28",
    "region": "울산",
    "district": "중구",
    "address": "울산광역시 중구 옥교동 225-8 일대",
    "lat": 35.5678,
    "lng": 129.3148,
    "polygon": [
      {
        "lat": 35.568026,
        "lng": 129.317034
      },
      {
        "lat": 35.569271,
        "lng": 129.316266
      },
      {
        "lat": 35.569191,
        "lng": 129.314562
      },
      {
        "lat": 35.568797,
        "lng": 129.313112
      },
      {
        "lat": 35.567597,
        "lng": 129.312793
      },
      {
        "lat": 35.566399,
        "lng": 129.313403
      },
      {
        "lat": 35.566581,
        "lng": 129.315008
      },
      {
        "lat": 35.566992,
        "lng": 129.316167
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "포스코이앤씨",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "38.4억",
    "avgLandPricePerPyeongManwon": 3200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3360,
      "villaOver30Year": 3040,
      "singleHouse": 1120
    },
    "askCount": 10,
    "minPriceDisplay": "35.2억",
    "minInvestmentDisplay": "22.4억",
    "estimatedPremiumDisplay": "12.8억~19.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 19200,
      "unionPrice84Manwon": 25600,
      "generalPrice59Manwon": 25600,
      "generalPrice84Manwon": 35200,
      "expectedNewAptPrice84Manwon": 44800
    },
    "nearestStation": "태화강역 (동해선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.28"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.28"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.28"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.28"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.08.28"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "ulsan-nam-1",
    "name": "삼산1구역",
    "type": "재건축",
    "status": "추진위원회승인",
    "statusDate": "2023.10.15",
    "region": "울산",
    "district": "남구",
    "address": "울산광역시 남구 삼산동 1258-12 일대",
    "lat": 35.5448,
    "lng": 129.3312,
    "polygon": [
      {
        "lat": 35.545261,
        "lng": 129.333554
      },
      {
        "lat": 35.546062,
        "lng": 129.332642
      },
      {
        "lat": 35.546198,
        "lng": 129.331272
      },
      {
        "lat": 35.546064,
        "lng": 129.329956
      },
      {
        "lat": 35.545363,
        "lng": 129.328944
      },
      {
        "lat": 35.544372,
        "lng": 129.329015
      },
      {
        "lat": 35.543774,
        "lng": 129.330027
      },
      {
        "lat": 35.543311,
        "lng": 129.331123
      },
      {
        "lat": 35.543818,
        "lng": 129.332167
      },
      {
        "lat": 35.544384,
        "lng": 129.332867
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 748,
    "generalUnits": 485,
    "rentalUnits": 112,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "50.4억",
    "avgLandPricePerPyeongManwon": 4200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 4410,
      "villaOver30Year": 3990,
      "singleHouse": 1470
    },
    "askCount": 10,
    "minPriceDisplay": "46.2억",
    "minInvestmentDisplay": "29.4억",
    "estimatedPremiumDisplay": "16.8억~25.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 25200,
      "unionPrice84Manwon": 33600,
      "generalPrice59Manwon": 33600,
      "generalPrice84Manwon": 46200,
      "expectedNewAptPrice84Manwon": 58800
    },
    "nearestStation": "울산역 (KTX) 도보 15분",
    "walkMinutes": 15,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.10.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.10.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "ulsan-dong-1",
    "name": "방어진1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.09.18",
    "region": "울산",
    "district": "동구",
    "address": "울산광역시 동구 방어동 456-8 일대",
    "lat": 35.5248,
    "lng": 129.4218,
    "polygon": [
      {
        "lat": 35.524605,
        "lng": 129.42276
      },
      {
        "lat": 35.525461,
        "lng": 129.422741
      },
      {
        "lat": 35.525989,
        "lng": 129.422022
      },
      {
        "lat": 35.525814,
        "lng": 129.421144
      },
      {
        "lat": 35.524983,
        "lng": 129.420896
      },
      {
        "lat": 35.524042,
        "lng": 129.42072
      },
      {
        "lat": 35.523645,
        "lng": 129.421584
      },
      {
        "lat": 35.523693,
        "lng": 129.422516
      }
    ],
    "totalUnits": 876,
    "ownersCount": 412,
    "generalUnits": 341,
    "rentalUnits": 123,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 68000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 5,
    "recentTradePriceDisplay": "33.6억",
    "avgLandPricePerPyeongManwon": 2800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2940,
      "villaOver30Year": 2660,
      "singleHouse": 980
    },
    "askCount": 10,
    "minPriceDisplay": "30.8억",
    "minInvestmentDisplay": "19.6억",
    "estimatedPremiumDisplay": "11.2억~16.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 16800,
      "unionPrice84Manwon": 22400,
      "generalPrice59Manwon": 22400,
      "generalPrice84Manwon": 30800,
      "expectedNewAptPrice84Manwon": 39200
    },
    "nearestStation": "일산역 (동해선) 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.09.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.09.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.09.18"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "changwon-seongsan",
    "name": "성산1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.10.18",
    "region": "경남",
    "district": "창원시 성산구",
    "address": "경상남도 창원시 성산구 상남동 458-12 일대",
    "lat": 35.2278,
    "lng": 128.6812,
    "polygon": [
      {
        "lat": 35.227752,
        "lng": 128.683171
      },
      {
        "lat": 35.228816,
        "lng": 128.683156
      },
      {
        "lat": 35.229046,
        "lng": 128.681787
      },
      {
        "lat": 35.229516,
        "lng": 128.680548
      },
      {
        "lat": 35.228773,
        "lng": 128.67956
      },
      {
        "lat": 35.227852,
        "lng": 128.679063
      },
      {
        "lat": 35.226945,
        "lng": 128.679555
      },
      {
        "lat": 35.226122,
        "lng": 128.68041
      },
      {
        "lat": 35.225999,
        "lng": 128.681884
      },
      {
        "lat": 35.226892,
        "lng": 128.68273
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "36.0억",
    "avgLandPricePerPyeongManwon": 3000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3150,
      "villaOver30Year": 2850,
      "singleHouse": 1050
    },
    "askCount": 10,
    "minPriceDisplay": "33.0억",
    "minInvestmentDisplay": "21.0억",
    "estimatedPremiumDisplay": "12.0억~18.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 18000,
      "unionPrice84Manwon": 24000,
      "generalPrice59Manwon": 24000,
      "generalPrice84Manwon": 33000,
      "expectedNewAptPrice84Manwon": 42000
    },
    "nearestStation": "창원중앙역 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.10.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "changwon-masanhappo",
    "name": "마산합포1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.08.10",
    "region": "경남",
    "district": "창원시 마산합포구",
    "address": "경상남도 창원시 마산합포구 월영동 456-8 일대",
    "lat": 35.1868,
    "lng": 128.5548,
    "polygon": [
      {
        "lat": 35.186636,
        "lng": 128.557119
      },
      {
        "lat": 35.187557,
        "lng": 128.556694
      },
      {
        "lat": 35.188106,
        "lng": 128.555639
      },
      {
        "lat": 35.188052,
        "lng": 128.554409
      },
      {
        "lat": 35.1876,
        "lng": 128.553504
      },
      {
        "lat": 35.186913,
        "lng": 128.553199
      },
      {
        "lat": 35.186199,
        "lng": 128.553297
      },
      {
        "lat": 35.185347,
        "lng": 128.553867
      },
      {
        "lat": 35.185455,
        "lng": 128.55522
      },
      {
        "lat": 35.185828,
        "lng": 128.556374
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "30.0억",
    "avgLandPricePerPyeongManwon": 2500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2625,
      "villaOver30Year": 2375,
      "singleHouse": 875
    },
    "askCount": 10,
    "minPriceDisplay": "27.5억",
    "minInvestmentDisplay": "17.5억",
    "estimatedPremiumDisplay": "10.0억~15.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 15000,
      "unionPrice84Manwon": 20000,
      "generalPrice59Manwon": 20000,
      "generalPrice84Manwon": 27500,
      "expectedNewAptPrice84Manwon": 35000
    },
    "nearestStation": "마산역 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.08.10"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.08.10"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.08.10"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gimhae-1",
    "name": "김해장유1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.11.25",
    "region": "경남",
    "district": "김해시",
    "address": "경상남도 김해시 장유동 1258-8 일대",
    "lat": 35.2178,
    "lng": 128.8218,
    "polygon": [
      {
        "lat": 35.217484,
        "lng": 128.823331
      },
      {
        "lat": 35.21834,
        "lng": 128.823188
      },
      {
        "lat": 35.219174,
        "lng": 128.822567
      },
      {
        "lat": 35.218992,
        "lng": 128.821386
      },
      {
        "lat": 35.218513,
        "lng": 128.820508
      },
      {
        "lat": 35.217665,
        "lng": 128.820125
      },
      {
        "lat": 35.216885,
        "lng": 128.820696
      },
      {
        "lat": 35.215941,
        "lng": 128.821627
      },
      {
        "lat": 35.216531,
        "lng": 128.822927
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "33.6억",
    "avgLandPricePerPyeongManwon": 2800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2940,
      "villaOver30Year": 2660,
      "singleHouse": 980
    },
    "askCount": 10,
    "minPriceDisplay": "30.8억",
    "minInvestmentDisplay": "19.6억",
    "estimatedPremiumDisplay": "11.2억~16.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 16800,
      "unionPrice84Manwon": 22400,
      "generalPrice59Manwon": 22400,
      "generalPrice84Manwon": 30800,
      "expectedNewAptPrice84Manwon": 39200
    },
    "nearestStation": "장유역 (부산김해경전철) 도보 5분",
    "walkMinutes": 5,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.25"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.25"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.25"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.25"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.11.25"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "cheongju-1",
    "name": "청주성안1구역",
    "type": "재개발",
    "status": "관리처분인가",
    "statusDate": "2023.09.15",
    "region": "충북",
    "district": "청주시 상당구",
    "address": "충청북도 청주시 상당구 남문로2가 258-8 일대",
    "lat": 36.6378,
    "lng": 127.4918,
    "polygon": [
      {
        "lat": 36.638012,
        "lng": 127.494067
      },
      {
        "lat": 36.638753,
        "lng": 127.493314
      },
      {
        "lat": 36.639178,
        "lng": 127.492375
      },
      {
        "lat": 36.639177,
        "lng": 127.491304
      },
      {
        "lat": 36.638931,
        "lng": 127.490141
      },
      {
        "lat": 36.638039,
        "lng": 127.489872
      },
      {
        "lat": 36.637242,
        "lng": 127.490094
      },
      {
        "lat": 36.636255,
        "lng": 127.490429
      },
      {
        "lat": 36.63634,
        "lng": 127.491762
      },
      {
        "lat": 36.636692,
        "lng": 127.492701
      },
      {
        "lat": 36.637075,
        "lng": 127.493794
      }
    ],
    "totalUnits": 1765,
    "ownersCount": 812,
    "generalUnits": 688,
    "rentalUnits": 265,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 137000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 11,
    "recentTradePriceDisplay": "31.2억",
    "avgLandPricePerPyeongManwon": 2600,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2730,
      "villaOver30Year": 2470,
      "singleHouse": 910
    },
    "askCount": 10,
    "minPriceDisplay": "28.6억",
    "minInvestmentDisplay": "18.2억",
    "estimatedPremiumDisplay": "10.4억~15.6억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 15600,
      "unionPrice84Manwon": 20800,
      "generalPrice59Manwon": 20800,
      "generalPrice84Manwon": 28600,
      "expectedNewAptPrice84Manwon": 36400
    },
    "nearestStation": "청주역 도보 12분",
    "walkMinutes": 12,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.09.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.09.15"
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "cheongju-2",
    "name": "청주복대1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.10.18",
    "region": "충북",
    "district": "청주시 흥덕구",
    "address": "충청북도 청주시 흥덕구 복대동 1258-12 일대",
    "lat": 36.6412,
    "lng": 127.4648,
    "polygon": [
      {
        "lat": 36.641281,
        "lng": 127.466748
      },
      {
        "lat": 36.642206,
        "lng": 127.466058
      },
      {
        "lat": 36.642528,
        "lng": 127.464691
      },
      {
        "lat": 36.642247,
        "lng": 127.463147
      },
      {
        "lat": 36.64112,
        "lng": 127.462869
      },
      {
        "lat": 36.640221,
        "lng": 127.463576
      },
      {
        "lat": 36.639469,
        "lng": 127.464942
      },
      {
        "lat": 36.640295,
        "lng": 127.466229
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "33.6억",
    "avgLandPricePerPyeongManwon": 2800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2940,
      "villaOver30Year": 2660,
      "singleHouse": 980
    },
    "askCount": 10,
    "minPriceDisplay": "30.8억",
    "minInvestmentDisplay": "19.6억",
    "estimatedPremiumDisplay": "11.2억~16.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 16800,
      "unionPrice84Manwon": 22400,
      "generalPrice59Manwon": 22400,
      "generalPrice84Manwon": 30800,
      "expectedNewAptPrice84Manwon": 39200
    },
    "nearestStation": "오송역 (KTX) 도보 20분",
    "walkMinutes": 20,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.10.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "cheonan-1",
    "name": "천안신부1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.08.28",
    "region": "충남",
    "district": "천안시 서북구",
    "address": "충청남도 천안시 서북구 신부동 456-8 일대",
    "lat": 36.8148,
    "lng": 127.1418,
    "polygon": [
      {
        "lat": 36.814696,
        "lng": 127.143259
      },
      {
        "lat": 36.815813,
        "lng": 127.143093
      },
      {
        "lat": 36.816253,
        "lng": 127.141923
      },
      {
        "lat": 36.816116,
        "lng": 127.140571
      },
      {
        "lat": 36.81493,
        "lng": 127.139985
      },
      {
        "lat": 36.813683,
        "lng": 127.140375
      },
      {
        "lat": 36.813552,
        "lng": 127.141694
      },
      {
        "lat": 36.813586,
        "lng": 127.142934
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "36.0억",
    "avgLandPricePerPyeongManwon": 3000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 3150,
      "villaOver30Year": 2850,
      "singleHouse": 1050
    },
    "askCount": 10,
    "minPriceDisplay": "33.0억",
    "minInvestmentDisplay": "21.0억",
    "estimatedPremiumDisplay": "12.0억~18.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 18000,
      "unionPrice84Manwon": 24000,
      "generalPrice59Manwon": 24000,
      "generalPrice84Manwon": 33000,
      "expectedNewAptPrice84Manwon": 42000
    },
    "nearestStation": "천안역 (경부선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.28"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.28"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.28"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.28"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.08.28"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "cheonan-2",
    "name": "천안봉명1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.11.10",
    "region": "충남",
    "district": "천안시 동남구",
    "address": "충청남도 천안시 동남구 봉명동 758-12 일대",
    "lat": 36.8048,
    "lng": 127.1548,
    "polygon": [
      {
        "lat": 36.804585,
        "lng": 127.156454
      },
      {
        "lat": 36.805437,
        "lng": 127.156147
      },
      {
        "lat": 36.806198,
        "lng": 127.155415
      },
      {
        "lat": 36.806134,
        "lng": 127.154165
      },
      {
        "lat": 36.805519,
        "lng": 127.153188
      },
      {
        "lat": 36.804601,
        "lng": 127.153477
      },
      {
        "lat": 36.803742,
        "lng": 127.153713
      },
      {
        "lat": 36.803544,
        "lng": 127.15482
      },
      {
        "lat": 36.803969,
        "lng": 127.155699
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "33.6억",
    "avgLandPricePerPyeongManwon": 2800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2940,
      "villaOver30Year": 2660,
      "singleHouse": 980
    },
    "askCount": 10,
    "minPriceDisplay": "30.8억",
    "minInvestmentDisplay": "19.6억",
    "estimatedPremiumDisplay": "11.2억~16.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 16800,
      "unionPrice84Manwon": 22400,
      "generalPrice59Manwon": 22400,
      "generalPrice84Manwon": 30800,
      "expectedNewAptPrice84Manwon": 39200
    },
    "nearestStation": "두정역 (경부선) 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.11.10"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.11.10"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.11.10"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "jeonju-1",
    "name": "전주덕진1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.09.22",
    "region": "전북",
    "district": "전주시 덕진구",
    "address": "전라북도 전주시 덕진구 팔복동 458-8 일대",
    "lat": 35.8348,
    "lng": 127.1418,
    "polygon": [
      {
        "lat": 35.83471,
        "lng": 127.143717
      },
      {
        "lat": 35.835675,
        "lng": 127.144154
      },
      {
        "lat": 35.83603,
        "lng": 127.142786
      },
      {
        "lat": 35.836442,
        "lng": 127.141622
      },
      {
        "lat": 35.836236,
        "lng": 127.140207
      },
      {
        "lat": 35.835412,
        "lng": 127.139364
      },
      {
        "lat": 35.834442,
        "lng": 127.139397
      },
      {
        "lat": 35.833602,
        "lng": 127.14004
      },
      {
        "lat": 35.833267,
        "lng": 127.141313
      },
      {
        "lat": 35.833245,
        "lng": 127.142661
      },
      {
        "lat": 35.834012,
        "lng": 127.143358
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "26.4억",
    "avgLandPricePerPyeongManwon": 2200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2310,
      "villaOver30Year": 2090,
      "singleHouse": 770
    },
    "askCount": 10,
    "minPriceDisplay": "24.2억",
    "minInvestmentDisplay": "15.4억",
    "estimatedPremiumDisplay": "8.8억~13.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 13200,
      "unionPrice84Manwon": 17600,
      "generalPrice59Manwon": 17600,
      "generalPrice84Manwon": 24200,
      "expectedNewAptPrice84Manwon": 30800
    },
    "nearestStation": "전주역 (호남선) 도보 12분",
    "walkMinutes": 12,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.22"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.22"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.22"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.22"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.09.22"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "jeonju-2",
    "name": "전주완산1구역",
    "type": "재개발",
    "status": "추진위원회승인",
    "statusDate": "2023.08.15",
    "region": "전북",
    "district": "전주시 완산구",
    "address": "전라북도 전주시 완산구 서신동 856-8 일대",
    "lat": 35.8212,
    "lng": 127.1218,
    "polygon": [
      {
        "lat": 35.821494,
        "lng": 127.123687
      },
      {
        "lat": 35.822027,
        "lng": 127.122798
      },
      {
        "lat": 35.822508,
        "lng": 127.121992
      },
      {
        "lat": 35.822448,
        "lng": 127.120859
      },
      {
        "lat": 35.82178,
        "lng": 127.120102
      },
      {
        "lat": 35.820931,
        "lng": 127.120071
      },
      {
        "lat": 35.820201,
        "lng": 127.120595
      },
      {
        "lat": 35.819955,
        "lng": 127.121617
      },
      {
        "lat": 35.820047,
        "lng": 127.12267
      },
      {
        "lat": 35.820766,
        "lng": 127.123071
      }
    ],
    "totalUnits": 987,
    "ownersCount": 462,
    "generalUnits": 385,
    "rentalUnits": 140,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 76000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 6,
    "recentTradePriceDisplay": "30.0억",
    "avgLandPricePerPyeongManwon": 2500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2625,
      "villaOver30Year": 2375,
      "singleHouse": 875
    },
    "askCount": 10,
    "minPriceDisplay": "27.5억",
    "minInvestmentDisplay": "17.5억",
    "estimatedPremiumDisplay": "10.0억~15.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 15000,
      "unionPrice84Manwon": 20000,
      "generalPrice59Manwon": 20000,
      "generalPrice84Manwon": 27500,
      "expectedNewAptPrice84Manwon": 35000
    },
    "nearestStation": "전주역 도보 15분",
    "walkMinutes": 15,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.08.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.08.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "yeosu-1",
    "name": "여수웅천1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.10.08",
    "region": "전남",
    "district": "여수시",
    "address": "전라남도 여수시 웅천동 1258-8 일대",
    "lat": 34.7648,
    "lng": 127.7218,
    "polygon": [
      {
        "lat": 34.764676,
        "lng": 127.723826
      },
      {
        "lat": 34.765478,
        "lng": 127.723572
      },
      {
        "lat": 34.765977,
        "lng": 127.722716
      },
      {
        "lat": 34.76585,
        "lng": 127.721715
      },
      {
        "lat": 34.765791,
        "lng": 127.720801
      },
      {
        "lat": 34.765187,
        "lng": 127.72042
      },
      {
        "lat": 34.764545,
        "lng": 127.720075
      },
      {
        "lat": 34.763735,
        "lng": 127.720289
      },
      {
        "lat": 34.763643,
        "lng": 127.721431
      },
      {
        "lat": 34.763766,
        "lng": 127.722313
      },
      {
        "lat": 34.764029,
        "lng": 127.723186
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "24.0억",
    "avgLandPricePerPyeongManwon": 2000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2100,
      "villaOver30Year": 1900,
      "singleHouse": 700
    },
    "askCount": 10,
    "minPriceDisplay": "22.0억",
    "minInvestmentDisplay": "14.0억",
    "estimatedPremiumDisplay": "8.0억~12.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 12000,
      "unionPrice84Manwon": 16000,
      "generalPrice59Manwon": 16000,
      "generalPrice84Manwon": 22000,
      "expectedNewAptPrice84Manwon": 28000
    },
    "nearestStation": "여수엑스포역 (경전선) 도보 15분",
    "walkMinutes": 15,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.10.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.10.08"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.10.08"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "suncheon-1",
    "name": "순천매곡1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.10.15",
    "region": "전남",
    "district": "순천시",
    "address": "전라남도 순천시 매곡동 456-8 일대",
    "lat": 34.9748,
    "lng": 127.5048,
    "polygon": [
      {
        "lat": 34.974963,
        "lng": 127.507166
      },
      {
        "lat": 34.975761,
        "lng": 127.506585
      },
      {
        "lat": 34.975978,
        "lng": 127.505391
      },
      {
        "lat": 34.976314,
        "lng": 127.504243
      },
      {
        "lat": 34.975614,
        "lng": 127.503522
      },
      {
        "lat": 34.975078,
        "lng": 127.502596
      },
      {
        "lat": 34.974257,
        "lng": 127.502832
      },
      {
        "lat": 34.973557,
        "lng": 127.503509
      },
      {
        "lat": 34.973311,
        "lng": 127.504709
      },
      {
        "lat": 34.973488,
        "lng": 127.505935
      },
      {
        "lat": 34.974203,
        "lng": 127.506538
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 578,
    "generalUnits": 485,
    "rentalUnits": 180,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "26.4억",
    "avgLandPricePerPyeongManwon": 2200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2310,
      "villaOver30Year": 2090,
      "singleHouse": 770
    },
    "askCount": 10,
    "minPriceDisplay": "24.2억",
    "minInvestmentDisplay": "15.4억",
    "estimatedPremiumDisplay": "8.8억~13.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 13200,
      "unionPrice84Manwon": 17600,
      "generalPrice59Manwon": 17600,
      "generalPrice84Manwon": 24200,
      "expectedNewAptPrice84Manwon": 30800
    },
    "nearestStation": "순천역 (경전선) 도보 12분",
    "walkMinutes": 12,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.10.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.10.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "pohang-1",
    "name": "포항대잠1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.08.15",
    "region": "경북",
    "district": "포항시 남구",
    "address": "경상북도 포항시 남구 대잠동 852-8 일대",
    "lat": 36.0048,
    "lng": 129.3618,
    "polygon": [
      {
        "lat": 36.005308,
        "lng": 129.363809
      },
      {
        "lat": 36.00611,
        "lng": 129.362809
      },
      {
        "lat": 36.006018,
        "lng": 129.361646
      },
      {
        "lat": 36.006051,
        "lng": 129.360293
      },
      {
        "lat": 36.004918,
        "lng": 129.359723
      },
      {
        "lat": 36.004054,
        "lng": 129.360628
      },
      {
        "lat": 36.003202,
        "lng": 129.361349
      },
      {
        "lat": 36.003101,
        "lng": 129.362766
      },
      {
        "lat": 36.004309,
        "lng": 129.363087
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "33.6억",
    "avgLandPricePerPyeongManwon": 2800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2940,
      "villaOver30Year": 2660,
      "singleHouse": 980
    },
    "askCount": 10,
    "minPriceDisplay": "30.8억",
    "minInvestmentDisplay": "19.6억",
    "estimatedPremiumDisplay": "11.2억~16.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 16800,
      "unionPrice84Manwon": 22400,
      "generalPrice59Manwon": 22400,
      "generalPrice84Manwon": 30800,
      "expectedNewAptPrice84Manwon": 39200
    },
    "nearestStation": "포항역 (동해선) 도보 15분",
    "walkMinutes": 15,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.15"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.15"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.08.15"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gumi-1",
    "name": "구미원평1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.09.22",
    "region": "경북",
    "district": "구미시",
    "address": "경상북도 구미시 원평동 758-12 일대",
    "lat": 36.1248,
    "lng": 128.3418,
    "polygon": [
      {
        "lat": 36.124825,
        "lng": 128.343012
      },
      {
        "lat": 36.12547,
        "lng": 128.342821
      },
      {
        "lat": 36.125877,
        "lng": 128.342174
      },
      {
        "lat": 36.126287,
        "lng": 128.34119
      },
      {
        "lat": 36.125458,
        "lng": 128.340688
      },
      {
        "lat": 36.124769,
        "lng": 128.340315
      },
      {
        "lat": 36.123976,
        "lng": 128.340545
      },
      {
        "lat": 36.123641,
        "lng": 128.341397
      },
      {
        "lat": 36.123326,
        "lng": 128.342404
      },
      {
        "lat": 36.123929,
        "lng": 128.343271
      }
    ],
    "totalUnits": 1124,
    "ownersCount": 528,
    "generalUnits": 439,
    "rentalUnits": 157,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 87000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 7,
    "recentTradePriceDisplay": "28.8억",
    "avgLandPricePerPyeongManwon": 2400,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2520,
      "villaOver30Year": 2280,
      "singleHouse": 840
    },
    "askCount": 10,
    "minPriceDisplay": "26.4억",
    "minInvestmentDisplay": "16.8억",
    "estimatedPremiumDisplay": "9.6억~14.4억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 14400,
      "unionPrice84Manwon": 19200,
      "generalPrice59Manwon": 19200,
      "generalPrice84Manwon": 26400,
      "expectedNewAptPrice84Manwon": 33600
    },
    "nearestStation": "구미역 (경부선) 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.09.22"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.09.22"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.09.22"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "gyeongju-1",
    "name": "경주황성1구역",
    "type": "재개발",
    "status": "추진위원회승인",
    "statusDate": "2023.07.18",
    "region": "경북",
    "district": "경주시",
    "address": "경상북도 경주시 황성동 456-8 일대",
    "lat": 35.8648,
    "lng": 129.2348,
    "polygon": [
      {
        "lat": 35.865092,
        "lng": 129.236231
      },
      {
        "lat": 35.865904,
        "lng": 129.235659
      },
      {
        "lat": 35.865883,
        "lng": 129.234367
      },
      {
        "lat": 35.865256,
        "lng": 129.233652
      },
      {
        "lat": 35.864442,
        "lng": 129.233043
      },
      {
        "lat": 35.863936,
        "lng": 129.234127
      },
      {
        "lat": 35.863619,
        "lng": 129.235272
      },
      {
        "lat": 35.864187,
        "lng": 129.236344
      }
    ],
    "totalUnits": 876,
    "ownersCount": 412,
    "generalUnits": 341,
    "rentalUnits": 123,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 68000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 5,
    "recentTradePriceDisplay": "24.0억",
    "avgLandPricePerPyeongManwon": 2000,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2100,
      "villaOver30Year": 1900,
      "singleHouse": 700
    },
    "askCount": 10,
    "minPriceDisplay": "22.0억",
    "minInvestmentDisplay": "14.0억",
    "estimatedPremiumDisplay": "8.0억~12.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 12000,
      "unionPrice84Manwon": 16000,
      "generalPrice59Manwon": 16000,
      "generalPrice84Manwon": 22000,
      "expectedNewAptPrice84Manwon": 28000
    },
    "nearestStation": "경주역 (동해선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2023.07.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2023.07.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "chuncheon-1",
    "name": "춘천소양로1구역",
    "type": "재개발",
    "status": "조합설립인가",
    "statusDate": "2021.08.15",
    "region": "강원",
    "district": "춘천시",
    "address": "강원도 춘천시 소양로2가 456-8 일대",
    "lat": 37.8788,
    "lng": 127.7318,
    "polygon": [
      {
        "lat": 37.878778,
        "lng": 127.733621
      },
      {
        "lat": 37.87953,
        "lng": 127.732988
      },
      {
        "lat": 37.880124,
        "lng": 127.732138
      },
      {
        "lat": 37.879747,
        "lng": 127.731105
      },
      {
        "lat": 37.879294,
        "lng": 127.730095
      },
      {
        "lat": 37.878467,
        "lng": 127.730526
      },
      {
        "lat": 37.87781,
        "lng": 127.731016
      },
      {
        "lat": 37.877488,
        "lng": 127.732077
      },
      {
        "lat": 37.877979,
        "lng": 127.733051
      }
    ],
    "totalUnits": 987,
    "ownersCount": 462,
    "generalUnits": 385,
    "rentalUnits": 140,
    "generalRatio": 39,
    "builder": "미정",
    "zoneAreaM2": 76000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 6,
    "recentTradePriceDisplay": "26.4억",
    "avgLandPricePerPyeongManwon": 2200,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2310,
      "villaOver30Year": 2090,
      "singleHouse": 770
    },
    "askCount": 10,
    "minPriceDisplay": "24.2억",
    "minInvestmentDisplay": "15.4억",
    "estimatedPremiumDisplay": "8.8억~13.2억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 13200,
      "unionPrice84Manwon": 17600,
      "generalPrice59Manwon": 17600,
      "generalPrice84Manwon": 24200,
      "expectedNewAptPrice84Manwon": 30800
    },
    "nearestStation": "남춘천역 (경춘선) 도보 15분",
    "walkMinutes": 15,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.08.15"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2021.08.15"
      },
      {
        "name": "조합설립인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2021.08.15"
      },
      {
        "name": "건축심의",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "wonju-1",
    "name": "원주단구1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.08.22",
    "region": "강원",
    "district": "원주시",
    "address": "강원도 원주시 단구동 756-12 일대",
    "lat": 37.3248,
    "lng": 127.9948,
    "polygon": [
      {
        "lat": 37.324907,
        "lng": 127.996538
      },
      {
        "lat": 37.325784,
        "lng": 127.996313
      },
      {
        "lat": 37.326217,
        "lng": 127.994973
      },
      {
        "lat": 37.325893,
        "lng": 127.993577
      },
      {
        "lat": 37.325132,
        "lng": 127.992783
      },
      {
        "lat": 37.324084,
        "lng": 127.992453
      },
      {
        "lat": 37.323601,
        "lng": 127.993946
      },
      {
        "lat": 37.323619,
        "lng": 127.995314
      },
      {
        "lat": 37.324004,
        "lng": 127.996616
      }
    ],
    "totalUnits": 1245,
    "ownersCount": 578,
    "generalUnits": 485,
    "rentalUnits": 180,
    "generalRatio": 39,
    "builder": "현대건설",
    "zoneAreaM2": 97000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 8,
    "recentTradePriceDisplay": "30.0억",
    "avgLandPricePerPyeongManwon": 2500,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2625,
      "villaOver30Year": 2375,
      "singleHouse": 875
    },
    "askCount": 10,
    "minPriceDisplay": "27.5억",
    "minInvestmentDisplay": "17.5억",
    "estimatedPremiumDisplay": "10.0억~15.0억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 15000,
      "unionPrice84Manwon": 20000,
      "generalPrice59Manwon": 20000,
      "generalPrice84Manwon": 27500,
      "expectedNewAptPrice84Manwon": 35000
    },
    "nearestStation": "원주역 (중앙선) 도보 10분",
    "walkMinutes": 10,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.22"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.22"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.22"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.08.22"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.08.22"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "sejong-jochiwon",
    "name": "조치원1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.09.08",
    "region": "세종",
    "district": "조치원읍",
    "address": "세종특별자치시 조치원읍 새내리 456-8 일대",
    "lat": 36.5948,
    "lng": 127.2948,
    "polygon": [
      {
        "lat": 36.594985,
        "lng": 127.296513
      },
      {
        "lat": 36.596025,
        "lng": 127.296008
      },
      {
        "lat": 36.596314,
        "lng": 127.294518
      },
      {
        "lat": 36.595657,
        "lng": 127.293304
      },
      {
        "lat": 36.594542,
        "lng": 127.292415
      },
      {
        "lat": 36.593354,
        "lng": 127.293374
      },
      {
        "lat": 36.593208,
        "lng": 127.295096
      },
      {
        "lat": 36.594054,
        "lng": 127.296101
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "GS건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "33.6억",
    "avgLandPricePerPyeongManwon": 2800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 2940,
      "villaOver30Year": 2660,
      "singleHouse": 980
    },
    "askCount": 10,
    "minPriceDisplay": "30.8억",
    "minInvestmentDisplay": "19.6억",
    "estimatedPremiumDisplay": "11.2억~16.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 16800,
      "unionPrice84Manwon": 22400,
      "generalPrice59Manwon": 22400,
      "generalPrice84Manwon": 30800,
      "expectedNewAptPrice84Manwon": 39200
    },
    "nearestStation": "조치원역 (경부선) 도보 8분",
    "walkMinutes": 8,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.08"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.08"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.08"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.09.08"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.09.08"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  },
  {
    "id": "jeju-1",
    "name": "제주노형1구역",
    "type": "재개발",
    "status": "사업시행인가",
    "statusDate": "2022.11.18",
    "region": "제주",
    "district": "제주시",
    "address": "제주특별자치도 제주시 노형동 756-8 일대",
    "lat": 33.4848,
    "lng": 126.4848,
    "polygon": [
      {
        "lat": 33.484983,
        "lng": 126.486525
      },
      {
        "lat": 33.485871,
        "lng": 126.486206
      },
      {
        "lat": 33.486318,
        "lng": 126.48515
      },
      {
        "lat": 33.486052,
        "lng": 126.484055
      },
      {
        "lat": 33.485485,
        "lng": 126.483226
      },
      {
        "lat": 33.484632,
        "lng": 126.483212
      },
      {
        "lat": 33.483894,
        "lng": 126.483611
      },
      {
        "lat": 33.483341,
        "lng": 126.484464
      },
      {
        "lat": 33.483445,
        "lng": 126.485607
      },
      {
        "lat": 33.48394,
        "lng": 126.486777
      }
    ],
    "totalUnits": 1534,
    "ownersCount": 712,
    "generalUnits": 598,
    "rentalUnits": 224,
    "generalRatio": 39,
    "builder": "롯데건설",
    "zoneAreaM2": 119000,
    "far": 250,
    "bcr": 20,
    "maxFloor": 35,
    "totalBuildings": 10,
    "recentTradePriceDisplay": "69.6억",
    "avgLandPricePerPyeongManwon": 5800,
    "pricePerPyeongByAge": {
      "villa11To30Year": 6090,
      "villaOver30Year": 5510,
      "singleHouse": 2030
    },
    "askCount": 10,
    "minPriceDisplay": "63.8억",
    "minInvestmentDisplay": "40.6억",
    "estimatedPremiumDisplay": "23.2억~34.8억",
    "calcMetrics": {
      "estimatedProportionRate": 105,
      "avgOfficialPriceRatio": 130,
      "unionPrice59Manwon": 34800,
      "unionPrice84Manwon": 46400,
      "generalPrice59Manwon": 46400,
      "generalPrice84Manwon": 63800,
      "expectedNewAptPrice84Manwon": 81200
    },
    "nearestStation": "제주공항 도보 20분",
    "walkMinutes": 20,
    "stages": [
      {
        "name": "정비구역지정",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.18"
      },
      {
        "name": "추진위원회승인",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.18"
      },
      {
        "name": "조합설립인가",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.18"
      },
      {
        "name": "건축심의",
        "isCompleted": true,
        "isCurrent": false,
        "date": "2022.11.18"
      },
      {
        "name": "사업시행인가",
        "isCompleted": false,
        "isCurrent": true,
        "date": "2022.11.18"
      },
      {
        "name": "관리처분인가",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "이주철거",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "착공",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "일반분양",
        "isCompleted": false,
        "isCurrent": false
      },
      {
        "name": "준공",
        "isCompleted": false,
        "isCurrent": false
      }
    ],
    "transactions": [],
    "notices": []
  }
];
