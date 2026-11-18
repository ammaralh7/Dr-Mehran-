import { describe, expect, it } from '@jest/globals';

import { parseNumber } from './numbers';

describe('parseNumber', () => {
  it('parses plain and decimal numbers', () => {
    expect(parseNumber('120')).toBe(120);
    expect(parseNumber(' 1.25 ')).toBe(1.25);
  });

  it('accepts a comma decimal separator', () => {
    expect(parseNumber('1,2')).toBe(1.2);
  });

  it('returns NaN for empty or invalid input', () => {
    expect(parseNumber('')).toBeNaN();
    expect(parseNumber('   ')).toBeNaN();
    expect(parseNumber('abc')).toBeNaN();
    expect(parseNumber('12a')).toBeNaN();
  });
});
