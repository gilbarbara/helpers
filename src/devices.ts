/**
 * Detect if the device is in dark mode
 */
export function isDarkMode() {
  return !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

/**
 * Detect if the device supports touch events
 */
export function isTouchDevice() {
  return !!window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
}

/**
 * Detect if the user prefers reduced motion
 */
export function prefersReducedMotion() {
  return !!window.matchMedia && window.matchMedia('prefers-reduced-motion').matches;
}
