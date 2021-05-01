import { pluralize } from './strings';
import { TimeSinceOptions } from './types';

export const MINUTE = 60;
export const HOUR = MINUTE * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;
export const MONTH = DAY * 30;
export const YEAR = 365 * DAY;

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
  let interval = Math.floor(diff / YEAR);
  const output = (value: number, caption: string) =>
    `${prefix ? `${prefix} ` : ''}${value} ${caption}${suffix ? ` ${suffix}` : ''}`;

  if (interval >= 1) {
    return output(interval, pluralize(year, years, interval));
  }

  interval = Math.floor(diff / MONTH);

  if (interval > 1) {
    return output(interval, pluralize(month, months, interval));
  }

  if (!skipWeeks) {
    interval = Math.floor(diff / WEEK);

    if (interval > 1) {
      return output(interval, pluralize(week, weeks, interval));
    }
  }

  interval = Math.floor(diff / DAY);

  if (interval >= 1) {
    return output(interval, pluralize(day, days, interval));
  }

  interval = Math.floor(diff / HOUR);

  if (interval >= 1) {
    return output(interval, pluralize(hour, hours, interval));
  }

  interval = Math.floor(diff / MINUTE);

  if (interval > 1) {
    return output(interval, pluralize(minute, minutes, interval));
  }

  return output(Math.floor(diff), pluralize(second, seconds, diff));
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
