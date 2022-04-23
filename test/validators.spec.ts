import { isValidCPF, isValidEmail, validatePassword } from '../src';

describe('isValidCPF', () => {
  it.each([
    ['660.396.550-03', true],
    ['66693320333', true],
    ['', false],
    ['00000000000', false],
    ['660.396.550-04', false],
    ['0987654321', false],
  ])('%p should return %p', (input, expected) => {
    expect(isValidCPF(input)).toBe(expected);
  });
});

describe('isValidEmail', () => {
  it.each([
    ['user@example.com', true],
    ['u@e.co', true],
    ['', false],
    ['user@example.c', false],
    ['660.396.550-03', false],
    ['user@example.design', true],
  ])('%p should return %p', (input, expected) => {
    expect(isValidEmail(input)).toBe(expected);
  });
});

describe('validatePassword', () => {
  it.each([
    ['0Vxl', 'Password must be at least 6 characters long'],
    [
      'GxN71jS3mKV7K8zznXbwuXjfy4wzOjopwXIb8XNVt0UEjCb6T7S1yQM8qPnEolJ7S',
      'Password must be a maximum of 64 characters',
    ],
    [
      'sXj2M9b6XIbMLLq1',
      'Password must have at least 1 number, 1 lowercase, 1 uppercase and 1 special character',
    ],
  ])('%p should throw %p', (input, message) => {
    expect(() => validatePassword(input)).toThrow(message);
  });

  it('should validate a proper password', () => {
    expect(validatePassword('co2GFGQWVnvPqw$=')).toBe(true);
  });
});
