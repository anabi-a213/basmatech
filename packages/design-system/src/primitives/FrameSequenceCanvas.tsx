'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export type FrameSequenceCanvasProps = {
  /** Path prefix to frames (e.g. /frames/seq2/frame-) — frames numbered 001, 002… */
  framePath: string;
  /** Total number of frames available */
  frameCount: number;
  /** The wrapping section element ref. Pin starts top top, ends bottom bottom. */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Optional cursor-driven offset for chapter 04 (mouse X tilts the wave). */
  cursorReactive?: boolean;
  /** Background color for letterboxing */
  bg?: string;
  /** Scrub smoothing (0..1, GSAP ScrollTrigger scrub) */
  scrub?: number;
  /** Optional callback on every progress update */
  onProgress?: (progress: number) => void;
  /** Image extension (default 'webp') */
  ext?: string;
  /** Override ScrollTrigger end. Default 'bottom bottom'. Use '+=100vh' to
   *  finish the frame scrub before the section ends, so the final frame
   *  has visible hold time before the next section takes over. */
  scrollEnd?: string;
};

/**
 * Canvas frame-sequence player synced to scroll. Ported from website-next/app.js.
 *
 * Uses requestIdleCallback to lazy-batch image loads. Falls back gracefully
 * to the highest available frame when later frames are still loading.
 */
export function FrameSequenceCanvas({
  framePath,
  frameCount,
  triggerRef,
  cursorReactive = false,
  bg = '#0F1015',
  scrub = 0.4,
  onProgress,
  ext = 'webp',
  scrollEnd = 'bottom bottom',
}: FrameSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    const trigger = triggerRef.current;
    if (!canvas || !trigger) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const images: (HTMLImageElement | null)[] = new Array(frameCount);
    let maxAvailable = 0;
    let currentFrame = -1;
    let scrollFrame = 0;
    let extraOffset = 0;
    let targetFrame = 0;
    let raf = 0;
    let destroyed = false;
    let missStreak = 0;

    function frameSrc(i: number) {
      const num = String(i + 1).padStart(3, '0');
      return `${framePath}${num}.${ext}`;
    }

    function loadIdx(i: number) {
      if (destroyed || images[i]) return;
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        maxAvailable = Math.max(maxAvailable, i);
        missStreak = 0;
      };
      img.onerror = () => {
        images[i] = null;
        missStreak++;
        if (missStreak >= 3) destroyed = true;
      };
      img.src = frameSrc(i);
      images[i] = img;
    }

    // eager-load first frame
    loadIdx(0);

    // Defer-load all remaining frames in batches. Default is idle-priority +
    // small batches (good for many simultaneous instances). When the section
    // approaches the viewport (within 1.5 viewports), upgrade to high-priority
    // larger batches so the canvas is fully ready by the time the user is
    // actively scrolling through it.
    type IdleCallback = (cb: () => void) => number;
    const ric: IdleCallback =
      'requestIdleCallback' in window
        ? ((window as Window & { requestIdleCallback: IdleCallback }).requestIdleCallback)
        : ((cb: () => void) => window.setTimeout(cb, 16));
    let i = 1;
    let batchSize = 4;
    let ticker: ReturnType<typeof setTimeout> | number = 0;

    const step = () => {
      if (destroyed) return;
      const end = Math.min(frameCount, i + batchSize);
      for (; i < end; i++) loadIdx(i);
      if (i < frameCount && !destroyed) {
        if (batchSize >= 12) {
          // High-priority loop (active section): rAF
          ticker = requestAnimationFrame(step);
        } else {
          ticker = ric(step);
        }
      }
    };
    ticker = ric(step);

    // Upgrade loading priority when section is near the viewport.
    let io: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              batchSize = 16;
              // Kick a fast pass right now in case idle callbacks are starved.
              if (i < frameCount && !destroyed) {
                cancelAnimationFrame(ticker as number);
                ticker = requestAnimationFrame(step);
              }
            } else {
              batchSize = 4;
            }
          }
        },
        // Pre-load when section is within 1.5 viewports of the top/bottom edge.
        { rootMargin: '150% 0px 150% 0px' },
      );
      io.observe(trigger);
    }

    function recompute() {
      const max = frameCount - 1;
      targetFrame = Math.min(max, Math.max(0, scrollFrame + extraOffset));
    }

    function draw(idx: number) {
      const img = images[idx];
      if (!img || !img.complete || !img.naturalWidth) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas!.clientWidth;
      const h = canvas!.clientHeight;
      if (canvas!.width !== w * dpr || canvas!.height !== h * dpr) {
        canvas!.width = w * dpr;
        canvas!.height = h * dpr;
      }
      const cw = canvas!.width;
      const ch = canvas!.height;
      const ar = img.naturalWidth / img.naturalHeight;
      const car = cw / ch;
      let dw, dh, dx, dy;
      if (ar > car) {
        dh = ch;
        dw = dh * ar;
        dx = (cw - dw) / 2;
        dy = 0;
      } else {
        dw = cw;
        dh = dw / ar;
        dx = 0;
        dy = (ch - dh) / 2;
      }
      ctx!.fillStyle = bg;
      ctx!.fillRect(0, 0, cw, ch);
      ctx!.drawImage(img, dx, dy, dw, dh);
    }

    function tick() {
      raf = 0;
      if (targetFrame === currentFrame) return;
      let idx = Math.min(targetFrame, maxAvailable);
      while (idx > 0 && (!images[idx] || !images[idx]!.complete || !images[idx]!.naturalWidth)) {
        idx--;
      }
      currentFrame = targetFrame;
      draw(idx);
    }

    function scheduleTick() {
      if (!raf) raf = requestAnimationFrame(tick);
    }

    // initial draw of frame 0 once it loads (or right away if cached)
    const firstImg = images[0]!;
    if (firstImg.complete && firstImg.naturalWidth > 0) {
      // already in cache
      requestAnimationFrame(() => draw(0));
    } else {
      firstImg.addEventListener('load', () => draw(0), { once: true });
    }

    // Scroll trigger
    const st = ScrollTrigger.create({
      trigger,
      start: 'top top',
      end: scrollEnd,
      scrub,
      onUpdate: (self) => {
        scrollFrame = Math.round(self.progress * (frameCount - 1));
        recompute();
        scheduleTick();
        onProgress?.(self.progress);
      },
    });

    // Cursor-reactive offset (chapter 04)
    let smoothOffset = 0;
    let mouseXNorm = 0.5;
    let inside = false;
    let cursorRaf = 0;

    function onMove(e: MouseEvent) {
      mouseXNorm = e.clientX / window.innerWidth;
      inside = true;
    }
    function onEnter() {
      inside = true;
    }
    function onLeave() {
      inside = false;
    }

    if (cursorReactive && !reduced) {
      trigger!.addEventListener('mousemove', onMove, { passive: true });
      trigger!.addEventListener('mouseenter', onEnter);
      trigger!.addEventListener('mouseleave', onLeave);
      const cursorTick = () => {
        const target = inside ? Math.round((mouseXNorm - 0.5) * 30) : 0;
        smoothOffset += (target - smoothOffset) * 0.15;
        const next = Math.round(smoothOffset);
        if (next !== extraOffset) {
          extraOffset = next;
          recompute();
          scheduleTick();
        }
        cursorRaf = requestAnimationFrame(cursorTick);
      };
      cursorRaf = requestAnimationFrame(cursorTick);
    }

    // Resize redraw
    let resizeT: number | undefined;
    function onResize() {
      window.clearTimeout(resizeT);
      resizeT = window.setTimeout(() => {
        if (currentFrame >= 0) draw(Math.max(0, Math.min(frameCount - 1, currentFrame)));
      }, 80);
    }
    window.addEventListener('resize', onResize);

    return () => {
      destroyed = true;
      st.kill();
      io?.disconnect();
      cancelAnimationFrame(raf);
      cancelAnimationFrame(cursorRaf);
      window.removeEventListener('resize', onResize);
      if (cursorReactive) {
        trigger!.removeEventListener('mousemove', onMove);
        trigger!.removeEventListener('mouseenter', onEnter);
        trigger!.removeEventListener('mouseleave', onLeave);
      }
    };
  }, [framePath, frameCount, triggerRef, cursorReactive, scrub, onProgress, bg, ext, scrollEnd]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="frame-canvas"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
