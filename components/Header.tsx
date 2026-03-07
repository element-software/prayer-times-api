import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/85">
      <div className="mx-auto flex w-[min(1120px,calc(100%-2rem))] flex-col items-start justify-between gap-3 py-3 sm:flex-row sm:items-center sm:gap-4 max-sm:w-[min(1120px,calc(100%-1rem))]">
        <div className="flex flex-col gap-0.5">
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight"
            aria-label="Go to home page"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-extrabold tracking-wide text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
              PT
            </span>
            <span>Prayer Times</span>
          </Link>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Monthly prayer times across UK cities
          </p>
        </div>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-3">
          <Link
            href="/api/prayer-times?city=Leicester"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            API Endpoint
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
