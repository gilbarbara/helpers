import { StringOrNumber } from '@gilbarbara/types';
import is from 'is-lite';

import { pad } from './numbers';
import { LoggerOptions, UniqueOptions } from './types';

type Case<T = void> = [boolean, () => T];

export function conditional<TReturn = void>(
  cases: Array<Case<TReturn>>,
  defaultCase?: () => TReturn,
) {
  for (const [expression, callback] of cases) {
    if (expression) {
      return callback();
    }
  }

  return defaultCase?.();
}

/**
 * Copy a string to the clipboard
 */
export async function copyToClipboard(input: string) {
  try {
    await navigator.clipboard.writeText(input);
  } catch {
    return false;
  }

  return true;
}

/**
 * Get the data type of variable.
 */
export function getDataType(input: unknown, toLowerCase = false): string {
  const dataTypeName = Object.prototype.toString.call(input).slice(8, -1);
  let output = dataTypeName;

  if (/HTML\w+Element/.test(dataTypeName)) {
    output = 'HTMLElement';
  }

  return toLowerCase ? output.toLowerCase() : output;
}

export function invariant(condition: any, message: string | (() => string)): asserts condition {
  if (condition) {
    return;
  }

  const value = is.function(message) ? message() : message;

  throw new Error(value);
}

/**
 * Check if a string is a valid JSON
 */
export function isJSON(input: string) {
  try {
    JSON.parse(input);
  } catch {
    return false;
  }

  return true;
}

/**
 * Throw an error if the parameter isn't provided
 */
export function isRequired(input = 'parameter', Constructable = TypeError) {
  throw new Constructable(`"${input}" is required`);
}

/**
 * Log grouped messages to the console
 */
export function logger(type: string, title: string, data: any, options: LoggerOptions = {}) {
  /* eslint-disable no-console */
  const { collapsed = true, hideTimestamp = false, skip = false, typeColor = 'gray' } = options;
  const groupMethod = collapsed ? console.groupCollapsed : console.group;
  const date = new Date();
  const parts = [`%c ${type}`];
  const styles = [`color: ${typeColor}; font-weight: lighter;`, 'color: inherit;'];

  if (!hideTimestamp) {
    styles.push('color: gray; font-weight: lighter;');
  }

  const time = `${pad(date.getHours(), 2)}:${pad(date.getMinutes(), 2)}:${pad(
    date.getSeconds(),
    2,
  )}`;

  parts.push(`%c${title}`);

  if (!hideTimestamp) {
    parts.push(`%c@ ${time}`);
  }

  /* istanbul ignore else */
  if (!skip) {
    groupMethod(parts.join(' '), ...styles);
    console.log(data);
    console.groupEnd();
  }
  /* eslint-enable */
}

/**
 * Returns the value or null
 */
export function nullify<T>(value: T) {
  return value ?? null;
}

export function popupCenter(url: string, title: string, width: number, height: number) {
  const { screen, screenLeft, screenTop } = window;
  let screenWidth = window.innerWidth;
  let screenHeight = window.innerHeight;

  /* istanbul ignore next */
  if (!screenWidth) {
    screenWidth = document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : screen.width;
  }

  /* istanbul ignore next */
  if (!screenHeight) {
    screenHeight = document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : screen.height;
  }

  const left = screenWidth / 2 - width / 2 + screenLeft;
  const top = screenHeight / 2 - height / 2 + screenTop;

  const popup = window.open(
    url,
    title,
    `menubar=no,location=no,resizable=no,scrollbars=yees,status=no,width=${width},height=${height},top=${top}, left=${left}`,
  );

  /* istanbul ignore else */
  if (popup) {
    popup.focus();
  }

  return popup;
}

export function px(value: undefined): undefined;
export function px(value: StringOrNumber): string;
export function px(value: StringOrNumber | undefined): string | undefined;

/**
 * Convert a number or numeric value to px
 *
 * Otherwise, return the value.
 */
export function px(value: StringOrNumber | undefined): string | undefined {
  return is.number(value) || is.numericString(value) ? `${value}px` : value;
}

/**
 * Return a unique string
 */
export function unique(length = 8, options: UniqueOptions = {}): string {
  const {
    includeLowercase = true,
    includeNumbers = true,
    includeSymbols = false,
    includeUppercase = true,
  } = options;
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const symbols = '!?@#$%^&*+_-=:.~';

  let characters = '';

  if (includeLowercase) {
    characters += lowercase;
  }

  if (includeUppercase) {
    characters += uppercase;
  }

  if (includeNumbers) {
    characters += numbers;
  }

  if (includeSymbols) {
    characters += symbols;
  }

  let result = '';

  for (let index = length; index > 0; --index) {
    result += characters[Math.round(Math.random() * (characters.length - 1))];
  }

  return result;
}

/**
 * Returns an UUID v4 string.
 */
export function uuid() {
  /* eslint-disable no-bitwise */
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
  /* eslint-enable */
}
