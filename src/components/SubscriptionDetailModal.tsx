"use client";

import { useEffect, useState } from "react";
import {
  SubscriptionNotice,
  SubscriptionModel,
  formatSubscriptionPrice,
} from "@/lib/applyhome";

interface SubscriptionDetailModalProps {
  notice: SubscriptionNotice | null;
  onClose: () => void;
}

export default function SubscriptionDetailModal({
  notice,
  onClose,
}: SubscriptionDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<SubscriptionModel[]>([]);

  useEffect(() => {
    if (!notice) return;

    let isMounted = true;
    setLoading(true);

    fetch(`/api/subscriptions/${notice.id}?type=${notice.type}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.data?.models) {
          setModels(data.data.models);
        }
      })
      .catch((err) => {
        console.error("Failed to load models:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [notice]);

  if (!notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease]">
      {/* 바깥 클릭 닫기 배경 */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* 모달 본문 */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-slate-100">
        {/* 모달 헤더 */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex items-start justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${notice.statusBadgeColor} bg-white/10 text-white border-white/20`}
              >
                {notice.status} · {notice.dDayText}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                {notice.detailType}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-slate-300">
                {notice.region}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{notice.name}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-1.5">
              <span>📍 {notice.address}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-lg transition-colors cursor-pointer shrink-0 ml-3"
            aria-label="닫기"
          >
            ✕
          </button>
        </div>

        {/* 모달 스크롤 영역 */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {/* 1. 핵심 분양 정보 요약 그리드 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-400 mb-0.5">
                총 공급규모
              </div>
              <div className="text-lg font-black text-slate-900">
                {notice.totalUnits.toLocaleString()}{" "}
                <span className="text-xs font-normal text-slate-500">세대</span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-400 mb-0.5">
                시공사 (건설사)
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">
                {notice.company || notice.developer || "공고문 참조"}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-400 mb-0.5">
                당첨자 발표일
              </div>
              <div className="text-sm font-bold text-indigo-700">
                {notice.winnerAnnounceDate || "-"}
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5">
              <div className="text-[11px] font-semibold text-slate-400 mb-0.5">
                입주 예정월
              </div>
              <div className="text-sm font-bold text-emerald-700">
                {notice.moveInMonth || "미정"}
              </div>
            </div>
          </div>

          {/* 2. 청약 상세 일정 타임라인 */}
          <div className="bg-gradient-to-br from-indigo-50/50 to-blue-50/30 rounded-2xl p-4 border border-indigo-100">
            <h3 className="text-sm font-bold text-indigo-950 mb-3 flex items-center gap-1.5">
              <span>📅</span> 청약 주요 상세 일정
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 text-xs">
              <div className="bg-white p-2.5 rounded-xl border border-indigo-100/80 shadow-xs">
                <span className="text-slate-400 block text-[10px]">모집공고일</span>
                <span className="font-bold text-slate-800">
                  {notice.recruitDate || "-"}
                </span>
              </div>

              {notice.type === "무순위" ? (
                <div className="bg-white p-2.5 rounded-xl border border-indigo-100/80 shadow-xs">
                  <span className="text-slate-400 block text-[10px]">청약접수(무순위)</span>
                  <span className="font-bold text-blue-700">
                    {notice.receptStartDate || "-"}
                  </span>
                </div>
              ) : (
                <>
                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100/80 shadow-xs">
                    <span className="text-slate-400 block text-[10px]">특별공급 접수</span>
                    <span className={`font-bold ${notice.specialSupplyStartDate ? "text-indigo-700" : "text-slate-400"}`}>
                      {notice.specialSupplyStartDate || "해당없음"}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100/80 shadow-xs">
                    <span className="text-slate-400 block text-[10px]">1순위 접수</span>
                    <span className="font-bold text-blue-700">
                      {notice.rank1Date || notice.receptStartDate || "-"}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-indigo-100/80 shadow-xs">
                    <span className="text-slate-400 block text-[10px]">2순위 접수</span>
                    <span className="font-bold text-indigo-600">
                      {notice.rank2Date || (notice.receptEndDate && notice.receptEndDate !== notice.rank1Date ? notice.receptEndDate : "1순위 마감시 생략")}
                    </span>
                  </div>
                </>
              )}

              <div className="bg-white p-2.5 rounded-xl border border-indigo-100/80 shadow-xs">
                <span className="text-slate-400 block text-[10px]">당첨자 발표</span>
                <span className="font-bold text-rose-600">
                  {notice.winnerAnnounceDate || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* 3. 주택형별 공급금액(분양가) 및 공급 세대수 표 */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>💰</span> 주택형별 최고 분양가 & 공급 세대수
              </h3>
              {loading && (
                <span className="text-xs text-blue-600 animate-pulse font-medium">
                  분양가 조회 중...
                </span>
              )}
            </div>

            {loading ? (
              <div className="h-32 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 text-xs animate-pulse border border-slate-200">
                한국부동산원 청약홈에서 주택형별 분양가를 실시간 불러오고 있습니다...
              </div>
            ) : models.length > 0 ? (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-3">주택형(타입)</th>
                        <th className="py-2.5 px-3">전용면적</th>
                        <th className="py-2.5 px-3">평형</th>
                        <th className="py-2.5 px-3 text-right">일반공급</th>
                        <th className="py-2.5 px-3 text-right">특별공급</th>
                        <th className="py-2.5 px-3 text-right">최고 공급금액(분양가)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {models.map((m, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {m.houseType || `${m.modelNo}형`}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {m.exclusiveAreaSqm > 0
                              ? `${m.exclusiveAreaSqm.toFixed(2)}㎡`
                              : "-"}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {m.pyeong > 0 ? `${m.pyeong}평` : "-"}
                          </td>
                          <td className="py-2.5 px-3 text-right font-medium text-slate-800">
                            {m.supplyUnits > 0
                              ? `${m.supplyUnits.toLocaleString()}세대`
                              : "-"}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-600">
                            {m.specialSupplyUnits > 0
                              ? `${m.specialSupplyUnits.toLocaleString()}세대`
                              : "-"}
                          </td>
                          <td className="py-2.5 px-3 text-right font-bold text-rose-600">
                            {m.topPriceManwon > 0
                              ? formatSubscriptionPrice(m.topPriceManwon)
                              : "공고문 참조"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center text-xs text-slate-500">
                주택형별 세부 분양가는 청약홈 원문 공고문 PDF에서 확인하실 수 있습니다.
              </div>
            )}
          </div>

          {/* 4. 사업주체 및 문의처 */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">사업주체(시행사)</span>
              <span className="font-semibold text-slate-800">
                {notice.developer || "공고문 참조"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">시공업체(건설사)</span>
              <span className="font-semibold text-slate-800">
                {notice.company || "-"}
              </span>
            </div>
            {notice.tel && (
              <div className="flex justify-between items-center pt-1 border-t border-slate-200/60">
                <span className="text-slate-400">분양 문의 전화</span>
                <a
                  href={`tel:${notice.tel.replace(/[^0-9]/g, "")}`}
                  className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  📞 {notice.tel}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 모달 하단 버튼 액션 */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 hidden sm:block">
            출처: 한국부동산원 청약홈 (ApplyHome)
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {notice.homepage && (
              <a
                href={notice.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors"
              >
                🌐 분양 공식홈
              </a>
            )}
            <a
              href={notice.pblancUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <span>청약홈 원문 공고 보기</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
