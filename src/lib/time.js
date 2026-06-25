/**
 * Date/time formatting helpers.
 *
 * The original App.vue used `moment-timezone` to convert Unix timestamps
 * (from Dark Sky) into human-readable strings. Open-Meteo instead returns
 * ISO-8601 timestamps that are *already* expressed in the requested
 * location's local time (when `timezone=auto` is used), so no timezone
 * conversion is needed — only formatting.
 *
 * `new Date('2024-01-15T14:00')` is parsed by JavaScript as 14:00 in
 * whatever timezone the *code* runs in, which conveniently is the same
 * numeric value Open-Meteo gave us — so `.getHours()` etc. return the
 * location's local hour regardless of the user's machine timezone.
 */

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * Format an Open-Meteo ISO timestamp as a 12-hour clock time, e.g. `'2:00 PM'`.
 */
export function formatTime(isoString) {
  const date = new Date(isoString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  const paddedMinutes = String(minutes).padStart(2, '0');
  return `${hour12}:${paddedMinutes} ${period}`;
}

/**
 * Format an Open-Meteo ISO timestamp as an abbreviated month and day,
 * e.g. `'Jan 15'`.
 */
export function formatMonthDate(isoString) {
  const date = new Date(isoString);
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}`;
}

/**
 * Format an Open-Meteo ISO timestamp as a full human-readable string,
 * e.g. `'Mon, Jan 15, 2:00 PM'`.
 */
export function formatFullTime(isoString) {
  const date = new Date(isoString);
  return `${DAY_NAMES[date.getDay()]}, ${formatMonthDate(isoString)}, ${formatTime(isoString)}`;
}

/**
 * Extract the `YYYY-MM-DD` date portion of an Open-Meteo ISO timestamp, for
 * grouping/filtering hourly entries by calendar day.
 */
export function dateKey(isoString) {
  return isoString.slice(0, 10);
}
