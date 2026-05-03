'use client';

import { useEffect, useRef } from 'react';
import { Header, Footer, useLenis } from '@basmatech/design-system';
import type { TourCopy } from '@basmatech/content';
import { TourFoyer } from './TourFoyer';
import { TourProject } from './TourProject';
import { TourClosing } from './TourClosing';

export type TourProps = {
  lang: 'ar' | 'en';
  copy: TourCopy;
};

/**
 * Single-scroll, full-bleed walking presentation.
 *
 * Layout (top → bottom):
 *   Header (fixed)
 *   Foyer                     100vh
 *   Project 01                220vh sticky
 *   Corridor (tint sky)       180vh sticky
 *   Project 02                220vh sticky
 *   Corridor (tint pink)      180vh sticky
 *   ... (repeats 9 projects, 9 corridors)
 *   Closing                   ≥100vh
 *   Magenta band
 *   Footer
 *
 * Total scroll: ~2 × 9 × 100vh + 9 × 180vh + 200vh ≈ 36 viewport heights.
 * That's a 5-minute scroll experience at human pace. By design.
 */
export function Tour({ lang, copy }: TourProps) {
  const otherLang = lang === 'ar' ? 'en' : 'ar';
  const progressRef = useRef<HTMLDivElement>(null);
  const total = copy.projects.length;

  // Lenis smooth scroll: tames fast wheel-flicks so the scroll-locked
  // canvas always has time to walk through every frame in every project.
  // Duration 1.6 ≈ 1.6s wheel-decay; combined with project sections of
  // 320vh each, this guarantees every project's full walk-in is visible
  // even on aggressive flicks. Without smooth scroll, a single mouse-wheel
  // input can otherwise teleport past a whole section.
  useLenis({ duration: 1.6 });

  useEffect(() => {
    function onScroll() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (progressRef.current) {
        progressRef.current.style.setProperty('--tp', String(Math.min(1, Math.max(0, p))));
      }
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="tour-progress">
        <div className="tour-progress__bar" ref={progressRef} />
      </div>

      <Header
        lang={lang}
        toggleHref={`/${otherLang}`}
        toggleLabel={otherLang.toUpperCase()}
        brandLabel={copy.brand.wordmark}
        nav={copy.nav}
      />

      <main>
        <TourFoyer lang={lang} copy={copy} />

        {/* No transitions between projects: each project section is long
            enough (400vh) for the visitor to see every frame of the walk-in
            animation, then dwell on the fully-revealed end frame, before
            scrolling into the next project. Cleanest possible flow. */}
        {copy.projects.map((project, i) => (
          <TourProject
            key={project.slug}
            lang={lang}
            project={project}
            index={i + 1}
            total={total}
            meta={{ progressOf: copy.ui.progressOf }}
          />
        ))}

        <TourClosing lang={lang} copy={copy} />
      </main>

      <Footer
        lang={lang}
        lines={{
          brandLabel: copy.footer.brandLabel,
          legalEntity: copy.footer.legalEntity,
          address: copy.footer.address,
          contactLabel: copy.footer.contactLabel,
          contactEmail: copy.footer.contactEmail,
          parentLabel: copy.footer.parentLabel,
          parentName: copy.footer.parentName,
          copyright: copy.footer.copyright,
          legal: [],
        }}
      />
    </>
  );
}
