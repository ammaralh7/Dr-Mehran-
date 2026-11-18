import { describe, expect, it } from '@jest/globals';

import {
  dayKey,
  entriesForDay,
  goalProgress,
  isValidEntryAmount,
  isValidGoal,
  pruneOlderThan,
  totalForDay,
  type FluidEntry,
} from './fluid';

const at = (y: number, m: number, d: number, h = 12, min = 0) =>
  new Date(y, m - 1, d, h, min).toISOString();

const entries: FluidEntry[] = [
  { id: 'a', amountMl: 250, at: at(2026, 11, 18, 8) },
  { id: 'b', amountMl: 500, at: at(2026, 11, 18, 13) },
  { id: 'c', amountMl: 330, at: at(2026, 11, 17, 23, 59) },
  { id: 'd', amountMl: 150, at: at(2026, 11, 19, 0, 1) },
];

describe('dayKey', () => {
  it('formats the local date', () => {
    expect(dayKey(new Date(2026, 0, 5, 23, 30))).toBe('2026-01-05');
  });
});

describe('entriesForDay / totalForDay', () => {
  const day = new Date(2026, 10, 18);

  it('keeps only entries from that local day, newest first', () => {
    expect(entriesForDay(entries, day).map((e) => e.id)).toEqual(['b', 'a']);
  });

  it('sums the day', () => {
    expect(totalForDay(entries, day)).toBe(750);
    expect(totalForDay([], day)).toBe(0);
  });
});

describe('goalProgress', () => {
  it('returns null without a goal', () => {
    expect(goalProgress(500, null)).toBeNull();
    expect(goalProgress(500, 0)).toBeNull();
  });

  it('returns the clamped fraction', () => {
    expect(goalProgress(500, 2000)).toBe(0.25);
    expect(goalProgress(2500, 2000)).toBe(1);
  });
});

describe('validation', () => {
  it('accepts sensible drink sizes', () => {
    expect(isValidEntryAmount(250)).toBe(true);
    expect(isValidEntryAmount(0)).toBe(false);
    expect(isValidEntryAmount(-100)).toBe(false);
    expect(isValidEntryAmount(5000)).toBe(false);
    expect(isValidEntryAmount(NaN)).toBe(false);
  });

  it('accepts sensible goals', () => {
    expect(isValidGoal(1500)).toBe(true);
    expect(isValidGoal(100)).toBe(false);
    expect(isValidGoal(10000)).toBe(false);
  });
});

describe('pruneOlderThan', () => {
  it('drops entries before the cutoff', () => {
    const now = new Date(2026, 10, 19, 12);
    expect(pruneOlderThan(entries, now, 1).map((e) => e.id)).toEqual(['a', 'b', 'd']);
  });
});
