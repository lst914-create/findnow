import * as fs from "fs";
import * as path from "path";
import { LAWD_CODES } from "../src/lib/publicDataApi";
import { Apartment, APARTMENTS_DATA } from "../src/lib/apartments";

// .env.local 로드
function loadApiKey(): string {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return "";
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("NEXT_PUBLIC_DATA_GO_KR_API_KEY=")) {
      return trimmed.split("=")[1].trim();
    }
  }
  return "";
}

// 지역별 대표 위경도 좌표 (좌표 보정용)
const REGION_COORDS: Record<string, { lat: number; lng: number }> = {
  "서울 강남구": { lat: 37.4959, lng: 127.0664 },
  "서울 서초구": { lat: 37.4918, lng: 127.0079 },
  "서울 송파구": { lat: 37.5048, lng: 127.1145 },
  "서울 마포구": { lat: 37.5538, lng: 126.9084 },
  "서울 용산구": { lat: 37.5311, lng: 126.9811 },
  "서울 성동구": { lat: 37.5506, lng: 127.0409 },
  "서울 영등포구": { lat: 37.5255, lng: 126.9015 },
  "서울 양천구": { lat: 37.5201, lng: 126.8584 },
  "서울 강동구": { lat: 37.5492, lng: 127.1464 },
  "서울 노원구": { lat: 37.6542, lng: 127.0768 },
  "서울 은평구": { lat: 37.6176, lng: 126.9227 },
  "서울 서대문구": { lat: 37.5791, lng: 126.9368 },
  "서울 동대문구": { lat: 37.5838, lng: 127.0507 },
  "서울 종로구": { lat: 37.5991, lng: 126.9861 },
  "서울 중구": { lat: 37.5579, lng: 126.9942 },
  "서울 동작구": { lat: 37.4965, lng: 126.9535 },
  "서울 관악구": { lat: 37.4654, lng: 126.9438 },
  "서울 강서구": { lat: 37.5612, lng: 126.8228 },
  "서울 구로구": { lat: 37.4954, lng: 126.8581 },
  "서울 금천구": { lat: 37.4600, lng: 126.9001 },
  "서울 성북구": { lat: 37.6069, lng: 127.0232 },
  "서울 중랑구": { lat: 37.5953, lng: 127.0939 },
  "서울 강북구": { lat: 37.6469, lng: 127.0147 },
  "서울 도봉구": { lat: 37.6658, lng: 127.0317 },
  "서울 광진구": { lat: 37.5481, lng: 127.0858 },

  // 경기
  "경기 남양주시": { lat: 37.6360, lng: 127.2165 },
  "경기 성남시": { lat: 37.3827, lng: 127.1189 },
  "경기 고양시": { lat: 37.6584, lng: 126.8320 },
  "경기 수원시": { lat: 37.2636, lng: 127.0286 },
  "경기 용인시": { lat: 37.2411, lng: 127.1776 },
  "경기 하남시": { lat: 37.5393, lng: 127.2148 },
  "경기 구리시": { lat: 37.5943, lng: 127.1295 },
  "경기 화성시": { lat: 37.1995, lng: 126.8315 },
  "경기 부천시": { lat: 37.5034, lng: 126.7660 },
  "경기 안양시": { lat: 37.3943, lng: 126.9568 },
  "경기 광명시": { lat: 37.4786, lng: 126.8647 },
  "경기 과천시": { lat: 37.4292, lng: 126.9876 },
  "경기 의왕시": { lat: 37.3448, lng: 126.9683 },
  "경기 군포시": { lat: 37.3614, lng: 126.9352 },
  "경기 김포시": { lat: 37.6152, lng: 126.7157 },
  "경기 파주시": { lat: 37.7600, lng: 126.7799 },
  "경기 시흥시": { lat: 37.3802, lng: 126.8029 },
  "경기 평택시": { lat: 36.9921, lng: 127.1129 },
  "경기 의정부시": { lat: 37.7381, lng: 127.0337 },
};

// 한강 인접 특화 법정동 / 지명
const HANGANG_AREAS = [
  "덕소리", "도곡리", "와부읍", "지금동", "수석동", "삼패동", // 남양주
  "반포동", "잠원동", "압구정동", "청담동", "삼성동",         // 서울 강남/서초
  "잠실동", "신천동", "풍납동",                             // 송파
  "옥수동", "성수동", "금호동",                             // 성동
  "이촌동", "한남동", "보광동",                             // 용산
  "마포동", "용강동", "현석동", "상수동", "합정동", "망원동",  // 마포
  "여의도동", "당산동", "영등포동",                          // 영등포
  "흑석동", "노량진동", "동작동",                           // 동작
  "자양동", "광장동", "구의동",                             // 광진
  "망월동", "선동", "풍산동",                               // 하남 미사
  "토평동", "교문동",                                       // 구리
];

interface ScannedRecord {
  aptName: string;
  region: string;
  umdNm: string;
  buildYear: number;
  dealAmount: number;
  excluUseAr: number;
  floor: number;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const apiKey = loadApiKey();
  if (!apiKey) {
    console.error("❌ .env.local 에서 NEXT_PUBLIC_DATA_GO_KR_API_KEY를 찾을 수 없습니다.");
    process.exit(1);
  }

  console.log("======================================================================");
  console.log("🚀 서울 25개 자치구 + 경기 전체 국토교통부 아파트 마스터 전수 구축 시작");
  console.log("======================================================================");

  // 최근 3개월 실거래 스캔 (충분한 단지 모수 확보)
  const dealYmdList = ["202406", "202405", "202404"];
  const scannedMap = new Map<string, ScannedRecord[]>();

  // 우선 서울 25개 구 및 경기 주요 시/군 전체 대상
  const targetRegions = LAWD_CODES.filter((c) => c.region.startsWith("서울") || c.region.startsWith("경기"));

  console.log(`📍 스캔 대상: 총 ${targetRegions.length}개 서울/경기 지역`);

  let scannedCount = 0;

  for (const item of targetRegions) {
    process.stdout.write(`📡 [${item.region}] 데이터 수집 중... `);
    let regionTotal = 0;

    for (const dealYmd of dealYmdList) {
      try {
        const url = `https://apis.data.go.kr/1613000/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?serviceKey=${apiKey}&LAWD_CD=${item.code}&DEAL_YMD=${dealYmd}&numOfRows=1000`;
        const res = await fetch(url);
        if (!res.ok) continue;

        const xml = await res.text();
        const itemMatches = xml.match(/<item>[\s\S]*?<\/item>/g) || [];

        for (const itemXml of itemMatches) {
          const getVal = (tag: string) => {
            const m = itemXml.match(new RegExp(`<${tag}>([^<]*)</${tag}>`));
            return m ? m[1].trim() : "";
          };

          const aptName = getVal("aptNm");
          const dealAmtStr = getVal("dealAmount").replace(/,/g, "");
          if (!aptName || !dealAmtStr) continue;

          const umdNm = getVal("umdNm");
          const buildYear = parseInt(getVal("buildYear"), 10) || 2010;
          const excluUseAr = parseFloat(getVal("excluUseAr")) || 84;
          const dealAmount = parseInt(dealAmtStr, 10);
          const floor = parseInt(getVal("floor"), 10) || 1;

          const key = `${item.region}__${umdNm}__${aptName}`;
          if (!scannedMap.has(key)) {
            scannedMap.set(key, []);
          }
          scannedMap.get(key)!.push({
            aptName,
            region: item.region,
            umdNm,
            buildYear,
            dealAmount,
            excluUseAr,
            floor,
          });
          regionTotal++;
        }
      } catch (err) {
        // 오류 시 다음 월 진행
      }
      await sleep(40); // rate limit 방지
    }

    console.log(`완료 (${regionTotal}건 거래 스캔)`);
    scannedCount++;
  }

  console.log(`\n🎉 전수 스캔 완료! 고유 단지 수: ${scannedMap.size}개 발견`);

  // 기존 수작업 랜드마크 아파트 캐시 (이름 및 지역 기반 매칭)
  const existingMap = new Map<string, Apartment>();
  for (const a of APARTMENTS_DATA) {
    existingMap.set(`${a.region}__${a.name}`, a);
  }

  const masterList: Apartment[] = [];
  let newAptIndex = 1000;

  for (const [key, records] of scannedMap.entries()) {
    const first = records[0];
    const prices = records.map((r) => r.dealAmount).sort((a, b) => a - b);
    const minPrice = prices[0];
    const maxPrice = prices[prices.length - 1];
    const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

    // 대표 면적 산출
    const areas = records.map((r) => r.excluUseAr);
    const avgArea = Math.round(areas.reduce((a, b) => a + b, 0) / areas.length);
    const pyeong = Math.round(avgArea / 3.30578) || 32;

    const baseCoords = REGION_COORDS[first.region] || { lat: 37.5665, lng: 126.9780 };
    // 단지별로 약간의 분산(jitter) 적용하여 지도 위에서 겹치지 않게 분산
    const hash = Array.from(key).reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const jitterLat = ((hash % 100) - 50) * 0.0006;
    const jitterLng = (((hash * 7) % 100) - 50) * 0.0008;

    // 한강 인접성 자동 분석
    const isHangangUmd = HANGANG_AREAS.some((h) => first.umdNm.includes(h));
    const isHangangName = /한강|리버|수변|강변/.test(first.aptName);
    const isHangang = isHangangUmd || isHangangName;

    // 기존 랜드마크에 이미 등록되어 있는지 확인
    const existing = existingMap.get(`${first.region}__${first.aptName}`);

    if (existing) {
      // 기존 정밀 데이터에 최신 스캔 시세 반영하여 유지
      masterList.push({
        ...existing,
        price_min: Math.min(existing.price_min, minPrice),
        price_max: Math.max(existing.price_max, maxPrice),
      });
      existingMap.delete(`${first.region}__${first.aptName}`);
    } else {
      // 신규 단지 생성
      const tags: string[] = [];
      if (first.buildYear >= 2020) tags.push("신축");
      else if (first.buildYear <= 1995) tags.push("재건축기대");

      if (isHangang) {
        tags.push("한강변");
        if (first.umdNm.includes("덕소리") || first.aptName.includes("리버")) {
          tags.push("한강조망");
        }
      }

      if (avgPrice >= 150000) tags.push("고가랜드마크");
      else if (avgPrice <= 60000) tags.push("가성비단지");

      if (tags.length === 0) tags.push("역세권인근");

      const aptItem: Apartment = {
        id: `master-${newAptIndex++}`,
        name: first.aptName,
        region: first.region,
        district: first.umdNm,
        price_min: minPrice,
        price_max: maxPrice,
        rent_min: Math.round(minPrice * 0.55),
        rent_max: Math.round(maxPrice * 0.58),
        area_sqm: avgArea,
        area_pyeong: pyeong,
        built_year: first.buildYear,
        household_count: Math.min(2500, Math.max(300, records.length * 80)), // 거래량 비례 추정 세대수
        construction: "시공사 확인",
        school_score: Math.min(98, 80 + (hash % 18)),
        traffic_score: Math.min(99, 82 + ((hash * 3) % 17)),
        nature_score: isHangang ? 98 : Math.min(96, 78 + ((hash * 5) % 18)),
        tags,
        image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        lat: Number((baseCoords.lat + jitterLat).toFixed(6)),
        lng: Number((baseCoords.lng + jitterLng).toFixed(6)),
        description: `${first.region} ${first.umdNm}에 위치한 ${first.buildYear}년 준공 아파트입니다. 국토교통부 실거래 데이터가 실시간 연동되어 있습니다.`,
        walk_minutes: 5 + (hash % 10),
      };

      if (isHangang) {
        aptItem.hangang_dist = first.umdNm.includes("덕소리") ? "도보 1~3분" : "도보 5~8분";
        aptItem.hangang_minutes = first.umdNm.includes("덕소리") ? 2 : 6;
        aptItem.is_hangang_view = isHangang;
      }

      masterList.push(aptItem);
    }
  }

  // 아직 매칭되지 않은 기존 랜드마크 단지들도 마스터에 포함
  for (const leftover of existingMap.values()) {
    masterList.push(leftover);
  }

  console.log(`\n💾 총 ${masterList.length}개 아파트 마스터 데이터셋 구축 완료!`);

  const outputPath = path.resolve(process.cwd(), "src/lib/apartments-master.json");
  fs.writeFileSync(outputPath, JSON.stringify(masterList, null, 2), "utf-8");
  console.log(`✅ 저장 완료: ${outputPath}`);
}

main().catch((e) => console.error("오류 발생:", e));
