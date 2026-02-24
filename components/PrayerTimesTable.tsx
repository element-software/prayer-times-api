"use client";

import { formatDayOfWeek, formatDayNum } from "@/lib/dateUtils";
import type { MonthDayTimes } from "@/lib/types";

export interface PrayerTimesTableProps {
  /** Daily prayer times (one row per day) */
  times: MonthDayTimes[];
  /** Date string (YYYY-MM-DD) to highlight as today. No highlight if not in times. */
  todayStr?: string;
  /** Optional title above the table */
  title?: string;
  /** Optional calculation method or footnote */
  footnote?: string;
}

const COLUMNS = [
  { key: "fajr" as const, label: "Fajr" },
  { key: "zuhr" as const, label: "Zuhr" },
  { key: "asr" as const, label: "Asr" },
  { key: "maghrib" as const, label: "Maghrib" },
  { key: "isha" as const, label: "Isha" },
] as const;

export function PrayerTimesTable({
  times,
  todayStr,
  title,
  footnote,
}: PrayerTimesTableProps) {
  return (
    <div className="space-y-4">
      {title && (
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      )}
      {footnote && (
        <p className="text-slate-500 text-sm -mt-2">{footnote}</p>
      )}

      <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-4 py-3 text-slate-300 font-semibold">Day</th>
                <th className="px-4 py-3 text-slate-300 font-semibold">Date</th>
                {COLUMNS.map(({ label }) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-slate-300 font-semibold"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {times.map(({ date: dateStr, prayer_times }) => (
                <tr
                  key={dateStr}
                  className={`border-b border-white/5 transition-colors ${
                    dateStr === todayStr
                      ? "bg-emerald-500/20 border-l-4 border-l-emerald-500"
                      : "hover:bg-white/5"
                  }`}
                >
                  <td className="px-4 py-2 text-slate-400">
                    {formatDayOfWeek(dateStr)}
                  </td>
                  <td className="px-4 py-2 text-white font-medium">
                    {formatDayNum(dateStr)}
                  </td>
                  {COLUMNS.map(({ key }) => (
                    <td
                      key={key}
                      className="px-4 py-2 text-emerald-400 font-mono"
                    >
                      {prayer_times[key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
