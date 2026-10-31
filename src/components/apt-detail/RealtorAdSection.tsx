"use client";

import React, { useState, useEffect } from "react";
import type { RealtorAd } from "@/types/report";

interface Props {
  aptId: string;
  aptName: string;
}

export function RealtorAdSection({ aptId, aptName }: Props) {
  const [ads, setAds] = useState<RealtorAd[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/ads?slot=apt_detail_top&aptId=${encodeURIComponent(aptId)}`)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setAds(json.ads || []);
      })
      .catch(() => {
        if (!cancelled) setAds([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [aptId]);

  if (loading) {
    return <div className="h-28 bg-slate-100 animate-pulse rounded-3xl" />;
  }

  // 등록된 광고가 있는 경우
  if (ads.length > 0) {
    const ad = ads[0];
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl font-bold">
              🏢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {ad.isVerified ? "공식 인증 파트너" : "중개 파트너"}
                </span>
                {ad.badges && ad.badges.map((b) => (
                  <span key={b} className="text-[11px] font-bold text-amber-300">
                    ★ {b}
                  </span>
                ))}
              </div>
              <h4 className="font-extrabold text-lg text-white mt-1">
                {ad.agencyName}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                대표 {ad.realtorName} {ad.tagline ? `· ${ad.tagline}` : `· ${aptName} 전담 매물 상담`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${ad.phone}`}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-sm text-white transition-colors flex items-center gap-1.5"
            >
              <span>📞</span> 전화 문의
            </a>
            {ad.ctaType === "chat" ? (
              <a
                href={ad.ctaTarget}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 font-bold text-sm text-slate-950 transition-colors flex items-center gap-1.5"
              >
                <span>💬</span> 1:1 상담
              </a>
            ) : ad.ctaTarget ? (
              <a
                href={ad.ctaTarget}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 font-bold text-sm text-white transition-colors flex items-center gap-1.5"
              >
                <span>🌐</span> 매물 보기
              </a>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  // 기본 상태: 공인중개사 입점 신청 안내 카드
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/60 rounded-3xl p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-xl">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
              중개 파트너 모집
            </span>
            <span className="text-xs font-medium text-blue-700">공식 검증 중개사 입점</span>
          </div>
          <h4 className="font-extrabold text-slate-900 text-base mt-1.5">
            {aptName} 전문 공인중개사님이신가요?
          </h4>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            단지 상세 페이지 전담 슬롯에 중개사무소를 등록하고, 실거래가·입지 분석을 확인한 실제 매수·임차 희망 고객의 문의를 직접 받아보세요.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            alert("공인중개사 인증 등록 문의: chajwo-partner@example.com (고객센터 접수 준비 중)");
          }}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shrink-0 shadow-sm"
        >
          중개 파트너 등록 신청 ↗
        </button>
      </div>
    </div>
  );
}
export default RealtorAdSection;
