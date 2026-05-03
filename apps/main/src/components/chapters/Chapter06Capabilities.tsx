'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LocaleCopy } from '@basmatech/content';

export type Chapter06Props = {
  lang: 'ar' | 'en';
  copy: LocaleCopy['chapters']['capabilities'];
};

/**
 * Chapter 06 — Six Capabilities.
 *
 * Full-bleed 600vh sticky section. As the visitor scrolls through, an
 * SVG hexagonal tile rotates step-by-step, exposing one of 6 facets at a
 * time. Each facet shows a single capability with its title, line, and
 * tag — large, centered, demanding full attention. The capability fades
 * cross-cuts as scroll progresses, no grid, no boxed cards.
 */
export function Chapter06Capabilities({ lang, copy }: Chapter06Props) {
  const ref = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const items = copy.items;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    function onScroll() {
      const r = el!.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const past = -r.top;
      const p = Math.max(0, Math.min(1, past / total));
      const i = Math.min(items.length - 1, Math.floor(p * items.length * 0.999));
      setIndex(i);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items.length]);

  const item = items[index];
  const num = String(index + 1).padStart(2, '0');

  return (
    <section
      id="chapter-06"
      ref={ref}
      style={{
        position: 'relative',
        height: `${100 * items.length}vh`,
        background: 'linear-gradient(180deg, #1A1B2C 0%, #14152B 60%, #0F1020 100%)',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr',
          alignItems: 'center',
          padding: 'clamp(64px, 10vh, 120px) clamp(20px, 5vw, 60px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 64,
            maxWidth: 1280,
            margin: '0 auto',
            width: '100%',
            alignItems: 'center',
          }}
        >
          {/* Eyebrow + headline at top */}
          <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto' }}>
            <p
              className="section-eyebrow"
              style={{ color: 'rgba(245, 245, 248, 0.7)', justifyContent: 'center' }}
            >
              {copy.eyebrow}
            </p>
            {lang === 'ar' ? (
              <h2 className="chapter-headline-ar" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
                {copy.headline}
              </h2>
            ) : (
              <h2 className="chapter-headline-en" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}>
                {copy.headline}
              </h2>
            )}
          </div>

          {/* Hex tile + active capability */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 48,
              alignItems: 'center',
              justifyItems: 'center',
            }}
          >
            <HexTile facets={items.map((it) => it.tag)} activeIndex={index} />
            <AnimatePresence mode="wait">
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ textAlign: 'center', maxWidth: 720 }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--magenta)',
                  }}
                >
                  {num} / {String(items.length).padStart(2, '0')} · {item.tag}
                </span>
                <h3
                  style={{
                    fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-display)',
                    fontWeight: lang === 'ar' ? 900 : 800,
                    fontSize: 'clamp(36px, 5vw, 64px)',
                    letterSpacing: lang === 'ar' ? 0 : '-0.02em',
                    margin: '20px 0 16px',
                    color: '#F5F5F8',
                    lineHeight: 1.1,
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-body)',
                    fontSize: 'clamp(15px, 1.4vw, 19px)',
                    lineHeight: 1.6,
                    color: 'rgba(245, 245, 248, 0.85)',
                  }}
                >
                  {item.line}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

function HexTile({ facets, activeIndex }: { facets: string[]; activeIndex: number }) {
  const angle = (activeIndex / facets.length) * 360;
  return (
    <motion.svg
      viewBox="0 0 200 200"
      width="200"
      height="200"
      style={{ filter: 'drop-shadow(0 8px 32px rgba(255, 90, 158, 0.3))' }}
      animate={{ rotate: angle }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <defs>
        <linearGradient id="hex-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5FE99A" />
          <stop offset="33%" stopColor="#5FA9F0" />
          <stop offset="66%" stopColor="#9F86E0" />
          <stop offset="100%" stopColor="#FF5A9E" />
        </linearGradient>
      </defs>
      <polygon
        points="100,10 180,55 180,145 100,190 20,145 20,55"
        fill="url(#hex-gradient)"
        opacity="0.92"
        stroke="rgba(255, 255, 255, 0.4)"
        strokeWidth="1.5"
      />
      {facets.map((_, i) => {
        const a = (i / facets.length) * Math.PI * 2 - Math.PI / 2;
        const cx = 100 + Math.cos(a) * 60;
        const cy = 100 + Math.sin(a) * 60;
        return (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={i === activeIndex ? 8 : 4}
            fill={i === activeIndex ? '#fff' : 'rgba(255,255,255,0.5)'}
          />
        );
      })}
    </motion.svg>
  );
}
