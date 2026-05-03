'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

let registered = false;
function ensureRegistered() {
  if (registered) return;
  if (typeof window === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

/**
 * Sets up a scoped gsap.context for a component. Anything created in `setup`
 * is auto-cleaned on unmount.
 *
 * Usage:
 *   const ref = useRef<HTMLDivElement>(null);
 *   useGSAPContext(ref, () => {
 *     gsap.to('.foo', { x: 100 });
 *   });
 */
export function useGSAPContext(
  scopeRef: React.RefObject<HTMLElement | null>,
  setup: (ctx: gsap.Context) => void | (() => void),
  deps: React.DependencyList = [],
) {
  useEffect(() => {
    ensureRegistered();
    if (!scopeRef.current) return;
    const ctx = gsap.context(() => {
      const cleanup = setup(ctx);
      if (cleanup) ctx.add(cleanup);
    }, scopeRef.current);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

export { gsap, ScrollTrigger };
