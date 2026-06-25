<template>
  <div class="custom-card header-card card">
    <div class="card-body pt-0">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script>
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from 'chart.js';

ChartJS.register(Title, Tooltip, LineElement, PointElement, CategoryScale, LinearScale, Filler);

/**
 * Renders the day's hourly temperature variation as a line chart.
 *
 * The original tutorial used FusionCharts' "spline" chart type, fed by a
 * `data: [{label, value}, ...]` array built in `setChartData()`. This
 * keeps that same shape via the `tempVar` prop, but renders with
 * Chart.js/vue-chartjs (free, MIT-licensed, no watermark).
 */
export default {
  name: 'TempVarChart',
  components: { Line },
  props: {
    tempVar: {
      type: Object,
      required: true,
    },
  },
  computed: {
    chartData() {
      const points = this.tempVar.tempToday;
      return {
        labels: points.map((point) => point.hour),
        datasets: [
          {
            label: 'Temperature (°C)',
            data: points.map((point) => Number(point.temp)),
            borderColor: '#6297d9',
            backgroundColor: 'rgba(98, 151, 217, 0.15)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#6297d9',
            pointRadius: 3,
          },
        ],
      };
    },
    chartOptions() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: 'Hourly Temperature',
            color: '#000000',
            font: { size: 18, weight: 'normal' },
            padding: { bottom: 20 },
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.parsed.y}°C`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(0, 0, 0, 0.65)' },
          },
          y: {
            display: false,
          },
        },
      };
    },
  },
};
</script>

<style scoped>
.card-body {
  height: 100%;
}
</style>
