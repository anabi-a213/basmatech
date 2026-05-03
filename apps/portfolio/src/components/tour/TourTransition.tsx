'use client';

import { useRef } from 'react';
import { FrameSequenceCanvas } from '@basmatech/design-system';

export type TourTransitionProps = {
  /** Transition id matching the frame folder, e.g. "01-02" for transition between project 01 and 02. */
  id: string;
  /** Frame count (default 121 — one Kling 2.1 5s video at 24fps). */
  frameCount?: number;
};

/**
 * Cross-project transition. 180vh tall section with a sticky 100vh canvas
 * that plays a unique frame sequence morphing project N's alive end-state
 * into project N+1's empty start-state — through a soft pastel haze.
 *
 * Frames live at /frames/transition-NN-NN/frame-NNN.webp.
 *
 * The frame scrub completes at +=100vh so the final frame (N+1's empty room
 * about to wake up) holds for 80vh of dwell time before the next project
 * section pins, creating a seamless visual handoff.
 */
export function TourTransition({ id, frameCount = 121 }: TourTransitionProps) {
  const ref = useRef<HTMLElement>(null);
  return (
    <section className="tour-transition" ref={ref} aria-hidden id={`transition-${id}`}>
      <div className="tour-transition__sticky">
        <FrameSequenceCanvas
          framePath={`/frames/transition-${id}/frame-`}
          frameCount={frameCount}
          triggerRef={ref}
          ext="webp"
          bg="#0F1020"
          /* 1:1 scrub — transition tracks scroll exactly so no lag */
          scrub={0.2}
          /* Section is 140vh. Sticky pins for 40vh.
             Frame scrub plays through all 121 frames during the first 100vh
             of section scroll, then the last frame holds for 40vh which
             dovetails into the next project's first frame. */
          scrollEnd="+=100%"
        />
      </div>
    </section>
  );
}
