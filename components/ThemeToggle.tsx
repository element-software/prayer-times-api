"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getTheme());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  function handleToggle() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      className="inline-flex min-h-10 items-center rounded-xl p-1 text-slate-700 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 dark:text-slate-200 dark:hover:text-white"
      onClick={handleToggle}
      aria-label="Toggle light and dark mode"
      title={theme === "dark" ? "Dark mode" : "Light mode"}
    >
      <span
        aria-hidden="true"
        className="relative h-6 w-11 rounded-full border border-slate-300 bg-slate-200 transition-colors dark:border-slate-500 dark:bg-slate-700"
      >
        <span
          className={`absolute left-0.5 top-0.5 h-4.5 w-4.5 rounded-full bg-teal-600 transition-transform duration-200 ${
            theme === "dark" ? "translate-x-5 bg-teal-400" : "translate-x-0"
          }`}
        />
      </span>
      <span
        aria-hidden="true"
        className="ml-1 inline-flex h-5 w-5 items-center justify-center"
      >
        {theme === "dark" ? (
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-current"
            focusable="false"
          >
            <path d="M21 13.1A8.5 8.5 0 1 1 10.9 3c.46 0 .69.56.37.9A7 7 0 1 0 20.1 12.7c.34-.32.9-.09.9.4Z" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 fill-current"
            focusable="false"
          >
            <path d="M12 3a1 1 0 0 1 1 1v1.5a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1Zm0 14a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 4a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1Zm9-10a1 1 0 0 1 0 2h-1.5a1 1 0 1 1 0-2H21ZM5.5 12a1 1 0 1 1 0 2H4a1 1 0 1 1 0-2h1.5Zm11.157 6.657a1 1 0 0 1 1.415 0l.707.707a1 1 0 1 1-1.414 1.415l-.708-.708a1 1 0 0 1 0-1.414Zm-9.9-9.9a1 1 0 0 1 1.414 0l.708.708A1 1 0 0 1 7.464 10.88l-.707-.708a1 1 0 0 1 0-1.414Zm11.314-1.414a1 1 0 0 1 0 1.414l-.708.708a1 1 0 0 1-1.414-1.415l.707-.707a1 1 0 0 1 1.415 0ZM8.172 15.828a1 1 0 0 1 0 1.414l-.708.708a1 1 0 0 1-1.414-1.415l.707-.707a1 1 0 0 1 1.415 0Z" />
          </svg>
        )}
      </span>
    </button>
  );
}
