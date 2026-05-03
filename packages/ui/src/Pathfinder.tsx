'use client';

import { useEffect, useRef } from 'react';
import type { Phase } from './TourCanvas.types';

export type PathfinderProps = {
  phases: Phase[];
  /** Same per-phase scroll heights TourCanvas uses. */
  phaseHeightsVh: number[];
};

/**
 * Tiny fixed-position dot navigator. One dot per phase, the active one is
 * filled magenta, the rest are 30% white. Click jumps to that phase via
 * scrollY. Acts as the deep-link entry point + progress indicator.
 *
 * Phase 1 implements click-to-scroll only. View Transitions API
 * enhancement (declarative cross-document morph) is wired in Phase 5.
 */
export function Pathfinder({ phases, phaseHeightsVh }: PathfinderProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const el = ref.current;
    if (!el) return;

    const target = el;
    function update() {
      const vh = window.innerHeight;
      const cumTops: number[] = [];
      let acc = 0;
      for (const h of phaseHeightsVh) {
        cumTops.push(acc);
        acc += h * vh;
      }
      const total = acc;
      const y = window.scrollY;
      let active = 0;
      for (let k = 0; k < cumTops.length; k++) if (y >= cumTops[k]) active = k;
      const dots = target.querySelectorAll<HTMLButtonElement>('button[data-phase]');
      dots.forEach((d, i) => {
        d.dataset.active = String(i === active);
      });
      // Progress bar
      const bar = target.querySelector<HTMLDivElement>('[data-progress]');
      if (bar) bar.style.transform = `scaleX(${Math.min(1, y / total)})`;
    }

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [phaseHeightsVh]);

  function jumpTo(index: number) {
    const vh = window.innerHeight;
    let y = 0;
    for (let i = 0; i < index; i++) y += phaseHeightsVh[i] * vh;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }

  return (
    <div
      ref={ref}
      aria-label="tour progress"
      style={{
        position: 'fixed',
        right: 24,
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        zIndex: 60,
        pointerEvents: 'none',
      }}
    >
      <div
        data-progress
        style={{
          position: 'absolute',
          top: -120,
          left: 5,
          right: 5,
          height: 1,
          background: 'rgba(255,90,158,0.5)',
          transform: 'scaleX(0)',
          transformOrigin: 'left',
          pointerEvents: 'none',
        }}
      />
      {phases.map((p, i) => (
        <button
          key={p.phaseId}
          data-phase={p.phaseId}
          aria-label={p.label}
          onClick={() => jumpTo(i)}
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            border: 'none',
            background: 'rgba(255,255,255,0.3)',
            cursor: 'pointer',
            pointerEvents: 'auto',
            transition: 'background 200ms, transform 200ms',
          }}
        />
      ))}
      <style>{`
        button[data-phase][data-active="true"] {
          background: var(--magenta, #FF5A9E) !important;
          transform: scale(1.4);
        }
      `}</style>
    </div>
  );
}
