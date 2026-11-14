"use client";

import React, { useState, useEffect, useMemo } from "react";
import { DataSourceBadge } from "@/components/DataSourceBadge";
import type { CommercialDistrictResponse, IndustryDistributionItem, IndustryCategoryCode } from "@/types/commercialDistrict";
import { INDUSTRY_CATEGORY_META } from "@/types/commercialDistrict";

interface Props {
  aptId: string;
  aptName: string;
}

export interface StoreItem {
  bizesId: string;
  bizesNm: string;
  indsLclsCd?: IndustryCategoryCode | string;
  indsLclsNm?: string;
  indsMclsNm: string;
  indsSclsNm?: string;
  location: {
    roadAddress?: string;
  };
  distanceM: number;
  // ⭐ 향후 유료 결제 고객/스폰서 점포 우선 노출용 플래그
  isPromoted?: boolean;
  sponsorTier?: number; // 1 = 최상위 스폰서, 2, 3...
  promotionBadge?: string; // 예: "추천", "파트너", "인기"
}

export function CommercialDistrictSection({ aptId, aptName }: Props) {
  const [radius, setRadius] = useState<number>(500);
  const [districtData, setDistrictData] = useState<CommercialDistrictResponse | null>(null);
  const [stores, setStores] = useState<StoreItem[]>([]);
  // 선택된 대분류 업종 코드 (null = 전체)
  const [selectedCategory, setSelectedCategory] = useState<IndustryCategoryCode | null>(null);
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

  // 대분류 클릭 토글 핸들러
  const handleCategoryClick = (code: IndustryCategoryCode) => {
    if (selectedCategory === code) {
      setSelectedCategory(null); // 다시 누르면 필터 해제
    } else {
      setSelectedCategory(code);
      setShowStoreList(true); // 업종을 누르면 해당 점포들이 바로 보이도록 목록 자동 펼침
    }
  };

  // 선택된 대분류 메타 정보
  const selectedMeta = selectedCategory ? INDUSTRY_CATEGORY_META[selectedCategory] : null;

  // 업종 필터링 및 ⭐ 결제 고객(스폰서) 우선 정렬 ⭐ 로직
  const filteredStores = useMemo(() => {
    // 1. 대분류 필터링
    let list = stores;
    if (selectedCategory) {
      const targetLabel = INDUSTRY_CATEGORY_META[selectedCategory]?.label || "";
      list = stores.filter((s) => {
        if (s.indsLclsCd && s.indsLclsCd === selectedCategory) return true;
        if (s.indsLclsNm && (s.indsLclsNm.includes(targetLabel) || targetLabel.includes(s.indsLclsNm))) return true;

        // 보완: 소분류/중분류 키워드 기반 스마트 매칭
        if (selectedCategory === "Q") {
          return s.indsLclsNm?.includes("음식") || s.indsMclsNm?.includes("음식") || s.indsMclsNm?.includes("카페") || s.indsMclsNm?.includes("제과") || s.indsMclsNm?.includes("식당");
        }
        if (selectedCategory === "D") {
          return s.indsLclsNm?.includes("소매") || s.indsMclsNm?.includes("편의점") || s.indsMclsNm?.includes("슈퍼") || s.indsMclsNm?.includes("마트") || s.indsMclsNm?.includes("유통");
        }
        if (selectedCategory === "R") {
          return s.indsLclsNm?.includes("생활서비스") || s.indsMclsNm?.includes("미용") || s.indsMclsNm?.includes("세탁") || s.indsMclsNm?.includes("수리") || s.indsMclsNm?.includes("사진");
        }
        if (selectedCategory === "F") {
          return s.indsLclsNm?.includes("부동산") || s.indsMclsNm?.includes("부동산") || s.indsMclsNm?.includes("중개");
        }
        if (selectedCategory === "K") {
          return s.indsLclsNm?.includes("금융") || s.indsLclsNm?.includes("보험") || s.indsMclsNm?.includes("은행") || s.indsMclsNm?.includes("ATM");
        }
        if (selectedCategory === "H") {
          return s.indsLclsNm?.includes("의료") || s.indsMclsNm?.includes("병원") || s.indsMclsNm?.includes("약국") || s.indsMclsNm?.includes("의원");
        }
        if (selectedCategory === "I") {
          return s.indsLclsNm?.includes("교육") || s.indsLclsNm?.includes("학문") || s.indsMclsNm?.includes("학원") || s.indsMclsNm?.includes("교습");
        }
        if (selectedCategory === "J") {
          return s.indsLclsNm?.includes("스포츠") || s.indsLclsNm?.includes("여가") || s.indsMclsNm?.includes("헬스") || s.indsMclsNm?.includes("골프");
        }
        return false;
      });
    }

    // 2. ⭐ 결제 고객(스폰서/광고주) 최우선 상단 정렬 ⭐
    return [...list].sort((a, b) => {
      // (1) 결제 고객 여부 우선 (isPromoted = true 인 점포가 무조건 상단)
      const aPaid = a.isPromoted ? 1 : 0;
      const bPaid = b.isPromoted ? 1 : 0;
      if (bPaid !== aPaid) return bPaid - aPaid;

      // (2) 결제 고객 간 스폰서 티어 순 (sponsorTier가 낮을수록 상위 티어)
      if (a.sponsorTier && b.sponsorTier && a.sponsorTier !== b.sponsorTier) {
        return a.sponsorTier - b.sponsorTier;
      }

      // (3) 동일 조건 시 거리순(가까운 순) 정렬
      return a.distanceM - b.distanceM;
    });
  }, [stores, selectedCategory]);

  return (
    <div id="commercial-section" className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden scroll-mt-24 font-sans">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <h3 className="font-extrabold text-slate-800 text-base whitespace-nowrap">
              주변 상가 업종 구성 & 점포 수
            </h3>
            {totalStores > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 shrink-0 whitespace-nowrap">
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
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
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
            {/* 업종별 분포 카드 그리드 (클릭하여 해당 업종 점포 목록 필터링) */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-700">주요 대분류 업종 구성 비율</h4>
                  <span className="text-[11px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-semibold">
                    💡 업종 클릭 시 관련 점포 필터링
                  </span>
                </div>
                <span className="text-slate-400 text-xs">총 {totalStores.toLocaleString()}개 점포 기준</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {distribution.map((cat) => {
                  const meta = INDUSTRY_CATEGORY_META[cat.code] || {
                    label: "기타",
                    emoji: "📦",
                    color: "#64748b",
                  };
                  const isSelected = selectedCategory === cat.code;

                  return (
                    <button
                      key={cat.code}
                      type="button"
                      onClick={() => handleCategoryClick(cat.code)}
                      className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer relative group ${
                        isSelected
                          ? "bg-blue-50/70 border-2 border-blue-500 shadow-md ring-2 ring-blue-200"
                          : "bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 hover:border-slate-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                          <span className="text-base">{meta.emoji}</span>
                          <span className={isSelected ? "text-blue-700 font-black" : ""}>{meta.label}</span>
                          {isSelected && (
                            <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded font-bold">
                              선택됨
                            </span>
                          )}
                        </span>
                        <span className="text-slate-500">
                          <strong className="text-slate-900 font-black text-sm">{cat.count.toLocaleString()}</strong>개
                          <span className="text-slate-400 text-xs ml-1 font-semibold">({cat.ratio}%)</span>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.max(cat.ratio, 6)}%`,
                            backgroundColor: isSelected ? "#2563eb" : meta.color,
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 인근 점포 리스트 및 필터 표시 */}
            {stores.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 flex items-center gap-1.5">
                      <span>인근 점포 목록</span>
                      {selectedMeta ? (
                        <span className="text-blue-600 font-black flex items-center gap-1">
                          · {selectedMeta.emoji} {selectedMeta.label} ({filteredStores.length}개)
                        </span>
                      ) : (
                        <span className="text-slate-500 font-bold">({stores.length}개)</span>
                      )}
                    </h4>

                    {/* 선택 해제 버튼 */}
                    {selectedCategory && (
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(null)}
                        className="text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                      >
                        전체 보기 ✕
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowStoreList((v) => !v)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    {showStoreList ? "목록 접기 ▲" : "점포 전체 보기 ▼"}
                  </button>
                </div>

                {/* 점포 목록 그리드 */}
                {filteredStores.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center text-xs text-slate-500">
                    반경 {radius}m 내 선택하신 [{selectedMeta?.label}] 업종의 등록 점포가 없습니다.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {(showStoreList ? filteredStores : filteredStores.slice(0, 4)).map((s) => {
                      const isPromoted = s.isPromoted;

                      return (
                        <div
                          key={s.bizesId}
                          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
                            isPromoted
                              ? "bg-amber-50/60 border-amber-300/80 shadow-xs ring-1 ring-amber-200"
                              : "bg-slate-50 border-slate-100/90 hover:border-slate-200 hover:bg-white"
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-1.5">
                              {isPromoted && (
                                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-amber-500 text-white shadow-2xs">
                                  {s.promotionBadge || "AD"}
                                </span>
                              )}
                              <div className="font-extrabold text-slate-900 truncate text-xs sm:text-[13px]">
                                {s.bizesNm}
                              </div>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1 truncate">
                              <span className="text-slate-700 font-semibold">{s.indsMclsNm}</span>
                              {s.indsSclsNm ? ` · ${s.indsSclsNm}` : ""} · {s.location?.roadAddress || "주소 확인"}
                            </div>
                          </div>
                          <span className="text-[11px] font-bold text-slate-600 shrink-0 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs whitespace-nowrap">
                            {s.distanceM < 1000 ? `${s.distanceM}m` : `${(s.distanceM / 1000).toFixed(1)}km`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommercialDistrictSection;
