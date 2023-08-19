import { expectTypeOf } from 'expect-type';

import {
  cleanUpObject,
  getNestedProperty,
  invertKeys,
  keyMirror,
  mergeProps,
  objectEntries,
  objectKeys,
  objectToArray,
  omit,
  pick,
  queryStringFormat,
  queryStringParse,
  sortObjectKeys,
} from '../src';

const baseObject = { a: 1, b: '', c: [1], d: { a: null }, e: undefined };

describe('cleanUpObject', () => {
  it('should remove the undefined properties', () => {
    expect(cleanUpObject(baseObject)).toEqual(omit(baseObject, 'e'));
    expectTypeOf(cleanUpObject(baseObject)).toEqualTypeOf<{
      a: number;
      b: string;
      c: Array<number>;
      d: { a: null };
    }>();
  });
});

describe('getNestedProperty', () => {
  it('should return the proper value if it exists', () => {
    expect(
      getNestedProperty({ children: { letters: ['a', 'b', 'c'] } }, 'children.letters'),
    ).toEqual(['a', 'b', 'c']);
    expect(
      getNestedProperty({ children: { letters: ['a', 'b', 'c'] } }, 'children.letters.1'),
    ).toBe('b');
    expect(getNestedProperty(baseObject, 'a')).toBe(1);
    expect(getNestedProperty([{ children: ['a', 'b', 'c'] }], '0.children.1')).toBe('b');
    expect(
      getNestedProperty({ children: { letters: ['a', 'b', 'c'] } }, 'children.letters.5'),
    ).toBeUndefined();
    expect(getNestedProperty([{ a: 5 }, { a: 7 }, { a: 10 }], '0.a')).toBe(5);
    expect(getNestedProperty([{ a: 5 }, { a: 7 }, { a: 10 }], '+.a')).toEqual([5, 7, 10]);
    expect(
      getNestedProperty({ children: [{ a: 5 }, { a: 7 }, { a: 10 }] }, 'children.+.a'),
    ).toEqual([5, 7, 10]);
    expect(getNestedProperty([5, 10], '0')).toBe(5);
    expect(getNestedProperty([0, 1], 'children')).toBeUndefined();
  });

  it('should return the original value', () => {
    // @ts-expect-error - invalid value
    expect(getNestedProperty('0,2', 0)).toBe('0,2');
    // @ts-expect-error - invalid value
    expect(getNestedProperty(null, 0)).toBeNull();
    // @ts-expect-error - invalid value
    expect(getNestedProperty(undefined, 0)).toBeUndefined();
  });
});

describe('invertKeys', () => {
  it('should return properly', () => {
    expect(invertKeys(pick(baseObject, 'a'))).toEqual({ '1': 'a' });
    expect(invertKeys({ name: 'John' })).toEqual({ John: 'name' });
    expectTypeOf(invertKeys({ name: 'John' })).toEqualTypeOf<{ John: 'name' }>();
  });

  it('should throw for bad inputs', () => {
    // @ts-expect-error - invalid value
    expect(() => invertKeys([])).toThrow('Expected an object');
    // @ts-expect-error - invalid value
    expect(() => invertKeys('a')).toThrow('Expected an object');
  });
});

describe('keyMirror', () => {
  it('should return properly', () => {
    expect(keyMirror(baseObject)).toEqual({ a: 'a', b: 'b', c: 'c', d: 'd', e: 'e' });
    expectTypeOf(keyMirror(baseObject)).toEqualTypeOf<{
      a: 'a';
      b: 'b';
      c: 'c';
      d: 'd';
      e: 'e';
    }>();
  });

  it('should throw for bad inputs', () => {
    // @ts-expect-error - invalid value
    expect(() => keyMirror([])).toThrow('Expected an object');
    // @ts-expect-error - invalid value
    expect(() => keyMirror('a')).toThrow('Expected an object');
  });
});

describe('mergeProps', () => {
  it('should return properly', () => {
    type Props = { name: string; type?: 'org' | 'user'; url?: string };

    const defaultProps = { type: 'user' } satisfies Omit<Props, 'name'>;
    const props: Props = { name: 'John', url: undefined };

    expect(mergeProps(defaultProps, props)).toEqual({ name: 'John', type: 'user' });
    expectTypeOf(mergeProps(defaultProps, props)).toEqualTypeOf<{
      name: string;
      type: 'org' | 'user';
      url?: string;
    }>();
  });
});

describe('objectEntries', () => {
  it('should return properly', () => {
    const entries = objectEntries(baseObject);

    expect(entries).toEqual(Object.entries(baseObject));
    expectTypeOf(entries).toEqualTypeOf<
      Array<['c', number[]] | ['a', number] | ['b', string] | ['d', { a: null }] | ['e', undefined]>
    >();
  });

  it('should return properly for a custom index signature', () => {
    const props: {
      debug: boolean;
    } = { debug: true };
    const entries = objectEntries(props);

    expect(entries).toEqual(Object.entries(props));
    expectTypeOf(entries).toEqualTypeOf<Array<['debug', boolean]>>();
  });
});

describe('objectKeys', () => {
  it('should return properly', () => {
    const entries = objectKeys(baseObject);

    expect(entries).toEqual(Object.keys(baseObject));
    expectTypeOf(entries).toEqualTypeOf<Array<'c' | 'a' | 'b' | 'd' | 'e'>>();
  });

  it('should return properly for a custom index signature', () => {
    const props: {
      debug: boolean;
    } = { debug: true };
    const entries = objectKeys(props);

    expect(entries).toEqual(Object.keys(props));
    expectTypeOf(entries).toEqualTypeOf<Array<'debug'>>();
  });
});

describe('objectToArray', () => {
  it('should throw with bad input', () => {
    // @ts-expect-error - invalid value
    expect(() => objectToArray(['a'])).toThrow('Expected an object');
    // @ts-expect-error - invalid value
    expect(() => objectToArray('a')).toThrow('Expected an object');
  });

  it('should convert an object into an array', () => {
    expect(objectToArray({ foo: 'foo', bar: 'bar' })).toEqual([{ foo: 'foo' }, { bar: 'bar' }]);
  });

  it('should convert an object into an array using filter', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const fn = () => undefined;

    expect(objectToArray({ foo: 'bar', dig: 2 }, 'string')).toEqual([{ foo: 'bar' }]);
    expect(objectToArray({ foo: 'bar', bar: fn }, 'string')).toEqual([{ foo: 'bar' }]);
  });
});

describe('omit', () => {
  it('should return properly', () => {
    interface Payload {
      a: number;
      b: string;
    }
    const payload: Payload = { a: 1, b: '' };

    expect(omit(payload, 'b')).toEqual({ a: 1 });
    expectTypeOf(omit(payload, 'b')).toEqualTypeOf<{ a: number }>();
  });

  it.each([
    [omit(baseObject, 'c'), { a: 1, b: '', d: { a: null } }],
    [omit(baseObject, 'a', 'd'), { b: '', c: [1] }],
    // @ts-expect-error - using a non-existent key
    [omit(baseObject, 'x'), baseObject],
    [omit(baseObject), baseObject],
  ])('should be %p', (result, expected) => {
    expect(result).toEqual(expected);
  });

  it('should throw for bad inputs', () => {
    // @ts-expect-error - invalid value
    expect(() => omit(['a'])).toThrow('Expected an object');
  });
});

describe('pick', () => {
  it('should return properly', () => {
    expect(pick(baseObject, 'a')).toEqual({ a: 1 });
    expectTypeOf(pick(baseObject, 'a')).toEqualTypeOf<{ a: number }>();
  });

  it.each([
    [pick(baseObject, 'c'), { c: [1] }],
    [pick(baseObject, 'a', 'd'), { a: 1, d: { a: null } }],
    // @ts-expect-error - invalid value
    [pick(baseObject, 'x'), {}],
    [pick(baseObject), baseObject],
  ])('should be %p', (result, expected) => {
    expect(result).toEqual(expected);
  });

  it('should throw for bad inputs', () => {
    // @ts-expect-error - invalid value
    expect(() => pick(['a'])).toThrow('Expected an object');
  });
});

describe('queryStringFormat', () => {
  it.each([
    [
      'a complex object',
      { p: { BRL: ['R$50 - R$100', 'R$100+'] }, c: ['COSMIC', 'COPPER'] },
      "input format isn't supported",
    ],
    ['an array', ['R$50 - R$100', 'R$100+'], "input type isn't supported"],
    ['a string', 'R$50 - R$100', "input type isn't supported"],
  ])('should throw with %s', (_, input, expected) => {
    // @ts-expect-error - invalid value
    expect(() => queryStringFormat(input)).toThrow(expected);
  });

  it.each([
    [{ tipo: 'cão', raça: 'pastor alemão' }, 'tipo=c%C3%A3o&raça=pastor%20alem%C3%A3o', {}],
    [
      { tipo: 'cão', raça: 'pastor alemão' },
      'tipo=c%C3%A3o&ra%C3%A7a=pastor%20alem%C3%A3o',
      { encodeValuesOnly: false },
    ],
    [
      { type: 'dog', breed: 'german shepperd' },
      '?type=dog&breed=german%20shepperd',
      { addPrefix: true },
    ],
    [
      { p: ['R$50 - R$100', 'R$100+'], c: ['COSMIC', 'COPPER'] },
      'p=R%2450%20-%20R%24100,R%24100%2B&c=COSMIC,COPPER',
      {},
    ],
  ])('should stringify %s properly', (input, result, addPrefix: any = {}) => {
    expect(queryStringFormat(input, addPrefix)).toEqual(result);
  });
});

describe('queryStringParse', () => {
  it.each([
    ['?type=dog&breed=german%20shepperd', { type: 'dog', breed: 'german shepperd' }],
    ['?type=cat&breed=wild%20african%20cat', { type: 'cat', breed: 'wild african cat' }],
    [
      '?p=R%2450%20-%20R%24100,R%24100+&c=COSMIC,COPPER',
      { c: 'COSMIC,COPPER', p: 'R$50 - R$100,R$100+' },
    ],
    ['tipo=c%C3%A3o&ra%C3%A7a=pastor%20alem%C3%A3o', { tipo: 'cão', raça: 'pastor alemão' }],
  ])('%p should parse properly', (input, result) => {
    expect(queryStringParse(input)).toEqual(result);
  });
});

describe('sortObjectKeys', () => {
  it('should return properly', () => {
    const value = sortObjectKeys({
      zar: 'raz',
      foo: 'bar',
      tar: 'foo',
      arg: 'tar',
    });

    expect(value).toMatchSnapshot();
    expectTypeOf(value).toEqualTypeOf<{ arg: string; foo: string; tar: string; zar: string }>();
  });
});
