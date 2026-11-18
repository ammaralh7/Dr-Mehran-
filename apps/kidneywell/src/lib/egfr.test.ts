import { describe, expect, it } from '@jest/globals';

import {
  calculateEgfr,
  gfrCategory,
  gfrCategorySeverity,
  toMgPerDl,
  validateEgfrInput,
} from './egfr';

describe('calculateEgfr (CKD-EPI 2021)', () => {
  // Expected values worked by hand from the published equation. Clinical
  // reviewers should spot-check these against the NKF online calculator.
  it.each([
    // creatinine, unit, age, sex, expected (rounded)
    [1.0, 'mg/dL', 50, 'male', 92],
    [1.2, 'mg/dL', 60, 'female', 52],
    [0.6, 'mg/dL', 30, 'female', 124],
    [0.7, 'mg/dL', 40, 'male', 119],
    [3.5, 'mg/dL', 70, 'male', 18],
    [8.0, 'mg/dL', 55, 'female', 5],
  ] as const)('Scr %p %s, age %p, %s → %p', (creatinine, unit, age, sex, expected) => {
    expect(Math.round(calculateEgfr({ creatinine, unit, age, sex }))).toBe(expected);
  });

  it('gives the same result for equivalent mg/dL and µmol/L values', () => {
    const mg = calculateEgfr({ creatinine: 1.2, unit: 'mg/dL', age: 60, sex: 'female' });
    const umol = calculateEgfr({ creatinine: 1.2 * 88.4, unit: 'umol/L', age: 60, sex: 'female' });
    expect(umol).toBeCloseTo(mg, 10);
  });

  it('is continuous at the κ threshold', () => {
    const below = calculateEgfr({ creatinine: 0.9 - 1e-9, unit: 'mg/dL', age: 50, sex: 'male' });
    const above = calculateEgfr({ creatinine: 0.9 + 1e-9, unit: 'mg/dL', age: 50, sex: 'male' });
    expect(above).toBeCloseTo(below, 5);
  });

  it('decreases as creatinine rises', () => {
    const values = [0.5, 0.8, 1.0, 1.5, 2.5, 5].map((creatinine) =>
      calculateEgfr({ creatinine, unit: 'mg/dL', age: 45, sex: 'female' }),
    );
    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeLessThan(values[i - 1]);
    }
  });

  it('throws on invalid input', () => {
    expect(() => calculateEgfr({ creatinine: 1, unit: 'mg/dL', age: 15, sex: 'male' })).toThrow();
  });
});

describe('validateEgfrInput', () => {
  it('accepts a typical adult result', () => {
    expect(validateEgfrInput({ creatinine: 1.1, unit: 'mg/dL', age: 42, sex: 'male' })).toEqual([]);
  });

  it('rejects under-18s', () => {
    expect(validateEgfrInput({ creatinine: 1, unit: 'mg/dL', age: 17, sex: 'female' })).toHaveLength(1);
  });

  it('rejects missing values', () => {
    expect(validateEgfrInput({ creatinine: NaN, unit: 'mg/dL', age: NaN, sex: 'female' })).toHaveLength(2);
  });

  it('hints at the unit when a µmol/L value is entered as mg/dL', () => {
    const [error] = validateEgfrInput({ creatinine: 88, unit: 'mg/dL', age: 50, sex: 'male' });
    expect(error).toMatch(/µmol\/L/);
  });

  it('hints at the unit when a mg/dL value is entered as µmol/L', () => {
    const [error] = validateEgfrInput({ creatinine: 1.0, unit: 'umol/L', age: 50, sex: 'male' });
    expect(error).toMatch(/mg\/dL/);
  });
});

describe('toMgPerDl', () => {
  it('converts µmol/L to mg/dL', () => {
    expect(toMgPerDl(88.4, 'umol/L')).toBeCloseTo(1);
    expect(toMgPerDl(1.3, 'mg/dL')).toBe(1.3);
  });
});

describe('gfrCategory', () => {
  it.each([
    [120, 'G1'],
    [90, 'G1'],
    [89.6, 'G1'], // rounds to 90, as labs report whole numbers
    [89.4, 'G2'],
    [60, 'G2'],
    [59, 'G3a'],
    [45, 'G3a'],
    [44, 'G3b'],
    [30, 'G3b'],
    [29, 'G4'],
    [15, 'G4'],
    [14, 'G5'],
    [3, 'G5'],
  ] as const)('%p → %s', (egfr, category) => {
    expect(gfrCategory(egfr)).toBe(category);
  });

  it('maps categories to severity', () => {
    expect(gfrCategorySeverity('G2')).toBe('ok');
    expect(gfrCategorySeverity('G3b')).toBe('caution');
    expect(gfrCategorySeverity('G4')).toBe('urgent');
  });
});
