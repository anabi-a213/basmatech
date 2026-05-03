'use client';

import { createElement, type ElementType, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export type BilingualTextProps = {
  /** Arabic text (renders if lang === 'ar') */
  ar?: string;
  /** English text (renders if lang === 'en') */
  en?: string;
  /** Active language */
  lang: 'ar' | 'en';
  /** HTML element tag */
  as?: ElementType;
  /** Apply word-by-word reveal animation when in viewport */
  animate?: boolean;
  /** Stagger delay between words (seconds) */
  stagger?: number;
  /** Initial delay before first word reveals (seconds) */
  delay?: number;
  /** Inline style */
  style?: React.CSSProperties;
  /** Class name */
  className?: string;
  /** Direct children — overrides ar/en (rare, for HTML markup mid-string) */
  children?: ReactNode;
};

/**
 * Bilingual word-splitter using Intl.Segmenter.
 *
 * Per-letter splitting in Arabic breaks letter joining/shaping (initial/medial
 * /final forms collapse to isolated). So we split by WORD, not letter, and
 * reveal each word with stagger.
 *
 * For English we also split by word for matching cadence.
 */
function splitText(text: string, lang: 'ar' | 'en'): string[] {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter(lang === 'ar' ? 'ar' : 'en', { granularity: 'word' });
    const out: string[] = [];
    for (const { segment } of seg.segment(text)) out.push(segment);
    return out;
  }
  return text.split(/(\s+)/);
}

export function BilingualText({
  ar,
  en,
  lang,
  as: Tag = 'span',
  animate = true,
  stagger = 0.06,
  delay = 0,
  style,
  className,
  children,
}: BilingualTextProps) {
  const reducedMotion = useReducedMotion();
  const text = children ? null : lang === 'ar' ? ar : en;
  const segments = text ? splitText(text, lang) : null;

  const baseStyle: React.CSSProperties = {
    fontFamily: lang === 'ar' ? 'var(--font-ar)' : 'var(--font-display)',
    fontWeight: lang === 'ar' ? 900 : 800,
    letterSpacing: lang === 'ar' ? 0 : '-0.02em',
    lineHeight: lang === 'ar' ? 1.2 : 1.05,
    ...style,
  };

  if (children) {
    return createElement(Tag, { style: baseStyle, className }, children);
  }

  if (!animate || reducedMotion || !segments) {
    return createElement(Tag, { style: baseStyle, className }, text);
  }

  const inner = segments.map((seg, i) => {
    if (/^\s+$/.test(seg)) return seg;
    return (
      <motion.span
        key={i}
        style={{ display: 'inline-block', whiteSpace: 'pre' }}
        initial={{ opacity: 0, y: '0.4em' }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.6,
          delay: delay + i * stagger,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {seg}
      </motion.span>
    );
  });

  return createElement(Tag, { style: baseStyle, className }, inner);
}
