/**
 * @vitest-environment happy-dom
 */

import { isDarkMode, isTouchDevice, prefersReducedMotion } from '../src';

describe('isDarkMode', () => {
  it('should return properly', () => {
    expect(isDarkMode()).toBeFalse();
  });
});

describe('isTouchDevice', () => {
  it('should return properly', () => {
    expect(isTouchDevice()).toBeFalse();
  });
});

describe('prefersReducedMotion', () => {
  it('should return properly', () => {
    expect(prefersReducedMotion()).toBeTrue();
  });
});
