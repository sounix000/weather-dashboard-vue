<template>
  <div class="highlights-item col-md-4 col-sm-6 col-xs-12 border-top">
    <div class="card-heading pt-4">UV Index</div>
    <svg viewBox="0 0 200 120" class="gauge" role="img" aria-label="UV index gauge">
      <path
        v-for="zone in zones"
        :key="zone.label"
        :d="arcPath(zone.from, zone.to)"
        :stroke="zone.color"
        stroke-width="14"
        fill="none"
      />
      <line
        x1="100"
        y1="100"
        :x2="needleTip.x"
        :y2="needleTip.y"
        stroke="#212529"
        stroke-width="3"
        stroke-linecap="round"
      />
      <circle cx="100" cy="100" r="5" fill="#212529" />
      <text x="100" y="92" text-anchor="middle" class="card-value gauge-value">{{ highlights.uvIndex }}</text>
    </svg>
  </div>
</template>

<script>
import { linearGaugePercent, polarToCartesian } from '../lib/gauge.js';

const MIN = 0;
const MAX = 15;
const CENTER_X = 100;
const CENTER_Y = 100;
const ARC_RADIUS = 80;
const NEEDLE_RADIUS = 60;

/**
 * Standard UV Index scale and colors
 * (see https://en.wikipedia.org/wiki/Ultraviolet_index).
 *
 * The original tutorial's FusionCharts angular gauge split its color range
 * at the current value itself (everything below the value was one color,
 * everything above was another) — an unusual choice. This uses the
 * standard, fixed UV-Index severity bands instead.
 */
const ZONES = [
  { from: 0, to: 2, color: '#8bc34a', label: 'Low' },
  { from: 2, to: 5, color: '#ffd54f', label: 'Moderate' },
  { from: 5, to: 7, color: '#ffa726', label: 'High' },
  { from: 7, to: 10, color: '#ef5350', label: 'Very High' },
  { from: 10, to: 15, color: '#9c64d4', label: 'Extreme' },
];

export default {
  name: 'UVIndex',
  props: {
    highlights: {
      type: Object,
      required: true,
    },
  },
  data() {
    return { zones: ZONES };
  },
  computed: {
    needleTip() {
      const angle = valueToArcAngle(this.highlights.uvIndex);
      return polarToCartesian(CENTER_X, CENTER_Y, NEEDLE_RADIUS, angle);
    },
  },
  methods: {
    arcPath(from, to) {
      const start = polarToCartesian(CENTER_X, CENTER_Y, ARC_RADIUS, valueToArcAngle(from));
      const end = polarToCartesian(CENTER_X, CENTER_Y, ARC_RADIUS, valueToArcAngle(to));
      return `M ${start.x} ${start.y} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${end.x} ${end.y}`;
    },
  },
};

/**
 * Map a UV index value to an angle for `polarToCartesian`, where 180°
 * (left) corresponds to the minimum and 0° (right) to the maximum — so the
 * gauge fills left-to-right as the value increases.
 */
function valueToArcAngle(value) {
  return 180 - (linearGaugePercent(value, MIN, MAX) / 100) * 180;
}
</script>

<style scoped>
.gauge {
  width: 100%;
  max-width: 220px;
  display: block;
  margin: 0 auto;
}

.gauge-value {
  font-size: 22px;
}
</style>
