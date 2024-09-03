import { ASYNC_STATUS, cors, poll, request, sleep } from '../src';

describe('ASYNC_STATUS', () => {
  it('should return the expected statuses', () => {
    expect(ASYNC_STATUS).toMatchSnapshot();
  });
});

describe('cors', () => {
  it.each([
    {
      title: 'data',
      data: { name: 'John Doe' },
    },
    {
      title: 'methods, origin and allowedHeaders',
      data: null,
      options: {
        allowedHeaders: ['x-test'],
        methods: ['POST' as const],
        origin: 'https://example.com',
        statusCode: 201,
      },
    },
    {
      title: 'responseHeaders',
      data: [{ name: 'John Doe' }],
      options: {
        responseHeaders: {
          Link: '</?page=10>; rel="current", </?page=10>; rel="last", </?page=9>; rel="prev"',
          'X-Items-Total': '938',
          'X-Items-Per-Page': '100',
          'X-Items-From': '901',
          'X-Items-To': '938',
        },
      },
    },
  ])('with $title should return properly', ({ data, options }) => {
    expect(cors(data, options)).toMatchSnapshot();
  });
});

describe('poll', () => {
  it('should resolve before the timeout', async () => {
    let isReady = false;

    setTimeout(() => {
      isReady = true;
    }, 300);

    const d = await poll(() => isReady);

    expect(d).toBeUndefined();
  });

  it('should reject after max retries', async () => {
    let isReady = false;

    setTimeout(() => {
      isReady = true;
    }, 500);

    try {
      await poll(() => isReady, { delay: 0.1 });
    } catch (error: any) {
      // eslint-disable-next-line @vitest/no-conditional-expect
      expect(error.message).toBe('Timeout');
    }
  });
});

describe('request', () => {
  it('should throw without "url"', async () => {
    // @ts-expect-error - invalid value
    await expect(request()).rejects.toThrow('URL is required');
  });

  it('should handle errors', async () => {
    // @ts-expect-error - invalid value
    fetch.mockResponseOnce(() =>
      Promise.resolve({
        status: 404,
        body: 'Not Found',
        statusText: 'Something failed',
      }),
    );

    await expect(request('https://jsonplaceholder.typicode.com/posts/1234567890')).rejects.toThrow(
      'Something failed',
    );
  });

  it('should handle success', async () => {
    // @ts-expect-error - invalid value
    fetch.mockResponseOnce(
      JSON.stringify({
        body: 'quia et suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
        id: 1,
        title: 'Sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        userId: 1,
      }),
    );
    await expect(
      request('https://jsonplaceholder.typicode.com/posts/1'),
    ).resolves.toMatchSnapshot();
  });

  it('should handle options', async () => {
    // @ts-expect-error - invalid value
    fetch.mockResponseOnce(
      JSON.stringify({
        title: 'foo',
        body: 'bar',
        id: 101,
        userId: 1,
      }),
    );

    await expect(
      request('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: {
          title: 'foo',
          body: 'bar',
          userId: 1,
        },
      }),
    ).resolves.toMatchSnapshot();
  });
});

describe('sleep', () => {
  const setTimeoutSpy = vi.spyOn(global, 'setTimeout');

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it.each([
    { input: 0.1, timeout: 100 },
    { input: undefined, timeout: 1000 },
  ])('should halt the execution for $input', async ({ input, timeout }) => {
    const fn = async () => {
      await sleep(input);

      return 'finished';
    };

    await expect(fn()).resolves.toBe('finished');
    expect(setTimeoutSpy).toHaveBeenLastCalledWith(expect.any(Function), timeout);
  });
});
