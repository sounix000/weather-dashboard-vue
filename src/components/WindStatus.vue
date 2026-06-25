<template>
  <div class="highlights-item col-md-4 col-sm-6 col-xs-12 border-top">
    <div class="card-heading pt-4">Wind Status</div>
    <div class="row pt-4 mt-4">
      <div class="col-sm-6 col-md-6 mt-2 text-center align-middle">
        <p class="card-sub-heading mt-3">Wind Direction</p>
        <p class="mt-4">
          <img
            src="../assets/winddirection.svg"
            height="40"
            width="40"
            :style="{ transform: `rotate(${highlights.windStatus.windDirection}deg)` }"
            alt="Wind direction arrow"
          >
        </p>
        <p class="card-value mt-4">{{ highlights.windStatus.derivedWindDirection }}</p>
      </div>
      <div class="col-sm-6 col-md-6 mt-2 text-center align-middle">
        <p class="card-sub-heading mt-3">Wind Speed</p>
        <p class="mt-4">
          <img src="../assets/windspeed.svg" height="40" width="40" alt="Wind speed icon">
        </p>
        <p class="card-value mt-4">{{ highlights.windStatus.windSpeed }} km/h</p>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Displays wind speed and direction as text + icons, exactly as the
 * original tutorial intended — wind velocity doesn't lend itself well to
 * a chart, so no FusionCharts replacement is needed here.
 *
 * One small addition: the direction arrow icon is rotated by
 * `windDirection` degrees, so it visually points the way the wind is
 * blowing from.
 */
export default {
  name: 'WindStatus',
  props: {
    highlights: {
      type: Object,
      required: true,
    },
  },
};
</script>
