#!/usr/bin/env node
/**
 * buildMobile — derive 60-frame walk-mobile/ folders from the 121-frame walk/.
 *
 * On phones:
 * - Bandwidth: cellular often <5 Mbps, full-HD frames are wasteful
 * - Decode budget: weaker GPUs struggle with 1920px webp at 60fps scrub
 * - Storage: 121 × ~150KB = ~18MB per phase × 9 portfolio phases = 162MB
 *
 * Mobile derivation strategy:
 * - Sample every other frame: 121 frames -> 60 frames (frame 0..119 step 2)
 * - Resize to 1280x720 max (cover, preserving aspect)
 * - Quality 85 (down from default ~95)
 *
 * The TourCanvas already detects mobile viewport (matchMedia 768px) and picks
 * phase.mobileFolder which currently aliases to phase.folder. After this
 * script runs, we update specs to point mobileFolder at walk-mobile/ and the
 * canvas's maxFrame uses 59 on mobile. (See `frameUrl` + `preloadWindow`
 * in packages/ui/src/lib/preload.ts.)
 *
 * Usage:
 *   node pipeline/scripts/buildMobile.mjs           # all phases
 *   node pipeline/scripts/buildMobile.mjs tour-01-hotel-jeddah  # one phase
 */
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..', '..');
const ASSETS = join(ROOT, 'assets', 'projects');

const HOME_PHASES = [
  'home-c2-imprint',
  'home-c3-workshop',
  'home-c4-motion',
  'home-c5-kingdom',
];
const PORTFOLIO_PHASES = [
  'tour-01-hotel-jeddah',
  'tour-02-retail-riyadh',
  'tour-03-arena-dammam',
  'tour-04-stadium-riyadh',
  'tour-05-atrium-riyadh',
  'tour-06-cultural-alula',
  'tour-07-plaza-riyadh',
  'tour-08-immersive-riyadh',
  'tour-09-operations',
];
const ALL_PHASES = [...HOME_PHASES, ...PORTFOLIO_PHASES];

const MOBILE_W = 1280;
const MOBILE_H = 720;
const MOBILE_QUALITY = 85;
const MOBILE_FRAME_COUNT = 60; // input idx 0..119 step 2 -> output idx 0..59

const filter = process.argv.slice(2);
const phasesToProcess = filter.length ? filter : ALL_PHASES;

let totalIn = 0;
let totalOut = 0;
const start = Date.now();

for (const phase of phasesToProcess) {
  const inDir = join(ASSETS, phase, 'walk');
  const outDir = join(ASSETS, phase, 'walk-mobile');
  if (!existsSync(inDir)) {
    console.log(`[buildMobile] ${phase}: SKIP (no walk/)`);
    continue;
  }
  const inFiles = (await readdir(inDir)).filter((f) => /^\d{3}\.webp$/.test(f)).sort();
  if (inFiles.length === 0) {
    console.log(`[buildMobile] ${phase}: SKIP (empty)`);
    continue;
  }
  await mkdir(outDir, { recursive: true });
  let written = 0;
  let skipped = 0;
  for (let i = 0; i < MOBILE_FRAME_COUNT; i++) {
    // Map mobile idx i -> source idx 2i (so 0,2,4,...,118)
    const srcIdx = i * 2;
    const srcName = String(srcIdx).padStart(3, '0') + '.webp';
    const srcPath = join(inDir, srcName);
    if (!existsSync(srcPath)) {
      // Fall back to nearest existing source
      // (handle off-by-one in last frame: 119 might be last, not 120)
      const altName = String(Math.min(srcIdx, inFiles.length - 1)).padStart(3, '0') + '.webp';
      const altPath = join(inDir, altName);
      if (!existsSync(altPath)) continue;
    }
    const outName = String(i).padStart(3, '0') + '.webp';
    const outPath = join(outDir, outName);

    // Skip if already up-to-date
    if (existsSync(outPath)) {
      const sIn = await stat(srcPath);
      const sOut = await stat(outPath);
      if (sOut.mtimeMs >= sIn.mtimeMs) { skipped++; continue; }
    }

    try {
      await sharp(srcPath)
        .resize({ width: MOBILE_W, height: MOBILE_H, fit: 'cover', position: 'center' })
        .webp({ quality: MOBILE_QUALITY })
        .toFile(outPath);
      written++;
    } catch (e) {
      console.warn(`[buildMobile] ${phase}/${srcName}: ${e.message}`);
    }
  }
  totalIn += inFiles.length;
  totalOut += written;
  console.log(`[buildMobile] ${phase}: wrote ${written}, skipped ${skipped}`);
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(`[buildMobile] done in ${elapsed}s. ${phasesToProcess.length} phases, ${totalOut} new mobile frames written.`);
