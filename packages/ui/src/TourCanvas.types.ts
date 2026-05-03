/**
 * Phase table types. ONE TourSpec drives ONE TourCanvas. No per-section
 * canvases. The TourCanvas reads its current scrollY, finds the active
 * phase, looks up the in-phase frame index, and draws.
 *
 * Adjacent phase tints crossfade in the last 20% of phase[i] and the
 * first 20% of phase[i+1] via TintWash (mix-blend-mode: soft-light).
 */

export type Tint =
  | 'mint'
  | 'sky'
  | 'lavender'
  | 'pink'
  | 'magenta'
  | 'cream';

/** A single phase in the tour. */
export interface Phase {
  /** Stable id for the phase. e.g. "home-c4-motion", "tour-03-arena-dammam". */
  phaseId: string;
  /** Human-readable label for diagnostics + dev ribbon. */
  label: string;
  /** Service category from BRIEF.md (portfolio only). undefined for foyer/closing. */
  category?: 'walls' | 'games' | 'kinetic' | 'screens' | 'immersive' | 'operations';
  /** Desktop folder root. Frame 0 lives at `${folder}/000.webp`. */
  folder: string;
  /** Mobile-resolution folder root, 60 frames at 1280x720. */
  mobileFolder: string;
  /** First frame index, always 0. */
  startFrame: number;
  /** Last frame index — 120 desktop, 59 mobile. The TourCanvas resolves
   *  the right value per device at runtime. */
  endFrame: number;
  /** Scroll position in CSS px where this phase becomes active.
   *  Computed at runtime from cumulative section heights. */
  scrollStart: number;
  /** Scroll position where this phase ends. (scrollEnd - scrollStart)
   *  must equal exactly 200vh for every walk phase. */
  scrollEnd: number;
  /** Additional dwell after scrollEnd where the canvas keeps drawing the
   *  end frame. Always 100vh for walk phases. */
  dwellAfter: number;
  /** Cut into the next phase, or wash via TintWash. */
  blendIn: 'cut' | 'wash';
  blendOut: 'cut' | 'wash';
  /** Tint key for this phase. The TintWash interpolates between adjacent
   *  phases' tints during the wash window. */
  tint: Tint;
  /** Easing function applied to raw scroll progress before frame lookup.
   *  'none' = linear. 'power2.inOut' = the cinematic default. */
  ease: 'none' | 'power2.inOut';
  /** Optional cursor reactivity. When true (homepage chapter 04), mouse X
   *  applies a frame offset on top of the scroll-driven frame. */
  cursorReactive?: boolean;
}

export interface TourSpec {
  /** Spec id, used for canonical hero lookup + diagnostics. */
  specId: 'home' | 'portfolio';
  /** Ordered list of phases. */
  phases: Phase[];
  /** Cumulative scroll height in CSS px. Computed at runtime. */
  totalScroll: number;
  /** phaseId → canonical hero asset path (the foundation image). */
  canonicalHeroByProject: Record<string, string>;
}
