/**
 * Bezier easing applied to scroll progress before frame lookup. Linear
 * progress feels mechanical when paired with cinematic scenes. power2.inOut
 * lingers at the start, accelerates through the middle, decelerates at the
 * end — which is what film grammar expects.
 */

/** y = x ** 2 / (x ** 2 + (1 - x) ** 2) — symmetric power2 in/out. */
export function power2InOut(t: number): number {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  const t2 = t * t;
  return t2 / (t2 + (1 - t) * (1 - t));
}

export function noEase(t: number): number {
  return t;
}

export type EaseName = 'none' | 'power2.inOut';

export function applyEase(name: EaseName, t: number): number {
  if (name === 'power2.inOut') return power2InOut(t);
  return noEase(t);
}
