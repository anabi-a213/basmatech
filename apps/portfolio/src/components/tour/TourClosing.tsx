'use client';

import { motion } from 'framer-motion';
import { LiquidMark, MagentaBand } from '@basmatech/design-system';
import type { TourCopy } from '@basmatech/content';

export type TourClosingProps = {
  lang: 'ar' | 'en';
  copy: TourCopy;
};

export function TourClosing({ lang, copy }: TourClosingProps) {
  return (
    <>
      <section className="tour-closing" id="tour-closing">
        <div
          className="tour-closing__photo"
          style={{ backgroundImage: 'url(/rooms/tour-closing-hero.jpg)' }}
        />
        <div className="tour-closing__veil" />
        <div className="tour-closing__inner">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 32 }}
          >
            <LiquidMark size={88} animate={false} />
          </motion.div>

          <span
            className="tour-foyer__overline"
            style={{ marginBottom: 24 }}
          >
            {copy.closing.eyebrow}
          </span>

          {lang === 'ar' ? (
            <motion.h2
              className="tour-foyer__headline-ar"
              style={{ fontSize: 'clamp(36px, 5.5vw, 76px)' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              {copy.closing.headline}
            </motion.h2>
          ) : (
            <motion.h2
              className="tour-foyer__headline-en"
              style={{ fontSize: 'clamp(32px, 5vw, 64px)' }}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
            >
              {copy.closing.headline}
            </motion.h2>
          )}

          <motion.p
            className="tour-foyer__sub"
            style={{ marginBottom: 48 }}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {copy.closing.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}
          >
            <a href="https://basmatech.sa/contact" className="tour-closing__cta">
              <span>{copy.closing.cta}</span>
              <span aria-hidden style={{ transform: lang === 'ar' ? 'rotate(180deg)' : 'none' }}>→</span>
            </a>
            <a href={`https://basmatech.sa/${lang}`} className="tour-closing__cta-secondary">
              {copy.closing.ctaSecondary}
            </a>
          </motion.div>
        </div>
      </section>
      <MagentaBand label={copy.closing.bandLabel} />
    </>
  );
}
