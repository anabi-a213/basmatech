#!/usr/bin/env node
/**
 * record-scroll — record a video of the live tour scroll-through.
 *
 * Screenshots can't show motion in a scroll-locked canvas; you need a video.
 * This script:
 *   1. Launches a headed-or-headless Chromium via Playwright
 *   2. Navigates to the URL passed via argv
 *   3. Auto-scrolls from top to bottom over `--duration` seconds
 *   4. Records the whole session as a webm video
 *   5. Saves to ./pipeline/recordings/{timestamp}.webm
 *
 * Run:
 *   pnpm dlx playwright install --with-deps chromium   # one-time
 *   node pipeline/scripts/record-scroll.mjs https://basmatech-portfolio.vercel.app/ar
 *   node pipeline/scripts/record-scroll.mjs https://basmatech-portfolio.vercel.app/ar --duration=30 --width=1440 --height=900
 *
 * Output: a webm in pipeline/recordings/ that you can drag-drop anywhere
 * (Slack, GitHub PR, file viewer) to see the actual scroll-driven motion.
 */

import { chromium } from 'playwright';
import { mkdirSync, existsSync, renameSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const argv = process.argv.slice(2);
const url = argv.find((a) => /^https?:/.test(a));
if (!url) {
  console.error('usage: node record-scroll.mjs <url> [--duration=20] [--width=1440] [--height=900]');
  process.exit(1);
}
const duration = +(argv.find((a) => a.startsWith('--duration='))?.slice(11) ?? 20);
const width = +(argv.find((a) => a.startsWith('--width='))?.slice(8) ?? 1440);
const height = +(argv.find((a) => a.startsWith('--height='))?.slice(9) ?? 900);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..', '..');
const OUT = join(ROOT, 'recordings');
if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, '-');
const target = join(OUT, `${stamp}.webm`);

console.log(`record-scroll: ${url}`);
console.log(`  viewport ${width}x${height}, duration ${duration}s, output ${target}`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width, height },
  recordVideo: { dir: OUT, size: { width, height } },
});
const page = await context.newPage();

await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
await page.evaluate(() => { document.documentElement.scrollTop = 0; });
await page.waitForTimeout(2000); // hold on foyer

const totalScroll = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
const steps = Math.max(60, duration * 60); // 60fps target
const dwellMs = (duration * 1000) / steps;

console.log(`  scrolling ${totalScroll}px over ${duration}s in ${steps} steps (${dwellMs.toFixed(0)}ms/step)`);

for (let i = 0; i <= steps; i++) {
  const t = i / steps;
  const y = Math.round(t * totalScroll);
  await page.evaluate((y) => { window.scrollTo({ top: y, behavior: 'auto' }); }, y);
  await page.waitForTimeout(dwellMs);
}

await page.waitForTimeout(1500); // hold on closing
const tmpVideo = await page.video();
await context.close();
await browser.close();

if (tmpVideo) {
  const tmpPath = await tmpVideo.path();
  if (tmpPath && existsSync(tmpPath)) {
    renameSync(tmpPath, target);
    console.log(`record-scroll: saved ${target}`);
    console.log(`  open with: file://${target.replace(/\\/g, '/')}`);
  }
}
