import { redirect } from "next/navigation";
import { getMonthPrayerTimes, isValidMonth } from "@/lib/monthPrayerTimes";
import { getCityByName } from "@/lib/cities";
import { CityMonthClient } from "./CityMonthClient";

function monthSlug(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

interface PageProps {
  params: Promise<{ city: string; month: string }>;
}

export default async function CityMonthPage({ params }: PageProps) {
  const { city: citySlug, month: monthSlugParam } = await params;

  const city = citySlug ? getCityByName(citySlug) : null;
  const validMonth = monthSlugParam && isValidMonth(monthSlugParam);

  if (!city || !validMonth) {
    const now = new Date();
    redirect(`/leicester/${monthSlug(now.getFullYear(), now.getMonth() + 1)}`);
  }

  const data = getMonthPrayerTimes(city.name, monthSlugParam);
  if (!data) {
    const now = new Date();
    redirect(`/leicester/${monthSlug(now.getFullYear(), now.getMonth() + 1)}`);
  }

  return (
    <CityMonthClient
      data={data}
      citySlug={citySlug.toLowerCase()}
      monthSlugParam={monthSlugParam}
    />
  );
}
