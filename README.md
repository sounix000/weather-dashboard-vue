# Weather Dashboard (Vue 3)

An interactive weather dashboard — search a location, see the current
conditions, today's hourly temperature chart, and "highlights" (UV index,
visibility, wind).

This is a modernized rebuild of the project from
[*Using Vue.js To Create An Interactive Weather Dashboard With APIs*](https://www.smashingmagazine.com/2019/02/interactive-weather-dashboard-api-vue-js/)
(Smashing Magazine, 2019). The component hierarchy, data-processing logic,
and CSS are ported from that tutorial; the data sources and tooling have
been updated to work today (see **Deviations from the original** below).

## Why this needed updating, not just porting

Two of the three external services the original tutorial depends on no
longer work:

- **Dark Sky API** (the weather data source) was shut down by Apple at the
  end of 2022. The proxy URL the tutorial used to fetch it
  (`https://csm.fusioncharts.com/files/assets/wb/wb-data.php?src=darksky...`)
  no longer returns data.
- **Google Maps Geocoder** still works, but requires an API key — the
  tutorial shipped with a shared FusionCharts key that is not something a
  portfolio project should depend on.

So this isn't a stylistic refactor of working code — the original app, run
as written, cannot fetch weather data at all today.

## Deviations from the original

| Original | This project | Why |
| --- | --- | --- |
| **Dark Sky API** via a FusionCharts CORS-proxy | **[Open-Meteo Forecast API](https://open-meteo.com/en/docs)** — free, no key, CORS-enabled | Dark Sky is dead. Open-Meteo also sends proper CORS headers, so the proxy hack is no longer needed at all. |
| **Google Maps Geocoder** (`<script>` tag + API key) | **[Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api)** — free, no key | Removes the API-key requirement entirely; one less thing for someone cloning this to configure. |
| **FusionCharts** `spline` chart (commercial, watermarked on the free tier) | **Chart.js** via `vue-chartjs` | MIT-licensed, no watermark, huge ecosystem. |
| **FusionCharts** `angulargauge` (UV Index) | Custom SVG semicircular gauge (`src/components/UVIndex.vue`) | Avoids the FusionCharts dependency; uses the standard UV Index severity bands (Low/Moderate/High/Very High/Extreme) instead of the original's value-relative two-color split. |
| **FusionCharts** `hlineargauge` (Visibility) | Custom horizontal SVG/CSS gauge (`src/components/Visibility.vue`) | Same Fog/Haze/Clear zones as the original, no extra dependency. |
| Vue 2.5 + webpack 3 + vue-cli 2 + Babel 6 | **Vue 3 + Vite + Vitest** | The original toolchain is end-of-life. Vite gives instant dev server start and a one-command production build. |
| `moment` / `moment-timezone` | Native `Date`-based formatting (`src/lib/time.js`) | Open-Meteo returns timestamps already localized to the requested timezone, so no timezone conversion is needed — only formatting. `moment` is also in maintenance mode upstream. |

**What's preserved:** the component hierarchy (`App` -> `Content` ->
`TempVarChart` / `Highlights` -> `UVIndex` / `Visibility` / `WindStatus`),
the `currentWeather` / `tempVar` / `highlights` data shape, and — most
importantly — the original's actual data-processing logic:
`convertToTitleCase`, `formatPossibility`, `fahToCel`, `mileToKilometer`,
`deriveWindDir`, and the "pad the chart with high/low if too few hours of
today remain" edge case are all ported essentially line-for-line into
`src/lib/`, and are unit tested against a realistic Open-Meteo response
fixture.

## Project structure

```
src/
├── App.vue              # Root: location input, orchestration, current-weather sidebar
├── main.js               # Vue app entry point
├── style.css             # Global styles, ported from the original src/css/style.css
├── api/
│   ├── geocoding.js       # Open-Meteo Geocoding API client
│   └── weather.js          # Open-Meteo Forecast API client
├── lib/
│   ├── format.js            # convertToTitleCase, formatPossibility
│   ├── units.js              # fahToCel, mileToKilometer, metersToKilometer, deriveWindDir, ...
│   ├── time.js                 # formatTime, formatMonthDate, formatFullTime, dateKey
│   ├── weatherCodes.js          # WMO weather code -> slug (replaces Dark Sky's `icon`)
│   ├── gauge.js                  # Pure geometry helpers for the SVG gauges
│   └── normalize.js               # Raw API response -> {currentWeather, tempVar, highlights}
├── components/
│   ├── Content.vue        # Passes data down to TempVarChart + Highlights
│   ├── TempVarChart.vue    # Hourly temperature line chart (Chart.js)
│   ├── Highlights.vue       # Groups UVIndex / Visibility / WindStatus
│   ├── UVIndex.vue            # Custom SVG angular gauge
│   ├── Visibility.vue          # Custom SVG/CSS linear gauge
│   └── WindStatus.vue           # Wind speed/direction, text + icons
└── assets/                # Small original SVG icons (calendar, location, search, wind*)

tests/                     # Vitest unit + component tests (see below)
```

## Setup

Requires Node.js 18+.

```bash
npm install
npm run dev       # start the dev server (Vite)
npm run build     # production build -> dist/
npm run preview   # preview the production build
```

No API keys, accounts, or `.env` files are needed — both Open-Meteo APIs
are free and keyless.

## Testing

```bash
npm test          # run the full suite once
npm run test:watch
```

The suite covers:

- **`format.test.js`, `units.test.js`, `time.test.js`,
  `weatherCodes.test.js`, `gauge.test.js`** — unit tests for every pure
  function in `src/lib/`, including the original's edge cases (e.g.
  `deriveWindDir`'s 16 compass sectors, `formatPossibility`'s `" And"` ->
  `","` substitution).
- **`normalize.test.js`** — the full `buildDashboardData()` transform
  against a realistic Open-Meteo response fixture
  (`tests/fixtures/open-meteo-forecast.json`), including the "pad the
  chart if too few hours of today remain" edge case ported from
  `getSetHourlyTempInfoToday`.
- **`geocoding.test.js`, `weather-api.test.js`** — API clients against a
  mocked `fetch`, covering success, "not found", and HTTP error
  responses.
- **`App.test.js`** — a full mocked end-to-end run: mounts `App`, mocks
  both Open-Meteo endpoints, and verifies the default "New York" load, a
  subsequent search, and the "location not found" error path all flow
  through correctly to the rendered output.

## Possible extensions

- **Air pressure**: `src/lib/units.js` includes `milibarToKiloPascal`
  (ported from the original, where it was also unused) — Open-Meteo's
  `surface_pressure` field (in hPa = millibar) could feed a fourth
  highlight card.
- **Multi-day forecast**: request `forecast_days` > 1 from
  `fetchWeatherData` and extend `buildDashboardData` to return a forecast
  array.
- **Geolocation**: use the browser's `navigator.geolocation` to default to
  the user's current location instead of "New York".
