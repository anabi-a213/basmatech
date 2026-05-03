// Reusable GSAP timeline helpers. Imported by chapter components.
// All assume gsap and ScrollTrigger are already registered in the consuming app.

import type { gsap as GSAP } from 'gsap';

export type RevealStaggerOpts = {
  /** ms between each reveal */
  stagger?: number;
  /** initial offset Y in px */
  fromY?: number;
  /** total duration per item in seconds */
  duration?: number;
  /** delay before first item (seconds) */
  delay?: number;
};

export function createRevealStagger(
  gsap: typeof GSAP,
  targets: Element | Element[] | NodeListOf<Element>,
  opts: RevealStaggerOpts = {},
) {
  const {
    stagger = 0.08,
    fromY = 16,
    duration = 0.7,
    delay = 0,
  } = opts;
  return gsap.fromTo(
    targets,
    { opacity: 0, y: fromY },
    {
      opacity: 1,
      y: 0,
      stagger,
      duration,
      delay,
      ease: 'power2.out',
    },
  );
}

export type ScrollPinOpts = {
  /** trigger element (the wrapping section) */
  trigger: Element;
  /** when does pin start */
  start?: string;
  /** when does pin end */
  end?: string;
  /** scrub smoothing factor */
  scrub?: number | boolean;
  /** function called on update with progress 0..1 */
  onUpdate?: (progress: number) => void;
};

/**
 * Convenience wrapper around ScrollTrigger.create({ pin: trigger, scrub })
 * for the cinematic chapter pattern. Returns the ScrollTrigger instance.
 */
export function createScrollPin(
  ScrollTrigger: any,
  opts: ScrollPinOpts,
) {
  const {
    trigger,
    start = 'top top',
    end = 'bottom bottom',
    scrub = 0.4,
    onUpdate,
  } = opts;
  return ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub,
    onUpdate: onUpdate ? (self: { progress: number }) => onUpdate(self.progress) : undefined,
  });
}
