import { describe, it, expect } from 'vitest';
import {
  fahToCel,
  milibarToKiloPascal,
  mileToKilometer,
  metersToKilometer,
  deriveWindDir,
} from '../src/lib/units.js';

describe('fahToCel', () => {
  it('converts freezing point', () => {
    expect(fahToCel(32)).toBe(0);
  });

  it('converts boiling point', () => {
    expect(fahToCel(212)).toBe(100);
  });

  it('rounds to the nearest whole degree', () => {
    expect(fahToCel(41.5)).toBe(5); // 5.27..  -> 5
  });

  it('handles negative temperatures', () => {
    expect(fahToCel(-40)).toBe(-40);
  });
});

describe('milibarToKiloPascal', () => {
  it('converts standard atmospheric pressure', () => {
    expect(milibarToKiloPascal(1013)).toBe(101);
  });

  it('rounds to the nearest whole unit', () => {
    expect(milibarToKiloPascal(1015)).toBe(102); // 101.5 -> 102
  });
});

describe('mileToKilometer', () => {
  it('converts a round number of miles', () => {
    expect(mileToKilometer(10)).toBe(16); // 16.0934 -> 16
  });

  it('converts a small distance', () => {
    expect(mileToKilometer(8.5)).toBe(14); // 13.679 -> 14
  });

  it('converts zero', () => {
    expect(mileToKilometer(0)).toBe(0);
  });
});

describe('metersToKilometer', () => {
  it('converts a round number of meters', () => {
    expect(metersToKilometer(16000)).toBe(16);
  });

  it('rounds to the nearest whole kilometer', () => {
    expect(metersToKilometer(9500)).toBe(10); // 9.5 -> 10
  });
});

describe('deriveWindDir', () => {
  it.each([
    [0, 'N'],
    [30, 'N'],
    [45, 'NNE'],
    [90, 'ENE'],
    [180, 'SSE'],
    [270, 'WSW'],
    [360, 'NNW'],
  ])('maps %d degrees to %s', (degrees, expected) => {
    expect(deriveWindDir(degrees)).toBe(expected);
  });

  it('returns an empty string for out-of-range values', () => {
    expect(deriveWindDir(-10)).toBe('');
    expect(deriveWindDir(400)).toBe('');
  });
});
