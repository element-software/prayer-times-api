import { NextRequest, NextResponse } from "next/server";
import { getCityByName } from "@/lib/cities";
import { calculatePrayerTimes, VALID_SCHOOLS, type School } from "@/lib/prayerCalculator";
import type { APIResponse, APIErrorResponse, APIMonthResponse } from "@/lib/types";
import type { PrayerTimes } from "@/lib/prayerCalculator";

const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const MONTH_REGEX = /^\d{4}-\d{2}$/;
const TIMEZONE = "Europe/London";

function getCalculationMethod(school: School): string {
  const asrLabel = school === "hanafi" ? "Hanafi" : "Shafi'i";
  return `UK Standard (Fajr 18°, Isha 18°, ${asrLabel} Asr, Dhuhr +5min, Maghrib +3min)`;
}

function getTodayInLondon(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });
}

function isValidDate(dateStr: string): boolean {
  if (!DATE_REGEX.test(dateStr)) return false;
  const d = new Date(dateStr);
  return !isNaN(d.getTime());
}

function isValidMonth(monthStr: string): boolean {
  if (!MONTH_REGEX.test(monthStr)) return false;
  const [y, m] = monthStr.split("-").map(Number);
  return m >= 1 && m <= 12;
}

function getDaysInMonth(year: number, month: number): string[] {
  const days: string[] = [];
  const last = new Date(year, month, 0).getDate();
  for (let d = 1; d <= last; d++) {
    days.push(`${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  }
  return days;
}

function isValidCoordinate(value: string): boolean {
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<APIResponse | APIMonthResponse | APIErrorResponse>> {
  const { searchParams } = request.nextUrl;

  const cityParam = searchParams.get("city");
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const dateParam = searchParams.get("date");
  const monthParam = searchParams.get("month");
  const schoolParam = searchParams.get("school") ?? "hanafi";

  if (!VALID_SCHOOLS.includes(schoolParam as School)) {
    return NextResponse.json(
      { error: `Invalid school: "${schoolParam}". Valid values: ${VALID_SCHOOLS.join(", ")}.` },
      { status: 400 }
    );
  }
  const school = schoolParam as School;

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

  const location = {
    city: cityName,
    latitude,
    longitude,
    timezone: TIMEZONE,
  };

  // Month request: ?city=X&month=YYYY-MM
  if (monthParam) {
    if (!isValidMonth(monthParam)) {
      return NextResponse.json(
        { error: "Invalid month format. Use YYYY-MM." },
        { status: 400 }
      );
    }
    const [year, month] = monthParam.split("-").map(Number);
    const dates = getDaysInMonth(year, month);
    const times = dates.map((dateStr) => ({
      date: dateStr,
      prayer_times: calculatePrayerTimes(latitude, longitude, dateStr, school),
    }));
    const monthResponse: APIMonthResponse = {
      location,
      calculation_method: getCalculationMethod(school),
      month: monthParam,
      times,
    };
    return NextResponse.json(monthResponse, {
      status: 200,
      headers: { "Cache-Control": "no-store" },
    });
  }

  // Single-date request
  const dateStr = dateParam ?? getTodayInLondon();
  if (!isValidDate(dateStr)) {
    return NextResponse.json(
      { error: "Invalid date format. Use YYYY-MM-DD." },
      { status: 400 }
    );
  }

  const prayerTimes = calculatePrayerTimes(latitude, longitude, dateStr, school);
  const response: APIResponse = {
    location,
    date: dateStr,
    calculation_method: getCalculationMethod(school),
    prayer_times: prayerTimes,
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
