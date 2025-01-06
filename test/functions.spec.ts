import { debounce, demethodize, measureExecutionTime, noop, once, pipe, sleep } from '../src';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Use fake timers to control setTimeout
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers(); // Reset to real timers
  });

  it('should execute the callback after the delay', () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 200);

    debounced('arg1', 'arg2');

    // Fast forward time and ensure callback was called
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('arg1', 'arg2');
  });

  it('should only execute the callback once for multiple rapid calls', () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 200);

    debounced();
    debounced();
    debounced();

    // Only one call should occur after 200ms
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should reset the delay if called again within the wait time', () => {
    const callback = vi.fn();
    const debounced = debounce(callback, 200);

    debounced();
    vi.advanceTimersByTime(100); // 100ms passed, but not enough to trigger the callback
    debounced(); // Reset the timer
    vi.advanceTimersByTime(100); // Another 100ms passed, still not enough
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100); // Now enough time has passed
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

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
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterAll(() => {
    vi.clearAllMocks();
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
    const fn = vi.fn((input: number) => input + 1);
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
