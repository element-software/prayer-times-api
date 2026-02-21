import { describe, it, expect } from 'vitest';
import { calculatePrayerTimes } from '../prayerCalculator';

/**
 * Isha Time Discrepancy Tests
 * 
 * This test suite documents known discrepancies between our calculation
 * and the Madani School timetable, specifically for Isha prayer time
 * in late Ramadan (mid-March 2026) when days are longer.
 * 
 * Source: https://madani.school/community.php#community_prayer
 * 
 * OBSERVED PATTERN:
 * - Early Ramadan (Feb): Isha calculations match perfectly ✓
 * - Mid Ramadan (early Mar): Isha calculations match perfectly ✓
 * - Late Ramadan (mid-late Mar): Isha shows discrepancies ✗
 * 
 * HYPOTHESIS:
 * Madani Masjid may be applying a seasonal adjustment or fixed maximum
 * Isha interval (possibly 90 minutes after Maghrib) when days get longer,
 * while our algorithm uses a strict 18° calculation throughout.
 * 
 * This is common practice in UK mosques to prevent Isha from being
 * too late during longer days.
 */

describe('Isha Time Discrepancy Analysis', () => {
  const LEICESTER_LAT = 52.6369;
  const LEICESTER_LNG = -1.1398;

  describe('Matching dates (early Ramadan)', () => {
    it('Feb 21, 2026 - Isha matches perfectly', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-02-21');
      expect(times.isha).toBe('19:23'); // ✓ Match
    });

    it('Mar 1, 2026 - Isha matches perfectly', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-01');
      expect(times.isha).toBe('19:37'); // ✓ Match
    });
  });

  describe('Discrepancy dates (late Ramadan)', () => {
    it('Mar 10, 2026 - Isha shows 10 min discrepancy', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-10');
      
      // Our calculation: 19:55
      expect(times.isha).toBe('19:55');
      
      // Madani School expected: 19:45
      const expectedIsha = '19:45';
      const discrepancyMinutes = 10;
      
      // Document the discrepancy
      expect(times.isha).not.toBe(expectedIsha);
      console.log(`Mar 10: Calculated ${times.isha}, Expected ${expectedIsha}, Diff: ${discrepancyMinutes} min`);
    });

    it('Mar 19, 2026 - Isha shows 18 min discrepancy', () => {
      const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-19');
      
      // Our calculation: 20:13
      expect(times.isha).toBe('20:13');
      
      // Madani School expected: 19:55
      const expectedIsha = '19:55';
      const discrepancyMinutes = 18;
      
      // Document the discrepancy
      expect(times.isha).not.toBe(expectedIsha);
      console.log(`Mar 19: Calculated ${times.isha}, Expected ${expectedIsha}, Diff: ${discrepancyMinutes} min`);
    });
  });

  describe('Isha interval analysis', () => {
    it('should show increasing Isha interval as days get longer', () => {
      const dates = [
        '2026-02-21',
        '2026-03-01',
        '2026-03-10',
        '2026-03-19',
      ];
      
      const intervals: number[] = [];
      
      dates.forEach(date => {
        const times = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, date);
        
        // Calculate minutes after Maghrib
        const [maghribH, maghribM] = times.maghrib.split(':').map(Number);
        const [ishaH, ishaM] = times.isha.split(':').map(Number);
        const maghribMins = maghribH * 60 + maghribM;
        const ishaMins = ishaH * 60 + ishaM;
        const interval = ishaMins - maghribMins;
        
        intervals.push(interval);
        console.log(`${date}: Maghrib ${times.maghrib}, Isha ${times.isha}, Interval: ${interval} min`);
      });
      
      // Verify intervals are reasonable (between 90-120 minutes)
      intervals.forEach(interval => {
        expect(interval).toBeGreaterThan(90);
        expect(interval).toBeLessThan(120);
      });
    });
  });

  describe('Potential solutions', () => {
    it('documents the 90-minute rule hypothesis', () => {
      // This test documents that Madani Masjid may use a 90-minute
      // maximum interval for Isha after Maghrib during longer days
      
      const mar19 = calculatePrayerTimes(LEICESTER_LAT, LEICESTER_LNG, '2026-03-19');
      
      // Calculate what Isha would be with 90-min rule
      const [maghribH, maghribM] = mar19.maghrib.split(':').map(Number);
      const maghribMins = maghribH * 60 + maghribM;
      const isha90Min = maghribMins + 90;
      const isha90H = Math.floor(isha90Min / 60);
      const isha90M = isha90Min % 60;
      const isha90Formatted = `${isha90H.toString().padStart(2, '0')}:${isha90M.toString().padStart(2, '0')}`;
      
      console.log('Mar 19 Analysis:');
      console.log(`  Maghrib: ${mar19.maghrib}`);
      console.log(`  Isha (18° calc): ${mar19.isha}`);
      console.log(`  Isha (90-min rule): ${isha90Formatted}`);
      console.log(`  Madani expected: 19:55`);
      
      // The 90-minute rule gives 19:49, closer to Madani's 19:55
      expect(isha90Formatted).toBe('19:49');
    });
  });
});
