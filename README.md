# prayer-times-api

Islamic prayer times API for you to consume for your apps and integrations; compatible across the world.

A production-ready REST API built with **Next.js (App Router)**, **TypeScript**, and **TailwindCSS** that calculates Islamic prayer times using astronomical formulas via the [adhan](https://github.com/batoulapps/adhan-js) library. Stateless, no database, no external API calls.

---

## Features

- 🕌 Calculates Fajr, Zuhr, Asr, Maghrib, Isha
- 🇬🇧 Predefined UK cities with accurate coordinates
- 📍 Supports explicit latitude/longitude input
- 📅 Optional date parameter (defaults to today)
- 🕐 Timezone-aware (Europe/London, BST/GMT handled automatically)
- ⚡ In-memory caching per city/coordinate + date combination
- 🧮 UK Standard calculation method (Fajr 18°, Isha 18°, Shafi Asr)

---

## API

### Endpoint

```
GET /api/prayer-times
```

### Query Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `city` | Required if no lat/lng | One of the supported UK cities |
| `lat` | Required if no city | Latitude (decimal degrees) |
| `lng` | Required if no city | Longitude (decimal degrees) |
| `date` | Optional | Date in `YYYY-MM-DD` format (defaults to today) |

### Supported Cities

`London`, `Birmingham`, `Manchester`, `Leicester`, `Bradford`, `Glasgow`, `Leeds`, `Liverpool`, `Sheffield`

### Example Requests

```bash
# By city
GET /api/prayer-times?city=Leicester

# By city and date
GET /api/prayer-times?city=Leicester&date=2026-02-21

# By coordinates
GET /api/prayer-times?lat=52.6369&lng=-1.1398

# By coordinates and date
GET /api/prayer-times?lat=52.6369&lng=-1.1398&date=2026-02-21
```

### Successful Response (HTTP 200)

```json
{
  "location": {
    "city": "Leicester",
    "latitude": 52.6369,
    "longitude": -1.1398,
    "timezone": "Europe/London"
  },
  "date": "2026-02-21",
  "calculation_method": "UK Standard (Fajr 18°, Isha 18°)",
  "prayer_times": {
    "fajr": "05:12",
    "zuhr": "12:21",
    "asr": "15:18",
    "maghrib": "17:42",
    "isha": "18:58"
  }
}
```

### Error Response (HTTP 400)

```json
{
  "error": "Unknown city: \"xyz\". Supported cities: London, Birmingham, Manchester, Leicester, Bradford, Glasgow, Leeds, Liverpool, Sheffield."
}
```

---

## Calculation Method

- **Fajr**: 18° below horizon
- **Zuhr**: Solar noon (Dhuhr)
- **Asr**: Standard (Shafi) method
- **Maghrib**: Sunset
- **Isha**: 18° below horizon
- **Timezone**: Europe/London (BST/GMT auto-handled)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the frontend UI.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
├── app/
│   ├── api/
│   │   └── prayer-times/
│   │       └── route.ts       # REST API endpoint
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx               # Frontend UI
├── lib/
│   ├── cache.ts               # In-memory caching
│   ├── cities.ts              # UK city coordinates
│   ├── prayerCalculator.ts    # adhan-based calculation
│   └── types.ts               # TypeScript interfaces
├── next.config.ts
├── package.json
└── tsconfig.json
```

---

## Deploy to Vercel

```bash
npx vercel
```

No environment variables required — fully stateless.

