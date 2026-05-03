'use client';

import { motion } from 'framer-motion';
import type { TourCopy } from '@basmatech/content';

export type TourFoyerProps = {
  lang: 'ar' | 'en';
  copy: TourCopy;
};

export function TourFoyer({ lang, copy }: TourFoyerProps) {
  return (
    <section className="tour-foyer" id="tour-foyer">
      <div
        className="tour-foyer__photo"
        style={{ backgroundImage: 'url(/rooms/tour-foyer-hero.jpg)' }}
      />
      <div className="tour-foyer__veil" />
      <div className="tour-foyer__inner">
        <span />
        <div>
          <div className="tour-foyer__overline">{copy.foyer.eyebrowOverline}</div>
          <div className="tour-foyer__eyebrow">{copy.foyer.eyebrow}</div>
        </div>
        <div>
          {lang === 'ar' ? (
            <motion.h1
              className="tour-foyer__headline-ar"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {copy.foyer.headline}
            </motion.h1>
          ) : (
            <motion.h1
              className="tour-foyer__headline-en"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {copy.foyer.headline}
            </motion.h1>
          )}
          <motion.p
            className="tour-foyer__sub"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {copy.foyer.subhead}
          </motion.p>
        </div>
        <span className="tour-foyer__hint">{copy.foyer.scrollHint}</span>
      </div>
    </section>
  );
}
