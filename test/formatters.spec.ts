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
    [true, 'Yes'],
    [false, 'No'],
  ])('%p should return %p', (input, expected) => {
    expect(formatBoolean(input)).toBe(expected);
  });
});

describe('formatCPF', () => {
  it.each([
    ['', ''],
    ['6', '6'],
    ['61', '61'],
    ['616', '616'],
    ['6167', '616.7'],
    ['61677', '616.77'],
    ['616777', '616.777'],
    ['6167778', '616.777.8'],
    ['61677782', '616.777.82'],
    ['616777820', '616.777.820'],
    ['6167778205', '616.777.820-5'],
    ['61677782056', '616.777.820-56'],
    ['61677782056000', '616.777.820-56'],
  ])('%p should return %p', (input, expected) => {
    expect(formatCPF(input)).toBe(expected);
  });
});

describe('formatDateLocale', () => {
  it.each([
    ['2021-01-10T22:16:23.572Z', '10/01/21', undefined],
    ['2021-01-10T22:16:23.572Z', '10/01/21, 19:16', { showTime: true }],
    ['2020-03-01T10:03:00.000Z', '03/01/20', { locale: 'en-US', showTime: false }],
    ['2020-03-01T10:03:00.000Z', '03/01/20, 07:03 AM', { locale: 'en-US', showTime: true }],
    ['2017-12-25T01:59:59.000Z', '24/12/17', { locale: 'pt-BR', showTime: false }],
    ['2017-12-25T01:59:59.000Z', '24/12/17, 23:59', { locale: 'pt-BR', showTime: true }],
  ])('%p should return %p', (value, expected, options) => {
    expect(formatDateLocale(value, options)).toBe(expected);
  });
});

describe('formatMoney', () => {
  it.each([
    [12000, '$12,000', undefined],
    [12000.99, '$12,000.99', undefined],
    [-12000, '-$12,000.00', { showCents: true }],
    [1290000, '$1,290,000', undefined],
    [4000, 'R$ 4.000', { decimalChar: ',' as const, thousandsChar: '.' as const, symbol: 'R$ ' }],
  ])('%p should return %p', (value, expected, options) => {
    expect(formatMoney(value, options)).toBe(expected);
  });
});

describe('formatPhoneBR', () => {
  it.each([
    ['88776655', '8877-6655'],
    ['988776655', '98877-6655'],
    ['1188776655', '(11) 8877-6655'],
    ['11988776655', '(11) 98877-6655'],
    ['111988776655', '111988776655'],
    ['5511988776655', '5511988776655'],
    ['38221288776655', '38221288776655'],
  ])('%p should return %p', (value, expected) => {
    expect(formatPhoneBR(value)).toBe(expected);
  });
});

describe('formatPhoneUS', () => {
  it.each([
    ['125551020', '125551020'],
    ['2125551020', '(212) 555-1020'],
    ['12125551020', '+1 (212) 555-1020'],
    ['52125551020', '52125551020'],
    ['121255510201', '121255510201'],
  ])('%p should return %p', (value, expected) => {
    expect(formatPhoneUS(value)).toBe(expected);
  });
});

describe('formatPostalCodeBR', () => {
  it.each([
    ['', ''],
    ['0', '0'],
    ['05', '05'],
    ['050', '050'],
    ['0503', '0503'],
    ['05036', '05036'],
    ['050360', '05036-0'],
    ['0503601', '05036-01'],
    ['05036010', '05036-010'],
    ['05036010000', '05036-010'],
  ])('%p should return %p', (input, expected) => {
    expect(formatPostalCodeBR(input)).toBe(expected);
  });
});
