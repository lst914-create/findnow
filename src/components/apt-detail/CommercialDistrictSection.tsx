"use client";

import React, { useState, useEffect } from "react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import type { CommercialDistrictResponse, IndustryDistributionItem } from "@/types/commercialDistrict";
import { INDUSTRY_CATEGORY_META } from "@/types/commercialDistrict";

interface Props {
  aptId: string;
  aptName: string;
}

interface StoreItem {
  bizesId: string;
  bizesNm: string;
  indsMclsNm: string;
  indsSclsNm?: string;
  location: {
    roadAddress?: string;
  };
  distanceM: number;
}

export function CommercialDistrictSection({ aptId, aptName }: Props) {
  const [radius, setRadius] = useState<number>(500);
  const [districtData, setDistrictData] = useState<CommercialDistrictResponse | null>(null);
  const [stores, setStores] = useState<StoreItem[]>([]);
  const [showStoreList, setShowStoreList] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    Promise.all([
      fetch(`/api/commercial-district?aptId=${encodeURIComponent(aptId)}&radius=${radius}`).then((r) =>
        r.ok ? r.json() : null
      ),
      fetch(`/api/commercial/stores?aptId=${encodeURIComponent(aptId)}&radius=${radius}&includeStores=true`).then((r) =>
        r.ok ? r.json() : null
      ),
    ])
      .then(([distJson, storesJson]) => {
        if (cancelled) return;
        setDistrictData(distJson);
        setStores(storesJson?.data?.stores || []);
      })
      .catch(() => {
        if (!cancelled) {
          setDistrictData(null);
          setStores([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [aptId, radius]);

  const distribution: IndustryDistributionItem[] = districtData?.distribution?.filter((d) => d.count > 0) ?? [];
  const totalStores = districtData?.totalStoreCount ?? 0;

  return (
    <div id="commercial-section" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-24">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
              <span>☕</span> 주변 상가 업종 구성 & 점포 수
            </h3>
            {totalStores > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
                점포 {totalStores.toLocaleString()}개
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            소상공인시장진흥공단 상가상권정보 기준 인근 상권의 활성도와 업종 구성을 분석합니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full sm:w-auto">
          <div className="flex items-center justify-between sm:justify-start gap-2.5">
            {/* 반경 선택 */}
            <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-xs font-medium shrink-0">
              {[500, 1000, 1500].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRadius(r)}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    radius === r
                      ? "bg-white text-slate-900 font-bold shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {r >= 1000 ? `${r / 1000}km` : `${r}m`}
                </button>
              ))}
            </div>

            <a
              href={`https://map.kakao.com/?q=${encodeURIComponent(`${aptName} 주변 상가`)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/70 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>상권 지도</span>
              <span>↗</span>
            </a>
          </div>

          <div className="self-end sm:self-auto shrink-0">
            <DataSourceBadge provider="SDSC_STORE" meta={districtData?.meta} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            <div className="h-24 bg-slate-50 rounded-2xl animate-pulse" />
            <div className="h-28 bg-slate-50 rounded-2xl animate-pulse" />
          </div>
        ) : totalStores === 0 ? (
          <div className="p-8 rounded-2xl bg-amber-50/50 border border-amber-200/60 text-center">
            <div className="text-3xl mb-2">🏪</div>
            <h4 className="text-sm font-bold text-amber-900">
              반경 {radius >= 1000 ? `${radius / 1000}km` : `${radius}m`} 내 등록된 상가 데이터 수집 준비 중
            </h4>
            <p className="text-xs text-amber-700/80 mt-1.5 max-w-md mx-auto leading-relaxed">
              정확한 데이터 검증 원칙에 따라 가공되지 않은 추정치를 노출하지 않습니다.
              소상공인시장진흥공단 오픈API(전국 상가업종·점포 통계) 동기화 파이프라인을 통해 순차적으로 정비되고 있습니다.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* 업종별 분포 카드 그리드 */}
            <div>
              <h4 className="text-xs font-bold text-slate-600 mb-3 flex items-center justify-between">
                <span>주요 대분류 업종 구성 비율</span>
                <span className="text-slate-400 font-normal">총 {totalStores.toLocaleString()}개 점포 기준</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {distribution.map((cat) => {
                  const meta = INDUSTRY_CATEGORY_META[cat.code] || {
                    label: "기타",
                    emoji: "📦",
                    color: "#64748b",
                  };
                  return (
                    <div
                      key={cat.code}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <span>{meta.emoji}</span>
                          <span>{meta.label}</span>
                        </span>
                        <span className="text-slate-500">
                          <strong className="text-slate-900 font-extrabold">{cat.count.toLocaleString()}</strong>개
                          <span className="text-slate-400 ml-1">({cat.ratio}%)</span>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(cat.ratio, 6)}%`, backgroundColor: meta.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 인근 대표 점포 리스트 및 토글 */}
            {stores.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-600">
                    인근 대표 점포 목록 ({stores.length}개)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowStoreList((v) => !v)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    {showStoreList ? "목록 접기 ▲" : "점포 전체 보기 ▼"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(showStoreList ? stores : stores.slice(0, 4)).map((s) => (
                    <div
                      key={s.bizesId}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100/80 flex items-center justify-between text-xs"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="font-bold text-slate-800 truncate">{s.bizesNm}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {s.indsMclsNm} {s.indsSclsNm ? `· ${s.indsSclsNm}` : ""} · {s.location?.roadAddress || "주소 확인"}
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold text-slate-500 shrink-0 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {s.distanceM < 1000 ? `${s.distanceM}m` : `${(s.distanceM / 1000).toFixed(1)}km`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
export default CommercialDistrictSection;
