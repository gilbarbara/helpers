import is from 'is-lite';

import { InvertKeyValue, PlainObject, QueryStringFormatOptions } from './types';

/**
 * Remove properties from an object
 */
export function blacklist<T extends PlainObject, K extends keyof T>(input: T, ...filter: K[]) {
  if (!is.plainObject(input)) {
    throw new TypeError('Expected an object');
  }

  const output: any = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const key in input) {
    /* istanbul ignore else */
    if ({}.hasOwnProperty.call(input, key)) {
      if (!filter.includes((key as unknown) as K)) {
        output[key] = input[key];
      }
    }
  }

  return output as Omit<T, K>;
}

/**
 * Invert object key and value
 */
export function invertKeys<T extends PlainObject>(input: T): InvertKeyValue<T> {
  if (!is.plainObject(input)) {
    throw new TypeError('Expected an object');
  }

  const result: any = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(input)) {
    result[value] = key;
  }

  return result;
}

/**
 * Set the key as the value
 */
export function keyMirror<T extends PlainObject>(input: T): { [K in keyof T]: K } {
  if (!is.plainObject(input)) {
    throw new TypeError('Expected an object');
  }

  const output: any = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const key in input) {
    /* istanbul ignore else */
    if (!Object.prototype.hasOwnProperty.call(output, key)) {
      output[key] = key;
    }
  }

  return output;
}

/**
 * Stringify a shallow object into a query string
 */
export function queryStringFormat(input: PlainObject, options: QueryStringFormatOptions = {}) {
  const { addPrefix = false, encodeValuesOnly = true, encoder = encodeURIComponent } = options;

  if (!is.plainObject(input)) {
    throw new TypeError("input type isn't supported");
  }

  const isValidInput = Object.values(input).every(item => {
    if (is.array(item)) {
      return item.every(d => is.string(d) || is.number(d));
    }

    return is.string(item);
  });

  if (!isValidInput) {
    throw new TypeError("input format isn't supported");
  }

  const output = Object.entries(input)
    .map(([key, value]) => {
      const nextKey = encodeValuesOnly ? key : encoder(key);
      const nextValue = is.array(value) ? value.map(encoder).join(',') : encoder(`${value}`);

      return `${nextKey}=${nextValue}`;
    })
    .join('&');

  return `${addPrefix ? '?' : ''}${output}`;
}

/**
 * Parse a query string
 */
export function queryStringParse(input: string): PlainObject<string> {
  let search = input;

  if (input.slice(0, 1) === '?') {
    search = input.slice(1);
  }

  return search.split('&').reduce<PlainObject<string>>((acc, d) => {
    const [key, value] = d.split('=');

    acc[decodeURIComponent(key)] = decodeURIComponent(value);

    return acc;
  }, {});
}

/**
 * Sort object keys
 */
export function sortObjectKeys(input: PlainObject) {
  return Object.keys(input)
    .sort()
    .reduce((acc, key) => {
      acc[key] = input[key];

      return acc;
    }, {} as PlainObject);
}
