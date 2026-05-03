'use client';

import { motion, useReducedMotion } from 'framer-motion';

export type MagentaBandProps = {
  /** label text shown inside the band, mono-cased */
  label?: string;
  className?: string;
};

/**
 * Once-per-page Saudi cultural marker. A thin magenta strip with a label.
 * Use sparingly — exactly one per route.
 */
export function MagentaBand({ label, className }: MagentaBandProps) {
  const reducedMotion = useReducedMotion();
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        background: 'var(--gradient-magenta)',
        color: '#fff',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        overflow: 'hidden',
      }}
    >
      <motion.span
        initial={{ x: -12, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'inline-block', width: 24, height: 1, background: '#fff' }}
      />
      <span>{label || 'Made in Saudi Arabia'}</span>
      <motion.span
        initial={{ x: 12, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: reducedMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ display: 'inline-block', width: 24, height: 1, background: '#fff' }}
      />
    </div>
  );
}
