import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWeatherData } from '../src/api/weather.js';
import fixture from './fixtures/open-meteo-forecast.json';

describe('fetchWeatherData', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('requests the Open-Meteo forecast endpoint with fahrenheit/mph units', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => fixture });

    await fetchWeatherData(40.71, -74.01);

    const calledUrl = fetch.mock.calls[0][0];
    expect(calledUrl).toContain('https://api.open-meteo.com/v1/forecast?');
    expect(calledUrl).toContain('latitude=40.71');
    expect(calledUrl).toContain('longitude=-74.01');
    expect(calledUrl).toContain('temperature_unit=fahrenheit');
    expect(calledUrl).toContain('wind_speed_unit=mph');
    expect(calledUrl).toContain('timezone=auto');
  });

  it('returns the parsed JSON response', async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => fixture });

    const result = await fetchWeatherData(40.71, -74.01);
    expect(result).toEqual(fixture);
  });

  it('throws when the request fails', async () => {
    fetch.mockResolvedValue({ ok: false, status: 503 });

    await expect(fetchWeatherData(40.71, -74.01)).rejects.toThrow(/status 503/);
  });
});
