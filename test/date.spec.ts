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
    { title: 'MINUTE', expected: 60, constant: MINUTE },
    { title: 'HOUR', expected: 3600, constant: HOUR },
    { title: 'DAY', expected: 86400, constant: DAY },
    { title: 'WEEK', expected: 604800, constant: WEEK },
    { title: 'MONTH', expected: 2592000, constant: MONTH },
    { title: 'YEAR', expected: 31536000, constant: YEAR },
  ])('$title should return $expected', ({ constant, expected }) => {
    expect(constant).toBe(expected);
  });
});

describe('date', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2019, 1, 1, 0, 0, 0));
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  describe('isIsoDate', () => {
    test.each([
      { input: '2000-01-01T00:00:00.000Z', expected: true },
      { input: '2018-02-18T20:40:00.000Z', expected: true },
      { input: '2019-02-01T02:00:00.000Z', expected: true },
      { input: new Date().toISOString(), expected: true },
      { input: new Date().toUTCString(), expected: false },
      { input: new Date().toLocaleString(), expected: false },
      { input: new Date().toDateString(), expected: false },
    ])('$input should return $expected', ({ expected, input }) => {
      expect(isIsoDate(input)).toBe(expected);
    });
  });

  describe('isoDate', () => {
    it.each([
      { input: '2000-01-01', expected: '2000-01-01T00:00:00.000Z' },
      { input: 1518986400000, expected: '2018-02-18T20:40:00.000Z' },
      { input: undefined, expected: '2019-02-01T00:00:00.000Z' },
    ])('$input should return $expected', ({ expected, input }) => {
      expect(isoDate(input)).toBe(expected);
    });
  });

  describe('isValidDate', () => {
    it.each([
      { input: '2000-01-01', expected: true },
      { input: 1518986400000, expected: true },
      { input: new Date(), expected: true },
      { input: 'abcd', expected: false },
      { input: undefined, expected: false },
      { input: [], expected: false },
    ])('$input should return $expected', ({ expected, input }) => {
      // @ts-expect-error - Testing invalid input
      expect(isValidDate(input)).toBe(expected);
    });
  });

  describe('now', () => {
    it('should return properly', () => {
      expect(now()).toBe(1548979200);
    });
  });

  describe('timeSince', () => {
    it.each([
      { input: new Date(2018, 12, 31, 23, 59, 20), expected: '40 seconds ago' },
      { input: new Date(2018, 12, 31, 23, 57, 50).toISOString(), expected: '2 minutes ago' },
      { input: timestamp(new Date(2018, 12, 31, 21, 57, 50)), expected: '2 hours ago' },
      {
        input: new Date(2018, 12, 29, 21, 57, 50),
        expected: 'Vor 2 Tage',
        options: { day: 'Tag', days: 'Tage', prefix: 'Vor', suffix: '' },
      },
      {
        input: new Date(2018, 12, 13, 21, 57, 50),
        expected: '18 days before',
        options: { skipWeeks: true, suffix: 'before' },
      },
      {
        input: new Date(2018, 12, 13, 21, 57, 50),
        expected: '2 semanas',
        options: { week: 'semana', weeks: 'semanas', suffix: '' },
      },
      {
        input: new Date(2018, 10, 13, 21, 57, 50),
        expected: 'duela 2 hilabeteak',
        options: { month: 'hilabetea', months: 'hilabeteak', prefix: 'duela', suffix: '' },
      },
      {
        input: new Date(2017, 10, 13, 21, 57, 50),
        expected: '1 rok',
        options: { year: 'rok', years: 'roky', suffix: '' },
      },
    ])('$input should return $expected', ({ expected, input, options }) => {
      expect(timeSince(input, options)).toBe(expected);
    });
  });

  describe('timestamp', () => {
    it.each([
      { input: undefined, expected: 1548979200 },
      { input: '2000-12-23', expected: 977529600 },
      { input: new Date('1983-12-23 02:55'), expected: 440996100 },
    ])('$input should return $expected', ({ expected, input }) => {
      expect(timestamp(input)).toBe(expected);
    });
  });
});
