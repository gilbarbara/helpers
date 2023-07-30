import { PlainObject } from '@gilbarbara/types';

import { SortFunction } from './types';

/**
 * Create a sequential array of numbers
 */
export function createArray(size: number, start = 1) {
  return Array.from({ length: size }, (_, index) => index + start);
}

/**
 * Get a random item from an array
 */
export function getRandomItem<T>(input: T[]) {
  return input[Math.floor(Math.random() * input.length)];
}

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

    for (let index = start; index < end; index++) {
      const sort = comparator(output[index], pivotValue);

      // This value is less than the pivot value.
      if (sort === -1) {
        // If the element just to the right of the split index,
        //   isn't this element, swap them.
        if (splitIndex !== index) {
          const temp = output[splitIndex];

          output[splitIndex] = output[index];
          output[index] = temp;
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
 * Remove duplicates from the array
 */
export function removeDuplicates<T = unknown>(input: T[]): T[] {
  return [...new Set(input)];
}

/**
 * Shuffle an array using the Fisher-Yates algorithm
 */
export function shuffle<T = unknown>(input: T[]) {
  let currentIndex = input.length;
  let randomIndex;
  let temporaryValue;
  const output = [...input];

  while (currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex--);
    temporaryValue = output[currentIndex];
    output[currentIndex] = output[randomIndex];
    output[randomIndex] = temporaryValue;
  }

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
      return <T extends PlainObject<any>>(left: PlainObject<T>, right: PlainObject<T>) =>
        right[key].toLowerCase().localeCompare(left[key].toLowerCase(), undefined, compareOptions);
    }

    return <T extends PlainObject<any>>(left: PlainObject<T>, right: PlainObject<T>) =>
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
    return <P extends PlainObject<any>>(left: PlainObject<P>, right: PlainObject<P>) => {
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

export function splitIntoChunks<T>(input: T[], chunkSize: number = 25): T[][] {
  if (!Array.isArray(input)) {
    throw new TypeError('expected an array for the first argument');
  }

  const chunks: T[][] = [];

  for (let index = 0; index < Math.ceil(input.length / chunkSize); index++) {
    chunks.push(input.slice(index * chunkSize, (index + 1) * chunkSize));
  }

  return chunks;
}
