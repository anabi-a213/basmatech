'use client';

import { ScrollFrame } from '@basmatech/design-system';
import type { ChapterCopy } from '@basmatech/content';

export type Chapter02Props = {
  lang: 'ar' | 'en';
  copy: ChapterCopy;
};

const FRAME_COUNT = 121;
const FRAME_PATH = '/frames/seq1/frame-';

/**
 * Chapter 02 — The Fingerprint.
 *
 * Genesis sequence: a hex tile unfolds into the brand mark.
 * Pinned scroll plays the seq1 frames.
 */
export function Chapter02Fingerprint({ lang, copy }: Chapter02Props) {
  return (
    <ScrollFrame
      id="chapter-02"
      framePath={FRAME_PATH}
      frameCount={FRAME_COUNT}
      height="500vh"
      sectionBg="#0F1015"
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
