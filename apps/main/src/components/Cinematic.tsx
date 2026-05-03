'use client';

import { useEffect } from 'react';
import {
  Header,
  Footer,
  IgniteOverlay,
  Cursor,
  useLenis,
  useScrollTriggerRefresh,
  useCursorMode,
} from '@basmatech/design-system';
import type { LocaleCopy } from '@basmatech/content';
import type { CursorMode } from '@basmatech/design-system';
import { Chapter01Threshold } from './chapters/Chapter01Threshold';
import { Chapter02Fingerprint } from './chapters/Chapter02Fingerprint';
import { Chapter03Loop } from './chapters/Chapter03Loop';
import { Chapter04Motion } from './chapters/Chapter04Motion';
import { Chapter05Kingdom } from './chapters/Chapter05Kingdom';
import { Chapter06Capabilities } from './chapters/Chapter06Capabilities';
import { Chapter07Proof } from './chapters/Chapter07Proof';
import { Chapter08Invitation } from './chapters/Chapter08Invitation';

export type CinematicProps = {
  lang: 'ar' | 'en';
  copy: LocaleCopy;
};

const CHAPTER_TO_CURSOR: Record<string, CursorMode> = {
  'chapter-01': 'hero',
  'chapter-02': 'seq1',
  'chapter-03': 'seq3',
  'chapter-04': 'seq4',
  'chapter-05': 'seq5',
  'chapter-06': 'services',
  'chapter-07': 'services',
  'chapter-08': 'contact',
};

export function Cinematic({ lang, copy }: CinematicProps) {
  const setCursorMode = useCursorMode((s) => s.setMode);
  const otherLang = lang === 'ar' ? 'en' : 'ar';

  // Smooth scroll + ScrollTrigger sync
  useLenis({ enabled: true, syncScrollTrigger: true });

  // Refresh after fonts/load
  useScrollTriggerRefresh();

  // Per-chapter cursor mode via IntersectionObserver, picking highest ratio
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ratios = new Map<string, number>();
    const ids = Object.keys(CHAPTER_TO_CURSOR);
    const els = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => ratios.set(e.target.id, e.intersectionRatio));
        let bestId: string | null = null;
        let bestRatio = 0;
        ratios.forEach((r, id) => {
          if (r > bestRatio) {
            bestRatio = r;
            bestId = id;
          }
        });
        if (bestId && CHAPTER_TO_CURSOR[bestId]) {
          setCursorMode(CHAPTER_TO_CURSOR[bestId]);
        }
      },
      { threshold: [0, 0.05, 0.1, 0.2, 0.4, 0.6, 0.8, 1] },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [setCursorMode]);

  return (
    <>
      <IgniteOverlay
        headline={copy.ignite.headline}
        subline={copy.ignite.subline}
        hint={copy.ignite.hint}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      />

      <Cursor />

      <Header
        lang={lang}
        toggleHref={`/${otherLang}`}
        toggleLabel={otherLang.toUpperCase()}
        brandLabel={copy.brand.wordmark}
        nav={copy.nav}
      />

      <main>
        <Chapter01Threshold lang={lang} copy={copy.chapters.threshold} />
        <Chapter02Fingerprint lang={lang} copy={copy.chapters.fingerprint} />
        <Chapter03Loop lang={lang} copy={copy.chapters.loop} />
        <Chapter04Motion lang={lang} copy={copy.chapters.motion} />
        <Chapter05Kingdom lang={lang} copy={copy.chapters.kingdom} />
        <Chapter06Capabilities lang={lang} copy={copy.chapters.capabilities} />
        <Chapter07Proof lang={lang} copy={copy.chapters.proof} />
        <Chapter08Invitation lang={lang} copy={copy.chapters.invitation} bandLabel={copy.magentaBand} />
      </main>

      <Footer lang={lang} lines={copy.footer} />
    </>
  );
}
