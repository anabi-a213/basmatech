'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FrameSequenceCanvas } from '@basmatech/design-system';
import type { TourProject as TourProjectData } from '@basmatech/content';

export type TourProjectProps = {
  lang: 'ar' | 'en';
  project: TourProjectData;
  /** ordinal index 1..9 used for the anchor id and walk-in frame folder */
  index: number;
  total: number;
  meta: {
    progressOf: string;
  };
};

/**
 * Full-bleed project room. 240vh tall section with a sticky 100vh viewport
 * that hosts a scroll-locked canvas frame sequence. As the visitor scrolls
 * through the section, the project comes alive: from the empty-room start
 * frame to the fully-active end frame (the hero photo).
 *
 * Frames live at /frames/walk-NN/frame-001.webp through frame-121.webp.
 * They are eager-load frame 0 + idle-batch the rest, with graceful
 * fallback to the highest-loaded frame if later frames are still loading.
 *
 * Text overlay enters with a slight delay so the visual reads first.
 */
export function TourProject({ lang, project, index, total, meta }: TourProjectProps) {
  const ref = useRef<HTMLElement>(null);
  const num = String(index).padStart(2, '0');
  const id = `tour-${num}`;
  const framePath = `/frames/walk-${num}/frame-`;

  return (
    <section className="tour-project" id={id} ref={ref}>
      <div className="tour-project__sticky">
        <FrameSequenceCanvas
          framePath={framePath}
          frameCount={121}
          triggerRef={ref}
          ext="webp"
          bg="#0F1020"
          /* Lock canvas frame 1:1 to scroll position. No interpolation lag.
             Combined with Lenis smooth scroll, the canvas updates exactly as
             fast as the visitor scrolls — every frame visible. */
          scrub={0.2}
          /* Section is 400vh. Sticky pins for 300vh.
             Frame scrub plays through all 121 frames over 200vh of scroll
             (slow, deliberate, every frame visible at any scroll speed).
             The end frame then holds visible for the remaining 150vh of
             pin time before the section unpins. Visitor sees the full
             installation alive for 1.5+ viewports before moving on. */
          scrollEnd="+=200%"
        />
        <div className="tour-project__veil" />
        <div className="tour-project__inner">
          <div className="tour-project__top">
            <span className="tour-project__num">
              {project.number} {meta.progressOf} {String(total).padStart(2, '0')}
            </span>
            <span className="tour-project__category">{project.categoryLabel}</span>
          </div>
          <div className="tour-project__bottom">
            <div>
              {lang === 'ar' ? (
                <motion.h2
                  className="tour-project__title-ar"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {project.title}
                </motion.h2>
              ) : (
                <motion.h2
                  className="tour-project__title-en"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  {project.title}
                </motion.h2>
              )}
              <p className="tour-project__meta">
                {project.city} · {project.year}
              </p>
              <motion.p
                className="tour-project__outcome"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.8, delay: 0.15 }}
              >
                {project.outcome}
              </motion.p>
            </div>
            <motion.dl
              className="tour-project__stats"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              {project.stats.map((s) => (
                <div key={s.label}>
                  <dt className="tour-project__stat-label">{s.label}</dt>
                  <dd className="tour-project__stat-value">{s.value}</dd>
                </div>
              ))}
            </motion.dl>
          </div>
        </div>
      </div>
    </section>
  );
}
