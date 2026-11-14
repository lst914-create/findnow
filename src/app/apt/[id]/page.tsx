/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import { APARTMENTS_DATA } from "@/lib/apartments";
import { getTransactionsForApartment } from "@/lib/fetchTransactionsServer";
import AptDetailClient from "@/components/AptDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

const APARTMENT_DATA_MAP: Record<string, any> = Object.fromEntries(
  APARTMENTS_DATA.map((apt) => [
    apt.id,
    {
      ...apt,
      apiRegion: apt.region,
      region: `${apt.region} ${apt.district}`,
      rent_min: apt.rent_min || Math.round(apt.price_min * 0.55),
      rent_max: apt.rent_max || Math.round(apt.price_max * 0.55),
      construction: (apt.construction && apt.construction !== "시공사 확인") ? apt.construction : null,
      parking: apt.parking || (apt.parkingRatio ? `세대당 ${apt.parkingRatio}대` : null),
      floor_area_ratio: apt.floor_area_ratio || (apt.far && apt.far !== 240 ? `${apt.far}%` : null),
      heating: (apt.heating && apt.heating !== "지역난방") ? apt.heating : (apt.heatingType || null),
    },
  ])
);

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const apt = APARTMENT_DATA_MAP[id] || APARTMENT_DATA_MAP["1"];
  if (!apt) return notFound();

  // 서버 사이드에서 실거래 데이터 사전 조회 (0초 즉시 렌더링, 클라이언트 깜빡임 및 지연 0%)
  const { trades, rents } = await getTransactionsForApartment(apt);

  return <AptDetailClient apt={apt} initialTrades={trades} initialRents={rents} />;
}
