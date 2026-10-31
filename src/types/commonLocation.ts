/**
 * 공통 위치 식별 체계 (Standard Location Model)
 *
 * 아파트(단지), 정비사업(구역), 상가(점포·상권)의 위치를 단일 표준으로
 * 식별하고 상호 연계(거리 계산, 구역 포함 여부, 행정구역 매핑)하기 위한 기반 모델입니다.
 */

export interface Coordinate {
  lat: number; // WGS84 위도
  lng: number; // WGS84 경도
}

/** 10자리 법정동코드 파싱 구조 */
export interface BjdCodeDetail {
  code: string;            // 10자리 법정동코드 (예: "1168010600" - 서울 강남구 대치동)
  sidoCode: string;        // 2자리 (11: 서울)
  sigunguCode: string;     // 3자리 (680: 강남구)
  eupmyeondongCode: string;// 3자리 (106: 대치동)
  riCode: string;          // 2자리 (00)
}

/** 표준 위치 식별 인터페이스 */
export interface StandardLocation {
  /** 10자리 법정동 코드 */
  bjdCode?: string;
  /** 10자리 행정동 코드 (선택) */
  hjdCode?: string;
  /** 시·도 (예: "서울특별시", "경기도") */
  sido: string;
  /** 시·군·구 (예: "강남구", "성남시 분당구") */
  sigungu: string;
  /** 읍·면·동 (예: "대치동", "백현동") */
  eupmyeondong: string;
  /** 리 (있는 경우) */
  ri?: string;
  /** 도로명 주소 */
  roadAddress?: string;
  /** 지번 주소 */
  jibunAddress?: string;
  /** WGS84 기준 좌표 */
  coordinate: Coordinate;
  /** Geohash (정밀도 6~7자리: 약 150m~1.2km 격자) */
  geohash?: string;
}

/** 경계 바운딩 박스: [minLng, minLat, maxLng, maxLat] */
export type BoundingBox = [number, number, number, number];

// ────────────────────────────────────────────────────────────────
// 공간 계산 유틸리티 (Haversine & Ray-Casting & Geohash)
// ────────────────────────────────────────────────────────────────

/** 두 좌표 간의 직선 거리(미터) 계산 (Haversine 공식) */
export function calculateDistanceMeters(p1: Coordinate, p2: Coordinate): number {
  const R = 6371000; // 지구 반지름 (m)
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1.lat * Math.PI) / 180) *
      Math.cos((p2.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * 점이 다각형(Polygon) 내부에 위치하는지 판정 (Ray-Casting Algorithm)
 * @param point 검사할 좌표 {lat, lng}
 * @param polygon 다각형 꼭짓점 배열 [{lat, lng}, ...]
 */
export function isPointInPolygon(point: Coordinate, polygon: Coordinate[]): boolean {
  if (!polygon || polygon.length < 3) return false;
  let inside = false;
  const x = point.lng;
  const y = point.lat;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** 다각형 꼭짓점들로부터 Bounding Box [minLng, minLat, maxLng, maxLat] 계산 */
export function computeBoundingBox(polygon: Coordinate[]): BoundingBox {
  if (!polygon || polygon.length === 0) return [0, 0, 0, 0];
  let minLng = Infinity;
  let minLat = Infinity;
  let maxLng = -Infinity;
  let maxLat = -Infinity;

  for (const pt of polygon) {
    if (pt.lng < minLng) minLng = pt.lng;
    if (pt.lat < minLat) minLat = pt.lat;
    if (pt.lng > maxLng) maxLng = pt.lng;
    if (pt.lat > maxLat) maxLat = pt.lat;
  }
  return [minLng, minLat, maxLng, maxLat];
}

/** 다각형의 대략적인 중심점(Centroid) 계산 */
export function computePolygonCenter(polygon: Coordinate[]): Coordinate {
  if (!polygon || polygon.length === 0) return { lat: 0, lng: 0 };
  let sumLat = 0;
  let sumLng = 0;
  for (const pt of polygon) {
    sumLat += pt.lat;
    sumLng += pt.lng;
  }
  return {
    lat: parseFloat((sumLat / polygon.length).toFixed(6)),
    lng: parseFloat((sumLng / polygon.length).toFixed(6)),
  };
}

/** 10자리 법정동 코드 분해 헬퍼 */
export function parseBjdCode(bjdCode: string): BjdCodeDetail | null {
  if (!bjdCode || bjdCode.length !== 10) return null;
  return {
    code: bjdCode,
    sidoCode: bjdCode.slice(0, 2),
    sigunguCode: bjdCode.slice(2, 5),
    eupmyeondongCode: bjdCode.slice(5, 8),
    riCode: bjdCode.slice(8, 10),
  };
}

/** 초간단 Geohash 인코더 (공간 인덱싱용, precision 6: 약 1.2km x 0.6km) */
const BASE32 = "0123456789bcdefghjkmnpqrstuvwxyz";
export function encodeGeohash(lat: number, lng: number, precision = 6): string {
  let latMin = -90;
  let latMax = 90;
  let lngMin = -180;
  let lngMax = 180;
  let geohash = "";
  let isEven = true;
  let bit = 0;
  let ch = 0;

  while (geohash.length < precision) {
    if (isEven) {
      const mid = (lngMin + lngMax) / 2;
      if (lng >= mid) {
        ch |= 1 << (4 - bit);
        lngMin = mid;
      } else {
        lngMax = mid;
      }
    } else {
      const mid = (latMin + latMax) / 2;
      if (lat >= mid) {
        ch |= 1 << (4 - bit);
        latMin = mid;
      } else {
        latMax = mid;
      }
    }
    isEven = !isEven;
    if (bit < 4) {
      bit++;
    } else {
      geohash += BASE32[ch];
      bit = 0;
      ch = 0;
    }
  }
  return geohash;
}
