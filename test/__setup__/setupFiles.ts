/* eslint-disable class-methods-use-this */
declare let global: any;

global.IntersectionObserver = class IntersectionObserver {
  observe() {
    return null;
  }

  unobserve() {
    return null;
  }
};

export {};
