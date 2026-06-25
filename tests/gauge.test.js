import { describe, it, expect } from 'vitest';
import { clamp, linearGaugePercent, angularGaugeAngle, polarToCartesian } from '../src/lib/gauge.js';

describe('clamp', () => {
  it('passes through in-range values', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('clamps below the minimum', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('clamps above the maximum', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('linearGaugePercent', () => {
  it('maps the minimum to 0%', () => {
    expect(linearGaugePercent(0, 0, 40)).toBe(0);
  });

  it('maps the maximum to 100%', () => {
    expect(linearGaugePercent(40, 0, 40)).toBe(100);
  });

  it('maps the midpoint to 50%', () => {
    expect(linearGaugePercent(20, 0, 40)).toBe(50);
  });

  it('clamps out-of-range values', () => {
    expect(linearGaugePercent(-10, 0, 40)).toBe(0);
    expect(linearGaugePercent(100, 0, 40)).toBe(100);
  });
});

describe('angularGaugeAngle', () => {
  it('maps the minimum to -90 degrees', () => {
    expect(angularGaugeAngle(0, 0, 15)).toBe(-90);
  });

  it('maps the maximum to 90 degrees', () => {
    expect(angularGaugeAngle(15, 0, 15)).toBe(90);
  });

  it('maps the midpoint to 0 degrees', () => {
    expect(angularGaugeAngle(7.5, 0, 15)).toBe(0);
  });
});

describe('polarToCartesian', () => {
  it('places 0 degrees to the right of center', () => {
    const point = polarToCartesian(0, 0, 10, 0);
    expect(point.x).toBeCloseTo(10);
    expect(point.y).toBeCloseTo(0);
  });

  it('places 90 degrees above center', () => {
    const point = polarToCartesian(0, 0, 10, 90);
    expect(point.x).toBeCloseTo(0);
    expect(point.y).toBeCloseTo(-10);
  });

  it('places 180 degrees to the left of center', () => {
    const point = polarToCartesian(0, 0, 10, 180);
    expect(point.x).toBeCloseTo(-10);
    expect(point.y).toBeCloseTo(0);
  });
});
