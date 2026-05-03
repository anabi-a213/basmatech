/**
 * lockEndFrames — Phase 2e. Overwrites the last 30 frames of every walk
 * folder with an alpha-ramp blend toward the canonical hero. Frame 120
 * == hero exactly. Frames 91..119 are linear blends.
 *
 * GUARANTEE: the dwell window of every walk shows the canonical hero,
 * regardless of how Kling drifted from the input tail_image_url.
 *
 * Uses sharp (npm install sharp). Per-frame work:
 *   alpha = (i - 90) / 30   for i in 91..120
 *   composite = original[i] * (1 - alpha) + hero * alpha
 *   write composite at q90
 *
 * Run: pnpm tsx pipeline/scripts/lockEndFrames.ts [phaseId] [--target=path]
 *      target overrides the canonical hero for projects that need a
 *      different end state (rare).
 */

import { existsSync, readdirSync, statSync, appendFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

const ROOT = resolve(__dirname, '..', '..');
const ASSETS_ROOT = join(ROOT, 'assets', 'projects');
const LOCKS_FILE = join(ROOT, 'pipeline', 'locks.jsonl');

interface SharpModule {
  default: (input: string | Buffer) => SharpInstance;
}
interface SharpInstance {
  resize: (w: number, h: number, opts?: object) => SharpInstance;
  composite: (overlays: Array<{ input: Buffer; blend?: string }>) => SharpInstance;
  ensureAlpha: (alpha?: number) => SharpInstance;
  webp: (opts: { quality: number }) => SharpInstance;
  toBuffer: () => Promise<Buffer>;
  toFile: (path: string) => Promise<unknown>;
}

async function loadSharp(): Promise<SharpModule['default']> {
  // sharp is added in Phase 2 setup; if missing now, fail with a clear msg.
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('sharp');
  } catch {
    throw new Error('sharp not installed. Run: pnpm add sharp -w');
  }
}

async function lockFolder(phaseId: string, heroPath: string): Promise<void> {
  const sharp = await loadSharp();
  const folder = join(ASSETS_ROOT, phaseId, 'walk');
  if (!existsSync(folder)) {
    console.warn(`lockEndFrames: skip ${phaseId} (no walk folder)`);
    return;
  }
  const heroBuf = await sharp(heroPath)
    .resize(1928, 1072, { fit: 'cover', position: 'center' })
    .webp({ quality: 90 })
    .toBuffer();

  const last30Hashes: string[] = [];
  for (let i = 91; i <= 120; i++) {
    const idx = String(i).padStart(3, '0');
    const framePath = join(folder, `${idx}.webp`);
    if (!existsSync(framePath)) continue;
    const alpha = (i - 90) / 30;
    // Use sharp.composite with a per-pixel alpha by piping the hero with
    // its alpha channel set to alpha * 255.
    const heroWithAlpha = await sharp(heroBuf)
      .ensureAlpha(alpha)
      .toBuffer();
    const out = await sharp(framePath)
      .composite([{ input: heroWithAlpha, blend: 'over' }])
      .webp({ quality: 90 })
      .toBuffer();
    require('node:fs').writeFileSync(framePath, out);
    last30Hashes.push(createHash('sha256').update(out).digest('hex').slice(0, 12));
  }

  appendFileSync(LOCKS_FILE, JSON.stringify({
    project: phaseId,
    heroPath,
    lockedAt: new Date().toISOString(),
    last30Hashes,
  }) + '\n');
  console.log(`lockEndFrames: locked ${phaseId} (30 frames blended toward ${heroPath})`);
}

async function main() {
  const args = process.argv.slice(2);
  const targetArg = args.find((a) => a.startsWith('--target='));
  const target = targetArg ? targetArg.slice(9) : undefined;
  const onlyPhase = args.find((a) => !a.startsWith('--'));

  const projects = readdirSync(ASSETS_ROOT).filter((p) => {
    return statSync(join(ASSETS_ROOT, p)).isDirectory()
      && existsSync(join(ASSETS_ROOT, p, 'walk'));
  });
  if (projects.length === 0) {
    console.error('lockEndFrames: no walk folders under assets/projects/.');
    console.error('  Run extractFrames.ts first.');
    process.exit(2);
  }

  for (const phaseId of projects) {
    if (onlyPhase && phaseId !== onlyPhase) continue;
    const heroPath = target ?? join(ASSETS_ROOT, phaseId, 'hero.jpg');
    if (!existsSync(heroPath)) {
      console.warn(`lockEndFrames: skip ${phaseId} (hero not found at ${heroPath})`);
      continue;
    }
    await lockFolder(phaseId, heroPath);
  }
  console.log('lockEndFrames: done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
