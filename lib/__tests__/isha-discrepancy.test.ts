import { describe, it, expect } from 'vitest';
import { calculatePrayerTimes } from '../prayerCalculator';

/**
 * Baseline: Madani Schools Federation Ramadan timetable.
 * We use 18° Fajr/Isha (no cap) so times match their published schedule.
 * Reference row: Ramadan Day 7 / Date 24 / Tue (24 Feb 2026).
 */

describe('Madani baseline (24 Feb 2026)', () => {
  const LEICESTER_LAT = 52.6369;
  const LEICESTER_LNG = -1.1398;

  it('matches Madani timetable for 24 Feb 2026 (Ramadan Day 7)', () => {
    const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-02-24');
    expect(times.fajr).toBe('05:08');
    expect(times.sunrise).toBe('07:02');
    expect(times.zuhr).toBe('12:23');
    expect(times.asr).toBe('15:42');
    expect(times.maghrib).toBe('17:37');
    expect(times.isha).toBe('19:28');
  });

  it('uses 18° Isha (no cap) so Isha can be later than Maghrib + 90 min', () => {
    const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-19');
    expect(times.maghrib).toBe('18:19');
    expect(times.isha).toBe('20:13'); // 18° calculation, not capped at 19:49
  });
});
