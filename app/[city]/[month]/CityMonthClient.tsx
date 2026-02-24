"use client";

import { useRouter } from "next/navigation";
import type { APIMonthResponse } from "@/lib/types";
import { CITY_NAMES } from "@/lib/cities";

function monthSlug(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function formatMonthLabel(year: number, month: number): string {
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function formatDayOfWeek(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "short" });
}

function formatDayNum(dateStr: string): string {
  return dateStr.split("-")[2];
}

interface CityMonthClientProps {
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

  const onCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slug = e.target.value.toLowerCase();
    router.push(`/${slug}/${monthSlugParam}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex">
      <aside className="w-64 shrink-0 border-r border-white/10 bg-slate-900/50 flex flex-col p-4">
        <h1 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🕌</span> Prayer Times
        </h1>
        <p className="text-slate-400 text-sm mb-4">Islamic prayer times for UK cities</p>

        <label className="text-slate-300 text-sm font-medium mb-1">City</label>
        <select
          value={cityName}
          onChange={onCityChange}
          className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-6"
        >
          {CITY_NAMES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="text-slate-300 text-sm font-medium mb-1">Month</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrevMonth}
            className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Previous month"
          >
            ←
          </button>
          <span className="flex-1 text-center text-white font-medium min-w-[8rem]">
            {formatMonthLabel(year, month)}
          </span>
          <button
            type="button"
            onClick={goNextMonth}
            className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white">
            {cityName} — {formatMonthLabel(year, month)}
          </h2>
          <p className="text-slate-500 text-sm mt-1">{data.calculation_method}</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-4 py-3 text-slate-300 font-semibold">Day</th>
                  <th className="px-4 py-3 text-slate-300 font-semibold">Date</th>
                  <th className="px-4 py-3 text-slate-300 font-semibold">Fajr</th>
                  <th className="px-4 py-3 text-slate-300 font-semibold">Zuhr</th>
                  <th className="px-4 py-3 text-slate-300 font-semibold">Asr</th>
                  <th className="px-4 py-3 text-slate-300 font-semibold">Maghrib</th>
                  <th className="px-4 py-3 text-slate-300 font-semibold">Isha</th>
                </tr>
              </thead>
              <tbody>
                {data.times.map(({ date: dateStr, prayer_times }) => (
                  <tr
                    key={dateStr}
                    className={`border-b border-white/5 transition-colors ${
                      dateStr === todayStr
                        ? "bg-emerald-500/20 border-l-4 border-l-emerald-500"
                        : "hover:bg-white/5"
                    }`}
                  >
                    <td className="px-4 py-2 text-slate-400">{formatDayOfWeek(dateStr)}</td>
                    <td className="px-4 py-2 text-white font-medium">{formatDayNum(dateStr)}</td>
                    <td className="px-4 py-2 text-emerald-400 font-mono">{prayer_times.fajr}</td>
                    <td className="px-4 py-2 text-emerald-400 font-mono">{prayer_times.zuhr}</td>
                    <td className="px-4 py-2 text-emerald-400 font-mono">{prayer_times.asr}</td>
                    <td className="px-4 py-2 text-emerald-400 font-mono">{prayer_times.maghrib}</td>
                    <td className="px-4 py-2 text-emerald-400 font-mono">{prayer_times.isha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
