import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { geocodeLocation } from '../src/api/geocoding.js';

describe('geocodeLocation', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns coordinates and a formatted location for a successful lookup', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            name: 'New York',
            latitude: 40.7143,
            longitude: -74.006,
            admin1: 'New York',
            country: 'United States',
          },
        ],
      }),
    });

    const result = await geocodeLocation('New York');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('geocoding-api.open-meteo.com/v1/search?name=New%20York')
    );
    expect(result).toEqual({
      lat: 40.7143,
      long: -74.006,
      full_location: 'New York, New York, United States',
    });
  });

  it('throws when no results are found', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });

    await expect(geocodeLocation('Nowhereville')).rejects.toThrow(/couldn't find/i);
  });

  it('throws when the request fails', async () => {
    fetch.mockResolvedValue({ ok: false, status: 500 });

    await expect(geocodeLocation('New York')).rejects.toThrow(/status 500/);
  });

  it('omits missing location parts when joining full_location', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [{ name: 'Vatican City', latitude: 41.9, longitude: 12.45 }],
      }),
    });

    const result = await geocodeLocation('Vatican City');
    expect(result.full_location).toBe('Vatican City');
  });
});
