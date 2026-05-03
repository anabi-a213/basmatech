'use client';

/**
 * Device detection helpers used to gate Lenis, scroll easing, and frame
 * resolution. SSR-safe: every helper guards `typeof window`.
 *
 * The mobile cutoff matches the tour CSS breakpoint (768px). iPad is treated
 * as desktop (the touch flag matters more than the width).
 */

export function isClient(): boolean {
  return typeof window !== 'undefined';
}

export function isIOS(): boolean {
  if (!isClient()) return false;
  const ua = navigator.userAgent;
  // iPadOS 13+ identifies as Macintosh — fall back to the touch test.
  const macTouch = /Macintosh/.test(ua) && navigator.maxTouchPoints > 1;
  return /iPhone|iPad|iPod/.test(ua) || macTouch;
}

export function isTouchPrimary(): boolean {
  if (!isClient()) return false;
  return matchMedia('(pointer: coarse)').matches;
}

export function isMobileViewport(): boolean {
  if (!isClient()) return false;
  return matchMedia('(max-width: 768px)').matches;
}

export function prefersReducedMotion(): boolean {
  if (!isClient()) return false;
  return matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** True iff Lenis smooth scroll should run.
 *  Lenis fights the OS on iOS Safari (rubber-band, momentum loss) and is
 *  unwanted on touch devices in general. Disable when reduced motion is on. */
export function shouldUseLenis(): boolean {
  if (!isClient()) return false;
  if (prefersReducedMotion()) return false;
  if (isIOS()) return false;
  if (isTouchPrimary()) return false;
  return true;
}
