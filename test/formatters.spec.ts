import {
  formatBoolean,
  formatCPF,
  formatDateLocale,
  formatMoney,
  formatPhoneBR,
  formatPhoneUS,
  formatPostalCodeBR,
} from '../src';

describe('formatBoolean', () => {
  it.each([
    { input: true, expected: 'Yes' },
    { input: false, expected: 'No' },
  ])('$input should return $expected', ({ expected, input }) => {
    expect(formatBoolean(input)).toBe(expected);
  });
});

describe('formatCPF', () => {
  it.each([
    { input: '', expected: '' },
    { input: '6', expected: '6' },
    { input: '61', expected: '61' },
    { input: '616', expected: '616' },
    { input: '6167', expected: '616.7' },
    { input: '61677', expected: '616.77' },
    { input: '616777', expected: '616.777' },
    { input: '6167778', expected: '616.777.8' },
    { input: '61677782', expected: '616.777.82' },
    { input: '616777820', expected: '616.777.820' },
    { input: '6167778205', expected: '616.777.820-5' },
    { input: '61677782056', expected: '616.777.820-56' },
    { input: '61677782056000', expected: '616.777.820-56' },
  ])('$input should return $expected', ({ expected, input }) => {
    expect(formatCPF(input)).toBe(expected);
  });
});

describe('formatDateLocale', () => {
  it.each([
    { input: '2021-01-10T22:16:23.572Z', expected: '10/01/21' },
    { input: '2021-01-10T22:16:23.572Z', expected: '10/01/21, 22:16', options: { showTime: true } },
    {
      input: '2020-03-01T10:03:00.000Z',
      expected: '03/01/20',
      options: { locale: 'en-US', showTime: false },
    },
    {
      input: '2020-03-01T10:03:00.000Z',
      expected: '03/01/20, 10:03 AM',
      options: { locale: 'en-US', showTime: true },
    },
    {
      input: '2017-12-25T01:59:59.000Z',
      expected: '25/12/17',
      options: { locale: 'pt-BR', showTime: false },
    },
    {
      input: '2017-12-25T01:59:59.000Z',
      expected: '25/12/17, 01:59',
      options: { locale: 'pt-BR', showTime: true },
    },
  ])('$input should return $expected', ({ expected, input, options }) => {
    expect(formatDateLocale(input, options)).toBe(expected);
  });
});

describe('formatMoney', () => {
  it.each([
    { input: 12000, expected: '$12,000' },
    { input: 12000.99, expected: '$12,000.99' },
    { input: -12000, expected: '-$12,000.00', options: { showCents: true } },
    { input: 1290000, expected: '$1,290,000' },
    {
      input: 4000,
      expected: 'R$ 4.000',
      options: { decimalChar: ',' as const, thousandsChar: '.' as const, symbol: 'R$ ' },
    },
  ])('$input should return $expected', ({ expected, input, options }) => {
    expect(formatMoney(input, options)).toBe(expected);
  });
});

describe('formatPhoneBR', () => {
  it.each([
    { input: '88776655', expected: '8877-6655' },
    { input: '988776655', expected: '98877-6655' },
    { input: '1188776655', expected: '(11) 8877-6655' },
    { input: '11988776655', expected: '(11) 98877-6655' },
    { input: '111988776655', expected: '111988776655' },
    { input: '5511988776655', expected: '5511988776655' },
    { input: '38221288776655', expected: '38221288776655' },
  ])('$input should return $expected', ({ expected, input }) => {
    expect(formatPhoneBR(input)).toBe(expected);
  });
});

describe('formatPhoneUS', () => {
  it.each([
    { input: '125551020', expected: '125551020' },
    { input: '2125551020', expected: '(212) 555-1020' },
    { input: '12125551020', expected: '+1 (212) 555-1020' },
    { input: '52125551020', expected: '52125551020' },
    { input: '121255510201', expected: '121255510201' },
  ])('$input should return $expected', ({ expected, input }) => {
    expect(formatPhoneUS(input)).toBe(expected);
  });
});

describe('formatPostalCodeBR', () => {
  it.each([
    { input: '', expected: '' },
    { input: '0', expected: '0' },
    { input: '05', expected: '05' },
    { input: '050', expected: '050' },
    { input: '0503', expected: '0503' },
    { input: '05036', expected: '05036' },
    { input: '050360', expected: '05036-0' },
    { input: '0503601', expected: '05036-01' },
    { input: '05036010', expected: '05036-010' },
    { input: '05036010000', expected: '05036-010' },
  ])('$input should return $expected', ({ expected, input }) => {
    expect(formatPostalCodeBR(input)).toBe(expected);
  });
});
