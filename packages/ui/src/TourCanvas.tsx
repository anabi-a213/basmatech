'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Phase, TourSpec } from './TourCanvas.types';
import { applyEase } from './lib/easing';
import {
  frameUrl,
  getCachedFrame,
  preloadNextPhase,
  preloadWindow,
} from './lib/preload';
import { isMobileViewport, prefersReducedMotion } from './lib/device';

export type TourCanvasProps = {
  spec: TourSpec;
  /** Per-phase scroll commitment in viewport heights, including the dwell.
   *  Defaults: foyer/closing 100vh, walk phases 400vh (200 scrub + 100 dwell + 100 release). */
  phaseHeightsVh?: Record<string, number>;
  /** Background color when frame 0 isn't yet decoded, or for letterboxing. */
  bg?: string;
  /** When true, render a static <picture> per phase instead of canvas
   *  (for prefers-reduced-motion). Default auto-detects. */
  reducedMotion?: boolean;
};

const DEFAULT_PHASE_HEIGHT_VH = 400;
const FOYER_CLOSING_HEIGHT_VH = 100;

/**
 * One persistent fixed-position canvas at the page root drives the entire
 * tour. A central scroll mapper computes (phaseIndex, frameIndex) from
 * scrollY and the phase scroll table. Eliminates per-section seams by design.
 *
 * Phase 1 NOTE: this is the architectural skeleton. Frame folders may not
 * yet exist (Phase 2 generates them). Until then, the canvas falls back to
 * the bg color for any missing frame, matching the reduced-motion path.
 */
export function TourCanvas({
  spec,
  phaseHeightsVh,
  bg = '#0F1020',
  reducedMotion,
}: TourCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [_isMobile, setIsMobile] = useState(false);

  // Initialize mobile flag + listen for resize
  useEffect(() => {
    function update() { setIsMobile(isMobileViewport()); }
    update();
    if (typeof window === 'undefined') return;
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const reduced = useMemo(
    () => reducedMotion ?? prefersReducedMotion(),
    [reducedMotion],
  );

  // Per-phase scroll heights. The wrap section is sized to match.
  const phaseHeights = useMemo(() => {
    return spec.phases.map((p) => {
      const explicit = phaseHeightsVh?.[p.phaseId];
      if (explicit !== undefined) return explicit;
      // foyer / closing default to 100vh, walk phases default to 400vh.
      const isWalk = p.phaseId !== 'tour-foyer' && p.phaseId !== 'tour-closing';
      return isWalk ? DEFAULT_PHASE_HEIGHT_VH : FOYER_CLOSING_HEIGHT_VH;
    });
  }, [spec.phases, phaseHeightsVh]);

  // Wire ScrollTrigger to compute the active phase + in-phase progress.
  useEffect(() => {
    if (typeof window === 'undefined' || reduced) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    gsap.registerPlugin(ScrollTrigger);
    const vh = window.innerHeight;
    // Cumulative tops in CSS px.
    const cumTops: number[] = [];
    let acc = 0;
    for (const h of phaseHeights) {
      cumTops.push(acc);
      acc += h * vh;
    }
    const totalPx = acc;

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: () => `+=${totalPx}`,
      scrub: 0.2,
      onUpdate: (self: ScrollTrigger) => {
        const scrollPx = self.progress * totalPx;
        // Find active phase
        let i = 0;
        for (let k = 0; k < cumTops.length; k++) {
          if (scrollPx >= cumTops[k]) i = k;
        }
        if (i !== activePhaseIndex) setActivePhaseIndex(i);
        const phase = spec.phases[i];
        const phaseStart = cumTops[i];
        const phaseHeight = phaseHeights[i] * vh;
        // Frame scrub finishes after 200vh of the 400vh phase, leaving 100vh dwell + 100vh release.
        const scrubBudget = Math.min(phaseHeight, 200 * vh);
        const inPhase = Math.max(0, Math.min(scrubBudget, scrollPx - phaseStart));
        const rawT = scrubBudget > 0 ? inPhase / scrubBudget : 0;
        const t = applyEase(phase.ease, rawT);
        const isMobileNow = isMobileViewport();
        const maxFrame = isMobileNow ? 59 : phase.endFrame;
        const frameIndex = Math.round(t * maxFrame);

        // Draw it.
        drawFrame(canvasRef.current, phase, isMobileNow, frameIndex, bg);

        // Pre-warm sliding window
        void preloadWindow(phase, isMobileNow, frameIndex);

        // Approaching end? warm next phase.
        if (rawT > 0.7 && i + 1 < spec.phases.length) {
          void preloadNextPhase(spec.phases[i + 1], isMobileNow);
        }
      },
    });

    // Eager-load frame 0 of phase 0
    void preloadWindow(spec.phases[0], isMobileViewport(), 0);

    return () => { st.kill(); };
  }, [spec, phaseHeights, bg, activePhaseIndex, reduced]);

  // Reduced-motion path: render a static <picture> per phase, stacked.
  if (reduced) {
    return (
      <div ref={wrapRef}>
        {spec.phases.map((p, i) => (
          <section
            key={p.phaseId}
            id={p.phaseId}
            style={{
              height: `${phaseHeights[i]}vh`,
              background: bg,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <img
              alt=""
              src={spec.canonicalHeroByProject[p.phaseId] ?? ''}
              style={{
                position: 'sticky',
                top: 0,
                width: '100%',
                height: '100vh',
                objectFit: 'cover',
              }}
              loading="lazy"
            />
          </section>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* Fixed full-bleed canvas drives every phase. */}
      <canvas
        ref={canvasRef}
        aria-hidden
        style={{
          position: 'fixed',
          inset: 0,
          width: '100vw',
          height: '100vh',
          background: bg,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />
      {/* Scroll spacer: total height = sum of phase heights. ScrollTrigger
          is bound to this. Phase content (text overlays) is rendered as
          siblings by the host page and absolutely-positioned over the
          canvas using its own logic. */}
      <div
        ref={wrapRef}
        data-active-phase={spec.phases[activePhaseIndex]?.phaseId}
        style={{
          height: `${phaseHeights.reduce((a, b) => a + b, 0)}vh`,
          position: 'relative',
        }}
      />
    </>
  );
}

const TINT_HEX_FALLBACK: Record<string, string> = {
  mint: '#5FE99A',
  sky: '#5FA9F0',
  lavender: '#9F86E0',
  pink: '#FFD4E2',
  magenta: '#FF5A9E',
  cream: '#FFF5E6',
};

function drawFrame(
  canvas: HTMLCanvasElement | null,
  phase: Phase,
  isMobile: boolean,
  frameIndex: number,
  bg: string,
): void {
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const cw = window.innerWidth;
  const ch = window.innerHeight;
  if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const url = frameUrl(phase, isMobile, frameIndex);
  const cached = getCachedFrame(url);

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, cw, ch);

  if (!cached) {
    // Phase 1 placeholder mode: no frame loaded yet (Phase 2 will fix this).
    // Paint the phase tint as a soft radial gradient so the user can see the
    // canvas + scroll mapping is working even without real assets.
    const tintColor = TINT_HEX_FALLBACK[phase.tint] ?? '#FF5A9E';
    const grad = ctx.createRadialGradient(
      cw / 2, ch / 2, 0,
      cw / 2, ch / 2, Math.max(cw, ch) * 0.7,
    );
    grad.addColorStop(0, tintColor);
    grad.addColorStop(1, bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);

    // Phase label
    ctx.fillStyle = 'rgba(245, 245, 248, 0.92)';
    ctx.font = '700 ' + Math.round(Math.min(cw, ch) * 0.05) + 'px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(phase.label, cw / 2, ch / 2 - 30);

    // Frame counter
    ctx.fillStyle = 'rgba(245, 245, 248, 0.55)';
    ctx.font = '500 ' + Math.round(Math.min(cw, ch) * 0.02) + 'px ui-monospace, "SF Mono", monospace';
    ctx.fillText(
      `${phase.phaseId} · frame ${frameIndex} / ${phase.endFrame}`,
      cw / 2,
      ch / 2 + 24,
    );
    return;
  }
  // ImageBitmap and HTMLImageElement both expose width/height directly.
  const w = (cached as ImageBitmap | HTMLImageElement).width;
  const h = (cached as ImageBitmap | HTMLImageElement).height;
  if (!w || !h) return;
  const ar = w / h;
  const car = cw / ch;
  let dw, dh, dx, dy;
  if (ar > car) {
    dh = ch; dw = dh * ar; dx = (cw - dw) / 2; dy = 0;
  } else {
    dw = cw; dh = dw / ar; dx = 0; dy = (ch - dh) / 2;
  }
  // Type union: ImageBitmap | HTMLImageElement; both are CanvasImageSource.
  ctx.drawImage(cached as CanvasImageSource, dx, dy, dw, dh);
}
