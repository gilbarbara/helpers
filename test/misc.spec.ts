/**
 * @vitest-environment happy-dom
 */

import {
  conditional,
  copyToClipboard,
  getDataType,
  invariant,
  isJSON,
  isRequired,
  logger,
  noop,
  nullify,
  popupCenter,
  px,
  unique,
  uuid,
} from '../src';

describe('conditional', () => {
  it.each([
    { input: 'a', expected: 'a' },
    { input: 'b', expected: 'b' },
    { input: 'c', expected: 'c' },
    { input: 'd', expected: 'default' },
  ])('should return "$expected" for "$input"', ({ expected, input }) => {
    const result = conditional(
      [
        [input === 'a', () => 'a'],
        [[input].includes('b'), () => 'b'],
        [input === 'c', () => 'c'],
      ],
      () => 'default',
    );

    expect(result).toBe(expected);
  });
});

describe('copyToClipboard', () => {
  it('should copy to clipboard', async () => {
    const result = await copyToClipboard('Hello');

    expect(result).toBe(true);
    const data = await window.navigator.clipboard.readText();

    expect(data).toBe('Hello');
  });

  it('should handle errors', async () => {
    const permissionStatus = await window.navigator.permissions.query({
      // @ts-ignore
      name: 'clipboard-write',
    });

    // @ts-ignore
    permissionStatus.state = 'denied';

    const result = await copyToClipboard('Hello');

    expect(result).toBe(false);
  });
});

describe('getDataType', () => {
  const string = 'Test';

  function* mockGenerator() {
    yield 1;
  }

  async function* mockGeneratorAsync() {
    yield 1;
  }

  it.each([
    { input: string, expected: 'String' },
    { input: 12, expected: 'Number' },
    { input: BigInt('0x1fffffffffffff'), expected: 'BigInt' },
    { input: true, expected: 'Boolean' },
    { input: null, expected: 'Null' },
    { input: undefined, expected: 'Undefined' },
    { input: {}, expected: 'Object' },
    { input: [], expected: 'Array' },
    { input: [].values(), expected: 'Array Iterator' },
    { input: new ArrayBuffer(2), expected: 'ArrayBuffer' },
    { input: Symbol(string), expected: 'Symbol' },
    {
      input: () => {},
      expected: 'Function',
    },
    {
      input: async () => {},
      expected: 'AsyncFunction',
    },
    { input: mockGenerator, expected: 'GeneratorFunction' },
    { input: mockGenerator(), expected: 'Generator' },
    { input: mockGeneratorAsync, expected: 'AsyncGeneratorFunction' },
    { input: mockGeneratorAsync(), expected: 'AsyncGenerator' },
    { input: new Date(), expected: 'Date' },
    { input: /Test/, expected: 'RegExp' },
    {
      input: new Promise(() => {}),
      expected: 'Promise',
    },
    { input: new Error(), expected: 'Error' },
    { input: new Map(), expected: 'Map' },
    { input: new Set(), expected: 'Set' },
    { input: new WeakMap(), expected: 'WeakMap' },
    { input: new WeakSet(), expected: 'WeakSet' },
    { input: document.createElement('div'), expected: 'HTMLElement' },
    { input: document.createElement('span'), expected: 'HTMLElement' },
    { input: document.createTextNode(string), expected: 'Text' },
    { input: document.createComment(string), expected: 'Comment' },
    { input: document.createDocumentFragment(), expected: 'DocumentFragment' },
  ])(`should return $expected`, ({ expected, input }) => {
    expect(getDataType(input)).toBe(expected);
  });

  it('should return the type in lowercase', () => {
    expect(getDataType([], true)).toBe('array');
  });
});

describe('invariant', () => {
  const message = 'value must be a string';

  it('should NOT throw if the condition is truthy', () => {
    expect(invariant('value', message)).toBeUndefined();
  });

  it('should throw if the condition is false', () => {
    expect(() => invariant(typeof 12 === 'string', () => message)).toThrow(message);
    expect(() => invariant(typeof 12 === 'string', message)).toThrow(message);
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
    expect(() => isRequired()).toThrow(`"parameter" is required`);
  });

  it.each([
    { type: TypeError, name: 'value' },
    { type: SyntaxError, name: 'input' },
    { type: RangeError, name: 'input' },
    { type: ReferenceError, name: 'input' },
    { type: URIError, name: 'input' },
  ])('should throw a $type with $name', ({ name, type }) => {
    expect(() => isRequired(name, type)).toThrow(type || Error);
    expect(() => isRequired(name, type)).toThrow(`"${name}" is required`);
  });
});

describe('logger', () => {
  const log = vi.spyOn(console, 'log').mockImplementation(noop);
  const group = vi.spyOn(console, 'group').mockImplementation(noop);
  const groupCollapsed = vi.spyOn(console, 'groupCollapsed').mockImplementation(noop);
  const groupEnd = vi.spyOn(console, 'groupEnd').mockImplementation(noop);

  beforeAll(() => {
    vi.setSystemTime(new Date(2019, 1, 1, 0, 0, 0));
  });

  afterAll(() => {
    vi.restoreAllMocks();
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

describe('nullify', () => {
  it.each([
    { input: {}, expected: {} },
    { input: [], expected: [] },
    { input: 'text', expected: 'text' },
    { input: 0, expected: 0 },
    { input: false, expected: false },
    { input: undefined, expected: null },
  ])('$input should return $expected', ({ expected, input }) => {
    expect(nullify(input)).toEqual(expected);
  });
});

describe('popupCenter', () => {
  const { focus, open } = window;

  beforeAll(() => {
    vi.spyOn(window, 'focus').mockImplementation(() => true);
    vi.spyOn(window, 'open').mockImplementation(() => window);
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
    const result1 = unique();

    expect(result1).toEqual(expect.stringMatching(regex));
    expect(result1).toHaveLength(8);

    const result2 = unique(24);

    expect(result2).toEqual(expect.stringMatching(regex));
    expect(result2).toHaveLength(24);

    const result3 = unique(12, {
      includeLowercase: false,
      includeUppercase: false,
      includeNumbers: false,
      includeSymbols: true,
    });

    expect(result3).toEqual(expect.stringMatching(/^[!#$%&*+.:=?@^_~-]+$/));
    expect(result3).toHaveLength(12);
  });
});

describe('uuid', () => {
  it('should return an uuid', () => {
    expect(uuid()).toEqual(expect.stringMatching(/^[\da-z-]+$/));
  });
});
