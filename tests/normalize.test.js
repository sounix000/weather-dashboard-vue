import { describe, it, expect } from 'vitest';
import { buildDashboardData, formatLatitude, formatLongitude } from '../src/lib/normalize.js';
import fixture from './fixtures/open-meteo-forecast.json';

describe('formatLatitude / formatLongitude', () => {
  it('formats a positive latitude as North', () => {
    expect(formatLatitude(27.174698469698683)).toBe('27.1747°N');
  });

  it('formats a negative latitude as South', () => {
    expect(formatLatitude(-33.8688)).toBe('33.8688°S');
  });

  it('formats a positive longitude as East', () => {
    expect(formatLongitude(78.042073)).toBe('78.0421°E');
  });

  it('formats a negative longitude as West', () => {
    expect(formatLongitude(-74.006)).toBe('74.006°W');
  });
});

describe('buildDashboardData', () => {
  const result = buildDashboardData(fixture);

  it('formats the current time', () => {
    expect(result.currentWeather.time).toBe('Mon, Jan 15, 2:00 PM');
  });

  it('converts the current temperature to Celsius', () => {
    expect(result.currentWeather.temp).toBe(5); // 41.5F -> ~5.3C -> 5
  });

  it("computes today's high/low and their times", () => {
    expect(result.currentWeather.todayHighLow).toEqual({
      todayTempHigh: 7, // 45F -> 7C
      todayTempHighTime: '12:00 PM',
      todayTempLow: 0, // 32F -> 0C
      todayTempLowTime: '3:00 AM',
    });
  });

  it('derives a human-readable summary and possibility from the weather code', () => {
    expect(result.currentWeather.summary).toBe('Partly Cloudy');
    expect(result.currentWeather.possibility).toBe('Partly Cloudy');
  });

  it('builds an hourly temperature series for today', () => {
    expect(result.tempVar.tempToday).toHaveLength(24);
    expect(result.tempVar.tempToday[0]).toEqual({ hour: '12:00 AM', temp: '1' });
    expect(result.tempVar.tempToday[14]).toEqual({ hour: '2:00 PM', temp: '5' });
  });

  it('computes UV index, visibility, and wind status highlights', () => {
    expect(result.highlights).toEqual({
      uvIndex: 2, // round(1.8)
      visibility: 16, // 16000m -> 16km
      windStatus: {
        windSpeed: 14, // 8.5mph -> ~13.7km/h -> 14
        windDirection: 270,
        derivedWindDirection: 'WSW',
      },
    });
  });

  it('throws if there is no hourly data for the current day', () => {
    const broken = {
      ...fixture,
      current: { ...fixture.current, time: '2024-02-01T00:00' },
    };
    expect(() => buildDashboardData(broken)).toThrow(/no hourly data/i);
  });

  it('pads the temperature series when 2 or fewer hours of "today" exist', () => {
    // Only 2 hourly entries fall on 2024-01-15; the rest are "tomorrow".
    const sparse = {
      current: { time: '2024-01-15T23:00', temperature_2m: 33, weather_code: 0, wind_speed_10m: 5, wind_direction_10m: 0 },
      hourly: {
        time: ['2024-01-15T22:00', '2024-01-15T23:00', '2024-01-16T00:00'],
        temperature_2m: [40, 20, 32],
        uv_index: [0, 0, 0],
        visibility: [16000, 16000, 16000],
      },
      daily: {
        time: ['2024-01-15'],
        temperature_2m_max: [40],
        temperature_2m_min: [20],
      },
    };

    const padded = buildDashboardData(sparse);

    // 2 original points + 2 padded (high/low) points = 4
    expect(padded.tempVar.tempToday).toHaveLength(4);
    expect(padded.tempVar.tempToday[0]).toEqual({ hour: '10:00 PM', temp: '4' }); // 40F -> 4C (high)
    expect(padded.tempVar.tempToday[1]).toEqual({ hour: '11:00 PM', temp: '-7' }); // 20F -> -7C (low)
  });
});
