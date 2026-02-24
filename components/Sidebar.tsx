import Link from "next/link";
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

const linkBase =
  "block rounded-lg px-3 py-2 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ";
const linkClass = linkBase + "bg-slate-800 hover:bg-slate-700";
const currentClass = linkBase + "bg-slate-700 border-emerald-500/50 text-emerald-100";

export function Sidebar({
  cityName,
  citySlug,
  monthSlug,
  title = "Prayer Times",
  subtitle = "Islamic prayer times for UK cities",
}: SidebarProps) {
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

      <label className="text-slate-300 text-sm font-medium mb-1">City</label>
      <nav className="flex flex-col gap-1 mb-6" aria-label="Select city">
        {CITY_NAMES.map((c) => {
          const slug = c.toLowerCase();
          const isCurrent = slug === citySlug;
          return (
            <Link
              key={c}
              href={`/${slug}/${monthSlug}`}
              className={isCurrent ? currentClass : linkClass}
            >
              {c}
            </Link>
          );
        })}
      </nav>

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
