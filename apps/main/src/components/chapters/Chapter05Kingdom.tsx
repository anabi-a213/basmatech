'use client';

import type { ChapterCopy } from '@basmatech/content';
import { KingdomMap } from './KingdomMap';

export type Chapter05Props = {
  lang: 'ar' | 'en';
  copy: ChapterCopy;
};

/**
 * Chapter 05 — The Kingdom.
 * Stylized Saudi map with 6 city beacons connected by magenta lines —
 * the network we serve, drawn live as you scroll into the section.
 */
export function Chapter05Kingdom({ lang, copy }: Chapter05Props) {
  return (
    <section
      id="chapter-05"
      className="section-pad"
      style={{
        background: 'linear-gradient(180deg, #1A1B2C 0%, #14152B 60%, #0F1020 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="container-wide" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 24px' }}>
          <p
            className="section-eyebrow"
            style={{ color: 'rgba(245, 245, 248, 0.7)', justifyContent: 'center' }}
          >
            {copy.eyebrow}
          </p>
          {lang === 'ar' ? (
            <h2 className="chapter-headline-ar">{copy.headline}</h2>
          ) : (
            <h2 className="chapter-headline-en">{copy.headline}</h2>
          )}
          <p className="chapter-sub">{copy.subhead}</p>
          {copy.body && <p className="chapter-body">{copy.body}</p>}
        </div>
        <KingdomMap lang={lang} />
      </div>

      {/* Soft pastel washes for atmosphere */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse at 25% 25%, rgba(95, 169, 240, 0.10) 0%, transparent 55%), radial-gradient(ellipse at 75% 75%, rgba(255, 90, 158, 0.08) 0%, transparent 55%)',
          pointerEvents: 'none',
        }}
      />
    </section>
  );
}
