'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export type UseLenisOpts = {
  enabled?: boolean;
  duration?: number;
  /** When true, ties Lenis tick into GSAP ticker so ScrollTrigger stays in sync */
  syncScrollTrigger?: boolean;
};

/**
 * Mount Lenis smooth-scroll on the page. Wires into requestAnimationFrame.
 * If `prefers-reduced-motion: reduce` is set, this is a no-op.
 *
 * Returns the Lenis instance ref (or null when disabled).
 */
export function useLenis({
  enabled = true,
  duration = 1.05,
  syncScrollTrigger = true,
}: UseLenisOpts = {}) {
  const ref = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (syncScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    ref.current = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    let onScrollHandler: ((e: unknown) => void) | null = null;
    if (syncScrollTrigger) {
      onScrollHandler = () => ScrollTrigger.update();
      lenis.on('scroll', onScrollHandler);
      gsap.ticker.lagSmoothing(0);
    }

    return () => {
      cancelAnimationFrame(rafId);
      if (onScrollHandler) lenis.off('scroll', onScrollHandler);
      lenis.destroy();
      ref.current = null;
    };
  }, [enabled, duration, syncScrollTrigger]);

  return ref;
}
