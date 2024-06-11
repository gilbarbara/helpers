import { expect } from 'vitest';

import { ceil, clamp, floor, pad, percentage, randomNumber, round } from '../src';

describe('ceil', () => {
  it.each([
    { input: 34.0293992838, digits: undefined, expected: 34.03 },
    { input: 34.0293992838, digits: 1, expected: 34.1 },
    { input: 129.017838992, digits: 4, expected: 129.0179 },
  ])('$input with digits: $digits should return $expected', ({ digits, expected, input }) => {
    expect(ceil(input, digits)).toEqual(expected);
  });
});

describe('clamp', () => {
  it.each([
    { input: 120, expected: 100, min: 0, max: 100 },
    { input: 70, expected: 70, min: 0, max: 100 },
    { input: 12, expected: 10, min: 1, max: 10 },
    { input: -7, expected: 1, min: 1, max: 10 },
    { input: -1, expected: 0 },
  ])(
    '$input with min: $min and max: $max should return $expected',
    ({ expected, input, max, min }) => {
      expect(clamp(input, min, max)).toBe(expected);
    },
  );
});

describe('floor', () => {
  it.each([
    { input: 34.0293992838, expected: 34.02 },
    { input: 34.0293992838, digits: 1, expected: 34 },
    { input: 129.017838992, digits: 4, expected: 129.0178 },
  ])('$input with digits: $digits  should return $expected', ({ digits, expected, input }) => {
    expect(floor(input, digits)).toEqual(expected);
  });
});

describe('pad', () => {
  it.each([
    { input: 2, expected: '02' },
    { input: 12, length: 4, expected: '0012' },
  ])('$input with length $length should return $expected', ({ expected, input, length }) => {
    expect(pad(input, length)).toEqual(expected);
  });
});

describe('percentage', () => {
  it('should calculate the correct percentage', () => {
    expect(percentage(20, 72)).toBe(27.78);
  });

  it('should calculate the correct percentage for very large numbers', () => {
    expect(percentage(1e11, 1e12)).toBe(10);
  });

  it('should limit the result to 4 digits', () => {
    expect(percentage(50, 74, 4)).toBe(67.5676);
  });

  it('should return 0 when the result is not finite', () => {
    expect(percentage(50, 0)).toBe(0);
  });

  it('should return 0 with missing or wrong type inputs', () => {
    // @ts-expect-error testing wrong types and missing parameters
    expect(percentage('a')).toBe(0);
  });
});

describe('randomNumber', () => {
  it.each([
    { min: 0, max: 1 },
    { min: 1, max: 10 },
    { min: 100, max: 1000 },
    { min: 100, max: 100 },
  ])('should return a number between $min and $max', ({ max, min }) => {
    const result = randomNumber(min, max);

    expect(result).toBeGreaterThanOrEqual(min);
    expect(result).toBeLessThan(max + 1);
  });

  it('should return a number without parameters', () => {
    const result = randomNumber();

    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(11);
  });
});

describe('round', () => {
  it.each([
    { input: 34.0293992838, expected: 34.03 },
    { input: 203.09273772, digits: 1, expected: 203.1 },
    { input: 129.017898992, digits: 4, expected: 129.0179 },
  ])('$input with digits: $digits should return $expected', ({ digits, expected, input }) => {
    expect(round(input, digits)).toEqual(expected);
  });
});
