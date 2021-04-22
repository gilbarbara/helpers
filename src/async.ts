import 'isomorphic-fetch';

import { CorsOptions, RequestError, RequestOptions } from './types';

/**
 * Format a CORS response
 */
export function cors(data: any, statusCode = 200, options?: CorsOptions) {
  const { methods = ['GET'], origin = '*', headers = [] } = options || {};
  const allowMethods = [...methods, 'OPTIONS'];
  const allowHeaders = Array.from(
    new Set([
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
      ...headers,
    ]),
  );

  return {
    body: JSON.stringify(data),
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': allowMethods.join(','),
      'Access-Control-Allow-Headers': allowHeaders.join(','),
    },
    statusCode,
  };
}

/**
 * Make async requests
 */
export async function request(url: string, options: RequestOptions = {}): Promise<any> {
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
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
