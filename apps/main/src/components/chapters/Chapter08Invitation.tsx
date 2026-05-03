'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { LiquidMark, MagentaBand } from '@basmatech/design-system';
import type { LocaleCopy } from '@basmatech/content';

export type Chapter08Props = {
  lang: 'ar' | 'en';
  copy: LocaleCopy['chapters']['invitation'];
  bandLabel: string;
};

/**
 * Chapter 08 — The Invitation.
 * STUB-ish for next phase but functional: pastel field, logo, bilingual CTA,
 * the page's once-per-page Magenta band sits just above the footer.
 */
export function Chapter08Invitation({ lang, copy, bandLabel }: Chapter08Props) {
  return (
    <>
      <section id="chapter-08" className="invitation">
        <div className="invitation__inner container-narrow">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}
          >
            <LiquidMark size={88} />
          </motion.div>

          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            {copy.eyebrow}
          </div>

          {lang === 'ar' ? (
            <motion.h2
              className="section-headline-ar"
              style={{ textAlign: 'center', fontSize: 'clamp(40px, 6vw, 72px)' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {copy.headline}
            </motion.h2>
          ) : (
            <motion.h2
              className="section-headline-en"
              style={{ textAlign: 'center', fontSize: 'clamp(36px, 5.5vw, 64px)' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {copy.headline}
            </motion.h2>
          )}

          <motion.p
            className="section-sub"
            style={{ textAlign: 'center', margin: '16px auto 0' }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {copy.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{
              marginTop: 48,
              display: 'flex',
              gap: 16,
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {copy.cta && (
              <Link href={`/${lang}/contact`} className="hero__cta">
                <span>{copy.cta}</span>
                <span aria-hidden style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }}>
                  →
                </span>
              </Link>
            )}
            {copy.ctaSecondary && (
              <Link
                href={`/${lang}/contact`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 28px',
                  borderRadius: 'var(--radius-pill)',
                  background: 'transparent',
                  color: 'var(--ink)',
                  border: '1px solid var(--border-medium)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 13,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  transition: 'all var(--dur-medium) var(--ease-out)',
                }}
              >
                {copy.ctaSecondary}
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Once-per-page Saudi marker, sits between content and footer */}
      <MagentaBand label={bandLabel} />
    </>
  );
}
