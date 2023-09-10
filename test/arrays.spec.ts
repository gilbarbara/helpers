import {
  createArray,
  getRandomItem,
  quickSort,
  removeDuplicates,
  shuffle,
  sortByLocaleCompare,
  sortByPrimitive,
  sortComparator,
  splitIntoChunks,
} from '../src';

describe('createArray', () => {
  it.each([
    { size: 4, start: 0 },
    { size: 10, start: 1 },
    { size: 10, start: 5 },
  ])('should return an array with $size items starting at $start', ({ size, start }) => {
    expect(createArray(size, start)).toMatchSnapshot();
  });
});

describe('getRandomItem', () => {
  it.each([
    { input: ['alpha', 'beta', 'gamma', 'delta', 'epsilon'], expected: String },
    { input: [1, 2, 3, 4, 5], expected: Number },
    { input: [{ a: 1 }, { b: 2 }, { c: 3 }], expected: Object },
  ])('should return a single item', ({ expected, input }) => {
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

describe('removeDuplicates', () => {
  it('should remove duplicates from an number array', () => {
    const resultNumbers = removeDuplicates([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]);

    expect(resultNumbers).toEqual([1, 2, 3, 4, 5]);
    expectTypeOf(resultNumbers).toEqualTypeOf<Array<number>>();
  });

  it('should remove duplicates from an string array', () => {
    const resultStrings = removeDuplicates(['a', 'b', 'c', 'a', 'b', 'c']);

    expect(resultStrings).toEqual(['a', 'b', 'c']);
    expectTypeOf(resultStrings).toEqualTypeOf<Array<string>>();
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
    { title: 'portuguese', input: ['Mãe', 'limão', 'cachê', 'tião', 'amô', 'côncavo'] },
    { title: 'french', input: ['réservé', 'Premier', 'Cliché', 'communiqué', 'café', 'Adieu'] },
    {
      title: 'english',
      input: ['port', 'Mars', 'Car', 'cart', 'Payment', 'asylum', 'Asian'],
      options: { descending: true },
    },
    {
      title: 'numeric',
      input: ['32', '16', '24', '2', '8', '48', '4', '2'],
      options: { numeric: true },
    },
  ])('should sort an array in $title', ({ input, options }) => {
    expect(input.sort(sortByLocaleCompare(undefined, options))).toMatchSnapshot();
  });

  it.each([
    {
      title: 'ascending',
      input: [{ key: 'green' }, { key: 'amber' }, { key: 'red' }, { key: 'cyan' }],
    },
    {
      title: 'descending',
      input: [{ key: 'green' }, { key: 'amber' }, { key: 'red' }, { key: 'cyan' }],
      options: { descending: true },
    },
  ])('should sort an object $title', ({ input, options }) => {
    expect(input.sort(sortByLocaleCompare('key', options))).toMatchSnapshot();
  });
});

describe('sortByPrimitive', () => {
  it.each([
    {
      title: 'cycle-number-asc',
      key: 'cycle',
      input: [{ cycle: 1 }, { cycle: 4 }, { cycle: 3 }, { cycle: 3 }],
      descending: false,
    },
    {
      title: 'cycle-number-desc',
      key: 'cycle',
      input: [{ cycle: 1 }, { cycle: 4 }, { cycle: 3 }, { cycle: 3 }],
      descending: true,
    },
    { title: '-number-asc', key: undefined, input: [2, 4, 1, 3, 2], descending: false },
    { title: '-number-desc', key: undefined, input: [2, 4, 1, 3, 2], descending: true },
    {
      title: 'status-boolean-asc',
      key: 'status',
      input: [
        { cycle: 3, status: true },
        { cycle: 1, status: false },
        { cycle: 3, status: true },
        { cycle: 4, status: false },
      ],
      descending: false,
    },
    {
      title: 'status-boolean-desc',
      key: 'status',
      input: [
        { cycle: 3, status: true },
        { cycle: 1, status: false },
        { cycle: 3, status: true },
        { cycle: 4, status: false },
      ],
      descending: true,
    },
  ])('should sort an array by $title', ({ descending, input, key }) => {
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
    // @ts-expect-error - invalid value
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
