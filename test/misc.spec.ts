/* eslint-disable no-console */
import { advanceTo } from 'jest-date-mock';

import {
  copyToClipboard,
  demethodize,
  isJSON,
  isRequired,
  logger,
  measureExecutionTime,
  noop,
  nullify,
  popupCenter,
  px,
  sleep,
  unique,
  uuid,
} from '../src';

describe('copyToClipboard', () => {
  let mockWriteText: any = jest.fn();

  beforeAll(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: (input: string) => mockWriteText(input),
      },
    });
  });

  afterAll(() => {
    Object.assign(navigator, {
      clipboard: undefined,
    });
  });

  it('should copy to clipboard', async () => {
    const result = await copyToClipboard('Hello');

    expect(result).toBe(true);
    expect(mockWriteText).toHaveBeenCalledWith('Hello');
  });

  it('should handle errors', async () => {
    mockWriteText = () => {
      throw new Error();
    };

    const result = await copyToClipboard('Hello');

    expect(result).toBe(false);
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

describe('isJSON', () => {
  it('should identify properly', () => {
    expect(isJSON('["a"]')).toBeTrue();
    expect(isJSON('{ "a": 1 }')).toBeTrue();
    expect(isJSON('Simple text')).toBeFalse();
  });
});

describe('isRequired', () => {
  it('should throw an Error without input', () => {
    expect(() => isRequired())
      .toThrow(Error)
      .toThrow(`"parameter" is required`);
  });

  it.each([
    [TypeError, 'value'],
    [SyntaxError, 'input'],
    [RangeError, 'input'],
    [ReferenceError, 'input'],
    [URIError, 'input'],
  ])('should throw a %p with %p', (type, name) => {
    expect(() => isRequired(name, type))
      .toThrow(type || Error)
      .toThrow(`"${name}" is required`);
  });
});

describe('logger', () => {
  const log = jest.spyOn(console, 'log').mockImplementation(noop);
  const group = jest.spyOn(console, 'group').mockImplementation(noop);
  const groupCollapsed = jest.spyOn(console, 'groupCollapsed').mockImplementation(noop);
  const groupEnd = jest.spyOn(console, 'groupEnd').mockImplementation(noop);

  beforeAll(() => {
    advanceTo(new Date(2019, 1, 1, 0, 0, 0));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('without options', () => {
    logger('type', 'Title', { a: 1 });

    expect(console.groupCollapsed).toHaveBeenLastCalledWith(
      '%c type %cTitle %c@ 00:00:00',
      'color: gray; font-weight: lighter;',
      'color: inherit;',
      'color: gray; font-weight: lighter;',
    );
    expect(console.log).toHaveBeenLastCalledWith({ a: 1 });
    expect(console.groupEnd).toHaveBeenCalledTimes(1);
  });

  it('with typeColor option', () => {
    logger('type', 'Title', ['a'], { typeColor: '#ffc52e' });

    expect(groupCollapsed).toHaveBeenLastCalledWith(
      '%c type %cTitle %c@ 00:00:00',
      'color: #ffc52e; font-weight: lighter;',
      'color: inherit;',
      'color: gray; font-weight: lighter;',
    );
    expect(log).toHaveBeenLastCalledWith(['a']);
    expect(groupEnd).toHaveBeenCalledTimes(2);
  });

  it('with hideTimestamp option', () => {
    logger('type', 'Title', 'OK', { hideTimestamp: true });

    expect(groupCollapsed).toHaveBeenLastCalledWith(
      '%c type %cTitle',
      'color: gray; font-weight: lighter;',
      'color: inherit;',
    );
    expect(log).toHaveBeenLastCalledWith('OK');
    expect(groupEnd).toHaveBeenCalledTimes(3);
  });

  it('with collapsed option', () => {
    logger('type', 'Title', null, { collapsed: false });

    expect(group).toHaveBeenLastCalledWith(
      '%c type %cTitle %c@ 00:00:00',
      'color: gray; font-weight: lighter;',
      'color: inherit;',
      'color: gray; font-weight: lighter;',
    );
    expect(log).toHaveBeenLastCalledWith(null);
    expect(groupEnd).toHaveBeenCalledTimes(4);
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

describe('nullify', () => {
  it.each([
    [{}, {}],
    [[], []],
    ['text', 'text'],
    [0, 0],
    [false, false],
    [undefined, null],
  ])('should receive %p and return %p', (value, expected) => {
    expect(nullify(value)).toEqual(expected);
  });
});

describe('popupCenter', () => {
  const { focus, open } = window;

  beforeAll(() => {
    window = Object.create(window);
    window.focus = jest.fn(() => true);
    window.open = jest.fn(() => window);
  });

  afterAll(() => {
    window.focus = focus;
    window.open = open;
  });

  it('should "create" a popup window', () => {
    const popup = popupCenter('https://example.com', 'PopUp', 400, 400);

    expect(popup).toEqual(window);
  });
});

describe('px', () => {
  it.each([
    { value: undefined, expected: undefined },
    { value: '10', expected: '10px' },
    { value: '15px', expected: '15px' },
    { value: '20rem', expected: '20rem' },
    { value: 30, expected: '30px' },
  ])('should return $expected for $value', ({ expected, value }) => {
    expect(px(value)).toBe(expected);
  });
});

describe('unique', () => {
  const regex = /^[\dA-Za-z]+$/;

  it('should return a unique string', () => {
    expect(unique()).toEqual(expect.stringMatching(regex)).toHaveLength(8);
    expect(unique(24)).toEqual(expect.stringMatching(regex)).toHaveLength(24);
    expect(
      unique(12, {
        includeLowercase: false,
        includeUppercase: false,
        includeNumbers: false,
        includeSymbols: true,
      }),
    )
      .toEqual(expect.stringMatching(/^[!#$%&*+.:=?@^_~-]+$/))
      .toHaveLength(12);
  });
});

describe('uuid', () => {
  it('should return an uuid', () => {
    expect(uuid()).toEqual(expect.stringMatching(/^[\da-z-]+$/));
  });
});
