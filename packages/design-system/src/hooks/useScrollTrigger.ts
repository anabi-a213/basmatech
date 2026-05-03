'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Refresh ScrollTrigger when fonts/images settle. Call once in the app shell.
 */
export function useScrollTriggerRefresh() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    // Also refresh after fonts have decoded
    if ('fonts' in document) {
      (document as Document & { fonts: { ready: Promise<void> } }).fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    return () => {
      window.removeEventListener('load', onLoad);
    };
  }, []);
}
