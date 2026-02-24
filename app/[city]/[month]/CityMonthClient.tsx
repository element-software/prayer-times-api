"use client";

import type { APIMonthResponse } from "@/lib/types";
import { formatMonthLabel } from "@/lib/dateUtils";
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
  const [year, month] = monthSlugParam.split("-").map(Number);
  const cityName = data.location.city ?? "Leicester";

  return (
    <div className="min-h-screen flex flex-col md:flex-row max-w-screen-2xl mx-auto">
      <Sidebar
        cityName={cityName}
        citySlug={citySlug}
        monthSlug={monthSlugParam}
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
