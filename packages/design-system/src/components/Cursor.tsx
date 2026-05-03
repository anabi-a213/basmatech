'use client';

import { useEffect, useRef } from 'react';
import { useCursorMode } from '../hooks/useCursorMode';

type CursorStyle = {
  color1: string;
  color2: string;
  lineWidth: number;
  dotRadius: number;
  fadeMs: number;
  glow?: boolean;
  thinLine?: boolean;
  connectDots?: boolean;
  dashed?: boolean;
};

function styleFor(mode: string): CursorStyle {
  switch (mode) {
    case 'hero':
      return { color1: '#C73D7E', color2: '#FF5A9E', lineWidth: 1.4, dotRadius: 2.5, fadeMs: 500 };
    case 'seq1':
      return { color1: '#C73D7E', color2: '#FF5A9E', lineWidth: 2.4, dotRadius: 4, fadeMs: 700, glow: true };
    case 'seq2':
      return { color1: '#5FA9F0', color2: '#5FE99A', lineWidth: 1.2, dotRadius: 2, fadeMs: 800, thinLine: true };
    case 'seq3':
      return { color1: '#9F86E0', color2: '#FF5A9E', lineWidth: 1.6, dotRadius: 3, fadeMs: 1200, connectDots: true };
    case 'seq4':
      return { color1: '#C73D7E', color2: '#FF5A9E', lineWidth: 2.2, dotRadius: 4, fadeMs: 600, glow: true };
    case 'seq5':
      return { color1: '#C73D7E', color2: '#FF5A9E', lineWidth: 1.6, dotRadius: 3, fadeMs: 700, dashed: true };
    default:
      return { color1: '#C73D7E', color2: '#FF5A9E', lineWidth: 1.8, dotRadius: 3, fadeMs: 600 };
  }
}

/**
 * Magenta cursor ribbon. Tracks pointer, swaps style based on cursor mode
 * (set per chapter via useCursorMode store).
 *
 * No-op on coarse pointer or reduced-motion.
 */
export function Cursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mode = useCursorMode((s) => s.mode);
  const modeRef = useRef(mode);
  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      if (!canvas || !ctx) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    let tx = window.innerWidth / 2;
    let ty = window.innerHeight / 2;
    let cx = tx;
    let cy = ty;
    let hasMoved = false;
    const trail: { x: number; y: number; t: number }[] = [];
    const dots: { x: number; y: number; t: number }[] = [];

    function onMove(e: MouseEvent) {
      tx = e.clientX;
      ty = e.clientY;
      hasMoved = true;
    }
    function onLeave() {
      hasMoved = false;
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);

    let raf = 0;
    function tick(now: number) {
      cx += (tx - cx) * 0.22;
      cy += (ty - cy) * 0.22;

      const style = styleFor(modeRef.current);

      if (hasMoved) {
        trail.push({ x: cx, y: cy, t: now });
        if (trail.length > 24) trail.shift();

        if (style.connectDots) {
          const last = dots[dots.length - 1];
          if (!last || Math.hypot(cx - last.x, cy - last.y) > 85) {
            dots.push({ x: cx, y: cy, t: now });
            if (dots.length > 12) dots.shift();
          }
        }
      }

      const cutoff = now - style.fadeMs;
      while (trail.length && trail[0].t < cutoff) trail.shift();
      const dotCutoff = now - 2400;
      while (dots.length && dots[0].t < dotCutoff) dots.shift();

      if (!ctx || !canvas) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      if (!hasMoved) {
        raf = requestAnimationFrame(tick);
        return;
      }

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (style.connectDots) {
        for (let i = 1; i < dots.length; i++) {
          const a = dots[i - 1];
          const b = dots[i];
          const age = (now - b.t) / 2400;
          ctx.globalAlpha = Math.max(0, 1 - age) * 0.55;
          ctx.strokeStyle = style.color1;
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
        for (let i = 0; i < dots.length; i++) {
          const d = dots[i];
          const age = (now - d.t) / 2400;
          ctx.globalAlpha = Math.max(0, 1 - age) * 0.85;
          ctx.fillStyle = i % 2 === 0 ? style.color1 : style.color2;
          ctx.beginPath();
          ctx.arc(d.x, d.y, style.dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        const len = trail.length;
        if (len > 1) {
          for (let i = 1; i < len; i++) {
            const p = trail[i];
            const prev = trail[i - 1];
            const age = (now - p.t) / style.fadeMs;
            if (age >= 1) continue;
            const ageAlpha = 1 - age;
            const posAlpha = i / len;
            ctx.globalAlpha = ageAlpha * (0.35 + posAlpha * 0.65);
            ctx.strokeStyle = i % 2 === 0 ? style.color1 : style.color2;
            ctx.lineWidth = style.lineWidth * (0.3 + posAlpha * 0.7) * ageAlpha;

            if (style.dashed) {
              ctx.setLineDash([4, 6]);
              ctx.lineDashOffset = -now * 0.04;
            } else {
              ctx.setLineDash([]);
            }

            if (style.glow) {
              ctx.shadowColor = style.color2;
              ctx.shadowBlur = 18 * ageAlpha;
            } else {
              ctx.shadowBlur = 0;
            }

            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
          ctx.shadowBlur = 0;
          ctx.setLineDash([]);
        }
      }

      ctx.globalAlpha = 0.92;
      ctx.fillStyle = style.color1;
      if (style.glow) {
        ctx.shadowColor = style.color2;
        ctx.shadowBlur = 16;
      }
      ctx.beginPath();
      ctx.arc(cx, cy, style.dotRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 60,
      }}
    />
  );
}
