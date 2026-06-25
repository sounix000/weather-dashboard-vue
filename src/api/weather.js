/**
 * Weather data client.
 *
 * The original tutorial fetched data from the Dark Sky API via a
 * FusionCharts proxy URL (`https://csm.fusioncharts.com/.../wb-data.php`),
 * which existed solely to work around CORS — Dark Sky did not send the
 * necessary CORS headers for direct client-side requests.
 *
 * Dark Sky was shut down by Apple at the end of 2022, so that endpoint no
 * longer returns data at all. This replaces it with Open-Meteo's free
 * Forecast API (https://open-meteo.com/en/docs), which is CORS-enabled —
 * **no proxy is needed**.
 *
 * Requested in Fahrenheit / mph so that `fahToCel()` and `mileToKilometer()`
 * from the original tutorial remain meaningful (see `src/lib/normalize.js`).
 */

const FORECAST_ENDPOINT = 'https://api.open-meteo.com/v1/forecast';

const HOURLY_FIELDS = ['temperature_2m', 'uv_index', 'visibility'].join(',');
const DAILY_FIELDS = ['temperature_2m_max', 'temperature_2m_min'].join(',');
const CURRENT_FIELDS = ['temperature_2m', 'weather_code', 'wind_speed_10m', 'wind_direction_10m'].join(',');

/**
 * Fetch the current weather, today's hourly temperatures, and today's
 * high/low for a given location.
 *
 * @param {number} lat - latitude.
 * @param {number} long - longitude.
 * @returns {Promise<object>} raw Open-Meteo forecast response.
 * @throws {Error} if the request fails.
 */
export async function fetchWeatherData(lat, long) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: long,
    current: CURRENT_FIELDS,
    hourly: HOURLY_FIELDS,
    daily: DAILY_FIELDS,
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timezone: 'auto',
    forecast_days: '1',
  });

  const response = await fetch(`${FORECAST_ENDPOINT}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Weather request failed with status ${response.status}`);
  }

  return response.json();
}
