/**
 * Ceil decimal numbers
 */
export function ceil(input: number, digits = 2) {
  const factor = 10 ** digits;

  return Math.ceil(input * factor) / factor;
}

/**
 * Limit number between range
 */
export function clamp(value: number, min = 0, max = 100) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Floor decimal numbers
 */
export function floor(input: number, digits = 2) {
  const factor = 10 ** digits;

  return Math.floor(input * factor) / factor;
}

/**
 * Pad a number with zeros
 */
export function pad(input: number, length = 2) {
  return `${input}`.padStart(length, '0');
}

/**
 * Returns a random number
 */
export function randomNumber(min = 0, max = 10) {
  if (min >= max) {
    return max;
  }

  return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Round decimal numbers
 */
export function round(input: number, digits = 2) {
  const factor = 10 ** digits;

  return Math.round(input * factor) / factor;
}
