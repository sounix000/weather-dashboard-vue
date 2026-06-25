/**
 * Open-Meteo reports weather conditions as numeric WMO codes
 * (https://open-meteo.com/en/docs — "WMO Weather interpretation codes").
 *
 * Dark Sky, used by the original tutorial, instead returned a hyphenated
 * "icon" slug such as `'partly-cloudy-day'`, which was fed into
 * `formatPossibility()`. This module maps WMO codes to equivalent slugs so
 * `formatPossibility()` can be reused unchanged.
 */

const WMO_SLUGS = {
  0: 'clear-sky',
  1: 'mainly-clear',
  2: 'partly-cloudy',
  3: 'overcast',
  45: 'fog',
  48: 'freezing-fog',
  51: 'light-drizzle',
  53: 'moderate-drizzle',
  55: 'dense-drizzle',
  56: 'light-freezing-drizzle',
  57: 'dense-freezing-drizzle',
  61: 'slight-rain',
  63: 'moderate-rain',
  65: 'heavy-rain',
  66: 'light-freezing-rain',
  67: 'heavy-freezing-rain',
  71: 'slight-snow',
  73: 'moderate-snow',
  75: 'heavy-snow',
  77: 'snow-grains',
  80: 'slight-rain-showers',
  81: 'moderate-rain-showers',
  82: 'violent-rain-showers',
  85: 'slight-snow-showers',
  86: 'heavy-snow-showers',
  95: 'thunderstorm',
  96: 'thunderstorm-with-hail',
  99: 'thunderstorm-with-heavy-hail',
};

const DEFAULT_SLUG = 'unknown-conditions';

/**
 * Map a WMO weather code to a hyphenated slug.
 * Falls back to `'unknown-conditions'` for unrecognized codes.
 */
export function weatherCodeToSlug(code) {
  return WMO_SLUGS[code] ?? DEFAULT_SLUG;
}
