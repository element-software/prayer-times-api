import { PrayerTimes } from "./prayerCalculator";

export interface Location {
  city: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface APIResponse {
  location: Location;
  date: string;
  calculation_method: string;
  prayer_times: PrayerTimes;
}

export interface MonthDayTimes {
  date: string;
  prayer_times: PrayerTimes;
}

export interface APIMonthResponse {
  location: Location;
  calculation_method: string;
  month: string; // YYYY-MM
  times: MonthDayTimes[];
}

export interface APIErrorResponse {
  error: string;
}
