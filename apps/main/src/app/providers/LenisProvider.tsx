'use client';

import { useEffect } from 'react';
import { shouldUseLenis } from '@basmatech/ui';

/**
 * Mounts Lenis smooth scroll only when device is non-touch, non-iOS,
 * and reduced-motion is OFF. Otherwise falls back to native scroll
 * (no normalizeScroll — see comment below).
 */
export function LenisProvider() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let lenis: any = null;

    async function start() {
      const gsapMod = await import('gsap');
      const stMod = await import('gsap/ScrollTrigger');
      gsapMod.default.registerPlugin(stMod.ScrollTrigger);

      // normalizeScroll(true) on iOS is documented as net-negative on GSAP forums
      // (kills momentum at page bottom on iOS Safari, jumps to top on iOS 16,
      // breaks page on older iPhones). Skip Lenis on touch AND skip normalize —
      // accept slightly different feel on iOS in exchange for not breaking it.
      if (!shouldUseLenis()) return;

      const Lenis = (await import('lenis')).default;

      // Canonical Lenis + GSAP integration (per Lenis README + GSAP forum
      // threads #38517 #40426). autoRaf:false hands the RAF loop entirely to
      // gsap.ticker so we don't have two RAF callbacks racing each other —
      // a separate Lenis raf + GSAP's internal ticker produces broken scrub
      // and ScrollTriggers firing at slightly-wrong scroll positions.
      // lagSmoothing(0) disables GSAP's lag compensation which fights Lenis's
      // own lerp, compounding delay.
      lenis = new Lenis({
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
      });
      lenis.on('scroll', () => stMod.ScrollTrigger.update());
      const tickerCb = (time: number) => { lenis?.raf(time * 1000); };
      gsapMod.default.ticker.add(tickerCb);
      gsapMod.default.ticker.lagSmoothing(0);

      // Expose for Pathfinder dot click — see portfolio LenisProvider for rationale.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).__lenis = lenis;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (lenis as any).__tickerCb = tickerCb;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (lenis as any).__gsap = gsapMod.default;
    }

    void start();
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cb = (lenis as any)?.__tickerCb;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const gsap = (lenis as any)?.__gsap;
      if (cb && gsap) gsap.ticker.remove(cb);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).__lenis === lenis) delete (window as any).__lenis;
      lenis?.destroy();
    };
  }, []);
  return null;
}
