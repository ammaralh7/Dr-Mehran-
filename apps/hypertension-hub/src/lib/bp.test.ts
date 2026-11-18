import { describe, expect, it } from '@jest/globals';

import {
  averageSince,
  bpSeverity,
  classifyBp,
  daysAgo,
  formatBp,
  validateBpInput,
  type BpReading,
} from './bp';

describe('classifyBp (2025 AHA/ACC)', () => {
  it.each([
    // systolic, diastolic, category
    [110, 70, 'normal'],
    [119, 79, 'normal'],
    [120, 79, 'elevated'],
    [129, 79, 'elevated'],
    [129, 80, 'stage1'], // diastolic 80 lifts elevated to stage 1
    [118, 82, 'stage1'], // isolated diastolic stage 1
    [130, 70, 'stage1'],
    [139, 89, 'stage1'],
    [140, 70, 'stage2'],
    [125, 90, 'stage2'], // isolated diastolic stage 2
    [180, 110, 'stage2'], // exactly 180 is not severe (> 180)
    [181, 100, 'severe'],
    [150, 120, 'stage2'], // exactly 120 is not severe (> 120)
    [150, 121, 'severe'],
    [200, 130, 'severe'],
  ] as const)('%p/%p → %s', (systolic, diastolic, expected) => {
    expect(classifyBp({ systolic, diastolic })).toBe(expected);
  });

  it('rounds averages before classifying', () => {
    expect(classifyBp({ systolic: 129.6, diastolic: 70 })).toBe('stage1');
    expect(classifyBp({ systolic: 129.4, diastolic: 70 })).toBe('elevated');
  });

  it('maps categories to severity', () => {
    expect(bpSeverity('elevated')).toBe('ok');
    expect(bpSeverity('stage2')).toBe('caution');
    expect(bpSeverity('severe')).toBe('urgent');
  });
});

describe('validateBpInput', () => {
  it('accepts a typical reading with or without pulse', () => {
    expect(validateBpInput({ systolic: 128, diastolic: 82, pulse: 70 })).toEqual([]);
    expect(validateBpInput({ systolic: 128, diastolic: 82, pulse: NaN })).toEqual([]);
  });

  it('accepts a severe reading so it can be recorded and acted on', () => {
    expect(validateBpInput({ systolic: 210, diastolic: 125, pulse: NaN })).toEqual([]);
  });

  it('rejects missing or impossible numbers', () => {
    expect(validateBpInput({ systolic: NaN, diastolic: NaN, pulse: NaN })).toHaveLength(2);
    expect(validateBpInput({ systolic: 1280, diastolic: 82, pulse: NaN })).toHaveLength(1);
  });

  it('catches swapped numbers', () => {
    const [error] = validateBpInput({ systolic: 80, diastolic: 120, pulse: NaN });
    expect(error).toMatch(/swapped/);
  });

  it('rejects an implausible pulse', () => {
    expect(validateBpInput({ systolic: 120, diastolic: 80, pulse: 400 })).toHaveLength(1);
  });
});

describe('averageSince', () => {
  const at = (d: number, h = 8) => new Date(2026, 10, d, h).toISOString();
  const readings: BpReading[] = [
    { id: 'a', systolic: 130, diastolic: 80, pulse: null, at: at(18) },
    { id: 'b', systolic: 140, diastolic: 90, pulse: 72, at: at(15) },
    { id: 'c', systolic: 125, diastolic: 85, pulse: null, at: at(12, 20) },
    { id: 'd', systolic: 170, diastolic: 100, pulse: null, at: at(1) },
  ];
  const now = new Date(2026, 10, 18, 12);

  it('averages readings in the last 7 calendar days', () => {
    expect(averageSince(readings, daysAgo(now, 7))).toEqual({ systolic: 132, diastolic: 85, count: 3 });
  });

  it('returns null when there are no readings in range', () => {
    expect(averageSince(readings, new Date(2026, 10, 19))).toBeNull();
    expect(averageSince([], daysAgo(now, 7))).toBeNull();
  });
});

describe('daysAgo', () => {
  it('starts at local midnight, counting today as day 1', () => {
    const start = daysAgo(new Date(2026, 10, 18, 15, 30), 7);
    expect(start).toEqual(new Date(2026, 10, 12));
  });
});

describe('formatBp', () => {
  it('shows systolic over diastolic', () => {
    expect(formatBp({ systolic: 128.4, diastolic: 81.6 })).toBe('128/82');
  });
});
