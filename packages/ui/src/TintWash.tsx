'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Phase, Tint } from './TourCanvas.types';

const TINT_HEX: Record<Tint, string> = {
  mint: '#5FE99A',
  sky: '#5FA9F0',
  lavender: '#9F86E0',
  pink: '#FFD4E2',
  magenta: '#FF5A9E',
  cream: '#FFF5E6',
};

export type TintWashProps = {
  phases: Phase[];
  /** Same per-phase scroll heights TourCanvas uses. */
  phaseHeightsVh: number[];
  /** Mix-blend opacity at peak crossfade. 0..1. Default 0.45. */
  intensity?: number;
};

/**
 * Fixed full-screen overlay that washes the page in the active phase's tint
 * during the last 20% of phase[i] and the first 20% of phase[i+1]. Cuts to
 * full opacity 0 outside that window so it only acts at handoffs. Used as
 * the cross-project visual handoff replacement for the corridor video we
 * removed.
 */
export function TintWash({ phases, phaseHeightsVh, intensity = 0.45 }: TintWashProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const vh = window.innerHeight;
    const cumTops: number[] = [];
    let acc = 0;
    for (const h of phaseHeightsVh) {
      cumTops.push(acc);
      acc += h * vh;
    }
    const totalPx = acc;

    const st = ScrollTrigger.create({
      start: 0,
      end: totalPx,
      scrub: 0.2,
      onUpdate: (self) => {
        const scrollPx = self.progress * totalPx;
        // Find current phase
        let i = 0;
        for (let k = 0; k < cumTops.length; k++) {
          if (scrollPx >= cumTops[k]) i = k;
        }
        const phaseStart = cumTops[i];
        const phaseLen = phaseHeightsVh[i] * vh;
        const inPhase = (scrollPx - phaseStart) / phaseLen; // 0..1
        const next = phases[i + 1];

        // Default: hide
        let opacity = 0;
        let bg = TINT_HEX[phases[i].tint];

        // Wash window: last 20% of current OR first 20% of next.
        if (inPhase > 0.8 && next && phases[i].blendOut === 'wash') {
          // Crossfade from current to next over 0.8..1.0
          const t = (inPhase - 0.8) / 0.2; // 0..1
          opacity = intensity * t;
          bg = lerpColor(TINT_HEX[phases[i].tint], TINT_HEX[next.tint], t);
        }

        el.style.opacity = String(opacity);
        el.style.background = bg;
      },
    });

    return () => { st.kill(); };
  }, [phases, phaseHeightsVh, intensity]);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        mixBlendMode: 'soft-light',
        opacity: 0,
        transition: 'opacity 80ms linear',
      }}
    />
  );
}

function lerpColor(a: string, b: string, t: number): string {
  const ra = parseInt(a.slice(1, 3), 16);
  const ga = parseInt(a.slice(3, 5), 16);
  const ba = parseInt(a.slice(5, 7), 16);
  const rb = parseInt(b.slice(1, 3), 16);
  const gb = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ra + (rb - ra) * t);
  const g = Math.round(ga + (gb - ga) * t);
  const bl = Math.round(ba + (bb - ba) * t);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${bl.toString(16).padStart(2, '0')}`;
}
