import { AnyObject, NarrowPlainObject, SortFunction } from './types';

/**
 * Sort an array of numbers using a quick sort algorithm
 */
export function quickSort<T extends string | number>(input: T[], comparator = sortComparator): T[] {
  // Create a sortable array to return.
  const output = [...input];

  // Recursively sort sub-arrays.
  const recursiveSort = (start: number, end: number) => {
    // If this sub-array is empty, it's sorted.
    if (end - start < 1) {
      return;
    }

    const pivotValue = output[end];
    let splitIndex = start;

    for (let i = start; i < end; i++) {
      const sort = comparator(output[i], pivotValue);

      // This value is less than the pivot value.
      if (sort === -1) {
        // If the element just to the right of the split index,
        //   isn't this element, swap them.
        if (splitIndex !== i) {
          const temp = output[splitIndex];

          output[splitIndex] = output[i];
          output[i] = temp;
        }

        // Move the split index to the right by one,
        //   denoting an increase in the less-than sub-array size.
        splitIndex++;
      }

      // Leave values that are greater than or equal to
      //   the pivot value where they are.
    }

    // Move the pivot value to between the split.
    output[end] = output[splitIndex];
    output[splitIndex] = pivotValue;

    // Recursively sort the less-than and greater-than arrays.
    recursiveSort(start, splitIndex - 1);
    recursiveSort(splitIndex + 1, end);
  };

  // Sort the entire array.
  recursiveSort(0, input.length - 1);

  return output;
}

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
      return <T extends AnyObject>(
        left: T & NarrowPlainObject<T>,
        right: T & NarrowPlainObject<T>,
      ) =>
        right[key].toLowerCase().localeCompare(left[key].toLowerCase(), undefined, compareOptions);
    }

    return <T extends AnyObject>(left: T & NarrowPlainObject<T>, right: T & NarrowPlainObject<T>) =>
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
): SortFunction {
  const firstComparator = descending ? 1 : -1;
  const secondComparator = descending ? -1 : 1;

  if (key) {
    return <P extends AnyObject>(
      left: P & NarrowPlainObject<P>,
      right: P & NarrowPlainObject<P>,
    ) => {
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

/**
 * Basic sort comparator
 */
export function sortComparator(left: string | number, right: string | number) {
  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}
