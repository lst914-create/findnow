import { ImageResponse } from "next/og";

export const alt = "찾아줘 — 전국 아파트 실거래가·재개발·분양청약 올인원 플랫폼";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #312e81 100%)",
          fontFamily: "sans-serif",
          color: "white",
        }}
      >
        {/* 상단 헤더: 브랜드 로고 및 뱃지 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.5)",
              }}
            >
              <span style={{ fontSize: "32px", fontWeight: "900", color: "#ffffff" }}>F</span>
            </div>
            <span style={{ fontSize: "36px", fontWeight: "800", letterSpacing: "-0.5px" }}>찾아줘</span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 22px",
              borderRadius: "9999px",
              background: "rgba(255, 255, 255, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              fontSize: "18px",
              fontWeight: "600",
              color: "#a5b4fc",
            }}
          >
            <span>🚀 2026 부동산 올인원 플랫폼</span>
          </div>
        </div>

        {/* 중앙 카피라이트 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: "56px",
              fontWeight: "900",
              lineHeight: "1.25",
              letterSpacing: "-1px",
              textShadow: "0 4px 20px rgba(0,0,0,0.5)",
            }}
          >
            내가 찾는 부동산 정보,
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #818cf8 0%, #c084fc 50%, #f472b6 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              한 눈에 직관적으로 비교해줘
            </span>
          </div>
          <div style={{ fontSize: "24px", color: "#cbd5e1", fontWeight: "500", maxWidth: "900px" }}>
            전국 22,000+ 아파트 실거래가·호가부터 전국 재개발 구역 지도, 분양 청약 일정까지
          </div>
        </div>

        {/* 하단 특장점 카드 3종 */}
        <div style={{ display: "flex", gap: "20px" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "18px 24px",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <span style={{ fontSize: "28px" }}>🏢</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff" }}>전국 실거래가 시세</span>
              <span style={{ fontSize: "14px", color: "#94a3b8" }}>국토부 공공데이터 실시간 연동</span>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "18px 24px",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <span style={{ fontSize: "28px" }}>🔨</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff" }}>전국 재개발 지도</span>
              <span style={{ fontSize: "14px", color: "#94a3b8" }}>단계별 구역 분석 & 투자 계산기</span>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              gap: "14px",
              padding: "18px 24px",
              borderRadius: "16px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
          >
            <span style={{ fontSize: "28px" }}>📅</span>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "18px", fontWeight: "700", color: "#ffffff" }}>분양·청약 캘린더</span>
              <span style={{ fontSize: "14px", color: "#94a3b8" }}>청약홈 실시간 공고 & 상세 정보</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
