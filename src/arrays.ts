import { PlainObject, SortFunction } from './types';

/**
 * Sort an array with localeCompare
 */
export function sortByLocaleCompare(
  key?: string,
  options: Intl.CollatorOptions & { descending?: boolean } = {},
): SortFunction {
  const { descending, ...compareOptions } = options;

  if (key) {
    if (descending) {
      return <T extends PlainObject>(left: T, right: T) =>
        right[key].toLowerCase().localeCompare(left[key].toLowerCase(), undefined, compareOptions);
    }

    return <T extends PlainObject>(left: T, right: T) =>
      left[key].toLowerCase().localeCompare(right[key].toLowerCase(), undefined, compareOptions);
  }

  if (descending) {
    return <T extends string>(left: T, right: T) =>
      right.toLowerCase().localeCompare(left.toLowerCase(), undefined, compareOptions);
  }

  return <T extends string>(left: T, right: T) =>
    left.toLowerCase().localeCompare(right.toLowerCase(), undefined, compareOptions);
}

/**
 * Sort an array by primitive values
 */
export function sortByPrimitive<T extends number | boolean>(
  key?: string,
  descending = false,
): SortFunction<T> {
  const firstComparator = descending ? 1 : -1;
  const secondComparator = descending ? -1 : 1;

  if (key) {
    return <P extends PlainObject>(left: P, right: P) => {
      if (left[key] === right[key]) {
        return 0;
      }

      return left[key] < right[key] ? firstComparator : secondComparator;
    };
  }

  return <P extends T>(left: P, right: P) => {
    if (left === right) {
      return 0;
    }

    return left < right ? firstComparator : secondComparator;
  };
}
