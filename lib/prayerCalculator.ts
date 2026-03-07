import {
  Coordinates,
  CalculationMethod,
  PrayerTimes as AdhanPrayerTimes,
  Madhab,
} from "adhan";

export type School = "hanafi" | "shafi";

export const VALID_SCHOOLS: School[] = ["hanafi", "shafi"];

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const TIMEZONE = "Europe/London";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TIMEZONE,
  });
}

export function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  dateStr: string,
  school: School = "hanafi"
): PrayerTimes {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const coordinates = new Coordinates(latitude, longitude);

  // UK Moonsighting Committee method: Fajr/Isha 18°, Dhuhr +5 min, Maghrib +3 min.
  // Applies a seasonal twilight adjustment so Fajr/Isha remain at practical times
  // during summer months when 18° twilight may never fully occur in the UK.
  const params = CalculationMethod.MoonsightingCommittee();
  params.madhab = school === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;

  const prayerTimes = new AdhanPrayerTimes(coordinates, date, params);

  return {
    fajr: formatTime(prayerTimes.fajr),
    sunrise: formatTime(prayerTimes.sunrise),
    zuhr: formatTime(prayerTimes.dhuhr),
    asr: formatTime(prayerTimes.asr),
    maghrib: formatTime(prayerTimes.maghrib),
    isha: formatTime(prayerTimes.isha),
  };
}
