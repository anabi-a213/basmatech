'use client';

import type { Phase } from '../TourCanvas.types';
import { decodeFrame } from './decodeWorker';

/**
 * Sliding-window cache. Holds decoded frames for currentFrame ± 12 in the
 * active phase, plus the first 30 frames of the next phase, and the last
 * 30 of the previous (for backward scrub). LRU eviction beyond.
 *
 * Pre-decode trigger: when the active phase's progress > 0.7, kick off
 * decode of the next phase's first 30 frames.
 *
 * The cache key is the absolute URL. URLs match exactly what TourCanvas
 * resolves at runtime (with the device-aware resolution suffix).
 */

type Decoded = ImageBitmap | HTMLImageElement;

const cache = new Map<string, Decoded>();
const inflight = new Map<string, Promise<Decoded>>();
const MAX_ENTRIES = 200;

export function frameUrl(phase: Phase, isMobile: boolean, frameIndex: number): string {
  const folder = isMobile ? phase.mobileFolder : phase.folder;
  const idx = String(frameIndex).padStart(3, '0');
  return `${folder}/${idx}.webp`;
}

export function getCachedFrame(url: string): Decoded | undefined {
  const v = cache.get(url);
  if (v) {
    // touch to move to end of insertion order (LRU bump)
    cache.delete(url);
    cache.set(url, v);
  }
  return v;
}

async function fetchAndCache(url: string): Promise<Decoded> {
  const existing = inflight.get(url);
  if (existing) return existing;
  const p = decodeFrame(url).then((bitmap) => {
    cache.set(url, bitmap);
    inflight.delete(url);
    evictIfOverCap();
    return bitmap;
  });
  inflight.set(url, p);
  return p;
}

function evictIfOverCap(): void {
  while (cache.size > MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (!oldest) break;
    const v = cache.get(oldest);
    cache.delete(oldest);
    if (v && 'close' in v && typeof (v as ImageBitmap).close === 'function') {
      try { (v as ImageBitmap).close(); } catch { /* noop */ }
    }
  }
}

/** Pre-warm the window around currentFrame in the active phase. */
export async function preloadWindow(
  phase: Phase,
  isMobile: boolean,
  currentFrame: number,
  radius = 12,
): Promise<void> {
  const max = isMobile ? 59 : 120;
  const start = Math.max(0, currentFrame - radius);
  const end = Math.min(max, currentFrame + radius);
  const tasks: Promise<unknown>[] = [];
  for (let i = start; i <= end; i++) {
    const url = frameUrl(phase, isMobile, i);
    if (!cache.has(url) && !inflight.has(url)) {
      tasks.push(fetchAndCache(url).catch(() => undefined));
    }
  }
  await Promise.allSettled(tasks);
}

/** Pre-decode the next phase's first frames so the handoff is seamless. */
export async function preloadNextPhase(
  nextPhase: Phase,
  isMobile: boolean,
  count = 30,
): Promise<void> {
  const tasks: Promise<unknown>[] = [];
  for (let i = 0; i < count; i++) {
    const url = frameUrl(nextPhase, isMobile, i);
    if (!cache.has(url) && !inflight.has(url)) {
      tasks.push(fetchAndCache(url).catch(() => undefined));
    }
  }
  await Promise.allSettled(tasks);
}

export function clearCache(): void {
  for (const v of cache.values()) {
    if (v && 'close' in v && typeof (v as ImageBitmap).close === 'function') {
      try { (v as ImageBitmap).close(); } catch { /* noop */ }
    }
  }
  cache.clear();
  inflight.clear();
}
