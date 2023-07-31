import { expectTypeOf } from 'expect-type';

import { demethodize, measureExecutionTime, noop, once, pipe, sleep } from '../src';

describe('demethodize', () => {
  it('should handle Array methods', () => {
    const isVowel = (x: string) => ['a', 'e', 'i', 'o', 'u'].includes(x);
    const every = demethodize(Array.prototype.every);

    expect(every('abcd', isVowel)).toBeFalse();
    expect(every('eieio', isVowel)).toBeTrue();
  });

  it('should handle Number methods', () => {
    const toLocaleString = demethodize(Number.prototype.toLocaleString);
    const numbers = [2209.6, 124.56, 1048576];

    expect(numbers.map(toLocaleString)).toEqual(['2,209.6', '124.56', '1,048,576']);
  });
});

describe('measureExecutionTime', () => {
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should log the time it took to run', async () => {
    await measureExecutionTime(async () => {
      await sleep(1);
    });

    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/Completed in 1\d+ milliseconds/),
    );
  });
});

describe('noop', () => {
  it('should return undefined', () => {
    expect(noop()).toBeUndefined();
  });
});

describe('once', () => {
  it('should call the function just once', () => {
    const fn = jest.fn((input: number) => input + 1);
    const onceFn = once(fn);

    expect(onceFn(1)).toBe(2);
    expect(onceFn(1)).toBe(2);
    expect(fn).toHaveBeenCalledTimes(1);

    expectTypeOf(once((input: string) => input)).toEqualTypeOf<(input: string) => string>();
    expectTypeOf(once((input: number) => input)).toEqualTypeOf<(input: number) => number>();
  });
});

describe('pipe', () => {
  it('should pipe the functions', () => {
    const doubleThenIncrement = pipe(
      (n: number) => n * 2,
      (n: number) => n + 1,
    );

    expect(doubleThenIncrement(5)).toBe(11);
    expectTypeOf(doubleThenIncrement).toEqualTypeOf<(input: number) => number>();
  });
});
