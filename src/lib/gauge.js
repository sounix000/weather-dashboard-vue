/**
 * Pure geometry helpers for the gauge visualizations.
 *
 * The original tutorial used FusionCharts' `angulargauge` (UV Index) and
 * `hlineargauge` (Visibility) widgets. Those are replaced here with small
 * custom SVG components; these functions compute the numbers needed to
 * draw them, independent of any rendering framework.
 */

/** Clamp `value` to the inclusive range [`min`, `max`]. */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Map `value` (within [`min`, `max`]) to a percentage between 0 and 100.
 * Used to position the pointer along a horizontal linear gauge.
 */
export function linearGaugePercent(value, min, max) {
  const clamped = clamp(value, min, max);
  return ((clamped - min) / (max - min)) * 100;
}

/**
 * Map `value` (within [`min`, `max`]) to an angle in degrees for a
 * semicircular needle, where `-90` points straight left and `90` points
 * straight right (pointing down at the bottom of the semicircle).
 */
export function angularGaugeAngle(value, min, max) {
  const percent = linearGaugePercent(value, min, max) / 100;
  return -90 + percent * 180;
}

/**
 * Convert polar coordinates (angle in degrees, where 0deg points right and
 * 180deg points left along the gauge's diameter) to cartesian coordinates
 * around center (`cx`, `cy`) with the given `radius`.
 * Used to compute SVG arc endpoints for a semicircular gauge.
 */
export function polarToCartesian(cx, cy, radius, angleDeg) {
  const angleRad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy - radius * Math.sin(angleRad),
  };
}
