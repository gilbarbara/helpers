import { mean, median, mode } from '../src';

const numberArray = [10, 30, 40, 50, 20, 50, 70, 30, 20, 10, 90, 30, 100, 50];

describe('mean', () => {
  it('should return the mean of an array of numbers', () => {
    expect(mean(numberArray)).toBe(42.857142857142854);
  });

  it('should return the mean of an array of numbers with precision', () => {
    expect(mean(numberArray, 2)).toBe(42.86);
  });
});

describe('median', () => {
  it('should return the median of an array of numbers', () => {
    expect(median(numberArray)).toBe(35);
    expect(median([...numberArray, 70])).toBe(40);
  });
});

describe('mode', () => {
  it('should return the mode of an array of numbers', () => {
    expect(mode(numberArray)).toBe(30);
  });
});
