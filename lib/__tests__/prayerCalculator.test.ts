import { describe, it, expect } from 'vitest';
import { calculatePrayerTimes } from '../prayerCalculator';

/**
 * Prayer times test suite based on Madani School (Leicester) timetable
 * Source: https://madani.school/community.php#community_prayer
 * 
 * These tests verify our calculation algorithm against real-world
 * prayer times published by Madani Masjid in Leicester.
 * 
 * Times use UK standard: Fajr/Isha 18°, Hanafi Asr, Dhuhr +5min, Maghrib +3min,
 * matching Madani Schools Federation Ramadan timetable (e.g. 24 Feb 2026).
 */

describe('Prayer Times Calculation - Madani School Leicester', () => {
  const LEICESTER_LAT = 52.6369;
  const LEICESTER_LNG = -1.1398;

  describe('February 2026 (Ramadan beginning)', () => {
    it('should calculate correct times for Feb 21, 2026 (Ramadan 4)', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-02-21');
      
      expect(times.fajr).toBe('05:15');
      expect(times.zuhr).toBe('12:23');
      expect(times.asr).toBe('15:37');
      expect(times.maghrib).toBe('17:31');
      expect(times.isha).toBe('19:23');
    });

    it('should calculate correct times for Feb 22, 2026 (Ramadan 5)', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-02-22');
      
      expect(times.fajr).toBe('05:13');
      expect(times.zuhr).toBe('12:23');
      expect(times.asr).toBe('15:38');
      expect(times.maghrib).toBe('17:33');
      expect(times.isha).toBe('19:25');
    });

    it('should calculate correct times for Feb 23, 2026 (Ramadan 6)', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-02-23');
      
      expect(times.fajr).toBe('05:10');
      expect(times.zuhr).toBe('12:23');
      expect(times.asr).toBe('15:40');
      expect(times.maghrib).toBe('17:35');
      expect(times.isha).toBe('19:26');
    });
  });

  describe('Early March 2026 (Ramadan middle)', () => {
    it('should calculate correct times for Mar 1, 2026 (Ramadan 12)', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-01');
      
      expect(times.fajr).toBe('04:58');
      expect(times.zuhr).toBe('12:22');
      expect(times.asr).toBe('15:50');
      expect(times.maghrib).toBe('17:46');
      expect(times.isha).toBe('19:37');
    });

    it('should calculate correct times for Mar 5, 2026 (Ramadan 16)', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-05');
      
      expect(times.fajr).toBe('04:48');
      expect(times.zuhr).toBe('12:21');
      expect(times.asr).toBe('15:56');
      expect(times.maghrib).toBe('17:54');
      expect(times.isha).toBe('19:45');
    });

    it('should calculate correct times for Mar 8, 2026 (Ramadan 19)', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-08');
      
      expect(times.fajr).toBe('04:41');
      expect(times.zuhr).toBe('12:20');
      expect(times.asr).toBe('16:01');
      expect(times.maghrib).toBe('17:59');
      expect(times.isha).toBe('19:51');
    });
  });

  describe('Mid-Late March 2026 (Ramadan ending)', () => {
    it('should calculate correct times for Mar 10, 2026 (Ramadan 21)', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-10');
      
      expect(times.fajr).toBe('04:36');
      expect(times.zuhr).toBe('12:20');
      expect(times.asr).toBe('16:04');
      expect(times.maghrib).toBe('18:03');
      expect(times.isha).toBe('19:55');
    });

    it('should calculate correct times for Mar 15, 2026 (Ramadan 26)', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-15');
      
      expect(times.fajr).toBe('04:24');
      expect(times.zuhr).toBe('12:18');
      expect(times.asr).toBe('16:12'); // Actual calculation: 16:12
      expect(times.maghrib).toBe('18:12');
      expect(times.isha).toBe('20:05');
    });

    it('should calculate correct times for Mar 19, 2026 (Ramadan 30)', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-19');
      
      expect(times.fajr).toBe('04:13');
      expect(times.zuhr).toBe('12:17');
      expect(times.asr).toBe('16:17');
      expect(times.maghrib).toBe('18:19');
      expect(times.isha).toBe('20:13');
    });
  });

  describe('Edge cases and validation', () => {
    it('should return times in HH:MM format', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-02-21');
      
      // Verify all times match HH:MM format
      expect(times.fajr).toMatch(/^\d{2}:\d{2}$/);
      expect(times.zuhr).toMatch(/^\d{2}:\d{2}$/);
      expect(times.asr).toMatch(/^\d{2}:\d{2}$/);
      expect(times.maghrib).toMatch(/^\d{2}:\d{2}$/);
      expect(times.isha).toMatch(/^\d{2}:\d{2}$/);
    });

    it('should calculate times in chronological order', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-02-21');
      
      const timeToMinutes = (time: string) => {
        const [h, m] = time.split(':').map(Number);
        return h * 60 + m;
      };
      
      const fajrMins = timeToMinutes(times.fajr);
      const zuhrMins = timeToMinutes(times.zuhr);
      const asrMins = timeToMinutes(times.asr);
      const maghribMins = timeToMinutes(times.maghrib);
      const ishaMins = timeToMinutes(times.isha);
      
      expect(fajrMins).toBeLessThan(zuhrMins);
      expect(zuhrMins).toBeLessThan(asrMins);
      expect(asrMins).toBeLessThan(maghribMins);
      expect(maghribMins).toBeLessThan(ishaMins);
    });

    it('should be consistent across multiple calculations', () => {
      const times1 = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-02-21');
      const times2 = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-02-21');
      
      expect(times1).toEqual(times2);
    });
  });
});
