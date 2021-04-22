import { ceil, floor, pad, randomInt, round } from '../src';

describe('ceil', () => {
  it.each([
    [34.0293992838, undefined, 34.03],
    [34.0293992838, 1, 34.1],
    [129.017838992, 4, 129.0179],
  ])('should convert %p with %p digits to %p', (input, digits, expected) => {
    expect(ceil(input, digits)).toEqual(expected);
  });
});

describe('floor', () => {
  it.each([
    [34.0293992838, undefined, 34.02],
    [34.0293992838, 1, 34],
    [129.017838992, 4, 129.0178],
  ])('should convert %p with %p digits to %p', (input, digits, expected) => {
    expect(floor(input, digits)).toEqual(expected);
  });
});

describe('pad', () => {
  it.each([
    [2, undefined, '02'],
    [12, 4, '0012'],
  ])('should convert %p with length %p to %p', (input, length, expected) => {
    expect(pad(input, length)).toEqual(expected);
  });
});

describe('randomInt', () => {
  it.each([
    [0, 1],
    [1, 10],
    [100, 1000],
    [100, 100],
  ])('should return a number between %p and %p', (min, max) => {
    expect(randomInt(min, max))
      .toBeGreaterThanOrEqual(min)
      .toBeLessThan(max + 1);
  });

  it('should return a number without parameters', () => {
    expect(randomInt()).toBeGreaterThanOrEqual(0).toBeLessThan(11);
  });
});

describe('round', () => {
  it.each([
    [34.0293992838, undefined, 34.03],
    [203.09273772, 1, 203.1],
    [129.017898992, 4, 129.0179],
  ])('should convert %p with %p digits to %p', (input, digits, expected) => {
    expect(round(input, digits)).toEqual(expected);
  });
});
