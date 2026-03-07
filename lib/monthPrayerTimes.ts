import { getCityByName } from "@/lib/cities";
import { calculatePrayerTimes, type School } from "@/lib/prayerCalculator";
import type { APIMonthResponse } from "@/lib/types";

const MONTH_REGEX = /^\d{4}-\d{2}$/;
const TIMEZONE = "Europe/London";

function getCalculationMethod(school: School): string {
  const asrLabel = school === "hanafi" ? "Hanafi" : "Shafi'i";
  return `Moonsighting Committee (Fajr 18°, Isha 18° seasonal, ${asrLabel} Asr, Dhuhr +5min, Maghrib +3min)`;
}

function getDaysInMonth(year: number, month: number): string[] {
  const days: string[] = [];
  const last = new Date(year, month, 0).getDate();
  for (let d = 1; d <= last; d++) {
    days.push(
      `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`
    );
  }
  return days;
}

export function isValidMonth(monthStr: string): boolean {
  if (!MONTH_REGEX.test(monthStr)) return false;
  const [, m] = monthStr.split("-").map(Number);
  return m >= 1 && m <= 12;
}

/**
 * Returns prayer times for every day in the given month for the given city.
 * cityNameOrSlug: city display name or URL slug (e.g. "Leicester" or "leicester").
 * school: madhab/school of thought ("hanafi" by default).
 * Returns null if city or month is invalid.
 */
export function getMonthPrayerTimes(
  cityNameOrSlug: string,
  monthStr: string,
  school: School = "hanafi"
): APIMonthResponse | null {
  const city = getCityByName(cityNameOrSlug);
  if (!city) return null;
  if (!isValidMonth(monthStr)) return null;

  const [year, month] = monthStr.split("-").map(Number);
  const dates = getDaysInMonth(year, month);
  const times = dates.map((date) => ({
    date,
    prayer_times: calculatePrayerTimes(city.latitude, city.longitude, date, school),
  }));

  return {
    location: {
      city: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: TIMEZONE,
    },
    calculation_method: getCalculationMethod(school),
    month: monthStr,
    times,
  };
}
