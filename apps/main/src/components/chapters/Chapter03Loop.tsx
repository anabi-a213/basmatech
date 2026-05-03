'use client';

import { ScrollFrame } from '@basmatech/design-system';
import type { ChapterCopy } from '@basmatech/content';

export type Chapter03Props = {
  lang: 'ar' | 'en';
  copy: ChapterCopy;
};

const FRAME_COUNT = 121;
const FRAME_PATH = '/frames/chapter-03/frame-';

/**
 * Chapter 03 — The Loop.
 *
 * One tile, blueprint, components, module, wall. The full manufacturing
 * journey, no team faces. Uses seq3 frames.
 */
export function Chapter03Loop({ lang, copy }: Chapter03Props) {
  return (
    <ScrollFrame
      id="chapter-03"
      framePath={FRAME_PATH}
      frameCount={FRAME_COUNT}
      height="500vh"
      sectionBg="#1A1B2C"
    >
      <div className="chapter-overlay__inner">
        <div className="chapter-eyebrow">{copy.eyebrow}</div>
        {lang === 'ar' ? (
          <h2 className="chapter-headline-ar">{copy.headline}</h2>
        ) : (
          <h2 className="chapter-headline-en">{copy.headline}</h2>
        )}
        <p className="chapter-sub">{copy.subhead}</p>
        {copy.body && <p className="chapter-body">{copy.body}</p>}
      </div>
    </ScrollFrame>
  );
}
