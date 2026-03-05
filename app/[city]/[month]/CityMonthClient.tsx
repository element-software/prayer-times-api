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
    <div className="min-h-screen flex flex-col md:flex-row max-w-screen-2xl mx-auto">
      <Sidebar
        cityName={cityName}
        citySlug={citySlug}
        monthSlug={monthSlugParam}
        school={school}
      />

      <main className="flex-1 overflow-auto p-6 md:ml-64">
        <PrayerTimesTable
          times={data.times}
          todayStr={todayStr}
          title={`${cityName} — ${formatMonthLabel(year, month)}`}
          footnote={data.calculation_method}
        />

        <div className="mt-4 flex items-center gap-3">
          <label
            htmlFor="school-select"
            className="text-slate-300 text-sm font-medium"
          >
            School of Thought
          </label>
          <select
            id="school-select"
            value={school}
            onChange={handleSchoolChange}
            className="rounded-lg px-3 py-2 border border-slate-600 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {(Object.entries(SCHOOL_LABELS) as [School, string][]).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>
      </main>
    </div>
  );
}
