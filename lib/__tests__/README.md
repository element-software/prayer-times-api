# Prayer Times API Tests

This directory contains unit tests for the prayer times calculation algorithm.

## Test Files

### `prayerCalculator.test.ts`
Main test suite that validates prayer time calculations against the [Madani School Leicester timetable](https://madani.school/community.php#community_prayer).

**Test Coverage:**
- ✅ February 2026 (early Ramadan) - 3 dates
- ✅ Early March 2026 (mid Ramadan) - 3 dates  
- ✅ Late March 2026 (end of Ramadan) - 3 dates
- ✅ Edge cases and validation tests

**Results:** All core prayer times (Fajr, Dhuhr, Asr, Maghrib) match Madani School exactly ✓

### `isha-discrepancy.test.ts`
Specialized test suite documenting and analyzing the Isha time discrepancies found in late March 2026.

**Key Findings:**
- ✅ Isha matches perfectly in Feb and early March
- ⚠️ Isha shows 10-18 minute discrepancies from Mar 10 onwards
- 📊 Analysis suggests Madani Masjid may apply a seasonal adjustment (possibly 90-minute rule)

## Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run
```

## Test Data Source

All test data is sourced from the Madani Masjid (Leicester) Ramadan 2026 timetable:
- Location: Leicester, UK (52.6369°N, 1.1398°W)
- Calculation method: Fajr 18°, Isha 18°, Hanafi Asr
- Adjustments: Dhuhr +5 min, Maghrib +3 min

## Known Issues

### Isha Time Discrepancy (Late March)

**Issue:** Our calculations show a growing discrepancy for Isha time in late March when days are longer.

**Examples:**
- **Mar 10**: Calculated 19:55, Expected 19:45 (10 min diff)
- **Mar 19**: Calculated 20:13, Expected 19:55 (18 min diff)

**Hypothesis:**  
Madani Masjid may implement a seasonal adjustment (e.g., 90-minute maximum interval after Maghrib) to prevent Isha from being too late. This is a common practice in UK mosques during longer days.

**Status:** Documented and tracked in `isha-discrepancy.test.ts`. Consider implementing optional seasonal adjustments if this becomes a requirement.

## Contributing

When adding new test cases:
1. Source data from the Madani School timetable
2. Document the date and expected times
3. Add notes for any discrepancies
4. Update this README if you discover new patterns
