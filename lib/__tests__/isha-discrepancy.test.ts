import { describe, it, expect } from 'vitest';
import { calculatePrayerTimes } from '../prayerCalculator';

/**
 * Isha Time Tests (90-minute cap)
 *
 * We cap Isha at Maghrib + 90 minutes when the 18° calculation would be
 * later (UK mosque practice). This aligns better with timetables such as
 * Madani School (https://madani.school/community.php#community_prayer).
 */

describe('Isha Time Discrepancy Analysis', () => {
  const LEICESTER_LAT = 52.6369;
  const LEICESTER_LNG = -1.1398;

  describe('With 90-minute Isha cap (UK mosque practice)', () => {
    it('Feb 21, 2026 - Isha capped at Maghrib + 90 min', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-02-21');
      expect(times.isha).toBe('19:01'); // Maghrib 17:31 + 90 min
    });

    it('Mar 1, 2026 - Isha capped at Maghrib + 90 min', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-01');
      expect(times.isha).toBe('19:16'); // Maghrib 17:46 + 90 min
    });

    it('Mar 10, 2026 - Isha capped at Maghrib + 90 min', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-10');
      expect(times.isha).toBe('19:33'); // Maghrib 18:03 + 90 min
    });

    it('Mar 19, 2026 - Isha capped at Maghrib + 90 min', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-19');
      expect(times.isha).toBe('19:49'); // Maghrib 18:19 + 90 min (closer to Madani 19:55)
    });
  });

  describe('Isha interval analysis', () => {
    it('should cap Isha at 90 min after Maghrib when 18° would be later', () => {
      const dates = [
        '2026-02-21',
        '2026-03-01',
        '2026-03-10',
        '2026-03-19',
      ];
      
      dates.forEach(date => {
        const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, date);
        const [maghribH, maghribM] = times.maghrib.split(':').map(Number);
        const [ishaH, ishaM] = times.isha.split(':').map(Number);
        const maghribMins = maghribH * 60 + maghribM;
        const ishaMins = ishaH * 60 + ishaM;
        const interval = ishaMins - maghribMins;
        
        console.log(`${date}: Maghrib ${times.maghrib}, Isha ${times.isha}, Interval: ${interval} min`);
        expect(interval).toBeLessThanOrEqual(90);
      });
    });
  });

  describe('90-minute cap applied', () => {
    it('returns Isha at Maghrib + 90 min for Mar 19 (was 20:13 uncapped)', () => {
      const mar19 = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-19');
      expect(mar19.maghrib).toBe('18:19');
      expect(mar19.isha).toBe('19:49'); // 90 min after Maghrib; Madani shows 19:55
    });
  });
});
