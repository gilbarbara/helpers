import { HttpMethods, PlainObject } from '@gilbarbara/types';

export interface CorsOptions {
  /** @default true */
  allowCredentials?: boolean;
  /** @default [] */
  allowedHeaders?: string[];
  /** @default ['GET'] */
  methods?: HttpMethods[];
  /** @default * */
  origin?: string;
  responseHeaders?: PlainObject<string>;
  /** @default 200 */
  statusCode?: number;
}

export interface FormatDateLocaleOptions {
  locale?: string;
  showTime?: boolean;
}

export interface FormatMoneyOptions {
  decimalChar?: ',' | '.';
  showCents?: boolean;
  symbol?: string;
  thousandsChar?: ',' | '.';
}

export type InvertKeyValue<T extends Record<PropertyKey, PropertyKey>> = {
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
  headers?: PlainObject<string>;
  method?: HttpMethods;
}

export interface RequestError extends Error {
  response: any;
  status: number;
}

export interface SortFunction {
  <T extends PlainObject = PlainObject>(left: PlainObject<T>, right: PlainObject<T>): number;
  <T = string>(left: T, right: T): number;
}

export interface TimeSinceOptions {
  /**
   * @default "day"
   */
  day?: string;
  /**
   * @default "days"
   */
  days?: string;
  /**
   * @default "hour"
   */
  hour?: string;
  /**
   * @default "hours"
   */
  hours?: string;
  /**
   * @default "minute"
   */
  minute?: string;
  /**
   * @default "minutes"
   */
  minutes?: string;
  /**
   * @default "month"
   */
  month?: string;
  /**
   * @default "months"
   */
  months?: string;
  prefix?: string;
  /**
   * @default "second"
   */
  second?: string;
  /**
   * @default "seconds"
   */
  seconds?: string;
  /**
   * @default false
   */
  skipWeeks?: boolean;
  /**
   * @default "ago"
   */
  suffix?: string;
  /**
   * @default "week"
   */
  week?: string;
  /**
   * @default "weeks"
   */
  weeks?: string;
  /**
   * @default "year"
   */
  year?: string;
  /**
   * @default "years"
   */
  years?: string;
}

export interface UniqueOptions {
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  includeUppercase?: boolean;
}

export interface ValidatePasswordOptions {
  maxLength?: number;
  maxLengthMessage?: string;
  minLength?: number;
  minLengthMessage?: string;
  regex?: RegExp;
  requiredCharactersMessage?: string;
}
