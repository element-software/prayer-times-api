"use client";

import { CITY_NAMES } from "@/lib/cities";
import { formatMonthLabel } from "@/lib/dateUtils";

export interface SidebarProps {
  /** Current city display name (e.g. "Leicester") */
  cityName: string;
  /** Current city URL slug (e.g. "leicester") */
  citySlug: string;
  /** Current month in YYYY-MM format */
  monthSlug: string;
  /** Called when user selects a different city. New slug is passed. */
  onCityChange: (citySlug: string) => void;
  /** Called when user clicks previous month */
  onPrevMonth: () => void;
  /** Called when user clicks next month */
  onNextMonth: () => void;
  /** Optional title override */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
}

export function Sidebar({
  cityName,
  citySlug,
  monthSlug,
  onCityChange,
  onPrevMonth,
  onNextMonth,
  title = "Prayer Times",
  subtitle = "Islamic prayer times for UK cities",
}: SidebarProps) {
  const [year, month] = monthSlug.split("-").map(Number);
  const monthLabel = formatMonthLabel(year, month);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onCityChange(e.target.value.toLowerCase());
  };

  return (
    <aside className="w-full md:w-64 md:shrink-0 border-b md:border-b-0 md:border-r border-white/10 flex flex-col p-4 fixed h-full">
      <h1 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span>🕌</span> {title}
      </h1>
      <p className="text-slate-400 text-sm mb-4">{subtitle}</p>

      <label className="text-slate-300 text-sm font-medium mb-1">City</label>
      <select
        value={cityName}
        onChange={handleCityChange}
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
          onClick={onPrevMonth}
          className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Previous month"
        >
          ←
        </button>
        <span className="flex-1 text-center text-white font-medium min-w-[8rem]">
          {monthLabel}
        </span>
        <button
          type="button"
          onClick={onNextMonth}
          className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          aria-label="Next month"
        >
          →
        </button>
      </div>
    </aside>
  );
}
