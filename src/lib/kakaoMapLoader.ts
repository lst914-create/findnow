declare global {
  interface Window {
    kakao: any;
  }
}

/**
 * Kakao Maps Web SDK 비동기 로더
 */
export function loadKakaoMap(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      return reject(new Error("Window is not defined"));
    }

    // 이미 kakao.maps가 완전히 로드된 경우
    if (window.kakao && window.kakao.maps && window.kakao.maps.Map) {
      return resolve(window.kakao.maps);
    }

    const appKey =
      process.env.NEXT_PUBLIC_KAKAO_JS_KEY ||
      process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ||
      "99678f56cdcf668879cad358db1939be";

    const scriptId = "kakao-maps-sdk";
    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => resolve(window.kakao.maps));
      } else {
        existingScript.addEventListener("load", () => {
          window.kakao.maps.load(() => resolve(window.kakao.maps));
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services,clusterer`;
    script.async = true;

    script.onload = () => {
      if (!window.kakao || !window.kakao.maps) {
        return reject(new Error("카카오 지도 SDK 로드 실패"));
      }
      window.kakao.maps.load(() => {
        resolve(window.kakao.maps);
      });
    };

    script.onerror = (err) => {
      reject(err);
    };

    document.head.appendChild(script);
  });
}
