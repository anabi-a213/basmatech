'use client';

import { useEffect } from 'react';
import { shouldUseLenis } from '@basmatech/ui';

/**
 * Mounts Lenis smooth scroll only when device is non-touch, non-iOS,
 * and reduced-motion is OFF. Otherwise relies on native scroll +
 * ScrollTrigger.normalizeScroll(true).
 *
 * iOS Safari rubber-band fights Lenis's scroll proxy and produces visible
 * jitter on pinned phases. Skip Lenis there. Same for any touch-primary
 * device.
 */
export function LenisProvider() {
  useEffect(() => {
    // Use any for the Lenis instance to avoid leaking the lib's specific
    // event-channel typing into this provider; we only need destroy/raf/on.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any = null;
    let rafId = 0;
    let cancelled = false;

    async function start() {
      if (!shouldUseLenis()) {
        // Native scroll path. Normalize ScrollTrigger so it stays in sync.
        const gsapMod = await import('gsap');
        const stMod = await import('gsap/ScrollTrigger');
        gsapMod.default.registerPlugin(stMod.ScrollTrigger);
        stMod.ScrollTrigger.normalizeScroll(true);
        return;
      }
      const Lenis = (await import('lenis')).default;
      const gsapMod = await import('gsap');
      const stMod = await import('gsap/ScrollTrigger');
      gsapMod.default.registerPlugin(stMod.ScrollTrigger);

      lenis = new Lenis({
        duration: 1.6,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      });
      function raf(time: number) {
        if (cancelled) return;
        lenis?.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);
      lenis.on('scroll', () => stMod.ScrollTrigger.update());
      gsapMod.default.ticker.lagSmoothing(0);
    }

    void start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, []);
  return null;
}
