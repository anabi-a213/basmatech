'use client';

import { useEffect, useRef, type ReactNode } from 'react';

export type PhaseOverlayProps = {
  /** Top of this phase, in vh units (sum of preceding phase heights). */
  phaseTopVh: number;
  /**
   * The overlay's own visual height in vh. Defaults to 100vh — the overlay
   * spans one viewport-height of scroll where its contents are visible.
   */
  overlayHeightVh?: number;
  /**
   * Vertical offset within the phase where the overlay is centered, in vh.
   * For walk phases this is typically 200vh (where the canvas reaches its
   * final frame). For splash phases, half the phase height.
   */
  centerOffsetVh: number;
  /** Optional className for the inner content wrapper. */
  className?: string;
  /** Inline style hooks for the inner content wrapper. */
  contentStyle?: React.CSSProperties;
  children: ReactNode;
};

/**
 * Apple-style scrollytelling overlay: fades content in/out based on the
 * viewer's scroll position relative to the phase. The wrapper is absolutely
 * positioned at a fixed vh offset (matching the canvas's scroll table),
 * but the inner content's opacity is computed every scroll tick from how
 * close the viewer's center is to the overlay's center.
 *
 * Without this fade, overlays would hard-pop on/off at phase boundaries —
 * the symptom users perceive as "broken scroll". This is the same pattern
 * documented in the CSS-Tricks reverse-engineering of the Apple AirPods Pro
 * page (sticky position + opacity from scroll percentage).
 */
export function PhaseOverlay({
  phaseTopVh,
  overlayHeightVh = 100,
  centerOffsetVh,
  className,
  contentStyle,
  children,
}: PhaseOverlayProps) {
  const innerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const inner = innerRef.current;
    if (!inner) return;

    let raf = 0;
    let lastOpacity = -1;

    function update() {
      if (!inner) return;
      const vh = window.innerHeight;
      const phaseStartPx = (phaseTopVh / 100) * vh;
      const overlayCenterPx = phaseStartPx + (centerOffsetVh / 100) * vh;

      const viewportCenterPx = window.scrollY + vh / 2;
      const distanceFromCenter = Math.abs(viewportCenterPx - overlayCenterPx);

      // Fade window. Plateau of 0.6vh (centered on the overlay) where text
      // is fully opaque, then linear fade out to 0 at 1.4vh from center.
      // Tuned so adjacent phase overlays overlap continuously: with 250vh
      // walk phases (centers 2.5vh apart) and FADE_END=1.4vh, p_n's fade-out
      // tail at +1.4vh meets p_{n+1}'s fade-in tail at -1.4vh, giving 0.3vh
      // of double-visibility instead of a dead zone where neither shows.
      const FADE_PEAK = vh * 0.6;   // distance where opacity is still 1.0
      const FADE_END = vh * 1.4;    // distance beyond which opacity is 0

      let op: number;
      if (distanceFromCenter <= FADE_PEAK) op = 1;
      else if (distanceFromCenter >= FADE_END) op = 0;
      else op = 1 - (distanceFromCenter - FADE_PEAK) / (FADE_END - FADE_PEAK);

      // Clamp & avoid pointless writes
      op = Math.max(0, Math.min(1, op));
      if (Math.abs(op - lastOpacity) > 0.01) {
        inner.style.opacity = String(op);
        lastOpacity = op;
      }

      // Also gate visibility for screen readers / pointer events
      if (op === 0 && inner.style.visibility !== 'hidden') {
        inner.style.visibility = 'hidden';
      } else if (op > 0 && inner.style.visibility !== 'visible') {
        inner.style.visibility = 'visible';
      }
    }

    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, [phaseTopVh, centerOffsetVh]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: `calc(${phaseTopVh + centerOffsetVh}vh - ${overlayHeightVh / 2}vh)`,
        left: 0,
        right: 0,
        height: `${overlayHeightVh}vh`,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    >
      <div
        ref={innerRef}
        className={className}
        style={{
          position: 'sticky',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '100%',
          opacity: 0,
          transition: 'visibility 0.2s',
          willChange: 'opacity',
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
