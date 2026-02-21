import { NextRequest, NextResponse } from "next/server";
import { getCityByName } from "@/lib/cities";
import { calculatePrayerTimes } from "@/lib/prayerCalculator";
import { getCached, setCached, buildCacheKey } from "@/lib/cache";
import type { APIResponse, APIErrorResponse } from "@/lib/types";
import type { PrayerTimes } from "@/lib/prayerCalculator";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const CALCULATION_METHOD = "UK Standard (Fajr 18°, Isha 18°)";
const TIMEZONE = "Europe/London";

function getTodayInLondon(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });
}

function isValidDate(dateStr: string): boolean {
  if (!DATE_REGEX.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

function isValidCoordinate(value: string): boolean {
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<APIResponse | APIErrorResponse>> {
  const { searchParams } = request.nextUrl;

  const cityParam = searchParams.get("city");
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const dateParam = searchParams.get("date");

  // Resolve date
  const dateStr = dateParam ?? getTodayInLondon();
  if (!isValidDate(dateStr)) {
    return NextResponse.json(
      { error: "Invalid date format. Use YYYY-MM-DD." },
      { status: 400 }
    );
  }

  let latitude: number;
  let longitude: number;
  let cityName: string | null = null;

  if (cityParam) {
    const city = getCityByName(cityParam);
    if (!city) {
      return NextResponse.json(
        {
          error: `Unknown city: "${cityParam}". Supported cities: London, Birmingham, Manchester, Leicester, Bradford, Glasgow, Leeds, Liverpool, Sheffield.`,
        },
        { status: 400 }
      );
    }
    latitude = city.latitude;
    longitude = city.longitude;
    cityName = city.name;
  } else if (latParam !== null && lngParam !== null) {
    if (!isValidCoordinate(latParam) || !isValidCoordinate(lngParam)) {
      return NextResponse.json(
        { error: "Invalid lat/lng. Must be valid numeric values." },
        { status: 400 }
      );
    }
    latitude = Number(latParam);
    longitude = Number(lngParam);
    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: "lat must be between -90 and 90, lng between -180 and 180." },
        { status: 400 }
      );
    }
  } else {
    return NextResponse.json(
      { error: "Provide either ?city=<name> or ?lat=<lat>&lng=<lng>." },
      { status: 400 }
    );
  }

  const cacheKey = buildCacheKey(latitude, longitude, dateStr);
  const cached = getCached<PrayerTimes>(cacheKey);
  const prayerTimes = cached ?? calculatePrayerTimes(latitude, longitude, dateStr);

  if (!cached) {
    setCached(cacheKey, prayerTimes);
  }

  const response: APIResponse = {
    location: {
      city: cityName,
      latitude,
      longitude,
      timezone: TIMEZONE,
    },
    date: dateStr,
    calculation_method: CALCULATION_METHOD,
    prayer_times: prayerTimes,
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  });
}
