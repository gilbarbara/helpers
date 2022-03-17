# @gilbarbara/helpers

[![npm version](https://badge.fury.io/js/%40gilbarbara%2Fhelpers.svg)](https://badge.fury.io/js/%40gilbarbara%2Fhelpers) [![CI](https://github.com/gilbarbara/helpers/actions/workflows/main.yml/badge.svg)](https://github.com/gilbarbara/helpers/actions/workflows/main.yml) [![Maintainability](https://api.codeclimate.com/v1/badges/e6bfd2ed034503f16473/maintainability)](https://codeclimate.com/github/gilbarbara/helpers/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/e6bfd2ed034503f16473/test_coverage)](https://codeclimate.com/github/gilbarbara/helpers/test_coverage)

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

**getRandomItem(input: any[]): any**  
Get a random item from an array.

**quickSort<T extends string | number>(input: T[]): T[]**  
Sort an array of numbers using a quick sort algorithm.

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

**sortByPrimitive<T extends number | boolean>(key?: string, descending?: boolean = false): SortFunction**   
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

**splitIntoChunks<T>(array: T[], chunkSize: number = 25): T[][]**  
Split an array into chunks.

### Async

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
  responseHeaders?: AnyObject;
  /** @default 200 */
  statusCode?: number;
}

interface CorsResponse {
  body: string;
  headers: PlainObject;
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

**sleep(seconds?: number = 1): Promise\<void>**  
Block async execution for X seconds.

### Date

**isIsoDate(input?: string): boolean**  
Check if the input is an ISO date.

**isoDate(input?: string | number): string**  
Returns an ISO date.

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
Get the timestamp for a date

### Misc

**copyToClipboard(input: string): Promise\<boolean>**  
Copy a string to the clipboard.

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

**noop(): void**   
An empty function that does nothing.

**nullify\<T>(value: T): T | null**  
Returns the value or null.

**popupCenter(url: string, title: string, width: number, height: number): Window | null**  
Open a centered popup window and returns it.

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
Returns an UUID v4 string.

### Numbers

**ceil(input: number, digits?: number = 2): number**  
Ceil decimal numbers.

**floor(input: number, digits?: number = 2): number**  
Floor decimal numbers.

**pad(input: number, digits?: number = 2): string**  
Pad a number with zeros.

**randomInt(min?: number = 0, max?: number = 10): number**  
Returns a random integer.

**rangeLimit(value: number, min?: number = 0, max?: number = 100): number**  
Limit number between range.

**round(input: number, digits?: number = 2): number**  
Round decimal numbers.

### Objects

**cleanUpObject(input: PlainObject): PlainObject**  
Remove properties with undefined or empty string value from an object

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

**objectToArray(input: PlainObject, includeOnly?: string): PlainObject[]**  
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
Sort object keys

### Strings

**capitalize(input: string): string**  
Capitalize the first letter.

**cleanupHTML(input: string): string**  
Cleanup HTML content.

**cleanupURI(input: string): string**  
Cleanup URI characters.

**getInitials(input: string): string**  
Get initials from name

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
Format string to slug.

## License

MIT
