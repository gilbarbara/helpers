# @gilbarbara/helpers

[![npm version](https://badge.fury.io/js/%40gilbarbara%2Fhelpers.svg)](https://badge.fury.io/js/%40gilbarbara%2Fhelpers) [![build status](https://travis-ci.com/gilbarbara/helpers.svg)](https://travis-ci.com/gilbarbara/helpers) [![Maintainability](https://api.codeclimate.com/v1/badges/e6bfd2ed034503f16473/maintainability)](https://codeclimate.com/github/gilbarbara/helpers/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/e6bfd2ed034503f16473/test_coverage)](https://codeclimate.com/github/gilbarbara/helpers/test_coverage)

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

**sortByLocaleCompare(key?: string, options?: Intl.CollatorOptions & { descending?: boolean })**  
Returns a sort function with localeCompare comparison.

**sortByPrimitive<T extends number | boolean>(key?: string, descending?: boolean = false)**   
Returns a sort function with primitive values comparison.

### Async

**cors(data: any, statusCode = 200, options?: CorsOptions**)
Returns a CORSresponse.

```typescript
type HttpMethods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface CorsOptions {
  headers?: string[];
  methods?: HttpMethods[];
  origin?: string;
}
```

**poll(condition: () => boolean, options?: PollOptions)**  
Awaits for the condition to be true based on the options.

```typescript
interface PollOptions {
  delay?: number; // 1 (seconds)
  maxRetries?: number; // 5 (seconds)
}
```

**request(url: string, options?: RequestOptions)**  
Perform an async request.

```typescript
type HttpMethods = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

interface RequestOptions {
  body?: any;
  headers?: PlainObject<string>;
  method?: HttpMethods;
}
```

**sleep(seconds?: number = 1)**  
Block async execution for X seconds.

### Misc

**logger(type: string, title: string, data: any, options?: LoggerOptions)**  
Log grouped messages to the console.

```typescript
interface LoggerOptions {
  collapsed?: boolean; // true
  hideTimestamp?: boolean; // false
  skip?: boolean; // false
  typeColor?: string; // 'gray'
}
```

**noop()**   
An empty function that does nothing.

**required(param?: string = 'param')**  
Throw an error if the parameter isn't provided.

**unique(length?: number = 8,  options?: UniqueOptions)**  
Returns a random string.

```typescript
interface UniqueOptions {
  includeLowercase?: boolean; // true
  includeNumbers?: boolean; // true
  includeSymbols?: boolean; // false
  includeUppercase?: boolean; // true
}
```

**uuid()**  
Returns an UUID v4 string.

### Numbers

**ceil(input: number, digits?: number = 2)**  
Ceil decimal numbers.

**floor(input: number, digits?: number = 2)**  
Floor decimal numbers.

**pad(input: number, digits?: number = 2)**  
Pad a number with zeros.

**randomInt(min?: number = 0, max?: number = 10)**  
Returns a random integer.

**round(input: number, digits?: number = 2)**
Round decimal numbers.

### Objects

**blacklist(input: PlainObject, ...filter)**  
Remove properties from an object.

**invertKeys(input: PlainObject)**  
Invert object key and value

**keyMirror(input: PlainObject)**  
Set the key as the value

**queryStringFormat(input: PlainObject, options?: QueryStringFormatOptions)**  
Stringify a shallow object into a query string.

```typescript
interface QueryStringFormatOptions {
  addPrefix?: boolean;
  encodeValuesOnly?: boolean;
  encoder?: (uri: string) => string;
}
```
**queryStringParse(input: string)**  
Parse a query string.

**sortObjectKeys(input: PlainObject)**   
Sort object keys

### Strings

**capitalize(input: string)**  
Capitalize the first letter.

**cleanupHTML(input: string)**  
Cleanup HTML content.

**cleanupURI(input: string)**  
Cleanup URI characters.

**pluralize(singular: string, plural: string | undefined, quantity: number)**  
Returns the singular oor plural based on the quantity.  
*If the plural forms just adds an `s` to the end, you don't need to pass it. It will add it automatically.*

**removeAccents(input: string)**  
Remove accents.

**removeEmojis(input: string)**  
Remove emojis.

**removeEmptyTags(input: string)**  
Remove empty HTML Tags (including whitespace).

**removeNonPrintableCharacters(input: string)**  
Remove non-printable ASCII characters.

**removeTags(input: string)**  
Remove HTML tags.

**removeWhitespace(input: string)**  
Remove whitespace.

**slugify(input: string)**  
Format string to slug.