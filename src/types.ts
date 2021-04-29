export type PlainObject<T = any> = Record<string, T>;

export type HttpMethods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export interface CorsOptions {
  headers?: string[];
  methods?: HttpMethods[];
  origin?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type InvertKeyValue<T extends Record<keyof T, keyof any>> = {} & {
  [K in T[keyof T]]: { [P in keyof T]: T[P] extends K ? P : never }[keyof T];
};

export interface PollOptions {
  delay?: number;
  maxRetries?: number;
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

export interface SortFunction<T = string> {
  (left: PlainObject, right: PlainObject): number;
  (left: T, right: T): number;
}
