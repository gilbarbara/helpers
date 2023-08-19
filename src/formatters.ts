import { cleanupNumericString } from './strings';
import { FormatDateLocaleOptions, FormatMoneyOptions } from './types';

/**
 * Format boolean into a Yes/No string
 */
export function formatBoolean(input: boolean) {
  return input ? 'Yes' : 'No';
}

/**
 * Format string into a CPF
 */
export function formatCPF(value: string) {
  const clearValue = cleanupNumericString(value);

  if (clearValue.length >= 10) {
    return `${clearValue.slice(0, 3)}.${clearValue.slice(3, 6)}.${clearValue.slice(
      6,
      9,
    )}-${clearValue.slice(9, 11)}`;
  } else if (clearValue.length >= 7) {
    return `${clearValue.slice(0, 3)}.${clearValue.slice(3, 6)}.${clearValue.slice(6, 9)}`;
  } else if (clearValue.length >= 4) {
    return `${clearValue.slice(0, 3)}.${clearValue.slice(3, 6)}`;
  }

  return clearValue;
}

/**
 * Format date ISO string using locale
 */
export function formatDateLocale(input: string, options: FormatDateLocaleOptions = {}) {
  const { locale = 'en-GB', showTime = false } = options;

  const formatOptions: Intl.DateTimeFormatOptions = {
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
  };

  if (showTime) {
    formatOptions.hour = '2-digit';
    formatOptions.minute = '2-digit';
  }

  return new Date(input).toLocaleDateString(locale, formatOptions);
}

/**
 * Format number into money string
 */
export function formatMoney(input: number, options: FormatMoneyOptions = {}) {
  const { decimalChar = '.', showCents = false, symbol = '$', thousandsChar = ',' } = options;

  const isNegative = input < 0;
  const value = Math.abs(input);
  const [amount, cents] = value.toFixed(2).split('.');
  const padStart = amount.length > 3 ? amount.length % 3 : 0;
  const initial = amount.slice(0, padStart);
  const remain = amount.slice(padStart).replace(/(\d{3})(?=\d)/g, `$1${thousandsChar}`);

  let formatted = `${remain}`;

  if (initial) {
    formatted = `${initial}${thousandsChar}${remain}`;
  }

  if (cents !== '00' || showCents) {
    formatted += `${decimalChar}${cents}`;
  }

  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
}

/**
 * Format string into a brazilian phone
 */
export function formatPhoneBR(input: string) {
  const phone = input.replace(/\D/g, '');

  if (phone.length === 8) {
    return phone.replace(/^(\d{4})(\d{4}).*/, '$1-$2');
  }

  if (phone.length === 9) {
    return phone.replace(/^(\d{5})(\d{4}).*/, '$1-$2');
  }

  if (phone.length === 10 || phone.length === 11) {
    return phone.replace(/^(\d{2})(\d{4,5})(\d{4}).*/, '($1) $2-$3');
  }

  return phone;
}

/**
 * Format string into a US phone
 */
export function formatPhoneUS(input: string) {
  const phone = input.replace(/\D/g, '');

  if (phone.length === 10) {
    return phone.replace(/^(\d{3})(\d{3})(\d{4}).*/, '($1) $2-$3');
  }

  if (phone.length === 11 && phone.startsWith('1')) {
    return phone.replace(/^1(\d{3})(\d{3})(\d{4}).*/, '+1 ($1) $2-$3');
  }

  return phone;
}

/**
 * Format string into a zip code
 */
export function formatPostalCodeBR(value: string) {
  const clearValue = cleanupNumericString(value);

  if (clearValue.length >= 6) {
    return `${clearValue.slice(0, 5)}-${clearValue.slice(5, 8)}`;
  }

  return clearValue;
}
