/**
 * buildMobile — Phase 2f. From every walk/ folder of 121 frames at
 * 1928x1072, derive a walk-mobile/ folder of 60 frames at 1280x720 q85.
 *
 * Frame index mapping: 0 -> 0, 1 -> 2, 2 -> 4, ..., 59 -> 118.
 * (We pick every other frame, plus the first and last.)
 *
 * After this runs, lockEndFrames.ts must be re-run with the mobile-resized
 * hero to lock those last 30 mobile frames the same way.
 *
 * Run: pnpm tsx pipeline/scripts/buildMobile.ts
 */

import { existsSync, readdirSync, statSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(__dirname, '..', '..');
const ASSETS_ROOT = join(ROOT, 'assets', 'projects');

interface SharpModule {
  default: (input: string | Buffer) => SharpInstance;
}
interface SharpInstance {
  resize: (w: number, h: number, opts?: object) => SharpInstance;
  webp: (opts: { quality: number }) => SharpInstance;
  toFile: (path: string) => Promise<unknown>;
}

async function loadSharp(): Promise<SharpModule['default']> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('sharp');
  } catch {
    throw new Error('sharp not installed. Run: pnpm add sharp -w');
  }
}

async function buildOne(phaseId: string): Promise<void> {
  const sharp = await loadSharp();
  const desktopFolder = join(ASSETS_ROOT, phaseId, 'walk');
  const mobileFolder = join(ASSETS_ROOT, phaseId, 'walk-mobile');
  if (!existsSync(desktopFolder)) {
    console.warn(`buildMobile: skip ${phaseId} (no desktop walk folder)`);
    return;
  }
  if (existsSync(mobileFolder)) rmSync(mobileFolder, { recursive: true, force: true });
  mkdirSync(mobileFolder, { recursive: true });

  for (let mobileIdx = 0; mobileIdx <= 59; mobileIdx++) {
    const desktopIdx = Math.min(120, mobileIdx === 59 ? 120 : mobileIdx * 2);
    const inFile = join(desktopFolder, `${String(desktopIdx).padStart(3, '0')}.webp`);
    if (!existsSync(inFile)) continue;
    const outFile = join(mobileFolder, `${String(mobileIdx).padStart(3, '0')}.webp`);
    await sharp(inFile)
      .resize(1280, 720, { fit: 'cover', position: 'center' })
      .webp({ quality: 85 })
      .toFile(outFile);
  }
  console.log(`buildMobile: ${phaseId} → 60 frames at 1280x720 q85`);
}

async function main() {
  const projects = readdirSync(ASSETS_ROOT).filter((p) => {
    return statSync(join(ASSETS_ROOT, p)).isDirectory()
      && existsSync(join(ASSETS_ROOT, p, 'walk'));
  });
  if (projects.length === 0) {
    console.error('buildMobile: no walk folders found.');
    process.exit(2);
  }
  for (const phaseId of projects) {
    await buildOne(phaseId);
  }
  console.log('buildMobile: done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
