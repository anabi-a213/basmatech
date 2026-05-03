'use client';

import { useRef } from 'react';
import { FrameSequenceCanvas } from '@basmatech/design-system';
import type { CorridorTint } from '@basmatech/content';

export type TourCorridorProps = {
  /** Pastel tint for this transition (varies per project to avoid sameness) */
  tint: CorridorTint;
  /** Caption text that appears at the bottom (e.g. "the walk continues") */
  caption: string;
  /** Frame asset folder (default `/frames/corridor/`) */
  frameFolder?: string;
  /** Frame count (default 121) */
  frameCount?: number;
};

/**
 * Scroll-locked corridor walk between two project rooms. 180vh tall section
 * with a sticky 100vh canvas. As the visitor scrolls, the corridor frames
 * advance from frame 0 (entry) to frame 120 (doors open).
 *
 * A pastel mix-blend overlay tints the whole corridor a different hue per
 * transition so two consecutive corridors never feel identical.
 */
export function TourCorridor({
  tint,
  caption,
  frameFolder = '/frames/corridor/',
  frameCount = 121,
}: TourCorridorProps) {
  const ref = useRef<HTMLElement>(null);
  return (
    <section className="tour-corridor" ref={ref} aria-hidden>
      <div className="tour-corridor__sticky">
        <FrameSequenceCanvas
          framePath={frameFolder + 'frame-'}
          frameCount={frameCount}
          triggerRef={ref}
          ext="webp"
          bg="#0F1020"
          scrub={0.4}
          /* Corridor section is 220vh, sticky pins for 120vh.
             Frame scrub completes at +=100vh, leaving 20vh of dwell on
             the doors-open final frame before the visitor enters the
             next project room. */
          scrollEnd="+=100%"
        />
        <div className={`tour-corridor__tint tour-corridor__tint--${tint}`} />
        <span className="tour-corridor__caption">{caption}</span>
      </div>
    </section>
  );
}
