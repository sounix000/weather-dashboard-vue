/**
 * Unit conversion helpers.
 *
 * `fahToCel`, `milibarToKiloPascal`, `mileToKilometer`, and `deriveWindDir`
 * are ported directly from the original App.vue. `metersToKilometer` is new
 * — Open-Meteo reports visibility in meters, where Dark Sky reported it in
 * miles.
 */

/** Convert a temperature from Fahrenheit to Celsius, rounded to the nearest whole degree. */
export function fahToCel(tempInFahrenheit) {
  return Math.round((5 / 9) * (tempInFahrenheit - 32));
}

/** Convert an air-pressure reading from millibar to kilopascal, rounded to the nearest whole unit. */
export function milibarToKiloPascal(pressureInMilibar) {
  const pressureInKPA = pressureInMilibar * 0.1;
  return Math.round(pressureInKPA);
}

/** Convert a distance from miles to kilometers, rounded to the nearest whole unit. */
export function mileToKilometer(miles) {
  const kilometer = miles * 1.60934;
  return Math.round(kilometer);
}

/** Convert a distance from meters to kilometers, rounded to the nearest whole unit. */
export function metersToKilometer(meters) {
  return Math.round(meters / 1000);
}

/**
 * Compass sectors used by `deriveWindDir`, each spanning a range of
 * degrees clockwise from true north (0°).
 */
const WIND_DIRECTIONS = [
  { minVal: 0, maxVal: 30, direction: 'N' },
  { minVal: 31, maxVal: 45, direction: 'NNE' },
  { minVal: 46, maxVal: 75, direction: 'NE' },
  { minVal: 76, maxVal: 90, direction: 'ENE' },
  { minVal: 91, maxVal: 120, direction: 'E' },
  { minVal: 121, maxVal: 135, direction: 'ESE' },
  { minVal: 136, maxVal: 165, direction: 'SE' },
  { minVal: 166, maxVal: 180, direction: 'SSE' },
  { minVal: 181, maxVal: 210, direction: 'S' },
  { minVal: 211, maxVal: 225, direction: 'SSW' },
  { minVal: 226, maxVal: 255, direction: 'SW' },
  { minVal: 256, maxVal: 270, direction: 'WSW' },
  { minVal: 271, maxVal: 300, direction: 'W' },
  { minVal: 301, maxVal: 315, direction: 'WNW' },
  { minVal: 316, maxVal: 345, direction: 'NW' },
  { minVal: 346, maxVal: 360, direction: 'NNW' },
];

/**
 * Convert a wind direction in degrees (clockwise from true north) into a
 * compass-point abbreviation, e.g. `30` => `'N'`, `200` => `'S'`.
 *
 * Returns an empty string if `windDir` falls outside 0–360.
 */
export function deriveWindDir(windDir) {
  const sector = WIND_DIRECTIONS.find(
    ({ minVal, maxVal }) => windDir >= minVal && windDir <= maxVal
  );
  return sector ? sector.direction : '';
}
