'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';
import { useCursorMode } from '@basmatech/design-system';
import type { ChapterCopy } from '@basmatech/content';

export type Chapter01Props = {
  lang: 'ar' | 'en';
  copy: ChapterCopy;
  onCTAClick?: () => void;
};

/**
 * Chapter 01 — Threshold.
 *
 * Pastel field with a subtle pulsing point of light. The room is dark,
 * wonder is potential, not yet manifest. CTA invites the user to begin.
 */
export function Chapter01Threshold({ lang, copy, onCTAClick }: Chapter01Props) {
  const reducedMotion = useReducedMotion();
  const setCursorMode = useCursorMode((s) => s.setMode);

  useEffect(() => {
    setCursorMode('hero');
    return () => setCursorMode('default');
  }, [setCursorMode]);

  return (
    <section className="hero" id="chapter-01" data-cursor="hero">
      {/* Pulsing point of light, behind text */}
      {!reducedMotion && (
        <motion.div
          aria-hidden
          initial={{ scale: 0.6, opacity: 0.3 }}
          animate={{ scale: [0.6, 1, 0.6], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            top: '38%',
            left: '50%',
            width: 500,
            height: 500,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(255,90,158,0.28) 0%, rgba(199,61,126,0.08) 40%, transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
      )}

      <div className="hero__content">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="hero__eyebrow"
        >
          {copy.eyebrow}
        </motion.div>

        {lang === 'ar' ? (
          <motion.h1
            className="hero__title-ar"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {copy.headline}
          </motion.h1>
        ) : (
          <motion.h1
            className="hero__title-en"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {copy.headline}
          </motion.h1>
        )}

        <motion.p
          className="hero__sub"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {copy.subhead}
        </motion.p>

        <motion.button
          className="hero__cta"
          type="button"
          onClick={onCTAClick}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
        >
          <span>{copy.cta}</span>
          <span aria-hidden style={{ display: 'inline-block', transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }}>
            →
          </span>
        </motion.button>
      </div>
    </section>
  );
}
