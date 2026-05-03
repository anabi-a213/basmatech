/**
 * Homepage TourSpec — Site 1 (https://basmatech-main.vercel.app/ar)
 *
 * Eight chapter phases per BRIEF.md:
 *   01 Threshold       Dark room + magenta point of light
 *   02 Imprint         Spark crystallises into a hex tile
 *   03 Workshop        Components → assembled module
 *   04 Motion          Wall awakens (cursor-reactive)
 *   05 Kingdom         Saudi peninsula at twilight + 6 beacons
 *   06 Capabilities    6 facets of the brand
 *   07 Proof           3 case studies bridging into Site 2
 *   08 Invitation      Pastel field + CTA + magenta band
 *
 * scrollStart / scrollEnd / totalScroll are computed at runtime by the
 * TourCanvas from cumulative phase heights expressed in viewport heights.
 * The static spec only declares the shape, easing, tint, and folder paths.
 */

import type { Phase, TourSpec } from '@basmatech/ui';

export const homeSpec: TourSpec = {
  specId: 'home',
  totalScroll: 0,
  canonicalHeroByProject: {
    'home-c1-threshold': '/assets/projects/home-c1-threshold/hero.jpg',
    'home-c2-imprint': '/assets/projects/home-c2-imprint/hero.jpg',
    'home-c3-workshop': '/assets/projects/home-c3-workshop/hero.jpg',
    'home-c4-motion': '/assets/projects/home-c4-motion/hero.jpg',
    'home-c5-kingdom': '/assets/projects/home-c5-kingdom/hero.jpg',
    'home-c6-capabilities': '/assets/projects/home-c6-capabilities/hero.jpg',
    'home-c7-proof': '/assets/projects/home-c7-proof/hero.jpg',
    'home-c8-invitation': '/assets/projects/home-c8-invitation/hero.jpg',
  },
  phases: makeHomePhases(),
};

function makeHomePhases(): Phase[] {
  const tints: Phase['tint'][] = [
    'magenta',  // 01 Threshold — single magenta point of light against dark
    'cream',    // 02 Imprint — pastel field, the tile crystallises
    'sky',      // 03 Workshop — neutral workshop tone
    'mint',     // 04 Motion — kinetic wall awakens
    'lavender', // 05 Kingdom — twilight + magenta beacons
    'pink',     // 06 Capabilities — soft pastel tile rotation
    'magenta',  // 07 Proof — magenta accent strip per case
    'cream',    // 08 Invitation — pastel field closing
  ];
  const labels = [
    'Threshold',
    'Imprint',
    'Workshop',
    'Motion',
    'Kingdom',
    'Capabilities',
    'Proof',
    'Invitation',
  ];
  const cursorReactive = [false, false, false, true, false, false, false, false];

  // Existing chapter frames live at /frames/chapter-NN/. Map phases 02..05
  // to those folders. Phases 01, 06, 07, 08 don't have frame sequences;
  // they render as text overlays on a tinted gradient.
  const folderByIndex: (string | null)[] = [
    null,             // 01 Threshold — IgniteOverlay-style splash, no frames
    '/frames/chapter-02',
    '/frames/chapter-03',
    '/frames/chapter-04',
    '/frames/chapter-05',
    null,             // 06 Capabilities — rotating SVG hex, no frames
    null,             // 07 Proof — sticky case scenes, no frames
    null,             // 08 Invitation — closing pastel, no frames
  ];

  return labels.map((label, i) => {
    const idx = String(i + 1).padStart(2, '0');
    const phaseId = `home-c${i + 1}-${label.toLowerCase()}`;
    const f = folderByIndex[i] ?? `/assets/projects/${phaseId}/walk`;
    return {
      phaseId,
      label: `Chapter ${idx} — ${label}`,
      folder: f,
      mobileFolder: f, // share same frames on mobile until walk-mobile/ exists
      startFrame: 0,
      endFrame: 120,
      scrollStart: 0,
      scrollEnd: 0,
      dwellAfter: 0,
      blendIn: i === 0 ? 'cut' : 'wash',
      blendOut: i === labels.length - 1 ? 'cut' : 'wash',
      tint: tints[i],
      ease: 'power2.inOut',
      cursorReactive: cursorReactive[i],
    };
  });
}
