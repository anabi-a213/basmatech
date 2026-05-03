'use client';

import { ScrollFrame } from '@basmatech/design-system';
import type { ChapterCopy } from '@basmatech/content';

export type Chapter04Props = {
  lang: 'ar' | 'en';
  copy: ChapterCopy;
};

const FRAME_COUNT = 121;
const FRAME_PATH = '/frames/seq4/frame-';

/**
 * Chapter 04 — In Motion.
 *
 * The wall awakens. User's cursor IS the wave epicenter. Mouse-driven
 * frame offset (cursorReactive). Uses seq4 frames.
 */
export function Chapter04Motion({ lang, copy }: Chapter04Props) {
  return (
    <ScrollFrame
      id="chapter-04"
      framePath={FRAME_PATH}
      frameCount={FRAME_COUNT}
      height="600vh"
      sectionBg="#0F1015"
      cursorReactive
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
