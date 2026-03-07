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
  { key: "sunrise" as const, label: "Sunrise" },
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
    <section className="space-y-2">
      {title && (
        <h2 className="text-[clamp(1.5rem,3vw,2.2rem)] font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h2>
      )}
      {footnote && <p className="text-sm text-slate-600 dark:text-slate-300">{footnote}</p>}

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-300 bg-white/95 shadow-sm dark:border-slate-700 dark:bg-slate-900/90">
        <div className="w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="bg-slate-100/80 dark:bg-slate-800/70">
                <th className="border-b border-slate-300 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">
                  Day
                </th>
                <th className="border-b border-slate-300 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300">
                  Date
                </th>
                {COLUMNS.map(({ label }) => (
                  <th
                    key={label}
                    className="border-b border-slate-300 px-3 py-2.5 text-left text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-300"
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
                  className={
                    dateStr === todayStr
                      ? "bg-emerald-100 ring-1 ring-inset ring-emerald-400/60 dark:bg-emerald-900/50 dark:ring-emerald-400/50"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }
                >
                  <td className="border-b border-slate-200 px-3 py-2.5 text-base font-medium text-slate-700 dark:border-slate-800 dark:text-slate-300">
                    {formatDayOfWeek(dateStr)}
                  </td>
                  <td
                    className={`border-b border-slate-200 px-3 py-2.5 text-base font-semibold dark:border-slate-800 ${
                      dateStr === todayStr
                        ? "text-emerald-900 dark:text-emerald-200"
                        : "text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    {formatDayNum(dateStr)}
                  </td>
                  {COLUMNS.map(({ key }) => (
                    <td
                      key={key}
                      className={`border-b border-slate-200 px-3 py-2.5 font-mono text-base font-semibold dark:border-slate-800 ${
                        dateStr === todayStr
                          ? "text-emerald-800 dark:text-emerald-200"
                          : "text-teal-700 dark:text-teal-300"
                      }`}
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
    </section>
  );
}
