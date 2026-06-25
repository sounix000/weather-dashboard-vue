<template>
  <div class="highlights-item col-md-4 col-sm-6 col-xs-12 border-left border-right border-top">
    <div class="card-heading pt-4">Air Visibility</div>
    <div class="linear-gauge">
      <div class="linear-gauge-track">
        <div
          v-for="zone in zones"
          :key="zone.label"
          class="linear-gauge-zone"
          :style="{ width: zone.widthPercent + '%', backgroundColor: zone.color }"
          :title="zone.label"
        ></div>
      </div>
      <div class="linear-gauge-pointer" :style="{ left: pointerPercent + '%' }"></div>
    </div>
    <div class="card-value text-center mt-2">{{ highlights.visibility }} km</div>
  </div>
</template>

<script>
import { linearGaugePercent } from '../lib/gauge.js';

const MIN = 0;
const MAX = 40;

// Zones ported from the original FusionCharts hlineargauge colorRange.
const ZONES = [
  { from: 0, to: 4, color: '#6297d9', label: 'Fog' },
  { from: 4, to: 10, color: '#7da9e0', label: 'Haze' },
  { from: 10, to: 40, color: '#d8edff', label: 'Clear' },
];

export default {
  name: 'Visibility',
  props: {
    highlights: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      zones: ZONES.map((zone) => ({
        ...zone,
        widthPercent: ((zone.to - zone.from) / (MAX - MIN)) * 100,
      })),
    };
  },
  computed: {
    pointerPercent() {
      return linearGaugePercent(this.highlights.visibility, MIN, MAX);
    },
  },
};
</script>

<style scoped>
.linear-gauge {
  position: relative;
  width: 85%;
  margin: 32px auto 8px;
}

.linear-gauge-track {
  display: flex;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
}

.linear-gauge-pointer {
  position: absolute;
  top: -6px;
  width: 2px;
  height: 24px;
  background-color: #212529;
  transform: translateX(-50%);
}
</style>
