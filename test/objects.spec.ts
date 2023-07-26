import { expectTypeOf } from 'expect-type';

import {
  cleanUpObject,
  getNestedProperty,
  invertKeys,
  keyMirror,
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
    // @ts-ignore
    expect(getNestedProperty('0,2', 0)).toBe('0,2');
    // @ts-ignore
    expect(getNestedProperty(null, 0)).toBeNull();
    // @ts-ignore
    expect(getNestedProperty(undefined, 0)).toBeUndefined();
  });
});

describe('invertKeys', () => {
  it('should return properly', () => {
    expect(invertKeys({ name: 'John' })).toEqual({ John: 'name' });
  });

  it('should throw for bad inputs', () => {
    // @ts-ignore
    expect(() => invertKeys([])).toThrow('Expected an object');
    // @ts-ignore
    expect(() => invertKeys('a')).toThrow('Expected an object');
  });
});

describe('keyMirror', () => {
  it('should return properly', () => {
    expect(keyMirror({ NAME: 'John Doe' })).toEqual({ NAME: 'NAME' });
    expect(keyMirror({ TYPE: undefined })).toEqual({ TYPE: 'TYPE' });
  });

  it('should throw for bad inputs', () => {
    // @ts-ignore
    expect(() => keyMirror([])).toThrow('Expected an object');
    // @ts-ignore
    expect(() => keyMirror('a')).toThrow('Expected an object');
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
});

describe('objectKeys', () => {
  it('should return properly', () => {
    const entries = objectKeys(baseObject);

    expect(entries).toEqual(Object.keys(baseObject));
    expectTypeOf(entries).toEqualTypeOf<Array<'c' | 'a' | 'b' | 'd' | 'e'>>();
  });
});

describe('objectToArray', () => {
  it('should throw with bad input', () => {
    // @ts-ignore
    expect(() => objectToArray(['a'])).toThrow('Expected an object');
    // @ts-ignore
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
  it.each([
    [omit(baseObject, 'c'), { a: 1, b: '', d: { a: null } }],
    [omit(baseObject, 'a', 'd'), { b: '', c: [1] }],
    // @ts-ignore
    [omit(baseObject, 'x'), baseObject],
    [omit(baseObject), baseObject],
  ])('should be %p', (result, expected) => {
    expect(result).toEqual(expected);
  });

  it('should throw for bad inputs', () => {
    // @ts-ignore
    expect(() => omit(['a'])).toThrow('Expected an object');
  });
});

describe('pick', () => {
  it.each([
    [pick(baseObject, 'c'), { c: [1] }],
    [pick(baseObject, 'a', 'd'), { a: 1, d: { a: null } }],
    // @ts-ignore
    [pick(baseObject, 'x'), {}],
    [pick(baseObject), baseObject],
  ])('should be %p', (result, expected) => {
    expect(result).toEqual(expected);
  });

  it('should throw for bad inputs', () => {
    // @ts-ignore
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
    // @ts-ignore
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
    expect(
      sortObjectKeys({
        zar: 'raz',
        foo: 'bar',
        tar: 'foo',
        arg: 'tar',
      }),
    ).toMatchSnapshot();
  });
});
