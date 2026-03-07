"use client";

import type { APIMonthResponse } from "@/lib/types";
import type { School } from "@/lib/prayerCalculator";
import { formatMonthLabel } from "@/lib/dateUtils";
import { Sidebar } from "@/components/Sidebar";
import { PrayerTimesTable } from "@/components/PrayerTimesTable";

export interface CityMonthClientProps {
  data: APIMonthResponse;
  citySlug: string;
  monthSlugParam: string;
  todayStr: string;
  school: School;
}

export function CityMonthClient({
  data,
  citySlug,
  monthSlugParam,
  todayStr,
  school,
}: CityMonthClientProps) {
  const [year, month] = monthSlugParam.split("-").map(Number);
  const cityName = data.location.city ?? "Leicester";

  return (
    <div className="mx-auto grid w-[min(1120px,calc(100%-2rem))] grid-cols-1 gap-4 max-sm:w-[min(1120px,calc(100%-1rem))] lg:grid-cols-[290px_minmax(0,1fr)] lg:items-start">
      <Sidebar
        cityName={cityName}
        citySlug={citySlug}
        monthSlug={monthSlugParam}
        school={school}
      />

      <main className="space-y-4">
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
