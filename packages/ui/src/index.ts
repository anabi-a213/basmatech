// @basmatech/ui — public surface for the new TourCanvas architecture.
// Phase 1 scaffolding only. Components render flat color until Phase 2
// supplies generated frames.

export { TourCanvas } from './TourCanvas';
export type { TourCanvasProps } from './TourCanvas';
export type { Phase, TourSpec, Tint } from './TourCanvas.types';

export { TintWash } from './TintWash';
export type { TintWashProps } from './TintWash';

export { Pathfinder } from './Pathfinder';
export type { PathfinderProps } from './Pathfinder';

export { PhaseOverlay } from './PhaseOverlay';
export type { PhaseOverlayProps } from './PhaseOverlay';

export { applyEase, power2InOut, noEase } from './lib/easing';
export type { EaseName } from './lib/easing';

export {
  isClient,
  isIOS,
  isTouchPrimary,
  isMobileViewport,
  prefersReducedMotion,
  shouldUseLenis,
} from './lib/device';

export { decodeFrame } from './lib/decodeWorker';

export {
  frameUrl,
  getCachedFrame,
  preloadWindow,
  preloadNextPhase,
  clearCache,
} from './lib/preload';
