"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CITY_NAMES } from "@/lib/cities";
import { formatMonthLabel, getPrevMonthSlug, getNextMonthSlug } from "@/lib/dateUtils";

export interface SidebarProps {
  /** Current city display name (e.g. "Leicester") */
  cityName: string;
  /** Current city URL slug (e.g. "leicester") */
  citySlug: string;
  /** Current month in YYYY-MM format */
  monthSlug: string;
  /** Optional title override */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
}

export function Sidebar({
  cityName,
  citySlug,
  monthSlug,
  title = "Prayer Times",
  subtitle = "Islamic prayer times for UK cities",
}: SidebarProps) {
  const router = useRouter();
  const [year, month] = monthSlug.split("-").map(Number);
  const monthLabel = formatMonthLabel(year, month);
  const prevHref = `/${citySlug}/${getPrevMonthSlug(monthSlug)}`;
  const nextHref = `/${citySlug}/${getNextMonthSlug(monthSlug)}`;

  return (
    <aside className="w-full md:w-64 md:shrink-0 border-b md:border-b-0 md:border-r border-white/10 flex flex-col p-4 md:fixed h-full">
      <h1 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span>🕌</span> {title}
      </h1>
      <p className="text-slate-400 text-sm mb-4">{subtitle}</p>

      <label className="text-slate-300 text-sm font-medium mb-1" htmlFor="city-select">City</label>
      <select
        id="city-select"
        value={citySlug}
        onChange={(e) => router.push(`/${e.target.value}/${monthSlug}`)}
        className="mb-6 w-full rounded-lg px-3 py-2 border border-slate-600 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
      >
        {CITY_NAMES.map((c) => {
          const slug = c.toLowerCase();
          return (
            <option key={c} value={slug}>
              {c}
            </option>
          );
        })}
      </select>

      <label className="text-slate-300 text-sm font-medium mb-1">Month</label>
      <div className="flex items-center gap-2">
        <Link
          href={prevHref}
          className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0"
          aria-label="Previous month"
        >
          ←
        </Link>
        <span className="flex-1 text-center text-white font-medium min-w-[8rem]">
          {monthLabel}
        </span>
        <Link
          href={nextHref}
          className="p-2 rounded-lg bg-slate-800 border border-slate-600 text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0"
          aria-label="Next month"
        >
          →
        </Link>
      </div>
    </aside>
  );
}
