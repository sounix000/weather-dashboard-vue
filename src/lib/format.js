/**
 * String formatting helpers.
 *
 * Ported from the `convertToTitleCase` and `formatPossibility` methods of
 * the original App.vue.
 */

/**
 * Convert a space-separated string to Title Case.
 *
 * @example convertToTitleCase('new york') // => 'New York'
 */
export function convertToTitleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert a hyphen-separated "slug" (e.g. a weather condition code) into a
 * Title Case phrase with " And" normalized to a comma.
 *
 * @example formatPossibility('partly-cloudy-day') // => 'Partly Cloudy Day'
 * @example formatPossibility('rain-and-snow')      // => 'Rain, Snow'
 */
export function formatPossibility(str) {
  const titled = str
    .toLowerCase()
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return titled.includes(' And') ? titled.replace(' And', ',') : titled;
}
