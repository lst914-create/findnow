/**
 * 자연어 검색을 위한 지하철역 / 주요 거점 좌표 및 도보 거리 연산 모듈
 */

export interface GeoLocation {
  name: string;
  lat: number;
  lng: number;
}

// 수도권 주요 지하철역 및 랜드마크 고속 오프라인 캐시
export const KNOWN_STATIONS: Record<string, { lat: number; lng: number }> = {
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
 * 쿼리에서 지하철역/지역 거점을 찾아 좌표를 반환 (오프라인 캐시 우선 + 카카오 API 동적 검색)
 */
export async function resolveStationOrPlace(query: string): Promise<GeoLocation | null> {
  const clean = query.trim();

  // 1. 역 패턴 검출 (예: "도농역", "도농역 도보 10분", "잠실역")
  const stationMatch = clean.match(/([가-힣]{2,8}역)/);
  const targetStation = stationMatch ? stationMatch[1] : null;

  if (targetStation && KNOWN_STATIONS[targetStation]) {
    return {
      name: targetStation,
      ...KNOWN_STATIONS[targetStation],
    };
  }

  // 2. 단어 단위 오프라인 검출
  const words = clean.split(/\s+/);
  for (const w of words) {
    const stripped = w.replace(/(에서|으로|이랑|하고|근처|주변|인근)$/, "");
    if (KNOWN_STATIONS[stripped]) {
      return {
        name: stripped,
        ...KNOWN_STATIONS[stripped],
      };
    }
  }

  // 3. 카카오 Local API 동적 검색 (알려지지 않은 역/거점 실시간 해석)
  const apiKey =
    process.env.NEXT_PUBLIC_KAKAO_REST_KEY ||
    process.env.KAKAO_REST_API_KEY ||
    "4d7cd3190ca38a795008ebd7cc053820";

  if (targetStation && apiKey) {
    try {
      const res = await fetch(`https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(targetStation)}`, {
        headers: { Authorization: `KakaoAK ${apiKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.documents && data.documents.length > 0) {
          const doc = data.documents[0];
          const loc = {
            name: targetStation,
            lat: parseFloat(doc.y),
            lng: parseFloat(doc.x),
          };
          // 캐시에 저장하여 다음 검색 가속
          KNOWN_STATIONS[targetStation] = { lat: loc.lat, lng: loc.lng };
          return loc;
        }
      }
    } catch (e) {
      console.warn("Kakao Local Search failed:", e);
    }
  }

  return null;
}
