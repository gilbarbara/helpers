/**
 * Decouple methods from objects
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function demethodize(fn: Function) {
  return (parameter: any, ...rest: any[]) => fn.apply(parameter, rest);
}

/**
 * Measure function execution time
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export async function measureExecutionTime<T = any>(callback: Function): Promise<T> {
  const start = performance.now();

  const result = await callback();

  const end = performance.now();
  const total = end - start;

  // eslint-disable-next-line no-console
  console.log(`Completed in ${Math.ceil(total)} milliseconds`);

  return result as T;
}

/**
 * A function that does nothing.
 */
export function noop() {
  return undefined;
}

/**
 * Creates a function that will only be called once.
 * Repeat calls return the value of the first invocation.
 */
export function once<T extends (...arguments_: Array<any>) => any>(fn: T): T {
  let done = false;
  let result: ReturnType<T>;

  return function Fn(...arguments_: Parameters<T>): ReturnType<T> {
    if (!done) {
      done = true;
      result = fn(...arguments_);
    }

    return result as ReturnType<T>;
  } as T;
}

/**
 * Combine multiple functions into one.
 * The output of each function is passed as the input to the next.
 */
export function pipe<T>(...fns: Array<(argument: T) => T>) {
  return (input: T) => fns.reduce((previousValue, fn) => fn(previousValue), input);
}
