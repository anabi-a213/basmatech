// Motion easings — mirrors --ease-* CSS variables. Use these for GSAP/Framer.
// Source: tokens.css (cubic-bezier values).

export const easings = {
  out: [0.22, 1, 0.36, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  inOut: [0.65, 0, 0.35, 1] as const,
  bounce: [0.34, 1.56, 0.64, 1] as const,
} as const;

export const easingsCSS = {
  out: 'cubic-bezier(0.22, 1, 0.36, 1)',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  inOut: 'cubic-bezier(0.65, 0, 0.35, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// GSAP custom-ease compatible strings (e.g. 'power2.out' fallbacks)
export const easingsGSAP = {
  out: 'power2.out',
  in: 'power2.in',
  inOut: 'power2.inOut',
  bounce: 'back.out(1.7)',
} as const;
