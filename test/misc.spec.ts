/* eslint-disable no-console */
import { advanceTo } from 'jest-date-mock';

import { logger, noop, required, unique, uuid } from '../src';

describe('logger', () => {
  const log = jest.spyOn(console, 'log').mockImplementation(noop);
  const group = jest.spyOn(console, 'group').mockImplementation(noop);
  const groupCollapsed = jest.spyOn(console, 'groupCollapsed').mockImplementation(noop);
  const groupEnd = jest.spyOn(console, 'groupEnd').mockImplementation(noop);

  beforeAll(() => {
    advanceTo(new Date(2019, 1, 1, 0, 0, 0));
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('without options', () => {
    logger('type', 'Title', { a: 1 });

    expect(console.groupCollapsed).toHaveBeenLastCalledWith(
      '%c type %cTitle %c@ 00:00:00',
      'color: gray; font-weight: lighter;',
      'color: inherit;',
      'color: gray; font-weight: lighter;',
    );
    expect(console.log).toHaveBeenLastCalledWith({ a: 1 });
    expect(console.groupEnd).toHaveBeenCalledTimes(1);
  });

  it('with typeColor option', () => {
    logger('type', 'Title', ['a'], { typeColor: '#ffc52e' });

    expect(groupCollapsed).toHaveBeenLastCalledWith(
      '%c type %cTitle %c@ 00:00:00',
      'color: #ffc52e; font-weight: lighter;',
      'color: inherit;',
      'color: gray; font-weight: lighter;',
    );
    expect(log).toHaveBeenLastCalledWith(['a']);
    expect(groupEnd).toHaveBeenCalledTimes(2);
  });

  it('with hideTimestamp option', () => {
    logger('type', 'Title', 'OK', { hideTimestamp: true });

    expect(groupCollapsed).toHaveBeenLastCalledWith(
      '%c type %cTitle',
      'color: gray; font-weight: lighter;',
      'color: inherit;',
    );
    expect(log).toHaveBeenLastCalledWith('OK');
    expect(groupEnd).toHaveBeenCalledTimes(3);
  });

  it('with collapsed option', () => {
    logger('type', 'Title', null, { collapsed: false });

    expect(group).toHaveBeenLastCalledWith(
      '%c type %cTitle %c@ 00:00:00',
      'color: gray; font-weight: lighter;',
      'color: inherit;',
      'color: gray; font-weight: lighter;',
    );
    expect(log).toHaveBeenLastCalledWith(null);
    expect(groupEnd).toHaveBeenCalledTimes(4);
  });
});

describe('noop', () => {
  it('should return undefined', () => {
    expect(noop()).toBeUndefined();
  });
});

describe('required', () => {
  it('should throw', () => {
    expect(() => required('X')).toThrow('"X" is required');
  });
});

describe('unique', () => {
  const regex = /^[a-zA-Z0-9]+$/;

  it('should return a unique string', () => {
    expect(unique()).toEqual(expect.stringMatching(regex)).toHaveLength(8);
    expect(unique(24)).toEqual(expect.stringMatching(regex)).toHaveLength(24);
    expect(unique(12, { includeSymbols: true }))
      .toEqual(expect.stringMatching(/^[a-zA-Z0-9!?@#$%^&*+_\-=:.~]+$/))
      .toHaveLength(12);
  });
});

describe('uuid', () => {
  it('should return an uuid', () => {
    expect(uuid()).toEqual(expect.stringMatching(/^[a-z0-9-]+$/));
  });
});
