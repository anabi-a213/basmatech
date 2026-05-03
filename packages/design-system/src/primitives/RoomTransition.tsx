'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export type RoomTransitionProps = {
  /** CSS color value (e.g. 'var(--field-mint)') for the leaving room */
  fromColor: string;
  /** CSS color value for the entering room */
  toColor: string;
  /** Length of the transition in vh */
  height?: string;
  /** Direction: 'forward' walks user into the next room; 'reverse' is a step back */
  enterDirection?: 'forward' | 'reverse';
  children?: ReactNode;
};

/**
 * Walk-in/walk-out 3D corridor (CSS-only first; can swap to R3F later).
 *
 * Renders a sticky color field that morphs from from→to as the user scrolls.
 * Suggests forward depth via converging perspective lines.
 */
export function RoomTransition({
  fromColor,
  toColor,
  height = '120vh',
  enterDirection = 'forward',
  children,
}: RoomTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const bg = useTransform(scrollYProgress, [0, 1], [fromColor, toColor]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.04, 1]);
  const lineOpacity = useTransform(scrollYProgress, [0, 0.4, 0.6, 1], [0, 0.6, 0.6, 0]);

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        height,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: bg,
            scale,
          }}
        />
        {/* Perspective lines suggesting depth */}
        <motion.svg
          style={{
            position: 'absolute',
            inset: 0,
            opacity: lineOpacity,
            pointerEvents: 'none',
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          {/* Floor lines converging to vanishing point */}
          {[20, 35, 50, 65, 80].map((x) => (
            <line
              key={x}
              x1={x}
              y1="100"
              x2="50"
              y2="50"
              stroke="rgba(20,21,43,0.15)"
              strokeWidth="0.15"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {/* Ceiling lines */}
          {[20, 35, 50, 65, 80].map((x) => (
            <line
              key={`c-${x}`}
              x1={x}
              y1="0"
              x2="50"
              y2="50"
              stroke="rgba(20,21,43,0.10)"
              strokeWidth="0.15"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </motion.svg>
        {children && (
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
