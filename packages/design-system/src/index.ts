// @basmatech/design-system — public surface

// Components
export { LiquidMark } from './components/LiquidMark';
export type { LiquidMarkProps } from './components/LiquidMark';

export { MagentaBand } from './components/MagentaBand';
export type { MagentaBandProps } from './components/MagentaBand';

export { IgniteOverlay } from './components/IgniteOverlay';
export type { IgniteOverlayProps } from './components/IgniteOverlay';

export { Cursor } from './components/Cursor';
export { Header } from './components/Header';
export type { HeaderProps } from './components/Header';
export { Footer } from './components/Footer';
export type { FooterProps } from './components/Footer';

// Primitives
export { ScrollFrame } from './primitives/ScrollFrame';
export type { ScrollFrameProps } from './primitives/ScrollFrame';

export { FrameSequenceCanvas } from './primitives/FrameSequenceCanvas';
export type { FrameSequenceCanvasProps } from './primitives/FrameSequenceCanvas';

export { RoomTransition } from './primitives/RoomTransition';
export type { RoomTransitionProps } from './primitives/RoomTransition';

export { ParallaxLayer } from './primitives/ParallaxLayer';
export type { ParallaxLayerProps } from './primitives/ParallaxLayer';

export { SplitReveal } from './primitives/SplitReveal';
export type { SplitRevealProps } from './primitives/SplitReveal';

export { BilingualText } from './primitives/BilingualText';
export type { BilingualTextProps } from './primitives/BilingualText';

// Motion
export { easings, easingsCSS, easingsGSAP } from './motion/easings';
export { durations, durationsSec } from './motion/durations';
export { createRevealStagger, createScrollPin } from './motion/timelines';

// Hooks
export { useLenis } from './hooks/useLenis';
export { useGSAPContext, gsap, ScrollTrigger } from './hooks/useGSAPContext';
export { useScrollTriggerRefresh } from './hooks/useScrollTrigger';
export { useCursorMode } from './hooks/useCursorMode';
export type { CursorMode } from './hooks/useCursorMode';
