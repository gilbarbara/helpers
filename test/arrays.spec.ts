import {
  createArray,
  getRandomItem,
  quickSort,
  shuffle,
  sortByLocaleCompare,
  sortByPrimitive,
  sortComparator,
  splitIntoChunks,
} from '../src';

describe('createArray', () => {
  it.each([
    [4, 0],
    [10, 1],
    [10, 5],
  ])('should return an array with %s items starting at %s', (input, start) => {
    expect(createArray(input, start)).toMatchSnapshot();
  });
});

describe('getRandomItem', () => {
  it.each([
    [['alpha', 'beta', 'gamma', 'delta', 'epsilon'], String],
    [[1, 2, 3, 4, 5], Number],
    [[{ a: 1 }, { b: 2 }, { c: 3 }], Object],
  ])('should return a single item', (input, expected) => {
    // @ts-expect-error - The dynamic nature of the test makes it hard to type
    expect(getRandomItem(input)).toEqual(expect.any(expected));
  });
});

describe('quickSort', () => {
  it('should sort numbers properly', () => {
    expect(quickSort([32, 16, 2, 24, 8, 48, 4, 2])).toEqual([2, 2, 4, 8, 16, 24, 32, 48]);
  });

  it('should sort strings properly', () => {
    expect(quickSort(['xy', 'zy', 'ab', 'cd', 'ab', 'tz'])).toEqual([
      'ab',
      'ab',
      'cd',
      'tz',
      'xy',
      'zy',
    ]);
  });
});

describe('shuffle', () => {
  it('should shuffle the array', () => {
    const input = [1, 2, 3, 'a', 'b', 'c', [4, 5], { a: 6, b: 7 }];

    expect(shuffle(input)).not.toEqual(input);
  });
});

describe('sortByLocaleCompare', () => {
  it.each([
    ['portuguese', ['Mãe', 'limão', 'cachê', 'tião', 'amô', 'côncavo'], undefined],
    ['french', ['réservé', 'Premier', 'Cliché', 'communiqué', 'café', 'Adieu'], undefined],
    [
      'english',
      ['port', 'Mars', 'Car', 'cart', 'Payment', 'asylum', 'Asian'],
      { descending: true },
    ],
    ['numeric', ['32', '16', '24', '2', '8', '48', '4', '2'], { numeric: true }],
  ])('should sort an array in %s', (_, input, options) => {
    expect(input.sort(sortByLocaleCompare(undefined, options))).toMatchSnapshot();
  });

  it.each([
    ['ascending', [{ key: 'green' }, { key: 'amber' }, { key: 'red' }, { key: 'cyan' }], undefined],
    [
      'descending',
      [{ key: 'green' }, { key: 'amber' }, { key: 'red' }, { key: 'cyan' }],
      { descending: true },
    ],
  ])('should sort an object %s', (_, input, options) => {
    expect(input.sort(sortByLocaleCompare('key', options))).toMatchSnapshot();
  });
});

describe('sortByPrimitive', () => {
  it.each([
    ['cycle-number-asc', 'cycle', [{ cycle: 1 }, { cycle: 4 }, { cycle: 3 }, { cycle: 3 }], false],
    ['cycle-number-desc', 'cycle', [{ cycle: 1 }, { cycle: 4 }, { cycle: 3 }, { cycle: 3 }], true],
    ['-number-asc', undefined, [2, 4, 1, 3, 2], false],
    ['-number-desc', undefined, [2, 4, 1, 3, 2], true],
    [
      'status-boolean-asc',
      'status',
      [
        { cycle: 3, status: true },
        { cycle: 1, status: false },
        { cycle: 3, status: true },
        { cycle: 4, status: false },
      ],
      false,
    ],
    [
      'status-boolean-desc',
      'status',
      [
        { cycle: 3, status: true },
        { cycle: 1, status: false },
        { cycle: 3, status: true },
        { cycle: 4, status: false },
      ],
      true,
    ],
  ])('should sort an array by %s', (_, key, input, descending) => {
    expect(input.sort(sortByPrimitive(key, descending))).toMatchSnapshot();
  });
});

describe('sortComparator', () => {
  it('should sort numbers properly', () => {
    expect([32, 16, 24, 2, 8, 48, 4, 2].sort(sortComparator)).toEqual([2, 2, 4, 8, 16, 24, 32, 48]);
  });

  it('should sort strings properly', () => {
    expect(['xy', 'zy', 'ab', 'cd', 'ab', 'tz'].sort(sortComparator)).toEqual([
      'ab',
      'ab',
      'cd',
      'tz',
      'xy',
      'zy',
    ]);
  });
});

describe('splitIntoChunks', () => {
  it('should throw if the input is not an array', () => {
    // @ts-ignore
    expect(() => splitIntoChunks({})).toThrow('expected an array for the first argument');
  });

  it('should split an array smaller than the limit into a single chunk', () => {
    const array = Array.from({ length: 20 }, (_, index) => index + 1);

    expect(splitIntoChunks(array)).toHaveLength(1);
  });

  it('should split a large array into multiple chunks', () => {
    const array = Array.from({ length: 200 }, (_, index) => index + 1);

    expect(splitIntoChunks(array)).toHaveLength(8);
  });
});
