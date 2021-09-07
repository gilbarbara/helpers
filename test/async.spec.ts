import { cors, poll, request, sleep } from '../src';

describe('cors', () => {
  it.each([
    [{}, undefined, undefined],
    [[], 201, { methods: ['POST' as const], origin: 'https://example.com', headers: ['x-test'] }],
  ])('%p should return properly', (data, statusCode, options) => {
    expect(cors(data, statusCode, options)).toMatchSnapshot();
  });
});

describe('poll', () => {
  it('should resolve before the timeout', () => {
    let isReady = false;

    setTimeout(() => {
      isReady = true;
    }, 300);

    return poll(() => isReady).then(d => {
      expect(d).toBeUndefined();
    });
  });

  it('should reject after max retries', () => {
    let isReady = false;

    setTimeout(() => {
      isReady = true;
    }, 500);

    return poll(() => isReady, { delay: 0.1 }).catch(error => {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(error.message).toBe('Timeout');
    });
  });
});

describe('request', () => {
  it('should throw without "url"', async () => {
    // @ts-ignore
    await expect(request()).rejects.toThrow('URL is required');
  });

  it('should handle errors', async () => {
    // @ts-ignore
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
    // @ts-ignore
    fetch.mockResponseOnce(
      JSON.stringify({
        body: 'quia et suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
        id: 1,
        title: 'Sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
        userId: 1,
      }),
    );
    expect(await request('https://jsonplaceholder.typicode.com/posts/1')).toMatchSnapshot();
  });

  it('should handle options', async () => {
    // @ts-ignore
    fetch.mockResponseOnce(
      JSON.stringify({
        title: 'foo',
        body: 'bar',
        id: 101,
        userId: 1,
      }),
    );

    expect(
      await request('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: {
          title: 'foo',
          body: 'bar',
          userId: 1,
        },
      }),
    ).toMatchSnapshot();
  });
});

describe('sleep', () => {
  const setTimeoutSpy = jest.spyOn(global, 'setTimeout');

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should halt the execution', async () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const fn = async () => {
      await sleep(0.1);

      return 'finished';
    };

    expect(await fn()).toBe('finished');
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 100);
  });
});
