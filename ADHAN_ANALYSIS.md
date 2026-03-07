# Adhan npm Package — Analysis Summary

## Overview

[adhan](https://github.com/batoulapps/adhan-js) (v4.4.3) is an MIT-licensed JavaScript/TypeScript library for calculating Islamic prayer times. It is one port in a family of cross-platform implementations (iOS, Android, Java, Python, etc.) all sharing the same underlying algorithms.

All astronomical equations are drawn directly from the book **"Astronomical Algorithms"** by Jean Meeus — the reference recommended by the U.S. Naval Observatory — making the library both high-precision and academically grounded. The compiled library is approximately 1,400 lines of JavaScript across 20 modules.

---

## Module Architecture

| Module | Lines | Purpose |
|---|---|---|
| `Astronomical.js` | 360 | Core engine: Julian Day, solar coordinates, hour angle, seasonal twilight |
| `PrayerTimes.js` | 207 | Main class: orchestrates all calculation steps |
| `CalculationParameters.js` | 121 | Configuration: angles, madhab, rounding, high-lat rule |
| `PolarCircleResolution.js` | 113 | Handles undefined prayer times inside Arctic/Antarctic circles |
| `CalculationMethod.js` | 106 | Factory presets (MWL, MoonsightingCommittee, Karachi, etc.) |
| `SolarTime.js` | 61 | Solar transit, sunrise, sunset, afternoon shadow per location/date |
| `SolarCoordinates.js` | 61 | Right ascension, declination, apparent sidereal time |
| `DateUtils.js` | 66 | Date arithmetic (add minutes/seconds/days, rounding) |
| `SunnahTimes.js` | 31 | Middle and last third of the night (Qiyam) |
| `Qibla.js` | 22 | Great-circle bearing to Makkah |

---

## Computation Logic

The library computes prayer times in a well-defined pipeline:

1. **Julian Day** — The Gregorian date is converted to a Julian Day Number, which is then converted to a Julian Century (`T = (JD − 2451545) / 36525`). All subsequent equations are in terms of `T`.

2. **Solar Coordinates** — Using `T`, the library solves for the sun's geometric mean longitude, mean anomaly, equation of the centre, apparent longitude, obliquity of the ecliptic, right ascension, and declination, plus nutation corrections. This gives a precise position of the sun in the sky for the given date.

3. **Approximate Solar Transit** — The time at which the sun crosses the observer's meridian is estimated from sidereal time and right ascension, then refined iteratively (`correctedTransit`).

4. **Sunrise and Sunset** — Computed as the hour angle at which the sun's geometric centre is 0.833° below the horizon (accounting for refraction and the sun's angular radius). Three consecutive days of solar coordinates are used for interpolated precision.

5. **Dhuhr** — Solar transit (noon) with an optional minute adjustment.

6. **Asr** — The afternoon shadow-length formula: `angle = atan(1 / (shadowLength + tan(|latitude − declination|)))`. Shadow length is 1 (Shafi) or 2 (Hanafi).

7. **Fajr and Isha** — The hour angle at which the sun is a given number of degrees below the horizon (the `fajrAngle` and `ishaAngle` parameters). For Isha, an interval-based variant (e.g., 90 min after Maghrib) is also supported.

8. **High Latitude Rules** — For locations above ~48°N/S, the standard angle calculation may produce no valid time or an impractical one. Three strategies are available:
   - `MiddleOfTheNight`: Fajr no earlier than, and Isha no later than, the midpoint between sunset and next sunrise.
   - `SeventhOfTheNight`: Bounds based on 1/7 of the night duration.
   - `TwilightAngle`: Bounds derived from the Fajr/Isha angles divided by 60.

9. **MoonsightingCommittee Seasonal Adjustment** — This method applies a special latitude- and day-of-year-based correction (`seasonAdjustedMorningTwilight` / `seasonAdjustedEveningTwilight`) that smooths Fajr and Isha across the year, making it particularly well-suited for the UK and North America.

10. **Minute Adjustments and Rounding** — Method-level and user-level per-prayer minute offsets are added last. Times are then rounded to the nearest, next, or exact minute.

---

## What This Repository Currently Uses

```ts
// lib/prayerCalculator.ts
const params = new CalculationParameters("Other", 18, 18); // custom UK Standard
params.madhab = school === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
params.methodAdjustments = { dhuhr: 5, maghrib: 3, ... };
const prayerTimes = new AdhanPrayerTimes(coordinates, date, params);
```

- `Coordinates`, `CalculationParameters`, `PrayerTimes`, `Madhab` — the core API.
- Custom 18°/18° method with +5 min Dhuhr and +3 min Maghrib adjustments.
- Hanafi and Shafi Asr variants.

## Adhan Features Not Yet Used

| Feature | Relevance |
|---|---|
| `CalculationMethod.MoonsightingCommittee()` | Built-in UK/North America preset with seasonal adjustments |
| `HighLatitudeRule` | Important for accurate UK times in summer (Scotland especially) |
| `Shafaq.Ahmer / Abyad` | More precise Isha at high latitudes via MoonsightingCommittee |
| `PolarCircleResolution` | Required for locations near the Arctic (e.g., Scotland in June) |
| `SunnahTimes` | Qiyam — middle of the night and last third |
| `Qibla` | Direction to Makkah |
| `currentPrayer()` / `nextPrayer()` | Countdown utilities |

---

## Verdict: Suitability for Creating Our Own Package

**adhan is well-suited as the engine for our own package.**

### Arguments for wrapping adhan (not reimplementing)

1. **The astronomical math is non-trivial.** The `Astronomical.js` module alone is 360 lines of precise trigonometry, referencing multi-term polynomial equations from Meeus's book. Reimplementing and validating this from scratch carries a high risk of subtle precision errors.

2. **adhan is battle-tested.** The library has ports in five languages, is used in production apps worldwide, and has an extensive test suite against real-world prayer timetables.

3. **MIT license.** The code can be studied, adapted, and distributed freely.

4. **Our value is not the astronomical engine.** The value we add is the API surface, UK city database, BST/GMT handling, caching, and opinionated defaults. These live entirely above adhan.

5. **Our current wrapper is already thin.** `prayerCalculator.ts` is 67 lines. Any "own package" we build would delegate to adhan or a copy of adhan's core anyway.

### Recommended approach

Create an npm package (e.g., `@element-software/prayer-times`) that:

- Declares `adhan` as a **peer dependency** (so consumers share one copy) or bundles only the modules it uses.
- Exports a clean, opinionated TypeScript API with UK defaults (18°/18°, Hanafi Asr, Dhuhr +5 min, Maghrib +3 min).
- Includes the UK city database and timezone handling.
- Exposes daily and monthly timetable helpers.
- Re-exports the `HighLatitudeRule`, `Madhab`, and `Shafaq` enums for advanced callers.

This gives full control over the public API and versioning, while keeping the precision and trust of adhan's astronomical core.
