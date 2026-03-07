"use client";

import { useRouter } from "next/navigation";
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

const SCHOOL_LABELS: Record<School, string> = {
  hanafi: "Hanafi",
  shafi: "Shafi'i / Maliki / Hanbali",
};

export function CityMonthClient({
  data,
  citySlug,
  monthSlugParam,
  todayStr,
  school,
}: CityMonthClientProps) {
  const router = useRouter();
  const [year, month] = monthSlugParam.split("-").map(Number);
  const cityName = data.location.city ?? "Leicester";

  function handleSchoolChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selected = e.target.value as School;
    router.push(`/${citySlug}/${monthSlugParam}?school=${selected}`);
  }

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

        <section className="rounded-2xl border border-slate-300 bg-white/95 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
          <label
            htmlFor="school-select"
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            School of thought
          </label>
          <select
            id="school-select"
            value={school}
            onChange={handleSchoolChange}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-teal-500 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          >
            {(Object.entries(SCHOOL_LABELS) as [School, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
        </section>
      </main>
    </div>
  );
}
