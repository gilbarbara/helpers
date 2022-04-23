/**
 * Check if CPF is valid
 */
import { ValidatePasswordOptions } from './types';

export function isValidCPF(value: string) {
  if (!value) {
    return false;
  }

  const newValue = value.replace(/[.-]/g, '');
  let sum = 0;
  let rest: number;

  if (/^(\d)\1+$/.test(newValue)) {
    return false;
  }

  for (let index = 1; index <= 9; index++) {
    sum += parseInt(newValue.substring(index - 1, index), 10) * (11 - index);
  }

  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) {
    rest = 0;
  }

  if (rest !== parseInt(newValue.substring(9, 10), 10)) {
    return false;
  }

  sum = 0;

  for (let index = 1; index <= 10; index++) {
    sum += parseInt(newValue.substring(index - 1, index), 10) * (12 - index);
  }

  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) {
    rest = 0;
  }

  return rest === parseInt(newValue.substring(10, 11), 10);
}

/**
 * Check if email is valid
 */
export function isValidEmail(value: string) {
  return /^[\w%+.-]+@[\d.a-z-]+\.[a-z]{2,}$/i.test(value);
}

/**
 * Validate password length and required characters
 * @throws
 */
export function validatePassword(password: string, options?: ValidatePasswordOptions) {
  const {
    maxLength = 64,
    maxLengthMessage = 'Password must be a maximum of 64 characters',
    minLength = 6,
    minLengthMessage = 'Password must be at least 6 characters long',
    regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!#$%&*?@^]).*$/,
    requiredCharactersMessage = 'Password must have at least 1 number, 1 lowercase, 1 uppercase and 1 special character',
  } = options || {};

  if (password.length < minLength) {
    throw new Error(minLengthMessage);
  }

  if (password.length > maxLength) {
    throw new Error(maxLengthMessage);
  }

  if (!regex.test(password)) {
    throw new Error(requiredCharactersMessage);
  }

  return true;
}
