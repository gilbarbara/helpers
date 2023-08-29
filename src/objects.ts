import { NarrowPlainObject, PlainObject, RemoveType, Simplify } from '@gilbarbara/types';
import is from 'is-lite';

import { InvertKeyValue, QueryStringFormatOptions } from './types';

/**
 * Remove properties with undefined value from an object
 */
export function cleanUpObject<T extends PlainObject>(input: T) {
  const output: Record<string, unknown> = {};

  for (const key in input) {
    if (input[key] !== undefined) {
      output[key] = input[key];
    }
  }

  return output as RemoveType<T>;
}

/**
 * Get a nested property inside an object or array
 */
export function getNestedProperty<T extends PlainObject<any>>(input: T, path: string): any {
  if ((!is.plainObject(input) && !is.array(input)) || !path) {
    return input;
  }

  const segments = path.split('.');
  const { length } = segments;
  let output = input;

  for (let index = 0; index < length; index++) {
    const currentSegment = segments[index];
    const remainingSegments = segments.slice(index + 1);

    if (currentSegment === '+' && is.array(output) && remainingSegments.length === 1) {
      return output.map(d => d[remainingSegments.join('.')]);
    }

    try {
      output = output[currentSegment];
    } catch {
      // skip
    }
  }

  return output;
}

/**
 * Invert object key and value
 */
export function invertKeys<const T extends PlainObject<PropertyKey>>(input: T) {
  if (!is.plainObject(input)) {
    throw new TypeError('Expected an object');
  }

  const result: Record<PropertyKey, PropertyKey> = {};

  for (const [key, value] of Object.entries(input)) {
    result[value] = key;
  }

  return result as InvertKeyValue<T>;
}

/**
 * Set the key as the value
 */
export function keyMirror<T extends PlainObject>(input: T): { [K in keyof T]: K } {
  if (!is.plainObject(input)) {
    throw new TypeError('Expected an object');
  }

  const output: any = {};

  for (const key in input) {
    /* istanbul ignore else */
    if (!Object.prototype.hasOwnProperty.call(output, key)) {
      output[key] = key;
    }
  }

  return output;
}

/**
 * Merges the defaultProps with literal values with the incoming props, removing undefined values from it that would override the defaultProps.
 * The result is a type-safe object with the defaultProps as required properties.
 */
export function mergeProps<TDefaultProps extends PlainObject<any>, TProps extends PlainObject<any>>(
  defaultProps: TDefaultProps,
  props: TProps,
) {
  const cleanProps = cleanUpObject(props);

  return { ...defaultProps, ...cleanProps } as unknown as Simplify<
    TProps & Required<Pick<TProps, keyof TDefaultProps & string>>
  >;
}

/**
 * Type-safe Object.entries()
 */
export function objectEntries<T extends PlainObject<any>>(input: T) {
  return Object.entries(input) as Array<{ [K in keyof T]-?: [K, T[K]] }[keyof T]>;
}

/**
 * Type-safe Object.keys()
 */
export function objectKeys<T extends PlainObject<any>>(input: T) {
  return Object.keys(input) as Array<keyof T>;
}

/**
 * Convert an object to an array of objects
 */
export function objectToArray<T extends PlainObject>(input: T, includeOnly?: string) {
  if (!is.plainObject(input)) {
    throw new TypeError('Expected an object');
  }

  return Object.entries(input)
    .filter(([, value]) => (includeOnly ? typeof value === `${includeOnly}` : true)) // eslint-disable-line valid-typeof
    .map(([key, value]) => ({ [key]: value }));
}

/**
 * Remove properties from an object
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  input: NarrowPlainObject<T>,
  ...filter: K[]
) {
  if (!is.plainObject(input)) {
    throw new TypeError('Expected an object');
  }

  const output: any = {};

  for (const key in input) {
    /* istanbul ignore else */
    if ({}.hasOwnProperty.call(input, key)) {
      if (!filter.includes(key as unknown as K)) {
        output[key] = input[key];
      }
    }
  }

  return output as Omit<T, K>;
}

/**
 * Select properties from an object
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  input: NarrowPlainObject<T>,
  ...filter: K[]
) {
  if (!is.plainObject(input)) {
    throw new TypeError('Expected an object');
  }

  if (!filter.length) {
    return input;
  }

  const output: any = {};

  for (const key in input) {
    /* istanbul ignore else */
    if ({}.hasOwnProperty.call(input, key)) {
      if (filter.includes(key as unknown as K)) {
        output[key] = input[key];
      }
    }
  }

  return output as Pick<T, K>;
}

/**
 * Stringify a shallow object into a query string
 */
export function queryStringFormat<T extends PlainObject>(
  input: T,
  options: QueryStringFormatOptions = {},
) {
  const { addPrefix = false, encoder = encodeURIComponent, encodeValuesOnly = true } = options;

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
export function sortObjectKeys<T extends PlainObject>(input: T) {
  return objectKeys(input)
    .sort()
    .reduce((acc, key) => {
      acc[key] = input[key];

      return acc;
    }, {} as T);
}
