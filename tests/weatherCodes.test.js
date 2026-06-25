import { describe, it, expect } from 'vitest';
import { weatherCodeToSlug } from '../src/lib/weatherCodes.js';

describe('weatherCodeToSlug', () => {
  it('maps clear sky', () => {
    expect(weatherCodeToSlug(0)).toBe('clear-sky');
  });

  it('maps partly cloudy', () => {
    expect(weatherCodeToSlug(2)).toBe('partly-cloudy');
  });

  it('maps thunderstorm with hail', () => {
    expect(weatherCodeToSlug(96)).toBe('thunderstorm-with-hail');
  });

  it('falls back for unrecognized codes', () => {
    expect(weatherCodeToSlug(999)).toBe('unknown-conditions');
  });
});
