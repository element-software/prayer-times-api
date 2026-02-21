import {
  Coordinates,
  CalculationMethod,
  PrayerTimes as AdhanPrayerTimes,
  CalculationParameters,
  Madhab,
} from "adhan";

export interface PrayerTimes {
  fajr: string;
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
  dateStr: string
): PrayerTimes {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const coordinates = new Coordinates(latitude, longitude);

  // UK Moonsighting Committee: Fajr 18°, Isha 18° with seasonal high-latitude
  // adjustment, Dhuhr +5 min, Maghrib +3 min, Hanafi Asr
  const params: CalculationParameters = CalculationMethod.MoonsightingCommittee();
  params.madhab = Madhab.Hanafi;

  const prayerTimes = new AdhanPrayerTimes(coordinates, date, params);

  return {
    fajr: formatTime(prayerTimes.fajr),
    zuhr: formatTime(prayerTimes.dhuhr),
    asr: formatTime(prayerTimes.asr),
    maghrib: formatTime(prayerTimes.maghrib),
    isha: formatTime(prayerTimes.isha),
  };
}
