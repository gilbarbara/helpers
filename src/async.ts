import 'isomorphic-fetch';

import is from 'is-lite';

import { CorsOptions, PollOptions, RequestError, RequestOptions } from './types';

/**
 * Format a CORS response
 */
export function cors(data: any, statusCodeOrOptions: number | CorsOptions = 200) {
  const {
    allowCredentials = true,
    allowedHeaders = [],
    methods = ['GET'],
    origin = '*',
    responseHeaders = undefined,
    statusCode = 200,
  } = is.number(statusCodeOrOptions) ? { statusCode: statusCodeOrOptions } : statusCodeOrOptions;

  const allowMethods = [...methods, 'OPTIONS'];
  const allowHeaders = [
    ...new Set([
      'Accept-Version',
      'Accept',
      'Authorization',
      'Content-Length',
      'Content-MD5',
      'Content-Type',
      'Date',
      'x-amz-date',
      'x-amz-security-token',
      'X-Api-Version',
      'X-CSRF-Token',
      'X-Requested-With',
      ...allowedHeaders,
    ]),
  ];
  let exposedHeaders;

  if (responseHeaders) {
    exposedHeaders = {
      'Access-Control-Expose-Headers': Object.keys(responseHeaders).join(','),
      ...responseHeaders,
    };
  }

  return {
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': allowCredentials,
      'Access-Control-Allow-Methods': allowMethods.join(','),
      'Access-Control-Allow-Headers': allowHeaders.join(','),
      ...exposedHeaders,
    },
    statusCode,
  };
}

/**
 *
 * @param condition
 * @param options
 */
export async function poll(condition: () => boolean, options: PollOptions = {}): Promise<void> {
  const { delay = 1, maxRetries = 5 } = options;
  let retries = 0;

  while (!condition() && retries <= maxRetries) {
    // eslint-disable-next-line no-await-in-loop
    await sleep(delay);
    retries++;
  }

  if (retries >= maxRetries) {
    throw new Error('Timeout');
  }
}

/**
 * Make async requests
 */
export async function request<D = any>(url: string, options: RequestOptions = {}): Promise<D> {
  const { body, headers, method = 'GET' }: RequestOptions = options;

  if (!url) {
    throw new Error('URL is required');
  }

  const params: RequestOptions = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    method,
  };

  if (body) {
    params.body = JSON.stringify(body);
  }

  return fetch(url, params).then(async response => {
    const text = await response.text();
    let content: any;

    try {
      content = JSON.parse(text);
    } catch {
      content = text;
    }

    if (response.status > 299) {
      const error = new Error(response.statusText) as RequestError;

      error.status = response.status;
      error.response = content;

      throw error;
    } else {
      return content;
    }
  });
}

/**
 * Block execution
 */
export function sleep(seconds = 1) {
  return new Promise(resolve => {
    setTimeout(resolve, seconds * 1000);
  });
}
