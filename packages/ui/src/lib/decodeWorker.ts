'use client';

/**
 * Off-main-thread image decoding. createImageBitmap is fast and runs off
 * the main thread by default. We wrap it in a thin Worker so the
 * decode AND the URL fetch don't block the scroll handler.
 *
 * Fallback path: if OffscreenCanvas / Worker / createImageBitmap is
 * missing, we use the main-thread <img>.decode() path. The TourCanvas
 * always sees the same Promise<ImageBitmap | HTMLImageElement> contract.
 */

type DecodeResult = ImageBitmap | HTMLImageElement;

function supportsWorker(): boolean {
  if (typeof window === 'undefined') return false;
  return typeof Worker !== 'undefined' && 'createImageBitmap' in window;
}

let workerInstance: Worker | null = null;
let nextTicket = 0;
const pending = new Map<number, (r: ImageBitmap) => void>();
const errors = new Map<number, (e: Error) => void>();

function getWorker(): Worker | null {
  if (!supportsWorker()) return null;
  if (workerInstance) return workerInstance;
  // Inline worker source; avoids bundler config for a tiny worker.
  const src = `
    self.onmessage = async function(e) {
      const { ticket, url } = e.data;
      try {
        const res = await fetch(url, { cache: 'force-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const blob = await res.blob();
        const bitmap = await createImageBitmap(blob);
        self.postMessage({ ticket, bitmap }, [bitmap]);
      } catch (err) {
        self.postMessage({ ticket, error: String(err) });
      }
    };
  `;
  const blob = new Blob([src], { type: 'application/javascript' });
  workerInstance = new Worker(URL.createObjectURL(blob));
  workerInstance.onmessage = (e: MessageEvent<{ ticket: number; bitmap?: ImageBitmap; error?: string }>) => {
    const { ticket, bitmap, error } = e.data;
    if (error) {
      errors.get(ticket)?.(new Error(error));
    } else if (bitmap) {
      pending.get(ticket)?.(bitmap);
    }
    pending.delete(ticket);
    errors.delete(ticket);
  };
  return workerInstance;
}

function decodeViaWorker(url: string): Promise<ImageBitmap> {
  return new Promise((resolve, reject) => {
    const w = getWorker();
    if (!w) {
      reject(new Error('worker unavailable'));
      return;
    }
    const ticket = nextTicket++;
    pending.set(ticket, resolve);
    errors.set(ticket, reject);
    w.postMessage({ ticket, url });
  });
}

function decodeViaImg(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed to load ${url}`));
    img.src = url;
  });
}

export async function decodeFrame(url: string): Promise<DecodeResult> {
  if (supportsWorker()) {
    try {
      return await decodeViaWorker(url);
    } catch {
      // fall through
    }
  }
  return decodeViaImg(url);
}
