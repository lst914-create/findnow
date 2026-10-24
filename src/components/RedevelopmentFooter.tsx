"use client";

import { useState } from "react";

interface RedevelopmentFooterProps {
  className?: string;
}

export default function RedevelopmentFooter({ className = "" }: RedevelopmentFooterProps) {
  const [showApiModal, setShowApiModal] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);

  const handleAction = (type: "cs" | "feedback" | "ad" | "privacy" | "terms" | "zones" | "notice") => {
    switch (type) {
      case "cs":
        setModalContent("고객센터 문의는 support@chajwo.com 또는 카카오톡 채널 '@찾아줘'로 1:1 상담 가능합니다. (운영시간 평일 10:00 ~ 18:00)");
        break;
      case "feedback":
        setModalContent("찾아줘 재개발 서비스에 대한 귀중한 의견을 남겨주시면 서비스 개선에 적극 반영하겠습니다. 구역 오류 제보 및 신규 구역 등록 요청도 가능합니다.");
        break;
      case "ad":
        setModalContent("광고 및 정비사업 분양 제휴 문의는 ad@chajwo.com 으로 연락주시면 담당 매니저가 제안서를 송부해 드립니다.");
        break;
      case "privacy":
        setModalContent("개인정보처리방침: 찾아줘는 회원의 개인정보를 보호하며 관련 법령을 엄격히 준수합니다. 수집 항목은 로그인 식별자에 한하며 외부 제3자에게 제공되지 않습니다.");
        break;
      case "terms":
        setModalContent("서비스 이용약관: 본 서비스의 모든 콘텐츠는 공공데이터 및 공개 자료를 수집·가공한 것으로, 투자에 대한 최종 책임은 이용자 본인에게 있습니다.");
        break;
      case "zones":
        setModalContent("구역 목록: 좌측 구역 목록 패널 또는 지도 상의 마커를 클릭하여 서울, 경기, 인천, 부산 등 전국 주요 정비사업 구역의 실거래가와 추진 현황을 확인하실 수 있습니다.");
        break;
      case "notice":
        setModalContent("공지사항: 국토교통부 실거래가 공개시스템 및 건축HUB 건축물대장 3대 공공 API 실시간 다이렉트 연동이 활성화되었습니다.");
        break;
    }
  };

  return (
    <footer className={`bg-white border-t border-slate-200 p-5 sm:p-6 text-slate-600 text-xs ${className}`}>
      {/* 1. 서비스 브랜드 타이틀 */}
      <div className="mb-2">
        <h4 className="font-black text-slate-900 text-base sm:text-lg tracking-tight flex items-center gap-1.5 whitespace-nowrap">
          <span className="text-blue-600">🔨</span> 찾아줘 재개발
        </h4>
      </div>

      {/* 2. 링크 메뉴 바 (글자가 깨지거나 세로로 꺾이지 않도록 한 줄 가로 배치) */}
      <nav className="flex items-center gap-2 sm:gap-3 text-slate-500 font-medium text-[11px] sm:text-xs mb-4 pb-0.5 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          onClick={() => handleAction("privacy")}
          className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer shrink-0"
        >
          개인정보처리방침
        </button>
        <span className="text-slate-200 shrink-0">·</span>
        <button
          onClick={() => handleAction("terms")}
          className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer shrink-0"
        >
          서비스 이용약관
        </button>
        <span className="text-slate-200 shrink-0">·</span>
        <button
          onClick={() => handleAction("zones")}
          className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer shrink-0"
        >
          구역 목록
        </button>
        <span className="text-slate-200 shrink-0">·</span>
        <button
          onClick={() => handleAction("notice")}
          className="hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer shrink-0"
        >
          공지사항
        </button>
      </nav>

      {/* 3. 3대 액션 버튼 바 (재개발닷컴 원문 동일: 가로 3분할 꽉 찬 그리드) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4">
        <button
          onClick={() => handleAction("cs")}
          className="w-full py-2.5 px-1 bg-[#5b73f7] hover:bg-[#4b63e8] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all active:scale-95 text-center whitespace-nowrap cursor-pointer"
        >
          고객센터
        </button>
        <button
          onClick={() => handleAction("feedback")}
          className="w-full py-2.5 px-1 bg-[#5b73f7] hover:bg-[#4b63e8] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all active:scale-95 text-center whitespace-nowrap cursor-pointer"
        >
          의견 보내기
        </button>
        <button
          onClick={() => handleAction("ad")}
          className="w-full py-2.5 px-1 bg-[#787880] hover:bg-[#686870] text-white font-bold rounded-xl text-xs sm:text-sm shadow-xs transition-all active:scale-95 text-center whitespace-nowrap cursor-pointer"
        >
          광고 문의
        </button>
      </div>

      {/* 4. 구분선 */}
      <hr className="border-slate-100 my-3.5" />

      {/* 5. 사업자정보 & 데이터 출처 헤더 */}
      <div className="flex items-center gap-2.5 text-slate-500 font-semibold text-[11px] mb-2.5 whitespace-nowrap">
        <button
          onClick={() => setModalContent("사업자 등록번호: 120-88-12345 | 대표: 찾아줘랩스 | 통신판매업신고: 제2024-서울-0001호 | 주소: 서울특별시 강남구 테헤란로 152")}
          className="hover:text-slate-800 transition-colors cursor-pointer whitespace-nowrap"
        >
          사업자정보
        </button>
        <span className="text-slate-300">|</span>
        <button
          onClick={() => setShowApiModal(true)}
          className="font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
          데이터 출처 (공공 API 연동 현황 ↗)
        </button>
      </div>

      {/* 6. 핵심 3대 데이터 출처 박스 (재개발닷컴 원문 동일) */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[11px] text-slate-600 mb-3 space-y-1.5 leading-relaxed">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span>
            <strong className="text-slate-800 font-bold">실거래가 정보:</strong> 국토교통부 실거래가 공개시스템
          </span>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <span>
            <strong className="text-slate-800 font-bold">구역별 진행 정보:</strong> 각 지자체 홈페이지 및 정비사업 정보몽땅
          </span>
          <span className="text-slate-300 hidden sm:inline">·</span>
          <span>
            <strong className="text-slate-800 font-bold">건물 정보:</strong> 국토교통부 건축물대장
          </span>
        </div>
      </div>

      {/* 7. 법적 고지 및 면책 조항 */}
      <p className="text-[11px] text-slate-400 leading-relaxed">
        찾아줘의 정보는 공공데이터와 공개 자료를 바탕으로 한 참고용 정보이며 법적 효력이 없습니다.
        정확한 내용은 관할 기관에서 확인하시기 바랍니다. 투자 판단과 그 결과에 대한 책임은 이용자 본인에게 있습니다.
      </p>

      {/* 액션 안내 모달 */}
      {modalContent && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h4 className="font-bold text-slate-900 text-sm mb-2 flex items-center gap-2">
              <span>ℹ️</span> 안내
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line mb-4">
              {modalContent}
            </p>
            <div className="text-right">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 데이터 출처 상세 & 전국 공공데이터 연동 상태 모달 */}
      {showApiModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌐</span>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">
                    공공데이터 API 출처 및 연동 규격
                  </h3>
                  <p className="text-slate-400 text-xs">
                    재개발닷컴과 동일한 3대 정부 공공 API 전국 연동 체계
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowApiModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* 1. 실거래가 정보 */}
              <div className="p-3.5 bg-blue-50/60 rounded-2xl border border-blue-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                    <span>1️⃣</span> 실거래가 정보
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    실시간 연동 완료
                  </span>
                </div>
                <div className="text-slate-700 space-y-1 text-[11px] leading-relaxed">
                  <p>• <strong>출처:</strong> 국토교통부 실거래가 공개시스템 (공공데이터포털 data.go.kr)</p>
                  <p>• <strong>API:</strong> 연립다세대 매매 실거래자료 (RTMSDataSvcRHTrade)</p>
                  <p>• <strong>API:</strong> 단독/다가구 매매 실거래자료 (RTMSDataSvcSHTrade)</p>
                  <p>• <strong>API:</strong> 아파트 매매 실거래자료 (RTMSDataSvcAptTrade)</p>
                  <p>• <strong>범위:</strong> 전국 250개 시군구 구역 내 지번 단위 매매 실거래 내역 실시간 연동</p>
                </div>
              </div>

              {/* 2. 구역별 진행 정보 */}
              <div className="p-3.5 bg-indigo-50/60 rounded-2xl border border-indigo-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                    <span>2️⃣</span> 구역별 진행 정보 (인허가/추진현황)
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    전국 표준 연동
                  </span>
                </div>
                <div className="text-slate-700 space-y-1 text-[11px] leading-relaxed">
                  <p>• <strong>출처:</strong> 각 지자체 고시·공고 및 서울시 정비사업 정보몽땅(cleanup.seoul.go.kr)</p>
                  <p>• <strong>API:</strong> 전국재개발재건축정비사업표준데이터 (행정안전부/국토교통부)</p>
                  <p>• <strong>API:</strong> 서울 열린데이터광장 HsmpInfo (정비사업 구역정보)</p>
                  <p>• <strong>내용:</strong> 정비구역지정, 조합설립, 사업시행인가, 관리처분인가 등 11단계 인허가 현황</p>
                </div>
              </div>

              {/* 3. 건물 정보 */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <span>3️⃣</span> 건물 정보 및 노후도
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    건축HUB 실시간 연동
                  </span>
                </div>
                <div className="text-slate-700 space-y-1 text-[11px] leading-relaxed">
                  <p>• <strong>출처:</strong> 국토교통부 건축HUB 건축물대장 정보 서비스</p>
                  <p>• <strong>API:</strong> 표제부 조회 (BldRgstHubService / getBrTitleInfo)</p>
                  <p>• <strong>내용:</strong> 사용승인일자(준공연도), 구조, 연면적, 층수, 건폐율, 용적률 실시간 조회</p>
                </div>
              </div>

              {/* API 연동 성공 안내 */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
                <p className="font-bold flex items-center gap-1 mb-1">
                  <span>✅</span> 국토교통부 3대 공공 API 실시간 다이렉트 연동 활성화
                </p>
                <p className="text-emerald-700 leading-relaxed">
                  공공데이터포털(data.go.kr) 인증키를 통해 전국 250개 시군구의 <strong>연립·다세대, 단독·다가구, 아파트 매매 실거래가</strong>와 <strong>건축HUB 건축물대장</strong>이 실시간으로 호출 및 반영되고 있습니다.
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowApiModal(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                확인 완료
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
