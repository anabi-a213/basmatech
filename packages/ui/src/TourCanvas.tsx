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

// 250vh per walk phase = 200vh full-canvas scrub + 50vh static dwell on the
// last frame. Was 400vh (200vh scrub + 200vh dead dwell) which produced the
// "scrolls forever with nothing happening" symptom — half the page had a
// frozen canvas. Total page goes from 38× viewport-heights down to 25×, which
// is the upper end of what NN/G's scrollytelling research recommends.
const DEFAULT_PHASE_HEIGHT_VH = 250;
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
  // Phase index lives in a ref, not state — the canvas is drawn imperatively
  // every onUpdate, so React re-renders aren't needed. Putting it in state
  // (and including it in the useEffect dep list) caused the ScrollTrigger to
  // be killed and recreated on every phase change, which dropped scroll
  // updates and made the canvas appear stuck.
  const activePhaseIndexRef = useRef(0);
  // Latest draw target — used so async preload can redraw the freshest frame
  // after decode completes (otherwise the canvas stays in placeholder mode
  // when scroll is parked, since onUpdate only fires on movement).
  const lastDrawRef = useRef<{ phase: Phase | null; isMobile: boolean; frameIndex: number }>({
    phase: null,
    isMobile: false,
    frameIndex: 0,
  });
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
    // Cumulative tops in CSS px. phaseHeights values are in vh units where
    // 100 = "100vh = 1 viewport", matching CSS. So divide by 100 to convert
    // the vh-percentage value into a multiplier of the viewport height in px.
    const cumTops: number[] = [];
    let acc = 0;
    for (const h of phaseHeights) {
      cumTops.push(acc);
      acc += (h / 100) * vh;
    }
    const totalPx = acc;

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top top',
      end: () => `+=${totalPx}`,
      // scrub: true (instant) — Lenis already lerps the raw scroll position
      // (lerp: 0.1) before ScrollTrigger reads it, so adding a second scrub
      // smoothing layer here compounds the lag and produces a "swimmy" feel
      // where the canvas drifts behind the actual scroll position.
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self: ScrollTrigger) => {
        const scrollPx = self.progress * totalPx;
        // Find active phase. +1 tolerance — Lenis lerp + ScrollTrigger float
        // arithmetic can leave us 0.x px short of a phase boundary at rest;
        // without tolerance the active phase lags by one at the boundary
        // (e.g. Pathfinder click for project N lands you on N-1).
        let i = 0;
        const probe = scrollPx + 1;
        for (let k = 0; k < cumTops.length; k++) {
          if (probe >= cumTops[k]) i = k;
        }
        if (i !== activePhaseIndexRef.current) activePhaseIndexRef.current = i;
        const phase = spec.phases[i];
        const phaseStart = cumTops[i];
        const phaseHeight = (phaseHeights[i] / 100) * vh;
        // Frame scrub finishes after 200vh = 2 viewport heights of the 400vh
        // (= 4 viewport heights) phase, leaving 100vh dwell + 100vh release.
        const scrubBudget = Math.min(phaseHeight, 2 * vh);
        const inPhase = Math.max(0, Math.min(scrubBudget, scrollPx - phaseStart));
        const rawT = scrubBudget > 0 ? inPhase / scrubBudget : 0;
        const t = applyEase(phase.ease, rawT);
        const isMobileNow = isMobileViewport();
        const maxFrame = isMobileNow ? 59 : phase.endFrame;
        const frameIndex = Math.round(t * maxFrame);

        // Draw it.
        lastDrawRef.current = { phase, isMobile: isMobileNow, frameIndex };
        drawFrame(canvasRef.current, phase, isMobileNow, frameIndex, bg);

        // Splash phases (foyer/closing) have no Kling walk by design —
        // skip preload to avoid 404 console noise.
        if (!isSplashPhase(phase)) {
          // Pre-warm sliding window. After decode, redraw with the freshest
          // target — onUpdate doesn't fire when scroll is parked, so without
          // this redraw the canvas would stay stuck on the tint gradient
          // until the user scrolls again.
          void preloadWindow(phase, isMobileNow, frameIndex).then(() => {
            const r = lastDrawRef.current;
            if (r.phase) drawFrame(canvasRef.current, r.phase, r.isMobile, r.frameIndex, bg);
          });
        }

        // Approaching end? warm next phase (skip if next is a splash).
        if (rawT > 0.7 && i + 1 < spec.phases.length) {
          const next = spec.phases[i + 1];
          if (!isSplashPhase(next)) {
            void preloadNextPhase(next, isMobileNow);
          }
        }
      },
    });

    // Eager-load frame 0 of phase 0 (unless it's a splash phase like foyer)
    if (!isSplashPhase(spec.phases[0])) {
      void preloadWindow(spec.phases[0], isMobileViewport(), 0);
    }

    return () => { st.kill(); };
    // NB: activePhaseIndex intentionally NOT in deps — it's a ref, not state.
    // Including it here previously caused a kill/recreate loop on every phase change.
  }, [spec, phaseHeights, bg, reduced]);

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
        data-tour-spacer
        style={{
          height: `${phaseHeights.reduce((a, b) => a + b, 0)}vh`,
          position: 'relative',
        }}
      />
    </>
  );
}

/**
 * Splash phases are 100vh tinted splash sections — no Kling walk frames
 * are generated for them. The HTML overlays in the host page provide the
 * headline/CTA; the canvas just paints the phase tint. Includes the
 * portfolio foyer/closing and the home c1/c8 bookend chapters.
 */
const SPLASH_PHASE_IDS = new Set([
  'tour-foyer',
  'tour-closing',
  'home-c1-threshold',
  'home-c6-capabilities',
  'home-c7-proof',
  'home-c8-invitation',
]);
function isSplashPhase(phase: Phase): boolean {
  return SPLASH_PHASE_IDS.has(phase.phaseId);
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
    // No decoded frame yet — paint the phase tint as a soft radial gradient.
    // This handles two cases: (a) splash phases (foyer/closing) that have
    // no Kling walk by design, and (b) the brief moment before the first
    // frame finishes decoding for a normal walk phase.
    const tintColor = TINT_HEX_FALLBACK[phase.tint] ?? '#FF5A9E';
    const grad = ctx.createRadialGradient(
      cw / 2, ch / 2, 0,
      cw / 2, ch / 2, Math.max(cw, ch) * 0.7,
    );
    grad.addColorStop(0, tintColor);
    grad.addColorStop(1, bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);
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
