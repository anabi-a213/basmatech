/**
 * Portfolio TourSpec — Site 2 (https://basmatech-portfolio.vercel.app/ar)
 *
 * 11 phases per BRIEF.md categories (Walls, Games, Kinetic, Screens,
 * Immersive, Operations):
 *   foyer + 9 projects + closing
 *
 * Phase 1 declares only the static shape. Phase 2 (Asset generation) fills
 * in the canonicalHeroByProject paths once nano-banana keyframes are
 * approved at GATE 2b.
 */

import type { Phase, TourSpec } from '@basmatech/ui';

const PROJECTS: Array<{
  phaseId: string;
  label: string;
  category: NonNullable<Phase['category']>;
  tint: Phase['tint'];
}> = [
  { phaseId: 'tour-01-hotel-jeddah',     label: 'Hotel Lobby Jeddah',          category: 'walls',      tint: 'sky' },
  { phaseId: 'tour-02-retail-riyadh',    label: 'Retail Flagship Riyadh',      category: 'walls',      tint: 'pink' },
  { phaseId: 'tour-03-arena-dammam',     label: 'Game Arena Dammam',           category: 'games',      tint: 'mint' },
  { phaseId: 'tour-04-stadium-riyadh',   label: 'Stadium Activation Riyadh',   category: 'games',      tint: 'lavender' },
  { phaseId: 'tour-05-atrium-riyadh',    label: 'Energy Atrium Riyadh',        category: 'kinetic',    tint: 'cream' },
  { phaseId: 'tour-06-cultural-alula',   label: 'AlUla Cultural Hall',         category: 'kinetic',    tint: 'magenta' },
  { phaseId: 'tour-07-plaza-riyadh',     label: 'Waterfront Screens Plaza',    category: 'screens',    tint: 'sky' },
  { phaseId: 'tour-08-immersive-riyadh', label: 'Immersive Launch Riyadh',     category: 'immersive',  tint: 'lavender' },
  { phaseId: 'tour-09-operations',       label: 'Operations Portfolio',        category: 'operations', tint: 'mint' },
];

export const portfolioSpec: TourSpec = {
  specId: 'portfolio',
  totalScroll: 0,
  canonicalHeroByProject: {
    'tour-foyer': '/assets/projects/tour-foyer/hero.jpg',
    ...Object.fromEntries(
      PROJECTS.map((p) => [p.phaseId, `/assets/projects/${p.phaseId}/hero.jpg`]),
    ),
    'tour-closing': '/assets/projects/tour-closing/hero.jpg',
  },
  phases: makePortfolioPhases(),
};

function makePortfolioPhases(): Phase[] {
  const foyer: Phase = {
    phaseId: 'tour-foyer',
    label: 'Foyer',
    folder: '/assets/projects/tour-foyer/walk',
    mobileFolder: '/assets/projects/tour-foyer/walk-mobile',
    startFrame: 0,
    endFrame: 120,
    scrollStart: 0,
    scrollEnd: 0,
    dwellAfter: 0,
    blendIn: 'cut',
    blendOut: 'wash',
    tint: 'cream',
    ease: 'power2.inOut',
  };

  // Phase 2 generates fresh walk frames into /assets/projects/{phaseId}/walk
  // and walk-mobile/ for each of the 9 projects.
  const projects: Phase[] = PROJECTS.map((p) => ({
    phaseId: p.phaseId,
    label: p.label,
    category: p.category,
    folder: `/assets/projects/${p.phaseId}/walk`,
    // Until Phase 5 derives 60-frame walk-mobile/, mobile shares desktop.
    mobileFolder: `/assets/projects/${p.phaseId}/walk`,
    startFrame: 0,
    endFrame: 120,
    scrollStart: 0,
    scrollEnd: 0,
    dwellAfter: 0,
    blendIn: 'wash',
    blendOut: 'wash',
    tint: p.tint,
    ease: 'power2.inOut',
  }));

  const closing: Phase = {
    phaseId: 'tour-closing',
    label: 'Closing',
    folder: '/assets/projects/tour-closing/walk',
    mobileFolder: '/assets/projects/tour-closing/walk-mobile',
    startFrame: 0,
    endFrame: 120,
    scrollStart: 0,
    scrollEnd: 0,
    dwellAfter: 0,
    blendIn: 'wash',
    blendOut: 'cut',
    tint: 'cream',
    ease: 'power2.inOut',
  };

  return [foyer, ...projects, closing];
}
