/**
 * Transform a raw Open-Meteo "forecast" API response into the
 * `currentWeather` / `tempVar` / `highlights` shape consumed by the Vue
 * components — the same shape `App.vue`'s `data()` held in the original
 * tutorial, just populated from a different upstream API.
 *
 * Expects the API to have been called with:
 *   temperature_unit=fahrenheit, wind_speed_unit=mph, timezone=auto
 * (see `src/api/weather.js`), so that `fahToCel` / `mileToKilometer` from
 * the original tutorial remain meaningful.
 */

import { fahToCel, mileToKilometer, metersToKilometer, deriveWindDir } from './units.js';
import { formatTime, formatFullTime, dateKey } from './time.js';
import { convertToTitleCase, formatPossibility } from './format.js';
import { weatherCodeToSlug } from './weatherCodes.js';

function round4(value) {
  return Math.round(value * 10000) / 10000;
}

/**
 * Format a latitude as e.g. `'27.1747°N'` (south of the equator uses `'S'`).
 * Ported from `setFormatCoordinates` in the original App.vue.
 */
export function formatLatitude(lat) {
  if (lat > 0) return `${round4(lat)}\u00B0N`;
  if (lat < 0) return `${round4(-lat)}\u00B0S`;
  return `${round4(lat)}`;
}

/**
 * Format a longitude as e.g. `'78.0421°E'` (west of the prime meridian uses `'W'`).
 * Ported from `setFormatCoordinates` in the original App.vue.
 */
export function formatLongitude(long) {
  if (long > 0) return `${round4(long)}\u00B0E`;
  if (long < 0) return `${round4(-long)}\u00B0W`;
  return `${round4(long)}`;
}

/**
 * Find, within `hourly.temperature_2m`, the index (among `indices`) holding
 * the maximum and minimum temperature.
 */
function findHighLowIndices(hourly, indices) {
  let maxIdx = indices[0];
  let minIdx = indices[0];

  for (const i of indices) {
    if (hourly.temperature_2m[i] > hourly.temperature_2m[maxIdx]) maxIdx = i;
    if (hourly.temperature_2m[i] < hourly.temperature_2m[minIdx]) minIdx = i;
  }

  return { maxIdx, minIdx };
}

/**
 * Build the dashboard's `currentWeather` / `tempVar` / `highlights` data
 * from a raw Open-Meteo forecast response.
 *
 * @param {object} apiResponse - parsed JSON from `fetchWeatherData()`.
 * @throws {Error} if the response contains no hourly data for "today"
 *   (the date of `apiResponse.current.time`).
 */
export function buildDashboardData(apiResponse) {
  const { current, hourly, daily } = apiResponse;

  const todayKey = dateKey(current.time);
  const todayIndices = hourly.time
    .map((time, index) => ({ time, index }))
    .filter((entry) => dateKey(entry.time) === todayKey)
    .map((entry) => entry.index);

  if (todayIndices.length === 0) {
    throw new Error('No hourly data available for the current day');
  }

  const tempToday = todayIndices.map((i) => ({
    hour: formatTime(hourly.time[i]),
    temp: fahToCel(hourly.temperature_2m[i]).toString(),
  }));

  const { maxIdx, minIdx } = findHighLowIndices(hourly, todayIndices);

  // Ported edge case from `getSetHourlyTempInfoToday`: if there are two or
  // fewer hours of "today" left in the hourly series (e.g. it's 11pm),
  // prepend today's high/low so the chart still renders with >= 4 points.
  if (tempToday.length <= 2) {
    tempToday.unshift(
      {
        hour: formatTime(hourly.time[maxIdx]),
        temp: fahToCel(hourly.temperature_2m[maxIdx]).toString(),
      },
      {
        hour: formatTime(hourly.time[minIdx]),
        temp: fahToCel(hourly.temperature_2m[minIdx]).toString(),
      }
    );
  }

  const currentHourIdx = hourly.time.indexOf(current.time);
  const extrasIdx = currentHourIdx === -1 ? todayIndices[0] : currentHourIdx;

  const slug = weatherCodeToSlug(current.weather_code);

  return {
    currentWeather: {
      time: formatFullTime(current.time),
      temp: fahToCel(current.temperature_2m),
      todayHighLow: {
        todayTempHigh: fahToCel(daily.temperature_2m_max[0]),
        todayTempHighTime: formatTime(hourly.time[maxIdx]),
        todayTempLow: fahToCel(daily.temperature_2m_min[0]),
        todayTempLowTime: formatTime(hourly.time[minIdx]),
      },
      summary: convertToTitleCase(slug.replace(/-/g, ' ')),
      possibility: formatPossibility(slug),
    },
    tempVar: {
      tempToday,
    },
    highlights: {
      uvIndex: Math.round(hourly.uv_index[extrasIdx] ?? 0),
      visibility: metersToKilometer(hourly.visibility[extrasIdx] ?? 0),
      windStatus: {
        windSpeed: mileToKilometer(current.wind_speed_10m),
        windDirection: current.wind_direction_10m,
        derivedWindDirection: deriveWindDir(current.wind_direction_10m),
      },
    },
  };
}
