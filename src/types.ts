export type AnyObject<T = any> = Record<string, T>;
export type NarrowPlainObject<T> = Exclude<T, any[] | ((...args: any[]) => any)>;

export type HttpMethods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
export type Primitive = bigint | boolean | null | number | string | symbol | undefined;

export interface CorsOptions {
  headers?: string[];
  methods?: HttpMethods[];
  origin?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type InvertKeyValue<T extends Record<keyof T, keyof any>> = {} & {
  [K in T[keyof T]]: { [P in keyof T]: T[P] extends K ? P : never }[keyof T];
};

export interface LoggerOptions {
  collapsed?: boolean;
  hideTimestamp?: boolean;
  skip?: boolean;
  typeColor?: string;
}

export interface PollOptions {
  delay?: number;
  maxRetries?: number;
}

export interface QueryStringFormatOptions {
  addPrefix?: boolean;
  encodeValuesOnly?: boolean;
  encoder?: (uri: string) => string;
}

export interface RequestOptions {
  body?: any;
  headers?: AnyObject<string>;
  method?: HttpMethods;
}

export interface RequestError extends Error {
  response: any;
  status: number;
}

export interface SortFunction {
  <T = AnyObject>(left: T & NarrowPlainObject<T>, right: T & NarrowPlainObject<T>): number;
  <T = string>(left: T, right: T): number;
}

export interface TimeSinceOptions {
  day?: string;
  days?: string;
  hour?: string;
  hours?: string;
  minute?: string;
  minutes?: string;
  month?: string;
  months?: string;
  prefix?: string;
  second?: string;
  seconds?: string;
  skipWeeks?: boolean;
  suffix?: string;
  week?: string;
  weeks?: string;
  year?: string;
  years?: string;
}

export interface UniqueOptions {
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  includeUppercase?: boolean;
}
