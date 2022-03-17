import { pluralize } from './strings';
import { TimeSinceOptions } from './types';

export const MINUTE = 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = DAY * 30;
export const YEAR = 365 * DAY;

export function isIsoDate(input: string) {
  if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(input)) {
    return false;
  }

  const date = new Date(input);

  return date.toISOString() === input;
}

export function isoDate(input?: string | number) {
  if (typeof input !== 'undefined') {
    return new Date(input).toISOString();
  }

  return new Date().toISOString();
}

export function now() {
  return Math.floor(Date.now() / 1000);
}

/**
 * Returns how much time has passed since the input.
 */
export function timeSince(input: Date | string | number, options?: TimeSinceOptions) {
  const {
    day = 'day',
    days,
    hour = 'hour',
    hours,
    minute = 'minute',
    minutes,
    month = 'month',
    months,
    prefix,
    second = 'second',
    seconds,
    skipWeeks = false,
    suffix = 'ago',
    week = 'week',
    weeks,
    year = 'year',
    years,
  } = options || {};
  const date = typeof input === 'number' ? input : timestamp(input);
  const diff = now() - date;
  let quantity = Math.floor(diff / YEAR);

  const output = (value: number, caption: string) =>
    `${prefix ? `${prefix} ` : ''}${value} ${caption}${suffix ? ` ${suffix}` : ''}`;

  if (quantity >= 1) {
    return output(quantity, pluralize(quantity, year, years));
  }

  quantity = Math.floor(diff / MONTH);

  if (quantity > 1) {
    return output(quantity, pluralize(quantity, month, months));
  }

  if (!skipWeeks) {
    quantity = Math.floor(diff / WEEK);

    if (quantity > 1) {
      return output(quantity, pluralize(quantity, week, weeks));
    }
  }

  quantity = Math.floor(diff / DAY);

  if (quantity >= 1) {
    return output(quantity, pluralize(quantity, day, days));
  }

  quantity = Math.floor(diff / HOUR);

  if (quantity >= 1) {
    return output(quantity, pluralize(quantity, hour, hours));
  }

  quantity = Math.floor(diff / MINUTE);

  if (quantity > 1) {
    return output(quantity, pluralize(quantity, minute, minutes));
  }

  return output(Math.floor(diff), pluralize(diff, second, seconds));
}

/**
 * Get the timestamp for a date.
 */
export function timestamp(input?: Date | string) {
  if (!input) {
    return now();
  }

  const date = typeof input === 'string' ? new Date(input) : input;

  return Math.floor(date.getTime() / 1000);
}
