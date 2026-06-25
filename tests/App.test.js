import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { shallowMount, flushPromises } from '@vue/test-utils';
import App from '../src/App.vue';
import forecastFixture from './fixtures/open-meteo-forecast.json';

const geocodeFixture = {
  results: [
    {
      name: 'New York',
      latitude: 40.71,
      longitude: -74.01,
      admin1: 'New York',
      country: 'United States',
    },
  ],
};

describe('App.vue (end-to-end with mocked APIs)', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'fetch',
      vi.fn((url) => {
        const target = String(url);
        if (target.includes('geocoding-api.open-meteo.com')) {
          return Promise.resolve({ ok: true, json: async () => geocodeFixture });
        }
        if (target.includes('api.open-meteo.com/v1/forecast')) {
          return Promise.resolve({ ok: true, json: async () => forecastFixture });
        }
        return Promise.reject(new Error(`Unexpected fetch: ${target}`));
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('loads "New York" on mount and populates the dashboard', async () => {
    const wrapper = shallowMount(App);

    await flushPromises();

    expect(wrapper.vm.ready).toBe(true);
    expect(wrapper.vm.errorMessage).toBe('');
    expect(wrapper.vm.currentWeather.temp).toBe(5);
    expect(wrapper.vm.currentWeather.full_location).toBe('New York, New York, United States');
    expect(wrapper.vm.currentWeather.formatted_lat).toBe('40.71\u00B0N');
    expect(wrapper.vm.currentWeather.formatted_long).toBe('74.01\u00B0W');
    expect(wrapper.vm.highlights.windStatus.derivedWindDirection).toBe('WSW');
    expect(wrapper.vm.tempVar.tempToday).toHaveLength(24);

    // Rendered output reflects the loaded data.
    expect(wrapper.text()).toContain('5');
    expect(wrapper.text()).toContain('New York, New York, United States');
  });

  it('searching a new location re-fetches and updates the dashboard', async () => {
    const wrapper = shallowMount(App);
    await flushPromises();

    const input = wrapper.find('#location-input');
    await input.setValue('london');
    await input.trigger('keyup.enter');
    await flushPromises();

    const geocodeCalls = fetch.mock.calls.filter(([url]) =>
      String(url).includes('geocoding-api.open-meteo.com')
    );
    expect(geocodeCalls.length).toBeGreaterThanOrEqual(2);
    // Input is converted to Title Case before being sent, mirroring the
    // original `locationEntered` / `convertToTitleCase` behavior.
    expect(geocodeCalls.at(-1)[0]).toContain('name=London');
    expect(wrapper.vm.locationInput).toBe('');
  });

  it('shows an error message if the location cannot be found', async () => {
    fetch.mockImplementation((url) => {
      const target = String(url);
      if (target.includes('geocoding-api.open-meteo.com')) {
        return Promise.resolve({ ok: true, json: async () => ({ results: [] }) });
      }
      return Promise.resolve({ ok: true, json: async () => forecastFixture });
    });

    const wrapper = shallowMount(App);
    await flushPromises();

    expect(wrapper.vm.ready).toBe(false);
    expect(wrapper.vm.errorMessage).toMatch(/couldn't find/i);
    expect(wrapper.text()).toContain("Couldn't find");
  });
});
