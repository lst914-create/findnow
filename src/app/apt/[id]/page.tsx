"use client";

import { use } from "react";
import Link from "next/link";

interface DetailProps {
  params: Promise<{ id: string }>;
}

const APARTMENT_DETAILS: Record<string, any> = {
  "1": {
    id: "1",
    name: "래미안 대치팰리스 1단지",
    region: "서울 강남구 대치동 1027",
    price_min: 270000,
    price_max: 340000,
    rent_min: 150000,
    rent_max: 180000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2015,
    household_count: 1278,
    construction: "삼성물산",
    parking: "세대당 1.9대",
    floor_area_ratio: "259%",
    heating: "지역난방",
    school_score: 99,
    traffic_score: 92,
    nature_score: 78,
    tags: ["초품아", "학군대표", "역세권", "대단지"],
    image_url: "/images/apts/daechi.png",
    station: "대치역(3호선) 도보 3분",
    schools: ["서울대곡초등학교 (도보 2분)", "대치중학교", "휘문고등학교", "단국대부속고등학교"],
    description: "대한민국 대표 학군지 대치동의 대장 아파트입니다. 대치동 학원가 도보 접근성이 매우 우수하며 실거주 만족도가 최고 수준인 대단지 신축 아파트입니다.",
    recent_transactions: [
      { date: "2026.08", floor: "14층", area: "84.97㎡", price: "33억 5,000만" },
      { date: "2026.07", floor: "8층", area: "84.97㎡", price: "32억 8,000만" },
      { date: "2026.06", floor: "21층", area: "84.97㎡", price: "33억 0,000만" },
    ],
  },
  "2": {
    id: "2",
    name: "반포 자이",
    region: "서울 서초구 반포동 20-43",
    price_min: 280000,
    price_max: 360000,
    rent_min: 160000,
    rent_max: 190000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2009,
    household_count: 3410,
    construction: "GS건설",
    parking: "세대당 1.78대",
    floor_area_ratio: "270%",
    heating: "지역난방",
    school_score: 96,
    traffic_score: 98,
    nature_score: 85,
    tags: ["역세권", "대단지", "한강조망", "커뮤니티"],
    image_url: "/images/apts/banpo.png",
    station: "사평역(9호선) 도보 2분 / 반포역(7호선) 도보 4분",
    schools: ["원촌초등학교 (단지내)", "원촌중학교", "반포고등학교"],
    description: "서초구 반포동의 상징적인 랜드마크 대단지 아파트입니다. 사평역과 반포역을 품은 초역세권에 원촌초·중학교를 품고 있습니다.",
    recent_transactions: [
      { date: "2026.08", floor: "18층", area: "84.98㎡", price: "35억 2,000만" },
      { date: "2026.07", floor: "12층", area: "84.98㎡", price: "34억 5,000만" },
      { date: "2026.05", floor: "25층", area: "84.98㎡", price: "35억 8,000만" },
    ],
  },
  "3": {
    id: "3",
    name: "마포 프레스티지 자이",
    region: "서울 마포구 염리동 533",
    price_min: 165000,
    price_max: 195000,
    rent_min: 95000,
    rent_max: 110000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2021,
    household_count: 1694,
    construction: "GS건설",
    parking: "세대당 1.4대",
    floor_area_ratio: "249%",
    heating: "개별난방",
    school_score: 88,
    traffic_score: 95,
    nature_score: 82,
    tags: ["신축", "역세권", "직주근접", "대단지"],
    image_url: "/images/apts/mapo.png",
    station: "이대역(2호선) 도보 5분 / 대흥역(6호선) 도보 7분",
    schools: ["한서초등학교", "숭문중학교", "숭문고등학교", "서울여고"],
    description: "마포 신축 브랜드 대단지의 핵심입니다. 여의도 및 광화문 CBD 직주근접이 뛰어나며 백범로 학원가 형성으로 인기가 매우 높습니다.",
    recent_transactions: [
      { date: "2026.08", floor: "15층", area: "84.91㎡", price: "19억 2,000만" },
      { date: "2026.07", floor: "10층", area: "84.91㎡", price: "18억 8,000만" },
      { date: "2026.06", floor: "22층", area: "84.91㎡", price: "19억 5,000만" },
    ],
  },
  "4": {
    id: "4",
    name: "헬리오시티",
    region: "서울 송파구 가락동 문정로 215",
    price_min: 180000,
    price_max: 220000,
    rent_min: 100000,
    rent_max: 125000,
    area_sqm: 84,
    area_pyeong: 33,
    built_year: 2018,
    household_count: 9510,
    construction: "현대건설·삼성물산·현대산업개발",
    parking: "세대당 2.0대",
    floor_area_ratio: "275%",
    heating: "지역난방",
    school_score: 91,
    traffic_score: 93,
    nature_score: 80,
    tags: ["대단지", "초품아", "역세권", "신축"],
    image_url: "/images/apts/helio.png",
    station: "송파역(8호선) 도보 2분 / 문정역(8호선) 도보 5분",
    schools: ["가락초등학교 (단지내)", "문정중학교", "오금고등학교"],
    description: "9,510세대 대한민국 최대 규모 아파트 단지입니다. 단지 내 초등학교와 복합 커뮤니티 시설을 갖추고 있으며 송파역 초역세권으로 교통이 탁월합니다.",
    recent_transactions: [
      { date: "2026.08", floor: "20층", area: "84.97㎡", price: "21억 5,000만" },
      { date: "2026.07", floor: "11층", area: "84.97㎡", price: "21억 0,000만" },
      { date: "2026.06", floor: "30층", area: "84.97㎡", price: "22억 0,000만" },
    ],
  },
  "5": {
    id: "5",
    name: "판교 푸르지오 그랑블",
    region: "경기 성남시 분당구 백현동 541",
    price_min: 220000,
    price_max: 260000,
    rent_min: 130000,
    rent_max: 155000,
    area_sqm: 98,
    area_pyeong: 38,
    built_year: 2011,
    household_count: 948,
    construction: "대우건설",
    parking: "세대당 2.1대",
    floor_area_ratio: "215%",
    heating: "지역난방",
    school_score: 94,
    traffic_score: 99,
    nature_score: 90,
    tags: ["판교역세권", "직주근접", "공원인접", "학군굿"],
    image_url: "/images/apts/pangyo.png",
    station: "판교역(신분당선·경강선) 도보 3분",
    schools: ["백현초등학교", "판교중학교", "불정고등학교"],
    description: "판교 테크노밸리 직주근접 최고 입지의 중소형 프리미엄 단지입니다. 신분당선 판교역까지 도보 3분이며, 낙생대공원과 인접해 쾌적한 생활환경을 갖췄습니다.",
    recent_transactions: [
      { date: "2026.08", floor: "13층", area: "98.7㎡", price: "25억 3,000만" },
      { date: "2026.07", floor: "7층", area: "98.7㎡", price: "24억 7,000만" },
      { date: "2026.05", floor: "18층", area: "98.7㎡", price: "25억 8,000만" },
    ],
  },
  "6": {
    id: "6",
    name: "킨텍스 꿈에그린",
    region: "경기 고양시 일산서구 대화동 2260",
    price_min: 95000,
    price_max: 125000,
    rent_min: 52000,
    rent_max: 70000,
    area_sqm: 84,
    area_pyeong: 35,
    built_year: 2019,
    household_count: 1880,
    construction: "한화건설",
    parking: "세대당 1.3대",
    floor_area_ratio: "245%",
    heating: "지역난방",
    school_score: 82,
    traffic_score: 89,
    nature_score: 88,
    tags: ["GTX호재", "신축", "대공원", "대단지"],
    image_url: "/images/apts/kintex.png",
    station: "킨텍스역(GTX-A) 도보 4분 / 대화역(3호선) 도보 8분",
    schools: ["킨텍스초등학교", "세원중학교", "백신고등학교"],
    description: "GTX-A 개통으로 서울 접근성이 획기적으로 개선된 일산 신축 대단지입니다. 킨텍스 인근에 위치해 대형 MICE 행사 등 편의시설이 풍부하며 호수공원과 인접해 있습니다.",
    recent_transactions: [
      { date: "2026.08", floor: "16층", area: "84.92㎡", price: "11억 5,000만" },
      { date: "2026.07", floor: "9층", area: "84.92㎡", price: "11억 0,000만" },
      { date: "2026.06", floor: "24층", area: "84.92㎡", price: "12억 0,000만" },
    ],
  },
  "7": {
    id: "7",
    name: "DMC 롯데캐슬 더 퍼스트",
    region: "서울 은평구 수색동 300",
    price_min: 115000,
    price_max: 138000,
    rent_min: 62000,
    rent_max: 78000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2020,
    household_count: 1192,
    construction: "롯데건설",
    parking: "세대당 1.5대",
    floor_area_ratio: "258%",
    heating: "지역난방",
    school_score: 84,
    traffic_score: 91,
    nature_score: 85,
    tags: ["DMC직주근접", "신축", "역세권"],
    image_url: "/images/apts/daechi.png",
    station: "수색역(경의중앙선) 도보 6분 / DMC역(공항철도·6호선) 도보 9분",
    schools: ["수색초등학교", "상암중학교", "중산고등학교"],
    description: "수도권광역급행철도 및 공항철도를 활용한 강남·여의도·마포 접근성 우수 단지입니다. 상암 DMC 직주근접 및 한강 수변공원 산책이 가능한 쾌적한 환경입니다.",
    recent_transactions: [
      { date: "2026.08", floor: "17층", area: "84.98㎡", price: "13억 2,000만" },
      { date: "2026.07", floor: "8층", area: "84.98㎡", price: "12억 9,000만" },
    ],
  },
  "8": {
    id: "8",
    name: "광교 중흥S-클래스",
    region: "경기 수원시 영통구 이의동 1373",
    price_min: 135000,
    price_max: 175000,
    rent_min: 72000,
    rent_max: 90000,
    area_sqm: 84,
    area_pyeong: 35,
    built_year: 2019,
    household_count: 2231,
    construction: "중흥토건",
    parking: "세대당 1.82대",
    floor_area_ratio: "247%",
    heating: "지역난방",
    school_score: 90,
    traffic_score: 92,
    nature_score: 98,
    tags: ["호수공원뷰", "신축", "광교중앙역", "초품아"],
    image_url: "/images/apts/pangyo.png",
    station: "광교중앙역(신분당선) 도보 7분",
    schools: ["이의초등학교", "광교중학교", "이의고등학교"],
    description: "광교호수공원 바로 인접한 프리미엄 신축 아파트로, 호수조망 세대가 다수입니다. 신분당선 광교중앙역 이용 가능하며 수원 최대 규모 학원가인 광교 인근 학원가와 가깝습니다.",
    recent_transactions: [
      { date: "2026.08", floor: "19층", area: "84.93㎡", price: "17억 0,000만" },
      { date: "2026.07", floor: "14층", area: "84.93㎡", price: "16억 5,000만" },
      { date: "2026.06", floor: "28층", area: "84.93㎡", price: "17억 5,000만" },
    ],
  },
  "9": {
    id: "9",
    name: "아크로리버파크",
    region: "서울 서초구 반포동 82",
    price_min: 350000,
    price_max: 420000,
    rent_min: 200000,
    rent_max: 240000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2016,
    household_count: 1612,
    construction: "대림산업",
    parking: "세대당 1.96대",
    floor_area_ratio: "279%",
    heating: "지역난방",
    school_score: 98,
    traffic_score: 97,
    nature_score: 99,
    tags: ["한강조망", "프리미엄", "신반포역", "초품아"],
    image_url: "/images/apts/banpo.png",
    station: "신반포역(9호선) 도보 5분 / 잠원역(3호선) 도보 7분",
    schools: ["신동초등학교 (도보 3분)", "원촌중학교", "반포고등학교"],
    description: "서울 최고 프리미엄 한강변 아파트의 상징입니다. 반포한강공원 도보 접근성이 최상이며, 한강 조망 세대의 경우 최고 40억원 이상에 거래됩니다.",
    recent_transactions: [
      { date: "2026.08", floor: "22층", area: "84.94㎡", price: "40억 5,000만" },
      { date: "2026.07", floor: "15층", area: "84.94㎡", price: "39억 0,000만" },
      { date: "2026.06", floor: "30층", area: "84.94㎡", price: "41억 2,000만" },
    ],
  },
  "10": {
    id: "10",
    name: "올림픽파크 포레온 (둔촌주공)",
    region: "서울 강동구 둔촌동 170",
    price_min: 170000,
    price_max: 210000,
    rent_min: 95000,
    rent_max: 120000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2025,
    household_count: 12032,
    construction: "현대건설·현대산업개발·삼성물산·대우건설",
    parking: "세대당 2.2대",
    floor_area_ratio: "280%",
    heating: "지역난방",
    school_score: 95,
    traffic_score: 94,
    nature_score: 92,
    tags: ["초대단지", "신축입주", "올림픽공원", "학군인접"],
    image_url: "/images/apts/helio.png",
    station: "둔촌동역(5호선) 도보 3분 / 올림픽공원역(5·9호선) 도보 7분",
    schools: ["명일초등학교", "명일중학교", "강동고등학교"],
    description: "2025년 입주 완료한 대한민국 최초이자 최대 규모 1만2천세대 재건축 단지입니다. 올림픽공원 도보 접근 및 5·9호선 더블역세권으로 뛰어난 교통 입지를 자랑합니다.",
    recent_transactions: [
      { date: "2026.08", floor: "20층", area: "84.92㎡", price: "20억 8,000만" },
      { date: "2026.07", floor: "12층", area: "84.92㎡", price: "20억 2,000만" },
      { date: "2026.06", floor: "35층", area: "84.92㎡", price: "21억 5,000만" },
    ],
  },
  "11": {
    id: "11",
    name: "평촌 더샵 아이파크",
    region: "경기 안양시 동안구 호계동 1039",
    price_min: 88000,
    price_max: 110000,
    rent_min: 50000,
    rent_max: 63000,
    area_sqm: 84,
    area_pyeong: 34,
    built_year: 2019,
    household_count: 1174,
    construction: "포스코이앤씨·HDC현대산업개발",
    parking: "세대당 1.4대",
    floor_area_ratio: "262%",
    heating: "개별난방",
    school_score: 92,
    traffic_score: 88,
    nature_score: 84,
    tags: ["평촌학원가", "신축", "대단지"],
    image_url: "/images/apts/kintex.png",
    station: "범계역(4호선) 도보 11분",
    schools: ["귀인초등학교", "호계중학교", "부흥고등학교"],
    description: "경기 안양 평촌 신도시의 신축 랜드마크 단지로, 평촌 최대 학원가 인접 프리미엄 입지입니다. 더샵과 아이파크 두 브랜드가 결합된 점이 특징입니다.",
    recent_transactions: [
      { date: "2026.08", floor: "14층", area: "84.95㎡", price: "10억 2,000만" },
      { date: "2026.07", floor: "9층", area: "84.95㎡", price: "9억 8,000만" },
    ],
  },
  "12": {
    id: "12",
    name: "송도 더샵 센트럴파크 2차",
    region: "인천 연수구 송도동 24-1",
    price_min: 75000,
    price_max: 98000,
    rent_min: 42000,
    rent_max: 55000,
    area_sqm: 98,
    area_pyeong: 39,
    built_year: 2011,
    household_count: 632,
    construction: "포스코이앤씨",
    parking: "세대당 1.8대",
    floor_area_ratio: "210%",
    heating: "지역난방",
    school_score: 89,
    traffic_score: 86,
    nature_score: 97,
    tags: ["센트럴파크뷰", "국제학교", "공원인접"],
    image_url: "/images/apts/pangyo.png",
    station: "센트럴파크역(인천1호선) 도보 4분",
    schools: ["송도초등학교", "인천국제학교(국제중)", "송도고등학교"],
    description: "인천 송도 국제업무지구 내 프리미엄 단지로 센트럴파크 공원뷰가 일품입니다. 인천국제학교 인접으로 자녀 교육을 중시하는 가정에 최적의 입지입니다.",
    recent_transactions: [
      { date: "2026.08", floor: "21층", area: "98.4㎡", price: "9억 5,000만" },
      { date: "2026.07", floor: "14층", area: "98.4㎡", price: "9억 0,000만" },
    ],
  },
};

export default function ApartmentDetailPage({ params }: DetailProps) {
  const resolvedParams = use(params);
  const apt = APARTMENT_DETAILS[resolvedParams.id] || APARTMENT_DETAILS["1"];

  const formatPrice = (price: number) => {
    const uk = Math.floor(price / 10000);
    const cheon = price % 10000;
    if (uk > 0 && cheon > 0) return `${uk}억 ${cheon.toLocaleString()}만`;
    if (uk > 0) return `${uk}억원`;
    return `${price.toLocaleString()}만원`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      {/* Header Nav */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-semibold text-sm transition-colors">
            <span>←</span>
            <span>목록으로 돌아가기</span>
          </Link>
          <div className="hidden sm:block text-base font-bold text-slate-900 truncate max-w-xs">{apt.name}</div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer">
            관심 단지 등록 ⭐
          </button>
        </div>
      </header>

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative h-[320px] sm:h-[440px] rounded-3xl overflow-hidden shadow-2xl mb-8">
          <img src={apt.image_url} alt={apt.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-10">
            <div className="text-white space-y-3">
              <div className="flex flex-wrap gap-2">
                {apt.tags.map((t: string) => (
                  <span key={t} className="px-3 py-1 bg-white/25 backdrop-blur-md text-white text-xs font-bold rounded-full border border-white/30">
                    #{t}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold drop-shadow">{apt.name}</h1>
              <p className="text-slate-200 text-sm sm:text-base">📍 {apt.region}</p>
            </div>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Main info (2 cols) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Price Box */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-xl font-bold text-slate-900">💰 시세 현황</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                  <div className="text-xs font-semibold text-blue-500 uppercase tracking-wide mb-1">매매 예상 시세 (전용 {apt.area_sqm}㎡)</div>
                  <div className="text-2xl font-black text-slate-900">
                    {formatPrice(apt.price_min)} ~ {formatPrice(apt.price_max)}
                  </div>
                </div>
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">전세 예상 시세</div>
                  <div className="text-2xl font-black text-slate-700">
                    {formatPrice(apt.rent_min)} ~ {formatPrice(apt.rent_max)}
                  </div>
                </div>
              </div>

              {/* Recent transaction table */}
              <div>
                <h3 className="text-sm font-bold text-slate-600 mb-3">📋 최근 실거래 신고 내역</h3>
                <div className="overflow-x-auto rounded-xl border border-slate-100">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50">
                      <tr className="text-slate-400 text-xs">
                        <th className="px-4 py-3">계약월</th>
                        <th className="px-4 py-3">층수</th>
                        <th className="px-4 py-3">전용면적</th>
                        <th className="px-4 py-3 text-right">거래금액</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {apt.recent_transactions?.map((tx: any, idx: number) => (
                        <tr key={idx} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-600">{tx.date}</td>
                          <td className="px-4 py-3 text-slate-700">{tx.floor}</td>
                          <td className="px-4 py-3 text-slate-700">{tx.area}</td>
                          <td className="px-4 py-3 font-bold text-blue-600 text-right">{tx.price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Complex Info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-900">🏢 단지 기본 정보</h2>
              <p className="text-slate-600 text-sm leading-relaxed border-l-4 border-blue-200 pl-4 py-1 bg-blue-50/40 rounded-r-xl">
                {apt.description}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                {[
                  { label: "총 세대수", value: `${apt.household_count.toLocaleString()}세대` },
                  { label: "준공년도", value: `${apt.built_year}년` },
                  { label: "시공사", value: apt.construction },
                  { label: "주차 대수", value: apt.parking },
                  { label: "용적률", value: apt.floor_area_ratio },
                  { label: "난방 방식", value: apt.heating },
                ].map((item) => (
                  <div key={item.label} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <div className="text-xs text-slate-400 mb-1">{item.label}</div>
                    <div className="font-bold text-slate-800 text-sm">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Scores & Environment (1 col) */}
          <div className="space-y-6">

            {/* Score Cards */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-5">⭐ 입지 분석 점수</h3>
              <div className="space-y-5">
                {[
                  { label: "🎓 학군 입지", score: apt.school_score, color: "bg-blue-600", textColor: "text-blue-600" },
                  { label: "🚇 교통/역세권", score: apt.traffic_score, color: "bg-indigo-500", textColor: "text-indigo-600" },
                  { label: "🌳 쾌적성/공원", score: apt.nature_score, color: "bg-emerald-500", textColor: "text-emerald-600" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm font-semibold mb-2">
                      <span className="text-slate-700">{item.label}</span>
                      <span className={item.textColor}>{item.score}점 / 100점</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all`}
                        style={{ width: `${item.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Overall score summary */}
              <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 text-center">
                <div className="text-xs text-slate-500 mb-1">종합 입지 점수</div>
                <div className="text-4xl font-black text-blue-600">
                  {Math.round((apt.school_score + apt.traffic_score + apt.nature_score) / 3)}
                </div>
                <div className="text-xs text-slate-400">/ 100점</div>
              </div>
            </div>

            {/* Transport & School */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900">🏫 교통 및 학교</h3>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">인접 지하철역</div>
                <div className="bg-slate-50 p-3 rounded-xl text-sm font-semibold text-slate-800 border border-slate-100">
                  🚇 {apt.station}
                </div>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">배정 및 인근 학교</div>
                <ul className="space-y-2">
                  {apt.schools?.map((s: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                      <span className="text-blue-500 shrink-0">🏫</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
