import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-6 border-t border-slate-200/80 bg-white/80 dark:border-slate-700/80 dark:bg-slate-900/75">
      <div className="mx-auto flex w-[min(1120px,calc(100%-2rem))] flex-col items-center justify-center gap-1.5 py-4 text-center text-sm text-slate-600 dark:text-slate-300 max-sm:w-[min(1120px,calc(100%-1rem))]">
        <p className="font-medium text-slate-700 dark:text-slate-200">Prayer Times API for UK cities</p>
        <p>Timezone: Europe/London</p>
        <p className="leading-relaxed">
          Powered by adhan and{" "}
          <Link
            href="https://element-software.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-800 underline-offset-4 hover:underline dark:text-slate-100"
          >
            Element Software
          </Link>
        </p>
        <p className="mt-0.5">
          <Link
            href="/api/prayer-times?city=Leicester"
            className="font-semibold text-slate-800 underline-offset-4 hover:underline dark:text-slate-100"
          >
            /api/prayer-times
          </Link>{" "}
          - {year}
        </p>
      </div>
    </footer>
  );
}
