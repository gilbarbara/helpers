import { isValidCPF, isValidEmail, validatePassword } from '../src';

describe('isValidCPF', () => {
  it.each([
    { input: '660.396.550-03', expected: true },
    { input: '66693320333', expected: true },
    { input: '', expected: false },
    { input: '00000000000', expected: false },
    { input: '660.396.550-04', expected: false },
    { input: '0987654321', expected: false },
  ])('$input should return $expected', ({ expected, input }) => {
    expect(isValidCPF(input)).toBe(expected);
  });
});

describe('isValidEmail', () => {
  it.each([
    { input: 'user@example.com', expected: true },
    { input: 'u@e.co', expected: true },
    { input: '', expected: false },
    { input: 'user@example.c', expected: false },
    { input: '660.396.550-03', expected: false },
    { input: 'user@example.design', expected: true },
  ])('$input should return $expected', ({ expected, input }) => {
    expect(isValidEmail(input)).toBe(expected);
  });
});

describe('validatePassword', () => {
  it.each([
    { input: '0Vxl', message: 'Password must be at least 6 characters long' },
    {
      input: 'GxN71jS3mKV7K8zznXbwuXjfy4wzOjopwXIb8XNVt0UEjCb6T7S1yQM8qPnEolJ7S',
      message: 'Password must be a maximum of 64 characters',
    },
    {
      input: 'sXj2M9b6XIbMLLq1',
      message:
        'Password must have at least 1 number, 1 lowercase, 1 uppercase and 1 special character',
    },
  ])('$input should throw $message', ({ input, message }) => {
    expect(() => validatePassword(input)).toThrow(message);
  });

  it('should validate a proper password', () => {
    expect(validatePassword('co2GFGQWVnvPqw$=')).toBe(true);
  });
});
