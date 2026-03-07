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
const params = CalculationMethod.MoonsightingCommittee(); // UK standard method
params.madhab = school === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
const prayerTimes = new AdhanPrayerTimes(coordinates, date, params);
```

- `Coordinates`, `CalculationMethod`, `PrayerTimes`, `Madhab` — the core API.
- `MoonsightingCommittee` preset: 18°/18° angles, Dhuhr +5 min, Maghrib +3 min, **plus seasonal twilight adjustment**.
- Hanafi and Shafi Asr variants.

## Unused Features — What They Do and Whether They Improve Accuracy

### 1. `HighLatitudeRule`

**What it does:** Provides a safety net for Fajr and Isha at high latitudes where the sun may not reach the required depression angle. Three strategies exist:

| Rule | Behaviour |
|---|---|
| `MiddleOfTheNight` | Fajr no earlier than, Isha no later than, the midpoint between sunset and the next sunrise. |
| `SeventhOfTheNight` | Bounds Fajr/Isha to the first/last seventh of the night. Recommended above 48°N. |
| `TwilightAngle` | Derives the bound from the depression angle (angle ÷ 60 × night duration). |

**Would it improve accuracy?** For the UK cities currently supported (51–56°N), the `MoonsightingCommittee` seasonal adjustment already handles the high-latitude problem via its own algorithm (`seasonAdjustedMorningTwilight` / `seasonAdjustedEveningTwilight`). Adding `HighLatitudeRule` on top of `MoonsightingCommittee` would be redundant — adhan's `PrayerTimes` class only invokes the seasonal adjustment path when the method is `MoonsightingCommittee`, regardless of `highLatitudeRule`. It would become relevant if the method were ever changed away from `MoonsightingCommittee`.

### 2. `Shafaq.Ahmer` / `Shafaq.Abyad`

**What it does:** Controls which type of evening twilight the `MoonsightingCommittee` method uses to compute Isha:

| Value | Meaning | Isha timing |
|---|---|---|
| `Shafaq.General` (default) | Combination of Ahmer and Abyad — more forgiving at high latitudes. | Most balanced; default for UK/North America. |
| `Shafaq.Ahmer` | Red twilight (reddish glow on the horizon). Used by Shafi, Maliki, and Hanbali madhabs. | Produces an **earlier** Isha. |
| `Shafaq.Abyad` | White twilight (white glow on the horizon). Used by the Hanafi madhab. | Produces a **later** Isha. |

**Would it improve accuracy?** For Hanafi practitioners, `Shafaq.Abyad` is technically the correct opinion — Hanafi fiqh holds that Isha begins when the white twilight disappears, not just the red. Setting `params.shafaq = Shafaq.Abyad` when the school is Hanafi would produce a slightly later Isha that is more aligned with the stricter Hanafi position. This is a small but theologically meaningful improvement and could be exposed as an optional parameter in future.

### 3. `PolarCircleResolution`

**What it does:** Resolves prayer times for locations inside the Arctic or Antarctic circles, where sunrise or sunset may not occur at all for days or weeks. Two fallback strategies:

| Value | Behaviour |
|---|---|
| `AqrabBalad` | Borrows prayer times from the nearest location where sunrise/sunset can be computed. |
| `AqrabYaum` | Borrows prayer times from the closest date (forward or backward) on which sunrise/sunset occurs. |

**Would it improve accuracy?** Not relevant for the current UK city set. However, if the API is extended to support coordinates anywhere in the world, enabling `AqrabYaum` (the more commonly accepted opinion) would prevent `undefined` times from being returned for users querying extreme northern locations. It is a correctness improvement, not an accuracy one.

### 4. `SunnahTimes`

**What it does:** Calculates the two Qiyam (night prayer) times given an existing `PrayerTimes` object:

- `middleOfTheNight` — Midpoint between Maghrib and the next day's Fajr.
- `lastThirdOfTheNight` — Start of the last third of the night (the recommended time for Tahajjud).

**Would it improve accuracy?** Not applicable — Sunnah times are not prayer obligations and are currently outside the scope of this API. They would be a pure feature addition.

### 5. `Qibla`

**What it does:** Computes the great-circle bearing (in degrees from North) from any coordinates to the Kaaba in Makkah (21.4225°N, 39.8262°E), using spherical trigonometry.

**Would it improve accuracy?** Not applicable to prayer time calculations. It is a separate feature that would complement the API well for users who also need a compass direction.

### 6. `currentPrayer()` / `nextPrayer()`

**What they do:** Instance methods on `PrayerTimes` that return the current or next prayer name (as a `Prayer` enum) based on the current wall-clock time.

**Would they improve accuracy?** No — they are convenience utilities. They would be useful for a countdown-to-next-prayer feature in a client application consuming this API.

---

## Why MoonsightingCommittee Was Adopted

The previous implementation used `CalculationParameters("Other", 18, 18)` with manually set Dhuhr/Maghrib adjustments. While the base angles (18°/18°) and the minute offsets (Dhuhr +5, Maghrib +3) were identical to `MoonsightingCommittee`, the critical difference was the **absence of the seasonal twilight adjustment**.

During British summer and the approach to it, 18° astronomical twilight can persist all night at UK latitudes, meaning the raw angle calculation produces no valid Fajr or Isha time (or returns an impractically early/late one). The `MoonsightingCommittee` seasonal algorithm — based on Khalid Shaukat's work — smoothly interpolates a practical bound across the year using the observer's latitude and the day-of-year offset from the nearest solstice. This is precisely the algorithm endorsed by the UK Islamic Sharia Council and widely used by British mosques.

**Before (raw 18° — no seasonal adjustment):**

| Date | Fajr | Isha |
|---|---|---|
| Feb 21, 2026 | 05:15 | 19:23 |
| Mar 19, 2026 | 04:13 | 20:13 |

**After (MoonsightingCommittee — seasonal adjustment active):**

| Date | Fajr | Isha |
|---|---|---|
| Feb 21, 2026 | 05:32 | 18:53 |
| Mar 19, 2026 | 04:36 | 19:34 |

The seasonal adjustment makes Fajr **later** in winter (preventing an unreasonably early pre-dawn time) and Isha **earlier** in spring/summer (preventing an unreasonably late night prayer). Dhuhr, Asr, Sunrise, and Maghrib are unaffected.

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
- Exports a clean, opinionated TypeScript API defaulting to `MoonsightingCommittee` with Hanafi Asr (the UK standard).
- Includes the UK city database and timezone handling.
- Exposes daily and monthly timetable helpers.
- Re-exports the `HighLatitudeRule`, `Madhab`, and `Shafaq` enums for advanced callers, with `Shafaq.Abyad` as the optional Hanafi-correct Isha mode.

This gives full control over the public API and versioning, while keeping the precision and trust of adhan's astronomical core.
