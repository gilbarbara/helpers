import is from 'is-lite';

import { round } from './numbers';

/**
 * Returns the average of two or more numbers
 */
export function mean(input: number[], precision?: number) {
  const output = input.reduce((sum, value) => sum + value, 0) / input.length;

  if (is.number(precision)) {
    return round(output, precision);
  }

  return output;
}

/**
 * Returns the median of two or more numbers
 */
export function median(input: number[]) {
  const sorted = [...input].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);

  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2;
  }

  return sorted[middle];
}

/**
 * Returns the mode of two or more numbers
 */
export function mode(input: number[]) {
  const count = new Map<number, number>();

  for (const value of input) {
    const current = count.get(value) ?? 0;

    count.set(value, current + 1);
  }

  const sorted = [...count.entries()].sort((a, b) => b[1] - a[1]);

  return sorted[0][0];
}
