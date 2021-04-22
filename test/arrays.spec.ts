import { sortByLocaleCompare, sortByPrimitive } from '../src';

describe('sortByLocaleCompare', () => {
  it.each([
    ['portuguese', ['Mãe', 'limão', 'cachê', 'tião', 'amô', 'côncavo'], undefined],
    ['french', ['réservé', 'Premier', 'Cliché', 'communiqué', 'café', 'Adieu'], undefined],
    [
      'english',
      ['port', 'Mars', 'Car', 'cart', 'Payment', 'asylum', 'Asian'],
      { descending: true },
    ],
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
