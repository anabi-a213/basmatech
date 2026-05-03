'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export type ParallaxLayerProps = {
  /** 0 = static, 1 = scrolls 1:1, 0.4 = lags 60% */
  depth?: number;
  /** range of translate Y (px) at extremes */
  range?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: ReactNode;
};

/**
 * Depth-based parallax layer. Wraps any child and offsets translate Y based
 * on the parent section scroll progress.
 */
export function ParallaxLayer({
  depth = 0.4,
  range = 80,
  className,
  style,
  children,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [range * (1 - depth), -range * (1 - depth)],
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, y: reduced ? 0 : y }}
    >
      {children}
    </motion.div>
  );
}
