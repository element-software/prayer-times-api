"use client";

import { useRouter } from "next/navigation";
import type { APIMonthResponse } from "@/lib/types";
import { monthSlug, formatMonthLabel } from "@/lib/dateUtils";
import { Sidebar } from "@/components/Sidebar";
import { PrayerTimesTable } from "@/components/PrayerTimesTable";

export interface CityMonthClientProps {
  data: APIMonthResponse;
  citySlug: string;
  monthSlugParam: string;
  todayStr: string;
}

export function CityMonthClient({
  data,
  citySlug,
  monthSlugParam,
  todayStr,
}: CityMonthClientProps) {
  const router = useRouter();
  const [year, month] = monthSlugParam.split("-").map(Number);
  const cityName = data.location.city ?? "Leicester";

  const goPrevMonth = () => {
    let y = year;
    let m = month - 1;
    if (m < 1) {
      m = 12;
      y--;
    }
    router.push(`/${citySlug}/${monthSlug(y, m)}`);
  };

  const goNextMonth = () => {
    let y = year;
    let m = month + 1;
    if (m > 12) {
      m = 1;
      y++;
    }
    router.push(`/${citySlug}/${monthSlug(y, m)}`);
  };

  const onCityChange = (newCitySlug: string) => {
    router.push(`/${newCitySlug}/${monthSlugParam}`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-screen-2xl mx-auto bg-gradient-to-br from-slate-900 to-slate-800">
      <Sidebar
        cityName={cityName}
        citySlug={citySlug}
        monthSlug={monthSlugParam}
        onCityChange={onCityChange}
        onPrevMonth={goPrevMonth}
        onNextMonth={goNextMonth}
      />

      <main className="flex-1 overflow-auto p-6 md:ml-64">
        <PrayerTimesTable
          times={data.times}
          todayStr={todayStr}
          title={`${cityName} — ${formatMonthLabel(year, month)}`}
          footnote={data.calculation_method}
        />
      </main>
    </div>
  );
}
