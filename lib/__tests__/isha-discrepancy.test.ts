import { describe, it, expect } from 'vitest';
import { calculatePrayerTimes } from '../prayerCalculator';

/**
 * Seasonal adjustment behaviour of the Moonsighting Committee method.
 *
 * The UK Moonsighting Committee method applies a latitude- and day-of-year
 * dependent correction (Khalid Shaukat's seasonal twilight algorithm) to
 * Fajr and Isha.  This prevents both prayers from reaching impractical times
 * during British summer, when 18° astronomical twilight may never fully
 * occur at latitudes above ~52°N.
 *
 * The algorithm computes a "safe" bound derived from sunrise/sunset and the
 * observer's latitude and day-of-year, then uses whichever is more
 * conservative:  the raw 18° angle result or the seasonal bound.
 *
 * Fajr effect  : seasonal adjustment pushes Fajr *later* (closer to sunrise)
 *                during winter, preventing an unreasonably early wake-up.
 * Isha  effect : seasonal adjustment pulls Isha *earlier* (closer to sunset)
 *                during spring/summer, preventing an unreasonably late prayer.
 *
 * All times are for Leicester, UK (52.6369°N) — Hanafi school.
 */

describe('MoonsightingCommittee seasonal adjustment', () => {
  const LEICESTER_LAT = 52.6369;
  const LEICESTER_LNG = -1.1398;

  describe('Fajr — seasonal adjustment in winter', () => {
    it('Feb 24: Fajr is later than the raw 18° angle (seasonal bound active)', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-02-24');
      // MoonsightingCommittee seasonal Fajr is 05:26 — later and more practical
      // than the raw 18° result (~05:08) for this date and latitude.
      expect(times.fajr).toBe('05:26');
      expect(times.sunrise).toBe('07:02');
      expect(times.zuhr).toBe('12:23');
      expect(times.asr).toBe('15:42');
      expect(times.maghrib).toBe('17:37');
      expect(times.isha).toBe('18:57');
    });
  });

  describe('Isha — seasonal adjustment caps late spring Isha', () => {
    it('Mar 19: Isha is pulled earlier by the seasonal bound', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-19');
      expect(times.maghrib).toBe('18:19');
      // Seasonal adjustment yields 19:34 — practical and earlier than the
      // raw 18° result (20:13) that the old "Other" method produced.
      expect(times.isha).toBe('19:34');
    });

    it('Isha grows gradually across the Ramadan period (no sudden jumps)', () => {
      const mar10 = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-10');
      const mar15 = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-15');
      const mar19 = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-19');

      const toMins = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };

      // Isha should advance smoothly day by day (seasonal algorithm, not a hard cap)
      expect(toMins(mar10.isha)).toBeLessThan(toMins(mar15.isha));
      expect(toMins(mar15.isha)).toBeLessThan(toMins(mar19.isha));

      // The gap between consecutive periods should be moderate (no 30+ min jump)
      expect(toMins(mar15.isha) - toMins(mar10.isha)).toBeLessThanOrEqual(15);
      expect(toMins(mar19.isha) - toMins(mar15.isha)).toBeLessThanOrEqual(15);
    });
  });
});
