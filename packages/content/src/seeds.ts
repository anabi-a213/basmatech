/**
 * Per-project nano-banana seeds. Locked once and persisted so every
 * keyframe regenerated for a project preserves identity (camera, materials,
 * lighting). When a hero is regenerated, all subsequent frames for that
 * project must pass the hero JPG as a reference image to nano-banana.
 *
 * Seed numbers are arbitrary integers chosen at first generation. Do NOT
 * change them after Phase 2b ("keyframes approved") without explicit
 * human authorisation, since changing the seed re-rolls the whole project.
 */

export const seeds = {
  // Homepage chapters (Site 1)
  'home-c1-threshold': 1011,
  'home-c2-imprint': 1022,
  'home-c3-workshop': 1033,
  'home-c4-motion': 1044,
  'home-c5-kingdom': 1055,
  'home-c6-capabilities': 1066,
  'home-c7-proof': 1077,
  'home-c8-invitation': 1088,

  // Portfolio projects (Site 2)
  'tour-foyer': 2000,
  'tour-01-hotel-jeddah': 2010,
  'tour-02-retail-riyadh': 2020,
  'tour-03-arena-dammam': 2030,
  'tour-04-stadium-riyadh': 2040,
  'tour-05-atrium-riyadh': 2050,
  'tour-06-cultural-alula': 2060,
  'tour-07-plaza-riyadh': 2070,
  'tour-08-immersive-riyadh': 2080,
  'tour-09-operations': 2090,
  'tour-closing': 2100,

  // Cross-project bridge frames (Site 2 transitions)
  'bridge-01-02': 3012,
  'bridge-02-03': 3023,
  'bridge-03-04': 3034,
  'bridge-04-05': 3045,
  'bridge-05-06': 3056,
  'bridge-06-07': 3067,
  'bridge-07-08': 3078,
  'bridge-08-09': 3089,
  'bridge-09-closing': 3091,
} as const;

export type SeedKey = keyof typeof seeds;
