'use client';

import { motion, useReducedMotion } from 'framer-motion';

export type LiquidMarkProps = {
  size?: number;
  /** when true, the layers gently float */
  animate?: boolean;
  className?: string;
  ariaLabel?: string;
};

/**
 * Basma Tech liquid stacked-layer mark. Three translucent organic shapes
 * (mint / azure / pink), the signature visual.
 *
 * The fingerprint metaphor lives in the layered structure: each layer slightly
 * different, every angle a new color.
 */
export function LiquidMark({
  size = 56,
  animate = true,
  className,
  ariaLabel = 'Basma Tech',
}: LiquidMarkProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimate = animate && !reducedMotion;

  // organic blob path (shared by all 3 layers, transformed)
  const path =
    'M -55 -8 Q -42 -28, -10 -32 Q 22 -32, 50 -12 Q 38 -22, 8 -24 Q -22 -24, -48 -8 Z';

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      viewBox="0 0 256 256"
      width={size}
      height={size}
      className={className}
    >
      <defs>
        <linearGradient id="liquid-mint-mark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8E5C5" />
          <stop offset="100%" stopColor="#5FE99A" />
        </linearGradient>
        <linearGradient id="liquid-azure-mark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B5D5EE" />
          <stop offset="100%" stopColor="#5FA9F0" />
        </linearGradient>
        <linearGradient id="liquid-pink-mark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EFD3DD" />
          <stop offset="100%" stopColor="#FF5A9E" />
        </linearGradient>
      </defs>
      <g transform="translate(128, 128) scale(2.0)">
        <motion.path
          d={path}
          fill="url(#liquid-mint-mark)"
          opacity={0.92}
          initial={{ y: -26 }}
          animate={shouldAnimate ? { y: [-26, -29, -26] } : { y: -26 }}
          transition={{
            duration: 4,
            repeat: shouldAnimate ? Infinity : 0,
            ease: 'easeInOut',
          }}
        />
        <motion.path
          d={path}
          fill="url(#liquid-azure-mark)"
          opacity={0.92}
          initial={{ y: 0 }}
          animate={shouldAnimate ? { y: [0, 2, 0] } : { y: 0 }}
          transition={{
            duration: 4.4,
            repeat: shouldAnimate ? Infinity : 0,
            ease: 'easeInOut',
            delay: 0.2,
          }}
        />
        <motion.path
          d={path}
          fill="url(#liquid-pink-mark)"
          opacity={0.92}
          initial={{ y: 26 }}
          animate={shouldAnimate ? { y: [26, 29, 26] } : { y: 26 }}
          transition={{
            duration: 4.8,
            repeat: shouldAnimate ? Infinity : 0,
            ease: 'easeInOut',
            delay: 0.4,
          }}
        />
      </g>
    </svg>
  );
}
