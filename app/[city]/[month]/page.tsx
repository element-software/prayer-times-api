import { notFound } from "next/navigation";
import { getMonthPrayerTimes, isValidMonth } from "@/lib/monthPrayerTimes";
import { getCityByName } from "@/lib/cities";
import { VALID_SCHOOLS, type School } from "@/lib/prayerCalculator";
import { CityMonthClient } from "./CityMonthClient";

interface PageProps {
  params: Promise<{ city: string; month: string }>;
  searchParams: Promise<{ school?: string }>;
}

export default async function CityMonthPage({ params, searchParams }: PageProps) {
  const { city: citySlug, month: monthSlugParam } = await params;
  const { school: schoolParam } = await searchParams;

  const city = citySlug ? getCityByName(citySlug) : null;
  const validMonth = monthSlugParam && isValidMonth(monthSlugParam);

  if (!city || !validMonth) notFound();

  const school: School = VALID_SCHOOLS.includes(schoolParam as School)
    ? (schoolParam as School)
    : "hanafi";

  const data = getMonthPrayerTimes(city.name, monthSlugParam, school);
  if (!data) notFound();

  const todayStr = new Date().toLocaleDateString("en-CA", {
    timeZone: "Europe/London",
  });

  return (
    <CityMonthClient
      data={data}
      citySlug={citySlug.toLowerCase()}
      monthSlugParam={monthSlugParam}
      todayStr={todayStr}
      school={school}
    />
  );
}
