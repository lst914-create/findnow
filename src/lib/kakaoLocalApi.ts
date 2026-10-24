/**
 * 카카오 로컬 REST API 연동 모듈 (지오코딩 & 키워드 좌표 조회)
 */

export interface KakaoCoordResult {
  lat: number;
  lng: number;
  addressName: string;
  roadAddressName?: string;
  placeName?: string;
}

/**
 * 아파트명 또는 주소를 입력받아 카카오 로컬 API로 정확한 위경도 좌표를 조회합니다.
 */
export async function fetchKakaoCoordinate(
  query: string,
  regionHint?: string
): Promise<KakaoCoordResult | null> {
  const apiKey =
    process.env.KAKAO_REST_API_KEY ||
    process.env.NEXT_PUBLIC_KAKAO_REST_KEY ||
    "4d7cd3190ca38a795008ebd7cc053820";

  if (!apiKey) {
    console.warn("[KakaoLocal] KAKAO_REST_API_KEY 미설정");
    return null;
  }

  const cleanQuery = query.trim();
  const searchQueries: string[] = [];

  // 검색 우선순위 쿼리 리스트 구성
  if (regionHint) {
    searchQueries.push(`${regionHint} ${cleanQuery}`);
  }
  searchQueries.push(cleanQuery);

  const headers = {
    Authorization: `KakaoAK ${apiKey}`,
  };

  for (const q of searchQueries) {
    // 1. 키워드 검색 (장소/단지명 매칭에 가장 정밀)
    try {
      const keywordUrl = `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(
        q
      )}&size=3`;
      const res = await fetch(keywordUrl, { headers });

      if (res.ok) {
        const data = await res.json();
        if (data.documents && data.documents.length > 0) {
          // 아파트/주거시설 우선 탐색
          const aptDoc =
            data.documents.find(
              (doc: any) =>
                doc.category_name?.includes("아파트") ||
                doc.category_name?.includes("주거시설") ||
                doc.place_name?.includes("아파트")
            ) || data.documents[0];

          return {
            lat: parseFloat(parseFloat(aptDoc.y).toFixed(6)),
            lng: parseFloat(parseFloat(aptDoc.x).toFixed(6)),
            addressName: aptDoc.address_name,
            roadAddressName: aptDoc.road_address_name,
            placeName: aptDoc.place_name,
          };
        }
      }
    } catch (e) {
      // 키워드 검색 실패 시 주소 검색 진행
    }

    // 2. 주소 검색 (지번/도로명 주소 매칭)
    try {
      const addrUrl = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(
        q
      )}`;
      const res = await fetch(addrUrl, { headers });

      if (res.ok) {
        const data = await res.json();
        if (data.documents && data.documents.length > 0) {
          const doc = data.documents[0];
          return {
            lat: parseFloat(parseFloat(doc.y).toFixed(6)),
            lng: parseFloat(parseFloat(doc.x).toFixed(6)),
            addressName: doc.address_name,
            roadAddressName: doc.road_address?.address_name,
          };
        }
      }
    } catch (e) {
      // 주소 검색 실패
    }
  }

  return null;
}
