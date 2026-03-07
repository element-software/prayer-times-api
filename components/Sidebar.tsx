"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CITY_NAMES } from "@/lib/cities";
import { formatMonthLabel, getPrevMonthSlug, getNextMonthSlug } from "@/lib/dateUtils";
import type { School } from "@/lib/prayerCalculator";

export interface SidebarProps {
  /** Current city display name (e.g. "Leicester") */
  cityName: string;
  /** Current city URL slug (e.g. "leicester") */
  citySlug: string;
  /** Current month in YYYY-MM format */
  monthSlug: string;
  /** Current school of thought */
  school?: School;
  /** Optional title override */
  title?: string;
  /** Optional subtitle */
  subtitle?: string;
}

export function Sidebar({
  cityName,
  citySlug,
  monthSlug,
  school,
  title = "Plan your month",
  subtitle = "Switch city, month, and school quickly",
}: SidebarProps) {
  const router = useRouter();
  const [year, month] = monthSlug.split("-").map(Number);
  const monthLabel = formatMonthLabel(year, month);
  const schoolSuffix = school && school !== "hanafi" ? `?school=${school}` : "";
  const prevHref = `/${citySlug}/${getPrevMonthSlug(monthSlug)}${schoolSuffix}`;
  const nextHref = `/${citySlug}/${getNextMonthSlug(monthSlug)}${schoolSuffix}`;

  return (
    <aside className="rounded-2xl border border-slate-300 bg-white/95 p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/90 lg:sticky lg:top-20">
      <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h1>
      <p className="mt-1 mb-4 text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>

      <div className="grid gap-3.5">
        <div>
          <label
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            htmlFor="city-select"
          >
            City
          </label>
          <select
            id="city-select"
            value={citySlug}
            onChange={(e) => router.push(`/${e.target.value}/${monthSlug}${schoolSuffix}`)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-slate-900 outline-none ring-teal-500 transition focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
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
        </div>

        <div>
          <label
            className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
            htmlFor="month-label"
          >
            Month
          </label>
          <div
            className="grid grid-cols-[auto_1fr_auto] items-center gap-2"
            id="month-label"
            aria-live="polite"
          >
            <Link
              href={prevHref}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-lg font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              aria-label="Previous month"
            >
              ←
            </Link>
            <span className="text-center font-semibold text-slate-900 dark:text-slate-100">
              {monthLabel}
            </span>
            <Link
              href={nextHref}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-300 bg-white text-lg font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              aria-label="Next month"
            >
              →
            </Link>
          </div>
        </div>

        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Viewing {cityName} ({school === "shafi" ? "Shafi'i" : "Hanafi"})
          </p>
        </div>
      </div>
    </aside>
  );
}
