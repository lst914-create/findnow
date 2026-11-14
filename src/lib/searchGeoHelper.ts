/**
 * 자연어 검색을 위한 지하철역 / 주요 거점 / 학교 / 랜드마크 좌표 및 도보 거리 연산 모듈
 */

export interface GeoLocation {
  name: string;
  lat: number;
  lng: number;
  address?: string;
}

// 수도권 주요 지하철역, 명문 학군(고교/중교) 및 랜드마크 고속 오프라인 캐시
export const KNOWN_STATIONS: Record<string, { lat: number; lng: number }> = {
  // 🏫 주요 학교 및 학군 거점
  동화고등학교: { lat: 37.60768, lng: 127.16300 },
  동화고: { lat: 37.60768, lng: 127.16300 },
  동화중학교: { lat: 37.60678, lng: 127.16380 },
  동화중: { lat: 37.60678, lng: 127.16380 },
  도농고등학교: { lat: 37.61142, lng: 127.16854 },
  도농고: { lat: 37.61142, lng: 127.16854 },
  다산고등학교: { lat: 37.62845, lng: 127.15621 },
  다산고: { lat: 37.62845, lng: 127.15621 },
  가운고등학교: { lat: 37.60214, lng: 127.15842 },
  가운고: { lat: 37.60214, lng: 127.15842 },
  와부고등학교: { lat: 37.58941, lng: 127.21451 },
  와부고: { lat: 37.58941, lng: 127.21451 },
  구리고등학교: { lat: 37.59641, lng: 127.13541 },
  구리고: { lat: 37.59641, lng: 127.13541 },
  서울대학교: { lat: 37.45988, lng: 126.95191 },
  서울대: { lat: 37.45988, lng: 126.95191 },
  연세대학교: { lat: 37.56578, lng: 126.93857 },
  연세대: { lat: 37.56578, lng: 126.93857 },
  고려대학교: { lat: 37.58939, lng: 127.03228 },
  고려대: { lat: 37.58939, lng: 127.03228 },
  휘문고등학교: { lat: 37.50541, lng: 127.06174 },
  휘문고: { lat: 37.50541, lng: 127.06174 },
  단대부고: { lat: 37.49481, lng: 127.05841 },
  중동고: { lat: 37.48741, lng: 127.07841 },
  경기고: { lat: 37.51841, lng: 127.05412 },

  // 경의중앙선 / 경춘선 / 8호선 (남양주·구리)
  도농역: { lat: 37.6087726, lng: 127.1611786 },
  도농: { lat: 37.6087726, lng: 127.1611786 },
  구리역: { lat: 37.603378, lng: 127.139648 },
  구리: { lat: 37.603378, lng: 127.139648 },
  다산역: { lat: 37.625345, lng: 127.151978 },
  다산: { lat: 37.625345, lng: 127.151978 },
  별내역: { lat: 37.643789, lng: 127.126842 },
  별내: { lat: 37.643789, lng: 127.126842 },
  별내별가람역: { lat: 37.668541, lng: 127.118745 },
  덕소역: { lat: 37.586612, lng: 127.208453 },
  덕소: { lat: 37.586612, lng: 127.208453 },
  양정역: { lat: 37.604472, lng: 127.186641 },
  평내호평역: { lat: 37.653421, lng: 127.244312 },
  마석역: { lat: 37.652871, lng: 127.311745 },
  진접역: { lat: 37.718412, lng: 127.186712 },
  오남역: { lat: 37.698412, lng: 127.198412 },

  // 서울 주요 환승역 및 랜드마크
  강남역: { lat: 37.497952, lng: 127.027619 },
  강남: { lat: 37.497952, lng: 127.027619 },
  잠실역: { lat: 37.5132612, lng: 127.1001336 },
  잠실: { lat: 37.5132612, lng: 127.1001336 },
  삼성역: { lat: 37.508844, lng: 127.06316 },
  선릉역: { lat: 37.504285, lng: 127.048203 },
  역삼역: { lat: 37.500622, lng: 127.036453 },
  교대역: { lat: 37.493414, lng: 127.01408 },
  서초역: { lat: 37.491896, lng: 127.007917 },
  고속터미널역: { lat: 37.504815, lng: 127.004944 },
  반포역: { lat: 37.508215, lng: 127.011745 },
  신반포역: { lat: 37.503412, lng: 126.995945 },
  양재역: { lat: 37.484147, lng: 127.034631 },
  대치역: { lat: 37.494612, lng: 127.063642 },
  도곡역: { lat: 37.490845, lng: 127.055312 },
  학여울역: { lat: 37.496745, lng: 127.070845 },
  일원역: { lat: 37.483745, lng: 127.084312 },
  수서역: { lat: 37.487412, lng: 127.101745 },
  송파역: { lat: 37.499645, lng: 127.112145 },
  가락시장역: { lat: 37.492541, lng: 127.118245 },
  문정역: { lat: 37.485845, lng: 127.122541 },
  장지역: { lat: 37.478412, lng: 127.126541 },
  올림픽공원역: { lat: 37.516142, lng: 127.130845 },
  천호역: { lat: 37.538645, lng: 127.123541 },
  강동역: { lat: 37.535845, lng: 127.132145 },
  길동역: { lat: 37.537845, lng: 127.140145 },
  명일역: { lat: 37.551245, lng: 127.144145 },
  고덕역: { lat: 37.555045, lng: 127.154145 },
  상일동역: { lat: 37.556645, lng: 127.166145 },

  // 마포 / 여의도 / 용산
  여의도역: { lat: 37.521569, lng: 126.924311 },
  여의도: { lat: 37.521569, lng: 126.924311 },
  마포역: { lat: 37.539612, lng: 126.945845 },
  공덕역: { lat: 37.543412, lng: 126.951541 },
  애오개역: { lat: 37.553745, lng: 126.956741 },
  용산역: { lat: 37.529883, lng: 126.964801 },
  신용산역: { lat: 37.529145, lng: 126.967845 },
  이촌역: { lat: 37.522245, lng: 126.973412 },
  옥수역: { lat: 37.541412, lng: 127.017745 },
  금호역: { lat: 37.548412, lng: 127.015745 },
  왕십리역: { lat: 37.561245, lng: 127.037145 },
  성수역: { lat: 37.544541, lng: 127.055941 },
  서울숲역: { lat: 37.543845, lng: 127.044541 },

  // 판교 / 분당 / 광교 / 하남
  판교역: { lat: 37.394776, lng: 127.111165 },
  판교: { lat: 37.394776, lng: 127.111165 },
  정자역: { lat: 37.366845, lng: 127.108412 },
  미금역: { lat: 37.350145, lng: 127.108845 },
  서현역: { lat: 37.385045, lng: 127.123412 },
  수내역: { lat: 37.378412, lng: 127.114145 },
  야탑역: { lat: 37.411245, lng: 127.128745 },
  이매역: { lat: 37.395845, lng: 127.128145 },
  모란역: { lat: 37.432145, lng: 127.129412 },
  광교역: { lat: 37.300645, lng: 127.048745 },
  광교중앙역: { lat: 37.288645, lng: 127.051412 },
  미사역: { lat: 37.562745, lng: 127.192745 },
  하남풍산역: { lat: 37.547845, lng: 127.206412 },
  하남검단산역: { lat: 37.539845, lng: 127.223412 },
};

export function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // 지구 반지름 (미터)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * 사용자 입력 쿼리에서 핵심 장소/시설/거점 후보 키워드를 다각도로 추출
 * 예: "동화고에서 가까운 아파트" -> ["동화고등학교", "동화고"]
 * 예: "판교 현대백화점 근처" -> ["판교 현대백화점", "현대백화점 판교점"]
 */
export function extractPlaceCandidates(query: string): string[] {
  const clean = query.trim();
  const candidates: string[] = [];

  // 1. 역 패턴 ("도농역", "잠실역")
  const stationMatch = clean.match(/([가-힣]{2,8}역)/);
  if (stationMatch) {
    candidates.push(stationMatch[1]);
  }

  // 2. 불용어 및 서술어 정제
  const stripped = clean
    .replace(/(?:투자비|투자금|분양가|매매가|전세가|매매|전세|월세)/g, " ")
    .replace(/(\d+(?:\.\d+)?)\s*억\s*(?:(\d+)\s*천)?/g, " ")
    .replace(/(?:\d+)\s*평(?:대)?/g, " ")
    .replace(/(?:도보\s*)?\d+\s*분(?:\s*거리|\s*이내|\s*안|\s*소요)?/g, " ")
    .replace(/(아파트|단지|오피스텔|빌라|재개발|청약|분양)/g, " ")
    .replace(/(가장|가까운|인근|근처|주변|부근|도보|앞|옆|위|밑)/g, " ")
    .replace(/(추천해줘|추천|찾아줘|있는|곳들|곳|어디|정보|시세|살기|좋은|원해)/g, " ")
    .replace(/(에서가장|에서|으로|이랑|하고|에게|부터|까지|에는|에|이|가|은|는|을|를|의|로|인)/g, " ")
    .trim();

  const words = stripped.split(/\s+/).filter((w) => w.length >= 2);

  for (const w of words) {
    // 기본 단어
    candidates.push(w);

    // 학교 축약어 확장
    if (/^[가-힣]{2,6}고$/.test(w)) {
      candidates.unshift(`${w}등학교`);
    } else if (/^[가-힣]{2,6}중$/.test(w)) {
      candidates.unshift(`${w}학교`);
    } else if (/^[가-힣]{2,6}초$/.test(w)) {
      candidates.unshift(`${w}등학교`);
    } else if (/^[가-힣]{2,6}대$/.test(w)) {
      candidates.unshift(`${w}학교`);
    }

    // 역 축약어 확장
    if (!w.endsWith("역") && w.length >= 2 && w.length <= 5) {
      candidates.push(`${w}역`);
    }
  }

  // 중복 제거 및 유효 키워드 순서 보존
  return Array.from(new Set(candidates.filter((c) => c && c.length >= 2)));
}

/**
 * 쿼리에서 지하철역/학교/랜드마크 거점을 찾아 좌표를 반환 (오프라인 캐시 우선 + API 동적 검색)
 */
export async function resolveStationOrPlace(query: string): Promise<GeoLocation | null> {
  const clean = query.trim();
  if (!clean) return null;

  const candidates = extractPlaceCandidates(clean);

  // 1. 고속 오프라인 캐시 확인
  for (const cand of candidates) {
    if (KNOWN_STATIONS[cand]) {
      return {
        name: cand,
        ...KNOWN_STATIONS[cand],
      };
    }
  }

  // 쿼리 자체도 캐시에 있는지 확인
  if (KNOWN_STATIONS[clean]) {
    return {
      name: clean,
      ...KNOWN_STATIONS[clean],
    };
  }

  // 2. 동적 API 해석 (브라우저: /api/geo/resolve 호출, 서버: 카카오 직접 호출)
  const isBrowser = typeof window !== "undefined";

  for (const cand of candidates.slice(0, 4)) {
    try {
      if (isBrowser) {
        // 브라우저에서는 Next.js API route 프록시 호출
        const res = await fetch(`/api/geo/resolve?query=${encodeURIComponent(cand)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.lat && data.lng) {
            const loc: GeoLocation = {
              name: data.name || cand,
              lat: data.lat,
              lng: data.lng,
              address: data.address,
            };
            KNOWN_STATIONS[cand] = { lat: loc.lat, lng: loc.lng };
            return loc;
          }
        }
      } else {
        // 서버 환경에서는 카카오 Local REST API 직접 호출
        const apiKey =
          process.env.KAKAO_REST_API_KEY ||
          process.env.NEXT_PUBLIC_KAKAO_REST_KEY ||
          "4d7cd3190ca38a795008ebd7cc053820";

        const url = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(cand)}&size=1`;
        const res = await fetch(url, {
          headers: { Authorization: `KakaoAK ${apiKey}` },
          next: { revalidate: 86400 },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.documents && data.documents.length > 0) {
            const top = data.documents[0];
            const loc: GeoLocation = {
              name: top.place_name || cand,
              lat: parseFloat(top.y),
              lng: parseFloat(top.x),
              address: top.road_address_name || top.address_name,
            };
            KNOWN_STATIONS[cand] = { lat: loc.lat, lng: loc.lng };
            return loc;
          }
        }
      }
    } catch (e) {
      console.warn(`[resolveStationOrPlace] Failed for candidate '${cand}':`, e);
    }
  }

  return null;
}
