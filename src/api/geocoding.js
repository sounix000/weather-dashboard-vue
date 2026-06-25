/**
 * Geocoding client.
 *
 * The original tutorial used the Google Maps Geocoder JavaScript API
 * (loaded via a `<script>` tag with an API key) inside `getCoordinates()`.
 * This replaces it with Open-Meteo's free Geocoding API
 * (https://open-meteo.com/en/docs/geocoding-api) — no API key required,
 * and CORS-enabled for direct client-side use.
 */

const GEOCODING_ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';

/**
 * Look up coordinates for a place name.
 *
 * @param {string} query - place name entered by the user, e.g. `'New York'`.
 * @returns {Promise<{lat: number, long: number, full_location: string}>}
 * @throws {Error} if the location cannot be found, or the request fails.
 */
export async function geocodeLocation(query) {
  const url = `${GEOCODING_ENDPOINT}?name=${encodeURIComponent(query)}&count=1`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Geocoding request failed with status ${response.status}`);
  }

  const data = await response.json();
  const result = data.results?.[0];

  if (!result) {
    throw new Error(`Couldn't find a location matching "${query}"`);
  }

  const full_location = [result.name, result.admin1, result.country]
    .filter(Boolean)
    .join(', ');

  return {
    lat: result.latitude,
    long: result.longitude,
    full_location,
  };
}
