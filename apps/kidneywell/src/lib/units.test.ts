import { describe, expect, it } from '@jest/globals';

import { FLUID_MAX_ENTRY_ML, FLUID_MAX_GOAL_ML, FLUID_MIN_GOAL_ML, isValidEntryAmount, isValidGoal } from './fluid';
import { formatVolume, fromMl, rangeInUnit, toMl } from './units';

describe('volume conversion', () => {
  it('converts US fluid ounces', () => {
    expect(toMl(8, 'oz')).toBeCloseTo(236.588, 2);
    expect(fromMl(1000, 'oz')).toBeCloseTo(33.814, 2);
  });

  it('passes mL through unchanged', () => {
    expect(toMl(250, 'ml')).toBe(250);
    expect(fromMl(250, 'ml')).toBe(250);
  });

  it('round-trips a goal stored as whole mL', () => {
    const storedMl = Math.round(toMl(64, 'oz'));
    expect(Math.round(fromMl(storedMl, 'oz'))).toBe(64);
  });
});

describe('formatVolume', () => {
  it('shows whole numbers in the chosen unit', () => {
    expect(formatVolume(1893, 'oz')).toBe('64 oz');
    expect(formatVolume(1500, 'ml')).toBe('1,500 mL');
    expect(formatVolume(250, 'oz')).toBe('8 oz');
  });
});

describe('rangeInUnit', () => {
  it('only suggests values that pass validation', () => {
    for (const unit of ['oz', 'ml'] as const) {
      const goal = rangeInUnit(FLUID_MIN_GOAL_ML, FLUID_MAX_GOAL_ML, unit);
      expect(isValidGoal(Math.round(toMl(goal.min, unit)))).toBe(true);
      expect(isValidGoal(Math.round(toMl(goal.max, unit)))).toBe(true);

      const entry = rangeInUnit(1, FLUID_MAX_ENTRY_ML, unit);
      expect(isValidEntryAmount(Math.round(toMl(entry.max, unit)))).toBe(true);
      expect(isValidEntryAmount(Math.round(toMl(entry.max + 1, unit)))).toBe(false);
    }
  });

  it('gives the expected ounce ranges', () => {
    expect(rangeInUnit(FLUID_MIN_GOAL_ML, FLUID_MAX_GOAL_ML, 'oz')).toEqual({ min: 9, max: 202 });
  });
});
