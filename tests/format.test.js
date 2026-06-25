import { describe, it, expect } from 'vitest';
import { convertToTitleCase, formatPossibility } from '../src/lib/format.js';

describe('convertToTitleCase', () => {
  it('title-cases a lowercase phrase', () => {
    expect(convertToTitleCase('new york')).toBe('New York');
  });

  it('title-cases an uppercase phrase', () => {
    expect(convertToTitleCase('SAN FRANCISCO')).toBe('San Francisco');
  });

  it('handles a single word', () => {
    expect(convertToTitleCase('london')).toBe('London');
  });
});

describe('formatPossibility', () => {
  it('converts a simple hyphenated slug to Title Case', () => {
    expect(formatPossibility('partly-cloudy')).toBe('Partly Cloudy');
  });

  it('converts a multi-word slug to Title Case', () => {
    expect(formatPossibility('partly-cloudy-day')).toBe('Partly Cloudy Day');
  });

  it('replaces " And" with a comma', () => {
    expect(formatPossibility('rain-and-snow')).toBe('Rain, Snow');
  });
});
