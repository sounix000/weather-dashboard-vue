<template>
  <div class="container-fluid" id="app">
    <div class="row">
      <div id="sidebar" class="col-md-3 col-sm-4 col-xs-12">
        <div id="search">
          <input
            id="location-input"
            type="text"
            v-model="locationInput"
            placeholder="Location?"
            @keyup.enter="handleSearch"
          >
          <button id="search-btn" type="button" @click="handleSearch" aria-label="Search">
            <img src="./assets/search.svg" width="24" height="24" alt="">
          </button>
        </div>

        <p v-if="errorMessage" id="error-message">{{ errorMessage }}</p>

        <div id="info" v-if="ready">
          <div class="wrapper-left">
            <div id="current-weather">
              {{ currentWeather.temp }}
              <span>&deg;C</span>
            </div>
            <div id="weather-desc">{{ currentWeather.summary }}</div>
            <div class="temp-max-min">
              <div class="max-desc">
                <div id="max-detail">
                  <i>&#9650;</i>
                  {{ currentWeather.todayHighLow.todayTempHigh }}
                  <span>&deg;C</span>
                </div>
                <div id="max-summary">at {{ currentWeather.todayHighLow.todayTempHighTime }}</div>
              </div>
              <div class="min-desc">
                <div id="min-detail">
                  <i>&#9660;</i>
                  {{ currentWeather.todayHighLow.todayTempLow }}
                  <span>&deg;C</span>
                </div>
                <div id="min-summary">at {{ currentWeather.todayHighLow.todayTempLowTime }}</div>
              </div>
            </div>
          </div>
          <div class="wrapper-right">
            <div class="date-time-info">
              <div id="date-desc">
                <img src="./assets/calendar.svg" width="20" height="20" alt="">
                {{ currentWeather.time }}
              </div>
            </div>
            <div class="location-info">
              <div id="location-desc">
                <img
                  src="./assets/location.svg"
                  width="10.83"
                  height="15.83"
                  style="opacity: 0.9;"
                  alt=""
                >
                {{ currentWeather.full_location }}
                <div id="location-detail" class="mt-1">
                  Lat: {{ currentWeather.formatted_lat }}
                  <br>
                  Long: {{ currentWeather.formatted_long }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Content
        v-if="ready"
        class="col-md-9 col-sm-8 col-xs-12"
        id="dashboard-content"
        :highlights="highlights"
        :tempVar="tempVar"
      />
      <div v-else class="col-md-9 col-sm-8 col-xs-12 d-flex align-items-center justify-content-center" id="dashboard-content">
        <p>{{ loading ? 'Loading weather data\u2026' : 'Search for a location to get started.' }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import Content from './components/Content.vue';
import { geocodeLocation } from './api/geocoding.js';
import { fetchWeatherData } from './api/weather.js';
import { buildDashboardData, formatLatitude, formatLongitude } from './lib/normalize.js';
import { convertToTitleCase } from './lib/format.js';

/**
 * Root component.
 *
 * Orchestrates the same sequence as the original tutorial's
 * `organizeAllDetails()`:
 *   locationEntered -> getCoordinates -> fetchWeatherData -> processing -> render
 *
 * but with Open-Meteo's geocoding + forecast APIs in place of Google Maps
 * Geocoder + the Dark Sky/FusionCharts proxy (see src/api/*.js for why).
 */
export default {
  name: 'App',
  components: { Content },
  data() {
    return {
      locationInput: '',
      loading: false,
      ready: false,
      errorMessage: '',
      currentWeather: {
        full_location: '',
        formatted_lat: '',
        formatted_long: '',
        time: '',
        temp: '',
        todayHighLow: {
          todayTempHigh: '',
          todayTempHighTime: '',
          todayTempLow: '',
          todayTempLowTime: '',
        },
        summary: '',
        possibility: '',
      },
      tempVar: {
        tempToday: [],
      },
      highlights: {
        uvIndex: '',
        visibility: '',
        windStatus: {
          windSpeed: '',
          windDirection: '',
          derivedWindDirection: '',
        },
      },
    };
  },
  methods: {
    async handleSearch() {
      const trimmed = this.locationInput.trim();
      const query = trimmed === '' ? 'New York' : convertToTitleCase(trimmed);
      this.locationInput = '';
      await this.loadWeatherFor(query);
    },

    async loadWeatherFor(query) {
      this.loading = true;
      this.errorMessage = '';

      try {
        const { lat, long, full_location } = await geocodeLocation(query);
        const raw = await fetchWeatherData(lat, long);
        const dashboard = buildDashboardData(raw);

        this.currentWeather = {
          ...dashboard.currentWeather,
          full_location,
          formatted_lat: formatLatitude(lat),
          formatted_long: formatLongitude(long),
        };
        this.tempVar = dashboard.tempVar;
        this.highlights = dashboard.highlights;
        this.ready = true;
      } catch (error) {
        this.errorMessage = error.message || 'Something went wrong fetching the weather.';
      } finally {
        this.loading = false;
      }
    },
  },
  mounted() {
    this.loadWeatherFor('New York');
  },
};
</script>
