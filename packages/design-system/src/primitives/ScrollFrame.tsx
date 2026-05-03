'use client';

import { forwardRef, useRef, useImperativeHandle, type ReactNode } from 'react';
import { FrameSequenceCanvas } from './FrameSequenceCanvas';

export type ScrollFrameProps = {
  /** Path prefix to frames (e.g. /frames/seq2/frame-) */
  framePath: string;
  /** Number of frames in the sequence */
  frameCount: number;
  /** Total scrollable height the chapter occupies (e.g. '500vh') */
  height?: string;
  /** Cursor reactivity for chapter 04 */
  cursorReactive?: boolean;
  /** Children rendered inside the sticky overlay (text, eyebrow, etc.) */
  children?: ReactNode;
  /** Optional className on the wrapping section */
  className?: string;
  /** id used for ScrollTrigger and intersection observers */
  id?: string;
  /** Background color for letterbox (when image aspect doesn't fill) */
  bg?: string;
  /** Section background outside the sticky pin */
  sectionBg?: string;
  /** Optional progress callback */
  onProgress?: (progress: number) => void;
};

/**
 * A pinned, scroll-driven frame chapter.
 *
 * Layout: a tall <section> with a sticky child that holds the canvas + overlay.
 */
export const ScrollFrame = forwardRef<HTMLElement, ScrollFrameProps>(function ScrollFrame(
  {
    framePath,
    frameCount,
    height = '500vh',
    cursorReactive = false,
    children,
    className,
    id,
    bg = '#0F1015',
    sectionBg,
    onProgress,
  },
  forwardedRef,
) {
  const innerRef = useRef<HTMLElement>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current as HTMLElement);

  return (
    <section
      ref={innerRef}
      id={id}
      className={`scroll-frame ${className ?? ''}`}
      style={{ position: 'relative', height, background: sectionBg }}
    >
      <div className="scroll-frame__sticky">
        <FrameSequenceCanvas
          framePath={framePath}
          frameCount={frameCount}
          triggerRef={innerRef}
          cursorReactive={cursorReactive}
          bg={bg}
          onProgress={onProgress}
        />
        {children && <div className="chapter-overlay">{children}</div>}
      </div>
    </section>
  );
});
