/**
 * Shared date formatting and month slug helpers.
 */

export function monthSlug(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

export function formatMonthLabel(year: number, month: number): string {
  const d = new Date(year, month - 1, 1);
  return d.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

export function formatDayOfWeek(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-GB", { weekday: "short" });
}

export function formatDayNum(dateStr: string): string {
  return dateStr.split("-")[2];
}

export function parseMonthSlug(slug: string): { year: number; month: number } | null {
  const match = slug.match(/^(\d{4})-(\d{2})$/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  if (month < 1 || month > 12) return null;
  return { year, month };
}
