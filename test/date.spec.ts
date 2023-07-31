import { advanceTo, clear } from 'jest-date-mock';

import {
  DAY,
  HOUR,
  isIsoDate,
  isoDate,
  isValidDate,
  MINUTE,
  MONTH,
  now,
  timeSince,
  timestamp,
  WEEK,
  YEAR,
} from '../src';

describe('constants', () => {
  it.each([
    ['MINUTE', 60, MINUTE],
    ['HOUR', 3600, HOUR],
    ['DAY', 86400, DAY],
    ['WEEK', 604800, WEEK],
    ['MONTH', 2592000, MONTH],
    ['YEAR', 31536000, YEAR],
  ])('%p should return %p', (_, expected, constant) => {
    expect(constant).toBe(expected);
  });
});

describe('date', () => {
  beforeAll(() => {
    advanceTo(new Date(2019, 1, 1, 0, 0, 0));
  });

  afterAll(() => {
    clear();
  });

  describe('isIsoDate', () => {
    it.each([
      ['2000-01-01T00:00:00.000Z', true],
      ['2018-02-18T20:40:00.000Z', true],
      ['2019-02-01T02:00:00.000Z', true],
      [new Date().toISOString(), true],
      [new Date().toUTCString(), false],
      [new Date().toLocaleString(), false],
      [new Date().toDateString(), false],
    ])('should return properly for %p', (input, expected) => {
      expect(isIsoDate(input)).toBe(expected);
    });
  });

  describe('isoDate', () => {
    it.each([
      ['2000-01-01', '2000-01-01T00:00:00.000Z'],
      [1518986400000, '2018-02-18T20:40:00.000Z'],
      [undefined, '2019-02-01T02:00:00.000Z'],
    ])('should return properly for %p', (input, expected) => {
      expect(isoDate(input)).toBe(expected);
    });
  });

  describe('isValidDate', () => {
    it.each([
      ['2000-01-01', true],
      [1518986400000, true],
      [new Date(), true],
      ['abcd', false],
    ])('%p should return %p', (input, expected) => {
      expect(isValidDate(input)).toBe(expected);
    });

    it('should return false for invalid dates', () => {
      // @ts-expect-error - Testing invalid input
      expect(isValidDate(undefined)).toBe(false);
      // @ts-expect-error - Testing invalid input
      expect(isValidDate([])).toBe(false);
    });
  });

  describe('now', () => {
    it('should return properly', () => {
      expect(now()).toBe(1548986400);
    });
  });

  describe('timeSince', () => {
    it.each([
      [new Date(2018, 12, 31, 23, 59, 20), '40 seconds ago', undefined],
      [new Date(2018, 12, 31, 23, 57, 50).toISOString(), '2 minutes ago', undefined],
      [timestamp(new Date(2018, 12, 31, 21, 57, 50)), '2 hours ago', undefined],
      [
        new Date(2018, 12, 29, 21, 57, 50),
        'Vor 2 Tage',
        { day: 'Tag', days: 'Tage', prefix: 'Vor', suffix: '' },
      ],
      [new Date(2018, 12, 13, 21, 57, 50), '18 days before', { skipWeeks: true, suffix: 'before' }],
      [
        new Date(2018, 12, 13, 21, 57, 50),
        '2 semanas',
        { week: 'semana', weeks: 'semanas', suffix: '' },
      ],
      [
        new Date(2018, 10, 13, 21, 57, 50),
        'duela 2 hilabeteak',
        { month: 'hilabetea', months: 'hilabeteak', prefix: 'duela', suffix: '' },
      ],
      [new Date(2017, 10, 13, 21, 57, 50), '1 rok', { year: 'rok', years: 'roky', suffix: '' }],
    ])('%p should return %p', (input, expected, options) => {
      expect(timeSince(input, options)).toBe(expected);
    });
  });

  describe('timestamp', () => {
    it.each([
      [undefined, 1548986400],
      ['2000-12-23', 977529600],
      [new Date('1983-12-23 02:55'), 441006900],
    ])('%p should return %p', (input, expected) => {
      expect(timestamp(input)).toBe(expected);
    });
  });
});
