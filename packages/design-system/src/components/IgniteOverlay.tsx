'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

export type IgniteOverlayProps = {
  /** Localized headline (AR or EN) */
  headline: string;
  /** Localized supplementary line */
  subline: string;
  /** Localized CTA hint */
  hint: string;
  /** Direction — 'rtl' or 'ltr' */
  dir?: 'rtl' | 'ltr';
};

/**
 * First-load drama. Pulses a single mint→azure→pink point of light.
 * Click/tap/Enter/Space dismisses; remembers via sessionStorage.
 *
 * Mounts only on the FIRST load of a session — afterwards it's a no-op.
 */
export function IgniteOverlay({
  headline,
  subline,
  hint,
  dir = 'rtl',
}: IgniteOverlayProps) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('basma-ignited')) return;
    setVisible(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    ref.current?.focus();
  }, [visible]);

  function dismiss() {
    setVisible(false);
    document.body.style.overflow = '';
    try {
      sessionStorage.setItem('basma-ignited', '1');
      if ('vibrate' in navigator) navigator.vibrate(20);
    } catch {
      /* ignore */
    }
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={ref}
          role="button"
          tabIndex={0}
          aria-label={hint}
          dir={dir}
          onClick={dismiss}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              dismiss();
            }
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] } }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background:
              'radial-gradient(ellipse at center, #1A1B2C 0%, #0F1015 80%)',
            cursor: 'pointer',
            color: '#F5F5F8',
            padding: 24,
            outline: 'none',
          }}
        >
          {/* Pulsing point of light */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0.4 }}
            animate={
              reducedMotion
                ? { scale: 1, opacity: 1 }
                : {
                    scale: [0.6, 1.05, 0.6],
                    opacity: [0.4, 1, 0.4],
                  }
            }
            transition={{
              duration: 2.4,
              repeat: reducedMotion ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              width: 220,
              height: 220,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, #FF5A9E 0%, #C73D7E 30%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />

          {/* Inner crisp dot */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={
              reducedMotion ? { scale: 1 } : { scale: [0.8, 1.15, 0.8] }
            }
            transition={{
              duration: 2.4,
              repeat: reducedMotion ? 0 : Infinity,
              ease: 'easeInOut',
            }}
            style={{
              position: 'absolute',
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#FF5A9E',
              boxShadow: '0 0 32px #FF5A9E, 0 0 64px #C73D7E',
            }}
          />

          {/* Text below */}
          <div
            style={{
              position: 'relative',
              marginTop: 280,
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: dir === 'rtl' ? 'var(--font-ar)' : 'var(--font-display)',
                fontWeight: dir === 'rtl' ? 900 : 800,
                fontSize: 'clamp(28px, 4vw, 44px)',
                margin: 0,
                letterSpacing: dir === 'rtl' ? 0 : '-0.02em',
                lineHeight: dir === 'rtl' ? 1.2 : 1.05,
              }}
            >
              {headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1, ease: [0.22, 1, 0.36, 1] }}
              style={{
                marginTop: 12,
                color: '#B8BAC8',
                fontSize: 'clamp(14px, 1.5vw, 18px)',
              }}
            >
              {subline}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: reducedMotion ? 0.6 : [0.4, 0.9, 0.4] }}
              transition={{
                delay: 1.4,
                duration: 2,
                repeat: reducedMotion ? 0 : Infinity,
                ease: 'easeInOut',
              }}
              style={{
                marginTop: 36,
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: '#71748A',
              }}
            >
              {hint}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
