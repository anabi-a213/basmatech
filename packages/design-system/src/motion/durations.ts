// Motion durations — mirrors --dur-* CSS variables.
// Use as numbers (ms) for Framer/GSAP, or convert to seconds via /1000.

export const durations = {
  micro: 80,
  short: 200,
  medium: 400,
  long: 800,
} as const;

export const durationsSec = {
  micro: 0.08,
  short: 0.2,
  medium: 0.4,
  long: 0.8,
} as const;
