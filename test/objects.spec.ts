import {
  blacklist,
  invertKeys,
  keyMirror,
  queryStringFormat,
  queryStringParse,
  sortObjectKeys,
} from '../src';

describe('blacklist', () => {
  const base = { a: 1, b: 2, c: [1], d: { a: null } };

  it.each([
    [blacklist(base, 'c'), { a: 1, b: 2, d: { a: null } }],
    [blacklist(base, 'a', 'd'), { b: 2, c: [1] }],
    // @ts-ignore
    [blacklist(base, 'x'), base],
    [blacklist(base), base],
  ])('should be %p', (result, expected) => {
    expect(result).toEqual(expected);
  });

  it('should throw for bad inputs', () => {
    expect(() => blacklist([])).toThrow('Expected an object');
  });
});

describe('invertKeys', () => {
  it('should return properly', () => {
    expect(invertKeys({ name: 'John' })).toEqual({ John: 'name' });
  });

  it('should throw for bad inputs', () => {
    expect(() => invertKeys([])).toThrow('Expected an object');
    // @ts-ignore
    expect(() => invertKeys('a')).toThrow('Expected an object');
  });
});

describe('keyMirror', () => {
  it('should return properly', () => {
    expect(keyMirror({ NAME: 'John Doe' })).toEqual({ NAME: 'NAME' });
  });

  it('should throw for bad inputs', () => {
    expect(() => keyMirror([])).toThrow('Expected an object');
    // @ts-ignore
    expect(() => keyMirror('a')).toThrow('Expected an object');
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
