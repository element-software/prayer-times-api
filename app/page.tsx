"use client";

import { useState, useEffect } from "react";

const CITIES = [
  "London",
  "Birmingham",
  "Manchester",
  "Leicester",
  "Bradford",
  "Glasgow",
  "Leeds",
  "Liverpool",
  "Sheffield",
];

interface PrayerTimes {
  fajr: string;
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

interface ApiResult {
  location: {
    city: string | null;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  date: string;
  calculation_method: string;
  prayer_times: PrayerTimes;
}

interface ApiError {
  error: string;
}

export default function Home() {
  const today = new Date().toISOString().split("T")[0];
  const [city, setCity] = useState("Leicester");
  const [date, setDate] = useState(today);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchPrayerTimes() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const params = new URLSearchParams({ city, date });
      const res = await fetch(`/api/prayer-times?${params}`);
      const data: ApiResult | ApiError = await res.json();
      if (!res.ok) {
        setError((data as ApiError).error ?? "An error occurred.");
      } else {
        setResult(data as ApiResult);
      }
    } catch {
      setError("Failed to fetch prayer times. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPrayerTimes();
  }, []);

  const prayerLabels: { key: keyof PrayerTimes; label: string; emoji: string }[] =
    [
      { key: "fajr", label: "Fajr", emoji: "🌙" },
      { key: "zuhr", label: "Zuhr", emoji: "☀️" },
      { key: "asr", label: "Asr", emoji: "🌤️" },
      { key: "maghrib", label: "Maghrib", emoji: "🌅" },
      { key: "isha", label: "Isha", emoji: "🌃" },
    ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🕌 Prayer Times
          </h1>
          <p className="text-slate-400 text-sm">
            Islamic prayer times for UK cities
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
          <div className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1">
                City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-800 text-white rounded-lg px-3 py-2 border border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              onClick={fetchPrayerTimes}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 text-white font-semibold rounded-lg py-2.5 transition-colors"
            >
              {loading ? "Calculating..." : "Get Prayer Times"}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/20 border border-red-500/40 rounded-lg">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="mt-6">
              <div className="text-center mb-4">
                <p className="text-white font-semibold text-lg">
                  {result.location.city ?? `${result.location.latitude}, ${result.location.longitude}`}
                </p>
                <p className="text-slate-400 text-sm">{result.date}</p>
              </div>
              <div className="space-y-2">
                {prayerLabels.map(({ key, label, emoji }) => (
                  <div
                    key={key}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3"
                  >
                    <span className="text-slate-300 font-medium">
                      {emoji} {label}
                    </span>
                    <span className="text-emerald-400 font-mono font-semibold text-lg">
                      {result.prayer_times[key]}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-slate-500 text-xs text-center mt-4">
                {result.calculation_method}
              </p>
            </div>
          )}
        </div>

        {result && (
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-xs">
              API:{" "}
              <a
                href={`/api/prayer-times?city=${encodeURIComponent(city)}&date=${result.date}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 underline break-all"
              >
                GET /api/prayer-times?city={encodeURIComponent(city)}&amp;date={result.date}
              </a>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
