import { describe, it, expect } from 'vitest';
import { formatTime, formatMonthDate, formatFullTime, dateKey } from '../src/lib/time.js';

describe('formatTime', () => {
  it('formats midnight as 12:00 AM', () => {
    expect(formatTime('2024-01-15T00:00')).toBe('12:00 AM');
  });

  it('formats noon as 12:00 PM', () => {
    expect(formatTime('2024-01-15T12:00')).toBe('12:00 PM');
  });

  it('formats a morning time', () => {
    expect(formatTime('2024-01-15T03:00')).toBe('3:00 AM');
  });

  it('formats an afternoon time with minutes', () => {
    expect(formatTime('2024-01-15T14:30')).toBe('2:30 PM');
  });
});

describe('formatMonthDate', () => {
  it('formats a date as abbreviated month and day', () => {
    expect(formatMonthDate('2024-01-15T14:00')).toBe('Jan 15');
  });

  it('formats a different month', () => {
    expect(formatMonthDate('2024-12-01T00:00')).toBe('Dec 1');
  });
});

describe('formatFullTime', () => {
  it('formats weekday, date, and time together', () => {
    // 2024-01-15 is a Monday
    expect(formatFullTime('2024-01-15T14:00')).toBe('Mon, Jan 15, 2:00 PM');
  });
});

describe('dateKey', () => {
  it('extracts the YYYY-MM-DD portion of a timestamp', () => {
    expect(dateKey('2024-01-15T14:00')).toBe('2024-01-15');
  });
});
