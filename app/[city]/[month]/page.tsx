import { notFound } from "next/navigation";
import { getMonthPrayerTimes, isValidMonth } from "@/lib/monthPrayerTimes";
import { getCityByName } from "@/lib/cities";
import { CityMonthClient } from "./CityMonthClient";

interface PageProps {
  params: Promise<{ city: string; month: string }>;
}

export default async function CityMonthPage({ params }: PageProps) {
  const { city: citySlug, month: monthSlugParam } = await params;

  const city = citySlug ? getCityByName(citySlug) : null;
  const validMonth = monthSlugParam && isValidMonth(monthSlugParam);

  if (!city || !validMonth) notFound();

  const data = getMonthPrayerTimes(city.name, monthSlugParam);
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
    />
  );
}
