/**
 * 첨부 이미지를 브라우저에서 고화질 경량 WebP 형식으로 자동 압축 및 변환하는 유틸리티
 * 
 * - 대용량 원본 파일(PNG, JPG, HEIC 등)을 최대 1280px 해상도로 스마트 리사이징
 * - HTML5 Canvas를 활용하여 고화질 82% WebP로 변환해 전송/저장 용량을 80~95% 절감
 */

export async function convertImageToWebP(
  file: File,
  maxWidth = 1280,
  maxHeight = 1280,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    // 이미지 파일 형식 검증
    if (!file.type.startsWith("image/")) {
      reject(new Error("이미지 파일만 업로드할 수 있습니다."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // 종횡비 유지하며 최대 규격 내 리사이징
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("캔버스 컨텍스트를 생성할 수 없습니다."));
          return;
        }

        // 이미지 부드럽게 렌더링
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // WebP 포맷으로 변환 (브라우저가 지원하지 않을 경우 자동 JPEG fallback)
        try {
          const webpDataUrl = canvas.toDataURL("image/webp", quality);
          resolve(webpDataUrl);
        } catch {
          const fallbackDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(fallbackDataUrl);
        }
      };

      img.onerror = () => {
        reject(new Error("이미지를 읽는 중 오류가 발생했습니다."));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error("파일을 읽는 데 실패했습니다."));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Data URL의 바이트 용량을 계산하여 사람이 읽기 쉬운 문자열로 반환
 */
export function formatDataUrlSize(dataUrl: string): string {
  const head = dataUrl.indexOf(",") + 1;
  const base64Len = dataUrl.length - head;
  const bytes = Math.round((base64Len * 3) / 4);
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
