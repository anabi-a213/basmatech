/**
 * extractFrames — Phase 2d. Extracts each downloaded MP4 to 121 webp
 * frames at native HD (1928x1072) q90. Uses ffmpeg-static.
 *
 * Input:  pipeline/videos/{phaseId}.mp4
 * Output: assets/projects/{phaseId}/walk/{000..120}.webp
 *
 * Run: pnpm tsx pipeline/scripts/extractFrames.ts [phaseId]
 *      (omit phaseId to extract every video in pipeline/videos/)
 */

import { existsSync, readdirSync, mkdirSync, rmSync } from 'node:fs';
import { join, resolve, basename, extname } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(__dirname, '..', '..');
const VIDEOS_ROOT = join(ROOT, 'pipeline', 'videos');
const ASSETS_ROOT = join(ROOT, 'assets', 'projects');

function ffmpegPath(): string {
  // ffmpeg-static exposes a default export with the binary path.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const ffmpeg: string = require('ffmpeg-static');
  if (!ffmpeg) throw new Error('ffmpeg-static returned no path. Run: pnpm install');
  return ffmpeg;
}

function extractOne(mp4: string, phaseId: string): number {
  const ff = ffmpegPath();
  const outDir = join(ASSETS_ROOT, phaseId, 'walk');
  if (existsSync(outDir)) rmSync(outDir, { recursive: true, force: true });
  mkdirSync(outDir, { recursive: true });
  const args = [
    '-y', '-i', mp4, '-vsync', '0', '-vf', 'fps=24',
    '-c:v', 'libwebp', '-quality', '90', '-compression_level', '4',
    join(outDir, '%03d.webp'),
  ];
  const r = spawnSync(ff, args, { stdio: 'inherit' });
  if (r.status !== 0) throw new Error(`ffmpeg failed for ${phaseId} (exit ${r.status})`);
  const written = readdirSync(outDir).filter((f) => f.endsWith('.webp')).length;
  return written;
}

async function main() {
  const target = process.argv[2];
  if (!existsSync(VIDEOS_ROOT)) {
    console.error(`extractFrames: missing ${VIDEOS_ROOT}.`);
    console.error('  Phase 2c (runKling) must download MP4s here first.');
    process.exit(2);
  }

  const mp4s = readdirSync(VIDEOS_ROOT).filter((f) => extname(f) === '.mp4');
  if (mp4s.length === 0) {
    console.error(`extractFrames: no MP4 files under ${VIDEOS_ROOT}`);
    process.exit(2);
  }

  for (const mp4 of mp4s) {
    const phaseId = basename(mp4, '.mp4');
    if (target && phaseId !== target) continue;
    const fullPath = join(VIDEOS_ROOT, mp4);
    console.log(`extractFrames: ${phaseId} → ${ASSETS_ROOT}/${phaseId}/walk/`);
    const n = extractOne(fullPath, phaseId);
    console.log(`  wrote ${n} frames.`);
  }
  console.log('extractFrames: done.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
