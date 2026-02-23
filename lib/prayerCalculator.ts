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
const ISHA_MAX_MINUTES_AFTER_MAGHRIB = 90;

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TIMEZONE,
  });
}

function timeToMinutesSinceMidnight(date: Date): number {
  const s = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone: TIMEZONE,
  });
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
}

function minutesSinceMidnightToTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  dateStr: string
): PrayerTimes {
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  const coordinates = new Coordinates(latitude, longitude);

  // UK calculation: Fajr 18°, Isha 18° (no high-latitude adjustments)
  // Dhuhr +5 min, Maghrib +3 min, Hanafi Asr
  const params = new CalculationParameters("Other", 18, 18);
  params.madhab = Madhab.Hanafi;
  params.methodAdjustments = { 
    fajr: 0, 
    sunrise: 0, 
    dhuhr: 5, 
    asr: 0, 
    maghrib: 3, 
    isha: 0 
  };

  const prayerTimes = new AdhanPrayerTimes(coordinates, date, params);

  // Cap Isha at Maghrib + 90 min when 18° would be later (UK mosque practice)
  const maghribMins = timeToMinutesSinceMidnight(prayerTimes.maghrib);
  const calculatedIshaMins = timeToMinutesSinceMidnight(prayerTimes.isha);
  const cappedIshaMins = maghribMins + ISHA_MAX_MINUTES_AFTER_MAGHRIB;
  const ishaFormatted =
    calculatedIshaMins <= cappedIshaMins
      ? formatTime(prayerTimes.isha)
      : minutesSinceMidnightToTime(cappedIshaMins);

  return {
    fajr: formatTime(prayerTimes.fajr),
    zuhr: formatTime(prayerTimes.dhuhr),
    asr: formatTime(prayerTimes.asr),
    maghrib: formatTime(prayerTimes.maghrib),
    isha: ishaFormatted,
  };
}
