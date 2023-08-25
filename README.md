# @gilbarbara/helpers

[![npm version](https://badge.fury.io/js/%40gilbarbara%2Fhelpers.svg)](https://badge.fury.io/js/%40gilbarbara%2Fhelpers) [![CI](https://github.com/gilbarbara/helpers/actions/workflows/main.yml/badge.svg)](https://github.com/gilbarbara/helpers/actions/workflows/main.yml) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=gilbarbara_helpers&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=gilbarbara_helpers)

Collection of useful functions

## Usage

```shell
npm i @gilbarbara/helpers
```

```typescript
import { unique } from '@gilbarbara/helpers';

const password = unique(24, { includeSymbols: true });
console.log(password); // g9HBfQeeOgrP.V1?JhETxn9P
```

## API

### Arrays

**createArray(size: number, start: number = 1): number[]**  
Create a sequential array of numbers.

**getRandomItem\<T>(input: T[]): T**  
Get a random item from an array.

**quickSort\<T extends string | number>(input: T[]): T[]**  
Sort an array of numbers using a quick sort algorithm.

**shuffle\<T = unknown>(input: T[]): T[]**  
Shuffle an array using the Fisher-Yates algorithm.

**sortByLocaleCompare(key?: string, options?: Intl.CollatorOptions & { descending?: boolean }): SortFunction**  
Returns a sort function with localeCompare comparison.

<details>
  <summary>Type Definition</summary>

  ```typescript
interface SortFunction<T = string> {
  (left: PlainObject, right: PlainObject): number;
  (left: T, right: T): number;
}
  ```
</details>

<details>
  <summary>Example</summary>

  ```typescript
// with an array of strings
const strings = ['Mãe', 'limão', 'cachê', 'tião', 'amô', 'côncavo'];
strings.sort(sortByLocaleCompare());
// [ 'amô', 'cachê', 'côncavo', 'limão', 'Mãe', 'tião' ]

// with an array of objects
const objects = [{ key: 'réservé' }, { key: 'Premier' }, { key: 'Cliché' }, { key: 'communiqué' }, { key: 'café' }, { key: 'Adieu' }];
objects.sort(sortByLocaleCompare('key', { descending: true }));
/*
[
  { key: 'réservé' },
  { key: 'Premier' },
  { key: 'communiqué' },
  { key: 'Cliché' },
  { key: 'café' },
  { key: 'Adieu' }
]
*/
  ```
</details>

**sortByPrimitive\<T extends number | boolean>(key?: string, descending?: boolean = false): SortFunction**   
Returns a sort function with primitive values comparison.

<details>
  <summary>Type Definition</summary>

  ```typescript
interface SortFunction<T = string> {
  (left: PlainObject, right: PlainObject): number;
  (left: T, right: T): number;
}
  ```
</details>

<details>
  <summary>Example</summary>

  ```typescript
const objects = [{ cycle: 3, status: true }, { cycle: 1, status: false }, { cycle: 3, status: true }, { cycle: 4, status: false }];
objects.sort(sortByPrimitive('status', true));
/*
[
  { cycle: 3, status: true },
  { cycle: 3, status: true },
  { cycle: 1, status: false },
  { cycle: 4, status: false }
]
*/
  ```
</details>

**sortComparator(left: string | number, right: string | number): number**  
Basic sort comparator.

**splitIntoChunks\<T>(array: T[], chunkSize: number = 25): T\[][]**  
Split an array into chunks.

### Async

**ASYNC_STATUS**  
A constant with possible async statuses.

**cors(data: any, statusCodeOrOptions: number | CorsOptions = 200): CorsResponse**  
Returns a CORS response.

<details>
  <summary>Type Definition</summary>

  ```typescript
type HttpMethods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface CorsOptions {
  /** @default true */
  allowCredentials?: boolean;
  /** @default [] */
  allowedHeaders?: string[];
  /** @default ['GET'] */
  methods?: HttpMethods[];
  /** @default * */
  origin?: string;
  responseHeaders?: Record<string, string>;
  /** @default 200 */
  statusCode?: number;
}

interface CorsResponse {
  body: string;
  headers: Record<string, string>;
  statusCode: number;
}
  ```
</details>

**poll(condition: () => boolean, options?: PollOptions): Promise\<void>**  
Awaits for the condition to be true based on the options.

<details>
  <summary>Type Definition</summary>

  ```typescript
interface PollOptions {
  delay?: number; // 1 (seconds)
  maxRetries?: number; // 5 (seconds)
}
  ```
</details>

**request<D = any>(url: string, options?: RequestOptions): Promise\<D>**  
Perform an async request.

<details>
  <summary>Type Definition</summary>

  ```typescript
type HttpMethods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestOptions {
  body?: any;
  headers?: PlainObject;
  method?: HttpMethods;
}
  ```
</details>

> You will need a polyfill if your Node version does not support fetch.

**sleep(seconds?: number = 1): Promise\<void>**  
Block async execution for X seconds.

### Date

**isIsoDate(input?: string): boolean**  
Check if the input is an ISO date.

**isoDate(input?: string | number): string**  
Returns an ISO date.

**isValidDate(input: string | number | Date): boolean**  
Check if the input is a valid date.

**now(): number**  
Returns a unix timestamp (seconds since 1970-01-01 00:00 UTC).

**timeSince(input: Date | string | number, options?: TimeSinceOptions): string**  
Returns how much time has passed since the input date.  
You can change the locale with the options.  
> If the plural form just adds an `s` to the end, you don't need to pass it. It will add it automatically.

<details>
  <summary>Type Definition</summary>

  ```typescript
interface TimeSinceOptions {
  day?: string; // day
  days?: string;
  hour?: string; // hour
  hours?: string;
  minute?: string; // minute
  minutes?: string;
  month?: string; // month
  months?: string;
  prefix?: string;
  second?: string; // second
  seconds?: string;
  skipWeeks?: boolean; // true
  suffix?: string; // ago
  week?: string; // week
  weeks?: string;
  year?: string; // year
  years?: string;
}
  ```
</details>

<details>
  <summary>Example</summary>

  ```typescript
timeSince(twoDaysAgo) // 2 days ago
timeSince(twoWeeksAgo, { skipWeeks: true }) // 14 days ago
timeSince(twoDaysAgo, { day: 'Tag', days: 'Tage', prefix: 'Vor', suffix:'' }) // Vor 2 Tage
timeSince(twoWeeeksAgo, { suffix: 'atrás', week: 'semana' }) // 2 semanas atrás
  ```
</details>

**timestamp(input?: Date | string): number**  
Get the timestamp for a date.

### Devices

**isDarkMode(): boolean**  
Detect if the device is in dark mode.

**isTouchDevice(): boolean**  
Detect if the device supports touch events.

**prefersReducedMotion(): boolean**  
Detect if the user prefers reduced motion.


### Formatters

**formatBoolean(input: boolean): 'Yes' | 'No'**  
Format the boolean into Yes / No.

**formatCPF(input: string): string**  
Format the string into a CPF.

**formatDateLocale(input: string, options?: FormatDateLocaleOptions): string**  
Format the ISO date string using locale.

<details>
  <summary>Type Definition</summary>

  ```typescript
interface FormatDateLocaleOptions {
  locale?: string; // > 'en-GB'
  showTime?: boolean; // > false
}
  ```
</details>

**formatMoney(input: number, options?: FormatMoneyOptions): string**  
Format the number into a money string.

<details>
  <summary>Type Definition</summary>

  ```typescript
interface FormatMoneyOptions {
  decimalChar?: ',' | '.'; // > '.'
  showCents?: boolean; // > false
  symbol?: string; // > '$'
  thousandsChar?: ',' | '.'; // > ','
}
  ```
</details>

**formatPhoneBR(input: string): string**  
Format the string into a brazilian phone.

**formatPhoneUS(input: string): string**  
Format the string into a US phone.

**formatPostalCodeBR(value: string): string**  
Format the string into a brazilian zip code.

### Functions

**demethodize(fn: Function): Function**  
Decouple the method from the prototype.

**measureExecutionTime\<T = any>(callback: Function): Promise\<T>**  
Measure function execution time.

**noop(): void**   
An empty function that does nothing.

**once\<T extends (...arguments_: Array\<any>) => any>(fn: T): T**  
Creates a function that will only be called once.  
Repeat calls return the value of the first invocation.

**pipe\<T>(...functions: Array<(argument: T) => T>)**  
Combine multiple functions into one.  
The output of each function is passed as the input to the next.

### Misc

 **conditional\<TReturn>(cases: Array\<Case\<TReturn>>, defaultCase?: () => TReturn): TReturn | undefined**  
A replacement for switch statements with dynamic expressions cases.

<details>
  <summary>Type Definition</summary>

  ```typescript
type Case<T = void> = [boolean, () => T];
  ```
</details>

<details>
  <summary>Example</summary>

  ```typescript
let type: string = '';

conditional(
  [
    [type === 'a', () => console.log('a')],
    [[type].includes('b'), () => console.log('b')],
    [type === 'c', () => console.log('c')],
  ],
  () => console.log('default'),
);
  ```
</details>

**copyToClipboard(input: string): Promise\<boolean>**  
Copy the string to the clipboard.

<details>
  <summary>Example</summary>

  ```typescript
const toLocaleString = demethodize(Number.prototype.toLocaleString);
const numbers = [2209.6, 124.56, 1048576];

numbers.map(toLocaleString); // ['2,209.6', '124.56', '1,048,576']
  ```
</details>

**getDataType(input: unknown, toLowerCase = false): string**  
Get the data type of variable.

<details>
  <summary>Example</summary>

  ```typescript
getDataType([1, 2, 3]); // Array
getDataType(/\d+/); // RegExp
getDataType(() => {}, true) // function
  ```
</details>

**invariant(condition: any, message: string): asserts condition**  
Check if the value is truthy. Otherwise, it will throw.

**isJSON(input: string): boolean**  
Check if a string is a valid JSON.

**isRequired(input?: string = 'parameter', type: Constructable = TypeError): void**  
Throws an error of the Constructable type.

<details>
  <summary>Example</summary>

  ```typescript
function exec(input: string = isRequired('input')) {}
exec() // Throws an TypeError with '"input" is required'

function evaluate(input: string = isRequired('input', SyntaxError)) {}
exec() // Throws an SyntaxError with '"input" is required'
  ```
</details>

**logger(type: string, title: string, data: any, options?: LoggerOptions): void**  
Log grouped messages to the console.

<details>
  <summary>Type Definition</summary>

  ```typescript
interface LoggerOptions {
  collapsed?: boolean; // true
  hideTimestamp?: boolean; // false
  skip?: boolean; // false
  typeColor?: string; // 'gray'
}
  ```
</details>

**nullify\<T>(value: T): T | null**  
Returns the value or null.

**popupCenter(url: string, title: string, width: number, height: number): Window | null**  
Open a centered popup window and returns it.

**px(value: string | number | undefined): string | undefined**  
Convert a number or numeric value to px.  
Otherwise, return the value.

**unique(length?: number = 8,  options?: UniqueOptions): string**  
Returns a random string.

<details>
  <summary>Type Definition</summary>

  ```typescript
interface UniqueOptions {
  includeLowercase?: boolean; // true
  includeNumbers?: boolean; // true
  includeSymbols?: boolean; // false
  includeUppercase?: boolean; // true
}
  ```

</details>

**uuid(): string**  
Returns a UUID v4 string.

### Numbers

**ceil(input: number, digits?: number = 2): number**  
Ceil decimal numbers.

**clamp(value: number, min?: number = 0, max?: number = 100): number**  
Limit the number between ranges.

**floor(input: number, digits?: number = 2): number**  
Floor decimal numbers.

**pad(input: number, digits?: number = 2): string**  
Pad a number with zeros.

**randomInt(min?: number = 0, max?: number = 10): number**  
Returns a random integer.

**round(input: number, digits?: number = 2): number**  
Round decimal numbers.

### Objects

**cleanUpObject(input: PlainObject): PlainObject**  
Remove properties with undefined values from an object.

**getNestedProperty(input: PlainObject | any[], path: string): any**  
Get a nested property inside an object or array.

<details>
  <summary>Example</summary>

  ```typescript
getNestedProperty({ children: { letters: ['a', 'b', 'c'] } }, 'children.letters');
// returns ['a', 'b', 'c']
getNestedProperty({ children: { letters: ['a', 'b', 'c'] } }, 'children.letters.1');
// returns 'b'
getNestedProperty([{ a: 5 }, { a: 7 }, { a: 10 }], '0.a');
// returns 5
  ```

You may also use a wildcard (+) to get multiple array values: 

  ```typescript
getNestedProperty([{ a: 5 }, { a: 7 }, { a: 10 }], '+.a');
// returns [5, 7, 10]
getNestedProperty({ children: [{ a: 5 }, { a: 7 }, { a: 10 }] }, 'children.+.a');
// returns [5, 7, 10]
  ```
</details>

**invertKeys(input: PlainObject): PlainObject**  
Invert object key and value.

**keyMirror(input: PlainObject): PlainObject**  
Set the key as the value.

**mergeProps<TDefaultProps, TProps>(defaultProps: TDefaultProps, props: TProps): TProps**  
Merges the defaultProps with literal values with the incoming props, removing undefined values from it that would override the defaultProps.  
The result is a type-safe object with the defaultProps as required properties.

**objectEntries\<T extends PlainObject\<any>>(input: T): Array<{ [K in keyof T]-?: [K, T[K]] }[keyof T]>**  
Type-safe Object.entries().

**objectKeys\<T extends PlainObject\<any>(input: T): Array\<keyof T>**  
Type-safe Object.keys().

**objectToArray(input: PlainObject, includeOnly?: string): Array\<PlainObject>**  
Convert an object to an array of objects.

**omit\<T extends PlainObject, K extends keyof T>(input: T, ...filter: K[]): PlainObject**  
Remove properties from an object.

**pick\<T extends PlainObject, K extends keyof T>(input: T, ...filter: K[]): PlainObject**  
Select properties from an object.

**queryStringFormat(input: PlainObject, options?: QueryStringFormatOptions): string**  
Stringify a shallow object into a query string.

<details>
  <summary>Type Definition</summary>

  ```typescript
interface QueryStringFormatOptions {
  addPrefix?: boolean;
  encodeValuesOnly?: boolean;
  encoder?: (uri: string) => string;
}
  ```
</details>

**queryStringParse(input: string): PlainObject**  
Parse a query string.

**sortObjectKeys(input: PlainObject): PlainObject**   
Sort object keys.

### Statistics

**mean(input: number[], precision?: number): number**  
Returns the average of two or more numbers.

**median(input: number[]): number**  
Returns the median of two or more numbers.

**mode(input: number[]): number**  
Returns the mode of two or more numbers.

### Strings

**capitalize(input: string): string**  
Capitalize the first letter.

**cleanupHTML(input: string): string**  
Clean up HTML content.

**cleanupNumericString(input: string): string**  
Clean up a numeric string.

**cleanupURI(input: string): string**  
Clean up URI characters.

**getInitials(input: string): string**  
Get initials from the name.

**pluralize(singular: string, plural: string | undefined, quantity: number): string**  
Returns the singular or plural based on the quantity.  

> If the plural form just adds an `s` to the end, you don't need to pass it. It will add it automatically. 

**removeAccents(input: string): string**  
Remove accents.

**removeEmojis(input: string): string**  
Remove emojis.

**removeEmptyTags(input: string): string**  
Remove empty HTML Tags (including whitespace).

**removeNonPrintableCharacters(input: string): string**  
Remove non-printable ASCII characters.

**removeTags(input: string): string**  
Remove HTML tags.

**removeWhitespace(input: string): string**  
Remove whitespace.

**slugify(input: string): string**  
Format the string into a slug.


### Validators

**isValidCPF(value: string): boolean**  
Check if the CPF is valid.

**isValidEmail(value: string): boolean**  
Check if the email is valid.

`@throws`  
**validatePassword(password: string, options?: ValidatePasswordOptions): boolean**  
Validate password length and required characters.

  ```typescript
interface ValidatePasswordOptions {
  maxLength?: string;
  maxLengthMessage?: string;
  minLength?: string;
  minLengthMessage?: string;
  regex?: RegExp;
  requiredCharactersMessage?: string;
}
  ```

## License

MIT
