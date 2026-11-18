import { describe, expect, it } from '@jest/globals';

import type { BpReading } from './bp';
import { nearestIndex, readingsInRange, yScale } from './chart';

const reading = (systolic: number, diastolic: number, day = 18): BpReading => ({
  id: `${systolic}-${diastolic}-${day}`,
  systolic,
  diastolic,
  pulse: null,
  at: new Date(2026, 10, day, 8).toISOString(),
});

describe('yScale', () => {
  it('defaults to 60–160 so the 130/80 lines always show', () => {
    expect(yScale([])).toEqual({ min: 60, max: 160, ticks: [60, 80, 100, 120, 140, 160] });
    expect(yScale([reading(118, 76)])).toEqual({ min: 60, max: 160, ticks: [60, 80, 100, 120, 140, 160] });
  });

  it('widens to fit high and low readings with headroom', () => {
    const scale = yScale([reading(195, 125), reading(110, 52)]);
    expect(scale.min).toBe(40);
    expect(scale.max).toBe(220);
    expect(scale.ticks).toEqual([40, 80, 120, 160, 200]); // 40 mmHg steps when the range is wide
  });

  it('never goes below 20 mmHg', () => {
    expect(yScale([reading(90, 25)]).min).toBe(20);
  });
});

describe('readingsInRange', () => {
  it('keeps readings in the window, oldest first', () => {
    const readings = [reading(130, 80, 18), reading(120, 75, 10), reading(140, 90, 1)];
    const result = readingsInRange(readings, new Date(2026, 10, 5), new Date(2026, 10, 18, 23, 59));
    expect(result.map((r) => r.systolic)).toEqual([120, 130]);
  });
});

describe('nearestIndex', () => {
  it('finds the closest x', () => {
    expect(nearestIndex([10, 50, 90], 62)).toBe(1);
    expect(nearestIndex([10, 50, 90], 85)).toBe(2);
    expect(nearestIndex([10], 300)).toBe(0);
  });
});
