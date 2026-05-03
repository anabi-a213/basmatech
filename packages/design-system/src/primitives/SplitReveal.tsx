'use client';

import { useRef, useState, type ReactNode } from 'react';

export type SplitRevealProps = {
  /** Left half content (e.g. "without Basma Tech") */
  before: ReactNode;
  /** Right half content (e.g. "with Basma Tech") */
  after: ReactNode;
  /** Initial slider position 0..100 */
  initial?: number;
  /** Optional aria-label for the slider */
  ariaLabel?: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * With/without contrast slider. Vertical drag bar reveals the underlying
 * "after" image as it moves right.
 */
export function SplitReveal({
  before,
  after,
  initial = 50,
  ariaLabel = 'Reveal slider',
  className,
  style,
}: SplitRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(initial);
  const dragging = useRef(false);

  function setFromClientX(clientX: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, next)));
  }

  function onPointerDown(e: React.PointerEvent) {
    dragging.current = true;
    (e.target as Element).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragging.current) return;
    setFromClientX(e.clientX);
  }
  function onPointerUp() {
    dragging.current = false;
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      setPos((p) => Math.max(0, p - 4));
      e.preventDefault();
    }
    if (e.key === 'ArrowRight') {
      setPos((p) => Math.min(100, p + 4));
      e.preventDefault();
    }
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 9',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        userSelect: 'none',
        cursor: 'col-resize',
        ...style,
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {/* Before — fills entire frame */}
      <div style={{ position: 'absolute', inset: 0 }}>{before}</div>
      {/* After — clipped from left to slider position */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          clipPath: `inset(0 0 0 ${pos}%)`,
        }}
      >
        {after}
      </div>
      {/* Slider line + handle */}
      <div
        role="slider"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKeyDown}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: `${pos}%`,
          width: 2,
          background: 'var(--magenta)',
          transform: 'translateX(-50%)',
          cursor: 'col-resize',
          outline: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: 'var(--magenta)',
            boxShadow: '0 8px 24px rgba(199,61,126,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            fontSize: 18,
          }}
        >
          ⇆
        </div>
      </div>
    </div>
  );
}
